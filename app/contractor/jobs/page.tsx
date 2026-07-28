'use client'

import Link from 'next/link'
import { contractorJobs } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  MapPin, Calendar, Phone, ArrowRight, CheckCircle2,
  AlertTriangle, Clock, Briefcase,
} from 'lucide-react'

const STATUS_CFG = {
  active:    { label: 'Active Now',  color: '#22c55e', bg: '#22c55e18' },
  upcoming:  { label: 'Upcoming',    color: '#f59e0b', bg: '#f59e0b18' },
  completed: { label: 'Completed',   color: '#94a3b8', bg: '#94a3b818' },
  'on-hold': { label: 'On Hold',     color: '#ef4444', bg: '#ef444418' },
}

export default function ContractorJobsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>My Jobs</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          All projects you are currently or upcoming assigned to
        </p>
      </div>

      {/* Jobs */}
      <div className="space-y-4">
        {contractorJobs.map(job => {
          const cfg = STATUS_CFG[job.status]
          const approvedDocs = job.requiredDocs.filter(d => d.status === 'approved').length
          const totalRequired = job.requiredDocs.filter(d => d.required).length
          const pendingDocs   = job.requiredDocs.filter(d => d.status === 'not-submitted' && d.required).length
          const docPct = totalRequired > 0 ? Math.round((approvedDocs / totalRequired) * 100) : 100

          return (
            <div
              key={job.id}
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: `4px solid ${cfg.color}` }}
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                        {job.trade}
                      </span>
                      <span className="text-[10px] px-2 py-0.5" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                        {job.stage}
                      </span>
                    </div>
                    <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>{job.projectName}</h2>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <MapPin size={10} />{job.address}
                    </p>
                  </div>
                  <Link
                    href={`/contractor/jobs/${job.id}`}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 flex-shrink-0 transition-opacity hover:opacity-80"
                    style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
                  >
                    View details <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Builder</p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{job.builder}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>PM</p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{job.projectManager}</p>
                    <a href={`tel:${job.pmPhone}`} className="text-[10px] flex items-center gap-1 mt-0.5 hover:opacity-70" style={{ color: 'var(--accent)' }}>
                      <Phone size={9} />{job.pmPhone}
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Schedule</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(job.startDate)} – {formatDate(job.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                      Compliance docs
                      {pendingDocs > 0 && <span className="ml-1.5 font-black" style={{ color: '#ef4444' }}>({pendingDocs} missing)</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                        <div
                          className="h-full"
                          style={{
                            width: `${docPct}%`,
                            background: docPct === 100 ? '#22c55e' : pendingDocs > 0 ? '#ef4444' : '#f59e0b',
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: docPct === 100 ? '#22c55e' : 'var(--text-muted)' }}>
                        {docPct}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Induction status */}
                <div className="flex items-center gap-2 mt-3">
                  {job.siteInducted ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#22c55e' }}>
                      <CheckCircle2 size={11} />
                      Site inducted {job.inductionDate ? `— ${formatDate(job.inductionDate)}` : ''}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#f59e0b' }}>
                      <AlertTriangle size={11} />
                      Site induction required before access
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
