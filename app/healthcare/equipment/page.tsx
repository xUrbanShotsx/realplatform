import { Wrench, CheckCircle2, AlertCircle, XCircle, Plus } from 'lucide-react'
import { equipment } from '@/lib/hc-mock-data'

const HC = '#10B981'

function statusConfig(s: string) {
  return {
    Operational:    { color: '#22c55e', bg: '#f0fdf4', icon: CheckCircle2 },
    'Due Service':  { color: '#f59e0b', bg: '#fef3c7', icon: AlertCircle  },
    Overdue:        { color: '#ef4444', bg: '#fef2f2', icon: XCircle      },
    'Out of Service':{ color: '#9ca3af', bg: '#f9fafb', icon: XCircle     },
  }[s] ?? { color: '#9ca3af', bg: '#f9fafb', icon: AlertCircle }
}

export default function EquipmentPage() {
  const overdue   = equipment.filter(e => e.status === 'Overdue').length
  const dueService= equipment.filter(e => e.status === 'Due Service').length
  const biomedical= equipment.filter(e => e.isBiomedical).length

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Equipment & Biomedical</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {equipment.length} assets tracked · {biomedical} biomedical devices · ACHS & TGA obligations
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:opacity-80"
          style={{ background: HC, color: '#fff' }}>
          <Plus size={13} /> Add Equipment
        </button>
      </div>

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-5 py-4" style={{ background: '#f0fdf4', border: `1px solid ${HC}30` }}>
        <Wrench size={15} style={{ color: HC, flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: '#065f46' }}>
          <span className="font-bold">TGA & ACHS requirement: </span>
          All medical devices must be maintained according to manufacturer specifications and applicable Australian Standards. Biomedical equipment must be tested and tagged. Life-critical devices (ventilators, defibrillators, anaesthetic machines) must be serviced at manufacturer intervals. Overdue service is a notifiable safety risk.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Operational',  value: equipment.filter(e => e.status === 'Operational').length, color: '#22c55e' },
          { label: 'Due Service',  value: dueService,  color: '#f59e0b' },
          { label: 'Overdue',      value: overdue,     color: '#ef4444' },
          { label: 'Biomedical',   value: biomedical,  color: HC        },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Equipment register */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Equipment Register</h2>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '2fr 0.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Equipment</span><span>Asset No.</span><span>Dept</span><span>Last Service</span><span>Next Service</span><span>Calibration</span><span>Status</span>
        </div>

        {equipment.map((eq, i) => {
          const cfg = statusConfig(eq.status)
          const Icon = cfg.icon
          const calDue = eq.calibrationDue ? new Date(eq.calibrationDue) <= new Date(Date.now() + 30*86400000) : false
          return (
            <div key={eq.id}
              className="grid items-center px-5 py-3.5 hover:bg-[var(--bg-hover)]"
              style={{
                gridTemplateColumns: '2fr 0.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr',
                borderBottom: i < equipment.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: eq.status === 'Overdue' ? '3px solid #ef4444' : eq.status === 'Due Service' ? '3px solid #f59e0b' : '3px solid transparent',
              }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{eq.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {eq.isBiomedical && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: HC + '20', color: HC }}>BIO</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{eq.assetNo}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{eq.department}</span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {new Date(eq.lastServiced).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
              <span className="text-[11px]" style={{ color: new Date(eq.nextService) < new Date() ? '#ef4444' : new Date(eq.nextService) < new Date(Date.now() + 30*86400000) ? '#f59e0b' : 'var(--text-muted)' }}>
                {new Date(eq.nextService).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
              <span className="text-[11px]" style={{ color: eq.calibrationDue ? (calDue ? '#f59e0b' : 'var(--text-muted)') : 'var(--text-muted)' }}>
                {eq.calibrationDue
                  ? new Date(eq.calibrationDue).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })
                  : 'N/A'}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: cfg.color }}>
                <Icon size={10} />{eq.status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
