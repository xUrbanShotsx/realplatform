'use client'

import { useState } from 'react'
import { Sparkles, X, ChevronRight, TrendingUp, AlertTriangle, Zap } from 'lucide-react'

type Insight = {
  id: string
  type: 'risk' | 'opportunity' | 'trend'
  title: string
  body: string
  action: string
  href: string
  confidence: number
}

const INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'risk',
    title: 'Licence expiry cluster detected',
    body: '3 workers on Site B have licences expiring within 14 days. Based on historical patterns, this commonly precedes non-compliance flags during audits.',
    action: 'View workers',
    href: '/dashboard/workers',
    confidence: 94,
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Quick win: +6 compliance points',
    body: 'Uploading 2 missing documents and closing 1 corrective action would push your score from 82 → 88, crossing the "Good" audit threshold.',
    action: 'View actions',
    href: '/dashboard/corrective-actions',
    confidence: 91,
  },
  {
    id: '3',
    type: 'trend',
    title: 'Training completion trending up',
    body: 'Completion rate has risen 8% over 6 weeks. At this pace you\'ll reach 90% by end of month — ahead of your quarterly target.',
    action: 'View training',
    href: '/dashboard/training',
    confidence: 87,
  },
]

const typeConfig = {
  risk:        { icon: AlertTriangle, color: '#ef4444', bg: '#fee2e2', label: 'Risk' },
  opportunity: { icon: Zap,           color: '#000000', bg: '#FFD940', label: 'Opportunity' },
  trend:       { icon: TrendingUp,    color: '#22c55e', bg: '#dcfce7', label: 'Trend' },
}

export function AIInsights() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [expanded, setExpanded]   = useState(false)

  const visible = INSIGHTS.filter(i => !dismissed.includes(i.id))

  if (visible.length === 0) return null

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <Sparkles size={13} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>AI Insights</span>
          </div>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5"
            style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
          >
            {visible.length} new
          </span>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-[10px] flex items-center gap-0.5 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          {expanded ? 'Collapse' : 'Show all'}
          <ChevronRight size={10} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {(expanded ? visible : visible.slice(0, 3)).map(insight => {
          const cfg = typeConfig[insight.type]
          const Icon = cfg.icon
          return (
            <div
              key={insight.id}
              className="relative p-3 group"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `2px solid ${cfg.color}` }}
            >
              {/* Dismiss */}
              <button
                onClick={() => setDismissed(d => [...d, insight.id])}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={11} />
              </button>

              {/* Type badge + confidence */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  <Icon size={9} />
                  {cfg.label}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {insight.confidence}% confidence
                </span>
              </div>

              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>
                {insight.title}
              </p>
              <p className="text-[11px] leading-relaxed mb-2.5" style={{ color: 'var(--text-secondary)' }}>
                {insight.body}
              </p>

              <a
                href={insight.href}
                className="flex items-center gap-1 text-[11px] font-semibold transition-opacity hover:opacity-80"
                style={{ color: cfg.color === '#FFD940' ? '#000' : cfg.color }}
              >
                {insight.action} <ChevronRight size={10} />
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
