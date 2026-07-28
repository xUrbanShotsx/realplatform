'use client'
import { useState } from 'react'
import { FileText, Globe, Instagram, Linkedin, Mail, Calendar, CheckCircle, Clock, Edit3, Send, BarChart2, TrendingUp, Eye, ThumbsUp } from 'lucide-react'

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
const BLUE      = '#0078d4'
const PURPLE    = '#8764b8'

const ITEMS = [
  {
    id: 1,
    type: 'Suburb Market Report',
    suburb: 'Cronulla',
    status: 'Published',
    statusColor: SUCCESS,
    created: 'Today 9:14am',
    views: 312,
    engagements: 47,
    channels: ['Website', 'Facebook', 'Newsletter'],
    seoScore: 91,
    headline: 'Cronulla Market Update – July 2026',
    body: `The Cronulla property market continues to show strong resilience, with median house prices rising 4.2% over the past quarter to $2.18M.\n\nClearance rates have held above 72% for six consecutive weekends, driven by limited stock and persistent buyer demand — particularly from upsizers and prestige buyers relocating from the Eastern Suburbs.\n\nKey highlights this month:\n• 23 properties sold, median days on market: 19\n• Auction clearance rate: 74%\n• Highest sale: 14 Foreshore Cres — $3.85M\n• New listings: 11 (down 18% vs. same period last year)\n\nOur forecast: continued price stability with upward pressure into Q3, especially for beachside and hinterland properties. If you're considering listing, now is an excellent time to get ahead of the spring rush.`,
    tags: ['Market Update', 'Cronulla', 'Q3 2026'],
  },
  {
    id: 2,
    type: 'Blog Post',
    suburb: 'Sutherland Shire',
    status: 'Published',
    statusColor: SUCCESS,
    created: 'Yesterday',
    views: 198,
    engagements: 29,
    channels: ['Website', 'LinkedIn'],
    seoScore: 88,
    headline: '5 Reasons Buyers Are Flocking to the Sutherland Shire in 2026',
    body: `Sydney's Sutherland Shire is having a moment. What was once considered a hidden gem is now firmly on the radar of buyers priced out of the Eastern Suburbs and Inner West.\n\n1. Value for money — median house prices remain 35% below Bondi, with similar lifestyle appeal.\n2. Infrastructure investment — the new Heathcote Road upgrade and expanded Kirrawee hub are transforming commute times.\n3. Schools — 6 of the state's top 20 public schools are within the Shire.\n4. Lifestyle — 14km of national park trails, beaches, and the Royal National Park at your doorstep.\n5. Supply constraints — new dwelling approvals are down 22% YoY, putting long-term pressure on prices.\n\nFor buyers sitting on the fence, our data suggests the window is narrowing. Contact us for a free suburb value report.`,
    tags: ['Buyers Guide', 'Lifestyle', 'Market Insight'],
  },
  {
    id: 3,
    type: 'Social Post',
    suburb: 'Miranda',
    status: 'Scheduled',
    statusColor: WARN,
    created: '2 days ago',
    views: 0,
    engagements: 0,
    channels: ['Instagram', 'Facebook'],
    seoScore: null,
    headline: '⚡ Just Listed — 3 Bed Gem in Miranda',
    body: `Just listed! 🏡 3 bed | 2 bath | 2 car — 12 Silica St, Miranda\n\nPerfectly positioned just 600m from Westfield Miranda, this immaculate home ticks every box. North-facing alfresco, updated kitchen with stone benchtops, and a generous 612m² block.\n\nPrice guide: $1,450,000–$1,550,000\nInspection: Saturday 26 July, 10:30am–11:00am\n\nLink in bio to view full listing 👆\n\n#Miranda #SutherlandShire #RealEstate #JustListed #HomeSweetHome #SydneyProperty`,
    tags: ['Just Listed', 'Miranda', 'Social'],
  },
  {
    id: 4,
    type: 'Newsletter',
    suburb: 'All Areas',
    status: 'Published',
    statusColor: SUCCESS,
    created: '4 days ago',
    views: 1840,
    engagements: 213,
    channels: ['Newsletter'],
    seoScore: null,
    headline: 'The Real Platform Market Digest — July Edition',
    body: `Hi [First Name],\n\nWelcome to the July edition of The Market Digest — your monthly snapshot of what's happening across the Sutherland Shire property market.\n\n📈 Market Summary\nMedian house prices across the Shire rose 3.1% this month. Clearance rates remain strong at 71%.\n\n🏆 Our Top Sales This Month\n• 42 Bundeena Dr, Bundeena — $2.95M\n• 7 Ocean St, Cronulla — $3.1M\n• 14 Boronia Rd, Como — $1.78M\n\n🔍 Suburb Spotlight: Caringbah South\nStrong demand from young families and upsizers is pushing Caringbah South into focus. Three recent off-market sales in the $1.6–1.9M range signal growing confidence.\n\n📅 Open This Weekend\n3 properties across Cronulla, Miranda, and Gymea. Click below to view times.\n\nWarm regards,\nThe Team at Spinelli Real Estate`,
    tags: ['Newsletter', 'Monthly Digest', 'Market'],
  },
  {
    id: 5,
    type: 'Suburb Market Report',
    suburb: 'Caringbah',
    status: 'Draft',
    statusColor: TEXT3,
    created: '5 days ago',
    views: 0,
    engagements: 0,
    channels: [],
    seoScore: 76,
    headline: 'Caringbah Market Update – July 2026',
    body: `Caringbah is quietly becoming one of the Shire's most sought-after suburbs for first-home buyers and young families. With easy access to Miranda Westfield, excellent schools, and competitive price points, demand is outpacing supply.\n\nMedian house price: $1.52M (+5.1% QoQ)\nMedian unit price: $780K (+2.8% QoQ)\nDays on market: 22 (down from 31 six months ago)\n\nThe rental market is equally tight, with vacancy rates sitting at 0.9% and median weekly rents for houses now at $895.\n\n[Draft — to be reviewed before publishing]`,
    tags: ['Market Update', 'Caringbah', 'Draft'],
  },
  {
    id: 6,
    type: 'Blog Post',
    suburb: 'Bundeena',
    status: 'Draft',
    statusColor: TEXT3,
    created: '1 week ago',
    views: 0,
    engagements: 0,
    channels: [],
    seoScore: 82,
    headline: 'Bundeena: Sydney\'s Best-Kept Secret is Out',
    body: `For years, Bundeena sat quietly at the end of the Royal National Park ferry run — beloved by those in the know, ignored by the rest of Sydney. That's changing fast.\n\nSince 2024, median house prices have risen 21%, buoyed by remote workers discovering that Sydney's only national park village is actually just 90 minutes from the CBD by ferry.\n\nWith a median of $1.9M, Bundeena now rivals Cronulla on price — but offers something money can't buy: complete serenity, national park trails out your back gate, and a genuine village community.\n\nWe're currently monitoring three off-market opportunities in Bundeena for motivated buyers. Reach out to learn more.`,
    tags: ['Lifestyle', 'Bundeena', 'Emerging Suburb'],
  },
]

