'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { Drawer, Field, TextInput, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { equipment as initialEquipment } from '@/lib/mock-data'
import { formatDate, daysUntil } from '@/lib/utils'
import {
  Plus, Search, Settings2, CheckCircle2, XCircle,
  AlertTriangle, Wrench, QrCode, ArrowLeft, Clock,
  ClipboardCheck, ShieldAlert, CalendarClock,
} from 'lucide-react'

type Asset = {
  id: string
  assetId: string
  name: string
  category: string
  make: string
  model: string
  year: number
  serialNumber: string
  registrationNumber: string
  siteLocation: string
  requiredLicence: string
  preStartToday: boolean
  preStartScore?: number
  defects: number
  nextServiceDate: string
  status: 'active' | 'under-service' | 'decommissioned'
  serviceIntervalKm: number
}

type SummaryView = 'prestarts' | 'defects' | 'overdue' | 'due-soon'

const CATEGORIES = ['All', 'Forklift', 'Elevated Work Platform', 'Excavator', 'Scaffolding', 'Power Tool', 'Compressor', 'Generator', 'Other']

const statusConfig = {
  active:          { label: 'Active',         bg: '#dcfce7', color: '#15803d' },
  'under-service': { label: 'Under Service',  bg: '#fef3c7', color: '#b45309' },
  decommissioned:  { label: 'Decommissioned', bg: '#fee2e2', color: '#dc2626' },
}

const BLANK_FORM = {
  name: '',
  category: '',
  assetId: '',
  operator: '',
  nextServiceDate: '',
  status: 'active' as const,
}

const summaryViewConfig: Record<SummaryView, {
  title: string
  description: string
  color: string
  icon: React.ElementType
  emptyLabel: string
}> = {
  prestarts: {
    title: 'Pre-Start Checks — Today',
    description: 'Pre-start status for all active assets',
    color: '#f59e0b',
    icon: ClipboardCheck,
    emptyLabel: 'No active assets require pre-start checks.',
  },
  defects: {
    title: 'Open Defects',
    description: 'Assets with unresolved defects requiring action',
    color: '#ef4444',
    icon: AlertTriangle,
    emptyLabel: 'No open defects — all assets clear.',
  },
  overdue: {
    title: 'Services Overdue',
    description: 'Assets that have passed their scheduled service date',
    color: '#ef4444',
    icon: ShieldAlert,
    emptyLabel: 'No overdue services — all assets are up to date.',
  },
  'due-soon': {
    title: 'Services Due Within 30 Days',
    description: 'Assets approaching their next scheduled service',
    color: '#f59e0b',
    icon: CalendarClock,
    emptyLabel: 'No services due in the next 30 days.',
  },
}

function filterAssets(items: Asset[], view: SummaryView): Asset[] {
  switch (view) {
    case 'prestarts':
      return items.filter(e => e.status === 'active')
    case 'defects':
      return items.filter(e => e.defects > 0)
    case 'overdue':
      return items.filter(e => daysUntil(e.nextServiceDate) < 0)
    case 'due-soon':
      return items.filter(e => { const d = daysUntil(e.nextServiceDate); return d >= 0 && d <= 30 })
  }
}

