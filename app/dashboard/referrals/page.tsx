'use client'
import { useState } from 'react'
import { Users, Phone, Mail, TrendingUp, AlertCircle, CheckCircle, ArrowRight, DollarSign, Clock } from 'lucide-react'

const BG_LIST   = '#232323'
const BG_DETAIL = '#2a2a2a'
const BG_SEL    = 'rgba(227,0,140,0.09)'
const BG_HOVER  = 'rgba(0,0,0,0.04)'
const BORDER    = 'rgba(255,255,255,0.08)'
const PINK      = '#e3008c'
const PINK_SOFT = 'rgba(227,0,140,0.15)'
const TEXT      = '#e8e8f0'
const TEXT2     = '#9090a8'
const TEXT3     = '#505060'
const SUCCESS   = '#107c10'
const WARN      = '#ca5010'
const DANGER    = '#d13438'
const BLUE      = '#0078d4'
const PURPLE    = '#8764b8'

const AV = ['#0078d4','#8764b8','#038387','#107c10','#d83b01','#c239b3','#ca5010','#0099bc']
function avColor(name: string) { return AV[name.charCodeAt(0) % AV.length] }
function initials(name: string) {
  const p = name.split(' ')
  return p.length >= 2 ? p[0][0] + p[p.length - 1][0] : name.slice(0, 2)
}

interface ReferralEvent {
  type: 'sent' | 'received'
  client: string
  outcome: string
  value?: string
  date: string
}

interface PartnerItem {
  id: number
  name: string
  company: string
  type: string
  typeColor: string
  phone: string
  email: string
  lastInteraction: string
  health: 'Strong' | 'Warm' | 'At Risk' | 'Cold'
  healthColor: string
  sent: number
  received: number
  referralValue: string
  overdueDays?: number
  aiNote: string
  history: ReferralEvent[]
  suggestedReferral?: string
}

