'use client'
import { useState, Suspense, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, TrendingUp, Megaphone, Shield, Building2, Users2, Brain,
  Settings, Bell, Search, ChevronRight, ChevronLeft, Plus, Send, ChevronDown, Sparkles,
  PenSquare, ArrowUp, Trash2, CheckCircle, ExternalLink, Phone, Mail, LogOut,
} from 'lucide-react'

const BG     = '#f8fafc'
const SIDE   = '#ffffff'
const BORDER = 'rgba(0,0,0,0.09)'
const BLUE   = '#4361ee'
const PINK   = '#e3008c'
const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN  = '#10b981'
const AMBER  = '#f59e0b'
const RED    = '#ef4444'
const TEXT   = '#0f172a'
const TEXT2  = '#475569'
const TEXT3  = '#94a3b8'

type SubItem = { label: string; href: string }
type Mod     = { id: string; label: string; icon: React.ElementType; color: string; href: string; sub: SubItem[] }
type Card =
  | { type: 'contacts'; items: { name: string; role: string; score: number; note: string; color: string }[] }
  | { type: 'task'; title: string; due: string; priority: 'HIGH' | 'MED' | 'LOW' }
  | { type: 'navigate'; label: string; href: string; module: string }
  | { type: 'draft'; kind: string; subject?: string; body: string }
  | { type: 'stats'; items: { label: string; value: string; color?: string }[] }
type Message = { role: 'user' | 'ai'; content: string; time: string; cards?: Card[] }
type Chat    = { id: string; title: string; messages: Message[]; created: Date }

const MODULES: Mod[] = [
  { id: 'home', label: 'Home', icon: LayoutDashboard, color: BLUE, href: '/dashboard', sub: [] },
  {
    id: 'contacts', label: 'Contacts', icon: Users, color: '#06b6d4', href: '/dashboard/contacts',
    sub: [
      { label: 'Contacts',   href: '/dashboard/contacts' },
      { label: 'Activities', href: '/dashboard/activities' },
      { label: 'Campaigns',  href: '/dashboard/nurture' },
      { label: 'Documents',  href: '/dashboard/documents' },
    ],
  },
  {
    id: 'pipeline', label: 'Pipeline', icon: TrendingUp, color: '#10b981', href: '/dashboard/leads',
    sub: [
      { label: 'Leads',         href: '/dashboard/leads' },
      { label: 'Appraisals',    href: '/dashboard/appraisals' },
      { label: 'Opportunities', href: '/dashboard/pipeline' },
    ],
  },
  {
    id: 'marketing', label: 'Marketing', icon: Megaphone, color: PINK, href: '/dashboard/social',
    sub: [
      { label: 'Campaigns',    href: '/dashboard/nurture' },
      { label: 'Social Media', href: '/dashboard/social' },
      { label: 'Creator',      href: '/dashboard/creator' },
      { label: 'Advertising',  href: '/dashboard/advertising' },
      { label: 'Website',      href: '/dashboard/website' },
      { label: 'Analytics',    href: '/dashboard/reports' },
    ],
  },
  {
    id: 'compliance', label: 'Compliance', icon: Shield, color: '#8b5cf6', href: '/dashboard/verification',
    sub: [
      { label: 'Verification', href: '/dashboard/verification' },
      { label: 'Forms',        href: '/dashboard/forms' },
      { label: 'Documents',    href: '/dashboard/documents' },
      { label: 'Audit',        href: '/dashboard/audit' },
    ],
  },
  {
    id: 'listings', label: 'Listings', icon: Building2, color: '#f59e0b', href: '/dashboard/listings',
    sub: [
      { label: 'Listings',      href: '/dashboard/listings' },
      { label: 'Media',         href: '/dashboard/media' },
      { label: 'Enquiries',     href: '/dashboard/inbox' },
      { label: 'Inspections',   href: '/dashboard/inspections' },
      { label: 'Offers',        href: '/dashboard/offers' },
      { label: 'Vendor Portal', href: '/dashboard/vendors' },
    ],
  },
  {
    id: 'team', label: 'Team', icon: Users2, color: '#64748b', href: '/dashboard/team',
    sub: [
      { label: 'Members',     href: '/dashboard/team' },
      { label: 'Tasks',       href: '/dashboard/tasks' },
      { label: 'Calendar',    href: '/dashboard/calendar' },
      { label: 'Performance', href: '/dashboard/kpi' },
      { label: 'AI Setup',    href: '/dashboard/connect' },
      { label: 'Settings',    href: '/dashboard/settings' },
    ],
  },
]

