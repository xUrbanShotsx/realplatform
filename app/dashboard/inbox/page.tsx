'use client'

import { useState } from 'react'
import {
  Phone, Mail, MessageSquare, MoreHorizontal,
  ArrowLeft, ArrowRight, Send, Zap, Circle,
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

type Channel = 'email' | 'sms' | 'call'
type MsgDir = 'in' | 'out'

interface Msg {
  type: Channel
  direction: MsgDir
  text: string
  time: string
}

const THREADS = [
  {
    id: 1, name: 'Marcus Thornton', channel: 'email' as Channel, preview: 'Thinking about selling — can we chat?', time: '3:46pm', unread: true,
    messages: [
      { type: 'email' as Channel, direction: 'out' as MsgDir, text: 'Hi Marcus — just wanted to check in and share some exciting news about recent sales in your area. The market in Bondi Beach has been incredibly strong. Hope all is well with Sarah — please pass on my regards.', time: '2 weeks ago 10:12am' },
      { type: 'call' as Channel, direction: 'out' as MsgDir, text: '[Call — 8 min] Spoke with Marcus. Discussed recent comparable sales. He asked about the Arcadia Street property that sold for $2.08M. Positive tone throughout.', time: 'Today 9:14am' },
      { type: 'email' as Channel, direction: 'in' as MsgDir, text: 'Hi Jye, I was looking at some recent sales in my area and thought it might be worth a conversation about where my property sits. Sarah and I have been talking about our options lately. Could we organise a time to chat?', time: 'Today 3:46pm' },
    ] as Msg[],
  },
  {
    id: 2, name: 'Nicki Lihou', channel: 'email' as Channel, preview: 'Re: 48 Woodford Avenue inspection request', time: '1:01pm', unread: true,
    messages: [
      { type: 'email' as Channel, direction: 'out' as MsgDir, text: 'Hi Nicki — thank you for your enquiry about 48 Woodford Avenue, Warilla. It\'s a lovely 4-bedroom home with a great yard that would suit two dogs perfectly! I have open homes on Saturdays 10–10:30am, or I can arrange a private inspection at any time that suits. What works for you?', time: 'Yesterday 4:30pm' },
      { type: 'email' as Channel, direction: 'in' as MsgDir, text: 'Hi Jye thank you for your email. We won\'t be attending this Saturday unfortunately but would love to book a private inspection if possible. We\'re free Thursday afternoon from 2pm. Would that work?', time: 'Today 1:01pm' },
    ] as Msg[],
  },
  {
    id: 3, name: 'James Kowalski', channel: 'sms' as Channel, preview: 'Love the renovation post! Let\'s catch up', time: '2:30pm', unread: false,
    messages: [
      { type: 'sms' as Channel, direction: 'out' as MsgDir, text: 'Hi James — just saw the kitchen reno on Instagram, absolutely stunning! The benchtops are incredible. The Paddington market is on fire right now — would love to catch up when the dust settles 😊', time: 'Today 2:18pm' },
      { type: 'sms' as Channel, direction: 'in' as MsgDir, text: 'Ha thanks! Yeah we\'re pretty stoked with how it came out. Emily deserves all the credit. Yeah let\'s catch up soon — I\'ve actually been thinking about what\'s next for us.', time: 'Today 2:30pm' },
    ] as Msg[],
  },
  {
    id: 4, name: 'Priya Mehta', channel: 'email' as Channel, preview: 'Congratulations on the new role!', time: '11:14am', unread: false,
    messages: [
      { type: 'email' as Channel, direction: 'out' as MsgDir, text: 'Hi Priya — huge congratulations on the new Atlassian role! What an exciting move. I imagine this opens up some fantastic options on the property front too — your new income bracket could unlock some really beautiful homes. Happy to share some updated options when you\'re ready!', time: 'Today 10:02am' },
      { type: 'sms' as Channel, direction: 'out' as MsgDir, text: 'Priya — sent you an email with some exciting Neutral Bay listings that might be perfect timing given the career news 🎉', time: 'Today 11:10am' },
    ] as Msg[],
  },
  {
    id: 5, name: 'Lisa Chen', channel: 'email' as Channel, preview: 'Appraisal update request — Mosman', time: '2:31pm', unread: true,
    messages: [
      { type: 'email' as Channel, direction: 'out' as MsgDir, text: 'Hi Lisa — I\'ve put together a detailed suburb report for Mosman as promised. Values in your pocket have moved strongly this year. I\'d love to organise a walk-through and provide you with a formal written appraisal when it suits.', time: '3 weeks ago' },
      { type: 'email' as Channel, direction: 'in' as MsgDir, text: 'Hi, I noticed a few properties have sold nearby recently. Would love to get an updated appraisal on the Mosman property if you have time. We\'re thinking about our options over the next year or so.', time: 'Today 2:31pm' },
    ] as Msg[],
  },
  {
    id: 6, name: 'Mark Spinelli', channel: 'call' as Channel, preview: 'Spoke about 42A Headland Parade off-market', time: '3 days ago', unread: false,
    messages: [
      { type: 'call' as Channel, direction: 'out' as MsgDir, text: '[Call — 12 min] Called Mark to discuss off-market opportunity at 42A Headland Parade. He is interested in a valuation. Prefers no open homes — wants a private buyer. Will follow up with brief.', time: '1 week ago 2:14pm' },
      { type: 'email' as Channel, direction: 'out' as MsgDir, text: 'Hi Mark — as discussed, attaching the off-market brief for 42A Headland Parade, Barrack Point. I believe this one fits your portfolio criteria well — ocean views, strong rental potential, and no agent wars. Let me know your thoughts.', time: '4 days ago' },
      { type: 'email' as Channel, direction: 'in' as MsgDir, text: 'Hi Jye, I\'ve got this exceptional home and would love your thoughts on pricing before we go to market. The views are incredible and I want to do it properly.', time: '3 days ago 2:31pm' },
    ] as Msg[],
  },
  {
    id: 7, name: 'Thomas Brennan', channel: 'call' as Channel, preview: 'Called — discussed market update', time: '1 week ago', unread: false,
    messages: [
      { type: 'email' as Channel, direction: 'out' as MsgDir, text: 'Hi Tom — hope you and Claire are well. Attaching the latest Manly suburb report — there have been some really exciting results lately including $2.615M on Addison Road. Thought it might be of interest!', time: '1 month ago' },
      { type: 'call' as Channel, direction: 'out' as MsgDir, text: '[Call — 5 min] Called Thomas. He seemed interested in the Manly sales data but said they\'re "thinking about next year." He mentioned the kids are moving out soon. Left on good terms.', time: '1 week ago' },
    ] as Msg[],
  },
  {
    id: 8, name: 'Sandra Okonkwo', channel: 'sms' as Channel, preview: 'Monthly suburb update sent', time: '3 weeks ago', unread: false,
    messages: [
      { type: 'sms' as Channel, direction: 'out' as MsgDir, text: 'Hi Sandra — Jye from Real Platform here. Just wanted to share that Cronulla is having a tremendous year — your street has seen some remarkable results. Happy to share the details if you\'re interested. No pressure at all 😊', time: '3 months ago' },
      { type: 'email' as Channel, direction: 'out' as MsgDir, text: 'Hi Sandra — attaching our Cronulla Q2 2026 market report for your reference. Values in your area have grown 14% this year — remarkable performance. If you ever want to know what your home is worth, I\'m just a call away.', time: '3 weeks ago' },
    ] as Msg[],
  },
]

const channelIcon: Record<Channel, React.ElementType> = { email: Mail, sms: MessageSquare, call: Phone }
const channelColor: Record<Channel, string> = { email: BLUE, sms: TEAL, call: SUCCESS }

function ListRow({ item, selected, onSelect }: { item: typeof THREADS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  const Icon = channelIcon[item.channel]
  const color = channelColor[item.channel]
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{initials(item.name)}</div>
          {item.unread && <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: PINK, borderRadius: '50%' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: item.unread ? 700 : 500 }}>{item.name}</span>
            <span style={{ color: TEXT3, fontSize: 10 }}>{item.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
            <Icon size={10} color={color} />
            <span style={{ color: TEXT3, fontSize: 10, textTransform: 'capitalize' }}>{item.channel}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.preview}</div>
        </div>
      </div>
    </div>
  )
}

