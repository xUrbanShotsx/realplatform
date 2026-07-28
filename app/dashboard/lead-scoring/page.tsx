'use client'

import { useState } from 'react'
import {
  TrendingUp, Brain, Zap, Activity, MoreHorizontal,
  ArrowLeft, ArrowRight, Phone, Mail, MessageSquare,
  Star, Eye, MousePointer, Download, Calendar,
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

const LEADS = [
  {
    id: 1, name: 'Marcus Thornton', suburb: 'Bondi Beach', score: 92, signals: 7, lastActivity: 'Today',
    recommendation: 'Call Now', recColor: DANGER,
    trend: [60, 65, 70, 74, 80, 85, 92],
    signals_detail: [
      { label: 'Email Opens', value: 6, max: 10, contribution: 18, icon: Mail },
      { label: 'Website Visits', value: 9, max: 10, contribution: 22, icon: MousePointer },
      { label: 'Photo Views', value: 28, max: 30, contribution: 15, icon: Eye },
      { label: 'Brochure Downloads', value: 2, max: 5, contribution: 10, icon: Download },
      { label: 'Inspection Attendance', value: 1, max: 3, contribution: 12, icon: Calendar },
      { label: 'SMS Reply Rate', value: 8, max: 10, contribution: 8, icon: MessageSquare },
      { label: 'Call Frequency', value: 4, max: 5, contribution: 7, icon: Phone },
    ],
  },
  {
    id: 2, name: 'James Kowalski', suburb: 'Paddington', score: 88, signals: 6, lastActivity: 'Yesterday',
    recommendation: 'Call Now', recColor: DANGER,
    trend: [50, 58, 65, 70, 78, 83, 88],
    signals_detail: [
      { label: 'Email Opens', value: 8, max: 10, contribution: 20, icon: Mail },
      { label: 'Website Visits', value: 7, max: 10, contribution: 18, icon: MousePointer },
      { label: 'Photo Views', value: 22, max: 30, contribution: 14, icon: Eye },
      { label: 'Brochure Downloads', value: 3, max: 5, contribution: 12, icon: Download },
      { label: 'Inspection Attendance', value: 1, max: 3, contribution: 12, icon: Calendar },
      { label: 'SMS Reply Rate', value: 6, max: 10, contribution: 7, icon: MessageSquare },
      { label: 'Call Frequency', value: 2, max: 5, contribution: 5, icon: Phone },
    ],
  },
  {
    id: 3, name: 'Lisa Chen', suburb: 'Mosman', score: 81, signals: 5, lastActivity: 'Today',
    recommendation: 'Call Now', recColor: WARN,
    trend: [45, 52, 58, 63, 68, 74, 81],
    signals_detail: [
      { label: 'Email Opens', value: 5, max: 10, contribution: 14, icon: Mail },
      { label: 'Website Visits', value: 8, max: 10, contribution: 20, icon: MousePointer },
      { label: 'Photo Views', value: 19, max: 30, contribution: 12, icon: Eye },
      { label: 'Brochure Downloads', value: 1, max: 5, contribution: 8, icon: Download },
      { label: 'Inspection Attendance', value: 0, max: 3, contribution: 0, icon: Calendar },
      { label: 'SMS Reply Rate', value: 4, max: 10, contribution: 5, icon: MessageSquare },
      { label: 'Call Frequency', value: 3, max: 5, contribution: 6, icon: Phone },
    ],
  },
  {
    id: 4, name: 'Priya Mehta', suburb: 'Neutral Bay', score: 74, signals: 5, lastActivity: 'Today',
    recommendation: 'Nurture', recColor: BLUE,
    trend: [30, 38, 44, 51, 58, 66, 74],
    signals_detail: [
      { label: 'Email Opens', value: 7, max: 10, contribution: 18, icon: Mail },
      { label: 'Website Visits', value: 6, max: 10, contribution: 15, icon: MousePointer },
      { label: 'Photo Views', value: 14, max: 30, contribution: 9, icon: Eye },
      { label: 'Brochure Downloads', value: 2, max: 5, contribution: 10, icon: Download },
      { label: 'Inspection Attendance', value: 2, max: 3, contribution: 14, icon: Calendar },
      { label: 'SMS Reply Rate', value: 3, max: 10, contribution: 4, icon: MessageSquare },
      { label: 'Call Frequency', value: 1, max: 5, contribution: 4, icon: Phone },
    ],
  },
  {
    id: 5, name: 'Nicki Lihou', suburb: 'Warilla', score: 62, signals: 4, lastActivity: 'Today',
    recommendation: 'Nurture', recColor: BLUE,
    trend: [20, 28, 35, 40, 48, 54, 62],
    signals_detail: [
      { label: 'Email Opens', value: 4, max: 10, contribution: 10, icon: Mail },
      { label: 'Website Visits', value: 9, max: 10, contribution: 22, icon: MousePointer },
      { label: 'Photo Views', value: 24, max: 30, contribution: 16, icon: Eye },
      { label: 'Brochure Downloads', value: 1, max: 5, contribution: 8, icon: Download },
      { label: 'Inspection Attendance', value: 0, max: 3, contribution: 0, icon: Calendar },
      { label: 'SMS Reply Rate', value: 2, max: 10, contribution: 3, icon: MessageSquare },
      { label: 'Call Frequency', value: 1, max: 5, contribution: 3, icon: Phone },
    ],
  },
  {
    id: 6, name: 'Sandra Okonkwo', suburb: 'Cronulla', score: 48, signals: 3, lastActivity: '5 days ago',
    recommendation: 'Nurture', recColor: TEAL,
    trend: [18, 22, 26, 30, 36, 42, 48],
    signals_detail: [
      { label: 'Email Opens', value: 4, max: 10, contribution: 12, icon: Mail },
      { label: 'Website Visits', value: 3, max: 10, contribution: 8, icon: MousePointer },
      { label: 'Photo Views', value: 9, max: 30, contribution: 6, icon: Eye },
      { label: 'Brochure Downloads', value: 0, max: 5, contribution: 0, icon: Download },
      { label: 'Inspection Attendance', value: 0, max: 3, contribution: 0, icon: Calendar },
      { label: 'SMS Reply Rate', value: 0, max: 10, contribution: 0, icon: MessageSquare },
      { label: 'Call Frequency', value: 1, max: 5, contribution: 2, icon: Phone },
    ],
  },
  {
    id: 7, name: 'Brett Calloway', suburb: 'Thirroul', score: 31, signals: 2, lastActivity: '2 weeks ago',
    recommendation: 'Cool Off', recColor: TEXT3,
    trend: [10, 14, 18, 22, 25, 28, 31],
    signals_detail: [
      { label: 'Email Opens', value: 2, max: 10, contribution: 6, icon: Mail },
      { label: 'Website Visits', value: 2, max: 10, contribution: 5, icon: MousePointer },
      { label: 'Photo Views', value: 4, max: 30, contribution: 3, icon: Eye },
      { label: 'Brochure Downloads', value: 0, max: 5, contribution: 0, icon: Download },
      { label: 'Inspection Attendance', value: 0, max: 3, contribution: 0, icon: Calendar },
      { label: 'SMS Reply Rate', value: 0, max: 10, contribution: 0, icon: MessageSquare },
      { label: 'Call Frequency', value: 0, max: 5, contribution: 0, icon: Phone },
    ],
  },
  {
    id: 8, name: 'Josephine Tran', suburb: 'Balgowlah', score: 22, signals: 1, lastActivity: '3 weeks ago',
    recommendation: 'Cool Off', recColor: TEXT3,
    trend: [8, 10, 12, 14, 17, 19, 22],
    signals_detail: [
      { label: 'Email Opens', value: 1, max: 10, contribution: 3, icon: Mail },
      { label: 'Website Visits', value: 1, max: 10, contribution: 3, icon: MousePointer },
      { label: 'Photo Views', value: 2, max: 30, contribution: 2, icon: Eye },
      { label: 'Brochure Downloads', value: 0, max: 5, contribution: 0, icon: Download },
      { label: 'Inspection Attendance', value: 0, max: 3, contribution: 0, icon: Calendar },
      { label: 'SMS Reply Rate', value: 0, max: 10, contribution: 0, icon: MessageSquare },
      { label: 'Call Frequency', value: 0, max: 5, contribution: 0, icon: Phone },
    ],
  },
]

function MiniTrend({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const W = 60, H = 20
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * H}`)
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={pts.join(' ')} />
    </svg>
  )
}

function ListRow({ item, selected, onSelect }: { item: typeof LEADS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  const c = scoreColor(item.score)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{initials(item.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
            <span style={{ color: c, fontSize: 13, fontWeight: 700 }}>{item.score}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 12, marginBottom: 4 }}>{item.suburb} &bull; {item.signals} signals</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, padding: '1px 6px', background: `${item.recColor}18`, color: item.recColor, fontWeight: 700 }}>{item.recommendation}</span>
            <MiniTrend values={item.trend} color={c} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LeadScoringPage() {
  const [selected, setSelected] = useState(LEADS[0])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Lead Scoring</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>Live engagement scores — {LEADS.length} leads</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {LEADS.map(l => <ListRow key={l.id} item={l} selected={selected.id === l.id} onSelect={() => setSelected(l)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Score Breakdown — {selected.name}</h2>
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
                <span style={{ fontSize: 10, padding: '2px 8px', background: `${scoreColor(selected.score)}18`, color: scoreColor(selected.score), fontWeight: 700 }}>Score: {selected.score}/100</span>
              </div>
              <div style={{ color: TEXT2, fontSize: 12 }}>{selected.suburb} &bull; Last activity: {selected.lastActivity}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ icon: Phone, color: SUCCESS },{ icon: Mail, color: BLUE },{ icon: MessageSquare, color: TEAL }].map((a, i) => {
                const Icon = a.icon
                return <button key={i} style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, color: a.color, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit' }}><Icon size={12} /></button>
              })}
            </div>
          </div>

          {/* AI Recommendation */}
          <div style={{ margin: '16px 20px 0', background: `${selected.recColor}12`, border: `1px solid ${selected.recColor}30`, padding: '12px 16px', display: 'flex', gap: 12 }}>
            <Zap size={15} color={selected.recColor} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ color: selected.recColor, fontSize: 11, fontWeight: 700, marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Recommendation</div>
              <div style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>{selected.recommendation}</div>
              <div style={{ color: TEXT2, fontSize: 12, marginTop: 2 }}>Based on {selected.signals} active engagement signals in the last 30 days.</div>
            </div>
          </div>

          {/* Score trend */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, marginTop: 16 }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>Score Trend (7 days)</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 48 }}>
              {selected.trend.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: '100%', background: i === selected.trend.length - 1 ? scoreColor(selected.score) : `${scoreColor(selected.score)}40`, height: `${(v / 100) * 40}px` }} />
                  <span style={{ color: TEXT3, fontSize: 9 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Breakdown */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Signal Category Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.signals_detail.map((s, i) => {
                const Icon = s.icon
                const pct = s.max > 0 ? (s.value / s.max) * 100 : 0
                const barColor = pct > 70 ? SUCCESS : pct > 40 ? WARN : BLUE
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, flexShrink: 0, background: `${BLUE}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={12} color={BLUE} strokeWidth={1.5} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: TEXT, fontSize: 12 }}>{s.label}</span>
                        <span style={{ color: TEXT3, fontSize: 11 }}>{s.value}/{s.max} &nbsp;+{s.contribution}pts</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(0,0,0,0.05)' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: barColor }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
