'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

const YELLOW = '#FFD940'
const GREEN  = '#22c55e'
const INK    = '#5a5a5f'
const INTER  = `'Inter', Arial, sans-serif`
const GRAIN  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const PHOTO  = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1400&q=80'

const perks = [
  'See all jobs you\'re assigned to',
  'View site guidelines and safety requirements',
  'Track documents you need to submit',
  'Get notified when your certs are expiring',
  'Connect directly with your builder\'s PM',
]

export default function ContractorLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused]   = useState('')
  const [loading, setLoading]   = useState(false)

  const inputStyle = (f: string): React.CSSProperties => ({
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: `1px solid ${focused === f ? GREEN : '#d0d0d0'}`,
    color: '#000', fontFamily: INTER, fontSize: 15, fontWeight: 300,
    padding: '14px 0', outline: 'none', transition: 'border-color .3s',
  })

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/contractor'), 600)
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', fontFamily: INTER }}>

      {/* ── Left panel: photo + branding ── */}
      <div
        className="login-left"
        style={{
          width: '50%', position: 'relative',
          display: 'none', flexDirection: 'column', justifyContent: 'space-between',
          padding: 'clamp(28px,3.5vw,48px)',
          overflow: 'hidden',
        }}
      >
        {/* Photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${PHOTO}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.92) 100%)',
        }} />
        {/* Grain */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: GRAIN, opacity: 0.22, mixBlendMode: 'overlay' as const,
        }} />

        {/* Top: logo + back */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: INTER, letterSpacing: '-0.3px' }}>
              Briesa
            </span>
          </Link>
          <Link href="/login" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 10, fontWeight: 500, letterSpacing: '2px',
            textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.45)',
            textDecoration: 'none', transition: 'color .3s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
          >
            <ArrowLeft size={11} /> All portals
          </Link>
        </div>

        {/* Bottom: headline + perks */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 460 }}>
          <div style={{ width: 32, height: 1, background: GREEN, marginBottom: 20 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.45)', fontFamily: INTER }}>
              Contractor Portal
            </p>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase' as const, padding: '4px 8px',
              background: GREEN, color: '#fff', fontFamily: INTER,
            }}>Free</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 900,
            textTransform: 'uppercase' as const, lineHeight: 0.92,
            color: '#fff', marginBottom: 20, fontFamily: INTER,
          }}>
            YOUR JOBS.<br />YOUR DOCS.<br />
            <span style={{ color: GREEN }}>ALL IN ONE PLACE.</span>
          </h1>
          <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', marginBottom: 32, fontFamily: INTER }}>
            Your builder uses Briesa to manage compliance. Log in to see your assigned jobs, site guidelines and required documents.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {perks.map(p => (
              <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)', fontFamily: INTER }}>
                <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0, marginTop: 1 }} />{p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right panel: login form ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px clamp(32px,5vw,72px)',
        background: '#fafaf8', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile header */}
          <div className="login-mobile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#000', fontFamily: INTER }}>
                Briesa
              </span>
            </Link>
            <Link href="/login" style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 10, fontWeight: 500, letterSpacing: '2px',
              textTransform: 'uppercase' as const, color: '#aaa',
              textDecoration: 'none', fontFamily: INTER,
            }}>
              <ArrowLeft size={11} /> All portals
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ width: 32, height: 1, background: GREEN, marginBottom: 14 }} />
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase' as const, color: GREEN,
              marginBottom: 12, fontFamily: INTER,
            }}>Contractor Portal</p>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase' as const, color: '#000', lineHeight: 0.95, fontFamily: INTER }}>
              WELCOME<br />BACK
            </h2>
            <p style={{ fontSize: 13, fontWeight: 300, color: INK, marginTop: 10, fontFamily: INTER }}>
              Sign in to view your jobs and documents
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase' as const, color: INK,
                display: 'block', marginBottom: 4, fontFamily: INTER,
              }}>Email</label>
              <input
                type="email"
                placeholder="pete@yourcompany.com.au"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                style={inputStyle('email')}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '2px',
                  textTransform: 'uppercase' as const, color: INK, fontFamily: INTER,
                }}>Password</label>
                <button type="button" style={{ fontSize: 11, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: INTER }}>
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                style={inputStyle('password')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '16px 0', fontSize: 10, fontWeight: 700,
                letterSpacing: '2px', textTransform: 'uppercase' as const,
                background: loading ? '#b5a030' : GREEN,
                color: '#fff', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: INTER, transition: 'opacity .3s',
              }}
            >
              {loading ? 'Signing in…' : <><span>Sign in</span> <ArrowRight size={14} /></>}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: 12, textAlign: 'center', color: '#aaa', fontFamily: INTER }}>
              Don't have an account? Ask your builder to invite you, or{' '}
              <Link href="/login" style={{ fontWeight: 700, color: '#000', textDecoration: 'none', fontFamily: INTER }}>
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .login-left         { display: flex !important; }
          .login-mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  )
}
