'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { incidents, hazards, investigations } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  Plus, AlertTriangle, ShieldAlert, MapPin, User, CheckCircle2, Clock, Circle, Search,
} from 'lucide-react'
import {
  Drawer, Field, TextInput, TextArea, Select, RadioGroup, SubmitRow,
} from '@/components/ui/Drawer'

// ── Types ──────────────────────────────────────────────────────────────────────

type Incident = {
  id: string
  type: string
  date: string
  location: string
  severity: 'critical' | 'major' | 'minor' | 'near-miss'
  reportedBy: string
  status: 'open' | 'under-review' | 'closed'
}
type Hazard = {
  id: string
  description: string
  site: string
  category: 'fall' | 'slip-trip' | 'electrical' | 'plant' | 'chemical' | 'environment'
  likelihood: number
  consequence: number
  riskRating: 'low' | 'medium' | 'high'
  raisedBy: string
  raisedDate: string
  status: 'open' | 'in-progress' | 'closed'
  control: string
  assignedTo: string
}

// ── Config ─────────────────────────────────────────────────────────────────────

const severityConfig = {
  critical: { dot: 'bg-red-500', label: 'Critical', class: 'bg-red-100 text-red-700' },
  major: { dot: 'bg-orange-400', label: 'Major', class: 'bg-orange-100 text-orange-700' },
  minor: { dot: 'bg-amber-400', label: 'Minor', class: 'bg-amber-100 text-amber-700' },
  'near-miss': { dot: 'bg-blue-400', label: 'Near Miss', class: 'bg-blue-100 text-blue-700' },
}

const riskConfig = {
  high: { label: 'High', class: 'bg-red-100 text-red-700' },
  medium: { label: 'Medium', class: 'bg-amber-100 text-amber-700' },
  low: { label: 'Low', class: 'bg-green-100 text-green-700' },
}

