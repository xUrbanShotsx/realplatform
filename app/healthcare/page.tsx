'use client'

import Link from 'next/link'
import {
  TrendingUp, TrendingDown, ChevronRight, ArrowRight,
  AlertTriangle, AlertCircle, CheckCircle2,
  UserCheck, Activity, ShieldCheck, Pill,
  Lock, Wrench, BookOpen, ClipboardList, Microscope,
} from 'lucide-react'
import {
  hcFacility, practitioners, clinicalIncidents, infectionMetrics,
  trainingModules, hcAlerts, hcActivityFeed, equipment, s8Register,
} from '@/lib/hc-mock-data'

// ── Design tokens ──────────────────────────────────────────────────────────────
const ACCENT = '#059669'
const RED    = '#dc2626'
const AMBER  = '#d97706'
const GREEN  = '#16a34a'

function scoreColor(n: number) {
  if (n >= 85) return GREEN
  if (n >= 70) return AMBER
  return RED
}

const areaIcons = [UserCheck, Microscope, ClipboardList, Pill, ShieldCheck, Lock, Activity, BookOpen]

// ── Sub-components ─────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#94a3b8' }}>
      {children}
    </p>
  )
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.04)', ...style }}>
      {children}
    </div>
  )
}

function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{title}</p>
      {action}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function HealthcareOverview() {
  const date = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })

  const openIncidents    = clinicalIncidents.filter(i => i.status !== 'Closed').length
  const sentinelEvents   = clinicalIncidents.filter(i => i.severity === 'Sentinel').length
  const ahpraIssues      = practitioners.filter(p => p.ahpraStatus !== 'Current').length
  const trainingOverdue  = trainingModules.reduce((s, m) => s + m.overdueCount, 0)
  const equipmentIssues  = equipment.filter(e => e.status === 'Overdue' || e.status === 'Due Service').length
  const s8Discrepancies  = s8Register.filter(r => r.discrepancy).length
  const vaccineNonComp   = practitioners.filter(p => !p.vaccineCompliant).length

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <Card style={{ borderLeft: `4px solid ${ACCENT}`, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', marginBottom: 6, letterSpacing: '0.03em' }}>{date}</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Good morning, <span style={{ color: ACCENT }}>Quality Manager</span>
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              {hcFacility.name} · {hcFacility.type}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ padding: '6px 12px', border: '1px solid #e2e8f0', fontSize: 11, fontWeight: 600, color: '#64748b' }}>
              {hcFacility.accreditationNo}
            </span>
            <span style={{ padding: '6px 12px', background: ACCENT, fontSize: 11, fontWeight: 700, color: '#fff' }}>
              ACHS Accredited
            </span>
          </div>
        </div>
      </Card>

      {/* ── QUICK ACTIONS ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'stretch', overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
        {[
          { label: 'Report Incident', icon: AlertTriangle, href: '/healthcare/incidents',        accent: true },
          { label: 'AHPRA Register',  icon: UserCheck,     href: '/healthcare/practitioners',    badge: ahpraIssues   },
          { label: 'S8 Register',     icon: Pill,          href: '/healthcare/medications',      badge: s8Discrepancies },
          { label: 'IPC Dashboard',   icon: Microscope,    href: '/healthcare/infection-control'               },
          { label: 'NSQHS',           icon: ShieldCheck,   href: '/healthcare/accreditation'                   },
          { label: 'Training',        icon: BookOpen,      href: '/healthcare/training',         badge: trainingOverdue > 9 ? 9 : trainingOverdue },
        ].map(({ label, icon: Icon, href, accent, badge }, i, arr) => (
          <Link key={label} href={href}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '11px 18px',
              flexShrink: 0, fontSize: 12, fontWeight: 600, textDecoration: 'none',
              whiteSpace: 'nowrap', position: 'relative',
              ...(accent ? { background: ACCENT, color: '#fff' } : { color: '#475569' }),
              ...(i < arr.length - 1 ? { borderRight: '1px solid #f1f5f9' } : {}),
            }}
            onMouseEnter={e => { if (!accent) (e.currentTarget as HTMLElement).style.background = '#f8fafc' }}
            onMouseLeave={e => { if (!accent) (e.currentTarget as HTMLElement).style.background = '' }}
          >
            <Icon size={13} />{label}
            {badge != null && badge > 0 && (
              <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 9, fontWeight: 800, padding: '1px 4px', background: RED, color: '#fff' }}>{badge}</span>
            )}
          </Link>
        ))}
      </div>

      {/* ── KPI METRICS ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { label: 'Compliance Score', value: hcFacility.complianceScore, unit: '/100', sub: `${hcFacility.auditReadiness}% audit ready`, color: scoreColor(hcFacility.complianceScore), trend: { dir: 'up' as const, label: '+2 pts' } },
          { label: 'Open Incidents',   value: openIncidents, unit: '', sub: `${sentinelEvents} sentinel event${sentinelEvents !== 1 ? 's' : ''}`, color: openIncidents > 0 ? RED : GREEN, trend: null },
          { label: 'AHPRA Issues',     value: ahpraIssues, unit: '', sub: '1 suspended', color: ahpraIssues > 0 ? RED : GREEN, trend: null },
          { label: 'Training Overdue', value: trainingOverdue, unit: '', sub: 'across all modules', color: trainingOverdue > 10 ? RED : AMBER, trend: null },
        ].map(({ label, value, unit, sub, color, trend }) => (
          <Card key={label} style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <Label>{label}</Label>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', background: color + '15', color }}>{sub}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span className="tabular-nums" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, color }}>{value}</span>
              {unit && <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{unit}</span>}
            </div>
            {trend && (
              <p style={{ fontSize: 11, color: trend.dir === 'up' ? GREEN : RED, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                {trend.dir === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {trend.label}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* ── MAIN ROW ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12 }}>

        {/* Critical Alerts */}
        <Card>
          <CardHeader title="Critical Compliance Alerts"
            action={<span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#fee2e2', color: RED }}>{hcAlerts.filter(a => a.severity === 'critical').length} critical</span>}
          />
          {hcAlerts.map((alert, i) => {
            const col = alert.severity === 'critical' ? RED : alert.severity === 'warning' ? AMBER : ACCENT
            const bg  = alert.severity === 'critical' ? '#fef2f2' : alert.severity === 'warning' ? '#fffbeb' : '#f0fdf9'
            return (
              <div key={alert.id} style={{ padding: '12px 20px', background: bg, borderBottom: i < hcAlerts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <AlertCircle size={13} style={{ color: col, flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{alert.title}</p>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', background: col + '20', color: col, flexShrink: 0 }}>
                        {alert.severity === 'critical' ? 'Critical' : alert.severity === 'warning' ? 'Warning' : 'Info'}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{alert.message}</p>
                    {alert.action && (
                      <Link href={alert.link} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 11, fontWeight: 600, color: col, textDecoration: 'none' }}>
                        {alert.action} <ArrowRight size={9} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </Card>

        {/* Compliance Health */}
        <Card>
          <CardHeader title="Compliance Health" />
          <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="58" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                <circle cx="70" cy="70" r="58" fill="none"
                  stroke={scoreColor(hcFacility.complianceScore)} strokeWidth="7"
                  strokeDasharray={`${(hcFacility.complianceScore / 100) * 364.42} 364.42`}
                  transform="rotate(-90 70 70)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="tabular-nums" style={{ fontSize: 36, fontWeight: 800, color: scoreColor(hcFacility.complianceScore), lineHeight: 1 }}>{hcFacility.complianceScore}</span>
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Score</span>
              </div>
            </div>
            <div style={{ width: '100%', marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Audit Readiness</span>
                <span className="tabular-nums" style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{hcFacility.auditReadiness}%</span>
              </div>
              <div style={{ height: 4, background: '#f1f5f9' }}>
                <div style={{ height: '100%', width: `${hcFacility.auditReadiness}%`, background: ACCENT }} />
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Label>By Area</Label>
            {hcFacility.areas.map((area, idx) => {
              const Icon = areaIcons[idx]
              const col = scoreColor(area.score)
              return (
                <div key={area.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon size={10} style={{ color: '#94a3b8' }} />
                      <span style={{ fontSize: 11, color: '#475569' }}>{area.name}</span>
                    </div>
                    <span className="tabular-nums" style={{ fontSize: 11, fontWeight: 700, color: col }}>{area.score}</span>
                  </div>
                  <div style={{ height: 3, background: '#f1f5f9' }}>
                    <div style={{ height: '100%', width: `${area.score}%`, background: col }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* ── BOTTOM ROW ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>

        {/* IPC Metrics */}
        <Card>
          <CardHeader title="Infection Control"
            action={<Link href="/healthcare/infection-control" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}>View <ChevronRight size={12} /></Link>}
          />
          <div style={{ padding: '8px 0' }}>
            {infectionMetrics.slice(0, 5).map((m, i) => {
              const onTarget = m.higherIsBetter ? m.value >= m.target : m.value <= m.target
              const col = onTarget ? GREEN : RED
              return (
                <div key={m.label} style={{ padding: '9px 20px', borderBottom: i < 4 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#475569' }}>{m.label}</span>
                    <span className="tabular-nums" style={{ fontSize: 12, fontWeight: 700, color: col }}>
                      {m.value}{m.unit}
                      <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 10 }}> / {m.target}{m.unit}</span>
                    </span>
                  </div>
                  <div style={{ height: 3, background: '#f1f5f9' }}>
                    <div style={{ height: '100%', background: col, width: m.higherIsBetter ? `${Math.min((m.value / m.target) * 100, 100)}%` : `${Math.min((m.target / Math.max(m.value, 0.1)) * 100, 100)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader title="Recent Activity" />
          <div style={{ padding: '4px 0' }}>
            {hcActivityFeed.map((item, i) => {
              const typeColor: Record<string, string> = {
                incident: RED, ahpra: ACCENT, drug: '#f97316', training: '#3b82f6',
                ipc: GREEN, whs: AMBER, nsqhs: '#8b5cf6', privacy: '#6366f1',
              }
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 20px', borderBottom: i < 7 ? '1px solid #f8fafc' : 'none' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: typeColor[item.type] ?? '#94a3b8', flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</p>
                    <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{item.user} · {item.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Facility Snapshot */}
        <Card>
          <CardHeader title="Facility Snapshot" />
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'Registered Practitioners', value: practitioners.length,      color: '#0f172a'                             },
              { label: 'AHPRA Issues',              value: ahpraIssues,              color: ahpraIssues > 0 ? RED : GREEN          },
              { label: 'Vaccine Non-Compliant',     value: vaccineNonComp,           color: vaccineNonComp > 0 ? AMBER : GREEN     },
              { label: 'Equipment Overdue',         value: equipmentIssues,          color: equipmentIssues > 0 ? RED : GREEN      },
              { label: 'S8 Discrepancies',          value: s8Discrepancies,          color: s8Discrepancies > 0 ? RED : GREEN      },
              { label: 'Privacy Breaches YTD',      value: 3,                        color: AMBER                                  },
              { label: 'NSQHS Not Met',             value: hcFacility.areas.filter(a => a.score < 70).length, color: RED          },
              { label: 'Training Overdue',          value: trainingOverdue,          color: trainingOverdue > 10 ? RED : AMBER     },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none',
              }}>
                <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
                <span className="tabular-nums" style={{ fontSize: 14, fontWeight: 800, color }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
