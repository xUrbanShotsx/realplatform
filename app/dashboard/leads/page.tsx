'use client'
import { useState } from 'react'
import { Target, Phone, Mail, MessageSquare, Brain, Zap, Globe, Users } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const GREEN_S = 'rgba(16,185,129,0.1)'
const AMBER = '#f59e0b'; const RED = '#ef4444'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

const SOURCE_COLORS: Record<string, string> = {
  'realestate.com.au': '#e34234', Domain: '#6e2fcc', Website: BLUE, Referral: GREEN, Social: PINK, 'Rate My Agent': AMBER, Direct: TEAL,
}

const LEADS = [
  { name: 'Tom & Lucy Gardiner', suburb: 'Searching: Cronulla',   score: 91, source: 'realestate.com.au', time: '14 min ago',  qualified: true,  budget: '$2.1M–$2.4M', type: 'Buyer',   status: 'HOT',  statusColor: RED,   phone: '0411 111 111', email: 'tom@example.com',    message: 'Looking for 4-bed beachside — pre-approved $2.3M. Attended 3 opens last weekend. Very motivated.' },
  { name: 'Felicia Rosario',      suburb: 'Selling: Gymea Bay',    score: 84, source: 'Website',          time: '32 min ago',  qualified: true,  budget: '$1.4M+',      type: 'Seller',  status: 'WARM', statusColor: AMBER, phone: '0422 222 222', email: 'felicia@example.com', message: 'Filled out "What\'s my home worth?" form. 4-bed in Gymea Bay. Wants call this week.' },
  { name: 'James Wu',             suburb: 'Investing: Sutherland', score: 79, source: 'Referral',         time: '1 hr ago',    qualified: true,  budget: '$800K–$1.1M', type: 'Investor', status: 'WARM', statusColor: AMBER, phone: '0433 333 333', email: 'james@example.com',   message: 'Referred by Michael Tran. Looking for high-yield rental. Has 2 existing IPs.' },
  { name: 'Unknown Caller',       suburb: 'Shell Cove',            score: 61, source: 'Direct',           time: '2 hrs ago',   qualified: false, budget: 'Unknown',     type: 'Seller',  status: 'NEW',  statusColor: BLUE,  phone: '',             email: '',                    message: 'Inbound call — left voicemail. Property at Shell Cove. AI Chatbot engaged and gathering info.' },
  { name: 'Rachel Obi',           suburb: 'Searching: Bexley',     score: 72, source: 'Social',           time: '3 hrs ago',   qualified: false, budget: '$900K–$1.2M', type: 'Buyer',   status: 'NEW',  statusColor: BLUE,  phone: '0455 555 555', email: 'rachel@example.com',  message: 'Instagram DM — "Do you have anything in Bexley under $1.2M with a granny flat?" AI responded.' },
  { name: 'Domain Portal Enquiry',suburb: 'Viewing 42 Foreshore',  score: 55, source: 'Domain',           time: '4 hrs ago',   qualified: false, budget: 'Enquiring',   type: 'Buyer',   status: 'NEW',  statusColor: BLUE,  phone: '',             email: 'enquiry@example.com', message: 'Enquired on 42 Foreshore Cres. AI Chatbot: "Can we book a private inspection?" — follow-up due.' },
  { name: 'Paul & Deborah Starr', suburb: 'Selling: Caringbah',    score: 88, source: 'Rate My Agent',    time: 'Yesterday',   qualified: true,  budget: '$1.8M+',      type: 'Seller',  status: 'WARM', statusColor: AMBER, phone: '0466 666 666', email: 'paul@example.com',    message: 'Found us from 5★ review. Thinking of selling their 5-bed. Waiting for market update.' },
]

