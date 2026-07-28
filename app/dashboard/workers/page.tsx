'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { workers } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  Plus, Search, UserCheck, UserX, Clock, ChevronDown,
  CheckCircle2, XCircle, Award, X, Scan, Loader2,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type ApprovalStatus = 'approved' | 'pending' | 'declined'
type ApprovalFilter = 'all' | ApprovalStatus

// ── Static config ────────────────────────────────────────────────────────────

const APPROVAL_CONFIG: Record<ApprovalStatus, {
  label: string
  dot: string
  bg: string
  color: string
  badgeBg: string
  badgeText: string
}> = {
  approved: {
    label: 'Approved',
    dot: 'bg-green-400',
    bg: 'rgba(34,197,94,0.1)',
    color: '#16a34a',
    badgeBg: 'rgba(34,197,94,0.12)',
    badgeText: '#16a34a',
  },
  pending: {
    label: 'Pending',
    dot: 'bg-amber-400',
    bg: 'rgba(245,158,11,0.1)',
    color: '#d97706',
    badgeBg: 'rgba(245,158,11,0.12)',
    badgeText: '#d97706',
  },
  declined: {
    label: 'Declined',
    dot: 'bg-red-400',
    bg: 'rgba(239,68,68,0.1)',
    color: '#dc2626',
    badgeBg: 'rgba(239,68,68,0.12)',
    badgeText: '#dc2626',
  },
}

const EMPLOYMENT_COLORS: Record<string, string> = {
  permanent:    'bg-blue-100 text-blue-700',
  casual:       'bg-purple-100 text-purple-700',
  'labour-hire':'bg-orange-100 text-orange-700',
}

const INDUCTION_CONFIG = {
  complete: { icon: CheckCircle2, color: 'text-green-500' },
  pending:  { icon: Clock,        color: 'text-amber-500' },
  overdue:  { icon: XCircle,      color: 'text-red-500'   },
}

// ── Derived lists ────────────────────────────────────────────────────────────

const ALL_ROLES       = ['Site Supervisor','Foreman','Labourer','Electrician','Plumber',
                         'Carpenter','HSE Advisor','Project Manager','Safety Officer','Engineer']
const ALL_DEPARTMENTS = ['Construction','Electrical','Civil','Mechanical','HSE',
                         'Administration','Management']
const ALL_SITES       = ['Site A – North Sydney','Site B – Parramatta',
                         'Site C – Chatswood','Site D – Blacktown','Head Office']

// Unique roles actually present in the worker list (for the role filter)
const WORKER_ROLES = Array.from(new Set(workers.map(w => w.role))).sort()

// ── Add-worker form ──────────────────────────────────────────────────────────

const BLANK_FORM = {
  name: '', role: '', department: '', employmentType: 'permanent',
  site: '', phone: '', email: '', emergencyContact: '',
  whiteCard: 'yes', inductionStatus: 'pending', notes: '',
}

