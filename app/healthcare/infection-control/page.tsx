import {
  TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react'
import { infectionMetrics, vaccinationRecords } from '@/lib/hc-mock-data'

const HC = '#10B981'

export default function InfectionControlPage() {
  const vaccines = ['influenza', 'covid19', 'hepatitisB', 'mmr', 'varicella', 'pertussis'] as const
  const vaccineLabels: Record<typeof vaccines[number], string> = {
    influenza: 'Influenza', covid19: 'COVID-19', hepatitisB: 'Hep B',
    mmr: 'MMR', varicella: 'Varicella', pertussis: 'Pertussis',
  }

  const compliantCount = vaccinationRecords.filter(r => r.compliant).length

  const handHygieneAudits = [
    { dept: 'ICU',              compliance: 94, audited: 120, target: 90 },
    { dept: 'Surgical Ward',    compliance: 88, audited: 95,  target: 90 },
    { dept: 'Emergency',        compliance: 82, audited: 110, target: 90 },
    { dept: 'Operating Theatre',compliance: 97, audited: 60,  target: 90 },
    { dept: 'Medical Ward',     compliance: 79, audited: 105, target: 90 },
    { dept: 'Allied Health',    compliance: 91, audited: 45,  target: 90 },
  ]

  const isolationRooms = [
    { room: 'Room 12 – Ward 3',    pathogen: 'C. difficile',  since: '2025-06-08', status: 'Active'   },
    { room: 'Room 7 – Medical',    pathogen: 'MRSA (wound)',  since: '2025-06-10', status: 'Active'   },
    { room: 'Room 21 – ICU',       pathogen: 'VRE',           since: '2025-06-01', status: 'Cleared'  },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Infection Prevention & Control</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          NSQHS Standard 3 · Australian Commission on Safety and Quality in Health Care
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        {infectionMetrics.map(m => {
          const onTarget = m.higherIsBetter ? m.value >= m.target : m.value <= m.target
          const col = onTarget ? '#22c55e' : m.higherIsBetter ? '#ef4444' : '#f59e0b'
          const TrendIcon = m.trend === 'up' ? TrendingUp : m.trend === 'down' ? TrendingDown : Minus
          const trendColor = (m.higherIsBetter && m.trend === 'up') || (!m.higherIsBetter && m.trend === 'down')
            ? '#22c55e' : m.trend === 'stable' ? '#a8a8a8' : '#ef4444'
          return (
            <div key={m.label} className="px-5 py-5"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${col}` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black" style={{ color: col }}>{m.value}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{m.unit}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span style={{ color: 'var(--text-muted)' }}>Target: {m.target}{m.unit}</span>
                <span className="flex items-center gap-1 font-bold" style={{ color: trendColor }}>
                  <TrendIcon size={10} /> {m.trend}
                </span>
              </div>
              <div className="mt-2 h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full" style={{ background: col, width: onTarget ? '100%' : m.higherIsBetter ? `${(m.value / m.target) * 100}%` : `${Math.min((m.target / Math.max(m.value, 0.1)) * 100, 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Hand Hygiene by Department */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="w-1.5 h-4" style={{ background: HC }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Hand Hygiene by Department</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            {handHygieneAudits.map(a => {
              const met = a.compliance >= a.target
              const col = met ? '#22c55e' : a.compliance >= 85 ? '#f59e0b' : '#ef4444'
              return (
                <div key={a.dept}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.dept}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>n={a.audited}</span>
                      <span className="text-xs font-black" style={{ color: col }}>{a.compliance}%</span>
                      {met
                        ? <CheckCircle2 size={11} style={{ color: '#22c55e' }} />
                        : <AlertCircle size={11} style={{ color: col }} />}
                    </div>
                  </div>
                  <div className="h-2" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full" style={{ width: `${a.compliance}%`, background: col }} />
                  </div>
                </div>
              )
            })}
            <div className="pt-3 flex items-center justify-between text-[11px]" style={{ borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>National target</span>
              <span className="font-bold" style={{ color: HC }}>≥ 90%</span>
            </div>
          </div>
        </div>

        {/* Isolation Rooms */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="w-1.5 h-4" style={{ background: '#f59e0b' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Active Isolation Rooms</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {isolationRooms.map(r => (
              <div key={r.room} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{r.room}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {r.pathogen} · Since {new Date(r.since).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5"
                  style={r.status === 'Active'
                    ? { background: '#fef2f2', color: '#dc2626' }
                    : { background: '#f0fdf4', color: '#15803d' }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Notifiable Conditions (YTD)
            </p>
            {[
              { condition: 'Influenza',          cases: 4, notified: true  },
              { condition: 'Gastroenteritis outbreak', cases: 1, notified: true  },
              { condition: 'COVID-19 cluster',   cases: 2, notified: true  },
            ].map(c => (
              <div key={c.condition} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.condition}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{c.cases}</span>
                  {c.notified
                    ? <span className="text-[9px] px-1.5 py-0.5 font-bold" style={{ background: '#f0fdf4', color: '#15803d' }}>Notified</span>
                    : <span className="text-[9px] px-1.5 py-0.5 font-bold" style={{ background: '#fef2f2', color: '#dc2626' }}>Required</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vaccination compliance table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-4" style={{ background: '#3b82f6' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
              Staff Vaccination Compliance — {compliantCount}/{vaccinationRecords.length} fully compliant
            </h2>
          </div>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '1.5fr repeat(6, 0.6fr) 0.7fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Staff Member</span>
          {vaccines.map(v => <span key={v}>{vaccineLabels[v]}</span>)}
          <span>Compliant</span>
        </div>

        {vaccinationRecords.map((r, i) => (
          <div key={r.id}
            className="grid items-center px-5 py-3 hover:bg-[var(--bg-hover)]"
            style={{
              gridTemplateColumns: '1.5fr repeat(6, 0.6fr) 0.7fr',
              borderBottom: i < vaccinationRecords.length - 1 ? '1px solid var(--border)' : 'none',
              borderLeft: r.compliant ? '3px solid transparent' : '3px solid #ef4444',
            }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{r.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.role}</p>
            </div>
            {vaccines.map(v => (
              <div key={v} className="flex items-center justify-center">
                {r[v]
                  ? <CheckCircle2 size={12} style={{ color: HC }} />
                  : <XCircle size={12} style={{ color: '#ef4444' }} />}
              </div>
            ))}
            <div className="flex items-center">
              {r.compliant
                ? <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: '#f0fdf4', color: '#15803d' }}>Yes</span>
                : <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: '#fef2f2', color: '#dc2626' }}>No</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
