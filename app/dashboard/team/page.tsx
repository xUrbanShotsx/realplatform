'use client'
import { useState } from 'react'
import {
  Brain, Trophy, Phone, Mail, TrendingUp, TrendingDown, Target, BarChart2, Zap,
  CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Home, PhoneCall, Star,
  Users, Activity, Minus, ChevronUp, ChevronDown, Medal, MessageSquare, Eye,
  Clock, Flame, Calendar,
} from 'lucide-react'

const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const RED = '#ef4444'; const ORANGE = '#f97316'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const CARD = '#ffffff'; const CARD2 = '#f8fafc'

const TABS = ['Members', 'Leaderboard', 'AI Coaching']

const AGENTS = [
  {
    id: 'jye',
    name: 'Jye San Jurjo',
    role: 'Principal',
    color: BLUE,
    phone: '0412 345 678',
    email: 'jye@spinellire.com.au',
    score: 94,
    scoreTrend: +5,
    // KPIs
    gci: 58400,           gciTarget: 70000,
    listings: 8,          listingsTarget: 10,
    sales: 3,             salesTarget: 4,
    appraisals: 6,        appraisalsTarget: 8,
    calls: 42,            callsTarget: 50,
    convRate: 74,         convRateTarget: 70,
    pipeline: 2850000,
    avgDom: 24,
    responseTime: 18,
    rankChange: +3,
    // Coaching
    wins: [
      'Listing conversion at 74% — top 5% NSW agents this quarter',
      'Average lead response time 18 min — well under 30 min benchmark',
      'GCI pace 83% of monthly target with 4 days remaining',
    ],
    actions: [
      { priority: 'HIGH', text: 'Call Tom & Lucy Gardiner before 10am — enquiry is 36 hours old and cooling', due: 'Today' },
      { priority: 'HIGH', text: 'Re-engage 3 unconverted appraisals from 2 weeks ago — send market update + comparable sales', due: 'Today' },
      { priority: 'MED',  text: 'Book open home for 14 Cliff St, Cronulla — no inspection scheduled yet', due: 'Tomorrow' },
      { priority: 'MED',  text: 'Review price guide on 7 Ocean St — 2 comparable sales suggest guide can move up $40K', due: 'This week' },
    ],
    opportunities: [
      '2 buyers in your database match the off-market profile at 22 Kingsway, Caringbah — match and contact',
      'Sarah & Tom Mitchell are 14 months post-purchase — prime time for referral ask + market update',
    ],
    coachQuestions: [
      '"What\'s the single thing blocking you from converting the remaining 2 appraisals this week?"',
      '"Which of your 8 listings needs the most vendor communication attention right now?"',
    ],
    focusAreas: [
      { label: 'GCI Pace',     pct: 83, color: GREEN  },
      { label: 'Prospecting',  pct: 78, color: BLUE   },
      { label: 'Conversion',   pct: 74, color: AMBER  },
      { label: 'Pipeline Mgmt',pct: 90, color: TEAL   },
    ],
    weeklyActivity: [
      { week: 'W1', calls: 38, appraisals: 2, leads: 6 },
      { week: 'W2', calls: 44, appraisals: 3, leads: 8 },
      { week: 'W3', calls: 41, appraisals: 2, leads: 5 },
      { week: 'W4', calls: 42, appraisals: 6, leads: 7 },
    ],
    recentActivity: [
      { icon: PhoneCall, text: 'Called Tom & Lucy Gardiner — no answer, left voicemail', time: '2h ago',     color: BLUE   },
      { icon: Home,      text: 'New listing: 14 Cliff St, Cronulla — $2.2M–$2.4M',         time: '4h ago',     color: GREEN  },
      { icon: Star,      text: 'Sold: 7 Marine Pde, Cronulla — $2.1M ($50K above reserve)', time: 'Yesterday',  color: AMBER  },
      { icon: Eye,       text: 'Appraisal booked: 4 Kurrawa Ave, Cronulla', time: '2 days ago', color: PURPLE },
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah Mitchell',
    role: 'Senior Agent',
    color: PURPLE,
    phone: '0413 456 789',
    email: 'sarah@spinellire.com.au',
    score: 82,
    scoreTrend: -2,
    gci: 32100,           gciTarget: 45000,
    listings: 5,          listingsTarget: 7,
    sales: 2,             salesTarget: 3,
    appraisals: 4,        appraisalsTarget: 6,
    calls: 29,            callsTarget: 40,
    convRate: 57,         convRateTarget: 65,
    pipeline: 1640000,
    avgDom: 31,
    responseTime: 34,
    rankChange: -1,
    wins: [
      '2 listings converted to sale this month — on par with personal best',
      'Open home attendance averaging 11 groups — above team average of 8',
    ],
    actions: [
      { priority: 'HIGH', text: 'Follow up Rachel Obi — no contact in 52 hours, lead is going cold', due: 'Now' },
      { priority: 'HIGH', text: 'Domain portal enquiry from yesterday still unactioned — respond immediately', due: 'Now' },
      { priority: 'MED',  text: 'Open home follow-ups: 7 groups from last Saturday not yet contacted', due: 'Today' },
      { priority: 'MED',  text: 'Increase call volume to 40/week — currently 29, gap is 11 calls behind target', due: 'This week' },
    ],
    opportunities: [
      'Aunty of listing vendor at 12 Elouera Rd has expressed interest in selling — ask for introduction',
      '3 of your open home groups have matching properties in your pipeline — send tailored shortlist',
    ],
    coachQuestions: [
      '"What\'s preventing you from reaching out to leads within the 2-hour window?"',
      '"Walk me through your follow-up process after an open home — where does it break down?"',
    ],
    focusAreas: [
      { label: 'GCI Pace',     pct: 71, color: AMBER  },
      { label: 'Lead Response',pct: 48, color: RED    },
      { label: 'Conversion',   pct: 57, color: AMBER  },
      { label: 'Call Volume',  pct: 73, color: BLUE   },
    ],
    weeklyActivity: [
      { week: 'W1', calls: 32, appraisals: 1, leads: 5 },
      { week: 'W2', calls: 28, appraisals: 2, leads: 4 },
      { week: 'W3', calls: 31, appraisals: 2, leads: 6 },
      { week: 'W4', calls: 29, appraisals: 4, leads: 3 },
    ],
    recentActivity: [
      { icon: AlertTriangle, text: 'Rachel Obi — 52 hrs since last contact', time: '2h ago',     color: RED    },
      { icon: PhoneCall,     text: 'Open home follow-ups outstanding (7 groups)', time: '3h ago', color: AMBER  },
      { icon: Star,          text: 'Sold: 22 Elouera Rd, Cronulla — $1.85M', time: '3 days ago', color: GREEN  },
      { icon: Eye,           text: 'Appraisal: 18 Park St, Cronulla', time: '3 days ago',        color: PURPLE },
    ],
  },
  {
    id: 'tom',
    name: 'Tom Barker',
    role: 'Agent',
    color: TEAL,
    phone: '0414 567 890',
    email: 'tom@spinellire.com.au',
    score: 71,
    scoreTrend: 0,
    gci: 18400,           gciTarget: 30000,
    listings: 3,          listingsTarget: 5,
    sales: 1,             salesTarget: 2,
    appraisals: 2,        appraisalsTarget: 5,
    calls: 21,            callsTarget: 35,
    convRate: 22,         convRateTarget: 50,
    pipeline: 890000,
    avgDom: 41,
    responseTime: 55,
    rankChange: 0,
    wins: [
      'Open home attendance improved 40% this month — 14 groups avg vs 10 prior month',
      'First solo settlement completed — strong vendor feedback score (9.2/10)',
    ],
    actions: [
      { priority: 'HIGH', text: 'Conversion from open home to private inspection at 22% — send AI personalised follow-up within 2hrs of each OH', due: 'This week' },
      { priority: 'HIGH', text: 'Appraisal pipeline is 60% below target — book 3 more appraisals before month end', due: 'This week' },
      { priority: 'MED',  text: 'Average days on market (41) is 17 days above team benchmark — review pricing on 2 listings', due: 'Today' },
      { priority: 'LOW',  text: 'Increase prospecting calls to 35/week — only at 21 this week', due: 'Ongoing' },
    ],
    opportunities: [
      'Suburb farm in Caringbah South has 3 properties overdue for market update letter — great prospecting angle',
      'Past open home group (Davis family) has re-engaged on portal — warm call opportunity',
    ],
    coachQuestions: [
      '"Tell me about the last 3 open homes — what happened between the inspection and the follow-up call?"',
      '"What would it take for you to book 3 additional appraisals this week?"',
    ],
    focusAreas: [
      { label: 'GCI Pace',     pct: 61, color: ORANGE },
      { label: 'Prospecting',  pct: 60, color: RED    },
      { label: 'Conversion',   pct: 44, color: RED    },
      { label: 'OH Follow-up', pct: 55, color: AMBER  },
    ],
    weeklyActivity: [
      { week: 'W1', calls: 18, appraisals: 0, leads: 3 },
      { week: 'W2', calls: 24, appraisals: 1, leads: 4 },
      { week: 'W3', calls: 19, appraisals: 0, leads: 2 },
      { week: 'W4', calls: 21, appraisals: 2, leads: 3 },
    ],
    recentActivity: [
      { icon: PhoneCall, text: 'Davis family — re-engaged on portal, warm call needed', time: '1h ago',     color: AMBER  },
      { icon: Home,      text: 'Open home: 6 Kingsway, Caringbah — 14 groups', time: '2 days ago',          color: TEAL   },
      { icon: Star,      text: 'Settled: 3 Boronia St, Caringbah — $1.35M', time: '4 days ago',             color: GREEN  },
      { icon: Activity,  text: 'Days on market alert: 6 Kingsway at 41 days', time: '4 days ago',            color: RED    },
    ],
  },
  {
    id: 'emma',
    name: 'Emma Clarke',
    role: 'Property Manager',
    color: ORANGE,
    phone: '0415 678 901',
    email: 'emma@spinellire.com.au',
    score: 78,
    scoreTrend: +8,
    gci: 22600,           gciTarget: 28000,
    listings: 0,          listingsTarget: 0,
    sales: 0,             salesTarget: 0,
    appraisals: 3,        appraisalsTarget: 4,
    calls: 38,            callsTarget: 40,
    convRate: 88,         convRateTarget: 85,
    pipeline: 0,
    avgDom: 12,
    responseTime: 22,
    rankChange: +2,
    wins: [
      'Rental renewal rate 88% — above 85% target and agency personal record',
      'Response time 22 min average — fastest on team this month',
      'Zero maintenance disputes logged this quarter',
    ],
    actions: [
      { priority: 'MED',  text: 'Complete routine inspection reports for 4 properties — overdue 3 days', due: 'Today' },
      { priority: 'MED',  text: 'Follow up rental appraisal at 18 Nicholson Pde — landlord waiting on comparative analysis', due: 'Tomorrow' },
      { priority: 'LOW',  text: 'Lease renewals due in 60 days: 3 tenants — initiate renewal process now', due: 'This week' },
    ],
    opportunities: [
      '2 landlords in your portfolio have expressed interest in selling — introduce to Jye for listing appraisal',
      'Vacancy rate in Cronulla below 1.2% — now is prime time to approach landlords about rent reviews',
    ],
    coachQuestions: [
      '"Which 2 landlords are most likely to refer another property to your management?"',
      '"What would help you complete those inspection reports faster?"',
    ],
    focusAreas: [
      { label: 'Renewal Rate', pct: 88, color: GREEN  },
      { label: 'Response Time',pct: 82, color: TEAL   },
      { label: 'GCI Pace',     pct: 81, color: GREEN  },
      { label: 'Inspections',  pct: 65, color: AMBER  },
    ],
    weeklyActivity: [
      { week: 'W1', calls: 35, appraisals: 1, leads: 4 },
      { week: 'W2', calls: 40, appraisals: 2, leads: 5 },
      { week: 'W3', calls: 36, appraisals: 0, leads: 3 },
      { week: 'W4', calls: 38, appraisals: 3, leads: 6 },
    ],
    recentActivity: [
      { icon: CheckCircle2, text: 'Renewal confirmed: 14 Elouera Rd — 12 month lease at $650/wk', time: '1h ago',    color: GREEN  },
      { icon: PhoneCall,    text: 'Routine inspection: 8 Nicholson Pde — report pending', time: '3h ago',             color: ORANGE },
      { icon: Star,         text: 'New PM listing: 32 Ocean St, Cronulla — $680/wk', time: 'Yesterday',              color: GREEN  },
      { icon: Lightbulb,    text: 'Rent review recommended: 6 properties due for increase', time: '2 days ago',      color: AMBER  },
    ],
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

function fmtGci(v: number) {
  return v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`
}

function fmtPipeline(v: number) {
  if (!v) return '—'
  return v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`
}

function scoreColor(s: number) {
  if (s >= 85) return GREEN
  if (s >= 70) return AMBER
  return RED
}

function pctColor(pct: number, target: number) {
  const ratio = pct / target
  if (ratio >= 0.9) return GREEN
  if (ratio >= 0.7) return AMBER
  return RED
}

function TrendChip({ val }: { val: number }) {
  if (val > 0) return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 700, color: GREEN }}><ChevronUp size={10} strokeWidth={2} />+{val}</span>
  if (val < 0) return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 700, color: RED }}><ChevronDown size={10} strokeWidth={2} />{val}</span>
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 700, color: TEXT3 }}><Minus size={10} strokeWidth={2} />—</span>
}

