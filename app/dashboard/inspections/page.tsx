'use client'
import { useState } from 'react'
import { Users, Brain, CheckCircle, MapPin, Clock, Star, MessageSquare } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

type Inspection = {
  address: string; type: string; date: string; time: string; agent: string; attendees: number; status: string; color: string
  buyers: { name: string; budget: string; interest: string; interestColor: string; notes: string }[]
  aiAnalysis: string
}

const INSPECTIONS: Inspection[] = [
  {
    address: '42 Foreshore Cres, Cronulla', type: 'Open Home', date: 'Sat 27 Jul', time: '10:00am', agent: 'Jye',
    attendees: 18, status: 'Completed', color: GREEN,
    buyers: [
      { name: 'Tom & Lucy Gardiner', budget: '$2.3M', interest: 'Very High', interestColor: RED,    notes: 'Loved the view. Lucy teared up in the master. Tom measuring the garage. They\'ll offer.' },
      { name: 'James & Nina Blackwood', budget: '$3.1M', interest: 'High', interestColor: AMBER, notes: 'Second visit. Comparing against Caringbah property. Likely final 2.' },
      { name: 'Domain Portal Enquiry', budget: 'Enquiring', interest: 'Medium', interestColor: BLUE, notes: 'First open home. AI Chatbot engaged — follow up within 24 hrs.' },
    ],
    aiAnalysis: "18 groups through — top 5% for this price range in Cronulla. 3 buyers are credible at $3M+. Tom Gardiner and James Blackwood are your two most motivated. Both attended twice. Recommend calling both within 2 hours with private inspection invitations before they attend competitors' properties.",
  },
  {
    address: '55 Awaba St, Mosman', type: 'Auction Day', date: 'Sat 20 Jul', time: '11:00am', agent: 'Jye',
    attendees: 43, status: 'Sold', color: TEAL,
    buyers: [
      { name: 'Ryan & Priya Mehta', budget: '$5.1M', interest: 'Won Auction', interestColor: GREEN, notes: 'Winning bidder at $4.85M. Cooling-off in progress.' },
      { name: 'Buyer 2 (Anon)', budget: '$4.6M',  interest: 'Underbidder', interestColor: AMBER, notes: 'Underbid at $4.65M. Interested in similar properties. Add to AI prospecting list.' },
    ],
    aiAnalysis: "Auction achieved $4.85M — $50K above reserve. 6 registered bidders, 4 active. The underbidder is your best lead for future listings in Mosman. Add to the Mosman buyer watch list and notify on any new listings $4.5M–$5M.",
  },
  {
    address: '14 Ocean St, Cronulla', type: 'Private', date: 'Tue 29 Jul', time: '2:00pm', agent: 'Jye',
    attendees: 0, status: 'Upcoming', color: AMBER,
    buyers: [
      { name: 'Tom & Lucy Gardiner', budget: '$2.3M', interest: 'Confirmed', interestColor: GREEN, notes: 'Pre-appraisal — Marcus not yet listed. Showing buyers to gauge interest before campaign.' },
    ],
    aiAnalysis: "Pre-market showing booked for Tom Gardiner before Marcus Thornton\'s official campaign. This is your leverage — if Tom makes a strong offer pre-market, Marcus avoids the campaign cost. Present this carefully: don't undermine the auction strategy, but show Marcus the data if the off-market offer is strong.",
  },
]

export default function InspectionsPage() {
  const [sel, setSel] = useState(INSPECTIONS[0])

  const statusColor: Record<string, string> = { Completed: GREEN, Sold: TEAL, Upcoming: AMBER }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Left: inspection list */}
      <div style={{ width: 300, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Inspections</div>
          <div style={{ fontSize: 11, color: TEXT3 }}>2 open homes · 1 private</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {INSPECTIONS.map((ins, i) => (
            <div key={i} onClick={() => setSel(ins)} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.address === ins.address ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${sel.address === ins.address ? ins.color : 'transparent'}` }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.address}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: TEXT3 }}>{ins.type}</span>
                <span style={{ fontSize: 10, color: TEXT3 }}>·</span>
                <span style={{ fontSize: 10, color: TEXT3 }}>{ins.date} {ins.time}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {ins.attendees > 0 && <span style={{ fontSize: 10, color: BLUE, display: 'flex', alignItems: 'center', gap: 3 }}><Users size={9} />{ins.attendees} groups</span>}
                <span style={{ marginLeft: 'auto', fontSize: 9, color: statusColor[ins.status], background: `${statusColor[ins.status]}15`, padding: '2px 7px', fontWeight: 700 }}>{ins.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: inspection detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{sel.address}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: TEXT3, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} />{sel.type}</span>
              <span style={{ fontSize: 11, color: TEXT3, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} />{sel.date}, {sel.time}</span>
              <span style={{ fontSize: 9, color: statusColor[sel.status], background: `${statusColor[sel.status]}15`, padding: '2px 7px', fontWeight: 700 }}>{sel.status}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Groups Through', val: `${sel.attendees}`, color: BLUE   },
            { label: 'Agent', val: sel.agent, color: PURPLE },
            { label: 'Buyers Engaged', val: `${sel.buyers.length}`, color: GREEN  },
            { label: 'Status', val: sel.status, color: statusColor[sel.status] },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: m.color, letterSpacing: '-0.04em', marginBottom: 3 }}>{m.val}</div>
              <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* AI Analysis */}
        <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Brain size={13} color={PINK} />
            <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI BUYER ANALYSIS</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.8 }}>{sel.aiAnalysis}</p>
        </div>

        {/* Buyer feedback */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Buyer Feedback</div>
          {sel.buyers.map((b, i) => (
            <div key={i} style={{ padding: '14px 16px', borderBottom: i < sel.buyers.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, background: avColor(b.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{initials(b.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>Budget: {b.budget}</div>
                </div>
                <span style={{ fontSize: 10, color: b.interestColor, background: `${b.interestColor}15`, padding: '2px 8px', fontWeight: 700 }}>{b.interest}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <MessageSquare size={11} color={TEXT3} style={{ marginTop: 3, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 12, color: TEXT2, lineHeight: 1.6 }}>{b.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