const hazardStatusConfig = {
  open: { icon: AlertTriangle, class: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  'in-progress': { icon: Clock, class: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  closed: { icon: CheckCircle2, class: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
}

const categoryLabels: Record<string, string> = {
  fall: 'Fall / Height',
  'slip-trip': 'Slip / Trip',
  electrical: 'Electrical',
  plant: 'Plant & Equipment',
  chemical: 'Chemical',
  environment: 'Environment',
}

// ── Add Control inline form ────────────────────────────────────────────────────

function AddControlInline({
  hazardId,
  onSave,
  onCancel,
}: {
  hazardId: string
  onSave: (id: string, control: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState('')
  return (
    <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-2">
      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Add Control Measure</p>
      <TextArea
        value={value}
        onChange={setValue}
        placeholder="Describe the control measure…"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          onClick={() => { if (value.trim()) onSave(hazardId, value.trim()) }}
          className="px-3 py-1.5 text-xs font-semibold"
          style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

const invStatusDot = {
  'not-started': { color: '#94a3b8', label: 'Not Started', icon: Circle        },
  'in-progress': { color: '#f59e0b', label: 'In Progress', icon: Clock         },
  'complete':    { color: '#22c55e', label: 'Complete',    icon: CheckCircle2   },
}

export default function IncidentsPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'incidents' | 'hazards'>('incidents')

  // Lists
  const [incidentList, setIncidentList] = useState<Incident[]>([...incidents])
  const [hazardList, setHazardList] = useState<Hazard[]>([...hazards] as Hazard[])

  // Drawer
  const [showDrawer, setShowDrawer] = useState(false)

  // Incident form
  const [incidentForm, setIncidentForm] = useState({
    type: '', date: '', location: '', reportedBy: '', severity: 'minor', description: '',
  })

  // Hazard form
  const [hazardForm, setHazardForm] = useState({
    description: '', site: '', category: '', likelihood: '2', consequence: '2',
    control: '', raisedBy: '', riskRating: 'medium',
  })

  // Submit state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Add Control inline: tracks which hazard card has it open
  const [addControlId, setAddControlId] = useState<string | null>(null)

  // ── Derived counts ──────────────────────────────────────────────────────────
  const openHazards = hazardList.filter(h => h.status === 'open').length
  const openIncidents = incidentList.filter(
    i => i.status === 'open' || i.status === 'under-review',
  ).length

  // ── Handlers ────────────────────────────────────────────────────────────────

  function openDrawer() {
    setSaved(false)
    setSaving(false)
    if (tab === 'incidents') {
      setIncidentForm({ type: '', date: '', location: '', reportedBy: '', severity: 'minor', description: '' })
    } else {
      setHazardForm({ description: '', site: '', category: '', likelihood: '2', consequence: '2', control: '', raisedBy: '', riskRating: 'medium' })
    }
    setShowDrawer(true)
  }

  function closeDrawer() {
    setShowDrawer(false)
  }

  function handleIncidentSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newIncident: Incident = {
        id: `INC-${String(incidentList.length + 1).padStart(3, '0')}`,
        type: incidentForm.type,
        date: incidentForm.date,
        location: incidentForm.location,
        severity: incidentForm.severity as Incident['severity'],
        reportedBy: incidentForm.reportedBy,
        status: 'open',
      }
      setIncidentList(prev => [newIncident, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => {
        setShowDrawer(false)
        setSaved(false)
      }, 1200)
    }, 600)
  }

  function handleHazardSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const likelihood = parseInt(hazardForm.likelihood, 10)
      const consequence = parseInt(hazardForm.consequence, 10)
      const newHazard: Hazard = {
        id: `HAZ-${String(hazardList.length + 1).padStart(3, '0')}`,
        description: hazardForm.description,
        site: hazardForm.site,
        category: (hazardForm.category || 'environment') as Hazard['category'],
        likelihood,
        consequence,
        riskRating: hazardForm.riskRating as Hazard['riskRating'],
        raisedBy: hazardForm.raisedBy,
        raisedDate: new Date().toISOString().slice(0, 10),
        status: 'open',
        control: hazardForm.control,
        assignedTo: hazardForm.raisedBy,
      }
      setHazardList(prev => [newHazard, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => {
        setShowDrawer(false)
        setSaved(false)
      }, 1200)
    }, 600)
  }

  function cycleHazardStatus(id: string) {
    setHazardList(prev => prev.map(h => {
      if (h.id !== id) return h
      const next = ({ open: 'in-progress', 'in-progress': 'closed', closed: 'open' } as Record<string, string>)[h.status] ?? 'open'
      return { ...h, status: next as Hazard['status'] }
    }))
  }

  function saveControl(id: string, control: string) {
    setHazardList(prev => prev.map(h => h.id === id ? { ...h, control } : h))
    setAddControlId(null)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Incidents & Hazards"
        description="Report and manage workplace incidents, near misses and hazards"
        action={{
          label: tab === 'incidents' ? 'Report Incident' : 'Log Hazard',
          icon: <Plus size={14} />,
          onClick: openDrawer,
        }}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(severityConfig) as Array<keyof typeof severityConfig>).map((sev) => {
          const count = incidentList.filter(i => i.severity === sev).length
          const { dot, label } = severityConfig[sev]
          return (
            <Card key={sev} className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{label}</p>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white">{count}</p>
            </Card>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('incidents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'incidents' ? 'bg-white dark:bg-neutral-900 shadow-sm text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
        >
          <AlertTriangle size={14} />
          Incidents
          {openIncidents > 0 && (
            <span className={`text-[10px] font-bold rounded-full px-1.5 min-w-[18px] text-center ${tab === 'incidents' ? 'bg-black text-[var(--accent)]' : 'bg-neutral-200 text-neutral-600'}`}>
              {openIncidents}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('hazards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'hazards' ? 'bg-white dark:bg-neutral-900 shadow-sm text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
        >
          <ShieldAlert size={14} />
          Hazard Register
          {openHazards > 0 && (
            <span className={`text-[10px] font-bold rounded-full px-1.5 min-w-[18px] text-center ${tab === 'hazards' ? 'bg-black text-[var(--accent)]' : 'bg-neutral-200 text-neutral-600'}`}>
              {openHazards}
            </span>
          )}
        </button>
      </div>

      {/* Incidents Tab */}
      {tab === 'incidents' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Incident</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Reported By</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Severity</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Investigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {incidentList.map((incident) => {
                  const { dot, label, class: cls } = severityConfig[incident.severity]
                  const inv = investigations[incident.id]
                  const invStatus = inv?.status ?? 'not-started'
                  const invDot = invStatusDot[invStatus]
                  const InvIcon = invDot.icon
                  return (
                    <tr
                      key={incident.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/dashboard/incidents/${incident.id}`)}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">{incident.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className="text-neutral-400 flex-shrink-0" />
                          <span className="font-medium text-black dark:text-white">{incident.type}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-neutral-600 dark:text-neutral-300 text-xs flex items-center gap-1">
                          <MapPin size={11} />{incident.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 text-xs">{formatDate(incident.date)}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-neutral-600 dark:text-neutral-300 text-xs flex items-center gap-1">
                          <User size={11} />{incident.reportedBy}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit ${cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={incident.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold"
                          style={{ color: invDot.color, background: invDot.color + '18', border: `1px solid ${invDot.color}40` }}
                        >
                          <InvIcon size={10} />
                          {invDot.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Hazard Register Tab */}
      {tab === 'hazards' && (
        <div className="space-y-3">
          {hazardList.map((hazard) => {
            const risk = riskConfig[hazard.riskRating]
            const statusCfg = hazardStatusConfig[hazard.status]
            const StatusIcon = statusCfg.icon
            const riskScore = hazard.likelihood * hazard.consequence

            return (
              <Card key={hazard.id} className="p-5 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${statusCfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon size={18} className={statusCfg.class} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-black dark:text-white">{hazard.description}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${risk.class}`}>
                            {risk.label} Risk
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                          <MapPin size={11} />{hazard.site}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          hazard.status === 'open' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                          hazard.status === 'in-progress' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                          'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        }`}>
                          {hazard.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
                      <div>
                        <p className="text-neutral-400 mb-0.5">Category</p>
                        <p className="font-semibold text-black dark:text-white">{categoryLabels[hazard.category] ?? hazard.category}</p>
                      </div>
                      <div>
                        <p className="text-neutral-400 mb-0.5">Risk Score</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-sm ${riskScore >= 12 ? 'text-red-600 dark:text-red-400' : riskScore >= 6 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                            {riskScore}
                          </span>
                          <span className="text-neutral-400">({hazard.likelihood} × {hazard.consequence})</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-neutral-400 mb-0.5">Raised By</p>
                        <p className="font-semibold text-black dark:text-white">{hazard.raisedBy}</p>
                      </div>
                      <div>
                        <p className="text-neutral-400 mb-0.5">Date Raised</p>
                        <p className="font-semibold text-black dark:text-white">{formatDate(hazard.raisedDate)}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-xs text-neutral-400 mb-0.5">Control Measure</p>
                      <p className="text-xs font-medium text-black dark:text-white">{hazard.control}</p>
                      <p className="text-xs text-neutral-400 mt-1">Assigned to: <span className="font-semibold text-black dark:text-white">{hazard.assignedTo}</span></p>
                    </div>

                    {addControlId === hazard.id && (
                      <AddControlInline
                        hazardId={hazard.id}
                        onSave={saveControl}
                        onCancel={() => setAddControlId(null)}
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="text-xs h-7"
                    onClick={(e) => { e.stopPropagation(); cycleHazardStatus(hazard.id) }}
                  >
                    Update Status
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAddControlId(prev => prev === hazard.id ? null : hazard.id)
                    }}
                  >
                    Add Control
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7">Link to Incident</Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* ── Drawer ──────────────────────────────────────────────────────────── */}
      <Drawer
        open={showDrawer}
        onClose={closeDrawer}
        title={tab === 'incidents' ? 'Report Incident' : 'Log Hazard'}
        subtitle={tab === 'incidents' ? 'Record a workplace incident or near miss' : 'Add a new hazard to the register'}
      >
        {tab === 'incidents' ? (
          <form onSubmit={handleIncidentSubmit} className="space-y-4">
            <Field label="Incident Type" required>
              <TextInput
                value={incidentForm.type}
                onChange={v => setIncidentForm(f => ({ ...f, type: v }))}
                placeholder="e.g. Fall from height, Equipment failure"
              />
            </Field>
            <Field label="Date" required>
              <TextInput
                type="date"
                value={incidentForm.date}
                onChange={v => setIncidentForm(f => ({ ...f, date: v }))}
              />
            </Field>
            <Field label="Location" required>
              <TextInput
                value={incidentForm.location}
                onChange={v => setIncidentForm(f => ({ ...f, location: v }))}
                placeholder="e.g. Site A – Level 3"
              />
            </Field>
            <Field label="Reported By" required>
              <TextInput
                value={incidentForm.reportedBy}
                onChange={v => setIncidentForm(f => ({ ...f, reportedBy: v }))}
                placeholder="Full name"
              />
            </Field>
            <Field label="Severity">
              <RadioGroup
                value={incidentForm.severity}
                onChange={v => setIncidentForm(f => ({ ...f, severity: v }))}
                options={[
                  { value: 'critical', label: 'Critical' },
                  { value: 'major', label: 'Major' },
                  { value: 'minor', label: 'Minor' },
                  { value: 'near-miss', label: 'Near Miss' },
                ]}
                colorMap={{
                  critical: '#ef4444',
                  major: '#f97316',
                  minor: '#f59e0b',
                  'near-miss': '#3b82f6',
                }}
              />
            </Field>
            <Field label="Description">
              <TextArea
                value={incidentForm.description}
                onChange={v => setIncidentForm(f => ({ ...f, description: v }))}
                placeholder="Describe what happened…"
                rows={4}
              />
            </Field>
            <SubmitRow
              saving={saving}
              saved={saved}
              submitLabel="Report Incident"
              savedLabel="Incident Reported!"
              onCancel={closeDrawer}
            />
          </form>
        ) : (
          <form onSubmit={handleHazardSubmit} className="space-y-4">
            <Field label="Description" required>
              <TextInput
                value={hazardForm.description}
                onChange={v => setHazardForm(f => ({ ...f, description: v }))}
                placeholder="Describe the hazard…"
              />
            </Field>
            <Field label="Site" required>
              <TextInput
                value={hazardForm.site}
                onChange={v => setHazardForm(f => ({ ...f, site: v }))}
                placeholder="e.g. Site A – George St"
              />
            </Field>
            <Field label="Category">
              <Select
                value={hazardForm.category}
                onChange={v => setHazardForm(f => ({ ...f, category: v }))}
                options={[
                  { value: 'fall', label: 'Fall / Height' },
                  { value: 'slip-trip', label: 'Slip / Trip' },
                  { value: 'electrical', label: 'Electrical' },
                  { value: 'plant', label: 'Plant & Equipment' },
                  { value: 'chemical', label: 'Chemical' },
                  { value: 'environment', label: 'Environment' },
                ]}
                placeholder="Select category…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Likelihood">
                <Select
                  value={hazardForm.likelihood}
                  onChange={v => setHazardForm(f => ({ ...f, likelihood: v }))}
                  options={['1', '2', '3', '4', '5']}
                />
              </Field>
              <Field label="Consequence">
                <Select
                  value={hazardForm.consequence}
                  onChange={v => setHazardForm(f => ({ ...f, consequence: v }))}
                  options={['1', '2', '3', '4', '5']}
                />
              </Field>
            </div>
            <Field label="Control Measure">
              <TextArea
                value={hazardForm.control}
                onChange={v => setHazardForm(f => ({ ...f, control: v }))}
                placeholder="Describe the control measure…"
              />
            </Field>
            <Field label="Raised By">
              <TextInput
                value={hazardForm.raisedBy}
                onChange={v => setHazardForm(f => ({ ...f, raisedBy: v }))}
                placeholder="Full name"
              />
            </Field>
            <Field label="Risk Rating">
              <RadioGroup
                value={hazardForm.riskRating}
                onChange={v => setHazardForm(f => ({ ...f, riskRating: v }))}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
                colorMap={{
                  low: '#22c55e',
                  medium: '#f59e0b',
                  high: '#ef4444',
                }}
              />
            </Field>
            <SubmitRow
              saving={saving}
              saved={saved}
              submitLabel="Log Hazard"
              savedLabel="Hazard Logged!"
              onCancel={closeDrawer}
            />
          </form>
        )}
      </Drawer>
    </div>
  )
}
