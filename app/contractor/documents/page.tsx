'use client'

import { useState } from 'react'
import { contractorOwnDocs, contractorJobs, ContractorOwnDoc } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  Upload, CheckCircle2, AlertTriangle, Clock, FileText, Plus, X, Search,
} from 'lucide-react'

const TYPE_CFG = {
  insurance:     { label: 'Insurance',      color: '#3b82f6', bg: '#3b82f618' },
  licence:       { label: 'Licence',        color: '#a855f7', bg: '#a855f718' },
  certificate:   { label: 'Certificate',    color: '#22c55e', bg: '#22c55e18' },
  accreditation: { label: 'Accreditation',  color: '#f59e0b', bg: '#f59e0b18' },
  other:         { label: 'Other',          color: '#94a3b8', bg: '#94a3b818' },
}

const STATUS_CFG = {
  current:  { label: 'Current',  color: '#22c55e', bg: '#22c55e18', icon: CheckCircle2  },
  expiring: { label: 'Expiring', color: '#f59e0b', bg: '#f59e0b18', icon: AlertTriangle },
  expired:  { label: 'Expired',  color: '#ef4444', bg: '#ef444418', icon: X             },
  missing:  { label: 'Missing',  color: '#ef4444', bg: '#ef444418', icon: X             },
}

function daysUntilExpiry(dateStr: string) {
  if (!dateStr) return null
  return Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

export default function ContractorDocumentsPage() {
  const [docs, setDocs] = useState<ContractorOwnDoc[]>([...contractorOwnDocs])
  const [filter, setFilter] = useState<'all' | ContractorOwnDoc['type'] | ContractorOwnDoc['status']>('all')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)

  const expiringCount = docs.filter(d => d.status === 'expiring' || d.status === 'expired').length
  const requiredByActiveJobs = new Set(contractorJobs.filter(j => j.status === 'active' || j.status === 'upcoming').flatMap(j => j.requiredDocs.map(d => d.title)))

  const filtered = docs.filter(d => {
    const matchFilter = filter === 'all' || d.type === filter || d.status === filter
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.issuer.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  function simulateUpload() {
    setUploading(true)
    setTimeout(() => setUploading(false), 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>My Documents</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Your licences, insurances, certificates and accreditations
          </p>
        </div>
        <button
          onClick={simulateUpload}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
        >
          {uploading ? <><Clock size={12} className="animate-spin" /> Uploading…</> : <><Plus size={12} /> Upload document</>}
        </button>
      </div>

      {/* Alert */}
      {expiringCount > 0 && (
        <div className="flex items-start gap-3 p-4" style={{ background: '#f59e0b10', border: '1px solid #f59e0b30' }}>
          <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
              {expiringCount} document{expiringCount !== 1 ? 's' : ''} need{expiringCount === 1 ? 's' : ''} renewal
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Expired or expiring documents may affect your ability to access job sites. Renew and re-upload before expiry.
            </p>
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div className="flex items-center divide-x" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderColor: 'var(--border)' }}>
        {[
          { label: 'Total documents', value: docs.length,                                         color: 'var(--text)' },
          { label: 'Current',         value: docs.filter(d => d.status === 'current').length,      color: '#22c55e'     },
          { label: 'Expiring soon',   value: docs.filter(d => d.status === 'expiring').length,     color: '#f59e0b'     },
          { label: 'Expired',         value: docs.filter(d => d.status === 'expired').length,      color: '#ef4444'     },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2 px-4 py-2.5 flex-1" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm font-black" style={{ color }}>{value}</span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Search…"
            className="pl-8 pr-3 py-1.5 text-xs outline-none w-40"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'insurance', 'licence', 'certificate', 'accreditation', 'expiring', 'expired'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs font-semibold transition-colors capitalize"
              style={filter === f
                ? { background: 'var(--text)', color: 'var(--bg)' }
                : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
              }
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {filtered.map(doc => {
          const tcfg = TYPE_CFG[doc.type]
          const scfg = STATUS_CFG[doc.status]
          const StatusIcon = scfg.icon
          const daysLeft = daysUntilExpiry(doc.expiryDate)
          const isRequired = doc.requiredByJobs.length > 0

          return (
            <div
              key={doc.id}
              className="p-4 flex items-start gap-4"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${scfg.color}`,
              }}
            >
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: tcfg.bg }}>
                <FileText size={15} style={{ color: tcfg.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{doc.title}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: tcfg.bg, color: tcfg.color }}>
                    {tcfg.label}
                  </span>
                  {isRequired && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                      Required for {doc.requiredByJobs.length} job{doc.requiredByJobs.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Issued by {doc.issuer}</p>
                <div className="flex items-center gap-4 mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {doc.issueDate && <span>Issued {formatDate(doc.issueDate)}</span>}
                  {doc.expiryDate ? (
                    <span style={{ color: daysLeft !== null && daysLeft < 30 ? scfg.color : 'var(--text-muted)' }}>
                      Expires {formatDate(doc.expiryDate)}
                      {daysLeft !== null && daysLeft >= 0 && daysLeft < 60 && ` · ${daysLeft}d left`}
                      {daysLeft !== null && daysLeft < 0 && ' · Expired'}
                    </span>
                  ) : (
                    <span>No expiry</span>
                  )}
                  {doc.fileSize && <span>{doc.fileSize}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1" style={{ background: scfg.bg, color: scfg.color }}>
                  <StatusIcon size={10} /> {scfg.label}
                </span>
                {(doc.status === 'expiring' || doc.status === 'expired') && (
                  <button
                    onClick={simulateUpload}
                    className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 transition-opacity hover:opacity-80"
                    style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
                  >
                    <Upload size={10} /> Renew
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <FileText size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No documents match your filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
