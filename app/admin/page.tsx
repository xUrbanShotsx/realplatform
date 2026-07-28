'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { adminClients } from '@/lib/mock-data'
import { scoreColor, formatDate } from '@/lib/utils'
import {
  Building2, Users, TrendingUp, Activity,
  ArrowRight, CheckCircle2, AlertCircle, Clock,
} from 'lucide-react'

const activeClients = adminClients.filter(c => c.status === 'active').length
const trialClients  = adminClients.filter(c => c.status === 'trial').length
const totalUsers    = adminClients.reduce((s, c) => s + c.users, 0)
const avgScore      = Math.round(adminClients.reduce((s, c) => s + c.complianceScore, 0) / adminClients.length)
const mrr           = adminClients.filter(c => c.status === 'active')
                        .reduce((s, c) => s + { starter: 49, professional: 149, enterprise: 349 }[c.plan], 0)

const PLAN_CFG: Record<string, { label: string; bg: string; color: string }> = {
  enterprise:   { label: 'Enterprise',   bg: '#7c3aed18', color: '#7c3aed' },
  professional: { label: 'Professional', bg: '#2563eb18', color: '#2563eb' },
  starter:      { label: 'Starter',      bg: '#64748b18', color: '#64748b' },
}

const recentActivity = [
  { action: 'New client onboarded',    detail: 'NovaCare Health Services – Enterprise plan', time: '1h ago',  type: 'new'      },
  { action: 'Subscription upgraded',   detail: 'Pinnacle Engineering → Professional plan',   time: '3h ago',  type: 'upgrade'  },
  { action: 'Support request opened',  detail: 'Acme Construction – Login issue reported',   time: '5h ago',  type: 'support'  },
  { action: 'Client suspended',        detail: 'Greenfield Agriculture – Payment overdue',   time: '1d ago',  type: 'suspend'  },
  { action: 'Template published',      detail: 'WHS Induction Checklist v2.1 – All industries', time: '2d ago', type: 'template' },
]

const activityDot: Record<string, string> = {
  new:      '#22c55e',
  upgrade:  '#3b82f6',
  support:  '#f59e0b',
  suspend:  '#ef4444',
  template: '#a855f7',
}

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Admin Overview" description="Platform health, client compliance and revenue at a glance" />

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients',        value: adminClients.length,   color: 'var(--text)',          icon: Building2,   sub: `${trialClients} in trial`          },
          { label: 'Total Users',           value: totalUsers,             color: '#3b82f6',              icon: Users,       sub: 'Across all organisations'          },
          { label: 'MRR (Active)',          value: `$${mrr.toLocaleString()}`, color: '#22c55e',          icon: TrendingUp,  sub: 'AUD / month'                       },
          { label: 'Avg Compliance Score',  value: `${avgScore}/100`,     color: scoreColor(avgScore),   icon: Activity,    sub: '↑ 3pts from last month'            },
        ].map(({ label, value, color, icon: Icon, sub }) => (
          <div key={label} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
              </div>
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                <Icon size={18} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {(['enterprise', 'professional', 'starter'] as const).map(plan => {
          const cfg   = PLAN_CFG[plan]
          const count = adminClients.filter(c => c.plan === plan).length
          const pMrr  = adminClients.filter(c => c.plan === plan && c.status === 'active').length * { starter: 49, professional: 149, enterprise: 349 }[plan]
          return (
            <div
              key={plan}
              className="p-5"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${cfg.color}` }}
            >
              <p className="text-3xl font-black" style={{ color: cfg.color }}>{count}</p>
              <p className="font-semibold text-sm mt-1" style={{ color: 'var(--text)' }}>{cfg.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>${pMrr.toLocaleString()} MRR</p>
            </div>
          )
        })}
      </div>

      {/* Client table + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Client table */}
        <div className="lg:col-span-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Client Compliance Overview</p>
            <a href="/admin/clients" className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
              View all <ArrowRight size={11} />
            </a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['Company', 'Plan', 'Score', 'Status'].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminClients.slice(0, 8).map(client => {
                const planCfg = PLAN_CFG[client.plan]
                const statusColor = client.status === 'active' ? '#22c55e' : client.status === 'trial' ? '#f59e0b' : '#ef4444'
                return (
                  <tr
                    key={client.id}
                    className="transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-3 px-4">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{client.company}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{client.industry}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: planCfg.bg, color: planCfg.color }}>{planCfg.label}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                          <div className="h-full" style={{ width: `${client.complianceScore}%`, background: scoreColor(client.complianceScore) }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: scoreColor(client.complianceScore) }}>{client.complianceScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 capitalize" style={{ background: statusColor + '18', color: statusColor }}>{client.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Activity feed */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Platform Activity</p>
          </div>
          <div className="p-5 space-y-4">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-2 h-2 flex-shrink-0 mt-1.5" style={{ background: activityDot[item.type] }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.action}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.detail}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick status row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active clients needing attention', value: adminClients.filter(c => c.complianceScore < 60).length, color: '#ef4444', icon: AlertCircle, sub: 'Score below 60' },
          { label: 'Clients last active 30+ days ago', value: adminClients.filter(c => { const d = new Date(c.lastActive); return (Date.now() - d.getTime()) > 30 * 86400000 }).length, color: '#f59e0b', icon: Clock, sub: 'May need check-in' },
          { label: 'Fully compliant clients',          value: adminClients.filter(c => c.complianceScore >= 90).length, color: '#22c55e', icon: CheckCircle2, sub: 'Score 90+' },
        ].map(({ label, value, color, icon: Icon, sub }) => (
          <div key={label} className="flex items-center gap-4 p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color }}>{value}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
