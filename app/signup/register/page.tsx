'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { ArrowRight, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ACCENT = '#4361ee'
const HAIRLINE = '#e5e7eb'
const INK = '#64748b'
const F = `system-ui, -apple-system, 'Segoe UI', Arial, sans-serif`

const PLAN_INFO: Record<string, { label: string; price: string; trial: string }> = {
  starter: { label: 'Starter', price: '$149/mo', trial: '14-day free trial' },
  pro:     { label: 'Pro',     price: '$349/mo', trial: '14-day free trial' },
}

const AU_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT']

function Field({
  label, type = 'text', value, onChange, placeholder, hint, required = true,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)
  const isPass = type === 'password'

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: focused ? ACCENT : '#374151', marginBottom: 8, transition: 'color .2s',
      }}>
        {label}{required && <span style={{ color: ACCENT, marginLeft: 2 }}>*</span>}
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
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: INK, padding: 4 }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint && <p style={{ fontSize: 11, color: INK, marginTop: 5 }}>{hint}</p>}
    </div>
  )
}

function Steps({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 3, flex: 1, borderRadius: 99,
          background: i <= current ? ACCENT : HAIRLINE,
          transition: 'background .3s',
        }} />
      ))}
      <span style={{ fontSize: 11, color: INK, marginLeft: 6, whiteSpace: 'nowrap' }}>
        Step {current + 1} of {total}
      </span>
    </div>
  )
}

