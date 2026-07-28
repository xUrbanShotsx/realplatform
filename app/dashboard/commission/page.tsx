'use client'
import { useState } from 'react'
import { DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle, Brain } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['All', 'Pending', 'Received', 'Splits']

type Commission = {
  property: string; agent: string; salePrice: number; commission: number
  rate: number; status: 'received' | 'pending' | 'overdue'; settled: string; split?: string
}

const COMMISSIONS: Commission[] = [
  { property: '14 Ocean St, Cronulla',       agent: 'Jye San Jurjo', salePrice: 2_950_000, commission: 88_500,  rate: 3.0, status: 'pending',  settled: 'Est. 14 Sep 2026', split: '100%' },
  { property: '42 Foreshore Cres, Cronulla', agent: 'Jye San Jurjo', salePrice: 4_850_000, commission: 121_250, rate: 2.5, status: 'pending',  settled: 'Est. 28 Aug 2026', split: '80% / 20%' },
  { property: '7 Park Rd, Manly',            agent: 'Jye San Jurjo', salePrice: 3_050_000, commission: 76_250,  rate: 2.5, status: 'received', settled: '12 Jul 2026',      split: '100%' },
  { property: '22 Kingsway, Cronulla',       agent: 'Sarah Mitchell', salePrice: 1_780_000, commission: 44_500,  rate: 2.5, status: 'received', settled: '3 Jul 2026',       split: '50% / 50%' },
  { property: '9 Arcadia St, Cronulla',      agent: 'Jye San Jurjo', salePrice: 2_550_000, commission: 63_750,  rate: 2.5, status: 'received', settled: '18 Jun 2026',      split: '100%' },
  { property: '15 Elouera Rd, Cronulla',     agent: 'Tom Walsh',     salePrice: 1_420_000, commission: 28_400,  rate: 2.0, status: 'overdue',  settled: 'Due 1 Aug 2026',   split: '100%' },
]

const fmt = (n: number) => '$' + (n >= 1_000_000 ? (n / 1_000_000).toFixed(2) + 'M' : n.toLocaleString())

const STATUS_COLOR: Record<string, string> = { received: GREEN, pending: AMBER, overdue: RED }
const STATUS_LABEL: Record<string, string> = { received: 'Received', pending: 'Pending', overdue: 'Overdue' }
const STATUS_ICON: Record<string, React.ElementType> = { received: CheckCircle, pending: Clock, overdue: AlertCircle }

export default function CommissionPage() {
  const [tab, setTab] = useState(0)

  const filtered = tab === 0 ? COMMISSIONS
    : tab === 1 ? COMMISSIONS.filter(c => c.status === 'pending' || c.status === 'overdue')
    : tab === 2 ? COMMISSIONS.filter(c => c.status === 'received')
    : COMMISSIONS.filter(c => c.split && c.split.includes('/'))

  const totalPending  = COMMISSIONS.filter(c => c.status !== 'received').reduce((s, c) => s + c.commission, 0)
  const totalReceived = COMMISSIONS.filter(c => c.status === 'received').reduce((s, c) => s + c.commission, 0)
  const totalVolume   = COMMISSIONS.reduce((s, c) => s + c.salePrice, 0)

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Commission</div>
        <div style={{ fontSize: 12, color: TEXT3, marginBottom: 16 }}>Track pending and received commissions across all sales</div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Volume', value: fmt(totalVolume), icon: TrendingUp, color: BLUE },
            { label: 'Pending', value: fmt(totalPending), icon: Clock, color: AMBER },
            { label: 'Received YTD', value: fmt(totalReceived), icon: CheckCircle, color: GREEN },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color={color} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 3 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI note */}
        <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Brain size={14} color={PINK} style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.6 }}>
            <strong style={{ color: PINK }}>AI · Commission Insight —</strong>{' '}
            15 Elouera Rd commission is overdue. Contact the vendor's solicitor — settlement was delayed by a caveat that has now been removed. The $28,400 should clear within 5 business days of follow-up.
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${AMBER}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '0 24px 24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Property', 'Agent', 'Sale Price', 'Rate', 'Commission', 'Split', 'Settlement', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const StatusIcon = STATUS_ICON[c.status]
              const color = STATUS_COLOR[c.status]
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${BORDER2}` }}>
                  <td style={{ padding: '12px 12px', fontSize: 12.5, color: TEXT, fontWeight: 600 }}>{c.property}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: TEXT2 }}>{c.agent}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12.5, color: TEXT, fontWeight: 700 }}>{fmt(c.salePrice)}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: TEXT2 }}>{c.rate}%</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: GREEN, fontWeight: 800 }}>{fmt(c.commission)}</td>
                  <td style={{ padding: '12px 12px', fontSize: 11, color: TEXT3 }}>{c.split ?? '—'}</td>
                  <td style={{ padding: '12px 12px', fontSize: 11, color: TEXT2 }}>{c.settled}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${color}12`, padding: '3px 8px' }}>
                      <StatusIcon size={10} color={color} />
                      <span style={{ fontSize: 10, color, fontWeight: 700 }}>{STATUS_LABEL[c.status]}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
