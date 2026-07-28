'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { contractors as contractorList, contractorDetails } from '@/lib/mock-data'
import { formatDate, scoreColor } from '@/lib/utils'
import {
  ArrowLeft, HardHat, Phone, Mail, Globe, MapPin, Building2,
  CheckCircle2, XCircle, Clock, AlertCircle, Shield, FileText,
  Users, ClipboardList, Activity, ChevronRight, Download,
  AlertTriangle, Wrench, Check, X, UserCheck, BadgeCheck,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'insurance' | 'licences' | 'workers' | 'activity'

const TABS: { key: Tab; label: string; icon: typeof HardHat }[] = [
  { key: 'overview',  label: 'Overview',           icon: ClipboardList },
  { key: 'insurance', label: 'Insurance & Docs',   icon: Shield        },
  { key: 'licences',  label: 'Licences',           icon: BadgeCheck    },
  { key: 'workers',   label: 'Workers',            icon: Users         },
  { key: 'activity',  label: 'Activity',           icon: Activity      },
]

const preQualConfig = {
  approved:  { label: 'Approved',      color: '#22c55e', bg: '#22c55e18', icon: CheckCircle2 },
  pending:   { label: 'Pending Review',color: '#f59e0b', bg: '#f59e0b18', icon: Clock        },
  suspended: { label: 'Suspended',     color: '#ef4444', bg: '#ef444418', icon: XCircle      },
}

const insuranceStatusConfig = {
  current:  { label: 'Current',  color: '#22c55e', bg: '#22c55e18' },
  expiring: { label: 'Expiring', color: '#f59e0b', bg: '#f59e0b18' },
  expired:  { label: 'Expired',  color: '#ef4444', bg: '#ef444418' },
}

const activityIconConfig = {
  document:  { icon: FileText,       color: '#3b82f6' },
  review:    { icon: ClipboardList,  color: '#8b5cf6' },
  system:    { icon: Activity,       color: '#6b7280' },
  incident:  { icon: AlertTriangle,  color: '#ef4444' },
  insurance: { icon: Shield,         color: '#f59e0b' },
}

// ─── Page ────────────────────────────────────────────────────────────────
export default function ContractorProfilePage() {
  const params   = useParams()
  const router   = useRouter()
  const [tab, setTab] = useState<Tab>('overview')

  const id         = params.id as string
  const contractor = contractorList.find(c => c.id === id) as (typeof contractorList[0] & { email?: string }) | undefined
  const detail     = contractorDetails[id]

  if (!contractor || !detail) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Contractor not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm underline" style={{ color: 'var(--accent)' }}>
          Go back
        </button>
      </div>
    )
  }

  const prequal    = preQualConfig[contractor.preQualStatus]
  const PreQualIcon = prequal.icon
  const preQualDone = detail.preQualChecklist.filter(i => i.complete).length
  const preQualTotal = detail.preQualChecklist.length

  // Days until insurance expires (first policy)
  const mainInsurance = detail.insuranceDocs.find(d => d.type === 'Public Liability')
  const daysUntilInsurance = mainInsurance
    ? Math.ceil((new Date(mainInsurance.expiry).getTime() - Date.now()) / 86400000)
    : null

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Back bar ─────────────────────────────────────────────────── */}
      <button
        onClick={() => router.push('/dashboard/contractors')}
        className="flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={14} />
        Back to Contractors
      </button>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <HardHat size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{contractor.company}</h1>
                <StatusBadge status={contractor.status} />
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold"
                  style={{ background: prequal.bg, color: prequal.color, border: `1px solid ${prequal.color}40` }}
                >
                  <PreQualIcon size={11} />
                  {prequal.label}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {contractor.industry} · ABN {detail.abn}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><Phone size={11} />{contractor.phone}</span>
                {contractor.email && <span className="flex items-center gap-1"><Mail size={11} />{contractor.email}</span>}
                <span className="flex items-center gap-1"><MapPin size={11} />{detail.address}</span>
                {detail.website && (
                  <span className="flex items-center gap-1"><Globe size={11} />{detail.website}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              className="px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
            >
              Request Docs
            </button>
            <button
              className="px-3 py-1.5 text-xs font-semibold text-black"
              style={{ background: 'var(--accent)' }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </Card>

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Compliance Score */}
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
            Compliance Score
          </p>
          <p className="text-3xl font-bold mb-2" style={{ color: scoreColor(contractor.complianceScore) }}>
            {contractor.complianceScore}
            <span className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>/100</span>
          </p>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${contractor.complianceScore}%`, background: scoreColor(contractor.complianceScore) }}
            />
          </div>
        </Card>

        {/* Insurance */}
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
            Public Liability
          </p>
          {daysUntilInsurance !== null ? (
            <>
              <p
                className="text-3xl font-bold"
                style={{ color: daysUntilInsurance < 0 ? '#ef4444' : daysUntilInsurance < 30 ? '#f59e0b' : '#22c55e' }}
              >
                {daysUntilInsurance < 0 ? 'Expired' : daysUntilInsurance}
                {daysUntilInsurance >= 0 && (
                  <span className="text-base font-medium" style={{ color: 'var(--text-muted)' }}> days</span>
                )}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {daysUntilInsurance < 0 ? `Expired ${formatDate(mainInsurance!.expiry)}` : `Expires ${formatDate(mainInsurance!.expiry)}`}
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data</p>
          )}
        </Card>

        {/* Workers */}
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
            Workers
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{detail.contractorWorkers.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {detail.contractorWorkers.filter(w => w.inductionStatus === 'complete').length} inducted
            {detail.contractorWorkers.filter(w => w.inductionStatus !== 'complete').length > 0 && (
              <span style={{ color: '#f59e0b' }}>
                {' · '}{detail.contractorWorkers.filter(w => w.inductionStatus !== 'complete').length} pending
              </span>
            )}
          </p>
        </Card>

        {/* Pre-Qual */}
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
            Pre-Qualification
          </p>
          <p className="text-3xl font-bold" style={{ color: preQualDone === preQualTotal ? '#22c55e' : '#f59e0b' }}>
            {preQualDone}
            <span className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>/{preQualTotal}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>items complete</p>
        </Card>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-colors"
            style={{
              color: tab === key ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: tab === key ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ────────────────────────────────────────────── */}
      {tab === 'overview' && (() => {
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2/3 */}
            <div className="md:col-span-2 space-y-5">

              {/* Suspension warning */}
              {contractor.preQualStatus === 'suspended' && (
                <div
                  className="flex items-start gap-3 p-4"
                  style={{ background: '#ef444415', border: '1px solid #ef444440' }}
                >
                  <AlertTriangle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>Contractor Suspended</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      This contractor has been suspended due to expired insurance and licences. Do not allow on site until reinstated.
                    </p>
                  </div>
                </div>
              )}

              {/* Pre-Qualification Checklist */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                  Pre-Qualification Checklist
                </p>
                <div className="space-y-2.5">
                  {detail.preQualChecklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                        style={{
                          background: item.complete ? '#22c55e18' : '#ef444418',
                          border: `1px solid ${item.complete ? '#22c55e40' : '#ef444440'}`,
                        }}
                      >
                        {item.complete
                          ? <Check size={11} style={{ color: '#22c55e' }} />
                          : <X size={11} style={{ color: '#ef4444' }} />
                        }
                      </div>
                      <span
                        className="text-sm"
                        style={{ color: item.complete ? 'var(--text)' : '#ef4444' }}
                      >
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-4 pt-4 flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {preQualDone} of {preQualTotal} requirements met
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(preQualDone / preQualTotal) * 100}%`,
                          background: preQualDone === preQualTotal ? '#22c55e' : preQualDone >= preQualTotal * 0.6 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: preQualDone === preQualTotal ? '#22c55e' : preQualDone >= preQualTotal * 0.6 ? '#f59e0b' : '#ef4444' }}
                    >
                      {Math.round((preQualDone / preQualTotal) * 100)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Assigned Sites */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                  Assigned Sites
                </p>
                {detail.assignedSites.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No active site assignments.</p>
                ) : (
                  <div className="space-y-2">
                    {detail.assignedSites.map(site => (
                      <div
                        key={site}
                        className="flex items-center gap-3 p-3 transition-colors cursor-pointer group"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'}
                      >
                        <Building2 size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{site}</span>
                        <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right 1/3 */}
            <div className="space-y-5">

              {/* Notes */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Notes</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{detail.notes}</p>
              </Card>

              {/* Quick stats */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>Quick Stats</p>
                <div className="space-y-3">
                  {[
                    { label: 'Industry',          value: contractor.industry                  },
                    { label: 'Licence Status',     value: contractor.licenceStatus            },
                    { label: 'Open Incidents',     value: String(detail.openIncidents)        },
                    { label: 'Open Actions',       value: String(detail.openActions)          },
                    { label: 'Insurance Policies', value: String(detail.insuranceDocs.length) },
                    { label: 'Licences on File',   value: String(detail.licences.length)      },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Contacts */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>Primary Contact</p>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: 'var(--accent)', color: '#000' }}
                  >
                    {contractor.contact.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{contractor.contact}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Primary Contact</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Phone size={11} style={{ color: 'var(--text-muted)' }} />{contractor.phone}
                  </div>
                  {contractor.email && (
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <Mail size={11} style={{ color: 'var(--text-muted)' }} />{contractor.email}
                    </div>
                  )}
                  {detail.website && (
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <Globe size={11} style={{ color: 'var(--text-muted)' }} />{detail.website}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )
      })()}

      {/* ── Tab: Insurance & Documents ───────────────────────────────── */}
      {tab === 'insurance' && (() => {
        const expiredCount  = detail.insuranceDocs.filter(d => d.status === 'expired').length
        const expiringCount = detail.insuranceDocs.filter(d => d.status === 'expiring').length

        return (
          <div className="space-y-5">
            {/* Alert banner */}
            {(expiredCount > 0 || expiringCount > 0) && (
              <div
                className="flex items-start gap-3 p-4"
                style={{
                  background: expiredCount > 0 ? '#ef444415' : '#f59e0b15',
                  border: `1px solid ${expiredCount > 0 ? '#ef444440' : '#f59e0b40'}`,
                }}
              >
                <AlertTriangle size={16} style={{ color: expiredCount > 0 ? '#ef4444' : '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: expiredCount > 0 ? '#ef4444' : '#f59e0b' }}>
                    {expiredCount > 0 ? `${expiredCount} insurance document${expiredCount > 1 ? 's' : ''} expired` : `${expiringCount} insurance document${expiringCount > 1 ? 's' : ''} expiring soon`}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Request updated certificates from the contractor immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Insurance Policies Table */}
            <Card className="overflow-hidden">
              <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Insurance Policies</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{detail.insuranceDocs.length} policies on file</p>
                  </div>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black"
                    style={{ background: 'var(--accent)' }}
                  >
                    <FileText size={11} />
                    Request Update
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                      {['Insurance Type', 'Insurer', 'Policy Number', 'Coverage', 'Expiry', 'Status', ''].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detail.insuranceDocs.map(doc => {
                      const cfg = insuranceStatusConfig[doc.status]
                      return (
                        <tr key={doc.id} className="group" style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                                <Shield size={13} style={{ color: cfg.color }} />
                              </div>
                              <span className="font-medium" style={{ color: 'var(--text)' }}>{doc.type}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>{doc.insurer}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{doc.policyNumber}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-xs" style={{ color: 'var(--text)' }}>{doc.coverage}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className="text-sm font-medium"
                              style={{ color: doc.status === 'expired' ? '#ef4444' : doc.status === 'expiring' ? '#f59e0b' : 'var(--text-secondary)' }}
                            >
                              {formatDate(doc.expiry)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className="inline-block px-2.5 py-0.5 text-xs font-semibold"
                              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}
                            >
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              className="flex items-center gap-1 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                            >
                              <Download size={11} />
                              Download
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Documents summary */}
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                Supporting Documents
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: 'Contractor Agreement', status: 'on-file',   icon: FileText, color: '#3b82f6' },
                  { name: 'SWMS on File',           status: detail.preQualChecklist.find(i => i.item === 'SWMS on File')?.complete ? 'on-file' : 'missing', icon: ClipboardList, color: '#8b5cf6' },
                  { name: 'Site Induction Records', status: detail.preQualChecklist.find(i => i.item === 'Site Induction Completed')?.complete ? 'on-file' : 'missing', icon: UserCheck, color: '#22c55e' },
                ].map(doc => (
                  <div
                    key={doc.name}
                    className="flex items-center gap-3 p-3"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: doc.color + '18' }}>
                      <doc.icon size={14} style={{ color: doc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{doc.name}</p>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wide mt-0.5"
                        style={{ color: doc.status === 'on-file' ? '#22c55e' : '#ef4444' }}
                      >
                        {doc.status === 'on-file' ? '✓ On File' : '✗ Missing'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )
      })()}

      {/* ── Tab: Licences ────────────────────────────────────────────── */}
      {tab === 'licences' && (() => {
        return (
          <Card className="overflow-hidden">
            <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Licences & Registrations</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {detail.licences.length} licences on file · {detail.licences.filter(l => l.status === 'current').length} current
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    {['Licence / Certificate', 'Licence Number', 'Issuing Authority', 'Expiry', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detail.licences.map(lic => {
                    const cfg = insuranceStatusConfig[lic.status]
                    return (
                      <tr key={lic.id} className="group" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                              <BadgeCheck size={13} style={{ color: cfg.color }} />
                            </div>
                            <span className="font-medium" style={{ color: 'var(--text)' }}>{lic.type}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{lic.number}</span>
                        </td>
                        <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>{lic.authority}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className="text-sm font-medium"
                            style={{ color: lic.status === 'expired' ? '#ef4444' : lic.status === 'expiring' ? '#f59e0b' : 'var(--text-secondary)' }}
                          >
                            {lic.expiry ? formatDate(lic.expiry) : 'No Expiry'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className="inline-block px-2.5 py-0.5 text-xs font-semibold"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            className="flex items-center gap-1 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                          >
                            <Download size={11} />
                            Download
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      })()}

      {/* ── Tab: Workers ─────────────────────────────────────────────── */}
      {tab === 'workers' && (() => {
        const inductionColors = {
          complete: { color: '#22c55e', bg: '#22c55e18', label: 'Complete' },
          pending:  { color: '#f59e0b', bg: '#f59e0b18', label: 'Pending'  },
          overdue:  { color: '#ef4444', bg: '#ef444418', label: 'Overdue'  },
        }
        return (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex gap-4 text-sm">
              {[
                { label: 'Total Workers',  value: detail.contractorWorkers.length,                                                    color: 'var(--text)'    },
                { label: 'Inducted',       value: detail.contractorWorkers.filter(w => w.inductionStatus === 'complete').length,       color: '#22c55e'        },
                { label: 'Pending',        value: detail.contractorWorkers.filter(w => w.inductionStatus === 'pending').length,        color: '#f59e0b'        },
                { label: 'Overdue',        value: detail.contractorWorkers.filter(w => w.inductionStatus === 'overdue').length,        color: '#ef4444'        },
                { label: 'White Card',     value: detail.contractorWorkers.filter(w => w.whiteCard).length,                           color: '#3b82f6'        },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-bold text-base" style={{ color }}>{value}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  {label !== 'White Card' && <span style={{ color: 'var(--border)' }}>·</span>}
                </div>
              ))}
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                      {['Name', 'Role', 'White Card', 'Induction Status', 'Last On Site'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detail.contractorWorkers.map(worker => {
                      const ind = inductionColors[worker.inductionStatus]
                      return (
                        <tr key={worker.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 flex items-center justify-center flex-shrink-0 text-xs font-bold"
                                style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                              >
                                {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <span className="font-medium" style={{ color: 'var(--text)' }}>{worker.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>{worker.role}</td>
                          <td className="py-3.5 px-4">
                            {worker.whiteCard
                              ? <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#22c55e' }}><Check size={12} /> Yes</span>
                              : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#ef4444' }}><X size={12} /> No</span>
                            }
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className="inline-block px-2.5 py-0.5 text-xs font-semibold"
                              style={{ background: ind.bg, color: ind.color, border: `1px solid ${ind.color}40` }}
                            >
                              {ind.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>{formatDate(worker.lastOnSite)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )
      })()}

      {/* ── Tab: Activity ────────────────────────────────────────────── */}
      {tab === 'activity' && (() => {
        return (
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-5" style={{ color: 'var(--text-muted)' }}>
              Activity Log
            </p>
            <div className="space-y-0">
              {detail.activityLog.map((entry, i) => {
                const cfg = activityIconConfig[entry.type]
                const IconComp = cfg.icon
                const isLast = i === detail.activityLog.length - 1
                return (
                  <div key={i} className="flex gap-4">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                        style={{ background: cfg.color + '18', border: `1px solid ${cfg.color}40` }}
                      >
                        <IconComp size={13} style={{ color: cfg.color }} />
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 my-1" style={{ background: 'var(--border)', minHeight: '1.5rem' }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`flex-1 ${isLast ? '' : 'pb-5'}`}>
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{entry.action}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>{formatDate(entry.date)}</span>
                        <span style={{ color: 'var(--border)' }}>·</span>
                        <span>{entry.user}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )
      })()}

    </div>
  )
}
