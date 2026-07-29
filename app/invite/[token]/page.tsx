'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ACCENT = '#4361ee'
const HAIRLINE = '#e5e7eb'
const INK = '#64748b'
const F = `system-ui, -apple-system, 'Segoe UI', Arial, sans-serif`

interface InviteData {
  org_id: string
  email: string
  role: string
  org_name: string
  valid: boolean
}

function Field({
  label, type = 'text', value, onChange, placeholder,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151', marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPass && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', background: '#f8fafc',
            border: `1.5px solid ${focused ? ACCENT : HAIRLINE}`,
            borderRadius: 8, color: '#0f172a', fontSize: 15,
            padding: '11px 14px', paddingRight: isPass ? 44 : 14,
            outline: 'none', transition: 'border-color .2s',
            fontFamily: F, boxSizing: 'border-box',
          }}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: INK }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default function InvitePage() {
  const { token } = useParams() as { token: string }
  const router = useRouter()

  const [invite, setInvite] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')

  // Validate the token on mount
  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch(`/api/invite/validate?token=${token}`)
        const data = await res.json()
        setInvite(data)
      } catch {
        setInvite({ org_id: '', email: '', role: '', org_name: '', valid: false })
      } finally {
        setLoading(false)
      }
    }
    validate()
  }, [token])

  const handleJoin = async () => {
    if (!firstName || !password) { setError('Please fill in all fields.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    setSubmitting(true)

    try {
      const supabase = createClient()

      // Sign up with the invite email
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: invite!.email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName },
        },
      })

      if (signUpError) {
        // If user already exists, try signing in instead
        if (signUpError.message.includes('already registered')) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: invite!.email,
            password,
          })
          if (signInError) { setError('This email is already registered. Try signing in with your existing password.'); setSubmitting(false); return }
        } else {
          setError(signUpError.message)
          setSubmitting(false)
          return
        }
      }

      const userId = signUpData?.user?.id
      if (!userId) { setError('Something went wrong. Please try again.'); setSubmitting(false); return }

      // Accept the invite via API (marks it as accepted, creates user_profile)
      const res = await fetch('/api/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId, firstName, lastName }),
      })

      const { error: acceptError } = await res.json()
      if (acceptError) { setError(acceptError); setSubmitting(false); return }

      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: F }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!invite?.valid) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: F, padding: 24 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <XCircle size={48} style={{ color: '#ef4444', marginBottom: 20 }} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Invite link expired</h1>
          <p style={{ fontSize: 14, color: INK, lineHeight: 1.7, marginBottom: 28 }}>
            This invite link has expired or already been used. Ask your team admin to send a new invite.
          </p>
          <Link href="/login/real-estate" style={{ fontSize: 14, color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>
            Sign in instead →
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: F, padding: 24 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <CheckCircle2 size={48} style={{ color: '#16a34a', marginBottom: 20 }} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>You&apos;re in!</h1>
          <p style={{ fontSize: 14, color: INK }}>Taking you to the dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: F, padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>Real Platform</span>
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${HAIRLINE}`, padding: 36 }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'inline-block', background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, borderRadius: 8, padding: '6px 12px', marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>Team Invitation</p>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Join {invite.org_name}
            </h1>
            <p style={{ fontSize: 13, color: INK, lineHeight: 1.6 }}>
              You&apos;ve been invited to join as <strong style={{ color: '#0f172a' }}>{invite.role.replace('_', ' ')}</strong>.
              Your email: <strong style={{ color: '#0f172a' }}>{invite.email}</strong>
            </p>
          </div>

          <div style={{ height: 1, background: HAIRLINE, marginBottom: 24 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field label="First name" value={firstName} onChange={setFirstName} placeholder="Jane" />
            <Field label="Last name"  value={lastName}  onChange={setLastName}  placeholder="Smith" />
          </div>
          <Field label="Password"         value={password} onChange={setPassword} type="password" placeholder="Min. 8 characters" />
          <Field label="Confirm password" value={confirm}  onChange={setConfirm}  type="password" placeholder="Repeat password" />

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>
            </div>
          )}

          <button onClick={handleJoin} disabled={submitting} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px', fontSize: 14, fontWeight: 700,
            background: submitting ? '#94a3b8' : ACCENT, color: '#fff',
            border: 'none', borderRadius: 8,
            cursor: submitting ? 'not-allowed' : 'pointer', transition: 'opacity .2s',
          }}
            onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
            {submitting ? 'Joining…' : <>Join {invite.org_name} <ArrowRight size={14} /></>}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 20 }}>
          Already have an account?{' '}
          <Link href="/login/real-estate" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
