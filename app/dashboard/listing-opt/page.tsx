'use client'

import { useState } from 'react'
import {
  Home, MoreHorizontal, ArrowLeft, ArrowRight,
  AlertCircle, CheckCircle2, Brain, TrendingUp,
  Eye, Star, Zap, Camera,
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

function gradeColor(g: string) {
  if (g === 'A') return SUCCESS
  if (g === 'B') return BLUE
  if (g === 'C') return WARN
  return DANGER
}
function severityColor(s: string) {
  if (s === 'Critical') return DANGER
  if (s === 'High') return WARN
  if (s === 'Medium') return BLUE
  return TEXT3
}

const LISTINGS = [
  {
    id: 1, address: '42 Glenmore Road', suburb: 'Paddington NSW 2021',
    heroGrade: 'B', ctrVsSuburb: '+22%', daysLive: 8,
    headlineScore: 78, descScore: 71,
    heroIssue: 'Hero image is a daytime interior shot — the gorgeous street frontage and natural light are undersold. A twilight exterior is projected to increase CTR by 34%.',
    photoIssues: [
      { photo: 'Photo 1 — Street front', issue: 'Taken midday — harsh shadows, unflattering. Twilight shot recommended.', severity: 'Critical', fix: '+34% CTR with twilight replacement' },
      { photo: 'Photo 3 — Kitchen (pre-listing)', issue: 'Renovation now complete — kitchen photos are outdated and don\'t reflect the new finishes.', severity: 'Critical', fix: 'New kitchen shoot required immediately' },
      { photo: 'Photo 7 — Backyard', issue: 'Car visible in driveway — detracts from the space. Easily removed in reshoot.', severity: 'High', fix: 'Remove car, restage outdoor furniture' },
      { photo: 'Photo 9 — Master bedroom', issue: 'Curtains closed — room appears dark. Open curtains and add lamp.', severity: 'Medium', fix: '+12% engagement on this image' },
      { photo: 'Photo 12 — Living room', issue: 'Coffee table clutter visible. Remove personal items for cleaner composition.', severity: 'Medium', fix: 'Tidy and reshoot in afternoon light' },
    ],
    recommendation: 'Replace hero with twilight, reshoot kitchen, remove car. Estimated total CTR improvement: +48% based on comparable Paddington campaigns.',
  },
  {
    id: 2, address: '48 Woodford Avenue', suburb: 'Warilla NSW 2528',
    heroGrade: 'C', ctrVsSuburb: '-18%', daysLive: 21,
    headlineScore: 54, descScore: 61,
    heroIssue: 'Hero image shows a grassy rear lawn — buyers searching on mobile cannot identify the property type or frontage. Replace with a clear front-on exterior during golden hour.',
    photoIssues: [
      { photo: 'Photo 1 — Rear yard', issue: 'Leads with backyard — buyers don\'t know what they\'re clicking on. Frontage must be hero.', severity: 'Critical', fix: 'Swap to front-on exterior immediately' },
      { photo: 'Photo 4 — Kitchen', issue: 'Dated appliances visible and benches are messy. Staging required before reshoot.', severity: 'High', fix: 'Declutter + stage, then reshoot' },
      { photo: 'Photo 8 — Main bedroom', issue: 'Unmade bed in shot. Basic staging oversight.', severity: 'High', fix: 'Reshoot with styled bed' },
      { photo: 'Photo 11 — Bathroom', issue: 'Toilet lid open. Unflattering angle — shoot from doorway.', severity: 'Medium', fix: 'Quick reshoot, no cost' },
    ],
    recommendation: 'Campaign is underperforming -18% vs suburb average. Immediate hero image swap and kitchen reshoot are mandatory before further portal spend.',
  },
  {
    id: 3, address: '14 Arcadia Street', suburb: 'Bondi Beach NSW 2026',
    heroGrade: 'A', ctrVsSuburb: '+41%', daysLive: 14,
    headlineScore: 92, descScore: 87,
    heroIssue: 'Hero image is a premium twilight exterior — performing exceptionally. No changes required. Maintain current position.',
    photoIssues: [
      { photo: 'Photo 6 — Ocean view', issue: 'Slightly over-edited — artificial colours reduce authenticity. Lighten filter.', severity: 'Medium', fix: 'Minor editing adjustment' },
      { photo: 'Photo 14 — Front garden', issue: 'Bin visible in frame — can be cropped digitally.', severity: 'Medium', fix: 'Digital crop, no reshoot needed' },
    ],
    recommendation: 'Campaign is outperforming suburb average by 41%. Minor photo edits only — do not change hero image or headline as they are performing at A-grade level.',
  },
  {
    id: 4, address: '22 Thirroul Esplanade', suburb: 'Thirroul NSW 2515',
    heroGrade: 'C', ctrVsSuburb: '-29%', daysLive: 12,
    headlineScore: 48, descScore: 55,
    heroIssue: 'Hero image shows the street at a flat angle — completely fails to communicate the ocean views. A drone aerial would increase CTR by an estimated 48% based on comparable coastal campaigns.',
    photoIssues: [
      { photo: 'Photo 1 — Street front', issue: 'Flat street shot — ocean proximity not visible. Drone mandatory for this property.', severity: 'Critical', fix: '+48% CTR with drone aerial' },
      { photo: 'Photo 3 — Living room', issue: 'Ocean view obscured by poor camera angle. Wider lens + centre framing to capture view through windows.', severity: 'Critical', fix: 'Reshoot with view framing' },
      { photo: 'Photo 8 — Alfresco', issue: 'Furniture removed — deck looks empty and unusable. Stage with outdoor dining set.', severity: 'High', fix: 'Stage outdoor furniture' },
      { photo: 'Photo 10 — Guest bedroom', issue: 'Temporary bed frame visible — not styled as a bedroom. Swap for a styled double.', severity: 'Medium', fix: 'Professional staging required' },
      { photo: 'Photo 12 — Bathroom', issue: 'Towels mismatched and worn. Replace with fresh white towels for the shoot.', severity: 'Medium', fix: '$20 fix before reshoot' },
    ],
    recommendation: 'This listing is significantly underperforming. A drone aerial, living room reshoot framing the ocean view, and outdoor staging will transform the campaign. Budget: approximately $600 for drone + styling.',
  },
  {
    id: 5, address: '7 Raglan Street', suburb: 'Mosman NSW 2088',
    heroGrade: 'B', ctrVsSuburb: '+8%', daysLive: 3,
    headlineScore: 82, descScore: 79,
    heroIssue: 'Hero image is solid but the harbour view from the upstairs terrace is not shown. A terrace shot at golden hour would push this to A-grade and significantly increase aspirational buyer engagement.',
    photoIssues: [
      { photo: 'Photo 1 — Front exterior', issue: 'Front gardens could be greener — consider watering heavily 24hrs before reshoot.', severity: 'Medium', fix: 'Water garden before reshoot' },
      { photo: 'Photo 5 — Upstairs terrace', issue: 'Terrace not included in current set — harbour views from here are the property\'s strongest feature.', severity: 'High', fix: 'Add terrace golden-hour shot to top 3 photos' },
    ],
    recommendation: 'Add the harbour-view terrace shot immediately. This is the property\'s most compelling feature and is not currently shown. Should move to hero image position 2.',
  },
  {
    id: 6, address: '18 Railway Avenue', suburb: 'Thirroul NSW 2515',
    heroGrade: 'A', ctrVsSuburb: '+19%', daysLive: 5,
    headlineScore: 88, descScore: 83,
    heroIssue: 'Strong federation exterior photo performing above suburb average. Studio outbuilding is the most unique feature — ensure it features prominently in the photo set order.',
    photoIssues: [
      { photo: 'Photo 9 — Studio', issue: 'Studio outbuilding buried at position 9 — this is the property\'s most unique feature. Move to position 3.', severity: 'High', fix: 'Reorder photos — no reshoot needed' },
      { photo: 'Photo 12 — Veggie garden', issue: 'Garden is a differentiator for this buyer demographic — currently too small in frame. Reshoot to show scale.', severity: 'Medium', fix: 'Wider lens in veggie garden area' },
    ],
    recommendation: 'Reorder photos to feature the studio at position 3. This listing is otherwise well-executed. No hero change required.',
  },
  {
    id: 7, address: '12/42 Union Street', suburb: 'Pyrmont NSW 2009',
    heroGrade: 'B', ctrVsSuburb: '+3%', daysLive: 6,
    headlineScore: 74, descScore: 70,
    heroIssue: 'City view photo is the hero but the balcony is not shown. Buyers purchasing at this price point in Pyrmont are heavily influenced by outdoor space — lead with the balcony city view shot.',
    photoIssues: [
      { photo: 'Photo 1 — Living room', issue: 'Living room as hero — city view not visible from this angle. Balcony shot must be hero.', severity: 'High', fix: 'Swap hero to balcony city view shot' },
      { photo: 'Photo 4 — Kitchen', issue: 'Wide angle distortion makes kitchen appear larger than it is — may disappoint on inspection.', severity: 'Medium', fix: 'Reduce wide angle, natural perspective' },
    ],
    recommendation: 'Swap hero to balcony city view. Current listing is only marginally outperforming — a hero swap could push CTR significantly higher at this price point.',
  },
  {
    id: 8, address: '8 Foreshore Drive', suburb: 'Shellharbour NSW 2529',
    heroGrade: 'D', ctrVsSuburb: '-42%', daysLive: 9,
    headlineScore: 38, descScore: 44,
    heroIssue: 'Hero image is a selfie-style photo taken on a phone — completely unprofessional for a $1.49M listing. Professional photography is non-negotiable. Campaign is in critical failure.',
    photoIssues: [
      { photo: 'Photo 1 — Hero image', issue: 'Taken on a smartphone — blurry, poorly lit, non-professional. This is costing the listing dearly.', severity: 'Critical', fix: 'Full professional photo and video shoot required' },
      { photo: 'All photos', issue: 'Entire photo set is low quality. All photos require replacement by a professional real estate photographer.', severity: 'Critical', fix: 'Book emergency professional shoot' },
    ],
    recommendation: 'URGENT: This listing must be paused and professionally photographed before any further portal spend. The current presentation is actively damaging the campaign and may be reducing sale price.',
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof LISTINGS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  const gc = gradeColor(item.heroGrade)
  const ctrPos = !item.ctrVsSuburb.startsWith('-')
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: gc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>{item.heroGrade}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.address}</span>
            <span style={{ color: ctrPos ? SUCCESS : DANGER, fontSize: 11, fontWeight: 700 }}>{item.ctrVsSuburb}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 11, marginBottom: 3 }}>{item.suburb}</div>
          <div style={{ color: TEXT3, fontSize: 10 }}>{item.daysLive} days live &bull; CTR vs suburb avg</div>
        </div>
      </div>
    </div>
  )
}

