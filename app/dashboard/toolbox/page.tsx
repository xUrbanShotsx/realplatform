'use client'

import { useState, useEffect } from 'react'
import { toolboxTalks } from '@/lib/mock-data'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, ClipboardList, BarChart2 } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'completed' | 'scheduled'

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}) {
  return (
    <Card style={{ borderColor: 'var(--border)' }}>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: accent ? '#FFD940' : 'var(--text)' }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Talk Row ────────────────────────────────────────────────────────────────

function TalkRow({ talk }: { talk: (typeof toolboxTalks)[number] }) {
  const [hovered, setHovered] = useState(false)

  const formattedDate = new Date(talk.date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const isScheduled = talk.status === 'scheduled'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid var(--border)',
        background: hovered ? 'var(--bg-hover)' : 'transparent',
        transition: 'background 0.12s',
        padding: '12px 16px',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: date + topic + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Date */}
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: isScheduled ? '#f59e0b' : 'var(--text-muted)' }}
            >
              {formattedDate}
            </span>

            {/* AI badge */}
            {talk.aiGenerated && (
              <span
                className="text-xs font-bold px-1.5 py-0 leading-5"
                style={{
                  background: '#FFD940',
                  color: '#000',
                  fontSize: '10px',
                  letterSpacing: '0.04em',
                }}
              >
                AI
              </span>
            )}

            {/* Status badge */}
            <span
              className="text-xs font-semibold px-2 py-0 leading-5"
              style={{
                background: isScheduled ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)',
                color: isScheduled ? '#f59e0b' : '#16a34a',
                border: `1px solid ${isScheduled ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}`,
              }}
            >
              {isScheduled ? 'Scheduled' : 'Completed'}
            </span>
          </div>

          {/* Topic */}
          <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text)' }}>
            {talk.topic}
          </p>

          {/* Presenter + site + stats */}
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {talk.presenter} · {talk.site}
            </span>

            {!isScheduled && (
              <>
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  {/* person icon */}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5 6H3a1 1 0 0 1-1-1c0-2.21 2.69-4 6-4s6 1.79 6 4a1 1 0 0 1-1 1z"/>
                  </svg>
                  {talk.attendees}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {talk.duration} min
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: hover actions */}
        <div
          className="flex items-center gap-2 flex-shrink-0"
          style={{
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.12s',
            pointerEvents: hovered ? 'auto' : 'none',
          }}
        >
          <Button variant="outline" size="sm">
            View Notes
          </Button>
          {isScheduled && (
            <Button variant="default" size="sm" style={{ background: '#FFD940', color: '#000', borderColor: '#FFD940' }}>
              Record Attendance
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── AI Generator Panel ──────────────────────────────────────────────────────

const QUICK_CHIPS = [
  'Heat Stress',
  'Working at Heights',
  'Manual Handling',
  'Electrical Safety',
  'Chemical Hazards',
  'Housekeeping',
]

const DURATIONS = [5, 10, 15] as const

const GENERATED_CONTENT = `Topic: Working at Heights — Ladder Safety

Opening (1 min):
"Before we start work today, I want to spend 10 minutes on ladder safety. Falls from height are the #1 cause of fatalities in construction..."

Key Points:
1. Always inspect your ladder before use — check feet, rungs, and locks
2. Maintain 3-point contact at all times (2 hands + 1 foot, or 2 feet + 1 hand)
3. Set ladder at correct angle: 1 out for every 4 up (75°)
4. Never overreach — keep your belt buckle between the rails
5. Secure the top and bottom — use a spotter if needed

Discussion Questions:
• "Has anyone experienced a near miss with a ladder? What happened?"
• "What would you do if you found a damaged ladder on site?"

Key Takeaway:
"If it's not safe to climb, don't climb. Never take a shortcut with ladder safety."

Legislation Reference: WHS Regulation 2017 — r.78 Managing risk of falls`

function AIGeneratorPanel() {
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState<5 | 10 | 15>(10)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [saved, setSaved] = useState(false)
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!generating) return
    const timer = setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [generating])

  // Typewriter effect when content appears
  useEffect(() => {
    if (!generated) return
    setDisplayedText('')
    let i = 0
    const interval = setInterval(() => {
      i += 4
      if (i >= GENERATED_CONTENT.length) {
        setDisplayedText(GENERATED_CONTENT)
        clearInterval(interval)
      } else {
        setDisplayedText(GENERATED_CONTENT.slice(0, i))
      }
    }, 12)
    return () => clearInterval(interval)
  }, [generated])

  function handleGenerate() {
    if (generating) return
    setGenerated(false)
    setDisplayedText('')
    setSaved(false)
    setGenerating(true)
  }

  function handleSave() {
    setSaved(true)
  }

  return (
    <Card style={{ position: 'sticky', top: '1rem', borderColor: 'var(--border)' }}>
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap size={14} color="#FFD940" strokeWidth={1.75} />
          Generate Toolbox Talk
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        {/* Topic input */}
        <div>
          <label
            className="text-xs font-medium block mb-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            What's the safety topic?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Ladder safety, Chemical handling..."
            className="w-full text-sm px-3 py-2"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#FFD940')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
          {/* Quick-select chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setTopic(chip)}
                className="text-xs px-2 py-1"
                style={{
                  background: topic === chip ? '#FFD940' : 'var(--bg-secondary)',
                  color: topic === chip ? '#000' : 'var(--text-secondary)',
                  border: `1px solid ${topic === chip ? '#FFD940' : 'var(--border)'}`,
                  cursor: 'pointer',
                  fontWeight: topic === chip ? 600 : 400,
                  transition: 'all 0.1s',
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Duration selector */}
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Duration
          </label>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className="flex-1 text-sm py-1.5 font-semibold"
                style={{
                  background: duration === d ? '#FFD940' : 'var(--bg-secondary)',
                  color: duration === d ? '#000' : 'var(--text-secondary)',
                  border: `1px solid ${duration === d ? '#FFD940' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                }}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-2.5 text-sm font-bold flex items-center justify-center gap-2"
          style={{
            background: generating ? 'rgba(255,217,64,0.5)' : '#FFD940',
            color: '#000',
            border: 'none',
            cursor: generating ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {generating ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(0,0,0,0.3)',
                  borderTopColor: '#000',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
              Generating...
            </>
          ) : (
            <><Zap size={13} strokeWidth={1.75} style={{ marginRight: 5 }} /> Generate Talking Points</>
          )}
        </button>

        {/* Loading skeleton */}
        {generating && (
          <div className="space-y-2 pt-1">
            {[100, 80, 90, 70, 85].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 10,
                  width: `${w}%`,
                  background: 'var(--bg-hover)',
                  animation: 'pulse 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Generated content */}
        {generated && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '12px',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: '#FFD940' }}
              >
                Generated Content
              </span>
              <span
                className="text-xs px-2 py-0.5 font-bold"
                style={{ background: '#FFD940', color: '#000' }}
              >
                AI
              </span>
            </div>
            <pre
              className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
              style={{ color: 'var(--text)', fontFamily: 'inherit' }}
            >
              {displayedText}
              {displayedText.length < GENERATED_CONTENT.length && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: '1em',
                    background: '#FFD940',
                    verticalAlign: 'text-bottom',
                    animation: 'blink 0.8s step-start infinite',
                  }}
                />
              )}
            </pre>

            {/* Action buttons */}
            {displayedText === GENERATED_CONTENT && (
              <div className="flex flex-col gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={handleSave}
                  className="w-full py-2 text-sm font-bold"
                  style={{
                    background: saved ? 'rgba(34,197,94,0.15)' : '#FFD940',
                    color: saved ? '#16a34a' : '#000',
                    border: saved ? '1px solid rgba(34,197,94,0.4)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {saved ? '✓ Saved to Library' : 'Save to Library'}
                </button>
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2 text-sm font-semibold"
                    style={{
                      background: 'transparent',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                  >
                    Schedule Talk
                  </button>
                  <button
                    className="flex-1 py-2 text-sm font-semibold"
                    style={{
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    Print
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Keyframe styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </Card>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ToolboxPage() {
  const [filter, setFilter] = useState<FilterTab>('all')

  // Stats
  const completed = toolboxTalks.filter((t) => t.status === 'completed')
  const scheduled = toolboxTalks.filter((t) => t.status === 'scheduled')
  const totalAttendees = completed.reduce((sum, t) => sum + t.attendees, 0)
  const aiGenerated = toolboxTalks.filter((t) => t.aiGenerated)

  const filtered = toolboxTalks.filter((t) => {
    if (filter === 'completed') return t.status === 'completed'
    if (filter === 'scheduled') return t.status === 'scheduled'
    return true
  })

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: toolboxTalks.length },
    { key: 'completed', label: 'Completed', count: completed.length },
    { key: 'scheduled', label: 'Scheduled', count: scheduled.length },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '24px' }}>
      <PageHeader
        title="Toolbox Talks"
        description="Manage safety toolbox talks, record attendance, and generate AI-powered content."
        action={{ label: '+ Schedule Talk' }}
      />

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard
          label="Completed This Month"
          value={completed.length}
          sub="of 10 target"
        />
        <StatCard
          label="Total Attendees"
          value={totalAttendees}
          sub="across completed talks"
        />
        <StatCard
          label="Scheduled"
          value={scheduled.length}
          sub="upcoming talks"
        />
        <StatCard
          label="AI Generated"
          value={aiGenerated.length}
          sub={`${Math.round((aiGenerated.length / toolboxTalks.length) * 100)}% of all talks`}
          accent
        />
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6" style={{ alignItems: 'flex-start' }}>
        {/* Left: Talks list (60%) */}
        <div style={{ flex: '0 0 60%', minWidth: 0 }}>
          <Card style={{ borderColor: 'var(--border)' }}>
            {/* Filter tabs */}
            <div
              className="flex items-center gap-0"
              style={{
                borderBottom: '1px solid var(--border)',
                padding: '0 16px',
              }}
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className="text-sm font-medium px-4 py-3 flex items-center gap-1.5"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: filter === tab.key ? '2px solid #FFD940' : '2px solid transparent',
                    color: filter === tab.key ? 'var(--text)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    marginBottom: -1,
                    transition: 'color 0.1s',
                  }}
                >
                  {tab.label}
                  <span
                    className="text-xs px-1.5 py-0 leading-5 font-bold"
                    style={{
                      background: filter === tab.key ? '#FFD940' : 'var(--bg-secondary)',
                      color: filter === tab.key ? '#000' : 'var(--text-muted)',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Talk rows */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <ClipboardList size={32} strokeWidth={1} color="var(--text-muted)" />
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  No talks match this filter
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Try switching to a different tab or schedule a new talk.
                </p>
              </div>
            ) : (
              <div>
                {filtered.map((talk) => (
                  <TalkRow key={talk.id} talk={talk} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: AI Generator (40%) */}
        <div style={{ flex: '0 0 40%', minWidth: 0 }}>
          <AIGeneratorPanel />
        </div>
      </div>

      {/* Compliance insight banner */}
      <div
        className="mt-6 px-4 py-3 flex items-center justify-between gap-4"
        style={{
          background: 'rgba(245,158,11,0.06)',
          borderLeft: '3px solid #f59e0b',
          border: '1px solid rgba(245,158,11,0.2)',
          borderLeftWidth: 3,
          borderLeftColor: '#f59e0b',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><BarChart2 size={14} strokeWidth={1.75} /> Compliance Insight:</span>
          </span>{' '}
          Site B's last toolbox talk was 9 days ago. WHS policy requires weekly talks on active sites.
        </p>
        <button
          className="text-sm font-semibold whitespace-nowrap flex items-center gap-1"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f59e0b',
            cursor: 'pointer',
          }}
        >
          Schedule one now →
        </button>
      </div>
    </div>
  )
}
