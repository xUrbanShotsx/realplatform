'use client'

import { useState } from 'react'
import {
  CheckCircle2, XCircle, AlertCircle, Clock, Plus, Search,
  RefreshCw, Shield, Award, UserCheck, Activity,
} from 'lucide-react'
import { practitioners, type Practitioner } from '@/lib/hc-mock-data'

const HC = '#10B981'

function ahpraBadge(s: Practitioner['ahpraStatus']) {
  const cfg = {
    Current:      { bg: '#f0fdf4', text: '#15803d', icon: CheckCircle2 },
    'Expiring Soon': { bg: '#fef3c7', text: '#b45309', icon: AlertCircle },
    Expired:      { bg: '#fef2f2', text: '#dc2626', icon: XCircle      },
    Suspended:    { bg: '#1f0a0a', text: '#f87171', icon: XCircle      },
    Provisional:  { bg: '#eff6ff', text: '#1d4ed8', icon: Clock        },
  }[s] ?? { bg: '#f4f4f5', text: '#71717a', icon: Clock }
  const Icon = cfg.icon
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5"
      style={{ background: cfg.bg, color: cfg.text }}><Icon size={9} />{s}</span>
  )
}

function PractitionerModal({ p, onClose }: { p: Practitioner; onClose: () => void }) {
  const daysToExpiry = Math.ceil((new Date(p.registrationExpiry).getTime() - Date.now()) / 86400000)
  const indDays = p.indemnityExpiry !== '–' ? Math.ceil((new Date(p.indemnityExpiry).getTime() - Date.now()) / 86400000) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0', borderLeft: `3px solid ${p.ahpraStatus === 'Suspended' ? '#ef4444' : p.ahpraStatus === 'Expiring Soon' ? '#f59e0b' : HC}` }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: HC }}>{p.profession}</p>
              <h3 className="text-xl font-black" style={{ color: '#0f172a' }}>{p.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{p.role} · {p.department}</p>
              <div className="flex items-center gap-2 mt-2">{ahpraBadge(p.ahpraStatus)}</div>
            </div>
            <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
        </div>

        {p.ahpraStatus === 'Suspended' && (
          <div className="px-6 py-3 flex items-center gap-2" style={{ background: '#fef2f2', borderBottom: '1px solid #ef444430' }}>
            <XCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p className="text-xs font-bold" style={{ color: '#991b1b' }}>
              SUSPENDED — This practitioner must not provide clinical services. Remove from all rosters immediately.
            </p>
          </div>
        )}

        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-bold uppercase tracking-[3px] mb-2" style={{ color: '#94a3b8' }}>AHPRA Registration</p>
          {[
            { label: 'AHPRA Number',   value: p.ahpraNo },
            { label: 'Registration Expiry', value: new Date(p.registrationExpiry).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }), warn: daysToExpiry <= 90 },
            { label: 'Days to Expiry', value: daysToExpiry > 0 ? `${daysToExpiry} days` : 'EXPIRED', warn: daysToExpiry <= 90 },
          ].map(({ label, value, warn }) => (
            <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <span className="text-[11px]" style={{ color: '#94a3b8' }}>{label}</span>
              <span className="text-xs font-bold" style={{ color: warn ? '#f59e0b' : '#f5f5f5' }}>{value}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-bold uppercase tracking-[3px] mb-2" style={{ color: '#94a3b8' }}>Credentialling & Privileges</p>
          {p.credentialledFor.length === 0
            ? <p className="text-xs" style={{ color: '#ef4444' }}>No active clinical privileges</p>
            : p.credentialledFor.map(c => (
              <div key={c} className="flex items-center gap-2">
                <CheckCircle2 size={11} style={{ color: HC }} />
                <span className="text-xs" style={{ color: '#0f172a' }}>{c}</span>
              </div>
            ))
          }
        </div>

        <div className="px-6 py-4 space-y-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-bold uppercase tracking-[3px] mb-2" style={{ color: '#94a3b8' }}>Compliance Checks</p>
          {[
            { label: 'Professional Indemnity Insurance',  done: p.indemnityExpiry !== '–', warn: indDays !== null && indDays <= 60, detail: p.indemnityInsurer },
            { label: 'Working With Children Check',       done: p.workingWithChildrenCheck, warn: false, detail: p.wwccExpiry !== '–' ? `Exp: ${new Date(p.wwccExpiry).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}` : '' },
            { label: 'Vaccination Compliance',            done: p.vaccineCompliant, warn: !p.vaccineCompliant, detail: p.vaccineCompliant ? 'All required vaccines recorded' : 'Missing vaccines — action required' },
            { label: 'Mandatory Training',                done: p.mandatoryTrainingPct >= 80, warn: p.mandatoryTrainingPct < 80, detail: `${p.mandatoryTrainingPct}% complete` },
          ].map(({ label, done, warn, detail }) => (
            <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div className="flex items-center gap-2">
                {done && !warn
                  ? <CheckCircle2 size={12} style={{ color: HC }} />
                  : warn
                  ? <AlertCircle size={12} style={{ color: '#f59e0b' }} />
                  : <XCircle size={12} style={{ color: '#ef4444' }} />}
                <span className="text-xs" style={{ color: '#0f172a' }}>{label}</span>
              </div>
              <span className="text-[10px]" style={{ color: done ? '#5a5a5f' : '#f59e0b' }}>{detail}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: HC, color: '#fff' }}><RefreshCw size={12} /> Renew Registration</button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:opacity-80"
            style={{ background: '#1e1e1e', color: '#64748b' }}><Award size={12} /> Update Privileges</button>
          <button onClick={onClose} className="px-3 py-2 text-xs" style={{ color: '#94a3b8', background: 'none' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function PractitionersPage() {
  const [selected, setSelected] = useState<Practitioner | null>(null)
  const [deptFilter, setDeptFilter] = useState('All')

  const depts   = ['All', ...Array.from(new Set(practitioners.map(p => p.department)))]
  const filtered = deptFilter === 'All' ? practitioners : practitioners.filter(p => p.department === deptFilter)

  const suspended = practitioners.filter(p => p.ahpraStatus === 'Suspended').length
  const expiring  = practitioners.filter(p => p.ahpraStatus === 'Expiring Soon').length
  const nonVax    = practitioners.filter(p => !p.vaccineCompliant).length
  const lowTraining = practitioners.filter(p => p.mandatoryTrainingPct < 80).length

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>AHPRA Register & Credentialling</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {practitioners.length} practitioners · Health Practitioner Regulation National Law Act 2009
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-70"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <Search size={12} /> Verify AHPRA
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-80"
            style={{ background: HC, color: '#fff' }}>
            <Plus size={12} /> Add Practitioner
          </button>
        </div>
      </div>

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-5 py-4" style={{ background: '#f0fdf4', border: `1px solid ${HC}30` }}>
        <Shield size={15} style={{ color: HC, flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: '#065f46' }}>
          <span className="font-bold">Regulatory obligation: </span>
          Facilities must verify AHPRA registration before engaging any health practitioner and at least annually thereafter. Employing a suspended or unregistered practitioner is a criminal offence under the National Law. Credentialling must be reviewed every 3 years or after any adverse event.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active / Current',  value: practitioners.filter(p => p.ahpraStatus === 'Current').length,  color: HC         },
          { label: 'Suspended',         value: suspended,  color: '#ef4444' },
          { label: 'Expiring ≤ 90 days',value: expiring,   color: '#f59e0b' },
          { label: 'Vaccine Non-Comp.',  value: nonVax,    color: '#f97316' },
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
          <div className="flex items-center gap-1 flex-wrap">
            {depts.map(d => (
              <button key={d} onClick={() => setDeptFilter(d)}
                className="px-3 py-1.5 text-xs font-bold"
                style={deptFilter === d ? { background: HC, color: '#fff' } : { color: 'var(--text-muted)' }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '1.5fr 0.8fr 1fr 0.8fr 0.7fr 0.7fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Practitioner</span><span>AHPRA No.</span><span>Profession</span><span>Expiry</span><span>Vaccine</span><span>Training</span><span>Status</span>
        </div>

        {filtered.map((p, i) => (
          <div key={p.id}
            className="grid items-center px-5 py-3.5 cursor-pointer hover:bg-[var(--bg-hover)]"
            style={{
              gridTemplateColumns: '1.5fr 0.8fr 1fr 0.8fr 0.7fr 0.7fr 0.8fr',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              borderLeft: p.ahpraStatus === 'Suspended' ? '3px solid #ef4444' : p.ahpraStatus === 'Expiring Soon' ? '3px solid #f59e0b' : '3px solid transparent',
            }}
            onClick={() => setSelected(p)}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{p.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{p.role} · {p.department}</p>
            </div>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{p.ahpraNo.slice(-8)}</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.profession}</span>
            <div>
              <p className="text-[11px]" style={{ color: new Date(p.registrationExpiry) < new Date(Date.now() + 90*86400000) ? '#f59e0b' : 'var(--text-muted)' }}>
                {new Date(p.registrationExpiry).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {p.vaccineCompliant
                ? <CheckCircle2 size={12} style={{ color: HC }} />
                : <XCircle size={12} style={{ color: '#ef4444' }} />}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-10 h-1.5" style={{ background: 'var(--border)' }}>
                <div className="h-full" style={{ width: `${p.mandatoryTrainingPct}%`, background: p.mandatoryTrainingPct >= 80 ? HC : '#ef4444' }} />
              </div>
              <span className="text-[9px] font-bold" style={{ color: p.mandatoryTrainingPct >= 80 ? HC : '#ef4444' }}>{p.mandatoryTrainingPct}%</span>
            </div>
            {ahpraBadge(p.ahpraStatus)}
          </div>
        ))}
      </div>

      {selected && <PractitionerModal p={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
