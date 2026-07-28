'use client'

import { useState } from 'react'
import {
  Phone, Mail, MessageSquare, MoreHorizontal,
  ArrowLeft, ArrowRight, Globe, Briefcase, Building2,
  TrendingUp, Zap, Copy, AlertCircle, ExternalLink,
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

const ALERTS = [
  {
    id: 1, name: 'Priya Mehta', event: 'New Job — LinkedIn', source: 'LinkedIn', time: 'Today 9:02am', color: BLUE,
    what: 'Priya Mehta has updated her LinkedIn profile to show a new role as Senior Product Manager at Atlassian, Sydney. Salary jump estimated at $40k+ above previous role at a Series B startup.',
    why: 'Career transitions into higher-income roles are the #1 trigger for property purchases. Combined with her existing pre-approval, she now qualifies for a significantly upgraded property.',
    suggestedAction: 'Send congratulations email today. Mention that her new income level opens up a better bracket of properties than when you last spoke.',
    outreach: 'Hi Priya — huge congratulations on the new Atlassian role! That\'s such an exciting move. I imagine it also opens up some fantastic options for you on the property front — your new income position could unlock some really beautiful homes in Neutral Bay that might have been just outside reach before. Happy to pull some fresh numbers together when you\'re ready. Congrats again!',
  },
  {
    id: 2, name: 'Mark Spinelli', event: 'Business Listed for Sale — ASIC', source: 'ASIC / ABN Lookup', time: 'Today 6:18am', color: WARN,
    what: 'An ASIC filing for Spinelli Holdings Pty Ltd shows a partial share transfer registered 3 days ago, consistent with a business sale or buyout process commencing.',
    why: 'Business liquidity events (sales, buyouts, PE investments) typically release capital that flows into property. Mark is already an investor — a business exit multiplies his deployment capacity.',
    suggestedAction: 'Call Mark today — reference his portfolio goals and mention the Headland Parade off-market opportunity. This may be the perfect timing.',
    outreach: 'Hi Mark — just checking in. I noticed some interesting activity around your business and wanted to see how things are tracking. Separate to that, I\'ve got a cracking off-market opportunity at Barrack Point that I think would suit your portfolio perfectly. Worth 10 minutes this week?',
  },
  {
    id: 3, name: 'Thomas Brennan', event: 'New Company Directorship — ASIC', source: 'ASIC', time: 'Yesterday 11:44am', color: BLUE,
    what: 'Thomas Brennan has been appointed as a Director of Brennan Consulting Pty Ltd, a new entity registered 5 days ago. ABN has been issued and company is active.',
    why: 'New business formation suggests income growth and potential asset protection motivations. Professionals who start companies often seek to purchase property in their company or trust structures.',
    suggestedAction: 'Email Tom to congratulate on his new venture and mention the option to invest in real estate through structures — position yourself as a knowledgeable advisor.',
    outreach: 'Hi Tom — congratulations on the new venture with Brennan Consulting! Starting a company is an exciting step. It might also be a good time to think about property investment structures — a lot of business owners find it beneficial to purchase investment property through a company or trust for asset protection. Happy to connect you with a great accountant if that\'s useful. Exciting times!',
  },
  {
    id: 4, name: 'Sandra Okonkwo', event: 'Property Purchase — REA Data', source: 'REA / Title Data', time: 'Yesterday 3:29pm', color: SUCCESS,
    what: 'Title data indicates Sandra Okonkwo was recorded as a buyer at settlement for a property in Sylvania Waters on 18 July 2026. Purchase price approx. $1.1M.',
    why: 'A secondary property purchase confirms Sandra has strong financial capacity and active property interest. It also suggests she may now consider selling the Cronulla home to fund the Sylvania Waters purchase, or consolidate.',
    suggestedAction: 'Congratulate her on the Sylvania Waters purchase and segue into whether she has considered what to do with the Cronulla property now.',
    outreach: 'Congratulations Sandra — I heard you\'ve just settled on the Sylvania Waters purchase! What a beautiful area. I wanted to reach out because it got me thinking — now might actually be the perfect time to have a conversation about your Cronulla property as well. With values where they are, it could be worth significantly more than you think. Happy to pop over for a quick appraisal at your convenience.',
  },
  {
    id: 5, name: 'James Kowalski', event: 'Renovation DA Approved — Council', source: 'Wollongong City Council', time: '2 days ago', color: WARN,
    what: 'A Development Application (DA) for a swimming pool and deck addition at 42 Glenmore Road, Paddington was approved by Woollahra Council. Estimated construction value: $85,000.',
    why: 'Post-DA approval renovation activity typically coincides with property sale preparation — owners often renovate with sale value in mind. Combined with the kitchen renovation just completed, this property is likely being prepared for market.',
    suggestedAction: 'Call James this week to congratulate on the DA approval and start positioning yourself as the agent for when they\'re ready.',
    outreach: 'Hi James — fantastic news on the DA approval! A pool is absolutely going to add serious value to the property — buyers in Paddington go crazy for outdoor entertaining. By the time construction is done, you\'d have one of the most desirable listings in the suburb. I\'d love to have a conversation about timing when you\'re ready. Congrats on the approval!',
  },
  {
    id: 6, name: 'Claire Davenport', event: 'New ABN Registration', source: 'ABN Lookup', time: '3 days ago', color: TEAL,
    what: 'Claire Davenport has registered a new ABN for "Davenport Creative Co" — an interior design business. The registration was filed 3 days ago.',
    why: 'Self-employment and business registration often reflects a lifestyle change — especially relevant given her recent engagement announcement. Business activity from home may also signal a need for a home office.',
    suggestedAction: 'Mention the new business in your outreach and highlight properties with home office potential.',
    outreach: 'Hi Claire — congratulations on launching Davenport Creative Co! Starting a business is such an exciting milestone — especially alongside your engagement! I\'ve been keeping an eye out for properties with great home office spaces in Cronulla, knowing you\'d need a beautiful setup for client consultations. I have a couple in mind that would be perfect. Would love to show you around.',
  },
  {
    id: 7, name: 'Angela Byrne', event: 'Renovation Post Detected — Domain', source: 'Domain Blog / Houzz', time: '4 days ago', color: BLUE,
    what: 'Angela Byrne\'s property at 18 Railway Avenue, Thirroul was featured in a Houzz renovation article showcasing a "before and after" bathroom renovation and garden makeover.',
    why: 'Properties featured in renovation media attract a self-selection bias — owners are proud of their home improvements and often have a high equity position. This is a positive engagement signal.',
    suggestedAction: 'Share the Houzz article with a personal comment. This is a conversation-starter that doesn\'t feel like a sales approach.',
    outreach: 'Hi Angela — I just came across your home on Houzz and had to reach out — the bathroom transformation and garden are absolutely gorgeous! You must be so proud of what you\'ve created. The Thirroul market is genuinely booming right now and properties like yours are fetching strong prices. When the time is right, I\'d love to be involved. For now — just wanted to say it looks incredible!',
  },
  {
    id: 8, name: 'Brett Calloway', event: 'Domain Listing View Spike', source: 'Domain / Analytics', time: '5 days ago', color: PURPLE,
    what: 'Domain analytics show that Brett Calloway\'s registered account has viewed 14 Thirroul property listings in the past 7 days — a significant increase from zero in the previous 30 days.',
    why: 'A sudden spike in listing views after an extended travel period suggests the owner may be re-evaluating their property position upon return. This may indicate intent to sell OR buy.',
    suggestedAction: 'Send a casual "Welcome back to Thirroul" message and attach recent suburb sales data. Do not hard sell — probe intent first.',
    outreach: 'Hi Brett — welcome back to Australian soil! Hope the European adventure was everything you hoped for. Thirroul has had some interesting changes while you were away — values have shifted quite a bit and there\'s been some great sales activity. I thought you might find this attached suburb report interesting. No agenda — just keeping you in the loop as always.',
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof ALERTS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{initials(item.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
            <span style={{ color: TEXT3, fontSize: 10 }}>{item.time}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{item.source}</div>
          <span style={{ fontSize: 9, padding: '1px 6px', background: `${item.color}18`, color: item.color, fontWeight: 700 }}>{item.event}</span>
        </div>
      </div>
    </div>
  )
}

export default function InternetMonitorPage() {
  const [selected, setSelected] = useState(ALERTS[0])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Internet Monitor</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>{ALERTS.length} alerts — LinkedIn, ASIC, Domain, Council</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ALERTS.map(a => <ListRow key={a.id} item={a} selected={selected.id === a.id} onSelect={() => setSelected(a)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Internet Alert — {selected.name}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ArrowLeft, ArrowRight, MoreHorizontal].map((Icon, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><Icon size={15} strokeWidth={1.5} /></button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, flexShrink: 0, background: avColor(selected.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>{initials(selected.name)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>{selected.name}</span>
                <span style={{ fontSize: 9, padding: '2px 7px', background: `${selected.color}18`, color: selected.color, fontWeight: 700 }}>{selected.event}</span>
              </div>
              <div style={{ color: TEXT2, fontSize: 12 }}><Globe size={10} style={{ display: 'inline', marginRight: 3 }} />{selected.source} &bull; {selected.time}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ icon: Phone, color: SUCCESS },{ icon: Mail, color: BLUE },{ icon: MessageSquare, color: TEAL }].map((a, i) => {
                const Icon = a.icon
                return <button key={i} style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, color: a.color, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit' }}><Icon size={12} /></button>
              })}
            </div>
          </div>

          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Detected</div>
            <div style={{ color: TEXT2, fontSize: 13, lineHeight: 1.6 }}>{selected.what}</div>
          </div>

          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Why This Matters for Real Estate</div>
            <div style={{ color: TEXT2, fontSize: 13, lineHeight: 1.6 }}>{selected.why}</div>
          </div>

          <div style={{ margin: '16px 20px 0', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Zap size={14} color={PINK} />
              <span style={{ color: PINK, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Suggested Action</span>
            </div>
            <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{selected.suggestedAction}</div>
          </div>

          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Pre-Written Outreach</div>
              <button style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}30`, color: BLUE, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'inherit' }}>
                <Copy size={11} /> Copy
              </button>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '12px 14px', color: TEXT2, fontSize: 13, lineHeight: 1.7 }}>
              {selected.outreach}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
