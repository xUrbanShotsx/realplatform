'use client'
import { useState } from 'react'
import { Video, Instagram, Globe, Play, CheckCircle, Clock, Zap, BarChart2, Eye, TrendingUp, Share2 } from 'lucide-react'

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

interface VideoVersion {
  platform: string
  format: string
  duration: string
  status: 'Ready' | 'Processing' | 'Not generated'
  views?: number
  published?: boolean
}

interface VideoItem {
  id: number
  title: string
  address: string
  originalDuration: string
  created: string
  versions: VideoVersion[]
  thumbnail: string
}

const ITEMS: VideoItem[] = [
  {
    id: 1,
    title: '42 Foreshore Cres — Luxury Waterfront',
    address: '42 Foreshore Cres, Cronulla',
    originalDuration: '4:22',
    created: 'Today',
    thumbnail: '#0a2744',
    versions: [
      { platform: 'Instagram Reel', format: '9:16 · 60s', duration: '0:58', status: 'Ready', views: 2840, published: true },
      { platform: 'TikTok', format: '9:16 · 45s', duration: '0:44', status: 'Ready', views: 5120, published: true },
      { platform: 'Facebook Video', format: '16:9 · 90s', duration: '1:28', status: 'Ready', views: 1100, published: true },
      { platform: 'YouTube Short', format: '9:16 · 60s', duration: '0:59', status: 'Ready', views: 780, published: true },
      { platform: 'LinkedIn', format: '16:9 · 2min', duration: '1:55', status: 'Ready', views: 240, published: false },
      { platform: 'Email / SMS', format: 'GIF preview', duration: '0:06', status: 'Ready', published: false },
      { platform: 'Property Website', format: '16:9 · full', duration: '4:22', status: 'Ready', published: true },
      { platform: 'Blog Header Video', format: '16:9 · 20s loop', duration: '0:20', status: 'Ready', published: false },
    ],
  },
  {
    id: 2,
    title: '7 Banksia Rd — Lifestyle Family Home',
    address: '7 Banksia Rd, Caringbah',
    originalDuration: '3:10',
    created: 'Yesterday',
    thumbnail: '#1a2a1a',
    versions: [
      { platform: 'Instagram Reel', format: '9:16 · 60s', duration: '0:57', status: 'Ready', views: 1430, published: true },
      { platform: 'TikTok', format: '9:16 · 45s', duration: '0:43', status: 'Ready', views: 2880, published: true },
      { platform: 'Facebook Video', format: '16:9 · 90s', duration: '1:25', status: 'Ready', views: 620, published: true },
      { platform: 'YouTube Short', format: '9:16 · 60s', duration: '0:55', status: 'Processing', published: false },
      { platform: 'LinkedIn', format: '16:9 · 2min', duration: '1:50', status: 'Not generated', published: false },
      { platform: 'Email / SMS', format: 'GIF preview', duration: '0:06', status: 'Ready', published: false },
      { platform: 'Property Website', format: '16:9 · full', duration: '3:10', status: 'Ready', published: true },
      { platform: 'Blog Header Video', format: '16:9 · 20s loop', duration: '0:20', status: 'Not generated', published: false },
    ],
  },
  {
    id: 3,
    title: 'Suburb Spotlight — Bundeena',
    address: 'Bundeena, Sydney',
    originalDuration: '6:45',
    created: '3 days ago',
    thumbnail: '#1a1a2a',
    versions: [
      { platform: 'Instagram Reel', format: '9:16 · 60s', duration: '0:60', status: 'Ready', views: 9200, published: true },
      { platform: 'TikTok', format: '9:16 · 45s', duration: '0:45', status: 'Ready', views: 18400, published: true },
      { platform: 'Facebook Video', format: '16:9 · 90s', duration: '1:28', status: 'Ready', views: 3100, published: true },
      { platform: 'YouTube Short', format: '9:16 · 60s', duration: '0:60', status: 'Ready', views: 2200, published: true },
      { platform: 'LinkedIn', format: '16:9 · 2min', duration: '1:58', status: 'Ready', views: 880, published: true },
      { platform: 'Email / SMS', format: 'GIF preview', duration: '0:06', status: 'Ready', published: true },
      { platform: 'Property Website', format: '16:9 · full', duration: '6:45', status: 'Ready', published: true },
      { platform: 'Blog Header Video', format: '16:9 · 20s loop', duration: '0:20', status: 'Ready', published: true },
    ],
  },
  {
    id: 4,
    title: '14 Silica St — Beachside Entertainer',
    address: '14 Silica St, Cronulla',
    originalDuration: '2:55',
    created: '5 days ago',
    thumbnail: '#2a1a0a',
    versions: [
      { platform: 'Instagram Reel', format: '9:16 · 60s', duration: '0:58', status: 'Ready', views: 3300, published: true },
      { platform: 'TikTok', format: '9:16 · 45s', duration: '0:44', status: 'Ready', views: 7800, published: true },
      { platform: 'Facebook Video', format: '16:9 · 90s', duration: '1:22', status: 'Ready', views: 1200, published: true },
      { platform: 'YouTube Short', format: '9:16 · 60s', duration: '0:57', status: 'Ready', views: 560, published: true },
      { platform: 'LinkedIn', format: '16:9 · 2min', duration: '1:50', status: 'Not generated', published: false },
      { platform: 'Email / SMS', format: 'GIF preview', duration: '0:06', status: 'Ready', published: true },
      { platform: 'Property Website', format: '16:9 · full', duration: '2:55', status: 'Ready', published: true },
      { platform: 'Blog Header Video', format: '16:9 · 20s loop', duration: '0:20', status: 'Not generated', published: false },
    ],
  },
  {
    id: 5,
    title: 'Agency Brand Video 2026',
    address: 'Spinelli Real Estate',
    originalDuration: '1:45',
    created: '2 weeks ago',
    thumbnail: '#1a0a1a',
    versions: [
      { platform: 'Instagram Reel', format: '9:16 · 60s', duration: '0:58', status: 'Ready', views: 14200, published: true },
      { platform: 'TikTok', format: '9:16 · 45s', duration: '0:44', status: 'Ready', views: 28900, published: true },
      { platform: 'Facebook Video', format: '16:9 · 90s', duration: '1:38', status: 'Ready', views: 4400, published: true },
      { platform: 'YouTube Short', format: '9:16 · 60s', duration: '0:58', status: 'Ready', views: 1900, published: true },
      { platform: 'LinkedIn', format: '16:9 · 2min', duration: '1:45', status: 'Ready', views: 2100, published: true },
      { platform: 'Email / SMS', format: 'GIF preview', duration: '0:06', status: 'Ready', published: true },
      { platform: 'Property Website', format: '16:9 · full', duration: '1:45', status: 'Ready', published: true },
      { platform: 'Blog Header Video', format: '16:9 · 20s loop', duration: '0:20', status: 'Ready', published: true },
    ],
  },
]

