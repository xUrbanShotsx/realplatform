'use client'

import { useState } from 'react'
import {
  BarChart2, MoreHorizontal, ArrowLeft, ArrowRight,
  TrendingUp, DollarSign, Users, Home, Brain, Zap,
} from 'lucide-react'

const BG_LIST   = '#232323'
const BG_DETAIL = '#2a2a2a'
const BG_SEL    = 'rgba(227,0,140,0.09)'
const BG_HOVER  = 'rgba(0,0,0,0.04)'
const BORDER    = 'rgba(255,255,255,0.08)'
const PINK      = '#e3008c'
const TEXT      = '#e8e8f0'
const TEXT2     = '#9090a8'
const TEXT3     = '#505060'
const SUCCESS   = '#107c10'
const WARN      = '#ca5010'
const DANGER    = '#d13438'
const BLUE      = '#0078d4'
const PURPLE    = '#8764b8'
const TEAL      = '#038387'

const CHANNELS = [
  {
    id: 1, channel: 'Facebook Ads', spend: '$3,200', leadsGen: 28, costPerLead: '$114', listingsProduced: 3,
    appraisals: 8, gci: '$54,600', costPerListing: '$1,067',
    assets: [
      { name: 'Seller Intent Ad — Bondi Beach', leads: 9, cost: '$980', gci: '$18,200' },
      { name: 'Suburb Report Ad — Paddington', leads: 7, cost: '$840', gci: '$16,400' },
      { name: 'First Home Buyer Ad — Neutral Bay', leads: 12, cost: '$1,380', gci: '$20,000' },
    ],
    aiInsight: 'Facebook Ads is your #1 lead generator by volume. The Bondi Beach seller intent ad has a 9× GCI return. Scale this campaign immediately — it\'s the highest-performing asset in the portfolio.',
  },
  {
    id: 2, channel: 'Suburb Page (SEO)', spend: '$880', leadsGen: 14, costPerLead: '$63', listingsProduced: 2,
    appraisals: 5, gci: '$36,400', costPerListing: '$440',
    assets: [
      { name: 'Bondi Beach suburb page — organic', leads: 6, cost: '$320', gci: '$18,200' },
      { name: 'Paddington suburb page — organic', leads: 5, cost: '$280', gci: '$18,200' },
      { name: 'Mosman suburb page — organic', leads: 3, cost: '$280', gci: '$0 (pending listing)' },
    ],
    aiInsight: 'Suburb pages have the lowest cost-per-lead of any channel at $63. SEO is compounding — the more content published, the cheaper each lead becomes. Invest in 3 more suburb pages this quarter.',
  },
  {
    id: 3, channel: 'Signboard', spend: '$2,100', leadsGen: 6, costPerLead: '$350', listingsProduced: 1,
    appraisals: 3, gci: '$18,200', costPerListing: '$2,100',
    assets: [
      { name: '14 Arcadia St signboard — Bondi Beach', leads: 3, cost: '$700', gci: '$18,200' },
      { name: '42 Glenmore Rd signboard — Paddington', leads: 2, cost: '$700', gci: '$0 (active)' },
      { name: '48 Woodford Ave signboard — Warilla', leads: 1, cost: '$700', gci: '$0 (active)' },
    ],
    aiInsight: 'Signboards generate low lead volume but high-quality vendor leads in the street. Keep signboards as a branding spend rather than lead-generation — they signal presence to neighbours.',
  },
  {
    id: 4, channel: 'Postcard Drop', spend: '$1,440', leadsGen: 4, costPerLead: '$360', listingsProduced: 1,
    appraisals: 2, gci: '$18,200', costPerListing: '$1,440',
    assets: [
      { name: 'Cronulla off-market postcard drop (800 homes)', leads: 2, cost: '$720', gci: '$18,200' },
      { name: 'Manly just-sold postcard (600 homes)', leads: 2, cost: '$720', gci: '$0 (nurturing)' },
    ],
    aiInsight: 'Postcard drops are driving quality seller leads in target suburbs. Cost per listing is higher than digital but the quality of lead is strong. Consider a second Cronulla drop — the first produced a listing.',
  },
  {
    id: 5, channel: 'Blog / Content', spend: '$620', leadsGen: 9, costPerLead: '$69', listingsProduced: 0,
    appraisals: 2, gci: '$0', costPerListing: 'N/A',
    assets: [
      { name: '"Should I sell my Bondi Beach home in 2026?" — blog', leads: 4, cost: '$180', gci: '$0' },
      { name: '"Cronulla market update Q2 2026" — blog', leads: 3, cost: '$220', gci: '$0' },
      { name: '"First home buyer guide — Sydney 2026" — blog', leads: 2, cost: '$220', gci: '$0' },
    ],
    aiInsight: 'Blog content is generating low-cost leads that feed the top of the funnel. No direct GCI yet but 2 appraisals booked from blog traffic. Content ROI materialises in 3–6 months — continue investing.',
  },
  {
    id: 6, channel: 'Video (Social)', spend: '$1,800', leadsGen: 11, costPerLead: '$164', listingsProduced: 1,
    appraisals: 3, gci: '$18,200', costPerListing: '$1,800',
    assets: [
      { name: '"Bondi Beach market update" — Instagram Reel (42k views)', leads: 6, cost: '$600', gci: '$18,200' },
      { name: '"Meet Jye" agent intro video — Facebook', leads: 3, cost: '$600', gci: '$0' },
      { name: '"Warilla property tour" — YouTube Shorts', leads: 2, cost: '$600', gci: '$0' },
    ],
    aiInsight: 'The Bondi Beach market update reel is your best-performing video — 42k views and 6 leads. Produce 2 more suburb market update videos immediately using the same format and distribution strategy.',
  },
  {
    id: 7, channel: 'Email Campaigns', spend: '$240', leadsGen: 18, costPerLead: '$13', listingsProduced: 2,
    appraisals: 7, gci: '$36,400', costPerListing: '$120',
    assets: [
      { name: 'Monthly Seller Nurture Campaign — Q2 2026', leads: 8, cost: '$80', gci: '$18,200' },
      { name: 'Monthly Market Report — June 2026', leads: 6, cost: '$80', gci: '$18,200' },
      { name: 'First Home Buyer Newsletter', leads: 4, cost: '$80', gci: '$0 (active buyers)' },
    ],
    aiInsight: 'Email campaigns have the lowest cost-per-lead at $13 and highest GCI conversion rate. This channel is severely underinvested. Increasing email volume to weekly would multiply returns with minimal additional cost.',
  },
  {
    id: 8, channel: 'REA / Domain Listings', spend: '$4,600', leadsGen: 32, costPerLead: '$144', listingsProduced: 4,
    appraisals: 4, gci: '$72,800', costPerListing: '$1,150',
    assets: [
      { name: '14 Arcadia St — REA Premier listing', leads: 9, cost: '$1,200', gci: '$18,200' },
      { name: '42 Glenmore Rd — REA Premier listing', leads: 8, cost: '$1,200', gci: '$18,200' },
      { name: '48 Woodford Ave — REA Standard listing', leads: 7, cost: '$900', gci: '$18,200' },
      { name: '22 Thirroul Esplanade — Domain listing', leads: 8, cost: '$1,300', gci: '$18,200' },
    ],
    aiInsight: 'Portal listings are essential but expensive. REA Premier listings outperform Standard by 40% on enquiries. Recommend upgrading all listings to Premier — the cost-per-listing differential justifies the upgrade.',
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof CHANNELS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  const gciNum = parseInt(item.gci.replace(/\D/g,'')) || 0
  const barColor = gciNum > 50000 ? SUCCESS : gciNum > 20000 ? WARN : BLUE
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: barColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart2 size={14} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.channel}</span>
            <span style={{ color: SUCCESS, fontSize: 12, fontWeight: 700 }}>{item.gci}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 11, marginBottom: 4 }}>Spend: {item.spend} &bull; {item.leadsGen} leads &bull; {item.listingsProduced} listings</div>
          <div style={{ color: TEXT3, fontSize: 10 }}>CPL: {item.costPerLead}</div>
        </div>
      </div>
    </div>
  )
}

