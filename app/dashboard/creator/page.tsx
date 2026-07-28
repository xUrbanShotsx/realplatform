'use client'
import { useState } from 'react'
import { Plus, Sparkles, Layers, Zap, Star, Clock, Download, Share2, Instagram, Linkedin, Facebook, CheckCircle, ChevronRight, RefreshCw, Video, Target, Home, Trophy, Key, Building2, Calendar, BarChart2, Hammer } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const GREEN = '#10b981'; const AMBER = '#f59e0b'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const AD_TYPES = [
  { id: 'prospecting',     label: 'Prospecting',     icon: Target,   desc: 'Attract vendors & appraisals',  color: BLUE     },
  { id: 'just-listed',     label: 'Just Listed',     icon: Home,     desc: 'Launch a new property listing', color: '#06b6d4' },
  { id: 'just-sold',       label: 'Just Sold',       icon: Trophy,   desc: 'Celebrate a sold result',       color: GREEN    },
  { id: 'just-leased',     label: 'Just Leased',     icon: Key,      desc: 'Announce a leased property',    color: AMBER    },
  { id: 'for-lease',       label: 'For Lease',       icon: Building2,desc: 'Promote a rental listing',      color: '#8b5cf6'},
  { id: 'open-home',       label: 'Open Home',       icon: Calendar, desc: 'Drive open home attendance',    color: PINK     },
  { id: 'market-update',   label: 'Market Update',   icon: BarChart2,desc: 'Share suburb stats & trends',   color: '#f97316'},
  { id: 'auction-result',  label: 'Auction Result',  icon: Hammer,   desc: 'Showcase auction performance',  color: '#dc2626'},
  { id: 'brand',           label: 'Brand / Team',    icon: Sparkles, desc: 'Agency & team awareness',        color: '#64748b'},
]

const FORMATS = [
  { id: 'story'    , label: 'Story',     ratio: '9:16', bw: 540, bh: 960, platforms: 'IG · TikTok' },
  { id: 'feed'     , label: 'Feed',      ratio: '1:1',  bw: 540, bh: 540, platforms: 'IG · FB'     },
  { id: 'landscape', label: 'Landscape', ratio: '16:9', bw: 960, bh: 540, platforms: 'FB · LinkedIn'},
] as const

const STYLES = [
  { id: 'modern',  label: 'Modern',  desc: 'Dark & sleek'   },
  { id: 'bold',    label: 'Bold',    desc: 'High contrast'  },
  { id: 'minimal', label: 'Minimal', desc: 'Clean & fresh'  },
  { id: 'luxury',  label: 'Luxury',  desc: 'Gold accents'   },
  { id: 'vibrant', label: 'Vibrant', desc: 'Bold gradient'  },
]

// ── Ad copy per type ──────────────────────────────────────────────────────────

interface AdData { address: string; suburb: string; price: string; beds: number; baths: number; cars: number }

function adCopy(id: string, d: AdData) {
  const a1     = (d.address.split(',')[0] || '42 Foreshore Cres').trim()
  const suburb = d.suburb || 'Cronulla'
  const price  = d.price  || '$2,850,000'
  const specs  = `${d.beds} bed  ·  ${d.baths} bath  ·  ${d.cars} car`
  switch (id) {
    case 'just-listed':    return { badge: 'JUST LISTED',    h1: a1,                           h2: suburb,                          stat: price,       detail: specs,                         cta: 'View Property'  }
    case 'just-sold':      return { badge: 'JUST SOLD',      h1: 'SOLD',                        h2: `${a1}, ${suburb}`,              stat: price,       detail: '14 days · 3 bidders',         cta: 'See the result' }
    case 'prospecting':    return { badge: 'FREE APPRAISAL', h1: "What's your home worth?",     h2: `${suburb} · Free appraisal`,   stat: 'No obligation', detail: "Cronulla's #1 specialist", cta: 'Book Appraisal' }
    case 'just-leased':    return { badge: 'JUST LEASED',    h1: 'Leased',                      h2: `${a1}, ${suburb}`,              stat: d.price||'$880/wk', detail: 'Within 48 hours',     cta: 'View result'    }
    case 'for-lease':      return { badge: 'FOR LEASE',      h1: a1,                            h2: suburb,                          stat: d.price||'$850/wk', detail: specs,                 cta: 'Book inspection'}
    case 'open-home':      return { badge: 'OPEN HOME',      h1: 'Open This Saturday',           h2: '11:30 am – 12:00 pm',          stat: a1,          detail: suburb,                        cta: 'Add to calendar'}
    case 'market-update':  return { badge: 'MARKET UPDATE',  h1: suburb,                        h2: 'Property Report · July 2026',   stat: '74% Clearance', detail: 'Median $2.1M · 18 days avg', cta: 'Full report' }
    case 'auction-result': return { badge: 'AUCTION',        h1: 'Sold Under the Hammer',        h2: `${a1}, ${suburb}`,              stat: price,       detail: '3 bidders · $230K over reserve', cta: 'View result' }
    case 'brand':          return { badge: 'SPINELLI RE',    h1: "Cronulla's Trusted Specialists", h2: 'Over 500 successful sales',  stat: '★ 4.9/5.0', detail: 'spinellire.com.au',            cta: 'Meet the team'  }
    default:               return { badge: 'REAL ESTATE',    h1: a1,                            h2: suburb,                          stat: price,       detail: specs,                         cta: 'Learn more'     }
  }
}

