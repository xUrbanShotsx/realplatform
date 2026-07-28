'use client'

import { useState } from 'react'
import { contractorProfile, contractorOwnDocs, contractorJobs } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import {
  User, Building2, Phone, Mail, MapPin, FileText,
  CheckCircle2, Edit2, Save, X,
} from 'lucide-react'

export default function ContractorProfilePage() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...contractorProfile })

  const activeJobs    = contractorJobs.filter(j => j.status === 'active' || j.status === 'upcoming').length
  const currentDocs   = contractorOwnDocs.filter(d => d.status === 'current').length
  const expiringDocs  = contractorOwnDocs.filter(d => d.status === 'expiring' || d.status === 'expired').length

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>My Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Company details and account information</p>
        </div>
        <button
          onClick={() => setEditing(v => !v)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 transition-opacity hover:opacity-80"
          style={editing
            ? { background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430' }
            : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
          }
        >
          {editing ? <><X size={12} /> Cancel</> : <><Edit2 size={12} /> Edit profile</>}
        </button>
      </div>

      {/* Account type banner */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#22c55e10', border: '1px solid #22c55e30' }}>
        <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Free Contractor Account</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Your portal is always free. You're connected to {contractorJobs.length} builder project{contractorJobs.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <span className="text-[10px] font-black px-2 py-1" style={{ background: '#22c55e', color: '#fff' }}>FREE</span>
      </div>

      {/* Stats strip */}
      <div className="flex items-center divide-x" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderColor: 'var(--border)' }}>
        {[
          { label: 'Active / upcoming jobs', value: activeJobs,      color: '#22c55e' },
          { label: 'Documents on file',      value: contractorOwnDocs.length, color: 'var(--text)' },
          { label: 'Current documents',      value: currentDocs,     color: '#22c55e' },
          { label: 'Need renewal',           value: expiringDocs,    color: expiringDocs > 0 ? '#f59e0b' : '#22c55e' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2 px-4 py-2.5 flex-1" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm font-black" style={{ color }}>{value}</span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Profile details */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <Building2 size={14} style={{ color: 'var(--text-muted)' }} />
          <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Company Details</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Company / Trading Name', key: 'companyName',  icon: Building2, type: 'text' },
              { label: 'Primary Contact Name',   key: 'contactName',  icon: User,      type: 'text' },
              { label: 'Trade / Speciality',     key: 'trade',        icon: FileText,  type: 'text' },
              { label: 'ABN',                    key: 'abn',          icon: FileText,  type: 'text' },
              { label: 'Licence Number',         key: 'licenceNumber',icon: FileText,  type: 'text' },
              { label: 'Phone',                  key: 'phone',        icon: Phone,     type: 'tel'  },
              { label: 'Email',                  key: 'email',        icon: Mail,      type: 'email'},
              { label: 'Business Address',       key: 'address',      icon: MapPin,    type: 'text' },
            ].map(({ label, key, icon: Icon, type }) => (
              <div key={key}>
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  {label}
                </label>
                {editing ? (
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <Icon size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <p className="text-sm" style={{ color: 'var(--text)' }}>{form[key as keyof typeof form]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {editing && (
            <div className="flex items-center gap-2 mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
              >
                <Save size={13} /> Save changes
              </button>
              <button
                onClick={() => { setForm({ ...contractorProfile }); setEditing(false) }}
                className="px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connected builders */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Connected Builders</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Builders whose projects you're assigned to</p>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {Array.from(new Set(contractorJobs.map(j => j.builder))).map(builder => {
            const jobs = contractorJobs.filter(j => j.builder === builder)
            const pm = jobs[0].projectManager
            return (
              <div key={builder} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{builder}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {jobs.length} job{jobs.length !== 1 ? 's' : ''} · PM: {pm}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1" style={{ background: '#22c55e18', color: '#22c55e' }}>
                  Connected
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Account */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Account</p>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Account type</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Free contractor portal — no subscription required</p>
            </div>
            <span className="text-[10px] font-black px-2 py-1" style={{ background: '#22c55e', color: '#fff' }}>FREE</span>
          </div>
          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Member since</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(contractorProfile.joinedDate)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Change password</p>
            <button className="text-xs font-bold transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>
              Update password →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
