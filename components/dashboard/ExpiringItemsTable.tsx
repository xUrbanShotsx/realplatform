import { formatDate, daysUntil } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { FileText, Award, Shield, FileCheck } from 'lucide-react'

const typeIcons = {
  certificate: Award,
  licence: FileCheck,
  document: FileText,
  insurance: Shield,
}

const typeLabels = {
  certificate: 'Certificate',
  licence: 'Licence',
  document: 'Document',
  insurance: 'Insurance',
}

interface ExpiringItem {
  id: string
  name: string
  type: 'certificate' | 'licence' | 'document' | 'insurance'
  owner: string
  expiryDate: string
  status: 'expiring-soon' | 'expired' | 'active'
}

export function ExpiringItemsTable({ items }: { items: ExpiringItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100 dark:border-neutral-800">
            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Item</th>
            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Owner</th>
            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Expiry</th>
            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
          {items.map((item) => {
            const Icon = typeIcons[item.type]
            const days = daysUntil(item.expiryDate)
            return (
              <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-black dark:text-white text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-400">{typeLabels[item.type]}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">{item.owner}</td>
                <td className="py-3 px-4">
                  <span className="font-medium text-black dark:text-white">{formatDate(item.expiryDate)}</span>
                  {days <= 30 && (
                    <p className={`text-xs mt-0.5 ${days < 0 ? 'text-red-500' : 'text-amber-500'}`}>
                      {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d remaining`}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