const STATUS_COLOR: Record<string, string> = {
  Ready: SUCCESS,
  Processing: WARN,
  'Not generated': TEXT3,
}

export default function VideoAIPage() {
  const [selected, setSelected] = useState(ITEMS[0])
  const [hovered, setHovered] = useState<number | null>(null)

  const totalViews = selected.versions.reduce((sum, v) => sum + (v.views || 0), 0)
  const readyCount = selected.versions.filter(v => v.status === 'Ready').length
  const publishedCount = selected.versions.filter(v => v.published).length

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* List Panel */}
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>Video AI</span>
            <button style={{ background: PINK, color: '#fff', border: 'none', padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              + Upload
            </button>
          </div>
          <span style={{ fontSize: 12, color: TEXT3 }}>Upload any video — AI generates all formats automatically</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ITEMS.map(item => {
            const active = selected.id === item.id
            const totalV = item.versions.reduce((s, v) => s + (v.views || 0), 0)
            const ready = item.versions.filter(v => v.status === 'Ready').length
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
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {/* Thumbnail */}
                  <div style={{ width: 52, height: 36, background: item.thumbnail, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Play size={14} color="rgba(255,255,255,0.5)" fill="rgba(255,255,255,0.5)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: TEXT, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: TEXT3, marginBottom: 3 }}>{item.originalDuration} · {item.created}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, color: TEXT2 }}>{ready}/8 versions ready</span>
                      {totalV > 0 && <span style={{ fontSize: 11, color: TEXT3 }}>· {(totalV / 1000).toFixed(1)}k views</span>}
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
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div>
              <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, margin: '0 0 2px', letterSpacing: '-0.02em' }}>{selected.title}</h2>
              <span style={{ fontSize: 13, color: TEXT2 }}>{selected.address} · Original: {selected.originalDuration} · Uploaded {selected.created}</span>
            </div>
            <button style={{ background: PINK, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <Zap size={12} /> Regenerate All
            </button>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { icon: Video, label: 'Versions', val: `${readyCount}/8 ready` },
              { icon: Share2, label: 'Published', val: `${publishedCount} channels` },
              { icon: Eye, label: 'Total Views', val: totalViews.toLocaleString() },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <s.icon size={12} color={TEXT3} />
                <span style={{ fontSize: 12, color: TEXT3 }}>{s.label}:</span>
                <span style={{ fontSize: 12, color: TEXT, fontWeight: 700 }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Versions list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <div style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Generated Versions</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {selected.versions.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '10px 14px' }}>
                {/* Play thumb */}
                <div style={{ width: 40, height: 28, background: selected.thumbnail, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Play size={11} color="rgba(255,255,255,0.5)" fill="rgba(255,255,255,0.5)" />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: TEXT, fontWeight: 600, marginBottom: 1 }}>{v.platform}</div>
                  <div style={{ fontSize: 11, color: TEXT3 }}>{v.format} · {v.duration}</div>
                </div>

                {/* Views */}
                {v.views !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 70 }}>
                    <Eye size={11} color={TEXT3} />
                    <span style={{ fontSize: 12, color: TEXT2 }}>{v.views.toLocaleString()}</span>
                  </div>
                )}

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 100 }}>
                  {v.status === 'Ready' ? <CheckCircle size={12} color={SUCCESS} /> : v.status === 'Processing' ? <Clock size={12} color={WARN} /> : <div style={{ width: 12 }} />}
                  <span style={{ fontSize: 12, color: STATUS_COLOR[v.status], fontWeight: 600 }}>{v.status}</span>
                </div>

                {/* Action */}
                {v.status === 'Ready' && (
                  <button style={{
                    background: v.published ? 'rgba(0,0,0,0.05)' : PINK,
                    border: v.published ? `1px solid ${BORDER}` : 'none',
                    color: v.published ? TEXT2 : '#fff',
                    padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    {v.published ? 'Published' : 'Publish'}
                  </button>
                )}
                {v.status === 'Not generated' && (
                  <button style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: TEXT2, padding: '5px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Generate
                  </button>
                )}
                {v.status === 'Processing' && (
                  <span style={{ fontSize: 11, color: WARN }}>Processing…</span>
                )}
              </div>
            ))}
          </div>

          {/* AI note */}
          <div style={{ marginTop: 20, background: PINK_SOFT, border: `1px solid rgba(227,0,140,0.2)`, padding: 14 }}>
            <div style={{ fontSize: 11, color: PINK, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>AI Performance Insight</div>
            <p style={{ fontSize: 13, color: TEXT2, margin: 0, lineHeight: 1.6 }}>
              The TikTok version is outperforming all other formats by 3.8×. Consider boosting the Instagram Reel with a $50 ad spend to increase enquiry by an estimated 12–18%. The LinkedIn version has not been published — your investor audience would engage well with this property.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
