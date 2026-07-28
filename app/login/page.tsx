'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const BG     = '#07070e'
const BG2    = '#0d0d1a'
const BORDER = 'rgba(255,255,255,0.07)'
const ACCENT = '#4361ee'
const ACCENT2= '#6b80f5'
const TEXT   = '#eeeeff'
const TEXT2  = '#8888bb'
const TEXT3  = '#44445a'
const ERROR  = '#f87171'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      // Demo auth: any email + any password grants access
      if (email.trim() && password.trim()) {
        router.push('/dashboard')
      } else {
        setError('Please enter your email and password.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div style={{
      background: BG, minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
    }}>
      {/* Nav strip */}
      <div style={{
        borderBottom: `1px solid ${BORDER}`, padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em' }}>
          <span style={{ color: ACCENT }}>Real</span>
          <span style={{ color: TEXT }}> Platform</span>
        </Link>
        <Link href="/signup" style={{ color: TEXT2, fontSize: 13, textDecoration: 'none' }}>
          No account? <span style={{ color: ACCENT }}>Get started free</span>
        </Link>
      </div>

      {/* Form centered */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{
            color: TEXT, fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em',
            marginBottom: 8,
          }}>
            Welcome back
          </h1>
          <p style={{ color: TEXT2, fontSize: 15, marginBottom: 36 }}>
            Sign in to your Real Platform account
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ color: TEXT2, fontSize: 13, fontWeight: 500 }}>Email address</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@agency.com.au"
                autoFocus
                style={{
                  background: BG2, border: `1px solid ${BORDER}`,
                  color: TEXT, fontSize: 14, padding: '11px 14px',
                  outline: 'none', width: '100%',
                  transition: 'border-color 0.15s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ color: TEXT2, fontSize: 13, fontWeight: 500 }}>Password</label>
                <a href="#" style={{ color: ACCENT, fontSize: 12, textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    background: BG2, border: `1px solid ${BORDER}`,
                    color: TEXT, fontSize: 14, padding: '11px 42px 11px 14px',
                    outline: 'none', width: '100%',
                    transition: 'border-color 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                  onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 0,
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ color: ERROR, fontSize: 13, padding: '10px 14px', background: `${ERROR}18`, border: `1px solid ${ERROR}40` }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? TEXT3 : ACCENT,
                color: '#fff', fontWeight: 700, fontSize: 15,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                padding: '13px 24px', marginTop: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.15s, transform 0.1s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = ACCENT2 }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = ACCENT }}
            >
              {loading ? 'Signing in...' : (<>Sign In <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ color: TEXT3, fontSize: 12, marginTop: 32, textAlign: 'center', lineHeight: 1.6 }}>
            By signing in you agree to our{' '}
            <a href="#" style={{ color: TEXT2, textDecoration: 'none' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: TEXT2, textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
