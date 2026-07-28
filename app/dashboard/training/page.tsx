'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Drawer, Field, TextInput, RadioGroup, Select, SubmitRow } from '@/components/ui/Drawer'
import {
  trainingRecords as initialRecords,
  workers,
  tnaCourses as initialTnaCourses,
  tnaRoles as initialTnaRoles,
  tnaInitialRequirements,
  TnaCourse,
  TnaRole,
  TnaCourseCategory,
  TnaCourseFrequency,
} from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  Plus, GraduationCap, CheckCircle2, Clock, AlertCircle,
  List, LayoutGrid, Pencil, Check, X, ChevronDown,
  BarChart2, BookOpen, Shield, Wrench, BadgeCheck,
} from 'lucide-react'

// ─── Config ─────────────────────────────────────────────────────────────────

const statusCfg = {
  current:       { bg: '#22c55e18', color: '#22c55e', label: 'Current',       icon: CheckCircle2 },
  'expiring-soon': { bg: '#f59e0b18', color: '#f59e0b', label: 'Expiring Soon', icon: Clock        },
  overdue:       { bg: '#ef444418', color: '#ef4444', label: 'Overdue',       icon: AlertCircle  },
}

const categoryConfig: Record<TnaCourseCategory, { label: string; color: string; bg: string; icon: typeof Shield }> = {
  safety:      { label: 'Safety',      color: '#ef4444', bg: '#ef444418', icon: Shield      },
  compliance:  { label: 'Compliance',  color: '#3b82f6', bg: '#3b82f618', icon: BadgeCheck  },
  licence:     { label: 'Licence',     color: '#8b5cf6', bg: '#8b5cf618', icon: GraduationCap },
  operational: { label: 'Operational', color: '#64748b', bg: '#64748b18', icon: Wrench       },
}

const frequencyConfig: Record<TnaCourseFrequency, { label: string; color: string }> = {
  once:      { label: 'Once',    color: '#94a3b8' },
  annual:    { label: 'Annual',  color: '#f59e0b' },
  biennial:  { label: '2-Year',  color: '#3b82f6' },
  '3-year':  { label: '3-Year',  color: '#22c55e' },
}

const emptyRecord = { staffName: '', course: '', provider: '', completedDate: '', expiryDate: '', status: 'current' }

// ─── Page ───────────────────────────────────────────────────────────────────

