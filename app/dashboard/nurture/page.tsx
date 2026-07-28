'use client'
import { useState, useEffect } from 'react'
import { Mail, Phone, MessageSquare, Video, Brain, Zap, Heart, Users, Play, CheckCircle } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['Smart Campaigns', 'AI Voice', 'AI SMS', 'AI Email', 'Life Events']

type Campaign = {
  name: string; type: string; typeColor: string; enrolled: number; active: boolean
  openRate: string; replyRate: string; description: string
  steps: { icon: React.ElementType; label: string; timing: string; color: string }[]
}

const CAMPAIGNS: Campaign[] = [
  {
    name: 'New Buyer Nurture', type: 'Buyers', typeColor: BLUE, enrolled: 34, active: true,
    openRate: '72%', replyRate: '18%',
    description: 'Automated sequence for new buyer leads. 30 days of personalised touchpoints.',
    steps: [
      { icon: Mail,    label: 'Welcome + suburb report',     timing: 'Day 1',  color: BLUE    },
      { icon: Phone,   label: 'AI Voice: "Found anything?"',timing: 'Day 3',  color: GREEN   },
      { icon: MessageSquare, label: 'SMS: 3 new properties',timing: 'Day 7',  color: AMBER   },
      { icon: Mail,    label: 'Auction results digest',      timing: 'Day 14', color: BLUE    },
      { icon: Video,   label: 'Personalised video update',   timing: 'Day 21', color: PURPLE  },
      { icon: Brain,   label: 'AI: score & qualify',         timing: 'Day 30', color: PINK    },
    ],
  },
  {
    name: 'Seller Warmup', type: 'Sellers', typeColor: PINK, enrolled: 12, active: true,
    openRate: '81%', replyRate: '31%',
    description: 'Long-term nurture for potential sellers. Builds trust and urgency over 90 days.',
    steps: [
      { icon: Mail,    label: 'Your home value has changed', timing: 'Day 1',  color: PINK    },
      { icon: Brain,   label: 'AI: personalise message',     timing: 'Day 3',  color: PURPLE  },
      { icon: Phone,   label: 'AI Voice: check-in call',     timing: 'Day 7',  color: GREEN   },
      { icon: Mail,    label: 'Suburb sales snapshot',       timing: 'Day 21', color: BLUE    },
      { icon: MessageSquare, label: 'SMS: "Ready to chat?"', timing: 'Day 45', color: AMBER   },
      { icon: Brain,   label: 'AI: score urgency',           timing: 'Day 90', color: PINK    },
    ],
  },
  {
    name: 'Investor Pipeline', type: 'Investors', typeColor: AMBER, enrolled: 8, active: true,
    openRate: '68%', replyRate: '24%',
    description: 'Monthly data-driven updates for property investors. Yield, vacancy, market changes.',
    steps: [
      { icon: Mail,    label: 'Monthly yield report',        timing: 'Day 1',  color: AMBER   },
      { icon: Brain,   label: 'AI: new opportunity match',   timing: 'Day 7',  color: PURPLE  },
      { icon: MessageSquare, label: 'SMS: hot property alert',timing: 'Day 14', color: TEAL  },
      { icon: Phone,   label: 'AI Voice: strategy call',     timing: 'Day 30', color: GREEN   },
    ],
  },
]

const LIFE_EVENTS = [
  { contact: 'Michael Tran', event: 'Settlement anniversary', date: 'Tomorrow', color: TEAL,   aiAction: 'AI sending congratulations + market update email tonight' },
  { contact: 'Karen Anderson', event: 'Birthday',            date: '28 Jul',   color: PINK,   aiAction: 'AI sending personalised birthday message + gift card' },
  { contact: 'Jye San Jurjo (client)', event: '1 year in new home', date: '2 Aug', color: GREEN, aiAction: 'AI preparing market value update + referral ask' },
  { contact: 'Paul & Deborah Starr', event: 'Wedding anniversary', date: '10 Aug', color: PURPLE, aiAction: 'AI scheduling a handwritten card notification' },
]

