'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import {
  incidents, investigations, CONTRIBUTING_FACTORS,
  IncidentInvestigation, InvAction, InvestigationWitness, CausalClass,
} from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  ArrowLeft, AlertTriangle, MapPin, User, Calendar, CheckCircle2,
  Clock, Circle, ClipboardList, Search, Users, ShieldCheck,
  PenLine, Plus, X, Check, Save, ChevronRight, AlertCircle,
  FileWarning, Stethoscope, HardHat, BarChart2, BookOpen,
} from 'lucide-react'
import { Drawer, Field, TextInput, TextArea, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'

// ─── Config ──────────────────────────────────────────────────────────────────

const severityConfig = {
  critical:   { label: 'Critical',  color: '#ef4444', bg: '#ef444418' },
  major:      { label: 'Major',     color: '#f97316', bg: '#f9731618' },
  minor:      { label: 'Minor',     color: '#f59e0b', bg: '#f59e0b18' },
  'near-miss':{ label: 'Near Miss', color: '#3b82f6', bg: '#3b82f618' },
}

const statusConfig = {
  open:          { label: 'Open',          color: '#ef4444', bg: '#ef444418' },
  'under-review':{ label: 'Under Review',  color: '#f59e0b', bg: '#f59e0b18' },
  closed:        { label: 'Closed',        color: '#22c55e', bg: '#22c55e18' },
}

const invStatusConfig = {
  'not-started': { label: 'Not Started',   color: '#94a3b8', bg: '#94a3b818', icon: Circle       },
  'in-progress': { label: 'In Progress',   color: '#f59e0b', bg: '#f59e0b18', icon: Clock        },
  'complete':    { label: 'Complete',      color: '#22c55e', bg: '#22c55e18', icon: CheckCircle2  },
}

const causalOptions: { value: CausalClass; label: string }[] = [
  { value: 'human-error',       label: 'Human Error / Unsafe Behaviour' },
  { value: 'equipment',         label: 'Equipment / Plant Failure'       },
  { value: 'environment',       label: 'Environmental Conditions'        },
  { value: 'management-system', label: 'Management System Failure'       },
  { value: 'multiple',          label: 'Multiple Causes'                 },
]

const treatmentOptions = [
  { value: 'none',              label: 'No treatment required' },
  { value: 'first-aid',         label: 'First aid on site'     },
  { value: 'medical-treatment', label: 'Medical treatment'     },
  { value: 'hospital',          label: 'Hospital / ED'         },
]

const actionStatusCfg = {
  open:        { color: '#ef4444', bg: '#ef444418', label: 'Open'        },
  'in-progress': { color: '#f59e0b', bg: '#f59e0b18', label: 'In Progress' },
  completed:   { color: '#22c55e', bg: '#22c55e18', label: 'Completed'   },
}

type Tab = 'overview' | 'investigation' | 'actions' | 'signoff'

const TABS: { key: Tab; label: string; icon: typeof ClipboardList }[] = [
  { key: 'overview',     label: 'Overview',         icon: ClipboardList },
  { key: 'investigation',label: 'Root Cause',       icon: Search        },
  { key: 'actions',      label: 'Actions',          icon: ShieldCheck   },
  { key: 'signoff',      label: 'Sign-off',         icon: PenLine       },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IncidentInvestigationPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const incident = incidents.find(i => i.id === id)
  const [inv, setInv] = useState<IncidentInvestigation>(
    investigations[id] ?? {
      incidentId: id,
      status: 'not-started' as const,
      investigatedBy: '', investigationDate: '',
      description: '', immediateActions: '',
      witnesses: [],
      injury: { anyInjury: false, personName: '', natureOfInjury: '', bodyPart: '', treatmentType: 'none' as const, lostTime: false, lostTimeDays: 0 },
      whys: Array.from({ length: 5 }, (_, i) => ({ why: `Why ${i + 1}?`, answer: '' })),
      immediateCause: '', underlyingCause: '', rootCause: '',
      contributingFactors: [], causalClassification: 'human-error' as const,
      revisedLikelihood: 2, revisedConsequence: 2,
      actions: [], preventiveMeasures: '',
      notifiable: false, notifiedBody: '', notificationDate: '', notificationRef: '',
      workerConsulted: false, managerSignOff: '', signOffDate: '',
    }
  )

  const [tab, setTab] = useState<Tab>('overview')
  const [saved, setSaved] = useState<Tab | null>(null)
  const [addWitnessOpen, setAddWitnessOpen] = useState(false)
  const [newWitness, setNewWitness] = useState<InvestigationWitness>({ name: '', role: '', statement: '' })
  const [witnessSaving, setWitnessSaving] = useState(false)
  const [witnessSaved, setWitnessSaved] = useState(false)
  const [addActionOpen, setAddActionOpen] = useState(false)
  const [newAction, setNewAction] = useState({ description: '', type: 'corrective', assignedTo: '', dueDate: '' })
  const [actionSaving, setActionSaving] = useState(false)
  const [actionSaved, setActionSaved] = useState(false)

  if (!incident) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Incident not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm underline" style={{ color: 'var(--accent)' }}>Go back</button>
      </div>
    )
  }

  const sevCfg  = severityConfig[incident.severity]
  const statCfg = statusConfig[incident.status]
  const invCfg  = invStatusConfig[inv.status]
  const InvIcon = invCfg.icon

  // ── Progress: which sections have meaningful content
  const sectionComplete = {
    overview:     !!(inv.description && inv.immediateActions),
    investigation:!!(inv.rootCause && inv.immediateCause),
    actions:      inv.actions.length > 0,
    signoff:      !!(inv.managerSignOff && inv.signOffDate),
  }
  const completedCount = Object.values(sectionComplete).filter(Boolean).length

  // ── Helpers
  function update(patch: Partial<IncidentInvestigation>) {
    setInv(prev => ({ ...prev, ...patch }))
  }

  function saveSection(t: Tab) {
    // Derive new status
    const now = { ...sectionComplete }
    const anyFilled = inv.description || inv.rootCause || inv.actions.length > 0 || inv.managerSignOff
    const allFilled = inv.description && inv.immediateActions && inv.rootCause && inv.immediateCause && inv.actions.length > 0 && inv.managerSignOff && inv.signOffDate
    const newStatus: IncidentInvestigation['status'] = allFilled ? 'complete' : anyFilled ? 'in-progress' : 'not-started'
    setInv(prev => ({ ...prev, status: newStatus }))
    setSaved(t)
    setTimeout(() => setSaved(null), 2000)
  }

  function toggleFactor(factor: string) {
    setInv(prev => ({
      ...prev,
      contributingFactors: prev.contributingFactors.includes(factor)
        ? prev.contributingFactors.filter(f => f !== factor)
        : [...prev.contributingFactors, factor],
    }))
  }

  function handleAddWitness(e: React.FormEvent) {
    e.preventDefault()
    setWitnessSaving(true)
    setTimeout(() => {
      setInv(prev => ({ ...prev, witnesses: [...prev.witnesses, { ...newWitness }] }))
      setWitnessSaving(false)
      setWitnessSaved(true)
      setTimeout(() => { setWitnessSaved(false); setAddWitnessOpen(false); setNewWitness({ name: '', role: '', statement: '' }) }, 1000)
    }, 500)
  }

  function handleAddAction(e: React.FormEvent) {
    e.preventDefault()
    setActionSaving(true)
    setTimeout(() => {
      const action: InvAction = {
        id: `inv-${Date.now()}`,
        description: newAction.description,
        type: newAction.type as InvAction['type'],
        assignedTo: newAction.assignedTo,
        dueDate: newAction.dueDate,
        status: 'open',
      }
      setInv(prev => ({ ...prev, actions: [...prev.actions, action] }))
      setActionSaving(false)
      setActionSaved(true)
      setTimeout(() => { setActionSaved(false); setAddActionOpen(false); setNewAction({ description: '', type: 'corrective', assignedTo: '', dueDate: '' }) }, 1000)
    }, 500)
  }

  function cycleActionStatus(actionId: string) {
    setInv(prev => ({
      ...prev,
      actions: prev.actions.map(a => {
        if (a.id !== actionId) return a
        const next = ({ open: 'in-progress', 'in-progress': 'completed', completed: 'open' } as Record<string, string>)[a.status]
        return { ...a, status: next as InvAction['status'] }
      }),
    }))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Back */}
      <button
        onClick={() => router.push('/dashboard/incidents')}
        className="flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={14} /> Back to Incidents
      </button>

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 flex items-center justify-center flex-shrink-0"
              style={{ background: sevCfg.bg }}
            >
              <AlertTriangle size={24} style={{ color: sevCfg.color }} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-lg font-bold" style={{ color: 'var(--text)' }}>{incident.id}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5" style={{ background: sevCfg.bg, color: sevCfg.color, border: `1px solid ${sevCfg.color}40` }}>
                  {sevCfg.label}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5" style={{ background: statCfg.bg, color: statCfg.color, border: `1px solid ${statCfg.color}40` }}>
                  {statCfg.label}
                </span>
              </div>
              <p className="text-base font-semibold mt-1" style={{ color: 'var(--text)' }}>{incident.type}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><MapPin size={11} />{incident.location}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(incident.date)}</span>
                <span className="flex items-center gap-1"><User size={11} />Reported by {incident.reportedBy}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ background: invCfg.bg, border: `1px solid ${invCfg.color}40` }}
            >
              <InvIcon size={13} style={{ color: invCfg.color }} />
              <span className="text-xs font-semibold" style={{ color: invCfg.color }}>
                Investigation {invCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-0">
            {TABS.map(({ key, label, icon: Icon }, i) => {
              const done = sectionComplete[key]
              const isActive = tab === key
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-2 transition-colors relative"
                  style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center transition-all"
                    style={{
                      background: done ? '#22c55e18' : isActive ? 'var(--accent)' : 'var(--bg-secondary)',
                      border: `2px solid ${done ? '#22c55e' : isActive ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    {done
                      ? <Check size={13} style={{ color: '#22c55e' }} />
                      : <Icon size={13} style={{ color: isActive ? '#000' : 'var(--text-muted)' }} />
                    }
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: isActive ? 'var(--text)' : 'var(--text-muted)' }}>
                    {label}
                  </span>
                  {i < TABS.length - 1 && (
                    <div
                      className="absolute top-5 left-[calc(50%+16px)] right-0 h-px"
                      style={{ background: done ? '#22c55e40' : 'var(--border)' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            {completedCount} of 4 sections complete
          </p>
        </div>
      </Card>

      {/* Tabs nav */}
      <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-colors"
            style={{
              color: tab === key ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: tab === key ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none', cursor: 'pointer', marginBottom: '-1px',
            }}
          >
            <Icon size={13} />{label}
            {sectionComplete[key] && (
              <Check size={10} style={{ color: '#22c55e' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ────────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {inv.status === 'not-started' && (
            <div
              className="flex items-start gap-3 p-4"
              style={{ background: '#3b82f615', border: '1px solid #3b82f640' }}
            >
              <FileWarning size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#3b82f6' }}>Investigation not yet started</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Complete the fields below to begin this investigation. All sections must be completed before the investigation can be signed off.
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-5">

              {/* Investigation Details */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                  Investigation Details
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Investigated By <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        className="w-full px-3 py-2 text-sm outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={inv.investigatedBy}
                        onChange={e => update({ investigatedBy: e.target.value })}
                        placeholder="Manager's name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Investigation Date <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 text-sm outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={inv.investigationDate}
                        onChange={e => update({ investigationDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Full Description of Incident <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 text-sm outline-none resize-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      value={inv.description}
                      onChange={e => update({ description: e.target.value })}
                      placeholder="Describe exactly what happened, the sequence of events, and the conditions at the time…"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Immediate Actions Taken <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 text-sm outline-none resize-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      value={inv.immediateActions}
                      onChange={e => update({ immediateActions: e.target.value })}
                      placeholder="What was done immediately after the incident to make the area safe and assist those involved…"
                    />
                  </div>
                </div>
              </Card>

              {/* Injury / Illness */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope size={14} style={{ color: 'var(--text-muted)' }} />
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Injury / Illness Details
                  </p>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      className="w-5 h-5 flex items-center justify-center flex-shrink-0 cursor-pointer"
                      style={{
                        background: inv.injury.anyInjury ? 'var(--accent)' : 'var(--bg-secondary)',
                        border: `2px solid ${inv.injury.anyInjury ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                      onClick={() => update({ injury: { ...inv.injury, anyInjury: !inv.injury.anyInjury } })}
                    >
                      {inv.injury.anyInjury && <Check size={11} style={{ color: '#000' }} />}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>An injury or illness occurred</span>
                  </label>

                  {inv.injury.anyInjury && (
                    <div className="space-y-4 pl-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Person Injured</label>
                          <input
                            className="w-full px-3 py-2 text-sm outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            value={inv.injury.personName}
                            onChange={e => update({ injury: { ...inv.injury, personName: e.target.value } })}
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Body Part Affected</label>
                          <input
                            className="w-full px-3 py-2 text-sm outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            value={inv.injury.bodyPart}
                            onChange={e => update({ injury: { ...inv.injury, bodyPart: e.target.value } })}
                            placeholder="e.g. Left knee"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nature of Injury</label>
                        <input
                          className="w-full px-3 py-2 text-sm outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                          value={inv.injury.natureOfInjury}
                          onChange={e => update({ injury: { ...inv.injury, natureOfInjury: e.target.value } })}
                          placeholder="e.g. Laceration, bruising, sprain"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Treatment Type</label>
                        <div className="flex flex-wrap gap-2">
                          {treatmentOptions.map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => update({ injury: { ...inv.injury, treatmentType: opt.value as any } })}
                              className="px-3 py-1.5 text-xs font-medium transition-colors"
                              style={{
                                background: inv.injury.treatmentType === opt.value ? 'var(--accent)' : 'var(--bg-secondary)',
                                color: inv.injury.treatmentType === opt.value ? '#000' : 'var(--text-secondary)',
                                border: `1px solid ${inv.injury.treatmentType === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div
                          className="w-5 h-5 flex items-center justify-center flex-shrink-0 cursor-pointer"
                          style={{
                            background: inv.injury.lostTime ? 'var(--accent)' : 'var(--bg-secondary)',
                            border: `2px solid ${inv.injury.lostTime ? 'var(--accent)' : 'var(--border)'}`,
                          }}
                          onClick={() => update({ injury: { ...inv.injury, lostTime: !inv.injury.lostTime } })}
                        >
                          {inv.injury.lostTime && <Check size={11} style={{ color: '#000' }} />}
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text)' }}>Lost time injury (LTI)</span>
                        {inv.injury.lostTime && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              className="w-16 px-2 py-1 text-sm outline-none text-center"
                              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                              value={inv.injury.lostTimeDays}
                              onChange={e => update({ injury: { ...inv.injury, lostTimeDays: parseInt(e.target.value) || 0 } })}
                            />
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>days</span>
                          </div>
                        )}
                      </label>
                    </div>
                  )}
                </div>
              </Card>

            </div>

            {/* Right: Witnesses */}
            <div className="space-y-5">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={13} style={{ color: 'var(--text-muted)' }} />
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Witnesses
                    </p>
                  </div>
                  <button
                    onClick={() => setAddWitnessOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    <Plus size={10} /> Add
                  </button>
                </div>
                {inv.witnesses.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No witnesses recorded</p>
                ) : (
                  <div className="space-y-3">
                    {inv.witnesses.map((w, i) => (
                      <div
                        key={i}
                        className="p-3 relative group"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                      >
                        <button
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setInv(prev => ({ ...prev, witnesses: prev.witnesses.filter((_, idx) => idx !== i) }))}
                          style={{ color: '#ef4444' }}
                        >
                          <X size={11} />
                        </button>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{w.name}</p>
                        <p className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>{w.role}</p>
                        {w.statement && (
                          <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            "{w.statement}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          <SaveBar tab="overview" saved={saved} onSave={() => saveSection('overview')} />
        </div>
      )}

      {/* ── ROOT CAUSE TAB ─────────────────────────────────────────────────── */}
      {tab === 'investigation' && (
        <div className="space-y-5">

          {/* 5 Whys */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>5 Whys Analysis</p>
            </div>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
              Start with the incident and ask "Why?" five times to drill down to the root cause.
            </p>
            <div className="space-y-4">
              {inv.whys.map((w, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className="w-7 h-7 flex items-center justify-center font-bold text-xs"
                      style={{
                        background: w.answer ? 'var(--accent)' : 'var(--bg-secondary)',
                        color: w.answer ? '#000' : 'var(--text-muted)',
                        border: `2px solid ${w.answer ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < 4 && (
                      <div className="w-px h-4 mt-1" style={{ background: 'var(--border)' }} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        {w.why}
                      </label>
                      <input
                        className="w-full px-3 py-2 text-sm outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={w.answer}
                        onChange={e => {
                          const whys = [...inv.whys]
                          whys[i] = { ...whys[i], answer: e.target.value }
                          update({ whys })
                        }}
                        placeholder="Because…"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Cause classification */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
              Cause Analysis
            </p>
            <div className="space-y-4">
              {[
                { key: 'immediateCause',  label: 'Immediate Cause',    hint: 'The direct act or condition that caused the incident', required: true },
                { key: 'underlyingCause', label: 'Underlying Cause',   hint: 'Contributing factors behind the immediate cause',     required: true },
                { key: 'rootCause',       label: 'Root Cause',         hint: 'The fundamental systemic reason the incident occurred', required: true },
              ].map(({ key, label, hint, required }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>
                  <p className="text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>{hint}</p>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 text-sm outline-none resize-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    value={inv[key as 'immediateCause' | 'underlyingCause' | 'rootCause']}
                    onChange={e => update({ [key]: e.target.value })}
                    placeholder={`Describe the ${label.toLowerCase()}…`}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Contributing Factors */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
              Contributing Factors
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Select all that contributed to this incident.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CONTRIBUTING_FACTORS.map(factor => {
                const selected = inv.contributingFactors.includes(factor)
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => toggleFactor(factor)}
                    className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-left transition-colors"
                    style={{
                      background: selected ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: selected ? '#000' : 'var(--text-secondary)',
                      border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    <div
                      className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: selected ? '#00000020' : 'var(--bg)',
                        border: `1px solid ${selected ? '#00000030' : 'var(--border)'}`,
                      }}
                    >
                      {selected && <Check size={9} style={{ color: '#000' }} />}
                    </div>
                    {factor}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Causal Classification + revised risk */}
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                Causal Classification
              </p>
              <div className="space-y-2">
                {causalOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update({ causalClassification: opt.value })}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors"
                    style={{
                      background: inv.causalClassification === opt.value ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: inv.causalClassification === opt.value ? '#000' : 'var(--text-secondary)',
                      border: `1px solid ${inv.causalClassification === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    <div
                      className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: inv.causalClassification === opt.value ? '#00000020' : 'var(--bg)',
                        border: `1px solid ${inv.causalClassification === opt.value ? '#00000030' : 'var(--border)'}`,
                        borderRadius: '50%',
                      }}
                    >
                      {inv.causalClassification === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
                Post-Investigation Risk Rating
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Re-assess the risk likelihood and consequence after controls are applied.
              </p>
              <div className="space-y-4">
                {[
                  { key: 'revisedLikelihood', label: 'Likelihood (1–5)' },
                  { key: 'revisedConsequence', label: 'Consequence (1–5)' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => {
                        const val = inv[key as 'revisedLikelihood' | 'revisedConsequence']
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => update({ [key]: n })}
                            className="w-9 h-9 text-sm font-bold transition-colors"
                            style={{
                              background: val === n ? (n >= 4 ? '#ef4444' : n === 3 ? '#f59e0b' : '#22c55e') : 'var(--bg-secondary)',
                              color: val === n ? '#fff' : 'var(--text-muted)',
                              border: `1px solid ${val === n ? 'transparent' : 'var(--border)'}`,
                            }}
                          >
                            {n}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <div
                  className="p-3 text-center"
                  style={{
                    background: (() => {
                      const score = inv.revisedLikelihood * inv.revisedConsequence
                      return score >= 12 ? '#ef444418' : score >= 6 ? '#f59e0b18' : '#22c55e18'
                    })(),
                  }}
                >
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Risk Score</p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color: (() => {
                        const score = inv.revisedLikelihood * inv.revisedConsequence
                        return score >= 12 ? '#ef4444' : score >= 6 ? '#f59e0b' : '#22c55e'
                      })(),
                    }}
                  >
                    {inv.revisedLikelihood * inv.revisedConsequence}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {inv.revisedLikelihood} × {inv.revisedConsequence}
                    {' · '}
                    {inv.revisedLikelihood * inv.revisedConsequence >= 12 ? 'High' : inv.revisedLikelihood * inv.revisedConsequence >= 6 ? 'Medium' : 'Low'} Risk
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <SaveBar tab="investigation" saved={saved} onSave={() => saveSection('investigation')} />
        </div>
      )}

      {/* ── ACTIONS TAB ────────────────────────────────────────────────────── */}
      {tab === 'actions' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Corrective & Preventive Actions</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {inv.actions.length} action{inv.actions.length !== 1 ? 's' : ''} · {inv.actions.filter(a => a.status === 'completed').length} completed
              </p>
            </div>
            <button
              onClick={() => setAddActionOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black"
              style={{ background: 'var(--accent)' }}
            >
              <Plus size={12} /> Add Action
            </button>
          </div>

          {inv.actions.length === 0 ? (
            <Card className="py-12 text-center">
              <ShieldCheck size={28} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No actions recorded yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add corrective or preventive actions to address the root cause.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {(['corrective', 'preventive'] as const).map(type => {
                const typeActions = inv.actions.filter(a => a.type === type)
                if (typeActions.length === 0) return null
                return (
                  <div key={type}>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1"
                      style={{ color: type === 'corrective' ? '#ef4444' : '#3b82f6' }}
                    >
                      {type === 'corrective' ? 'Corrective Actions' : 'Preventive Actions'}
                    </p>
                    <div className="space-y-2">
                      {typeActions.map(action => {
                        const aCfg = actionStatusCfg[action.status]
                        return (
                          <Card key={action.id} className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{action.description}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                                  <span className="flex items-center gap-1"><User size={10} />{action.assignedTo || '—'}</span>
                                  <span className="flex items-center gap-1"><Calendar size={10} />{action.dueDate ? formatDate(action.dueDate) : '—'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5"
                                  style={{ background: aCfg.bg, color: aCfg.color, border: `1px solid ${aCfg.color}40` }}
                                >
                                  {aCfg.label}
                                </span>
                                <button
                                  onClick={() => cycleActionStatus(action.id)}
                                  className="p-1.5 text-xs transition-colors"
                                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                                  title="Cycle status"
                                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                                >
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Preventive measures */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
              Systemic Preventive Measures
            </p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Describe broader changes to systems, processes or procedures to prevent recurrence across the organisation.
            </p>
            <textarea
              rows={4}
              className="w-full px-3 py-2 text-sm outline-none resize-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
              value={inv.preventiveMeasures}
              onChange={e => update({ preventiveMeasures: e.target.value })}
              placeholder="Describe systemic changes, policy updates, or procedural improvements…"
            />
          </Card>

          <SaveBar tab="actions" saved={saved} onSave={() => saveSection('actions')} />
        </div>
      )}

      {/* ── SIGN-OFF TAB ────────────────────────────────────────────────────── */}
      {tab === 'signoff' && (
        <div className="space-y-5">

          {/* Regulatory notification */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={14} style={{ color: 'var(--text-muted)' }} />
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Regulatory Notification
              </p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <div
                className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                style={{
                  background: inv.notifiable ? 'var(--accent)' : 'var(--bg-secondary)',
                  border: `2px solid ${inv.notifiable ? 'var(--accent)' : 'var(--border)'}`,
                  cursor: 'pointer',
                }}
                onClick={() => update({ notifiable: !inv.notifiable })}
              >
                {inv.notifiable && <Check size={11} style={{ color: '#000' }} />}
              </div>
              <div>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>This incident is notifiable to a regulator</span>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  e.g. serious injury, dangerous incident under WHS Act — notify SafeWork NSW immediately
                </p>
              </div>
            </label>

            {inv.notifiable && (
              <div className="grid md:grid-cols-3 gap-4 pl-8">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Notified Body</label>
                  <input
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    value={inv.notifiedBody}
                    onChange={e => update({ notifiedBody: e.target.value })}
                    placeholder="e.g. SafeWork NSW"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date Notified</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    value={inv.notificationDate}
                    onChange={e => update({ notificationDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Reference Number</label>
                  <input
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    value={inv.notificationRef}
                    onChange={e => update({ notificationRef: e.target.value })}
                    placeholder="Regulator reference #"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Consultation */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
              Worker Consultation
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                style={{
                  background: inv.workerConsulted ? 'var(--accent)' : 'var(--bg-secondary)',
                  border: `2px solid ${inv.workerConsulted ? 'var(--accent)' : 'var(--border)'}`,
                  cursor: 'pointer',
                }}
                onClick={() => update({ workerConsulted: !inv.workerConsulted })}
              >
                {inv.workerConsulted && <Check size={11} style={{ color: '#000' }} />}
              </div>
              <div>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  Affected worker(s) have been consulted during the investigation
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  WHS Act requires workers to be consulted on matters that affect their health and safety
                </p>
              </div>
            </label>
          </Card>

          {/* Investigation summary */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-muted)' }}>
              Investigation Summary
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              {[
                { label: 'Investigated By',   value: inv.investigatedBy || '—'                     },
                { label: 'Investigation Date', value: inv.investigationDate ? formatDate(inv.investigationDate) : '—' },
                { label: 'Root Cause',         value: inv.rootCause || '—'                         },
                { label: 'Causal Class',       value: causalOptions.find(o => o.value === inv.causalClassification)?.label ?? '—' },
                { label: 'Actions Raised',     value: `${inv.actions.length} (${inv.actions.filter(a => a.status === 'completed').length} complete)` },
                { label: 'Contributing Factors', value: inv.contributingFactors.length > 0 ? inv.contributingFactors.join(', ') : '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="font-medium mt-0.5" style={{ color: 'var(--text)' }}>{value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Manager Sign-off */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <PenLine size={14} style={{ color: 'var(--text-muted)' }} />
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Manager Sign-off
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Signing Manager <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  className="w-full px-3 py-2 text-sm outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  value={inv.managerSignOff}
                  onChange={e => update({ managerSignOff: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Sign-off Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  value={inv.signOffDate}
                  onChange={e => update({ signOffDate: e.target.value })}
                />
              </div>
            </div>

            {inv.managerSignOff && inv.signOffDate && (
              <div
                className="mt-4 p-4 flex items-center gap-3"
                style={{ background: '#22c55e12', border: '1px solid #22c55e40' }}
              >
                <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#22c55e' }}>Investigation Ready for Sign-off</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Signed by {inv.managerSignOff} on {formatDate(inv.signOffDate)}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <SaveBar
            tab="signoff"
            saved={saved}
            onSave={() => saveSection('signoff')}
            extra={
              inv.managerSignOff && inv.signOffDate && inv.rootCause ? (
                <button
                  onClick={() => { update({ status: 'complete' }); setSaved('signoff') }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-black"
                  style={{ background: '#22c55e' }}
                >
                  <CheckCircle2 size={14} /> Complete Investigation
                </button>
              ) : undefined
            }
          />
        </div>
      )}

      {/* ── Witness Drawer ────────────────────────────────────────────────── */}
      <Drawer
        open={addWitnessOpen}
        onClose={() => { setAddWitnessOpen(false); setNewWitness({ name: '', role: '', statement: '' }) }}
        title="Add Witness"
        subtitle="Record a witness account for this investigation"
      >
        <form onSubmit={handleAddWitness} className="space-y-4">
          <Field label="Witness Name" required>
            <TextInput value={newWitness.name} onChange={v => setNewWitness(f => ({ ...f, name: v }))} placeholder="Full name" />
          </Field>
          <Field label="Role / Position">
            <TextInput value={newWitness.role} onChange={v => setNewWitness(f => ({ ...f, role: v }))} placeholder="e.g. Site Supervisor" />
          </Field>
          <Field label="Witness Statement">
            <TextArea value={newWitness.statement} onChange={v => setNewWitness(f => ({ ...f, statement: v }))} placeholder="What the witness observed…" rows={4} />
          </Field>
          <SubmitRow saving={witnessSaving} saved={witnessSaved} submitLabel="Add Witness" savedLabel="Added!" onCancel={() => setAddWitnessOpen(false)} />
        </form>
      </Drawer>

      {/* ── Action Drawer ─────────────────────────────────────────────────── */}
      <Drawer
        open={addActionOpen}
        onClose={() => { setAddActionOpen(false); setNewAction({ description: '', type: 'corrective', assignedTo: '', dueDate: '' }) }}
        title="Add Action"
        subtitle="Add a corrective or preventive action"
      >
        <form onSubmit={handleAddAction} className="space-y-4">
          <Field label="Action Description" required>
            <TextArea value={newAction.description} onChange={v => setNewAction(f => ({ ...f, description: v }))} placeholder="Describe the action required…" rows={3} />
          </Field>
          <Field label="Type">
            <RadioGroup
              value={newAction.type}
              onChange={v => setNewAction(f => ({ ...f, type: v }))}
              options={[
                { value: 'corrective',  label: 'Corrective — fixes the immediate problem' },
                { value: 'preventive',  label: 'Preventive — stops recurrence systemically' },
              ]}
              colorMap={{ corrective: '#ef4444', preventive: '#3b82f6' }}
            />
          </Field>
          <Field label="Assigned To" required>
            <TextInput value={newAction.assignedTo} onChange={v => setNewAction(f => ({ ...f, assignedTo: v }))} placeholder="e.g. James Chen" />
          </Field>
          <Field label="Due Date" required>
            <TextInput type="date" value={newAction.dueDate} onChange={v => setNewAction(f => ({ ...f, dueDate: v }))} />
          </Field>
          <SubmitRow saving={actionSaving} saved={actionSaved} submitLabel="Add Action" savedLabel="Added!" onCancel={() => setAddActionOpen(false)} />
        </form>
      </Drawer>
    </div>
  )
}

// ─── Save bar component ───────────────────────────────────────────────────────

function SaveBar({ tab, saved, onSave, extra }: {
  tab: Tab
  saved: Tab | null
  onSave: () => void
  extra?: React.ReactNode
}) {
  const isSaved = saved === tab
  return (
    <div
      className="flex items-center justify-end gap-3 p-4"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      {extra}
      <button
        onClick={onSave}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all text-black"
        style={{ background: isSaved ? '#22c55e' : 'var(--accent)' }}
      >
        {isSaved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Changes</>}
      </button>
    </div>
  )
}