export default function ROIPage() {
  const [selected, setSelected] = useState(CHANNELS[0])
  const totalSpend = CHANNELS.reduce((s, c) => s + parseInt(c.spend.replace(/\D/g,'')), 0)
  const totalGCI = CHANNELS.reduce((s, c) => s + (parseInt(c.gci.replace(/\D/g,'')) || 0), 0)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Marketing ROI Dashboard</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <div>
              <div style={{ color: PINK, fontSize: 14, fontWeight: 700 }}>${totalSpend.toLocaleString()}</div>
              <div style={{ color: TEXT3, fontSize: 10 }}>Total Spend</div>
            </div>
            <div>
              <div style={{ color: SUCCESS, fontSize: 14, fontWeight: 700 }}>${totalGCI.toLocaleString()}</div>
              <div style={{ color: TEXT3, fontSize: 10 }}>Total GCI</div>
            </div>
            <div>
              <div style={{ color: BLUE, fontSize: 14, fontWeight: 700 }}>{(totalGCI / totalSpend).toFixed(1)}×</div>
              <div style={{ color: TEXT3, fontSize: 10 }}>ROI</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {CHANNELS.map(c => <ListRow key={c.id} item={c} selected={selected.id === c.id} onSelect={() => setSelected(c)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>ROI Breakdown — {selected.channel}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ArrowLeft, ArrowRight, MoreHorizontal].map((Icon, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><Icon size={15} strokeWidth={1.5} /></button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Metrics row */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { label: 'Spend', value: selected.spend, color: DANGER },
                { label: 'Leads', value: selected.leadsGen, color: BLUE },
                { label: 'Cost/Lead', value: selected.costPerLead, color: WARN },
                { label: 'Appraisals', value: selected.appraisals, color: TEAL },
                { label: 'Listings', value: selected.listingsProduced, color: PURPLE },
                { label: 'GCI', value: selected.gci, color: SUCCESS },
                { label: 'Cost/Listing', value: selected.costPerListing, color: WARN },
                { label: 'ROI Multiple', value: (() => { const s = parseInt(selected.spend.replace(/\D/g,'')); const g = parseInt(selected.gci.replace(/\D/g,''))||0; return s > 0 ? `${(g/s).toFixed(1)}×` : 'N/A' })(), color: PINK },
              ].map(m => (
                <div key={m.label} style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ color: m.color, fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{m.value}</div>
                  <div style={{ color: TEXT3, fontSize: 10 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Asset breakdown */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Asset Breakdown</div>
            {selected.assets.map((a, i) => (
              <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: TEXT, fontSize: 13 }}>{a.name}</span>
                  <span style={{ color: SUCCESS, fontSize: 12, fontWeight: 700 }}>{a.gci}</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ color: TEXT3, fontSize: 11 }}>Leads: <span style={{ color: BLUE, fontWeight: 600 }}>{a.leads}</span></span>
                  <span style={{ color: TEXT3, fontSize: 11 }}>Cost: <span style={{ color: TEXT2 }}>{a.cost}</span></span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div style={{ margin: '16px 20px 20px', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px', display: 'flex', gap: 10 }}>
            <Brain size={14} color={PINK} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ color: PINK, fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Channel Insight</div>
              <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{selected.aiInsight}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
