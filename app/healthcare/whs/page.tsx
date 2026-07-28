'use client'

import { useState } from 'react'
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import { whsItems, type WHSItem } from '@/lib/hc-mock-data'

const HC = '#10B981'

function riskColor(r: WHSItem['riskLevel']) {
  return { Critical: '#7c3aed', High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' }[r]
}

function statusBadge(s: WHSItem['status']) {
  const cfg = {
    Open:        { bg: '#fef3c7', text: '#b45309' },
    'In Progress': { bg: '#eff6ff', text: '#1d4ed8' },
    Closed:      { bg: '#f0fdf4', text: '#15803d' },
  }[s] ?? { bg: '#f4f4f5', text: '#71717a' }
  return <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: cfg.bg, color: cfg.text }}>{s}</span>
}

function typeBadge(t: WHSItem['type']) {
  const cfg = {
    Hazard:              { bg: '#fef2f2', text: '#dc2626' },
    'Risk Assessment':   { bg: '#fef3c7', text: '#b45309' },
    'Corrective Action': { bg: '#eff6ff', text: '#1d4ed8' },
    Inspection:          { bg: '#f0fdf4', text: '#15803d' },
  }[t] ?? { bg: '#f4f4f5', text: '#71717a' }
  return <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: cfg.bg, color: cfg.text }}>{t}</span>
}

export default function WHSPage() {
  const [showNew, setShowNew] = useState(false)

  const openCritical = whsItems.filter(w => w.riskLevel === 'Critical' && w.status !== 'Closed').length
  const openHigh     = whsItems.filter(w => w.riskLevel === 'High'     && w.status !== 'Closed').length
  const openTotal    = whsItems.filter(w => w.status !== 'Closed').length
  const overdue      = whsItems.filter(w => w.status !== 'Closed' && new Date(w.dueDate) < new Date()).length

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>WHS Compliance</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Work Health and Safety Act 2011 (NSW) · SafeWork NSW
          </p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-80"
          style={{ background: HC, color: '#fff' }}>
          <Plus size={13} /> Report Hazard / Risk
        </button>
      </div>

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-5 py-4" style={{ background: '#f0fdf4', border: `1px solid ${HC}30` }}>
        <ShieldCheck size={15} style={{ color: HC, flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: '#065f46' }}>
          <span className="font-bold">WHS Act 2011 — Primary Duty of Care: </span>
          Healthcare facilities have an absolute duty to ensure the health, safety and welfare of workers so far as reasonably practicable. Critical and High risks must have corrective actions initiated within 24 hours. Serious workplace injuries must be notified to SafeWork NSW immediately and within 48 hours for dangerous incidents.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical / High Open', value: openCritical + openHigh, color: '#ef4444' },
          { label: 'Total Open Items',     value: openTotal,               color: '#f59e0b' },
          { label: 'Overdue Actions',      value: overdue,                 color: overdue > 0 ? '#ef4444' : '#22c55e' },
          { label: 'Closed This Month',    value: whsItems.filter(w => w.status === 'Closed').length, color: HC },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Risk register table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>WHS Risk Register</h2>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '2fr 0.8fr 0.8fr 0.7fr 1fr 0.7fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Item</span><span>Type</span><span>Area</span><span>Risk</span><span>Assigned</span><span>Status</span>
        </div>

        {whsItems.map((w, i) => {
          const col = riskColor(w.riskLevel)
          const isOverdue = w.status !== 'Closed' && new Date(w.dueDate) < new Date()
          return (
            <div key={w.id}
              className="grid items-center px-5 py-3.5 hover:bg-[var(--bg-hover)]"
              style={{
                gridTemplateColumns: '2fr 0.8fr 0.8fr 0.7fr 1fr 0.7fr',
                borderBottom: i < whsItems.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: `3px solid ${col}`,
              }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{w.title}</p>
                <p className="text-[10px]" style={{ color: isOverdue ? '#ef4444' : 'var(--text-muted)' }}>
                  {isOverdue ? 'OVERDUE — ' : ''}Due: {new Date(w.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              {typeBadge(w.type)}
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{w.area}</span>
              <span className="text-[10px] font-black" style={{ color: col }}>{w.riskLevel}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{w.assignedTo}</span>
              {statusBadge(w.status)}
            </div>
          )
        })}
      </div>

      {/* Incident stats panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>YTD WHS Statistics</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[
              { label: 'Notifiable incidents to SafeWork NSW', value: 1, color: '#ef4444'  },
              { label: 'Lost-time injuries',                   value: 2, color: '#f59e0b'  },
              { label: 'Needlestick injuries',                 value: 3, color: '#f97316'  },
              { label: 'Manual handling incidents',            value: 5, color: '#f59e0b'  },
              { label: 'Workers compensation claims',          value: 2, color: '#ef4444'  },
              { label: 'Near miss reports',                    value: 8, color: HC         },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span className="text-sm font-black" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Mandatory Inspections</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[
              { label: 'Annual fire safety inspection',          due: '2025-08-01', done: false },
              { label: 'Lift & plant registration',             due: '2025-10-15', done: false },
              { label: 'Electrical safety compliance',          due: '2025-09-01', done: false },
              { label: 'Quarterly WHS committee meeting',       due: '2025-06-30', done: false },
              { label: 'Annual hazardous substances register',  due: '2025-12-31', done: true  },
              { label: 'Radiation safety assessment',           due: '2025-11-01', done: false },
            ].map(({ label, due, done }) => (
              <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                  {done ? <CheckCircle2 size={11} style={{ color: HC }} /> : <AlertCircle size={11} style={{ color: '#f59e0b' }} />}
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                </div>
                <span className="text-[11px] font-bold" style={{ color: done ? HC : '#f59e0b' }}>
                  {done ? 'Done' : new Date(due).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: HC }}>New Report</p>
              <h3 className="text-base font-black" style={{ color: '#0f172a' }}>Report Hazard / Risk</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Title / Description',  placeholder: 'Brief description' },
                { label: 'Location / Area',       placeholder: 'Ward, department or location' },
                { label: 'Type',                  placeholder: 'Hazard / Risk Assessment / Corrective Action' },
                { label: 'Assigned To',           placeholder: 'Name or department' },
                { label: 'Due Date',              placeholder: 'DD/MM/YYYY' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <input placeholder={placeholder} className="w-full px-3 py-2.5 text-sm"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none' }} />
                </div>
              ))}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Risk Level</p>
                <div className="flex gap-2">
                  {(['Critical', 'High', 'Medium', 'Low'] as WHSItem['riskLevel'][]).map(r => (
                    <button key={r} className="text-[10px] font-bold px-3 py-1.5"
                      style={{ background: riskColor(r) + '20', color: riskColor(r), border: `1px solid ${riskColor(r)}40` }}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold hover:opacity-80"
                style={{ background: HC, color: '#fff' }}>
                <AlertTriangle size={12} /> Submit Report
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
