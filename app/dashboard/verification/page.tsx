'use client'
import { useState } from 'react'
import { Shield, CheckCircle, Clock, AlertCircle, Upload, Plus } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['All', 'Pending', 'Verified', 'Expired']

const RECORDS = [
  { name: 'Marcus Thornton', role: 'Vendor', type: 'Driver Licence + Medicare', status: 'verified', verified: '12 Jul 2026', expires: '12 Jul 2027', risk: 'Low' },
  { name: 'Tom & Lucy Gardiner', role: 'Buyer', type: 'Passport (x2)', status: 'verified', verified: '20 Jul 2026', expires: '20 Jul 2027', risk: 'Low' },
  { name: 'Sandra Wilson', role: 'Vendor', type: 'Driver Licence', status: 'pending', verified: '—', expires: '—', risk: 'Medium' },
  { name: 'James Wu', role: 'Investor', type: 'Passport + ABN Verification', status: 'verified', verified: '3 Mar 2026', expires: '3 Mar 2027', risk: 'Low' },
  { name: 'Anderson Family', role: 'Buyer', type: 'Driver Licence (x2)', status: 'pending', verified: '—', expires: '—', risk: 'Medium' },
  { name: 'Peter Nguyen', role: 'Buyer', type: 'Not submitted', status: 'expired', verified: '—', expires: 'Overdue', risk: 'High' },
  { name: 'Lin Zhao', role: 'Investor', type: 'Passport + Company Docs', status: 'verified', verified: '15 Jan 2026', expires: '15 Jan 2027', risk: 'Low' },
  { name: 'Rebecca Hart', role: 'Vendor', type: 'Not submitted', status: 'pending', verified: '—', expires: '—', risk: 'Medium' },
]

const S: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  verified: { color: GREEN, icon: CheckCircle, label: 'Verified' },
  pending:  { color: AMBER, icon: Clock,       label: 'Pending' },
  expired:  { color: RED,   icon: AlertCircle, label: 'Overdue' },
}

export default function VerificationPage() {
  const [tab, setTab] = useState(0)
  const filtered = tab === 0 ? RECORDS : RECORDS.filter(r => r.status === TABS[tab].toLowerCase())

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Verification</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>AML/KYC identity verification records — NSW Real Estate compliance</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BLUE, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={12} /> Add Record
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[{ label: 'Verified', count: RECORDS.filter(r => r.status === 'verified').length, color: GREEN }, { label: 'Pending', count: RECORDS.filter(r => r.status === 'pending').length, color: AMBER }, { label: 'Overdue', count: RECORDS.filter(r => r.status === 'expired').length, color: RED }].map(({ label, count, color }) => (
            <div key={label} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{count}</div>
              <div style={{ fontSize: 12, color: TEXT2 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid #8b5cf6` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: 'auto', padding: '0 24px 24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Name', 'Role', 'Documents', 'Status', 'Verified', 'Expires', 'Risk', ''].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const cfg = S[r.status]
              const Icon = cfg.icon
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${BORDER2}` }}>
                  <td style={{ padding: '11px 12px', fontSize: 12.5, color: TEXT, fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '11px 12px', fontSize: 11, color: TEXT3 }}>{r.role}</td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: TEXT2 }}>{r.type}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${cfg.color}12`, padding: '2px 8px' }}>
                      <Icon size={10} color={cfg.color} />
                      <span style={{ fontSize: 10, color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 12px', fontSize: 11, color: TEXT2 }}>{r.verified}</td>
                  <td style={{ padding: '11px 12px', fontSize: 11, color: r.expires === 'Overdue' ? RED : TEXT2, fontWeight: r.expires === 'Overdue' ? 700 : 400 }}>{r.expires}</td>
                  <td style={{ padding: '11px 12px' }}><span style={{ fontSize: 10, color: r.risk === 'High' ? RED : r.risk === 'Medium' ? AMBER : GREEN, fontWeight: 700 }}>{r.risk}</span></td>
                  <td style={{ padding: '11px 12px' }}>
                    {r.status !== 'verified' && (
                      <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '4px 10px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <Upload size={10} /> Upload
                      </button>
                    )}
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
