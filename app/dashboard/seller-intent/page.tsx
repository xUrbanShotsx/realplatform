'use client'

import { useState } from 'react'
import {
  TrendingUp, Brain, Zap, Activity, MoreHorizontal,
  ArrowLeft, ArrowRight, Phone, Mail, MessageSquare,
  CheckCircle2, AlertCircle, Clock, MapPin,
} from 'lucide-react'

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
const TEAL      = '#038387'

const AV = ['#0078d4','#8764b8','#038387','#107c10','#d83b01','#c239b3','#ca5010','#0099bc']
function avColor(name: string) { return AV[name.charCodeAt(0) % AV.length] }
function initials(name: string) {
  const p = name.split(' ')
  return p.length >= 2 ? p[0][0] + p[p.length-1][0] : name.slice(0,2)
}

function scoreColor(s: number) {
  if (s >= 80) return DANGER
  if (s >= 60) return WARN
  if (s >= 40) return BLUE
  return TEXT3
}

const PROSPECTS = [
  {
    id: 1, name: 'Marcus Thornton', suburb: 'Bondi Beach', score: 92, signals: 7,
    address: '14 Arcadia Street, Bondi Beach NSW 2026',
    prediction: '92% chance lists within 6 months',
    recommendation: 'Call immediately — window is open now.',
    signalBreakdown: [
      { category: 'Google property searches', status: 'Detected', detail: 'Searched "property valuation Bondi Beach" 4× in 7 days', color: DANGER },
      { category: 'Property valuation searches', status: 'Detected', detail: 'Requested 2 online valuations via CoreLogic tools', color: DANGER },
      { category: 'Competitor listing views', status: 'Detected', detail: 'Viewed 5 competitor listings this month', color: DANGER },
      { category: 'Mortgage refinance activity', status: 'Monitoring', detail: 'No activity detected in last 30 days', color: WARN },
      { category: 'Council DA activity nearby', status: 'Detected', detail: '3 new DAs within 200m — neighbour disruption signal', color: WARN },
      { category: 'Social media signals', status: 'Monitoring', detail: 'No moving or property posts detected', color: TEXT3 },
      { category: 'Equity growth', status: 'Detected', detail: 'Equity grown $190k above purchase price — peak signal', color: DANGER },
      { category: 'Ownership age', status: 'Detected', detail: '9 years ownership — statistically high sell probability', color: WARN },
    ],
  },
  {
    id: 2, name: 'James Kowalski', suburb: 'Paddington', score: 88, signals: 6,
    address: '42 Glenmore Road, Paddington NSW 2021',
    prediction: '88% chance lists within 6 months',
    recommendation: 'Engage via Instagram DM referencing renovation post.',
    signalBreakdown: [
      { category: 'Renovation completion', status: 'Detected', detail: 'Posted kitchen renovation on Instagram — strong sell trigger', color: DANGER },
      { category: 'Equity growth', status: 'Detected', detail: 'Property value up est. $180k post-renovation', color: DANGER },
      { category: 'Property valuation searches', status: 'Detected', detail: 'Viewed suburb comparable sales pages twice', color: WARN },
      { category: 'Google property searches', status: 'Monitoring', detail: 'No direct valuation searches detected', color: TEXT3 },
      { category: 'Mortgage refinance activity', status: 'Monitoring', detail: 'No refinance signals detected', color: TEXT3 },
      { category: 'Social media signals', status: 'Detected', detail: 'Caption: "on to the next chapter 🏡"', color: DANGER },
      { category: 'Ownership age', status: 'Detected', detail: '8 years — above average sell probability threshold', color: WARN },
      { category: 'Council DA activity nearby', status: 'Monitoring', detail: '1 DA lodged nearby — monitoring', color: TEXT3 },
    ],
  },
  {
    id: 3, name: 'Lisa Chen', suburb: 'Mosman', score: 81, signals: 5,
    address: '7 Raglan Street, Mosman NSW 2088',
    prediction: '81% chance lists within 12 months',
    recommendation: 'Send personalised appraisal — she requested it, act fast.',
    signalBreakdown: [
      { category: 'Appraisal request', status: 'Detected', detail: 'Directly emailed requesting updated appraisal', color: DANGER },
      { category: 'Competitor listing views', status: 'Detected', detail: 'Viewed 4 competitor listings in Mosman', color: WARN },
      { category: 'Equity growth', status: 'Detected', detail: 'Full equity, 22-year ownership — $2.4M est. value', color: DANGER },
      { category: 'Life event signal', status: 'Detected', detail: 'Parents moving into aged care — downsizing trigger', color: DANGER },
      { category: 'Google property searches', status: 'Monitoring', detail: 'No direct valuation searches detected', color: TEXT3 },
      { category: 'Mortgage refinance activity', status: 'Monitoring', detail: 'No mortgage — no refinance signals applicable', color: TEXT3 },
      { category: 'Council DA activity nearby', status: 'Monitoring', detail: 'No nearby DAs detected', color: TEXT3 },
      { category: 'Ownership age', status: 'Detected', detail: '22 years — very high ownership age signal', color: DANGER },
    ],
  },
  {
    id: 4, name: 'Sandra Okonkwo', suburb: 'Cronulla', score: 61, signals: 4,
    address: '33 Elouera Road, Cronulla NSW 2230',
    prediction: '61% chance lists within 12 months',
    recommendation: 'Nurture with suburb email series — not yet ready for direct approach.',
    signalBreakdown: [
      { category: 'Equity growth', status: 'Detected', detail: 'Equity est. ~$920k — significant value appreciation', color: WARN },
      { category: 'Ownership age', status: 'Detected', detail: '14 years — above statistical sell threshold', color: WARN },
      { category: 'Email engagement', status: 'Detected', detail: 'Opened 4 market report emails — intent rising', color: BLUE },
      { category: 'Google property searches', status: 'Monitoring', detail: 'No searches detected in 30 days', color: TEXT3 },
      { category: 'Property valuation searches', status: 'Monitoring', detail: 'No valuation tool activity detected', color: TEXT3 },
      { category: 'Social media signals', status: 'Monitoring', detail: 'No property-related social posts', color: TEXT3 },
      { category: 'Mortgage refinance activity', status: 'Monitoring', detail: 'No refinance signals detected', color: TEXT3 },
      { category: 'Council DA activity nearby', status: 'Detected', detail: '1 DA lodged next door 6 weeks ago', color: BLUE },
    ],
  },
  {
    id: 5, name: 'Thomas Brennan', suburb: 'Manly', score: 57, signals: 4,
    address: '18 Addison Road, Manly NSW 2095',
    prediction: '57% chance lists within 12 months',
    recommendation: 'Send comparable sales data — a data-driven approach will resonate.',
    signalBreakdown: [
      { category: 'Ownership age', status: 'Detected', detail: '9 years — above average sell probability', color: WARN },
      { category: 'Life event signal', status: 'Detected', detail: 'Children (20+22) leaving home — empty nester trigger', color: WARN },
      { category: 'Equity growth', status: 'Detected', detail: 'Est. $2.65M value — well above purchase price', color: WARN },
      { category: 'Google property searches', status: 'Monitoring', detail: 'No searches detected in 30 days', color: TEXT3 },
      { category: 'Property valuation searches', status: 'Monitoring', detail: 'No valuation activity detected', color: TEXT3 },
      { category: 'Social media signals', status: 'Monitoring', detail: 'No property social signals', color: TEXT3 },
      { category: 'Mortgage refinance activity', status: 'Monitoring', detail: 'No refinance activity', color: TEXT3 },
      { category: 'Council DA activity nearby', status: 'Detected', detail: 'Neighbour DA lodged for extension', color: BLUE },
    ],
  },
  {
    id: 6, name: 'Wendy Farrugia', suburb: 'Cronulla', score: 44, signals: 3,
    address: '5 Burraneer Bay Road, Cronulla NSW 2230',
    prediction: '44% chance lists within 18 months',
    recommendation: 'Add to suburb nurture campaign — monitor for additional signals.',
    signalBreakdown: [
      { category: 'Equity growth', status: 'Detected', detail: 'Strong capital growth in Cronulla market', color: BLUE },
      { category: 'Ownership age', status: 'Detected', detail: '11 years ownership', color: BLUE },
      { category: 'Google property searches', status: 'Monitoring', detail: 'No searches in last 60 days', color: TEXT3 },
      { category: 'Property valuation searches', status: 'Monitoring', detail: 'No valuation activity', color: TEXT3 },
      { category: 'Social media signals', status: 'Monitoring', detail: 'No signals detected', color: TEXT3 },
      { category: 'Mortgage refinance activity', status: 'Detected', detail: 'Refinanced 8 months ago — possible equity access', color: WARN },
      { category: 'Council DA activity nearby', status: 'Monitoring', detail: 'No nearby DAs', color: TEXT3 },
      { category: 'Life event signal', status: 'Monitoring', detail: 'No life events detected', color: TEXT3 },
    ],
  },
  {
    id: 7, name: 'Brett Calloway', suburb: 'Thirroul', score: 38, signals: 2,
    address: '22 Thirroul Esplanade, Thirroul NSW 2515',
    prediction: '38% chance lists within 18 months',
    recommendation: 'Monthly suburb email only — not yet ripe for direct contact.',
    signalBreakdown: [
      { category: 'Ownership age', status: 'Detected', detail: '7 years ownership', color: BLUE },
      { category: 'Equity growth', status: 'Detected', detail: 'Beachfront property up est. $340k since purchase', color: BLUE },
      { category: 'Google property searches', status: 'Monitoring', detail: 'No searches detected', color: TEXT3 },
      { category: 'Property valuation searches', status: 'Monitoring', detail: 'No activity', color: TEXT3 },
      { category: 'Social media signals', status: 'Monitoring', detail: 'No signals', color: TEXT3 },
      { category: 'Mortgage refinance activity', status: 'Monitoring', detail: 'No activity', color: TEXT3 },
      { category: 'Council DA activity nearby', status: 'Monitoring', detail: 'No nearby DAs', color: TEXT3 },
      { category: 'Life event signal', status: 'Monitoring', detail: 'No life events', color: TEXT3 },
    ],
  },
  {
    id: 8, name: 'Josephine Tran', suburb: 'Balgowlah', score: 29, signals: 2,
    address: '8 Beatrice Street, Balgowlah NSW 2093',
    prediction: '29% chance lists within 24 months',
    recommendation: 'Add to cold nurture list — revisit in 6 months.',
    signalBreakdown: [
      { category: 'Ownership age', status: 'Detected', detail: '5 years ownership', color: BLUE },
      { category: 'Equity growth', status: 'Detected', detail: 'Property up est. $120k — modest signal', color: BLUE },
      { category: 'Google property searches', status: 'Monitoring', detail: 'No searches', color: TEXT3 },
      { category: 'Property valuation searches', status: 'Monitoring', detail: 'No activity', color: TEXT3 },
      { category: 'Social media signals', status: 'Monitoring', detail: 'No signals', color: TEXT3 },
      { category: 'Mortgage refinance activity', status: 'Monitoring', detail: 'No activity', color: TEXT3 },
      { category: 'Council DA activity nearby', status: 'Monitoring', detail: 'No nearby DAs', color: TEXT3 },
      { category: 'Life event signal', status: 'Monitoring', detail: 'No events detected', color: TEXT3 },
    ],
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof PROSPECTS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{initials(item.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
            <span style={{ color: scoreColor(item.score), fontSize: 12, fontWeight: 700 }}>{item.score}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 12, marginBottom: 4 }}>{item.suburb}</div>
          <div style={{ fontSize: 10, color: TEXT3 }}>{item.signals} signals detected</div>
        </div>
      </div>
    </div>
  )
}

