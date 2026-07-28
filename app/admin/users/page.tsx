'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { Drawer, Field, TextInput, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { adminClients } from '@/lib/mock-data'
import { Plus, Search, Edit, Ban, UserCheck, Users, ShieldCheck, Clock } from 'lucide-react'

type UserRole = 'Compliance Manager' | 'Site Manager' | 'Admin' | 'Worker' | 'HSE Advisor'
type UserStatus = 'active' | 'inactive' | 'suspended'

type PlatformUser = {
  id: string
  name: string
  email: string
  company: string
  role: UserRole
  status: UserStatus
  lastLogin: string
  mfaEnabled: boolean
}

const SEED_USERS: PlatformUser[] = [
  { id: '1',  name: 'Sarah Mitchell',   email: 'sarah@acmeconstruction.com.au',   company: 'Acme Construction',       role: 'Compliance Manager', status: 'active',   lastLogin: '1h ago',   mfaEnabled: true  },
  { id: '2',  name: 'James Chen',       email: 'james@acmeconstruction.com.au',   company: 'Acme Construction',       role: 'Site Manager',       status: 'active',   lastLogin: '3h ago',   mfaEnabled: false },
  { id: '3',  name: 'Anna Kowalski',    email: 'anna@safeelect.com.au',           company: 'SafeElect Services',      role: 'Admin',              status: 'active',   lastLogin: '2d ago',   mfaEnabled: true  },
  { id: '4',  name: 'Paul Zhang',       email: 'paul@techmech.com.au',            company: 'TechMech Engineering',    role: 'Compliance Manager', status: 'active',   lastLogin: '1d ago',   mfaEnabled: true  },
  { id: '5',  name: 'Maria Garcia',     email: 'maria@cleansite.com.au',          company: 'CleanSite Services',      role: 'Worker',             status: 'active',   lastLogin: '5h ago',   mfaEnabled: false },
  { id: '6',  name: 'Steve Hill',       email: 'steve@groundworks.com.au',        company: 'GroundWorks Excavation',  role: 'Site Manager',       status: 'active',   lastLogin: '4d ago',   mfaEnabled: false },
  { id: '7',  name: 'Lisa Wong',        email: 'lisa@acmeconstruction.com.au',    company: 'Acme Construction',       role: 'Worker',             status: 'active',   lastLogin: '6h ago',   mfaEnabled: false },
  { id: '8',  name: 'Dave Harris',      email: 'dave@buildright.com.au',          company: 'BuildRight Pty Ltd',      role: 'Admin',              status: 'active',   lastLogin: '12h ago',  mfaEnabled: true  },
  { id: '9',  name: 'Emma Thompson',    email: 'emma@pinnacleeng.com.au',         company: 'Pinnacle Engineering',    role: 'HSE Advisor',        status: 'active',   lastLogin: '2h ago',   mfaEnabled: true  },
  { id: '10', name: 'Marcus Webb',      email: 'marcus@vertexbuild.com.au',       company: 'Vertex Build Group',      role: 'Site Manager',       status: 'inactive', lastLogin: '14d ago',  mfaEnabled: false },
  { id: '11', name: 'Rachel Kim',       email: 'rachel@coastalplumb.com.au',      company: 'Coastal Plumbing Co.',    role: 'Compliance Manager', status: 'active',   lastLogin: '3h ago',   mfaEnabled: true  },
  { id: '12', name: 'Tom Nguyen',       email: 'tom@greenagri.com.au',            company: 'Greenfield Agriculture',  role: 'Worker',             status: 'suspended',lastLogin: '30d ago',  mfaEnabled: false },
]

const ROLE_CONFIG: Record<UserRole, { bg: string; color: string }> = {
  'Compliance Manager': { bg: '#2563eb18', color: '#2563eb' },
  'Site Manager':       { bg: '#7c3aed18', color: '#7c3aed' },
  'Admin':              { bg: '#FFD94018', color: '#92700a' },
  'Worker':             { bg: '#64748b18', color: '#64748b' },
  'HSE Advisor':        { bg: '#0891b218', color: '#0891b2' },
}

const STATUS_CONFIG: Record<UserStatus, { label: string; bg: string; color: string }> = {
  active:    { label: 'Active',    bg: '#22c55e18', color: '#22c55e' },
  inactive:  { label: 'Inactive',  bg: '#64748b18', color: '#64748b' },
  suspended: { label: 'Suspended', bg: '#ef444418', color: '#ef4444' },
}

