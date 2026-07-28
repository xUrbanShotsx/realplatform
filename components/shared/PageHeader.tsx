import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    icon?: ReactNode
  }
  children?: ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{title}</h1>
        {description && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {action && (
          <Button onClick={action.onClick} className="gap-2">
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
