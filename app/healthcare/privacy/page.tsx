import { Lock, AlertTriangle, CheckCircle2, AlertCircle, Shield } from 'lucide-react'
import { privacyBreaches } from '@/lib/hc-mock-data'

const HC = '#10B981'

function severityBadge(s: string) {
  const cfg: Record<string, { bg: string; text: string }> = {
    'Eligible NDB': { bg: '#fef2f2', text: '#dc2626' },
    Internal:       { bg: '#fef3c7', text: '#b45309' },
    Minor:          { bg: '#f0fdf4', text: '#15803d' },
  }
  const c = cfg[s] ?? { bg: '#f4f4f5', text: '#71717a' }
  return <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: c.bg, color: c.text }}>{s}</span>
}

function statusBadge(s: string) {
  const cfg: Record<string, { bg: string; text: string }> = {
    'Notified OAIC':    { bg: '#f0fdf4', text: '#15803d' },
    'Under Assessment': { bg: '#eff6ff', text: '#1d4ed8' },
    Closed:             { bg: '#f4f4f5', text: '#71717a' },
  }
  const c = cfg[s] ?? { bg: '#f4f4f5', text: '#71717a' }
  return <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: c.bg, color: c.text }}>{s}</span>
}

export default function PrivacyPage() {
  const eligibleNDB = privacyBreaches.filter(b => b.severity === 'Eligible NDB').length
  const unnotified  = privacyBreaches.filter(b => b.severity === 'Eligible NDB' && b.status !== 'Notified OAIC').length

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Privacy & Data Compliance</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Privacy Act 1988 · Notifiable Data Breaches Scheme · My Health Records Act 2012
        </p>
      </div>

      {unnotified > 0 && (
        <div className="flex items-start gap-3 px-5 py-4" style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
          <AlertTriangle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs" style={{ color: '#991b1b' }}>
            <span className="font-bold">NDB Alert: </span>
            {unnotified} Eligible Notifiable Data Breach{unnotified > 1 ? 'es' : ''} require notification to the OAIC and affected individuals. Notification must occur as soon as practicable — failure to notify is a civil penalty under the Privacy Act (up to $2.5M per contravention).
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Breaches YTD',  value: privacyBreaches.length,     color: '#f59e0b'  },
          { label: 'Eligible NDB',        value: eligibleNDB,                color: '#ef4444'  },
          { label: 'OAIC Notified',       value: privacyBreaches.filter(b => b.status === 'Notified OAIC').length, color: '#22c55e' },
          { label: 'Affected Patients',   value: privacyBreaches.reduce((s, b) => s + b.affectedPatients, 0), color: '#3b82f6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Privacy breaches table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Data Breach Register</h2>
        </div>
        {privacyBreaches.map((b, i) => (
          <div key={b.id}
            className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--bg-hover)]"
            style={{ borderBottom: i < privacyBreaches.length - 1 ? '1px solid var(--border)' : 'none', borderLeft: b.severity === 'Eligible NDB' ? '3px solid #ef4444' : '3px solid transparent' }}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{b.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {b.type} · {new Date(b.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })} · {b.affectedPatients} patient{b.affectedPatients !== 1 ? 's' : ''} affected
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {severityBadge(b.severity)}
              {statusBadge(b.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Privacy compliance checklist */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Privacy Obligations Checklist</h2>
        </div>
        <div className="px-5 py-4 space-y-0">
          {[
            { label: 'Privacy Policy published and current',                      done: true  },
            { label: 'Staff privacy training completed (annual)',                  done: false },
            { label: 'Privacy Impact Assessment for new systems',                  done: true  },
            { label: 'Data breach response plan documented and tested',           done: true  },
            { label: 'My Health Records security controls in place',              done: true  },
            { label: 'Third-party data sharing agreements reviewed',              done: false },
            { label: 'Patient consent processes documented',                      done: true  },
            { label: 'Records retention and disposal schedule current',           done: false },
            { label: 'OAIC NDB register maintained',                             done: true  },
            { label: 'Access logs reviewed for unauthorised access (quarterly)',  done: true  },
          ].map(({ label, done }, i, arr) => (
            <div key={label}
              className="flex items-center gap-3 py-3 hover:bg-[var(--bg-hover)]"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                style={{ border: `1px solid ${done ? HC : '#2a2a2a'}`, background: done ? HC + '20' : 'transparent' }}>
                {done && <CheckCircle2 size={9} style={{ color: HC }} />}
              </div>
              <span className="text-xs flex-1" style={{ color: done ? 'var(--text-secondary)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
                {label}
              </span>
              {!done && (
                <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: '#fef3c7', color: '#b45309' }}>Action Required</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* My Health Records */}
      <div className="px-6 py-5 flex items-start gap-4"
        style={{ background: 'var(--bg)', border: `1px solid ${HC}30`, borderLeft: `4px solid ${HC}` }}>
        <Shield size={18} style={{ color: HC, flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>My Health Records Act 2012</p>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Healthcare providers accessing the My Health Record system must comply with the My Health Records Act. Unauthorised access or disclosure is a criminal offence (up to 2 years imprisonment). Access must be for direct patient care only and logged.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'System registered',     done: true  },
              { label: 'Access audit current',  done: true  },
              { label: 'Staff trained',         done: false },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2">
                {done ? <CheckCircle2 size={12} style={{ color: HC }} /> : <AlertCircle size={12} style={{ color: '#f59e0b' }} />}
                <span className="text-[11px]" style={{ color: done ? 'var(--text-secondary)' : '#f59e0b' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