function RegisterForm() {
  const params = useSearchParams()
  const router = useRouter()
  const plan = params.get('plan') ?? 'pro'
  const planInfo = PLAN_INFO[plan] ?? PLAN_INFO['pro']

  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Step 1 — personal
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')

  // Step 2 — agency
  const [agencyName, setAgencyName] = useState('')
  const [state,      setState]      = useState('NSW')

  const validateStep1 = () => {
    if (!firstName || !email || !password || !confirm) { setError('Please fill in all required fields.'); return false }
    if (password !== confirm) { setError('Passwords do not match.'); return false }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return false }
    setError(''); return true
  }

  const validateStep2 = () => {
    if (!agencyName) { setError('Please enter your agency name.'); return false }
    setError(''); return true
  }

  const next = () => {
    if (step === 0 && !validateStep1()) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => { setError(''); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // 1. Create the Supabase auth user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            agency_name: agencyName,
            state,
            plan,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      const userId = signUpData.user?.id
      if (!userId) { setError('Something went wrong. Please try again.'); setLoading(false); return }

      // 2. Create a Stripe Checkout session via our API
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userId,
          email,
          firstName,
          lastName,
          phone,
          agencyName,
          state,
        }),
      })

      const { url, error: checkoutError } = await res.json()

      if (checkoutError || !url) {
        // Stripe not configured yet — go straight to dashboard in dev mode
        console.warn('Stripe not configured, skipping payment:', checkoutError)

        // Create the org directly (dev mode)
        await fetch('/api/auth/create-org', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, agencyName, firstName, lastName, phone }),
        })

        window.location.href = '/dashboard'
        return
      }

      // 3. Redirect to Stripe Checkout
      window.location.href = url

    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: F }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 48px', background: '#fff', borderBottom: `1px solid ${HAIRLINE}`,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>Real Platform</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: INK }}>Signing up for</span>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
            padding: '4px 10px', background: ACCENT, color: '#fff', borderRadius: 20,
          }}>{planInfo.label}</span>
          <Link href="/signup" style={{ fontSize: 12, color: INK, textDecoration: 'none', marginLeft: 8 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')}
            onMouseLeave={e => (e.currentTarget.style.color = INK)}>
            Change plan
          </Link>
        </div>
      </nav>

      {/* Two-column layout */}
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, padding: 'clamp(90px,12vh,120px) clamp(24px,4vw,48px) 80px', alignItems: 'start' }}>

        {/* Left: Form */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${HAIRLINE}`, padding: 'clamp(32px,4vw,48px)' }}>

          {/* ── Step 1: Personal details ── */}
          {step === 0 && (
            <div>
              <Steps current={0} total={2} />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>
                Personal information
              </p>
              <h1 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: 36 }}>
                Let's get you set up.
              </h1>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <Field label="First name"  value={firstName} onChange={setFirstName} placeholder="Jane" />
                <Field label="Last name"   value={lastName}  onChange={setLastName}  placeholder="Smith" required={false} />
              </div>
              <Field label="Work email"    value={email}     onChange={setEmail}     placeholder="jane@agency.com.au" type="email" />
              <Field label="Mobile phone"  value={phone}     onChange={setPhone}     placeholder="+61 4XX XXX XXX" type="tel" required={false} />
              <Field label="Password"      value={password}  onChange={setPassword}  type="password" hint="Minimum 8 characters." />
              <Field label="Confirm password" value={confirm} onChange={v => { setConfirm(v); setError('') }} type="password" />

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: '#ef4444' }}>{error}</p>
                </div>
              )}

              <button onClick={next} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', fontSize: 13, fontWeight: 700,
                background: ACCENT, color: '#fff', border: 'none', borderRadius: 8,
                cursor: 'pointer', transition: 'opacity .2s', marginTop: 8,
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                Continue <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* ── Step 2: Agency details + submit ── */}
          {step === 1 && (
            <div>
              <Steps current={1} total={2} />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>
                Agency information
              </p>
              <h1 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: 36 }}>
                About your agency.
              </h1>

              <Field
                label="Agency / company name"
                value={agencyName}
                onChange={setAgencyName}
                placeholder="Apex Real Estate Pty Ltd"
              />

              {/* State selector */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151', marginBottom: 10 }}>
                  State
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AU_STATES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setState(s)}
                      style={{
                        padding: '8px 16px', fontSize: 12, fontWeight: state === s ? 700 : 400,
                        background: state === s ? ACCENT : '#fff',
                        color: state === s ? '#fff' : INK,
                        border: `1.5px solid ${state === s ? ACCENT : HAIRLINE}`,
                        borderRadius: 6, cursor: 'pointer', transition: 'all .15s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: '#ef4444' }}>{error}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={back} disabled={loading} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '13px 20px', fontSize: 13, fontWeight: 600,
                  background: '#fff', color: INK, border: `1.5px solid ${HAIRLINE}`,
                  borderRadius: 8, cursor: 'pointer', transition: 'border-color .2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#94a3b8')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = HAIRLINE)}>
                  <ArrowLeft size={14} /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 28px', fontSize: 13, fontWeight: 700,
                  background: loading ? '#94a3b8' : ACCENT, color: '#fff',
                  border: 'none', borderRadius: 8,
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity .2s',
                }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                  {loading ? 'Creating your account…' : <>{planInfo.price} — Start Free Trial <ArrowRight size={14} /></>}
                </button>
              </div>

              <p style={{ fontSize: 11, color: INK, marginTop: 16, lineHeight: 1.7 }}>
                By signing up you agree to our{' '}
                <Link href="/" style={{ color: ACCENT, textDecoration: 'none' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/" style={{ color: ACCENT, textDecoration: 'none' }}>Privacy Policy</Link>.
                {' '}Your 14-day free trial starts today. Cancel any time.
              </p>
            </div>
          )}
        </div>

        {/* Right: Order summary */}
        <div style={{ position: 'sticky', top: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${HAIRLINE}`, padding: 28, marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK, marginBottom: 16 }}>
              Your plan
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-1px' }}>
                {planInfo.price.replace('/mo', '')}
              </span>
              <span style={{ fontSize: 13, color: INK }}>/mo</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 20 }}>
              Real Platform {planInfo.label}
            </p>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>✓ 14-day free trial</p>
              <p style={{ fontSize: 11, color: '#15803d', marginTop: 2 }}>No charge until trial ends. Cancel any time.</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Full access from day one',
                'Add your team — free',
                'All compliance modules',
                'Cancel any time',
              ].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#374151' }}>
                  <Check size={12} style={{ color: ACCENT, flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 20px', border: `1px solid ${HAIRLINE}` }}>
            <p style={{ fontSize: 11, color: INK, lineHeight: 1.7 }}>
              Questions? Email{' '}
              <a href="mailto:hello@realplatform.com.au" style={{ color: ACCENT, textDecoration: 'none' }}>
                hello@realplatform.com.au
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ background: '#f8fafc', minHeight: '100vh' }} />}>
      <RegisterForm />
    </Suspense>
  )
}
