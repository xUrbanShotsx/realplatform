'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, ArrowRight, Shield, Zap, Building2, Phone } from 'lucide-react'

const YELLOW = '#FFD940'
const HAIRLINE = '#1e1e1e'
const INK = '#5a5a5f'
const INTER = `'Inter', Arial, sans-serif`

const plans = [
  {
    name: 'Starter',
    price: '$349',
    period: '/mo',
    tagline: 'Everything you need to get compliance under control.',
    icon: Shield,
    hi: false,
    badge: null,
    features: [
      'Up to 15 users',
      'Core compliance modules',
      'Incident & hazard tracking',
      'Contractor management',
      'Document storage (10 GB)',
      'Pre-built inspection forms',
      'Training records',
      'Email & chat support',
    ],
  },
  {
    name: 'Professional',
    price: '$489',
    period: '/mo',
    tagline: 'The full platform for growing compliance teams.',
    icon: Zap,
    hi: true,
    badge: 'Most Popular',
    features: [
      'Up to 50 users',
      'All compliance modules',
      'AI SWMS & document generator',
      'Build management portal',
      'Contractor portal access',
      'Document storage (50 GB)',
      'Custom inspection forms',
      'KPI dashboards',
      'Priority phone & chat support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'Tailored for large organisations and multi-site operations.',
    icon: Building2,
    hi: false,
    badge: null,
    features: [
      'Unlimited users & sites',
      'Custom integrations & API',
      'Dedicated account manager',
      'White-label options',
      'SLA guarantee',
      'On-site onboarding & training',
      'Advanced analytics',
      'Bespoke reporting',
      'Single sign-on (SSO)',
    ],
  },
]

export default function SignupPage() {
  const [selected, setSelected] = useState<string | null>('Professional')

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: INTER }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 48px',
        background: '#fff', borderBottom: '1px solid #e8e8e8',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#000', fontFamily: INTER, letterSpacing: '-0.3px' }}>Briesa</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/pricing" style={{ fontSize: 10, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' as const, color: INK, textDecoration: 'none', fontFamily: INTER }}
            onMouseEnter={e => (e.currentTarget.style.color = '#000')}
            onMouseLeave={e => (e.currentTarget.style.color = INK)}>
            Compare plans
          </Link>
          <Link href="/login" style={{ fontSize: 10, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' as const, color: INK, textDecoration: 'none', fontFamily: INTER }}
            onMouseEnter={e => (e.currentTarget.style.color = '#000')}
            onMouseLeave={e => (e.currentTarget.style.color = INK)}>
            Already have an account? Log in
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{
        paddingTop: 'clamp(100px,13vh,130px)',
        paddingBottom: 'clamp(60px,8vh,100px)',
        paddingLeft: 'clamp(24px,7vw,100px)',
        paddingRight: 'clamp(24px,7vw,100px)',
      }}>
        {/* Header */}
        <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 52 }}>
          <p style={{ fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: INTER }}>
            Step 1 of 2 — Choose your plan
          </p>
          <div style={{ width: 28, height: 1, background: YELLOW, marginBottom: 20 }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 20 }}>
            <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, textTransform: 'uppercase' as const, lineHeight: 0.92, letterSpacing: '-1px', color: '#fff', fontFamily: INTER }}>
              Select your<br /><em style={{ fontStyle: 'normal', color: YELLOW }}>plan.</em>
            </h1>
            <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.75, color: INK, maxWidth: 340, fontFamily: INTER }}>
              No lock-in contracts. Switch plans any time. All plans include full access from day one.
            </p>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 2,
          maxWidth: 1100, margin: '0 auto 40px',
        }}>
          {plans.map(plan => {
            const Icon = plan.icon
            const isSelected = selected === plan.name
            const isHi = plan.hi

            return (
              <div
                key={plan.name}
                onClick={() => setSelected(plan.name)}
                style={{
                  position: 'relative',
                  display: 'flex', flexDirection: 'column',
                  padding: '32px 28px',
                  background: isHi ? '#0d0d0d' : '#000',
                  border: isSelected
                    ? `2px solid ${YELLOW}`
                    : isHi ? `1px solid ${YELLOW}40` : `1px solid ${HAIRLINE}`,
                  cursor: 'pointer',
                  transition: 'border-color .25s',
                  outline: 'none',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#333' }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = isHi ? `${YELLOW}40` : HAIRLINE }}
              >
                {/* Selected tick */}
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    width: 22, height: 22, background: YELLOW,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={13} style={{ color: '#000' }} />
                  </div>
                )}

                {plan.badge && (
                  <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: YELLOW, marginBottom: 14, fontFamily: INTER }}>● {plan.badge}</p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 30, height: 30, border: `1px solid ${isHi ? YELLOW + '50' : '#252525'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={13} style={{ color: isHi ? YELLOW : 'rgba(255,255,255,0.35)' }} />
                  </div>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: isHi ? '#fff' : INK, fontFamily: INTER }}>{plan.name}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 6 }}>
                  <span style={{ fontSize: 'clamp(34px,3.8vw,48px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-1.5px', fontFamily: INTER, color: isHi ? YELLOW : '#fff' }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: 12, fontWeight: 300, color: INK, fontFamily: INTER }}>{plan.period}</span>}
                </div>

                <p style={{ fontSize: 12, fontWeight: 300, color: INK, lineHeight: 1.6, marginBottom: 24, fontFamily: INTER }}>{plan.tagline}</p>

                <div style={{ height: 1, background: isHi ? `linear-gradient(to right,${YELLOW}35,transparent)` : `linear-gradient(to right,#222,transparent)`, marginBottom: 20 }} />

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.6)', fontFamily: INTER }}>
                      <Check size={11} style={{ color: isHi ? YELLOW : '#22c55e', flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA row */}
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 20 }}>
          <div>
            {selected ? (
              <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)', fontFamily: INTER }}>
                Selected: <span style={{ color: '#fff', fontWeight: 600 }}>{selected}</span>
                {selected !== 'Enterprise' && <span style={{ color: INK }}> — {plans.find(p => p.name === selected)?.price}/mo</span>}
              </p>
            ) : (
              <p style={{ fontSize: 13, fontWeight: 300, color: INK, fontFamily: INTER }}>Select a plan to continue</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {selected === 'Enterprise' ? (
              <a href="tel:+61200000000" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', fontSize: 10, fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase' as const, background: YELLOW, color: '#000',
                textDecoration: 'none', fontFamily: INTER,
                transition: 'opacity .25s',
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                <Phone size={13} /> Contact Sales
              </a>
            ) : (
              <Link
                href={selected ? `/signup/register?plan=${selected.toLowerCase()}` : '#'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', fontSize: 10, fontWeight: 700, letterSpacing: '2px',
                  textTransform: 'uppercase' as const,
                  background: selected ? YELLOW : '#1a1a1a',
                  color: selected ? '#000' : '#555',
                  textDecoration: 'none', fontFamily: INTER,
                  transition: 'opacity .25s',
                  pointerEvents: selected ? 'auto' : 'none',
                }}
                onMouseEnter={e => { if (selected) (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Continue with {selected ?? 'a plan'} <ArrowRight size={13} />
              </Link>
            )}
            <Link href="/pricing" style={{ fontSize: 10, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' as const, color: INK, textDecoration: 'none', fontFamily: INTER, transition: 'color .3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = INK)}>
              Compare all features
            </Link>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ padding: '20px clamp(24px,7vw,100px)', borderTop: `1px solid ${HAIRLINE}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 300, color: INK, fontFamily: INTER }}>© 2025 Briesa Pty Ltd · ABN 12 345 678 901</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy', 'Terms', 'Contact'].map(l => (
            <Link key={l} href="/" style={{ fontSize: 10, fontWeight: 300, color: INK, textDecoration: 'none', transition: 'color .3s', fontFamily: INTER }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = INK)}>
              {l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
