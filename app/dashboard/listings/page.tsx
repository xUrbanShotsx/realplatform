'use client'
import { useState } from 'react'
import { List, Eye, Users, TrendingUp, Calendar, Zap, Brain, AlertCircle } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['Active', 'Coming Soon', 'Under Offer', 'Sold', 'Withdrawn']

const LISTINGS = [
  {
    address: '42 Foreshore Cres, Cronulla',  vendor: 'Mark Spinelli', price: '$3.2M–$3.6M', type: 'House · 4 bed · 3 bath',
    status: 'active', daysListed: 14, views: 312, inspections: 18, enquiries: 24, method: 'Auction',
    auctionDate: '9 Aug', healthScore: 78, color: GREEN,
    attention: 'Weekly vendor call overdue',
    suggestions: ['Send weekly campaign report to vendor', 'Email top 3 buyers with price feedback', 'Boost Instagram campaign by $200'],
    buyerInterest: [60, 72, 85, 91, 78, 88, 94, 82, 97, 89, 103, 115, 122, 118],
  },
  {
    address: '7 Park Rd, Manly',             vendor: 'Sandra Wilson', price: '$2.8M–$3.1M', type: 'House · 4 bed · 2 bath',
    status: 'coming_soon', daysListed: 0, views: 89, inspections: 0, enquiries: 6, method: 'Auction',
    auctionDate: '23 Aug', healthScore: 92, color: BLUE,
    attention: 'Appraisal tomorrow — set up listing',
    suggestions: ['Book photographer for next week', 'Prepare marketing schedule', 'Send suburb comparable report to vendor'],
    buyerInterest: [12, 18, 24, 31, 38, 45, 52, 60, 67, 74, 81, 88],
  },
  {
    address: '55 Awaba St, Mosman',           vendor: 'Anderson Family', price: '$4.85M',    type: 'House · 5 bed · 3 bath',
    status: 'under_offer', daysListed: 28, views: 1847, inspections: 43, enquiries: 127, method: 'Auction',
    auctionDate: 'Sold at auction', healthScore: 100, color: TEAL,
    attention: 'Counter-offer pending — decision today',
    suggestions: ['Confirm inspection extension decision', 'Prepare settlement timeline', 'Thank buyer agent'],
    buyerInterest: [120, 145, 167, 189, 212, 234, 267, 298, 324, 356, 389, 412, 438, 461, 482, 501, 524],
  },
  {
    address: '14 Arcadia St, Bondi Beach',    vendor: 'Marcus Thornton (incoming)', price: '$2.4M–$2.6M', type: 'House · 4 bed · 2 bath',
    status: 'coming_soon', daysListed: 0, views: 0, inspections: 0, enquiries: 0, method: 'Auction',
    auctionDate: 'TBC', healthScore: 0, color: PURPLE,
    attention: 'Appraisal today 2pm',
    suggestions: ['Prepare appraisal brief', 'Check comparable sales', 'Review McGrath listings in area'],
    buyerInterest: [],
  },
]

const statusLabel: Record<string, string> = { active: 'Active', coming_soon: 'Coming Soon', under_offer: 'Under Offer', sold: 'Sold' }
const statusColor: Record<string, string> = { active: GREEN, coming_soon: BLUE, under_offer: TEAL, sold: PURPLE }
const tabFilter: Record<string, string> = { 'Active': 'active', 'Coming Soon': 'coming_soon', 'Under Offer': 'under_offer', 'Sold': 'sold' }

