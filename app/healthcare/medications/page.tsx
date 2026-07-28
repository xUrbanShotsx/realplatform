'use client'

import { useState } from 'react'
import {
  Pill, AlertTriangle, CheckCircle2, XCircle, AlertCircle,
  Plus, Shield, FileText, RefreshCw,
} from 'lucide-react'
import { medicationIncidents, s8Register, type MedicationIncident } from '@/lib/hc-mock-data'

const HC = '#10B981'

function sevColor(s: string) {
  if (s === 'Serious') return '#ef4444'
  if (s === 'Moderate') return '#f59e0b'
  if (s === 'Near Miss') return '#22c55e'
  return '#3b82f6'
}

function IncidentModal({ inc, onClose }: { inc: MedicationIncident; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-md" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0', borderLeft: `3px solid ${sevColor(inc.severity)}` }}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] font-black px-2 py-0.5 uppercase"
                style={{ background: sevColor(inc.severity) + '20', color: sevColor(inc.severity) }}>{inc.severity}</span>
              <h3 className="text-base font-black mt-2" style={{ color: '#0f172a' }}>{inc.type} — {inc.drug}</h3>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{inc.id} · {inc.department}</p>
            </div>
            <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
        </div>
        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
          {[
            { label: 'Date',        value: new Date(inc.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Incident Type', value: inc.type       },
            { label: 'Drug',        value: inc.drug         },
            { label: 'Department',  value: inc.department   },
            { label: 'Outcome',     value: inc.outcome      },
            { label: 'Status',      value: inc.status       },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <span className="text-[11px]" style={{ color: '#94a3b8' }}>{label}</span>
              <span className="text-xs font-medium" style={{ color: '#0f172a' }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-bold uppercase tracking-[3px] mb-3" style={{ color: '#94a3b8' }}>Required Actions</p>
          {[
            { label: 'Incident report filed in safety system', done: inc.status !== 'Open' },
            { label: 'Pharmacist review completed',            done: inc.status === 'Closed' },
            { label: 'Root cause identified',                  done: inc.status === 'Closed' },
            { label: 'Notify TGA if serious (S8 drugs)',       done: inc.severity !== 'Serious' || inc.status === 'Closed' },
            { label: 'Education delivered to relevant staff',  done: inc.status === 'Closed' },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                style={{ border: `1px solid ${done ? HC : '#2a2a2a'}`, background: done ? HC + '20' : 'transparent' }}>
                {done && <CheckCircle2 size={9} style={{ color: HC }} />}
              </div>
              <span className="text-xs" style={{ color: done ? '#a8a8a8' : '#f5f5f5' }}>{label}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: HC, color: '#fff' }}><FileText size={12} /> Update Report</button>
          <button onClick={onClose} className="px-3 py-2 text-xs" style={{ color: '#94a3b8', background: 'none' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function MedicationsPage() {
  const [selected, setSelected] = useState<MedicationIncident | null>(null)
  const [showRecount, setShowRecount] = useState(false)

  const discrepancies = s8Register.filter(r => r.discrepancy).length

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Medication Safety</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          TGA Schedule 8 Register · NSQHS Standard 4 · NSW Poisons and Therapeutic Goods Act 1966
        </p>
      </div>

      {/* S8 discrepancy alert */}
      {discrepancies > 0 && (
        <div className="flex items-start gap-3 px-5 py-4" style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
          <AlertTriangle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1">
            <p className="text-xs font-bold mb-0.5" style={{ color: '#991b1b' }}>
              S8 Drug Discrepancy — Immediate Action Required
            </p>
            <p className="text-[11px]" style={{ color: '#dc2626' }}>
              {discrepancies} discrepancy recorded in the Schedule 8 register. A dual-nurse recount must be performed immediately and an incident report submitted. Failure to report within 24 hours is a breach of the Poisons Act.
            </p>
          </div>
          <button onClick={() => setShowRecount(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold flex-shrink-0 hover:opacity-80"
            style={{ background: '#ef4444', color: '#fff' }}>
            <RefreshCw size={10} /> Recount
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Medication Incidents', value: medicationIncidents.length, color: '#f59e0b'  },
          { label: 'Serious Incidents',    value: medicationIncidents.filter(m => m.severity === 'Serious').length, color: '#ef4444' },
          { label: 'S8 Discrepancies',     value: discrepancies,              color: discrepancies > 0 ? '#ef4444' : HC },
          { label: 'Open Reviews',         value: medicationIncidents.filter(m => m.status === 'Open').length,     color: '#f97316' },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* S8 Register */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <Shield size={14} style={{ color: HC }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Schedule 8 Drug Register</h2>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold hover:opacity-80"
            style={{ background: HC + '20', color: HC, border: `1px solid ${HC}40` }}>
            <Plus size={10} /> Add Entry
          </button>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '2fr 0.5fr 0.8fr 0.5fr 1fr 1fr 0.7fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Drug</span><span>Sched.</span><span>Location</span><span>Balance</span><span>Last Count</span><span>Count By</span><span>Status</span>
        </div>

        {s8Register.map((r, i) => (
          <div key={r.id}
            className="grid items-center px-5 py-3.5 hover:bg-[var(--bg-hover)]"
            style={{
              gridTemplateColumns: '2fr 0.5fr 0.8fr 0.5fr 1fr 1fr 0.7fr',
              borderBottom: i < s8Register.length - 1 ? '1px solid var(--border)' : 'none',
              borderLeft: r.discrepancy ? '3px solid #ef4444' : '3px solid transparent',
            }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{r.drug}</p>
            <span className="text-[10px] font-black px-1.5 py-0.5 self-center"
              style={{ background: '#f5f3ff', color: '#7c3aed' }}>{r.schedule}</span>
            <span className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{r.location.split(' ')[0]}</span>
            <span className="text-sm font-black" style={{ color: r.discrepancy ? '#ef4444' : 'var(--text)' }}>
              {r.currentBalance}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {new Date(r.lastCount).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{r.lastCountBy.split(' ').slice(-1)}</span>
            {r.discrepancy
              ? <span className="flex items-center gap-1 text-[10px] font-black" style={{ color: '#ef4444' }}>
                  <XCircle size={10} /> Discrepancy
                </span>
              : <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: HC }}>
                  <CheckCircle2 size={10} /> OK
                </span>}
          </div>
        ))}
      </div>

      {/* Medication incidents */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <AlertCircle size={14} style={{ color: '#f59e0b' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Medication Incidents</h2>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold hover:opacity-80"
            style={{ background: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>
            <Plus size={10} /> Report Incident
          </button>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '0.5fr 1fr 1.5fr 1fr 1fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Date</span><span>Type</span><span>Drug</span><span>Outcome</span><span>Department</span><span>Status</span>
        </div>

        {medicationIncidents.map((m, i) => (
          <div key={m.id}
            className="grid items-center px-5 py-3.5 cursor-pointer hover:bg-[var(--bg-hover)]"
            style={{
              gridTemplateColumns: '0.5fr 1fr 1.5fr 1fr 1fr 0.8fr',
              borderBottom: i < medicationIncidents.length - 1 ? '1px solid var(--border)' : 'none',
              borderLeft: `3px solid ${sevColor(m.severity)}`,
            }}
            onClick={() => setSelected(m)}>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {new Date(m.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 self-center"
              style={{ background: sevColor(m.severity) + '20', color: sevColor(m.severity) }}>{m.type}</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{m.drug}</span>
            <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{m.outcome}</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.department}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 self-center"
              style={{
                background: m.status === 'Closed' ? '#f0fdf4' : m.status === 'Reviewed' ? '#eff6ff' : '#fef3c7',
                color:      m.status === 'Closed' ? '#15803d' : m.status === 'Reviewed' ? '#1d4ed8' : '#b45309',
              }}>{m.status}</span>
          </div>
        ))}
      </div>

      {selected && <IncidentModal inc={selected} onClose={() => setSelected(null)} />}

      {showRecount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setShowRecount(false)}>
          <div className="w-full max-w-md" style={{ background: '#fff', border: '1px solid #fca5a5' }}
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0', borderLeft: '3px solid #ef4444' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#ef4444' }}>S8 Recount</p>
              <h3 className="text-base font-black" style={{ color: '#0f172a' }}>Oxycodone 5mg — Surgical Ward</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="p-3" style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
                <p className="text-xs" style={{ color: '#991b1b' }}>A second authorised nurse must witness and countersign this recount. Both signatures are legally required under the Poisons and Therapeutic Goods Regulation 2008.</p>
              </div>
              {[
                { label: 'Counted By (Nurse 1)', placeholder: 'Full name + Registration No.' },
                { label: 'Witnessed By (Nurse 2)', placeholder: 'Full name + Registration No.' },
                { label: 'Physical Count', placeholder: 'Number of tablets' },
                { label: 'Reason for Discrepancy', placeholder: 'If known…' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <input placeholder={placeholder} className="w-full px-3 py-2.5 text-sm"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none' }} />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold hover:opacity-80"
                style={{ background: '#ef4444', color: '#fff' }}>
                <Shield size={12} /> Submit Recount + Incident Report
              </button>
              <button onClick={() => setShowRecount(false)} className="px-4 py-2.5 text-xs font-bold"
                style={{ background: '#1e1e1e', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
