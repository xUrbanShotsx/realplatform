'use client'
import { useState, useEffect } from 'react'
import { Megaphone, Plus, Zap, Heart, Share2, Eye, TrendingUp, Clock, Home } from 'lucide-react'

const CARD = '#ffffff'; const CARD2 = '#f1f5f9'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#e1306c', followers: '2.4K'  },
  { id: 'facebook',  label: 'Facebook',  color: '#1877f2', followers: '3.8K'  },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#0a66c2', followers: '1.1K'  },
  { id: 'tiktok',    label: 'TikTok',    color: '#69c9d0', followers: '847'   },
  { id: 'youtube',   label: 'YouTube',   color: '#ff0000', followers: '312'   },
  { id: 'threads',   label: 'Threads',   color: '#fff',    followers: '423'   },
]

const TABS = ['Social Media', 'Content Studio', 'Design Studio', 'AI Video Studio', 'Scheduler']

const POSTS = [
  {
    platform: 'instagram', type: 'Reel',       status: 'scheduled',
    title: 'Just Listed — 42 Foreshore Cres, Cronulla',
    caption: "Ocean views meet modern luxury. This stunning 4-bed home in the heart of Cronulla won't last long. Auction Saturday 9 August. Link in bio. 🌊",
    stats: { views: 0, likes: 0, shares: 0 }, scheduledFor: 'Today 9:00 AM',
    color: '#e1306c',
  },
  {
    platform: 'facebook', type: 'Post',        status: 'published',
    title: 'Cronulla Market Update — July 2026',
    caption: "Cronulla's median house price has risen 11% in the past 12 months. Auction clearance rates hit 74% in July. If you own in the area, now might be the time...",
    stats: { views: 1247, likes: 68, shares: 14 }, scheduledFor: 'Published 2 days ago',
    color: '#1877f2',
  },
  {
    platform: 'linkedin', type: 'Article',     status: 'published',
    title: 'Why Beachside Property Outperforms in Every Cycle',
    caption: "After 11 years selling Cronulla real estate, I\'ve noticed one consistent pattern: properties within 2km of the beach hold their value remarkably well during downturns...",
    stats: { views: 847, likes: 94, shares: 22 }, scheduledFor: 'Published 4 days ago',
    color: '#0a66c2',
  },
  {
    platform: 'instagram', type: 'Carousel',   status: 'draft',
    title: '10 Home Staging Tips That Boosted This Sale by $180K',
    caption: "Slide through to see the before/after transformation at 14 Arcadia St, Bondi. Every room tells a story — make sure it\'s the right one.",
    stats: { views: 0, likes: 0, shares: 0 }, scheduledFor: 'Draft — not scheduled',
    color: '#e1306c',
  },
  {
    platform: 'tiktok',   type: 'Short',       status: 'published',
    title: 'Day in the life of a Cronulla real estate agent',
    caption: "6am beach run → 8am buyer call → 10am open home → 12pm vendor update → 2pm appraisal → 5pm offer negotiations. This is Tuesday. 🏠",
    stats: { views: 8420, likes: 612, shares: 147 }, scheduledFor: 'Published 1 week ago',
    color: '#69c9d0',
  },
  {
    platform: 'facebook', type: 'Video',       status: 'scheduled',
    title: 'Sold! $4.85M at Auction — 55 Awaba St, Mosman',
    caption: "6 bidders. 40 minutes. $4.85M. What an incredible result for the Anderson Family. The Sydney auction market is alive and well.",
    stats: { views: 0, likes: 0, shares: 0 }, scheduledFor: 'Tomorrow 10:00 AM',
    color: '#1877f2',
  },
]

const statusColor = (s: string) => ({ published: GREEN, scheduled: BLUE, draft: TEXT3 }[s] ?? TEXT3)
const statusLabel = (s: string) => ({ published: 'Published', scheduled: 'Scheduled', draft: 'Draft' }[s] ?? s)

