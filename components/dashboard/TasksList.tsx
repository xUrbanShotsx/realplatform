import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/StatusBadge'

interface Task {
  id: string
  title: string
  assignedTo: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'overdue' | 'due-today' | 'upcoming' | 'completed'
  category: string
}

const priorityDot: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-blue-400',
}

export function TasksList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${priorityDot[task.priority]}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black dark:text-white truncate">{task.title}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-neutral-400">{task.assignedTo}</span>
              <span className="text-neutral-200 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-400">{formatDate(task.dueDate)}</span>
              <span className="text-neutral-200 dark:text-neutral-700">·</span>
              <StatusBadge status={task.status} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
