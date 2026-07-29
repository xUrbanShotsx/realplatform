import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ ok: true })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey === 'sk_test_REPLACE_ME') {
    // Dev mode — assume ok
    return NextResponse.json({ ok: true })
  }

  try {
    const stripe = new Stripe(stripeKey)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'unpaid' || session.mode === 'subscription') {
      // Check if org was created
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => [], setAll: () => {} } }
      )

      const userId = session.metadata?.user_id
      if (userId) {
        const { data } = await supabase
          .from('user_profiles')
          .select('org_id')
          .eq('user_id', userId)
          .single()

        return NextResponse.json({ ok: !!data?.org_id })
      }
    }

    return NextResponse.json({ ok: false })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
