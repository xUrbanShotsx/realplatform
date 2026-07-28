'use client'

import Link from 'next/link'
import {
  contractorProfile, contractorJobs, contractorOwnDocs,
} from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  Briefcase, FileText, AlertTriangle, CheckCircle2,
  Clock, ArrowRight, Phone, MapPin, Calendar,
} from 'lucide-react'

const STATUS_CFG = {
  active:    { label: 'Active',     color: '#22c55e', bg: '#22c55e18' },
  upcoming:  { label: 'Upcoming',   color: '#f59e0b', bg: '#f59e0b18' },
  completed: { label: 'Completed',  color: '#94a3b8', bg: '#94a3b818' },
  'on-hold': { label: 'On Hold',    color: '#ef4444', bg: '#ef444418' },
}

export default function ContractorDashboard() {
  const activeJob    = contractorJobs.find(j => j.status === 'active')
  const upcomingJobs = contractorJobs.filter(j => j.status === 'upcoming')
  const expiringDocs = contractorOwnDocs.filter(d => d.status === 'expiring' || d.status === 'expired')
  const allPendingDocs = contractorJobs.flatMap(j =>
    j.requiredDocs.filter(d => d.status === 'not-submitted' && d.required).map(d => ({ ...d, jobName: j.projectName, jobId: j.id }))
  )

  const today = new Date()
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
            {greeting}, {contractorProfile.contactName.split(' ')[0]}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {contractorProfile.companyName} · {contractorProfile.trade}
          </p>
        </div>
        <Link
          href="/contractor/jobs"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
        >
          View all jobs <ArrowRight size={12} />
        </Link>
      </div>

      {/* Alert banner */}
      {(expiringDocs.length > 0 || allPendingDocs.length > 0) && (
        <div className="space-y-2">
          {expiringDocs.length > 0 && (
            <div className="flex items-start gap-3 px-4 py-3" style={{ background: '#f59e0b10', border: '1px solid #f59e0b30' }}>
              <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                  {expiringDocs.length} document{expiringDocs.length !== 1 ? 's' : ''} expiring soon
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {expiringDocs.map(d => d.title).join(' · ')}
                </p>
              </div>
              <Link href="/contractor/documents" className="text-xs font-bold flex-shrink-0" style={{ color: '#f59e0b' }}>
                Renew →
              </Link>
            </div>
          )}
          {allPendingDocs.length > 0 && (
            <div className="flex items-start gap-3 px-4 py-3" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
              <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                  {allPendingDocs.length} required document{allPendingDocs.length !== 1 ? 's' : ''} not yet submitted
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {allPendingDocs.slice(0, 2).map(d => `${d.title} (${d.jobName})`).join(' · ')}
                  {allPendingDocs.length > 2 && ` +${allPendingDocs.length - 2} more`}
                </p>
              </div>
              <Link href="/contractor/jobs" className="text-xs font-bold flex-shrink-0" style={{ color: '#ef4444' }}>
                Submit →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Stats strip */}
      <div className="flex items-center divide-x" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderColor: 'var(--border)' }}>
        {[
          { icon: Briefcase,  label: 'Active jobs',         value: contractorJobs.filter(j => j.status === 'active').length,    color: '#22c55e' },
          { icon: Calendar,   label: 'Upcoming jobs',       value: upcomingJobs.length,                                          color: '#f59e0b' },
          { icon: FileText,   label: 'Pending submissions', value: allPendingDocs.length,                                        color: allPendingDocs.length > 0 ? '#ef4444' : '#22c55e' },
          { icon: AlertTriangle, label: 'Docs expiring',    value: expiringDocs.length,                                          color: expiringDocs.length > 0 ? '#f59e0b' : '#22c55e' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-2 px-4 py-2.5 flex-1" style={{ borderColor: 'var(--border)' }}>
            <Icon size={12} style={{ color, flexShrink: 0 }} />
            <span className="text-sm font-black" style={{ color }}>{value}</span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active / current job */}
        <div className="md:col-span-2 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Your Jobs</p>
          {contractorJobs.map(job => {
            const cfg = STATUS_CFG[job.status]
            const pendingForJob = job.requiredDocs.filter(d => d.status === 'not-submitted' && d.required).length
            return (
              <Link
                key={job.id}
                href={`/contractor/jobs/${job.id}`}
                className="block transition-all hover:translate-y-[-1px]"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: `4px solid ${cfg.color}` }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                          {job.stage}
                        </span>
                        {pendingForJob > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: '#ef444418', color: '#ef4444' }}>
                            {pendingForJob} docs pending
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{job.projectName}</p>
                      <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={10} />{job.address}
                      </p>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(job.startDate)} – {formatDate(job.endDate)}</span>
                    <span>Builder: {job.builder}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Active job quick contact */}
          {activeJob && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Active Job Contact</p>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Project Manager</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{activeJob.projectManager}</p>
                  <a href={`tel:${activeJob.pmPhone}`} className="flex items-center gap-1.5 text-xs mt-1 hover:opacity-70" style={{ color: 'var(--accent)' }}>
                    <Phone size={10} />{activeJob.pmPhone}
                  </a>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Safety Officer</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{activeJob.safetyOfficer}</p>
                  <a href={`tel:${activeJob.safetyPhone}`} className="flex items-center gap-1.5 text-xs mt-1 hover:opacity-70" style={{ color: 'var(--accent)' }}>
                    <Phone size={10} />{activeJob.safetyPhone}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Document health */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>My Documents</p>
            </div>
            <div className="p-4 space-y-2">
              {contractorOwnDocs.slice(0, 5).map(doc => (
                <div key={doc.id} className="flex items-center justify-between gap-2">
                  <p className="text-xs truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{doc.title}</p>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 flex-shrink-0"
                    style={
                      doc.status === 'current'   ? { background: '#22c55e18', color: '#22c55e' } :
                      doc.status === 'expiring'  ? { background: '#f59e0b18', color: '#f59e0b' } :
                                                   { background: '#ef444418', color: '#ef4444' }
                    }
                  >
                    {doc.status === 'current' ? '✓ Current' : doc.status === 'expiring' ? 'Expiring' : 'Expired'}
                  </span>
                </div>
              ))}
              <Link href="/contractor/documents" className="flex items-center gap-1 text-xs font-bold mt-2 pt-2" style={{ color: 'var(--accent)', borderTop: '1px solid var(--border)' }}>
                View all documents <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
