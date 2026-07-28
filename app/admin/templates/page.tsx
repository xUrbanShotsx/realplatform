'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { Drawer, Field, TextInput, TextArea, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { formatDate } from '@/lib/utils'
import {
  Upload, Search, FileText, Download, Edit, Trash2,
  Eye, TrendingUp, Package, Star,
} from 'lucide-react'

type TemplateStatus = 'published' | 'draft'
type Template = {
  id: string
  name: string
  category: string
  industry: string
  version: string
  usageCount: number
  lastUpdated: string
  status: TemplateStatus
  description?: string
}

const SEED: Template[] = [
  { id: '1',  name: 'WHS Induction Checklist',            category: 'WHS',        industry: 'All',           version: 'v2.1', usageCount: 47, lastUpdated: '2025-04-01', status: 'published', description: 'Full WHS induction checklist for new workers and contractors' },
  { id: '2',  name: 'Monthly Site Inspection Form',        category: 'Inspection', industry: 'Construction',  version: 'v3.0', usageCount: 32, lastUpdated: '2025-03-15', status: 'published', description: 'Comprehensive monthly site inspection covering all WHS requirements' },
  { id: '3',  name: 'Contractor Onboarding Package',       category: 'Contractors',industry: 'All',           version: 'v1.4', usageCount: 28, lastUpdated: '2025-03-20', status: 'published', description: 'Pre-qualification and onboarding documents for contractors' },
  { id: '4',  name: 'ISO 9001 Internal Audit Checklist',  category: 'ISO',        industry: 'All',           version: 'v1.0', usageCount: 15, lastUpdated: '2025-02-28', status: 'published', description: 'Internal audit checklist aligned to ISO 9001:2015 requirements' },
  { id: '5',  name: 'Emergency Response Plan Template',    category: 'WHS',        industry: 'All',           version: 'v2.0', usageCount: 61, lastUpdated: '2025-01-10', status: 'published', description: 'Emergency response and evacuation planning document' },
  { id: '6',  name: 'SWMS – Working at Heights',           category: 'WHS',        industry: 'Construction',  version: 'v1.2', usageCount: 39, lastUpdated: '2025-04-05', status: 'published', description: 'Safe Work Method Statement for all working at heights activities' },
  { id: '7',  name: 'Chemical Register Template',          category: 'Registers',  industry: 'All',           version: 'v4.0', usageCount: 24, lastUpdated: '2025-03-01', status: 'published', description: 'SDS-linked chemical register compliant with GHS requirements' },
  { id: '8',  name: 'Pre-Start Safety Check (Daily)',      category: 'Inspection', industry: 'Construction',  version: 'v1.1', usageCount: 88, lastUpdated: '2025-04-10', status: 'published', description: 'Daily pre-start safety checklist for plant and equipment operators' },
  { id: '9',  name: 'Incident Report Form',                category: 'Incidents',  industry: 'All',           version: 'v3.2', usageCount: 55, lastUpdated: '2025-03-25', status: 'published', description: 'Initial incident report form compliant with state WHS regulations' },
  { id: '10', name: 'Facilities Maintenance Checklist',    category: 'Inspection', industry: 'Facilities',    version: 'v1.0', usageCount: 0,  lastUpdated: '2025-04-28', status: 'draft',     description: 'Routine maintenance inspection template for facilities management' },
]

const CATEGORIES = ['All', 'WHS', 'Inspection', 'ISO', 'Contractors', 'Registers', 'Incidents']
const INDUSTRIES  = ['All', 'Construction', 'Electrical', 'Mining', 'Healthcare', 'Facilities', 'Manufacturing']

const STATUS_CFG: Record<TemplateStatus, { bg: string; color: string; label: string }> = {
  published: { bg: '#22c55e18', color: '#22c55e', label: 'Published' },
  draft:     { bg: '#f59e0b18', color: '#f59e0b', label: 'Draft'     },
}

