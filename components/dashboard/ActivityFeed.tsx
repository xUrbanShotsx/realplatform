import { ClipboardList, AlertTriangle, FileText, Wrench, Users, GraduationCap } from 'lucide-react'

const typeConfig = {
  inspection: { icon: ClipboardList, color: '#3b82f6' },
  incident:   { icon: AlertTriangle, color: '#ef4444' },
  document:   { icon: FileText,      color: '#6b7280' },
  action:     { icon: Wrench,        color: '#f97316' },
  contractor: { icon: Users,         color: '#a855f7' },
  training:   { icon: GraduationCap, color: '#22c55e' },
}

interface ActivityItem {
  id: string
  action: string
  detail: string
  user: string
  time: string
  type: 'inspection' | 'incident' | 'document' | 'action' | 'contractor' | 'training'
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const { icon: Icon, color } = typeConfig[item.type]
        return (
          <div key={item.id} className="flex gap-3">
            {/* Icon dot with vertical connector line */}
            <div className="flex flex-col items-center gap-0">
              <div
                className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                style={{ background: color + '18', color }}
              >
                <Icon size={12} />
              </div>
              {i < items.length - 1 && (
                <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)', minHeight: '16px' }} />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--text)' }}>{item.action}</p>
              <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{item.detail}</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                {item.user} · {item.time}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
