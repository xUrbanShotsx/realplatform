import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'

const PRICE_MAP: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro:     process.env.STRIPE_PRICE_PRO,
}

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey === 'sk_test_REPLACE_ME') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 200 })
  }

  try {
    const body = await request.json()
    const { plan, userId, email, firstName, lastName, phone, agencyName, state } = body

    const priceId = PRICE_MAP[plan as string]
    if (!priceId || priceId === 'price_REPLACE_ME') {
      return NextResponse.json({ error: 'Stripe price not configured' }, { status: 200 })
    }

    const stripe = new Stripe(stripeKey)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          user_id: userId,
          agency_name: agencyName,
          first_name: firstName,
          last_name: lastName,
          phone: phone ?? '',
          state: state ?? 'NSW',
          plan,
        },
      },
      metadata: {
        user_id: userId,
        agency_name: agencyName,
        plan,
      },
      success_url: `${appUrl}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/signup/register?plan=${plan}&cancelled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
