'use client'
import { useState, useEffect } from 'react'
import { Brain, DollarSign, FileText, CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const BLUE_S = 'rgba(67,97,238,0.12)'
const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

const TABS = ['Pipeline', 'Offers', 'Contracts', 'Exchange', 'Settlement', 'AI Deal Assistant']

const PIPELINE: Record<string, { name: string; address: string; price: string; agent: string; daysInStage: number; color: string }[]> = {
  'Appraisal': [
    { name: 'Marcus Thornton', address: '14 Ocean St, Cronulla', price: '$2.8M–$3.2M', agent: 'Jye', daysInStage: 2, color: PURPLE },
    { name: 'Sandra Wilson',   address: '7 Park Rd, Manly',      price: '$2.8M–$3.1M', agent: 'Jye', daysInStage: 0, color: AMBER  },
  ],
  'Listed': [
    { name: 'Mark Spinelli', address: '42 Foreshore Cres, Cronulla', price: '$3.2M–$3.6M', agent: 'Jye',   daysInStage: 14, color: GREEN  },
    { name: 'Paul & Deborah Starr', address: '5 Caringbah Rd', price: '$1.8M+', agent: 'Sarah', daysInStage: 3,  color: PURPLE },
  ],
  'Under Offer': [
    { name: 'Anderson Family', address: '55 Awaba St, Mosman', price: '$4.85M', agent: 'Jye', daysInStage: 4, color: TEAL },
  ],
  'Exchanged': [
    { name: 'J. Wu (Investment)', address: '3/22 Gunnamatta Ave', price: '$1.07M', agent: 'Tom', daysInStage: 8, color: BLUE },
  ],
  'Settlement': [
    { name: 'Rachel & Mike Obi', address: '9 Arcadia St, Bondi', price: '$2.55M', agent: 'Sarah', daysInStage: 12, color: PINK },
  ],
}

const COLS = ['Appraisal', 'Listed', 'Under Offer', 'Exchanged', 'Settlement']
const COL_COLORS: Record<string, string> = { Appraisal: PURPLE, Listed: GREEN, 'Under Offer': AMBER, Exchanged: BLUE, Settlement: PINK }

const OFFERS = [
  { buyer: 'Tom & Lucy Gardiner', address: '42 Foreshore Cres, Cronulla', offer: '$3.05M', vendor: '$3.3M', gap: '$250K', status: 'Countered', color: AMBER },
  { buyer: 'James & Nina Blackwood', address: '42 Foreshore Cres, Cronulla', offer: '$2.95M', vendor: '$3.3M', gap: '$350K', status: 'Open', color: BLUE },
  { buyer: 'Buyer 3 (Anon)', address: '42 Foreshore Cres, Cronulla', offer: '$2.88M', vendor: '$3.3M', gap: '$420K', status: 'Open', color: TEAL },
]

const CONTRACTS = [
  { address: '55 Awaba St, Mosman', buyer: 'Ryan & Priya Mehta', vendor: 'Anderson Family', price: '$4.85M', cooling: '3 of 5 days', exchange: '29 Jul', color: TEAL },
]

export default function DealsPage() {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    const map: Record<string, number> = { offers: 1, contracts: 2, exchange: 3, settlement: 4, ai: 5 }
    if (t && map[t] !== undefined) setTab(map[t])
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${GREEN}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '12px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 0 && (
          <div style={{ display: 'flex', height: '100%', gap: 0, overflowX: 'auto', padding: 20 }}>
            {COLS.map(col => (
              <div key={col} style={{ minWidth: 220, flex: 1, marginRight: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, background: COL_COLORS[col], borderRadius: 9999 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: COL_COLORS[col], letterSpacing: '0.06em' }}>{col.toUpperCase()}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3, background: 'rgba(0,0,0,0.04)', padding: '1px 6px' }}>{PIPELINE[col]?.length ?? 0}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(PIPELINE[col] ?? []).map((d, i) => (
                    <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `2px solid ${d.color}`, padding: 12, cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                        <div style={{ width: 24, height: 24, background: avColor(d.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{initials(d.name)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                          <div style={{ fontSize: 9.5, color: TEXT3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.address}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: GREEN }}>{d.price}</span>
                        <span style={{ fontSize: 9, color: d.daysInStage > 7 ? AMBER : TEXT3 }}>{d.daysInStage}d</span>
                      </div>
                      <div style={{ fontSize: 9.5, color: TEXT3, marginTop: 3 }}>Agent: {d.agent}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 1 && (
          <div style={{ overflowY: 'auto', padding: 24, height: '100%' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, marginBottom: 14 }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Active Offers — 42 Foreshore Cres, Cronulla</div>
              {OFFERS.map((o, i) => (
                <div key={i} style={{ padding: '14px 16px', borderBottom: i < OFFERS.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, background: avColor(o.buyer), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{initials(o.buyer)}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{o.buyer}</div>
                      <div style={{ fontSize: 10, color: TEXT3 }}>{o.address}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 9, color: o.status === 'Countered' ? AMBER : BLUE, background: `${o.status === 'Countered' ? AMBER : BLUE}15`, padding: '2px 7px', fontWeight: 700 }}>{o.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div><div style={{ fontSize: 15, fontWeight: 800, color: GREEN }}>{o.offer}</div><div style={{ fontSize: 9, color: TEXT3 }}>Offer</div></div>
                    <div style={{ display: 'flex', alignItems: 'center', color: TEXT3 }}><ArrowRight size={12} /></div>
                    <div><div style={{ fontSize: 15, fontWeight: 800, color: AMBER }}>{o.vendor}</div><div style={{ fontSize: 9, color: TEXT3 }}>Vendor wants</div></div>
                    <div><div style={{ fontSize: 15, fontWeight: 800, color: RED }}>{o.gap}</div><div style={{ fontSize: 9, color: TEXT3 }}>Gap</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 2 && (
          <div style={{ overflowY: 'auto', padding: 24, height: '100%' }}>
            {CONTRACTS.map((c, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `2px solid ${c.color}`, padding: 20, marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{c.address}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
                  {[
                    { label: 'Sale Price', val: c.price, color: GREEN  },
                    { label: 'Cooling Off', val: c.cooling, color: AMBER  },
                    { label: 'Exchange',    val: c.exchange, color: TEAL   },
                    { label: 'Status',      val: 'Cooling Off', color: BLUE },
                  ].map(m => (
                    <div key={m.label} style={{ background: '#f8fafc', border: `1px solid ${BORDER}`, padding: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: TEXT3, marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <div style={{ flex: 1, padding: '10px 14px', background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 10, color: TEXT3, marginBottom: 4 }}>VENDOR</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{c.vendor}</div>
                  </div>
                  <div style={{ flex: 1, padding: '10px 14px', background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 10, color: TEXT3, marginBottom: 4 }}>BUYER</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{c.buyer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(tab === 3 || tab === 4) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
            <CheckCircle size={36} color={GREEN} />
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{tab === 3 ? 'No exchanges pending' : 'No upcoming settlements'}</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>All clear — deals will appear here when they reach this stage</div>
          </div>
        )}

        {tab === 5 && (
          <div style={{ overflowY: 'auto', padding: 24, height: '100%' }}>
            <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Brain size={16} color={PINK} />
                <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>AI Deal Assistant</span>
              </div>
              {[
                { heading: 'Anderson Family — Inspection Extension:', body: "The buyer has requested a 5-day building & pest inspection extension. This is routine. Your vendor David Anderson will be nervous. Call him before 3:30pm. Frame it as standard protocol, not a flag. The risk here is low: the building report on this property is clean." },
                { heading: '42 Foreshore Cres — Offer Strategy:', body: "You have 3 buyers between $2.88M and $3.05M. The vendor expectation is $3.3M. Recommend calling all 3 buyers today to test flexibility. Tom Gardiner has the highest motivation score (91) and pre-approval to $2.3M — he may stretch to $3.1M if convinced. Consider a best-and-final round before auction." },
                { heading: 'Sandra Wilson — Appraisal Tomorrow:', body: "Sandra has previously declined to list twice. Your competitive advantage tomorrow: the property is now estimated at $200K more than her last appraisal. Her partner returns from overseas in August — position August as the ideal listing window. Do not rush; build confidence in your process first." },
              ].map((b, i) => (
                <p key={i} style={{ fontSize: 13, color: TEXT2, lineHeight: 1.9, margin: i < 2 ? '0 0 14px' : 0 }}>
                  <strong style={{ color: TEXT }}>{b.heading}</strong> {b.body}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
