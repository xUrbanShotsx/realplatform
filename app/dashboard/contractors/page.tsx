'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Drawer, Field, TextInput, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import { contractors as initialContractors } from '@/lib/mock-data'
import { formatDate, scoreColor } from '@/lib/utils'
import { Plus, Search, Phone, CheckCircle2, AlertCircle, XCircle, Clock, Users, HardHat } from 'lucide-react'

type Contractor = {
  id: string
  company: string
  industry: string
  contact: string
  phone: string
  email?: string
  insuranceExpiry: string
  licenceStatus: string
  complianceScore: number
  status: 'compliant' | 'expiring' | 'non-compliant'
  preQualStatus: 'approved' | 'pending' | 'suspended'
  workers: number
}

const preQualConfig = {
  approved: { label: 'Approved', class: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  pending: { label: 'Pending Review', class: 'bg-amber-100 text-amber-700', icon: Clock },
  suspended: { label: 'Suspended', class: 'bg-red-100 text-red-700', icon: XCircle },
}

const filters = ['All', 'Compliant', 'Expiring', 'Non-Compliant']

const industryOptions = ['Structural', 'Electrical', 'Plumbing', 'Scaffolding', 'Civil', 'Mechanical', 'HVAC', 'Cleaning', 'Other']

const preQualOptions = [
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
]

const preQualColorMap = {
  approved: '#22c55e',
  pending: '#f59e0b',
  suspended: '#ef4444',
}

const defaultForm = {
  company: '',
  industry: '',
  contact: '',
  phone: '',
  email: '',
  insuranceExpiry: '',
  workers: '1',
  preQualStatus: 'pending',
}

export default function ContractorsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Contractor[]>([...initialContractors] as Contractor[])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  // Add Contractor drawer
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [form, setForm] = useState({ ...defaultForm })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Request Docs inline confirmation
  const [requestSent, setRequestSent] = useState<string | null>(null)

  const filtered = items.filter((c) => {
    const matchSearch = c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || c.status === filter.toLowerCase().replace(' ', '-')
    return matchSearch && matchFilter
  })

  const compliant = items.filter(c => c.status === 'compliant').length
  const expiring = items.filter(c => c.status === 'expiring').length
  const nonCompliant = items.filter(c => c.status === 'non-compliant').length
  const approved = items.filter(c => c.preQualStatus === 'approved').length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setItems(prev => [{
        id: Date.now().toString(),
        company: form.company,
        industry: form.industry,
        contact: form.contact,
        phone: form.phone,
        email: form.email,
        insuranceExpiry: form.insuranceExpiry,
        workers: parseInt(form.workers) || 1,
        licenceStatus: 'Valid',
        complianceScore: 75,
        status: 'compliant' as const,
        preQualStatus: form.preQualStatus as 'approved' | 'pending' | 'suspended',
      }, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setShowAddDrawer(false)
        setForm({ ...defaultForm })
      }, 1200)
    }, 700)
  }

  function sendRequest(id: string) {
    setRequestSent(id)
    setTimeout(() => setRequestSent(null), 2000)
  }

  function openAddDrawer() {
    setForm({ ...defaultForm })
    setSaving(false)
    setSaved(false)
    setShowAddDrawer(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Contractors"
        description="Manage contractor pre-qualification, compliance and insurance"
        action={{ label: 'Add Contractor', icon: <Plus size={14} />, onClick: openAddDrawer }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input placeholder="Search contractors…" className="pl-8 w-52" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Contractors', value: items.length, icon: HardHat, color: 'text-neutral-600 dark:text-neutral-300', bg: 'bg-neutral-100 dark:bg-neutral-800' },
          { label: 'Compliant', value: compliant, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Expiring', value: expiring, icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Non-Compliant', value: nonCompliant, icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pre-qual summary bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-black dark:text-white text-sm">Pre-Qualification Status</p>
            <p className="text-xs text-neutral-400 mt-0.5">{approved} of {items.length} contractors fully pre-qualified</p>
          </div>
          <span className="text-sm font-bold text-black dark:text-white">{Math.round((approved / items.length) * 100)}%</span>
        </div>
        <div className="flex gap-1 h-2.5 rounded-full overflow-hidden">
          <div className="bg-green-400 rounded-l-full" style={{ width: `${(approved / items.length) * 100}%` }} />
          <div className="bg-amber-400" style={{ width: `${(items.filter(c => c.preQualStatus === 'pending').length / items.length) * 100}%` }} />
          <div className="bg-red-400 rounded-r-full flex-1" />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Approved ({approved})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Pending ({items.filter(c => c.preQualStatus === 'pending').length})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Suspended ({items.filter(c => c.preQualStatus === 'suspended').length})</span>
        </div>
      </Card>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-black text-white' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Contractor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => {
          const prequal = preQualConfig[c.preQualStatus]
          const PreQualIcon = prequal.icon
          return (
            <Card key={c.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <HardHat size={16} className="text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-black dark:text-white">{c.company}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{c.industry}</p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>

              {/* Compliance score */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-500 dark:text-neutral-400">Compliance Score</span>
                  <span className="font-bold text-sm" style={{ color: scoreColor(c.complianceScore) }}>
                    {c.complianceScore}/100
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.complianceScore}%`, backgroundColor: scoreColor(c.complianceScore) }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <p className="text-neutral-400 mb-0.5">Contact</p>
                  <p className="font-medium text-black dark:text-white">{c.contact}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-0.5">Phone</p>
                  <p className="font-medium text-black dark:text-white flex items-center gap-1">
                    <Phone size={10} />{c.phone}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-0.5">Insurance Expiry</p>
                  <p className="font-medium text-black dark:text-white">{formatDate(c.insuranceExpiry)}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-0.5">Workers on Site</p>
                  <p className="font-medium text-black dark:text-white flex items-center gap-1">
                    <Users size={10} />{c.workers}
                  </p>
                </div>
              </div>

              {/* Pre-qual badge */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${prequal.class.replace('text-', 'bg-').replace('700', '50').replace('600', '50')}`}>
                <PreQualIcon size={13} className={prequal.class.split(' ')[1]} />
                <span className={`text-xs font-semibold ${prequal.class.split(' ')[1]}`}>Pre-Qual: {prequal.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ml-auto font-medium ${c.licenceStatus === 'Valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Licence {c.licenceStatus}
                </span>
              </div>

              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-7"
                  onClick={() => router.push(`/dashboard/contractors/${c.id}`)}
                >
                  View Profile
                </Button>
                {requestSent === c.id ? (
                  <span className="flex-1 text-xs h-7 flex items-center justify-center font-semibold text-green-600">
                    Request sent ✓
                  </span>
                ) : (
                  <Button
                    variant="black"
                    size="sm"
                    className="flex-1 text-xs h-7"
                    onClick={() => sendRequest(c.id)}
                  >
                    Request Docs
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Add Contractor Drawer */}
      <Drawer
        open={showAddDrawer}
        onClose={() => { setShowAddDrawer(false); setForm({ ...defaultForm }); setSaving(false); setSaved(false) }}
        title="Add Contractor"
        subtitle="Register a new contractor for pre-qualification"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Company Name" required>
            <TextInput
              value={form.company}
              onChange={v => setForm(f => ({ ...f, company: v }))}
              placeholder="e.g. BuildRight Pty Ltd"
            />
          </Field>

          <Field label="Industry" required>
            <Select
              value={form.industry}
              onChange={v => setForm(f => ({ ...f, industry: v }))}
              options={industryOptions}
              placeholder="Select industry…"
            />
          </Field>

          <Field label="Contact Person" required>
            <TextInput
              value={form.contact}
              onChange={v => setForm(f => ({ ...f, contact: v }))}
              placeholder="e.g. Jane Smith"
            />
          </Field>

          <Field label="Phone">
            <TextInput
              value={form.phone}
              onChange={v => setForm(f => ({ ...f, phone: v }))}
              placeholder="e.g. 0412 345 678"
            />
          </Field>

          <Field label="Email">
            <TextInput
              value={form.email}
              onChange={v => setForm(f => ({ ...f, email: v }))}
              placeholder="e.g. contact@company.com.au"
            />
          </Field>

          <Field label="Insurance Expiry">
            <TextInput
              type="date"
              value={form.insuranceExpiry}
              onChange={v => setForm(f => ({ ...f, insuranceExpiry: v }))}
            />
          </Field>

          <Field label="Number of Workers">
            <TextInput
              type="number"
              value={form.workers}
              onChange={v => setForm(f => ({ ...f, workers: v }))}
              placeholder="1"
            />
          </Field>

          <Field label="Pre-Qual Status">
            <RadioGroup
              value={form.preQualStatus}
              onChange={v => setForm(f => ({ ...f, preQualStatus: v }))}
              options={preQualOptions}
              colorMap={preQualColorMap}
            />
          </Field>

          <SubmitRow
            saving={saving}
            saved={saved}
            submitLabel="Add Contractor"
            savedLabel="Added!"
            onCancel={() => { setShowAddDrawer(false); setForm({ ...defaultForm }) }}
          />
        </form>
      </Drawer>

    </div>
  )
}
