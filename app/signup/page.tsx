'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, ArrowRight, Phone } from 'lucide-react'

const ACCENT = '#4361ee'
const ACCENT_LIGHT = '#4361ee18'
const HAIRLINE = '#e5e7eb'
const INK = '#64748b'
const F = `system-ui, -apple-system, 'Segoe UI', Arial, sans-serif`

const plans = [
  {
    name: 'Small',
    price: 'A$349',
    period: '/mo',
    tagline: 'Perfect for solo agents and small boutique agencies.',
    hi: false,
    badge: null,
    features: [
      'Up to 5 users',
      'Contacts & leads CRM',
      'Listings management',
      'Open home check-in (mobile)',
      'Pipeline & deals tracker',
      'Tasks & calendar',
      'AML / KYC checks',
      'Email & chat support',
    ],
  },
  {
    name: 'Medium',
    price: 'A$449',
    period: '/mo',
    tagline: 'The full platform for growing real estate agencies.',
    hi: true,
    badge: 'Most Popular',
    features: [
      'Up to 15 users',
      'Everything in Small',
      'Property management module',
      'Trust accounting',
      'Licence & CPD register',
      'Policies & procedures library',
      'AI Chief of Staff',
      'Portal integrations (REA, Domain)',
      'Priority phone & chat support',
    ],
  },
  {
    name: 'Large',
    price: 'A$549',
    period: '/mo',
    tagline: 'For large agencies, groups, and growing teams.',
    hi: false,
    badge: null,
    features: [
      'Unlimited users',
      'Everything in Medium',
      'Multi-office dashboard',
      'Custom integrations & API',
      'Dedicated account manager',
      'Advanced analytics & reporting',
      'SLA guarantee',
      'On-site onboarding & training',
    ],
  },
]

export default function SignupPage() {
  const [selected, setSelected] = useState<string | null>('Pro')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: F }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 48px',
        background: '#fff', borderBottom: `1px solid ${HAIRLINE}`,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>Real Platform</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/login/real-estate"
            style={{ fontSize: 12, fontWeight: 500, color: INK, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')}
            onMouseLeave={e => (e.currentTarget.style.color = INK)}>
            Already have an account? Sign in
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{
        paddingTop: 'clamp(90px,12vh,120px)',
        paddingBottom: 'clamp(60px,8vh,100px)',
        paddingLeft: 'clamp(24px,6vw,80px)',
        paddingRight: 'clamp(24px,6vw,80px)',
      }}>
        {/* Header */}
        <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, marginBottom: 10 }}>
                Choose your plan
              </p>
              <h1 style={{ fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.02em', color: '#0f172a' }}>
                Start your 14-day free trial
              </h1>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: INK, maxWidth: 340 }}>
              No lock-in contracts. Cancel anytime. All plans include full access from day one.
            </p>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          maxWidth: 1100, margin: '0 auto 40px',
        }}>
          {plans.map(plan => {
            const isSelected = selected === plan.name

            return (
              <div
                key={plan.name}
                onClick={() => setSelected(plan.name)}
                style={{
                  position: 'relative',
                  display: 'flex', flexDirection: 'column',
                  padding: '28px 24px',
                  background: '#fff',
                  border: isSelected
                    ? `2px solid ${ACCENT}`
                    : plan.hi ? `1.5px solid ${ACCENT}40` : `1.5px solid ${HAIRLINE}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'border-color .2s, box-shadow .2s',
                  boxShadow: isSelected ? `0 0 0 4px ${ACCENT_LIGHT}` : plan.hi ? '0 4px 20px rgba(67,97,238,0.08)' : 'none',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}60` }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = plan.hi ? `${ACCENT}40` : HAIRLINE }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    width: 22, height: 22, background: ACCENT, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={12} style={{ color: '#fff' }} />
                  </div>
                )}

                {plan.badge && (
                  <span style={{
                    display: 'inline-block', alignSelf: 'flex-start',
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: ACCENT, background: ACCENT_LIGHT,
                    padding: '3px 8px', borderRadius: 20, marginBottom: 14,
                  }}>
                    {plan.badge}
                  </span>
                )}

                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: plan.hi ? ACCENT : INK, marginBottom: 10 }}>
                  {plan.name}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-1px', color: '#0f172a' }}>
                    {plan.price}
                  </span>
                  {plan.period && <span style={{ fontSize: 12, color: INK }}>{plan.period}</span>}
                </div>

                <p style={{ fontSize: 12, color: INK, lineHeight: 1.6, marginBottom: 20 }}>{plan.tagline}</p>

                <div style={{ height: 1, background: HAIRLINE, marginBottom: 18 }} />

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 9, fontSize: 12, color: '#374151' }}>
                      <Check size={11} style={{ color: plan.hi ? ACCENT : '#22c55e', flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA row */}
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            {selected ? (
              <p style={{ fontSize: 13, color: INK }}>
                Selected: <span style={{ color: '#0f172a', fontWeight: 700 }}>{selected}</span>
                {selected !== 'Enterprise' && (
                  <span style={{ color: INK }}> — {plans.find(p => p.name === selected)?.price}/mo</span>
                )}
                <span style={{ color: '#22c55e', fontWeight: 600 }}> · 14-day free trial</span>
              </p>
            ) : (
              <p style={{ fontSize: 13, color: INK }}>Select a plan to continue</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link
              href={selected ? `/signup/register?plan=${selected.toLowerCase()}` : '#'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', fontSize: 12, fontWeight: 700,
                background: selected ? ACCENT : '#e2e8f0',
                color: selected ? '#fff' : '#94a3b8',
                borderRadius: 8, textDecoration: 'none', transition: 'opacity .2s',
                pointerEvents: selected ? 'auto' : 'none',
              }}
              onMouseEnter={e => { if (selected) (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              Get started with {selected ?? 'a plan'} <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
