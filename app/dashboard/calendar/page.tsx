'use client'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const GREEN = '#10b981'; const AMBER = '#f59e0b'; const PINK = '#e3008c'
const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const EVENTS = [
  { time: '8:30am',  title: 'Morning Team Huddle',              agent: 'All',   color: BLUE,   type: 'Team' },
  { time: '10:00am', title: 'Appraisal — Marcus Thornton',      agent: 'Jye',   color: AMBER,  type: 'Appraisal' },
  { time: '11:30am', title: 'Open Home — 42 Foreshore Cres',    agent: 'Jye',   color: GREEN,  type: 'Open Home' },
  { time: '1:00pm',  title: 'Private Inspection — Anderson',    agent: 'Sarah', color: PURPLE, type: 'Inspection' },
  { time: '2:30pm',  title: 'Auction — 55 Awaba St, Mosman',   agent: 'Jye',   color: PINK,   type: 'Auction' },
  { time: '4:00pm',  title: 'Training: AI Prospecting Tools',   agent: 'Tom',   color: TEAL,   type: 'Training' },
  { time: '5:00pm',  title: 'Vendor call — Sandra Wilson',      agent: 'Sarah', color: PURPLE, type: 'Call' },
]

const UPCOMING = [
  { date: 'Mon 28 Jul', title: 'Appraisal — 7 Park Rd, Manly', agent: 'Jye', color: AMBER, type: 'Appraisal' },
  { date: 'Mon 28 Jul', title: 'Open Home — 14 Ocean St', agent: 'Sarah', color: GREEN, type: 'Open Home' },
  { date: 'Tue 29 Jul', title: 'Property Settlement — 9 Arcadia St', agent: 'Jye', color: BLUE, type: 'Settlement' },
  { date: 'Tue 29 Jul', title: 'Inspection — Rebecca Hart', agent: 'Tom', color: TEAL, type: 'Inspection' },
  { date: 'Wed 30 Jul', title: 'Team performance review', agent: 'All', color: BLUE, type: 'Team' },
  { date: 'Thu 31 Jul', title: 'Auction prep — 42 Foreshore Cres', agent: 'Jye', color: PINK, type: 'Auction' },
]

const TYPE_COLORS: Record<string, string> = {
  'Team': BLUE, 'Appraisal': AMBER, 'Open Home': GREEN, 'Inspection': PURPLE,
  'Auction': PINK, 'Training': TEAL, 'Call': '#64748b', 'Settlement': '#06b6d4',
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEK_DATES = ['28', '29', '30', '31', '1', '2', '3']

export default function CalendarPage() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Calendar</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Team schedule — inspections, appraisals, auctions and events</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}><ChevronLeft size={13} /></button>
            <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, padding: '0 4px' }}>July 2026</span>
            <button style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}><ChevronRight size={13} /></button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BLUE, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginLeft: 4 }}>
              <Plus size={12} /> Add Event
            </button>
          </div>
        </div>

        {/* Week strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 20 }}>
          {WEEK_DAYS.map((d, i) => {
            const isToday = d === 'Sun' && WEEK_DATES[i] === '3'
            const isTomorrow = d === 'Mon' && WEEK_DATES[i] === '28'
            return (
              <div key={d} style={{ background: '#fff', border: `1px solid ${i === 6 ? BLUE : BORDER}`, padding: '10px 0', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 600, marginBottom: 4 }}>{d}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: i === 6 ? BLUE : TEXT }}>{WEEK_DATES[i]}</div>
                {i === 6 && <div style={{ width: 4, height: 4, background: BLUE, borderRadius: '50%', margin: '4px auto 0' }} />}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        {/* Today's schedule */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Today — Sunday 27 July 2026</span>
            <span style={{ fontSize: 10, color: TEXT3, background: `${BLUE}10`, padding: '2px 8px', fontWeight: 700, color: BLUE }}>{EVENTS.length} events</span>
          </div>
          {EVENTS.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 0, borderBottom: i < EVENTS.length - 1 ? `1px solid ${BORDER2}` : 'none', cursor: 'pointer' }}>
              <div style={{ width: 4, background: e.color, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', gap: 14, padding: '12px 16px', alignItems: 'center' }}>
                <div style={{ width: 68, flexShrink: 0, fontSize: 11, color: TEXT3, fontWeight: 600 }}>{e.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{e.title}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{e.agent}</div>
                </div>
                <span style={{ fontSize: 9, color: e.color, background: `${e.color}12`, padding: '2px 7px', fontWeight: 700, whiteSpace: 'nowrap' }}>{e.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming + legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Upcoming</div>
            {UPCOMING.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: i < UPCOMING.length - 1 ? `1px solid ${BORDER2}` : 'none', alignItems: 'flex-start', cursor: 'pointer' }}>
                <div style={{ width: 3, background: e.color, flexShrink: 0, alignSelf: 'stretch', minHeight: 28 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                  <div style={{ fontSize: 10, color: TEXT3, marginTop: 1 }}>{e.date} · {e.agent}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Event Types</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, background: color, borderRadius: '50%', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: TEXT2 }}>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
