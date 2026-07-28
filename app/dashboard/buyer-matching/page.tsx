'use client'

import { useState } from 'react'
import {
  Phone, Mail, MessageSquare, Brain, MoreHorizontal,
  ArrowLeft, ArrowRight, MapPin, Home, Heart,
  CheckCircle2, Calendar, Toggle, TrendingUp,
} from 'lucide-react'

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
const PURPLE    = '#8764b8'
const TEAL      = '#038387'

const AV = ['#0078d4','#8764b8','#038387','#107c10','#d83b01','#c239b3','#ca5010','#0099bc']
function avColor(name: string) { return AV[name.charCodeAt(0) % AV.length] }
function initials(name: string) {
  const p = name.split(' ')
  return p.length >= 2 ? p[0][0] + p[p.length-1][0] : name.slice(0,2)
}

const BUYERS = [
  {
    id: 1, name: 'Priya Mehta', suburb: 'Neutral Bay', budget: '$1.2M–$1.5M', timeline: '3–6 months',
    tags: ['Schools', 'Cafes', 'Walkable', 'Modern'],
    mustHaves: ['3+ bedrooms', 'Car space', 'Natural light', 'Close to transport'],
    niceToHaves: ['Home office', 'Outdoor area', 'Dishwasher', 'New kitchen'],
    matches: [
      { address: '14 Kurraba Road, Neutral Bay', price: '$1.38M', match: 94, beds: 3, baths: 2, notes: 'Renovated, near ferry, light-filled' },
      { address: '7 Hayes Street, Neutral Bay', price: '$1.42M', match: 89, beds: 3, baths: 1, notes: 'Quiet street, walk to café strip' },
      { address: '22 Wycombe Road, Neutral Bay', price: '$1.29M', match: 82, beds: 3, baths: 2, notes: 'Good bones, needs light reno' },
      { address: '5 Rangers Road, Cremorne', price: '$1.35M', match: 77, beds: 3, baths: 1, notes: 'Adjacent suburb, great value' },
    ],
    notify: true,
  },
  {
    id: 2, name: 'Nicki Lihou', suburb: 'Warilla', budget: '$600k–$750k', timeline: '0–3 months',
    tags: ['Pet-friendly', 'Schools', 'Quiet', 'Yard'],
    mustHaves: ['3+ bedrooms', 'Yard (dogs)', 'Study/WFH space', 'Off-street parking'],
    niceToHaves: ['Double garage', 'Close to beach', 'Renovated kitchen', 'Covered alfresco'],
    matches: [
      { address: '48 Woodford Avenue, Warilla', price: '$695k', match: 97, beds: 4, baths: 2, notes: 'Large yard, quiet street, perfect for dogs' },
      { address: '12 Fern Street, Barrack Heights', price: '$649k', match: 88, beds: 3, baths: 2, notes: 'Study nook, good-sized yard' },
      { address: '34 Shellharbour Road, Warilla', price: '$718k', match: 81, beds: 4, baths: 1, notes: 'Extra room, larger block' },
      { address: '9 Princes Highway, Oak Flats', price: '$612k', match: 74, beds: 3, baths: 2, notes: 'Budget-friendly, close to school' },
    ],
    notify: false,
  },
  {
    id: 3, name: 'Ryan O\'Sullivan', suburb: 'Manly', budget: '$2.0M–$2.6M', timeline: '3–6 months',
    tags: ['Beach', 'Luxury', 'Outdoor', 'Views'],
    mustHaves: ['4 bedrooms', 'Ocean or harbour views', 'Double lock-up garage', 'Entertainer layout'],
    niceToHaves: ['Pool', 'Walking distance to beach', 'Media room', 'Wine cellar'],
    matches: [
      { address: '3 Victoria Parade, Manly', price: '$2.45M', match: 92, beds: 4, baths: 3, notes: 'Ocean views, entertainer terrace' },
      { address: '18 Addison Road, Manly', price: '$2.28M', match: 86, beds: 4, baths: 2, notes: 'Pool, double garage' },
      { address: '7 Raglan Street, Manly', price: '$2.55M', match: 81, beds: 4, baths: 3, notes: 'New build, luxury finishes' },
    ],
    notify: true,
  },
  {
    id: 4, name: 'Claire Davenport', suburb: 'Cronulla', budget: '$1.6M–$2.0M', timeline: '6–12 months',
    tags: ['Beach', 'Golf', 'Schools', 'Luxury'],
    mustHaves: ['4 bedrooms', 'Double garage', 'Close to beach', 'Good school catchment'],
    niceToHaves: ['Pool', 'Views', 'Home office', 'North-facing backyard'],
    matches: [
      { address: '21 Elouera Road, Cronulla', price: '$1.88M', match: 91, beds: 4, baths: 2, notes: 'North-facing, 500m to beach' },
      { address: '8 Tonkin Street, Cronulla', price: '$1.75M', match: 84, beds: 4, baths: 2, notes: 'Renovated, good school zone' },
      { address: '15 Oak Street, Caringbah South', price: '$1.65M', match: 76, beds: 4, baths: 2, notes: 'Large block, room for pool' },
    ],
    notify: false,
  },
  {
    id: 5, name: 'David Hartley', suburb: 'Mosman', budget: '$3.5M–$4.5M', timeline: '6–12 months',
    tags: ['Luxury', 'Harbour Views', 'Quiet', 'Prestige'],
    mustHaves: ['5 bedrooms', 'Harbour views', 'Pool', 'Private garden'],
    niceToHaves: ['Home theatre', 'Wine cellar', 'Guest suite', 'Water access'],
    matches: [
      { address: '42 Balmoral Avenue, Mosman', price: '$4.1M', match: 88, beds: 5, baths: 4, notes: 'Harbour views, pool, prestige finish' },
      { address: '11 Raglan Street, Mosman', price: '$3.8M', match: 79, beds: 4, baths: 3, notes: 'Large block, room for extension' },
      { address: '6 Sirius Cove Road, Mosman', price: '$4.3M', match: 74, beds: 5, baths: 3, notes: 'Water views, pool, private jetty access' },
    ],
    notify: true,
  },
  {
    id: 6, name: 'Angela Byrne', suburb: 'Thirroul', budget: '$900k–$1.1M', timeline: '3–6 months',
    tags: ['Beach', 'Art', 'Pet-friendly', 'Village'],
    mustHaves: ['3 bedrooms', 'Yard', 'Character home', 'Close to Thirroul village'],
    niceToHaves: ['Studio space', 'Fireplace', 'Solar', 'Veggie garden'],
    matches: [
      { address: '18 Railway Avenue, Thirroul', price: '$998k', match: 93, beds: 3, baths: 2, notes: 'Federation character, studio out back' },
      { address: '5 Park Road, Thirroul', price: '$960k', match: 87, beds: 3, baths: 1, notes: 'Close to village, large yard' },
      { address: '22 Thirroul Esplanade, Thirroul', price: '$1.08M', match: 79, beds: 3, baths: 2, notes: 'Beachfront views, reno opportunity' },
    ],
    notify: false,
  },
  {
    id: 7, name: 'Mark Spinelli', suburb: 'Barrack Point', budget: '$1.4M–$1.8M', timeline: '12+ months',
    tags: ['Investment', 'Waterfront', 'Off-market', 'High yield'],
    mustHaves: ['Water views or waterfront', 'Rental yield 5%+', 'Off-market preferred', 'Low strata'],
    niceToHaves: ['Short-term rental potential', 'Lock-up garage', 'Renovated', 'Low maintenance'],
    matches: [
      { address: '42A Headland Parade, Barrack Point', price: '$1.65M', match: 95, beds: 4, baths: 2, notes: 'Off-market, ocean views, 5.1% yield est.' },
      { address: '8 Foreshore Drive, Shellharbour', price: '$1.49M', match: 83, beds: 3, baths: 2, notes: 'Lake views, strong holiday rental' },
    ],
    notify: true,
  },
  {
    id: 8, name: 'Sasha Petrov', suburb: 'Pyrmont', budget: '$850k–$1.0M', timeline: '0–3 months',
    tags: ['City Fringe', 'Walkable', 'Modern', 'Low maintenance'],
    mustHaves: ['2 bedrooms', 'Parking', 'City access', 'Modern finishes'],
    niceToHaves: ['Balcony', 'Concierge', 'Gym in building', 'Views'],
    matches: [
      { address: '12/42 Union Street, Pyrmont', price: '$920k', match: 91, beds: 2, baths: 2, notes: 'City views, parking, modern' },
      { address: '8/7 Harris Street, Pyrmont', price: '$875k', match: 85, beds: 2, baths: 1, notes: 'Near light rail, renovated' },
      { address: '22/100 Murray Street, Pyrmont', price: '$990k', match: 78, beds: 2, baths: 2, notes: 'Concierge, pool, top floor' },
    ],
    notify: false,
  },
]

