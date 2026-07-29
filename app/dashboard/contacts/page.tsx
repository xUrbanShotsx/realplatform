'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Phone, Mail, MessageSquare, Brain, MapPin, Heart, Home, Search, Users, ChevronDown, X, SlidersHorizontal, Check, Plus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const BG = '#f8fafc'

const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

function contactDays(s: string): number {
  if (!s) return 999
  const sl = s.toLowerCase()
  if (sl === 'today' || sl.includes('min ago') || sl.includes('hr ago') || sl.includes('hrs ago')) return 0
  if (sl === 'yesterday' || sl === '1 day ago') return 1
  const d = sl.match(/(\d+)\s*days? ago/); if (d) return parseInt(d[1])
  const w = sl.match(/(\d+)\s*wks? ago/);  if (w) return parseInt(w[1]) * 7
  if (sl.includes('wk ago')) return 7
  return 999
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const d = new Date(dateStr)
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'Today'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 7200) return '1 hr ago'
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`
  if (diff < 172800) return 'Yesterday'
  const days = Math.floor(diff / 86400)
  if (days <= 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 14) return '1 wk ago'
  return `${Math.floor(days / 7)} wks ago`
}

type ContactMeta = {
  score?: number
  properties?: string[]
  family?: string
  commStyle?: string
  lifeEvent?: string
  aiMemory?: string
  timeline?: { date: string; event: string; color: string }[]
}

type Contact = {
  id: string
  name: string; suburb: string; type: string; typeColor: string; score: number; scoreColor: string
  lastContact: string; phone: string; email: string
  properties: string[]; notes: string; family: string; commStyle: string; lifeEvent: string
  timeline: { date: string; event: string; color: string }[]
  aiMemory: string
}

const TYPE_DISPLAY: Record<string, string> = {
  buyer: 'Buyer', seller: 'Seller', investor: 'Investor',
  landlord: 'Landlord', developer: 'Developer', vendor: 'Seller',
  tenant: 'Landlord', pm_client: 'Landlord', prospect: 'Buyer', other: 'Buyer',
}
const TYPE_COLOR: Record<string, string> = { Buyer: BLUE, Seller: PINK, Investor: AMBER, Landlord: TEAL, Developer: PURPLE }
const ALL_TYPES  = ['Buyer', 'Seller', 'Investor', 'Landlord', 'Developer']
const SORT_OPTIONS = ['Score (high–low)', 'Score (low–high)', 'Name A–Z', 'Recent first']
const LAST_CONTACT_OPTIONS = [
  { label: 'Any time', maxDays: 9999 },
  { label: 'Today',    maxDays: 0 },
  { label: 'This week',maxDays: 7 },
  { label: 'This month',maxDays: 30 },
]
const DETAIL_TABS = ['AI Summary', 'Timeline', 'Family', 'AI Memory']

function mapDbContact(row: Record<string, unknown>): Contact {
  const name = [row.first_name, row.last_name].filter(Boolean).join(' ') || 'Unnamed'
  const type = TYPE_DISPLAY[(row.type as string)] ?? 'Buyer'
  const typeColor = TYPE_COLOR[type] ?? BLUE
  const meta = ((row.metadata ?? {}) as ContactMeta)
  const score = typeof meta.score === 'number' ? meta.score : Math.min(100, ((row.rating as number) ?? 0) * 20)
  const scoreColor = score >= 80 ? RED : score >= 60 ? AMBER : TEAL
  return {
    id: row.id as string,
    name,
    suburb: (row.suburb as string) ?? '',
    type,
    typeColor,
    score,
    scoreColor,
    lastContact: timeAgo(row.updated_at as string),
    phone: (row.phone as string) ?? (row.mobile as string) ?? '',
    email: (row.email as string) ?? '',
    properties: meta.properties ?? [],
    notes: (row.notes as string) ?? '',
    family: meta.family ?? '',
    commStyle: meta.commStyle ?? '',
    lifeEvent: meta.lifeEvent ?? '',
    timeline: meta.timeline ?? [],
    aiMemory: meta.aiMemory ?? '',
  }
}

function FilterChip({ label, active, count, onOpen }: {
  label: string; active: boolean; count?: number; onOpen: (rect: DOMRect) => void
}) {
  return (
    <button
      onClick={e => onOpen((e.currentTarget as HTMLElement).getBoundingClientRect())}
      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: active ? `${BLUE}12` : CARD, border: `1px solid ${active ? `${BLUE}40` : BORDER}`, color: active ? BLUE : TEXT2, fontSize: 11, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, whiteSpace: 'nowrap', userSelect: 'none' }}
    >
      {label}
      {count != null && count > 0 && (
        <span style={{ background: BLUE, color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 9999, lineHeight: 1.4 }}>{count}</span>
      )}
      <ChevronDown size={11} style={{ opacity: 0.5 }} />
    </button>
  )
}

function Dropdown({ top, left, minWidth = 200, children }: { top: number; left: number; minWidth?: number; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', top, left, zIndex: 9999, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', minWidth, padding: '6px 0' }}>
      {children}
    </div>
  )
}

const FORM_DEFAULT = { firstName: '', lastName: '', email: '', phone: '', suburb: '', type: 'buyer', notes: '' }

export default function ContactsPage() {
  const [contacts, setContacts]      = useState<Contact[]>([])
  const [totalCount, setTotalCount]  = useState(0)
  const [loading, setLoading]        = useState(true)
  const [orgId, setOrgId]            = useState<string | null>(null)
  const [showNew, setShowNew]        = useState(false)
  const [form, setForm]              = useState(FORM_DEFAULT)
  const [saving, setSaving]          = useState(false)

  const [sel, setSel]               = useState<Contact | null>(null)
  const [detailTab, setDetailTab]   = useState(0)
  const [search, setSearch]         = useState('')
  const [selectedTypes, setTypes]   = useState<string[]>([])
  const [lastContactIdx, setLCI]    = useState(0)
  const [scoreMin, setScoreMin]     = useState(0)
  const [scoreMax, setScoreMax]     = useState(100)
  const [selectedSuburbs, setSuburbs] = useState<string[]>([])
  const [sortBy, setSortBy]         = useState(SORT_OPTIONS[0])
  const [openDrop, setOpenDrop]     = useState<string | null>(null)
  const [dropAnchor, setDropAnchor] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [showAdvanced, setShowAdv]  = useState(false)
  const [suburbSearch, setSuburbSearch] = useState('')

  const loadContacts = useCallback(async (oid: string) => {
    setLoading(true)
    const supabase = createClient()
    const { data, count } = await supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('org_id', oid)
      .order('updated_at', { ascending: false })
    const mapped = (data ?? []).map(mapDbContact)
    setContacts(mapped)
    setTotalCount(count ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    if (t) {
      const map: Record<string, string> = { buyers: 'Buyer', sellers: 'Seller', investors: 'Investor', landlords: 'Landlord', developers: 'Developer' }
      if (map[t]) setTypes([map[t]])
    }
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('org_id')
        .eq('user_id', user.id)
        .single()
      if (!profile?.org_id) { setLoading(false); return }
      setOrgId(profile.org_id)
      await loadContacts(profile.org_id)
    })
  }, [])

  // Select first contact when list loads
  useEffect(() => {
    if (contacts.length > 0 && !sel) setSel(contacts[0])
  }, [contacts])

  const handleSaveContact = async () => {
    if (!orgId || !form.firstName.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('contacts').insert({
      org_id: orgId,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      suburb: form.suburb.trim() || null,
      type: form.type,
      notes: form.notes.trim() || null,
    })
    setForm(FORM_DEFAULT)
    setShowNew(false)
    setSaving(false)
    await loadContacts(orgId)
  }

  const openDropdown = (name: string, rect: DOMRect) => {
    if (openDrop === name) { setOpenDrop(null); return }
    setDropAnchor({ top: rect.bottom + 6, left: rect.left })
    setOpenDrop(name)
  }

  const allSuburbs = useMemo(() =>
    Array.from(new Set(contacts.map(c => c.suburb.replace(/^(Searching:|Investing:)\s*/i, '').trim()).filter(Boolean))).sort()
  , [contacts])

  const filtered = useMemo(() => {
    const maxDays = LAST_CONTACT_OPTIONS[lastContactIdx].maxDays
    let list = contacts.filter(c => {
      if (selectedTypes.length && !selectedTypes.includes(c.type)) return false
      if (contactDays(c.lastContact) > maxDays) return false
      if (c.score < scoreMin || c.score > scoreMax) return false
      if (selectedSuburbs.length) {
        const sub = c.suburb.replace(/^(Searching:|Investing:)\s*/i, '').trim()
        if (!selectedSuburbs.some(s => sub.toLowerCase().includes(s.toLowerCase()))) return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!c.name.toLowerCase().includes(q) && !c.suburb.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
      }
      return true
    })
    if (sortBy === 'Score (high–low)')  list = [...list].sort((a, b) => b.score - a.score)
    if (sortBy === 'Score (low–high)')  list = [...list].sort((a, b) => a.score - b.score)
    if (sortBy === 'Name A–Z')          list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'Recent first')      list = [...list].sort((a, b) => contactDays(a.lastContact) - contactDays(b.lastContact))
    return list
  }, [contacts, search, selectedTypes, lastContactIdx, scoreMin, scoreMax, selectedSuburbs, sortBy])

  const hasActiveFilters = selectedTypes.length > 0 || lastContactIdx !== 0 || scoreMin > 0 || scoreMax < 100 || selectedSuburbs.length > 0
  const clearAll = () => { setTypes([]); setLCI(0); setScoreMin(0); setScoreMax(100); setSuburbs([]); setSortBy(SORT_OPTIONS[0]); setSearch('') }
  const toggleType = (t: string) => setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  const toggleSuburb = (s: string) => setSuburbs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const filtSuburbs = allSuburbs.filter(s => s.toLowerCase().includes(suburbSearch.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {openDrop && <div onClick={() => setOpenDrop(null)} style={{ position: 'fixed', inset: 0, zIndex: 9998 }} />}

      {/* ── Filter bar ── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>Contacts</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: TEXT3 }}>
              <Users size={11} />{totalCount.toLocaleString()} total
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {hasActiveFilters && (
              <button onClick={clearAll} style={{ fontSize: 11, color: PINK, background: `${PINK}10`, border: `1px solid ${PINK}25`, padding: '3px 10px', borderRadius: 9999, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                Clear all filters
              </button>
            )}
            <button onClick={() => setShowNew(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: BLUE, border: 'none', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8 }}>
              <Plus size={12} /> New Contact
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <Search size={12} color={TEXT3} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, suburb, email…"
              style={{ width: '100%', padding: '6px 10px 6px 28px', border: `1px solid ${BORDER}`, fontSize: 11, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: TEXT3 }}><X size={11} /></button>}
          </div>

          <FilterChip label="Type" active={selectedTypes.length > 0} count={selectedTypes.length} onOpen={r => openDropdown('type', r)} />
          {openDrop === 'type' && (
            <Dropdown top={dropAnchor.top} left={dropAnchor.left}>
              {ALL_TYPES.map(t => (
                <div key={t} onClick={e => { e.stopPropagation(); toggleType(t) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: TEXT2 }}
                  onMouseEnter={e => (e.currentTarget.style.background = BG)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 16, height: 16, border: `2px solid ${selectedTypes.includes(t) ? TYPE_COLOR[t] : BORDER}`, background: selectedTypes.includes(t) ? TYPE_COLOR[t] : 'transparent', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedTypes.includes(t) && <Check size={10} color="#fff" strokeWidth={3} />}
                  </div>
                  <span style={{ color: selectedTypes.includes(t) ? TYPE_COLOR[t] : TEXT2, fontWeight: selectedTypes.includes(t) ? 700 : 400, flex: 1 }}>{t}</span>
                  <span style={{ fontSize: 10, color: TEXT3 }}>{contacts.filter(c => c.type === t).length}</span>
                </div>
              ))}
            </Dropdown>
          )}

          <FilterChip label={lastContactIdx === 0 ? 'Last Contact' : LAST_CONTACT_OPTIONS[lastContactIdx].label} active={lastContactIdx !== 0} onOpen={r => openDropdown('contact', r)} />
          {openDrop === 'contact' && (
            <Dropdown top={dropAnchor.top} left={dropAnchor.left}>
              {LAST_CONTACT_OPTIONS.map((opt, i) => (
                <div key={opt.label} onClick={() => { setLCI(i); setOpenDrop(null) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: lastContactIdx === i ? BLUE : TEXT2, fontWeight: lastContactIdx === i ? 700 : 400, background: lastContactIdx === i ? `${BLUE}08` : 'transparent' }}
                  onMouseEnter={e => { if (lastContactIdx !== i) e.currentTarget.style.background = BG }} onMouseLeave={e => { if (lastContactIdx !== i) e.currentTarget.style.background = 'transparent' }}>
                  {opt.label}
                  {lastContactIdx === i && <Check size={12} color={BLUE} />}
                </div>
              ))}
            </Dropdown>
          )}

          <FilterChip label={scoreMin > 0 || scoreMax < 100 ? `Score ${scoreMin}–${scoreMax}` : 'Score'} active={scoreMin > 0 || scoreMax < 100} onOpen={r => openDropdown('score', r)} />
          {openDrop === 'score' && (
            <Dropdown top={dropAnchor.top} left={dropAnchor.left} minWidth={240}>
              <div style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 10 }}>AI SCORE RANGE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <input type="number" min={0} max={scoreMax} value={scoreMin} onChange={e => setScoreMin(Math.min(Number(e.target.value), scoreMax))}
                    style={{ width: 64, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, borderRadius: 6, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                  <span style={{ color: TEXT3, fontSize: 12 }}>to</span>
                  <input type="number" min={scoreMin} max={100} value={scoreMax} onChange={e => setScoreMax(Math.max(Number(e.target.value), scoreMin))}
                    style={{ width: 64, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, borderRadius: 6, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[['🔴 Hot (80–100)', 80, 100], ['🟡 Warm (60–79)', 60, 79], ['🔵 Cold (0–59)', 0, 59]].map(([l, mn, mx]) => (
                    <button key={String(l)} onClick={() => { setScoreMin(Number(mn)); setScoreMax(Number(mx)); setOpenDrop(null) }}
                      style={{ fontSize: 11, padding: '5px 10px', border: `1px solid ${scoreMin === Number(mn) && scoreMax === Number(mx) ? `${BLUE}40` : BORDER}`, background: scoreMin === Number(mn) && scoreMax === Number(mx) ? `${BLUE}10` : BG, color: scoreMin === Number(mn) && scoreMax === Number(mx) ? BLUE : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, textAlign: 'left', fontWeight: scoreMin === Number(mn) && scoreMax === Number(mx) ? 700 : 400 }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </Dropdown>
          )}

          <FilterChip label={`Sort: ${sortBy.split('(')[0].trim()}`} active={false} onOpen={r => openDropdown('sort', r)} />
          {openDrop === 'sort' && (
            <Dropdown top={dropAnchor.top} left={dropAnchor.left}>
              {SORT_OPTIONS.map(opt => (
                <div key={opt} onClick={() => { setSortBy(opt); setOpenDrop(null) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: sortBy === opt ? BLUE : TEXT2, fontWeight: sortBy === opt ? 700 : 400, background: sortBy === opt ? `${BLUE}08` : 'transparent' }}
                  onMouseEnter={e => { if (sortBy !== opt) e.currentTarget.style.background = BG }} onMouseLeave={e => { if (sortBy !== opt) e.currentTarget.style.background = 'transparent' }}>
                  {opt}
                  {sortBy === opt && <Check size={12} color={BLUE} />}
                </div>
              ))}
            </Dropdown>
          )}

          <button onClick={() => { setShowAdv(v => !v); setOpenDrop(null) }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: showAdvanced ? `${PURPLE}12` : 'transparent', border: `1px solid ${showAdvanced ? `${PURPLE}40` : BORDER}`, color: showAdvanced ? PURPLE : TEXT3, fontSize: 11, fontWeight: showAdvanced ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, marginLeft: 'auto' }}>
            <SlidersHorizontal size={12} /> Advanced
          </button>
        </div>

        {showAdvanced && (
          <div style={{ padding: '12px 20px 14px', borderTop: `1px solid ${BORDER}`, background: `${PURPLE}04` }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>SUBURB</div>
                <div style={{ position: 'relative', marginBottom: 6 }}>
                  <Search size={10} color={TEXT3} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input value={suburbSearch} onChange={e => setSuburbSearch(e.target.value)} placeholder="Filter suburbs…"
                    style={{ width: '100%', padding: '5px 8px 5px 24px', border: `1px solid ${BORDER}`, fontSize: 11, color: TEXT, background: '#fff', fontFamily: 'inherit', outline: 'none', borderRadius: 6, boxSizing: 'border-box' }} />
                </div>
                <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {filtSuburbs.map(s => {
                    const on = selectedSuburbs.includes(s)
                    return (
                      <button key={s} onClick={() => toggleSuburb(s)}
                        style={{ padding: '3px 9px', fontSize: 10, fontWeight: on ? 700 : 400, border: `1px solid ${on ? `${PURPLE}40` : BORDER}`, background: on ? `${PURPLE}12` : '#fff', color: on ? PURPLE : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>
                        {s} {on && '×'}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>AI SCORE RANGE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <input type="number" min={0} max={scoreMax} value={scoreMin} onChange={e => setScoreMin(Math.min(Number(e.target.value), scoreMax))}
                    style={{ width: 64, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, borderRadius: 6, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                  <span style={{ color: TEXT3, fontSize: 12 }}>–</span>
                  <input type="number" min={scoreMin} max={100} value={scoreMax} onChange={e => setScoreMax(Math.max(Number(e.target.value), scoreMin))}
                    style={{ width: 64, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, borderRadius: 6, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[['Hot (80–100)', 80, 100], ['Warm (60–79)', 60, 79], ['Cold (0–59)', 0, 59]].map(([l, mn, mx]) => (
                    <button key={String(l)} onClick={() => { setScoreMin(Number(mn)); setScoreMax(Number(mx)) }}
                      style={{ fontSize: 10, padding: '4px 10px', border: `1px solid ${BORDER}`, background: scoreMin === mn && scoreMax === mx ? `${BLUE}12` : '#fff', color: scoreMin === mn && scoreMax === mx ? BLUE : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, fontWeight: scoreMin === mn && scoreMax === mx ? 700 : 400, textAlign: 'left' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>LAST CONTACT</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {LAST_CONTACT_OPTIONS.map((opt, i) => (
                    <button key={opt.label} onClick={() => setLCI(i)}
                      style={{ fontSize: 11, padding: '5px 12px', border: `1px solid ${lastContactIdx === i ? `${BLUE}40` : BORDER}`, background: lastContactIdx === i ? `${BLUE}10` : '#fff', color: lastContactIdx === i ? BLUE : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, fontWeight: lastContactIdx === i ? 700 : 400, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {lastContactIdx === i && <Check size={11} color={BLUE} />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {selectedSuburbs.length > 0 && (
                <div style={{ flex: 2 }}>
                  <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>SELECTED SUBURBS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {selectedSuburbs.map(s => (
                      <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: `${PURPLE}12`, border: `1px solid ${PURPLE}30`, color: PURPLE, fontSize: 10, fontWeight: 700, borderRadius: 9999 }}>
                        {s}
                        <button onClick={() => toggleSuburb(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: PURPLE, display: 'flex' }}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Two-panel layout ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: contact list */}
        <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '6px 16px', borderBottom: `1px solid ${BORDER}`, background: BG, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: TEXT3 }}>
              Showing <strong style={{ color: TEXT2 }}>{filtered.length}</strong> of <strong style={{ color: TEXT2 }}>{totalCount.toLocaleString()}</strong> contacts
              {hasActiveFilters && <span style={{ color: BLUE }}> · filtered</span>}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading && (
              <div style={{ padding: 40, textAlign: 'center', color: TEXT3, fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', opacity: 0.4 }} />
                Loading contacts…
              </div>
            )}
            {!loading && filtered.map((c) => (
              <div key={c.id} onClick={() => { setSel(c); setDetailTab(0) }}
                style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel?.id === c.id ? `${BLUE}05` : 'transparent', borderLeft: `2px solid ${sel?.id === c.id ? c.typeColor : 'transparent'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 30, height: 30, background: avColor(c.name), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(c.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: TEXT3 }}>{c.suburb}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c.scoreColor, letterSpacing: '-0.03em', flexShrink: 0 }}>{c.score}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: c.typeColor, background: `${c.typeColor}18`, padding: '1px 6px', fontWeight: 700, borderRadius: 9999 }}>{c.type.toUpperCase()}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3 }}>{c.lastContact}</span>
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && contacts.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: TEXT3, fontSize: 12 }}>
                <Users size={28} color={TEXT3} style={{ opacity: 0.2, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                <div style={{ marginBottom: 4, fontWeight: 600, color: TEXT2 }}>No contacts yet</div>
                <div style={{ marginBottom: 14 }}>Add your first contact to get started.</div>
                <button onClick={() => setShowNew(true)} style={{ fontSize: 11, color: '#fff', background: BLUE, border: 'none', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>+ New Contact</button>
              </div>
            )}
            {!loading && filtered.length === 0 && contacts.length > 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: TEXT3, fontSize: 12 }}>
                <Users size={28} color={TEXT3} style={{ opacity: 0.2, marginBottom: 8 }} />
                <div>No contacts match your filters.</div>
                <button onClick={clearAll} style={{ marginTop: 10, fontSize: 11, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>Clear filters</button>
              </div>
            )}
          </div>
        </div>

        {/* Right: contact detail */}
        {sel ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, background: avColor(sel.name), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{initials(sel.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: TEXT }}>{sel.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 10, color: sel.typeColor, background: `${sel.typeColor}15`, padding: '2px 8px', fontWeight: 700, borderRadius: 9999 }}>{sel.type.toUpperCase()}</span>
                    <span style={{ fontSize: 10, color: TEXT3 }}>{sel.suburb}</span>
                    <span style={{ fontSize: 10, color: sel.scoreColor, fontWeight: 700 }}>Score: {sel.score}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ label: 'Call', color: GREEN, icon: Phone }, { label: 'Email', color: BLUE, icon: Mail }, { label: 'SMS', color: PURPLE, icon: MessageSquare }].map(a => {
                    const Icon = a.icon
                    const href = a.label === 'Call' ? `tel:${sel.phone}` : a.label === 'Email' ? `mailto:${sel.email}` : `sms:${sel.phone}`
                    return <button key={a.label} onClick={() => window.location.href = href} style={{ background: a.color, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 9999 }}><Icon size={11} />{a.label}</button>
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {DETAIL_TABS.map((t, i) => (
                  <button key={t} onClick={() => setDetailTab(i)} style={{ padding: '4px 12px', background: detailTab === i ? `${PINK}15` : 'rgba(0,0,0,0.03)', border: `1px solid ${detailTab === i ? `${PINK}30` : BORDER}`, color: detailTab === i ? PINK : TEXT3, fontSize: 11, fontWeight: detailTab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>{t}</button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {detailTab === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>CONTACT DETAILS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Phone size={10} color={TEXT3} /><span style={{ fontSize: 12, color: TEXT }}>{sel.phone || '—'}</span></div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Mail size={10} color={TEXT3} /><span style={{ fontSize: 12, color: TEXT }}>{sel.email || '—'}</span></div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MapPin size={10} color={TEXT3} /><span style={{ fontSize: 12, color: TEXT }}>{sel.suburb || '—'}</span></div>
                      </div>
                    </div>
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>LIFE EVENT</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <Heart size={12} color={PINK} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: TEXT2, lineHeight: 1.6 }}>{sel.lifeEvent || '—'}</span>
                      </div>
                    </div>
                  </div>
                  {sel.notes && (
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>NOTES</div>
                      <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>{sel.notes}</p>
                    </div>
                  )}
                  {sel.properties.length > 0 && (
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>PROPERTIES</div>
                      {sel.properties.map((p, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Home size={11} color={BLUE} /><span style={{ fontSize: 12, color: TEXT }}>{p}</span></div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {detailTab === 1 && (
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Relationship Timeline</div>
                  {sel.timeline.length === 0 ? <div style={{ color: TEXT3, fontSize: 12 }}>No timeline recorded yet.</div> : (
                    <div style={{ position: 'relative', paddingLeft: 20 }}>
                      <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, background: BORDER }} />
                      {sel.timeline.map((t, i) => (
                        <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                          <div style={{ position: 'absolute', left: -18, top: 3, width: 10, height: 10, background: t.color, borderRadius: 9999, border: '2px solid #fff' }} />
                          <div style={{ fontSize: 10, color: TEXT3, marginBottom: 2 }}>{t.date}</div>
                          <div style={{ fontSize: 12.5, color: TEXT2 }}>{t.event}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {detailTab === 2 && (
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Family & Communication Style</div>
                  {sel.family || sel.commStyle ? <>
                    {sel.family && <div style={{ marginBottom: 14 }}><div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>FAMILY</div><p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>{sel.family}</p></div>}
                    {sel.commStyle && <div><div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>COMMUNICATION STYLE</div><p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>{sel.commStyle}</p></div>}
                  </> : <div style={{ color: TEXT3, fontSize: 12 }}>No family or communication notes recorded yet.</div>}
                </div>
              )}
              {detailTab === 3 && (
                <div style={{ background: PINK_S, border: '1px solid rgba(227,0,140,0.2)', padding: 20, borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Brain size={14} color={PINK} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>AI Memory — {sel.name}</span>
                  </div>
                  {sel.aiMemory
                    ? <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.9 }}>{sel.aiMemory}</p>
                    : <p style={{ margin: 0, fontSize: 13, color: TEXT3, lineHeight: 1.9, fontStyle: 'italic' }}>AI memory builds automatically from calls, emails and interactions. Start engaging with this contact to populate their memory profile.</p>
                  }
                </div>
              )}
            </div>
          </div>
        ) : !loading && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: TEXT3 }}>
              <Users size={32} style={{ opacity: 0.15, marginBottom: 12 }} />
              <div style={{ fontSize: 13 }}>Select a contact to view details</div>
            </div>
          </div>
        )}
      </div>

      {/* ── New Contact slide-over ── */}
      {showNew && (
        <>
          <div onClick={() => setShowNew(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 10000 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: '#fff', zIndex: 10001, boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>New Contact</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>Add a contact to your CRM</div>
              </div>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>FIRST NAME <span style={{ color: RED }}>*</span></label>
                  <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="e.g. Marcus"
                    style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>LAST NAME</label>
                  <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="e.g. Thornton"
                    style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>EMAIL</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. marcus@example.com"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>PHONE</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. 0412 345 678"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>SUBURB</label>
                <input value={form.suburb} onChange={e => setForm(f => ({ ...f, suburb: e.target.value }))} placeholder="e.g. Cronulla"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>CONTACT TYPE</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(['buyer','seller','investor','landlord','developer'] as const).map(t => {
                    const label = TYPE_DISPLAY[t]; const tc = TYPE_COLOR[label] ?? BLUE; const on = form.type === t
                    return (
                      <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                        style={{ padding: '5px 12px', fontSize: 11, fontWeight: on ? 700 : 500, border: `1px solid ${on ? `${tc}40` : BORDER}`, background: on ? `${tc}18` : '#fff', color: on ? tc : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>NOTES</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this contact…" rows={4}
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNew(false)}
                style={{ flex: 1, padding: '10px', background: BG, border: `1px solid ${BORDER}`, color: TEXT2, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8 }}>
                Cancel
              </button>
              <button onClick={handleSaveContact} disabled={saving || !form.firstName.trim()}
                style={{ flex: 2, padding: '10px', background: saving || !form.firstName.trim() ? `${BLUE}60` : BLUE, border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving || !form.firstName.trim() ? 'default' : 'pointer', fontFamily: 'inherit', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : 'Save Contact'}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
