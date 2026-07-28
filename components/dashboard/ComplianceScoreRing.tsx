'use client'

import { scoreColor } from '@/lib/utils'

interface ComplianceScoreRingProps {
  score: number
  size?: number
  label?: string
}

export function ComplianceScoreRing({ score, size = 140, label = 'Compliance Score' }: ComplianceScoreRingProps) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const color = score >= 80 ? 'var(--accent)' : score >= 60 ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={10}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color: 'var(--text)' }}>{score}</span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>/100</span>
        </div>
      </div>
      <p className="text-xs font-semibold mt-3 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}
