'use client'
import { useState } from 'react'
import { Globe, TrendingUp, Eye, FileText, Search, Brain, Plus } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['Landing Pages', 'Listing Pages', 'Blog', 'SEO']

const PAGES = [
  { title: 'Spinelli RE — Home', url: '/', views: 4847, leads: 23, seo: 88, status: 'Live' },
  { title: 'Sell with Spinelli', url: '/sell', views: 1247, leads: 14, seo: 92, status: 'Live' },
  { title: 'Cronulla Market Report', url: '/market-report', views: 892, leads: 8, seo: 79, status: 'Live' },
  { title: 'Buy in Cronulla', url: '/buy', views: 634, leads: 6, seo: 85, status: 'Live' },
  { title: 'About Jye San Jurjo', url: '/about', views: 428, leads: 2, seo: 71, status: 'Live' },
  { title: 'Shell Cove Development', url: '/shell-cove', views: 0, leads: 0, seo: 0, status: 'Draft' },
]

const BLOG_POSTS = [
  { title: 'Why Cronulla House Prices Have Risen 11% in 12 Months', views: 2847, date: '18 Jul', seo: 91 },
  { title: '10 Home Staging Tips That Added $180K to This Sale',       views: 1623, date: '11 Jul', seo: 87 },
  { title: 'The Cronulla Beachside Property Market — Mid-Year 2026',   views: 1247, date: '4 Jul',  seo: 84 },
  { title: 'Why Now is the Best Time to Sell in the Sutherland Shire', views: 892,  date: '28 Jun', seo: 78 },
  { title: 'How to Choose the Right Real Estate Agent in Cronulla',    views: 634,  date: '21 Jun', seo: 82 },
]

const SEO_KEYWORDS = [
  { keyword: 'cronulla real estate agent', position: 1,  change: '↑2', volume: 580  },
  { keyword: 'sell my home cronulla',      position: 2,  change: '↑1', volume: 320  },
  { keyword: 'house for sale cronulla',    position: 3,  change: '→',  volume: 1240 },
  { keyword: 'cronulla property valuation',position: 4,  change: '↑3', volume: 210  },
  { keyword: 'real estate sutherland shire',position: 7, change: '↓1', volume: 890  },
  { keyword: 'cronulla auction results',   position: 5,  change: '↑1', volume: 340  },
]

export default function WebsitePage() {
  const [tab, setTab] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${PURPLE}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '12px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '0 0 0 12px' }}>
          <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}><Plus size={11} /> New Page</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {/* Website stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Monthly Visitors', val: '9,847', color: BLUE   },
            { label: 'Leads Generated', val: '53',    color: GREEN  },
            { label: 'Pages Indexed', val: '24',     color: PURPLE },
            { label: 'Avg SEO Score', val: '83/100', color: AMBER  },
          ].map(k => (
            <div key={k.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: k.color, letterSpacing: '-0.04em', marginBottom: 3 }}>{k.val}</div>
              <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {tab === 0 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Landing Pages</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['Page', 'URL', 'Views/mo', 'Leads', 'SEO Score', 'Status'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAGES.map((p, i) => (
                  <tr key={i} style={{ borderBottom: i < PAGES.length - 1 ? `1px solid ${BORDER2}` : 'none', cursor: 'pointer' }}>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT, fontWeight: 600 }}>{p.title}</td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT3 }}>{p.url}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: BLUE }}>{p.views.toLocaleString()}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: GREEN }}>{p.leads}</td>
                    <td style={{ padding: '10px 16px' }}>
                      {p.seo > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1, height: 4, background: 'rgba(0,0,0,0.05)', maxWidth: 60 }}>
                            <div style={{ height: '100%', width: `${p.seo}%`, background: p.seo > 85 ? GREEN : p.seo > 70 ? AMBER : RED }} />
                          </div>
                          <span style={{ fontSize: 11, color: p.seo > 85 ? GREEN : AMBER, fontWeight: 700 }}>{p.seo}</span>
                        </div>
                      ) : <span style={{ fontSize: 11, color: TEXT3 }}>—</span>}
                    </td>
                    <td style={{ padding: '10px 16px' }}><span style={{ fontSize: 9, color: p.status === 'Live' ? GREEN : AMBER, background: `${p.status === 'Live' ? GREEN : AMBER}15`, padding: '2px 7px', fontWeight: 700 }}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 2 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Blog Posts</span>
              <button style={{ background: PINK, border: 'none', color: '#fff', padding: '5px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}><Brain size={10} /> AI Write</button>
            </div>
            {BLOG_POSTS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '11px 16px', borderBottom: i < BLOG_POSTS.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 3 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: TEXT3 }}>{p.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: BLUE, fontWeight: 700 }}>{p.views.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: TEXT3 }}>views</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: p.seo > 85 ? GREEN : AMBER, fontWeight: 700 }}>{p.seo}</div>
                    <div style={{ fontSize: 9, color: TEXT3 }}>SEO</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 3 && (
          <>
            <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: PINK, fontWeight: 700, marginBottom: 4 }}>✦ AI SEO Recommendation</div>
              <div style={{ fontSize: 12, color: TEXT2 }}>You rank #7 for "real estate sutherland shire" (890 searches/mo). Publishing 2 suburb-specific blog posts this month could move you to top 3 and generate an estimated 12 additional leads. <button style={{ background: 'none', border: 'none', color: PINK, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, padding: 0 }}>Generate posts →</button></div>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Keyword Rankings</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {['Keyword', 'Position', 'Change', 'Monthly Searches'].map(h => (
                      <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SEO_KEYWORDS.map((k, i) => (
                    <tr key={i} style={{ borderBottom: i < SEO_KEYWORDS.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT }}>{k.keyword}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: k.position <= 3 ? GREEN : k.position <= 5 ? AMBER : TEXT2, fontWeight: 700 }}>#{k.position}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: k.change.startsWith('↑') ? GREEN : k.change.startsWith('↓') ? RED : TEXT3 }}>{k.change}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT3 }}>{k.volume.toLocaleString()}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
