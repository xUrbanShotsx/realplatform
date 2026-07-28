'use client'

import { useState } from 'react'
import { Award, ChevronRight, ChevronLeft, Check, Loader2, FileText, Download, Shield, Leaf, HardHat, CreditCard, Lock, Sparkles, X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type ISOStandard = 'iso9001' | 'iso14001' | 'iso45001' | 'bundle'

interface Standard {
  id: ISOStandard
  name: string
  full: string
  desc: string
  price: number
  icon: typeof Shield
  colour: string
  pages: string
  questions: Question[]
}

interface Question {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'radio'
  options?: string[]
  placeholder?: string
}

// ─── ISO Standards ────────────────────────────────────────────────────────────
const STANDARDS: Standard[] = [
  {
    id: 'iso9001',
    name: 'ISO 9001',
    full: 'Quality Management System',
    desc: 'Internationally recognised QMS framework. Demonstrates your commitment to consistent quality and customer satisfaction.',
    price: 499,
    icon: Shield,
    colour: '#2563eb',
    pages: '45–60',
    questions: [
      { id: 'scope', label: 'Describe your organisation\'s products and/or services', type: 'textarea', placeholder: 'e.g. We provide civil construction services including earthworks, concrete, and drainage...' },
      { id: 'size', label: 'Number of employees', type: 'select', options: ['1–10', '11–50', '51–200', '201–500', '500+'] },
      { id: 'sites', label: 'How many operating locations or sites?', type: 'select', options: ['1', '2–5', '6–15', '16+'] },
      { id: 'customers', label: 'Primary customer types', type: 'select', options: ['Government/Public sector', 'Private enterprise', 'Both', 'End consumers'] },
      { id: 'existing', label: 'Do you have any existing quality procedures documented?', type: 'radio', options: ['None yet', 'Some informal processes', 'Formal procedures in place', 'Partially certified already'] },
      { id: 'nonconformance', label: 'How do you currently manage non-conformances or defects?', type: 'textarea', placeholder: 'Describe your current process...' },
      { id: 'objectives', label: 'What are your top 3 quality objectives?', type: 'textarea', placeholder: 'e.g. Reduce rework by 20%, improve on-time delivery to 95%...' },
      { id: 'risks', label: 'Describe your main business risks', type: 'textarea', placeholder: 'e.g. Supply chain delays, skilled labour shortage...' },
    ],
  },
  {
    id: 'iso14001',
    name: 'ISO 14001',
    full: 'Environmental Management System',
    desc: 'Framework to manage environmental responsibilities. Required by many government tenders and ESG-focused clients.',
    price: 499,
    icon: Leaf,
    colour: '#16a34a',
    pages: '40–55',
    questions: [
      { id: 'activities', label: 'Describe your main business activities that interact with the environment', type: 'textarea', placeholder: 'e.g. Site excavation, fuel storage, waste disposal...' },
      { id: 'size', label: 'Number of employees', type: 'select', options: ['1–10', '11–50', '51–200', '201–500', '500+'] },
      { id: 'waste', label: 'What types of waste does your business generate?', type: 'select', options: ['General waste only', 'Hazardous materials', 'Chemical waste', 'Construction/demolition waste', 'Multiple types'] },
      { id: 'emissions', label: 'Does your business produce air, water, or noise emissions?', type: 'radio', options: ['No significant emissions', 'Air emissions (dust, fumes)', 'Water discharge', 'Noise emissions', 'Multiple types'] },
      { id: 'compliance', label: 'Are there specific environmental regulations that apply to your industry?', type: 'textarea', placeholder: 'e.g. EPA licence conditions, council planning conditions...' },
      { id: 'targets', label: 'What environmental targets do you want to set?', type: 'textarea', placeholder: 'e.g. Reduce landfill waste by 30%, achieve carbon neutrality by 2028...' },
      { id: 'existing', label: 'Do you have any environmental plans or procedures currently?', type: 'radio', options: ['None', 'Basic waste management plan', 'Site environmental management plans', 'Comprehensive EMS in place'] },
    ],
  },
  {
    id: 'iso45001',
    name: 'ISO 45001',
    full: 'Occupational Health & Safety',
    desc: 'The world\'s leading OHS management standard. Reduces workplace incidents and demonstrates duty of care to workers.',
    price: 499,
    icon: HardHat,
    colour: '#ea580c',
    pages: '50–65',
    questions: [
      { id: 'industry', label: 'What industry does your business operate in?', type: 'select', options: ['Construction', 'Manufacturing', 'Mining', 'Transport & Logistics', 'Healthcare', 'Retail', 'Professional Services', 'Other'] },
      { id: 'hazards', label: 'List the main workplace hazards your workers face', type: 'textarea', placeholder: 'e.g. Working at height, plant and equipment, manual handling, electrical...' },
      { id: 'size', label: 'Number of employees', type: 'select', options: ['1–10', '11–50', '51–200', '201–500', '500+'] },
      { id: 'incidents', label: 'How many recordable incidents in the last 12 months?', type: 'select', options: ['0', '1–3', '4–10', '11+', 'Unknown'] },
      { id: 'existing', label: 'Do you have an existing WHS Management System?', type: 'radio', options: ['No', 'Basic safety procedures only', 'Full WHS MS (not certified)', 'Previously certified (lapsed)'] },
      { id: 'consultation', label: 'How do you currently consult with workers on safety?', type: 'textarea', placeholder: 'e.g. Toolbox talks, safety committee, suggestion box...' },
      { id: 'objectives', label: 'What are your OHS objectives for the next 12 months?', type: 'textarea', placeholder: 'e.g. Zero LTIs, 100% incident reporting, reduce near-miss frequency...' },
      { id: 'contractors', label: 'Do you engage contractors or subcontractors?', type: 'radio', options: ['No', 'Occasionally', 'Regularly (core to operations)', 'Primarily contractors, few direct employees'] },
    ],
  },
]

const BUNDLE: Omit<Standard, 'questions' | 'icon' | 'colour' | 'pages'> & { icon: typeof Shield; colour: string; pages: string } = {
  id: 'bundle',
  name: 'Bundle',
  full: 'All Three Standards',
  desc: 'Get all three ISO standards — 9001, 14001 and 45001 — at a significant saving. Most popular for construction and manufacturing.',
  price: 999,
  icon: Award,
  colour: '#FFD940',
  pages: '130–180',
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ISOPage() {
  const [step, setStep]               = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [selected, setSelected]       = useState<ISOStandard | null>(null)
  const [company, setCompany]         = useState({ name: 'Acme Construction Pty Ltd', abn: '12 345 678 901', address: '123 Builder St, Sydney NSW 2000', contact: 'Sarah Mitchell', email: 'sarah@acme.com.au', phone: '0412 345 678' })
  const [answers, setAnswers]         = useState<Record<string, string>>({})
  const [card, setCard]               = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [generating, setGenerating]   = useState(false)
  const [genProgress, setGenProgress] = useState(0)
  const [genStep, setGenStep]         = useState(0)

  const GEN_STEPS = [
    'Analysing your questionnaire responses…',
    'Mapping to ISO clause requirements…',
    'Drafting management system sections…',
    'Generating policy statements…',
    'Compiling procedures and work instructions…',
    'Formatting for ISO submission…',
    'Running compliance checks…',
    'Finalising your document package…',
  ]

  function getStandard(): Standard | undefined {
    return STANDARDS.find(s => s.id === selected)
  }

  function getPrice(): number {
    if (selected === 'bundle') return 999
    return STANDARDS.find(s => s.id === selected)?.price ?? 0
  }

  function handlePayment() {
    setStep(5)
    setGenerating(true)
    setGenProgress(0)
    setGenStep(0)
    let prog = 0
    let stepIdx = 0
    const interval = setInterval(() => {
      prog += Math.random() * 4 + 2
      stepIdx = Math.min(GEN_STEPS.length - 1, Math.floor((prog / 100) * GEN_STEPS.length))
      setGenProgress(Math.min(prog, 99))
      setGenStep(stepIdx)
      if (prog >= 99) {
        clearInterval(interval)
        setTimeout(() => {
          setGenProgress(100)
          setTimeout(() => {
            setStep(6)
            setGenerating(false)
          }, 600)
        }, 800)
      }
    }, 280)
  }

  const standardsToGenerate: Standard[] = selected === 'bundle'
    ? STANDARDS
    : (getStandard() ? [getStandard()!] : [])

  // ── Step 1: Select standard ──────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Award size={20} style={{ color: 'var(--accent-text)' }} />
            </div>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>ISO Document Generator</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Answer a short questionnaire and our AI generates a complete, audit-ready ISO management system document — ready to submit for certification.
          </p>
        </div>

        <StepIndicator current={1} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {STANDARDS.map(std => {
            const Icon = std.icon
            const isSelected = selected === std.id
            return (
              <button
                key={std.id}
                onClick={() => setSelected(std.id)}
                className="text-left p-5 border-2 transition-all"
                style={{
                  background: 'var(--bg)',
                  borderColor: isSelected ? std.colour : 'var(--border)',
                  borderTop: isSelected ? `3px solid ${std.colour}` : `3px solid transparent`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: std.colour + '20', color: std.colour }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{std.name}</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>${std.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: std.colour }}>{std.full}</p>
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{std.desc}</p>
                    <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>{std.pages} pages · Delivered as PDF + Word</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: std.colour }}>
                    <Check size={12} /> Selected
                  </div>
                )}
              </button>
            )
          })}

          {/* Bundle */}
          <button
            onClick={() => setSelected('bundle')}
            className="text-left p-5 border-2 transition-all md:col-span-2"
            style={{
              background: selected === 'bundle' ? '#FFF9D6' : 'var(--bg)',
              borderColor: selected === 'bundle' ? '#FFD940' : 'var(--border)',
              borderTop: selected === 'bundle' ? '3px solid #FFD940' : '3px solid transparent',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: '#FFD94030', color: '#a08000' }}>
                  <Award size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Complete Bundle — All Three Standards</span>
                    <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: '#FFD940', color: '#000' }}>SAVE $498</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>ISO 9001 + ISO 14001 + ISO 45001 — most popular for construction and manufacturing businesses</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>$999</p>
                <p className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>$1,497</p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => { if (selected) setStep(2) }}
            disabled={!selected}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold disabled:opacity-40 transition-opacity"
            style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
          >
            Continue <ChevronRight size={15} />
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Company information ──────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <StepIndicator current={2} />
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Company Information</h2>
          <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>This information will appear on your generated ISO documents.</p>

          <div className="space-y-4">
            <FormField label="Company / Organisation Name" value={company.name} onChange={v => setCompany(c => ({ ...c, name: v }))} />
            <FormField label="ABN" value={company.abn} onChange={v => setCompany(c => ({ ...c, abn: v }))} />
            <FormField label="Business Address" value={company.address} onChange={v => setCompany(c => ({ ...c, address: v }))} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Primary Contact Name" value={company.contact} onChange={v => setCompany(c => ({ ...c, contact: v }))} />
              <FormField label="Phone" value={company.phone} onChange={v => setCompany(c => ({ ...c, phone: v }))} />
            </div>
            <FormField label="Email" value={company.email} onChange={v => setCompany(c => ({ ...c, email: v }))} />
          </div>

          <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Next — Questionnaire" />
        </div>
      </div>
    )
  }

  // ── Step 3: Questionnaire ────────────────────────────────────────────────
  if (step === 3) {
    const standards = standardsToGenerate
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <StepIndicator current={3} />
        <div className="mt-8 space-y-10">
          {standards.map(std => {
            const Icon = std.icon
            return (
              <div key={std.id}>
                <div className="flex items-center gap-2 mb-5 pb-3" style={{ borderBottom: `2px solid ${std.colour}` }}>
                  <div className="w-7 h-7 flex items-center justify-center" style={{ background: std.colour + '20', color: std.colour }}>
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{std.name} — {std.full}</span>
                </div>
                <div className="space-y-5">
                  {std.questions.map((q, qi) => (
                    <div key={q.id}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                        {qi + 1}. {q.label}
                      </label>
                      {q.type === 'textarea' && (
                        <textarea
                          rows={3}
                          placeholder={q.placeholder}
                          value={answers[`${std.id}_${q.id}`] ?? ''}
                          onChange={e => setAnswers(a => ({ ...a, [`${std.id}_${q.id}`]: e.target.value }))}
                          className="w-full px-3 py-2 text-xs outline-none resize-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        />
                      )}
                      {q.type === 'select' && (
                        <select
                          value={answers[`${std.id}_${q.id}`] ?? ''}
                          onChange={e => setAnswers(a => ({ ...a, [`${std.id}_${q.id}`]: e.target.value }))}
                          className="w-full px-3 py-2 text-xs outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        >
                          <option value="">Select…</option>
                          {q.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                      {q.type === 'radio' && (
                        <div className="flex flex-wrap gap-2">
                          {q.options?.map(o => (
                            <button
                              key={o}
                              onClick={() => setAnswers(a => ({ ...a, [`${std.id}_${q.id}`]: o }))}
                              className="px-3 py-1.5 text-xs font-medium transition-all"
                              style={answers[`${std.id}_${q.id}`] === o
                                ? { background: std.colour, color: std.colour === '#FFD940' ? '#000' : '#fff', border: `1px solid ${std.colour}` }
                                : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                              }
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <StepNav onBack={() => setStep(2)} onNext={() => setStep(4)} nextLabel="Continue to Payment" />
      </div>
    )
  }

  // ── Step 4: Payment ──────────────────────────────────────────────────────
  if (step === 4) {
    const std = getStandard()
    const isBundle = selected === 'bundle'
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        <StepIndicator current={4} />
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Payment</h2>
          <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>One-time payment. Your documents will be ready within 60 seconds of payment.</p>

          {/* Order summary */}
          <div className="p-4 mb-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold mb-3" style={{ color: 'var(--text)' }}>Order Summary</p>
            {isBundle ? (
              <>
                {STANDARDS.map(s => (
                  <div key={s.id} className="flex justify-between text-xs py-1.5" style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <span>{s.name} — {s.full}</span>
                    <span>$499</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs py-1.5" style={{ color: 'var(--text-muted)' }}>
                  <span>Bundle discount</span>
                  <span style={{ color: '#16a34a' }}>−$498</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-xs py-1.5" style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <span>{std?.name} — {std?.full}</span>
                <span>${std?.price}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-3 mt-1">
              <span style={{ color: 'var(--text)' }}>Total (AUD, inc. GST)</span>
              <span style={{ color: 'var(--text)' }}>${getPrice().toLocaleString()}</span>
            </div>
          </div>

          {/* Card form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Card Details</span>
              <Lock size={11} style={{ color: 'var(--text-muted)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Secured by Stripe</span>
            </div>
            <FormField label="Name on card" value={card.name} onChange={v => setCard(c => ({ ...c, name: v }))} placeholder="Sarah Mitchell" />
            <FormField
              label="Card number"
              value={card.number}
              onChange={v => setCard(c => ({ ...c, number: v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
              placeholder="1234 5678 9012 3456"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Expiry" value={card.expiry} onChange={v => setCard(c => ({ ...c, expiry: v }))} placeholder="MM/YY" />
              <FormField label="CVC" value={card.cvc} onChange={v => setCard(c => ({ ...c, cvc: v.replace(/\D/g, '').slice(0, 3) }))} placeholder="123" />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handlePayment}
              className="w-full py-3 text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              <Lock size={14} />
              Pay ${getPrice().toLocaleString()} AUD & Generate Documents
            </button>
            <p className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>
              By completing payment you agree to our Terms of Service. Documents are generated for compliance preparation purposes. Certification requires engagement with an accredited ISO certification body.
            </p>
          </div>

          <div className="mt-3">
            <button onClick={() => setStep(3)} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <ChevronLeft size={13} /> Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 5: Generating ───────────────────────────────────────────────────
  if (step === 5) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--accent)' }}>
          <Sparkles size={28} style={{ color: 'var(--accent-text)' }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Generating Your Documents</h2>
        <p className="text-xs mb-8" style={{ color: 'var(--text-secondary)' }}>
          Our AI is compiling your ISO management system document. This usually takes 30–60 seconds.
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 mb-3" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${genProgress}%`, background: 'var(--accent)' }}
          />
        </div>
        <div className="flex justify-between text-[10px] mb-6" style={{ color: 'var(--text-muted)' }}>
          <span>{Math.round(genProgress)}% complete</span>
          <span>{genProgress < 100 ? 'Generating…' : 'Done!'}</span>
        </div>

        {/* Current step label */}
        <p className="text-xs font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>
          {GEN_STEPS[genStep]}
        </p>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-8">
          {GEN_STEPS.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 transition-all"
              style={{ background: i <= genStep ? 'var(--accent)' : 'var(--border)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Step 6: Download ─────────────────────────────────────────────────────
  if (step === 6) {
    const isBundle = selected === 'bundle'
    const docs = isBundle ? STANDARDS : (getStandard() ? [getStandard()!] : [])
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4" style={{ background: '#dcfce7' }}>
            <Check size={24} style={{ color: '#16a34a' }} />
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Your Documents Are Ready!</h2>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Payment received and documents generated for <strong>{company.name}</strong>. A copy has been emailed to {company.email}.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {docs.map(std => {
            const Icon = std.icon
            return (
              <div
                key={std.id}
                className="p-4 flex items-center gap-4"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: `3px solid ${std.colour}` }}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: std.colour + '20', color: std.colour }}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{std.name} — {std.full}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Generated for {company.name} · {new Date().toLocaleDateString('en-AU')} · PDF + Word</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
                  >
                    <Download size={12} /> PDF
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  >
                    <FileText size={12} /> Word
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Next steps */}
        <div className="p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-bold mb-3" style={{ color: 'var(--text)' }}>What to do next</p>
          <div className="space-y-2.5">
            {[
              { n: 1, t: 'Review and customise the document to your exact operations', sub: 'The AI has pre-filled sections based on your answers. Some clauses may need additional detail.' },
              { n: 2, t: 'Implement the management system in your business', sub: 'Train your team, apply the procedures, and collect evidence of compliance over 3–6 months.' },
              { n: 3, t: 'Engage an accredited certification body', sub: 'Contact SAI Global, BSI, Bureau Veritas, or similar to book your Stage 1 and Stage 2 audits.' },
              { n: 4, t: 'Maintain and improve annually', sub: 'ISO certification requires annual surveillance audits. Use Briesa to manage ongoing compliance.' },
            ].map(item => (
              <div key={item.n} className="flex gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5" style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}>
                  {item.n}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{item.t}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setStep(1); setSelected(null); setAnswers({}) }}
            className="text-xs underline"
            style={{ color: 'var(--text-muted)' }}
          >
            Generate another document
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Select Standard' },
    { n: 2, label: 'Company Info' },
    { n: 3, label: 'Questionnaire' },
    { n: 4, label: 'Payment' },
    { n: 5, label: 'Generating' },
    { n: 6, label: 'Download' },
  ]
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-7 h-7 flex items-center justify-center text-xs font-bold"
              style={
                s.n < current
                  ? { background: '#16a34a', color: '#fff' }
                  : s.n === current
                  ? { background: 'var(--accent)', color: 'var(--accent-text)' }
                  : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
              }
            >
              {s.n < current ? <Check size={12} /> : s.n}
            </div>
            <span className="text-[9px] mt-1 hidden sm:block" style={{ color: s.n === current ? 'var(--text)' : 'var(--text-muted)' }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-8 h-px mx-1 mb-3" style={{ background: s.n < current ? '#16a34a' : 'var(--border)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>{label}</label>
      <input
        className="w-full px-3 py-2 text-xs outline-none"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function StepNav({ onBack, onNext, nextLabel = 'Continue' }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="flex justify-between items-center mt-8 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
      <button onClick={onBack} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        <ChevronLeft size={13} /> Back
      </button>
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
      >
        {nextLabel} <ChevronRight size={15} />
      </button>
    </div>
  )
}
