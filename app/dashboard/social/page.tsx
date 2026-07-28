'use client'
import React, { useState } from 'react'
import { Plus, Instagram, Linkedin, Facebook, CheckCircle, Clock, Edit2, Trash2, Image as ImageIcon, X, ChevronLeft, ChevronRight, BarChart2, Zap, TrendingUp, Eye, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const GREEN = '#10b981'; const AMBER = '#f59e0b'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

// ── Data ─────────────────────────────────────────────────────────────────────

function TikTokIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
    </svg>
  )
}

const ACCOUNTS = [
  { id: 'instagram', name: 'Instagram', Icon: Instagram,  color: '#E1306C', handle: '@spinellire',          followers: '4,821', posts: 284, growth: '+3.2%', connected: true  },
  { id: 'facebook',  name: 'Facebook',  Icon: Facebook,   color: '#1877f2', handle: 'Spinelli RE Cronulla', followers: '2,340', posts: 612, growth: '+1.1%', connected: true  },
  { id: 'linkedin',  name: 'LinkedIn',  Icon: Linkedin,   color: '#0a66c2', handle: 'Spinelli Real Estate', followers: '1,108', posts: 98,  growth: '+4.8%', connected: true  },
  { id: 'tiktok',    name: 'TikTok',   Icon: TikTokIcon, color: '#010101', handle: '@spinellire',           followers: '892',   posts: 34,  growth: '+12%',  connected: false },
]

const QUEUE = [
  { id: 1, platforms: ['instagram', 'facebook'], content: '🏡 Just listed — 42 Foreshore Cres, Cronulla. Stunning ocean views, renovated throughout. Guide $2.85M. Open this Saturday 11:30am–12pm. Link in bio. #cronulla #realestate #oceanviews', scheduledFor: 'Mon 28 Jul · 9:00am', type: 'Listing', hasImage: true },
  { id: 2, platforms: ['instagram'], content: "Sunday's open home at 42 Foreshore Cres saw 14 groups through — one of our biggest winter turnouts 🙌 Cronulla is moving fast. If you're thinking of selling, now is the time. #openhouse #cronullarealestate", scheduledFor: 'Tue 29 Jul · 12:00pm', type: 'Market Update', hasImage: true },
  { id: 3, platforms: ['instagram', 'facebook', 'linkedin'], content: '📊 Cronulla market update — July 2026. Clearance rate: 74%. Median days on market: 18. Median sale price: $2.1M. The data tells a confident story. Thinking about your next move? #cronulla #sydneyproperty', scheduledFor: 'Wed 30 Jul · 10:00am', type: 'Market Report', hasImage: false },
  { id: 4, platforms: ['instagram'], content: 'Behind the scenes at Saturday\'s auction 🔨 Three registered bidders, one very happy vendor. Results like this take strategy, preparation and the right team. #auction #cronulla #realestateresult', scheduledFor: 'Thu 31 Jul · 6:00pm', type: 'Result', hasImage: true },
  { id: 5, platforms: ['facebook', 'linkedin'], content: 'We\'re hiring! Spinelli RE Cronulla is looking for a motivated sales agent to join our growing team. Industry-leading tools, genuine mentorship, and a market that rewards hard work. DM us or email careers@spinellire.com.au', scheduledFor: 'Fri 1 Aug · 11:00am', type: 'Recruitment', hasImage: false },
]

const PUBLISHED = [
  { id: 10, platforms: ['instagram', 'facebook'], content: '🎉 SOLD — 9 Arcadia St, Cronulla. $2.55M. 14 days on market. 3 registered bidders at auction. Another incredible result for our vendors. If you\'re thinking 2026 is your year — let\'s talk.', publishedAt: 'Sun 20 Jul · 11:00am', type: 'Result', reach: 4820, likes: 312, comments: 28, shares: 14 },
  { id: 11, platforms: ['instagram'], content: 'Open home this Saturday — 42 Foreshore Cres, Cronulla. 11:30am–12pm. Be the first to walk through this stunning ocean-view property. Link in bio. #cronulla #openhouse', publishedAt: 'Fri 18 Jul · 3:00pm', type: 'Listing', reach: 3210, likes: 241, comments: 18, shares: 9 },
  { id: 12, platforms: ['linkedin'], content: 'Mid-year market report — Cronulla & Sutherland Shire. Q2 2026 saw record clearance rates and our strongest median sale price since 2022. Full report link in comments.', publishedAt: 'Mon 14 Jul · 9:00am', type: 'Market Report', reach: 1840, likes: 89, comments: 12, shares: 34 },
  { id: 13, platforms: ['instagram', 'facebook'], content: '✨ New listing — 14 Ocean St, Cronulla. 4 bed · 3 bath · double garage. Steps from the beach. Guide $1.65M. Private inspection available this week.', publishedAt: 'Sat 12 Jul · 10:00am', type: 'Listing', reach: 2940, likes: 198, comments: 22, shares: 11 },
]

