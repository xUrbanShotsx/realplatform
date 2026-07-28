'use client'
import { useState } from 'react'
import { Star, MessageSquare, CheckCircle, Clock, AlertCircle, ThumbsUp, Send, Globe } from 'lucide-react'

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
const GOLD      = '#ca5010'

interface ReviewItem {
  id: number
  platform: 'Google' | 'RateMyAgent' | 'Facebook' | 'realestate.com.au'
  platformColor: string
  reviewer: string
  rating: number
  date: string
  excerpt: string
  fullText: string
  status: 'Responded' | 'Needs Response' | 'Flagged'
  statusColor: string
  agent: string
  sentiment: 'Positive' | 'Neutral' | 'Negative'
  suggestedResponse: string
}

const ITEMS: ReviewItem[] = [
  {
    id: 1,
    platform: 'Google',
    platformColor: '#4285F4',
    reviewer: 'Sarah & Tom Mitchell',
    rating: 5,
    date: 'Today',
    excerpt: 'Absolutely incredible experience from start to finish. Jye and the team went above and beyond...',
    fullText: 'Absolutely incredible experience from start to finish. Jye and the team went above and beyond to make our sale as smooth as possible. We had three offers within the first weekend and settled 4 days early. Communication was outstanding — we always knew what was happening. Couldn\'t recommend Spinelli RE more highly. We achieved $210,000 above our reserve. Amazing!',
    status: 'Needs Response',
    statusColor: WARN,
    agent: 'Jye San Jurjo',
    sentiment: 'Positive',
    suggestedResponse: 'Thank you so much, Sarah and Tom! We\'re thrilled the campaign exceeded your expectations — achieving $210,000 above reserve is a testament to the market and our strategy. Congratulations on your move and we hope to see you again when the time is right! 🏡',
  },
  {
    id: 2,
    platform: 'RateMyAgent',
    platformColor: '#00b4d8',
    reviewer: 'James Kowalski',
    rating: 5,
    date: 'Yesterday',
    excerpt: 'Professional, knowledgeable and genuinely caring. Best agent we\'ve ever dealt with...',
    fullText: 'Professional, knowledgeable and genuinely caring. Best agent we\'ve ever dealt with across three property transactions. Marcus had a deep knowledge of the local market and helped us price perfectly for a quick sale. We had six registered bidders at auction and sold for $85K above guide. No hesitation recommending Spinelli RE.',
    status: 'Responded',
    statusColor: SUCCESS,
    agent: 'Marcus Thornton',
    sentiment: 'Positive',
    suggestedResponse: 'Thank you James! Six registered bidders and $85K above guide — that\'s a result we\'re very proud of. It was a pleasure working with you and we appreciate the trust you placed in us across three transactions. Wishing you all the best in your new chapter!',
  },
  {
    id: 3,
    platform: 'Google',
    platformColor: '#4285F4',
    reviewer: 'Linda Chen',
    rating: 3,
    date: '2 days ago',
    excerpt: 'Good agent but communication dropped off after the first week. Had to chase for updates...',
    fullText: 'Good agent but communication dropped off after the first week. Had to chase for updates a couple of times which was frustrating. The result was okay but I felt the auction could have been better prepared. The property sold within our range but I expected more follow-up with buyers prior to auction. Three stars because the outcome was acceptable but the experience could have been smoother.',
    status: 'Needs Response',
    statusColor: WARN,
    agent: 'Sarah Thompson',
    sentiment: 'Neutral',
    suggestedResponse: 'Thank you Linda for your honest feedback. We\'re sorry to hear communication didn\'t meet your expectations at times — this is something we take seriously and have shared with the team. We\'re glad the sale outcome was within your range and hope we can show you an improved experience in the future. Please feel free to reach out directly if you\'d like to discuss further.',
  },
  {
    id: 4,
    platform: 'Facebook',
    platformColor: '#1877F2',
    reviewer: 'Derek & Anita Patel',
    rating: 5,
    date: '3 days ago',
    excerpt: 'From the very first appraisal to settlement day, the experience was first class...',
    fullText: 'From the very first appraisal to settlement day, the experience was first class. The AI tools they use to price and market properties are genuinely impressive — we could see exactly how our listing was performing in real time. Sold in 11 days at auction for a street record. The team at Spinelli are in a league of their own in the Shire.',
    status: 'Responded',
    statusColor: SUCCESS,
    agent: 'Jye San Jurjo',
    sentiment: 'Positive',
    suggestedResponse: 'Derek and Anita, thank you for the wonderful words! A street record in 11 days is an outstanding result — we couldn\'t be prouder of this campaign. We\'re glad our tech tools gave you confidence throughout the process. Congratulations!',
  },
  {
    id: 5,
    platform: 'Google',
    platformColor: '#4285F4',
    reviewer: 'Anonymous',
    rating: 1,
    date: '5 days ago',
    excerpt: 'Would not recommend. Felt pressured during the whole process and the agent...',
    fullText: 'Would not recommend. Felt pressured during the whole process and the agent didn\'t seem to have our best interests at heart. The open homes were poorly managed and we didn\'t receive the communication we were promised. Very disappointing experience. Would use a different agency next time.',
    status: 'Flagged',
    statusColor: DANGER,
    agent: 'Unknown',
    sentiment: 'Negative',
    suggestedResponse: 'We\'re genuinely sorry to hear your experience didn\'t meet our standards. We take all feedback seriously and would appreciate the opportunity to understand what went wrong. Please contact our Principal directly on 02 9527 XXXX or principal@spinellire.com.au so we can address your concerns personally.',
  },
  {
    id: 6,
    platform: 'realestate.com.au',
    platformColor: '#e8003d',
    reviewer: 'The Rodriguez Family',
    rating: 5,
    date: '1 week ago',
    excerpt: 'Marcus sold our home in 7 days at $120K above our reserve. Absolute legend...',
    fullText: 'Marcus sold our home in 7 days at $120K above our reserve. Absolute legend of an agent. He knew every buyer in the market for our type of property and had three competing offers before we even went to market. The off-market approach saved us weeks of stress and thousands in marketing costs. If you\'re selling in Cronulla, call Marcus first.',
    status: 'Responded',
    statusColor: SUCCESS,
    agent: 'Marcus Thornton',
    sentiment: 'Positive',
    suggestedResponse: 'Thank you so much! $120K above reserve off-market is exactly what our buyer matching system is designed to achieve — matching the right buyers to the right properties before they even hit the portals. It was an absolute pleasure and we wish the Rodriguez family all the best!',
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={12} color={s <= rating ? GOLD : TEXT3} fill={s <= rating ? GOLD : 'none'} />
      ))}
    </div>
  )
}

