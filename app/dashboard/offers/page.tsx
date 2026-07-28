'use client'
import { useState } from 'react'
import { DollarSign, CheckCircle, Clock, XCircle, TrendingUp, Plus } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['All', 'Active', 'Accepted', 'Declined']

const OFFERS = [
  { address: '42 Foreshore Cres, Cronulla', buyer: 'Tom & Lucy Gardiner', agent: 'Jye San Jurjo', amount: 2_850_000, asking: 2_950_000, date: '25 Jul 2026', expiry: '27 Jul 2026', status: 'active', finance: true, building: true, notes: 'Subject to finance — 14 day condition' },
  { address: '42 Foreshore Cres, Cronulla', buyer: 'Anderson Family', agent: 'Jye San Jurjo', amount: 2_780_000, asking: 2_950_000, date: '24 Jul 2026', expiry: '26 Jul 2026', status: 'declined', finance: true, building: false, notes: 'Declined — below vendor reserve' },
  { address: '14 Ocean St, Cronulla', buyer: 'James Wu', agent: 'Sarah Mitchell', amount: 1_650_000, asking: 1_700_000, date: '22 Jul 2026', expiry: '29 Jul 2026', status: 'active', finance: false, building: true, notes: 'Cash offer — subject to building inspection' },
  { address: '8 Kurnell Rd, Cronulla', buyer: 'Raj Patel', agent: 'Jye San Jurjo', amount: 1_220_000, asking: 1_250_000, date: '18 Jul 2026', expiry: '—', status: 'accepted', finance: true, building: true, notes: 'Accepted — exchange due 1 Aug 2026' },
  { address: '22 Kingsway, Cronulla', buyer: 'Lin Zhao', agent: 'Tom Walsh', amount: 3_100_000, asking: 3_200_000, date: '15 Jul 2026', expiry: '—', status: 'accepted', finance: false, building: false, notes: 'Cash unconditional — exchange complete' },
]

const S: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  active:   { color: BLUE,   icon: Clock,        label: 'Active' },
  accepted: { color: GREEN,  icon: CheckCircle,  label: 'Accepted' },
  declined: { color: RED,    icon: XCircle,      label: 'Declined' },
}

function fmt(n: number) { return '$' + n.toLocaleString() }
function pct(offer: number, ask: number) { return Math.round((offer / ask) * 100) }

export default function OffersPage() {
  const [tab, setTab] = useState(0)
  const FILTER_MAP: Record<string, string> = { Active: 'active', Accepted: 'accepted', Declined: 'declined' }
  const filtered = tab === 0 ? OFFERS : OFFERS.filter(o => o.status === FILTER_MAP[TABS[tab]])

  const active = OFFERS.filter(o => o.status === 'active').length
  const accepted = OFFERS.filter(o => o.status === 'accepted').length
  const totalAccepted = OFFERS.filter(o => o.status === 'accepted').reduce((s, o) => s + o.amount, 0)

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Offers</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Track all offers received across active listings</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BLUE, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={12} /> Log Offer
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Active Offers', value: active, icon: Clock, color: BLUE },
            { label: 'Accepted', value: accepted, icon: CheckCircle, color: GREEN },
            { label: 'Accepted Volume', value: fmt(totalAccepted), icon: TrendingUp, color: AMBER },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={color} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 10, color: TEXT3, marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${AMBER}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((o, i) => {
          const cfg = S[o.status]
          const Icon = cfg.icon
          const pctVal = pct(o.amount, o.asking)
          return (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{o.address}</div>
                  <div style={{ fontSize: 11, color: TEXT3 }}>{o.buyer} · via {o.agent}</div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${cfg.color}12`, padding: '3px 10px', flexShrink: 0, marginLeft: 12 }}>
                  <Icon size={10} color={cfg.color} />
                  <span style={{ fontSize: 10, color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 8, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>Offer</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: o.status === 'accepted' ? GREEN : TEXT, letterSpacing: '-0.03em' }}>{fmt(o.amount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>Asking</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT2 }}>{fmt(o.asking)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>% of Ask</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: pctVal >= 97 ? GREEN : pctVal >= 94 ? AMBER : RED }}>{pctVal}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>Submitted</div>
                  <div style={{ fontSize: 12, color: TEXT2 }}>{o.date}</div>
                </div>
                {o.expiry !== '—' && (
                  <div>
                    <div style={{ fontSize: 10, color: TEXT3 }}>Expires</div>
                    <div style={{ fontSize: 12, color: AMBER, fontWeight: 700 }}>{o.expiry}</div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {o.finance && <span style={{ fontSize: 10, color: AMBER, background: `${AMBER}12`, padding: '1px 7px', fontWeight: 700 }}>Finance</span>}
                {o.building && <span style={{ fontSize: 10, color: BLUE, background: `${BLUE}10`, padding: '1px 7px', fontWeight: 700 }}>Building</span>}
                <span style={{ fontSize: 11, color: TEXT3 }}>{o.notes}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
