'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

const YELLOW = '#FFD940'
const INK    = '#5a5a5f'
const INTER  = `'Inter', Arial, sans-serif`
const GRAIN  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const PHOTO  = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80'

const features = [
  'Compliance score & audit readiness',
  'Expiring certificates & licences',
  'Incident & corrective action tracking',
  'Contractor compliance management',
  'Staff training records',
  'Inspection forms & site registers',
]

export default function UserLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused]   = useState('')

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: `1px solid ${focused === name ? YELLOW : '#d0d0d0'}`,
    color: '#000', fontFamily: INTER, fontSize: 15, fontWeight: 300,
    padding: '14px 0', outline: 'none',
    transition: 'border-color .3s',
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: INTER }}>

      {/* ── Left panel: photo + branding ── */}
      <div style={{
        width: '50%', position: 'relative',
        display: 'none',
        flexDirection: 'column', justifyContent: 'space-between',
        padding: 'clamp(32px,4vw,56px)',
      }} className="login-left">
        {/* Photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${PHOTO}')`,
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
        }} />
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%)',
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
            textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none', transition: 'color .3s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            <ArrowLeft size={11} /> All portals
          </Link>
        </div>

        {/* Bottom: headline + features */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 460 }}>
          {/* Gold line */}
          <div style={{ width: 32, height: 1, background: YELLOW, marginBottom: 20 }} />
          <p style={{
            fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase' as const,
            color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontFamily: INTER,
          }}>Client Portal</p>
          <h1 style={{
            fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 900,
            textTransform: 'uppercase' as const, lineHeight: 0.92,
            letterSpacing: '0.5px', color: '#fff', marginBottom: 20, fontFamily: INTER,
          }}>
            COMPLIANCE<br />MADE SIMPLE.<br />
            <span style={{ color: YELLOW }}>AUDIT-READY.</span>
          </h1>
          <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontFamily: INTER }}>
            One platform for WHS, contractor and training compliance — built for Australian businesses.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', fontFamily: INTER }}>
                <CheckCircle2 size={13} style={{ color: YELLOW, flexShrink: 0 }} />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px,6vw,80px) clamp(32px,5vw,72px)',
        background: '#fafaf8',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile logo + back */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }} className="login-mobile-header">
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

          {/* Label */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: YELLOW, marginBottom: 16 }} />
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase' as const, color: YELLOW, marginBottom: 12, fontFamily: INTER,
            }}>Client Portal</p>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase' as const, color: '#000', lineHeight: 0.95, fontFamily: INTER }}>
              WELCOME<br />BACK
            </h2>
            <p style={{ fontSize: 13, fontWeight: 300, color: INK, marginTop: 10, fontFamily: INTER }}>
              Sign in to your compliance dashboard
            </p>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: INK, display: 'block', marginBottom: 4, fontFamily: INTER }}>
                Email Address
              </label>
              <input
                type="email" placeholder="you@company.com.au"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                style={inputStyle('email')}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: INK, fontFamily: INTER }}>Password</label>
                <button style={{ fontSize: 11, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: INTER }}>Forgot?</button>
              </div>
              <input
                type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                style={inputStyle('password')}
              />
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            style={{
              width: '100%', marginTop: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '16px 0', fontSize: 10, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase' as const,
              background: YELLOW, color: '#000', border: 'none',
              cursor: 'pointer', fontFamily: INTER,
              transition: 'opacity .3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Sign in <ArrowRight size={14} />
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
            <span style={{ fontSize: 10, color: '#bbb', letterSpacing: '1px', fontFamily: INTER }}>Demo access</span>
            <div style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            style={{
              width: '100%',
              padding: '14px 0', fontSize: 10, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase' as const,
              background: 'transparent', color: '#000',
              border: '1px solid #d0d0d0', cursor: 'pointer', fontFamily: INTER,
              transition: 'border-color .3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#000')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#d0d0d0')}
          >
            Enter Demo Dashboard
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 24, fontFamily: INTER }}>
            Don't have an account?{' '}
            <button style={{ fontSize: 12, fontWeight: 700, color: '#000', background: 'none', border: 'none', cursor: 'pointer', fontFamily: INTER }}>
              Get Started
            </button>
          </p>
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