export default function ReputationPage() {
  const [selected, setSelected] = useState(ITEMS[0])
  const [hovered, setHovered] = useState<number | null>(null)
  const [response, setResponse] = useState(ITEMS[0].suggestedResponse)

  function handleSelect(item: ReviewItem) {
    setSelected(item)
    setResponse(item.suggestedResponse)
  }

  const overallRating = (ITEMS.reduce((s, i) => s + i.rating, 0) / ITEMS.length).toFixed(1)
  const needsResponse = ITEMS.filter(i => i.status === 'Needs Response').length

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* List Panel */}
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Summary */}
        <div style={{ padding: '14px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>Reputation Monitor</span>
            {needsResponse > 0 && (
              <span style={{ fontSize: 11, color: WARN, background: `${WARN}18`, padding: '2px 8px', fontWeight: 700 }}>{needsResponse} need response</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 22, color: TEXT, fontWeight: 800 }}>{overallRating}</div>
              <Stars rating={Math.round(parseFloat(overallRating))} />
              <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>Avg across all platforms</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
              {['Google', 'RateMyAgent', 'Facebook'].map(p => (
                <div key={p} style={{ fontSize: 11, color: TEXT2 }}>{p}: <span style={{ color: TEXT, fontWeight: 600 }}>4.{Math.floor(Math.random() * 3) + 2}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ITEMS.map(item => {
            const active = selected.id === item.id
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
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
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 8, height: 8, background: item.platformColor, marginTop: 4, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{item.reviewer}</span>
                      <span style={{ fontSize: 11, color: TEXT3 }}>{item.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                      <Stars rating={item.rating} />
                      <span style={{ fontSize: 11, color: item.statusColor, fontWeight: 600 }}>{item.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.excerpt}</div>
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
                <div style={{ width: 8, height: 8, background: selected.platformColor }} />
                <span style={{ fontSize: 12, color: TEXT2 }}>{selected.platform}</span>
                <span style={{ fontSize: 12, color: TEXT3 }}>·</span>
                <span style={{ fontSize: 12, color: TEXT3 }}>{selected.date}</span>
                <span style={{ fontSize: 12, color: TEXT3 }}>·</span>
                <span style={{ fontSize: 12, color: TEXT2 }}>Agent: {selected.agent}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 15, color: TEXT, fontWeight: 700 }}>{selected.reviewer}</span>
                <Stars rating={selected.rating} />
              </div>
            </div>
            <span style={{ fontSize: 11, color: selected.statusColor, background: `${selected.statusColor}18`, padding: '4px 10px', fontWeight: 600, flexShrink: 0 }}>{selected.status}</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* Sentiment badge */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { label: `Sentiment: ${selected.sentiment}`, color: selected.sentiment === 'Positive' ? SUCCESS : selected.sentiment === 'Negative' ? DANGER : WARN },
              { label: `${selected.rating}/5 stars`, color: TEXT2 },
            ].map(b => (
              <span key={b.label} style={{ fontSize: 11, color: b.color, background: `${b.color}18`, border: `1px solid ${b.color}30`, padding: '3px 8px', fontWeight: 600 }}>{b.label}</span>
            ))}
          </div>

          {/* Full review */}
          <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Full Review</div>
            <p style={{ fontSize: 13, color: TEXT2, margin: 0, lineHeight: 1.8 }}>{selected.fullText}</p>
          </div>

          {/* Response area */}
          {selected.status !== 'Responded' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: TEXT3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Suggested Response</div>
                <span style={{ fontSize: 11, color: PINK }}>✦ AI drafted</span>
              </div>
              <textarea
                value={response}
                onChange={e => setResponse(e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.03)',
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                  fontSize: 13,
                  padding: 12,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                  lineHeight: 1.6,
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button style={{ background: PINK, border: 'none', color: '#fff', padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Send size={12} /> Publish Response
                </button>
                <button style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: TEXT2, padding: '8px 16px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Save Draft
                </button>
              </div>
            </div>
          )}

          {/* Already responded */}
          {selected.status === 'Responded' && (
            <div style={{ background: `${SUCCESS}10`, border: `1px solid ${SUCCESS}30`, padding: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckCircle size={13} color={SUCCESS} />
                <span style={{ fontSize: 12, color: SUCCESS, fontWeight: 600 }}>Response Published</span>
              </div>
              <p style={{ fontSize: 13, color: TEXT2, margin: 0, lineHeight: 1.6 }}>{selected.suggestedResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
