'use client'

import { useState } from 'react'
import {
  Plus, Building2, AlertCircle, CheckCircle2, Clock,
  Wrench, Search, Zap, Calendar,
} from 'lucide-react'
import { pmProperties, pmChecklistTemplate, type PMProperty } from '@/lib/re-mock-data'

const RE_ACCENT = '#3B82F6'

function statusBadge(s: PMProperty['status']) {
  const cfg: Record<string, { bg: string; color: string }> = {
    'Leased':       { bg: '#f0fdf4', color: '#15803d' },
    'Vacant':       { bg: '#fef2f2', color: '#dc2626' },
    'Notice Given': { bg: '#fef3c7', color: '#b45309' },
    'Periodic':     { bg: '#eff6ff', color: '#1d4ed8' },
  }
  const c = cfg[s] ?? { bg: '#f4f4f5', color: '#71717a' }
  return <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: c.bg, color: c.color }}>{s}</span>
}

function PMChecklistModal({ property, onClose }: { property: PMProperty; onClose: () => void }) {
  const completedFlags = [
    true, true, true,
    true, !!property.poolComplianceDate, true, true,
    property.status !== 'Vacant', property.status !== 'Vacant', property.status !== 'Vacant',
    property.status !== 'Vacant', property.checklistPct >= 100, property.checklistPct >= 100,
    true, true,
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto"
        style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4 flex items-start justify-between" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: RE_ACCENT }}>PM Checklist</p>
            <h3 className="text-base font-black" style={{ color: '#0f172a' }}>{property.address}, {property.suburb}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-1.5 flex-1 max-w-[120px]" style={{ background: '#1e1e1e' }}>
                <div className="h-full" style={{ width: `${property.checklistPct}%`, background: RE_ACCENT }} />
              </div>
              <span className="text-xs font-black" style={{ color: RE_ACCENT }}>{property.checklistPct}%</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        {Object.entries(
          pmChecklistTemplate.reduce<Record<string, typeof pmChecklistTemplate>>((acc, item) => {
            ;(acc[item.category] = acc[item.category] ?? []).push(item)
            return acc
          }, {})
        ).map(([cat, items]) => (
          <div key={cat}>
            <div className="px-6 py-2" style={{ background: '#f8fafc' }}>
              <p className="text-[9px] font-bold uppercase tracking-[3px]" style={{ color: '#94a3b8' }}>{cat}</p>
            </div>
            {items.map((item) => {
              const globalIdx = pmChecklistTemplate.findIndex(i => i.id === item.id)
              const done = completedFlags[globalIdx] ?? false
              return (
                <div key={item.id}
                  className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-[#161616]"
                  style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                    style={{ border: `1px solid ${done ? '#22c55e' : '#2a2a2a'}`, background: done ? '#22c55e10' : 'transparent' }}>
                    {done && <CheckCircle2 size={9} style={{ color: '#22c55e' }} />}
                  </div>
                  <span className="text-xs flex-1" style={{ color: done ? '#a8a8a8' : '#f5f5f5', textDecoration: done ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                  {!done && (
                    <button className="text-[10px] font-bold px-2 py-0.5"
                      style={{ background: RE_ACCENT + '20', color: RE_ACCENT, border: `1px solid ${RE_ACCENT}40` }}>
                      Complete
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: RE_ACCENT, color: '#fff' }}>
            <Zap size={12} /> AI Auto-Complete
          </button>
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold"
            style={{ background: '#1e1e1e', color: '#64748b' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function PropertyManagementPage() {
  const [selected, setSelected] = useState<PMProperty | null>(null)
  const [showNew, setShowNew] = useState(false)

  const arrears  = pmProperties.filter(p => p.rentInArrears).length
  const vacant   = pmProperties.filter(p => p.status === 'Vacant').length
  const openMaint = pmProperties.reduce((s, p) => s + p.maintenanceOpen, 0)
  const inspDue  = pmProperties.filter(p => p.nextInspection !== '–' && new Date(p.nextInspection) <= new Date(Date.now() + 30 * 86400000)).length

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Property Management</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {pmProperties.length} managed properties &middot; NSW Residential Tenancies Act 2010
          </p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-80"
          style={{ background: RE_ACCENT, color: '#fff' }}>
          <Plus size={13} /> New Property
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Rent in Arrears',    value: arrears,   color: '#ef4444' },
          { label: 'Vacant',             value: vacant,    color: '#f59e0b' },
          { label: 'Open Maintenance',   value: openMaint, color: '#f97316' },
          { label: 'Inspections Due',    value: inspDue,   color: RE_ACCENT },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Properties table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>All Properties</h2>
          <Search size={13} style={{ color: 'var(--text-muted)' }} />
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.7fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Property</span><span>Landlord</span><span>Rent/wk</span><span>Lease End</span><span>Inspection</span><span>Checklist</span><span>Status</span>
        </div>

        {pmProperties.map((p, i) => (
          <div key={p.id}
            className="grid items-center px-5 py-3.5 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
            style={{
              gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.7fr',
              borderBottom: i < pmProperties.length - 1 ? '1px solid var(--border)' : 'none',
              borderLeft: p.rentInArrears ? '3px solid #ef4444' : '3px solid transparent',
            }}
            onClick={() => setSelected(p)}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{p.address}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{p.suburb} &middot; {p.tenant !== '–' ? p.tenant : 'Vacant'}</p>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.landlord.split(' ').slice(0, 2).join(' ')}</span>
            <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>
              ${p.weeklyRent.toLocaleString()}
              {p.rentInArrears && <AlertCircle size={10} style={{ display: 'inline', color: '#ef4444', marginLeft: 4 }} />}
            </span>
            <span className="text-[11px]" style={{ color: p.status === 'Periodic' ? '#f59e0b' : 'var(--text-muted)' }}>
              {p.leaseEnd !== '–' ? new Date(p.leaseEnd).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' }) : '–'}
            </span>
            <span className="flex items-center gap-1 text-[11px]"
              style={{ color: p.nextInspection !== '–' ? 'var(--text-muted)' : '#f59e0b' }}>
              <Calendar size={10} />
              {p.nextInspection !== '–'
                ? new Date(p.nextInspection).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
                : '–'}
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 max-w-[40px]" style={{ background: 'var(--border)' }}>
                <div className="h-full" style={{ width: `${p.checklistPct}%`, background: p.checklistPct === 100 ? '#22c55e' : RE_ACCENT }} />
              </div>
              <span className="text-[10px] font-bold"
                style={{ color: p.checklistPct === 100 ? '#22c55e' : RE_ACCENT }}>{p.checklistPct}%</span>
            </div>
            {statusBadge(p.status)}
          </div>
        ))}
      </div>

      {/* Maintenance open */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <Wrench size={13} style={{ color: '#f97316' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Open Maintenance ({openMaint})</h2>
        </div>
        {pmProperties.filter(p => p.maintenanceOpen > 0).map((p, i, arr) => (
          <div key={p.id} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div>
              <p className="text-sm" style={{ color: 'var(--text)' }}>{p.address}, {p.suburb}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Landlord: {p.landlord}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black px-2.5 py-1"
                style={{ background: '#fef3c7', color: '#b45309' }}>
                {p.maintenanceOpen} open
              </span>
              <button className="text-[10px] font-bold px-3 py-1.5 hover:opacity-80"
                style={{ background: RE_ACCENT + '20', color: RE_ACCENT }}>View</button>
            </div>
          </div>
        ))}
      </div>

      {selected && <PMChecklistModal property={selected} onClose={() => setSelected(null)} />}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: RE_ACCENT }}>New Property</p>
              <h3 className="text-base font-black" style={{ color: '#0f172a' }}>Add PM Property</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Property Address', placeholder: '12 Example Ave' },
                { label: 'Suburb',           placeholder: 'Castle Hill' },
                { label: 'Landlord Name',    placeholder: 'Full name' },
                { label: 'Weekly Rent',      placeholder: '$650' },
                { label: 'Lease Start',      placeholder: 'DD/MM/YYYY' },
                { label: 'Lease End',        placeholder: 'DD/MM/YYYY' },
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
                A 15-point compliance checklist will be auto-generated for this property.
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold hover:opacity-80"
                style={{ background: RE_ACCENT, color: '#fff' }}>
                <Plus size={12} /> Create + Checklist
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
