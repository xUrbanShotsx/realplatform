'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Zap, TrendingUp, Home, Phone, Mail, Bell, Sparkles, ChevronRight, CheckCircle2, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const BG      = '#f8fafc'
const CARD    = '#ffffff'
const BORDER  = 'rgba(0,0,0,0.09)'
const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE    = '#4361ee'
const PINK    = '#e3008c'
const PINK_S  = 'rgba(227,0,140,0.08)'
const GREEN   = '#10b981'
const AMBER   = '#f59e0b'
const RED     = '#ef4444'
const PURPLE  = '#8b5cf6'
const TEXT    = '#0f172a'
const TEXT2   = '#475569'
const TEXT3   = '#475569'
const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b','#0284c7']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

const KPIS_DEFAULT = [
  { label: 'Total Contacts',  value: '—', change: 'Your CRM',         color: GREEN },
  { label: 'Active Listings', value: '—', change: 'Current listings', color: BLUE  },
  { label: 'Tasks Due',       value: '—', change: 'Today & overdue',  color: AMBER },
  { label: 'Urgent Today',    value: '—', change: 'Actions required', color: RED   },
]

const PRIORITIES = [
  { name: 'Marcus Thornton',        action: 'Appraisal 2pm — AI brief ready',               urgency: 'URGENT', color: RED    },
  { name: 'The Anderson Family',    action: 'Counter-offer decision by 3:30pm',              urgency: 'URGENT', color: RED    },
  { name: 'Mark Spinelli',          action: 'Weekly campaign call overdue',                  urgency: 'TODAY',  color: PINK   },
  { name: 'James & Priya Kowalski', action: '3 days no contact — AI suggests call Priya',   urgency: 'TODAY',  color: AMBER  },
  { name: 'Nicki Lihou',            action: 'Pre-auction preview — strong buyer match',       urgency: 'TODAY',  color: AMBER  },
]

const HOT_OPPS = [
  { name: 'Marcus Thornton',        suburb: 'Bondi Beach', score: 92, value: '$2.4M–$2.6M', stage: 'Appraisal',  sc: PURPLE, signal: '7 intent signals this week'        },
  { name: 'James & Priya Kowalski', suburb: 'Paddington',  score: 88, value: '$1.9M–$2.1M', stage: 'Warm Lead',  sc: AMBER,  signal: '3 days cold — call Priya today'    },
  { name: 'Lisa Chen',              suburb: 'Mosman',       score: 81, value: '$3.8M–$4.2M', stage: 'Prospect',   sc: BLUE,   signal: 'Opened report 4× this week'        },
]

const LISTINGS_ATTN = [
  { vendor: 'Mark Spinelli',     address: '42 Foreshore Cres, Cronulla', issue: 'Call overdue',         ic: AMBER,  metric: 'Week 2 · 312 views',      cta: 'Call Now'   },
  { vendor: 'Anderson Family',   address: '55 Awaba St, Mosman',         issue: 'Counter-offer pending', ic: RED,    metric: 'Under Offer · $4.85M',   cta: 'View Deal'  },
  { vendor: 'Sandra Wilson',     address: '7 Park Rd, Manly',            issue: 'Appraisal tomorrow',    ic: PURPLE, metric: 'Tue 10am · AI brief ready',cta: 'Prep Brief' },
]

const AI_NOTIFS = [
  { color: PINK,  text: 'Pre-call brief ready for Marcus Thornton 2pm appraisal',            time: '2 min ago'  },
  { color: AMBER, text: 'Priya Mehta intent score jumped 56 → 74 — 2 new signals detected',  time: '18 min ago' },
  { color: BLUE,  text: '12 nurture emails sent automatically to warm leads this morning',    time: '1 hr ago'   },
  { color: GREEN, text: 'New 5★ Google review from Sarah & Tom Mitchell — AI response drafted', time: '2 hrs ago' },
]

const CTA_ROUTES: Record<string, string> = {
  'Call Now':   '/dashboard/contacts',
  'View Deal':  '/dashboard/pipeline',
  'Prep Brief': '/dashboard/appraisals',
}

