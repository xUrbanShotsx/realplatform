'use client'

import { useState } from 'react'
import { permits, permitTypes } from '@/lib/mock-data'
import type { PermitStatus } from '@/lib/mock-data'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Plus, MapPin, User, Clock, ChevronRight, Eye, ArrowRight } from 'lucide-react'

type FilterOption = 'All' | 'Active' | 'Pending' | 'Expired' | 'Closed'
const FILTERS: FilterOption[] = ['All', 'Active', 'Pending', 'Expired', 'Closed']

const activeCount  = permits.filter(p => p.status === 'active').length
const pendingCount = permits.filter(p => p.status === 'pending').length
const expiredCount = permits.filter(p => p.status === 'expired').length
const highRiskCount = permits.filter(p => p.riskLevel === 'high').length

const riskColors: Record<string, { bg: string; text: string }> = {
  high:   { bg: 'rgba(239,68,68,0.12)',   text: '#dc2626' },
  medium: { bg: 'rgba(245,158,11,0.12)',  text: '#d97706' },
  low:    { bg: 'rgba(34,197,94,0.12)',   text: '#16a34a' },
}

const statusColors: Record<PermitStatus, { bg: string; text: string }> = {
  active:  { bg: 'rgba(34,197,94,0.12)',   text: '#16a34a' },
  pending: { bg: 'rgba(245,158,11,0.12)',  text: '#d97706' },
  expired: { bg: 'rgba(239,68,68,0.12)',   text: '#dc2626' },
  closed:  { bg: 'rgba(113,113,122,0.12)', text: '#71717a' },
}

const ApprovalWorkflow = ({ currentStep }: { currentStep: 1 | 2 | 3 }) => {
  const steps = [
    { label: 'Requested', step: 1 },
    { label: 'Under Review', step: 2 },
    { label: 'Approved', step: 3 },
  ]
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.step} className="flex items-center">
          <div
            className="flex flex-col items-center"
          >
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-bold"
              style={{
                background: s.step <= currentStep ? 'var(--accent)' : 'var(--bg-secondary)',
                border: `2px solid ${s.step <= currentStep ? 'var(--accent)' : 'var(--border)'}`,
                color: s.step <= currentStep ? 'var(--accent-text)' : 'var(--text-muted)',
              }}
            >
              {s.step}
            </div>
            <span
              className="text-xs mt-1 font-medium whitespace-nowrap"
              style={{ color: s.step <= currentStep ? 'var(--text)' : 'var(--text-muted)' }}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="w-12 h-0.5 mx-1 mb-4"
              style={{ background: s.step < currentStep ? 'var(--accent)' : 'var(--border)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function PermitsPage() {
  const [filter, setFilter] = useState<FilterOption>('All')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const pendingPermits = permits.filter(p => p.status === 'pending')

  const filteredPermits = permits.filter(p => {
    if (filter === 'All') return true
    return p.status === filter.toLowerCase()
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Permits to Work"
        description="Manage and approve high-risk work permits across all sites"
        action={{ label: 'New Permit', icon: <Plus size={14} /> }}
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Permits',
            value: activeCount,
            color: '#16a34a',
            bg: 'rgba(34,197,94,0.1)',
          },
          {
            label: 'Pending Approval',
            value: pendingCount,
            color: pendingCount > 0 ? '#d97706' : '#16a34a',
            bg: pendingCount > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
            badge: pendingCount > 0,
          },
          {
            label: 'Expired Today',
            value: expiredCount,
            color: expiredCount > 0 ? '#dc2626' : '#71717a',
            bg: expiredCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(113,113,122,0.1)',
          },
          {
            label: 'High Risk',
            value: highRiskCount,
            color: highRiskCount > 0 ? '#dc2626' : '#71717a',
            bg: highRiskCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(113,113,122,0.1)',
          },
        ].map(({ label, value, color, bg, badge }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                  {value}
                  {badge && value > 0 && (
                    <span
                      className="ml-2 text-xs px-1.5 py-0.5 align-middle font-semibold"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626' }}
                    >
                      Action needed
                    </span>
                  )}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
              <div className="w-3 h-3 rounded-full mt-1" style={{ background: color }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Approval workflow banner for pending permits */}
      {pendingPermits.length > 0 && (
        <Card className="p-5" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#f59e0b' }}
                />
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {pendingPermits.length} permit{pendingPermits.length !== 1 ? 's' : ''} awaiting your approval
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {pendingPermits.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  >
                    <span>{permitTypes[p.type].icon}</span>
                    <span className="font-medium" style={{ color: 'var(--text)' }}>{p.id}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{permitTypes[p.type].label}</span>
                    <ChevronRight size={10} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{p.site}</span>
                  </div>
                ))}
              </div>
            </div>
            <ApprovalWorkflow currentStep={2} />
          </div>
        </Card>
      )}

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background: filter === f ? 'var(--accent)' : 'var(--bg-secondary)',
              color: filter === f ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
              cursor: 'pointer',
            }}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 opacity-70">
                {permits.filter(p => p.status === f.toLowerCase()).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Permits list */}
      <div className="space-y-3">
        {filteredPermits.map(permit => {
          const type = permitTypes[permit.type]
          const risk = riskColors[permit.riskLevel] ?? riskColors.low
          const statusStyle = statusColors[permit.status] ?? statusColors.closed
          const isHovered = hoveredId === permit.id

          return (
            <Card
              key={permit.id}
              className="p-5 transition-all duration-150"
              style={{
                cursor: 'default',
                boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
              }}
              onMouseEnter={() => setHoveredId(permit.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-start gap-4">
                {/* Type icon */}
                <div
                  className="w-11 h-11 flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: `${type.color}26`,
                    border: `1px solid ${type.color}40`,
                  }}
                >
                  {type.icon}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {permit.id}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 font-medium"
                          style={{ background: `${type.color}18`, color: type.color }}
                        >
                          {type.label}
                        </span>
                      </div>
                      <p className="font-semibold text-sm mt-1" style={{ color: 'var(--text)' }}>
                        {permit.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="text-xs px-2 py-0.5 font-semibold"
                        style={{ background: risk.bg, color: risk.text }}
                      >
                        {permit.riskLevel.charAt(0).toUpperCase() + permit.riskLevel.slice(1)} Risk
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 font-semibold"
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                      >
                        {permit.status.charAt(0).toUpperCase() + permit.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2">
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <MapPin size={11} /> {permit.site}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={11} /> {permit.startDate} · {permit.validHours}h valid
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <User size={11} /> Requested by{' '}
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{permit.requestedBy}</span>
                    </span>
                    {permit.approvedBy ? (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <ArrowRight size={11} /> Approved by{' '}
                        <span style={{ color: '#16a34a', fontWeight: 500 }}>{permit.approvedBy}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#d97706' }}>
                        <Clock size={11} /> Awaiting approval
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {permit.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          style={{ background: 'var(--accent)', color: 'var(--accent-text)', border: 'none' }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          style={{ color: '#dc2626', borderColor: 'rgba(239,68,68,0.3)' }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {permit.status === 'active' && (
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Close Permit
                      </Button>
                    )}
                    {isHovered && (
                      <>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" style={{ color: 'var(--text-secondary)' }}>
                          <Eye size={11} /> View Details
                        </Button>
                        {permit.status === 'active' && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Extend
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
