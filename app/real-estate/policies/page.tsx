'use client'

import { useState } from 'react'
import {
  BookOpen, CheckCircle2, AlertCircle, Clock, Plus,
  Download, Upload, Users, RefreshCw, Eye, Zap,
} from 'lucide-react'
import { policies, type Policy } from '@/lib/re-mock-data'

const RE_ACCENT = '#3B82F6'

function statusBadge(s: Policy['status']) {
  const cfg = {
    'Current':        { bg: '#f0fdf4', text: '#15803d', icon: CheckCircle2 },
    'Under Review':   { bg: '#eff6ff', text: '#1d4ed8', icon: RefreshCw    },
    'Overdue Review': { bg: '#fef2f2', text: '#dc2626', icon: AlertCircle  },
    'Draft':          { bg: '#f9fafb', text: '#6b7280', icon: Clock        },
  }[s] ?? { bg: '#f9fafb', text: '#6b7280', icon: Clock }
  const Icon = cfg.icon
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5"
      style={{ background: cfg.bg, color: cfg.text }}>
      <Icon size={9} />{s}
    </span>
  )
}

function PolicyModal({ policy, onClose }: { policy: Policy; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-lg" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0', borderLeft: `3px solid ${RE_ACCENT}` }}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-[3px]" style={{ color: RE_ACCENT }}>{policy.category}</span>
              <h3 className="text-base font-black mt-1" style={{ color: '#0f172a' }}>{policy.title}</h3>
              <div className="flex items-center gap-2 mt-2">{statusBadge(policy.status)}</div>
            </div>
            <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
        </div>
        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
          {[
            { label: 'Version',       value: `v${policy.version}` },
            { label: 'Owner',         value: policy.owner         },
            { label: 'Last Reviewed', value: new Date(policy.lastReviewed).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Next Review',   value: new Date(policy.nextReview).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: '#94a3b8' }}>{label}</span>
              <span className="text-xs font-medium" style={{ color: '#0f172a' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Staff acknowledgement */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-bold uppercase tracking-[3px] mb-3" style={{ color: '#94a3b8' }}>
            Staff Acknowledgement — {policy.acknowledgedCount}/{policy.totalStaff}
          </p>
          <div className="h-2 w-full mb-2" style={{ background: '#1e1e1e' }}>
            <div className="h-full" style={{ width: `${Math.round((policy.acknowledgedCount / policy.totalStaff) * 100)}%`, background: policy.acknowledgedCount === policy.totalStaff ? '#22c55e' : RE_ACCENT }} />
          </div>
          {policy.acknowledgedCount < policy.totalStaff && (
            <p className="text-[11px]" style={{ color: '#f59e0b' }}>
              {policy.totalStaff - policy.acknowledgedCount} staff yet to acknowledge
            </p>
          )}
        </div>

        <div className="px-6 py-4 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: RE_ACCENT, color: '#fff' }}>
            <Eye size={12} /> View Document
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: '#1e1e1e', color: '#64748b' }}>
            <Download size={12} /> Download
          </button>
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold"
            style={{ color: '#94a3b8', background: 'none' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function PoliciesPage() {
  const [selected, setSelected] = useState<Policy | null>(null)
  const [catFilter, setCatFilter] = useState('All')

  const cats = ['All', ...Array.from(new Set(policies.map(p => p.category)))]
  const filtered = catFilter === 'All' ? policies : policies.filter(p => p.category === catFilter)

  const overdue = policies.filter(p => p.status === 'Overdue Review').length
  const unack   = policies.filter(p => p.acknowledgedCount < p.totalStaff).length

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Policies &amp; Procedures</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {policies.length} policies &middot; {overdue} overdue review &middot; {unack} pending acknowledgement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-70"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <Upload size={12} /> Upload Policy
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-80"
            style={{ background: RE_ACCENT, color: '#fff' }}>
            <Plus size={12} /> New Policy
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Policies',      value: policies.length,                                    color: RE_ACCENT  },
          { label: 'Current',             value: policies.filter(p => p.status === 'Current').length,color: '#22c55e'  },
          { label: 'Overdue Review',      value: overdue,                                             color: '#ef4444'  },
          { label: 'Pending Ack.',        value: unack,                                               color: '#f59e0b'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Regulatory reminder */}
      <div className="flex items-start gap-3 px-5 py-4"
        style={{ background: '#f0fdf4', border: '1px solid #22c55e30' }}>
        <BookOpen size={15} style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: '#166534' }}>
          <span className="font-bold">Regulatory obligation: </span>
          Australian real estate agencies must maintain written policies for AML/CTF, trust accounting, privacy, and professional conduct. Staff must acknowledge all policies annually. Reviews are required at least every 12 months or following legislative change.
        </p>
      </div>

      {/* Filter + List */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-1 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className="px-3 py-1.5 text-xs font-bold transition-colors"
                style={catFilter === c ? { background: RE_ACCENT, color: '#fff' } : { color: 'var(--text-muted)' }}>
                {c}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold hover:opacity-70"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <Users size={11} /> Send Reminder
          </button>
        </div>

        {filtered.map((p, i) => (
          <div key={p.id}
            className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
            onClick={() => setSelected(p)}>
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ background: RE_ACCENT + '15', border: `1px solid ${RE_ACCENT}30` }}>
              <BookOpen size={14} style={{ color: RE_ACCENT }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{p.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                v{p.version} &middot; {p.category} &middot; Owner: {p.owner}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                {statusBadge(p.status)}
              </div>
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <Users size={9} />
                <span style={{ color: p.acknowledgedCount === p.totalStaff ? '#22c55e' : '#f59e0b' }}>
                  {p.acknowledgedCount}/{p.totalStaff} ack.
                </span>
              </div>
            </div>
            <div className="text-right text-[10px] flex-shrink-0" style={{ minWidth: 80 }}>
              <p style={{ color: 'var(--text-muted)' }}>Next review</p>
              <p className="font-bold" style={{ color: p.status === 'Overdue Review' ? '#ef4444' : 'var(--text-secondary)' }}>
                {new Date(p.nextReview).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Generation panel */}
      <div className="flex items-start gap-4 px-6 py-5"
        style={{ background: 'var(--bg)', border: `1px solid ${RE_ACCENT}30`, borderLeft: `4px solid ${RE_ACCENT}` }}>
        <Zap size={18} style={{ color: RE_ACCENT, flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>AI Policy Generator</p>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Generate a compliant policy document tailored to your agency, state legislation, and REIA guidelines in seconds.
          </p>
          <div className="flex gap-2">
            {['AML/CTF Policy', 'Privacy Policy', 'Trust Account Procedures', 'PM Procedures'].map(t => (
              <button key={t} className="text-[10px] font-bold px-3 py-1.5 hover:opacity-80"
                style={{ background: RE_ACCENT + '20', color: RE_ACCENT, border: `1px solid ${RE_ACCENT}40` }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && <PolicyModal policy={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
