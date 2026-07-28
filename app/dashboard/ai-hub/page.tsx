'use client'
import { useState } from 'react'
import { Brain, Send, TrendingUp, Database, Mic, Video, Zap, ChevronRight, Star } from 'lucide-react'

const CARD = '#ffffff'; const CARD2 = '#f1f5f9'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'; const GREEN = '#10b981'
const AMBER = '#f59e0b'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

const MSGS = [
  { role: 'user', text: 'Who should I call today?' },
  { role: 'ai', text: `Here are your 3 highest-priority calls for today:

**1. Marcus Thornton — Bondi Beach** (Intent score: 92)
Appraisal is at 2pm today. His wife Sarah is the emotional decision-maker — lead with lifestyle, not price. Comparable at 9 Arcadia St sold for $2.55M. He's also looking at McGrath, so bring your data.

**2. The Anderson Family — Mosman** (Under Offer)
Counter-offer review at 3:30pm. They've asked for a 5-day inspection extension. Accept with a price-protection clause — David is nervous and needs reassurance this is procedural, not a red flag.

**3. Mark Spinelli — Cronulla** (Active Listing)
His campaign is 22% above benchmark and he already bought his next home. He needs a positive update to prevent vendor anxiety. 3 hot buyers attended Saturday's open.` },
  { role: 'user', text: 'Which vendors are at risk of withdrawing?' },
  { role: 'ai', text: `Based on campaign performance and communication patterns, I've identified 1 vendor showing early withdrawal signals:

**Sandra Wilson — Manly** (Listed 28 days)
- 2 previous appraisals with you, did not list either time
- Has not responded to your last 2 messages
- Comparable sales in the suburb have been slower this month
- Recommendation: Call her personally today before the appraisal tomorrow. Lead with the improved $200K estimate vs. last year. Her partner returns from overseas in August — frame timing as ideal.` },
]

const FEATURES = [
  { icon: Database,   color: BLUE,   label: 'AI Memory',           desc: 'Every conversation, forever remembered',        count: '2,847 memories' },
  { icon: Brain,      color: PURPLE, label: 'AI Research',          desc: 'Deep-dive on any person, suburb or property',   count: 'Active'          },
  { icon: Video,      color: TEAL,   label: 'Meeting Assistant',    desc: 'Joins Zoom, transcribes, creates tasks',        count: '3 transcripts'   },
  { icon: Mic,        color: GREEN,  label: 'AI Phone Assistant',   desc: 'Transcribes calls, extracts objections',        count: '47 calls logged' },
  { icon: Zap,        color: AMBER,  label: 'AI Content Engine',    desc: '1 property → 20+ pieces of content',           count: '12 campaigns'    },
  { icon: TrendingUp, color: PINK,   label: 'AI Growth Engine',     desc: 'Daily opportunity briefing — click to act',     count: '1 today'         },
]

const GROWTH = {
  property: '14 Ocean Street, Cronulla',
  owner: 'David & Karen Nguyen',
  held: '19 years',
  growth: '+11%',
  sales: 9,
  period: '30 days',
  mortgage: 'Likely low — purchased 2005 ~$680K',
  equity: 'Est. $2.1M equity',
  action: 'Send personalised CMA',
}

