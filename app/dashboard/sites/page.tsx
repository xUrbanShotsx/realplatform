'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { Drawer, Field, TextInput, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { sites } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  Plus, MapPin, Users, AlertTriangle, Shield,
  CheckCircle2, XCircle, Building2, ChevronRight, ArrowRight,
} from 'lucide-react'

function scoreColor(s: number) {
  return s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444'
}

function scoreDot(s: number) {
  return s >= 80 ? 'bg-green-400' : s >= 60 ? 'bg-amber-400' : 'bg-red-400'
}

const statusColors: Record<string, string> = {
  active:    'bg-green-100 text-green-700',
  completed: 'bg-neutral-100 text-neutral-600',
  upcoming:  'bg-blue-100 text-blue-700',
}

type SiteStatus = 'active' | 'completed' | 'upcoming'

interface SiteItem {
  id: string
  name: string
  address: string
  status: SiteStatus
  complianceScore: number
  currentOccupancy: number
  openHazards: number
  activePermits: number
  inspections: unknown[]
  projectType: string
  projectNumber: string
  projectValue: number
  startDate: string
  endDate: string
  supervisor: string
  whsCoordinator: string
  hasWhsmp: boolean
  manager?: string
  siteSupervisor?: string
  maxCapacity?: number
}

const blankForm = {
  name: '',
  address: '',
  manager: '',
  siteSupervisor: '',
  maxCapacity: '',
  status: 'active' as SiteStatus,
}

export default function SitesPage() {
  const [siteList, setSiteList] = useState<SiteItem[]>([...sites] as unknown as SiteItem[])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const activeSites  = siteList.filter(s => s.status === 'active')
  const totalOccupancy = activeSites.reduce((sum, s) => sum + s.currentOccupancy, 0)
  const totalHazards   = siteList.reduce((s, x) => s + x.openHazards, 0)
  const totalPermits   = siteList.reduce((s, x) => s + x.activePermits, 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.address.trim() || !form.manager.trim()) return
    setSaving(true)
    setTimeout(() => {
      const newSite: SiteItem = {
        id: `site-${Date.now()}`,
        name: form.name.trim(),
        address: form.address.trim(),
        status: form.status,
        complianceScore: 75,
        currentOccupancy: 0,
        openHazards: 0,
        activePermits: 0,
        inspections: [],
        projectType: 'General Construction',
        projectNumber: `PRJ-${Date.now().toString().slice(-4)}`,
        projectValue: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        supervisor: form.siteSupervisor.trim() || form.manager.trim(),
        whsCoordinator: form.manager.trim(),
        hasWhsmp: false,
        manager: form.manager.trim(),
        siteSupervisor: form.siteSupervisor.trim(),
        maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : undefined,
      }
      setSiteList(prev => [newSite, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); setDrawerOpen(false); setForm(blankForm) }, 900)
    }, 600)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Sites"
        description="Click a site to open its full dashboard"
        action={{ label: 'Add Site', icon: <Plus size={14} />, onClick: () => setDrawerOpen(true) }}
      />

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sites',   value: activeSites.length,  icon: Building2,      bg: 'bg-blue-50 dark:bg-blue-900/20',   color: 'text-blue-600 dark:text-blue-400' },
          { label: 'On Site Now',    value: totalOccupancy,       icon: Users,          bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-600 dark:text-green-400' },
          { label: 'Active Permits', value: totalPermits,         icon: Shield,         bg: 'bg-amber-50 dark:bg-amber-900/20', color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Open Hazards',   value: totalHazards,         icon: AlertTriangle,  bg: 'bg-red-50 dark:bg-red-900/20',     color: 'text-red-600 dark:text-red-400' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Site cards — click → site dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {siteList.map(site => {
          const color = scoreColor(site.complianceScore)
          const dot   = scoreDot(site.complianceScore)
          return (
            <Link
              key={site.id}
              href={`/dashboard/sites/${site.id}`}
              className="block group"
            >
              <div
                className="p-5 transition-shadow hover:shadow-lg"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderTop: `3px solid ${color}`,
                }}
              >
                {/* Top row: name + score + arrow */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Score badge */}
                    <div
                      className="w-12 h-12 flex-shrink-0 flex items-center justify-center font-black text-lg"
                      style={{ background: color + '18', color }}
                    >
                      {site.complianceScore}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-base truncate" style={{ color: 'var(--text)' }}>{site.name}</p>
                      <p className="text-xs truncate mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={10} /> {site.address}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1"
                    style={{ color: 'var(--text-muted)' }}
                  />
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 ${statusColors[site.status]}`}>
                    {site.status}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{site.projectType}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{site.projectNumber}</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-0 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                  {[
                    { label: 'On site', value: site.currentOccupancy, icon: Users },
                    { label: 'Hazards', value: site.openHazards,      icon: AlertTriangle, warn: site.openHazards > 0 },
                    { label: 'Permits', value: site.activePermits,    icon: Shield },
                    { label: 'WHSMP',   value: site.hasWhsmp ? '✓' : '✗', icon: null, warn: !site.hasWhsmp },
                  ].map(({ label, value, icon: Icon, warn }) => (
                    <div key={label} className="text-center px-2">
                      <p className="text-base font-black" style={{ color: warn ? '#ef4444' : 'var(--text)' }}>{value}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Supervisor: <span style={{ color: 'var(--text-secondary)' }}>{site.supervisor}</span>
                  </span>
                  <span
                    className="text-xs font-semibold flex items-center gap-1 transition-colors group-hover:opacity-80"
                    style={{ color }}
                  >
                    Open Dashboard <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Add Site Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Site" subtitle="Register a new construction site">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Site Name" required>
            <TextInput value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Harbour Bridge Renovation" />
          </Field>
          <Field label="Address" required>
            <TextInput value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} placeholder="e.g. 1 Bridge St, Sydney NSW 2000" />
          </Field>
          <Field label="Site Manager" required>
            <TextInput value={form.manager} onChange={v => setForm(f => ({ ...f, manager: v }))} placeholder="e.g. James Chen" />
          </Field>
          <Field label="Site Supervisor">
            <TextInput value={form.siteSupervisor} onChange={v => setForm(f => ({ ...f, siteSupervisor: v }))} placeholder="e.g. Sarah Mitchell" />
          </Field>
          <Field label="Max Capacity">
            <TextInput type="number" value={form.maxCapacity} onChange={v => setForm(f => ({ ...f, maxCapacity: v }))} placeholder="e.g. 50" />
          </Field>
          <Field label="Status">
            <RadioGroup
              value={form.status}
              onChange={v => setForm(f => ({ ...f, status: v as SiteStatus }))}
              options={[
                { value: 'active',    label: 'Active' },
                { value: 'upcoming',  label: 'Upcoming' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
          </Field>
          <SubmitRow saving={saving} saved={saved} submitLabel="Add Site" savedLabel="Site Added!" onCancel={() => setDrawerOpen(false)} />
        </form>
      </Drawer>
    </div>
  )
}
