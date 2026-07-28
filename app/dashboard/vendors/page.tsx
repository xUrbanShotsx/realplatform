'use client'
import { useState } from 'react'
import { Briefcase, TrendingUp, Eye, Users, Phone, Mail, Brain, Calendar, CheckCircle } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

const VENDORS = [
  {
    name: 'Mark Spinelli', address: '42 Foreshore Cres, Cronulla', price: '$3.2M–$3.6M', method: 'Auction', status: 'Week 2',
    color: GREEN, sentiment: 'Positive', daysListed: 14, auctionDate: '9 Aug',
    metrics: { views: 312, inspections: 18, enquiries: 24, vipBuyers: 3 },
    calls: [{ week: 'Week 1', duration: '12 min', sentiment: '✓ Positive' }, { week: 'Week 2', duration: 'Overdue', sentiment: '⚠ Call today' }],
    feedback: ['Buyers love the view and size', '$3.1M–$3.35M price feedback from 4 buyers', '3 buyers requesting private inspections'],
    aiNote: "Mark is anxious but campaign is performing above benchmark. Lead with the numbers — 22% above suburb average. He's pre-purchased so needs reassurance. Don't mention the lower price feedback until he asks.",
  },
  {
    name: 'Anderson Family', address: '55 Awaba St, Mosman', price: '$4.85M', method: 'Auction', status: 'Under Offer',
    color: TEAL, sentiment: 'Anxious', daysListed: 28, auctionDate: 'Auction complete',
    metrics: { views: 1847, inspections: 43, enquiries: 127, vipBuyers: 6 },
    calls: [{ week: 'Auction day', duration: '22 min', sentiment: '✓ Euphoric' }, { week: 'Post-auction', duration: '14 min', sentiment: '✓ Happy' }],
    feedback: ['Sold at auction $4.85M', '6 bidders competitive', 'Buyer requesting 5-day inspection extension'],
    aiNote: "David is nervous about the inspection extension. Call him before 3:30pm and explain this is routine — it does not jeopardise the sale. Karen is more relaxed. Focus on David.",
  },
  {
    name: 'Sandra Wilson', address: '7 Park Rd, Manly', price: '$2.8M–$3.1M', method: 'Auction', status: 'Pre-market',
    color: PURPLE, sentiment: 'Cautious', daysListed: 0, auctionDate: '23 Aug',
    metrics: { views: 89, inspections: 0, enquiries: 6, vipBuyers: 0 },
    calls: [{ week: 'Initial', duration: '34 min', sentiment: '✓ Engaged' }],
    feedback: ['2 previous appraisals — did not list', 'Current estimate $200K above last appraisal', 'Appraisal booked Tuesday 10am'],
    aiNote: "Sandra has walked away twice before. Tomorrow's appraisal is critical. Lead with the $200K improvement since last year. Her partner is overseas until August — frame August as the optimal window. Do not pressure; build confidence.",
  },
]

export default function VendorsPage() {
  const [sel, setSel] = useState(VENDORS[0])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Left: Vendor list */}
      <div style={{ width: 300, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Vendors</div>
          <div style={{ fontSize: 11, color: TEXT3 }}>3 active · 1 pre-market</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {VENDORS.map((v, i) => (
            <div key={i} onClick={() => setSel(v)} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.name === v.name ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${sel.name === v.name ? v.color : 'transparent'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, background: avColor(v.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(v.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: TEXT }}>{v.name}</div>
                  <div style={{ fontSize: 10, color: TEXT3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.address}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: v.color }}>{v.price}</span>
                <span style={{ marginLeft: 'auto', fontSize: 9, color: v.color, background: `${v.color}15`, padding: '2px 7px', fontWeight: 700 }}>{v.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={9} />{v.metrics.views}</span>
                <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Users size={9} />{v.metrics.inspections}</span>
                <span style={{ fontSize: 10, color: v.sentiment === 'Anxious' || v.sentiment === 'Cautious' ? AMBER : GREEN }}>{v.sentiment}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Vendor dashboard */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 3 }}>{sel.name}</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>{sel.address}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: sel.color, marginTop: 2 }}>{sel.price} · {sel.method}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: GREEN, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} />Call Vendor</button>
            <button style={{ background: PINK, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}><Brain size={11} />AI Weekly Report</button>
          </div>
        </div>

        {/* Campaign metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Total Views', val: sel.metrics.views.toLocaleString(), color: BLUE   },
            { label: 'Inspections', val: `${sel.metrics.inspections}`, color: TEAL   },
            { label: 'Enquiries', val: `${sel.metrics.enquiries}`, color: PURPLE },
            { label: 'VIP Buyers', val: `${sel.metrics.vipBuyers}`, color: AMBER  },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: m.color, letterSpacing: '-0.04em', marginBottom: 2 }}>{m.val}</div>
              <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* AI Note */}
        <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Brain size={13} color={PINK} />
            <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI VENDOR STRATEGY</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.8 }}>{sel.aiNote}</p>
        </div>

        {/* Buyer Feedback */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>BUYER FEEDBACK</div>
          {sel.feedback.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <CheckCircle size={11} color={GREEN} style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: TEXT2 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Call log */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>VENDOR CALLS</div>
          {sel.calls.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < sel.calls.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
              <Phone size={11} color={TEXT3} />
              <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{c.week}</span>
              <span style={{ fontSize: 11, color: TEXT3 }}>{c.duration}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: c.sentiment.includes('⚠') ? AMBER : GREEN }}>{c.sentiment}</span>
            </div>
          ))}
          <button style={{ marginTop: 10, background: GREEN, border: 'none', color: '#fff', padding: '7px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Phone size={11} /> Log New Call
          </button>
        </div>

        {/* Vendor portal link */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16 }}>
          <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>VENDOR PORTAL</div>
          <p style={{ fontSize: 12, color: TEXT2, margin: '0 0 12px' }}>Give your vendor 24/7 access to campaign stats, inspection reports, and buyer feedback through a branded portal.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '7px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Open Portal</button>
            <button style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '7px 16px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Share Link</button>
          </div>
        </div>
      </div>
    </div>
  )
}
