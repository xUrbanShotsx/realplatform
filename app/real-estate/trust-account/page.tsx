import Link from 'next/link'
import {
  DollarSign, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft,
  ArrowLeftRight, Clock, ShieldCheck, FileText, TrendingUp,
} from 'lucide-react'
import { trustEntries, trustSummary, type TrustEntry } from '@/lib/re-mock-data'

const RE_ACCENT = '#3B82F6'

function typeBadge(t: TrustEntry['type']) {
  const cfg = {
    Deposit:       { icon: ArrowDownLeft,  color: '#22c55e', label: 'Deposit'       },
    Disbursement:  { icon: ArrowUpRight,   color: '#ef4444', label: 'Disbursement'  },
    Transfer:      { icon: ArrowLeftRight, color: '#f59e0b', label: 'Transfer'      },
  }[t]
  const Icon = cfg.icon
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: cfg.color }}>
      <Icon size={10} />{cfg.label}
    </span>
  )
}

function statusBadge(s: TrustEntry['status']) {
  const cfg = {
    Cleared:     { bg: '#f0fdf4', text: '#15803d' },
    Pending:     { bg: '#fef3c7', text: '#b45309' },
    Reconciled:  { bg: '#eff6ff', text: '#1d4ed8' },
  }[s]
  return <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: cfg.bg, color: cfg.text }}>{s}</span>
}

export default function TrustAccountPage() {
  const deposits      = trustEntries.filter(t => t.type === 'Deposit').reduce((s, t) => s + t.amount, 0)
  const disbursements = Math.abs(trustEntries.filter(t => t.type !== 'Deposit').reduce((s, t) => s + t.amount, 0))

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Trust Account</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Property and Stock Agents Act 2002 (NSW) — statutory trust accounting obligations
        </p>
      </div>

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-5 py-4"
        style={{ background: '#eff6ff', border: `1px solid ${RE_ACCENT}30` }}>
        <ShieldCheck size={15} style={{ color: RE_ACCENT, flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: '#1d4ed8' }}>
          <span className="font-bold">Statutory obligation: </span>
          All trust money must be deposited into an authorised trust account within 3 business days. Monthly reconciliation is mandatory. Principals are personally liable for trust account shortfalls. Audited annually by an approved auditor.
        </p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Sales Trust Account', value: trustSummary.salesTrustBalance, color: RE_ACCENT,  sub: 'Buyer deposits & settlements' },
          { label: 'PM Trust Account',    value: trustSummary.pmTrustBalance,    color: '#22c55e',  sub: 'Rent, bonds & disbursements'  },
          { label: 'Total Trust Held',    value: trustSummary.totalTrust,        color: '#0f172a',  sub: 'Combined balance'             },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="px-6 py-5"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-4xl font-black" style={{ color }}>
              ${(value / 1000).toFixed(0)}k
            </p>
            <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-muted)' }}>
              ${value.toLocaleString('en-AU')}
            </p>
            <p className="text-[11px] mt-3" style={{ color: 'var(--text-muted)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Reconciliation status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="px-6 py-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Reconciliation Status</h2>
            {trustSummary.unreconciled > 0
              ? <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5" style={{ background: '#fef3c7', color: '#b45309' }}>
                  <AlertCircle size={9} /> {trustSummary.unreconciled} pending
                </span>
              : <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5" style={{ background: '#f0fdf4', color: '#15803d' }}>
                  <CheckCircle2 size={9} /> Up to date
                </span>
            }
          </div>
          <div className="space-y-4">
            {[
              { label: 'Last Reconciled',    value: new Date(trustSummary.lastReconciled).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }), ok: true },
              { label: 'Next Due',           value: new Date(trustSummary.nextReconciliation).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }), ok: false },
              { label: 'Status',             value: trustSummary.reconciliationStatus, ok: true },
              { label: 'Unreconciled Items', value: `${trustSummary.unreconciled} entries`, ok: trustSummary.unreconciled === 0 },
            ].map(({ label, value, ok }) => (
              <div key={label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="text-xs font-bold" style={{ color: ok ? '#22c55e' : '#f59e0b' }}>{value}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 text-xs font-bold transition-opacity hover:opacity-80"
            style={{ background: RE_ACCENT, color: '#fff' }}>
            Run Reconciliation
          </button>
        </div>

        {/* This month summary */}
        <div className="px-6 py-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>This Month Summary</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="flex items-center gap-1.5" style={{ color: '#22c55e' }}>
                  <ArrowDownLeft size={11} /> Deposits In
                </span>
                <span className="font-black" style={{ color: '#22c55e' }}>${deposits.toLocaleString('en-AU')}</span>
              </div>
              <div className="h-2" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full" style={{ width: `${Math.round((deposits / (deposits + disbursements)) * 100)}%`, background: '#22c55e' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="flex items-center gap-1.5" style={{ color: '#ef4444' }}>
                  <ArrowUpRight size={11} /> Disbursements Out
                </span>
                <span className="font-black" style={{ color: '#ef4444' }}>${disbursements.toLocaleString('en-AU')}</span>
              </div>
              <div className="h-2" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full" style={{ width: `${Math.round((disbursements / (deposits + disbursements)) * 100)}%`, background: '#ef4444' }} />
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Net movement</span>
              <span className="text-lg font-black" style={{ color: deposits - disbursements > 0 ? '#22c55e' : '#ef4444' }}>
                {deposits - disbursements > 0 ? '+' : ''}${(deposits - disbursements).toLocaleString('en-AU')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction ledger */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <FileText size={13} style={{ color: RE_ACCENT }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Transaction Ledger</h2>
          </div>
          <button className="text-[10px] font-bold px-3 py-1.5 hover:opacity-70"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            Export CSV
          </button>
        </div>

        <div className="grid px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ gridTemplateColumns: '0.8fr 2fr 1fr 1fr 1fr 0.8fr', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <span>Date</span><span>Description</span><span>Property</span><span>Type</span><span>Amount</span><span>Status</span>
        </div>

        {trustEntries.map((t, i) => (
          <div key={t.id}
            className="grid items-center px-5 py-3.5 transition-colors hover:bg-[var(--bg-hover)]"
            style={{
              gridTemplateColumns: '0.8fr 2fr 1fr 1fr 1fr 0.8fr',
              borderBottom: i < trustEntries.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {new Date(t.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            </span>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{t.description}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.reference}</p>
            </div>
            <span className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              {t.property.split(',')[0]}
            </span>
            {typeBadge(t.type)}
            <span className="text-sm font-black" style={{ color: t.amount > 0 ? '#22c55e' : '#ef4444' }}>
              {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
            </span>
            {statusBadge(t.status)}
          </div>
        ))}
      </div>
    </div>
  )
}
