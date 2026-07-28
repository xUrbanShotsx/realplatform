'use client'

import { useState } from 'react'
import { Flame, Trophy, Zap, CheckCircle2, TrendingUp, Search, FileText, Medal, Lock } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import {
  achievements,
  userProfile,
  leaderboard,
  recentXPActivity,
  type AchievementCategory,
  type AchievementRarity,
} from '@/lib/gamification'

// ─── Helpers ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  tasks: 'Tasks',
  safety: 'Safety',
  documents: 'Documents',
  streak: 'Streaks',
  compliance: 'Compliance',
  inspections: 'Inspections',
}

const RARITY_STYLES: Record<AchievementRarity, { label: string; bg: string; color: string }> = {
  common:    { label: 'Common',    bg: 'rgba(120,120,120,0.15)', color: 'var(--text-muted)'    },
  rare:      { label: 'Rare',      bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6'               },
  epic:      { label: 'Epic',      bg: 'rgba(168,85,247,0.15)', color: '#a855f7'               },
  legendary: { label: 'Legendary', bg: 'rgba(255,217,64,0.18)', color: 'var(--accent)'         },
}

const XP_ACTIVITY_ICONS: Record<string, React.ElementType> = {
  achievement: Trophy,
  task:        CheckCircle2,
  levelup:     TrendingUp,
  challenge:   Zap,
  inspection:  Search,
  document:    FileText,
}

const TREND_ICON: Record<string, string> = {
  up:   '▲',
  down: '▼',
  same: '—',
}

const TREND_COLOR: Record<string, string> = {
  up:   '#22c55e',
  down: '#ef4444',
  same: 'var(--text-muted)',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 0,
        background: 'var(--accent)',
        color: 'var(--accent-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.35,
        flexShrink: 0,
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </div>
  )
}

function RarityBadge({ rarity }: { rarity: AchievementRarity }) {
  const s = RARITY_STYLES[rarity]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        background: s.bg,
        color: s.color,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderRadius: 0,
      }}
    >
      {s.label}
    </span>
  )
}

function XpBadge({ points }: { points: number }) {
  if (points === 0) return null
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        background: 'rgba(255,217,64,0.15)',
        color: 'var(--accent)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.04em',
        borderRadius: 0,
      }}
    >
      +{points} XP
    </span>
  )
}

function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 0, overflow: 'hidden' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: 'var(--accent)',
          borderRadius: 0,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  )
}

// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroCard() {
  const xpPct = Math.round((userProfile.xp / userProfile.xpToNextLevel) * 100)

  return (
    <div
      style={{
        background: 'var(--text)',
        color: 'var(--bg)',
        padding: '32px 36px',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Identity row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            background: 'var(--accent)',
            color: 'var(--accent-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 20,
            borderRadius: 0,
            flexShrink: 0,
          }}
        >
          {userProfile.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em' }}>
            {userProfile.name}
          </div>
          <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2, fontWeight: 500 }}>
            Level {userProfile.level} · {userProfile.levelName}
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Progress to Level {userProfile.level + 1}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            {userProfile.xp.toLocaleString()} / {userProfile.xpToNextLevel.toLocaleString()} XP to Level {userProfile.level + 1}
          </span>
        </div>
        <div style={{ width: '100%', height: 10, background: 'rgba(0,0,0,0.10)', borderRadius: 0, overflow: 'hidden' }}>
          <div
            style={{
              width: `${xpPct}%`,
              height: '100%',
              background: 'var(--accent)',
              borderRadius: 0,
              transition: 'width 0.6s ease',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 4,
                height: '100%',
                background: 'rgba(0,0,0,0.25)',
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: 11, opacity: 0.5, textAlign: 'right' }}>
          {xpPct}% complete
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
        {[
          { Icon: Flame,        label: `${userProfile.streak}-day streak` },
          { Icon: Trophy,       label: `#${userProfile.rank} on team` },
          { Icon: Zap,          label: `${userProfile.totalXp.toLocaleString()} total XP` },
          { Icon: CheckCircle2, label: `${userProfile.completedTasks} tasks done` },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 20px',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
              ...(i === 0 ? { paddingLeft: 0 } : {}),
            }}
          >
            <stat.Icon size={16} strokeWidth={1.75} style={{ opacity: 0.9 }} />
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Quick Stats ─────────────────────────────────────────────────────────────