// ── AdCanvas ──────────────────────────────────────────────────────────────────

function AdCanvas({ format, adTypeId, styleId, data, scale = 1 }: {
  format: 'story' | 'feed' | 'landscape'
  adTypeId: string; styleId: string; data: AdData; scale?: number
}) {
  const fmt    = FORMATS.find(f => f.id === format)!
  const bw     = fmt.bw; const bh = fmt.bh
  const adType = AD_TYPES.find(t => t.id === adTypeId) || AD_TYPES[1]
  const c      = adCopy(adTypeId, data)
  const isMin  = styleId === 'minimal'
  const isLand = format === 'landscape'
  const isStory= format === 'story'
  const pad    = Math.round(bw * 0.07)

  // Background
  const bgMap: Record<string,string> = {
    modern:  'linear-gradient(160deg,#050d1a 0%,#0a1628 40%,#0f2140 100%)',
    bold:    `linear-gradient(145deg,${adType.color} 0%,${adType.color}bb 100%)`,
    minimal: '#ffffff',
    luxury:  'linear-gradient(160deg,#1c1917 0%,#241f1b 100%)',
    vibrant: 'linear-gradient(145deg,#4361ee 0%,#6d44e0 45%,#e3008c 100%)',
  }
  const bg = bgMap[styleId] || bgMap.modern

  const textC  = isMin ? '#0f172a' : '#fff'
  const text2C = isMin ? '#475569' : 'rgba(255,255,255,0.72)'
  const text3C = isMin ? '#94a3b8' : 'rgba(255,255,255,0.42)'

  const accentMap: Record<string,string> = { modern: adType.color, bold: '#fff', minimal: adType.color, luxury: '#d4a94a', vibrant: '#fff' }
  const accentC = accentMap[styleId] || adType.color

  const badgeBgMap: Record<string,string> = { modern: adType.color, bold: 'rgba(0,0,0,0.22)', minimal: `${adType.color}18`, luxury: '#d4a94a', vibrant: 'rgba(255,255,255,0.18)' }
  const badgeBg    = badgeBgMap[styleId]  || adType.color
  const badgeTextC = isMin ? adType.color : (styleId === 'luxury' ? '#1c1917' : '#fff')
  const badgeBorderC = isMin ? `${adType.color}50` : 'transparent'

  // Font sizes at base resolution
  const longH1 = c.h1.length > 18
  const hs = isLand
    ? (longH1 ? 46 : 60)
    : isStory
      ? (longH1 ? 62 : 80)
      : (longH1 ? 48 : 60)
  const ss = isLand ? 22 : isStory ? 26 : 20
  const ps = isLand ? 44 : isStory ? 58 : 46  // price/stat size
  const ds = isLand ? 18 : isStory ? 21 : 17

  // CTA button colors
  const ctaBg   = isMin ? adType.color : (styleId === 'modern' || styleId === 'luxury' ? accentC : 'rgba(255,255,255,0.95)')
  const ctaText = isMin ? '#fff' : (styleId === 'modern' || styleId === 'luxury' ? '#fff' : '#0f172a')

  return (
    <div style={{ width: bw * scale, height: bh * scale, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: bw, height: bh, transform: `scale(${scale})`, transformOrigin: 'top left' }}>

        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, background: bg }} />

        {/* ── Decorations ── */}
        {styleId === 'modern' && <>
          <div style={{ position: 'absolute', top: -bh * 0.08, right: -bw * 0.12, width: bw * 0.85, height: bw * 0.85, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: bh * 0.06, right: -bw * 0.22, width: bw * 0.72, height: bw * 0.72, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg,${adType.color},${adType.color}00)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: bh * 0.35, background: 'radial-gradient(ellipse at 80% 20%,rgba(67,97,238,0.12) 0%,transparent 65%)', pointerEvents: 'none' }} />
        </>}

        {styleId === 'bold' && <>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: `0 0 ${bh * 0.32}px ${bw * 0.55}px`, borderColor: `transparent transparent rgba(0,0,0,0.2) transparent`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: `${bh * 0.22}px ${bw * 0.42}px 0 0`, borderColor: `rgba(255,255,255,0.1) transparent transparent transparent`, pointerEvents: 'none' }} />
        </>}

        {styleId === 'minimal' && <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: adType.color, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `${adType.color}35`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 20, right: 20, width: bw * 0.22, height: bh * 0.18, opacity: 0.055, backgroundImage: 'radial-gradient(circle,#000 1px,transparent 1px)', backgroundSize: '18px 18px', pointerEvents: 'none' }} />
        </>}

        {styleId === 'luxury' && <>
          <div style={{ position: 'absolute', top: bh * 0.11, left: pad, right: pad, height: 1, background: 'linear-gradient(90deg,transparent,#d4a94a,transparent)', opacity: 0.55, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: bh * 0.11, left: pad, right: pad, height: 1, background: 'linear-gradient(90deg,transparent,#d4a94a,transparent)', opacity: 0.55, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: 0, top: bh * 0.18, bottom: bh * 0.18, width: 2, background: 'linear-gradient(180deg,transparent,#d4a94a,transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(212,169,74,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
        </>}

        {styleId === 'vibrant' && <>
          <div style={{ position: 'absolute', top: -bw * 0.14, left: -bw * 0.1, width: bw * 0.65, height: bw * 0.65, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -bw * 0.18, right: -bw * 0.13, width: bw * 0.72, height: bw * 0.72, borderRadius: '50%', background: 'rgba(0,0,0,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: bh * 0.04, right: -bw * 0.04, width: bw * 0.48, height: bw * 0.48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)', pointerEvents: 'none' }} />
        </>}

        {/* ── Content ── */}
        {isLand ? (
          /* Landscape: side-by-side layout */
          <>
            {/* Left column: main content */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: bw * 0.62, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${pad}px 0 ${pad}px ${pad}px` }}>
              <div style={{ alignSelf: 'flex-start', fontSize: 11, fontWeight: 800, color: badgeTextC, background: badgeBg, border: `1px solid ${badgeBorderC}`, padding: '5px 11px', letterSpacing: '0.08em', marginBottom: 24 }}>{c.badge}</div>
              <div style={{ width: 44, height: 3, background: accentC, marginBottom: 18 }} />
              <div style={{ fontSize: hs, fontWeight: 900, color: textC, lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: 14 }}>{c.h1}</div>
              <div style={{ fontSize: ss, fontWeight: 500, color: text2C, letterSpacing: '0.01em', marginBottom: 20 }}>{c.h2}</div>
              <div style={{ width: '65%', height: 1, background: isMin ? `${adType.color}28` : 'rgba(255,255,255,0.18)', marginBottom: 20 }} />
              <div style={{ fontSize: ps, fontWeight: 900, color: accentC, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{c.stat}</div>
              <div style={{ fontSize: ds, color: text2C, marginBottom: 24 }}>{c.detail}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: ctaBg, padding: '12px 24px', alignSelf: 'flex-start' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: ctaText, letterSpacing: '0.02em' }}>{c.cta} →</span>
              </div>
            </div>

            {/* Right column: agency branding */}
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: bw * 0.28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: `1px solid ${isMin ? `${adType.color}12` : 'rgba(255,255,255,0.1)'}`, gap: 14 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: textC, letterSpacing: '0.14em' }}>SPINELLI</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: text2C, letterSpacing: '0.22em', marginTop: 2 }}>REAL ESTATE</div>
              </div>
              <div style={{ width: 36, height: 1, background: accentC }} />
              <div style={{ fontSize: 12, color: text3C, letterSpacing: '0.1em' }}>CRONULLA</div>
            </div>
          </>
        ) : (
          /* Portrait: stacked layout */
          <>
            {/* Top bar */}
            <div style={{ position: 'absolute', top: pad * 0.9, left: pad, right: pad, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: textC, letterSpacing: '0.12em', lineHeight: 1 }}>SPINELLI</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: text2C, letterSpacing: '0.2em', marginTop: 2 }}>REAL ESTATE</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: badgeTextC, background: badgeBg, border: `1px solid ${badgeBorderC}`, padding: '5px 12px', letterSpacing: '0.07em' }}>{c.badge}</div>
            </div>

            {/* Bottom content */}
            <div style={{ position: 'absolute', bottom: isStory ? pad * 1.1 : pad * 0.9, left: pad, right: pad }}>
              <div style={{ width: 48, height: 3, background: accentC, marginBottom: isStory ? 20 : 14 }} />
              <div style={{ fontSize: hs, fontWeight: 900, color: textC, lineHeight: 0.93, letterSpacing: '-0.03em', marginBottom: isStory ? 14 : 10 }}>{c.h1}</div>
              <div style={{ fontSize: ss, fontWeight: 500, color: text2C, letterSpacing: '0.01em', marginBottom: isStory ? 24 : 16 }}>{c.h2}</div>
              <div style={{ height: 1, background: isMin ? `${adType.color}28` : 'rgba(255,255,255,0.18)', marginBottom: isStory ? 20 : 14 }} />
              <div style={{ fontSize: ps, fontWeight: 900, color: accentC, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: isStory ? 8 : 6 }}>{c.stat}</div>
              <div style={{ fontSize: ds, color: text2C, marginBottom: isStory ? 28 : 18 }}>{c.detail}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: ctaBg, padding: isStory ? '15px 30px' : '11px 22px' }}>
                <span style={{ fontSize: isStory ? 17 : 14, fontWeight: 800, color: ctaText, letterSpacing: '0.02em' }}>{c.cta} →</span>
              </div>
              {isStory && <div style={{ marginTop: 20, fontSize: 13, color: text3C, letterSpacing: '0.06em' }}>spinellire.com.au</div>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Template thumbnails ───────────────────────────────────────────────────────

const TEMPLATES = [
  { id: 1,  adTypeId: 'prospecting',   format: 'story'    , styleId: 'modern',  label: "What's Your Home Worth?" },
  { id: 2,  adTypeId: 'prospecting',   format: 'feed'     , styleId: 'bold',    label: 'We Have Buyers'           },
  { id: 3,  adTypeId: 'prospecting',   format: 'story'    , styleId: 'luxury',  label: 'Luxury Vendor Prospect'   },
  { id: 4,  adTypeId: 'just-listed',   format: 'story'    , styleId: 'modern',  label: 'Just Listed — Dark'       },
  { id: 5,  adTypeId: 'just-listed',   format: 'feed'     , styleId: 'minimal', label: 'Just Listed — Clean'      },
  { id: 6,  adTypeId: 'just-listed',   format: 'landscape', styleId: 'vibrant', label: 'Just Listed — Vibrant'    },
  { id: 7,  adTypeId: 'just-sold',     format: 'story'    , styleId: 'bold',    label: 'SOLD — Celebration'       },
  { id: 8,  adTypeId: 'just-sold',     format: 'feed'     , styleId: 'modern',  label: 'Sold — Stats Card'        },
  { id: 9,  adTypeId: 'open-home',     format: 'story'    , styleId: 'vibrant', label: 'Open Home — Bold'         },
  { id: 10, adTypeId: 'open-home',     format: 'feed'     , styleId: 'minimal', label: 'Open Home — Clean'        },
  { id: 11, adTypeId: 'market-update', format: 'landscape', styleId: 'modern',  label: 'Market Report — Data'     },
  { id: 12, adTypeId: 'for-lease',     format: 'feed'     , styleId: 'modern',  label: 'For Lease — Modern'       },
  { id: 13, adTypeId: 'just-leased',   format: 'story'    , styleId: 'luxury',  label: 'Leased — Gold'            },
  { id: 14, adTypeId: 'auction-result',format: 'story'    , styleId: 'bold',    label: 'Auction — Hammer'         },
  { id: 15, adTypeId: 'brand',         format: 'landscape', styleId: 'luxury',  label: 'Brand — Prestige'         },
]

const DEFAULT_DATA: AdData = { address: '42 Foreshore Cres', suburb: 'Cronulla', price: '$2,850,000', beds: 4, baths: 3, cars: 2 }

// Template thumbnail scales
const THUMB_SCALE: Record<string, number> = { story: 0.185, feed: 0.21, landscape: 0.16 }

function TemplatesTab() {
  const [category, setCategory] = useState('all')
  const [format,   setFormat  ] = useState<string>('all')
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = TEMPLATES.filter(t =>
    (category === 'all' || t.adTypeId === category) &&
    (format   === 'all' || t.format   === format)
  )

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left: categories */}
      <div style={{ width: 186, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: '#fff', overflowY: 'auto' }}>
        <div style={{ padding: '12px 14px 6px', fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em' }}>CATEGORIES</div>
        {([{ id: 'all', label: 'All Templates', icon: Zap, color: BLUE } as const, ...AD_TYPES]).map(t => {
          const Icon = t.icon
          const active = category === t.id
          return (
            <button key={t.id} onClick={() => setCategory(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 14px', background: active ? `${BLUE}08` : 'none', border: 'none', borderLeft: active ? `2px solid ${BLUE}` : '2px solid transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
              <Icon size={13} color={active ? t.color : TEXT3} strokeWidth={1.75} />
              <span style={{ fontSize: 11.5, color: active ? TEXT : TEXT2, fontWeight: active ? 700 : 400 }}>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Right: grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: TEXT3, marginRight: 4 }}>Format:</span>
          {['all', ...FORMATS.map(f => f.id)].map(fid => (
            <button key={fid} onClick={() => setFormat(fid)}
              style={{ padding: '4px 12px', border: `1.5px solid ${format === fid ? BLUE : BORDER}`, background: format === fid ? `${BLUE}08` : '#fff', color: format === fid ? BLUE : TEXT2, fontSize: 11, fontWeight: format === fid ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
              {fid === 'all' ? 'All' : FORMATS.find(f => f.id === fid)?.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: 11, color: TEXT3 }}>{filtered.length} templates</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>
            {filtered.map(t => {
              const sc = THUMB_SCALE[t.format]
              const fmt = FORMATS.find(f => f.id === t.format)!
              const w = fmt.bw * sc; const h = fmt.bh * sc
              const isSel = selected === t.id
              return (
                <div key={t.id} onClick={() => setSelected(isSel ? null : t.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ position: 'relative', outline: isSel ? `3px solid ${BLUE}` : '3px solid transparent', outlineOffset: 2 }}>
                    <AdCanvas format={t.format as any} adTypeId={t.adTypeId} styleId={t.styleId} data={DEFAULT_DATA} scale={sc} />
                    {isSel && (
                      <div style={{ position: 'absolute', inset: 0, background: `${BLUE}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={22} color={BLUE} />
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 10.5, color: TEXT2, fontWeight: 500, maxWidth: w, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.label}</div>
                  <div style={{ fontSize: 9.5, color: TEXT3 }}>{FORMATS.find(f=>f.id===t.format)?.ratio} · {t.styleId}</div>
                </div>
              )
            })}
          </div>
        </div>

        {selected !== null && (
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ flex: 1, fontSize: 12, color: TEXT2 }}>
              <span style={{ fontWeight: 700, color: TEXT }}>{TEMPLATES.find(t => t.id === selected)?.label}</span> — customise with your listing details
            </div>
            <button style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '7px 14px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Preview</button>
            <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '7px 18px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Use Template</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── AI Generate ───────────────────────────────────────────────────────────────

