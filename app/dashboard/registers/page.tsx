'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Drawer, Field, TextInput, TextArea, Select, SubmitRow } from '@/components/ui/Drawer'
import { registers as initialRegisters } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  Plus, FlaskConical, AlertTriangle, Wrench, FileWarning,
  GraduationCap, Users, ChevronRight, X,
} from 'lucide-react'

type Register = typeof initialRegisters[number]

const iconMap: Record<string, React.ElementType> = {
  flask: FlaskConical,
  'alert-triangle': AlertTriangle,
  wrench: Wrench,
  'file-warning': FileWarning,
  'graduation-cap': GraduationCap,
  users: Users,
}

const colorPalette = [
  { icon: '#f97316', border: '#f97316' },
  { icon: '#ef4444', border: '#ef4444' },
  { icon: '#3b82f6', border: '#3b82f6' },
  { icon: '#f59e0b', border: '#f59e0b' },
  { icon: '#22c55e', border: '#22c55e' },
  { icon: '#a855f7', border: '#a855f7' },
]

const ICON_OPTIONS = ['flask', 'alert-triangle', 'wrench', 'file-warning', 'graduation-cap', 'users']
const BLANK_FORM = { name: '', description: '', icon: 'file-warning' }

export default function RegistersPage() {
  const [items, setItems]       = useState<Register[]>([...initialRegisters])
  const [showDrawer, setShowDrawer] = useState(false)
  const [viewRegister, setViewRegister] = useState<Register | null>(null)
  const [form, setForm]         = useState({ ...BLANK_FORM })
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newReg: Register = {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        icon: form.icon,
        entries: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: 'current' as const,
      }
      setItems(prev => [...prev, newReg])
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowDrawer(false); setForm({ ...BLANK_FORM }) }, 1200)
    }, 700)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Registers"
        description="Centralised compliance registers for your business"
        action={{ label: 'New Register', icon: <Plus size={14} />, onClick: () => { setForm({ ...BLANK_FORM }); setShowDrawer(true) } }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((register, idx) => {
          const Icon = iconMap[register.icon] ?? FileWarning
          const palette = colorPalette[idx % colorPalette.length]
          return (
            <button
              key={register.id}
              onClick={() => setViewRegister(register)}
              className="text-left p-5 group transition-all hover:bg-[var(--bg-hover)]"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${palette.border}`,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                    style={{ background: palette.icon + '18' }}
                  >
                    <Icon size={20} style={{ color: palette.icon }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{register.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{register.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-bold" style={{ color: 'var(--text)' }}>{register.entries}</span> entries
                      </span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Updated {formatDate(register.lastUpdated)}
                      </span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <StatusBadge status={register.status} />
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform mt-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Register Detail Drawer */}
      {viewRegister && (() => {
        const idx = items.findIndex(r => r.id === viewRegister.id)
        const palette = colorPalette[idx % colorPalette.length]
        const Icon = iconMap[viewRegister.icon] ?? FileWarning
        return (
          <Drawer
            open={!!viewRegister}
            onClose={() => setViewRegister(null)}
            title={viewRegister.name}
            subtitle={viewRegister.description}
          >
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4 p-4" style={{ background: palette.icon + '12', borderBottom: '1px solid var(--border)' }}>
                <div className="w-12 h-12 flex items-center justify-center" style={{ background: palette.icon + '20' }}>
                  <Icon size={22} style={{ color: palette.icon }} />
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ color: palette.icon }}>{viewRegister.entries}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>total entries</p>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Last Updated</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{formatDate(viewRegister.lastUpdated)}</p>
                </div>
                <div className="p-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Status</p>
                  <p className="font-semibold mt-0.5 capitalize" style={{ color: 'var(--text)' }}>{viewRegister.status}</p>
                </div>
              </div>

              {/* Mock entries table */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                  Recent Entries
                </p>
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--text)' }}>Entry #{viewRegister.entries - i + 1}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(Date.now() - i * 86400000 * 3).toLocaleDateString('en-AU')}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setViewRegister(null)}
                className="w-full py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
              >
                Close
              </button>
            </div>
          </Drawer>
        )
      })()}

      {/* New Register Drawer */}
      <Drawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="New Register"
        subtitle="Create a new compliance register"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Register Name" required>
            <TextInput value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Asbestos Register" />
          </Field>
          <Field label="Description">
            <TextArea value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Brief description of what this register tracks" rows={2} />
          </Field>
          <Field label="Icon">
            <Select
              value={form.icon}
              onChange={v => setForm(f => ({ ...f, icon: v }))}
              options={ICON_OPTIONS}
            />
          </Field>
          <SubmitRow saving={saving} saved={saved} submitLabel="Create Register" savedLabel="Register Created! ✓" onCancel={() => setShowDrawer(false)} />
        </form>
      </Drawer>
    </div>
  )
}
