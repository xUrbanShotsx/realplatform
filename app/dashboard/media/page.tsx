'use client'
import { useState } from 'react'
import { Image, Video, FileText, Upload, Grid, List } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'
const BLUE = '#4361ee'; const AMBER = '#f59e0b'; const GREEN = '#10b981'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const TABS = ['All', 'Photos', 'Videos', 'Floor Plans', 'Documents']

const MEDIA = [
  { name: 'hero-01.jpg', listing: '42 Foreshore Cres, Cronulla', type: 'Photo', size: '4.2 MB', dims: '4000×2667', date: '20 Jul 2026', tag: 'Hero' },
  { name: 'living-02.jpg', listing: '42 Foreshore Cres, Cronulla', type: 'Photo', size: '3.8 MB', dims: '4000×2667', date: '20 Jul 2026', tag: 'Interior' },
  { name: 'kitchen-03.jpg', listing: '42 Foreshore Cres, Cronulla', type: 'Photo', size: '3.5 MB', dims: '4000×2667', date: '20 Jul 2026', tag: 'Interior' },
  { name: 'aerial-01.jpg', listing: '42 Foreshore Cres, Cronulla', type: 'Photo', size: '6.1 MB', dims: '5472×3648', date: '20 Jul 2026', tag: 'Aerial' },
  { name: 'walkthrough.mp4', listing: '42 Foreshore Cres, Cronulla', type: 'Video', size: '284 MB', dims: '1920×1080', date: '21 Jul 2026', tag: 'Walkthrough' },
  { name: 'floor-plan.pdf', listing: '42 Foreshore Cres, Cronulla', type: 'Floor Plan', size: '1.2 MB', dims: 'A4 PDF', date: '18 Jul 2026', tag: 'Floor Plan' },
  { name: 'hero-01.jpg', listing: '14 Ocean St, Cronulla', type: 'Photo', size: '5.1 MB', dims: '5472×3648', date: '24 Jul 2026', tag: 'Hero' },
  { name: 'exterior-01.jpg', listing: '14 Ocean St, Cronulla', type: 'Photo', size: '4.7 MB', dims: '5472×3648', date: '24 Jul 2026', tag: 'Exterior' },
  { name: 'social-reel.mp4', listing: '14 Ocean St, Cronulla', type: 'Video', size: '48 MB', dims: '1080×1920', date: '25 Jul 2026', tag: 'Social' },
]

const TYPE_ICON: Record<string, React.ElementType> = { Photo: Image, Video: Video, 'Floor Plan': FileText, Document: FileText }
const TYPE_COLOR: Record<string, string> = { Photo: BLUE, Video: '#e3008c', 'Floor Plan': AMBER, Document: '#64748b' }
const TAG_COLOR: Record<string, string> = { Hero: BLUE, Interior: GREEN, Aerial: '#06b6d4', Walkthrough: '#e3008c', 'Floor Plan': AMBER, Exterior: GREEN, Social: '#e3008c' }

export default function MediaPage() {
  const [tab, setTab] = useState(0)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const FILTER_MAP: Record<string, string> = { Photos: 'Photo', Videos: 'Video', 'Floor Plans': 'Floor Plan', Documents: 'Document' }
  const filtered = tab === 0 ? MEDIA : MEDIA.filter(m => m.type === FILTER_MAP[TABS[tab]])

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>Media Library</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Photos, videos and floor plans across all listings</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontFamily: 'inherit' }}>
              {view === 'grid' ? <List size={13} /> : <Grid size={13} />}
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BLUE, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Upload size={12} /> Upload
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: tab === i ? `2px solid ${AMBER}` : '2px solid transparent', color: tab === i ? TEXT : TEXT3, padding: '10px 16px', fontSize: 12, fontWeight: tab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 24px 24px' }}>
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {filtered.map((m, i) => {
              const Icon = TYPE_ICON[m.type] ?? Image
              const color = TYPE_COLOR[m.type] ?? BLUE
              const tagColor = TAG_COLOR[m.tag] ?? TEXT3
              return (
                <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, cursor: 'pointer', overflow: 'hidden' }}>
                  <div style={{ height: 110, background: `${color}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${BORDER}` }}>
                    <Icon size={32} color={`${color}60`} strokeWidth={1} />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: TEXT3, marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.listing}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 9, color: tagColor, background: `${tagColor}12`, padding: '1px 6px', fontWeight: 700 }}>{m.tag}</span>
                      <span style={{ fontSize: 9, color: TEXT3 }}>{m.size}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['File', 'Listing', 'Type', 'Size', 'Dimensions', 'Date'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: TEXT3, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const Icon = TYPE_ICON[m.type] ?? Image
                const color = TYPE_COLOR[m.type] ?? BLUE
                return (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(0,0,0,0.03)`, cursor: 'pointer' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon size={13} color={color} strokeWidth={1.5} />
                        <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{m.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: TEXT2 }}>{m.listing}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: TEXT3 }}>{m.type}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: TEXT2 }}>{m.size}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: TEXT3 }}>{m.dims}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: TEXT3 }}>{m.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
