'use client'

import { achievements, type Achievement, type AchievementRarity } from '@/lib/gamification'

interface AchievementsGridProps {
  limit?: number
  showAll?: boolean
  filterCategory?: string
}

const RARITY_STYLES: Record<AchievementRarity, { bg: string; color: string; label: string }> = {
  common:    { bg: 'var(--bg-hover)',       color: 'var(--text-muted)',    label: 'Common'    },
  rare:      { bg: '#dbeafe',               color: '#1d4ed8',              label: 'Rare'      },
  epic:      { bg: '#ede9fe',               color: '#7c3aed',              label: 'Epic'      },
  legendary: { bg: 'var(--accent)',         color: 'var(--accent-text)',   label: 'Legendary' },
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function AchievementTile({ achievement }: { achievement: Achievement }) {
  const rarity = RARITY_STYLES[achievement.rarity]
  const progress = achievement.progress ?? 0

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderLeft: achievement.earned ? '2px solid var(--accent)' : '2px solid var(--border)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        opacity: achievement.earned ? 1 : 0.85,
      }}
    >
      {/* Icon row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        {/* Icon square */}
        <div
          style={{
            width: '40px',
            height: '40px',
            background: 'var(--bg-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
            position: 'relative',
            filter: achievement.earned ? 'none' : 'opacity(0.3) grayscale(1)',
          }}
        >
          {achievement.icon}

          {/* Lock overlay */}
          {!achievement.earned && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.25)',
                fontSize: '14px',
                filter: 'none',
              }}
            >
              🔒
            </div>
          )}
        </div>

        {/* Points badge */}
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 6px',
            background: achievement.earned ? 'var(--accent)' : 'var(--bg-hover)',
            color: achievement.earned ? 'var(--accent-text)' : 'var(--text-muted)',
            border: achievement.earned ? 'none' : '1px solid var(--border)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          +{achievement.points} XP
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color: achievement.earned ? 'var(--text)' : 'var(--text-secondary)',
          lineHeight: 1.3,
        }}
      >
        {achievement.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          lineHeight: 1.4,
        }}
      >
        {achievement.description}
      </div>

      {/* Rarity badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 6px',
            background: rarity.bg,
            color: rarity.color,
          }}
        >
          {rarity.label}
        </span>

        {/* Earned date OR progress */}
        {achievement.earned && achievement.earnedDate ? (
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            {formatDate(achievement.earnedDate)}
          </span>
        ) : null}
      </div>

      {/* Progress bar for locked achievements */}
      {!achievement.earned && achievement.progress !== undefined && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div
            style={{
              height: '3px',
              background: 'var(--border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, progress)}%`,
                background: 'var(--text-muted)',
              }}
            />
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {Math.min(100, Math.round(progress))}% complete
          </span>
        </div>
      )}
    </div>
  )
}

export function AchievementsGrid({
  limit,
  showAll = false,
  filterCategory,
}: AchievementsGridProps) {
  let items = [...achievements]

  // Filter by category if provided
  if (filterCategory) {
    items = items.filter((a) => a.category === filterCategory)
  }

  // If not showing all, pick 6 most recently earned + 3 closest-to-unlocking locked
  if (!showAll) {
    const earned = items
      .filter((a) => a.earned)
      .sort((a, b) => {
        if (!a.earnedDate) return 1
        if (!b.earnedDate) return -1
        return new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime()
      })
      .slice(0, 6)

    const locked = items
      .filter((a) => !a.earned)
      .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
      .slice(0, 3)

    items = [...earned, ...locked]
  }

  // Apply optional limit
  if (limit) {
    items = items.slice(0, limit)
  }

  const earnedCount = achievements.filter((a) => a.earned).length
  const totalCount = achievements.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
            Achievements
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '1px 6px',
              fontWeight: 600,
            }}
          >
            {earnedCount}/{totalCount}
          </span>
        </div>
        {!showAll && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Recent + closest to unlock
          </span>
        )}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
        }}
        className="achievements-grid"
      >
        {items.map((achievement) => (
          <AchievementTile key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* Responsive overrides via style tag */}
      <style>{`
        @media (min-width: 1024px) {
          .achievements-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}