function QuickStats() {
  const earned = achievements.filter((a) => a.earned).length
  const xpThisMonth = 1010
  const streak = userProfile.streak
  const rank = userProfile.rank
  const total = userProfile.totalTeamMembers

  const stats = [
    { Icon: Medal,        label: 'Achievements Earned', value: earned, suffix: '' },
    { Icon: Zap,          label: 'XP This Month',        value: xpThisMonth.toLocaleString(), suffix: ' XP' },
    { Icon: Flame,        label: 'Current Streak',       value: streak, suffix: ' days' },
    { Icon: Trophy,       label: 'Team Rank',             value: `#${rank}`, suffix: ` of ${total}` },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '18px 20px',
            borderRadius: 0,
          }}
        >
          <div style={{ marginBottom: 8 }}><s.Icon size={22} strokeWidth={1.5} color="var(--text-muted)" /></div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {s.value}{s.suffix}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, fontWeight: 500 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Category Filter ──────────────────────────────────────────────────────────

const ALL_CATEGORIES = ['all', 'tasks', 'safety', 'documents', 'streak', 'compliance', 'inspections'] as const

function CategoryFilter({
  active,
  onChange,
}: {
  active: string
  onChange: (c: string) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
      {ALL_CATEGORIES.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            style={{
              padding: '10px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: isActive ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'all 0.15s ease',
              marginBottom: -1,
              borderRadius: 0,
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        )
      })}
    </div>
  )
}

// ─── Achievement Tile ─────────────────────────────────────────────────────────