export default function AIHubPage() {
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState(MSGS)

  const send = () => {
    if (!input.trim()) return
    setMsgs(m => [...m, { role: 'user', text: input }, { role: 'ai', text: 'Analysing your request and checking all CRM data...' }])
    setInput('')
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* Left: Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${BORDER}`, minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: PINK_S, border: `1px solid rgba(227,0,140,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={16} color={PINK} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>AI Chief of Staff</div>
              <div style={{ fontSize: 11, color: TEXT3 }}>Your AI operating partner — knows your entire CRM</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: PINK_S, border: `1px solid rgba(227,0,140,0.2)` }}>
              <div style={{ width: 5, height: 5, background: PINK, borderRadius: 9999 }} />
              <span style={{ fontSize: 10, color: PINK, fontWeight: 600 }}>Active · Processing</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: 20, display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
              {m.role === 'ai' ? (
                <div style={{ width: 28, height: 28, background: PINK_S, border: `1px solid rgba(227,0,140,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Brain size={13} color={PINK} />
                </div>
              ) : (
                <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${BLUE}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0, marginTop: 2 }}>JY</div>
              )}
              <div style={{
                maxWidth: '80%',
                background: m.role === 'user' ? `linear-gradient(135deg, ${BLUE}20, ${PURPLE}20)` : CARD,
                border: `1px solid ${m.role === 'user' ? `${BLUE}30` : BORDER}`,
                padding: '10px 14px',
                fontSize: 12.5,
                color: TEXT2,
                lineHeight: 1.75,
                whiteSpace: 'pre-wrap',
              }}>
                {m.text.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} style={{ color: TEXT, fontWeight: 700 }}>{part}</strong> : <span key={j}>{part}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompts */}
        <div style={{ padding: '8px 20px 0', flexShrink: 0, display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' as const }}>
          {["Prep me for my 2pm appraisal", "Write vendor update for Mark Spinelli", "Find all owners in Shell Cove 10+ years", "Which buyers suit Foreshore Cres?"].map(q => (
            <button key={q} onClick={() => setInput(q)} style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, color: TEXT3, padding: '4px 10px', fontSize: 10.5, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 10, flexShrink: 0 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask your AI Chief of Staff anything..."
            style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, color: TEXT, padding: '10px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
          <button onClick={send} style={{ background: `linear-gradient(90deg, ${BLUE}, ${PINK})`, border: 'none', color: '#fff', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>
            <Send size={12} /> Send
          </button>
        </div>
      </div>

      {/* Right: Features */}
      <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* AI Growth Engine (featured) */}
        <div style={{ padding: 16, borderBottom: `1px solid ${BORDER}`, background: 'rgba(227,0,140,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <TrendingUp size={14} color={PINK} />
            <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>AI Growth Engine</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, color: PINK, background: PINK_S, padding: '2px 6px', fontWeight: 700 }}>TODAY</span>
          </div>
          <div style={{ fontSize: 11, color: TEXT3, marginBottom: 10 }}>Today your biggest opportunity is:</div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
            <div style={{ fontSize: 13, color: TEXT, fontWeight: 700, marginBottom: 4 }}>{GROWTH.property}</div>
            <div style={{ fontSize: 11, color: TEXT3, marginBottom: 8 }}>{GROWTH.owner}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
              {[
                { label: 'Held',     val: GROWTH.held     },
                { label: 'Growth',   val: GROWTH.growth   },
                { label: 'Sales/30d',val: `${GROWTH.sales} nearby`   },
                { label: 'Equity',   val: GROWTH.equity   },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(0,0,0,0.02)', padding: '6px 8px' }}>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontWeight: 700 }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: TEXT2, marginBottom: 10 }}>{GROWTH.mortgage}</div>
            <button style={{ width: '100%', background: PINK, border: 'none', color: '#fff', padding: '8px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {GROWTH.action} — One Click
            </button>
          </div>
        </div>

        {/* Feature grid */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>AI SYSTEMS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div key={f.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div style={{ width: 28, height: 28, background: `${f.color}15`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} color={f.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{f.label}</div>
                    <div style={{ fontSize: 10, color: TEXT3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.desc}</div>
                  </div>
                  <div style={{ fontSize: 10, color: f.color, fontWeight: 600, flexShrink: 0 }}>{f.count}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Memory stats */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
            <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>AI MEMORY STATS</div>
            {[
              { label: 'Contacts remembered',  val: '1,847' },
              { label: 'Calls transcribed',    val: '214'   },
              { label: 'Emails analysed',      val: '3,421' },
              { label: 'Meetings summarised',  val: '47'    },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 3 ? `1px solid ${BORDER2}` : 'none' }}>
                <span style={{ fontSize: 11, color: TEXT2 }}>{s.label}</span>
                <span style={{ fontSize: 11, color: BLUE, fontWeight: 700 }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
