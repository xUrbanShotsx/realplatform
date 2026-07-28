'use client'

import { useState } from 'react'
import {
  AlertTriangle, XCircle, AlertCircle, CheckCircle2, Clock,
  Plus, Shield, FileText, ChevronDown,
} from 'lucide-react'
import { clinicalIncidents, type ClinicalIncident } from '@/lib/hc-mock-data'

const HC = '#10B981'

function severityConfig(s: ClinicalIncident['severity']) {
  return {
    Sentinel:    { color: '#7c3aed', bg: '#4c1d95', label: 'Sentinel Event', priority: 5 },
    Serious:     { color: '#ef4444', bg: '#fef2f2', label: 'Serious',        priority: 4 },
    Moderate:    { color: '#f59e0b', bg: '#fef3c7', label: 'Moderate',       priority: 3 },
    Minor:       { color: '#3b82f6', bg: '#eff6ff', label: 'Minor',          priority: 2 },
    'Near Miss': { color: '#22c55e', bg: '#f0fdf4', label: 'Near Miss',      priority: 1 },
  }[s] ?? { color: '#9ca3af', bg: '#f9fafb', label: s, priority: 0 }
}

function statusBadge(s: ClinicalIncident['status']) {
  const cfg = {
    Open:                 { bg: '#fef3c7', text: '#b45309' },
    'Under Investigation':{ bg: '#eff6ff', text: '#1d4ed8' },
    Closed:               { bg: '#f0fdf4', text: '#15803d' },
    Escalated:            { bg: '#1f0a0a', text: '#f87171' },
  }[s] ?? { bg: '#f4f4f5', text: '#71717a' }
  return <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: cfg.bg, color: cfg.text }}>{s}</span>
}

