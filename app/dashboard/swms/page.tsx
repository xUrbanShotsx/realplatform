'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { Drawer, Field, TextInput, TextArea, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { swmsList as initialSwms } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  Plus, Search, FileSignature, CheckCircle2, Clock, AlertTriangle,
  Users, Shield, FileText, Edit3, Copy, Trash2,
} from 'lucide-react'

type SWMS = {
  id: string
  title: string
  site: string
  revision: string
  createdBy: string
  createdDate: string
  status: 'active' | 'draft' | 'superseded'
  signedCount: number
  totalWorkers: number
  linkedPermit: string
  riskRating: 'critical' | 'high' | 'medium' | 'low'
  lastUpdated?: string
  reviewDate?: string
  highRiskActivities?: string[]
}

const riskConfig = {
  critical: { label: 'Critical', bg: '#fee2e2', color: '#dc2626' },
  high:     { label: 'High',     bg: '#ffedd5', color: '#c2410c' },
  medium:   { label: 'Medium',   bg: '#fef3c7', color: '#b45309' },
  low:      { label: 'Low',      bg: '#dcfce7', color: '#15803d' },
}

const statusConfig = {
  active:     { label: 'Active',     bg: '#dcfce7', color: '#15803d', dot: 'bg-green-400' },
  draft:      { label: 'Draft',      bg: '#f3f4f6', color: '#6b7280', dot: 'bg-neutral-400' },
  superseded: { label: 'Superseded', bg: '#f3f4f6', color: '#9ca3af', dot: 'bg-neutral-300' },
}

const filters = ['All', 'Active', 'Draft', 'Superseded']

const BLANK_FORM = { title: '', site: '', activities: '', riskRating: 'medium' as const, preparedBy: '', status: 'draft' as const }

