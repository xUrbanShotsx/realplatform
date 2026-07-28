'use client'

import { useState } from 'react'
import {
  Home, MoreHorizontal, ArrowLeft, ArrowRight,
  MapPin, Eye, Calendar, TrendingUp, Activity,
  Phone, Mail, MessageSquare, CheckCircle2, Clock,
} from 'lucide-react'

const BG_LIST   = '#232323'
const BG_DETAIL = '#2a2a2a'
const BG_SEL    = 'rgba(227,0,140,0.09)'
const BG_HOVER  = 'rgba(0,0,0,0.04)'
const BORDER    = 'rgba(255,255,255,0.08)'
const PINK      = '#e3008c'
const TEXT      = '#e8e8f0'
const TEXT2     = '#9090a8'
const TEXT3     = '#505060'
const SUCCESS   = '#107c10'
const WARN      = '#ca5010'
const DANGER    = '#d13438'
const BLUE      = '#0078d4'
const PURPLE    = '#8764b8'
const TEAL      = '#038387'

const AV = ['#0078d4','#8764b8','#038387','#107c10','#d83b01','#c239b3','#ca5010','#0099bc']
function avColor(name: string) { return AV[name.charCodeAt(0) % AV.length] }
function initials(name: string) {
  const p = name.split(' ')
  return p.length >= 2 ? p[0][0] + p[p.length-1][0] : name.slice(0,2)
}

const STAGE_ORDER = ['Appraisal', 'Listed', 'Under Offer', 'Sold']
function stageColor(s: string) {
  if (s === 'Sold') return SUCCESS
  if (s === 'Under Offer') return WARN
  if (s === 'Listed') return BLUE
  return TEXT3
}

