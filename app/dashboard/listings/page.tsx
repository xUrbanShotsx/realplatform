'use client'
import { useState, useEffect, useCallback } from 'react'
import { List, Eye, Users, TrendingUp, Calendar, Zap, Brain, AlertCircle, Plus, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'; const BG = '#f8fafc'

const TABS = ['Active', 'Coming Soon', 'Under Offer', 'Sold', 'Withdrawn']

type ListingMeta = {
  views?: number
  inspections?: number
  enquiries?: number
  healthScore?: number
  attention?: string
  suggestions?: string[]
  buyerInterest?: number[]
  vendorName?: string
  auctionDate?: string
  method?: string
}

type Listing = {
  id: string
  address: string
  vendor: string
  price: string
  type: string
  status: string
  daysListed: number
  views: number
  inspections: number
  enquiries: number
  method: string
  auctionDate: string
  healthScore: number
  color: string
  attention: string
  suggestions: string[]
  buyerInterest: number[]
}

const DB_STATUS_MAP: Record<string, string> = {
  draft: 'coming_soon',
  active: 'active',
  under_contract: 'under_offer',
  sold: 'sold',
  withdrawn: 'withdrawn',
  off_market: 'coming_soon',
}
const statusLabel: Record<string, string> = { active: 'Active', coming_soon: 'Coming Soon', under_offer: 'Under Offer', sold: 'Sold', withdrawn: 'Withdrawn' }
const statusColor: Record<string, string> = { active: GREEN, coming_soon: BLUE, under_offer: TEAL, sold: PURPLE, withdrawn: TEXT3, draft: AMBER }
const tabFilter: Record<string, string> = { 'Active': 'active', 'Coming Soon': 'coming_soon', 'Under Offer': 'under_offer', 'Sold': 'sold', 'Withdrawn': 'withdrawn' }

function mapListing(row: Record<string, unknown>): Listing {
  const meta = ((row.metadata ?? {}) as ListingMeta)
  const uiStatus = DB_STATUS_MAP[row.status as string] ?? 'active'
  const color = statusColor[uiStatus] ?? GREEN
  const vendorRow = row.vendor as Record<string, string> | null
  const vendorName = meta.vendorName ?? (vendorRow ? [vendorRow.first_name, vendorRow.last_name].filter(Boolean).join(' ') : '')
  const beds = row.bedrooms ? `${row.bedrooms} bed` : ''
  const baths = row.bathrooms ? `${row.bathrooms} bath` : ''
  const propType = (row.property_type as string) ?? 'House'
  const typeStr = [propType.charAt(0).toUpperCase() + propType.slice(1), beds, baths].filter(Boolean).join(' · ')
  const priceDisplay = (row.price_display as string) ?? (row.price ? `$${Number(row.price).toLocaleString()}` : 'POA')

  return {
    id: row.id as string,
    address: [(row.address as string) ?? '', row.suburb ? `, ${row.suburb}` : ''].join(''),
    vendor: vendorName,
    price: priceDisplay,
    type: typeStr,
    status: uiStatus,
    daysListed: (row.days_on_market as number) ?? 0,
    views: meta.views ?? 0,
    inspections: meta.inspections ?? 0,
    enquiries: meta.enquiries ?? 0,
    method: meta.method ?? (row.listing_type as string) ?? 'Auction',
    auctionDate: meta.auctionDate ?? 'TBC',
    healthScore: meta.healthScore ?? 0,
    color,
    attention: meta.attention ?? '',
    suggestions: meta.suggestions ?? [],
    buyerInterest: meta.buyerInterest ?? [],
  }
}

const FORM_DEFAULT = { address: '', suburb: '', propertyType: 'house', bedrooms: '', bathrooms: '', priceDisplay: '', vendorName: '', status: 'active' }

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading]   = useState(true)
  const [orgId, setOrgId]       = useState<string | null>(null)
  const [tab, setTab]           = useState('Active')
  const [sel, setSel]           = useState<Listing | null>(null)
  const [done, setDone]         = useState<string | null>(null)
  const [showNew, setShowNew]   = useState(false)
  const [form, setForm]         = useState(FORM_DEFAULT)
  const [saving, setSaving]     = useState(false)

  const loadListings = useCallback(async (oid: string) => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('listings')
      .select('*, vendor:contacts(first_name, last_name)')
      .eq('org_id', oid)
      .order('created_at', { ascending: false })
    const mapped = (data ?? []).map(mapListing)
    setListings(mapped)
    setLoading(false)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      const { data: profile } = await supabase.from('user_profiles').select('org_id').eq('user_id', user.id).single()
      if (!profile?.org_id) { setLoading(false); return }
      setOrgId(profile.org_id)
      await loadListings(profile.org_id)
    })
  }, [])

  useEffect(() => {
    if (listings.length > 0 && !sel) setSel(listings[0])
  }, [listings])

  const handleSaveListing = async () => {
    if (!orgId || !form.address.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('listings').insert({
      org_id: orgId,
      address: form.address.trim(),
      suburb: form.suburb.trim() || null,
      property_type: form.propertyType,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      price_display: form.priceDisplay.trim() || null,
      status: form.status,
      metadata: form.vendorName ? { vendorName: form.vendorName.trim() } : {},
    })
    setForm(FORM_DEFAULT)
    setShowNew(false)
    setSaving(false)
    await loadListings(orgId)
  }

  const handleDoIt = (action: string) => {
    setDone(action)
    setTimeout(() => setDone(null), 2000)
  }

  const filtered = listings.filter(l => !tabFilter[tab] || l.status === tabFilter[tab])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0, background: '#f8fafc', alignItems: 'center' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${AMBER}` : '2px solid transparent', color: tab === t ? TEXT : TEXT3, padding: '12px 14px', fontSize: 12, fontWeight: tab === t ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {!loading && <div style={{ fontSize: 11, color: TEXT3 }}>{listings.length} total</div>}
          <button onClick={() => setShowNew(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: BLUE, border: 'none', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8 }}>
            <Plus size={12} /> New Listing
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: listing list */}
        <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, overflowY: 'auto' }}>
          {loading && (
            <div style={{ padding: 40, textAlign: 'center', color: TEXT3, fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', opacity: 0.4 }} />
              Loading listings…
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: TEXT3, fontSize: 12 }}>
              <List size={28} color={TEXT3} style={{ opacity: 0.2, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
              {listings.length === 0
                ? <><div style={{ fontWeight: 600, color: TEXT2, marginBottom: 4 }}>No listings yet</div><div style={{ marginBottom: 14 }}>Add your first listing to get started.</div><button onClick={() => setShowNew(true)} style={{ fontSize: 11, color: '#fff', background: BLUE, border: 'none', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>+ New Listing</button></>
                : <div>No listings with {tab} status.</div>
              }
            </div>
          )}
          {!loading && filtered.map((l) => (
            <div key={l.id} onClick={() => setSel(l)} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel?.id === l.id ? 'rgba(0,0,0,0.02)' : 'transparent', borderLeft: `2px solid ${sel?.id === l.id ? l.color : 'transparent'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>{l.address}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{l.type}</div>
                </div>
                <span style={{ fontSize: 9, color: statusColor[l.status], background: `${statusColor[l.status]}15`, padding: '2px 6px', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{statusLabel[l.status]}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: l.color, marginBottom: 5 }}>{l.price}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={9} />{l.views}</span>
                <span style={{ fontSize: 10, color: TEXT3, display: 'flex', alignItems: 'center', gap: 3 }}><Users size={9} />{l.inspections} insp.</span>
                {l.daysListed > 0 && <span style={{ fontSize: 10, color: TEXT3 }}>{l.daysListed}d</span>}
              </div>
              {l.attention && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                  <AlertCircle size={9} color={AMBER} />
                  <span style={{ fontSize: 10, color: AMBER }}>{l.attention}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: AI Listing Manager */}
        {sel ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 3 }}>{sel.address}</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {sel.vendor && <span style={{ fontSize: 11, color: TEXT3 }}>{sel.vendor}</span>}
                <span style={{ fontSize: 9, color: statusColor[sel.status], background: `${statusColor[sel.status]}15`, padding: '2px 7px', fontWeight: 700 }}>{statusLabel[sel.status]}</span>
                <span style={{ fontSize: 11, color: sel.color, fontWeight: 700, marginLeft: 4 }}>{sel.price}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Views',       val: sel.views.toLocaleString(), color: BLUE   },
                { label: 'Inspections', val: `${sel.inspections}`,       color: TEAL   },
                { label: 'Enquiries',   val: `${sel.enquiries}`,         color: PURPLE },
                { label: 'Days Listed', val: sel.daysListed > 0 ? `${sel.daysListed}` : 'Pre-market', color: AMBER },
              ].map(m => (
                <div key={m.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: m.color, letterSpacing: '-0.04em', marginBottom: 2 }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {sel.daysListed > 0 && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em' }}>MARKETING HEALTH</div>
                  <span style={{ fontSize: 11, color: sel.healthScore > 80 ? GREEN : AMBER, fontWeight: 700 }}>{sel.healthScore}/100</span>
                </div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.05)', marginBottom: 12 }}>
                  <div style={{ height: '100%', width: `${sel.healthScore}%`, background: sel.healthScore > 80 ? `linear-gradient(90deg, ${GREEN}, ${TEAL})` : `linear-gradient(90deg, ${AMBER}, ${GREEN})` }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Method',       val: sel.method,      color: BLUE  },
                    { label: 'Auction date', val: sel.auctionDate, color: AMBER },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '8px 0', borderBottom: `1px solid ${BORDER2}` }}>
                      <div style={{ fontSize: 10, color: TEXT3 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sel.buyerInterest.length > 0 && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>BUYER INTEREST TREND</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
                  {sel.buyerInterest.map((v, i) => {
                    const max = Math.max(...sel.buyerInterest)
                    const pct = (v / max) * 100
                    return <div key={i} style={{ flex: 1, height: `${pct}%`, background: `linear-gradient(180deg, ${sel.color}, ${sel.color}60)`, minWidth: 4 }} />
                  })}
                </div>
              </div>
            )}

            {sel.suggestions.length > 0 && (
              <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Brain size={13} color={PINK} />
                  <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI LISTING MANAGER — SUGGESTED ACTIONS</span>
                </div>
                {sel.suggestions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, background: PINK, borderRadius: 9999, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: TEXT2, flex: 1 }}>{s}</span>
                    <button onClick={() => handleDoIt(s)} style={{ background: done === s ? GREEN : PINK, border: 'none', color: '#fff', padding: '3px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background 0.2s', borderRadius: 4 }}>{done === s ? '✓ Done' : 'Do it'}</button>
                  </div>
                ))}
              </div>
            )}

            {sel.suggestions.length === 0 && (
              <div style={{ background: PINK_S, border: `1px solid rgba(227,0,140,0.2)`, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Brain size={13} color={PINK} />
                  <span style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '0.08em' }}>✦ AI LISTING MANAGER</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: TEXT3, fontStyle: 'italic' }}>AI-suggested actions will appear here once listing activity is tracked.</p>
              </div>
            )}
          </div>
        ) : !loading && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: TEXT3 }}>
              <List size={32} style={{ opacity: 0.15, marginBottom: 12 }} />
              <div style={{ fontSize: 13 }}>Select a listing to view details</div>
            </div>
          </div>
        )}
      </div>

      {/* ── New Listing slide-over ── */}
      {showNew && (
        <>
          <div onClick={() => setShowNew(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 10000 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: '#fff', zIndex: 10001, boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>New Listing</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>Add a listing to your agency</div>
              </div>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>STREET ADDRESS <span style={{ color: RED }}>*</span></label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="e.g. 42 Foreshore Crescent"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>SUBURB</label>
                <input value={form.suburb} onChange={e => setForm(f => ({ ...f, suburb: e.target.value }))} placeholder="e.g. Cronulla"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>TYPE</label>
                  <select value={form.propertyType} onChange={e => setForm(f => ({ ...f, propertyType: e.target.value }))}
                    style={{ width: '100%', padding: '9px 10px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8 }}>
                    {['house','unit','land','commercial','rural'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>BEDS</label>
                  <input type="number" min={0} value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} placeholder="4"
                    style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>BATHS</label>
                  <input type="number" min={0} value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} placeholder="2"
                    style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>PRICE / GUIDE</label>
                <input value={form.priceDisplay} onChange={e => setForm(f => ({ ...f, priceDisplay: e.target.value }))} placeholder="e.g. $1.4M–$1.6M or Auction"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>VENDOR NAME</label>
                <input value={form.vendorName} onChange={e => setForm(f => ({ ...f, vendorName: e.target.value }))} placeholder="e.g. Sandra Wilson"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>STATUS</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[['active','Active',GREEN],['coming_soon','Coming Soon',BLUE],['under_offer','Under Offer',TEAL],['sold','Sold',PURPLE]] .map(([val, label, color]) => {
                    const on = form.status === val
                    return (
                      <button key={val} onClick={() => setForm(f => ({ ...f, status: val as string }))}
                        style={{ padding: '5px 12px', fontSize: 11, fontWeight: on ? 700 : 500, border: `1px solid ${on ? `${color}40` : BORDER}`, background: on ? `${color}18` : '#fff', color: on ? color as string : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNew(false)}
                style={{ flex: 1, padding: '10px', background: BG, border: `1px solid ${BORDER}`, color: TEXT2, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8 }}>
                Cancel
              </button>
              <button onClick={handleSaveListing} disabled={saving || !form.address.trim()}
                style={{ flex: 2, padding: '10px', background: saving || !form.address.trim() ? `${BLUE}60` : BLUE, border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving || !form.address.trim() ? 'default' : 'pointer', fontFamily: 'inherit', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : 'Save Listing'}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
