'use client'

import { useState } from 'react'
import {
  Key, CheckCircle2, AlertCircle, XCircle, Clock,
  TrendingUp, Plus, Download, RefreshCw, GraduationCap,
} from 'lucide-react'
import { licences, type Licence } from '@/lib/re-mock-data'

const RE_ACCENT = '#3B82F6'

function licenceStatus(s: Licence['status']) {
  const cfg = {
    'Active':         { color: '#22c55e', bg: '#f0fdf4', icon: CheckCircle2 },
    'Expiring Soon':  { color: '#f59e0b', bg: '#fef3c7', icon: AlertCircle  },
    'Expired':        { color: '#ef4444', bg: '#fef2f2', icon: XCircle      },
    'Suspended':      { color: '#9ca3af', bg: '#f9fafb', icon: Clock        },
  }[s] ?? { color: '#9ca3af', bg: '#f9fafb', icon: Clock }
  const Icon = cfg.icon
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5"
      style={{ background: cfg.bg, color: cfg.color }}>
      <Icon size={9} />{s}
    </span>
  )
}

function cpdColor(done: number, req: number) {
  const pct = done / req
  if (pct >= 1) return '#22c55e'
  if (pct >= 0.5) return '#f59e0b'
  return '#ef4444'
}

function LicenceModal({ lic, onClose }: { lic: Licence; onClose: () => void }) {
  const col = cpdColor(lic.cpdHoursCompleted, lic.cpdHoursRequired)
  const daysToExpiry = Math.ceil((new Date(lic.expiryDate).getTime() - Date.now()) / 86400000)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-md" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: RE_ACCENT }}>{lic.licenceType}</p>
              <h3 className="text-xl font-black" style={{ color: '#0f172a' }}>{lic.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{lic.role}</p>
              <div className="mt-2">{licenceStatus(lic.status)}</div>
            </div>
            <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
          {[
            { label: 'Licence No.',  value: lic.licenceNo  },
            { label: 'Issued by',    value: lic.issuer      },
            { label: 'Expiry Date',  value: new Date(lic.expiryDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Days to Expiry', value: daysToExpiry > 0 ? `${daysToExpiry} days` : 'EXPIRED', warn: daysToExpiry <= 90 },
          ].map(({ label, value, warn }) => (
            <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <span className="text-[11px]" style={{ color: '#94a3b8' }}>{label}</span>
              <span className="text-xs font-bold" style={{ color: warn ? '#f59e0b' : '#f5f5f5' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* CPD */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#94a3b8' }}>CPD Progress</p>
            <span className="text-xs font-black" style={{ color: col }}>
              {lic.cpdHoursCompleted}/{lic.cpdHoursRequired} hours
            </span>
          </div>
          <div className="h-3 w-full" style={{ background: '#1e1e1e' }}>
            <div className="h-full transition-all duration-700"
              style={{ width: `${Math.min((lic.cpdHoursCompleted / lic.cpdHoursRequired) * 100, 100)}%`, background: col }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: '#94a3b8' }}>
            <span>Due {new Date(lic.cpdDueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>{lic.cpdHoursRequired - lic.cpdHoursCompleted > 0 ? `${lic.cpdHoursRequired - lic.cpdHoursCompleted} hrs remaining` : 'Complete ✓'}</span>
          </div>
        </div>

        <div className="px-6 py-4 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: RE_ACCENT, color: '#fff' }}>
            <RefreshCw size={12} /> Renew Licence
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: '#1e1e1e', color: '#64748b' }}>
            <GraduationCap size={12} /> Add CPD Hours
          </button>
          <button onClick={onClose} className="px-3 py-2 text-xs font-bold" style={{ color: '#94a3b8', background: 'none' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function LicencesPage() {
  const [selected, setSelected] = useState<Licence | null>(null)

  const expired  = licences.filter(l => l.status === 'Expired').length
  const expiring = licences.filter(l => l.status === 'Expiring Soon').length
  const cpdLate  = licences.filter(l => l.cpdHoursCompleted < l.cpdHoursRequired).length
  const totalCPD = licences.reduce((s, l) => s + l.cpdHoursCompleted, 0)
  const reqCPD   = licences.reduce((s, l) => s + l.cpdHoursRequired, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Licences &amp; CPD</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            NSW Fair Trading — Property and Stock Agents Act 2002
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-70"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-80"
            style={{ background: RE_ACCENT, color: '#fff' }}>
            <Plus size={12} /> Add Staff
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Licensed',  value: licences.length, color: RE_ACCENT  },
          { label: 'Active',          value: licences.filter(l => l.status === 'Active').length, color: '#22c55e' },
          { label: 'Expiring Soon',   value: expiring,        color: '#f59e0b'  },
          { label: 'Expired',         value: expired,         color: '#ef4444'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* CPD summary */}
      <div className="px-6 py-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={15} style={{ color: RE_ACCENT }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>CPD Overview — 2025</h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5"
            style={{ background: cpdLate > 0 ? '#fef3c7' : '#f0fdf4', color: cpdLate > 0 ? '#b45309' : '#15803d' }}>
            {cpdLate > 0 ? `${cpdLate} behind` : 'All on track'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: 'var(--text-muted)' }}>Team CPD hours</span>
              <span className="font-black" style={{ color: totalCPD >= reqCPD ? '#22c55e' : RE_ACCENT }}>
                {totalCPD}/{reqCPD}
              </span>
            </div>
            <div className="h-2" style={{ background: 'var(--bg-secondary)' }}>
              <div className="h-full" style={{ width: `${Math.min((totalCPD / reqCPD) * 100, 100)}%`, background: RE_ACCENT }} />
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              16 hours required per agent per calendar year
            </p>
          </div>
          <div className="space-y-1">
            {licences.map(l => {
              const col = cpdColor(l.cpdHoursCompleted, l.cpdHoursRequired)
              return (
                <div key={l.id} className="flex items-center gap-2">
                  <span className="text-[10px] w-20 truncate" style={{ color: 'var(--text-muted)' }}>{l.name.split(' ')[0]}</span>
                  <div className="flex-1 h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full" style={{ width: `${(l.cpdHoursCompleted / l.cpdHoursRequired) * 100}%`, background: col }} />
                  </div>
                  <span className="text-[10px] font-bold w-10 text-right" style={{ color: col }}>
                    {l.cpdHoursCompleted}/{l.cpdHoursRequired}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Licence register */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <Key size={13} style={{ color: RE_ACCENT }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Licence Register</h2>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.8fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Agent</span><span>Licence Type</span><span>Licence No.</span><span>Expiry</span><span>CPD</span><span>Status</span>
        </div>

        {licences.map((l, i) => {
          const col = cpdColor(l.cpdHoursCompleted, l.cpdHoursRequired)
          const daysLeft = Math.ceil((new Date(l.expiryDate).getTime() - Date.now()) / 86400000)
          return (
            <div key={l.id}
              className="grid items-center px-5 py-3.5 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
              style={{
                gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.8fr 0.8fr',
                borderBottom: i < licences.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: l.status === 'Expired' ? '3px solid #ef4444' : l.status === 'Expiring Soon' ? '3px solid #f59e0b' : '3px solid transparent',
              }}
              onClick={() => setSelected(l)}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{l.name}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{l.role}</p>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{l.licenceType}</span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{l.licenceNo}</span>
              <div>
                <p className="text-[11px]" style={{ color: daysLeft <= 90 ? '#f59e0b' : 'var(--text-muted)' }}>
                  {new Date(l.expiryDate).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
                </p>
                {daysLeft > 0 && daysLeft <= 90 && (
                  <p className="text-[9px] font-bold" style={{ color: '#f59e0b' }}>{daysLeft}d left</p>
                )}
                {daysLeft <= 0 && <p className="text-[9px] font-bold" style={{ color: '#ef4444' }}>EXPIRED</p>}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-full" style={{ width: `${Math.min((l.cpdHoursCompleted / l.cpdHoursRequired) * 100, 100)}%`, background: col }} />
                </div>
                <span className="text-[9px] font-bold" style={{ color: col }}>{l.cpdHoursCompleted}h</span>
              </div>
              {licenceStatus(l.status)}
            </div>
          )
        })}
      </div>

      {selected && <LicenceModal lic={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
