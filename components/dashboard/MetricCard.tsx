import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  accent?: 'yellow' | 'green' | 'red' | 'blue' | 'orange'
  className?: string
}

const accentMap = {
  yellow: 'border-l-[var(--accent-border)] bg-[var(--accent-bg)]',
  green: 'border-l-green-400 bg-green-50/30',
  red: 'border-l-red-400 bg-red-50/30',
  blue: 'border-l-blue-400 bg-blue-50/30',
  orange: 'border-l-orange-400 bg-orange-50/30',
}

const iconBgMap = {
  yellow: 'bg-[var(--accent-bg)] text-[var(--accent-text)]',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
}

export function MetricCard({ label, value, icon, trend, trendLabel, accent = 'yellow', className }: MetricCardProps) {
  return (
    <Card className={cn('border-l-4 p-5', accentMap[accent], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{label}</p>
          <p className="text-3xl font-bold text-black mt-1">{value}</p>
          {trendLabel && (
            <div className="flex items-center gap-1 mt-1.5">
              {trend === 'up' && <TrendingUp size={12} className="text-red-500" />}
              {trend === 'down' && <TrendingDown size={12} className="text-green-500" />}
              {trend === 'neutral' && <Minus size={12} className="text-neutral-400" />}
              <span className="text-xs text-neutral-500">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg', iconBgMap[accent])}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
