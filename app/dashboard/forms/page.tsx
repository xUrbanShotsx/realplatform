'use client'
import { useState } from 'react'
import { FileText, Download, Eye, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['All Forms', 'Agency Agreements', 'Contracts', 'Disclosure', 'Trust Account']

const FORMS = [
  { name: 'Agency Agreement — 14 Ocean St', type: 'Agency Agreement', contact: 'Marcus Thornton', status: 'signed', date: '15 Jul 2026', category: 'Agency Agreements' },
  { name: 'Agency Agreement — 7 Park Rd', type: 'Agency Agreement', contact: 'Sandra Wilson', status: 'pending', date: '—', category: 'Agency Agreements' },
  { name: 'Contract of Sale — 9 Arcadia St', type: 'Contract', contact: 'Raj Patel → Buyer', status: 'signed', date: '18 Jun 2026', category: 'Contracts' },
  { name: 'Contract of Sale — 42 Foreshore Cres', type: 'Contract', contact: 'Anderson Family', status: 'draft', date: '—', category: 'Contracts' },
  { name: 'Section 32 — 42 Foreshore Cres', type: 'Disclosure', contact: 'Vendor disclosure', status: 'signed', date: '20 Jul 2026', category: 'Disclosure' },
  { name: 'Bidder Registration — 22 Kingsway', type: 'Disclosure', contact: 'Multiple buyers', status: 'signed', date: '5 Jul 2026', category: 'Disclosure' },
  { name: 'Trust Account Disbursement — Jul', type: 'Trust Account', contact: 'Spinelli RE Internal', status: 'signed', date: '25 Jul 2026', category: 'Trust Account' },
  { name: 'Trust Account Statement — Q2', type: 'Trust Account', contact: 'Spinelli RE Internal', status: 'signed', date: '30 Jun 2026', category: 'Trust Account' },
  { name: 'Agency Agreement — 3 Surf Rd', type: 'Agency Agreement', contact: 'Rebecca Hart', status: 'pending', date: '—', category: 'Agency Agreements' },
  { name: 'Buyer Acknowledgement — 42 Foreshore', type: 'Disclosure', contact: 'Tom & Lucy Gardiner', status: 'pending', date: '—', category: 'Disclosure' },
]

const S: Record<string, { color: string; icon: React.ElementType }> = {
  signed:  { color: GREEN, icon: CheckCircle },
  pending: { color: AMBER, icon: Clock },
  draft:   { color: '#64748b', icon: FileText },
  overdue: { color: RED,   icon: AlertCircle },
}

export default function FormsPage() {
  const [tab, setTab] = useState(0)
  const filtered = tab === 0 ? FORMS : FORMS.filter(f => f.category === TABS[tab])

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Forms</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Agency agreements, contracts, disclosure and trust account forms</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: PURPLE, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={12} /> New Form
          </button>
        </div>
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, overflowX: 'auto' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${PURPLE}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: 'auto', padding: '0 24px 24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Form Name', 'Type', 'Contact', 'Status', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => {
              const cfg = S[f.status]
              const Icon = cfg.icon
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${BORDER2}` }}>
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={13} color={TEXT3} />
                      <span style={{ fontSize: 12.5, color: TEXT, fontWeight: 600 }}>{f.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 12px', fontSize: 11, color: TEXT3 }}>{f.type}</td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: TEXT2 }}>{f.contact}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${cfg.color}12`, padding: '2px 8px' }}>
                      <Icon size={10} color={cfg.color} />
                      <span style={{ fontSize: 10, color: cfg.color, fontWeight: 700, textTransform: 'capitalize' }}>{f.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 12px', fontSize: 11, color: TEXT2 }}>{f.date}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '4px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={10} /> View</button>
                      {f.status === 'signed' && <button style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '4px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}><Download size={10} /></button>}
                      {f.status === 'pending' && <button style={{ border: `1px solid ${BLUE}`, background: `${BLUE}10`, color: BLUE, padding: '4px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>Send</button>}
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