const SCAN_RESULTS = [
  { name: 'Daniel Kowalski',   role: 'Electrician',    whiteCard: 'yes' },
  { name: 'Priya Subramaniam', role: 'HSE Advisor',    whiteCard: 'yes' },
  { name: 'Brett Halvorsen',   role: 'Site Supervisor', whiteCard: 'yes' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WorkersPage() {
  const [search, setSearch]         = useState('')
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>('all')
  const [roleFilter, setRoleFilter] = useState('')
  const [roleOpen, setRoleOpen]     = useState(false)

  const [showDrawer, setShowDrawer] = useState(false)
  const [form, setForm]             = useState({ ...BLANK_FORM })
  const [scanning, setScanning]     = useState(false)
  const [scanDone, setScanDone]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  // ── Counts ────────────────────────────────────────────────────────────────
  const approved = workers.filter(w => w.approvalStatus === 'approved').length
  const pending  = workers.filter(w => w.approvalStatus === 'pending').length
  const declined = workers.filter(w => w.approvalStatus === 'declined').length

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => workers.filter(w => {
    const matchSearch = !search ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.role.toLowerCase().includes(search.toLowerCase())
    const matchApproval = approvalFilter === 'all' || w.approvalStatus === approvalFilter
    const matchRole = !roleFilter || w.role === roleFilter
    return matchSearch && matchApproval && matchRole
  }), [search, approvalFilter, roleFilter])

  // ── Handlers ──────────────────────────────────────────────────────────────
  function openDrawer() {
    setForm({ ...BLANK_FORM }); setScanDone(false); setSubmitted(false); setShowDrawer(true)
  }

  function handleScan() {
    setScanning(true)
    setTimeout(() => {
      const r = SCAN_RESULTS[Math.floor(Math.random() * SCAN_RESULTS.length)]
      setForm(f => ({ ...f, name: r.name, role: r.role, whiteCard: r.whiteCard }))
      setScanning(false); setScanDone(true)
    }, 1800)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 1200)
  }

  const field = (key: keyof typeof BLANK_FORM) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Workers"
        description="Worker profiles, licences and approval status"
        action={{ label: 'Add Worker', icon: <Plus size={14} />, onClick: openDrawer }}
      >
        {/* Name / role text search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search name or role…"
            className="pl-8 w-48"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* ── Summary cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Workers', value: workers.length, icon: UserCheck, color: 'text-neutral-600', bg: 'bg-neutral-100' },
          { label: 'Approved',      value: approved,        icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending',       value: pending,          icon: Clock,       color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Declined',      value: declined,         icon: UserX,       color: 'text-red-600',   bg: 'bg-red-50'   },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 flex items-center justify-center ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Approval status tabs */}
        <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
          {(
            [
              { key: 'all',      label: 'All',      count: workers.length },
              { key: 'approved', label: 'Approved', count: approved },
              { key: 'pending',  label: 'Pending',  count: pending  },
              { key: 'declined', label: 'Declined', count: declined },
            ] as { key: ApprovalFilter; label: string; count: number }[]
          ).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setApprovalFilter(key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                color: approvalFilter === key ? 'var(--text)' : 'var(--text-muted)',
                borderBottom: approvalFilter === key ? '2px solid var(--accent)' : '2px solid transparent',
                background: 'none',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              {label}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none"
                style={
                  approvalFilter === key
                    ? { background: 'var(--accent)', color: 'var(--accent-text)' }
                    : { background: 'var(--bg-secondary)', color: 'var(--text-muted)' }
                }
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Role / type filter dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={() => setRoleOpen(o => !o)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors"
            style={{
              background: roleFilter ? 'var(--accent)' : 'var(--bg)',
              color: roleFilter ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            <UserCheck size={13} />
            {roleFilter || 'Filter by Role'}
            <ChevronDown size={12} style={{ opacity: 0.6 }} />
          </button>

          {roleOpen && (
            <>
              {/* Close on outside click */}
              <div className="fixed inset-0 z-10" onClick={() => setRoleOpen(false)} />
              <div
                className="absolute right-0 top-full mt-1 z-20 min-w-[180px] py-1"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              >
                <button
                  onClick={() => { setRoleFilter(''); setRoleOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ color: roleFilter === '' ? 'var(--text)' : 'var(--text-secondary)', fontWeight: roleFilter === '' ? 700 : 400 }}
                >
                  All Roles
                </button>
                {WORKER_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => { setRoleFilter(role); setRoleOpen(false) }}
                    className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color: roleFilter === role ? 'var(--text)' : 'var(--text-secondary)', fontWeight: roleFilter === role ? 700 : 400, background: roleFilter === role ? 'var(--bg-hover)' : '' }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Active filter chips */}
        {(roleFilter || search) && (
          <div className="flex items-center gap-1.5">
            {roleFilter && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2 py-1"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                Role: {roleFilter}
                <button onClick={() => setRoleFilter('')} style={{ color: 'var(--text-muted)' }}>
                  <X size={10} />
                </button>
              </span>
            )}
            {search && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2 py-1"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                &ldquo;{search}&rdquo;
                <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }}>
                  <X size={10} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Results count ────────────────────────────────────────────────── */}
      <p className="text-xs -mt-2" style={{ color: 'var(--text-muted)' }}>
        Showing {filtered.length} of {workers.length} workers
      </p>

      {/* ── Worker cards ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center" style={{ border: '1px dashed var(--border)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No workers match your filters</p>
          <button
            onClick={() => { setSearch(''); setApprovalFilter('all'); setRoleFilter('') }}
            className="mt-2 text-xs underline"
            style={{ color: 'var(--text-muted)' }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(worker => {
            const approval = APPROVAL_CONFIG[worker.approvalStatus as ApprovalStatus]
            const InductionIcon = INDUCTION_CONFIG[worker.inductionStatus].icon
            return (
              <Card key={worker.id} className="p-5 cursor-pointer group">
                <div className="flex items-start gap-4">

                  {/* Avatar + approval dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-12 h-12 flex items-center justify-center font-bold text-sm"
                      style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
                    >
                      {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white ${approval.dot}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text)' }}>{worker.name}</p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{worker.role} · {worker.department}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Employment type */}
                        <span className={`text-xs font-semibold px-2.5 py-0.5 capitalize ${EMPLOYMENT_COLORS[worker.employmentType]}`}>
                          {worker.employmentType.replace('-', ' ')}
                        </span>
                        {/* Approval status badge */}
                        <span
                          className="text-xs font-bold px-2.5 py-0.5"
                          style={{ background: approval.badgeBg, color: approval.badgeText }}
                        >
                          {approval.label}
                        </span>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <div className="text-xs">
                        <p className="mb-1" style={{ color: 'var(--text-muted)' }}>White Card</p>
                        <div className="flex items-center gap-1">
                          {worker.whiteCard
                            ? <CheckCircle2 size={13} className="text-green-500" />
                            : <XCircle size={13} className="text-red-500" />}
                          <span className={`font-semibold ${worker.whiteCard ? 'text-green-600' : 'text-red-600'}`}>
                            {worker.whiteCard ? 'Verified' : 'Missing'}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs">
                        <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Induction</p>
                        <div className="flex items-center gap-1">
                          <InductionIcon size={13} className={INDUCTION_CONFIG[worker.inductionStatus].color} />
                          <span className="font-semibold capitalize" style={{ color: 'var(--text)' }}>{worker.inductionStatus}</span>
                        </div>
                      </div>
                      <div className="text-xs">
                        <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Training</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="h-full" style={{ width: `${worker.trainingCompletion}%`, background: 'var(--accent)' }} />
                          </div>
                          <span className="font-semibold" style={{ color: 'var(--text)' }}>{worker.trainingCompletion}%</span>
                        </div>
                      </div>
                      <div className="text-xs">
                        <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Last On Site</p>
                        <span className="font-semibold" style={{ color: 'var(--text)' }}>{formatDate(worker.lastOnSite)}</span>
                      </div>
                    </div>

                    {/* Licences */}
                    {worker.licences.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {worker.licences.map(lic => (
                          <span
                            key={lic.type}
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 font-medium border ${
                              lic.status === 'active'
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : lic.status === 'expiring-soon'
                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                : 'border-red-200 bg-red-50 text-red-700'
                            }`}
                          >
                            <Award size={10} />
                            {lic.type}
                            <span className="text-[10px] opacity-70">· {formatDate(lic.expiry)}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-red-500 font-medium flex items-center gap-1">
                        <XCircle size={12} /> No licences on file
                      </p>
                    )}
                  </div>
                </div>

                {/* Hover actions */}
                <div
                  className="flex gap-2 mt-4 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Button variant="outline" size="sm" className="text-xs h-7">View Profile</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7">Manage Licences</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7">Assign Training</Button>
                  {worker.approvalStatus === 'pending' && (
                    <>
                      <Button size="sm" className="text-xs h-7 ml-auto" style={{ background: '#16a34a', color: '#fff', border: 'none' }}>
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7" style={{ color: '#dc2626', borderColor: 'rgba(220,38,38,0.3)' }}>
                        Decline
                      </Button>
                    </>
                  )}
                  {worker.approvalStatus === 'declined' && (
                    <Button variant="outline" size="sm" className="text-xs h-7 ml-auto" style={{ color: '#d97706', borderColor: 'rgba(217,119,6,0.3)' }}>
                      Re-review
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* ══ Add Worker Drawer ══════════════════════════════════════════════ */}
      {showDrawer && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowDrawer(false)} />
          <div
            className="fixed right-0 top-0 h-full w-full max-w-lg z-50 flex flex-col overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg)', borderLeft: '1px solid var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>Add Worker</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Fill in details or scan a licence card</p>
              </div>
              <button onClick={() => setShowDrawer(false)} className="p-1.5 transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Success */}
            {submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="w-16 h-16 flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                  <CheckCircle2 size={32} style={{ color: 'var(--accent-text)' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Worker Added!</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <strong>{form.name || 'New worker'}</strong> has been added and is pending approval.
                </p>
                <div className="flex gap-3 mt-2">
                  <Button onClick={openDrawer}>Add Another</Button>
                  <Button variant="outline" onClick={() => setShowDrawer(false)}>Done</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="px-6 py-5 space-y-5">

                  {/* AI Licence Scan */}
                  <div
                    className="p-3 flex items-center justify-between gap-3"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  >
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>⚡ AI Licence Scan</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {scanDone ? '✓ Details auto-filled from licence' : 'Scan a White Card or licence to auto-fill'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleScan}
                      disabled={scanning}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-opacity disabled:opacity-60"
                      style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
                    >
                      {scanning ? <Loader2 size={12} className="animate-spin" /> : <Scan size={12} />}
                      {scanning ? 'Scanning…' : scanDone ? 'Re-scan' : 'Scan Card'}
                    </button>
                  </div>

                  {/* Personal */}
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Personal Details</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                        <input required placeholder="e.g. James Chen"
                          className="w-full px-3 py-2 text-sm outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                          {...field('name')} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Role *</label>
                          <select required className="w-full px-3 py-2 text-sm outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            {...field('role')}>
                            <option value="">Select role…</option>
                            {ALL_ROLES.map(r => <option key={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Department</label>
                          <select className="w-full px-3 py-2 text-sm outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            {...field('department')}>
                            <option value="">Select…</option>
                            {ALL_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                          <input type="tel" placeholder="04xx xxx xxx" className="w-full px-3 py-2 text-sm outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            {...field('phone')} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
                          <input type="email" placeholder="name@company.com" className="w-full px-3 py-2 text-sm outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            {...field('email')} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Emergency Contact</label>
                        <input placeholder="Name & phone number" className="w-full px-3 py-2 text-sm outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                          {...field('emergencyContact')} />
                      </div>
                    </div>
                  </section>

                  {/* Employment */}
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Employment</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Employment Type *</label>
                        <div className="flex gap-2">
                          {['permanent','casual','labour-hire'].map(t => (
                            <button key={t} type="button" onClick={() => setForm(f => ({ ...f, employmentType: t }))}
                              className="flex-1 py-1.5 text-xs font-semibold capitalize transition-colors"
                              style={form.employmentType === t
                                ? { background: 'var(--accent)', color: 'var(--accent-text)', border: '1px solid var(--accent-border)' }
                                : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                              {t.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Primary Site</label>
                        <select className="w-full px-3 py-2 text-sm outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                          {...field('site')}>
                          <option value="">Select site…</option>
                          {ALL_SITES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Compliance */}
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Compliance</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>White Card</label>
                        <div className="flex gap-2">
                          {['yes','no'].map(v => (
                            <button key={v} type="button" onClick={() => setForm(f => ({ ...f, whiteCard: v }))}
                              className="flex-1 py-1.5 text-xs font-semibold capitalize transition-colors"
                              style={form.whiteCard === v
                                ? { background: 'var(--accent)', color: 'var(--accent-text)', border: '1px solid var(--accent-border)' }
                                : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                              {v === 'yes' ? '✓ Verified' : '✗ Not Yet'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Induction Status</label>
                        <div className="flex gap-2">
                          {['complete','pending','overdue'].map(v => (
                            <button key={v} type="button" onClick={() => setForm(f => ({ ...f, inductionStatus: v }))}
                              className="flex-1 py-1.5 text-xs font-semibold capitalize transition-colors"
                              style={form.inductionStatus === v
                                ? { background: 'var(--accent)', color: 'var(--accent-text)', border: '1px solid var(--accent-border)' }
                                : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
                        <textarea rows={2} placeholder="Any additional notes…"
                          className="w-full px-3 py-2 text-sm outline-none resize-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                          value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex items-center gap-3 flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                  <Button type="button" variant="outline" onClick={() => setShowDrawer(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 gap-2" disabled={submitting}>
                    {submitting ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    {submitting ? 'Adding…' : 'Add Worker'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  )
}
