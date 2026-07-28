'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { Drawer, Field, TextInput, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { adminClients } from '@/lib/mock-data'
import { scoreColor, formatDate } from '@/lib/utils'
import {
  Plus, Search, Eye, Edit, Ban, Building2, Users,
  TrendingUp, AlertCircle, ChevronRight, CheckCircle2,
} from 'lucide-react'

type Client = {
  id: string
  company: string
  industry: string
  plan: 'starter' | 'professional' | 'enterprise'
  users: number
  complianceScore: number
  lastActive: string
  status: 'active' | 'trial' | 'suspended'
}
type FilterKey = 'all' | 'active' | 'trial' | 'suspended'

const PLAN_CONFIG = {
  enterprise:    { label: 'Enterprise',    bg: '#7c3aed18', color: '#7c3aed', price: '$349/mo' },
  professional:  { label: 'Professional',  bg: '#2563eb18', color: '#2563eb', price: '$149/mo' },
  starter:       { label: 'Starter',       bg: '#64748b18', color: '#64748b', price: '$49/mo'  },
}

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: '#22c55e', bg: '#22c55e18' },
  trial:     { label: 'Trial',     color: '#f59e0b', bg: '#f59e0b18' },
  suspended: { label: 'Suspended', color: '#ef4444', bg: '#ef444418' },
}

const INDUSTRIES = ['Construction', 'Electrical', 'Plumbing', 'Mining', 'Healthcare', 'Facilities Management', 'Manufacturing', 'Transport']
const PLANS = ['starter', 'professional', 'enterprise']
const BLANK = { company: '', industry: '', plan: 'starter', contactName: '', contactEmail: '' }

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([...adminClients])
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<FilterKey>('all')
  const [showDrawer, setShowDrawer] = useState(false)
  const [form, setForm]       = useState({ ...BLANK })
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const counts = {
    all:       clients.length,
    active:    clients.filter(c => c.status === 'active').length,
    trial:     clients.filter(c => c.status === 'trial').length,
    suspended: clients.filter(c => c.status === 'suspended').length,
  }

  const totalUsers = clients.reduce((s, c) => s + c.users, 0)
  const avgScore   = Math.round(clients.reduce((s, c) => s + c.complianceScore, 0) / clients.length)
  const mrr        = clients.filter(c => c.status === 'active').reduce((s, c) => s + { starter: 49, professional: 149, enterprise: 349 }[c.plan], 0)

  const filtered = clients.filter(c => {
    const matchSearch = c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newClient: Client = {
        id: Date.now().toString(),
        company: form.company,
        industry: form.industry,
        plan: form.plan as Client['plan'],
        users: 1,
        complianceScore: 0,
        lastActive: new Date().toISOString().split('T')[0],
        status: 'trial' as Client['status'],
      }
      setClients(prev => [newClient, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowDrawer(false); setForm({ ...BLANK }) }, 1200)
    }, 700)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Clients"
        description={`${clients.length} organisations on platform`}
        action={{ label: 'Add Client', icon: <Plus size={14} />, onClick: () => { setForm({ ...BLANK }); setShowDrawer(true) } }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <Input placeholder="Search clients…" className="pl-8 w-52" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients',     value: clients.length,    color: 'var(--text)',  icon: Building2,    sub: `${counts.trial} in trial` },
          { label: 'Total Users',       value: totalUsers,         color: '#3b82f6',      icon: Users,        sub: 'Across all accounts' },
          { label: 'MRR (Active)',      value: `$${mrr.toLocaleString()}`, color: '#22c55e', icon: TrendingUp, sub: 'AUD / month' },
          { label: 'Avg Compliance',    value: `${avgScore}/100`,  color: scoreColor(avgScore), icon: CheckCircle2, sub: '↑ 3pts vs last month' },
        ].map(({ label, value, color, icon: Icon, sub }) => (
          <div key={label} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>{sub}</p>
              </div>
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                <Icon size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {([
          { key: 'all'       as FilterKey, label: 'All'       },
          { key: 'active'    as FilterKey, label: 'Active'    },
          { key: 'trial'     as FilterKey, label: 'Trial'     },
          { key: 'suspended' as FilterKey, label: 'Suspended' },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-colors"
            style={{
              color: filter === key ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: filter === key ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none',
              marginBottom: '-1px',
            }}
          >
            {label}
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center"
              style={filter === key
                ? { background: 'var(--accent)', color: 'var(--accent-text)' }
                : { background: 'var(--bg-secondary)', color: 'var(--text-muted)' }
              }
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['Company', 'Plan', 'Users', 'Compliance', 'Last Active', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No clients found</td></tr>
              )}
              {filtered.map(client => {
                const plan   = PLAN_CONFIG[client.plan]
                const status = STATUS_CONFIG[client.status as keyof typeof STATUS_CONFIG]
                return (
                  <tr
                    key={client.id}
                    className="group transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-black"
                          style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
                        >
                          {client.company.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{client.company}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{client.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: plan.bg, color: plan.color }}>
                        {plan.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{client.users}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                          <div className="h-full" style={{ width: `${client.complianceScore}%`, background: scoreColor(client.complianceScore) }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: scoreColor(client.complianceScore) }}>{client.complianceScore}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(client.lastActive)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 transition-colors hover:bg-[var(--bg-secondary)]" title="View" style={{ color: 'var(--text-muted)' }}><Eye size={13} /></button>
                        <button className="p-1.5 transition-colors hover:bg-[var(--bg-secondary)]" title="Edit" style={{ color: 'var(--text-muted)' }}><Edit size={13} /></button>
                        <button className="p-1.5 transition-colors" title="Suspend" style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        ><Ban size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Drawer */}
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title="Add Client" subtitle="Onboard a new organisation to the platform">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Company Name" required>
            <TextInput value={form.company} onChange={v => setForm(f => ({ ...f, company: v }))} placeholder="e.g. Apex Constructions Pty Ltd" />
          </Field>
          <Field label="Industry" required>
            <Select value={form.industry} onChange={v => setForm(f => ({ ...f, industry: v }))} options={INDUSTRIES} placeholder="Select industry…" />
          </Field>
          <Field label="Subscription Plan">
            <RadioGroup
              value={form.plan}
              onChange={v => setForm(f => ({ ...f, plan: v }))}
              options={[
                { value: 'starter',      label: 'Starter — $49/mo'        },
                { value: 'professional', label: 'Professional — $149/mo'  },
                { value: 'enterprise',   label: 'Enterprise — $349/mo'    },
              ]}
            />
          </Field>
          <Field label="Primary Contact Name">
            <TextInput value={form.contactName} onChange={v => setForm(f => ({ ...f, contactName: v }))} placeholder="e.g. John Smith" />
          </Field>
          <Field label="Contact Email">
            <TextInput type="email" value={form.contactEmail} onChange={v => setForm(f => ({ ...f, contactEmail: v }))} placeholder="john@company.com.au" />
          </Field>
          <SubmitRow saving={saving} saved={saved} submitLabel="Create Client" savedLabel="Client Added! ✓" onCancel={() => setShowDrawer(false)} />
        </form>
      </Drawer>
    </div>
  )
}