const PROPERTIES = [
  {
    id: 1, address: '14 Arcadia Street', suburb: 'Bondi Beach NSW 2026', stage: 'Under Offer',
    price: '$2,150,000', days: 14, agent: 'Jye Sanjurjo',
    reaViews: 2840, domainViews: 1620, enquiries: 18, inspections: 7,
    aiInsight: 'Strong demand — two competing offers tabled. Recommend counterproposing to highest bidder before weekend close.',
    activity: [
      { text: 'Offer received: $2,090,000 (Cash, 14-day settlement)', time: 'Today 2:15pm', color: SUCCESS },
      { text: 'Second offer received: $2,075,000', time: 'Today 11:30am', color: WARN },
      { text: 'Inspection 7: 4 groups attended (32 mins avg walk time)', time: 'Yesterday', color: BLUE },
      { text: 'Listed on REA and Domain — premium placement', time: '14 days ago', color: TEXT3 },
    ],
  },
  {
    id: 2, address: '42 Glenmore Road', suburb: 'Paddington NSW 2021', stage: 'Listed',
    price: '$2,650,000', days: 8, agent: 'Jye Sanjurjo',
    reaViews: 1740, domainViews: 980, enquiries: 11, inspections: 3,
    aiInsight: 'Early days but strong digital engagement. Hero image is performing 22% above suburb average. Recommend adding a twilight photo set for next week\'s campaign.',
    activity: [
      { text: 'Open home: 11 groups, 3 registered buyers, 2 pre-approved', time: 'Saturday 10am', color: SUCCESS },
      { text: 'REA Premier listing approved — running until end of month', time: '5 days ago', color: BLUE },
      { text: 'Photoshoot completed — 24 images + video walkthrough', time: '8 days ago', color: TEXT3 },
    ],
  },
  {
    id: 3, address: '7 Raglan Street', suburb: 'Mosman NSW 2088', stage: 'Appraisal',
    price: '$2,400,000–$2,600,000', days: 2, agent: 'Jye Sanjurjo',
    reaViews: 0, domainViews: 0, enquiries: 0, inspections: 0,
    aiInsight: 'Appraisal completed 2 days ago. Owner (Lisa Chen) is motivated but wants 8 weeks before listing. Recommend preparing marketing materials now to reduce time to market.',
    activity: [
      { text: 'Appraisal meeting completed — price agreed at $2.4M–$2.6M', time: '2 days ago', color: SUCCESS },
      { text: 'Listing agreement sent for signature', time: 'Today', color: WARN },
    ],
  },
  {
    id: 4, address: '48 Woodford Avenue', suburb: 'Warilla NSW 2528', stage: 'Listed',
    price: '$695,000', days: 21, agent: 'Jye Sanjurjo',
    reaViews: 1280, domainViews: 640, enquiries: 9, inspections: 5,
    aiInsight: 'Campaign is slowing — views dropped 30% in week 3. Consider a $20k price reduction or refreshed hero image to re-engage portal algorithm.',
    activity: [
      { text: 'Price reduction discussion with vendor — pending decision', time: 'Today', color: WARN },
      { text: 'Open home: 5 groups (down from 9 in week 1)', time: 'Saturday', color: WARN },
      { text: 'Enquiry: Private inspection requested by Nicki Lihou', time: 'Today 1:01pm', color: BLUE },
    ],
  },
  {
    id: 5, address: '42A Headland Parade', suburb: 'Barrack Point NSW 2528', stage: 'Appraisal',
    price: '$1,600,000–$1,750,000', days: 1, agent: 'Jye Sanjurjo',
    reaViews: 0, domainViews: 0, enquiries: 0, inspections: 0,
    aiInsight: 'Off-market preferred by vendor (Mark Spinelli). 2 registered buyer matches already in database — recommend contacting before any public listing.',
    activity: [
      { text: 'Appraisal inspection completed — ocean views confirmed', time: 'Yesterday', color: SUCCESS },
      { text: 'Vendor brief: Off-market preferred, 60-day settlement', time: 'Yesterday', color: BLUE },
    ],
  },
  {
    id: 6, address: '18 Addison Road', suburb: 'Manly NSW 2095', stage: 'Sold',
    price: '$2,615,000', days: 34, agent: 'Jye Sanjurjo',
    reaViews: 3420, domainViews: 2100, enquiries: 24, inspections: 9,
    aiInsight: 'Sold 4.6% above reserve at auction. 3 active bidders. Comparable sale now strengthens appraisals for 4 similar Manly properties in our database.',
    activity: [
      { text: 'SOLD at auction — $2,615,000 (4.6% above reserve)', time: '2 days ago', color: SUCCESS },
      { text: 'Pre-auction offer of $2.4M declined by vendor', time: '5 days ago', color: WARN },
      { text: 'Auction registration: 8 registered bidders, 3 active', time: 'Auction day', color: BLUE },
    ],
  },
  {
    id: 7, address: '22 Thirroul Esplanade', suburb: 'Thirroul NSW 2515', stage: 'Listed',
    price: '$1,050,000', days: 12, agent: 'Jye Sanjurjo',
    reaViews: 890, domainViews: 510, enquiries: 6, inspections: 2,
    aiInsight: 'Beachfront position underperforming on digital — hero image does not capture the ocean views. Replacing with a drone aerial shot is projected to increase CTR by 48%.',
    activity: [
      { text: 'Open home: 8 groups attended — strong buyer interest', time: 'Saturday', color: SUCCESS },
      { text: 'REA listing live — standard placement', time: '12 days ago', color: TEXT3 },
    ],
  },
  {
    id: 8, address: '8 Beatrice Street', suburb: 'Balgowlah NSW 2093', stage: 'Appraisal',
    price: '$1,800,000–$1,950,000', days: 3, agent: 'Jye Sanjurjo',
    reaViews: 0, domainViews: 0, enquiries: 0, inspections: 0,
    aiInsight: 'Owner (Josephine Tran) is considering selling but has 5-year ownership concern. Show comparable sales to demonstrate strong capital growth since purchase.',
    activity: [
      { text: 'Appraisal meeting booked — confirmed for Friday', time: 'Today', color: BLUE },
      { text: 'Initial contact via referral from Steve Riordan (accountant)', time: '3 days ago', color: TEXT3 },
    ],
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof PROPERTIES[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: stageColor(item.stage), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Home size={15} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.address}</span>
            <span style={{ color: TEXT3, fontSize: 11 }}>{item.days}d</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 11, marginBottom: 4 }}>{item.suburb}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: TEXT, fontSize: 12, fontWeight: 600 }}>{item.price}</span>
            <span style={{ fontSize: 9, padding: '1px 6px', background: `${stageColor(item.stage)}18`, color: stageColor(item.stage), fontWeight: 700 }}>{item.stage}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const [selected, setSelected] = useState(PROPERTIES[0])
  const stageIdx = STAGE_ORDER.indexOf(selected.stage)
  const curIdx = PROPERTIES.findIndex(p => p.id === selected.id)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Property Pipeline</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>{PROPERTIES.length} properties tracked</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {PROPERTIES.map(p => <ListRow key={p.id} item={p} selected={selected.id === p.id} onSelect={() => setSelected(p)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{selected.address}, {selected.suburb}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => curIdx > 0 && setSelected(PROPERTIES[curIdx - 1])} style={{ background: 'none', border: 'none', cursor: curIdx > 0 ? 'pointer' : 'default', color: curIdx > 0 ? TEXT2 : TEXT3, padding: 4, opacity: curIdx > 0 ? 1 : 0.3 }}><ArrowLeft size={15} strokeWidth={1.5} /></button>
            <button onClick={() => curIdx < PROPERTIES.length - 1 && setSelected(PROPERTIES[curIdx + 1])} style={{ background: 'none', border: 'none', cursor: curIdx < PROPERTIES.length - 1 ? 'pointer' : 'default', color: curIdx < PROPERTIES.length - 1 ? TEXT2 : TEXT3, padding: 4, opacity: curIdx < PROPERTIES.length - 1 ? 1 : 0.3 }}><ArrowRight size={15} strokeWidth={1.5} /></button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><MoreHorizontal size={15} strokeWidth={1.5} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Property overview */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, flexShrink: 0, background: stageColor(selected.stage), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={20} color="#fff" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>{selected.price}</span>
                <span style={{ fontSize: 9, padding: '2px 7px', background: `${stageColor(selected.stage)}18`, color: stageColor(selected.stage), fontWeight: 700 }}>{selected.stage}</span>
                <span style={{ color: TEXT3, fontSize: 12 }}>{selected.days} days</span>
              </div>
              <div style={{ color: TEXT2, fontSize: 12 }}>{selected.agent}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ icon: Phone, color: SUCCESS, href: 'tel:' }, { icon: Mail, color: BLUE, href: 'mailto:' }, { icon: MessageSquare, color: TEAL, href: 'sms:' }].map((a, i) => {
                const Icon = a.icon
                return <button key={i} onClick={() => window.location.href = a.href} style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, color: a.color, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6 }}><Icon size={12} /></button>
              })}
            </div>
          </div>

          {/* Pipeline stage tracker */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Pipeline Stage</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {STAGE_ORDER.map((stage, i) => {
                const active = i <= stageIdx
                const current = i === stageIdx
                return (
                  <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                      <div style={{ width: 28, height: 28, background: active ? stageColor(selected.stage) : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: current ? `2px solid ${stageColor(selected.stage)}` : 'none' }}>
                        {active ? <CheckCircle2 size={14} color="#fff" /> : <Clock size={13} color={TEXT3} />}
                      </div>
                      <span style={{ color: active ? TEXT : TEXT3, fontSize: 10, fontWeight: active ? 600 : 400, textAlign: 'center', lineHeight: 1.3 }}>{stage}</span>
                    </div>
                    {i < STAGE_ORDER.length - 1 && (
                      <div style={{ height: 2, flex: 1, background: i < stageIdx ? stageColor(selected.stage) : 'rgba(0,0,0,0.05)', marginBottom: 24 }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Marketing performance */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Marketing Performance</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                { label: 'REA Views', value: selected.reaViews.toLocaleString(), color: BLUE },
                { label: 'Domain Views', value: selected.domainViews.toLocaleString(), color: TEAL },
                { label: 'Enquiries', value: selected.enquiries, color: WARN },
                { label: 'Inspections', value: selected.inspections, color: SUCCESS },
              ].map(m => (
                <div key={m.label} style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ color: m.color, fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{m.value}</div>
                  <div style={{ color: TEXT3, fontSize: 10 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div style={{ margin: '16px 20px 0', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px' }}>
            <div style={{ color: PINK, fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Insights</div>
            <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{selected.aiInsight}</div>
          </div>

          {/* Activity */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Recent Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.activity.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, flexShrink: 0, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={12} color={a.color} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ color: TEXT, fontSize: 13 }}>{a.text}</div>
                    <div style={{ color: TEXT3, fontSize: 11, marginTop: 1 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