export default function SellerIntentPage() {
  const [selected, setSelected] = useState(PROSPECTS[0])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Seller Intent Detection</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>Live intent scoring — {PROSPECTS.length} prospects</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {PROSPECTS.map(p => <ListRow key={p.id} item={p} selected={selected.id === p.id} onSelect={() => setSelected(p)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Intent Profile — {selected.name}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ArrowLeft, ArrowRight, MoreHorizontal].map((Icon, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><Icon size={15} strokeWidth={1.5} /></button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, flexShrink: 0, background: avColor(selected.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>{initials(selected.name)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>{selected.name}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', background: `${scoreColor(selected.score)}18`, color: scoreColor(selected.score), fontWeight: 700 }}>Intent Score: {selected.score}</span>
              </div>
              <div style={{ color: TEXT2, fontSize: 12 }}><MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{selected.address}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ icon: Phone, color: SUCCESS },{ icon: Mail, color: BLUE },{ icon: MessageSquare, color: TEAL }].map((a, i) => {
                const Icon = a.icon
                return <button key={i} style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, color: a.color, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit' }}><Icon size={12} /></button>
              })}
            </div>
          </div>

          {/* AI Prediction */}
          <div style={{ margin: '16px 20px 0', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px', display: 'flex', gap: 12 }}>
            <Brain size={15} color={PINK} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ color: PINK, fontSize: 11, fontWeight: 700, marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Prediction</div>
              <div style={{ color: TEXT, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{selected.prediction}</div>
              <div style={{ color: TEXT2, fontSize: 13 }}>Recommended action: {selected.recommendation}</div>
            </div>
          </div>

          {/* Signal Breakdown */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Signal Breakdown — {selected.signals} of {selected.signalBreakdown.length} detected</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selected.signalBreakdown.map((sig, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}` }}>
                  <div style={{ flexShrink: 0, marginTop: 1 }}>
                    {sig.status === 'Detected'
                      ? <CheckCircle2 size={14} color={sig.color} />
                      : sig.status === 'Monitoring'
                      ? <Clock size={14} color={TEXT3} />
                      : <AlertCircle size={14} color={TEXT3} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ color: TEXT, fontSize: 13, fontWeight: 500 }}>{sig.category}</span>
                      <span style={{ fontSize: 9, padding: '1px 5px', background: `${sig.color}18`, color: sig.status === 'Detected' ? sig.color : TEXT3, fontWeight: 600 }}>{sig.status}</span>
                    </div>
                    <div style={{ color: TEXT2, fontSize: 12 }}>{sig.detail}</div>
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
