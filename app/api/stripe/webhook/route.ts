import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

// Supabase service role — only needed in server-side webhook context.
// We use the anon key here and call the RPC via security definer function.
function createSupabaseServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || stripeKey === 'sk_test_REPLACE_ME') {
    return NextResponse.json({ received: true })
  }

  const stripe = new Stripe(stripeKey)
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata ?? {}

    const userId      = meta.user_id
    const agencyName  = meta.agency_name ?? 'My Agency'
    const firstName   = meta.first_name
    const lastName    = meta.last_name
    const phone       = meta.phone
    const plan        = meta.plan ?? 'pro'
    const customerId  = session.customer as string
    const subscriptionId = session.subscription as string

    if (!userId) {
      console.error('[webhook] no user_id in metadata')
      return NextResponse.json({ received: true })
    }

    const supabase = createSupabaseServiceClient()

    // Create org and super_admin profile
    const { data: orgId, error: orgError } = await supabase.rpc('create_organisation_for_user', {
      p_user_id:         userId,
      p_org_name:        agencyName,
      p_first_name:      firstName ?? null,
      p_last_name:       lastName  ?? null,
      p_phone:           phone     ?? null,
      p_stripe_customer: customerId,
    })

    if (orgError) {
      console.error('[webhook] create_organisation_for_user failed', orgError)
    }

    // Update org with subscription info
    if (orgId) {
      await supabase
        .from('organisations')
        .update({
          stripe_subscription_id: subscriptionId,
          plan,
          subscription_status: 'trialing',
        })
        .eq('id', orgId)
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const status = sub.status  // active | trialing | past_due | canceled | etc.
    const customerId = sub.customer as string

    const supabase = createSupabaseServiceClient()
    await supabase
      .from('organisations')
      .update({ subscription_status: status })
      .eq('stripe_customer_id', customerId)
  }

  return NextResponse.json({ received: true })
}