export default function TrainingPage() {
  const [view, setView] = useState<'list' | 'matrix'>('list')
  const [records, setRecords] = useState([...initialRecords])

  // ── Record drawer
  const [showRecordDrawer, setShowRecordDrawer] = useState(false)
  const [recordForm, setRecordForm] = useState({ ...emptyRecord })
  const [recordSaving, setRecordSaving] = useState(false)
  const [recordSaved, setRecordSaved] = useState(false)

  // ── TNA state
  const [tnaCourses, setTnaCourses] = useState<TnaCourse[]>([...initialTnaCourses])
  const [tnaRoles, setTnaRoles]     = useState<TnaRole[]>([...initialTnaRoles])
  const [requirements, setRequirements] = useState<Record<string, Record<string, boolean>>>(
    JSON.parse(JSON.stringify(tnaInitialRequirements))
  )
  const [matrixMode, setMatrixMode]   = useState<'requirements' | 'gap'>('requirements')
  const [editMode, setEditMode]       = useState(false)

  // ── Add Course drawer
  const [addCourseOpen, setAddCourseOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({ name: '', category: 'safety' as TnaCourseCategory, frequency: 'annual' as TnaCourseFrequency })
  const [courseSaving, setCourseSaving] = useState(false)
  const [courseSaved, setCourseSaved]   = useState(false)

  // ── Add Role drawer
  const [addRoleOpen, setAddRoleOpen] = useState(false)
  const [newRole, setNewRole] = useState({ name: '', department: '' })
  const [roleSaving, setRoleSaving] = useState(false)
  const [roleSaved, setRoleSaved]   = useState(false)

  // ── Stats
  const current     = records.filter(r => r.status === 'current').length
  const expiringSoon = records.filter(r => r.status === 'expiring-soon').length
  const overdue     = records.filter(r => r.status === 'overdue').length

  // ── TNA: how many requirements total, and how many are met
  const totalRequired = useMemo(() => {
    let count = 0
    for (const courseId of Object.keys(requirements)) {
      for (const roleId of Object.keys(requirements[courseId] ?? {})) {
        if (requirements[courseId][roleId]) count++
      }
    }
    return count
  }, [requirements])

  // ── Gap analysis: per (courseId, roleId) → { completed, total }
  const gapData = useMemo(() => {
    const result: Record<string, Record<string, { completed: number; total: number }>> = {}
    for (const course of tnaCourses) {
      result[course.id] = {}
      for (const role of tnaRoles) {
        if (!requirements[course.id]?.[role.id]) continue
        const workersInRole = workers.filter(w => w.role === role.name)
        const completedWorkers = workersInRole.filter(w =>
          records.some(r => {
            if (r.staffName !== w.name) return false
            if (r.status === 'overdue' && r.completedDate === '') return false
            const cLower = course.name.toLowerCase()
            const rLower = r.course.toLowerCase()
            return rLower.includes(cLower.split(' ')[0]) || cLower.includes(rLower.split(' ')[0])
          })
        )
        result[course.id][role.id] = { completed: completedWorkers.length, total: workersInRole.length }
      }
    }
    return result
  }, [tnaCourses, tnaRoles, requirements, records])

  // ── Handlers
  function toggleRequirement(courseId: string, roleId: string) {
    if (!editMode) return
    setRequirements(prev => ({
      ...prev,
      [courseId]: { ...prev[courseId], [roleId]: !(prev[courseId]?.[roleId] ?? false) },
    }))
  }

  function handleAddRecord(e: React.FormEvent) {
    e.preventDefault()
    setRecordSaving(true)
    setTimeout(() => {
      setRecords(prev => [{
        id: Date.now().toString(),
        staffName: recordForm.staffName,
        course: recordForm.course,
        provider: recordForm.provider,
        completedDate: recordForm.completedDate,
        expiryDate: recordForm.expiryDate,
        status: recordForm.status as 'current' | 'expiring-soon' | 'overdue',
        completion: recordForm.status === 'current' ? 100 : 50,
      }, ...prev])
      setRecordSaving(false)
      setRecordSaved(true)
      setTimeout(() => { setRecordSaved(false); setShowRecordDrawer(false); setRecordForm({ ...emptyRecord }) }, 1200)
    }, 700)
  }

  function handleAddCourse(e: React.FormEvent) {
    e.preventDefault()
    if (!newCourse.name.trim()) return
    setCourseSaving(true)
    setTimeout(() => {
      const id = `tc-${Date.now()}`
      setTnaCourses(prev => [...prev, { id, name: newCourse.name.trim(), category: newCourse.category, frequency: newCourse.frequency }])
      // Initialise all roles to false for new course
      setRequirements(prev => ({ ...prev, [id]: Object.fromEntries(tnaRoles.map(r => [r.id, false])) }))
      setCourseSaving(false)
      setCourseSaved(true)
      setTimeout(() => { setCourseSaved(false); setAddCourseOpen(false); setNewCourse({ name: '', category: 'safety', frequency: 'annual' }) }, 1000)
    }, 500)
  }

  function handleAddRole(e: React.FormEvent) {
    e.preventDefault()
    if (!newRole.name.trim()) return
    setRoleSaving(true)
    setTimeout(() => {
      const id = `tr-${Date.now()}`
      setTnaRoles(prev => [...prev, { id, name: newRole.name.trim(), department: newRole.department.trim() }])
      // Initialise all courses to false for new role
      setRequirements(prev => {
        const updated = { ...prev }
        for (const courseId of Object.keys(updated)) {
          updated[courseId] = { ...updated[courseId], [id]: false }
        }
        return updated
      })
      setRoleSaving(false)
      setRoleSaved(true)
      setTimeout(() => { setRoleSaved(false); setAddRoleOpen(false); setNewRole({ name: '', department: '' }) }, 1000)
    }, 500)
  }

  function removeCourse(courseId: string) {
    setTnaCourses(prev => prev.filter(c => c.id !== courseId))
    setRequirements(prev => { const next = { ...prev }; delete next[courseId]; return next })
  }

  function removeRole(roleId: string) {
    setTnaRoles(prev => prev.filter(r => r.id !== roleId))
    setRequirements(prev => {
      const next = { ...prev }
      for (const cId of Object.keys(next)) {
        const row = { ...next[cId] }
        delete row[roleId]
        next[cId] = row
      }
      return next
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Staff Training"
        description="Track training records, certifications and compliance"
        action={{
          label: 'Add Record',
          icon: <Plus size={14} />,
          onClick: () => { setRecordForm({ ...emptyRecord }); setShowRecordDrawer(true) },
        }}
      >
        {/* View toggle */}
        <div className="flex gap-0" style={{ border: '1px solid var(--border)' }}>
          {([
            { key: 'list',   label: 'Records', icon: List       },
            { key: 'matrix', label: 'TNA Matrix', icon: LayoutGrid },
          ] as { key: 'list' | 'matrix'; label: string; icon: typeof List }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: view === key ? 'var(--accent)' : 'var(--bg)',
                color: view === key ? '#000' : 'var(--text-muted)',
                borderRight: key === 'list' ? '1px solid var(--border)' : 'none',
              }}
            >
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: records.length,  icon: GraduationCap, color: '#64748b' },
          { label: 'Up to Date',    value: current,         icon: CheckCircle2,  color: '#22c55e' },
          { label: 'Expiring Soon', value: expiringSoon,    icon: Clock,         color: '#f59e0b' },
          { label: 'Overdue',       value: overdue,         icon: AlertCircle,   color: '#ef4444' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Overall Training Completion</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{current} of {records.length} records current</p>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {records.length > 0 ? Math.round((current / records.length) * 100) : 0}%
          </span>
        </div>
        <div className="h-2" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-full transition-all"
            style={{ width: `${records.length > 0 ? (current / records.length) * 100 : 0}%`, background: '#22c55e' }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 inline-block" />Current: {current}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 inline-block" />Expiring: {expiringSoon}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 inline-block" />Overdue: {overdue}</span>
        </div>
      </Card>

      {/* ── List View ───────────────────────────────────────────────────────── */}
      {view === 'list' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  {['Staff Member', 'Course', 'Completed', 'Expiry', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map(record => {
                  const cfg = statusCfg[record.status as keyof typeof statusCfg]
                  return (
                    <tr key={record.id} className="group" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ background: 'var(--accent)', color: '#000' }}
                          >
                            {record.staffName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium" style={{ color: 'var(--text)' }}>{record.staffName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4" style={{ color: 'var(--text-secondary)' }}>{record.course}</td>
                      <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {record.completedDate ? formatDate(record.completedDate) : (
                          <span style={{ color: '#ef4444', fontStyle: 'italic' }}>Not completed</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {record.expiryDate ? formatDate(record.expiryDate) : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            {record.completion === 0 ? 'Assign' : 'Renew'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── TNA Matrix View ─────────────────────────────────────────────────── */}
      {view === 'matrix' && (() => {
        const requiredCount = tnaCourses.map(c =>
          tnaRoles.filter(r => requirements[c.id]?.[r.id]).length
        )

        return (
          <div className="space-y-4">
            {/* Matrix toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Training Needs Analysis Matrix</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {totalRequired} requirements across {tnaCourses.length} courses and {tnaRoles.length} roles
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Mode toggle */}
                <div className="flex gap-0" style={{ border: '1px solid var(--border)' }}>
                  {([
                    { key: 'requirements', label: 'Requirements' },
                    { key: 'gap',          label: 'Gap Analysis'  },
                  ] as { key: 'requirements' | 'gap'; label: string }[]).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setMatrixMode(key)}
                      className="px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background: matrixMode === key ? 'var(--accent)' : 'var(--bg)',
                        color: matrixMode === key ? '#000' : 'var(--text-muted)',
                        borderRight: key === 'requirements' ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Edit mode toggle */}
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
                  >
                    <Pencil size={12} /> Edit Matrix
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setAddCourseOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg)' }}
                    >
                      <Plus size={11} /> Course
                    </button>
                    <button
                      onClick={() => setAddRoleOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg)' }}
                    >
                      <Plus size={11} /> Role
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black"
                      style={{ background: 'var(--accent)' }}
                    >
                      <Check size={12} /> Done
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Editing banner */}
            {editMode && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium"
                style={{ background: '#FFD94018', border: '1px solid #FFD94050' }}
              >
                <Pencil size={12} style={{ color: '#b45309' }} />
                <span style={{ color: '#b45309' }}>
                  Edit mode active — click any cell to toggle whether that role requires that training. Click <strong>Done</strong> when finished.
                </span>
              </div>
            )}

            {/* The matrix table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="text-xs border-collapse" style={{ minWidth: '100%' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {/* Course column header */}
                      <th
                        className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider"
                        style={{
                          color: 'var(--text-muted)',
                          background: 'var(--bg-secondary)',
                          minWidth: 220,
                          position: 'sticky',
                          left: 0,
                          zIndex: 2,
                          borderRight: '2px solid var(--border)',
                        }}
                      >
                        Course / Training Module
                      </th>
                      {/* Frequency column */}
                      <th
                        className="py-3 px-3 font-semibold text-xs uppercase tracking-wider text-center"
                        style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)', minWidth: 72, borderRight: '1px solid var(--border)' }}
                      >
                        Freq
                      </th>
                      {/* Role columns — rotated headers */}
                      {tnaRoles.map(role => (
                        <th
                          key={role.id}
                          style={{
                            background: 'var(--bg-secondary)',
                            minWidth: 52,
                            width: 52,
                            verticalAlign: 'bottom',
                            padding: '0 4px 8px',
                            borderRight: '1px solid var(--border)',
                            position: 'relative',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            {editMode && (
                              <button
                                onClick={() => removeRole(role.id)}
                                className="opacity-60 hover:opacity-100 transition-opacity"
                                title={`Remove ${role.name}`}
                                style={{ color: '#ef4444' }}
                              >
                                <X size={10} />
                              </button>
                            )}
                            <div
                              style={{
                                writingMode: 'vertical-rl' as const,
                                transform: 'rotate(180deg)',
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                whiteSpace: 'nowrap',
                                maxHeight: 120,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                paddingBottom: 2,
                              }}
                              title={role.name}
                            >
                              {role.name}
                            </div>
                          </div>
                        </th>
                      ))}
                      {/* Required count column */}
                      <th
                        className="py-3 px-3 font-semibold text-xs uppercase tracking-wider text-center"
                        style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)', minWidth: 56 }}
                      >
                        Req'd
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tnaCourses.map((course, cIdx) => {
                      const catCfg = categoryConfig[course.category]
                      const freqCfg = frequencyConfig[course.frequency]
                      const CatIcon = catCfg.icon
                      const reqCount = tnaRoles.filter(r => requirements[course.id]?.[r.id]).length

                      return (
                        <tr
                          key={course.id}
                          style={{
                            borderBottom: '1px solid var(--border)',
                            background: cIdx % 2 === 0 ? 'var(--bg)' : 'var(--bg-secondary)',
                          }}
                        >
                          {/* Course name cell (sticky) */}
                          <td
                            style={{
                              padding: '10px 16px',
                              position: 'sticky',
                              left: 0,
                              zIndex: 1,
                              borderRight: '2px solid var(--border)',
                              background: cIdx % 2 === 0 ? 'var(--bg)' : 'var(--bg-secondary)',
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              {editMode && (
                                <button
                                  onClick={() => removeCourse(course.id)}
                                  className="opacity-50 hover:opacity-100 flex-shrink-0 transition-opacity"
                                  title="Remove course"
                                  style={{ color: '#ef4444' }}
                                >
                                  <X size={11} />
                                </button>
                              )}
                              <div
                                className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                                style={{ background: catCfg.bg }}
                              >
                                <CatIcon size={12} style={{ color: catCfg.color }} />
                              </div>
                              <span className="font-medium" style={{ color: 'var(--text)' }}>{course.name}</span>
                            </div>
                          </td>

                          {/* Frequency cell */}
                          <td className="text-center" style={{ padding: '10px 8px', borderRight: '1px solid var(--border)' }}>
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide"
                              style={{ color: freqCfg.color, background: freqCfg.color + '20' }}
                            >
                              {freqCfg.label}
                            </span>
                          </td>

                          {/* Role cells */}
                          {tnaRoles.map(role => {
                            const isRequired = !!(requirements[course.id]?.[role.id])
                            const gap = matrixMode === 'gap' ? gapData[course.id]?.[role.id] : null

                            // Gap analysis cell
                            if (matrixMode === 'gap' && isRequired) {
                              const completed = gap?.completed ?? 0
                              const total     = gap?.total ?? 0
                              const gapColor  = total === 0 ? '#94a3b8'
                                : completed === total ? '#22c55e'
                                : completed > 0 ? '#f59e0b'
                                : '#ef4444'

                              return (
                                <td key={role.id} className="text-center" style={{ padding: '8px 4px', borderRight: '1px solid var(--border)' }}>
                                  <div
                                    className="inline-flex items-center justify-center mx-auto font-bold"
                                    style={{
                                      background: gapColor + '20',
                                      color: gapColor,
                                      border: `1px solid ${gapColor}40`,
                                      minWidth: 36,
                                      height: 26,
                                      fontSize: 11,
                                      padding: '0 6px',
                                    }}
                                  >
                                    {total === 0 ? '—' : `${completed}/${total}`}
                                  </div>
                                </td>
                              )
                            }

                            // Requirements mode cell (not required in gap mode)
                            if (matrixMode === 'gap' && !isRequired) {
                              return (
                                <td key={role.id} className="text-center" style={{ padding: '8px 4px', borderRight: '1px solid var(--border)' }}>
                                  <span style={{ color: 'var(--border)', fontSize: 14, fontWeight: 700 }}>─</span>
                                </td>
                              )
                            }

                            // Requirements mode
                            return (
                              <td
                                key={role.id}
                                className="text-center"
                                style={{
                                  padding: '8px 4px',
                                  borderRight: '1px solid var(--border)',
                                  cursor: editMode ? 'pointer' : 'default',
                                }}
                                onClick={() => toggleRequirement(course.id, role.id)}
                                title={editMode ? `Click to ${isRequired ? 'remove' : 'add'} requirement` : undefined}
                              >
                                {isRequired ? (
                                  <div
                                    className="w-7 h-7 mx-auto flex items-center justify-center transition-all"
                                    style={{
                                      background: editMode ? '#FFD940' : 'var(--accent)',
                                      border: editMode ? '2px solid #b45309' : 'none',
                                    }}
                                    onMouseEnter={e => { if (editMode) (e.currentTarget as HTMLElement).style.background = '#ef444420' }}
                                    onMouseLeave={e => { if (editMode) (e.currentTarget as HTMLElement).style.background = 'var(--accent)' }}
                                  >
                                    <Check size={13} style={{ color: '#000' }} />
                                  </div>
                                ) : (
                                  <div
                                    className="w-7 h-7 mx-auto flex items-center justify-center transition-all"
                                    style={{ background: 'transparent' }}
                                    onMouseEnter={e => { if (editMode) (e.currentTarget as HTMLElement).style.background = '#22c55e20' }}
                                    onMouseLeave={e => { if (editMode) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                                  >
                                    <span style={{ color: 'var(--border)', fontSize: 15, fontWeight: 700 }}>─</span>
                                  </div>
                                )}
                              </td>
                            )
                          })}

                          {/* Required count */}
                          <td className="text-center" style={{ padding: '10px 8px' }}>
                            <span
                              className="text-xs font-bold"
                              style={{ color: reqCount > 0 ? 'var(--text)' : 'var(--text-muted)' }}
                            >
                              {reqCount}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>

                  {/* Footer: required count per role */}
                  <tfoot>
                    <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--bg-secondary)' }}>
                      <td
                        className="py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: 'var(--text-muted)',
                          position: 'sticky',
                          left: 0,
                          background: 'var(--bg-secondary)',
                          borderRight: '2px solid var(--border)',
                        }}
                      >
                        Required courses per role
                      </td>
                      <td style={{ borderRight: '1px solid var(--border)' }} />
                      {tnaRoles.map(role => {
                        const count = tnaCourses.filter(c => requirements[c.id]?.[role.id]).length
                        return (
                          <td key={role.id} className="text-center py-3" style={{ borderRight: '1px solid var(--border)' }}>
                            <span
                              className="text-xs font-bold"
                              style={{ color: count > 0 ? 'var(--text)' : 'var(--text-muted)' }}
                            >
                              {count}
                            </span>
                          </td>
                        )
                      })}
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Legend */}
              <div
                className="px-4 py-3 flex flex-wrap gap-5 text-xs"
                style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}
              >
                {matrixMode === 'requirements' ? (
                  <>
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
                        <Check size={11} style={{ color: '#000' }} />
                      </span>
                      Required
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--border)' }}>─</span>
                      Not required
                    </span>
                    <span className="flex items-center gap-3 ml-4" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.25rem' }}>
                      Category:
                    </span>
                    {Object.entries(categoryConfig).map(([key, cfg]) => (
                      <span key={key} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 inline-block" style={{ background: cfg.color }} />
                        {cfg.label}
                      </span>
                    ))}
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: '#22c55e20', color: '#22c55e' }}>2/2</span>
                      All complete
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>1/2</span>
                      Partially complete
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>0/2</span>
                      Not completed
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--border)' }}>─</span>
                      Not required for this role
                    </span>
                  </>
                )}
              </div>
            </Card>

            {/* Category legend cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(categoryConfig).map(([key, cfg]) => {
                const Icon = cfg.icon
                const count = tnaCourses.filter(c => c.category === key).length
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}
                  >
                    <Icon size={16} style={{ color: cfg.color, flexShrink: 0 }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{count} course{count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ── Add Training Record Drawer ───────────────────────────────────────── */}
      <Drawer
        open={showRecordDrawer}
        onClose={() => { setShowRecordDrawer(false); setRecordForm({ ...emptyRecord }) }}
        title="Add Training Record"
        subtitle="Log a staff training completion"
      >
        <form onSubmit={handleAddRecord} className="space-y-4">
          <Field label="Staff Member" required>
            <TextInput value={recordForm.staffName} onChange={v => setRecordForm(f => ({ ...f, staffName: v }))} placeholder="Full name" />
          </Field>
          <Field label="Course" required>
            <TextInput value={recordForm.course} onChange={v => setRecordForm(f => ({ ...f, course: v }))} placeholder="Course name" />
          </Field>
          <Field label="Provider">
            <TextInput value={recordForm.provider} onChange={v => setRecordForm(f => ({ ...f, provider: v }))} placeholder="Training provider" />
          </Field>
          <Field label="Completed Date">
            <TextInput type="date" value={recordForm.completedDate} onChange={v => setRecordForm(f => ({ ...f, completedDate: v }))} />
          </Field>
          <Field label="Expiry Date">
            <TextInput type="date" value={recordForm.expiryDate} onChange={v => setRecordForm(f => ({ ...f, expiryDate: v }))} />
          </Field>
          <Field label="Status">
            <RadioGroup
              value={recordForm.status}
              onChange={v => setRecordForm(f => ({ ...f, status: v }))}
              options={[
                { value: 'current',        label: 'Current'       },
                { value: 'expiring-soon',  label: 'Expiring Soon' },
                { value: 'overdue',        label: 'Overdue'       },
              ]}
              colorMap={{ current: '#22c55e', 'expiring-soon': '#f59e0b', overdue: '#ef4444' }}
            />
          </Field>
          <SubmitRow saving={recordSaving} saved={recordSaved} submitLabel="Add Record" savedLabel="Saved!" onCancel={() => setShowRecordDrawer(false)} />
        </form>
      </Drawer>

      {/* ── Add Course Drawer ──────────────────────────────────────────────── */}
      <Drawer
        open={addCourseOpen}
        onClose={() => { setAddCourseOpen(false); setNewCourse({ name: '', category: 'safety', frequency: 'annual' }) }}
        title="Add Training Course"
        subtitle="Add a new course to the TNA matrix"
      >
        <form onSubmit={handleAddCourse} className="space-y-4">
          <Field label="Course Name" required>
            <TextInput value={newCourse.name} onChange={v => setNewCourse(f => ({ ...f, name: v }))} placeholder="e.g. Confined Space Entry" />
          </Field>
          <Field label="Category" required>
            <Select
              value={newCourse.category}
              onChange={v => setNewCourse(f => ({ ...f, category: v as TnaCourseCategory }))}
              options={[
                { value: 'safety',      label: 'Safety'      },
                { value: 'compliance',  label: 'Compliance'  },
                { value: 'licence',     label: 'Licence'     },
                { value: 'operational', label: 'Operational' },
              ]}
              placeholder="Select category…"
            />
          </Field>
          <Field label="Renewal Frequency" required>
            <Select
              value={newCourse.frequency}
              onChange={v => setNewCourse(f => ({ ...f, frequency: v as TnaCourseFrequency }))}
              options={[
                { value: 'once',     label: 'Once (no renewal)' },
                { value: 'annual',   label: 'Annual'            },
                { value: 'biennial', label: 'Every 2 years'     },
                { value: '3-year',   label: 'Every 3 years'     },
              ]}
              placeholder="Select frequency…"
            />
          </Field>
          <SubmitRow saving={courseSaving} saved={courseSaved} submitLabel="Add Course" savedLabel="Added!" onCancel={() => setAddCourseOpen(false)} />
        </form>
      </Drawer>

      {/* ── Add Role Drawer ────────────────────────────────────────────────── */}
      <Drawer
        open={addRoleOpen}
        onClose={() => { setAddRoleOpen(false); setNewRole({ name: '', department: '' }) }}
        title="Add Role"
        subtitle="Add a new job role to the TNA matrix"
      >
        <form onSubmit={handleAddRole} className="space-y-4">
          <Field label="Role Name" required>
            <TextInput value={newRole.name} onChange={v => setNewRole(f => ({ ...f, name: v }))} placeholder="e.g. Crane Operator" />
          </Field>
          <Field label="Department">
            <TextInput value={newRole.department} onChange={v => setNewRole(f => ({ ...f, department: v }))} placeholder="e.g. Civil" />
          </Field>
          <SubmitRow saving={roleSaving} saved={roleSaved} submitLabel="Add Role" savedLabel="Added!" onCancel={() => setAddRoleOpen(false)} />
        </form>
      </Drawer>
    </div>
  )
}
