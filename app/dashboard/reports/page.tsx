'use client'
import { useState, useEffect } from 'react'
import { Brain, TrendingUp } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['Agent Performance', 'Marketing ROI', 'Pipeline', 'AI Insights']

const AGENTS = [
  { name: 'Jye San Jurjo', role: 'Principal',     listings: 8, sales: 3, gci: '$58,400', pipeline: '$177.3M', avg: '$19,467', conv: '74', color: BLUE    },
  { name: 'Sarah Mitchell', role: 'Senior Agent', listings: 5, sales: 2, gci: '$32,100', pipeline: '$84.2M',  avg: '$16,050', conv: '67', color: PURPLE  },
  { name: 'Tom Barker',     role: 'Agent',        listings: 3, sales: 1, gci: '$18,400', pipeline: '$42.8M',  avg: '$18,400', conv: '58', color: TEAL    },
]

const CHANNELS = [
  { label: 'realestate.com.au',     leads: 34, cost: '$2,400', cpl: '$70',  gci: '$48,200', roi: 1908, color: '#e34234' },
  { label: 'Social Media (Organic)',leads: 18, cost: '$0',     cpl: '$0',   gci: '$21,400', roi: 9999, color: PINK      },
  { label: 'Domain',                leads: 12, cost: '$1,800', cpl: '$150', gci: '$16,800', roi: 833,  color: '#6e2fcc' },
  { label: 'Referrals',             leads: 9,  cost: '$0',     cpl: '$0',   gci: '$12,400', roi: 9999, color: GREEN     },
  { label: 'Website / SEO',         leads: 7,  cost: '$600',   cpl: '$86',  gci: '$8,200',  roi: 1267, color: BLUE      },
  { label: 'Social Ads',            leads: 5,  cost: '$1,200', cpl: '$240', gci: '$5,400',  roi: 350,  color: AMBER     },
]

const PIPELINE_DATA  = [234, 89, 34, 12, 8, 4, 3]
const PIPELINE_LBLS  = ['Cold', 'Prospect', 'Warm', 'Appraisal', 'Listed', 'U/O', 'Sold']
const PIPELINE_COLS  = ['#475569', BLUE, AMBER, PURPLE, PINK, TEAL, GREEN]

export default function ReportsPage() {
  const [tab, setTab] = useState(0)
  const maxPipe = Math.max(...PIPELINE_DATA)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    const map: Record<string, number> = { roi: 1, pipeline: 2, ai: 3 }
    if (t && map[t] !== undefined) setTab(map[t])
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${TEAL}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '12px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'MTD GCI (Team)', val: '$108.9K', color: GREEN  },
            { label: 'Total Listings', val: '16',      color: AMBER  },
            { label: 'Conversions',    val: '6',       color: BLUE   },
            { label: 'Avg GCI/Sale',   val: '$18,150', color: PURPLE },
          ].map(k => (
            <div key={k.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color, letterSpacing: '-0.04em', marginBottom: 3 }}>{k.val}</div>
              <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {tab === 0 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Agent Performance — July 2026</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['Agent', 'Active Listings', 'Sales MTD', 'GCI MTD', 'Pipeline Value', 'Avg GCI', 'Conv. Rate'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((a, i) => (
                  <tr key={i} style={{ borderBottom: i < AGENTS.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{a.name.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{a.name}</div>
                          <div style={{ fontSize: 10, color: TEXT3 }}>{a.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: TEXT2 }}>{a.listings}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: TEXT2 }}>{a.sales}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: GREEN }}>{a.gci}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: BLUE }}>{a.pipeline}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: TEXT2 }}>{a.avg}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: parseInt(a.conv) > 70 ? GREEN : AMBER, fontWeight: 700 }}>{a.conv}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 1 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: TEXT }}>Marketing ROI by Channel — July 2026</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['Channel', 'Leads', 'Cost', 'Cost/Lead', 'GCI Generated', 'ROI'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map((c, i) => (
                  <tr key={i} style={{ borderBottom: i < CHANNELS.length - 1 ? `1px solid ${BORDER2}` : 'none' }}>
                    <td style={{ padding: '10px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, background: c.color, borderRadius: 9999 }} /><span style={{ fontSize: 12, color: TEXT }}>{c.label}</span></div></td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT2 }}>{c.leads}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT2 }}>{c.cost}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT2 }}>{c.cpl}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: GREEN, fontWeight: 700 }}>{c.gci}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: c.roi > 500 ? GREEN : AMBER, fontWeight: 700 }}>{c.roi === 9999 ? '∞' : `${c.roi}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 2 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Pipeline Funnel</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              {PIPELINE_DATA.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: PIPELINE_COLS[i] }}>{v}</div>
                  <div style={{ width: '100%', height: `${(v / maxPipe) * 160 + 20}px`, background: `${PIPELINE_COLS[i]}20`, border: `1px solid ${PIPELINE_COLS[i]}40`, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${(v / maxPipe) * 100}%`, background: `${PIPELINE_COLS[i]}60` }} />
                  </div>
                  <div style={{ fontSize: 10, color: TEXT3, textAlign: 'center', lineHeight: 1.2 }}>{PIPELINE_LBLS[i]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 3 && (
          <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Brain size={16} color={PINK} />
              <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>AI Business Insights — July 2026</span>
            </div>
            {[
              { heading: 'Conversion rate improvement opportunity:', body: 'Your appraisal-to-listing conversion is 50% (6 listings from 12 appraisals). Industry benchmark is 65%. The 6 unconverted appraisals share a pattern: follow-up took more than 48 hours. Implementing a 24-hour AI nurture sequence post-appraisal could recover 2–3 listings per month.' },
              { heading: 'Best lead source by ROI:', body: 'Referrals and organic social generate your highest GCI per dollar spent (infinite ROI). However, referral leads make up only 10% of total volume. Investing in your Google review strategy and RateMyAgent profile could double referral volume within 6 months.' },
              { heading: 'Growth forecast:', body: 'Based on current pipeline momentum and seasonal patterns, July GCI is tracking to finish at $108.9K (team) — 22% above the same period last year. August is traditionally stronger. If Marcus Thornton and Sandra Wilson list as predicted, August GCI could reach $140K+.' },
            ].map((b, i) => (
              <p key={i} style={{ fontSize: 13, color: TEXT2, lineHeight: 1.9, margin: i < 2 ? '0 0 14px' : 0 }}>
                <strong style={{ color: TEXT }}>{b.heading}</strong> {b.body}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
