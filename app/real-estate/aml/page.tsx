'use client'

import { useState } from 'react'
import {
  Shield, CheckCircle2, XCircle, AlertCircle, Plus, Search,
  User, FileText, AlertTriangle, Zap, Clock,
} from 'lucide-react'
import { amlChecks, type AMLCheck } from '@/lib/re-mock-data'

const RE_ACCENT = '#3B82F6'

function riskBadge(r: AMLCheck['riskRating']) {
  const cfg = {
    Low:    { bg: '#f0fdf4', text: '#15803d' },
    Medium: { bg: '#fef3c7', text: '#b45309' },
    High:   { bg: '#fef2f2', text: '#dc2626' },
  }[r]
  return <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: cfg.bg, color: cfg.text }}>{r} Risk</span>
}

function statusIcon(s: AMLCheck['status']) {
  if (s === 'Verified') return <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
  if (s === 'Pending')  return <Clock         size={14} style={{ color: '#f59e0b' }} />
  if (s === 'Flagged')  return <XCircle        size={14} style={{ color: '#ef4444' }} />
  return <AlertCircle size={14} style={{ color: '#9ca3af' }} />
}

function statusColor(s: AMLCheck['status']) {
  if (s === 'Verified') return '#22c55e'
  if (s === 'Pending')  return '#f59e0b'
  if (s === 'Flagged')  return '#ef4444'
  return '#9ca3af'
}