const MORNING_BRIEF = [
  {
    priority: 1, urgency: 'HIGH' as const,
    title: 'Call Marcus Thornton before 10am',
    detail: 'Appraisal at 2pm today — comparing with McGrath. Intent score 92. Best window is now.',
    prompts: ['Prep me for this appraisal', 'What objections should I expect?'],
  },
  {
    priority: 2, urgency: 'HIGH' as const,
    title: 'Anderson Family offer expires at 5pm',
    detail: '$2.85M on 42 Foreshore Cres — vendor not formally briefed yet. Act before market close.',
    prompts: ['Draft vendor update email', 'How should I respond to this offer?'],
  },
  {
    priority: 3, urgency: 'MED' as const,
    title: 'Sandra Wilson — 8 days no contact',
    detail: 'High-intent vendor. Partner Craig returned from overseas today — prime reconnect window.',
    prompts: ['Summarise Sandra for me', 'Draft a reconnect message'],
  },
]

const CATEGORY_PROMPTS: Record<string, string[]> = {
  Today:      ["Who should I call first today?", "What did I miss yesterday?", "Prioritise my full workload", "Auto-reschedule my missed follow-ups"],
  Contacts:   ["Show owners likely to sell in 6 months", "Who haven't I spoken to in 60+ days?", "Summarise a contact before I call them", "Find buyers for 42 Foreshore Cres"],
  Pipeline:   ["Which leads are going cold?", "What's stopping my pipeline deals?", "Recommend next action per opportunity", "Show most likely conversions this month"],
  Listings:   ["Build a listing from an address", "Write a property description", "Recommend guide price from comps", "Find buyers already in my database"],
  Marketing:  ["Generate a social campaign for a listing", "Write an email campaign", "Draft 3 Instagram captions", "Write a Cronulla suburb report"],
  Compliance: ["Find missing compliance documents", "Prep an agreement before my appointment", "Show upcoming compliance deadlines", "Review Form 6 for gaps"],
}

const NOW = new Date('2026-07-26T10:00:00')
const INITIAL_CHATS: Chat[] = [
  {
    id: '1', title: "Today's call priorities",
    created: new Date('2026-07-26T08:15:00'),
    messages: [
      { role: 'user', content: 'Who should I prioritise calling today?', time: '8:15 AM' },
      { role: 'ai', content: "I've ranked your database by intent signals, last contact date, and today's calendar. Here are your top 5 — call them in this order.", time: '8:16 AM',
        cards: [{ type: 'contacts', items: [
          { name: 'Marcus Thornton', role: 'Vendor', score: 92, note: 'Appraisal at 2pm today — call now to build rapport and confirm', color: BLUE },
          { name: 'Sandra Wilson',   role: 'Vendor', score: 78, note: 'Partner back from overseas today — 8 days no contact, prime window', color: PINK },
          { name: 'The Gardiners',   role: 'Buyer',  score: 71, note: 'Baby due in October, time pressure — show them 42 Foreshore today', color: GREEN },
          { name: 'Peter Nguyen',    role: 'Buyer',  score: 68, note: 'Registered at 3 opens, no agent contact yet — high intent, move now', color: AMBER },
          { name: 'James Wu',        role: 'Investor', score: 61, note: '19 days no contact — send rental yield update before calling', color: '#8b5cf6' },
        ]}],
      },
      { role: 'user', content: 'Create follow-up tasks for all of them', time: '8:18 AM' },
      { role: 'ai', content: "Done. I've created 5 prioritised follow-up tasks and assigned them to you — due today.", time: '8:18 AM',
        cards: [
          { type: 'task', title: 'Call Marcus Thornton — appraisal prep', due: 'Today 9:30am', priority: 'HIGH' },
          { type: 'task', title: 'Call Sandra Wilson — reconnect', due: 'Today 10:30am', priority: 'HIGH' },
          { type: 'task', title: 'Call The Gardiners — show 42 Foreshore', due: 'Today 11:00am', priority: 'HIGH' },
          { type: 'navigate', label: 'View all tasks', href: '/dashboard/tasks', module: 'Tasks' },
        ],
      },
    ],
  },
  {
    id: '2', title: 'Prep me for Marcus Thornton',
    created: new Date('2026-07-26T09:00:00'),
    messages: [
      { role: 'user', content: 'Prep me for my 2pm appraisal with Marcus Thornton', time: '9:00 AM' },
      { role: 'ai', content: "Marcus is your highest-priority vendor today. He's comparing you with McGrath and his wife Sarah is the emotional decision-maker — lead with lifestyle, not just price.", time: '9:00 AM',
        cards: [{ type: 'stats', items: [
          { label: 'Intent Score',      value: '92 / 100',    color: GREEN },
          { label: 'Last Contact',      value: '5 days ago' },
          { label: 'Comp: 9 Arcadia St', value: '$2.55M',    color: BLUE },
          { label: 'Recommended Guide', value: '$2.8M–$3.1M', color: AMBER },
        ]}],
      },
      { role: 'user', content: 'What objections should I expect?', time: '9:03 AM' },
      { role: 'ai', content: "Three likely objections based on Marcus's history:\n\n1. 'McGrath quoted us higher' — Show days-on-market data. Overpriced listings sit and stigmatise. Your guide gets him moved before September.\n\n2. 'We're not in a rush' — His pre-purchase in Balmoral settles November. The urgency is real.\n\n3. 'We want to think about it' — That's Sarah. Leave behind your last 3 Cronulla sales results. It's a trust objection.", time: '9:03 AM',
        cards: [{ type: 'navigate', label: 'Open Marcus in Contacts', href: '/dashboard/contacts', module: 'Contacts' }],
      },
    ],
  },
  {
    id: '3', title: 'Anderson Family vendor update',
    created: new Date('2026-07-25T14:30:00'),
    messages: [
      { role: 'user', content: "Draft a vendor update email for the Anderson Family after today's open home", time: '2:30 PM' },
      { role: 'ai', content: "Done. Here's the vendor update based on today's inspection data, enquiry numbers, and buyer feedback pulled from your CRM.", time: '2:31 PM',
        cards: [{ type: 'draft', kind: 'Vendor Update Email', subject: 'Open Home Update — 42 Foreshore Cres, Cronulla', body: "Hi Marcus,\n\nGreat turnout at today's open home — 14 groups through, 4 registering strong interest.\n\nKey buyer feedback:\n• Strong response to the ocean views and kitchen renovation\n• Price sensitivity noted above $2.9M — most buyers expecting $2.75–2.85M range\n• Two buyers have requested private inspections this week\n\nNext steps: I'll follow up all enquiries by tomorrow morning and confirm private inspection times. I'll call you Thursday to discuss where we're tracking.\n\nYour street clearance rate is 100% — we're in a strong position.\n\nSpeak soon,\nJye" }],
      },
    ],
  },
  {
    id: '4', title: 'Cold leads — pipeline review',
    created: new Date('2026-07-24T11:00:00'),
    messages: [
      { role: 'user', content: "Which leads in my pipeline are going cold?", time: '11:00 AM' },
      { role: 'ai', content: "I've identified 4 leads showing cooling signals — reduced engagement, extended days since last contact, and stalled stage progression.", time: '11:01 AM',
        cards: [{ type: 'contacts', items: [
          { name: 'Rebecca Hart',       role: 'Vendor lead', score: 34, note: '18 days no contact — form submitted but not followed up, at risk of competitor', color: RED },
          { name: 'Daniel Okafor',      role: 'Buyer',       score: 41, note: 'Attended 2 opens, gone quiet 11 days — may be working with another agent', color: AMBER },
          { name: 'Min-Ji Park',        role: 'Investor',    score: 48, note: 'Was hot in May, last replied 3 weeks ago — send market data now', color: AMBER },
          { name: 'Paul & Deb Starr',   role: 'Buyer',       score: 52, note: 'Finance approved but no inspection scheduled in 9 days', color: AMBER },
        ]}],
      },
      { role: 'ai', content: "Rebecca Hart is most at risk — I'd call her first today before she goes to a competitor. Want me to draft a reconnect message?", time: '11:01 AM',
        cards: [{ type: 'navigate', label: 'Open Pipeline', href: '/dashboard/leads', module: 'Pipeline' }],
      },
    ],
  },
]

