'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { ArrowRight, ArrowLeft, Eye, EyeOff, Check, Lock, Shield, CreditCard } from 'lucide-react'

const Y    = '#FFD940'
const HL   = '#1e1e1e'
const HL2  = '#2a2a2a'
const INK  = '#5a5a5f'
const F    = `'Inter', Arial, sans-serif`

const PLAN_INFO: Record<string, { label: string; price: string; period: string; features: string[] }> = {
  starter: {
    label: 'Starter',
    price: '$349',
    period: '/mo',
    features: ['Up to 15 users', 'Core compliance modules', 'Incident & hazard tracking', 'Contractor management', 'Document storage (10 GB)', 'Email & chat support'],
  },
  professional: {
    label: 'Professional',
    price: '$489',
    period: '/mo',
    features: ['Up to 50 users', 'All compliance modules', 'AI SWMS & document generator', 'Build management portal', 'Contractor portal access', 'Priority phone & chat support'],
  },
}

// ── Reusable input ────────────────────────────────────────────────────────────
function Field({
  label, type = 'text', value, onChange, placeholder, hint, required = true, maxLength,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; required?: boolean; maxLength?: number
}) {
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)
  const isPass = type === 'password'

  return (
    <div style={{ marginBottom: 28 }}>
      <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: focused ? Y : '#6b6b6b', marginBottom: 10, fontFamily: F, transition: 'color .25s' }}>
        {label}{required && <span style={{ color: Y, marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPass && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', background: 'transparent',
            border: 'none', borderBottom: `1px solid ${focused ? Y : HL2}`,
            color: '#fff', fontSize: 14, fontWeight: 300, fontFamily: F,
            padding: '11px 0', outline: 'none',
            boxSizing: 'border-box' as const,
            transition: 'border-color .25s',
            paddingRight: isPass ? 36 : 0,
          }}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: INK, padding: 4 }}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hint && <p style={{ fontSize: 11, color: INK, marginTop: 6, fontFamily: F }}>{hint}</p>}
    </div>
  )
}

// ── Pill / chip selector ──────────────────────────────────────────────────────
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '11px 18px', fontSize: 12, fontWeight: selected ? 600 : 300,
        fontFamily: F, cursor: 'pointer', transition: 'all .2s',
        background: selected ? Y : 'transparent',
        color: selected ? '#000' : 'rgba(255,255,255,0.6)',
        border: `1px solid ${selected ? Y : HL2}`,
      }}
    >
      {selected && <Check size={11} />}
      {label}
    </button>
  )
}

// ── Priority card ─────────────────────────────────────────────────────────────
function PriorityCard({ label, desc, icon, selected, onClick }: {
  label: string; desc: string; icon: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start',
        textAlign: 'left' as const, padding: '22px 20px', cursor: 'pointer',
        transition: 'all .2s', fontFamily: F,
        background: selected ? 'rgba(255,217,64,0.06)' : '#000',
        border: `1px solid ${selected ? Y : HL}`,
        outline: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        {selected && (
          <div style={{ width: 18, height: 18, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={11} style={{ color: '#000' }} />
          </div>
        )}
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: selected ? '#fff' : 'rgba(255,255,255,0.7)', marginBottom: 5, fontFamily: F }}>{label}</p>
      <p style={{ fontSize: 11, fontWeight: 300, lineHeight: 1.5, color: INK, fontFamily: F }}>{desc}</p>
    </button>
  )
}

// ── Step indicator ────────────────────────────────────────────────────────────
function Steps({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 3,
            background: i <= current ? Y : HL2,
            opacity: i <= current ? 1 : 0.4,
            transition: 'all .3s',
          }} />
        </div>
      ))}
      <span style={{ fontSize: 10, fontWeight: 400, letterSpacing: '2px', color: INK, fontFamily: F, marginLeft: 4 }}>
        Step {current + 1} of {total}
      </span>
    </div>
  )
}

// ── Card number formatter ─────────────────────────────────────────────────────
function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + ' / ' + digits.slice(2)
  return digits
}

