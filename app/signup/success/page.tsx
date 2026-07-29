'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const ACCENT = '#4361ee'
const F = `system-ui, -apple-system, 'Segoe UI', Arial, sans-serif`

function SuccessContent() {
  const params  = useSearchParams()
  const router  = useRouter()
  const sessionId = params.get('session_id')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (!sessionId) {
      setStatus('ready')
      return
    }

    // Verify the session and confirm the org was created
    // (webhook may still be processing — poll briefly)
    let attempts = 0
    const check = async () => {
      attempts++
      try {
        const res = await fetch(`/api/stripe/verify?session_id=${sessionId}`)
        const data = await res.json()
        if (data.ok || attempts >= 6) {
          setStatus('ready')
        } else {
          setTimeout(check, 1500)
        }
      } catch {
        setStatus('ready')
      }
    }
    check()
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: F }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ fontSize: 14, color: '#64748b' }}>Setting up your account…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: F, padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <CheckCircle2 size={36} style={{ color: '#16a34a' }} />
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 12 }}>
          You&rsquo;re in!
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 36 }}>
          Your Real Platform account is ready. Your 14-day free trial has started — explore everything, no credit card charged yet.
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', fontSize: 14, fontWeight: 700,
            background: ACCENT, color: '#fff', border: 'none',
            borderRadius: 10, cursor: 'pointer', transition: 'opacity .2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
        >
          Go to Dashboard <ArrowRight size={16} />
        </button>

        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 24 }}>
          You&apos;ll receive a confirmation email shortly.
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f8fafc' }} />}>
      <SuccessContent />
    </Suspense>
  )
}