const VOICE_CALLS = [
  { contact: 'Tom & Lucy Gardiner', script: '"Hi Tom, this is the Spinelli RE AI assistant — I\'m calling because we just had a new listing come to market that matches your search criteria exactly. Would you like me to book a private inspection today?"', status: 'Scheduled', time: '9:00am tomorrow', color: BLUE },
  { contact: 'Sandra Wilson',      script: '"Hi Sandra, I\'m calling from Spinelli RE — just wanted to check in ahead of Tuesday\'s appraisal and let you know the market has moved strongly in your favour since we last spoke. Our agent has some exciting numbers to share with you."', status: 'Scheduled', time: '10:30am Mon', color: PINK },
  { contact: 'James Wu',           script: '"Hi James, quick update — a 4.2% yield property just hit my radar in the Sutherland Shire. It ticks all your criteria. Happy to send you the details now?"', status: 'Completed', time: 'Yesterday', color: AMBER },
]

export default function NurturePage() {
  const [tab, setTab] = useState(0)
  const [sel, setSel] = useState(CAMPAIGNS[0])

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    const map: Record<string, number> = { campaigns: 0, voice: 1, sms: 2, email: 3, life: 4 }
    if (t && map[t] !== undefined) setTab(map[t])
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${PINK}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '12px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 0 && (
          <div style={{ display: 'flex', height: '100%' }}>
            {/* Left: campaign list */}
            <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 11, color: TEXT3 }}>3 active campaigns · 54 enrolled</div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {CAMPAIGNS.map((c, i) => (
                  <div key={i} onClick={() => setSel(c)} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.name === c.name ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${sel.name === c.name ? c.typeColor : 'transparent'}` }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, marginBottom: 3 }}>{c.name}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: c.typeColor, background: `${c.typeColor}15`, padding: '1px 6px', fontWeight: 700 }}>{c.type.toUpperCase()}</span>
                      <span style={{ fontSize: 10, color: TEXT3 }}>{c.enrolled} enrolled</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 10, color: GREEN }}>Open: {c.openRate}</span>
                      <span style={{ fontSize: 10, color: BLUE }}>Reply: {c.replyRate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: campaign detail */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{sel.name}</div>
                <p style={{ margin: 0, fontSize: 13, color: TEXT2 }}>{sel.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                {[
                  { label: 'Enrolled', val: `${sel.enrolled}`, color: BLUE  },
                  { label: 'Open Rate',  val: sel.openRate,     color: GREEN },
                  { label: 'Reply Rate', val: sel.replyRate,    color: PINK  },
                ].map(m => (
                  <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: '-0.04em', marginBottom: 3 }}>{m.val}</div>
                    <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Sequence Steps</div>
                <div style={{ position: 'relative', paddingLeft: 16 }}>
                  <div style={{ position: 'absolute', left: 11, top: 16, bottom: 16, width: 2, background: BORDER }} />
                  {sel.steps.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, position: 'relative' }}>
                        <div style={{ width: 28, height: 28, background: `${s.color}20`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                          <Icon size={12} color={s.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{s.label}</div>
                          <div style={{ fontSize: 10, color: TEXT3 }}>{s.timing}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div style={{ overflowY: 'auto', padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {VOICE_CALLS.map((v, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${v.color}`, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Phone size={14} color={v.color} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{v.contact}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: v.status === 'Completed' ? GREEN : AMBER, background: `${v.status === 'Completed' ? GREEN : AMBER}15`, padding: '2px 7px', fontWeight: 700 }}>{v.status}</span>
                  <span style={{ fontSize: 10, color: TEXT3 }}>{v.time}</span>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: 12 }}>
                  <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>AI VOICE SCRIPT</div>
                  <p style={{ margin: 0, fontSize: 12, color: TEXT2, lineHeight: 1.7, fontStyle: 'italic' }}>{v.script}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div style={{ overflowY: 'auto', padding: 24, height: '100%' }}>
            <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Brain size={13} color={PINK} /><span style={{ fontSize: 10, color: PINK, fontWeight: 700 }}>✦ AI SMS ENGINE — Today</span></div>
              <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>4 SMS messages scheduled today. AI personalises each based on CRM data, contact preferences, and behaviour signals. Open rate: 94%.</p>
            </div>
            {[
              { contact: 'Tom & Lucy Gardiner', msg: 'Hi Tom! Just a heads up — we have a private showing available for 42 Foreshore Cres tomorrow at 11am. Want to lock it in? — Jye, Spinelli RE', time: '9:00am' },
              { contact: 'Paul & Deborah Starr', msg: 'Hi Paul, the Cronulla clearance rate hit 74% this week — highest in 3 years. Happy to chat about what this means for your property? — Jye', time: '10:30am' },
              { contact: 'James Wu', msg: 'Hi James, the property I mentioned is now available for private viewing. 4.2% yield, 3bed in Gymea Bay. Available tomorrow 2pm? — Jye, Spinelli RE', time: '2:00pm' },
            ].map((s, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MessageSquare size={12} color={AMBER} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{s.contact}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3 }}>{s.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: TEXT2, lineHeight: 1.6 }}>{s.msg}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 3 && (
          <div style={{ overflowY: 'auto', padding: 24, height: '100%' }}>
            <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Brain size={13} color={PINK} /><span style={{ fontSize: 10, color: PINK, fontWeight: 700 }}>✦ AI EMAIL ENGINE</span></div>
              <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>7 emails sending this week. Each is individually generated — different subject line, content, and CTA based on each contact's profile, behaviour, and lifecycle stage. Average open rate: 72%.</p>
            </div>
            {[
              { contact: 'Sandra Wilson', subject: 'Your Manly property has grown by $200,000', opens: '—', status: 'Scheduled', time: 'Mon 8:00am', color: PINK },
              { contact: 'Marcus Thornton', subject: 'July market results for Cronulla', opens: '1 open', status: 'Sent', time: 'Fri 9:15am', color: PURPLE },
              { contact: 'Paul & Deborah Starr', subject: 'What\'s selling in Caringbah right now?', opens: '3 opens', status: 'Sent', time: 'Thu 10:30am', color: AMBER },
            ].map((e, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${e.color}`, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Mail size={12} color={e.color} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{e.contact}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 9, color: e.status === 'Sent' ? GREEN : AMBER, background: `${e.status === 'Sent' ? GREEN : AMBER}15`, padding: '2px 7px', fontWeight: 700 }}>{e.status}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: TEXT2, marginBottom: 3 }}>{e.subject}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 10, color: TEXT3 }}>
                  <span>{e.time}</span>
                  <span>{e.opens}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 4 && (
          <div style={{ overflowY: 'auto', padding: 24, height: '100%' }}>
            <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Heart size={13} color={PINK} /><span style={{ fontSize: 10, color: PINK, fontWeight: 700 }}>✦ AI LIFE EVENTS</span></div>
              <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>AI monitors your database for birthdays, settlement anniversaries, purchase anniversaries, and major life events — then automatically sends the right message at the right moment.</p>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Upcoming Life Events</div>
              {LIFE_EVENTS.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 16px', borderBottom: i < LIFE_EVENTS.length - 1 ? `1px solid ${BORDER2}` : 'none', borderLeft: `3px solid ${e.color}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>{e.contact}</div>
                    <div style={{ fontSize: 11, color: e.color, fontWeight: 700, marginBottom: 2 }}>{e.event}</div>
                    <div style={{ fontSize: 11, color: TEXT3, display: 'flex', alignItems: 'center', gap: 4 }}><Brain size={9} color={PINK} />{e.aiAction}</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: TEXT3 }}>{e.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