const ALL_ROLES: UserRole[] = ['Compliance Manager', 'Site Manager', 'Admin', 'Worker', 'HSE Advisor']
const COMPANIES = adminClients.map(c => c.company)
const BLANK = { name: '', email: '', company: '', role: 'Worker' as UserRole }

export default function AdminUsersPage() {
  const [users, setUsers]     = useState<PlatformUser[]>([...SEED_USERS])
  const [search, setSearch]   = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All')
  const [showDrawer, setShowDrawer] = useState(false)
  const [form, setForm]       = useState({ ...BLANK })
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const roleCounts = useMemo(() => {
    const map: Record<string, number> = { All: users.length }
    ALL_ROLES.forEach(r => { map[r] = users.filter(u => u.role === r).length })
    return map
  }, [users])

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const activeCount = users.filter(u => u.status === 'active').length
  const mfaCount    = users.filter(u => u.mfaEnabled).length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newUser: PlatformUser = {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        company: form.company,
        role: form.role,
        status: 'active',
        lastLogin: 'Never',
        mfaEnabled: false,
      }
      setUsers(prev => [newUser, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowDrawer(false); setForm({ ...BLANK }) }, 1200)
    }, 700)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Users"
        description={`${users.length} registered users across all clients`}
        action={{ label: 'Add User', icon: <Plus size={14} />, onClick: () => { setForm({ ...BLANK }); setShowDrawer(true) } }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <Input placeholder="Search users…" className="pl-8 w-52" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',    value: users.length,  color: 'var(--text)', icon: Users,      sub: 'All accounts' },
          { label: 'Active',         value: activeCount,   color: '#22c55e',     icon: UserCheck,  sub: `${users.filter(u => u.status === 'inactive').length} inactive` },
          { label: 'MFA Enabled',    value: mfaCount,      color: '#3b82f6',     icon: ShieldCheck,sub: `${Math.round(mfaCount/users.length*100)}% adoption` },
          { label: 'Never Logged In',value: users.filter(u => u.lastLogin === 'Never').length, color: '#f59e0b', icon: Clock, sub: 'Invite pending' },
        ].map(({ label, value, color, icon: Icon, sub }) => (
          <div key={label} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
              </div>
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                <Icon size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role filter */}
      <div className="flex gap-2 flex-wrap">
        {(['All', ...ALL_ROLES] as (UserRole | 'All')[]).map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors"
            style={roleFilter === role
              ? { background: 'var(--text)', color: 'var(--bg)' }
              : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {role}
            <span
              className="text-[10px] px-1 font-bold"
              style={roleFilter === role
                ? { background: 'rgba(255,255,255,0.2)', color: 'inherit' }
                : { color: 'var(--text-muted)' }
              }
            >
              {roleCounts[role]}
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
                {['User', 'Company', 'Role', 'MFA', 'Status', 'Last Login', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No users found</td></tr>
              )}
              {filtered.map(user => {
                const roleStyle   = ROLE_CONFIG[user.role]
                const statusStyle = STATUS_CONFIG[user.status]
                const initials    = user.name.split(' ').map(n => n[0]).join('')
                return (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{user.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{user.company}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: roleStyle.bg, color: roleStyle.color }}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {user.mfaEnabled
                        ? <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>✓ On</span>
                        : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Off</span>
                      }
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs" style={{ color: 'var(--text-muted)' }}>{user.lastLogin}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 transition-colors hover:bg-[var(--bg-secondary)]" style={{ color: 'var(--text-muted)' }}><Edit size={13} /></button>
                        <button
                          className="p-1.5 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
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

      {/* Add User Drawer */}
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title="Add User" subtitle="Invite a new user to a client account">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" required>
            <TextInput value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Alex Johnson" />
          </Field>
          <Field label="Email Address" required>
            <TextInput type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="alex@company.com.au" />
          </Field>
          <Field label="Company / Account" required>
            <Select value={form.company} onChange={v => setForm(f => ({ ...f, company: v }))} options={COMPANIES} placeholder="Select account…" />
          </Field>
          <Field label="Role">
            <RadioGroup
              value={form.role}
              onChange={v => setForm(f => ({ ...f, role: v as UserRole }))}
              options={ALL_ROLES.map(r => ({ value: r, label: r }))}
            />
          </Field>
          <SubmitRow saving={saving} saved={saved} submitLabel="Send Invite" savedLabel="Invite Sent! ✓" onCancel={() => setShowDrawer(false)} />
        </form>
      </Drawer>
    </div>
  )
}
