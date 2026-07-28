'use client'

import { useState } from 'react'
import { prestartTemplates, prestartSubmissions } from '@/lib/mock-data'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle2, XCircle, Clock, QrCode, ChevronDown, ChevronRight, AlertTriangle, Eye, Pencil, Zap, Trash2 } from 'lucide-react'

const todaysSubmissions = prestartSubmissions.filter(s => s.date === '2025-05-04')
const passCount = todaysSubmissions.filter(s => s.status === 'pass').length
const failCount = todaysSubmissions.filter(s => s.status === 'fail').length
const passRate = Math.round((passCount / todaysSubmissions.length) * 100)
const totalFailedItems = todaysSubmissions.reduce((sum, s) => sum + s.fails, 0)
const activeSites = new Set(todaysSubmissions.map(s => s.site)).size

const pendingSubmissions = [
  { site: 'Site C – Penrith', crew: 'Afternoon crew', count: 2 },
]

const TABS = ['Today\'s Submissions', 'Templates', 'QR Check-in'] as const
type Tab = typeof TABS[number]

const QR_SITES = [
  { name: 'Site A – George St', code: 'QR-SITE-A' },
  { name: 'Site B – Parramatta', code: 'QR-SITE-B' },
  { name: 'Site C – Penrith', code: 'QR-SITE-C' },
]

const TRADES = ['General', 'Roofing', 'Civil', 'Electrical', 'Plumbing', 'Mechanical']
const SITES = ['All Sites', 'Site A', 'Site B', 'Site C', 'Warehouse – Ryde']