const TYPE_ICONS: Record<string, React.ElementType> = {
  'Suburb Market Report': BarChart2,
  'Blog Post': FileText,
  'Social Post': Instagram,
  'Newsletter': Mail,
}

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  Website: Globe,
  Facebook: Globe,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Newsletter: Mail,
}

export default function ContentEnginePage() {
  const [selected, setSelected] = useState(ITEMS[0])
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* List Panel */}
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>Content Engine</span>
            <button style={{ background: PINK, color: '#fff', border: 'none', padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              + Generate
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Published', 'Scheduled', 'Draft'].map(tab => (
              <button key={tab} style={{ background: tab === 'All' ? PINK_SOFT : 'transparent', color: tab === 'All' ? PINK : TEXT2, border: `1px solid ${tab === 'All' ? PINK : BORDER}`, padding: '3px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{tab}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ITEMS.map(item => {
            const active = selected.id === item.id
            const Icon = TYPE_ICONS[item.type] || FileText
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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <div style={{ width: 30, height: 30, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon size={14} color={PINK} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.type}</span>
                      <span style={{ fontSize: 11, color: TEXT3 }}>{item.created}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT, fontWeight: 600, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.headline}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, color: item.statusColor, fontWeight: 600 }}>{item.status}</span>
                      {item.suburb && <span style={{ fontSize: 11, color: TEXT3 }}>· {item.suburb}</span>}
                      {item.views > 0 && <span style={{ fontSize: 11, color: TEXT3 }}>· {item.views} views</span>}
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
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selected.type}</span>
                <span style={{ fontSize: 11, color: selected.statusColor, background: `${selected.statusColor}18`, padding: '1px 7px', fontWeight: 600 }}>{selected.status}</span>
              </div>
              <h2 style={{ color: TEXT, fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{selected.headline}</h2>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button style={{ background: 'rgba(0,0,0,0.09)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Edit3 size={12} /> Edit
              </button>
              <button style={{ background: PINK, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Send size={12} /> Publish
              </button>
            </div>
          </div>

          {/* Stats row */}
          {selected.views > 0 && (
            <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
              {[
                { icon: Eye, label: 'Views', val: selected.views.toLocaleString() },
                { icon: ThumbsUp, label: 'Engagements', val: selected.engagements },
                { icon: TrendingUp, label: 'SEO Score', val: selected.seoScore ? `${selected.seoScore}/100` : '—' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <s.icon size={12} color={TEXT3} />
                  <span style={{ fontSize: 12, color: TEXT3 }}>{s.label}:</span>
                  <span style={{ fontSize: 12, color: TEXT, fontWeight: 700 }}>{s.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* Published channels */}
          {selected.channels.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Published To</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selected.channels.map(ch => {
                  const Icon = CHANNEL_ICONS[ch] || Globe
                  return (
                    <div key={ch} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.05)', border: `1px solid ${BORDER}`, padding: '5px 10px' }}>
                      <Icon size={12} color={PINK} />
                      <span style={{ fontSize: 12, color: TEXT2 }}>{ch}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Publish options (if draft/scheduled) */}
          {selected.channels.length === 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Publish To</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Website', 'Facebook', 'Instagram', 'LinkedIn', 'Newsletter'].map(ch => {
                  const Icon = CHANNEL_ICONS[ch] || Globe
                  return (
                    <div key={ch} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: `1px solid ${BORDER}`, padding: '5px 10px', cursor: 'pointer' }}>
                      <Icon size={12} color={TEXT3} />
                      <span style={{ fontSize: 12, color: TEXT2 }}>{ch}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SEO Score */}
          {selected.seoScore && (
            <div style={{ background: 'rgba(0,0,0,0.03)', border: `1px solid ${BORDER}`, padding: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: TEXT2, fontWeight: 600 }}>SEO Score</span>
                <span style={{ fontSize: 20, color: selected.seoScore >= 85 ? SUCCESS : WARN, fontWeight: 800 }}>{selected.seoScore}<span style={{ fontSize: 13, color: TEXT3 }}>/100</span></span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${selected.seoScore}%`, background: selected.seoScore >= 85 ? SUCCESS : WARN, transition: 'width 0.4s' }} />
              </div>
              {[
                { label: 'Keyword density', score: 'Good' },
                { label: 'Meta description', score: selected.seoScore >= 85 ? 'Good' : 'Needs work' },
                { label: 'Headings structure', score: 'Good' },
                { label: 'Internal links', score: selected.seoScore >= 85 ? 'Good' : 'Add more' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: TEXT2 }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: s.score === 'Good' ? SUCCESS : WARN, fontWeight: 600 }}>{s.score}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {selected.tags.map(tag => (
              <span key={tag} style={{ fontSize: 11, color: TEXT2, background: 'rgba(0,0,0,0.05)', border: `1px solid ${BORDER}`, padding: '3px 8px' }}>{tag}</span>
            ))}
          </div>

          {/* Content body */}
          <div style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Content Preview</div>
          <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: 16 }}>
            {selected.body.split('\n').map((line, i) => (
              <p key={i} style={{ fontSize: 13, color: line.startsWith('•') || line.startsWith('#') ? TEXT : TEXT2, margin: '0 0 8px', lineHeight: 1.7, fontWeight: line.startsWith('#') ? 700 : 400 }}>
                {line || <br />}
              </p>
            ))}
          </div>

          {/* Schedule */}
          {selected.status === 'Scheduled' && (
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: WARN, fontSize: 13 }}>
              <Calendar size={14} />
              <span>Scheduled for Saturday 26 July 2026, 9:00am</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
