'use client'
import { useState } from 'react'
import { Map, Layers, Home, Users, TrendingUp, Building2, Eye } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const LAYERS = [
  { id: 'listings',    label: 'Active Listings',    color: AMBER,  count: 8,   on: true  },
  { id: 'sold',        label: 'Sold (90 days)',      color: GREEN,  count: 47,  on: true  },
  { id: 'buyers',      label: 'Active Buyers',       color: BLUE,   count: 34,  on: true  },
  { id: 'investors',   label: 'Investors',           color: PURPLE, count: 12,  on: false },
  { id: 'heat',        label: 'Demand Heat Map',     color: RED,    count: null, on: true  },
  { id: 'das',         label: 'Council DAs',         color: TEAL,   count: 4,   on: false },
  { id: 'flood',       label: 'Flood Zone',          color: BLUE,   count: null, on: false },
  { id: 'bushfire',    label: 'Bushfire Risk',       color: RED,    count: null, on: false },
  { id: 'schools',     label: 'Schools',             color: GREEN,  count: 8,   on: false },
  { id: 'growth',      label: 'Population Growth',   color: PURPLE, count: null, on: false },
  { id: 'yield',       label: 'Rental Yield',        color: AMBER,  count: null, on: false },
]

type Pin = { x: number; y: number; type: 'listing' | 'sold' | 'buyer'; label: string; price: string; color: string }

const PINS: Pin[] = [
  { x: 42, y: 55, type: 'listing', label: '42 Foreshore Cres', price: '$3.2M–$3.6M', color: AMBER  },
  { x: 58, y: 48, type: 'sold',    label: '55 Awaba St (Sold)',  price: '$4.85M',      color: GREEN  },
  { x: 35, y: 62, type: 'buyer',   label: 'Nicki Lihou',        price: 'Budget $2.1M', color: BLUE  },
  { x: 67, y: 41, type: 'sold',    label: '9 Arcadia St (Sold)', price: '$2.55M',      color: GREEN  },
  { x: 51, y: 38, type: 'buyer',   label: 'Tom & Lucy Gardiner', price: 'Budget $2.3M', color: BLUE },
  { x: 29, y: 44, type: 'listing', label: '7 Park Rd',          price: '$2.8M–$3.1M', color: AMBER  },
  { x: 74, y: 60, type: 'buyer',   label: 'James Wu (Investor)', price: 'Budget $1.1M', color: PURPLE},
  { x: 48, y: 70, type: 'sold',    label: '23 Foreshore Pde',   price: '$2.21M',      color: GREEN  },
]

export default function MapsPage() {
  const [layers, setLayers] = useState(LAYERS)
  const [hovPin, setHovPin] = useState<Pin | null>(null)

  const toggle = (id: string) => setLayers(l => l.map(x => x.id === id ? { ...x, on: !x.on } : x))
  const activeLayer = (id: string) => layers.find(l => l.id === id)?.on

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Left: Layer controls */}
      <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <Layers size={13} color={BLUE} />
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Map Layers</span>
          </div>
          <div style={{ fontSize: 11, color: TEXT3 }}>Cronulla & surrounds</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {layers.map(l => (
            <div key={l.id} onClick={() => toggle(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', cursor: 'pointer', opacity: l.on ? 1 : 0.45 }}>
              <div style={{ width: 10, height: 10, background: l.on ? l.color : 'rgba(0,0,0,0.10)', borderRadius: 2, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: TEXT2 }}>{l.label}</span>
              {l.count !== null && <span style={{ fontSize: 10, color: l.on ? l.color : TEXT3, fontWeight: 700 }}>{l.count}</span>}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>LEGEND</div>
          {[{ color: AMBER, label: 'Active Listing' }, { color: GREEN, label: 'Sold' }, { color: BLUE, label: 'Buyer / Investor' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <div style={{ width: 10, height: 10, background: l.color, borderRadius: 9999 }} />
              <span style={{ fontSize: 11, color: TEXT3 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Dark map background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(6,182,212,0.05) 0%, transparent 60%), linear-gradient(180deg, #07090f 0%, #0a0e1a 50%, #0d1420 100%)',
        }}>
          {/* Grid lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: `${(i + 1) * 8}%`, top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.03)' }} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: `${(i + 1) * 11}%`, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.03)' }} />
          ))}

          {/* "Roads" */}
          <div style={{ position: 'absolute', top: '40%', left: '5%', right: '5%', height: 2, background: 'rgba(0,0,0,0.09)' }} />
          <div style={{ position: 'absolute', top: '60%', left: '10%', right: '20%', height: 1, background: 'rgba(0,0,0,0.04)' }} />
          <div style={{ position: 'absolute', left: '45%', top: '20%', bottom: '15%', width: 2, background: 'rgba(0,0,0,0.09)' }} />
          <div style={{ position: 'absolute', left: '65%', top: '25%', bottom: '30%', width: 1, background: 'rgba(0,0,0,0.04)' }} />

          {/* Heat map overlay */}
          {activeLayer('heat') && (
            <div style={{ position: 'absolute', left: '30%', top: '35%', width: 160, height: 120, background: 'radial-gradient(ellipse, rgba(239,68,68,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          )}

          {/* Pins */}
          {PINS.filter(p => activeLayer(p.type) || (p.type === 'listing' && activeLayer('listings')) || (p.type === 'sold' && activeLayer('sold')) || (p.type === 'buyer' && (activeLayer('buyers') || activeLayer('investors')))).map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
              onMouseEnter={() => setHovPin(p)} onMouseLeave={() => setHovPin(null)}>
              <div style={{ width: 12, height: 12, background: p.color, borderRadius: 9999, border: '2px solid rgba(255,255,255,0.8)', cursor: 'pointer', boxShadow: `0 0 8px ${p.color}60` }} />
              {hovPin === p && (
                <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8, background: '#f1f5f9', border: `1px solid ${BORDER}`, padding: '8px 12px', minWidth: 160, whiteSpace: 'nowrap', zIndex: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: p.color, fontWeight: 600 }}>{p.price}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Map controls */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['+', '−'].map(l => (
            <button key={l} style={{ width: 30, height: 30, background: '#ffffff', border: `1px solid ${BORDER}`, color: TEXT, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>{l}</button>
          ))}
        </div>

        {/* Stats overlay */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(15,20,32,0.92)', border: `1px solid ${BORDER}`, padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>AREA SUMMARY — CRONULLA</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[{ label: 'Active', val: '8', color: AMBER }, { label: 'Sold/90d', val: '47', color: GREEN }, { label: 'Buyers', val: '34', color: BLUE }, { label: 'DAs', val: '4', color: TEAL }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color, letterSpacing: '-0.04em' }}>{s.val}</div>
                <div style={{ fontSize: 9, color: TEXT3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
