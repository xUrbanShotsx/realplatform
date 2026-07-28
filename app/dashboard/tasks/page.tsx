'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PageHeader } from '@/components/shared/PageHeader'
import { Drawer, Field, TextInput, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { tasks } from '@/lib/mock-data'
import { taskXP, userProfile, dailyChallenges } from '@/lib/gamification'
import { formatDate } from '@/lib/utils'
import { Plus, Search, Flame, Target, Zap } from 'lucide-react'

const priorityDot: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-blue-400',
}

const priorityLabel: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

function getTaskXP(priority: string, status: string): number {
  const base = taskXP[priority] ?? 10
  const bonus = status === 'overdue' ? taskXP.overdue_bonus : status === 'due-today' ? taskXP.due_today_bonus : 0
  return base + bonus
}

// Compute total XP available today (overdue + due-today tasks)
function computeTodayXP(taskList: Task[]): number {
  return taskList
    .filter((t) => t.status === 'overdue' || t.status === 'due-today')
    .reduce((sum, t) => sum + getTaskXP(t.priority, t.status), 0)
}

// Daily challenge banner — pulled from the first tasks challenge
const taskChallenge = dailyChallenges.find((c) => c.category === 'tasks') ?? dailyChallenges[0]

type Task = {
  id: string
  title: string
  assignedTo: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'due-today' | 'overdue' | 'upcoming' | 'completed'
  category: string
  notes?: string
}

const FORM_DEFAULT = { title: '', category: '', assignedTo: '', dueDate: '', priority: 'medium' as Task['priority'] }

