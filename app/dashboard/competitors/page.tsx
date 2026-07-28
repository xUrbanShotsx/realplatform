'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Home, Star, Eye, BarChart2, AlertCircle, ChevronUp, ChevronDown, Globe, Minus } from 'lucide-react'

const BG_LIST   = '#232323'
const BG_DETAIL = '#2a2a2a'
const BG_SEL    = 'rgba(227,0,140,0.09)'
const BG_HOVER  = 'rgba(0,0,0,0.04)'
const BORDER    = 'rgba(255,255,255,0.08)'
const PINK      = '#e3008c'
const PINK_SOFT = 'rgba(227,0,140,0.15)'
const TEXT      = '#e8e8f0'
const TEXT2     = '#9090a8'
const TEXT3     = '#505060'
const SUCCESS   = '#107c10'
const WARN      = '#ca5010'
const DANGER    = '#d13438'
const BLUE      = '#0078d4'

const AV = ['#0078d4','#8764b8','#038387','#107c10','#d83b01','#c239b3','#ca5010','#0099bc']
function avColor(name: string) { return AV[name.charCodeAt(0) % AV.length] }

interface Listing {
  address: string
  price: string
  daysLive: number
  change?: string
}

interface CompetitorItem {
  id: number
  name: string
  suburb: string
  activeListings: number
  avgDOM: number
  avgSalePrice: string
  clearance: string
  googleRating: number
  googleCount: number
  rmaRating: number
  socialScore: string
  recentActivity: string
  activityType: 'new' | 'reduction' | 'withdrawn' | 'sold'
  listings: Listing[]
  adSpend: string
  marketShare: string
  strengths: string[]
  weaknesses: string[]
  counter: string
}

