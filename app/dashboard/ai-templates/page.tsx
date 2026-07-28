'use client'

import { useState, useEffect } from 'react'
import { savedAiTemplates, aiTemplateCategories, aiTemplateTrades } from '@/lib/mock-data'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, CheckCircle2, MapPin, HardHat, AlertTriangle, FileText, Clock } from 'lucide-react'

const POPULAR_TEMPLATES = [
  { name: 'Working at Heights SWMS', type: 'SWMS', trade: 'Roofing', uses: '4,200+' },
  { name: 'Confined Space Entry JSA', type: 'JSA', trade: 'Civil / Earthworks', uses: '3,800+' },
  { name: 'Hot Work Permit Risk Assessment', type: 'Risk Assessment', trade: 'Mechanical', uses: '2,950+' },
  { name: 'Daily Site Inspection', type: 'Inspection', trade: 'General Construction', uses: '6,100+' },
  { name: 'Electrical Safety SWMS', type: 'SWMS', trade: 'Electrical', uses: '3,400+' },
  { name: 'Plant Pre-start Checklist', type: 'Checklist', trade: 'Civil / Earthworks', uses: '4,700+' },
]

const TYPE_BADGE_COLORS: Record<string, string> = {
  SWMS: '#1D4ED8',
  JSA: '#7C3AED',
  Inspection: '#059669',
  Checklist: '#0891B2',
  'Risk Assessment': '#DC2626',
  'Toolbox Talk': '#D97706',
  'Pre-start': '#0284C7',
  Induction: '#65A30D',
}

function TypeBadge({ type }: { type: string }) {
  const color = TYPE_BADGE_COLORS[type] ?? '#6B7280'
  return (
    <span
      style={{
        background: color + '22',
        color: color,
        fontSize: '10px',
        fontWeight: 700,
        padding: '2px 7px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        whiteSpace: 'nowrap' as const,
      }}
    >
      {type}
    </span>
  )
}

function AiBadge() {
  return (
    <span
      style={{
        background: 'var(--accent)',
        color: 'var(--accent-text)',
        fontSize: '10px',
        fontWeight: 700,
        padding: '2px 6px',
        letterSpacing: '0.04em',
      }}
    >
      AI
    </span>
  )
}

