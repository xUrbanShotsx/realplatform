'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { adminClients } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  DollarSign, TrendingUp, CreditCard, AlertCircle,
  Download, ChevronUp, ChevronDown,
} from 'lucide-react'

type PaymentStatus = 'current' | 'overdue' | 'trial'

const PLAN_PRICE: Record<string, number> = { starter: 49, professional: 149, enterprise: 349 }
const PLAN_CFG: Record<string, { label: string; bg: string; color: string }> = {
  enterprise:   { label: 'Enterprise',   bg: '#7c3aed18', color: '#7c3aed' },
  professional: { label: 'Professional', bg: '#2563eb18', color: '#2563eb' },
  starter:      { label: 'Starter',      bg: '#64748b18', color: '#64748b' },
}
const PAYMENT_CFG: Record<PaymentStatus, { label: string; bg: string; color: string }> = {
  current: { label: 'Current', bg: '#22c55e18', color: '#22c55e' },
  overdue: { label: 'Overdue', bg: '#ef444418', color: '#ef4444' },
  trial:   { label: 'Trial',   bg: '#f59e0b18', color: '#f59e0b' },
}

const billingRows = adminClients.map((c, i) => ({
  ...c,
  nextBilling:   c.status === 'trial' ? 'N/A' : (i % 5 === 0 ? '2025-05-10' : i % 3 === 0 ? '2025-05-18' : '2026-06-01'),
  amount:        PLAN_PRICE[c.plan],
  paymentStatus: (c.status === 'suspended' ? 'overdue' : c.status === 'trial' ? 'trial' : 'current') as PaymentStatus,
}))

const mrr     = adminClients.filter(c => c.status === 'active').reduce((s, c) => s + PLAN_PRICE[c.plan], 0)
const arr     = mrr * 12
const overdue = billingRows.filter(r => r.paymentStatus === 'overdue').length
const trials  = billingRows.filter(r => r.paymentStatus === 'trial').length

// Last 6 months mock MRR trend
const MRR_TREND = [
  { month: 'Dec', value: 4180 },
  { month: 'Jan', value: 4480 },
  { month: 'Feb', value: 4680 },
  { month: 'Mar', value: 4930 },
  { month: 'Apr', value: 5130 },
  { month: 'May', value: mrr  },
]
const mrrMax = Math.max(...MRR_TREND.map(d => d.value))

export default function AdminBillingPage() {
  const [filterPlan,    setFilterPlan]    = useState('all')
  const [filterPayment, setFilterPayment] = useState<'all' | PaymentStatus>('all')

  const filteredRows = billingRows.filter(r => {
    const matchPlan    = filterPlan === 'all' || r.plan === filterPlan
    const matchPayment = filterPayment === 'all' || r.paymentStatus === filterPayment
    return matchPlan && matchPayment
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Billing"
        description="Subscription plans, revenue metrics and client billing status"
      />

      {/* Top metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Recurring Revenue', value: `$${mrr.toLocaleString()}`,       color: '#22c55e',     icon: DollarSign, sub: 'AUD / month'       },
          { label: 'Annual Run Rate',            value: `$${(arr).toLocaleString()}`,     color: '#3b82f6',     icon: TrendingUp, sub: 'Projected ARR'     },
          { label: 'Overdue Payments',           value: overdue,                           color: overdue > 0 ? '#ef4444' : '#22c55e', icon: AlertCircle, sub: 'Action needed' },
          { label: 'Trials Expiring Soon',       value: trials,                            color: '#f59e0b',     icon: CreditCard, sub: 'Convert or expire' },
        ].map(({ label, value, color, icon: Icon, sub }) => (
          <div key={label} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-[11px] mt-0.5 font-medium" style={{ color }}>{sub}</p>
              </div>
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                <Icon size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan breakdown + MRR trend */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Plan cards */}
        <div className="lg:col-span-2 space-y-3">
          {[
            { plan: 'enterprise',   borderColor: '#7c3aed' },
            { plan: 'professional', borderColor: '#2563eb' },
            { plan: 'starter',      borderColor: '#64748b' },
          ].map(({ plan, borderColor }) => {
            const cfg       = PLAN_CFG[plan]
            const count     = adminClients.filter(c => c.plan === plan).length
            const planMrr   = adminClients.filter(c => c.plan === plan && c.status === 'active').length * PLAN_PRICE[plan]
            return (
              <div
                key={plan}
                className="p-4 flex items-center justify-between"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: `4px solid ${borderColor}` }}
              >
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{cfg.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{PLAN_PRICE[plan]}/mo per client</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black" style={{ color: cfg.color }}>{count}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>${planMrr.toLocaleString()} MRR</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* MRR trend mini-chart */}
        <div className="lg:col-span-3 p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>MRR Trend</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last 6 months</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#22c55e' }}>
              <ChevronUp size={14} />
              {Math.round(((mrr - MRR_TREND[0].value) / MRR_TREND[0].value) * 100)}% growth
            </div>
          </div>
          <div className="flex items-end gap-2 h-28">
            {MRR_TREND.map((d, i) => {
              const height = Math.round((d.value / mrrMax) * 100)
              const isLast = i === MRR_TREND.length - 1
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-[9px] font-semibold" style={{ color: isLast ? '#22c55e' : 'var(--text-muted)' }}>
                    ${(d.value / 1000).toFixed(1)}k
                  </p>
                  <div className="w-full" style={{ height: `${height}%`, background: isLast ? '#22c55e' : 'var(--accent)', opacity: isLast ? 1 : 0.5 }} />
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{d.month}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filters + table */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'starter', 'professional', 'enterprise'].map(plan => (
          <button
            key={plan}
            onClick={() => setFilterPlan(plan)}
            className="px-3 py-1.5 text-xs font-semibold transition-colors capitalize"
            style={filterPlan === plan
              ? { background: 'var(--text)', color: 'var(--bg)' }
              : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {plan === 'all' ? 'All Plans' : PLAN_CFG[plan].label}
          </button>
        ))}
        <div style={{ borderLeft: '1px solid var(--border)', margin: '0 4px' }} />
        {(['all', 'current', 'overdue', 'trial'] as const).map(ps => (
          <button
            key={ps}
            onClick={() => setFilterPayment(ps)}
            className="px-3 py-1.5 text-xs font-semibold transition-colors capitalize"
            style={filterPayment === ps
              ? { background: 'var(--text)', color: 'var(--bg)' }
              : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {ps === 'all' ? 'All Payments' : PAYMENT_CFG[ps].label}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['Company', 'Plan', 'Amount', 'Next Billing', 'Payment', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No billing records match the filter</td></tr>
              )}
              {filteredRows.map(row => {
                const planCfg    = PLAN_CFG[row.plan]
                const paymentCfg = PAYMENT_CFG[row.paymentStatus]
                return (
                  <tr key={row.id} className="group transition-colors hover:bg-[var(--bg-hover)]" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{row.company}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.industry}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: planCfg.bg, color: planCfg.color }}>{planCfg.label}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold" style={{ color: 'var(--text)' }}>${row.amount}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/mo</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {row.nextBilling === 'N/A' ? '—' : formatDate(row.nextBilling)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: paymentCfg.bg, color: paymentCfg.color }}>{paymentCfg.label}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-70"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <Download size={11} /> Invoice
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