const ITEMS: CompetitorItem[] = [
  {
    id: 1,
    name: 'Ray White Cronulla',
    suburb: 'Cronulla',
    activeListings: 34,
    avgDOM: 22,
    avgSalePrice: '$1.84M',
    clearance: '68%',
    googleRating: 4.2,
    googleCount: 188,
    rmaRating: 4.4,
    socialScore: 'High',
    recentActivity: '3 new listings this week',
    activityType: 'new',
    adSpend: 'Est. $8,200/mo',
    marketShare: '28%',
    listings: [
      { address: '22 Kingsway, Cronulla', price: '$2.4M', daysLive: 8 },
      { address: '5 Mowbray Rd, Cronulla', price: '$1.75M', daysLive: 14 },
      { address: '88 Gerrale St, Cronulla', price: '$1.2M', daysLive: 21, change: 'Price reduced $50K' },
      { address: '14 Tonkin St, Cronulla', price: '$3.1M', daysLive: 6 },
      { address: '9 Gilshenan Ave, Cronulla', price: '$895K', daysLive: 38, change: 'Withdrawn' },
    ],
    strengths: ['Strong brand recognition', 'High social media engagement', 'Competitive auction game'],
    weaknesses: ['High average days on market', 'Several recent price reductions', 'Low personalisation'],
    counter: 'Target their sellers directly — their avg DOM of 22 days is 16% above ours. Position around speed-to-sale and AI-driven pricing to attract vendors frustrated with slow campaigns.',
  },
  {
    id: 2,
    name: 'LJ Hooker Cronulla',
    suburb: 'Cronulla & Miranda',
    activeListings: 19,
    avgDOM: 28,
    avgSalePrice: '$1.61M',
    clearance: '61%',
    googleRating: 3.9,
    googleCount: 122,
    rmaRating: 4.0,
    socialScore: 'Medium',
    recentActivity: '2 price reductions this week',
    activityType: 'reduction',
    adSpend: 'Est. $4,100/mo',
    marketShare: '15%',
    listings: [
      { address: '12 Cronulla St, Cronulla', price: '$1.35M', daysLive: 33, change: 'Price reduced $30K' },
      { address: '45 Gerrale St, Cronulla', price: '$780K', daysLive: 19 },
      { address: '3 Beachcomber Ave, Cronulla', price: '$2.1M', daysLive: 41, change: 'Price reduced $80K' },
      { address: '78 Oak Rd, Miranda', price: '$1.1M', daysLive: 12 },
    ],
    strengths: ['Legacy brand loyalty', 'Strong referral base', 'Miranda coverage'],
    weaknesses: ['Poor clearance rate', 'High DOM', 'Dated marketing materials', 'Low social presence'],
    counter: 'LJ Hooker sellers are frustrated — 2 price reductions this week indicates overpriced appraisals. Our AI pricing tool can demonstrate realistic vendor price expectations upfront.',
  },
  {
    id: 3,
    name: 'McGrath Sutherland',
    suburb: 'Sutherland Shire',
    activeListings: 28,
    avgDOM: 17,
    avgSalePrice: '$2.1M',
    clearance: '76%',
    googleRating: 4.6,
    googleCount: 214,
    rmaRating: 4.7,
    socialScore: 'Very High',
    recentActivity: '5 properties sold this week',
    activityType: 'sold',
    adSpend: 'Est. $12,400/mo',
    marketShare: '23%',
    listings: [
      { address: '8 National Pk Rd, Bundeena', price: '$2.8M', daysLive: 4 },
      { address: '33 Hothersal St, Kirrawee', price: '$1.65M', daysLive: 11 },
      { address: '19 Newton Rd, Sutherland', price: '$1.2M', daysLive: 7 },
      { address: '102 Flora St, Kirrawee', price: '$1.45M', daysLive: 9 },
      { address: '44 Acacia Rd, Caringbah', price: '$1.9M', daysLive: 3 },
    ],
    strengths: ['Best clearance rate in market', 'Premium brand positioning', 'High ad spend', 'Excellent reviews'],
    weaknesses: ['Higher commission rates', 'Less local suburb presence', 'Corporate feel'],
    counter: 'McGrath is the benchmark — but they charge 2.8% vs. our 2.2%. Position our AI tools and personal service as equal quality at better value. Target their former clients who found them impersonal.',
  },
  {
    id: 4,
    name: 'Century 21 Miranda',
    suburb: 'Miranda & Caringbah',
    activeListings: 12,
    avgDOM: 35,
    avgSalePrice: '$1.38M',
    clearance: '54%',
    googleRating: 3.6,
    googleCount: 67,
    rmaRating: 3.8,
    socialScore: 'Low',
    recentActivity: '1 listing withdrawn this week',
    activityType: 'withdrawn',
    adSpend: 'Est. $2,200/mo',
    marketShare: '8%',
    listings: [
      { address: '7 Kiora Rd, Miranda', price: '$1.05M', daysLive: 52, change: 'Withdrawn' },
      { address: '22 Waratah Rd, Caringbah', price: '$1.2M', daysLive: 29 },
      { address: '3 Gymea Bay Rd, Gymea', price: '$1.55M', daysLive: 18 },
    ],
    strengths: ['Lower price point coverage', 'Long-term local presence'],
    weaknesses: ['Very high DOM', 'Poor clearance rate', 'Low marketing spend', 'Outdated branding', 'Low review score'],
    counter: 'Easy competitive positioning — their DOM is 35 days vs. ours at 19. Direct mail and digital retargeting to their current vendors showing our speed and clearance stats will convert frustrated sellers.',
  },
  {
    id: 5,
    name: 'Raine & Horne Sutherland',
    suburb: 'Sutherland',
    activeListings: 16,
    avgDOM: 24,
    avgSalePrice: '$1.55M',
    clearance: '63%',
    googleRating: 4.1,
    googleCount: 98,
    rmaRating: 4.2,
    socialScore: 'Medium',
    recentActivity: '2 new listings this week',
    activityType: 'new',
    adSpend: 'Est. $3,800/mo',
    marketShare: '12%',
    listings: [
      { address: '14 Eton St, Sutherland', price: '$1.25M', daysLive: 15 },
      { address: '66 Linden St, Sutherland', price: '$1.6M', daysLive: 9 },
      { address: '29 Acacia Ave, Sutherland', price: '$1.35M', daysLive: 31 },
    ],
    strengths: ['Solid mid-market coverage', 'Established vendor database', 'Decent review profile'],
    weaknesses: ['Average marketing', 'No AI tools', 'Limited social presence'],
    counter: 'Target Sutherland vendors with our suburb-specific performance data. R&H has decent coverage but no differentiator. Our AI listing optimiser and Seller Intent tools are compelling to data-driven vendors.',
  },
]