export default function PrestartPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Today\'s Submissions')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    trade: 'General',
    site: 'All Sites',
    items: ['PPE inspected and worn correctly', 'Emergency procedures reviewed', 'SWMS reviewed and signed'],
  })

  const templateMap = Object.fromEntries(prestartTemplates.map(t => [t.id, t]))

  const statCards = [
    {
      label: 'Submitted Today',
      value: todaysSubmissions.length,
      icon: <CheckCircle2 size={16} />,
      iconColor: '#22c55e',
      bgColor: 'rgba(34,197,94,0.1)',
    },
    {
      label: 'Pass Rate',
      value: `${passRate}%`,
      icon: <CheckCircle2 size={16} />,
      iconColor: passRate >= 80 ? '#22c55e' : '#f59e0b',
      bgColor: passRate >= 80 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Failed Items',
      value: totalFailedItems,
      icon: <XCircle size={16} />,
      iconColor: totalFailedItems > 0 ? '#ef4444' : '#22c55e',
      bgColor: totalFailedItems > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
    },
    {
      label: 'Sites Active',
      value: activeSites,
      icon: <CheckCircle2 size={16} />,
      iconColor: '#22c55e',
      bgColor: 'rgba(34,197,94,0.1)',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Pre-start Checklists"
        description="Daily pre-start submissions, templates and QR check-in management"
        action={{ label: 'New Template', icon: <Plus size={14} /> }}
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, iconColor, bgColor }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: bgColor, color: iconColor }}>
                {icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2.5 text-sm font-medium transition-colors relative"
            style={{
              color: activeTab === tab ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Today's Submissions */}
      {activeTab === 'Today\'s Submissions' && (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  {['Time', 'Worker', 'Checklist', 'Site', 'Result', 'Action'].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold tracking-wide"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todaysSubmissions.map(sub => {
                  const template = templateMap[sub.templateId]
                  const isExpanded = expandedRow === sub.id
                  const hasFails = sub.fails > 0
                  return (
                    <>
                      <tr
                        key={sub.id}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          background: isExpanded ? 'var(--bg-secondary)' : 'var(--bg)',
                          cursor: hasFails ? 'pointer' : 'default',
                        }}
                        onClick={() => hasFails && setExpandedRow(isExpanded ? null : sub.id)}
                      >
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {sub.time}
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>
                          {sub.submittedBy}
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                          {template?.name ?? sub.templateId}
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                          {sub.site}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {sub.status === 'pass' ? (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
                                style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}
                              >
                                <CheckCircle2 size={10} /> Pass
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
                                style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626' }}
                              >
                                <XCircle size={10} /> Fail
                              </span>
                            )}
                            {hasFails && (
                              <span className="text-xs" style={{ color: '#dc2626' }}>
                                {sub.fails} issue{sub.fails !== 1 ? 's' : ''}
                              </span>
                            )}
                            {hasFails && (
                              isExpanded ? <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={e => e.stopPropagation()}
                          >
                            <Eye size={11} /> View
                          </Button>
                        </td>
                      </tr>
                      {isExpanded && sub.failedItems && (
                        <tr key={`${sub.id}-detail`} style={{ background: 'rgba(239,68,68,0.04)' }}>
                          <td colSpan={6} className="px-6 py-3">
                            <div className="flex items-start gap-2">
                              <AlertTriangle size={14} style={{ color: '#dc2626', marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <p className="text-xs font-semibold mb-1" style={{ color: '#dc2626' }}>
                                  Failed checklist items:
                                </p>
                                <ul className="space-y-1">
                                  {sub.failedItems.map(item => (
                                    <li key={item} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                      — {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </Card>

          {/* Pending section */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Pending Submissions</p>
            </div>
            <div className="space-y-2">
              {pendingSubmissions.map(p => (
                <div
                  key={p.site}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#f59e0b' }}
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{p.site}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.crew}</p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5"
                    style={{ background: 'rgba(245,158,11,0.12)', color: '#d97706' }}
                  >
                    {p.count} pending
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Templates */}
      {activeTab === 'Templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prestartTemplates.map(template => (
              <Card key={template.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{template.name}</p>
                    <span
                      className="inline-block mt-1 text-xs px-2 py-0.5 font-medium"
                      style={{ background: 'rgba(255,217,64,0.15)', color: '#92700a' }}
                    >
                      {template.trade}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>Checklist items</span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{template.items.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>Site assignment</span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{template.site}</span>
                  </div>
                </div>

                <ul className="space-y-1">
                  {template.items.slice(0, 3).map(item => (
                    <li key={item} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }}>·</span>
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                  {template.items.length > 3 && (
                    <li className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      +{template.items.length - 3} more items
                    </li>
                  )}
                </ul>

                <div
                  className="pt-3 space-y-2"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1">
                      <Pencil size={10} /> Edit
                    </Button>
                    <Button size="sm" className="flex-1 h-7 text-xs gap-1">
                      <Zap size={10} /> Use Now
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full h-7 text-xs gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <QrCode size={12} />
                    <span>QR Code</span>
                    <div
                      className="ml-auto w-8 h-8 flex items-center justify-center"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      <div
                        style={{
                          width: 20, height: 20,
                          backgroundImage: 'repeating-linear-gradient(0deg,var(--border) 0,var(--border) 1px,transparent 1px,transparent 4px),repeating-linear-gradient(90deg,var(--border) 0,var(--border) 1px,transparent 1px,transparent 4px)',
                          backgroundSize: '4px 4px',
                        }}
                      />
                    </div>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Build New Template */}
          {!showNewTemplate ? (
            <button
              onClick={() => setShowNewTemplate(true)}
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors"
              style={{
                border: '2px dashed var(--border)',
                color: 'var(--text-secondary)',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              Build New Template
            </button>
          ) : (
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>New Pre-start Template</p>
                <button
                  onClick={() => setShowNewTemplate(false)}
                  className="text-xs"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Template Name
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                    placeholder="e.g. Roofing Pre-start"
                    value={newTemplate.name}
                    onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Trade
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                    value={newTemplate.trade}
                    onChange={e => setNewTemplate(p => ({ ...p, trade: e.target.value }))}
                  >
                    {TRADES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Site
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                    value={newTemplate.site}
                    onChange={e => setNewTemplate(p => ({ ...p, site: e.target.value }))}
                  >
                    {SITES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Checklist Items
                  </label>
                  <button
                    className="text-xs flex items-center gap-1"
                    style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => setNewTemplate(p => ({ ...p, items: [...p.items, ''] }))}
                  >
                    <Plus size={11} /> Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {newTemplate.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs w-5 text-right flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {idx + 1}.
                      </span>
                      <input
                        className="flex-1 px-3 py-1.5 text-sm outline-none"
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                        }}
                        value={item}
                        placeholder="Enter checklist item..."
                        onChange={e => {
                          const updated = [...newTemplate.items]
                          updated[idx] = e.target.value
                          setNewTemplate(p => ({ ...p, items: updated }))
                        }}
                      />
                      <button
                        className="flex-shrink-0"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        onClick={() => setNewTemplate(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <Button variant="outline" size="sm" onClick={() => setShowNewTemplate(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setShowNewTemplate(false)}>
                  Save Template
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Tab: QR Check-in */}
      {activeTab === 'QR Check-in' && (
        <div className="space-y-6">
          <Card className="p-5" style={{ background: 'var(--bg-secondary)' }}>
            <div className="flex items-start gap-3">
              <QrCode size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>QR Check-in Workflow</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Workers scan this QR code on arrival to submit their pre-start checklist from their mobile device.
                  Each site has a unique code that routes to the correct template automatically — no login required.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QR_SITES.map(site => (
              <Card key={site.name} className="p-6 flex flex-col items-center gap-4">
                {/* QR placeholder */}
                <div
                  className="w-40 h-40 flex items-center justify-center relative"
                  style={{ border: '2px solid var(--border)' }}
                >
                  {/* Simulated QR pattern */}
                  <div className="absolute inset-3" style={{
                    backgroundImage: [
                      'repeating-linear-gradient(0deg,var(--border-strong) 0,var(--border-strong) 2px,transparent 2px,transparent 8px)',
                      'repeating-linear-gradient(90deg,var(--border-strong) 0,var(--border-strong) 2px,transparent 2px,transparent 8px)',
                    ].join(','),
                  }} />
                  {/* Corner squares */}
                  {[
                    'top-3 left-3', 'top-3 right-3', 'bottom-3 left-3'
                  ].map(pos => (
                    <div
                      key={pos}
                      className={`absolute ${pos} w-8 h-8`}
                      style={{ border: '3px solid var(--text)', background: 'var(--bg)' }}
                    >
                      <div className="absolute inset-1.5" style={{ background: 'var(--text)' }} />
                    </div>
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="px-2 py-1 text-xs font-bold"
                      style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                      {site.code}
                    </div>
                  </div>
                </div>

                <p className="font-semibold text-sm text-center" style={{ color: 'var(--text)' }}>
                  {site.name}
                </p>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Scan on arrival to submit pre-start
                </p>

                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    Print
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