export default function SWMSPage() {
  const [items, setItems]   = useState<SWMS[]>([...initialSwms] as SWMS[])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showDrawer, setShowDrawer]   = useState(false)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [form, setForm]     = useState({ ...BLANK_FORM })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const filtered = items.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.site.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || s.status === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  const activeCount   = items.filter(s => s.status === 'active').length
  const draftCount    = items.filter(s => s.status === 'draft').length
  const criticalCount = items.filter(s => s.riskRating === 'critical').length
  const allSigned     = items.filter(s => s.status === 'active' && s.signedCount === s.totalWorkers).length

  function openNew() {
    setEditingId(null)
    setForm({ ...BLANK_FORM })
    setSaved(false)
    setShowDrawer(true)
  }

  function openEdit(swms: SWMS) {
    setEditingId(swms.id)
    setForm({
      title: swms.title,
      site: swms.site,
      activities: '',
      riskRating: swms.riskRating as typeof BLANK_FORM.riskRating,
      preparedBy: swms.createdBy,
      status: swms.status as typeof BLANK_FORM.status,
    })
    setSaved(false)
    setShowDrawer(true)
  }

  function duplicate(swms: SWMS) {
    const copy: SWMS = {
      ...swms,
      id: Date.now().toString(),
      title: `${swms.title} (Copy)`,
      status: 'draft',
      signedCount: 0,
      revision: 'R1',
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    setItems(prev => [copy, ...prev])
  }

  function archive(id: string) {
    if (!confirm('Archive this SWMS? It will be marked as superseded.')) return
    setItems(prev => prev.map(s => s.id === id ? { ...s, status: 'superseded' as const } : s))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      if (editingId) {
        setItems(prev => prev.map(s => s.id === editingId ? {
          ...s,
          title: form.title,
          site: form.site,
          riskRating: form.riskRating,
          createdBy: form.preparedBy,
          status: form.status,
          lastUpdated: new Date().toISOString().split('T')[0],
        } : s))
      } else {
        const newSWMS: SWMS = {
          id: Date.now().toString(),
          title: form.title,
          site: form.site,
          status: form.status,
          riskRating: form.riskRating,
          createdBy: form.preparedBy,
          createdDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          signedCount: 0,
          totalWorkers: 3,
          revision: 'R1',
          linkedPermit: '',
          reviewDate: '',
          highRiskActivities: form.activities.split(',').map(s => s.trim()).filter(Boolean),
        }
        setItems(prev => [newSWMS, ...prev])
      }
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowDrawer(false); setForm({ ...BLANK_FORM }) }, 1200)
    }, 700)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="SWMS / JSEA"
        description="Safe Work Method Statements and Job Safety & Environment Analyses"
        action={{ label: 'New SWMS', icon: <Plus size={14} />, onClick: openNew }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <Input placeholder="Search SWMS…" className="pl-8 w-48" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active SWMS',   value: activeCount,   color: '#3b82f6' },
          { label: 'Drafts',        value: draftCount,    color: '#f59e0b' },
          { label: 'Critical Risk', value: criticalCount, color: '#ef4444' },
          { label: 'Fully Signed',  value: allSigned,     color: '#22c55e' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 text-xs font-semibold transition-colors"
            style={filter === f
              ? { background: 'var(--text)', color: 'var(--bg)' }
              : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* SWMS Cards */}
      <div className="space-y-3">
        {filtered.map(swms => {
          const risk   = riskConfig[swms.riskRating as keyof typeof riskConfig] ?? riskConfig.medium
          const status = statusConfig[swms.status as keyof typeof statusConfig] ?? statusConfig.draft
          const signedAll = swms.totalWorkers > 0 && swms.signedCount === swms.totalWorkers
          const signedPct = swms.totalWorkers > 0 ? Math.round((swms.signedCount / swms.totalWorkers) * 100) : 0

          return (
            <div key={swms.id} className="group" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-4 p-5">
                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                  <FileSignature size={18} style={{ color: 'var(--text-muted)' }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold" style={{ color: 'var(--text)' }}>{swms.title}</p>
                        <span className="text-xs font-semibold px-2 py-0.5" style={{ background: risk.bg, color: risk.color }}>
                          {risk.label} Risk
                        </span>
                      </div>
                      <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Shield size={11} /> {swms.site}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className={`w-2 h-2 ${status.dot}`} />
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                    <div><p style={{ color: 'var(--text-muted)' }}>Revision</p><p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{swms.revision}</p></div>
                    <div><p style={{ color: 'var(--text-muted)' }}>Prepared By</p><p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{swms.createdBy}</p></div>
                    <div><p style={{ color: 'var(--text-muted)' }}>Created</p><p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{formatDate(swms.createdDate)}</p></div>
                    <div>
                      <p style={{ color: 'var(--text-muted)' }}>Linked Permit</p>
                      <p className="font-semibold mt-0.5" style={{ color: swms.linkedPermit ? '#3b82f6' : 'var(--text-muted)' }}>
                        {swms.linkedPermit || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Signature progress */}
                  {swms.status === 'active' && swms.totalWorkers > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <Users size={11} /> Worker acknowledgements
                        </div>
                        <span className="font-bold" style={{ color: signedAll ? '#22c55e' : '#f59e0b' }}>
                          {swms.signedCount}/{swms.totalWorkers}
                        </span>
                      </div>
                      <div className="h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                        <div
                          className="h-full transition-all"
                          style={{ width: `${signedPct}%`, background: signedAll ? '#22c55e' : '#fbbf24' }}
                        />
                      </div>
                    </div>
                  )}

                  {swms.status === 'draft' && (
                    <p className="mt-3 text-xs flex items-center gap-1.5" style={{ color: '#f59e0b' }}>
                      <Clock size={12} /> Awaiting approval before workers can acknowledge
                    </p>
                  )}
                </div>
              </div>

              {/* Hover actions */}
              <div
                className="flex gap-2 px-5 py-3 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  <FileText size={11} /> View SWMS
                </button>
                <button
                  onClick={() => openEdit(swms)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  <Edit3 size={11} /> Edit
                </button>
                <button
                  onClick={() => duplicate(swms)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  <Copy size={11} /> Duplicate
                </button>
                {swms.status !== 'superseded' && (
                  <button
                    onClick={() => archive(swms.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ml-auto transition-all hover:opacity-80"
                    style={{ color: '#ef4444', border: '1px solid #fecaca', background: '#fef2f2' }}
                  >
                    <Trash2 size={11} /> Archive
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ border: '1px solid var(--border)' }}>
            <FileSignature size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>No SWMS found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* New / Edit Drawer */}
      <Drawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        title={editingId ? 'Edit SWMS' : 'New SWMS / JSEA'}
        subtitle={editingId ? 'Update the SWMS details' : 'Create a new Safe Work Method Statement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title" required>
            <TextInput value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Working at Height — Roof Installation" />
          </Field>
          <Field label="Site" required>
            <TextInput value={form.site} onChange={v => setForm(f => ({ ...f, site: v }))} placeholder="e.g. Site A — Block 3" />
          </Field>
          <Field label="High-Risk Activities">
            <TextArea
              value={form.activities}
              onChange={v => setForm(f => ({ ...f, activities: v }))}
              placeholder="List activities separated by commas, e.g. Working at height, Use of EWP, Concrete cutting"
              rows={3}
            />
          </Field>
          <Field label="Risk Rating" required>
            <RadioGroup
              value={form.riskRating}
              onChange={v => setForm(f => ({ ...f, riskRating: v as typeof form.riskRating }))}
              options={[
                { value: 'low',      label: 'Low'      },
                { value: 'medium',   label: 'Medium'   },
                { value: 'high',     label: 'High'     },
                { value: 'critical', label: 'Critical' },
              ]}
              colorMap={{ low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' }}
            />
          </Field>
          <Field label="Prepared By" required>
            <TextInput value={form.preparedBy} onChange={v => setForm(f => ({ ...f, preparedBy: v }))} placeholder="Your name" />
          </Field>
          <Field label="Status">
            <RadioGroup
              value={form.status}
              onChange={v => setForm(f => ({ ...f, status: v as typeof form.status }))}
              options={[
                { value: 'draft',  label: 'Save as Draft' },
                { value: 'active', label: 'Publish Active' },
              ]}
              colorMap={{ active: '#22c55e' }}
            />
          </Field>
          <SubmitRow
            saving={saving}
            saved={saved}
            submitLabel={editingId ? 'Save Changes' : 'Create SWMS'}
            savedLabel={editingId ? 'Saved! ✓' : 'SWMS Created! ✓'}
            onCancel={() => setShowDrawer(false)}
          />
        </form>
      </Drawer>
    </div>
  )
}
