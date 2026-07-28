import { Badge } from '@/components/ui/badge'

type StatusType =
  | 'active' | 'current'
  | 'expiring-soon' | 'expiring'
  | 'expired' | 'overdue' | 'non-compliant'
  | 'compliant'
  | 'open'
  | 'in-progress'
  | 'completed' | 'closed'
  | 'under-review'
  | 'scheduled'
  | 'due-today'
  | 'upcoming'
  | 'trial'
  | 'suspended'
  | 'critical' | 'major' | 'minor' | 'near-miss'
  | 'high' | 'medium' | 'low'
  | 'starter' | 'professional' | 'enterprise'

const statusConfig: Record<StatusType, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent' | 'purple' }> = {
  active: { label: 'Active', variant: 'success' },
  current: { label: 'Current', variant: 'success' },
  compliant: { label: 'Compliant', variant: 'success' },
  completed: { label: 'Completed', variant: 'success' },
  closed: { label: 'Closed', variant: 'success' },
  'expiring-soon': { label: 'Expiring Soon', variant: 'warning' },
  expiring: { label: 'Expiring', variant: 'warning' },
  'under-review': { label: 'Under Review', variant: 'warning' },
  'due-today': { label: 'Due Today', variant: 'warning' },
  upcoming: { label: 'Upcoming', variant: 'info' },
  scheduled: { label: 'Scheduled', variant: 'info' },
  'in-progress': { label: 'In Progress', variant: 'info' },
  trial: { label: 'Trial', variant: 'info' },
  expired: { label: 'Expired', variant: 'danger' },
  overdue: { label: 'Overdue', variant: 'danger' },
  'non-compliant': { label: 'Non-Compliant', variant: 'danger' },
  open: { label: 'Open', variant: 'danger' },
  suspended: { label: 'Suspended', variant: 'danger' },
  critical: { label: 'Critical', variant: 'danger' },
  major: { label: 'Major', variant: 'warning' },
  minor: { label: 'Minor', variant: 'info' },
  'near-miss': { label: 'Near Miss', variant: 'neutral' },
  high: { label: 'High', variant: 'danger' },
  medium: { label: 'Medium', variant: 'warning' },
  low: { label: 'Low', variant: 'info' },
  starter: { label: 'Starter', variant: 'neutral' },
  professional: { label: 'Professional', variant: 'info' },
  enterprise: { label: 'Enterprise', variant: 'purple' },
}

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status] ?? { label: status, variant: 'neutral' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
