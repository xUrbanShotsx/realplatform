'use client'
import { useState, useEffect } from 'react'
import { Home, Brain, Globe, CheckCircle, Clock, AlertCircle, Send, RefreshCw } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['Sales', 'Rentals', 'Commercial', 'Off-Market', 'Dev Sites', 'List & Distribute']
const DETAIL_TABS = ['Overview', 'AI Intelligence', 'Comparables']

type Platform = {
  id: string; name: string; color: string; tier: string
  statuses: string[]; viewsList: number[]; leadsList: number[]
}

const PLATFORMS: Platform[] = [
  { id: 'rea',         name: 'realestate.com.au',  color: '#e34234', tier: 'Premier',  statuses: ['Live',        'Draft',       'Sold'],        viewsList: [312, 0,  1847], leadsList: [24, 0, 127] },
  { id: 'domain',      name: 'Domain.com.au',       color: '#6e2fcc', tier: 'Platinum', statuses: ['Live',        'Draft',       'Sold'],        viewsList: [187, 0,  892],  leadsList: [11, 0, 63]  },
  { id: 'homely',      name: 'Homely.com.au',        color: '#ff6b35', tier: 'Featured', statuses: ['Live',        'Not Listed',  'Sold'],        viewsList: [43,  0,  214],  leadsList: [3,  0, 18]  },
  { id: 'website',     name: 'spinellire.com.au',   color: BLUE,      tier: 'Custom',   statuses: ['Live',        'Live',        'Sold'],        viewsList: [89,  12, 341],  leadsList: [7,  1, 29]  },
  { id: 'ratemyagent', name: 'RateMyAgent',         color: '#0066cc', tier: 'Standard', statuses: ['Live',        'Not Listed',  'Sold'],        viewsList: [28,  0,  98],   leadsList: [1,  0, 7]   },
  { id: 'facebook',    name: 'Facebook Marketplace',color: '#1877f2', tier: 'Social',   statuses: ['Scheduled',   'Draft',       'Sold'],        viewsList: [0,   0,  442],  leadsList: [0,  0, 12]  },
  { id: 'instagram',   name: 'Instagram',           color: '#e3008c', tier: 'Social',   statuses: ['Draft',       'Draft',       'Sold'],        viewsList: [0,   0,  318],  leadsList: [0,  0, 8]   },
  { id: 'allhomes',    name: 'Allhomes.com.au',     color: '#2d9e5a', tier: 'Standard', statuses: ['Not Listed',  'Not Listed',  'Not Listed'],  viewsList: [0,   0,  0],    leadsList: [0,  0, 0]   },
]

type Property = {
  address: string; type: string; beds: number; baths: number; cars: number
  estimatedValue: string; lastSold: string; owner: string; ownerColor: string; yearBuilt: number
  views: number; enquiries: number; aiScore: number
  campaign: string; priceGuide: string; method: string
  comparables: { address: string; sold: string; date: string; diff: string }[]
  aiIntelligence: { label: string; val: string; color: string }[]
  aiNote: string; distributeNote: string
}

