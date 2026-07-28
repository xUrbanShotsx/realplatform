'use client'

import { useState } from 'react'
import {
  Home, MoreHorizontal, ArrowLeft, ArrowRight, MapPin,
  TrendingUp, Brain, Zap, Copy, Phone, Mail, MessageSquare,
  Eye, Lock,
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
function equityColor(level: string) {
  if (level === 'Very High') return DANGER
  if (level === 'High') return WARN
  return BLUE
}

const PREDICTIONS = [
  {
    id: 1, name: 'Lisa Chen', address: '7 Raglan Street, Mosman NSW 2088', equity: 'Very High',
    years: 22, confidence: 89,
    signals: ['Full equity — no mortgage', 'Parents moving into aged care', 'Children left the family home', '22-year ownership — above statistical peak', 'Has requested updated appraisal'],
    approach: 'Personalised Letter',
    letter: `Dear Lisa,

I hope you\'re well. As someone who has owned your beautiful home in Mosman for over 22 years, you\'ve built extraordinary equity and created a wonderful family home.

I understand you may be thinking about the next chapter — and if that involves your Mosman property, I\'d love to be the one to help you navigate it.

In the past 90 days, we\'ve achieved outstanding results for vendors in your exact pocket of Mosman — including $2.615M for a comparable 3-bedroom home in July. Your property could comfortably exceed that.

I\'d love to stop by for a no-obligation coffee and walk-through when it suits you. There\'s absolutely no pressure — just a conversation about your options.

Warm regards,
Jye Sanjurjo`,
  },
  {
    id: 2, name: 'Sandra Okonkwo', address: '33 Elouera Road, Cronulla NSW 2230', equity: 'Very High',
    years: 14, confidence: 83,
    signals: ['Equity approximately $920k above purchase price', '14 years ownership', 'Opened 4 email campaigns — engagement rising', 'Minor renovation activity detected', 'No mortgage confirmed'],
    approach: 'SMS First, Then Call',
    letter: `Hi Sandra, it\'s Jye from Real Platform. I noticed Cronulla values have shifted significantly this year and thought of you — your Elouera Road property could be worth considerably more than you might think. I\'d love to share a quick desktop estimate with no obligation. Would that be okay? Happy to pop it in a text or email — whichever you prefer. 😊`,
  },
  {
    id: 3, name: 'Thomas Brennan', address: '18 Addison Road, Manly NSW 2095', equity: 'High',
    years: 9, confidence: 74,
    signals: ['Children leaving home — empty nester signal', '$230k equity growth this year', 'No mortgage', 'Facebook post: "house feels a lot bigger"', '9-year ownership threshold reached'],
    approach: 'Comparable Sales Email',
    letter: `Hi Tom,

I hope you and Claire are well. I wanted to share something that I think you\'ll find interesting — we just sold a home on Addison Road for $2,615,000 at auction last week.

As your closest neighbour in terms of profile, that result is directly relevant to your own property. Based on what I\'m seeing in the market, your home could achieve a similar outcome — possibly higher given your aspect and land size.

I know selling is a big decision, but the market right now is genuinely as strong as I\'ve seen it. Even if you\'re just curious, I\'d love to put together a formal appraisal for you — no cost, no obligation.

Worth a quick chat?

Jye`,
  },
  {
    id: 4, name: 'Brett Calloway', address: '22 Thirroul Esplanade, Thirroul NSW 2515', equity: 'High',
    years: 7, confidence: 61,
    signals: ['Extended European travel — emotional detachment from home', '7 years ownership', 'Domain listing view spike detected on return', 'Beachfront — high equity appreciation', 'Digital nomad lifestyle post detected'],
    approach: 'Cold Call Script',
    letter: `COLD CALL SCRIPT:

"Hi Brett, it\'s Jye from Real Platform — welcome back from your travels! Hope you had an amazing trip. Quick question — while you were away, I noticed the Thirroul Esplanade market has had some incredible movement. I\'d love to share what similar properties have been achieving — do you have 5 minutes this week? No agenda at all, just thought you\'d want to know."

[If yes]: "Fantastic. When suits? I can come to you or do a quick video call if that\'s easier."

[If hesitant]: "No worries at all — I\'ll drop a quick suburb report in your inbox and you can reach out when the timing feels right."`,
  },
  {
    id: 5, name: 'Wendy Farrugia', address: '5 Burraneer Bay Road, Cronulla NSW 2230', equity: 'Very High',
    years: 11, confidence: 58,
    signals: ['11 years ownership', 'Value softening slightly — optimal sell window', 'No mortgage', 'DA activity at neighbouring property', 'Refinanced 8 months ago — possible equity access'],
    approach: 'Letterbox Drop',
    letter: `WE JUST SOLD A HOME NEAR YOURS.

5 Burraneer Bay Road area — recent result: $2,420,000.

Your property may be worth more than you think.

I specialise in Cronulla properties and have serious buyers looking right now. If you\'ve ever thought about what your home might be worth in today\'s market, now is the perfect time to find out.

Jye Sanjurjo — Real Platform
📱 0412 000 111 | jye@realplatform.com.au

QR Code: [Scan for instant desktop estimate]

NO OBLIGATION. NO PRESSURE. JUST NUMBERS.`,
  },
  {
    id: 6, name: 'Margaret Hollingsworth', address: '4 Balmoral Avenue, Mosman NSW 2088', equity: 'Very High',
    years: 31, confidence: 72,
    signals: ['31 years ownership — exceptional longevity signal', 'No mortgage — full equity', 'Council rates paid as single occupant', 'No family activity on social media — possible empty nester', 'Property last sold in 1995 for $510,000'],
    approach: 'Personalised Letter',
    letter: `Dear Margaret,

I trust this letter finds you well. I\'m reaching out as a local real estate specialist who works with homeowners in your wonderful part of Mosman.

Your home at 4 Balmoral Avenue has been in your care for over three decades — a testament to the life you\'ve built there. Properties with your kind of history and position are genuinely rare, and the buyers who seek them out are equally special.

You may not have given much thought to selling — and that\'s perfectly understandable. But in today\'s market, homes like yours are achieving extraordinary prices, and I work discreetly with off-market buyers who would treat such a home with the respect it deserves.

If you\'d ever like to understand what your property is worth in today\'s market, I\'d be honoured to visit at a time convenient to you. There is absolutely no obligation, and complete confidentiality is guaranteed.

With kind regards,
Jye Sanjurjo`,
  },
  {
    id: 7, name: 'Robert Mackenzie', address: '14 Pacific Parade, Cronulla NSW 2230', equity: 'High',
    years: 8, confidence: 49,
    signals: ['8 years ownership', 'New business directorship registered — capital event possible', 'Equity growth est. $380k above purchase', 'No mortgage activity in 3 years'],
    approach: 'Cold Call Script',
    letter: `COLD CALL SCRIPT:

"Hi Robert, it\'s Jye from Real Platform. I work with property owners in Cronulla and I\'ve been tracking some incredible results in Pacific Parade lately. I noticed your property hasn\'t been tested in the market for 8 years — you might be sitting on significantly more than you realise. Do you have 5 minutes for a quick chat?"`,
  },
  {
    id: 8, name: 'Dorothy Papadopoulos', address: '9 Brighton Street, Cronulla NSW 2230', equity: 'High',
    years: 19, confidence: 44,
    signals: ['19 years ownership', 'No mortgage', 'No digital footprint — traditional approach required', 'Council rates suggest single occupant'],
    approach: 'Letterbox Drop',
    letter: `SOLD NEARBY — YOUR HOME COULD BE NEXT.

Recent Cronulla result: $1,780,000 on Elouera Road.

As a local specialist, I\'m constantly working with buyers who are specifically looking for properties in your street. If you\'ve been considering your options, now is an excellent time.

Call or text: Jye Sanjurjo — Real Platform
0412 000 111`,
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof PREDICTIONS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{initials(item.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
            <span style={{ color: equityColor(item.equity), fontSize: 12, fontWeight: 700 }}>{item.confidence}%</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{item.address}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 9, padding: '1px 6px', background: `${equityColor(item.equity)}18`, color: equityColor(item.equity), fontWeight: 700 }}>Equity: {item.equity}</span>
            <span style={{ fontSize: 9, color: TEXT3 }}>{item.years}yrs</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OffMarketPage() {
  const [selected, setSelected] = useState(PREDICTIONS[0])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Off-Market Predictions</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>{PREDICTIONS.length} predicted sellers</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {PREDICTIONS.sort((a,b) => b.confidence - a.confidence).map(p => <ListRow key={p.id} item={p} selected={selected.id === p.id} onSelect={() => setSelected(p)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Off-Market Profile — {selected.name}</h2>
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
                <span style={{ fontSize: 9, padding: '2px 7px', background: `${equityColor(selected.equity)}18`, color: equityColor(selected.equity), fontWeight: 700 }}>Equity: {selected.equity}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', background: PINK + '18', color: PINK, fontWeight: 700 }}>Confidence: {selected.confidence}%</span>
              </div>
              <div style={{ color: TEXT2, fontSize: 12 }}><MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{selected.address} &bull; {selected.years} years owned</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ icon: Phone, color: SUCCESS },{ icon: Mail, color: BLUE },{ icon: MessageSquare, color: TEAL }].map((a, i) => {
                const Icon = a.icon
                return <button key={i} style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, color: a.color, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit' }}><Icon size={12} /></button>
              })}
            </div>
          </div>

          {/* AI Signals */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>AI Signals Detected</div>
            {selected.signals.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 4, height: 4, background: PINK, flexShrink: 0, marginTop: 5 }} />
                <span style={{ color: TEXT2, fontSize: 13 }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Approach */}
          <div style={{ margin: '16px 20px 0', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px' }}>
            <div style={{ color: PINK, fontSize: 11, fontWeight: 700, marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Recommended Approach</div>
            <div style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>{selected.approach}</div>
          </div>

          {/* Outreach Draft */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI-Drafted Outreach</div>
              <button style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}30`, color: BLUE, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'inherit' }}>
                <Copy size={11} /> Copy
              </button>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '14px 16px', color: TEXT2, fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {selected.letter}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
