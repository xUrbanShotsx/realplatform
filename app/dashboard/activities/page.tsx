'use client'
import { useState } from 'react'
import { Phone, Mail, MessageSquare, Calendar, FileText, Plus, Filter } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const GREEN = '#10b981'; const AMBER = '#f59e0b'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'; const TEAL = '#06b6d4'

const TABS = ['All', 'Calls', 'Emails', 'Meetings', 'Notes']
const TYPE_ICON: Record<string, React.ElementType> = { Call: Phone, Email: Mail, SMS: MessageSquare, Meeting: Calendar, Note: FileText }
const TYPE_COLOR: Record<string, string> = { Call: GREEN, Email: BLUE, SMS: TEAL, Meeting: AMBER, Note: '#64748b' }

const ACTIVITIES = [
  { type: 'Call', contact: 'Marcus Thornton', detail: '22 min · Discussed appraisal timing and price expectations', time: 'Today, 9:04 AM', outcome: 'Positive' },
  { type: 'Email', contact: 'Tom & Lucy Gardiner', detail: 'Sent comparable sales report for 42 Foreshore Cres', time: 'Today, 8:30 AM', outcome: 'Sent' },
  { type: 'Meeting', contact: 'Sandra Wilson', detail: 'Property appraisal at 7 Park Rd, Manly — 45 min', time: 'Yesterday, 2:00 PM', outcome: 'Completed' },
  { type: 'SMS', contact: 'James Wu', detail: 'Sutherland rental yield update — vacancy rates at 1.2%', time: 'Yesterday, 11:15 AM', outcome: 'Delivered' },
  { type: 'Call', contact: 'Peter Nguyen', detail: '8 min · Followed up on open home interest at Kingsway', time: 'Yesterday, 9:45 AM', outcome: 'Voicemail' },
  { type: 'Note', contact: 'Marcus Thornton', detail: 'Pre-purchased in Balmoral. Needs to sell before November. High motivation.', time: '24 Jul, 4:00 PM', outcome: 'Saved' },
  { type: 'Email', contact: 'Lin Zhao', detail: 'Rental review notice — 2 investment properties due Aug', time: '24 Jul, 2:30 PM', outcome: 'Sent' },
  { type: 'Meeting', contact: 'Anderson Family', detail: 'Counter-offer discussion — accepted $4.85M with 5-day extension', time: '24 Jul, 10:00 AM', outcome: 'Completed' },
  { type: 'Call', contact: 'Sandra Wilson', detail: '15 min · Craig back from overseas — ready to proceed', time: '23 Jul, 3:30 PM', outcome: 'Positive' },
  { type: 'SMS', contact: 'Tom & Lucy Gardiner', detail: 'Open home reminder for Saturday 10am — 42 Foreshore Cres', time: '23 Jul, 9:00 AM', outcome: 'Delivered' },
]

const TAB_FILTER: Record<string, string[]> = { Calls: ['Call'], Emails: ['Email'], Meetings: ['Meeting'], Notes: ['Note', 'SMS'] }

export default function ActivitiesPage() {
  const [tab, setTab] = useState(0)
  const filtered = tab === 0 ? ACTIVITIES : ACTIVITIES.filter(a => (TAB_FILTER[TABS[tab]] ?? []).includes(a.type))

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Activities</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>All logged contact interactions across your database</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Filter size={12} /> Filter
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BLUE, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={12} /> Log Activity
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${TEAL}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 24px 24px' }}>
        {filtered.map((a, i) => {
          const Icon = TYPE_ICON[a.type] ?? FileText
          const color = TYPE_COLOR[a.type] ?? TEXT3
          return (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: `1px solid ${BORDER2}`, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Icon size={14} color={color} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>{a.contact}</span>
                  <span style={{ fontSize: 10, color, background: `${color}12`, padding: '1px 7px', fontWeight: 700 }}>{a.type.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: TEXT3, marginLeft: 'auto' }}>{a.time}</span>
                </div>
                <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.5 }}>{a.detail}</div>
              </div>
              <div style={{ fontSize: 10, color: TEXT3, flexShrink: 0, marginTop: 4 }}>{a.outcome}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
