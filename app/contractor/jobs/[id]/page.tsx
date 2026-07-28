'use client'

import { useParams, useRouter } from 'next/navigation'
import { contractorJobs } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'
import {
  ArrowLeft, MapPin, Phone, Mail, CheckCircle2, AlertTriangle,
  Clock, ChevronDown, ChevronUp, Shield, HardHat, Calendar,
  Navigation, Hospital, FileText, Upload, Circle, X,
} from 'lucide-react'

const STATUS_CFG = {
  active:    { label: 'Active Now',  color: '#22c55e', bg: '#22c55e18' },
  upcoming:  { label: 'Upcoming',    color: '#f59e0b', bg: '#f59e0b18' },
  completed: { label: 'Completed',   color: '#94a3b8', bg: '#94a3b818' },
  'on-hold': { label: 'On Hold',     color: '#ef4444', bg: '#ef444418' },
}

const DOC_STATUS_CFG = {
  'not-submitted': { label: 'Not Submitted', color: '#ef4444', bg: '#ef444418', icon: X           },
  'pending':       { label: 'Under Review',  color: '#f59e0b', bg: '#f59e0b18', icon: Clock       },
  'approved':      { label: 'Approved',      color: '#22c55e', bg: '#22c55e18', icon: CheckCircle2 },
  'rejected':      { label: 'Rejected',      color: '#ef4444', bg: '#ef444418', icon: X           },
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const job     = contractorJobs.find(j => j.id === id)

  const [openSection, setOpenSection] = useState<string | null>('documents')
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto pt-12 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Job not found.</p>
        <button onClick={() => router.push('/contractor/jobs')} className="mt-4 text-xs font-bold" style={{ color: 'var(--accent)' }}>
          ← Back to jobs
        </button>
      </div>
    )
  }

  const cfg = STATUS_CFG[job.status]
  const approvedCount = job.requiredDocs.filter(d => d.status === 'approved').length
  const totalRequired = job.requiredDocs.filter(d => d.required).length
  const pendingCount  = job.requiredDocs.filter(d => d.status === 'not-submitted' && d.required).length

  function toggleSection(key: string) {
    setOpenSection(prev => prev === key ? null : key)
  }

  function simulateUpload(docId: string) {
    setUploadingId(docId)
    setTimeout(() => setUploadingId(null), 1800)
  }

  const Section = ({ id, title, icon: Icon, iconColor, children, badge }: {
    id: string; title: string; icon: React.ElementType; iconColor: string; children: React.ReactNode; badge?: { value: number; color: string }
  }) => {
    const isOpen = openSection === id
    return (
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center" style={{ background: iconColor + '15' }}>
              <Icon size={14} style={{ color: iconColor }} />
            </div>
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</p>
            {badge && badge.value > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: badge.color + '18', color: badge.color }}>
                {badge.value}
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
        </button>
        {isOpen && (
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => router.push('/contractor/jobs')}
        className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={14} /> Back to My Jobs
      </button>

      {/* Hero */}
      <div className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: `4px solid ${cfg.color}` }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
              <span className="text-[10px] px-2 py-0.5" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{job.trade}</span>
              <span className="text-[10px] px-2 py-0.5" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{job.projectRef}</span>
            </div>
            <h1 className="text-xl font-black" style={{ color: 'var(--text)' }}>{job.projectName}</h1>
            <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={12} />{job.address}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {job.siteInducted ? (
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5" style={{ background: '#22c55e18', color: '#22c55e', border: '1px solid #22c55e30' }}>
                <CheckCircle2 size={11} /> Site Inducted
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5" style={{ background: '#f59e0b18', color: '#f59e0b', border: '1px solid #f59e0b30' }}>
                <AlertTriangle size={11} /> Induction Required
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Builder</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{job.builder}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Your dates</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>{formatDate(job.startDate)} – {formatDate(job.endDate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Stage</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: job.stageColor }}>{job.stage}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Doc compliance</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: pendingCount > 0 ? '#ef4444' : '#22c55e' }}>
              {approvedCount}/{totalRequired} approved{pendingCount > 0 ? ` — ${pendingCount} missing` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Scope of works */}
      <Section id="scope" title="Your Scope of Works" icon={HardHat} iconColor="#3b82f6">
        <div className="p-5">
          <ul className="space-y-2">
            {job.scope.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <div className="w-5 h-5 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5" style={{ background: '#3b82f618', color: '#3b82f6' }}>
                  {i + 1}
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Required documents */}
      <Section id="documents" title="Required Documents" icon={FileText} iconColor="#f59e0b" badge={pendingCount > 0 ? { value: pendingCount, color: '#ef4444' } : undefined}>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {job.requiredDocs.map(doc => {
            const dcfg = DOC_STATUS_CFG[doc.status]
            const DocIcon = dcfg.icon
            const isUploading = uploadingId === doc.id
            return (
              <div key={doc.id} className="p-4 flex items-start gap-4">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: dcfg.bg }}>
                  <DocIcon size={13} style={{ color: dcfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{doc.title}</p>
                    {doc.required && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 uppercase" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Required</span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{doc.description}</p>
                  {doc.notes && (
                    <p className="text-[11px] mt-1 flex items-start gap-1" style={{ color: '#f59e0b' }}>
                      <AlertTriangle size={10} style={{ flexShrink: 0, marginTop: 1 }} /> {doc.notes}
                    </p>
                  )}
                  {doc.submittedDate && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Submitted {formatDate(doc.submittedDate)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: dcfg.bg, color: dcfg.color }}>
                    {dcfg.label}
                  </span>
                  {(doc.status === 'not-submitted' || doc.status === 'rejected') && (
                    <button
                      onClick={() => simulateUpload(doc.id)}
                      disabled={isUploading}
                      className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 transition-opacity hover:opacity-80"
                      style={{ background: 'var(--accent)', color: 'var(--accent-text)', opacity: isUploading ? 0.6 : 1 }}
                    >
                      {isUploading ? (
                        <><Clock size={10} className="animate-spin" /> Uploading…</>
                      ) : (
                        <><Upload size={10} /> Upload</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Site guidelines */}
      <Section id="guidelines" title="Site Guidelines & Safety" icon={Shield} iconColor="#22c55e">
        <div className="p-5 space-y-5">
          {job.guidelines.map(section => (
            <div key={section.category}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>{section.category}</p>
              <ul className="space-y-1.5">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 flex-shrink-0 mt-1.5" style={{ background: '#22c55e' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* PPE & Site rules */}
      <Section id="ppe" title="PPE & Site Rules" icon={HardHat} iconColor="#a855f7">
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Required PPE</p>
              <ul className="space-y-2">
                {job.ppeRequired.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={13} style={{ color: '#a855f7', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Site Rules</p>
              <ul className="space-y-2">
                {job.siteRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 flex-shrink-0 mt-1.5" style={{ background: '#a855f7' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Contacts & access */}
      <Section id="access" title="Site Access & Emergency Info" icon={Navigation} iconColor="#ef4444">
        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Access Instructions</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{job.accessInstructions}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div className="p-3" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#ef4444' }}>Emergency Assembly Point</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{job.emergencyAssemblyPoint}</p>
            </div>
            <div className="p-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Nearest Hospital</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{job.nearestHospital}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Project Manager</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{job.projectManager}</p>
              <a href={`tel:${job.pmPhone}`} className="flex items-center gap-1.5 text-xs mt-1 hover:opacity-70" style={{ color: 'var(--accent)' }}>
                <Phone size={10} />{job.pmPhone}
              </a>
              <a href={`mailto:${job.pmEmail}`} className="flex items-center gap-1.5 text-xs mt-0.5 hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                <Mail size={10} />{job.pmEmail}
              </a>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Safety Officer</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{job.safetyOfficer}</p>
              <a href={`tel:${job.safetyPhone}`} className="flex items-center gap-1.5 text-xs mt-1 hover:opacity-70" style={{ color: 'var(--accent)' }}>
                <Phone size={10} />{job.safetyPhone}
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
