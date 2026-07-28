'use client'
import { Shield, FileText, User, DollarSign, Key, AlertCircle } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const CATEGORY_ICON: Record<string, React.ElementType> = { 'Compliance': Shield, 'Document': FileText, 'Contact': User, 'Finance': DollarSign, 'Access': Key, 'Alert': AlertCircle }
const CATEGORY_COLOR: Record<string, string> = { 'Compliance': PURPLE, 'Document': BLUE, 'Contact': '#06b6d4', 'Finance': GREEN, 'Access': AMBER, 'Alert': RED }

const ENTRIES = [
  { category: 'Compliance', action: 'Identity verification completed', detail: 'Marcus Thornton — Driver Licence verified via IDMatrix', user: 'Jye San Jurjo', time: 'Today, 9:42 AM' },
  { category: 'Document', action: 'Agency Agreement signed', detail: 'Form 6 — 14 Ocean St, Cronulla — e-signed by vendor', user: 'System', time: 'Today, 9:15 AM' },
  { category: 'Finance', action: 'Commission disbursement recorded', detail: '$76,250 — 7 Park Rd, Manly — Jye San Jurjo 100%', user: 'Jye San Jurjo', time: 'Yesterday, 4:30 PM' },
  { category: 'Contact', action: 'Contact record updated', detail: 'Sandra Wilson — phone number and email updated', user: 'Sarah Mitchell', time: 'Yesterday, 2:00 PM' },
  { category: 'Access', action: 'New user login', detail: 'Sarah Mitchell — new session from 203.x.x.x (Sydney)', user: 'System', time: 'Yesterday, 8:55 AM' },
  { category: 'Compliance', action: 'Trust account reconciliation', detail: 'July 2026 — $422,500 balance confirmed, no discrepancies', user: 'Jye San Jurjo', time: '25 Jul, 5:00 PM' },
  { category: 'Document', action: 'Contract uploaded', detail: 'Contract of Sale — 42 Foreshore Cres — draft version 2', user: 'Jye San Jurjo', time: '25 Jul, 3:10 PM' },
  { category: 'Alert', action: 'Verification overdue', detail: 'Peter Nguyen — ID verification required before settlement', user: 'System', time: '24 Jul, 12:00 PM' },
  { category: 'Finance', action: 'Trust account deposit', detail: '$48,500 — deposit received from Anderson Family', user: 'System', time: '24 Jul, 11:30 AM' },
  { category: 'Document', action: 'Section 32 completed', detail: '42 Foreshore Cres, Cronulla — all disclosures signed', user: 'Jye San Jurjo', time: '20 Jul, 2:45 PM' },
  { category: 'Compliance', action: 'CPD training logged', detail: 'Jye San Jurjo — 3 hrs Anti-Money Laundering refresher', user: 'Jye San Jurjo', time: '18 Jul, 10:00 AM' },
  { category: 'Access', action: 'Permission updated', detail: 'Tom Walsh — access level changed to Agent (limited)', user: 'Jye San Jurjo', time: '15 Jul, 9:00 AM' },
]

export default function AuditPage() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Audit Log</div>
        <div style={{ fontSize: 12, color: TEXT3, marginBottom: 16 }}>Complete record of compliance-relevant actions across the platform</div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {Object.keys(CATEGORY_COLOR).map(cat => {
            const Icon = CATEGORY_ICON[cat]
            const color = CATEGORY_COLOR[cat]
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${color}10`, border: `1px solid ${color}25`, padding: '3px 10px' }}>
                <Icon size={10} color={color} />
                <span style={{ fontSize: 10, color, fontWeight: 700 }}>{cat}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {ENTRIES.map((e, i) => {
          const Icon = CATEGORY_ICON[e.category] ?? Shield
          const color = CATEGORY_COLOR[e.category] ?? PURPLE
          return (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: `1px solid ${BORDER2}`, alignItems: 'flex-start' }}>
              <div style={{ width: 30, height: 30, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Icon size={13} color={color} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>{e.action}</span>
                  <span style={{ fontSize: 10, color: TEXT3, marginLeft: 'auto', whiteSpace: 'nowrap' }}>{e.time}</span>
                </div>
                <div style={{ fontSize: 12, color: TEXT2, marginBottom: 2, lineHeight: 1.4 }}>{e.detail}</div>
                <div style={{ fontSize: 10, color: TEXT3 }}>By {e.user}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