export default function TasksPage() {
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Task[]>([...tasks] as Task[])
  const [showDrawer, setShowDrawer] = useState(false)
  const [form, setForm] = useState(FORM_DEFAULT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [xpFlash, setXpFlash] = useState<{ id: string; xp: number } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setItems(prev => [{ id: Date.now().toString(), ...form, status: 'upcoming' as const, notes: '' }, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setShowDrawer(false)
        setForm(FORM_DEFAULT)
      }, 1200)
    }, 700)
  }

  function markComplete(id: string) {
    const task = items.find(t => t.id === id)
    if (!task || task.status === 'completed') return
    const xp = getTaskXP(task.priority, task.status)
    setItems(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' as const } : t))
    setXpFlash({ id, xp })
    setTimeout(() => setXpFlash(null), 1500)
  }

  const filtered = (status?: string) =>
    items.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      if (!status || status === 'all') return matchesSearch
      return matchesSearch && t.status === status
    })

  const overdueTasks = filtered('overdue')
  const dueTodayTasks = filtered('due-today')
  const upcomingTasks = filtered('upcoming')
  const allTasks = filtered()

  const todayXP = computeTodayXP(items)
  const challengeProgressPct = Math.min(100, Math.round((taskChallenge.progress / taskChallenge.total) * 100))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage and track all compliance tasks"
        action={{ label: 'Add Task', icon: <Plus size={14} />, onClick: () => setShowDrawer(true) }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search tasks…"
            className="pl-8 w-52"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* Completion streak indicator */}
      <p
        className="text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Flame size={12} color="#f97316" strokeWidth={1.75} /> {userProfile.streak}-day streak · {userProfile.completedTasks} tasks completed · #{userProfile.rank} on team leaderboard</span>
      </p>

      {/* Daily Challenge Progress banner */}
      <div
        className="flex items-center gap-4 px-4 py-3"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--accent)',
        }}
      >
        <span className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Target size={14} strokeWidth={1.75} /> Daily Challenge: Complete {taskChallenge.total} tasks</span>
        </span>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div
            className="flex-1 h-1.5 overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <div
              className="h-full transition-all"
              style={{ width: `${challengeProgressPct}%`, background: 'var(--accent)' }}
            />
          </div>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
            {taskChallenge.progress}/{taskChallenge.total} complete
          </span>
        </div>

        <span
          className="text-xs font-semibold whitespace-nowrap px-2 py-0.5"
          style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
        >
          +{taskChallenge.reward} XP on completion
        </span>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap items-center">
        {[
          { label: 'Overdue', count: overdueTasks.length, color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
          { label: 'Due Today', count: dueTodayTasks.length, color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
          { label: 'Upcoming', count: upcomingTasks.length, color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
          { label: 'Total', count: allTasks.length, color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${color}`}>
            {label}
            <span className="text-xs font-bold">{count}</span>
          </div>
        ))}

        {/* XP available today */}
        <div
          className="ml-auto text-xs font-semibold px-3 py-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Zap size={12} strokeWidth={1.75} /> ~{todayXP} XP available today</span>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
          <TabsTrigger value="today">Due Today ({dueTodayTasks.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        {[
          { value: 'all', data: allTasks },
          { value: 'overdue', data: overdueTasks },
          { value: 'today', data: dueTodayTasks },
          { value: 'upcoming', data: upcomingTasks },
        ].map(({ value, data }) => (
          <TabsContent key={value} value={value}>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 dark:border-neutral-800">
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Task</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Assigned To</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Due Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Priority</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">XP Reward</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-400 text-sm">No tasks found</td>
                      </tr>
                    ) : data.map((task) => {
                      const xp = getTaskXP(task.priority, task.status)
                      const isFlashing = xpFlash?.id === task.id
                      return (
                        <tr
                          key={task.id}
                          className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer relative"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
                              <span className="font-medium text-black dark:text-white">{task.title}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">{task.assignedTo}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded-full font-medium">
                              {task.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">{formatDate(task.dueDate)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`text-xs font-semibold ${
                              task.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                              task.priority === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
                            }`}>
                              {priorityLabel[task.priority]}
                            </span>
                          </td>
                          {/* XP Reward badge */}
                          <td className="py-3.5 px-4">
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 whitespace-nowrap"
                              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
                            >
                              +{xp} XP
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {isFlashing ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 whitespace-nowrap animate-pulse" style={{ background: '#22c55e', color: '#fff' }}>
                                  +{xpFlash.xp} XP earned!
                                </span>
                              ) : (
                                <StatusBadge status={task.status} />
                              )}
                              {/* Mark Complete quick action — visible on row hover, hidden for completed tasks */}
                              {task.status !== 'completed' && (
                                <button
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap"
                                  style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markComplete(task.id)
                                  }}
                                >
                                  ✓ Complete (+{xp} XP)
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
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Task Drawer */}
      <Drawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="Add Task"
        subtitle="Create a new compliance task"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title" required>
            <TextInput
              value={form.title}
              onChange={(v) => setForm(f => ({ ...f, title: v }))}
              placeholder="e.g. Review fire safety procedures"
            />
          </Field>

          <Field label="Category">
            <Select
              value={form.category}
              onChange={(v) => setForm(f => ({ ...f, category: v }))}
              options={['WHS', 'Training', 'Documents', 'Inspection', 'Environmental', 'Administrative']}
              placeholder="Select category…"
            />
          </Field>

          <Field label="Assigned To">
            <TextInput
              value={form.assignedTo}
              onChange={(v) => setForm(f => ({ ...f, assignedTo: v }))}
              placeholder="e.g. Jane Smith"
            />
          </Field>

          <Field label="Due Date">
            <TextInput
              type="date"
              value={form.dueDate}
              onChange={(v) => setForm(f => ({ ...f, dueDate: v }))}
            />
          </Field>

          <Field label="Priority">
            <RadioGroup
              value={form.priority}
              onChange={(v) => setForm(f => ({ ...f, priority: v as Task['priority'] }))}
              options={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              colorMap={{ high: '#ef4444', medium: '#f59e0b', low: '#60a5fa' }}
            />
          </Field>

          <SubmitRow
            saving={saving}
            saved={saved}
            submitLabel="Add Task"
            savedLabel="Task Added!"
            onCancel={() => setShowDrawer(false)}
          />
        </form>
      </Drawer>
    </div>
  )
}
