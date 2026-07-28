import { BookOpen, AlertCircle, CheckCircle2, Clock, Users } from 'lucide-react'
import { trainingModules } from '@/lib/hc-mock-data'

const HC = '#10B981'

function catColor(cat: string): string {
  return { Clinical: HC, Safety: '#3b82f6', Compliance: '#8b5cf6' }[cat] ?? '#a8a8a8'
}

export default function TrainingPage() {
  const totalStaff    = 48
  const totalOverdue  = trainingModules.reduce((s, m) => s + m.overdueCount, 0)
  const totalExpiring = trainingModules.reduce((s, m) => s + m.expiringCount, 0)
  const avgCompletion = Math.round(trainingModules.reduce((s, m) => s + (m.completedCount / m.totalStaff) * 100, 0) / trainingModules.length)

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Mandatory Training Matrix</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {totalStaff} staff · {trainingModules.length} mandatory modules · NSW Health mandatory training requirements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Avg Completion',    value: `${avgCompletion}%`, color: avgCompletion >= 90 ? '#22c55e' : avgCompletion >= 75 ? '#f59e0b' : '#ef4444' },
          { label: 'Staff Overdue',     value: totalOverdue,         color: totalOverdue > 10 ? '#ef4444' : '#f59e0b' },
          { label: 'Expiring 30 Days',  value: totalExpiring,        color: totalExpiring > 5 ? '#f59e0b' : '#22c55e' },
          { label: 'Modules Tracked',   value: trainingModules.length, color: HC },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-5 py-4" style={{ background: '#f0fdf4', border: `1px solid ${HC}30` }}>
        <BookOpen size={15} style={{ color: HC, flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: '#065f46' }}>
          <span className="font-bold">NSW Health Policy: </span>
          Mandatory training non-compliance above 15% must be reported to the Board of Directors. BLS must be completed annually by all clinical staff. Non-compliant staff should be restricted from clinical duties until training is current. Records must be maintained for 7 years.
        </p>
      </div>

      {/* Training modules */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Training Modules</h2>
          <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {['Clinical', 'Safety', 'Compliance'].map(cat => (
              <span key={cat} className="flex items-center gap-1.5">
                <span className="w-2 h-2 inline-block" style={{ background: catColor(cat) }} />
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '2.5fr 0.7fr 0.8fr 1fr 0.8fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Module</span><span>Category</span><span>Frequency</span><span>Completion</span><span>Overdue</span><span>Expiring</span>
        </div>

        {trainingModules.map((m, i) => {
          const pct = Math.round((m.completedCount / m.totalStaff) * 100)
          const col = pct >= 90 ? '#22c55e' : pct >= 75 ? '#f59e0b' : '#ef4444'
          const cCol = catColor(m.category)
          return (
            <div key={m.id}
              className="grid items-center px-5 py-3.5 hover:bg-[var(--bg-hover)]"
              style={{
                gridTemplateColumns: '2.5fr 0.7fr 0.8fr 1fr 0.8fr 0.8fr',
                borderBottom: i < trainingModules.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: m.overdueCount > 5 ? '3px solid #ef4444' : m.overdueCount > 0 ? '3px solid #f59e0b' : '3px solid transparent',
              }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 flex-shrink-0" style={{ background: cCol }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{m.title}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Required: {m.totalStaff} staff</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 self-center"
                style={{ background: cCol + '20', color: cCol }}>{m.category}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {m.frequencyMonths >= 12 ? `${m.frequencyMonths / 12}yr` : `${m.frequencyMonths}mo`}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 max-w-[80px]" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full" style={{ width: `${pct}%`, background: col }} />
                  </div>
                  <span className="text-xs font-black" style={{ color: col }}>{pct}%</span>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{m.completedCount}/{m.totalStaff} done</p>
              </div>
              <div className="flex items-center gap-1.5">
                {m.overdueCount > 0
                  ? <><AlertCircle size={11} style={{ color: '#ef4444' }} /><span className="text-xs font-black" style={{ color: '#ef4444' }}>{m.overdueCount}</span></>
                  : <><CheckCircle2 size={11} style={{ color: '#22c55e' }} /><span className="text-xs" style={{ color: '#22c55e' }}>0</span></>}
              </div>
              <div className="flex items-center gap-1.5">
                {m.expiringCount > 0
                  ? <><Clock size={11} style={{ color: '#f59e0b' }} /><span className="text-xs font-black" style={{ color: '#f59e0b' }}>{m.expiringCount}</span></>
                  : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>0</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Department compliance table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Compliance by Department</h2>
        </div>
        <div className="px-5 py-4 space-y-4">
          {[
            { dept: 'ICU',              pct: 91, staff: 12, overdue: 2  },
            { dept: 'Surgery',          pct: 84, staff: 8,  overdue: 4  },
            { dept: 'Emergency',        pct: 72, staff: 10, overdue: 8  },
            { dept: 'Medical Ward',     pct: 78, staff: 9,  overdue: 5  },
            { dept: 'Allied Health',    pct: 95, staff: 5,  overdue: 1  },
            { dept: 'Anaesthetics',     pct: 100,staff: 4,  overdue: 0  },
          ].map(({ dept, pct, staff, overdue }) => {
            const col = pct >= 90 ? '#22c55e' : pct >= 75 ? '#f59e0b' : '#ef4444'
            return (
              <div key={dept}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Users size={11} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{dept}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>({staff} staff)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {overdue > 0 && (
                      <span className="text-[10px] font-bold" style={{ color: '#ef4444' }}>{overdue} overdue</span>
                    )}
                    <span className="text-xs font-black" style={{ color: col }}>{pct}%</span>
                  </div>
                </div>
                <div className="h-2" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-full" style={{ width: `${pct}%`, background: col }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