function ListRow({ item, selected, onSelect }: { item: typeof BUYERS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '10px 12px', cursor: 'pointer', background: selected ? BG_SEL : hovered ? BG_HOVER : 'transparent', borderLeft: selected ? `2px solid ${PINK}` : '2px solid transparent', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: avColor(item.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{initials(item.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
            <span style={{ color: TEXT3, fontSize: 11 }}>{item.timeline}</span>
          </div>
          <div style={{ color: TEXT2, fontSize: 12, marginBottom: 4 }}>{item.suburb} &bull; {item.budget}</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {item.tags.slice(0,3).map(t => (
              <span key={t} style={{ fontSize: 9, padding: '1px 5px', background: `${TEAL}18`, color: TEAL, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BuyerMatchingPage() {
  const [selected, setSelected] = useState(BUYERS[0])
  const [notifyMap, setNotifyMap] = useState<Record<number, boolean>>(
    Object.fromEntries(BUYERS.map(b => [b.id, b.notify]))
  )

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, background: BG_LIST, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>Buyer Matching Engine</div>
          <div style={{ color: TEXT2, fontSize: 12 }}>{BUYERS.length} active buyer profiles</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {BUYERS.map(b => <ListRow key={b.id} item={b} selected={selected.id === b.id} onSelect={() => setSelected(b)} />)}
        </div>
      </div>

      <div style={{ flex: 1, background: BG_DETAIL, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Buyer Profile — {selected.name}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ArrowLeft, ArrowRight, MoreHorizontal].map((Icon, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><Icon size={15} strokeWidth={1.5} /></button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, flexShrink: 0, background: avColor(selected.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>{initials(selected.name)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>{selected.name}</span>
                <span style={{ fontSize: 9, padding: '2px 7px', background: `${TEAL}18`, color: TEAL, fontWeight: 700 }}>Buyer</span>
              </div>
              <div style={{ color: TEXT2, fontSize: 12 }}><MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{selected.suburb} &bull; {selected.budget} &bull; {selected.timeline}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ icon: Phone, color: SUCCESS },{ icon: Mail, color: BLUE },{ icon: MessageSquare, color: TEAL }].map((a, i) => {
                const Icon = a.icon
                return <button key={i} style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, color: a.color, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit' }}><Icon size={12} /></button>
              })}
            </div>
          </div>

          {/* Lifestyle tags + criteria */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>Lifestyle Profile</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {selected.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', background: `${TEAL}18`, color: TEAL, fontWeight: 600 }}>{t}</span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '10px 12px' }}>
                <div style={{ color: TEXT3, fontSize: 10, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Must-Haves</div>
                {selected.mustHaves.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <CheckCircle2 size={11} color={SUCCESS} />
                    <span style={{ color: TEXT2, fontSize: 12 }}>{m}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, padding: '10px 12px' }}>
                <div style={{ color: TEXT3, fontSize: 10, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nice-to-Haves</div>
                {selected.niceToHaves.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Heart size={10} color={TEXT3} />
                    <span style={{ color: TEXT2, fontSize: 12 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Matched Properties */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ color: TEXT3, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Matched Properties</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: TEXT3, fontSize: 11 }}>Notify when available</span>
                <div
                  onClick={() => setNotifyMap(m => ({ ...m, [selected.id]: !m[selected.id] }))}
                  style={{ width: 32, height: 18, background: notifyMap[selected.id] ? PINK : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                >
                  <div style={{ position: 'absolute', top: 2, left: notifyMap[selected.id] ? 16 : 2, width: 14, height: 14, background: '#fff', transition: 'left 0.2s' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.matches.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}` }}>
                  <div style={{ width: 36, height: 36, flexShrink: 0, background: `${BLUE}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Home size={16} color={BLUE} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: TEXT, fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{m.address}</div>
                    <div style={{ color: TEXT2, fontSize: 12 }}>{m.beds} bed &bull; {m.baths} bath &bull; {m.price} &bull; {m.notes}</div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ color: m.match >= 90 ? SUCCESS : m.match >= 80 ? WARN : BLUE, fontSize: 16, fontWeight: 700 }}>{m.match}%</div>
                    <div style={{ color: TEXT3, fontSize: 10 }}>match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
