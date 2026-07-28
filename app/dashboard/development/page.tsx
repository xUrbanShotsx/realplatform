'use client'

import { useState } from 'react'
import {
  FileText, MoreHorizontal, ArrowLeft, ArrowRight, MapPin,
  Building2, AlertCircle, Brain, Activity, Phone, Mail,
  MessageSquare, CheckCircle2, Clock, TrendingUp,
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

function typeColor(t: string) {
  if (t === 'DA') return BLUE
  if (t === 'Rezoning') return PURPLE
  if (t === 'Subdivision') return TEAL
  if (t === 'Infrastructure') return WARN
  return TEXT3
}
function statusColor(s: string) {
  if (s === 'Approved') return SUCCESS
  if (s === 'Under Assessment') return WARN
  if (s === 'Lodged') return BLUE
  if (s === 'On Exhibition') return PURPLE
  return TEXT3
}

const DEVELOPMENTS = [
  {
    id: 1, address: '210 Military Road', suburb: 'Neutral Bay NSW 2089',
    type: 'Rezoning', council: 'North Sydney Council', lodged: '12 Jun 2026', status: 'On Exhibition',
    description: 'Proposed rezoning of B4 Mixed Use to R4 High Density Residential — 8-storey mixed use development, 84 apartments, ground floor retail. Estimated completion 2029.',
    lotSize: '2,400m²', proposedUse: 'High-density residential + retail', contact: 'planning@northsydney.nsw.gov.au',
    aiAnalysis: 'This rezoning will significantly lift surrounding land values over the next 3–5 years. Properties within 500m are likely to see 8–15% value uplift. Three contacts in our database own property within this radius — proactive engagement now positions you ahead of the market awareness curve.',
    nearby: ['Priya Mehta — 14 Kurraba Road (450m)', 'Jenny Pascoe — 8 Hayes St (380m)', 'David Park — 6 Wycombe Rd (290m)'],
    recommendation: 'Contact Priya Mehta and Jenny Pascoe immediately — frame as a market opportunity. Properties near rezoning zones typically attract developer interest.',
  },
  {
    id: 2, address: '44 Glenmore Road', suburb: 'Paddington NSW 2021',
    type: 'DA', council: 'Woollahra Municipal Council', lodged: '18 Jul 2026', status: 'Lodged',
    description: 'DA for demolition of existing double-storey terrace and construction of a new 4-bedroom luxury dwelling with basement garage, rooftop terrace, and swimming pool. Estimated value: $1.8M.',
    lotSize: '310m²', proposedUse: 'Single dwelling — luxury residential', contact: 'da@woollahra.nsw.gov.au',
    aiAnalysis: 'A luxury DA approval on Glenmore Road will set a new benchmark for the street. The construction disruption may motivate neighbours to sell before or after. The completed home will also be a strong comparable sale for the Kowalski property at #42.',
    nearby: ['James Kowalski — 42 Glenmore Road (next door)', 'Sarah Ng — 46 Glenmore Road (adjacent)'],
    recommendation: 'Notify James Kowalski — his next-door neighbour\'s luxury DA could affect his selling strategy. Frame as: "your neighbour is investing in the street — this actually lifts your value."',
  },
  {
    id: 3, address: '120–130 Cronulla Street', suburb: 'Cronulla NSW 2230',
    type: 'DA', council: 'Sutherland Shire Council', lodged: '2 Jul 2026', status: 'Under Assessment',
    description: 'Proposed multi-dwelling housing development — 6 townhouses, 3 storeys, underground parking. Replaces 2 existing single dwellings.',
    lotSize: '1,800m²', proposedUse: 'Multi-dwelling — 6 x 3-bed townhouses', contact: 'development@sutherland.nsw.gov.au',
    aiAnalysis: 'Townhouse developments signal growing demand density in Cronulla. The construction timeline (est. 18 months) may increase traffic congestion near Elouera Road. This is a moderate opportunity — flag for Sandra Okonkwo and Wendy Farrugia who own properties within 400m.',
    nearby: ['Sandra Okonkwo — 33 Elouera Road (380m)', 'Wendy Farrugia — 5 Burraneer Bay Rd (500m)'],
    recommendation: 'Mention to Sandra: "development is increasing in your suburb — a sign of strong demand. Now could be an ideal time to capitalise before the area densifies further."',
  },
  {
    id: 4, address: 'Lawrence Hargrave Drive Corridor', suburb: 'Thirroul NSW 2515',
    type: 'Infrastructure', council: 'Wollongong City Council', lodged: '1 May 2026', status: 'Approved',
    description: 'State Government approval for Lawrence Hargrave Drive upgrade — 4-lane widening, new pedestrian crossings, cycle path extension. Est. construction start Q4 2026. Likely to ease commute times significantly.',
    lotSize: 'N/A — Public infrastructure', proposedUse: 'Road and active transport infrastructure', contact: 'tmcinfo@transport.nsw.gov.au',
    aiAnalysis: 'Infrastructure improvements consistently drive property value uplift in affected suburbs. Thirroul is already experiencing coastal migration from Sydney. Easier access to Wollongong CBD will accelerate price growth — Brett Calloway\'s beachfront property is well-positioned.',
    nearby: ['Brett Calloway — 22 Thirroul Esplanade (main access road)'],
    recommendation: 'Call Brett Calloway on return from travels — the infrastructure upgrade makes this an ideal time to either sell at peak or hold for future gains.',
  },
  {
    id: 5, address: '78 Pittwater Road', suburb: 'Manly NSW 2095',
    type: 'DA', council: 'Northern Beaches Council', lodged: '25 Jun 2026', status: 'Under Assessment',
    description: 'DA for conversion of commercial premises to 12 residential apartments (mixed-tenure), including 2 affordable housing units. Ground floor retail retained. 5 storeys.',
    lotSize: '820m²', proposedUse: 'Mixed residential and retail', contact: 'da@northernbeaches.nsw.gov.au',
    aiAnalysis: 'Mixed-use DA near Manly\'s commercial core increases housing supply but also validates strong residential demand signals. This may modestly compress values for small apartments nearby but is neutral to positive for houses.',
    nearby: ['Thomas Brennan — 18 Addison Road (600m)'],
    recommendation: 'Neutral for Thomas Brennan\'s house at 18 Addison Road — the DA is for apartments, which reinforces the premium on detached houses in the area.',
  },
  {
    id: 6, address: '5 George Street', suburb: 'Wollongong NSW 2500',
    type: 'Rezoning', council: 'Wollongong City Council', lodged: '10 Apr 2026', status: 'Approved',
    description: 'Rezoning of 5 George Street from B3 Commercial Core to MU1 Mixed Use, enabling 18-storey residential tower with 210 apartments and ground floor retail. Approved by Wollongong Council.',
    lotSize: '3,200m²', proposedUse: 'High-rise mixed use — residential and retail', contact: 'planning@wollongong.nsw.gov.au',
    aiAnalysis: 'Major high-rise rezoning approval in Wollongong CBD is a strong indicator of inner-city population growth projections. This will increase demand for suburban properties in Illawarra for families who prefer lower density. Positive signal for Thirroul, Warilla, and Barrack Point.',
    nearby: ['Mark Spinelli — 42A Headland Parade, Barrack Point (22km)', 'Nicki Lihou — 48 Woodford Ave, Warilla (8km)'],
    recommendation: 'Use in marketing materials to justify Illawarra coastal demand to prospective buyers. Send a "Wollongong is growing fast — here\'s what that means for your suburb" email to relevant contacts.',
  },
  {
    id: 7, address: '22 Bay Road', suburb: 'Mosman NSW 2088',
    type: 'Subdivision', council: 'Mosman Council', lodged: '5 Jul 2026', status: 'Lodged',
    description: 'Application to subdivide existing 1,200m² corner lot into two 600m² Torrens title lots and construct two new dwelling houses.',
    lotSize: '1,200m² (subdividing to 2 × 600m²)', proposedUse: 'Dual dwelling — 2 × 4 bedroom', contact: 'da@mosman.nsw.gov.au',
    aiAnalysis: 'Mosman lot subdivisions are extremely rare due to heritage overlays. Approval would set a precedent and indicate loosening of planning controls. This is a significant signal for land value appreciation in the immediate precinct.',
    nearby: ['Lisa Chen — 7 Raglan Street (300m)'],
    recommendation: 'Mention to Lisa Chen during appraisal — nearby land value signals will support a higher asking price. "Your suburb is being subdivided for the first time in years — demand is extraordinary."',
  },
  {
    id: 8, address: 'Port Kembla Harbour Development Zone', suburb: 'Port Kembla NSW 2505',
    type: 'Infrastructure', council: 'Wollongong City Council', lodged: '1 Feb 2026', status: 'Approved',
    description: 'Federal Government-backed $320M harbour precinct redevelopment — commercial marina, hospitality precinct, light industrial conversion to waterfront residential. 10-year masterplan.',
    lotSize: 'N/A — Precinct-level infrastructure', proposedUse: 'Mixed waterfront precinct redevelopment', contact: 'precinct@wollongong.nsw.gov.au',
    aiAnalysis: 'Port Kembla\'s transformation is one of the most significant waterfront redevelopments in NSW history. It mirrors the Barangaroo effect in Sydney — surrounding residential prices lifted 30%+ over 5 years post-approval. Warilla, Barrack Point, and Shellharbour properties will all benefit.',
    nearby: ['Nicki Lihou — Warilla (3km)', 'Mark Spinelli — Barrack Point (6km)'],
    recommendation: 'Send a detailed email campaign to all Illawarra vendors and investors on the Port Kembla effect. This is a major strategic talking point for the next 12 months.',
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof DEVELOPMENTS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: typeColor(item.type), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building2 size={14} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.address}</span>
            <span style={{ fontSize: 9, padding: '1px 5px', background: `${statusColor(item.status)}18`, color: statusColor(item.status), fontWeight: 700 }}>{item.status}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 11, marginBottom: 4 }}>{item.suburb}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 9, padding: '1px 5px', background: `${typeColor(item.type)}18`, color: typeColor(item.type), fontWeight: 700 }}>{item.type}</span>
            <span style={{ color: TEXT3, fontSize: 10 }}>{item.council.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DevelopmentPage() {
  const [selected, setSelected] = useState(DEVELOPMENTS[0])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Development Intelligence</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>{DEVELOPMENTS.length} active DAs, rezonings & infrastructure</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {DEVELOPMENTS.map(d => <ListRow key={d.id} item={d} selected={selected.id === d.id} onSelect={() => setSelected(d)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{selected.address}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ArrowLeft, ArrowRight, MoreHorizontal].map((Icon, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><Icon size={15} strokeWidth={1.5} /></button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 9, padding: '2px 7px', background: `${typeColor(selected.type)}18`, color: typeColor(selected.type), fontWeight: 700 }}>{selected.type}</span>
              <span style={{ fontSize: 9, padding: '2px 7px', background: `${statusColor(selected.status)}18`, color: statusColor(selected.status), fontWeight: 700 }}>{selected.status}</span>
            </div>
            <div style={{ color: TEXT2, fontSize: 12 }}><MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{selected.suburb} &bull; {selected.council}</div>
            <div style={{ color: TEXT3, fontSize: 11, marginTop: 4 }}>Lodged: {selected.lodged}</div>
          </div>

          {/* Details */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>Development Details</div>
            <div style={{ color: TEXT2, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{selected.description}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{ label: 'Lot Size', value: selected.lotSize },{ label: 'Proposed Use', value: selected.proposedUse },{ label: 'Council Contact', value: selected.contact }].map(r => (
                <div key={r.label} style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '8px 10px' }}>
                  <div style={{ color: TEXT3, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{r.label}</div>
                  <div style={{ color: TEXT2, fontSize: 12 }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis */}
          <div style={{ margin: '16px 20px 0', background: `${PINK}12`, border: `1px solid ${PINK}30`, padding: '12px 16px' }}>
            <div style={{ color: PINK, fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Analysis</div>
            <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{selected.aiAnalysis}</div>
          </div>

          {/* Nearby Contacts */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, marginTop: 16 }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>Contacts in Our Database Nearby</div>
            {selected.nearby.map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <CheckCircle2 size={12} color={BLUE} />
                <span style={{ color: TEXT2, fontSize: 13 }}>{n}</span>
              </div>
            ))}
          </div>

          {/* Recommended Action */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Recommended Action</div>
            <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '12px 14px', color: TEXT2, fontSize: 13, lineHeight: 1.6 }}>{selected.recommendation}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