export default function HomePage() {
  const router = useRouter()
  const [kpis, setKpis] = useState(KPIS_DEFAULT)
  const [firstName, setFirstName] = useState('there')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('org_id, first_name')
        .eq('user_id', user.id)
        .single()
      if (!profile?.org_id) return
      if (profile.first_name) setFirstName(profile.first_name)

      const today = new Date(); today.setHours(0,0,0,0)
      const todayIso = today.toISOString()

      const [{ count: contacts }, { count: listings }, { count: tasks }] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('org_id', profile.org_id),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('org_id', profile.org_id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('org_id', profile.org_id).lte('due_date', new Date().toISOString()).neq('status', 'done').neq('status', 'cancelled'),
      ])

      setKpis([
        { label: 'Total Contacts',  value: String(contacts ?? 0), change: 'Your CRM',         color: GREEN },
        { label: 'Active Listings', value: String(listings ?? 0), change: 'Current listings', color: BLUE  },
        { label: 'Tasks Due',       value: String(tasks ?? 0),    change: 'Today & overdue',  color: AMBER },
        { label: 'Urgent Today',    value: String((tasks ?? 0) > 0 ? tasks : 0), change: 'Actions required', color: RED },
      ])
    })
  }, [])

  const PRIORITIES_COUNT = PRIORITIES.length

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG, padding: 20, fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4 }}>Good morning, {firstName}.</div>
          <div style={{ fontSize: 13, color: TEXT3 }}>Sunday 26 July 2026 · 5 actions need your attention today</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, borderRadius: 9999 }}>
          <div style={{ width: 6, height: 6, background: PINK, borderRadius: 9999 }} />
          <span style={{ fontSize: 11, color: PINK, fontWeight: 600 }}>AI Daily Brief Ready</span>
        </div>
      </div>

      {/* AI Readiness banner */}
      <Link href="/dashboard/connect" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
        <div style={{ background: 'linear-gradient(135deg, #0d0d14, #111128)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
          {/* Ambient glow */}
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(227,0,140,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4361ee, #e3008c)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 3 }}>AI Chief of Staff · 31% ready</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>Email, phone, calendar and CRM are already built in and AI-powered. Connect your portals, social accounts, finance and signing platforms to complete the picture.</div>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(227,0,140,0.15)', border: '1px solid rgba(227,0,140,0.3)', borderRadius: 9999, padding: '4px 10px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#e3008c' }}>Set up AI</span>
              <ChevronRight size={10} color="#e3008c" />
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {[{ label: 'Portals', done: true }, { label: 'Social', done: false }, { label: 'Finance', done: true }, { label: 'Signing', done: true }].map((s) => (
                <div key={s.label} style={{ width: 26, height: 4, background: s.done ? 'linear-gradient(90deg, #4361ee, #e3008c)' : 'rgba(255,255,255,0.12)', borderRadius: 9999 }} />
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.04em' }}>{k.label}</div>
            <div style={{ fontSize: 10, color: k.color, marginTop: 3 }}>{k.change}</div>
          </div>
        ))}
      </div>

      {/* Two column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* AI Daily Brief */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Brain size={14} color={PINK} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>AI Daily Brief</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: PINK, background: PINK_S, padding: '2px 7px', fontWeight: 700, borderRadius: 9999 }}>✦ AI Generated</span>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: TEXT2, lineHeight: 1.8 }}>
                <strong style={{ color: TEXT }}>Marcus Thornton's appraisal at 2pm is your most important opportunity today.</strong> His intent score is 92 and he's comparing you with McGrath. His wife Sarah is the emotional decision-maker — lead with lifestyle, not just price. Comparable at 9 Arcadia St sold $2.55M last month, giving you a strong anchor above $2.4M.
              </p>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: TEXT2, lineHeight: 1.8 }}>
                The Anderson Family counter-offer is at 3:30pm. Accept the 5-day inspection extension with a price-protection clause. David is nervous — reassure him this is procedural. Settlement at <strong style={{ color: GREEN }}>$4.85M</strong> is on track.
              </p>
              <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.8 }}>
                Mark Spinelli's Cronulla campaign is <strong style={{ color: AMBER }}>22% above benchmark</strong> with 312 views and 18 inspections. He already bought his next home — a positive update call today keeps him confident and prevents vendor anxiety.
              </p>
            </div>
          </div>

          {/* Today's Priorities */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={13} color={AMBER} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Today's Priorities</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3 }}>{PRIORITIES_COUNT} actions</span>
            </div>
            {PRIORITIES.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderBottom: i < PRIORITIES.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                <div style={{ width: 4, height: 4, background: p.color, borderRadius: 9999, flexShrink: 0 }} />
                <div style={{ width: 30, height: 30, background: avColor(p.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0, borderRadius: '50%' }}>
                  {initials(p.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: TEXT }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: TEXT2 }}>{p.action}</div>
                </div>
                <span style={{ fontSize: 9, color: p.color, background: `${p.color}15`, padding: '2px 7px', fontWeight: 700, flexShrink: 0, borderRadius: 9999 }}>{p.urgency}</span>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => router.push('/dashboard/contacts')} style={{ width: 26, height: 26, background: `${GREEN}18`, border: `1px solid ${GREEN}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 9999 }}><Phone size={11} color={GREEN} /></button>
                  <button onClick={() => router.push('/dashboard/contacts')} style={{ width: 26, height: 26, background: `${BLUE}18`, border: `1px solid ${BLUE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 9999 }}><Mail size={11} color={BLUE} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Hot Opportunities */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={13} color={GREEN} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Hot Opportunities</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3 }}>Top by AI Score</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
              {HOT_OPPS.map((o, i) => (
                <div key={i} style={{ padding: 14, borderRight: i < 2 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <div style={{ width: 30, height: 30, background: avColor(o.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', borderRadius: '50%' }}>{initials(o.name)}</div>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: TEXT, lineHeight: 1.2 }}>{o.name}</div>
                      <div style={{ fontSize: 10, color: TEXT3 }}>{o.suburb}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: o.sc, letterSpacing: '-0.04em', marginBottom: 2 }}>{o.score}</div>
                  <div style={{ fontSize: 9, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }}>AI SCORE</div>
                  <span style={{ fontSize: 10, color: o.sc, background: `${o.sc}15`, padding: '2px 7px', fontWeight: 700, borderRadius: 9999 }}>{o.stage}</span>
                  <div style={{ fontSize: 11, color: TEXT2, marginTop: 6 }}>{o.value}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <div style={{ width: 4, height: 4, background: PINK, borderRadius: 9999 }} />
                    <span style={{ fontSize: 10, color: TEXT3 }}>{o.signal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Listings Requiring Attention */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Home size={13} color={AMBER} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Listings Requiring Attention</span>
            </div>
            {LISTINGS_ATTN.map((l, i) => (
              <div key={i} style={{ padding: '10px 16px', borderBottom: i < LISTINGS_ATTN.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 1 }}>{l.vendor}</div>
                <div style={{ fontSize: 10, color: TEXT3, marginBottom: 6 }}>{l.address}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 9, color: l.ic, background: `${l.ic}15`, padding: '2px 6px', fontWeight: 700, borderRadius: 9999 }}>{l.issue}</span>
                    <div style={{ fontSize: 10, color: TEXT3, marginTop: 3 }}>{l.metric}</div>
                  </div>
                  <button onClick={() => router.push(CTA_ROUTES[l.cta] ?? '/dashboard/listings')} style={{ background: BLUE, border: 'none', color: '#fff', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>{l.cta}</button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Notifications */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={13} color={PINK} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>AI Notifications</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: PINK, background: PINK_S, padding: '1px 6px', fontWeight: 700, borderRadius: 9999 }}>4</span>
            </div>
            {AI_NOTIFS.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 16px', borderBottom: i < AI_NOTIFS.length - 1 ? `1px solid ${BORDER2}` : 'none', alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, background: n.color, borderRadius: 9999, marginTop: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: TEXT2, lineHeight: 1.5 }}>{n.text}</div>
                  <div style={{ fontSize: 10, color: TEXT3, marginTop: 2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly stats */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 14 }}>MONTH-TO-DATE</div>
            {[
              { label: 'Appraisals',    val: 6,  max: 10, color: PURPLE },
              { label: 'Listings Won',  val: 3,  max: 6,  color: BLUE   },
              { label: 'Conversion %',  val: 50, max: 100,color: GREEN  },
              { label: 'NPS Score',     val: 94, max: 100,color: AMBER  },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: TEXT2 }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.val}{s.max === 100 ? '%' : ''}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(0,0,0,0.04)', borderRadius: 9999 }}>
                  <div style={{ height: '100%', width: `${(s.val/s.max)*100}%`, background: `linear-gradient(90deg, ${s.color}, ${PINK})`, borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