export default function EquipmentPage() {
  const [items, setItems]       = useState<Asset[]>([...initialEquipment] as Asset[])
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [showDrawer, setShowDrawer] = useState(false)
  const [form, setForm]         = useState({ ...BLANK_FORM })
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [serviceLog, setServiceLog] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<SummaryView | null>(null)

  const filtered = items.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.assetId.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || e.category === category
    return matchSearch && matchCat
  })

  const preStartsDone     = items.filter(e => e.preStartToday && e.status === 'active').length
  const preStartsRequired = items.filter(e => e.status === 'active').length
  const servicesOverdue   = items.filter(e => daysUntil(e.nextServiceDate) < 0).length
  const servicesDue30     = items.filter(e => { const d = daysUntil(e.nextServiceDate); return d >= 0 && d <= 30 }).length
  const totalDefects      = items.reduce((s, e) => s + e.defects, 0)

  const preStartColor = preStartsDone < preStartsRequired ? '#f59e0b' : '#22c55e'

  const summaryCards: { key: SummaryView; label: string; value: string | number; color: string; sub: string }[] = [
    { key: 'prestarts',  label: 'Pre-Starts Today',   value: `${preStartsDone}/${preStartsRequired}`, color: preStartColor, sub: preStartsDone < preStartsRequired ? `${preStartsRequired - preStartsDone} not done` : 'All complete' },
    { key: 'defects',    label: 'Open Defects',        value: totalDefects,    color: totalDefects > 0 ? '#ef4444' : '#22c55e', sub: totalDefects > 0 ? 'Action required' : 'None' },
    { key: 'overdue',    label: 'Services Overdue',    value: servicesOverdue, color: servicesOverdue > 0 ? '#ef4444' : '#22c55e', sub: 'Immediate action' },
    { key: 'due-soon',   label: 'Services Due (30d)',  value: servicesDue30,   color: '#f59e0b', sub: 'Schedule now' },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newAsset: Asset = {
        id: Date.now().toString(),
        name: form.name,
        category: form.category || 'Other',
        assetId: form.assetId,
        make: '',
        model: '',
        year: new Date().getFullYear(),
        siteLocation: 'Unassigned',
        requiredLicence: 'None',
        serialNumber: '',
        registrationNumber: '',
        preStartToday: false,
        preStartScore: 0,
        defects: 0,
        nextServiceDate: form.nextServiceDate || '',
        serviceIntervalKm: 250,
        status: form.status,
      }
      setItems(prev => [newAsset, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowDrawer(false); setForm({ ...BLANK_FORM }) }, 1200)
    }, 700)
  }

  function doPreStart(id: string) {
    setItems(prev => prev.map(e => e.id === id ? { ...e, preStartToday: true, preStartScore: 95 + Math.floor(Math.random() * 6) } : e))
  }

  function logService(id: string) {
    setItems(prev => prev.map(e => {
      if (e.id !== id) return e
      const next = new Date()
      next.setMonth(next.getMonth() + 3)
      return { ...e, nextServiceDate: next.toISOString().split('T')[0] }
    }))
    setServiceLog(id)
    setTimeout(() => setServiceLog(null), 2000)
  }

  // ── Summary view panel ──────────────────────────────────────────────────────
  if (activeView) {
    const cfg = summaryViewConfig[activeView]
    const Icon = cfg.icon
    const viewItems = filterAssets(items, activeView)

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back + header */}
        <div>
          <button
            onClick={() => setActiveView(null)}
            className="flex items-center gap-1.5 text-sm mb-4 transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={14} /> Back to Equipment Register
          </button>

          <div className="flex items-center gap-4 p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: `4px solid ${cfg.color}` }}>
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: cfg.color + '18' }}>
              <Icon size={18} style={{ color: cfg.color }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-base" style={{ color: 'var(--text)' }}>{cfg.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cfg.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black" style={{ color: cfg.color }}>{viewItems.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {activeView === 'prestarts' ? 'active assets' : 'assets'}
              </p>
            </div>
          </div>
        </div>

        {/* Pre-starts: show done vs not-done split */}
        {activeView === 'prestarts' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 flex items-center gap-3" style={{ background: '#22c55e18', border: '1px solid #22c55e40' }}>
              <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
              <div>
                <p className="text-xl font-black" style={{ color: '#22c55e' }}>{viewItems.filter(e => e.preStartToday).length}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pre-starts complete</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3" style={{ background: '#ef444418', border: '1px solid #ef444440' }}>
              <XCircle size={20} style={{ color: '#ef4444' }} />
              <div>
                <p className="text-xl font-black" style={{ color: '#ef4444' }}>{viewItems.filter(e => !e.preStartToday).length}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Not yet completed</p>
              </div>
            </div>
          </div>
        )}

        {/* Defects: show total defect count */}
        {activeView === 'defects' && viewItems.length > 0 && (
          <div className="p-4 flex items-center gap-3" style={{ background: '#ef444418', border: '1px solid #ef444440' }}>
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
            <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
              {viewItems.reduce((s, e) => s + e.defects, 0)} total open defects across {viewItems.length} asset{viewItems.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Table */}
        {viewItems.length === 0 ? (
          <div className="py-16 text-center" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <CheckCircle2 size={32} className="mx-auto mb-3" style={{ color: '#22c55e' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>All clear</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{cfg.emptyLabel}</p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Asset', 'Location', activeView === 'prestarts' ? 'Pre-Start' : activeView === 'defects' ? 'Open Defects' : 'Next Service', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewItems.map(asset => {
                    const days = daysUntil(asset.nextServiceDate)
                    const sc = statusConfig[asset.status]
                    const serviceJustLogged = serviceLog === asset.id

                    return (
                      <tr key={asset.id} className="group transition-colors hover:bg-[var(--bg-hover)]" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                              <Settings2 size={14} style={{ color: 'var(--text-muted)' }} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{asset.name}</p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{asset.assetId} · {asset.make} {asset.model}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{asset.siteLocation}</td>

                        {/* Dynamic middle column */}
                        <td className="py-3.5 px-4">
                          {activeView === 'prestarts' && (
                            asset.preStartToday
                              ? <div className="flex items-center gap-1.5"><CheckCircle2 size={14} style={{ color: '#22c55e' }} /><span className="text-xs font-semibold" style={{ color: '#22c55e' }}>Complete {asset.preStartScore}%</span></div>
                              : <div className="flex items-center gap-1.5"><XCircle size={14} style={{ color: '#ef4444' }} /><span className="text-xs font-semibold" style={{ color: '#ef4444' }}>Not done</span></div>
                          )}
                          {activeView === 'defects' && (
                            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#ef4444' }}>
                              <AlertTriangle size={12} />{asset.defects} open defect{asset.defects !== 1 ? 's' : ''}
                            </span>
                          )}
                          {(activeView === 'overdue' || activeView === 'due-soon') && (
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{formatDate(asset.nextServiceDate)}</p>
                              {days < 0  && <p className="text-xs font-semibold" style={{ color: '#ef4444' }}>Overdue {Math.abs(days)}d</p>}
                              {days >= 0 && days <= 30 && <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Due in {days}d</p>}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-xs font-semibold px-2 py-0.5" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {activeView === 'prestarts' && asset.status === 'active' && !asset.preStartToday && (
                              <button
                                onClick={() => doPreStart(asset.id)}
                                title="Complete pre-start check"
                                className="p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                                style={{ color: '#22c55e' }}
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}
                            {(activeView === 'overdue' || activeView === 'due-soon') && (
                              <button
                                onClick={() => logService(asset.id)}
                                title={serviceJustLogged ? 'Service logged ✓' : 'Log service'}
                                className="p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                                style={{ color: serviceJustLogged ? '#22c55e' : 'var(--text-muted)' }}
                              >
                                <Wrench size={14} />
                              </button>
                            )}
                            {activeView === 'defects' && (
                              <button
                                title="Raise corrective action"
                                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold transition-opacity hover:opacity-70"
                                style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444440' }}
                              >
                                <Plus size={10} /> Raise Action
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Main register view ──────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Equipment & Plant"
        description="Asset register, pre-start checklists and maintenance"
        action={{ label: 'Add Asset', icon: <Plus size={14} />, onClick: () => { setForm({ ...BLANK_FORM }); setShowDrawer(true) } }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <Input placeholder="Search assets…" className="pl-8 w-48" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </PageHeader>

      {/* Summary cards — clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map(({ key, label, value, color, sub }) => (
          <button
            key={key}
            onClick={() => setActiveView(key)}
            className="p-5 text-left group transition-all hover:shadow-md hover:-translate-y-px"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderTop: `3px solid ${color}`,
            }}
          >
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-[11px] mt-0.5 font-medium" style={{ color }}>{sub}</p>
            <p className="text-[10px] mt-2 font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>
              View details →
            </p>
          </button>
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

      {/* Asset Table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Asset', 'Location', 'Required Licence', 'Pre-Start', 'Defects', 'Next Service', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-10 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No assets found</td></tr>
              )}
              {filtered.map(asset => {
                const days = daysUntil(asset.nextServiceDate)
                const sc = statusConfig[asset.status]
                const serviceJustLogged = serviceLog === asset.id
                return (
                  <tr
                    key={asset.id}
                    className="group transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                          <Settings2 size={14} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{asset.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{asset.assetId} · {asset.make} {asset.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{asset.siteLocation}</td>
                    <td className="py-3.5 px-4">
                      {asset.requiredLicence !== 'None'
                        ? <span className="text-xs px-2 py-0.5 font-medium" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{asset.requiredLicence}</span>
                        : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                      }
                    </td>
                    <td className="py-3.5 px-4">
                      {asset.status === 'active' ? (
                        asset.preStartToday
                          ? <div className="flex items-center gap-1.5"><CheckCircle2 size={14} style={{ color: '#22c55e' }} /><span className="text-xs font-semibold" style={{ color: '#22c55e' }}>{asset.preStartScore}%</span></div>
                          : <div className="flex items-center gap-1.5"><XCircle size={14} style={{ color: '#ef4444' }} /><span className="text-xs font-semibold" style={{ color: '#ef4444' }}>Not done</span></div>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {asset.defects > 0
                        ? <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#ef4444' }}><AlertTriangle size={12} />{asset.defects} open</span>
                        : <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>None</span>
                      }
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{formatDate(asset.nextServiceDate)}</p>
                      {days < 0  && <p className="text-xs font-semibold" style={{ color: '#ef4444' }}>Overdue {Math.abs(days)}d</p>}
                      {days >= 0 && days <= 30 && <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Due in {days}d</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {asset.status === 'active' && !asset.preStartToday && (
                          <button
                            onClick={() => doPreStart(asset.id)}
                            title="Complete pre-start check"
                            className="p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                            style={{ color: '#22c55e' }}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => logService(asset.id)}
                          title={serviceJustLogged ? 'Service logged ✓' : 'Log service'}
                          className="p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                          style={{ color: serviceJustLogged ? '#22c55e' : 'var(--text-muted)' }}
                        >
                          <Wrench size={14} />
                        </button>
                        <button
                          title="View QR code"
                          className="p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <QrCode size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Drawer */}
      <Drawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="Add Asset"
        subtitle="Register new plant or equipment to the asset register"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Equipment Name" required>
            <TextInput value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Toyota 3-Tonne Forklift" />
          </Field>
          <Field label="Category" required>
            <Select
              value={form.category}
              onChange={v => setForm(f => ({ ...f, category: v }))}
              options={CATEGORIES.filter(c => c !== 'All')}
              placeholder="Select category…"
            />
          </Field>
          <Field label="Asset ID" required>
            <TextInput value={form.assetId} onChange={v => setForm(f => ({ ...f, assetId: v }))} placeholder="e.g. EQ-009" />
          </Field>
          <Field label="Responsible Operator">
            <TextInput value={form.operator} onChange={v => setForm(f => ({ ...f, operator: v }))} placeholder="Operator name" />
          </Field>
          <Field label="Next Service Date">
            <TextInput type="date" value={form.nextServiceDate} onChange={v => setForm(f => ({ ...f, nextServiceDate: v }))} />
          </Field>
          <Field label="Status">
            <RadioGroup
              value={form.status}
              onChange={v => setForm(f => ({ ...f, status: v as typeof form.status }))}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'under-service', label: 'Under Service' },
                { value: 'decommissioned', label: 'Decommissioned' },
              ]}
              colorMap={{ active: '#22c55e', 'under-service': '#f59e0b', decommissioned: '#ef4444' }}
            />
          </Field>
          <SubmitRow saving={saving} saved={saved} submitLabel="Add Asset" savedLabel="Asset Added! ✓" onCancel={() => setShowDrawer(false)} />
        </form>
      </Drawer>
    </div>
  )
}