const BLANK = { name: '', category: 'WHS', industry: 'All', description: '', status: 'draft' as TemplateStatus }

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([...SEED])
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [showDrawer, setShowDrawer] = useState(false)
  const [form, setForm]           = useState({ ...BLANK })
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  const filtered = templates.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'All' || t.category === category
    return matchSearch && matchCat
  })

  const totalUsage    = templates.reduce((s, t) => s + t.usageCount, 0)
  const published     = templates.filter(t => t.status === 'published').length
  const mostUsed      = [...templates].sort((a, b) => b.usageCount - a.usageCount)[0]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newTpl: Template = {
        id: Date.now().toString(),
        name: form.name,
        category: form.category,
        industry: form.industry,
        description: form.description,
        version: 'v1.0',
        usageCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: form.status,
      }
      setTemplates(prev => [newTpl, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowDrawer(false); setForm({ ...BLANK }) }, 1200)
    }, 700)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Templates"
        description="Compliance form templates available to all client organisations"
        action={{ label: 'Upload Template', icon: <Upload size={14} />, onClick: () => { setForm({ ...BLANK }); setShowDrawer(true) } }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <Input placeholder="Search templates…" className="pl-8 w-52" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Templates', value: templates.length,  color: 'var(--text)', icon: Package,   sub: `${templates.filter(t => t.status === 'draft').length} drafts` },
          { label: 'Published',       value: published,          color: '#22c55e',     icon: Eye,       sub: 'Live for clients'       },
          { label: 'Total Uses',      value: totalUsage,         color: '#3b82f6',     icon: TrendingUp,sub: 'Across all accounts'    },
          { label: 'Most Used',       value: mostUsed?.usageCount ?? 0, color: 'var(--accent-text)', icon: Star, sub: mostUsed?.name.split(' ').slice(0,3).join(' ') ?? '' },
        ].map(({ label, value, color, icon: Icon, sub }) => (
          <div key={label} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
              </div>
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                <Icon size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-3 py-1.5 text-xs font-semibold transition-colors"
            style={category === cat
              ? { background: 'var(--text)', color: 'var(--bg)' }
              : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['Template', 'Category', 'Industry', 'Version', 'Used By', 'Last Updated', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-10 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No templates found</td></tr>
              )}
              {filtered.map(tpl => {
                const sCfg = STATUS_CFG[tpl.status]
                return (
                  <tr key={tpl.id} className="group transition-colors hover:bg-[var(--bg-hover)]" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                          <FileText size={13} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{tpl.name}</p>
                          {tpl.description && <p className="text-xs truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>{tpl.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{tpl.category}</td>
                    <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{tpl.industry}</td>
                    <td className="py-3.5 px-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{tpl.version}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold" style={{ color: 'var(--text)' }}>{tpl.usageCount}</span>
                      <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>clients</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(tpl.lastUpdated)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: sCfg.bg, color: sCfg.color }}>{sCfg.label}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-[var(--bg-secondary)] transition-colors" style={{ color: 'var(--text-muted)' }}><Download size={13} /></button>
                        <button className="p-1.5 hover:bg-[var(--bg-secondary)] transition-colors" style={{ color: 'var(--text-muted)' }}><Edit size={13} /></button>
                        <button
                          className="p-1.5 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        ><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Drawer */}
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title="Upload Template" subtitle="Add a new compliance template to the library">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Template Name" required>
            <TextInput value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Fire Warden Checklist" />
          </Field>
          <Field label="Category" required>
            <Select value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={CATEGORIES.filter(c => c !== 'All')} />
          </Field>
          <Field label="Industry">
            <Select value={form.industry} onChange={v => setForm(f => ({ ...f, industry: v }))} options={INDUSTRIES} />
          </Field>
          <Field label="Description">
            <TextArea value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Brief description of what this template covers…" rows={2} />
          </Field>
          <Field label="Publish Status">
            <RadioGroup
              value={form.status}
              onChange={v => setForm(f => ({ ...f, status: v as TemplateStatus }))}
              options={[
                { value: 'draft',     label: 'Save as Draft'  },
                { value: 'published', label: 'Publish Now'    },
              ]}
            />
          </Field>
          <SubmitRow saving={saving} saved={saved} submitLabel="Upload Template" savedLabel="Uploaded! ✓" onCancel={() => setShowDrawer(false)} />
        </form>
      </Drawer>
    </div>
  )
}
