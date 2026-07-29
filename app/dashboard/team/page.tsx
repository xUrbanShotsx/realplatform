'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  Brain, Trophy, Phone, Mail, Target, Zap,
  CheckCircle2, Lightbulb,
  Users, Minus, ChevronUp, ChevronDown, Medal,
  Calendar, Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCurrentOrg } from '@/lib/supabase/hooks'

const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const RED = '#ef4444'; const ORANGE = '#f97316'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const CARD = '#ffffff'; const CARD2 = '#f8fafc'

const TABS = ['Members', 'Leaderboard', 'AI Coaching']
const MEMBER_COLORS = [BLUE, PURPLE, TEAL, ORANGE, GREEN, PINK]
const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Principal',
  admin: 'Admin',
  agent: 'Agent',
  pm: 'Property Manager',
  viewer: 'Viewer',
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Action { priority: string; text: string; due: string }
interface FocusArea { label: string; pct: number; color: string }
interface WeekActivity { week: string; calls: number; appraisals: number; leads: number }
interface RecentItem { icon: React.ElementType; text: string; time: string; color: string }

interface TeamMember {
  id: string
  name: string
  role: string
  color: string
  phone: string
  email: string
  score: number
  scoreTrend: number
  gci: number;         gciTarget: number
  listings: number;    listingsTarget: number
  sales: number;       salesTarget: number
  appraisals: number;  appraisalsTarget: number
  calls: number;       callsTarget: number
  convRate: number;    convRateTarget: number
  pipeline: number
  avgDom: number
  responseTime: number
  rankChange: number
  wins: string[]
  actions: Action[]
  opportunities: string[]
  coachQuestions: string[]
  focusAreas: FocusArea[]
  weeklyActivity: WeekActivity[]
  recentActivity: RecentItem[]
}

