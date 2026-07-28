'use client'
import { useState } from 'react'
import { TrendingUp, Eye, MousePointer, DollarSign, Plus } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const GREEN = '#10b981'; const AMBER = '#f59e0b'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['Active', 'Completed', 'All Campaigns']

const PLATFORMS = [
  { name: 'realestate.com.au', color: '#e34234', spend: 4200, impressions: '84,200', clicks: 1247, leads: 38, cpl: '$111' },
  { name: 'Domain.com.au', color: '#6e2fcc', spend: 2800, impressions: '51,400', clicks: 890, leads: 24, cpl: '$117' },
  { name: 'Facebook & Instagram', color: '#1877f2', spend: 1100, impressions: '142,000', clicks: 2340, leads: 19, cpl: '$58' },
  { name: 'Google Ads', color: '#4285f4', spend: 650, impressions: '38,600', clicks: 410, leads: 11, cpl: '$59' },
  { name: 'Allhomes.com.au', color: '#2d9e5a', spend: 320, impressions: '12,800', clicks: 180, leads: 6, cpl: '$53' },
]

const CAMPAIGNS = [
  { name: '42 Foreshore Cres — Premier Launch', platforms: ['REA', 'Domain', 'Social'], budget: '$3,200', spent: '$2,100', leads: 24, status: 'active', listing: '42 Foreshore Cres, Cronulla' },
  { name: '14 Ocean St — Pre-Launch Social', platforms: ['Social'], budget: '$800', spent: '$420', leads: 11, status: 'active', listing: '14 Ocean St, Cronulla' },
  { name: '9 Arcadia St — Full Campaign', platforms: ['REA', 'Domain', 'Google'], budget: '$4,500', spent: '$4,500', leads: 38, status: 'completed', listing: 'SOLD $2.55M' },
  { name: 'Brand Awareness — Cronulla Q3', platforms: ['Social', 'Google'], budget: '$1,200', spent: '$760', leads: 15, status: 'active', listing: 'Agency brand' },
]

export default function AdvertisingPage() {
  const [tab, setTab] = useState(0)
  const totalSpend = PLATFORMS.reduce((s, p) => s + p.spend, 0)
  const totalLeads = PLATFORMS.reduce((s, p) => s + p.leads, 0)

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Advertising</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Ad spend and performance across all platforms</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: PINK, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={12} /> New Campaign
          </button>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, icon: DollarSign, color: PINK },
            { label: 'Total Leads', value: totalLeads, icon: MousePointer, color: BLUE },
            { label: 'Avg CPL', value: '$95', icon: TrendingUp, color: GREEN },
            { label: 'Impressions', value: '329K', icon: Eye, color: AMBER },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={color} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 10, color: TEXT3, marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform breakdown */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Platform Breakdown — This Month</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Platform', 'Spend', 'Impressions', 'Clicks', 'Leads', 'CPL'].map(h => (
                  <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLATFORMS.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${BORDER2}` }}>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, background: p.color, borderRadius: '50%', flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: TEXT, fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 12.5, fontWeight: 700, color: TEXT }}>${p.spend.toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT2 }}>{p.impressions}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT2 }}>{p.clicks.toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12.5, fontWeight: 700, color: GREEN }}>{p.leads}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT2 }}>{p.cpl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Campaigns */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => {}} style={{ background: 'none', border: 'none', borderBottom: i === 0 ? `2px solid ${PINK}` : '2px solid transparent', color: i === 0 ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: i === 0 ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CAMPAIGNS.filter(c => c.status === 'active').map((c, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{c.name}</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${GREEN}12`, padding: '2px 8px' }}>
                <div style={{ width: 5, height: 5, background: GREEN, borderRadius: '50%' }} />
                <span style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>ACTIVE</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: TEXT3, marginBottom: 8 }}>{c.listing}</div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div><div style={{ fontSize: 10, color: TEXT3 }}>Budget</div><div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{c.budget}</div></div>
              <div><div style={{ fontSize: 10, color: TEXT3 }}>Spent</div><div style={{ fontSize: 12, fontWeight: 700, color: AMBER }}>{c.spent}</div></div>
              <div><div style={{ fontSize: 10, color: TEXT3 }}>Leads</div><div style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>{c.leads}</div></div>
              <div><div style={{ fontSize: 10, color: TEXT3 }}>Platforms</div><div style={{ fontSize: 11, color: TEXT2 }}>{c.platforms.join(', ')}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