function groupChats(chats: Chat[]): { label: string; chats: Chat[] }[] {
  const today = new Date(NOW); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  const last7 = new Date(today); last7.setDate(today.getDate() - 7)

  const groups: { label: string; chats: Chat[] }[] = [
    { label: 'Today',          chats: [] },
    { label: 'Yesterday',      chats: [] },
    { label: 'Previous 7 Days',chats: [] },
    { label: 'Older',          chats: [] },
  ]
  for (const c of [...chats].sort((a, b) => b.created.getTime() - a.created.getTime())) {
    const d = new Date(c.created); d.setHours(0, 0, 0, 0)
    if (d >= today)                        groups[0].chats.push(c)
    else if (d >= yesterday)               groups[1].chats.push(c)
    else if (d >= last7)                   groups[2].chats.push(c)
    else                                   groups[3].chats.push(c)
  }
  return groups.filter(g => g.chats.length > 0)
}

// ─── Rotating New Button ──────────────────────────────────────────────────────

const NEW_ITEMS = [
  { label: 'New Contact', href: '/dashboard/contacts' },
  { label: 'New Listing', href: '/dashboard/listings/new' },
]

function RotatingNewButton() {
  const router = useRouter()
  const [idx, setIdx]     = useState(0)
  const [dir, setDir]     = useState<'left' | 'right'>('right')
  const [phase, setPhase] = useState<'idle' | 'exit'>('idle')

  const slide = (direction: 'left' | 'right') => {
    if (phase !== 'idle') return
    setDir(direction)
    setPhase('exit')
    setTimeout(() => {
      setIdx(i => direction === 'right'
        ? (i + 1) % NEW_ITEMS.length
        : (i - 1 + NEW_ITEMS.length) % NEW_ITEMS.length
      )
      setPhase('idle')
    }, 240)
  }

  const nextIdx = dir === 'right'
    ? (idx + 1) % NEW_ITEMS.length
    : (idx - 1 + NEW_ITEMS.length) % NEW_ITEMS.length

  const outX = phase === 'exit' ? (dir === 'right' ? '-110%' : '110%') : '0%'
  const inX  = phase === 'exit' ? '0%' : (dir === 'right' ? '110%' : '-110%')

  const arrowBtn = (direction: 'left' | 'right') => (
    <button
      onClick={e => { e.stopPropagation(); slide(direction) }}
      style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', width: 22, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0, transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
    >
      {direction === 'left' ? <ChevronLeft size={11} strokeWidth={2.5} /> : <ChevronRight size={11} strokeWidth={2.5} />}
    </button>
  )

  return (
    <div style={{ display: 'flex', width: '100%', background: BLUE, overflow: 'hidden', height: 30 }}>
      {arrowBtn('left')}

      <button
        onClick={() => router.push(NEW_ITEMS[idx].href)}
        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, overflow: 'hidden', padding: '0 4px' }}
      >
        <Plus size={11} strokeWidth={2.5} style={{ flexShrink: 0 }} />
        <div style={{ position: 'relative', overflow: 'hidden', height: '1.15em', flex: 1 }}>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', transform: `translateX(${outX})`, transition: 'transform 0.22s ease-in-out' }}>
            {NEW_ITEMS[idx].label}
          </span>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', transform: `translateX(${inX})`, transition: 'transform 0.22s ease-in-out' }}>
            {NEW_ITEMS[nextIdx].label}
          </span>
        </div>
      </button>

      {arrowBtn('right')}
    </div>
  )
}

