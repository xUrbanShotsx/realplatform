import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  const { token, userId, firstName, lastName } = await request.json()

  if (!token || !userId) {
    return NextResponse.json({ error: 'Missing token or userId' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  // Fetch the invite
  const { data: invite, error: inviteError } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (inviteError || !invite) {
    return NextResponse.json({ error: 'Invite not found or expired' }, { status: 404 })
  }

  // Mark invite as accepted
  await supabase
    .from('invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  // Create user profile in the org
  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({
      user_id:    userId,
      org_id:     invite.org_id,
      role:       invite.role,
      email:      invite.email,
      first_name: firstName ?? null,
      last_name:  lastName  ?? null,
    }, { onConflict: 'user_id,org_id' })

  if (profileError) {
    console.error('[invite/accept]', profileError)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