function AchievementTile({ achievement: a }: { achievement: (typeof achievements)[number] }) {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderLeft: a.earned ? '3px solid var(--accent)' : '1px solid var(--border)',
        padding: '18px 16px',
        borderRadius: 0,
        opacity: a.earned ? 1 : 0.55,
        position: 'relative',
        transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.opacity = '1'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.opacity = a.earned ? '1' : '0.55'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      {/* Icon + lock overlay */}
      <div style={{ position: 'relative', width: 40 }}>
        <span
          style={{
            fontSize: 32,
            filter: a.earned ? 'none' : 'grayscale(1)',
            display: 'block',
            lineHeight: 1,
          }}
        >
          {a.icon}
        </span>
        {!a.earned && (
          <span
            style={{
              position: 'absolute',
              bottom: -2,
              right: -6,
              fontSize: 13,
              background: 'var(--bg)',
              borderRadius: '50%',
              padding: '0 1px',
              lineHeight: 1.4,
            }}
          >
            <Lock size={10} strokeWidth={2} color="var(--text-muted)" />
          </span>
        )}
      </div>

      {/* Title + description */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 3 }}>
          {a.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {a.description}
        </div>
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <RarityBadge rarity={a.rarity} />
        <XpBadge points={a.points} />
      </div>

      {/* Bottom: earned date or progress */}
      {a.earned && a.earnedDate ? (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>✓</span>
          <span>Earned {formatDate(a.earnedDate)}</span>
        </div>
      ) : a.progress !== undefined ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ProgressBar value={Math.min(a.progress, 100)} />
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {Math.min(a.progress, 100)}% complete
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ─── Achievements Grid ────────────────────────────────────────────────────────

function AchievementsGrid({ category }: { category: string }) {
  const filtered =
    category === 'all'
      ? achievements
      : achievements.filter((a) => a.category === (category as AchievementCategory))

  const earned = filtered.filter((a) => a.earned)
  const locked = filtered.filter((a) => !a.earned)
  const sorted = [...earned, ...locked]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {earned.length} earned · {locked.length} locked · {sorted.length} total
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {sorted.map((a) => (
          <AchievementTile key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  )
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

function Leaderboard() {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Team Leaderboard</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {leaderboard.length} team members · Updated today
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Rank', 'Member', 'Level', 'XP', 'Streak', 'Tasks (month)', 'Trend'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => {
              const isMe = entry.isCurrentUser
              return (
                <tr
                  key={entry.rank}
                  style={{
                    background: isMe ? 'rgba(255,217,64,0.08)' : 'transparent',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isMe) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isMe) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  {/* Rank */}
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: isMe ? 'var(--accent)' : 'var(--text)', width: 60 }}>
                    {entry.rank === 1 ? <Medal size={16} color="#f59e0b" strokeWidth={1.75} /> : entry.rank === 2 ? <Medal size={16} color="#94a3b8" strokeWidth={1.75} /> : entry.rank === 3 ? <Medal size={16} color="#b45309" strokeWidth={1.75} /> : `#${entry.rank}`}
                  </td>

                  {/* Member */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={entry.avatar} size={32} />
                      <div>
                        <div style={{ fontWeight: isMe ? 700 : 500, color: 'var(--text)', fontSize: 13 }}>
                          {entry.name}
                          {isMe && (
                            <span
                              style={{
                                marginLeft: 7,
                                fontSize: 10,
                                background: 'var(--accent)',
                                color: 'var(--accent-text)',
                                padding: '1px 6px',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                              }}
                            >
                              YOU
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{entry.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Level */}
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>Lv {entry.level}</span>
                    <span style={{ marginLeft: 5, fontSize: 11, color: 'var(--text-muted)' }}>{entry.levelName}</span>
                  </td>

                  {/* XP */}
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                    {entry.xp.toLocaleString()}
                  </td>

                  {/* Streak */}
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {entry.streak > 0 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={13} color="#f97316" strokeWidth={1.75} /> {entry.streak}d</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>

                  {/* Tasks */}
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {entry.completedThisMonth}
                  </td>

                  {/* Trend */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: TREND_COLOR[entry.trend] }}>
                      {TREND_ICON[entry.trend]}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── XP Activity Feed ─────────────────────────────────────────────────────────

function XPActivityFeed() {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Recent XP Activity</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Your latest XP events</div>
      </div>
      <div style={{ padding: '8px 0' }}>
        {recentXPActivity.map((activity, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 20px',
              borderBottom: i < recentXPActivity.length - 1 ? '1px solid var(--border)' : 'none',
              position: 'relative',
            }}
          >
            {/* Icon bubble */}
            <div
              style={{
                width: 34,
                height: 34,
                background: activity.type === 'levelup' ? 'rgba(255,217,64,0.15)' : 'var(--bg-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                borderRadius: 0,
              }}
            >
              {(() => { const Icon = XP_ACTIVITY_ICONS[activity.type]; return Icon ? <Icon size={16} strokeWidth={1.75} color="var(--text-secondary)" /> : null })()}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text)',
                  fontWeight: activity.type === 'levelup' ? 700 : 500,
                  lineHeight: 1.4,
                }}
              >
                {activity.message}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                {activity.time}
              </div>
            </div>

            {/* XP badge */}
            {activity.points > 0 && (
              <div
                style={{
                  flexShrink: 0,
                  fontSize: 12,
                  fontWeight: 800,
                  color: 'var(--accent)',
                  background: 'rgba(255,217,64,0.12)',
                  padding: '3px 8px',
                  borderRadius: 0,
                  letterSpacing: '0.02em',
                }}
              >
                +{activity.points}
              </div>
            )}
            {activity.type === 'levelup' && (
              <div
                style={{
                  flexShrink: 0,
                  fontSize: 12,
                  fontWeight: 800,
                  color: 'var(--accent)',
                  background: 'rgba(255,217,64,0.12)',
                  padding: '3px 8px',
                  borderRadius: 0,
                }}
              >
                <Trophy size={14} color="var(--accent)" strokeWidth={1.75} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Achievements & Progress"
        description="Track your compliance journey, earn badges, and climb the team leaderboard"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Hero */}
        <HeroCard />

        {/* Quick stats */}
        <QuickStats />

        {/* Achievements section */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '18px 20px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 12 }}>
              Achievements
            </div>
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          </div>
          <div style={{ padding: 20 }}>
            <AchievementsGrid category={activeCategory} />
          </div>
        </div>

        {/* Leaderboard + Activity side by side on wide screens */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
            gap: 16,
            alignItems: 'start',
          }}
        >
          <Leaderboard />
          <XPActivityFeed />
        </div>
      </div>
    </div>
  )
}