const ITEMS: PartnerItem[] = [
  {
    id: 1,
    name: 'Steve Marchetti',
    company: 'Marchetti Finance',
    type: 'Mortgage Broker',
    typeColor: BLUE,
    phone: '0412 888 222',
    email: 'steve@marchettifinance.com.au',
    lastInteraction: '3 days ago',
    health: 'Strong',
    healthColor: SUCCESS,
    sent: 12,
    received: 9,
    referralValue: '$82,000 GCI',
    aiNote: 'Strong mutual relationship. Steve referred Marcus Thornton a client last week — reciprocate soon with a buyer from the pipeline who needs pre-approval.',
    history: [
      { type: 'received', client: 'James & Priya Kowalski', outcome: 'Pre-approval secured, now active buyers', date: '3 days ago' },
      { type: 'sent', client: 'Sarah Mitchell', outcome: 'Refinanced — Steve closed $920K loan', value: '$9,200 referral fee', date: '2 weeks ago' },
      { type: 'received', client: 'Derek Patel', outcome: 'Pre-approved $1.8M — purchased Cronulla', date: '1 month ago' },
      { type: 'sent', client: 'The Chen Family', outcome: 'New purchase loan $1.2M', value: '$6,000 referral fee', date: '6 weeks ago' },
    ],
    suggestedReferral: 'Nicki Lihou — active buyer, pre-approval needed for $950K–$1.1M purchase',
  },
  {
    id: 2,
    name: 'Rebecca Nguyen',
    company: 'Nguyen Law Partners',
    type: 'Conveyancer',
    typeColor: PURPLE,
    phone: '02 9527 4411',
    email: 'rebecca@nguyenlaw.com.au',
    lastInteraction: '1 week ago',
    health: 'Warm',
    healthColor: BLUE,
    sent: 8,
    received: 5,
    referralValue: '$41,000 GCI',
    aiNote: 'Good relationship, balanced referral flow. Rebecca handled 8 of our last 12 settlements. A coffee catch-up is overdue — book one this week.',
    history: [
      { type: 'sent', client: 'The Mitchell Sale', outcome: 'Settlement completed on time', date: '1 week ago' },
      { type: 'sent', client: 'Kowalski property purchase', outcome: 'Pest & building review, contracts exchanged', date: '3 weeks ago' },
      { type: 'received', client: 'Nguyen client (investor)', outcome: 'Sold investment property in Caringbah for $1.38M', value: '$13,800 GCI', date: '2 months ago' },
    ],
    suggestedReferral: 'Lisa Chen — new buyer purchasing off-market, needs a conveyancer urgently',
  },
  {
    id: 3,
    name: 'Daniel Walsh',
    company: 'Walsh Financial Planning',
    type: 'Financial Planner',
    typeColor: '#038387',
    phone: '0411 344 900',
    email: 'daniel@walshfp.com.au',
    lastInteraction: '6 weeks ago',
    health: 'At Risk',
    healthColor: WARN,
    overdueDays: 42,
    sent: 3,
    received: 7,
    referralValue: '$58,000 GCI',
    aiNote: 'Imbalance — Daniel has referred 7 clients to us but we\'ve only sent him 3. This relationship is at risk of going cold. We owe him referrals. Review current pipeline for anyone needing a financial planner.',
    history: [
      { type: 'received', client: 'Mark Spinelli', outcome: 'Investment portfolio review — sold 2 IPs', value: '$22,400 GCI', date: '2 months ago' },
      { type: 'sent', client: 'Rob Cassidy', outcome: 'SMSF setup for property investment', date: '3 months ago' },
      { type: 'received', client: 'The Thompson family', outcome: 'Sold family home, downsized — $1.62M sale', value: '$16,200 GCI', date: '4 months ago' },
    ],
    suggestedReferral: 'Marcus Thornton has 2 clients planning retirement downsizes — strong SMSF and financial planning candidates for Daniel',
  },
  {
    id: 4,
    name: 'Tony Di Lello',
    company: 'Di Lello Building',
    type: 'Builder',
    typeColor: '#ca5010',
    phone: '0400 711 534',
    email: 'tony@dilellobuild.com.au',
    lastInteraction: '2 weeks ago',
    health: 'Warm',
    healthColor: BLUE,
    sent: 5,
    received: 4,
    referralValue: '$29,000 GCI',
    aiNote: 'Tony\'s renovations often trigger sales — he tells clients when it\'s a good time to sell. Stay top of mind. Our development intel page shows 3 DAs in his area — share those leads with him.',
    history: [
      { type: 'received', client: 'Paulo & Maria Estevez', outcome: 'Post-reno sale, 32 Gymea Bay Rd — $1.72M', value: '$17,200 GCI', date: '2 weeks ago' },
      { type: 'sent', client: 'The Anderson Home', outcome: 'Pre-sale renovation — kitchen & bathroom', date: '1 month ago' },
      { type: 'received', client: 'Janet Morris', outcome: 'Investment property sold after reno, $1.18M', value: '$11,800 GCI', date: '3 months ago' },
    ],
    suggestedReferral: 'Property at 4 Ridge St, Cronulla — vendor considering reno before sale, perfect job for Tony',
  },
  {
    id: 5,
    name: 'Sandra Park',
    company: 'Park & Associates Accounting',
    type: 'Accountant',
    typeColor: '#107c10',
    phone: '02 9522 8877',
    email: 'sandra@parkaccounting.com.au',
    lastInteraction: '3 months ago',
    health: 'Cold',
    healthColor: DANGER,
    overdueDays: 91,
    sent: 1,
    received: 2,
    referralValue: '$14,000 GCI',
    aiNote: 'Sandra has been largely inactive — 91 days since last contact. Relationship is cold. She has a strong client base of property investors and small business owners. Re-engage with a personalised market update and coffee invitation.',
    history: [
      { type: 'received', client: 'Ross & Kim Davies', outcome: 'Investment property sold — $1.1M', value: '$11,000 GCI', date: '4 months ago' },
      { type: 'sent', client: 'Kevin Lam', outcome: 'Referred for tax advice on property sale', date: '6 months ago' },
    ],
    suggestedReferral: 'Send Sandra our Q3 Investor Market Report — good re-engagement touchpoint',
  },
  {
    id: 6,
    name: 'Amy Petrov',
    company: 'Petrov Property Styling',
    type: 'Property Stylist',
    typeColor: PINK,
    phone: '0421 199 455',
    email: 'amy@petrovstyling.com.au',
    lastInteraction: '4 days ago',
    health: 'Strong',
    healthColor: SUCCESS,
    sent: 15,
    received: 11,
    referralValue: '$64,000 GCI',
    aiNote: 'Amy is our best-performing partner — 15 vendor referrals and excellent results. Homes styled by Amy achieve 6.2% above average sale price. Maintain this relationship closely.',
    history: [
      { type: 'sent', client: '42 Foreshore Cres, Cronulla', outcome: 'Styled — sold $210K above reserve', date: '4 days ago' },
      { type: 'received', client: 'The Harrison Family', outcome: 'Styling client sold with us — $2.1M', value: '$21,000 GCI', date: '2 weeks ago' },
      { type: 'sent', client: '7 Banksia Rd, Caringbah', outcome: 'Staged — open home 220+ attendees', date: '3 weeks ago' },
    ],
    suggestedReferral: 'Upcoming listing at 9 Plunkett St needs styling — contact Amy now for quote',
  },
]

const HEALTH_ORDER = ['Strong', 'Warm', 'At Risk', 'Cold']

