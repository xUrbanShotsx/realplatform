'use client'
import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, Building2, Eye, Brain } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['Sales & Auctions', 'Council DAs', 'Competitor Monitor', 'AI Market Reports']

const RECENT_SALES = [
  { address: '9 Arcadia St, Bondi Beach',      type: 'House · 4b2b', sold: '$2.55M', dom: 22, method: 'Auction', date: '18 Jul' },
  { address: '23 Foreshore Pde, Cronulla',      type: 'House · 3b2b', sold: '$2.21M', dom: 31, method: 'Auction', date: '12 Jul' },
  { address: '14 Warrigal Rd, Sutherland',      type: 'House · 4b2b', sold: '$1.84M', dom: 18, method: 'Private', date: '5 Jul'  },
  { address: '41 Garnet Rd, Gymea Bay',         type: 'House · 4b3b', sold: '$2.08M', dom: 14, method: 'Auction', date: '28 Jun' },
  { address: '7 Brindabella Ave, Caringbah',    type: 'House · 3b1b', sold: '$1.67M', dom: 42, method: 'Private', date: '21 Jun' },
  { address: '55 The Esplanade, Miranda',       type: 'Unit · 2b2b',  sold: '$1.12M', dom: 26, method: 'Auction', date: '14 Jun' },
]

const DAS = [
  { address: '14 Kingsway, Cronulla',         type: '6-unit development',  lodged: '18 Jul', status: 'Under Assessment', impact: 'HIGH'   },
  { address: '88-90 Cronulla St, Cronulla',   type: 'Mixed-use 12 units',  lodged: '11 Jul', status: 'On Exhibition',    impact: 'HIGH'   },
  { address: '3-5 Wilbar Ave, Cronulla',      type: '4 townhouses',        lodged: '2 Jul',  status: 'Approved',        impact: 'MEDIUM' },
  { address: '22 Beachcomber Ave, Kurnell',   type: 'Dual occupancy',      lodged: '29 Jun', status: 'Under Assessment', impact: 'LOW'    },
]

const COMPETITORS = [
  { name: 'Ray White Cronulla',  listings: 18, avgDom: 24, clearance: '71%', avgPrice: '$1.92M', rating: 4.2, trend: 'down'   },
  { name: 'LJ Hooker Cronulla',  listings: 12, avgDom: 31, clearance: '63%', avgPrice: '$1.74M', rating: 3.9, trend: 'stable' },
  { name: 'McGrath Cronulla',    listings: 9,  avgDom: 28, clearance: '67%', avgPrice: '$2.14M', rating: 4.1, trend: 'up'     },
  { name: 'Spinelli RE (us)',    listings: 8,  avgDom: 19, clearance: '74%', avgPrice: '$2.38M', rating: 4.8, trend: 'up'     },
]

const CLEARANCE_DATA = [65, 62, 68, 71, 67, 73, 74, 71, 76, 72, 69, 74]