export default function MarketingPage() {
  const [tab, setTab] = useState(0)
  const [platform, setPlatform] = useState('all')
  const [sel, setSel] = useState(POSTS[0])

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    const map: Record<string, number> = { content: 1, design: 2, video: 3, scheduler: 4 }
    if (t && map[t] !== undefined) setTab(map[t])
  }, [])

  const filtered = platform === 'all' ? POSTS : POSTS.filter(p => p.platform === platform)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${PINK}` : '2px solid transparent',
            color: tab === i ? TEXT : TEXT3, padding: '12px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400,
            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>{t}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: PINK, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Zap size={11} /> AI Create
          </button>
          <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Plus size={11} /> New Post
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: platform + posts list */}
        <div style={{ width: 360, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Platform row */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>PLATFORMS</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button onClick={() => setPlatform('all')} style={{ padding: '4px 10px', background: platform === 'all' ? `${PINK}20` : 'rgba(0,0,0,0.03)', border: `1px solid ${platform === 'all' ? `${PINK}40` : BORDER}`, color: platform === 'all' ? PINK : TEXT3, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>All</button>
              {PLATFORMS.map(pl => (
                <button key={pl.id} onClick={() => setPlatform(pl.id)} style={{
                  padding: '4px 10px',
                  background: platform === pl.id ? `${pl.color}20` : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${platform === pl.id ? `${pl.color}40` : BORDER}`,
                  color: platform === pl.id ? pl.color : TEXT3, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {pl.label}
                  <span style={{ marginLeft: 5, fontSize: 9, color: TEXT3 }}>{pl.followers}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map((p, i) => {
              const pl = PLATFORMS.find(x => x.id === p.platform)!
              return (
                <div key={i} onClick={() => setSel(p)} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.title === p.title ? `rgba(0,0,0,0.02)` : 'transparent', borderLeft: `2px solid ${sel.title === p.title ? pl.color : 'transparent'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <span style={{ fontSize: 9, color: pl.color, background: `${pl.color}18`, padding: '2px 7px', fontWeight: 700 }}>{pl.label.toUpperCase()}</span>
                    <span style={{ fontSize: 9, color: TEXT3, background: 'rgba(0,0,0,0.04)', padding: '2px 7px', fontWeight: 700 }}>{p.type.toUpperCase()}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 9, color: statusColor(p.status), background: `${statusColor(p.status)}15`, padding: '2px 7px', fontWeight: 700 }}>{statusLabel(p.status)}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: TEXT, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: TEXT3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.caption}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                    {p.status === 'published' && (
                      <>
                        <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={9} />{p.stats.views.toLocaleString()}</span>
                        <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={9} />{p.stats.likes}</span>
                        <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Share2 size={9} />{p.stats.shares}</span>
                      </>
                    )}
                    <span style={{ fontSize: 10, color: TEXT3, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={9} />{p.scheduledFor}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Post detail + composer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: 24 }}>
          {(() => {
            const pl = PLATFORMS.find(x => x.id === sel.platform)!
            return (
              <>
                {/* Post preview */}
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 9, color: pl.color, background: `${pl.color}18`, padding: '2px 7px', fontWeight: 700 }}>{pl.label.toUpperCase()}</span>
                    <span style={{ fontSize: 9, color: TEXT3, background: 'rgba(0,0,0,0.04)', padding: '2px 7px', fontWeight: 700 }}>{sel.type.toUpperCase()}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 9, color: statusColor(sel.status), background: `${statusColor(sel.status)}15`, padding: '2px 7px', fontWeight: 700 }}>{statusLabel(sel.status)}</span>
                  </div>

                  {/* Thumbnail placeholder */}
                  <div style={{ height: 200, background: `linear-gradient(135deg, ${pl.color}20, ${CARD2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 8 }}><Home size={32} strokeWidth={1} color={TEXT3} /></div>
                      <div style={{ fontSize: 11, color: TEXT3 }}>{sel.type} Preview</div>
                    </div>
                  </div>

                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{sel.title}</div>
                    <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.7, margin: '0 0 12px' }}>{sel.caption}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {['#cronullarealestate', '#cronulla', '#sydneyproperty', '#realestate', '#justlisted'].map(tag => (
                        <span key={tag} style={{ fontSize: 11, color: pl.color }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {sel.status === 'published' && (
                    <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 24 }}>
                      {[{ icon: Eye, label: 'Views', val: sel.stats.views }, { icon: Heart, label: 'Likes', val: sel.stats.likes }, { icon: Share2, label: 'Shares', val: sel.stats.shares }, { icon: TrendingUp, label: 'Reach', val: Math.floor(sel.stats.views * 1.4) }].map(s => {
                        const Icon = s.icon
                        return (
                          <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: pl.color, letterSpacing: '-0.03em' }}>{s.val.toLocaleString()}</div>
                            <div style={{ fontSize: 10, color: TEXT3 }}>{s.label}</div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* AI Content actions */}
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>✦ AI CONTENT ACTIONS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {['Repurpose for all platforms', 'Write 5 caption variants', 'Generate hashtag pack', 'Create Story version', 'Translate to Mandarin', 'Schedule best-time posting'].map(a => (
                      <button key={a} style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.15)`, color: PINK, padding: '7px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', lineHeight: 1.4 }}>{a}</button>
                    ))}
                  </div>
                </div>

                {/* Post timing */}
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16 }}>
                  <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>SCHEDULE</div>
                  <div style={{ fontSize: 12, color: TEXT2, marginBottom: 12 }}>{sel.scheduledFor}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {sel.status === 'draft' || sel.status === 'scheduled'
                      ? <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Publish Now</button>
                      : <button style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '8px 16px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Edit Post</button>
                    }
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