const PROPERTIES: Property[] = [
  {
    address: '42 Foreshore Cres, Cronulla', type: 'House', beds: 4, baths: 2, cars: 2,
    estimatedValue: '$3.2M–$3.6M', lastSold: '$1.85M (2016)', owner: 'Mark Spinelli', ownerColor: GREEN, yearBuilt: 1972,
    views: 312, enquiries: 24, aiScore: 88,
    campaign: 'Active — Auction 12 Aug', priceGuide: '$3.35M guide', method: 'Auction',
    distributeNote: 'realestate.com.au and Domain are performing 38% above suburb average. Facebook Marketplace is scheduled for tomorrow — consider upgrading to Premier Boost. Activating Allhomes would add ~40 extra views at minimal cost.',
    aiNote: 'Value has grown 73% since last sale in 2016. 3 comparable sales in 500m radius this quarter averaging $3.1M. Buyer demand index is 9.1/10 for this suburb/type. Recommend listing at $3.35M with auction.',
    aiIntelligence: [
      { label: 'Capital Growth (10yr)', val: '+156%',  color: GREEN  },
      { label: 'Demand Index',          val: '9.1/10', color: BLUE   },
      { label: 'Days to Sell (avg)',    val: '18 days',color: AMBER  },
      { label: 'Rental Yield (est.)',   val: '2.8%',   color: TEAL   },
      { label: 'Owner-Occupier Area',  val: '68%',    color: PURPLE },
      { label: 'DA Activity Nearby',   val: '2 DAs',  color: RED    },
    ],
    comparables: [
      { address: '38 Foreshore Cres',   sold: '$3.05M', date: 'Jun 2026', diff: '-5% vs subject' },
      { address: '55 Awaba St, Mosman', sold: '$4.85M', date: 'Jul 2026', diff: 'larger / premium' },
      { address: '9 Arcadia St',        sold: '$2.55M', date: 'Jul 2026', diff: 'smaller suburb' },
    ],
  },
  {
    address: '14 Ocean St, Cronulla', type: 'House', beds: 5, baths: 3, cars: 2,
    estimatedValue: '$2.8M–$3.2M', lastSold: '$1.42M (2014)', owner: 'Marcus Thornton', ownerColor: PURPLE, yearBuilt: 1988,
    views: 0, enquiries: 0, aiScore: 91,
    campaign: 'Pre-Market — listing Aug', priceGuide: 'TBC after appraisal', method: 'Auction (planned)',
    distributeNote: 'Not yet live on any portal. Appraisal is Tuesday — once price guide is confirmed, launch simultaneously on REA Premier + Domain Platinum for maximum opening-weekend impact. Pre-register on your website now to capture early buyer interest.',
    aiNote: 'Long-term ownership (12 years) with strong equity position ($1.38M+ gain). Pre-market showing booked with Tom Gardiner. Ideal auction candidate: 500m from beach, 5-bed scarce in this market.',
    aiIntelligence: [
      { label: 'Capital Growth (12yr)', val: '+197%',     color: GREEN  },
      { label: 'Owner Equity (est.)',   val: '$1.38M+',   color: BLUE   },
      { label: 'Seller Motivation',    val: 'Very High',  color: RED    },
      { label: 'Comparable Shortage',  val: 'Yes',        color: AMBER  },
      { label: 'Distance to Beach',    val: '480m',       color: TEAL   },
      { label: 'School Catchment',     val: 'Cronulla HS',color: PURPLE },
    ],
    comparables: [
      { address: '42 Foreshore Cres', sold: '$3.2M–$3.6M', date: 'Campaign active', diff: 'similar size / position' },
      { address: '7 Park Rd, Manly',  sold: 'Pre-market',   date: 'Aug est.',        diff: 'similar age / size' },
    ],
  },
  {
    address: '55 Awaba St, Mosman', type: 'House', beds: 5, baths: 3, cars: 3,
    estimatedValue: '$4.85M (sold)', lastSold: '$4.85M (Jul 2026)', owner: 'Anderson Family', ownerColor: TEAL, yearBuilt: 1995,
    views: 1847, enquiries: 127, aiScore: 96,
    campaign: 'Sold — Jul 2026', priceGuide: '$4.85M (achieved)', method: 'Auction',
    distributeNote: 'Campaign complete. 1,847 views and 127 enquiries across all platforms. Top performer: realestate.com.au at 127 leads. Archive this campaign and add underbidder contacts to your AI Prospecting list for future Mosman listings.',
    aiNote: 'Sold at auction July 2026 for $4.85M — $50K above reserve. 6 registered bidders, 4 active. Result demonstrates strong Mosman market. Underbidder database captured for future listings.',
    aiIntelligence: [
      { label: 'Sale Price vs. Reserve', val: '+$50K', color: GREEN  },
      { label: 'Bidders Registered',     val: '6',     color: BLUE   },
      { label: 'Portal Views',           val: '1,847', color: AMBER  },
      { label: 'Enquiries',              val: '127',   color: PURPLE },
      { label: 'Comparable Strength',    val: 'High',  color: TEAL   },
      { label: 'Area Median (Mosman)',   val: '$4.2M', color: RED    },
    ],
    comparables: [],
  },
]