// Output scales — bigger so the ads really show off
const OUT_SCALE: Record<string, number> = { story: 0.36, feed: 0.42, landscape: 0.34 }

function AIGeneratePanel() {
  const [adType,   setAdType  ] = useState('just-listed')
  const [styleId,  setStyleId ] = useState('modern')
  const [step,     setStep    ] = useState<'form'|'generating'|'done'>('form')
  const [progress, setProgress] = useState(0)
  const [platform, setPlatform] = useState<string[]>(['instagram'])
  const [formData, setFormData] = useState<AdData>(DEFAULT_DATA)
  const [liveData, setLiveData] = useState<AdData>(DEFAULT_DATA)

  const selectedType = AD_TYPES.find(t => t.id === adType)!

  const generate = () => {
    setStep('generating'); setProgress(0)
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); setLiveData(formData); setStep('done'); return 100 }
        return p + (p < 55 ? 4 : p < 80 ? 2.2 : 1)
      })
    }, 80)
  }

  const GEN_STEPS = ['Analysing brief...', 'Composing layout...', 'Applying brand...', 'Rendering ads...']

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, height: '100%' }}>
      {/* ── Form ── */}
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 2 }}>

        {/* Ad type */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 10 }}>AD TYPE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {AD_TYPES.map(t => {
              const Icon = t.icon
              return (
              <button key={t.id} onClick={() => setAdType(t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', border: 'none', background: adType === t.id ? `${t.color}08` : 'transparent', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', borderLeft: `2px solid ${adType === t.id ? t.color : 'transparent'}` }}>
                <Icon size={14} color={adType === t.id ? t.color : TEXT3} strokeWidth={1.75} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: adType === t.id ? 700 : 500, color: adType === t.id ? TEXT : TEXT2 }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{t.desc}</div>
                </div>
                {adType === t.id && <ChevronRight size={12} color={t.color} />}
              </button>
              )
            })}
          </div>
        </div>

        {/* Property details */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 10 }}>PROPERTY DETAILS</div>
          {([
            { key: 'address', label: 'Address',     placeholder: '42 Foreshore Cres, Cronulla' },
            { key: 'suburb',  label: 'Suburb',      placeholder: 'Cronulla'                    },
            { key: 'price',   label: 'Price / Guide',placeholder: '$2,850,000'                 },
          ] as const).map(f => (
            <div key={f.key} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: TEXT3, marginBottom: 4 }}>{f.label}</div>
              <input placeholder={f.placeholder} defaultValue={(formData as any)[f.key]}
                onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '7px 10px', fontSize: 12, color: TEXT, fontFamily: 'inherit', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {(['beds','baths','cars'] as const).map(k => (
              <div key={k}>
                <div style={{ fontSize: 10, color: TEXT3, marginBottom: 4 }}>{k.charAt(0).toUpperCase()+k.slice(1)}</div>
                <input type="number" defaultValue={formData[k]}
                  onChange={e => setFormData(d => ({ ...d, [k]: +e.target.value }))}
                  style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '7px 8px', fontSize: 12, color: TEXT, fontFamily: 'inherit', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Style */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 12 }}>STYLE</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STYLES.map(s => {
              const sel = styleId === s.id
              return (
                <button key={s.id} onClick={() => setStyleId(s.id)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                  {/* Mini style swatch using AdCanvas at tiny scale */}
                  <div style={{ outline: sel ? `2.5px solid ${BLUE}` : `2.5px solid ${BORDER}`, outlineOffset: 1 }}>
                    <AdCanvas format="feed" adTypeId={adType} styleId={s.id} data={DEFAULT_DATA} scale={0.09} />
                  </div>
                  <span style={{ fontSize: 9.5, color: sel ? BLUE : TEXT3, fontWeight: sel ? 700 : 400 }}>{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 8 }}>NOTES <span style={{ fontWeight: 400 }}>(optional)</span></div>
          <textarea placeholder="e.g. Focus on ocean views, aspirational language, target young families..." rows={3}
            style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '8px 10px', fontSize: 12, color: TEXT, fontFamily: 'inherit', lineHeight: 1.5, resize: 'none', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
        </div>

        {/* Output formats info */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '12px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 8 }}>OUTPUT FORMATS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {FORMATS.map(f => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }} />
                <span style={{ fontSize: 11, color: TEXT2 }}><b>{f.label}</b> {f.ratio} · {f.platforms}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: TEXT3, marginTop: 8 }}>All 3 formats generated automatically</div>
        </div>

        <button onClick={generate}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: `linear-gradient(135deg,${BLUE},${PINK})`, border: 'none', color: '#fff', padding: '13px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Sparkles size={14} /> Generate Ad with AI
        </button>
      </div>

      {/* ── Preview / Output ── */}
      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {step === 'form' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 40 }}>
            {/* Live preview of current selection at small scale */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 4 }}>
              <AdCanvas format="story"     adTypeId={adType} styleId={styleId} data={DEFAULT_DATA} scale={0.22} />
              <AdCanvas format="feed"      adTypeId={adType} styleId={styleId} data={DEFAULT_DATA} scale={0.25} />
              <AdCanvas format="landscape" adTypeId={adType} styleId={styleId} data={DEFAULT_DATA} scale={0.2} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 4, letterSpacing: '-0.02em' }}>Live Preview — {selectedType.label} · {STYLES.find(s => s.id === styleId)?.label}</div>
              <div style={{ fontSize: 11.5, color: TEXT3, lineHeight: 1.6 }}>Fill in property details and click Generate to produce your ads</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', maxWidth: 300 }}>
              {[
                { icon: Zap,    label: 'High-converting copy by AI',              color: BLUE  },
                { icon: Layers, label: 'Story, Feed & Landscape automatically',   color: PINK  },
                { icon: Star,   label: 'Brand colours & logo applied',            color: AMBER },
                { icon: Share2, label: 'Post directly to Instagram, FB, LinkedIn',color: GREEN },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', background: `${color}06`, border: `1px solid ${color}15` }}>
                  <Icon size={13} color={color} strokeWidth={1.5} />
                  <span style={{ fontSize: 11.5, color: TEXT2 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 40 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <div style={{ position: 'absolute', inset: 0, border: `3px solid ${BLUE}18`, borderRadius: '50%' }} />
              <div style={{ position: 'absolute', inset: 0, border: `3px solid ${BLUE}`, borderRadius: '50%', borderRightColor: 'transparent', animation: 'spin 1s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} color={BLUE} />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Generating {selectedType.label} ad...</div>
              <div style={{ fontSize: 12, color: TEXT3 }}>
                {progress < 25 ? GEN_STEPS[0] : progress < 55 ? GEN_STEPS[1] : progress < 80 ? GEN_STEPS[2] : GEN_STEPS[3]}
              </div>
            </div>
            <div style={{ width: 260, height: 4, background: `${BLUE}12`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: `linear-gradient(90deg,${BLUE},${PINK})`, transition: 'width 0.1s linear' }} />
            </div>
            <div style={{ fontSize: 11, color: TEXT3 }}>{Math.round(progress)}%</div>
          </div>
        )}

        {step === 'done' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>Generated — {selectedType.label}</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>3 formats ready · {STYLES.find(s=>s.id===styleId)?.label} style</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setStep('form')} style={{ display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '6px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <RefreshCw size={10} /> Regenerate
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: BLUE, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Share2 size={11} /> Post to Social
                </button>
              </div>
            </div>

            {/* The generated ads — real AdCanvas output */}
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 22 }}>
              {FORMATS.map(f => {
                const sc = OUT_SCALE[f.id]
                return (
                  <div key={f.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)' }}>
                      <AdCanvas format={f.id} adTypeId={adType} styleId={styleId} data={liveData} scale={sc} />
                    </div>
                    <div style={{ fontSize: 10.5, color: TEXT3 }}>{f.label} · {f.ratio}</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '4px 10px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Download size={9} /> Save
                      </button>
                      <button style={{ border: `1px solid ${BLUE}30`, background: `${BLUE}08`, color: BLUE, padding: '4px 10px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Post to platforms */}
            <div style={{ border: `1px solid ${BORDER}`, padding: '14px 16px', background: '#fafafa' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Post to platforms</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {([
                  { id: 'instagram', Icon: Instagram, color: '#E1306C', label: 'Instagram' },
                  { id: 'facebook',  Icon: Facebook,  color: '#1877f2', label: 'Facebook'  },
                  { id: 'linkedin',  Icon: Linkedin,  color: '#0a66c2', label: 'LinkedIn'  },
                ] as const).map(({ id, Icon, color, label }) => {
                  const active = platform.includes(id)
                  return (
                    <button key={id} onClick={() => setPlatform(p => active ? p.filter(x => x !== id) : [...p, id])}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: `1.5px solid ${active ? color : BORDER}`, background: active ? `${color}10` : '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <Icon size={12} color={active ? color : TEXT3} />
                      <span style={{ fontSize: 11, color: active ? color : TEXT2, fontWeight: active ? 700 : 400 }}>{label}</span>
                      {active && <CheckCircle size={10} color={color} />}
                    </button>
                  )
                })}
              </div>
              <button style={{ width: '100%', background: `linear-gradient(135deg,${BLUE},${PINK})`, border: 'none', color: '#fff', padding: '10px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Share2 size={13} /> Post to Social Media
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── My Creations ──────────────────────────────────────────────────────────────

const MY_CREATIONS = [
  { id: 1, label: '42 Foreshore Cres — Just Listed', adTypeId: 'just-listed',   styleId: 'modern',  format: 'story',     created: '2 hours ago', platforms: ['instagram','facebook'],           data: { address:'42 Foreshore Cres', suburb:'Cronulla', price:'$2,850,000', beds:4, baths:3, cars:2 } },
  { id: 2, label: '9 Arcadia St — Sold Result',      adTypeId: 'just-sold',     styleId: 'bold',    format: 'feed',      created: 'Yesterday',    platforms: ['instagram'],                      data: { address:'9 Arcadia St', suburb:'Cronulla', price:'$2,550,000', beds:3, baths:2, cars:1 } },
  { id: 3, label: 'Vendor Prospecting — July',        adTypeId: 'prospecting',   styleId: 'luxury',  format: 'story',     created: '3 days ago',   platforms: ['instagram','facebook','linkedin'], data: DEFAULT_DATA },
  { id: 4, label: 'Open Home — 28 Jul',               adTypeId: 'open-home',     styleId: 'vibrant', format: 'feed',      created: '5 days ago',   platforms: ['instagram'],                      data: DEFAULT_DATA },
  { id: 5, label: 'July Market Update',               adTypeId: 'market-update', styleId: 'modern',  format: 'landscape', created: '1 week ago',   platforms: ['facebook','linkedin'],            data: DEFAULT_DATA },
]

function CreationsTab() {
  return (
    <div style={{ padding: '20px 24px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16 }}>
        {MY_CREATIONS.map(cr => {
          const type = AD_TYPES.find(t => t.id === cr.adTypeId)!
          const sc   = cr.format === 'landscape' ? 0.24 : 0.31
          return (
            <div key={cr.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, overflow: 'hidden', cursor: 'pointer' }}>
              {/* Preview */}
              <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', background: '#f1f5f9', padding: cr.format === 'story' ? '12px 12px 0' : '10px 10px 0', minHeight: 120, alignItems: 'flex-end' }}>
                <AdCanvas format={cr.format as any} adTypeId={cr.adTypeId} styleId={cr.styleId} data={cr.data as AdData} scale={sc} />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: TEXT, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cr.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Clock size={10} color={TEXT3} />
                  <span style={{ fontSize: 10, color: TEXT3 }}>{cr.created}</span>
                  <span style={{ fontSize: 10, color: TEXT3, marginLeft: 4 }}>·</span>
                  <span style={{ fontSize: 10, color: type.color, fontWeight: 600 }}>{type.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button style={{ flex: 1, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '5px 0', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}><Download size={9} /> Download</button>
                  <button style={{ flex: 1, background: BLUE, border: 'none', color: '#fff', padding: '5px 0', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}><Share2 size={9} /> Post</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'templates', label: 'Templates',   icon: Layers   },
  { id: 'ai',        label: 'AI Generate', icon: Sparkles },
  { id: 'creations', label: 'My Creations',icon: Star     },
]

export default function CreatorPage() {
  const [tab, setTab] = useState('ai')

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f8fafc' }}>
      <div style={{ padding: '16px 24px 0', background: '#f8fafc', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Creator</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Generate high-converting real estate ads with AI — just listed, just sold, prospecting & more</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Video size={13} /> Video Ad <span style={{ fontSize: 9, background: AMBER, color: '#fff', padding: '1px 5px', fontWeight: 700, marginLeft: 2 }}>NEW</span>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: `linear-gradient(135deg,${BLUE},${PINK})`, border: 'none', color: '#fff', padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={13} /> New Ad
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', borderBottom: tab === id ? `2px solid ${PINK}` : '2px solid transparent', color: tab === id ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Icon size={12} strokeWidth={tab === id ? 2 : 1.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: tab === 'ai' ? '16px 24px 24px' : '0' }}>
        {tab === 'templates' && <TemplatesTab />}
        {tab === 'ai'        && <AIGeneratePanel />}
        {tab === 'creations' && <CreationsTab />}
      </div>
    </div>
  )
}