export default function LeadsPage() {
  const [sel, setSel] = useState(LEADS[0])
  const [filter, setFilter] = useState('All')

  const typeColors: Record<string, string> = { Buyer: BLUE, Seller: PINK, Investor: AMBER }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Left: Lead list */}
      <div style={{ width: 340, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Lead Centre</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ fontSize: 11, color: RED, background: `${RED}15`, padding: '2px 8px', fontWeight: 700 }}>3 hot</div>
              <div style={{ fontSize: 11, color: BLUE, background: `${BLUE}15`, padding: '2px 8px', fontWeight: 700 }}>4 new</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {['All', 'Hot', 'Buyers', 'Sellers', 'New'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '3px 9px', background: filter === f ? `${BLUE}20` : 'rgba(0,0,0,0.03)', border: `1px solid ${filter === f ? `${BLUE}30` : BORDER}`, color: filter === f ? BLUE : TEXT3, fontSize: 10, fontWeight: filter === f ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {LEADS.map((l, i) => (
            <div key={i} onClick={() => setSel(l)} style={{ padding: '11px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.name === l.name ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${sel.name === l.name ? l.statusColor : 'transparent'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{ width: 30, height: 30, background: avColor(l.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(l.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{l.suburb}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: l.statusColor, letterSpacing: '-0.03em' }}>{l.score}</div>
                  <div style={{ fontSize: 9, color: l.statusColor, background: `${l.statusColor}15`, padding: '1px 5px', fontWeight: 700 }}>{l.status}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: SOURCE_COLORS[l.source] ?? TEXT3, background: `${SOURCE_COLORS[l.source] ?? TEXT3}18`, padding: '1px 6px', fontWeight: 700 }}>{l.source}</span>
                <span style={{ fontSize: 9, color: (typeColors[l.type] ?? TEXT3), background: `${typeColors[l.type] ?? TEXT3}18`, padding: '1px 6px', fontWeight: 700 }}>{l.type.toUpperCase()}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3 }}>{l.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Lead detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, background: avColor(sel.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{initials(sel.name)}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 3 }}>{sel.name}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, color: sel.statusColor, background: `${sel.statusColor}15`, padding: '2px 8px', fontWeight: 700 }}>{sel.status}</span>
                <span style={{ fontSize: 11, color: TEXT3 }}>{sel.time}</span>
                <span style={{ fontSize: 11, color: SOURCE_COLORS[sel.source] ?? TEXT3 }}>{sel.source}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ label: 'Call', color: GREEN, icon: Phone }, { label: 'Email', color: BLUE, icon: Mail }, { label: 'SMS', color: PURPLE, icon: MessageSquare }].map(a => {
              const Icon = a.icon
              const href = a.label === 'Call' ? `tel:${sel.phone ?? ''}` : a.label === 'Email' ? `mailto:${sel.email ?? ''}` : `sms:${sel.phone ?? ''}`
              return <button key={a.label} onClick={() => window.location.href = href} style={{ background: a.color, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}><Icon size={11} />{a.label}</button>
            })}
          </div>
        </div>

        {/* Score + info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'AI Score', val: `${sel.score}`, color: sel.statusColor },
            { label: 'Type', val: sel.type, color: typeColors[sel.type] ?? BLUE },
            { label: 'Budget', val: sel.budget, color: GREEN },
            { label: 'Qualified', val: sel.qualified ? 'Yes' : 'Pending', color: sel.qualified ? GREEN : AMBER },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: m.color, letterSpacing: '-0.03em', marginBottom: 3 }}>{m.val}</div>
              <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* AI Qualification */}
        <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Brain size={13} color={PINK} />
            <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI QUALIFICATION NOTES</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.8 }}>{sel.message}</p>
        </div>

        {/* Next steps */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>AI RECOMMENDED NEXT STEPS</div>
          {(sel.qualified
            ? [`Call ${sel.name.split(' ')[0]} within 30 minutes — hot leads cool fast`, 'Book property inspection or appraisal this week', 'Add to AI nurture sequence for their type', 'Send personalised suburb market report']
            : ['AI Chatbot is gathering qualification data', 'Review chatbot transcript when complete', 'Call if no response within 2 hours', 'Add to general nurture sequence']
          ).map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, background: `${BLUE}15`, border: `1px solid ${BLUE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 12.5, color: TEXT2, lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Source details */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16 }}>
          <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>LEAD SOURCE DETAILS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Source', val: sel.source },
              { label: 'Time received', val: sel.time },
              { label: 'Property interest', val: sel.suburb },
              { label: 'Lead ID', val: `RP-${Math.floor(Math.random() * 9000) + 1000}` },
            ].map(s => (
              <div key={s.label} style={{ padding: '8px 0', borderBottom: `1px solid ${BORDER2}` }}>
                <div style={{ fontSize: 10, color: TEXT3, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
