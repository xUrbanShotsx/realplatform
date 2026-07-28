'use client'

import Link from 'next/link'
import {
  TrendingUp, TrendingDown, ChevronRight, ArrowRight,
  AlertTriangle, AlertCircle, CheckCircle2,
  Home, Building2, DollarSign, Key, ShieldCheck,
  BookOpen, BarChart3, Clock, Search,
} from 'lucide-react'
import {
  reAgency, listings, pmProperties, amlChecks, trustSummary,
  licences, reAlerts, reActivityFeed,
} from '@/lib/re-mock-data'

// ── Design tokens ──────────────────────────────────────────────────────────────
const ACCENT = '#2563EB'
const RED    = '#dc2626'
const AMBER  = '#d97706'
const GREEN  = '#16a34a'

function scoreColor(n: number) {
  if (n >= 85) return GREEN
  if (n >= 70) return AMBER
  return RED
}

const areaIcons = [Key, Search, DollarSign, BookOpen, ShieldCheck, Building2]

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
export default function RealEstateOverview() {
  const date = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })

  const activeListings   = listings.filter(l => l.status === 'Active').length
  const pendingAML       = amlChecks.filter(a => a.status === 'Pending' || a.status === 'Flagged').length
  const expiringLicences = licences.filter(l => l.status === 'Expiring Soon' || l.status === 'Expired').length
  const pmArrears        = pmProperties.filter(p => p.rentInArrears).length
  const openMaint        = pmProperties.reduce((s, p) => s + p.maintenanceOpen, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <Card style={{ borderLeft: `4px solid ${ACCENT}`, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', marginBottom: 6, letterSpacing: '0.03em' }}>{date}</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Good morning, <span style={{ color: ACCENT }}>James</span>
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              {reAgency.name} — NSW Licence No. {reAgency.licenceNo}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ padding: '6px 12px', border: '1px solid #e2e8f0', fontSize: 11, fontWeight: 600, color: '#64748b' }}>
              NSW Licensed
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
          { label: 'New Listing',   icon: Home,       href: '/real-estate/listings',           accent: true },
          { label: 'New PM',        icon: Building2,  href: '/real-estate/property-management'              },
          { label: 'AML Check',     icon: Search,     href: '/real-estate/aml',                badge: pendingAML },
          { label: 'Trust Account', icon: DollarSign, href: '/real-estate/trust-account'                    },
          { label: 'Policies',      icon: BookOpen,   href: '/real-estate/policies'                         },
          { label: 'Reports',       icon: BarChart3,  href: '/real-estate/reports'                          },
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
          { label: 'Compliance Score', value: reAgency.complianceScore, unit: '/100', sub: `${reAgency.auditReadiness}% audit ready`, color: scoreColor(reAgency.complianceScore), trend: { dir: 'up' as const, label: '+3 this month' } },
          { label: 'Active Listings',  value: activeListings, unit: '', sub: `${listings.filter(l => l.status === 'Under Contract').length} under contract`, color: ACCENT, trend: null },
          { label: 'AML Pending',      value: pendingAML, unit: '', sub: `${amlChecks.filter(a => a.status === 'Flagged').length} flagged`, color: pendingAML > 0 ? RED : GREEN, trend: null },
          { label: 'Licence Issues',   value: expiringLicences, unit: '', sub: `${licences.filter(l => l.status === 'Expired').length} expired`, color: expiringLicences > 0 ? AMBER : GREEN, trend: null },
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

        {/* Alerts */}
        <Card>
          <CardHeader title="Compliance Alerts"
            action={<span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#fee2e2', color: RED }}>{reAlerts.filter(a => a.severity === 'critical').length} critical</span>}
          />
          {reAlerts.map((alert, i) => {
            const col = alert.severity === 'critical' ? RED : alert.severity === 'warning' ? AMBER : ACCENT
            const bg  = alert.severity === 'critical' ? '#fef2f2' : alert.severity === 'warning' ? '#fffbeb' : '#f0f9ff'
            return (
              <div key={alert.id} style={{ padding: '12px 20px', background: bg, borderBottom: i < reAlerts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
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
                  stroke={scoreColor(reAgency.complianceScore)} strokeWidth="7"
                  strokeDasharray={`${(reAgency.complianceScore / 100) * 364.42} 364.42`}
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dasharray 700ms ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="tabular-nums" style={{ fontSize: 36, fontWeight: 800, color: scoreColor(reAgency.complianceScore), lineHeight: 1 }}>{reAgency.complianceScore}</span>
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Score</span>
              </div>
            </div>
            <div style={{ width: '100%', marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Audit Readiness</span>
                <span className="tabular-nums" style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{reAgency.auditReadiness}%</span>
              </div>
              <div style={{ height: 4, background: '#f1f5f9' }}>
                <div style={{ height: '100%', width: `${reAgency.auditReadiness}%`, background: ACCENT }} />
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Label>By Area</Label>
            {reAgency.areas.map((area, idx) => {
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

        {/* Trust Account */}
        <Card>
          <CardHeader title="Trust Account"
            action={<Link href="/real-estate/trust-account" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}>View <ChevronRight size={12} /></Link>}
          />
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Sales Trust',  value: trustSummary.salesTrustBalance, color: ACCENT },
              { label: 'PM Trust',     value: trustSummary.pmTrustBalance,    color: GREEN  },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
                  <span className="tabular-nums" style={{ fontSize: 13, fontWeight: 700, color }}>${value.toLocaleString('en-AU')}</span>
                </div>
                <div style={{ height: 3, background: '#f1f5f9' }}>
                  <div style={{ height: '100%', width: `${Math.round((value / trustSummary.totalTrust) * 100)}%`, background: color }} />
                </div>
              </div>
            ))}
            <div style={{ paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Label>Total Trust</Label>
                  <p className="tabular-nums" style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginTop: 3 }}>${trustSummary.totalTrust.toLocaleString('en-AU')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Label>Next Recon.</Label>
                  <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginTop: 3 }}>
                    {new Date(trustSummary.nextReconciliation).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
              {trustSummary.unreconciled > 0 && (
                <p style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11, color: AMBER }}>
                  <AlertCircle size={11} /> {trustSummary.unreconciled} unreconciled entries
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader title="Recent Activity" />
          <div style={{ padding: '4px 0' }}>
            {reActivityFeed.slice(0, 6).map((item, i) => {
              const typeColor: Record<string, string> = {
                listing: ACCENT, aml: RED, trust: GREEN, policy: AMBER, pm: '#8b5cf6', licence: '#f97316', checklist: GREEN,
              }
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 20px', borderBottom: i < 5 ? '1px solid #f8fafc' : 'none' }}>
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

        {/* Monthly Snapshot */}
        <Card>
          <CardHeader title="Monthly Snapshot" />
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'PM Properties',    value: pmProperties.length,      color: '#0f172a' },
              { label: 'Rent in Arrears',  value: pmArrears,                color: pmArrears > 0 ? RED : GREEN },
              { label: 'Open Maintenance', value: openMaint,                color: openMaint > 0 ? AMBER : GREEN },
              { label: 'AML Verified',     value: amlChecks.filter(a => a.status === 'Verified').length, color: GREEN },
              { label: 'CPD Non-Comp.',    value: licences.filter(l => l.cpdHoursCompleted < l.cpdHoursRequired).length, color: AMBER },
              { label: 'Policies Current', value: 6,                        color: GREEN },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none',
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