export default function ListingOptPage() {
  const [selected, setSelected] = useState(LISTINGS[0])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Listing Optimiser</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>{LISTINGS.length} active listings graded</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {LISTINGS.map(l => <ListRow key={l.id} item={l} selected={selected.id === l.id} onSelect={() => setSelected(l)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Optimisation Report — {selected.address}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ArrowLeft, ArrowRight, MoreHorizontal].map((Icon, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><Icon size={15} strokeWidth={1.5} /></button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Scores */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 16 }}>
            {[
              { label: 'Hero Photo Grade', value: selected.heroGrade, color: gradeColor(selected.heroGrade) },
              { label: 'CTR vs Suburb', value: selected.ctrVsSuburb, color: selected.ctrVsSuburb.startsWith('-') ? DANGER : SUCCESS },
              { label: 'Headline Score', value: `${selected.headlineScore}/100`, color: selected.headlineScore > 80 ? SUCCESS : selected.headlineScore > 60 ? WARN : DANGER },
              { label: 'Description Score', value: `${selected.descScore}/100`, color: selected.descScore > 80 ? SUCCESS : selected.descScore > 60 ? WARN : DANGER },
              { label: 'Days Live', value: `${selected.daysLive}d`, color: TEXT2 },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '10px 16px', flex: 1 }}>
                <div style={{ color: s.color, fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{s.value}</div>
                <div style={{ color: TEXT3, fontSize: 10 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Hero issue */}
          <div style={{ margin: '16px 20px 0', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Camera size={14} color={PINK} />
              <span style={{ color: PINK, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Hero Image Prediction</span>
            </div>
            <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{selected.heroIssue}</div>
          </div>

          {/* Photo issues */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, marginTop: 16 }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Photo Analysis — {selected.photoIssues.length} issues found</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.photoIssues.map((p, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, display: 'flex', gap: 10 }}>
                  <AlertCircle size={14} color={severityColor(p.severity)} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: TEXT, fontSize: 12, fontWeight: 600 }}>{p.photo}</span>
                      <span style={{ fontSize: 9, padding: '1px 5px', background: `${severityColor(p.severity)}18`, color: severityColor(p.severity), fontWeight: 700 }}>{p.severity}</span>
                    </div>
                    <div style={{ color: TEXT2, fontSize: 12, marginBottom: 4 }}>{p.issue}</div>
                    <div style={{ color: SUCCESS, fontSize: 11, fontWeight: 600 }}>Fix: {p.fix}</div>
                  </div>
                  <button style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}30`, color: BLUE, padding: '4px 10px', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit', flexShrink: 0 }}>Apply</button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>AI Recommendation</div>
            <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '12px 14px', color: TEXT2, fontSize: 13, lineHeight: 1.6 }}>{selected.recommendation}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
