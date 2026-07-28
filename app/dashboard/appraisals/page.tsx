'use client'
import { useState } from 'react'
import { Home, Calendar, Clock, CheckCircle, Plus, Brain, Check } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const PINK_S = 'rgba(227,0,140,0.08)'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['Upcoming', 'Completed', 'All']

const APPRAISALS = [
  { address: '14 Ocean St, Cronulla', contact: 'Marcus Thornton', date: 'Tue 29 Jul, 2:00 PM', agent: 'Jye San Jurjo', status: 'upcoming', estValue: '$2.8M–$3.1M', notes: 'Comparing with McGrath. Pre-purchased in Balmoral.' },
  { address: '3 Surf Rd, Cronulla', contact: 'Rebecca Hart', date: 'Wed 30 Jul, 10:30 AM', agent: 'Sarah Mitchell', status: 'upcoming', estValue: '$1.6M–$1.9M', notes: 'First contact via website enquiry.' },
  { address: '18 Marina Dr, Port Hacking', contact: 'David & Claire Ng', date: 'Thu 31 Jul, 4:00 PM', agent: 'Jye San Jurjo', status: 'upcoming', estValue: '$3.2M–$3.6M', notes: 'Downsizing. Both retired. No urgency but motivated.' },
  { address: '7 Park Rd, Manly', contact: 'Sandra Wilson', date: 'Mon 21 Jul, 2:00 PM', agent: 'Jye San Jurjo', status: 'completed', estValue: '$2.8M–$3.1M', notes: 'Partner Craig overseas. Cautious but warming up.' },
  { address: '22 Kingsway, Cronulla', contact: 'Tom Walsh', date: 'Fri 18 Jul, 11:00 AM', agent: 'Tom Walsh', status: 'completed', estValue: '$1.4M–$1.6M', notes: 'Listed and sold $1.42M.' },
  { address: '9 Arcadia St, Cronulla', contact: 'Raj Patel', date: 'Wed 9 Jul, 3:00 PM', agent: 'Jye San Jurjo', status: 'completed', estValue: '$2.4M–$2.7M', notes: 'Sold $2.55M — above guide.' },
]

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  upcoming:  { color: AMBER, icon: Clock,        label: 'Upcoming' },
  completed: { color: GREEN, icon: CheckCircle,  label: 'Completed' },
}

export default function AppraisalsPage() {
  const [tab, setTab] = useState(0)
  const [booked, setBooked] = useState(false)
  const filtered = tab === 2 ? APPRAISALS : APPRAISALS.filter(a => a.status === TABS[tab].toLowerCase())

  const handleBook = () => {
    setBooked(true)
    setTimeout(() => setBooked(false), 2000)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Appraisals</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Schedule and track property appraisals</div>
          </div>
          <button onClick={handleBook} style={{ display: 'flex', alignItems: 'center', gap: 6, background: booked ? GREEN : BLUE, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s', borderRadius: 6 }}>
            {booked ? <Check size={12} /> : <Plus size={12} />} {booked ? 'Booked!' : 'Book Appraisal'}
          </button>
        </div>

        <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Brain size={13} color={PINK} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: TEXT2 }}>
            <strong style={{ color: PINK }}>AI —</strong> You have 3 appraisals this week. Rebecca Hart enquired via website — pre-fill her property data before Wednesday. For Marcus Thornton, open with the Balmoral comparable to anchor price expectations.
          </span>
        </div>

        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${GREEN}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((a, i) => {
          const cfg = STATUS_CONFIG[a.status]
          const Icon = cfg.icon
          return (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, background: `${GREEN}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Home size={16} color={GREEN} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{a.address}</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${cfg.color}12`, padding: '2px 8px' }}>
                    <Icon size={10} color={cfg.color} />
                    <span style={{ fontSize: 10, color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: TEXT2, marginBottom: 3 }}>{a.contact} · {a.agent}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: TEXT3 }}>
                    <Calendar size={10} /> {a.date}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>{a.estValue}</span>
                </div>
                {a.notes && <div style={{ fontSize: 11, color: TEXT3, marginTop: 5, fontStyle: 'italic' }}>{a.notes}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
