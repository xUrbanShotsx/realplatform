'use client'

import { useState } from 'react'
import {
  Phone, Mail, MessageSquare, Brain, Activity, TrendingUp,
  MoreHorizontal, ArrowLeft, ArrowRight, Zap, Heart,
  AlertCircle, Star, Calendar,
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

const CONTACTS = [
  {
    id: 1, name: 'Marcus Thornton', suburb: 'Bondi Beach', health: 'Strong', healthColor: SUCCESS, score: 94,
    personality: 'Analytical', commPref: 'Phone calls, morning', decisionStyle: 'Research-heavy, slow to commit',
    writingStyle: 'Formal with occasional humour. Uses full sentences. No slang.',
    sentiment: 'Positive', sentimentPct: 84,
    memory: ['Wife: Sarah (hip surgery recovery)', 'Labrador: Archie', 'Grew up in Cronulla', 'Proud of his garden', 'Hates feeling rushed'],
    nextAction: 'Call Tuesday before 10am — ask about Sarah\'s recovery before any property discussion.',
    history: [
      { type: 'call', text: 'Called — 8 min. Warm and engaged. Mentioned reviewing sales data.', time: 'Today 9:14am' },
      { type: 'email', text: 'Email received — valuation request.', time: 'Today 3:46pm' },
      { type: 'web', text: 'Searched "property valuation Bondi Beach."', time: '2 days ago' },
    ],
  },
  {
    id: 2, name: 'Lisa Chen', suburb: 'Mosman', health: 'Warm', healthColor: WARN, score: 78,
    personality: 'Amiable', commPref: 'Email, no phone before 10am', decisionStyle: 'Consensus-driven, involves family',
    writingStyle: 'Brief and polite. Bullet points preferred. Very measured.',
    sentiment: 'Neutral', sentimentPct: 52,
    memory: ['Elderly parents moving into care', 'Long ownership 22 yrs, full equity', 'Dislikes pushy agents', 'Considering Mosman apartment downsizer'],
    nextAction: 'Send personalised email referencing parents\' transition. Do not call — she has indicated email only.',
    history: [
      { type: 'email', text: 'Email received requesting updated appraisal.', time: 'Today 2:31pm' },
      { type: 'web', text: 'Viewed 4 competitor Mosman listings.', time: 'This week' },
    ],
  },
  {
    id: 3, name: 'James Kowalski', suburb: 'Paddington', health: 'Strong', healthColor: SUCCESS, score: 88,
    personality: 'Emotional', commPref: 'Instagram DM and email', decisionStyle: 'Impulse-leaning, influenced by aesthetics',
    writingStyle: 'Casual, conversational, uses emoji occasionally. Responds well to compliments on the property.',
    sentiment: 'Positive', sentimentPct: 91,
    memory: ['Partner: Emily (interior designer)', 'Two kids in primary school', 'Active on social media', 'Reno just completed — kitchen'],
    nextAction: 'Comment positively on the renovation Instagram post, then DM with a soft market value mention.',
    history: [
      { type: 'social', text: 'Posted kitchen reno on Instagram — 847 likes.', time: 'Yesterday' },
      { type: 'email', text: 'Email — renovation update, mentions "what\'s next."', time: 'Yesterday 3:41pm' },
    ],
  },
  {
    id: 4, name: 'Thomas Brennan', suburb: 'Manly', health: 'Warm', healthColor: WARN, score: 67,
    personality: 'Direct', commPref: 'Brief phone calls', decisionStyle: 'Logical, financially driven',
    writingStyle: 'Concise. No fluff. Appreciates data and numbers upfront.',
    sentiment: 'Neutral', sentimentPct: 60,
    memory: ['Wife: Claire (nurse at Manly Hospital)', 'Kids 20 + 22 leaving home', 'No mortgage', 'Skeptical of agent commissions'],
    nextAction: 'Send suburb comparable sales report — let the data do the talking. Follow up with a 3-min call.',
    history: [
      { type: 'call', text: 'Called — 5 min. Mentioned "maybe next year."', time: '1 week ago' },
      { type: 'email', text: 'Sent Manly market report.', time: '1 month ago' },
    ],
  },
  {
    id: 5, name: 'Priya Mehta', suburb: 'Neutral Bay', health: 'Warm', healthColor: WARN, score: 71,
    personality: 'Analytical', commPref: 'Email with data', decisionStyle: 'Spreadsheet-driven, compares all options',
    writingStyle: 'Professional and precise. Appreciates detailed breakdowns and timelines.',
    sentiment: 'Positive', sentimentPct: 74,
    memory: ['Partner: Raj (software engineer)', 'Budget ~$1.4M after new Atlassian role', 'First purchase, thorough researcher'],
    nextAction: 'Send a curated "first home buyer roadmap" email — she values structure and information.',
    history: [
      { type: 'social', text: 'LinkedIn: Started new role at Atlassian.', time: 'Today 9am' },
      { type: 'sms', text: 'SMS sent: Neutral Bay market update.', time: '2 weeks ago' },
    ],
  },
  {
    id: 6, name: 'Sandra Okonkwo', suburb: 'Cronulla', health: 'At Risk', healthColor: DANGER, score: 41,
    personality: 'Amiable', commPref: 'SMS preferred', decisionStyle: 'Avoidant, needs social proof',
    writingStyle: 'Friendly but brief. Responds to testimonials and case studies.',
    sentiment: 'Neutral', sentimentPct: 45,
    memory: ['14 years in Cronulla home', 'No mortgage, ~$920k equity', 'Opened 4 emails, no replies yet'],
    nextAction: 'Send an SMS with a local success story — "We just sold X nearby for $Y — yours could be worth even more."',
    history: [
      { type: 'email', text: 'Opened Q2 market report email.', time: '5 days ago' },
      { type: 'sms', text: 'SMS sent — no reply.', time: '3 weeks ago' },
    ],
  },
  {
    id: 7, name: 'Mark Spinelli', suburb: 'Barrack Point', health: 'Strong', healthColor: SUCCESS, score: 82,
    personality: 'Direct', commPref: 'Direct phone, no emails', decisionStyle: 'Decisive, high confidence',
    writingStyle: 'Short and blunt. Bullet points. Hates wasted words.',
    sentiment: 'Positive', sentimentPct: 88,
    memory: ['3 investment properties', 'Prefers off-market', 'Golf club member', 'Accountant: Steve Riordan'],
    nextAction: 'Call to discuss the off-market opportunity at 14 Headland. He wants exclusive access.',
    history: [
      { type: 'call', text: 'Called — 12 min. Interested in Headland Parade off-market.', time: '3 days ago' },
      { type: 'email', text: 'Sent off-market property brief.', time: '1 week ago' },
    ],
  },
  {
    id: 8, name: 'Nicki Lihou', suburb: 'Warilla', health: 'Cold', healthColor: TEXT3, score: 29,
    personality: 'Emotional', commPref: 'Email', decisionStyle: 'Anxiety-driven, needs reassurance',
    writingStyle: 'Wordy and cautious. Responds well to empathy and patience cues.',
    sentiment: 'Neutral', sentimentPct: 38,
    memory: ['First home buyer, nervous', 'Pre-approved $720k', 'Has 2 dogs', 'Missed last open home'],
    nextAction: 'Send a reassuring email: "First home buying tips — no pressure" style. Do not hard sell.',
    history: [
      { type: 'email', text: 'Replied to inspection query for 48 Woodford Ave.', time: 'Today' },
      { type: 'web', text: 'Browsed 12 REA listings this week.', time: 'This week' },
    ],
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof CONTACTS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{initials(item.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
            <span style={{ color: TEXT3, fontSize: 11 }}>Score {item.score}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 12, marginBottom: 4 }}>{item.suburb} &bull; {item.personality}</div>
          <span style={{ fontSize: 9, padding: '1px 6px', background: `${item.healthColor}18`, color: item.healthColor, fontWeight: 700 }}>{item.health}</span>
        </div>
      </div>
    </div>
  )
}

export default function RelationshipsPage() {
  const [selected, setSelected] = useState(CONTACTS[0])
  const iconMap: Record<string, React.ElementType> = { call: Phone, email: Mail, sms: MessageSquare, social: Zap, web: Activity }
  const colorMap: Record<string, string> = { call: SUCCESS, email: BLUE, sms: TEAL, social: PURPLE, web: TEXT3 }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>AI Relationship Engine</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>{CONTACTS.length} contacts tracked</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {CONTACTS.sort((a,b) => b.score - a.score).map(c => (
            <ListRow key={c.id} item={c} selected={selected.id === c.id} onSelect={() => setSelected(c)} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>AI Relationship Profile — {selected.name}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ArrowLeft, ArrowRight, MoreHorizontal].map((Icon, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><Icon size={15} strokeWidth={1.5} /></button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Header strip */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, flexShrink: 0, background: avColor(selected.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>{initials(selected.name)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>{selected.name}</span>
                <span style={{ fontSize: 9, padding: '2px 7px', background: `${selected.healthColor}18`, color: selected.healthColor, fontWeight: 700 }}>{selected.health}</span>
              </div>
              <div style={{ color: TEXT2, fontSize: 12 }}>{selected.suburb} &bull; Relationship Score: <span style={{ color: PINK, fontWeight: 700 }}>{selected.score}/100</span></div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ icon: Phone, color: SUCCESS },{ icon: Mail, color: BLUE },{ icon: MessageSquare, color: TEAL }].map((a, i) => {
                const Icon = a.icon
                return <button key={i} style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, color: a.color, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit' }}><Icon size={12} /></button>
              })}
            </div>
          </div>

          {/* Personality profile */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Personality Profile</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Personality Type', value: selected.personality },
                { label: 'Communication Preference', value: selected.commPref },
                { label: 'Decision Style', value: selected.decisionStyle },
                { label: 'AI Writing Style Learned', value: selected.writingStyle },
              ].map(row => (
                <div key={row.label} style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '10px 12px' }}>
                  <div style={{ color: TEXT3, fontSize: 10, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{row.label}</div>
                  <div style={{ color: TEXT, fontSize: 12, lineHeight: 1.5 }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>Emotional Sentiment — Last Interaction</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: TEXT2, fontSize: 12 }}>{selected.sentiment}</span>
                  <span style={{ color: selected.sentimentPct > 70 ? SUCCESS : selected.sentimentPct > 50 ? WARN : DANGER, fontSize: 12, fontWeight: 700 }}>{selected.sentimentPct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ height: '100%', width: `${selected.sentimentPct}%`, background: selected.sentimentPct > 70 ? SUCCESS : selected.sentimentPct > 50 ? WARN : DANGER, transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Memory */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Brain size={13} color={TEXT3} />
              <span style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Memory System</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selected.memory.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 4, height: 4, background: PINK, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ color: TEXT2, fontSize: 13, lineHeight: 1.5 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Action */}
          <div style={{ margin: '16px 20px', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px', display: 'flex', gap: 12 }}>
            <Zap size={15} color={PINK} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ color: PINK, fontSize: 11, fontWeight: 700, marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Suggested Next Action</div>
              <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.5 }}>{selected.nextAction}</div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Activity size={13} color={TEXT3} />
              <span style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Relationship Timeline</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.history.map((h, i) => {
                const Icon = iconMap[h.type] || Mail
                const color = colorMap[h.type] || TEXT3
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, flexShrink: 0, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={12} color={color} strokeWidth={1.5} /></div>
                    <div>
                      <div style={{ color: TEXT, fontSize: 13 }}>{h.text}</div>
                      <div style={{ color: TEXT3, fontSize: 11, marginTop: 1 }}>{h.time}</div>
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