export default function MarketPage() {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    const map: Record<string, number> = { das: 1, competitors: 2, reports: 3 }
    if (t && map[t] !== undefined) setTab(map[t])
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${BLUE}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '12px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {tab === 0 && (
          <>
            {/* KPI tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Clearance Rate', val: '74%', change: '+3% vs last month', color: GREEN   },
                { label: 'Median Sale',    val: '$2.38M',change: '+11% vs last year', color: BLUE   },
                { label: 'Avg DOM',        val: '19 days', change: '-4 days vs Q1',    color: AMBER  },
                { label: 'Total Sales',    val: '47', change: 'Past 30 days',         color: PURPLE },
              ].map(k => (
                <div key={k.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: k.color, letterSpacing: '-0.04em', marginBottom: 3 }}>{k.val}</div>
                  <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700 }}>{k.label}</div>
                  <div style={{ fontSize: 10, color: k.color, marginTop: 2 }}>{k.change}</div>
                </div>
              ))}
            </div>

            {/* Clearance rate chart */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <TrendingUp size={13} color={GREEN} />
                <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Clearance Rate — 12 Weeks</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: GREEN, fontWeight: 700 }}>74% this week</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
                {CLEARANCE_DATA.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', background: i === CLEARANCE_DATA.length - 1 ? GREEN : `${BLUE}60`, height: `${v}%`, minWidth: 8 }} />
                    <span style={{ fontSize: 9, color: TEXT3, whiteSpace: 'nowrap' }}>W{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent sales */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Recent Sales — Local Area</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {['Address', 'Type', 'Sale Price', 'DOM', 'Method', 'Date'].map(h => (
                      <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_SALES.map((s, i) => (
                    <tr key={i} style={{ borderBottom: i < RECENT_SALES.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT, fontWeight: 600 }}>{s.address}</td>
                      <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT3 }}>{s.type}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: GREEN, fontWeight: 700 }}>{s.sold}</td>
                      <td style={{ padding: '10px 16px', fontSize: 11, color: s.dom < 25 ? GREEN : s.dom < 35 ? AMBER : RED }}>{s.dom}d</td>
                      <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT2 }}>{s.method}</td>
                      <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT3 }}>{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 1 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 size={13} color={AMBER} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Council Development Applications</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: AMBER, fontWeight: 700 }}>4 new this month</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['Address', 'Development Type', 'Lodged', 'Status', 'Impact'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAS.map((d, i) => (
                  <tr key={i} style={{ borderBottom: i < DAS.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT, fontWeight: 600 }}>{d.address}</td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT2 }}>{d.type}</td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT3 }}>{d.lodged}</td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: d.status === 'Approved' ? GREEN : BLUE }}>{d.status}</td>
                    <td style={{ padding: '10px 16px' }}><span style={{ fontSize: 9, color: d.impact === 'HIGH' ? RED : d.impact === 'MEDIUM' ? AMBER : TEXT3, background: `${d.impact === 'HIGH' ? RED : d.impact === 'MEDIUM' ? AMBER : TEXT3}15`, padding: '2px 7px', fontWeight: 700 }}>{d.impact}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 2 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Eye size={13} color={RED} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Competitor Monitor</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3 }}>Updated today</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['Agency', 'Active Listings', 'Avg DOM', 'Clearance', 'Avg Sale Price', 'Rating', 'Trend'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c, i) => (
                  <tr key={i} style={{ borderBottom: i < COMPETITORS.length - 1 ? `1px solid ${BORDER2}` : 'none', background: c.name.includes('us') ? 'rgba(67,97,238,0.05)' : 'transparent' }}>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: c.name.includes('us') ? BLUE : TEXT, fontWeight: c.name.includes('us') ? 700 : 400 }}>{c.name}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT2 }}>{c.listings}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: c.avgDom < 22 ? GREEN : TEXT2 }}>{c.avgDom}d</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: parseInt(c.clearance) > 70 ? GREEN : TEXT2 }}>{c.clearance}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT2 }}>{c.avgPrice}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: parseFloat(`${c.rating}`) > 4.5 ? GREEN : TEXT2 }}>★ {c.rating}</td>
                    <td style={{ padding: '10px 16px' }}><span style={{ fontSize: 10, color: c.trend === 'up' ? GREEN : c.trend === 'down' ? RED : AMBER }}>{c.trend === 'up' ? '↑ Growing' : c.trend === 'down' ? '↓ Declining' : '→ Stable'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 3 && (
          <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Brain size={16} color={PINK} />
              <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>AI Market Report — Cronulla & Surrounds · July 2026</span>
            </div>
            <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.9, margin: '0 0 14px' }}>
              <strong style={{ color: TEXT }}>Market Summary:</strong> Cronulla's residential market continues to outperform Greater Sydney, with a 74% clearance rate in July — up from 71% in June. Median house prices reached $2.38M, a 11% year-on-year increase driven by strong interstate migration and limited coastal stock.
            </p>
            <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.9, margin: '0 0 14px' }}>
              <strong style={{ color: TEXT }}>Buyer Demand:</strong> Demand is being driven by upsizers from the inner west and first-home buyers priced out of the eastern suburbs. Family homes 4+ bedrooms within 800m of the beach are receiving 4–6 registered bidders at auction. Units are slower, averaging 31 days on market.
            </p>
            <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.9, margin: 0 }}>
              <strong style={{ color: TEXT }}>Opportunity:</strong> Long-term owners (10+ years) in Cronulla, Kurnell, and Gymea Bay represent your highest-value prospecting segment. 19 properties in your database match this profile with estimated equity above $1M. Recommend prioritising AI call list campaigns targeting this segment over the next 60 days.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
