'use client'
import { useState } from 'react'
import { Crosshair, TrendingUp, Phone, Mail, Brain, Zap, Building2 } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

const FILTERS = ['All', 'Seller Prediction', 'Long Ownership', 'Equity Growth', 'Downsizers', 'Expired', 'Developers']

const PROSPECTS = [
  { name: 'David & Karen Nguyen',  suburb: 'Cronulla',    score: 87, held: '19 yrs', equity: '$2.1M', growth: '+11%', signal: 'Long ownership + suburb activity spike', priority: 'HIGH',   urgency: AMBER },
  { name: 'Robert Haines',         suburb: 'Cronulla',    score: 79, held: '14 yrs', equity: '$1.4M', growth: '+9%',  signal: 'Searched "property valuation Cronulla"', priority: 'MEDIUM', urgency: BLUE  },
  { name: 'Margareth Liu',         suburb: 'Caringbah',   score: 74, held: '22 yrs', equity: '$1.8M', growth: '+8%',  signal: 'Equity at record high · Downsizer profile', priority: 'MEDIUM',urgency: BLUE  },
  { name: 'Peter & Jane Costello', suburb: 'Kurnell',     score: 91, held: '11 yrs', equity: '$980K', growth: '+14%', signal: 'DA lodged nearby · Comparable sales surge', priority: 'HIGH',  urgency: RED   },
  { name: 'The Morrison Estate',   suburb: 'Cronulla',    score: 68, held: '31 yrs', equity: '$3.2M', growth: '+7%',  signal: 'Probate record detected · Executor contact', priority: 'MEDIUM',urgency: BLUE  },
  { name: 'Sylvia Chen',           suburb: 'Sutherland',  score: 82, held: '16 yrs', equity: '$1.1M', growth: '+10%', signal: 'Kids finished school · Empty nester pattern', priority: 'HIGH', urgency: AMBER },
  { name: 'Bryce Holden',          suburb: 'Miranda',     score: 71, held: '9 yrs',  equity: '$720K', growth: '+13%', signal: 'LinkedIn: promoted to Director role',         priority: 'MEDIUM',urgency: BLUE  },
  { name: 'Nguyen Family Trust',   suburb: 'Gymea Bay',   score: 65, held: '27 yrs', equity: '$2.6M', growth: '+6%',  signal: 'Rate stress signals · High mortgage balance', priority: 'MEDIUM',urgency: BLUE  },
]

export default function ProspectingPage() {
  const [filter, setFilter] = useState('All')
  const [sel, setSel] = useState(PROSPECTS[0])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* AI Growth Engine Banner */}
      <div style={{ background: `linear-gradient(90deg, rgba(227,0,140,0.08), rgba(67,97,238,0.08))`, borderBottom: `1px solid rgba(227,0,140,0.15)`, padding: '12px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: PINK_S, border: `1px solid rgba(227,0,140,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={15} color={PINK} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: PINK }}>AI Growth Engine</span>
              <span style={{ fontSize: 9, color: PINK, background: PINK_S, padding: '2px 7px', fontWeight: 700 }}>TODAY'S OPPORTUNITY</span>
            </div>
            <div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>
              Today your biggest opportunity is <span style={{ color: PINK }}>14 Ocean Street, Cronulla</span>. The owner has held for 19 years. Similar homes risen 11%. Likely low mortgage (purchased 2005 ~$680K). 9 sales in their suburb in 30 days.
            </div>
          </div>
          <button style={{ background: PINK, border: 'none', color: '#fff', padding: '8px 18px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>Send CMA — One Click</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: List */}
        <div style={{ width: 340, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Filters */}
          <div style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '3px 10px', background: filter === f ? `${PINK}20` : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${filter === f ? `${PINK}30` : BORDER}`,
                  color: filter === f ? PINK : TEXT3, fontSize: 10, fontWeight: filter === f ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit',
                }}>{f}</button>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: TEXT3 }}>{PROSPECTS.length} predicted sellers · AI updated 15 min ago</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {PROSPECTS.map((p, i) => (
              <div key={i} onClick={() => setSel(p)} style={{ padding: '11px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.name === p.name ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${sel.name === p.name ? p.urgency : 'transparent'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 32, height: 32, background: avColor(p.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(p.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: TEXT, lineHeight: 1.2 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: TEXT3 }}>{p.suburb} · {p.held} ownership</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: p.urgency, letterSpacing: '-0.03em' }}>{p.score}</div>
                    <div style={{ fontSize: 9, color: TEXT3 }}>AI score</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 4, height: 4, background: PINK, borderRadius: 9999 }} />
                  <span style={{ fontSize: 10, color: TEXT2 }}>{p.signal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Prospect detail */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, background: avColor(sel.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{initials(sel.name)}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 3 }}>{sel.name}</div>
                <div style={{ fontSize: 12, color: TEXT3 }}>{sel.suburb}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ background: GREEN, border: 'none', color: '#fff', padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} /> Call</button>
              <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={11} /> Send CMA</button>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'AI Score', val: `${sel.score}`, color: sel.urgency },
              { label: 'Equity', val: sel.equity, color: GREEN },
              { label: 'Yrs Owned', val: sel.held, color: BLUE },
              { label: 'Suburb Growth', val: sel.growth, color: AMBER },
            ].map(m => (
              <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: m.color, letterSpacing: '-0.04em', marginBottom: 3 }}>{m.val}</div>
                <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* AI opportunity */}
          <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Brain size={13} color={PINK} />
              <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI OPPORTUNITY ANALYSIS</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.8 }}>
              <strong style={{ color: TEXT }}>{sel.name}</strong> has held their {sel.suburb} property for {sel.held}, placing them in the top 12% of long-term owners in this suburb. With {sel.growth} capital growth and estimated equity of {sel.equity}, their property has never been worth more. The {sel.signal.toLowerCase()} signal aligns with peak selling intent patterns in our database. Priority: <strong style={{ color: sel.urgency }}>{sel.priority}</strong>
            </p>
          </div>

          {/* Property snapshot */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Building2 size={13} color={TEXT3} />
              <span style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em' }}>PROPERTY SNAPSHOT</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Est. Current Value', val: `$${parseInt(sel.equity.replace(/[$M]/g,'')) > 1 ? (parseFloat(sel.equity.replace(/[$MK]/g,'')) + 0.3).toFixed(1) + 'M' : sel.equity}` },
                { label: 'Last Sold Price', val: 'Data from title search' },
                { label: 'Land Size', val: 'Est. 480–620m²' },
                { label: 'Bedrooms', val: '3–4 bed' },
                { label: 'Comparable Recent Sale', val: `+${sel.growth} 12 months` },
                { label: 'Outstanding Mortgage', val: 'Likely low / nil' },
              ].map(s => (
                <div key={s.label} style={{ padding: '8px 0', borderBottom: `1px solid ${BORDER2}` }}>
                  <div style={{ fontSize: 10, color: TEXT3, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signal indicators */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16 }}>
            <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>INTENT SIGNALS</div>
            {[
              { sig: 'Long ownership in active suburb', strength: 85, color: RED    },
              { sig: 'Equity at record high',           strength: 72, color: AMBER  },
              { sig: 'Life event pattern detected',     strength: 68, color: PURPLE },
              { sig: 'Suburb DA activity high',         strength: 55, color: BLUE   },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: TEXT2 }}>{s.sig}</span>
                  <span style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.strength}%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(0,0,0,0.04)' }}>
                  <div style={{ height: '100%', width: `${s.strength}%`, background: s.color, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
