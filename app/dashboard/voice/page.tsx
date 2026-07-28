'use client'

import { useState } from 'react'
import {
  Phone, MoreHorizontal, ArrowLeft, ArrowRight,
  Brain, Activity, CheckCircle2, Clock, Zap,
  MessageSquare, Mail, TrendingUp,
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
function statusColor(s: string) {
  if (s === 'Completed') return SUCCESS
  if (s === 'In Progress') return PINK
  if (s === 'Queued') return BLUE
  if (s === 'Transcribing') return WARN
  return TEXT3
}

const CALLS = [
  {
    id: 1, name: 'Marcus Thornton', type: 'Manual', status: 'Completed', duration: '8 min 14s', time: 'Today 9:14am',
    summary: 'Marcus was receptive and warm throughout the call. Discussed recent Bondi Beach comparable sales — particularly interested in the Arcadia Street result at $2.08M. He mentioned Sarah is recovering well and the family are "thinking about what comes next." He did not commit to listing but expressed that timing "could be right by the end of the year."',
    sentiment: 'Positive', sentimentPct: 84,
    topics: ['Property valuation', 'Recent comparable sales', 'Family health update (Sarah)', 'Market timing', 'End-of-year listing potential'],
    transcript: [
      { speaker: 'Jye', text: 'Hi Marcus — Jye here. Hope I\'m not catching you at a bad time?' },
      { speaker: 'Marcus', text: 'No no, perfect timing actually. I was just looking at some REA listings on my phone.' },
      { speaker: 'Jye', text: 'Ha — great minds! How\'s Sarah going? Is she recovering well?' },
      { speaker: 'Marcus', text: 'She is, yeah. Slow going but she\'s a trooper. Thanks for asking.' },
      { speaker: 'Jye', text: 'Glad to hear it. I actually wanted to share some exciting news — a home on Arcadia Street just sold for $2.08M last week.' },
      { speaker: 'Marcus', text: 'Seriously? Which one? The yellow one at the bottom?' },
      { speaker: 'Jye', text: 'Number 10 — similar land, 3 beds like yours. And I think your position is actually stronger.' },
      { speaker: 'Marcus', text: 'Wow. Look, we\'ve been talking about it. Timing could be right by the end of the year...' },
    ],
    tasks: ['Follow up Tuesday with appraisal letter', 'Ask about Sarah on next contact', 'Schedule formal appraisal for August'],
    nextAction: 'Send personalised appraisal offer by Thursday — reference the Arcadia Street result and Sarah\'s recovery.',
  },
  {
    id: 2, name: 'Sandra Okonkwo', type: 'AI Outbound', status: 'Completed', duration: '3 min 42s', time: 'Today 8:30am',
    summary: 'AI outbound call completed successfully. Sandra was polite but non-committal. She acknowledged knowing about recent suburb price growth and agreed to receive a "desktop estimate" via SMS. No objections raised. Positive lead capture outcome.',
    sentiment: 'Neutral', sentimentPct: 56,
    topics: ['Suburb price growth', 'Desktop estimate offer', 'SMS preference confirmed'],
    transcript: [
      { speaker: 'AI Agent', text: 'Hi, is this Sandra? I\'m calling on behalf of Jye Sanjurjo from Real Platform — I hope I\'m not interrupting?' },
      { speaker: 'Sandra', text: 'Um, no that\'s okay. What\'s this about?' },
      { speaker: 'AI Agent', text: 'Jye wanted to let you know that Cronulla property values have grown significantly this year — your suburb is up 14%. He thought you might like to know what your Elouera Road home could be worth today.' },
      { speaker: 'Sandra', text: 'Oh right. Yeah I\'d heard prices were going up. That would be interesting actually.' },
      { speaker: 'AI Agent', text: 'Fantastic. Shall I have Jye pop a desktop estimate over to you via SMS? No obligation at all.' },
      { speaker: 'Sandra', text: 'Yeah sure, SMS is fine.' },
    ],
    tasks: ['Send desktop estimate via SMS by 2pm', 'Log Sandra as warm lead', 'Add to direct Seller nurture track'],
    nextAction: 'Send the desktop estimate SMS immediately — she agreed to receive it. Strike while engagement is warm.',
  },
  {
    id: 3, name: 'Brett Calloway', type: 'AI Outbound', status: 'Queued', duration: '—', time: 'Scheduled: Monday 9:00am',
    summary: 'Call scheduled for Monday 9am on return from Europe. AI agent briefed with travel context and Thirroul infrastructure upgrade talking points.',
    sentiment: '—', sentimentPct: 0,
    topics: ['Return from European travel', 'Thirroul infrastructure upgrade', 'Property value update'],
    transcript: [],
    tasks: ['Confirm Brett is back in Australia before calling', 'Brief AI on Lawrence Hargrave Drive upgrade'],
    nextAction: 'Confirm geo-location before Monday — do not call if still overseas.',
  },
  {
    id: 4, name: 'Thomas Brennan', type: 'Manual', status: 'Completed', duration: '5 min 03s', time: '1 week ago',
    summary: 'Tom was brief and non-committal. He mentioned Claire is adjusting to the kids leaving. He was interested in the Manly market data but said they\'re "probably thinking more next year." He was not dismissive — just not ready.',
    sentiment: 'Neutral', sentimentPct: 52,
    topics: ['Manly market update', 'Kids leaving home', 'Timeline for selling — "next year"'],
    transcript: [
      { speaker: 'Jye', text: 'Tom! How are you both going? I heard the youngest has headed off to uni?' },
      { speaker: 'Thomas', text: 'Yeah, yeah. House feels bloody big now to be honest. Claire\'s adjusting.' },
      { speaker: 'Jye', text: 'Ha, I can imagine. How are you finding it?' },
      { speaker: 'Thomas', text: 'Look it\'s fine. We\'ll adjust. Was there something specific you wanted to chat about?' },
      { speaker: 'Jye', text: 'Yeah — there\'s been some strong Manly results I thought you\'d want to see. Is now a bad time?' },
      { speaker: 'Thomas', text: 'Send it through by email. We\'re probably thinking more next year to be honest.' },
    ],
    tasks: ['Send Manly suburb report via email', 'Call again in 6 weeks', 'Monitor empty nester social posts'],
    nextAction: 'Email the $2.615M Manly auction result — frame it as the street benchmark. Follow up in 4 weeks.',
  },
  {
    id: 5, name: 'Priya Mehta', type: 'Inbound', status: 'Transcribing', duration: '4 min 28s', time: 'Today 11:52am',
    summary: 'Priya called back after receiving the congratulations email on her new Atlassian role. Very positive and excited. She asked about properties in Neutral Bay between $1.2M–$1.4M with car parking. Call is still being transcribed.',
    sentiment: 'Positive', sentimentPct: 92,
    topics: ['Congratulations response', 'Neutral Bay buyer brief', 'Budget $1.2M–$1.4M', 'Parking requirement'],
    transcript: [
      { speaker: 'Priya', text: 'Hi Jye — it\'s Priya. I got your lovely email! Thank you so much.' },
      { speaker: 'Jye', text: 'Priya! Congratulations again — Atlassian is such a great move. How are you feeling?' },
      { speaker: 'Priya', text: 'So good! And yes, Raj and I have been talking a lot about property lately actually...' },
    ],
    tasks: ['Send buyer brief follow-up within 1 hour', 'Arrange Neutral Bay inspection for this weekend', 'Update buyer profile with parking requirement'],
    nextAction: 'Send inspection booking link within the hour — momentum is very high.',
  },
  {
    id: 6, name: 'Lisa Chen', type: 'Manual', status: 'Completed', duration: '6 min 52s', time: '3 days ago',
    summary: 'Lisa was measured and polite. She confirmed her parents are "nearly" into care and she\'s "starting to think" about the property. She agreed to an appraisal meeting but wants to wait until August when things "settle down." Very positive interaction overall.',
    sentiment: 'Positive', sentimentPct: 74,
    topics: ['Parents\' aged care transition', 'Appraisal timing', 'Market update for Mosman', 'August appraisal agreed'],
    transcript: [
      { speaker: 'Jye', text: 'Hi Lisa — hope things are going okay with your parents\' transition.' },
      { speaker: 'Lisa', text: 'Yes, it\'s been a big few weeks but we\'re nearly there. Thanks for thinking of us.' },
      { speaker: 'Jye', text: 'Of course. I know this isn\'t the priority right now, but I\'d love to do an updated appraisal when you\'re ready.' },
      { speaker: 'Lisa', text: 'That would actually be lovely. Maybe August? When things have settled a bit.' },
      { speaker: 'Jye', text: 'Perfect. I\'ll reach out in late July to book something in.' },
    ],
    tasks: ['Book appraisal for August in calendar', 'Send warm check-in email in 2 weeks', 'Prepare Mosman CMA for August meeting'],
    nextAction: 'Calendar reminder: reach out late July to confirm August appraisal. In meantime, send a warm personal check-in.',
  },
  {
    id: 7, name: 'Mark Spinelli', type: 'Manual', status: 'Completed', duration: '12 min 08s', time: '1 week ago',
    summary: 'Excellent call with Mark. He is genuinely interested in the Headland Parade off-market opportunity and asked specific questions about the yield, settlement terms, and whether there were other interested buyers. He mentioned he\'s "in due diligence mode" and will decide within 2 weeks.',
    sentiment: 'Positive', sentimentPct: 88,
    topics: ['42A Headland Parade off-market', 'Yield expectations (5%+)', 'Settlement terms (60 days)', 'Competition from other buyers', 'Due diligence timeline'],
    transcript: [
      { speaker: 'Jye', text: 'Mark — thanks for taking the call. The Headland Parade property — I wanted to give you first look.' },
      { speaker: 'Mark', text: 'Yeah you mentioned. What\'s the yield looking like?' },
      { speaker: 'Jye', text: 'Based on comparable coastal rentals, we\'re estimating 5.1% gross. Possibly more with short-stay.' },
      { speaker: 'Mark', text: 'Any other buyers in the mix?' },
      { speaker: 'Jye', text: 'I\'ve spoken to one other party but no offers yet. This is early-stage — you have first mover.' },
      { speaker: 'Mark', text: 'Right. Look, give me 2 weeks. I\'m doing due diligence on a commercial deal right now but I want to keep this moving.' },
    ],
    tasks: ['Follow up in 2 weeks re: Headland Parade decision', 'Send yield analysis report', 'Do not approach other buyers until Mark decides'],
    nextAction: 'Do not push — Mark said 2 weeks. Send the formal yield analysis report now and stay patient.',
  },
  {
    id: 8, name: 'Angela Byrne', type: 'Inbound', status: 'Completed', duration: '7 min 19s', time: '2 days ago',
    summary: 'Angela called after receiving the updated buyer brief with 4-bedroom options. She is excited about the baby news and confirmed she needs a 4-bedroom home with a studio/workspace. She is pre-approved at $1.1M and wants to move before April. Urgent buyer.',
    sentiment: 'Positive', sentimentPct: 96,
    topics: ['4-bedroom brief updated', 'Baby arriving April', 'Pre-approval $1.1M', 'Need to move before April', 'Studio/workspace requirement'],
    transcript: [
      { speaker: 'Angela', text: 'Hi Jye! I got your message about the updated brief — thank you so much for thinking of us!' },
      { speaker: 'Jye', text: 'Congratulations again Angela! Such exciting news. So a 4th bedroom for the nursery makes perfect sense.' },
      { speaker: 'Angela', text: 'Exactly! And if there was a little studio space out the back that would be a dream for my painting.' },
      { speaker: 'Jye', text: '18 Railway Avenue actually has a converted studio out back — it would be perfect.' },
      { speaker: 'Angela', text: 'Oh wow — can we see it this weekend? We really need to be in before April.' },
    ],
    tasks: ['Book 18 Railway Avenue inspection this weekend', 'Confirm pre-approval amount with Angela\'s broker', 'Fast-track buyer match process'],
    nextAction: 'Book the Railway Avenue inspection for this Saturday — urgency is real. April timeline means offer in 60 days.',
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof CALLS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  const sc = statusColor(item.status)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{initials(item.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
            <span style={{ color: TEXT3, fontSize: 10 }}>{item.duration}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 11, marginBottom: 4 }}>{item.type} &bull; {item.time}</div>
          <span style={{ fontSize: 9, padding: '1px 6px', background: `${sc}18`, color: sc, fontWeight: 700 }}>{item.status}</span>
        </div>
      </div>
    </div>
  )
}

export default function VoicePage() {
  const [selected, setSelected] = useState(CALLS[0])
  const sc = statusColor(selected.status)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>AI Voice</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>{CALLS.length} calls — today and recent</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {CALLS.map(c => <ListRow key={c.id} item={c} selected={selected.id === c.id} onSelect={() => setSelected(c)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Call — {selected.name}</h2>
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
                <span style={{ fontSize: 9, padding: '2px 7px', background: `${sc}18`, color: sc, fontWeight: 700 }}>{selected.status}</span>
                <span style={{ fontSize: 9, padding: '2px 7px', background: `${BLUE}18`, color: BLUE, fontWeight: 700 }}>{selected.type}</span>
              </div>
              <div style={{ color: TEXT2, fontSize: 12 }}>{selected.time} &bull; {selected.duration}</div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Call Summary</div>
            <div style={{ color: TEXT2, fontSize: 13, lineHeight: 1.6 }}>{selected.summary}</div>
          </div>

          {/* Sentiment + Topics */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Sentiment Analysis</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>{selected.sentiment}</span>
                <span style={{ color: selected.sentimentPct > 70 ? SUCCESS : selected.sentimentPct > 50 ? WARN : DANGER, fontSize: 13, fontWeight: 700 }}>{selected.sentimentPct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', width: `${selected.sentimentPct}%`, background: selected.sentimentPct > 70 ? SUCCESS : selected.sentimentPct > 50 ? WARN : DANGER }} />
              </div>
            </div>
            <div>
              <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Key Topics</div>
              {selected.topics.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ width: 4, height: 4, background: BLUE, flexShrink: 0 }} />
                  <span style={{ color: TEXT2, fontSize: 12 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript */}
          {selected.transcript.length > 0 && (
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>AI Transcript</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selected.transcript.map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: line.speaker === 'Jye' || line.speaker === 'AI Agent' ? PINK : BLUE, fontSize: 11, fontWeight: 700, flexShrink: 0, minWidth: 60 }}>{line.speaker}</span>
                    <span style={{ color: TEXT2, fontSize: 13, lineHeight: 1.5 }}>"{line.text}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Tasks */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>AI Follow-Up Tasks Auto-Created</div>
            {selected.tasks.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <CheckCircle2 size={12} color={SUCCESS} />
                <span style={{ color: TEXT2, fontSize: 13 }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Next Action */}
          <div style={{ margin: '16px 20px 20px', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px' }}>
            <div style={{ color: PINK, fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Next Recommended Action</div>
            <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{selected.nextAction}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