export default function ReferralsPage() {
  const [selected, setSelected] = useState(ITEMS[0])
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* List Panel */}
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>Referral Network</span>
            <button style={{ background: PINK, color: '#fff', border: 'none', padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Partner</button>
          </div>
          <span style={{ fontSize: 12, color: TEXT3 }}>{ITEMS.length} partners · {ITEMS.filter(i => i.health === 'At Risk' || i.health === 'Cold').length} need attention</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ITEMS.map(item => {
            const active = selected.id === item.id
            return (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: '10px 14px',
                  borderBottom: `1px solid ${BORDER}`,
                  background: active ? BG_SEL : hovered === item.id ? BG_HOVER : 'transparent',
                  borderLeft: active ? `2px solid ${PINK}` : `2px solid transparent`,
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', gap: 9 }}>
                  <div style={{ width: 32, height: 32, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>
                    {initials(item.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{item.name}</span>
                      <span style={{ fontSize: 11, color: item.healthColor, fontWeight: 600 }}>{item.health}</span>
                    </div>
                    <div style={{ fontSize: 11, color: item.typeColor, fontWeight: 600, marginBottom: 2 }}>{item.type}</div>
                    <div style={{ fontSize: 11, color: TEXT3 }}>
                      ↑ {item.sent} sent · ↓ {item.received} received · {item.referralValue}
                    </div>
                    {item.overdueDays && (
                      <div style={{ fontSize: 11, color: WARN, marginTop: 2 }}>
                        ⚠ {item.overdueDays} days since last contact
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Pane */}
      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, background: avColor(selected.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                {initials(selected.name)}
              </div>
              <div>
                <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, margin: '0 0 2px' }}>{selected.name}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: selected.typeColor, fontWeight: 600 }}>{selected.type}</span>
                  <span style={{ fontSize: 12, color: TEXT3 }}>·</span>
                  <span style={{ fontSize: 12, color: TEXT2 }}>{selected.company}</span>
                  <span style={{ fontSize: 12, color: TEXT3 }}>·</span>
                  <span style={{ fontSize: 11, color: selected.healthColor, background: `${selected.healthColor}18`, padding: '2px 7px', fontWeight: 600 }}>{selected.health}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ background: 'rgba(0,0,0,0.09)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Phone size={12} /> Call
              </button>
              <button style={{ background: 'rgba(0,0,0,0.09)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Mail size={12} /> Email
              </button>
              <button style={{ background: PINK, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                <ArrowRight size={12} /> Log Referral
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Contact + Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Referrals Sent', val: selected.sent },
              { label: 'Referrals Received', val: selected.received },
              { label: 'Total GCI Value', val: selected.referralValue },
              { label: 'Last Contact', val: selected.lastInteraction },
            ].map(k => (
              <div key={k.label} style={{ background: 'rgba(0,0,0,0.03)', border: `1px solid ${BORDER}`, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: TEXT3, marginBottom: 3 }}>{k.label}</div>
                <div style={{ fontSize: 15, color: TEXT, fontWeight: 700 }}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={12} color={TEXT3} />
              <span style={{ fontSize: 13, color: TEXT2 }}>{selected.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={12} color={TEXT3} />
              <span style={{ fontSize: 13, color: TEXT2 }}>{selected.email}</span>
            </div>
          </div>

          {/* AI Note */}
          <div style={{ background: PINK_SOFT, border: `1px solid rgba(227,0,140,0.2)`, padding: 14 }}>
            <div style={{ fontSize: 11, color: PINK, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>AI Relationship Note</div>
            <p style={{ fontSize: 13, color: TEXT2, margin: 0, lineHeight: 1.6 }}>{selected.aiNote}</p>
          </div>

          {/* Suggested Referral */}
          {selected.suggestedReferral && (
            <div style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}30`, padding: 14 }}>
              <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Suggested Referral Opportunity</div>
              <p style={{ fontSize: 13, color: TEXT2, margin: '0 0 10px', lineHeight: 1.6 }}>{selected.suggestedReferral}</p>
              <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Send Referral Now
              </button>
            </div>
          )}

          {/* Referral History */}
          <div>
            <div style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Referral History</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selected.history.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '10px 14px', alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, background: h.type === 'sent' ? PINK : SUCCESS, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 11, color: h.type === 'sent' ? PINK : SUCCESS, fontWeight: 700, textTransform: 'uppercase' }}>{h.type === 'sent' ? '↑ Sent' : '↓ Received'}</span>
                      <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{h.client}</span>
                    </div>
                    <span style={{ fontSize: 12, color: TEXT2 }}>{h.outcome}</span>
                    {h.value && <span style={{ fontSize: 11, color: SUCCESS, fontWeight: 600, marginLeft: 8 }}>{h.value}</span>}
                  </div>
                  <span style={{ fontSize: 11, color: TEXT3, flexShrink: 0 }}>{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