function mapProfile(p: Record<string, unknown>, index: number): TeamMember {
  const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || (p.display_name as string) || 'Team Member'
  return {
    id: p.id as string,
    name,
    role: (p.job_title as string) || ROLE_LABELS[p.role as string] || (p.role as string) || 'Agent',
    color: MEMBER_COLORS[index % MEMBER_COLORS.length],
    phone: (p.phone as string) || '',
    email: (p.email as string) || '',
    score: 0, scoreTrend: 0,
    gci: 0, gciTarget: 0,
    listings: 0, listingsTarget: 0,
    sales: 0, salesTarget: 0,
    appraisals: 0, appraisalsTarget: 0,
    calls: 0, callsTarget: 0,
    convRate: 0, convRateTarget: 0,
    pipeline: 0, avgDom: 0, responseTime: 0, rankChange: 0,
    wins: [], actions: [], opportunities: [],
    coachQuestions: [], focusAreas: [], weeklyActivity: [], recentActivity: [],
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

function fmtGci(v: number) {
  if (!v) return '—'
  return v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`
}

function fmtPipeline(v: number) {
  if (!v) return '—'
  return v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`
}

function scoreColor(s: number) {
  if (s >= 85) return GREEN
  if (s >= 70) return AMBER
  return s > 0 ? RED : TEXT3
}

function pctColor(pct: number, target: number) {
  if (!target) return TEXT3
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
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0
  return (
    <div style={{ width: '100%', height, background: 'rgba(0,0,0,0.06)', borderRadius: 0, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.6s ease' }} />
    </div>
  )
}

function PriorityBadge({ p }: { p: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    HIGH: { bg: `${RED}18`, color: RED },
    MED:  { bg: `${AMBER}20`, color: AMBER },
    LOW:  { bg: 'rgba(0,0,0,0.05)', color: TEXT3 },
  }
  const s = map[p] ?? map.LOW
  return <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 5px', background: s.bg, color: s.color, letterSpacing: '0.06em', flexShrink: 0 }}>{p}</span>
}

function EmptyState({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, gap: 10, padding: 40, textAlign: 'center' }}>
      <div style={{ width: 44, height: 44, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={TEXT3} strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{title}</div>
      <div style={{ fontSize: 12, color: TEXT3, maxWidth: 280, lineHeight: 1.6 }}>{sub}</div>
    </div>
  )
}

// ─── Members Tab ─────────────────────────────────────────────────────────────

function MembersTab({ agents, onCoach }: { agents: TeamMember[]; onCoach: () => void }) {
  const [sel, setSel] = useState<TeamMember | null>(null)

  useEffect(() => {
    if (agents.length > 0 && !sel) setSel(agents[0])
  }, [agents])

  if (agents.length === 0) {
    return <EmptyState icon={Users} title="No team members yet" sub="Invite your team from Settings → Team to get started. Each member gets their own dashboard and AI coaching." />
  }

  const a = sel ?? agents[0]

  const kpis = [
    { label: 'GCI MTD',      val: fmtGci(a.gci),           raw: a.gci,           target: a.gciTarget || 1,        color: GREEN,  sub: a.gciTarget ? `Target ${fmtGci(a.gciTarget)}` : 'No target set' },
    { label: 'Pipeline',     val: fmtPipeline(a.pipeline),  raw: a.pipeline,      target: a.pipeline || 1,         color: BLUE,   sub: 'Active pipeline value' },
    { label: 'Listings',     val: a.listings > 0 ? `${a.listings}` : '—', raw: a.listings, target: a.listingsTarget || 1, color: BLUE, sub: a.listingsTarget ? `Target ${a.listingsTarget}` : 'No target set' },
    { label: 'Appraisals',   val: a.appraisals > 0 ? `${a.appraisals}` : '—', raw: a.appraisals, target: a.appraisalsTarget || 1, color: PURPLE, sub: a.appraisalsTarget ? `Target ${a.appraisalsTarget}` : 'No target set' },
    { label: 'Sales MTD',    val: a.sales > 0 ? `${a.sales}` : '—', raw: a.sales, target: a.salesTarget || 1, color: AMBER, sub: a.salesTarget ? `Target ${a.salesTarget}` : 'No target set' },
    { label: 'Conv. Rate',   val: a.convRate > 0 ? `${a.convRate}%` : '—', raw: a.convRate, target: a.convRateTarget || 1, color: TEAL, sub: a.convRateTarget ? `Target ${a.convRateTarget}%` : 'No target set' },
    { label: 'Calls / Week', val: a.calls > 0 ? `${a.calls}` : '—', raw: a.calls, target: a.callsTarget || 1, color: ORANGE, sub: a.callsTarget ? `Target ${a.callsTarget}` : 'No target set' },
    { label: 'Avg Response', val: a.responseTime > 0 ? `${a.responseTime}m` : '—', raw: a.responseTime > 0 ? 60 - a.responseTime : 0, target: 30, color: TEXT3, sub: 'Target < 30 min' },
  ]

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 264, flexShrink: 0, borderRight: `1px solid ${BORDER}`, overflowY: 'auto', background: CARD2 }}>
        {agents.map(ag => {
          const active = (sel ?? agents[0]).id === ag.id
          return (
            <div key={ag.id} onClick={() => setSel(ag)} style={{ padding: '12px 14px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: active ? CARD : 'transparent', borderLeft: `3px solid ${active ? ag.color : 'transparent'}`, transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <div style={{ width: 34, height: 34, background: ag.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(ag.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ag.name}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{ag.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: scoreColor(ag.score) }}>{ag.score > 0 ? ag.score : '—'}</div>
                  <TrendChip val={ag.scoreTrend} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {[
                  { v: fmtGci(ag.gci), c: GREEN, l: 'GCI' },
                  { v: ag.listings > 0 ? `${ag.listings}` : '—', c: BLUE, l: 'Listed' },
                  { v: ag.convRate > 0 ? `${ag.convRate}%` : '—', c: TEAL, l: 'Conv' },
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
            <div style={{ fontSize: 11, color: TEXT3 }}>{a.role}{a.email ? ` · ${a.email}` : ''}{a.phone ? ` · ${a.phone}` : ''}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {a.phone && <button onClick={() => window.location.href = `tel:${a.phone}`} style={{ background: 'none', border: `1px solid ${BORDER}`, color: TEXT2, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} strokeWidth={1.75} />Call</button>}
            {a.email && <button onClick={() => window.location.href = `mailto:${a.email}`} style={{ background: 'none', border: `1px solid ${BORDER}`, color: TEXT2, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={11} strokeWidth={1.75} />Email</button>}
            <button onClick={onCoach} style={{ background: PINK, border: 'none', color: '#fff', padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Brain size={11} strokeWidth={1.75} />AI Coach</button>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: a.score > 0 ? scoreColor(a.score) : TEXT3, letterSpacing: '-0.04em', lineHeight: 1 }}>{a.score > 0 ? a.score : '—'}</div>
            <div style={{ fontSize: 9, color: TEXT3, marginTop: 2 }}>AI SCORE</div>
          </div>
          <div style={{ width: 1, height: 36, background: BORDER }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: TEXT2, fontWeight: 600 }}>Monthly performance against targets</span>
              <span style={{ fontSize: 10, color: TEXT3 }}>{a.score > 0 ? 'Avg of all KPIs' : 'No data yet'}</span>
            </div>
            <ProgressBar value={a.score} target={100} color={a.score > 0 ? scoreColor(a.score) : TEXT3} height={6} />
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {kpis.map(k => {
            const pct = k.target > 0 ? Math.min(100, Math.round((k.raw / k.target) * 100)) : 0
            const col = pctColor(k.raw, k.target)
            return (
              <div key={k.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '10px 12px' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: k.raw > 0 ? k.color : TEXT3, letterSpacing: '-0.03em', marginBottom: 2, lineHeight: 1 }}>{k.val}</div>
                <div style={{ fontSize: 9, color: TEXT3, marginBottom: 6 }}>{k.label}</div>
                <ProgressBar value={k.raw} target={k.target} color={col} height={3} />
                <div style={{ fontSize: 8, color: TEXT3, marginTop: 4 }}>{k.sub} · {pct}%</div>
              </div>
            )
          })}
        </div>

        {/* Activity chart + recent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 10 }}>CALLS — LAST 4 WEEKS</div>
            {a.weeklyActivity.length > 0 ? (
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
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, fontSize: 11, color: TEXT3 }}>Activity data not yet available</div>
            )}
          </div>

          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em', marginBottom: 10 }}>RECENT ACTIVITY</div>
            {a.recentActivity.length > 0 ? (
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
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, fontSize: 11, color: TEXT3 }}>No recent activity</div>
            )}
          </div>
        </div>

        {/* AI Coaching panel */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ background: PINK_S, borderBottom: `1px solid rgba(227,0,140,0.15)`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Brain size={12} color={PINK} strokeWidth={1.75} />
            <span style={{ fontSize: 10, fontWeight: 700, color: PINK }}>✦ AI COACHING — TODAY&apos;S BRIEF</span>
          </div>
          {a.actions.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
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
          ) : (
            <div style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Brain size={20} color={TEXT3} strokeWidth={1.25} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT2 }}>AI coaching not yet active for {a.name}</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 3 }}>Connect portals and set activity targets to enable personalised AI coaching briefs.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Leaderboard Tab ─────────────────────────────────────────────────────────

type Period = 'week' | 'month' | 'quarter' | 'ytd'
type Metric = 'gci' | 'listings' | 'sales' | 'appraisals' | 'calls'

const PERIOD_LABELS: Record<Period, string> = { week: 'This Week', month: 'This Month', quarter: 'This Quarter', ytd: 'YTD' }
const METRIC_LABELS: Record<Metric, string> = { gci: 'GCI', listings: 'Listings', sales: 'Sales', appraisals: 'Appraisals', calls: 'Calls' }

function getMetricVal(a: TeamMember, m: Metric) {
  switch (m) {
    case 'gci': return a.gci
    case 'listings': return a.listings
    case 'sales': return a.sales
    case 'appraisals': return a.appraisals
    case 'calls': return a.calls
  }
}

function getMetricTarget(a: TeamMember, m: Metric) {
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
  return v > 0 ? `${v}` : '—'
}

function LeaderboardTab({ agents }: { agents: TeamMember[] }) {
  const [period, setPeriod] = useState<Period>('month')
  const [metric, setMetric] = useState<Metric>('gci')

  if (agents.length === 0) {
    return <EmptyState icon={Trophy} title="No team members" sub="Add team members to see the leaderboard." />
  }

  const sorted = [...agents].sort((a, b) => getMetricVal(b, metric) - getMetricVal(a, metric))
  const top3 = sorted.slice(0, Math.min(3, sorted.length))
  const podiumOrder = top3.length >= 2 ? [top3[1], top3[0], top3[2]].filter(Boolean) : top3

  const teamTotal = agents.reduce((s, a) => s + getMetricVal(a, metric), 0)
  const teamTarget = agents.reduce((s, a) => s + getMetricTarget(a, metric), 0)

  return (
    <div style={{ overflowY: 'auto', padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          Team total: <strong style={{ color: TEXT }}>{fmtMetric(teamTotal, metric)}</strong>{teamTarget > 0 && <> · Target: <strong style={{ color: TEXT }}>{fmtMetric(teamTarget, metric)}</strong></>}
        </div>
      </div>

      {podiumOrder.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
          {podiumOrder.map((a, podiumIdx) => {
            const actualRank = sorted.findIndex(x => x.id === a.id) + 1
            const podiumH = top3.length >= 2 ? [100, 140, 80][podiumIdx] : 120
            const medalColors = ['#94a3b8', '#f59e0b', '#b45309']
            const medalColor = top3.length >= 2 ? [medalColors[1], medalColors[0], medalColors[2]][podiumIdx] : medalColors[1]
            const val = getMetricVal(a, metric)
            const tgt = getMetricTarget(a, metric)
            const pct = tgt > 0 ? Math.min(100, Math.round((val / tgt) * 100)) : 0
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
                  <span style={{ fontSize: 9, color: TEXT3 }}>{pct > 0 ? `${pct}% of target` : 'No data yet'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
              const pct = tgt > 0 ? Math.min(100, Math.round((val / tgt) * 100)) : 0
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
                  <td style={{ padding: '12px 14px', fontSize: 15, fontWeight: 800, color: val > 0 ? a.color : TEXT3 }}>{fmtMetric(val, metric)}</td>
                  <td style={{ padding: '12px 14px', width: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={val} target={tgt || 1} color={col} height={5} /></div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: col, width: 32, textAlign: 'right' }}>{pct > 0 ? `${pct}%` : '—'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: a.score > 0 ? scoreColor(a.score) : TEXT3 }}>{a.score > 0 ? a.score : '—'}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <TrendChip val={a.rankChange} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 16, background: CARD2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em' }}>TEAM TOTAL</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{fmtMetric(teamTotal, metric)}</span>
          {teamTarget > 0 && (
            <>
              <div style={{ flex: 1, maxWidth: 200 }}><ProgressBar value={teamTotal} target={teamTarget} color={pctColor(teamTotal, teamTarget)} height={5} /></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: pctColor(teamTotal, teamTarget) }}>{Math.round((teamTotal / teamTarget) * 100)}% of target</span>
              <span style={{ fontSize: 10, color: TEXT3 }}>Target: {fmtMetric(teamTarget, metric)}</span>
            </>
          )}
          {!teamTarget && <span style={{ fontSize: 10, color: TEXT3 }}>No targets set</span>}
        </div>
      </div>
    </div>
  )
}

// ─── AI Coaching Tab ─────────────────────────────────────────────────────────

function AICoachingTab({ agents }: { agents: TeamMember[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (agents.length === 0) {
    return <EmptyState icon={Brain} title="No team members" sub="Add team members to view AI coaching briefs." />
  }

  const totalActions = agents.reduce((s, a) => s + a.actions.length, 0)
  const aboveTarget = agents.filter(a => a.score >= 75).length
  const avgScore = Math.round(agents.reduce((s, a) => s + a.score, 0) / agents.length)

  return (
    <div style={{ overflowY: 'auto', padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[
          { label: 'Team AI Score', val: avgScore > 0 ? `${avgScore}` : '—', sub: 'Average across all agents', icon: Brain, color: PINK },
          { label: 'Hitting Target', val: `${aboveTarget}/${agents.length}`, sub: 'Agents above 75 score', icon: Target, color: GREEN },
          { label: 'Priority Actions', val: totalActions > 0 ? `${totalActions}` : '—', sub: 'AI-flagged across team', icon: Zap, color: AMBER },
          { label: 'Next Session', val: 'Not scheduled', sub: 'Scheduled team coaching', icon: Calendar, color: BLUE },
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

      {agents.map(a => {
        const isOpen = expanded === a.id
        const highActions = a.actions.filter(ac => ac.priority === 'HIGH')
        return (
          <div key={a.id} style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
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
                <div style={{ display: 'flex', gap: 6 }}>
                  {a.focusAreas.slice(0, 3).map(f => (
                    <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 36, height: 3, background: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${f.pct}%`, background: f.color }} />
                      </div>
                      <span style={{ fontSize: 9, color: TEXT3 }}>{f.label} {f.pct}%</span>
                    </div>
                  ))}
                  {a.focusAreas.length === 0 && <span style={{ fontSize: 10, color: TEXT3 }}>AI coaching data not yet available</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: a.score > 0 ? scoreColor(a.score) : TEXT3, lineHeight: 1 }}>{a.score > 0 ? a.score : '—'}</div>
                <TrendChip val={a.scoreTrend} />
              </div>
              <ChevronDown size={14} color={TEXT3} strokeWidth={1.75} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {isOpen && (
              <div>
                <div style={{ padding: '8px 16px', background: PINK_S, borderBottom: `1px solid rgba(227,0,140,0.15)`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Brain size={11} color={PINK} strokeWidth={1.75} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: '0.06em' }}>✦ AI COACHING SESSION</span>
                </div>

                {a.actions.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
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
                ) : (
                  <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Brain size={20} color={TEXT3} strokeWidth={1.25} style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: TEXT2 }}>AI coaching not yet active</div>
                      <div style={{ fontSize: 11, color: TEXT3, marginTop: 3 }}>Connect portals and configure activity targets to generate personalised coaching briefs for {a.name}.</div>
                    </div>
                  </div>
                )}
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
  const { orgId, loading: orgLoading } = useCurrentOrg()
  const [agents, setAgents] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  const loadAgents = useCallback(async (oid: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('org_id', oid)
      .eq('is_active', true)
      .order('created_at')
    setAgents((data ?? []).map(mapProfile))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (orgLoading) return
    if (!orgId) { setLoading(false); return }
    loadAgents(orgId)
  }, [orgId, orgLoading, loadAgents])

  if (loading || orgLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: TEXT3, fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
        <Loader2 size={18} strokeWidth={1.75} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 13 }}>Loading team…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
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
          <span style={{ fontSize: 11, color: TEXT3 }}>{agents.length} {agents.length === 1 ? 'member' : 'members'}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 0 && <MembersTab agents={agents} onCoach={() => setTab(2)} />}
        {tab === 1 && <LeaderboardTab agents={agents} />}
        {tab === 2 && <AICoachingTab agents={agents} />}
      </div>
    </div>
  )
}