// ─── Platform Sidebar (sub-modules with drill-down) ──────────────────────────

function PlatformSidebarContent({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams()

  const getActiveModule = () => {
    if (pathname === '/dashboard') return null
    return MODULES.find(m => {
      if (m.sub.length === 0) return false
      if (pathname.startsWith(m.href) && m.href !== '/dashboard') return true
      return m.sub.some(s => pathname.startsWith(s.href.split('?')[0]))
    }) ?? null
  }

  const [drilled, setDrilled] = useState<Mod | null>(getActiveModule)

  const subIsActive = (href: string) => {
    const [base, queryStr] = href.split('?')
    if (pathname !== base) return false
    const tParam   = new URLSearchParams(queryStr || '').get('t')
    const currentT = searchParams.get('t')
    return tParam === currentT
  }

  return drilled ? (
    <>
      <button
        onClick={() => setDrilled(null)}
        style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '9px 12px', background: 'none', border: 'none', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', color: TEXT3, fontSize: 11, fontFamily: 'inherit', textAlign: 'left', flexShrink: 0 }}
      >
        <ChevronLeft size={12} /> All modules
      </button>
      <div style={{ padding: '10px 12px 8px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <drilled.icon size={13} color={drilled.color} strokeWidth={2} />
        <span style={{ fontSize: 12, fontWeight: 700, color: drilled.color }}>{drilled.label}</span>
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', paddingTop: 4, paddingBottom: 8 }}>
        {drilled.sub.map((s, i) => {
          const active = subIsActive(s.href)
          return (
            <Link key={i} href={s.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px 7px 14px', color: active ? drilled.color : TEXT2, background: active ? `${drilled.color}10` : 'transparent', textDecoration: 'none', fontSize: 12.5, fontWeight: active ? 600 : 400, borderRadius: 8, margin: '1px 8px' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: active ? drilled.color : TEXT3, flexShrink: 0 }} />
              {s.label}
            </Link>
          )
        })}
      </nav>
    </>
  ) : (
    <>
      <div style={{ padding: '6px 12px 4px', flexShrink: 0 }}>
        <RotatingNewButton />
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        {MODULES.map(mod => {
          const Icon = mod.icon
          const hasSub = mod.sub.length > 0
          const rowActive = mod.id === 'home'
            ? pathname === '/dashboard'
            : hasSub && (pathname.startsWith(mod.href) || mod.sub.some(s => pathname.startsWith(s.href.split('?')[0])))
          return (
            <Link key={mod.id} href={mod.href} onClick={() => hasSub && setDrilled(mod)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px 7px 12px', color: rowActive ? mod.color : TEXT2, background: rowActive ? `${mod.color}10` : 'transparent', textDecoration: 'none', fontSize: 12.5, fontWeight: rowActive ? 600 : 400, transition: 'all 0.1s', borderRadius: 8, margin: '1px 8px' }}>
              <Icon size={14} strokeWidth={rowActive ? 2 : 1.5} color={rowActive ? mod.color : TEXT3} />
              <span style={{ flex: 1 }}>{mod.label}</span>
              {hasSub && <ChevronRight size={11} color={TEXT3} />}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

// ─── Agent Sidebar (chat history list) ───────────────────────────────────────

function AgentSidebarContent({ chats, activeChatId, onSelect, onNew, onDelete }: {
  chats: Chat[]; activeChatId: string | null
  onSelect: (id: string) => void; onNew: () => void; onDelete: (id: string) => void
}) {
  const groups = groupChats(chats)
  return (
    <>
      <div style={{ padding: '8px 12px 6px', flexShrink: 0 }}>
        <button onClick={onNew} style={{ width: '100%', background: `linear-gradient(90deg, ${BLUE}, ${PINK})`, border: 'none', color: '#fff', padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', borderRadius: 9999 }}>
          <PenSquare size={12} /> New Chat
        </button>
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        {groups.map(g => (
          <div key={g.label}>
            <div style={{ padding: '8px 12px 3px', fontSize: 10, fontWeight: 700, color: TEXT3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{g.label}</div>
            {g.chats.map(c => (
              <div key={c.id} onClick={() => onSelect(c.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px 7px 12px', cursor: 'pointer', background: activeChatId === c.id ? PINK_S : 'transparent', borderRadius: 8, margin: '1px 8px', group: 'true' as any }}
                onMouseEnter={e => { if (activeChatId !== c.id) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.03)' }}
                onMouseLeave={e => { if (activeChatId !== c.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ flex: 1, fontSize: 12, color: activeChatId === c.id ? PINK : TEXT2, fontWeight: activeChatId === c.id ? 600 : 400, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', lineHeight: 1.4 }}>{c.title}</span>
                <button onClick={e => { e.stopPropagation(); onDelete(c.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 2, opacity: 0, flexShrink: 0, display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </nav>
    </>
  )
}

// ─── Chat Interface (main content in agent mode) ──────────────────────────────

const URGENCY_COLOR: Record<string, string> = { HIGH: RED, MED: AMBER, LOW: TEXT3 }
const PRIORITY_COLOR: Record<string, string> = { HIGH: RED, MED: AMBER, LOW: TEXT3 }

const AI_RESPONSES = [
  "I've pulled your pipeline data and cross-referenced it with today's calendar. Here's what I'd action first — I've already created follow-up tasks for the top three.",
  "Done. Record updated, follow-up task created for tomorrow at 9am, and I've drafted a short email you can send now. Want me to send it?",
  "Based on your CRM activity this week, the Anderson Family offer is most urgent — it expires at 5pm today. I've drafted a vendor briefing note for you below.",
  "Found them. Here are the contacts matching that criteria, ranked by intent score and days since last contact.",
]

function ChatInterface({ chats, activeChatId, onSend, onNew }: {
  chats: Chat[]; activeChatId: string | null
  onSend: (chatId: string | null, content: string) => string; onNew: () => void
}) {
  const [input, setInput]               = useState('')
  const [localChatId, setLocalChatId]   = useState<string | null>(activeChatId)
  const [activeCategory, setCategory]   = useState('Today')
  const [copiedId, setCopied]           = useState<string | null>(null)
  const bottomRef    = useRef<HTMLDivElement>(null)
  const textareaRef  = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setLocalChatId(activeChatId) }, [activeChatId])
  const activeChat = chats.find(c => c.id === localChatId) ?? null
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeChat?.messages.length])

  const send = () => {
    if (!input.trim()) return
    const newId = onSend(localChatId, input.trim())
    setLocalChatId(newId)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }
  const handleKey    = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  const autoResize   = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }
  const promptClick  = (p: string) => { setInput(p); setTimeout(() => textareaRef.current?.focus(), 0) }
  const copyText     = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const renderCard = (card: Card, uid: string) => {
    if (card.type === 'contacts') {
      return (
        <div key={uid} style={{ border: `1px solid ${BORDER}`, background: '#fafafa', marginTop: 10, overflow: 'hidden' }}>
          {card.items.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderBottom: i < card.items.length - 1 ? `1px solid rgba(0,0,0,0.04)` : 'none' }}>
              <div style={{ width: 30, height: 30, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 1 }}>
                {c.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>{c.name}</span>
                  <span style={{ fontSize: 9, color: TEXT3, background: 'rgba(0,0,0,0.06)', padding: '1px 5px' }}>{c.role}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: c.score > 70 ? GREEN : c.score > 50 ? AMBER : RED }}>{c.score}</span>
                </div>
                <div style={{ fontSize: 11.5, color: TEXT2, lineHeight: 1.5 }}>{c.note}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginTop: 2 }}>
                <button style={{ background: 'none', border: `1px solid ${BORDER}`, color: TEXT3, padding: '3px 6px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}><Phone size={10} /></button>
                <button style={{ background: 'none', border: `1px solid ${BORDER}`, color: TEXT3, padding: '3px 6px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}><Mail size={10} /></button>
              </div>
            </div>
          ))}
          <div style={{ padding: '8px 14px', borderTop: `1px solid rgba(0,0,0,0.06)`, background: '#fff' }}>
            <Link href="/dashboard/contacts" style={{ fontSize: 11, fontWeight: 700, color: BLUE, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Open in Contacts <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      )
    }

    if (card.type === 'task') {
      const pc = PRIORITY_COLOR[card.priority]
      return (
        <div key={uid} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', border: `1px solid ${BORDER}`, background: '#fafafa', marginTop: 6 }}>
          <CheckCircle size={14} color={TEXT3} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{card.title}</div>
            <div style={{ fontSize: 10, color: TEXT3, marginTop: 1 }}>Due {card.due}</div>
          </div>
          <span style={{ fontSize: 9, color: pc, fontWeight: 700, background: `${pc}18`, padding: '2px 7px', flexShrink: 0 }}>{card.priority}</span>
        </div>
      )
    }

    if (card.type === 'navigate') {
      return (
        <Link key={uid} href={card.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '7px 14px', border: `1px solid ${BORDER}`, background: '#fff', color: BLUE, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
          {card.label} <ExternalLink size={11} />
        </Link>
      )
    }

    if (card.type === 'draft') {
      const copyId = `${uid}-draft`
      return (
        <div key={uid} style={{ border: `1px solid ${BORDER}`, background: '#fafafa', marginTop: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10, background: '#fff' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: PINK, background: PINK_S, padding: '2px 8px', flexShrink: 0 }}>{card.kind.toUpperCase()}</span>
            {card.subject && <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.subject}</span>}
            <button onClick={() => copyText(copyId, card.body)}
              style={{ border: `1px solid ${BORDER}`, background: '#fff', color: copiedId === copyId ? GREEN : TEXT2, padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              {copiedId === copyId ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ padding: '12px 14px', fontSize: 12.5, color: TEXT2, lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: 220, overflowY: 'auto' }}>{card.body}</div>
          <div style={{ padding: '8px 14px', borderTop: `1px solid rgba(0,0,0,0.05)`, display: 'flex', gap: 8, background: '#fff' }}>
            <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '5px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Send Email</button>
            <button style={{ background: 'none', border: `1px solid ${BORDER}`, color: TEXT2, padding: '5px 14px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
          </div>
        </div>
      )
    }

    if (card.type === 'stats') {
      return (
        <div key={uid} style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(card.items.length, 4)}, 1fr)`, gap: 8, marginTop: 10 }}>
          {card.items.map((item, i) => (
            <div key={i} style={{ border: `1px solid ${BORDER}`, background: '#fafafa', padding: '10px 12px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: item.color ?? TEXT, letterSpacing: '-0.03em', lineHeight: 1 }}>{item.value}</div>
              <div style={{ fontSize: 10, color: TEXT3, marginTop: 3 }}>{item.label}</div>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Messages / Briefing */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!activeChat ? (
          /* ── Morning Briefing ── */
          <div style={{ maxWidth: 660, margin: '0 auto', padding: '28px 24px 24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${BLUE}, ${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>RP</div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1.2 }}>Good morning, Jye.</div>
                <div style={{ fontSize: 12, color: TEXT3 }}>Sunday 27 July · Your day, prioritised.</div>
              </div>
            </div>

            {/* Priority actions */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 10 }}>PRIORITY ACTIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MORNING_BRIEF.map((item) => (
                  <div key={item.priority} style={{ border: `1px solid ${item.urgency === 'HIGH' ? 'rgba(239,68,68,0.25)' : BORDER}`, background: item.urgency === 'HIGH' ? 'rgba(239,68,68,0.02)' : '#fafafa', padding: '12px 14px', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: URGENCY_COLOR[item.urgency], padding: '2px 7px', flexShrink: 0, marginTop: 1, borderRadius: 9999 }}>#{item.priority}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 3 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.5 }}>{item.detail}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, paddingLeft: 30 }}>
                      {item.prompts.map(p => (
                        <button key={p} onClick={() => promptClick(p)}
                          style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '4px 11px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category chips + prompt grid */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 10 }}>ASK ABOUT</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {Object.keys(CATEGORY_PROMPTS).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    style={{ border: `1px solid ${activeCategory === cat ? BLUE : BORDER}`, background: activeCategory === cat ? `${BLUE}10` : '#fff', color: activeCategory === cat ? BLUE : TEXT2, padding: '5px 13px', fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit', fontWeight: activeCategory === cat ? 700 : 400, borderRadius: 9999 }}>
                    {cat}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {CATEGORY_PROMPTS[activeCategory].map(p => (
                  <button key={p} onClick={() => promptClick(p)}
                    style={{ border: `1px solid ${BORDER}`, background: '#fafafa', color: TEXT2, padding: '10px 13px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', lineHeight: 1.4, borderRadius: 8 }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Message Thread ── */
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
            {activeChat.messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 22, height: 22, background: `linear-gradient(135deg, ${BLUE}, ${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 900, color: '#fff', flexShrink: 0, borderRadius: 4 }}>RP</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: TEXT2 }}>Real Platform AI</span>
                  </div>
                )}
                <div style={{ maxWidth: msg.role === 'ai' && msg.cards ? '100%' : '85%', width: msg.role === 'ai' && msg.cards ? '100%' : undefined }}>
                  {msg.content && (
                    <div style={{ padding: msg.role === 'user' ? '10px 14px' : '0', background: msg.role === 'user' ? '#f1f5f9' : 'transparent', fontSize: 13.5, color: TEXT, lineHeight: 1.7, whiteSpace: 'pre-wrap', borderRadius: msg.role === 'user' ? 12 : 0 }}>
                      {msg.content}
                    </div>
                  )}
                  {msg.cards?.map((card, ci) => renderCard(card, `${i}-${ci}`))}
                </div>
                <div style={{ fontSize: 10, color: TEXT3, marginTop: 4 }}>{msg.time}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '14px 24px 18px', background: '#fff', flexShrink: 0 }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, border: `1.5px solid ${BORDER}`, background: '#fafafa', padding: '10px 12px 10px 16px', borderRadius: 12 }}>
            <textarea ref={textareaRef} value={input} onChange={autoResize} onKeyDown={handleKey}
              placeholder="Ask me anything, or delegate a task…"
              rows={1}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', resize: 'none', fontSize: 13.5, color: TEXT, fontFamily: 'inherit', lineHeight: 1.6, maxHeight: 160, overflowY: 'auto' }}
            />
            <button onClick={send} disabled={!input.trim()}
              style={{ width: 32, height: 32, background: input.trim() ? TEXT : 'rgba(0,0,0,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0, transition: 'background 0.15s', borderRadius: 9999 }}>
              <ArrowUp size={15} color={input.trim() ? '#fff' : TEXT3} strokeWidth={2.5} />
            </button>
          </div>
          <div style={{ fontSize: 10, color: TEXT3, marginTop: 8, textAlign: 'center' }}>Real Platform AI · Takes action, not just advice</div>
        </div>
      </div>
    </div>
  )
}

// ─── Shared Sidebar Shell ─────────────────────────────────────────────────────

function SidebarShell({ mode, setMode, children }: {
  mode: 'platform' | 'ai'; setMode: (m: 'platform' | 'ai') => void; children: React.ReactNode
}) {
  return (
    <div style={{ width: 220, flexShrink: 0, background: SIDE, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${BLUE}, ${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', flexShrink: 0, borderRadius: 6 }}>RP</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1 }}>Real Platform</div>
            <div style={{ fontSize: 10, color: TEXT3, marginTop: 1 }}>Spinelli RE · Cronulla</div>
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ padding: '10px 12px 6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', background: '#f1f5f9', padding: 3, gap: 2, borderRadius: 9999 }}>
          <button onClick={() => setMode('platform')} style={{ flex: 1, padding: '6px 0', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: mode === 'platform' ? 700 : 500, background: mode === 'platform' ? '#fff' : 'transparent', color: mode === 'platform' ? TEXT : TEXT3, boxShadow: mode === 'platform' ? '0 1px 3px rgba(0,0,0,0.10)' : 'none', transition: 'all 0.15s', borderRadius: 9999 }}>
            Platform
          </button>
          <button onClick={() => setMode('ai')} style={{ flex: 1, padding: '6px 0', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: mode === 'ai' ? 700 : 500, background: mode === 'ai' ? '#fff' : 'transparent', color: mode === 'ai' ? PINK : TEXT3, boxShadow: mode === 'ai' ? '0 1px 3px rgba(0,0,0,0.10)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 9999 }}>
            {mode === 'ai' && <Sparkles size={10} color={PINK} />}Agent
          </button>
        </div>
      </div>

      {/* Dynamic content (platform nav or chat list) */}
      {children}

      {/* AI Readiness nudge */}
      <Link href="/dashboard/connect" style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ margin: '0 10px 10px', padding: '10px 12px', background: 'linear-gradient(135deg, rgba(67,97,238,0.06), rgba(227,0,140,0.06))', border: `1px solid rgba(227,0,140,0.15)`, borderRadius: 10, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: PINK }}>AI SETUP</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: TEXT3 }}>4 / 13</span>
          </div>
          <div style={{ height: 3, background: 'rgba(0,0,0,0.08)', borderRadius: 9999, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: '31%', background: `linear-gradient(90deg, ${BLUE}, ${PINK})`, borderRadius: 9999 }} />
          </div>
          <div style={{ fontSize: 10, color: TEXT3, lineHeight: 1.4 }}>Connect 9 more sources to activate AI Autopilot →</div>
        </div>
      </Link>

      {/* User footer */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${BLUE}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0, borderRadius: '50%' }}>JY</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: TEXT, fontWeight: 600, lineHeight: 1 }}>Jye San Jurjo</div>
          <div style={{ fontSize: 10, color: TEXT3, marginTop: 2 }}>Principal Agent</div>
        </div>
        <Link href="/dashboard/settings" style={{ color: TEXT3, textDecoration: 'none' }}><Settings size={14} strokeWidth={1.5} /></Link>
        <a href="/index.html" style={{ color: TEXT3, textDecoration: 'none', display: 'flex' }}><LogOut size={14} strokeWidth={1.5} /></a>
      </div>
    </div>
  )
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar() {
  const AI_CONNECTED = 4
  const AI_TOTAL     = 13
  const AI_READY     = Math.round((AI_CONNECTED / AI_TOTAL) * 100)
  const AI_FULL      = AI_CONNECTED === AI_TOTAL

  return (
    <div style={{ height: 46, background: '#f8fafc', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.03)', border: `1px solid ${BORDER}`, padding: '6px 12px', width: 280, cursor: 'text', borderRadius: 9999 }}>
        <Search size={12} color={TEXT3} />
        <span style={{ fontSize: 12, color: TEXT3 }}>Search contacts, properties, suburbs…</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3, background: 'rgba(0,0,0,0.05)', padding: '1px 5px', borderRadius: 4 }}>⌘K</span>
      </div>
      <div style={{ flex: 1 }} />

      {/* AI Readiness indicator — links to connect page */}
      <Link href="/dashboard/connect" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 10px 4px 8px', background: AI_FULL ? PINK_S : 'rgba(245,158,11,0.08)', border: `1px solid ${AI_FULL ? 'rgba(227,0,140,0.2)' : 'rgba(245,158,11,0.25)'}`, borderRadius: 9999, cursor: 'pointer' }}>
          <div style={{ width: 6, height: 6, background: AI_FULL ? PINK : '#f59e0b', borderRadius: 9999 }} />
          {AI_FULL ? (
            <>
              <span style={{ fontSize: 11, color: PINK, fontWeight: 600 }}>AI Active</span>
              <span style={{ fontSize: 11, color: TEXT3 }}>· 4 automations running</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 11, color: '#b45309', fontWeight: 700 }}>AI {AI_READY}% ready</span>
              <span style={{ fontSize: 11, color: TEXT3 }}>· {AI_TOTAL - AI_CONNECTED} sources to connect</span>
              <ChevronRight size={10} color={TEXT3} />
            </>
          )}
        </div>
      </Link>

      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT2, padding: 4, position: 'relative' }}>
        <Bell size={16} strokeWidth={1.5} />
        <span style={{ position: 'absolute', top: 1, right: 1, width: 7, height: 7, background: PINK, borderRadius: 9999 }} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: TEXT2, fontSize: 12 }}>
        <div style={{ width: 22, height: 22, background: `linear-gradient(135deg, ${BLUE}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', borderRadius: '50%' }}>JY</div>
        Spinelli RE <ChevronDown size={11} />
      </div>
    </div>
  )
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mode, setMode]           = useState<'platform' | 'ai'>('platform')
  const [chats, setChats]         = useState<Chat[]>(INITIAL_CHATS)
  const [activeChatId, setActive] = useState<string | null>(null)

  const handleNew = () => setActive(null)

  const handleSelect = (id: string) => setActive(id)

  const handleDelete = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id))
    if (activeChatId === id) setActive(null)
  }

  const handleSend = (chatId: string | null, content: string): string => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })
    const aiReply = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]

    if (chatId) {
      setChats(prev => prev.map(c => c.id === chatId ? {
        ...c,
        messages: [
          ...c.messages,
          { role: 'user', content, time: timeStr },
          { role: 'ai', content: aiReply, time: timeStr },
        ]
      } : c))
      return chatId
    } else {
      const newId = Date.now().toString()
      const title = content.length > 50 ? content.slice(0, 47) + '…' : content
      setChats(prev => [{
        id: newId, title, created: now,
        messages: [
          { role: 'user', content, time: timeStr },
          { role: 'ai', content: aiReply, time: timeStr },
        ]
      }, ...prev])
      setActive(newId)
      return newId
    }
  }

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: BG, fontFamily: 'var(--font-jakarta), system-ui, sans-serif', color: TEXT, fontSize: 13 }}>
      <SidebarShell mode={mode} setMode={setMode}>
        {mode === 'ai' ? (
          <AgentSidebarContent
            chats={chats}
            activeChatId={activeChatId}
            onSelect={handleSelect}
            onNew={handleNew}
            onDelete={handleDelete}
          />
        ) : (
          <Suspense fallback={<div style={{ flex: 1 }} />}>
            <PlatformSidebarContent pathname={pathname} />
          </Suspense>
        )}
      </SidebarShell>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {mode === 'ai' ? (
          <ChatInterface
            chats={chats}
            activeChatId={activeChatId}
            onSend={handleSend}
            onNew={handleNew}
          />
        ) : (
          <>
            <TopBar />
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