function ProgressBar({ value, target, color, height = 4 }: { value: number; target: number; color: string; height?: number }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div style={{ width: '100%', height, background: 'rgba(0,0,0,0.06)', borderRadius: 0, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.6s ease' }} />
    </div>
  )
}

function MiniSparkline({ data, color }: { data: { week: string; calls: number; appraisals: number; leads: number }[]; color: string }) {
  const vals = data.map(d => d.calls)
  const max = Math.max(...vals)
  const W = 120; const H = 32; const barW = 20; const gap = 6
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {vals.map((v, i) => {
        const barH = max === 0 ? 2 : Math.max(3, (v / max) * H)
        const x = i * (barW + gap)
        return (
          <rect key={i} x={x} y={H - barH} width={barW} height={barH} fill={color} opacity={0.8} />
        )
      })}
    </svg>
  )
}

function PriorityBadge({ p }: { p: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    HIGH: { bg: `${RED}18`, color: RED },
    MED:  { bg: `${AMBER}20`, color: AMBER },
    LOW:  { bg: `rgba(0,0,0,0.05)`, color: TEXT3 },
  }
  const s = map[p] ?? map.LOW
  return <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 5px', background: s.bg, color: s.color, letterSpacing: '0.06em', flexShrink: 0 }}>{p}</span>
}