export default function InboxPage() {
  const [selected, setSelected] = useState(THREADS[0])
  const [tab, setTab] = useState<'Email'|'SMS'|'AI Draft'>('Email')
  const [replyText, setReplyText] = useState('')

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 4px', flexShrink: 0 }}>
          {(['All','Email','SMS','Calls'] as const).map(t => (
            <button key={t} style={{ padding: '10px 10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: TEXT2, borderBottom: '2px solid transparent', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {THREADS.map(t => <ListRow key={t.id} item={t} selected={selected.id === t.id} onSelect={() => setSelected(t)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Thread — {selected.name}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ArrowLeft, ArrowRight, MoreHorizontal].map((Icon, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><Icon size={15} strokeWidth={1.5} /></button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selected.messages.map((msg, i) => {
            const Icon = channelIcon[msg.type]
            const color = channelColor[msg.type]
            const isIn = msg.direction === 'in'
            return (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: isIn ? 'row' : 'row-reverse' }}>
                <div style={{ width: 28, height: 28, flexShrink: 0, background: isIn ? avColor(selected.name) : `${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: isIn ? '#fff' : color }}>
                  {isIn ? initials(selected.name) : <Icon size={12} />}
                </div>
                <div style={{ maxWidth: '72%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexDirection: isIn ? 'row' : 'row-reverse' }}>
                    <div style={{ width: 18, height: 18, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={10} color={color} />
                    </div>
                    <span style={{ color: TEXT3, fontSize: 10 }}>{msg.time}</span>
                  </div>
                  <div style={{ background: isIn ? 'rgba(0,0,0,0.04)' : `${BLUE}18`, border: `1px solid ${isIn ? BORDER : `${BLUE}30`}`, padding: '10px 12px', color: TEXT, fontSize: 13, lineHeight: 1.6 }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Reply box */}
        <div style={{ borderTop: `1px solid ${BORDER}`, flexShrink: 0, padding: '12px 20px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {(['Email', 'SMS', 'AI Draft'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '4px 12px', background: tab === t ? PINK : 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', color: tab === t ? '#fff' : TEXT2, fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>{t}</button>
            ))}
          </div>
          {tab === 'AI Draft' ? (
            <div style={{ background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '10px 12px', color: TEXT2, fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              Hi {selected.name.split(' ')[0]} — thank you for reaching out! I\'d love to connect at your earliest convenience. I have availability this week and would be happy to arrange a time that works for you. Looking forward to speaking soon.
            </div>
          ) : (
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Reply via ${tab}...`}
              style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${BORDER}`, color: TEXT, fontSize: 13, padding: '10px 12px', resize: 'none', height: 72, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
            <button style={{ background: PINK, border: 'none', color: '#fff', padding: '7px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
              <Send size={12} /> Send {tab}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