const ACTIVITY_COLOR: Record<string, string> = {
  new: BLUE,
  reduction: WARN,
  withdrawn: DANGER,
  sold: SUCCESS,
}

export default function CompetitorsPage() {
  const [selected, setSelected] = useState(ITEMS[0])
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* List Panel */}
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>Competitor Intelligence</span>
          <div style={{ fontSize: 12, color: TEXT3, marginTop: 3 }}>Updated 6 hours ago</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ITEMS.map(item => {
            const active = selected.id === item.id
            return (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: '10px 14px',
                  borderBottom: `1px solid ${BORDER}`,
                  background: active ? BG_SEL : hovered === item.id ? BG_HOVER : 'transparent',
                  borderLeft: active ? `2px solid ${PINK}` : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 30, height: 30, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>
                    {item.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: TEXT, fontWeight: 600, marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: TEXT3, marginBottom: 4 }}>{item.suburb} · {item.marketShare} market share</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: TEXT2 }}>{item.activeListings} listings</span>
                      <span style={{ width: 3, height: 3, background: TEXT3, borderRadius: 9999 }} />
                      <span style={{ fontSize: 11, color: ACTIVITY_COLOR[item.activityType] }}>{item.recentActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Pane */}
      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, background: avColor(selected.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {selected.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
            </div>
            <div>
              <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, margin: 0 }}>{selected.name}</h2>
              <span style={{ fontSize: 13, color: TEXT2 }}>{selected.suburb} · {selected.marketShare} market share · {selected.adSpend}</span>
            </div>
          </div>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {[
              { label: 'Active Listings', val: selected.activeListings },
              { label: 'Avg DOM', val: `${selected.avgDOM}d` },
              { label: 'Avg Sale Price', val: selected.avgSalePrice },
              { label: 'Clearance Rate', val: selected.clearance },
              { label: 'Google Rating', val: `★ ${selected.googleRating}` },
            ].map(k => (
              <div key={k.label} style={{ background: 'rgba(0,0,0,0.03)', border: `1px solid ${BORDER}`, padding: '8px 10px' }}>
                <div style={{ fontSize: 11, color: TEXT3, marginBottom: 3 }}>{k.label}</div>
                <div style={{ fontSize: 15, color: TEXT, fontWeight: 700 }}>{k.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Active listings */}
          <div>
            <div style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Active Listings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {selected.listings.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '8px 12px', gap: 12 }}>
                  <Home size={12} color={TEXT3} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: TEXT2 }}>{l.address}</span>
                  <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{l.price}</span>
                  <span style={{ fontSize: 11, color: TEXT3 }}>{l.daysLive}d</span>
                  {l.change && <span style={{ fontSize: 11, color: l.change.includes('Withdrawn') ? DANGER : WARN, fontWeight: 600 }}>{l.change}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Strengths / Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: 14 }}>
              <div style={{ fontSize: 11, color: SUCCESS, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Strengths</div>
              {selected.strengths.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5, alignItems: 'flex-start' }}>
                  <ChevronUp size={12} color={SUCCESS} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: TEXT2 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: 14 }}>
              <div style={{ fontSize: 11, color: DANGER, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Weaknesses</div>
              {selected.weaknesses.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5, alignItems: 'flex-start' }}>
                  <ChevronDown size={12} color={DANGER} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: TEXT2 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Counter strategy */}
          <div style={{ background: PINK_SOFT, border: `1px solid rgba(227,0,140,0.2)`, padding: 14 }}>
            <div style={{ fontSize: 11, color: PINK, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>AI Counter Strategy</div>
            <p style={{ fontSize: 13, color: TEXT2, margin: 0, lineHeight: 1.6 }}>{selected.counter}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
