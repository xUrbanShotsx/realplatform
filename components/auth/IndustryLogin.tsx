'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export interface IndustryLoginConfig {
  label: string
  tagline: string
  accent: string
  accentText: string
  photo: string
  dashboard: string
  headline: string[]
  features: string[]
  backHref?: string
}

export function IndustryLogin({
  label, tagline, accent, accentText, photo, dashboard, headline, features, backHref = '/',
}: IndustryLoginConfig) {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleSignIn = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push(dashboard)
    router.refresh()
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email address above first.'); return }
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (err) { setError(err.message); return }
    setResetSent(true)
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: `1.5px solid ${focused === name ? accent : '#d1d5db'}`,
    color: '#111', fontSize: 15, fontWeight: 400,
    padding: '12px 0', outline: 'none',
    transition: 'border-color 200ms ease',
    fontFamily: 'inherit',
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'inherit' }}>

      {/* ── LEFT: Industry branding ───────────────────────────────────────── */}
      <div style={{
        width: '48%', position: 'relative', display: 'none',
        flexDirection: 'column', justifyContent: 'space-between',
        padding: 'clamp(32px,4vw,56px)',
      }} className="login-left">

        {/* Photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${photo}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.88) 100%)',
        }} />

        {/* Top nav */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
              Briesa
            </span>
          </Link>
          <Link href={backHref}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 200ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            <ArrowLeft size={12} /> Back
          </Link>
        </div>

        {/* Bottom content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ width: 28, height: 2, background: accent, marginBottom: 20 }} />
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>
            {tagline}
          </p>
          <h1 style={{ fontSize: 'clamp(30px,3.5vw,50px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.02em', color: '#fff', marginBottom: 20 }}>
            {headline.map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h1>
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
            Sign in to access your full compliance dashboard, tailored for Australian {label.replace('Briesa ', '').toLowerCase()} businesses.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                <CheckCircle2 size={13} style={{ color: accent, flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── RIGHT: Login form ─────────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px,6vw,80px) clamp(32px,5vw,72px)',
        background: '#f9fafb',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }} className="login-mobile-header">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#000', letterSpacing: '-0.3px' }}>
                Briesa
              </span>
            </Link>
            <Link href={backHref} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#9ca3af', textDecoration: 'none' }}>
              <ArrowLeft size={12} /> Back
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ width: 24, height: 2, background: accent, marginBottom: 16 }} />
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, marginBottom: 10 }}>
              {label}
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
              Sign in to your {tagline.toLowerCase()} dashboard
            </p>
          </div>

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input type="email" placeholder="you@company.com.au"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                style={inputStyle('email')} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#64748b' }}>
                  Password
                </label>
                <button onClick={handleForgotPassword} style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {resetSent ? '✓ Reset email sent' : 'Forgot password?'}
                </button>
              </div>
              <input type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                style={inputStyle('password')} />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p style={{ marginTop: 16, fontSize: 12, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: 6 }}>
              {error}
            </p>
          )}

          {/* Sign in button */}
          <button onClick={handleSignIn} disabled={loading}
            style={{
              width: '100%', marginTop: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px 0', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              background: loading ? '#d1d5db' : accent,
              color: loading ? '#9ca3af' : accentText,
              border: 'none', cursor: loading ? 'default' : 'pointer',
              transition: 'opacity 150ms ease',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            {loading ? 'Signing in…' : <>Sign in <ArrowRight size={14} /></>}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ fontSize: 10, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          {/* Demo access */}
          <button onClick={() => router.push(dashboard)}
            style={{
              width: '100%', padding: '13px 0',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.03em',
              background: '#fff', color: '#0f172a',
              border: '1.5px solid #e2e8f0', cursor: 'pointer',
              transition: 'border-color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = accent
              ;(e.currentTarget as HTMLElement).style.background = '#fafafa'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'
              ;(e.currentTarget as HTMLElement).style.background = '#fff'
            }}
          >
            Enter Demo Dashboard →
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>
              Get started
            </Link>
          </p>

          {/* Industry badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '4px 10px', border: `1px solid ${accent}40`,
              color: accent, background: accent + '10',
            }}>
              {label}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .login-left { display: flex !important; }
          .login-mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  )
}
