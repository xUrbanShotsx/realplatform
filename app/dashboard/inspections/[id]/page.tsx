'use client'

import { useState, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import {
  inspections, inspectionTemplates, inspectionFormData,
  InspectionFormData, ItemResponse, ItemResult, ItemCA,
  InspTemplateSection, InspectionTemplate,
} from '@/lib/mock-data'
import { formatDate, scoreColor } from '@/lib/utils'
import {
  ArrowLeft, MapPin, User, Calendar, CheckCircle2, Clock, Circle,
  ChevronDown, ChevronUp, Check, X, Minus, MessageSquare,
  Camera, AlertTriangle, Plus, Save, ClipboardList, Download,
  ChevronsDownUp, ChevronsUpDown, Image, Trash2, ChevronRight,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type PageFormData = { [itemId: string]: ItemResponse }

// ─── Config ──────────────────────────────────────────────────────────────────

const statusConfig = {
  completed:   { label: 'Completed',   color: '#22c55e', bg: '#22c55e18', icon: CheckCircle2 },
  'in-progress':{ label: 'In Progress', color: '#f59e0b', bg: '#f59e0b18', icon: Clock        },
  scheduled:   { label: 'Scheduled',   color: '#3b82f6', bg: '#3b82f618', icon: Circle        },
}

const resultConfig: Record<ItemResult, { label: string; color: string; bg: string; border: string; icon: typeof Check }> = {
  pass:    { label: 'Pass',    color: '#22c55e', bg: '#22c55e18', border: '#22c55e60', icon: Check   },
  fail:    { label: 'Fail',    color: '#ef4444', bg: '#ef444418', border: '#ef444460', icon: X       },
  na:      { label: 'N/A',     color: '#94a3b8', bg: '#94a3b818', border: '#94a3b860', icon: Minus   },
  pending: { label: 'Pending', color: '#94a3b8', bg: 'transparent', border: 'var(--border)', icon: Circle },
}

// ─── Empty response factory ───────────────────────────────────────────────────

function emptyResponse(): ItemResponse {
  return { result: 'pending', comment: '', photos: [], ca: null }
}

function buildInitialData(template: InspectionTemplate, existing?: InspectionFormData): PageFormData {
  const data: PageFormData = {}
  for (const section of template.sections) {
    for (const item of section.items) {
      data[item.id] = existing?.responses[item.id] ?? emptyResponse()
    }
  }
  return data
}

// ─── Score calculation ────────────────────────────────────────────────────────

function calcScore(data: PageFormData): { score: number; pass: number; fail: number; na: number; pending: number } {
  const vals = Object.values(data)
  const pass    = vals.filter(v => v.result === 'pass').length
  const fail    = vals.filter(v => v.result === 'fail').length
  const na      = vals.filter(v => v.result === 'na').length
  const pending = vals.filter(v => v.result === 'pending').length
  const applicable = pass + fail
  const score = applicable === 0 ? 0 : Math.round((pass / applicable) * 100)
  return { score, pass, fail, na, pending }
}

// ─── Section progress ─────────────────────────────────────────────────────────

function sectionStats(section: InspTemplateSection, data: PageFormData) {
  const items = section.items.map(i => data[i.id] ?? emptyResponse())
  return {
    pass:    items.filter(i => i.result === 'pass').length,
    fail:    items.filter(i => i.result === 'fail').length,
    na:      items.filter(i => i.result === 'na').length,
    pending: items.filter(i => i.result === 'pending').length,
    total:   items.length,
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function InspectionFormPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const inspection = inspections.find(i => i.id === id)
  const template   = inspection ? inspectionTemplates[inspection.formType] : undefined
  const existing   = inspectionFormData[id]

  const [formData, setFormData] = useState<PageFormData>(() =>
    template ? buildInitialData(template, existing) : {}
  )
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems]         = useState<Set<string>>(new Set())
  const [generalComment, setGeneralComment]       = useState(existing?.generalComment ?? '')
  const [signOffName, setSignOffName]             = useState(existing?.signOffName ?? '')
  const [signOffDate, setSignOffDate]             = useState(existing?.signOffDate ?? '')
  const [isSaved, setIsSaved]                     = useState(false)
  const [status, setStatus]                       = useState(inspection?.status ?? 'scheduled')

  if (!inspection || !template) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Inspection not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm underline" style={{ color: 'var(--accent)' }}>Go back</button>
      </div>
    )
  }

  const statCfg = statusConfig[status as keyof typeof statusConfig]
  const StatIcon = statCfg.icon
  const { score, pass, fail, na, pending } = calcScore(formData)
  const total = Object.keys(formData).length
  const answered = total - pending

  // ── Item helpers
  function setResult(itemId: string, result: ItemResult) {
    setFormData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        result,
        // Clear CA if switching away from fail
        ca: result === 'fail' ? prev[itemId]?.ca ?? null : null,
      },
    }))
    // Auto-expand fail items so inspector can add details
    if (result === 'fail') {
      setExpandedItems(prev => new Set(Array.from(prev).concat(itemId)))
    }
  }

  function setComment(itemId: string, comment: string) {
    setFormData(prev => ({ ...prev, [itemId]: { ...prev[itemId], comment } }))
  }

  function addPhoto(itemId: string) {
    const name = `photo_${itemId.replace('-', '')}_${Date.now()}.jpg`
    setFormData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], photos: [...(prev[itemId]?.photos ?? []), name] },
    }))
  }

  function removePhoto(itemId: string, idx: number) {
    setFormData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], photos: prev[itemId].photos.filter((_, i) => i !== idx) },
    }))
  }

  function setCA(itemId: string, ca: ItemCA | null) {
    setFormData(prev => ({ ...prev, [itemId]: { ...prev[itemId], ca } }))
  }

  function toggleItem(itemId: string) {
    setExpandedItems(prev => {
      const s = new Set(prev)
      s.has(itemId) ? s.delete(itemId) : s.add(itemId)
      return s
    })
  }

  function toggleSection(sectionId: string) {
    setCollapsedSections(prev => {
      const s = new Set(prev)
      s.has(sectionId) ? s.delete(sectionId) : s.add(sectionId)
      return s
    })
  }

  function expandAll() { setCollapsedSections(new Set()) }
  function collapseAll() {
    setCollapsedSections(new Set((template?.sections ?? []).map(s => s.id)))
  }

  function handleSave() {
    if (status === 'scheduled') setStatus('in-progress')
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  function handleComplete() {
    setStatus('completed')
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const allAnswered = pending === 0

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Back */}
      <button
        onClick={() => router.push('/dashboard/inspections')}
        className="flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={14} /> Back to Inspections
      </button>

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-5 justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <ClipboardList size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{inspection.formType}</h1>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5"
                  style={{ background: statCfg.bg, color: statCfg.color, border: `1px solid ${statCfg.color}40` }}
                >
                  <StatIcon size={11} /> {statCfg.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><MapPin size={11} />{inspection.site}</span>
                <span className="flex items-center gap-1"><User size={11} />{inspection.inspector}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(inspection.date)}</span>
              </div>
            </div>
          </div>

          {/* Score ring */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-center">
              <p className="text-4xl font-black" style={{ color: answered === 0 ? 'var(--text-muted)' : scoreColor(score) }}>
                {answered === 0 ? '—' : score}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Score /100</p>
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Pass',    val: pass,    color: '#22c55e' },
                { label: 'Fail',    val: fail,    color: '#ef4444' },
                { label: 'N/A',     val: na,      color: '#94a3b8' },
                { label: 'Pending', val: pending, color: 'var(--text-muted)' },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex items-center gap-2 w-28">
                  <span className="w-16" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span className="font-bold" style={{ color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
            <span>{answered} of {total} items answered</span>
            <span>{Math.round((answered / total) * 100)}% complete</span>
          </div>
          <div className="h-2 flex overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <div className="h-full transition-all" style={{ width: `${(pass / total) * 100}%`, background: '#22c55e' }} />
            <div className="h-full transition-all" style={{ width: `${(fail / total) * 100}%`, background: '#ef4444' }} />
            <div className="h-full transition-all" style={{ width: `${(na / total) * 100}%`, background: '#94a3b8' }} />
          </div>
        </div>
      </Card>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
          >
            <ChevronsUpDown size={12} /> Expand All
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
          >
            <ChevronsDownUp size={12} /> Collapse All
          </button>
          {fail > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold" style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444440' }}>
              <AlertTriangle size={11} /> {fail} item{fail !== 1 ? 's' : ''} failed
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: isSaved ? '#22c55e' : 'var(--bg-secondary)',
              color: isSaved ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${isSaved ? '#22c55e' : 'var(--border)'}`,
            }}
          >
            {isSaved ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save Progress</>}
          </button>
          {status === 'completed' && (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg)' }}
            >
              <Download size={12} /> Export PDF
            </button>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {template.sections.map((section, sIdx) => {
          const stats    = sectionStats(section, formData)
          const collapsed = collapsedSections.has(section.id)
          const sectionScore = stats.pass + stats.fail > 0
            ? Math.round((stats.pass / (stats.pass + stats.fail)) * 100)
            : null
          const allSectionDone = stats.pending === 0

          return (
            <div key={section.id} style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
              {/* Section header */}
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                style={{ background: allSectionDone && stats.fail === 0 ? '#22c55e08' : 'none' }}
                onClick={() => toggleSection(section.id)}
                onMouseEnter={e => { if (!allSectionDone) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (!allSectionDone) (e.currentTarget as HTMLElement).style.background = allSectionDone && stats.fail === 0 ? '#22c55e08' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: allSectionDone && stats.fail === 0 ? '#22c55e18' : 'var(--bg-secondary)',
                      color: allSectionDone && stats.fail === 0 ? '#22c55e' : 'var(--text-muted)',
                    }}
                  >
                    {allSectionDone && stats.fail === 0 ? <Check size={13} /> : sIdx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{section.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>{stats.total} items</span>
                      {stats.pass > 0 && <span style={{ color: '#22c55e' }}>✓ {stats.pass} pass</span>}
                      {stats.fail > 0 && <span style={{ color: '#ef4444' }}>✗ {stats.fail} fail</span>}
                      {stats.na   > 0 && <span style={{ color: '#94a3b8' }}>— {stats.na} n/a</span>}
                      {stats.pending > 0 && <span style={{ color: 'var(--text-muted)' }}>{stats.pending} pending</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {sectionScore !== null && (
                    <span className="text-sm font-bold" style={{ color: scoreColor(sectionScore) }}>{sectionScore}%</span>
                  )}
                  {collapsed ? <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} />}
                </div>
              </button>

              {/* Section items */}
              {!collapsed && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {section.items.map((item, iIdx) => {
                    const resp     = formData[item.id] ?? emptyResponse()
                    const expanded = expandedItems.has(item.id)
                    const resCfg   = resultConfig[resp.result]
                    const ResIcon  = resCfg.icon
                    const hasComment = resp.comment.trim().length > 0
                    const hasPhotos  = resp.photos.length > 0
                    const hasCA      = resp.ca !== null

                    return (
                      <div
                        key={item.id}
                        style={{
                          borderBottom: iIdx < section.items.length - 1 ? '1px solid var(--border)' : 'none',
                          background: resp.result === 'fail' ? '#ef444406' : resp.result === 'pass' ? '#22c55e04' : 'var(--bg)',
                        }}
                      >
                        {/* Item row */}
                        <div className="flex items-center gap-3 px-5 py-3">
                          {/* Question */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm" style={{ color: 'var(--text)' }}>{item.question}</p>
                          </div>

                          {/* Pass / Fail / N/A buttons */}
                          <div className="flex gap-1 flex-shrink-0">
                            {(['pass', 'fail', 'na'] as ItemResult[]).map(r => {
                              const cfg = resultConfig[r]
                              const Ic  = cfg.icon
                              const active = resp.result === r
                              return (
                                <button
                                  key={r}
                                  onClick={() => setResult(item.id, r)}
                                  title={cfg.label}
                                  className="w-8 h-8 flex items-center justify-center transition-all"
                                  style={{
                                    background: active ? cfg.bg : 'var(--bg-secondary)',
                                    border: `1.5px solid ${active ? cfg.border : 'var(--border)'}`,
                                    color: active ? cfg.color : 'var(--text-muted)',
                                  }}
                                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = cfg.bg + '80' }}
                                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)' }}
                                >
                                  <Ic size={13} />
                                </button>
                              )
                            })}
                          </div>

                          {/* Detail icons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Comment */}
                            <button
                              onClick={() => toggleItem(item.id)}
                              className="relative w-7 h-7 flex items-center justify-center transition-colors"
                              style={{
                                color: hasComment ? '#3b82f6' : 'var(--text-muted)',
                                background: hasComment ? '#3b82f618' : 'transparent',
                              }}
                              title={hasComment ? 'Has comment' : 'Add comment'}
                            >
                              <MessageSquare size={13} />
                              {hasComment && (
                                <span
                                  className="absolute -top-0.5 -right-0.5 w-2 h-2"
                                  style={{ background: '#3b82f6', borderRadius: '50%' }}
                                />
                              )}
                            </button>

                            {/* Photos */}
                            <button
                              onClick={() => { toggleItem(item.id); addPhoto(item.id) }}
                              className="relative w-7 h-7 flex items-center justify-center transition-colors"
                              style={{
                                color: hasPhotos ? '#8b5cf6' : 'var(--text-muted)',
                                background: hasPhotos ? '#8b5cf618' : 'transparent',
                              }}
                              title={`${resp.photos.length} photo${resp.photos.length !== 1 ? 's' : ''}`}
                            >
                              <Camera size={13} />
                              {hasPhotos && (
                                <span
                                  className="absolute -top-0.5 -right-0.5 text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center"
                                  style={{ background: '#8b5cf6', color: '#fff', borderRadius: '50%' }}
                                >
                                  {resp.photos.length}
                                </span>
                              )}
                            </button>

                            {/* Corrective Action */}
                            {resp.result === 'fail' && (
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="relative w-7 h-7 flex items-center justify-center transition-colors"
                                style={{
                                  color: hasCA ? '#f59e0b' : '#ef4444',
                                  background: hasCA ? '#f59e0b18' : '#ef444418',
                                }}
                                title={hasCA ? 'Corrective action raised' : 'Raise corrective action'}
                              >
                                <AlertTriangle size={13} />
                              </button>
                            )}

                            {/* Expand toggle */}
                            <button
                              onClick={() => toggleItem(item.id)}
                              className="w-7 h-7 flex items-center justify-center transition-colors"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded detail area */}
                        {expanded && (
                          <div
                            className="px-5 pb-4 space-y-4"
                            style={{ borderTop: '1px dashed var(--border)', paddingTop: '1rem', background: 'var(--bg-secondary)' }}
                          >
                            {/* Comment */}
                            <div>
                              <label className="block text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                                <MessageSquare size={11} /> Inspector Comment
                              </label>
                              <textarea
                                rows={2}
                                className="w-full px-3 py-2 text-sm outline-none resize-none"
                                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                value={resp.comment}
                                onChange={e => setComment(item.id, e.target.value)}
                                placeholder={resp.result === 'fail'
                                  ? 'Describe the non-conformance and what was observed…'
                                  : 'Add any relevant observations or notes…'
                                }
                              />
                            </div>

                            {/* Photos */}
                            <div>
                              <label className="block text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                                <Camera size={11} /> Photos ({resp.photos.length})
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {resp.photos.map((photo, pIdx) => (
                                  <div
                                    key={pIdx}
                                    className="relative group/photo w-20 h-20 flex flex-col items-center justify-center gap-1"
                                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                                  >
                                    <Image size={20} style={{ color: 'var(--text-muted)' }} />
                                    <p className="text-[9px] text-center px-1 truncate w-full" style={{ color: 'var(--text-muted)' }}>
                                      {photo.replace(/photo_[^_]+_\d+\./, 'photo_').replace('.jpg', '')}
                                    </p>
                                    <button
                                      onClick={() => removePhoto(item.id, pIdx)}
                                      className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"
                                      style={{ background: '#ef4444', color: '#fff' }}
                                    >
                                      <X size={9} />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addPhoto(item.id)}
                                  className="w-20 h-20 flex flex-col items-center justify-center gap-1.5 transition-colors text-xs"
                                  style={{
                                    border: '1.5px dashed var(--border)',
                                    color: 'var(--text-muted)',
                                    background: 'var(--bg)',
                                  }}
                                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
                                >
                                  <Plus size={16} style={{ color: 'var(--text-muted)' }} />
                                  <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Add Photo</span>
                                </button>
                              </div>
                            </div>

                            {/* Corrective Action */}
                            {resp.result === 'fail' && (
                              <div>
                                <label className="block text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#ef4444' }}>
                                  <AlertTriangle size={11} /> Corrective Action
                                </label>
                                {resp.ca === null ? (
                                  <button
                                    onClick={() => setCA(item.id, { description: '', assignedTo: '', dueDate: '' })}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors"
                                    style={{ border: '1px dashed #ef444480', color: '#ef4444', background: '#ef444408' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#ef444415'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#ef444408'}
                                  >
                                    <Plus size={11} /> Raise Corrective Action
                                  </button>
                                ) : (
                                  <div
                                    className="space-y-3 p-3"
                                    style={{ background: '#ef444408', border: '1px solid #ef444430' }}
                                  >
                                    <div>
                                      <label className="block text-[10px] font-semibold mb-1" style={{ color: '#ef4444' }}>Action Description *</label>
                                      <textarea
                                        rows={2}
                                        className="w-full px-2.5 py-1.5 text-xs outline-none resize-none"
                                        style={{ background: 'var(--bg)', border: '1px solid #ef444440', color: 'var(--text)' }}
                                        value={resp.ca.description}
                                        onChange={e => setCA(item.id, { ...resp.ca!, description: e.target.value })}
                                        placeholder="Describe the corrective action required…"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[10px] font-semibold mb-1" style={{ color: '#ef4444' }}>Assigned To</label>
                                        <input
                                          className="w-full px-2.5 py-1.5 text-xs outline-none"
                                          style={{ background: 'var(--bg)', border: '1px solid #ef444440', color: 'var(--text)' }}
                                          value={resp.ca.assignedTo}
                                          onChange={e => setCA(item.id, { ...resp.ca!, assignedTo: e.target.value })}
                                          placeholder="Name"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-semibold mb-1" style={{ color: '#ef4444' }}>Due Date</label>
                                        <input
                                          type="date"
                                          className="w-full px-2.5 py-1.5 text-xs outline-none"
                                          style={{ background: 'var(--bg)', border: '1px solid #ef444440', color: 'var(--text)' }}
                                          value={resp.ca.dueDate}
                                          onChange={e => setCA(item.id, { ...resp.ca!, dueDate: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      {resp.ca.description && resp.ca.assignedTo ? (
                                        <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: '#22c55e' }}>
                                          <Check size={10} /> Action saved
                                        </span>
                                      ) : (
                                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Fill description and assignee to save action</span>
                                      )}
                                      <button
                                        onClick={() => setCA(item.id, null)}
                                        className="text-[10px] flex items-center gap-1 transition-colors"
                                        style={{ color: '#ef4444' }}
                                      >
                                        <Trash2 size={10} /> Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* General comment + sign-off */}
      <Card className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
            General Comments & Observations
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 text-sm outline-none resize-none"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
            value={generalComment}
            onChange={e => setGeneralComment(e.target.value)}
            placeholder="Overall observations, summary notes, any matters to escalate…"
          />
        </div>
        <div className="grid grid-cols-2 gap-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Inspector Sign-off Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              className="w-full px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
              value={signOffName}
              onChange={e => setSignOffName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Sign-off Date <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
              value={signOffDate}
              onChange={e => setSignOffDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Failed items summary */}
      {fail > 0 && (
        <Card className="overflow-hidden">
          <div className="px-5 py-3.5" style={{ background: '#ef444410', borderBottom: '1px solid #ef444430' }}>
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: '#ef4444' }}>
              <AlertTriangle size={14} /> {fail} Failed Item{fail !== 1 ? 's' : ''} — Actions Required
            </p>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
            {template.sections.flatMap(s =>
              s.items
                .filter(item => formData[item.id]?.result === 'fail')
                .map(item => {
                  const resp = formData[item.id]
                  return (
                    <div key={item.id} className="px-5 py-3 flex items-start gap-3">
                      <X size={13} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{item.question}</p>
                        {resp.comment && <p className="text-xs mt-0.5 italic" style={{ color: 'var(--text-muted)' }}>{resp.comment}</p>}
                        {resp.ca ? (
                          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#f59e0b' }}>
                            <CheckCircle2 size={10} />
                            Action raised → {resp.ca.assignedTo || 'unassigned'}
                            {resp.ca.dueDate && ` · Due ${formatDate(resp.ca.dueDate)}`}
                          </p>
                        ) : (
                          <button
                            onClick={() => {
                              setCA(item.id, { description: '', assignedTo: '', dueDate: '' })
                              setExpandedItems(prev => new Set(Array.from(prev).concat(item.id)))
                              // Scroll to item — just expand the section if collapsed
                              setCollapsedSections(prev => {
                                const s = new Set(prev)
                                const section = template.sections.find(sec => sec.items.some(i => i.id === item.id))
                                if (section) s.delete(section.id)
                                return s
                              })
                            }}
                            className="text-xs mt-1 flex items-center gap-1 transition-colors"
                            style={{ color: '#ef4444' }}
                          >
                            <Plus size={10} /> Raise corrective action
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        </Card>
      )}

      {/* Bottom action bar */}
      <div
        className="flex items-center justify-between p-4 sticky bottom-4"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
      >
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {allAnswered
            ? <span style={{ color: '#22c55e' }}>✓ All {total} items answered · Score: {score}/100</span>
            : <span>{pending} item{pending !== 1 ? 's' : ''} remaining</span>
          }
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all"
            style={{
              background: isSaved ? '#22c55e18' : 'var(--bg-secondary)',
              color: isSaved ? '#22c55e' : 'var(--text-secondary)',
              border: `1px solid ${isSaved ? '#22c55e40' : 'var(--border)'}`,
            }}
          >
            {isSaved ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save</>}
          </button>
          <button
            onClick={handleComplete}
            disabled={!allAnswered || !signOffName || !signOffDate}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: status === 'completed' ? '#22c55e' : 'var(--accent)',
              color: status === 'completed' ? '#fff' : '#000',
            }}
          >
            {status === 'completed'
              ? <><CheckCircle2 size={12} /> Inspection Complete</>
              : <><Check size={12} /> Complete Inspection</>
            }
          </button>
        </div>
      </div>

    </div>
  )
}