function AMLDetailModal({ check, onClose }: { check: AMLCheck; onClose: () => void }) {
  const checks = [
    { label: 'Identity Verified (2 forms of ID)',       done: true                   },
    { label: 'PEP (Politically Exposed Person) Check',  done: check.pepCheck         },
    { label: 'Sanctions & OFAC Screening',              done: check.sanctionsCheck   },
    { label: 'Source of Funds Documented',              done: check.sourceOfFunds    },
    { label: 'FIRB Check (foreign nationals)',          done: check.name !== 'Wei Zhang' && check.name !== 'Hassan Al-Rashid' || check.status === 'Verified' },
    { label: 'Ongoing Monitoring Enabled',             done: check.status === 'Verified' },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-lg" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0', borderLeft: `3px solid ${statusColor(check.status)}` }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: RE_ACCENT }}>AML / KYC Record</p>
              <h3 className="text-xl font-black" style={{ color: '#0f172a' }}>{check.name}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5"
                  style={{ background: statusColor(check.status) + '20', color: statusColor(check.status) }}>
                  {check.status}
                </span>
                {riskBadge(check.riskRating)}
                <span className="text-[10px]" style={{ color: '#94a3b8' }}>{check.role}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
          {[
            { label: 'Property',   value: check.property   },
            { label: 'ID Type',    value: check.idType     },
            { label: 'Checked By', value: check.checkedBy  },
            { label: 'Checked',    value: new Date(check.checkedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Expires',    value: new Date(check.expiryDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: '#94a3b8' }}>{label}</span>
              <span className="text-xs font-medium" style={{ color: '#0f172a' }}>{value}</span>
            </div>
          ))}
          {check.notes && (
            <div className="p-3 mt-2" style={{ background: '#1a0a0a', border: '1px solid #fca5a5' }}>
              <div className="flex items-start gap-2">
                <AlertTriangle size={12} style={{ color: '#ef4444', marginTop: 1, flexShrink: 0 }} />
                <p className="text-xs" style={{ color: '#991b1b' }}>{check.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-bold uppercase tracking-[3px] mb-3" style={{ color: '#94a3b8' }}>Due Diligence Checklist</p>
          <div className="space-y-2.5">
            {checks.map(({ label, done }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                  style={{ border: `1px solid ${done ? '#22c55e' : '#2a2a2a'}`, background: done ? '#22c55e10' : 'transparent' }}>
                  {done && <CheckCircle2 size={9} style={{ color: '#22c55e' }} />}
                </div>
                <span className="text-xs" style={{ color: done ? '#a8a8a8' : '#f5f5f5' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: '#22c55e', color: '#fff' }}>
            <CheckCircle2 size={12} /> Mark Verified
          </button>
          {check.status === 'Flagged' && (
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
              style={{ background: '#fef3c7', color: '#b45309' }}>
              <AlertTriangle size={12} /> Escalate
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold"
            style={{ background: '#1e1e1e', color: '#64748b' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function AMLPage() {
  const [selected, setSelected] = useState<AMLCheck | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [roleFilter, setRoleFilter] = useState('All')

  const roles = ['All', 'Buyer', 'Seller', 'Landlord', 'Tenant']
  const filtered = roleFilter === 'All' ? amlChecks : amlChecks.filter(c => c.role === roleFilter)

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>AML / KYC Checker</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Anti-Money Laundering &amp; Counter-Terrorism Financing Act 2006 compliance
          </p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-80"
          style={{ background: RE_ACCENT, color: '#fff' }}>
          <Plus size={13} /> New AML Check
        </button>
      </div>

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-5 py-4"
        style={{ background: '#eff6ff', border: `1px solid ${RE_ACCENT}30` }}>
        <Shield size={16} style={{ color: RE_ACCENT, flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: RE_ACCENT }}>
            Regulatory Requirement — AML/CTF Act 2006
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: '#1d4ed8' }}>
            Real estate agents in Australia are reporting entities under the AML/CTF Act. You must verify the identity of all buyers, sellers, landlords and tenants before providing a designated service. Records must be kept for 7 years. High-risk clients require enhanced due diligence.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Verified',  value: amlChecks.filter(c => c.status === 'Verified').length, color: '#22c55e' },
          { label: 'Pending',   value: amlChecks.filter(c => c.status === 'Pending').length,  color: '#f59e0b' },
          { label: 'Flagged',   value: amlChecks.filter(c => c.status === 'Flagged').length,  color: '#ef4444' },
          { label: 'High Risk', value: amlChecks.filter(c => c.riskRating === 'High').length, color: '#ef4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-1">
            {roles.map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className="px-3 py-1.5 text-xs font-bold transition-colors"
                style={roleFilter === r ? { background: RE_ACCENT, color: '#fff' } : { color: 'var(--text-muted)' }}>
                {r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <Search size={12} />
          </div>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '1.5fr 0.7fr 1.5fr 0.8fr 0.8fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Client</span><span>Role</span><span>Property</span><span>Risk</span><span>Status</span><span>Expires</span>
        </div>

        {filtered.map((c, i) => (
          <div key={c.id}
            className="grid items-center px-5 py-3.5 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
            style={{
              gridTemplateColumns: '1.5fr 0.7fr 1.5fr 0.8fr 0.8fr 0.8fr',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              borderLeft: `3px solid ${statusColor(c.status)}`,
            }}
            onClick={() => setSelected(c)}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center text-[10px] font-black flex-shrink-0"
                style={{ background: statusColor(c.status) + '20', color: statusColor(c.status) }}>
                {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{c.name}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.idType}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 self-center"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{c.role}</span>
            <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{c.property}</span>
            {riskBadge(c.riskRating)}
            <div className="flex items-center gap-1.5">
              {statusIcon(c.status)}
              <span className="text-[10px] font-bold" style={{ color: statusColor(c.status) }}>{c.status}</span>
            </div>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {new Date(c.expiryDate).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        ))}
      </div>

      {selected && <AMLDetailModal check={selected} onClose={() => setSelected(null)} />}

      {/* New AML check modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: RE_ACCENT }}>New Check</p>
              <h3 className="text-base font-black" style={{ color: '#0f172a' }}>AML / KYC Verification</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Full Legal Name',     placeholder: 'As per ID document' },
                { label: 'Date of Birth',        placeholder: 'DD/MM/YYYY' },
                { label: 'Role',                 placeholder: 'Buyer / Seller / Landlord / Tenant' },
                { label: 'Property Address',     placeholder: '14 Example Street, Suburb' },
                { label: 'Primary ID Type',      placeholder: 'Passport / Driver Licence / Medicare' },
                { label: 'ID Number',            placeholder: 'Document number' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <input placeholder={placeholder} className="w-full px-3 py-2.5 text-sm"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none' }} />
                </div>
              ))}
              <div className="p-3 text-xs flex items-start gap-2"
                style={{ background: RE_ACCENT + '10', border: `1px solid ${RE_ACCENT}30`, color: RE_ACCENT }}>
                <Zap size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                AI will run PEP screening, sanctions check, and FIRB flag analysis automatically.
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold hover:opacity-80"
                style={{ background: RE_ACCENT, color: '#fff' }}>
                <Shield size={12} /> Run AML Check
              </button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2.5 text-xs font-bold"
                style={{ background: '#1e1e1e', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
