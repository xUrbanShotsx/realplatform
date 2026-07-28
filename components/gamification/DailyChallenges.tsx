'use client'

import { dailyChallenges, type DailyChallenge } from '@/lib/gamification'

function ChallengeTile({ challenge }: { challenge: DailyChallenge }) {
  const pct = Math.min(100, (challenge.progress / challenge.total) * 100)

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        opacity: challenge.completed ? 0.75 : 1,
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Header row: icon + reward badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'var(--bg-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0,
            }}
          >
            {challenge.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text)',
                lineHeight: 1.3,
              }}
            >
              {challenge.title}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: 1.3,
              }}
            >
              {challenge.description}
            </div>
          </div>
        </div>

        {challenge.completed ? (
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              background: 'var(--bg-hover)',
              padding: '2px 6px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <span>✓</span>
            <span>Done</span>
          </div>
        ) : (
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent-text)',
              background: 'var(--accent)',
              padding: '2px 6px',
              flexShrink: 0,
            }}
          >
            +{challenge.reward} XP
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          style={{
            height: '4px',
            background: 'var(--border)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: challenge.completed ? 'var(--text-muted)' : 'var(--accent)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          {challenge.progress}/{challenge.total}
        </div>
      </div>
    </div>
  )
}

export function DailyChallenges() {
  const remainingXP = dailyChallenges
    .filter((c) => !c.completed)
    .reduce((sum, c) => sum + c.reward, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
            Daily Challenges
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '1px 5px',
              fontWeight: 500,
            }}
          >
            Resets at midnight
          </span>
        </div>
        {remainingXP > 0 && (
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent-text)',
              background: 'var(--accent)',
              padding: '2px 8px',
            }}
          >
            +{remainingXP} XP available
          </div>
        )}
      </div>

      {/* Challenge tiles */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {dailyChallenges.map((challenge) => (
          <ChallengeTile key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  )
}