export default function ListingsPage() {
  const [tab, setTab] = useState('Active')
  const [sel, setSel] = useState(LISTINGS[0])
  const [done, setDone] = useState<string | null>(null)

  const handleDoIt = (action: string) => {
    setDone(action)
    setTimeout(() => setDone(null), 2000)
  }

  const filtered = LISTINGS.filter(l => !tabFilter[tab] || l.status === tabFilter[tab])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${AMBER}` : '2px solid transparent', color: tab === t ? TEXT : TEXT3, padding: '12px 14px', fontSize: 12, fontWeight: tab === t ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, color: TEXT3 }}>{LISTINGS.length} total listings</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: listing list */}
        <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, overflowY: 'auto' }}>
          {LISTINGS.map((l, i) => (
            <div key={i} onClick={() => setSel(l)} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.address === l.address ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${sel.address === l.address ? l.color : 'transparent'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>{l.address}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{l.type}</div>
                </div>
                <span style={{ fontSize: 9, color: statusColor[l.status], background: `${statusColor[l.status]}15`, padding: '2px 6px', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{statusLabel[l.status]}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: l.color, marginBottom: 5 }}>{l.price}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={9} />{l.views}</span>
                <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Users size={9} />{l.inspections} inspections</span>
                {l.daysListed > 0 && <span style={{ fontSize: 10, color: TEXT3 }}>{l.daysListed} days</span>}
              </div>
              {l.attention && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                  <AlertCircle size={9} color={AMBER} />
                  <span style={{ fontSize: 10, color: AMBER }}>{l.attention}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: AI Listing Manager */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 3 }}>{sel.address}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: TEXT3 }}>{sel.vendor}</span>
              <span style={{ fontSize: 9, color: statusColor[sel.status], background: `${statusColor[sel.status]}15`, padding: '2px 7px', fontWeight: 700 }}>{statusLabel[sel.status]}</span>
              <span style={{ fontSize: 11, color: sel.color, fontWeight: 700, marginLeft: 4 }}>{sel.price}</span>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Views', val: sel.views.toLocaleString(), color: BLUE   },
              { label: 'Inspections', val: `${sel.inspections}`, color: TEAL   },
              { label: 'Enquiries', val: `${sel.enquiries}`, color: PURPLE },
              { label: 'Days Listed', val: sel.daysListed > 0 ? `${sel.daysListed}` : 'Pre-market', color: AMBER },
            ].map(m => (
              <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: m.color, letterSpacing: '-0.04em', marginBottom: 2 }}>{m.val}</div>
                <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Marketing health */}
          {sel.daysListed > 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em' }}>MARKETING HEALTH</div>
                <span style={{ fontSize: 11, color: sel.healthScore > 80 ? GREEN : AMBER, fontWeight: 700 }}>{sel.healthScore}/100</span>
              </div>
              <div style={{ height: 6, background: 'rgba(0,0,0,0.05)', marginBottom: 12 }}>
                <div style={{ height: '100%', width: `${sel.healthScore}%`, background: sel.healthScore > 80 ? `linear-gradient(90deg, ${GREEN}, ${TEAL})` : `linear-gradient(90deg, ${AMBER}, ${GREEN})` }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'vs suburb avg', val: '+22%', color: GREEN },
                  { label: 'Auction method', val: sel.method, color: BLUE },
                  { label: 'Auction date', val: sel.auctionDate, color: AMBER },
                  { label: 'VIP buyers registered', val: '3', color: PURPLE },
                ].map(s => (
                  <div key={s.label} style={{ padding: '8px 0', borderBottom: `1px solid ${BORDER2}` }}>
                    <div style={{ fontSize: 10, color: TEXT3 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buyer interest chart (CSS bars) */}
          {sel.buyerInterest.length > 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>BUYER INTEREST TREND</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
                {sel.buyerInterest.map((v, i) => {
                  const max = Math.max(...sel.buyerInterest)
                  const pct = (v / max) * 100
                  return <div key={i} style={{ flex: 1, height: `${pct}%`, background: `linear-gradient(180deg, ${sel.color}, ${sel.color}60)`, minWidth: 4 }} />
                })}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Brain size={13} color={PINK} />
              <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI LISTING MANAGER — SUGGESTED ACTIONS</span>
            </div>
            {sel.suggestions.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, background: PINK, borderRadius: 9999, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: TEXT2, flex: 1 }}>{s}</span>
                <button onClick={() => handleDoIt(s)} style={{ background: done === s ? GREEN : PINK, border: 'none', color: '#fff', padding: '3px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background 0.2s', borderRadius: 4 }}>{done === s ? '✓ Done' : 'Do it'}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
