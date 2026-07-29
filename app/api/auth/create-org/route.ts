import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    const { userId, agencyName, firstName, lastName, phone } = await request.json()

    if (!userId || !agencyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use service role key if available, otherwise anon (works because create_organisation_for_user is security definer)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: { getAll: () => [], setAll: () => {} },
      }
    )

    const { data: orgId, error } = await supabase.rpc('create_organisation_for_user', {
      p_user_id:         userId,
      p_org_name:        agencyName,
      p_first_name:      firstName ?? null,
      p_last_name:       lastName  ?? null,
      p_phone:           phone     ?? null,
      p_stripe_customer: null,
    })

    if (error) {
      console.error('[create-org]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orgId })
  } catch (err) {
    console.error('[create-org] unexpected error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