// ─── Members Tab ─────────────────────────────────────────────────────────────

function MembersTab({ onCoach }: { onCoach: () => void }) {
  const [sel, setSel] = useState(AGENTS[0])
  const a = sel

  const kpis = [
    { label: 'GCI MTD',       val: fmtGci(a.gci),           raw: a.gci,           target: a.gciTarget,       color: GREEN,  sub: `Target ${fmtGci(a.gciTarget)}` },
    { label: 'Pipeline',      val: fmtPipeline(a.pipeline),  raw: a.pipeline,      target: a.pipeline || 1,   color: BLUE,   sub: 'Active pipeline value' },
    { label: 'Listings',      val: `${a.listings}`,          raw: a.listings,      target: a.listingsTarget,  color: BLUE,   sub: `Target ${a.listingsTarget}` },
    { label: 'Appraisals',    val: `${a.appraisals}`,        raw: a.appraisals,    target: a.appraisalsTarget,color: PURPLE, sub: `Target ${a.appraisalsTarget}` },
    { label: 'Sales MTD',     val: `${a.sales}`,             raw: a.sales,         target: a.salesTarget,     color: AMBER,  sub: `Target ${a.salesTarget}` },
    { label: 'Conv. Rate',    val: `${a.convRate}%`,         raw: a.convRate,      target: a.convRateTarget,  color: TEAL,   sub: `Target ${a.convRateTarget}%` },
    { label: 'Calls / Week',  val: `${a.calls}`,             raw: a.calls,         target: a.callsTarget,     color: ORANGE, sub: `Target ${a.callsTarget}` },
    { label: 'Avg Response',  val: `${a.responseTime}m`,     raw: 60 - a.responseTime, target: 30,            color: a.responseTime <= 30 ? GREEN : RED, sub: 'Target < 30 min' },
  ]

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 264, flexShrink: 0, borderRight: `1px solid ${BORDER}`, overflowY: 'auto', background: CARD2 }}>
        {AGENTS.map(ag => {
          const active = sel.id === ag.id
          const sc = scoreColor(ag.score)
          return (
            <div key={ag.id} onClick={() => setSel(ag)} style={{ padding: '12px 14px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: active ? CARD : 'transparent', borderLeft: `3px solid ${active ? ag.color : 'transparent'}`, transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <div style={{ width: 34, height: 34, background: ag.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(ag.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ag.name}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{ag.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: sc }}>{ag.score}</div>
                  <TrendChip val={ag.scoreTrend} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {[
                  { v: fmtGci(ag.gci), c: GREEN, l: 'GCI' },
                  { v: `${ag.listings}`, c: BLUE, l: 'Listed' },
                  { v: `${ag.convRate}%`, c: TEAL, l: 'Conv' },
                ].map(s => (
                  <div key={s.l} style={{ background: `${s.c}10`, padding: '4px 6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 8, color: TEXT3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>{initials(a.name)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>{a.name}</div>
            <div style={{ fontSize: 11, color: TEXT3 }}>{a.role} · {a.email} · {a.phone}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => window.location.href = `tel:${a.phone}`} style={{ background: 'none', border: `1px solid ${BORDER}`, color: TEXT2, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} strokeWidth={1.75} />Call</button>
            <button onClick={() => window.location.href = `mailto:${a.email}`} style={{ background: 'none', border: `1px solid ${BORDER}`, color: TEXT2, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={11} strokeWidth={1.75} />Email</button>
            <button onClick={onCoach} style={{ background: PINK, border: 'none', color: '#fff', padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Brain size={11} strokeWidth={1.75} />AI Coach</button>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: scoreColor(a.score), letterSpacing: '-0.04em', lineHeight: 1 }}>{a.score}</div>
            <div style={{ fontSize: 9, color: TEXT3, marginTop: 2 }}>AI SCORE</div>
          </div>
          <div style={{ width: 1, height: 36, background: BORDER }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: TEXT2, fontWeight: 600 }}>Monthly performance against targets</span>
              <span style={{ fontSize: 10, color: TEXT3 }}>Avg of all KPIs</span>
            </div>
            <ProgressBar value={a.score} target={100} color={scoreColor(a.score)} height={6} />
          </div>
          {a.avgDom > 0 && (
            <>
              <div style={{ width: 1, height: 36, background: BORDER }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: a.avgDom <= 28 ? GREEN : RED, lineHeight: 1 }}>{a.avgDom}d</div>
                <div style={{ fontSize: 9, color: TEXT3, marginTop: 2 }}>AVG DOM</div>
              </div>
            </>
          )}
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {kpis.map(k => {
            const pct = Math.min(100, Math.round((k.raw / (k.target || 1)) * 100))
            const col = k.label === 'Avg Response' ? (a.responseTime <= 30 ? GREEN : RED) : pctColor(k.raw, k.target || 1)
            return (
              <div key={k.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '10px 12px' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: k.color, letterSpacing: '-0.03em', marginBottom: 2, lineHeight: 1 }}>{k.val}</div>
                <div style={{ fontSize: 9, color: TEXT3, marginBottom: 6 }}>{k.label}</div>
                <ProgressBar value={k.raw} target={k.target || 1} color={col} height={3} />
                <div style={{ fontSize: 8, color: TEXT3, marginTop: 4 }}>{k.sub} · {pct}%</div>
              </div>
            )
          })}
        </div>

        {/* Activity chart + recent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {/* Sparkline */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 10 }}>CALLS — LAST 4 WEEKS</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
              {a.weeklyActivity.map((w, i) => {
                const max = Math.max(...a.weeklyActivity.map(x => x.calls))
                const h = max === 0 ? 4 : Math.max(4, (w.calls / max) * 44)
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: '100%', height: h, background: a.color, opacity: i === a.weeklyActivity.length - 1 ? 1 : 0.4 }} />
                    <div style={{ fontSize: 8, color: TEXT3 }}>{w.week}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: TEXT2 }}>{w.calls}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 12 }}>
              {[
                { label: 'Appraisals', vals: a.weeklyActivity.map(w => w.appraisals), color: PURPLE },
                { label: 'Leads',      vals: a.weeklyActivity.map(w => w.leads),      color: TEAL   },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 8, height: 8, background: m.color }} />
                  <span style={{ fontSize: 9, color: TEXT3 }}>{m.label}: {m.vals[m.vals.length - 1]} this week</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 10 }}>RECENT ACTIVITY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {a.recentActivity.map((act, i) => {
                const Icon = act.icon
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 24, height: 24, background: `${act.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={11} color={act.color} strokeWidth={1.75} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: TEXT2, lineHeight: 1.4 }}>{act.text}</div>
                      <div style={{ fontSize: 9, color: TEXT3, marginTop: 2 }}>{act.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* AI Coaching panel */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ background: PINK_S, borderBottom: `1px solid rgba(227,0,140,0.15)`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Brain size={12} color={PINK} strokeWidth={1.75} />
            <span style={{ fontSize: 10, fontWeight: 700, color: PINK }}>✦ AI COACHING — TODAY'S BRIEF</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, color: TEXT3 }}>27 July 2026</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {/* Actions */}
            <div style={{ padding: 14, borderRight: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 8 }}>PRIORITY ACTIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {a.actions.map((ac, i) => (
                  <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                    <PriorityBadge p={ac.priority} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: TEXT2, lineHeight: 1.5 }}>{ac.text}</div>
                      <div style={{ fontSize: 9, color: TEXT3, marginTop: 2 }}>{ac.due}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Wins */}
              <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 7 }}>WINS THIS WEEK</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {a.wins.map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <CheckCircle2 size={11} color={GREEN} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 11, color: TEXT2, lineHeight: 1.4 }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Opportunities */}
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 7 }}>OPPORTUNITIES DETECTED</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {a.opportunities.map((o, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <Lightbulb size={11} color={AMBER} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 11, color: TEXT2, lineHeight: 1.4 }}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Leaderboard Tab ──────────────────────────────────────────────────────────

type Period = 'week' | 'month' | 'quarter' | 'ytd'
type Metric = 'gci' | 'listings' | 'sales' | 'appraisals' | 'calls'

const PERIOD_LABELS: Record<Period, string> = { week: 'This Week', month: 'This Month', quarter: 'This Quarter', ytd: 'YTD' }
const METRIC_LABELS: Record<Metric, string> = { gci: 'GCI', listings: 'Listings', sales: 'Sales', appraisals: 'Appraisals', calls: 'Calls' }

function getMetricVal(a: typeof AGENTS[0], m: Metric) {
  switch (m) {
    case 'gci': return a.gci
    case 'listings': return a.listings
    case 'sales': return a.sales
    case 'appraisals': return a.appraisals
    case 'calls': return a.calls
  }
}

function getMetricTarget(a: typeof AGENTS[0], m: Metric) {
  switch (m) {
    case 'gci': return a.gciTarget
    case 'listings': return a.listingsTarget
    case 'sales': return a.salesTarget
    case 'appraisals': return a.appraisalsTarget
    case 'calls': return a.callsTarget
  }
}

function fmtMetric(v: number, m: Metric) {
  if (m === 'gci') return fmtGci(v)
  return `${v}`
}

function LeaderboardTab() {
  const [period, setPeriod] = useState<Period>('month')
  const [metric, setMetric] = useState<Metric>('gci')

  const sorted = [...AGENTS].sort((a, b) => getMetricVal(b, metric) - getMetricVal(a, metric))
  const top3 = sorted.slice(0, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) // 2nd, 1st, 3rd

  const teamTotal = AGENTS.reduce((s, a) => s + getMetricVal(a, metric), 0)
  const teamTarget = AGENTS.reduce((s, a) => s + getMetricTarget(a, metric), 0)

  return (
    <div style={{ overflowY: 'auto', padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: CARD, border: `1px solid ${BORDER}` }}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: '7px 13px', fontSize: 11, fontWeight: period === p ? 700 : 400, background: period === p ? TEXT : 'none', color: period === p ? '#fff' : TEXT2, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', background: CARD, border: `1px solid ${BORDER}` }}>
          {(Object.keys(METRIC_LABELS) as Metric[]).map(m => (
            <button key={m} onClick={() => setMetric(m)} style={{ padding: '7px 13px', fontSize: 11, fontWeight: metric === m ? 700 : 400, background: metric === m ? BLUE : 'none', color: metric === m ? '#fff' : TEXT2, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: TEXT3 }}>
          Team total: <strong style={{ color: TEXT }}>{fmtMetric(teamTotal, metric)}</strong> · Target: <strong style={{ color: TEXT }}>{fmtMetric(teamTarget, metric)}</strong>
        </div>
      </div>

      {/* Podium */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
        {podiumOrder.map((a, podiumIdx) => {
          const actualRank = sorted.findIndex(x => x.id === a.id) + 1
          const podiumH = [100, 140, 80][podiumIdx]
          const medalColors = ['#94a3b8', '#f59e0b', '#b45309']
          const medalColor = [medalColors[1], medalColors[0], medalColors[2]][podiumIdx]
          const val = getMetricVal(a, metric)
          const tgt = getMetricTarget(a, metric)
          const pct = Math.min(100, Math.round((val / (tgt || 1)) * 100))
          return (
            <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: podiumIdx === 1 ? '0 0 200px' : '0 0 160px' }}>
              <div style={{ width: 44, height: 44, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>{initials(a.name)}</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: podiumIdx === 1 ? 24 : 18, fontWeight: 900, color: a.color, letterSpacing: '-0.03em' }}>{fmtMetric(val, metric)}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>{a.name}</div>
                <div style={{ fontSize: 9, color: TEXT3 }}>{a.role}</div>
              </div>
              <div style={{ width: '100%', height: podiumH, background: `${a.color}20`, border: `2px solid ${a.color}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10, gap: 4 }}>
                <Medal size={20} color={medalColor} strokeWidth={1.5} />
                <span style={{ fontSize: 16, fontWeight: 900, color: a.color }}>#{actualRank}</span>
                <span style={{ fontSize: 9, color: TEXT3 }}>{pct}% of target</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full table */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trophy size={12} color={AMBER} strokeWidth={1.75} />
          <span style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>Full Rankings — {PERIOD_LABELS[period]} · {METRIC_LABELS[metric]}</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Rank', 'Agent', 'Role', METRIC_LABELS[metric], 'vs Target', 'AI Score', 'Change'].map(h => (
                <th key={h} style={{ padding: '8px 14px', fontSize: 9, fontWeight: 700, color: TEXT3, textAlign: 'left', letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((a, i) => {
              const val = getMetricVal(a, metric)
              const tgt = getMetricTarget(a, metric)
              const pct = Math.min(100, Math.round((val / (tgt || 1)) * 100))
              const col = pctColor(val, tgt || 1)
              return (
                <tr key={a.id} style={{ borderBottom: `1px solid ${BORDER2}` }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, fontSize: 16, color: i === 0 ? AMBER : TEXT2, width: 48 }}>#{i + 1}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 30, height: 30, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{initials(a.name)}</div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 11, color: TEXT3 }}>{a.role}</td>
                  <td style={{ padding: '12px 14px', fontSize: 15, fontWeight: 800, color: a.color }}>{fmtMetric(val, metric)}</td>
                  <td style={{ padding: '12px 14px', width: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={val} target={tgt || 1} color={col} height={5} /></div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: col, width: 32, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor(a.score) }}>{a.score}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <TrendChip val={a.rankChange} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* Team summary row */}
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 16, background: CARD2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em' }}>TEAM TOTAL</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{fmtMetric(teamTotal, metric)}</span>
          <div style={{ flex: 1, maxWidth: 200 }}><ProgressBar value={teamTotal} target={teamTarget} color={pctColor(teamTotal, teamTarget)} height={5} /></div>
          <span style={{ fontSize: 11, fontWeight: 700, color: pctColor(teamTotal, teamTarget) }}>{Math.round((teamTotal / (teamTarget || 1)) * 100)}% of target</span>
          <span style={{ fontSize: 10, color: TEXT3 }}>Target: {fmtMetric(teamTarget, metric)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── AI Coaching Tab ──────────────────────────────────────────────────────────

function AICoachingTab() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const totalActions = AGENTS.reduce((s, a) => s + a.actions.length, 0)
  const aboveTarget = AGENTS.filter(a => a.score >= 75).length
  const avgScore = Math.round(AGENTS.reduce((s, a) => s + a.score, 0) / AGENTS.length)

  return (
    <div style={{ overflowY: 'auto', padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[
          { label: 'Team AI Score', val: `${avgScore}`, sub: 'Average across all agents', icon: Brain, color: PINK },
          { label: 'Hitting Target', val: `${aboveTarget}/${AGENTS.length}`, sub: 'Agents above 75 score', icon: Target, color: GREEN },
          { label: 'Priority Actions', val: `${totalActions}`, sub: 'AI-flagged across team', icon: Zap, color: AMBER },
          { label: 'Next Session', val: 'Mon 28 Jul', sub: 'Scheduled team coaching', icon: Calendar, color: BLUE },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={s.color} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 9, color: TEXT3, marginTop: 3 }}>{s.label}</div>
                <div style={{ fontSize: 9, color: TEXT3, marginTop: 1 }}>{s.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Per-agent coaching cards */}
      {AGENTS.map(a => {
        const isOpen = expanded === a.id
        const highActions = a.actions.filter(ac => ac.priority === 'HIGH')
        return (
          <div key={a.id} style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            {/* Card header — always visible */}
            <div
              onClick={() => setExpanded(isOpen ? null : a.id)}
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: isOpen ? `1px solid ${BORDER}` : 'none' }}
            >
              <div style={{ width: 38, height: 38, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(a.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{a.name}</span>
                  <span style={{ fontSize: 10, color: TEXT3 }}>{a.role}</span>
                  {highActions.length > 0 && (
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', background: `${RED}15`, color: RED }}>{highActions.length} HIGH priority</span>
                  )}
                </div>
                {/* Focus areas preview */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {a.focusAreas.slice(0, 3).map(f => (
                    <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 36, height: 3, background: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${f.pct}%`, background: f.color }} />
                      </div>
                      <span style={{ fontSize: 9, color: TEXT3 }}>{f.label} {f.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: scoreColor(a.score), lineHeight: 1 }}>{a.score}</div>
                <TrendChip val={a.scoreTrend} />
              </div>
              <ChevronDown size={14} color={TEXT3} strokeWidth={1.75} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {/* Expanded coaching session */}
            {isOpen && (
              <div>
                {/* AI brief header */}
                <div style={{ padding: '8px 16px', background: PINK_S, borderBottom: `1px solid rgba(227,0,140,0.15)`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Brain size={11} color={PINK} strokeWidth={1.75} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: '0.06em' }}>✦ AI COACHING SESSION — 27 JULY 2026</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                  {/* Priority actions */}
                  <div style={{ padding: 14, borderRight: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 9 }}>PRIORITY ACTIONS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {a.actions.map((ac, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 9, fontWeight: 800, color: TEXT3, marginTop: 1, width: 14, flexShrink: 0 }}>{i + 1}.</span>
                          <PriorityBadge p={ac.priority} />
                          <div>
                            <div style={{ fontSize: 11, color: TEXT2, lineHeight: 1.5 }}>{ac.text}</div>
                            <div style={{ fontSize: 9, color: TEXT3 }}>{ac.due}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wins + Opportunities */}
                  <div style={{ borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 14, borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 8 }}>WINS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {a.wins.map((w, i) => (
                          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                            <CheckCircle2 size={11} color={GREEN} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 11, color: TEXT2, lineHeight: 1.4 }}>{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 8 }}>OPPORTUNITIES</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {a.opportunities.map((o, i) => (
                          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                            <Lightbulb size={11} color={AMBER} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 11, color: TEXT2, lineHeight: 1.4 }}>{o}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Focus areas + coaching questions */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 14, borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 8 }}>FOCUS AREAS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {a.focusAreas.map(f => (
                          <div key={f.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                              <span style={{ fontSize: 10, color: TEXT2, fontWeight: 500 }}>{f.label}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: f.color }}>{f.pct}%</span>
                            </div>
                            <ProgressBar value={f.pct} target={100} color={f.color} height={4} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 8 }}>COACHING QUESTIONS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {a.coachQuestions.map((q, i) => (
                          <div key={i} style={{ padding: '7px 9px', background: `${BLUE}08`, borderLeft: `2px solid ${BLUE}`, fontSize: 11, color: TEXT2, lineHeight: 1.5, fontStyle: 'italic' }}>
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [tab, setTab] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: CARD, gap: 4 }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: tab === i ? `2px solid ${BLUE}` : '2px solid transparent',
              color: tab === i ? BLUE : TEXT3,
              padding: '12px 16px',
              fontSize: 12,
              fontWeight: tab === i ? 700 : 400,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {t}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, paddingRight: 4 }}>
          <Users size={12} color={TEXT3} strokeWidth={1.75} />
          <span style={{ fontSize: 11, color: TEXT3 }}>{AGENTS.length} members</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 0 && <MembersTab onCoach={() => setTab(2)} />}
        {tab === 1 && <LeaderboardTab />}
        {tab === 2 && <AICoachingTab />}
      </div>
    </div>
  )
}
