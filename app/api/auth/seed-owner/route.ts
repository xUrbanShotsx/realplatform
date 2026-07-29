import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// One-time owner account creation endpoint.
// DELETE this file after first use.
// Call: /api/auth/seed-owner?secret=rp-seed-2026&email=...&password=...&firstName=...&orgName=...

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  if (searchParams.get('secret') !== 'rp-seed-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email     = searchParams.get('email')
  const password  = searchParams.get('password')
  const firstName = searchParams.get('firstName') ?? 'Owner'
  const orgName   = searchParams.get('orgName')   ?? 'My Agency'

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set in environment' }, { status: 500 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // ── 1. Create or find the auth user ──────────────────────────────────────
  let userId: string | undefined

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createErr) {
    if (!createErr.message.toLowerCase().includes('already been registered')) {
      return NextResponse.json({ error: createErr.message }, { status: 500 })
    }
    // User already exists — look them up
    const { data: { users } } = await admin.auth.admin.listUsers()
    userId = users.find(u => u.email === email)?.id
  } else {
    userId = created?.user?.id
  }

  if (!userId) {
    return NextResponse.json({ error: 'Could not resolve user ID' }, { status: 500 })
  }

  // ── 2. Check for existing profile / org ──────────────────────────────────
  const { data: existing } = await admin
    .from('user_profiles')
    .select('org_id')
    .eq('user_id', userId)
    .single()

  let orgId: string | undefined = existing?.org_id

  if (!orgId) {
    // ── 3. Create org via RPC ───────────────────────────────────────────────
    const { data: newOrgId, error: rpcErr } = await admin.rpc('create_organisation_for_user', {
      p_user_id:   userId,
      p_org_name:  orgName,
      p_first_name: firstName,
    })
    if (rpcErr) return NextResponse.json({ error: rpcErr.message }, { status: 500 })
    orgId = newOrgId as string
  }

  // ── 4. Set plan = large, subscription = active (free override) ───────────
  await admin
    .from('organisations')
    .update({ plan: 'large', subscription_status: 'active' })
    .eq('id', orgId)

  // ── 5. Make sure user role is super_admin ────────────────────────────────
  await admin
    .from('user_profiles')
    .update({ role: 'super_admin' })
    .eq('user_id', userId)

  return NextResponse.json({
    ok: true,
    message: `Account ready. Log in at /login/real-estate with ${email}`,
    userId,
    orgId,
  })
}
