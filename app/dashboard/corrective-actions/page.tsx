'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Drawer, Field, TextInput, TextArea, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { correctiveActions } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Plus, Wrench, CheckCircle, AlertTriangle, Loader, CheckCircle2, Clock } from 'lucide-react'

const priorityConfig = {
  high:   { dot: 'bg-red-400',   label: 'High',   text: 'text-red-600 dark:text-red-400'     },
  medium: { dot: 'bg-amber-400', label: 'Medium', text: 'text-amber-600 dark:text-amber-400' },
  low:    { dot: 'bg-blue-400',  label: 'Low',    text: 'text-blue-600 dark:text-blue-400'   },
}

type Action = {
  id: string
  action: string
  relatedIncident: string
  assignedTo: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'completed' | 'overdue'
}

interface FormState {
  description: string
  assignedTo: string
  dueDate: string
  priority: string
  relatedIncident: string
}

const emptyForm = (): FormState => ({
  description: '',
  assignedTo: '',
  dueDate: '',
  priority: 'medium',
  relatedIncident: '',
})

type FilterStatus = 'all' | 'open' | 'in-progress' | 'overdue' | 'completed'

export default function CorrectiveActionsPage() {
  const [actions, setActions] = useState<Action[]>([...correctiveActions])
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const open       = actions.filter((a) => a.status === 'open').length
  const inProgress = actions.filter((a) => a.status === 'in-progress').length
  const completed  = actions.filter((a) => a.status === 'completed').length
  const overdue    = actions.filter((a) => a.status === 'overdue').length

  const filtered = filter === 'all' ? actions : actions.filter(a => a.status === filter)

  function openDrawer() {
    setForm(emptyForm())
    setSaved(false)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
  }

  function markComplete(id: string) {
    setActions((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: 'completed' as const } : a)
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description || !form.assignedTo || !form.dueDate) return
    setSaving(true)
    setTimeout(() => {
      const newAction: Action = {
        id: `CA-${String(actions.length + 1).padStart(3, '0')}`,
        action: form.description,
        relatedIncident: form.relatedIncident,
        assignedTo: form.assignedTo,
        dueDate: form.dueDate,
        priority: form.priority as Action['priority'],
        status: 'open' as const,
      }
      setActions((prev) => [newAction, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => {
        setDrawerOpen(false)
        setSaved(false)
      }, 900)
    }, 600)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Corrective Actions"
        description="Track and resolve identified compliance issues"
        action={{ label: 'New Action', icon: <Plus size={14} />, onClick: openDrawer }}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open',        value: open,        color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: AlertTriangle  },
          { label: 'In Progress', value: inProgress,  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  icon: Loader         },
          { label: 'Overdue',     value: overdue,     color: '#f97316', bg: 'rgba(249,115,22,0.1)',  icon: Clock          },
          { label: 'Completed',   value: completed,   color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   icon: CheckCircle2   },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {(
          [
            { key: 'all',         label: 'All',         count: actions.length },
            { key: 'open',        label: 'Open',        count: open           },
            { key: 'in-progress', label: 'In Progress', count: inProgress     },
            { key: 'overdue',     label: 'Overdue',     count: overdue        },
            { key: 'completed',   label: 'Completed',   count: completed      },
          ] as { key: FilterStatus; label: string; count: number }[]
        ).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-5 py-2.5 text-sm font-medium transition-colors relative flex items-center gap-1.5"
            style={{
              color: filter === key ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: filter === key ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {label}
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none"
              style={
                filter === key
                  ? { background: 'var(--accent)', color: 'var(--accent-text)' }
                  : { background: 'var(--bg-secondary)', color: 'var(--text-muted)' }
              }
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['ID', 'Action', 'Related Incident', 'Assigned To', 'Due Date', 'Priority', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((action) => {
                const { dot, label, text } = priorityConfig[action.priority]
                return (
                  <tr
                    key={action.id}
                    className="group transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {action.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Wrench size={13} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0" />
                        <span className="font-medium" style={{ color: 'var(--text)' }}>{action.action}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {action.relatedIncident ? (
                        <span className="font-mono text-xs font-semibold text-blue-500">{action.relatedIncident}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>{action.assignedTo}</td>
                    <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>{formatDate(action.dueDate)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${dot}`} />
                        <span className={`text-sm font-semibold ${text}`}>{label}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={action.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      {action.status !== 'completed' && (
                        <button
                          onClick={() => markComplete(action.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-green-50 dark:hover:bg-green-900/20"
                          style={{ color: '#22c55e', border: '1px solid #22c55e' }}
                        >
                          <CheckCircle size={11} />
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Action Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title="New Corrective Action"
        subtitle="Log a corrective action to resolve a compliance issue"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Action Description" required>
            <TextArea
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Describe the corrective action required…"
              rows={3}
            />
          </Field>

          <Field label="Assigned To" required>
            <TextInput
              value={form.assignedTo}
              onChange={(v) => setForm((f) => ({ ...f, assignedTo: v }))}
              placeholder="e.g. James Chen"
            />
          </Field>

          <Field label="Due Date" required>
            <TextInput
              type="date"
              value={form.dueDate}
              onChange={(v) => setForm((f) => ({ ...f, dueDate: v }))}
            />
          </Field>

          <Field label="Priority">
            <RadioGroup
              value={form.priority}
              onChange={(v) => setForm((f) => ({ ...f, priority: v }))}
              options={[
                { value: 'high',   label: 'High'   },
                { value: 'medium', label: 'Medium' },
                { value: 'low',    label: 'Low'    },
              ]}
              colorMap={{ high: '#ef4444', medium: '#f59e0b', low: '#60a5fa' }}
            />
          </Field>

          <Field label="Related Incident">
            <TextInput
              value={form.relatedIncident}
              onChange={(v) => setForm((f) => ({ ...f, relatedIncident: v }))}
              placeholder="e.g. INC-001 (optional)"
            />
          </Field>

          <SubmitRow
            saving={saving}
            saved={saved}
            submitLabel="Create Action"
            savedLabel="Created!"
            onCancel={closeDrawer}
          />
        </form>
      </Drawer>
    </div>
  )
}
