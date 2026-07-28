import { CheckCircle2, XCircle, AlertCircle, Calendar, ExternalLink } from 'lucide-react'
import { nsqhsStandards } from '@/lib/hc-mock-data'

const HC = '#10B981'

function stdColor(score: number) {
  if (score >= 85) return '#22c55e'
  if (score >= 70) return '#f59e0b'
  return '#ef4444'
}

function statusBadge(s: string) {
  const cfg: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
    Met:            { bg: '#f0fdf4', text: '#15803d', icon: CheckCircle2 },
    Partial:        { bg: '#fef3c7', text: '#b45309', icon: AlertCircle  },
    'Not Met':      { bg: '#fef2f2', text: '#dc2626', icon: XCircle      },
    'Not Assessed': { bg: '#f4f4f5', text: '#71717a', icon: AlertCircle  },
  }
  const c = cfg[s] ?? cfg['Not Assessed']
  const Icon = c.icon
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5"
      style={{ background: c.bg, color: c.text }}><Icon size={9} />{s}</span>
  )
}

export default function AccreditationPage() {
  const totalCritical = nsqhsStandards.reduce((s, n) => s + n.criticalActions, 0)
  const totalOpen     = nsqhsStandards.reduce((s, n) => s + n.openActions, 0)
  const metCount      = nsqhsStandards.filter(n => n.status === 'Met').length
  const avgScore      = Math.round(nsqhsStandards.reduce((s, n) => s + n.score, 0) / nsqhsStandards.length)

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>NSQHS Accreditation</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            National Safety & Quality Health Service Standards · ACHS Accreditor · Last survey: Aug 2024
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold px-3 py-2"
          style={{ background: HC + '15', color: HC, border: `1px solid ${HC}30` }}>
          <Calendar size={11} /> Next Survey: Aug 2026
        </div>
      </div>

      {/* Accreditation notice */}
      <div className="flex items-start gap-3 px-5 py-4" style={{ background: '#f0fdf4', border: `1px solid ${HC}30` }}>
        <CheckCircle2 size={15} style={{ color: HC, flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: '#065f46' }}>
          <span className="font-bold">NSQHS Standards v2: </span>
          The 8 NSQHS Standards are mandatory for Australian hospitals under the National Health Reform Agreement. Non-compliance with a Critical Action can result in accreditation being withheld or conditions being placed on the facility. Your next survey is August 2026 — {Math.ceil((new Date('2026-08-15').getTime() - Date.now()) / 86400000)} days away.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Average Score',       value: avgScore,         unit: '/100', color: stdColor(avgScore) },
          { label: 'Standards Met',       value: `${metCount}/8`,  unit: '',     color: metCount >= 6 ? '#22c55e' : '#f59e0b' },
          { label: 'Critical Actions',    value: totalCritical,    unit: '',     color: totalCritical > 0 ? '#ef4444' : '#22c55e' },
          { label: 'Open Actions Total',  value: totalOpen,        unit: '',     color: totalOpen > 10 ? '#f59e0b' : '#22c55e'  },
        ].map(({ label, value, unit, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-black" style={{ color }}>{value}</p>
              {unit && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Overall readiness ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center px-6 py-8"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="relative w-36 h-36 mb-4">
            <svg width="144" height="144" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="60" fill="none" stroke="#1e1e1e" strokeWidth="8" />
              <circle cx="72" cy="72" r="60" fill="none"
                stroke={stdColor(avgScore)} strokeWidth="8"
                strokeDasharray={`${(avgScore / 100) * 376.99} 376.99`}
                transform="rotate(-90 72 72)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black" style={{ color: stdColor(avgScore) }}>{avgScore}</span>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Avg Score</span>
            </div>
          </div>
          <p className="text-xs font-bold text-center" style={{ color: 'var(--text-secondary)' }}>
            ACHS Accreditation Status
          </p>
          <span className="mt-2 text-[10px] font-black px-3 py-1 uppercase tracking-widest"
            style={{ background: HC + '20', color: HC, border: `1px solid ${HC}40` }}>
            Accredited — Conditional
          </span>
        </div>

        <div className="lg:col-span-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Scores by Standard</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            {nsqhsStandards.map(n => {
              const col = stdColor(n.score)
              return (
                <div key={n.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-black w-4 flex-shrink-0" style={{ color: col }}>{n.number}</span>
                      <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{n.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {n.criticalActions > 0 && (
                        <span className="text-[9px] font-black px-1.5 py-0.5" style={{ background: '#fef2f2', color: '#dc2626' }}>
                          {n.criticalActions} critical
                        </span>
                      )}
                      <span className="text-xs font-black" style={{ color: col }}>{n.score}</span>
                    </div>
                  </div>
                  <div className="h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full" style={{ width: `${n.score}%`, background: col }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Standards detail table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Standards Detail</h2>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '0.3fr 2fr 0.6fr 0.6fr 0.6fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>#</span><span>Standard</span><span>Score</span><span>Critical</span><span>Open</span><span>Status</span>
        </div>

        {nsqhsStandards.map((n, i) => {
          const col = stdColor(n.score)
          return (
            <div key={n.id}
              className="grid items-center px-5 py-3.5 hover:bg-[var(--bg-hover)]"
              style={{
                gridTemplateColumns: '0.3fr 2fr 0.6fr 0.6fr 0.6fr 0.8fr',
                borderBottom: i < nsqhsStandards.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: n.status === 'Not Met' ? '3px solid #ef4444' : n.criticalActions > 0 ? '3px solid #f59e0b' : '3px solid transparent',
              }}>
              <span className="text-lg font-black" style={{ color: col }}>{n.number}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{n.title}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Last audit: {new Date(n.lastAudit).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className="text-sm font-black" style={{ color: col }}>{n.score}</span>
              <span className="text-sm font-black" style={{ color: n.criticalActions > 0 ? '#ef4444' : 'var(--text-muted)' }}>{n.criticalActions}</span>
              <span className="text-sm" style={{ color: n.openActions > 5 ? '#f59e0b' : 'var(--text-muted)' }}>{n.openActions}</span>
              {statusBadge(n.status)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