function IncidentModal({ inc, onClose }: { inc: ClinicalIncident; onClose: () => void }) {
  const sev = severityConfig(inc.severity)
  const isSentinel = inc.severity === 'Sentinel'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0', borderLeft: `3px solid ${sev.color}` }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black px-2 py-0.5 uppercase tracking-widest"
                  style={{ background: sev.color, color: '#fff' }}>{sev.label}</span>
                {statusBadge(inc.status)}
              </div>
              <h3 className="text-base font-black mt-2" style={{ color: '#0f172a' }}>{inc.title}</h3>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{inc.id} · {inc.department} · {new Date(inc.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
        </div>

        {isSentinel && (
          <div className="px-6 py-3" style={{ background: '#f5f3ff', borderBottom: '1px solid #7c3aed40' }}>
            <p className="text-xs font-bold" style={{ color: '#7c3aed' }}>
              ⚠ Sentinel Event — mandatory notification to ACSQHC within 14 days and NSW Health within 24 hrs. Immediate root cause analysis required.
            </p>
          </div>
        )}

        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-bold uppercase tracking-[3px]" style={{ color: '#94a3b8' }}>Incident Details</p>
          {[
            { label: 'Category',        value: inc.category     },
            { label: 'Department',      value: inc.department   },
            { label: 'Reported By',     value: inc.reportedBy   },
            { label: 'Date',            value: new Date(inc.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Corrective Action Due', value: new Date(inc.correctiveActionDue).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }), warn: true },
          ].map(({ label, value, warn }) => (
            <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <span className="text-[11px]" style={{ color: '#94a3b8' }}>{label}</span>
              <span className="text-xs font-bold" style={{ color: warn ? '#f59e0b' : '#f5f5f5' }}>{value}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-bold uppercase tracking-[3px] mb-3" style={{ color: '#94a3b8' }}>Required Actions</p>
          {[
            { label: 'Root Cause Analysis completed',       done: inc.rootCauseCompleted },
            { label: 'Corrective action plan in place',     done: inc.status !== 'Open'  },
            { label: 'Notified AHPRA (if practitioner involved)', done: inc.notifiedToAHPRA },
            { label: 'Notified CEEC / Health Complaints Entity', done: inc.notifiedToCEEC  },
            { label: 'Reported to NSW Health (sentinel)',   done: !isSentinel || inc.status === 'Closed' },
            { label: 'Staff debrief conducted',             done: inc.status === 'Closed' },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                style={{ border: `1px solid ${done ? HC : '#2a2a2a'}`, background: done ? HC + '20' : 'transparent' }}>
                {done && <CheckCircle2 size={9} style={{ color: HC }} />}
              </div>
              <span className="text-xs" style={{ color: done ? '#a8a8a8' : '#f5f5f5' }}>{label}</span>
              {!done && (
                <button className="ml-auto text-[10px] font-bold px-2 py-0.5"
                  style={{ background: HC + '20', color: HC, border: `1px solid ${HC}40` }}>Action</button>
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-4 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: HC, color: '#fff' }}><FileText size={12} /> Update Report</button>
          {isSentinel && (
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
              style={{ background: '#7c3aed', color: '#fff' }}><Shield size={12} /> Notify ACSQHC</button>
          )}
          <button onClick={onClose} className="px-3 py-2 text-xs" style={{ color: '#94a3b8', background: 'none' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function IncidentsPage() {
  const [selected, setSelected] = useState<ClinicalIncident | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [sevFilter, setSevFilter] = useState('All')

  const sevLevels = ['All', 'Sentinel', 'Serious', 'Moderate', 'Minor', 'Near Miss']
  const sorted = [...clinicalIncidents].sort((a, b) => severityConfig(b.severity).priority - severityConfig(a.severity).priority)
  const filtered = sevFilter === 'All' ? sorted : sorted.filter(i => i.severity === sevFilter)

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Clinical Incident Reporting</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            NSW Health Open Disclosure Framework · ACSQHC Sentinel Event Program
          </p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-80"
          style={{ background: '#ef4444', color: '#fff' }}>
          <Plus size={13} /> Report Incident
        </button>
      </div>

      {/* Sentinel alert */}
      {clinicalIncidents.some(i => i.severity === 'Sentinel') && (
        <div className="flex items-start gap-3 px-5 py-4" style={{ background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
          <AlertTriangle size={15} style={{ color: '#6d28d9', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-xs font-bold mb-0.5" style={{ color: '#7c3aed' }}>Sentinel Event Active — Mandatory Notification Required</p>
            <p className="text-[11px]" style={{ color: '#6d28d9' }}>
              You have 1 sentinel event requiring notification to ACSQHC within 14 days and NSW Health within 24 hours. Root cause analysis must be completed within 70 days.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {['Sentinel', 'Serious', 'Moderate', 'Minor', 'Near Miss'].map(sev => {
          const cfg = severityConfig(sev as ClinicalIncident['severity'])
          const count = clinicalIncidents.filter(i => i.severity === sev).length
          return (
            <div key={sev} className="px-4 py-4"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${cfg.color}` }}>
              <p className="text-3xl font-black" style={{ color: cfg.color }}>{count}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{sev}</p>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-1 flex-wrap">
            {sevLevels.map(s => (
              <button key={s} onClick={() => setSevFilter(s)}
                className="px-3 py-1.5 text-xs font-bold"
                style={sevFilter === s ? { background: HC, color: '#fff' } : { color: 'var(--text-muted)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '0.5fr 2fr 0.8fr 0.8fr 0.8fr 0.7fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>ID</span><span>Title</span><span>Category</span><span>Dept</span><span>Severity</span><span>Date</span><span>Status</span>
        </div>

        {filtered.map((inc, i) => {
          const cfg = severityConfig(inc.severity)
          return (
            <div key={inc.id}
              className="grid items-center px-5 py-3.5 cursor-pointer hover:bg-[var(--bg-hover)]"
              style={{
                gridTemplateColumns: '0.5fr 2fr 0.8fr 0.8fr 0.8fr 0.7fr 0.8fr',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: `3px solid ${cfg.color}`,
              }}
              onClick={() => setSelected(inc)}>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{inc.id}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{inc.title}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{inc.reportedBy}</p>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{inc.category}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{inc.department}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 self-center"
                style={{ background: cfg.color + '20', color: cfg.color }}>{inc.severity}</span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {new Date(inc.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              </span>
              {statusBadge(inc.status)}
            </div>
          )
        })}
      </div>

      {selected && <IncidentModal inc={selected} onClose={() => setSelected(null)} />}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0', borderLeft: '3px solid #ef4444' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#ef4444' }}>New Report</p>
              <h3 className="text-base font-black" style={{ color: '#0f172a' }}>Clinical Incident Report</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Incident Title',   placeholder: 'Brief description of what happened' },
                { label: 'Date & Time',      placeholder: 'DD/MM/YYYY HH:MM' },
                { label: 'Department',       placeholder: 'Where did this occur?' },
                { label: 'Category',         placeholder: 'Medication / Fall / Infection / etc.' },
                { label: 'Reported By',      placeholder: 'Your name and role' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <input placeholder={placeholder} className="w-full px-3 py-2.5 text-sm"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none' }} />
                </div>
              ))}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Severity</p>
                <div className="flex gap-2 flex-wrap">
                  {['Sentinel', 'Serious', 'Moderate', 'Minor', 'Near Miss'].map(s => {
                    const cfg = severityConfig(s as ClinicalIncident['severity'])
                    return (
                      <button key={s} className="text-[10px] font-bold px-3 py-1.5"
                        style={{ background: cfg.color + '20', color: cfg.color, border: `1px solid ${cfg.color}40` }}>{s}</button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold hover:opacity-80"
                style={{ background: '#ef4444', color: '#fff' }}>
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