// ── Main form ─────────────────────────────────────────────────────────────────
function RegisterForm() {
  const params = useSearchParams()
  const plan = params.get('plan') ?? 'professional'
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const planInfo = PLAN_INFO[plan] ?? PLAN_INFO['professional']

  const [step, setStep] = useState(0)

  // Step 1 — personal
  const [fullName,   setFullName]   = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [password,   setPassword]   = useState('')
  const [confirm,    setConfirm]    = useState('')
  const [passError,  setPassError]  = useState('')

  // Step 2 — company
  const [company,    setCompany]    = useState('')
  const [industry,   setIndustry]   = useState('')
  const [yearsOpen,  setYearsOpen]  = useState('')
  const [employees,  setEmployees]  = useState('')

  // Step 3 — priorities
  const [priorities, setPriorities] = useState<string[]>([])

  // Step 4 — billing
  const [cardName,   setCardName]   = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry,     setExpiry]     = useState('')
  const [cvv,        setCvv]        = useState('')
  const [billingError, setBillingError] = useState('')
  const [submitting, setSubmitting]  = useState(false)

  const industries     = ['Construction & Building', 'Labour Hire & Staffing', 'Manufacturing & Industrial', 'Facilities & Property', 'Mining & Resources', 'Healthcare & Aged Care', 'Other']
  const yearsOptions   = ['Less than 1 year', '1 – 3 years', '3 – 5 years', '5 – 10 years', '10+ years']
  const employeeOptions = ['1 – 10', '11 – 50', '51 – 100', '101 – 250', '251+']

  const priorityOptions = [
    { label: 'Audit readiness',         desc: 'Always be prepared for a compliance inspection.',     icon: '📋' },
    { label: 'Contractor management',   desc: 'Track licences, insurances and inductions.',           icon: '🦺' },
    { label: 'Incident tracking',       desc: 'Log and close hazards and incidents fast.',            icon: '⚠️' },
    { label: 'Reducing admin time',     desc: 'Automate the paperwork and manual processes.',         icon: '⏱️' },
    { label: 'Training & licences',     desc: 'Never miss an expiry across your workforce.',          icon: '🎓' },
    { label: 'AI document generation',  desc: 'Generate SWMS, toolbox talks and reports instantly.',  icon: '⚡' },
    { label: 'Multi-site visibility',   desc: 'See compliance across all sites in one dashboard.',    icon: '🏗️' },
    { label: 'Regulatory reporting',    desc: 'ISO, WHS and industry-specific reporting.',            icon: '📊' },
  ]

  const togglePriority = (label: string) => {
    setPriorities(p =>
      p.includes(label) ? p.filter(x => x !== label) : p.length < 4 ? [...p, label] : p
    )
  }

  const validateStep1 = () => {
    if (!fullName || !email || !phone || !password || !confirm) return false
    if (password !== confirm) { setPassError('Passwords do not match.'); return false }
    if (password.length < 8) { setPassError('Password must be at least 8 characters.'); return false }
    setPassError('')
    return true
  }
  const validateStep2 = () => !!(company && industry && yearsOpen && employees)

  const validateBilling = () => {
    if (!cardName) { setBillingError('Please enter the name on your card.'); return false }
    const digits = cardNumber.replace(/\s/g, '')
    if (digits.length < 16) { setBillingError('Please enter a valid 16-digit card number.'); return false }
    if (!expiry || expiry.replace(/\s/g, '').length < 5) { setBillingError('Please enter a valid expiry date.'); return false }
    if (cvv.length < 3) { setBillingError('Please enter a valid CVV.'); return false }
    setBillingError('')
    return true
  }

  const next = () => {
    if (step === 0 && !validateStep1()) return
    if (step === 1 && !validateStep2()) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const back = () => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handlePay = () => {
    if (!validateBilling()) return
    setSubmitting(true)
    // Simulate processing delay then redirect
    setTimeout(() => {
      window.location.href = '/login/user'
    }, 1800)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${HL2}`, color: '#fff', fontSize: 14,
    fontWeight: 300, fontFamily: F, padding: '11px 0', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: F }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 48px', background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#000', fontFamily: F, letterSpacing: '-0.3px' }}>Briesa</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 300, color: INK, fontFamily: F }}>Signing up for</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, padding: '4px 10px', background: Y, color: '#000', fontFamily: F }}>{planLabel}</span>
          <Link href="/signup" style={{ fontSize: 10, color: INK, textDecoration: 'none', fontFamily: F, marginLeft: 12 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#000')}
            onMouseLeave={e => (e.currentTarget.style.color = INK)}>Change plan</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: 'clamp(100px,14vh,140px) clamp(24px,5vw,0px) 80px' }}>

        {/* ── Step 1: Your Details ── */}
        {step === 0 && (
          <div>
            <Steps current={0} total={4} />
            <p style={{ fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: F }}>Personal information</p>
            <div style={{ width: 28, height: 1, background: Y, marginBottom: 24 }} />
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, textTransform: 'uppercase' as const, lineHeight: 0.92, letterSpacing: '-1px', color: '#fff', marginBottom: 44, fontFamily: F }}>
              Let's get you<br /><em style={{ fontStyle: 'normal', color: Y }}>set up.</em>
            </h1>

            <Field label="Full name"        value={fullName}  onChange={setFullName}  placeholder="Jane Smith" />
            <Field label="Email address"    value={email}     onChange={setEmail}     placeholder="jane@company.com.au" type="email" />
            <Field label="Phone number"     value={phone}     onChange={setPhone}     placeholder="+61 4XX XXX XXX" type="tel" />
            <Field label="Password"         value={password}  onChange={setPassword}  type="password" hint="Minimum 8 characters." />
            <Field label="Confirm password" value={confirm}   onChange={v => { setConfirm(v); setPassError('') }} type="password" />
            {passError && <p style={{ fontSize: 12, color: '#f87171', marginBottom: 20, fontFamily: F, marginTop: -16 }}>{passError}</p>}

            <button onClick={next} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '15px 36px', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, background: Y, color: '#000', border: 'none', cursor: 'pointer', fontFamily: F, transition: 'opacity .25s', marginTop: 8 }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
              Continue <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* ── Step 2: Your Company ── */}
        {step === 1 && (
          <div>
            <Steps current={1} total={4} />
            <p style={{ fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: F }}>Company information</p>
            <div style={{ width: 28, height: 1, background: Y, marginBottom: 24 }} />
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, textTransform: 'uppercase' as const, lineHeight: 0.92, letterSpacing: '-1px', color: '#fff', marginBottom: 44, fontFamily: F }}>
              About your<br /><em style={{ fontStyle: 'normal', color: Y }}>business.</em>
            </h1>

            <div style={{ marginBottom: 36 }}>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#6b6b6b', marginBottom: 10, fontFamily: F }}>Company name <span style={{ color: Y }}>*</span></label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Construction Pty Ltd"
                style={{ ...inputStyle }}
                onFocus={e => (e.currentTarget.style.borderBottomColor = Y)}
                onBlur={e => (e.currentTarget.style.borderBottomColor = HL2)} />
            </div>

            <div style={{ marginBottom: 36 }}>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#6b6b6b', marginBottom: 14, fontFamily: F }}>Industry <span style={{ color: Y }}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {industries.map(ind => (
                  <Chip key={ind} label={ind} selected={industry === ind} onClick={() => setIndustry(ind)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 36 }}>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#6b6b6b', marginBottom: 14, fontFamily: F }}>How long have you been in business? <span style={{ color: Y }}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {yearsOptions.map(y => (
                  <Chip key={y} label={y} selected={yearsOpen === y} onClick={() => setYearsOpen(y)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 44 }}>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#6b6b6b', marginBottom: 14, fontFamily: F }}>Number of employees <span style={{ color: Y }}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {employeeOptions.map(emp => (
                  <Chip key={emp} label={emp} selected={employees === emp} onClick={() => setEmployees(emp)} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '15px 24px', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, background: 'transparent', color: INK, border: `1px solid ${HL2}`, cursor: 'pointer', fontFamily: F, transition: 'all .25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#555'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = HL2; (e.currentTarget as HTMLElement).style.color = INK }}>
                <ArrowLeft size={13} /> Back
              </button>
              <button onClick={next} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '15px 36px', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, background: Y, color: '#000', border: 'none', cursor: 'pointer', fontFamily: F, transition: 'opacity .25s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                Continue <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Compliance Priorities ── */}
        {step === 2 && (
          <div>
            <Steps current={2} total={4} />
            <p style={{ fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: F }}>Your compliance priorities</p>
            <div style={{ width: 28, height: 1, background: Y, marginBottom: 24 }} />
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, textTransform: 'uppercase' as const, lineHeight: 0.92, letterSpacing: '-1px', color: '#fff', marginBottom: 12, fontFamily: F }}>
              What matters<br /><em style={{ fontStyle: 'normal', color: Y }}>most to you?</em>
            </h1>
            <p style={{ fontSize: 13, fontWeight: 300, color: INK, marginBottom: 40, fontFamily: F }}>
              Select up to 4. We'll configure Briesa around your priorities.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 44 }}>
              {priorityOptions.map(p => (
                <PriorityCard
                  key={p.label} label={p.label} desc={p.desc} icon={p.icon}
                  selected={priorities.includes(p.label)}
                  onClick={() => togglePriority(p.label)}
                />
              ))}
            </div>

            {priorities.length > 0 && (
              <p style={{ fontSize: 11, fontWeight: 300, color: INK, marginBottom: 28, fontFamily: F }}>
                {priorities.length} of 4 selected
              </p>
            )}

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '15px 24px', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, background: 'transparent', color: INK, border: `1px solid ${HL2}`, cursor: 'pointer', fontFamily: F, transition: 'all .25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#555'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = HL2; (e.currentTarget as HTMLElement).style.color = INK }}>
                <ArrowLeft size={13} /> Back
              </button>
              <button onClick={next} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '15px 36px', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, background: Y, color: '#000', border: 'none', cursor: 'pointer', fontFamily: F, transition: 'opacity .25s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                Continue to Payment <ArrowRight size={13} />
              </button>
              {priorities.length === 0 && (
                <button onClick={next} style={{ fontSize: 11, fontWeight: 300, color: INK, background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, transition: 'color .3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = INK)}>
                  Skip this step
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Step 4: Payment Details ── */}
        {step === 3 && (
          <div>
            <Steps current={3} total={4} />
            <p style={{ fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: F }}>Subscription payment</p>
            <div style={{ width: 28, height: 1, background: Y, marginBottom: 24 }} />
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, textTransform: 'uppercase' as const, lineHeight: 0.92, letterSpacing: '-1px', color: '#fff', marginBottom: 44, fontFamily: F }}>
              Payment<br /><em style={{ fontStyle: 'normal', color: Y }}>details.</em>
            </h1>

            {/* Order summary */}
            <div style={{ border: `1px solid ${HL2}`, marginBottom: 44, padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: INK, fontFamily: F, marginBottom: 6 }}>Order summary</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: F }}>Briesa {planInfo.label}</p>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: Y, letterSpacing: '-1px', fontFamily: F, lineHeight: 1 }}>{planInfo.price}</span>
                  <span style={{ fontSize: 11, fontWeight: 300, color: INK, fontFamily: F }}>{planInfo.period}</span>
                </div>
              </div>
              <div style={{ height: 1, background: HL, marginBottom: 20 }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                {planInfo.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.5)', fontFamily: F }}>
                    <Check size={10} style={{ color: Y, flexShrink: 0, marginTop: 2 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div style={{ height: 1, background: HL, margin: '20px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 300, color: INK, fontFamily: F }}>Billed monthly · Cancel anytime</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: F }}>
                  GST incl. &nbsp;<span style={{ color: INK, fontWeight: 300 }}>({(parseFloat(planInfo.price.replace('$', '')) * 0.1).toFixed(0)} GST)</span>
                </p>
              </div>
            </div>

            {/* Card fields */}
            <Field
              label="Name on card"
              value={cardName}
              onChange={setCardName}
              placeholder="Jane Smith"
            />

            {/* Card number with icon */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#6b6b6b', marginBottom: 10, fontFamily: F }}>
                Card number <span style={{ color: Y }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  inputMode="numeric"
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${HL2}`, color: '#fff',
                    fontSize: 14, fontWeight: 300, fontFamily: F,
                    padding: '11px 36px 11px 0', outline: 'none',
                    boxSizing: 'border-box' as const, letterSpacing: '2px',
                    transition: 'border-color .25s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = Y)}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = HL2)}
                />
                <CreditCard size={16} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: INK }} />
              </div>
            </div>

            {/* Expiry + CVV */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 44 }}>
              <div>
                <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#6b6b6b', marginBottom: 10, fontFamily: F }}>
                  Expiry date <span style={{ color: Y }}>*</span>
                </label>
                <input
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM / YY"
                  maxLength={7}
                  inputMode="numeric"
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${HL2}`, color: '#fff',
                    fontSize: 14, fontWeight: 300, fontFamily: F,
                    padding: '11px 0', outline: 'none', letterSpacing: '1px',
                    boxSizing: 'border-box' as const,
                    transition: 'border-color .25s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = Y)}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = HL2)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#6b6b6b', marginBottom: 10, fontFamily: F }}>
                  CVV <span style={{ color: Y }}>*</span>
                </label>
                <input
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  inputMode="numeric"
                  type="password"
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${HL2}`, color: '#fff',
                    fontSize: 14, fontWeight: 300, fontFamily: F,
                    padding: '11px 0', outline: 'none',
                    boxSizing: 'border-box' as const,
                    transition: 'border-color .25s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = Y)}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = HL2)}
                />
              </div>
            </div>

            {billingError && (
              <p style={{ fontSize: 12, color: '#f87171', marginBottom: 20, fontFamily: F, marginTop: -24 }}>{billingError}</p>
            )}

            {/* Security badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36, flexWrap: 'wrap' as const }}>
              {[
                { icon: Lock,   label: '256-bit SSL encrypted' },
                { icon: Shield, label: 'PCI DSS compliant' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Icon size={12} style={{ color: INK }} />
                  <span style={{ fontSize: 10, fontWeight: 300, color: INK, fontFamily: F, letterSpacing: '0.5px' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={back} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '15px 24px', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, background: 'transparent', color: INK, border: `1px solid ${HL2}`, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: F, transition: 'all .25s', opacity: submitting ? 0.4 : 1 }}
                onMouseEnter={e => { if (!submitting) { (e.currentTarget as HTMLElement).style.borderColor = '#555'; (e.currentTarget as HTMLElement).style.color = '#fff' } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = HL2; (e.currentTarget as HTMLElement).style.color = INK }}>
                <ArrowLeft size={13} /> Back
              </button>
              <button
                onClick={handlePay}
                disabled={submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '15px 36px', fontSize: 10, fontWeight: 700, letterSpacing: '2px',
                  textTransform: 'uppercase' as const,
                  background: submitting ? '#b89a00' : Y,
                  color: '#000', border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: F, transition: 'opacity .25s',
                  minWidth: 220, justifyContent: 'center',
                }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                {submitting ? (
                  <>Processing…</>
                ) : (
                  <>{planInfo.price}/mo — Start Subscription <ArrowRight size={13} /></>
                )}
              </button>
            </div>

            <p style={{ fontSize: 10, fontWeight: 300, color: INK, marginTop: 20, lineHeight: 1.7, fontFamily: F }}>
              By subscribing you agree to our{' '}
              <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', fontFamily: F }}>Terms of Service</Link>
              {' '}and{' '}
              <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', fontFamily: F }}>Privacy Policy</Link>.
              {' '}Your first charge of <strong style={{ color: '#fff' }}>{planInfo.price}</strong> will occur today. Cancel any time from your account settings.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ background: '#000', minHeight: '100vh' }} />}>
      <RegisterForm />
    </Suspense>
  )
}