const TYPE_COLOR: Record<string, string> = {
  Listing: BLUE, 'Market Update': GREEN, 'Market Report': AMBER,
  Result: PINK, Recruitment: '#64748b', Community: '#06b6d4',
}

// Calendar data — posts mapped to day numbers in July 2026
const CAL_POSTS: Record<number, { type: string; platforms: string[] }[]> = {
  14: [{ type: 'Market Report', platforms: ['linkedin'] }],
  18: [{ type: 'Listing', platforms: ['instagram'] }],
  20: [{ type: 'Result', platforms: ['instagram', 'facebook'] }],
  28: [{ type: 'Listing', platforms: ['instagram', 'facebook'] }],
  29: [{ type: 'Market Update', platforms: ['instagram'] }],
  30: [{ type: 'Market Report', platforms: ['instagram', 'facebook', 'linkedin'] }],
  31: [{ type: 'Result', platforms: ['instagram'] }],
}
const CAL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// July 2026 starts on Wednesday (index 2), has 31 days
const JULY_START = 2

// ── Sub-components ────────────────────────────────────────────────────────────

function PlatformPills({ platforms }: { platforms: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {platforms.map(pid => {
        const acc = ACCOUNTS.find(a => a.id === pid)
        if (!acc) return null
        const Icon = acc.Icon
        return (
          <div key={pid} style={{ width: 20, height: 20, background: `${acc.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={10} color={acc.color} />
          </div>
        )
      })}
    </div>
  )
}

type QueuePost = typeof QUEUE[number]

function QueueTab({ posts, onDelete, onEdit }: { posts: QueuePost[]; onDelete: (id: number) => void; onEdit: (post: QueuePost) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {posts.map(post => (
        <div key={post.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, display: 'flex', gap: 0, overflow: 'hidden' }}>
          {post.hasImage && (
            <div style={{ width: 80, flexShrink: 0, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${BORDER}` }}>
              <ImageIcon size={18} color={TEXT3} strokeWidth={1} />
            </div>
          )}
          <div style={{ flex: 1, padding: '13px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <PlatformPills platforms={post.platforms} />
              <span style={{ fontSize: 9, color: TYPE_COLOR[post.type] ?? TEXT3, background: `${TYPE_COLOR[post.type] ?? TEXT3}12`, padding: '1px 7px', fontWeight: 700 }}>{post.type}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                <Clock size={10} color={TEXT3} />
                <span style={{ fontSize: 11, color: TEXT3 }}>{post.scheduledFor}</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: TEXT2, lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>{post.content}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => onEdit(post)} style={{ display: 'flex', alignItems: 'center', gap: 4, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}><Edit2 size={10} /> Edit</button>
              <button onClick={() => onDelete(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, border: `1px solid rgba(239,68,68,0.2)`, background: 'rgba(239,68,68,0.03)', color: '#ef4444', padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}><Trash2 size={10} /> Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PublishedTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {PUBLISHED.map(post => (
        <div key={post.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '13px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <PlatformPills platforms={post.platforms} />
            <span style={{ fontSize: 9, color: TYPE_COLOR[post.type] ?? TEXT3, background: `${TYPE_COLOR[post.type] ?? TEXT3}12`, padding: '1px 7px', fontWeight: 700 }}>{post.type}</span>
            <span style={{ fontSize: 11, color: TEXT3, marginLeft: 'auto' }}>{post.publishedAt}</span>
          </div>
          <div style={{ fontSize: 12.5, color: TEXT2, lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>{post.content}</div>
          <div style={{ display: 'flex', gap: 20, paddingTop: 10, borderTop: `1px solid ${BORDER2}` }}>
            {[
              { icon: Eye,           label: 'Reach',    value: post.reach.toLocaleString() },
              { icon: Heart,         label: 'Likes',    value: post.likes },
              { icon: MessageCircle, label: 'Comments', value: post.comments },
              { icon: Share2,        label: 'Shares',   value: post.shares },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon size={12} color={TEXT3} strokeWidth={1.5} />
                <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{value}</span>
                <span style={{ fontSize: 10, color: TEXT3 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function CalendarTab() {
  const [offset, setOffset] = useState(0)
  const baseYear = 2026, baseMonth = 6 // July = index 6
  const totalMonth = baseMonth + offset
  const year = baseYear + Math.floor(totalMonth / 12)
  const month = ((totalMonth % 12) + 12) % 12
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0
  const cells: (number | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => setOffset(o => o - 1)} style={{ border: `1px solid ${BORDER}`, background: '#fff', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronLeft size={13} /></button>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, flex: 1, textAlign: 'center' }}>{MONTHS[month]} {year}</span>
        <button onClick={() => setOffset(o => o + 1)} style={{ border: `1px solid ${BORDER}`, background: '#fff', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={13} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${BORDER}` }}>
        {CAL_DAYS.map(d => (
          <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 10, fontWeight: 700, color: TEXT3, borderRight: `1px solid ${BORDER}` }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((day, i) => {
          const posts = day ? (CAL_POSTS[day] ?? []) : []
          const isToday = day === 27
          return (
            <div key={i} style={{ minHeight: 80, padding: '6px 8px', borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: isToday ? `${BLUE}05` : '#fff', cursor: day ? 'pointer' : 'default' }}>
              {day && (
                <>
                  <div style={{ fontSize: 11, fontWeight: isToday ? 800 : 400, color: isToday ? BLUE : TEXT2, marginBottom: 4 }}>{day}</div>
                  {posts.map((p, pi) => (
                    <div key={pi} style={{ fontSize: 9, fontWeight: 700, color: TYPE_COLOR[p.type] ?? TEXT3, background: `${TYPE_COLOR[p.type] ?? TEXT3}12`, padding: '1px 5px', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 3, overflow: 'hidden' }}>
                      <div style={{ width: 4, height: 4, background: TYPE_COLOR[p.type], borderRadius: '50%', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.type}</span>
                    </div>
                  ))}
                  {posts.length === 0 && day >= 28 && (
                    <div style={{ fontSize: 9, color: TEXT3, opacity: 0.4, marginTop: 4 }}>+ Add</div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AnalyticsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Followers', value: '9,161', delta: '+4.2%', icon: TrendingUp, color: GREEN },
          { label: 'Total Reach (30d)', value: '32.4K', delta: '+18%', icon: Eye, color: BLUE },
          { label: 'Avg Engagement', value: '4.8%', delta: '+0.6%', icon: Heart, color: PINK },
          { label: 'Posts Published', value: '24', delta: '+6 this month', icon: BarChart2, color: AMBER },
        ].map(({ label, value, delta, icon: Icon, color }) => (
          <div key={label} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={15} color={color} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 10, color: TEXT3, marginTop: 2 }}>{label}</div>
              <div style={{ fontSize: 10, color: GREEN, fontWeight: 700, marginTop: 1 }}>{delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Per-platform breakdown */}
      <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Platform Breakdown — Last 30 Days</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Platform', 'Followers', 'Growth', 'Reach', 'Likes', 'Comments', 'Eng. Rate'].map(h => (
                <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { acc: ACCOUNTS[0], reach: '18,400', likes: 1240, comments: 88, eng: '4.8%' },
              { acc: ACCOUNTS[1], reach: '9,200',  likes: 480,  comments: 34, eng: '2.2%' },
              { acc: ACCOUNTS[2], reach: '4,800',  likes: 210,  comments: 42, eng: '4.1%' },
            ].map(({ acc, reach, likes, comments, eng }) => {
              const Icon = acc.Icon
              return (
                <tr key={acc.id} style={{ borderBottom: `1px solid ${BORDER2}` }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, background: `${acc.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={12} color={acc.color} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>{acc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12.5, fontWeight: 700, color: TEXT }}>{acc.followers}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: GREEN, fontWeight: 700 }}>{acc.growth}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: TEXT2 }}>{reach}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: TEXT2 }}>{likes.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: TEXT2 }}>{comments}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12.5, fontWeight: 700, color: BLUE }}>{eng}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Best performing */}
      <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Best Performing Posts</div>
        {PUBLISHED.map((post, i) => (
          <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: i < PUBLISHED.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: TEXT3, width: 24, textAlign: 'center', flexShrink: 0 }}>#{i + 1}</span>
            <PlatformPills platforms={post.platforms} />
            <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: TEXT2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.content}</div>
            <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{post.reach.toLocaleString()}</div><div style={{ fontSize: 9, color: TEXT3 }}>Reach</div></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 12, fontWeight: 700, color: PINK }}>{post.likes}</div><div style={{ fontSize: 9, color: TEXT3 }}>Likes</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Compose Panel ─────────────────────────────────────────────────────────────

const AI_CAPTIONS = [
  "🏡 Just listed — 42 Foreshore Cres, Cronulla. Stunning ocean views, renovated throughout. Guide $2.85M. Open Saturday 11:30am. #cronulla #realestate",
  "📊 Cronulla market update — clearance rate 74%, median days 18. A confident story for sellers. Book a free appraisal today. #sydneyproperty",
  "✨ Behind the scenes at Saturday's auction — three bidders, one very happy vendor. Results like this take strategy. #cronullarealestate",
]

function ComposePanel({ onClose, onSchedule, initialContent = '' }: { onClose: () => void; onSchedule: (post: { content: string; platforms: string[] }) => void; initialContent?: string }) {
  const [selected, setSelected]     = useState<string[]>(['instagram', 'facebook'])
  const [content, setContent]       = useState(initialContent)
  const [mode, setMode]             = useState<'now' | 'schedule'>('schedule')
  const [showComment, setComment]   = useState(false)
  const [comment, setCommentText]   = useState('')
  const fileRef                     = React.useRef<HTMLInputElement>(null)

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
      {/* Panel */}
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 500, background: '#fff', borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>New Post</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4, display: 'flex' }}><X size={16} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          {/* Post to */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 10 }}>POST TO</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ACCOUNTS.map(a => {
                const active   = selected.includes(a.id)
                const Icon     = a.Icon
                const disabled = !a.connected
                return (
                  <button key={a.id} onClick={() => !disabled && toggle(a.id)} disabled={disabled}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', border: `1.5px solid ${active ? a.color : BORDER}`, background: active ? `${a.color}10` : disabled ? '#f8fafc' : '#fff', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: disabled ? 0.5 : 1 }}>
                    <Icon size={13} color={active ? a.color : TEXT3} />
                    <span style={{ fontSize: 12, color: active ? a.color : TEXT2, fontWeight: active ? 700 : 400 }}>{a.name}</span>
                    {active && <CheckCircle size={11} color={a.color} />}
                    {disabled && <span style={{ fontSize: 9, color: TEXT3 }}>Connect</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Caption */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 8 }}>CAPTION</div>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write your caption... #hashtags @mentions"
              rows={6}
              style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '10px 12px', fontSize: 13, color: TEXT, fontFamily: 'inherit', lineHeight: 1.6, resize: 'vertical', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: content.length > 2000 ? '#ef4444' : TEXT3 }}>{content.length} / 2,200</span>
              <button onClick={() => setComment(v => !v)} style={{ fontSize: 10, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>+ Add first comment</button>
            </div>
            {showComment && (
              <textarea value={comment} onChange={e => setCommentText(e.target.value)} placeholder="First comment (great for hashtags)…" rows={2}
                style={{ width: '100%', marginTop: 8, border: `1px solid ${BORDER}`, padding: '8px 10px', fontSize: 12, fontFamily: 'inherit', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
            )}
          </div>

          {/* AI caption */}
          <div style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}20`, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={13} color={BLUE} />
            <span style={{ fontSize: 12, color: TEXT2, flex: 1 }}>Generate caption with AI — describe your post</span>
            <button onClick={() => setContent(AI_CAPTIONS[Math.floor(Math.random() * AI_CAPTIONS.length)])} style={{ background: BLUE, border: 'none', color: '#fff', padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Generate</button>
          </div>

          {/* Media */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 8 }}>MEDIA</div>
            <div style={{ border: `1.5px dashed ${BORDER}`, padding: '28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: '#fafafa' }}>
              <ImageIcon size={22} color={TEXT3} strokeWidth={1} />
              <span style={{ fontSize: 12, color: TEXT3 }}>Drag photos or videos here</span>
              <span style={{ fontSize: 11, color: TEXT3 }}>JPG, PNG, MP4 · Max 100MB</span>
              <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} />
              <button onClick={() => fileRef.current?.click()} style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '5px 14px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Browse files</button>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 8 }}>WHEN TO POST</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {(['now', 'schedule'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ flex: 1, padding: '8px 0', border: `1.5px solid ${mode === m ? BLUE : BORDER}`, background: mode === m ? `${BLUE}10` : '#fff', color: mode === m ? BLUE : TEXT2, fontSize: 12, fontWeight: mode === m ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {m === 'now' ? 'Post now' : 'Schedule for later'}
                </button>
              ))}
            </div>
            {mode === 'schedule' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: TEXT3, marginBottom: 4 }}>DATE</div>
                  <input type="date" defaultValue="2026-07-28" style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '8px 10px', fontSize: 12, fontFamily: 'inherit', outline: 'none', color: TEXT, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: TEXT3, marginBottom: 4 }}>TIME</div>
                  <input type="time" defaultValue="09:00" style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '8px 10px', fontSize: 12, fontFamily: 'inherit', outline: 'none', color: TEXT, boxSizing: 'border-box' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '10px 0', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={() => { if (content.trim()) { onSchedule({ content, platforms: selected }); onClose() } }} style={{ flex: 2, background: content.trim() ? BLUE : 'rgba(0,0,0,0.08)', border: 'none', color: content.trim() ? '#fff' : TEXT3, padding: '10px 0', fontSize: 13, fontWeight: 700, cursor: content.trim() ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            {mode === 'now' ? 'Post Now' : 'Schedule Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS = ['Queue', 'Published', 'Calendar', 'Analytics']

export default function SocialPage() {
  const [tab, setTab]             = useState(0)
  const [composing, setCompose]   = useState(false)
  const [editPost, setEditPost]   = useState<QueuePost | null>(null)
  const [posts, setPosts]         = useState<QueuePost[]>(QUEUE)
  const [accounts, setAccounts]   = useState(ACCOUNTS)

  const handleDelete = (id: number) => setPosts(prev => prev.filter(p => p.id !== id))
  const handleEdit   = (post: QueuePost) => { setEditPost(post); setCompose(true) }
  const handleSchedule = ({ content, platforms }: { content: string; platforms: string[] }) => {
    if (editPost) {
      setPosts(prev => prev.map(p => p.id === editPost.id ? { ...p, content, platforms } : p))
      setEditPost(null)
    } else {
      setPosts(prev => [...prev, { id: Date.now(), content, platforms, type: 'Listing', scheduledFor: 'Scheduled', hasImage: false }])
    }
  }
  const toggleConnect = (id: string) => setAccounts(prev => prev.map(a => a.id === id ? { ...a, connected: !a.connected } : a))

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc', position: 'relative' }}>
      <div style={{ padding: '20px 24px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Social Media</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Manage, schedule and analyse posts across all platforms</div>
          </div>
          <button onClick={() => setCompose(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: BLUE, border: 'none', color: '#fff', padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={13} /> New Post
          </button>
        </div>

        {/* Connected accounts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {accounts.map(a => {
            const Icon = a.Icon
            return (
              <div key={a.id} style={{ background: '#fff', border: `1px solid ${a.connected ? `${a.color}30` : BORDER}`, padding: '13px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: a.connected ? 10 : 0 }}>
                  <div style={{ width: 30, height: 30, background: a.connected ? `${a.color}12` : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color={a.connected ? a.color : TEXT3} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: a.connected ? TEXT : TEXT3 }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: TEXT3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.connected ? a.handle : 'Not connected'}</div>
                  </div>
                  {a.connected
                    ? <div style={{ width: 7, height: 7, background: GREEN, borderRadius: '50%', flexShrink: 0 }} />
                    : <button onClick={() => toggleConnect(a.id)} style={{ fontSize: 9, fontWeight: 700, color: BLUE, background: `${BLUE}10`, border: `1px solid ${BLUE}25`, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>Connect</button>
                  }
                </div>
                {a.connected && (
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div><div style={{ fontSize: 14, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em', lineHeight: 1 }}>{a.followers}</div><div style={{ fontSize: 9, color: TEXT3, marginTop: 2 }}>Followers</div></div>
                    <div><div style={{ fontSize: 14, fontWeight: 800, color: GREEN, letterSpacing: '-0.02em', lineHeight: 1 }}>{a.growth}</div><div style={{ fontSize: 9, color: TEXT3, marginTop: 2 }}>30d growth</div></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${PINK}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
            <span style={{ fontSize: 11, color: TEXT3 }}>{QUEUE.length} scheduled</span>
            <div style={{ width: 5, height: 5, background: AMBER, borderRadius: '50%' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 24px 32px' }}>
        {tab === 0 && <QueueTab posts={posts} onDelete={handleDelete} onEdit={handleEdit} />}
        {tab === 1 && <PublishedTab />}
        {tab === 2 && <CalendarTab />}
        {tab === 3 && <AnalyticsTab />}
      </div>

      {composing && <ComposePanel onClose={() => { setCompose(false); setEditPost(null) }} onSchedule={handleSchedule} initialContent={editPost?.content ?? ''} />}
    </div>
  )
}