function GeneratingAnimation({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1700)
    const t3 = setTimeout(() => { onDone() }, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  const steps = [
    'Analysing task description...',
    'Identifying hazards & controls...',
    'Structuring document...',
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 24px',
        gap: '32px',
      }}
    >
      {/* Animated icon */}
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--accent)',
            opacity: 0.15,
            animation: 'pulse 1.2s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 8,
            background: 'var(--accent)',
            opacity: 0.3,
            animation: 'pulse 1.2s ease-in-out infinite 0.2s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 16,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={22} color="var(--accent-text)" strokeWidth={1.75} />
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        {steps.map((step, i) => {
          const done = i < phase
          const active = i === phase
          return (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: i > phase ? 0.3 : 1,
                transition: 'opacity 0.4s ease',
              }}
            >
              {/* Status dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  flexShrink: 0,
                  background: done
                    ? 'var(--accent)'
                    : active
                    ? 'var(--accent)'
                    : 'var(--border)',
                  animation: active ? 'pulse 0.8s ease-in-out infinite' : undefined,
                }}
              />
              {/* Bar */}
              <div
                style={{
                  flex: 1,
                  height: 36,
                  background: active
                    ? 'linear-gradient(90deg, var(--accent) 0%, var(--accent) 60%, var(--bg-secondary) 100%)'
                    : done
                    ? 'var(--bg-hover)'
                    : 'var(--bg-secondary)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 12,
                  transition: 'all 0.4s ease',
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: active ? 'var(--accent-text)' : done ? 'var(--text-secondary)' : 'var(--text-muted)',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {done ? '✓ ' : ''}{step}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        Generating your compliant document using Australian WHS standards...
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

function GeneratedDocument() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Document Header */}
      <div
        style={{
          background: 'var(--accent)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-text)', letterSpacing: '0.02em' }}>
            SAFE WORK METHOD STATEMENT (SWMS)
          </div>
          <div style={{ fontSize: 11, color: 'var(--accent-text)', opacity: 0.7, marginTop: 1 }}>
            Working at Heights — Residential Roofing
          </div>
        </div>
        <div style={{ background: '#00000022', padding: '4px 10px' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-text)' }}>AI GENERATED</span>
        </div>
      </div>

      {/* Meta grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid var(--border)',
          borderTop: 'none',
        }}
      >
        {[
          ['Document No.', 'BRS-SWMS-0047'],
          ['Version', '1.0'],
          ['Date', '4 May 2026'],
          ['Company', 'Acme Construction Pty Ltd'],
          ['Principal Contractor', 'Acme Construction Pty Ltd'],
          ['HRCW', 'Yes — Working at Heights'],
          ['Trade', 'Roofing'],
          ['Site Address', '14 Hillside Ave, Manly NSW 2095'],
        ].map(([label, value], i) => (
          <div
            key={label}
            style={{
              padding: '7px 10px',
              borderBottom: '1px solid var(--border)',
              borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 500, marginTop: 2 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Activity Table */}
      <div style={{ border: '1px solid var(--border)', borderTop: 'none', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Activity Step', 'Hazards Identified', 'Control Measures'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '7px 10px',
                    textAlign: 'left',
                    fontWeight: 700,
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    borderRight: '1px solid var(--border)',
                    fontSize: 10,
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              [
                'Setting up scaffold / ladder',
                'Fall from height; unstable base; struck by falling object',
                'Inspect scaffold/ladder before use; 3-point contact rule; spotter present at all times',
              ],
              [
                'Roofing sheet installation',
                'Falling objects; sharp sheet edges; manual handling strain',
                'Establish 3 m exclusion zone below; safety nets installed; cut-resistant gloves mandatory',
              ],
              [
                'Work at edge / eaves',
                'Unprotected leading edge; wind gusts; loss of balance',
                'Edge protection or guardrail installed; full-body harness & lanyard; cease work if wind >45 km/h',
              ],
              [
                'Working with power tools',
                'Electric shock; excessive noise; hand-arm vibration',
                'GFCI/RCD on all power tools; hearing protection (PPE); anti-vibration gloves',
              ],
              [
                'Emergency / rescue',
                'Suspension trauma; delayed rescue; communication failure',
                'Rescue plan briefed before work starts; first aider on site; confirmed phone signal at height',
              ],
            ].map(([step, hazards, controls], i) => (
              <tr
                key={i}
                style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-secondary)' }}
              >
                {[step, hazards, controls].map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: '7px 10px',
                      color: 'var(--text)',
                      borderBottom: '1px solid var(--border)',
                      borderRight: j < 2 ? '1px solid var(--border)' : 'none',
                      verticalAlign: 'top',
                      lineHeight: 1.45,
                    }}
                  >
                    {j === 0 ? <strong>{cell}</strong> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PPE */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderTop: 'none',
          padding: '10px 12px',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
          PPE Required
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Hard hat', 'Safety harness', 'Hi-vis vest', 'Safety boots', 'Cut-resistant gloves', 'Safety glasses', 'Hearing protection'].map((ppe) => (
            <span
              key={ppe}
              style={{
                fontSize: 10,
                padding: '3px 8px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}
            >
              ✓ {ppe}
            </span>
          ))}
        </div>
      </div>

      {/* Signature table */}
      <div style={{ border: '1px solid var(--border)', borderTop: 'none' }}>
        <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Worker Sign-off
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Worker Name', 'Role', 'Signature', 'Date'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '6px 10px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    borderBottom: '1px solid var(--border)',
                    borderRight: '1px solid var(--border)',
                    fontSize: 10,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((i) => (
              <tr key={i}>
                {[0, 1, 2, 3].map((j) => (
                  <td
                    key={j}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid var(--border)',
                      borderRight: j < 3 ? '1px solid var(--border)' : 'none',
                      color: 'var(--text-muted)',
                      fontSize: 11,
                    }}
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AiTemplatesPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedType, setSelectedType] = useState('')
  const [selectedTrade, setSelectedTrade] = useState('')
  const [description, setDescription] = useState('')
  const [includeEmergency, setIncludeEmergency] = useState(true)
  const [includePpe, setIncludePpe] = useState(true)
  const [includeMatrix, setIncludeMatrix] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filterTypes = ['All', ...aiTemplateCategories]

  const filteredTemplates = savedAiTemplates.filter((t) => {
    const matchesType = activeFilter === 'All' || t.type === activeFilter
    const matchesSearch =
      searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trade.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  function handleGenerate() {
    setStep(2)
  }

  function handleGeneratingDone() {
    setStep(3)
  }

  function handleRegenerate() {
    setStep(2)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    cursor: 'pointer',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    marginBottom: 5,
  }

  return (
    <div style={{ padding: '24px', maxWidth: '100%' }}>
      <PageHeader
        title="AI Template Generator"
        description="Generate fully compliant SWMS, JSAs, inspections and more in seconds — powered by Briesa AI."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT PANEL: Template Library ─────────────────────────────── */}
        <Card
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Search */}
          <div style={{ padding: '14px 14px 10px' }}>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  pointerEvents: 'none',
                }}
              >
                ⌕
              </span>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 30, fontSize: 12 }}
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div
            style={{
              display: 'flex',
              gap: 4,
              overflowX: 'auto',
              padding: '0 14px 12px',
              scrollbarWidth: 'none',
            }}
          >
            {filterTypes.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                  background: activeFilter === f ? 'var(--accent)' : 'var(--bg)',
                  color: activeFilter === f ? 'var(--accent-text)' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)' }} />

          {/* Your templates */}
          <div style={{ padding: '12px 14px 6px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
              Your Templates ({filteredTemplates.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    <TypeBadge type={t.type} />
                    {t.aiGenerated && <AiBadge />}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2, lineHeight: 1.3 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                    <span>{t.trade}</span>
                    <span>·</span>
                    <span>Used {t.usedCount}×</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0 0' }} />

          {/* Popular library templates */}
          <div style={{ padding: '12px 14px 14px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
              Popular Templates
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {POPULAR_TEMPLATES.map((t) => (
                <div
                  key={t.name}
                  style={{
                    padding: '9px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <TypeBadge type={t.type} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2, lineHeight: 1.3 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                    <span>{t.trade}</span>
                    <span>·</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{t.uses} uses</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── CENTRE PANEL: AI Generator ───────────────────────────────── */}
        <Card
          style={{
            background: 'var(--bg-secondary)',
            border: '2px solid var(--accent)',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg)',
            }}
          >
            <Zap size={18} strokeWidth={1.75} color="var(--text)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Generate with AI</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Describe your task — Briesa AI does the rest
              </div>
            </div>
            {/* Step indicator */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: 24,
                    height: 4,
                    background: step >= s ? 'var(--accent)' : 'var(--border)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Configure */}
          {step === 1 && (
            <div style={{ padding: '18px' }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.55 }}>
                Select your document type, trade, and describe the work being performed. Briesa AI will generate a fully compliant, ready-to-use document in seconds.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Template Type */}
                <div>
                  <label style={labelStyle}>Template Type</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="">Select document type...</option>
                      {aiTemplateCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: 11 }}>▾</span>
                  </div>
                </div>

                {/* Trade */}
                <div>
                  <label style={labelStyle}>Trade / Industry</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={selectedTrade}
                      onChange={(e) => setSelectedTrade(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="">Select trade or industry...</option>
                      {aiTemplateTrades.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: 11 }}>▾</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Work Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Installing roof sheeting on a 2-storey residential build using a boom lift and scaffold"
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: 90,
                      lineHeight: 1.5,
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
                    Include sections
                  </p>
                  {[
                    { label: 'Emergency procedures', value: includeEmergency, set: setIncludeEmergency },
                    { label: 'PPE requirements', value: includePpe, set: setIncludePpe },
                    { label: 'Risk matrix (likelihood × consequence)', value: includeMatrix, set: setIncludeMatrix },
                  ].map(({ label, value, set }) => (
                    <label
                      key={label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 9,
                        cursor: 'pointer',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        userSelect: 'none',
                      }}
                    >
                      <div
                        onClick={() => set(!value)}
                        style={{
                          width: 16,
                          height: 16,
                          border: `2px solid ${value ? 'var(--accent)' : 'var(--border)'}`,
                          background: value ? 'var(--accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.15s',
                        }}
                      >
                        {value && <span style={{ fontSize: 10, color: 'var(--accent-text)', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                      </div>
                      {label}
                    </label>
                  ))}
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: 'var(--accent)',
                    color: 'var(--accent-text)',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                    marginTop: 4,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <Zap size={13} strokeWidth={1.75} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Generate Document →
                </button>

                <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                  Compliant with Australian WHS Act 2011 &amp; model codes of practice
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Generating */}
          {step === 2 && <GeneratingAnimation onDone={handleGeneratingDone} />}

          {/* Step 3: Result */}
          {step === 3 && (
            <div>
              {/* Success banner */}
              <div
                style={{
                  padding: '10px 16px',
                  background: '#16a34a18',
                  borderBottom: '1px solid #16a34a44',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <CheckCircle2 size={14} color="#16a34a" strokeWidth={2} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>
                  Document generated — review before signing off
                </span>
              </div>

              {/* Scrollable preview */}
              <div
                style={{
                  maxHeight: 480,
                  overflowY: 'auto',
                  fontSize: 11,
                }}
              >
                <GeneratedDocument />
              </div>

              {/* Action buttons */}
              <div
                style={{
                  padding: '14px 16px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button
                    style={{
                      padding: '9px',
                      background: 'var(--accent)',
                      color: 'var(--accent-text)',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Save to Library
                  </button>
                  <button
                    style={{
                      padding: '9px',
                      background: 'transparent',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Download PDF
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button
                    style={{
                      padding: '9px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Edit Document
                  </button>
                  <button
                    style={{
                      padding: '9px',
                      background: 'var(--text)',
                      color: 'var(--bg)',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Use this Template
                  </button>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={handleRegenerate}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: 11,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Regenerate with different settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ── RIGHT PANEL: Stats & Recent ───────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Stats */}
          <Card
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.02em' }}>
                This Month
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
              {[
                {
                  label: 'Templates Generated',
                  value: '47',
                  sub: '↑ 23% vs last month',
                  subColor: '#16a34a',
                  Icon: FileText,
                },
                {
                  label: 'Time Saved',
                  value: '~18 hrs',
                  sub: 'vs manual drafting',
                  subColor: 'var(--text-muted)',
                  Icon: Clock,
                },
                {
                  label: 'Compliance Rate',
                  value: '96%',
                  sub: 'of AI templates pass review',
                  subColor: 'var(--text-muted)',
                  Icon: CheckCircle2,
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    padding: '14px',
                    borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <stat.Icon size={16} strokeWidth={1.75} color="var(--text-secondary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 11, color: stat.subColor, marginTop: 1 }}>
                      {stat.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent generations */}
          <Card
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Recent Generations</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {savedAiTemplates.slice(0, 5).map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    padding: '10px 14px',
                    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <TypeBadge type={t.type} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                      {new Date(t.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  {t.aiGenerated && <AiBadge />}
                </div>
              ))}
            </div>
          </Card>

          {/* AI Tips */}
          <Card
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Zap size={13} strokeWidth={1.75} color="var(--accent-text)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-text)' }}>AI Tips for Better Results</span>
            </div>
            <div style={{ padding: '14px' }}>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  {
                    tip: 'Be specific about the work location and height. "Installing roof sheeting at 7m on timber-frame house" generates better controls than "roofing work".',
                    Icon: MapPin,
                  },
                  {
                    tip: 'Mention plant and equipment used. Including "boom lift EWP" or "mobile scaffold" triggers the correct licencing and inspection requirements.',
                    Icon: HardHat,
                  },
                  {
                    tip: 'Describe unusual conditions — weather exposure, after-hours work, confined areas. Briesa AI will include site-specific hazard controls.',
                    Icon: AlertTriangle,
                  },
                ].map(({ tip, Icon }) => (
                  <li key={tip} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Icon size={14} strokeWidth={1.75} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .ai-templates-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
