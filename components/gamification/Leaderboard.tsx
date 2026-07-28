'use client'

import { leaderboard, type LeaderboardEntry } from '@/lib/gamification'

interface LeaderboardProps {
  compact?: boolean
}

const RANK_COLORS: Record<number, { bg: string; color: string }> = {
  1: { bg: '#FFD940', color: '#000' },
  2: { bg: '#C0C0C0', color: '#000' },
  3: { bg: '#CD7F32', color: '#fff' },
}

function trendSymbol(trend: LeaderboardEntry['trend']) {
  if (trend === 'up') return { symbol: '↑', color: '#22c55e' }
  if (trend === 'down') return { symbol: '↓', color: '#ef4444' }
  return { symbol: '→', color: 'var(--text-muted)' }
}

function formatXP(xp: number) {
  return xp.toLocaleString()
}

function LeaderboardRow({
  entry,
  compact,
}: {
  entry: LeaderboardEntry
  compact: boolean
}) {
  const rankStyle = RANK_COLORS[entry.rank]
  const trend = trendSymbol(entry.trend)
  const isTop3 = entry.rank <= 3

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 28px 1fr auto auto auto auto',
        alignItems: 'center',
        gap: '10px',
        padding: compact ? '6px 10px' : '8px 12px',
        minHeight: compact ? '38px' : '44px',
        borderLeft: entry.isCurrentUser
          ? '2px solid var(--accent)'
          : '2px solid transparent',
        background: entry.isCurrentUser
          ? 'rgba(255,217,64,0.08)'
          : 'transparent',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 700,
          background: rankStyle ? rankStyle.bg : 'var(--bg-secondary)',
          color: rankStyle ? rankStyle.color : 'var(--text-muted)',
          flexShrink: 0,
        }}
      >
        {entry.rank}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 700,
          background: entry.isCurrentUser ? 'var(--accent)' : 'var(--bg-secondary)',
          color: entry.isCurrentUser ? 'var(--accent-text)' : 'var(--text-secondary)',
          border: '1px solid var(--border)',
          flexShrink: 0,
          letterSpacing: '0.02em',
        }}
      >
        {entry.avatar}
      </div>

      {/* Name + role */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: entry.isCurrentUser ? 700 : 600,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {entry.name}
          {entry.isCurrentUser && (
            <span
              style={{
                marginLeft: '5px',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-muted)',
              }}
            >
              (you)
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {entry.role}
        </div>
      </div>

      {/* Level badge */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          padding: '2px 5px',
          background: isTop3 ? 'var(--accent)' : 'var(--bg-secondary)',
          color: isTop3 ? 'var(--accent-text)' : 'var(--text-muted)',
          border: isTop3 ? 'none' : '1px solid var(--border)',
          whiteSpace: 'nowrap',
        }}
      >
        LV{entry.level}
      </div>

      {/* XP */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--text)',
          whiteSpace: 'nowrap',
          textAlign: 'right',
          minWidth: '52px',
        }}
      >
        {formatXP(entry.xp)}
      </div>

      {/* Streak */}
      <div
        style={{
          fontSize: '11px',
          color: entry.streak > 0 ? 'var(--text-secondary)' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.streak > 0 ? `🔥 ${entry.streak}` : '—'}
      </div>

      {/* Trend */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: trend.color,
          width: '14px',
          textAlign: 'center',
        }}
      >
        {trend.symbol}
      </div>
    </div>
  )
}

export function Leaderboard({ compact = false }: LeaderboardProps) {
  const entries = compact ? leaderboard.slice(0, 5) : leaderboard

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--border)',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 28px 1fr auto auto auto auto',
          alignItems: 'center',
          gap: '10px',
          padding: compact ? '5px 10px' : '6px 12px',
          paddingLeft: compact ? '12px' : '14px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>#</span>
        <span />
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Member</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>LV</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right', minWidth: '52px' }}>XP</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Streak</span>
        <span style={{ width: '14px' }} />
      </div>

      {/* Rows */}
      <div>
        {entries.map((entry) => (
          <LeaderboardRow key={entry.rank} entry={entry} compact={compact} />
        ))}
      </div>

      {/* Footer when compact */}
      {compact && leaderboard.length > 5 && (
        <div
          style={{
            padding: '6px 12px',
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
          }}
        >
          +{leaderboard.length - 5} more members
        </div>
      )}
    </div>
  )
}