const sColor = (s: string) => s === 'Live' ? GREEN : s === 'Scheduled' ? AMBER : s === 'Draft' ? BLUE : s === 'Sold' ? TEAL : TEXT3
const SIcon = (s: string) => s === 'Live' ? CheckCircle : s === 'Scheduled' ? Clock : s === 'Draft' ? AlertCircle : s === 'Sold' ? CheckCircle : Globe

function DistributeView() {
  const [sel, setSel] = useState(PROPERTIES[0])
  const idx = PROPERTIES.findIndex(p => p.address === sel.address)
  const totalLive = PLATFORMS.filter(p => p.statuses[idx] === 'Live').length
  const totalViews = PLATFORMS.reduce((a, p) => a + p.viewsList[idx], 0)
  const totalLeads = PLATFORMS.reduce((a, p) => a + p.leadsList[idx], 0)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left */}
      <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Select Property</div>
          <div style={{ fontSize: 11, color: TEXT3 }}>Manage portal distribution</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {PROPERTIES.map((p, i) => {
            const live = PLATFORMS.filter(pl => pl.statuses[i] === 'Live').length
            const active = sel.address === p.address
            return (
              <div key={i} onClick={() => setSel(p)} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: active ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${active ? GREEN : 'transparent'}` }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</div>
                <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginBottom: 6 }}>{p.estimatedValue}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 9, background: `${GREEN}15`, color: GREEN, padding: '2px 7px', fontWeight: 700 }}>{live}/{PLATFORMS.length} platforms</span>
                  <span style={{ fontSize: 9, color: TEXT3 }}>{p.campaign.split('—')[0].trim()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{sel.address}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: TEXT3 }}>{sel.method} · {sel.priceGuide}</span>
              <span style={{ fontSize: 9, color: AMBER, background: `${AMBER}15`, padding: '2px 8px', fontWeight: 700 }}>{sel.campaign}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
              <RefreshCw size={11} /> Sync All
            </button>
            <button style={{ background: GREEN, border: 'none', color: '#fff', padding: '7px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Send size={11} /> Publish to All
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Platforms Live',  val: `${totalLive}/${PLATFORMS.length}`, color: GREEN  },
            { label: 'Total Views',     val: totalViews.toLocaleString(),         color: BLUE   },
            { label: 'Total Enquiries', val: `${totalLeads}`,                     color: AMBER  },
            { label: 'AI Score',        val: `${sel.aiScore}`,                    color: PURPLE },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: '-0.04em', marginBottom: 3 }}>{m.val}</div>
              <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Brain size={12} color={PINK} />
            <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI DISTRIBUTION INTELLIGENCE</span>
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: TEXT2, lineHeight: 1.8 }}>{sel.distributeNote}</p>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Portal Distribution</span>
            <span style={{ fontSize: 10, color: TEXT3 }}>Last synced 4 min ago</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Platform', 'Tier', 'Status', 'Views', 'Leads', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLATFORMS.map((pl, i) => {
                const status = pl.statuses[idx]
                const views = pl.viewsList[idx]
                const leads = pl.leadsList[idx]
                const sc = sColor(status)
                const SI = SIcon(status)
                return (
                  <tr key={i} style={{ borderBottom: i < PLATFORMS.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, background: pl.color, borderRadius: 2 }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: TEXT }}>{pl.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ fontSize: 10, color: TEXT3, background: 'rgba(0,0,0,0.04)', padding: '2px 8px' }}>{pl.tier}</span>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <SI size={11} color={sc} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: sc }}>{status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: views > 0 ? TEXT : TEXT3, fontWeight: views > 0 ? 700 : 400 }}>
                      {views > 0 ? views.toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: leads > 0 ? BLUE : TEXT3, fontWeight: leads > 0 ? 700 : 400 }}>
                      {leads > 0 ? leads : '—'}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {status === 'Not Listed' && <button style={{ background: GREEN, border: 'none', color: '#fff', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Publish</button>}
                        {status === 'Draft' && <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Go Live</button>}
                        {status === 'Scheduled' && <button style={{ background: AMBER, border: 'none', color: '#fff', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Edit Schedule</button>}
                        {(status === 'Live' || status === 'Sold') && <button style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '4px 10px', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>View</button>}
                        {status === 'Live' && <button style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '4px 10px', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  const [tab, setTab] = useState(0)
  const [sel, setSel] = useState(PROPERTIES[0])
  const [detailTab, setDetailTab] = useState(0)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    const map: Record<string, number> = { rentals: 1, commercial: 2, 'off-market': 3, devsites: 4, distribute: 5 }
    if (t && map[t] !== undefined) setTab(map[t])
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${i === 5 ? GREEN : BLUE}` : '2px solid transparent', color: tab === i ? (i === 5 ? GREEN : TEXT) : TEXT3, padding: '12px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {tab === 5 ? (
          <DistributeView />
        ) : tab === 0 ? (
          <>
            <div style={{ width: 300, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 11, color: TEXT3 }}>3 properties in your database</div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {PROPERTIES.map((p, i) => (
                  <div key={i} onClick={() => { setSel(p); setDetailTab(0) }} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.address === p.address ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${sel.address === p.address ? BLUE : 'transparent'}` }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</div>
                    <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginBottom: 4 }}>{p.estimatedValue}</div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: TEXT3 }}>{p.beds}b {p.baths}br {p.cars}c</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: p.ownerColor }}>{p.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: TEXT, marginBottom: 6 }}>{sel.address}</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: TEXT3 }}>{sel.type} · {sel.beds}b {sel.baths}br {sel.cars}c · Built {sel.yearBuilt}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: BLUE, background: `${BLUE}15`, padding: '2px 8px', fontWeight: 700 }}>AI Score {sel.aiScore}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {DETAIL_TABS.map((t, i) => (
                    <button key={t} onClick={() => setDetailTab(i)} style={{ padding: '4px 12px', background: detailTab === i ? `${PINK}15` : 'rgba(0,0,0,0.03)', border: `1px solid ${detailTab === i ? `${PINK}30` : BORDER}`, color: detailTab === i ? PINK : TEXT3, fontSize: 11, fontWeight: detailTab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                {detailTab === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                      {[
                        { label: 'Estimated Value', val: sel.estimatedValue, color: GREEN  },
                        { label: 'Last Sold',        val: sel.lastSold,       color: BLUE   },
                        { label: 'Portal Views',     val: `${sel.views}`,     color: AMBER  },
                        { label: 'Enquiries',        val: `${sel.enquiries}`, color: PURPLE },
                      ].map(m => (
                        <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: m.color, letterSpacing: '-0.03em', marginBottom: 3 }}>{m.val}</div>
                          <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14 }}>
                      <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>OWNER</div>
                      <span style={{ fontSize: 13, color: sel.ownerColor, fontWeight: 700 }}>{sel.owner}</span>
                    </div>
                  </div>
                )}

                {detailTab === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                      {sel.aiIntelligence.map(m => (
                        <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: m.color, letterSpacing: '-0.03em', marginBottom: 3 }}>{m.val}</div>
                          <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Brain size={13} color={PINK} />
                        <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI PROPERTY INTELLIGENCE</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.8 }}>{sel.aiNote}</p>
                    </div>
                  </div>
                )}

                {detailTab === 2 && (
                  <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Comparable Sales</div>
                    {sel.comparables.length === 0 ? (
                      <div style={{ padding: '20px 16px', fontSize: 12, color: TEXT3 }}>No comparable sales recorded yet.</div>
                    ) : sel.comparables.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '11px 16px', borderBottom: i < sel.comparables.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{c.address}</div>
                          <div style={{ fontSize: 10, color: TEXT3 }}>{c.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: GREEN }}>{c.sold}</div>
                          <div style={{ fontSize: 10, color: TEXT3 }}>{c.diff}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <Home size={36} color={TEXT3} />
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{TABS[tab]} properties</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>No {TABS[tab].toLowerCase()} properties in your database yet</div>
          </div>
        )}
      </div>
    </div>
  )
}
