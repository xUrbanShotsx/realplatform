'use client'

import { useState } from 'react'
import {
  Plus, CheckCircle2, XCircle, AlertCircle, ChevronDown,
  Home, Clock, Search, Filter, Zap,
} from 'lucide-react'
import { listings, salesChecklistTemplate, type Listing } from '@/lib/re-mock-data'

const RE_ACCENT = '#3B82F6'

function statusBadge(status: Listing['status']) {
  const cfg: Record<string, { bg: string; text: string }> = {
    'Active':           { bg: '#eff6ff', text: '#1d4ed8' },
    'Under Contract':   { bg: '#fef3c7', text: '#b45309' },
    'Sold':             { bg: '#f0fdf4', text: '#15803d' },
    'Withdrawn':        { bg: '#f4f4f5', text: '#71717a' },
    'Off Market':       { bg: '#fdf4ff', text: '#7e22ce' },
  }
  const c = cfg[status] ?? { bg: '#f4f4f5', text: '#71717a' }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 whitespace-nowrap"
      style={{ background: c.bg, color: c.text }}>{status}</span>
  )
}

function amlBadge(s: Listing['amlStatus']) {
  const cfg = {
    Verified: { icon: CheckCircle2, color: '#22c55e' },
    Pending:  { icon: AlertCircle,  color: '#f59e0b' },
    Flagged:  { icon: XCircle,      color: '#ef4444' },
  }[s]
  const Icon = cfg.icon
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: cfg.color }}>
      <Icon size={10} />{s}
    </span>
  )
}

function ChecklistModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const completed = [
    listing.signedAgencyAgreement, true, true,
    listing.section32, true, true, true,
    true, true, listing.vendorStatement, true,
    listing.marketingApproved, listing.photosUploaded, listing.photosUploaded,
    listing.photosUploaded, listing.listingType === 'Auction', listing.listingType === 'Auction',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto"
        style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between"
          style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: RE_ACCENT }}>Listing Checklist</p>
            <h3 className="text-base font-black" style={{ color: '#0f172a' }}>
              {listing.address}, {listing.suburb}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 flex-1" style={{ background: '#1e1e1e' }}>
                <div className="h-full" style={{ width: `${listing.checklistPct}%`, background: RE_ACCENT }} />
              </div>
              <span className="text-xs font-black" style={{ color: RE_ACCENT }}>{listing.checklistPct}%</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        {/* Checklist items grouped by category */}
        {Object.entries(
          salesChecklistTemplate.reduce<Record<string, typeof salesChecklistTemplate>>((acc, item) => {
            ;(acc[item.category] = acc[item.category] ?? []).push(item)
            return acc
          }, {})
        ).map(([cat, items]) => (
          <div key={cat}>
            <div className="px-6 py-2" style={{ background: '#f8fafc' }}>
              <p className="text-[9px] font-bold uppercase tracking-[3px]"
                style={{ color: '#94a3b8' }}>{cat}</p>
            </div>
            {items.map((item, idx) => {
              const globalIdx = salesChecklistTemplate.findIndex(i => i.id === item.id)
              const done = completed[globalIdx] ?? false
              return (
                <div key={item.id}
                  className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-[#161616]"
                  style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                    style={{ border: `1px solid ${done ? '#22c55e' : '#2a2a2a'}`, background: done ? '#22c55e10' : 'transparent' }}>
                    {done && <CheckCircle2 size={10} style={{ color: '#22c55e' }} />}
                  </div>
                  <span className="text-xs flex-1" style={{ color: done ? '#a8a8a8' : '#f5f5f5', textDecoration: done ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                  {!done && (
                    <button className="text-[10px] font-bold px-2 py-0.5 transition-opacity hover:opacity-70"
                      style={{ background: RE_ACCENT + '20', color: RE_ACCENT, border: `1px solid ${RE_ACCENT}40` }}>
                      Complete
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold transition-opacity hover:opacity-80"
            style={{ background: RE_ACCENT, color: '#fff' }}>
            <Zap size={12} /> AI Auto-Complete
          </button>
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold transition-opacity hover:opacity-70"
            style={{ background: '#1e1e1e', color: '#64748b' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  const [filter, setFilter] = useState<string>('All')
  const [selected, setSelected] = useState<Listing | null>(null)
  const [showNew, setShowNew] = useState(false)

  const statuses = ['All', 'Active', 'Under Contract', 'Sold', 'Withdrawn']
  const filtered = filter === 'All' ? listings : listings.filter(l => l.status === filter)

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Listings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {listings.filter(l => l.status === 'Active').length} active &middot; {listings.filter(l => l.status === 'Under Contract').length} under contract
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-80"
          style={{ background: RE_ACCENT, color: '#fff' }}>
          <Plus size={13} /> New Listing
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active',         value: listings.filter(l => l.status === 'Active').length,         color: RE_ACCENT  },
          { label: 'Under Contract', value: listings.filter(l => l.status === 'Under Contract').length, color: '#f59e0b'  },
          { label: 'AML Pending',    value: listings.filter(l => l.amlStatus !== 'Verified').length,    color: '#ef4444'  },
          { label: 'Checklist < 80%',value: listings.filter(l => l.checklistPct < 80).length,           color: '#f97316'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter + table */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>

        {/* Filter bar */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-1">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 text-xs font-bold transition-colors"
                style={filter === s
                  ? { background: RE_ACCENT, color: '#fff' }
                  : { color: 'var(--text-muted)', background: 'transparent' }}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <Search size={12} /> <Filter size={12} />
          </div>
        </div>

        {/* Table header */}
        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Property</span><span>Agent</span><span>Price</span><span>DOM</span><span>AML</span><span>Checklist</span><span>Status</span>
        </div>

        {filtered.map((l, i) => (
          <div key={l.id}
            className="grid items-center px-5 py-3.5 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
            style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
            onClick={() => setSelected(l)}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{l.address}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{l.suburb} &middot; {l.type}</p>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{l.agent.split(' ')[0]}</span>
            <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>
              ${(l.price / 1000000).toFixed(2).replace(/\.?0+$/, '')}m
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: l.daysOnMarket > 30 ? '#f59e0b' : 'var(--text-muted)' }}>
              <Clock size={10} />{l.daysOnMarket}d
            </span>
            {amlBadge(l.amlStatus)}
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 max-w-[48px]" style={{ background: 'var(--border)' }}>
                <div className="h-full" style={{ width: `${l.checklistPct}%`, background: l.checklistPct === 100 ? '#22c55e' : RE_ACCENT }} />
              </div>
              <span className="text-[10px] font-bold"
                style={{ color: l.checklistPct === 100 ? '#22c55e' : RE_ACCENT }}>
                {l.checklistPct}%
              </span>
            </div>
            {statusBadge(l.status)}
          </div>
        ))}
      </div>

      {/* Checklist modal */}
      {selected && <ChecklistModal listing={selected} onClose={() => setSelected(null)} />}

      {/* New Listing Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg" style={{ background: '#fff', border: '1px solid #e2e8f0' }}
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: RE_ACCENT }}>Create New</p>
                <h3 className="text-base font-black" style={{ color: '#0f172a' }}>New Listing</h3>
              </div>
              <button onClick={() => setShowNew(false)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Property Address', placeholder: '14 Example Street' },
                { label: 'Suburb',           placeholder: 'Castle Hill' },
                { label: 'Listing Price',    placeholder: '$1,500,000' },
                { label: 'Assigned Agent',   placeholder: 'Select agent…' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <input placeholder={placeholder} className="w-full px-3 py-2.5 text-sm"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', outline: 'none' }} />
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 p-3 text-xs"
                style={{ background: RE_ACCENT + '10', border: `1px solid ${RE_ACCENT}30`, color: RE_ACCENT }}>
                <Zap size={12} />
                AI will auto-generate a compliance checklist for this listing upon creation.
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-opacity hover:opacity-80"
                style={{ background: RE_ACCENT, color: '#fff' }}>
                <Plus size={12} /> Create Listing + Checklist
              </button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2.5 text-xs font-bold"
                style={{ background: '#1e1e1e', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
