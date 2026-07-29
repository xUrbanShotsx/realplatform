'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Home, DollarSign, Bed, Bath, Car, FileText, Calendar, Camera, Users, Save, Send, CheckSquare, Square, Check, Upload, X, Image, File as FileIcon, Paperclip } from 'lucide-react'

const BORDER  = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.04)'
const BLUE    = '#4361ee'; const GREEN = '#10b981'; const AMBER = '#f59e0b'; const PINK = '#e3008c'
const TEXT    = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

// ── Field primitives ──────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.07em', marginBottom: 7 }}>{children}</div>
}

function FieldInput({ placeholder, defaultValue, type = 'text', prefix, suffix }: { placeholder?: string; defaultValue?: string; type?: string; prefix?: string; suffix?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${BORDER}`, background: '#fff', overflow: 'hidden' }}>
      {prefix && <span style={{ padding: '0 12px', fontSize: 13, color: TEXT3, borderRight: `1px solid ${BORDER}`, background: '#fafafa', alignSelf: 'stretch', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{prefix}</span>}
      <input type={type} placeholder={placeholder} defaultValue={defaultValue}
        style={{ flex: 1, border: 'none', padding: '10px 12px', fontSize: 14, color: TEXT, fontFamily: 'inherit', outline: 'none', background: 'transparent', minWidth: 0 }} />
      {suffix && <span style={{ padding: '0 12px', fontSize: 13, color: TEXT3, borderLeft: `1px solid ${BORDER}`, background: '#fafafa', alignSelf: 'stretch', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{suffix}</span>}
    </div>
  )
}

function FieldSelect({ options, defaultValue }: { options: string[]; defaultValue?: string }) {
  return (
    <select defaultValue={defaultValue}
      style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '10px 12px', fontSize: 14, color: TEXT, fontFamily: 'inherit', outline: 'none', background: '#fff', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: TEXT3, letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <button onClick={() => onChange(Math.max(0, value - 1))}
          style={{ width: 40, height: 40, border: 'none', background: '#fafafa', color: TEXT2, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${BORDER}`, fontFamily: 'inherit', flexShrink: 0 }}>−</button>
        <span style={{ width: 48, textAlign: 'center', fontSize: 20, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em' }}>{value}</span>
        <button onClick={() => onChange(value + 1)}
          style={{ width: 40, height: 40, border: 'none', background: '#fafafa', color: TEXT2, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: `1px solid ${BORDER}`, fontFamily: 'inherit', flexShrink: 0 }}>+</button>
      </div>
    </div>
  )
}

const FEATURES = [
  'Air Conditioning', 'Alarm System', 'Balcony', 'Built-in Wardrobes',
  'Courtyard', 'Dishwasher', 'Ducted Heating', 'Ensuite',
  'Floorboards', 'Garden / Courtyard', 'Internal Laundry', 'Pool',
  'Remote Garage', 'Solar Panels', 'Study', 'Water Tank',
]

// ── File upload primitive ─────────────────────────────────────────────────────

function PhotoUploadZone() {
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const next = Array.from(list).map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
    setPhotos(p => [...p, ...next])
  }

  return (
    <div>
      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#0f172a' }}>
              <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, background: 'rgba(0,0,0,0.65)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                <X size={10} color="#fff" />
              </button>
              {i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 8, fontWeight: 800, color: '#fff', background: BLUE, padding: '2px 5px' }}>HERO</div>}
            </div>
          ))}
          <button onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
            style={{ aspectRatio: '4/3', border: `1.5px dashed ${BORDER}`, background: '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Upload size={14} color={TEXT3} strokeWidth={1.5} />
            <span style={{ fontSize: 9, color: TEXT3 }}>Add more</span>
          </button>
        </div>
      )}
      {photos.length === 0 && (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
          style={{ border: `1.5px dashed ${BORDER}`, background: '#fafafa', padding: '32px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 0 }}>
          <div style={{ width: 44, height: 44, background: `${BLUE}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image size={20} color={BLUE} strokeWidth={1.5} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT2, marginBottom: 3 }}>Drag photos here or click to upload</div>
            <div style={{ fontSize: 11, color: TEXT3 }}>JPG, PNG, HEIC · Up to 50 MB each · First image becomes the hero</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, border: `1px solid ${BLUE}30`, background: `${BLUE}08`, padding: '5px 14px' }}>Choose Photos</div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
    </div>
  )
}

function DocUploadZone({ label, hint, icon: Icon }: { label: string; hint: string; icon: React.ElementType }) {
  const [file, setFile] = useState<{ name: string; size: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pick = (list: FileList | null) => {
    if (!list || !list[0]) return
    const f = list[0]
    const kb = f.size / 1024
    setFile({ name: f.name, size: kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB` })
  }

  return (
    <div style={{ border: `1px solid ${file ? GREEN + '40' : BORDER}`, background: file ? `${GREEN}04` : '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 38, height: 38, background: file ? `${GREEN}12` : `${BLUE}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color={file ? GREEN : BLUE} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{label}</div>
        {file
          ? <div style={{ fontSize: 11, color: GREEN, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Check size={10} strokeWidth={2.5} /> {file.name} · {file.size}
            </div>
          : <div style={{ fontSize: 11, color: TEXT3 }}>{hint}</div>
        }
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {file && (
          <button onClick={() => setFile(null)}
            style={{ border: `1px solid ${BORDER}`, background: '#fff', color: TEXT3, padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
            <X size={10} /> Remove
          </button>
        )}
        <button onClick={() => inputRef.current?.click()}
          style={{ border: `1px solid ${file ? GREEN + '50' : BLUE + '40'}`, background: file ? `${GREEN}08` : `${BLUE}08`, color: file ? GREEN : BLUE, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {file ? 'Replace' : 'Upload'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,image/*" style={{ display: 'none' }} onChange={e => pick(e.target.files)} />
    </div>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'address',     label: 'Address',     icon: Home      },
  { id: 'details',     label: 'Details',     icon: FileText  },
  { id: 'description', label: 'Description', icon: FileText  },
  { id: 'features',    label: 'Features',    icon: Bed       },
  { id: 'financials',  label: 'Financials',  icon: DollarSign},
  { id: 'open-home',   label: 'Open Home',   icon: Calendar  },
  { id: 'media',       label: 'Media',       icon: Camera    },
  { id: 'agent',       label: 'Agent',       icon: Users     },
]

// ── Step content components ───────────────────────────────────────────────────

function StepAddress() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Property Address</div>
        <div style={{ fontSize: 13, color: TEXT3 }}>Where is the property located?</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 14 }}>
        <div><Label>UNIT / LOT</Label><FieldInput placeholder="e.g. 2" /></div>
        <div><Label>STREET ADDRESS</Label><FieldInput placeholder="42 Foreshore Crescent" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px', gap: 14 }}>
        <div><Label>SUBURB</Label><FieldInput placeholder="Cronulla" /></div>
        <div><Label>STATE</Label><FieldSelect options={['NSW','VIC','QLD','WA','SA','TAS','ACT','NT']} defaultValue="NSW" /></div>
        <div><Label>POSTCODE</Label><FieldInput placeholder="2230" /></div>
      </div>
    </div>
  )
}

function StepDetails() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Listing Details</div>
        <div style={{ fontSize: 13, color: TEXT3 }}>Set the listing type, property type and price.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><Label>LISTING TYPE</Label><FieldSelect options={['For Sale','Auction','Expression of Interest','For Lease','Sold','Leased']} defaultValue="For Sale" /></div>
        <div><Label>PROPERTY TYPE</Label><FieldSelect options={['House','Apartment','Unit','Townhouse','Villa','Land','Rural','Commercial']} defaultValue="House" /></div>
      </div>
      <div><Label>LISTING HEADING</Label><FieldInput placeholder="e.g. Stunning Oceanfront Home with Uninterrupted Views" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><Label>PRICE GUIDE</Label><FieldInput placeholder="2,850,000" prefix="$" /></div>
        <div><Label>DISPLAY PRICE (on portals)</Label><FieldInput placeholder="e.g. Offers from $2.75M" /></div>
      </div>
    </div>
  )
}

function StepDescription() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Marketing Description</div>
        <div style={{ fontSize: 13, color: TEXT3 }}>Write a compelling description that sells the lifestyle.</div>
      </div>
      <div><Label>HEADLINE / TAGLINE</Label><FieldInput placeholder="e.g. Where the ocean meets luxury living" /></div>
      <div>
        <Label>PROPERTY DESCRIPTION</Label>
        <textarea rows={9} placeholder="Write a compelling description of the property. Highlight key features, lifestyle benefits, location advantages and unique selling points..."
          style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '12px 14px', fontSize: 14, color: TEXT, fontFamily: 'inherit', lineHeight: 1.7, resize: 'vertical', outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: BLUE, background: `${BLUE}08`, border: `1px solid ${BLUE}25`, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            ✦ Generate with AI
          </button>
        </div>
      </div>
    </div>
  )
}

function StepFeatures({ beds, setBeds, baths, setBaths, cars, setCars, checkedFeatures, toggleFeature }:
  { beds: number; setBeds: (v: number) => void; baths: number; setBaths: (v: number) => void; cars: number; setCars: (v: number) => void; checkedFeatures: string[]; toggleFeature: (f: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Property Features</div>
        <div style={{ fontSize: 13, color: TEXT3 }}>Rooms, sizes and inclusions.</div>
      </div>

      <div style={{ display: 'flex', gap: 0, border: `1px solid ${BORDER}`, background: '#fff', padding: '20px 0' }}>
        <Counter label="BEDROOMS"   value={beds}  onChange={setBeds}  />
        <div style={{ width: 1, background: BORDER2 }} />
        <Counter label="BATHROOMS"  value={baths} onChange={setBaths} />
        <div style={{ width: 1, background: BORDER2 }} />
        <Counter label="CAR SPACES" value={cars}  onChange={setCars}  />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><Label>LAND SIZE</Label><FieldInput placeholder="650" suffix="m²" /></div>
        <div><Label>FLOOR AREA</Label><FieldInput placeholder="320" suffix="m²" /></div>
      </div>

      <div>
        <Label>FEATURES & INCLUSIONS</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          {FEATURES.map(f => {
            const on = checkedFeatures.includes(f)
            return (
              <button key={f} onClick={() => toggleFeature(f)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: `1px solid ${on ? BLUE + '40' : BORDER}`, background: on ? `${BLUE}06` : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                {on ? <CheckSquare size={14} color={BLUE} /> : <Square size={14} color={TEXT3} />}
                <span style={{ fontSize: 13, color: on ? TEXT : TEXT2 }}>{f}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StepFinancials() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Financial Details</div>
        <div style={{ fontSize: 13, color: TEXT3 }}>Rates and advertising budget for the listing.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { label: 'COUNCIL RATES',     suffix: '/ quarter' },
          { label: 'WATER RATES',       suffix: '/ quarter' },
          { label: 'STRATA LEVIES',     suffix: '/ quarter' },
          { label: 'ADVERTISING BUDGET', suffix: '' },
        ].map(({ label, suffix }) => (
          <div key={label}>
            <Label>{label}</Label>
            <FieldInput prefix="$" placeholder="0.00" suffix={suffix || undefined} />
          </div>
        ))}
      </div>
    </div>
  )
}

function StepOpenHome() {
  const [sessions, setSessions] = useState([{ id: 1 }])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Open Home</div>
        <div style={{ fontSize: 13, color: TEXT3 }}>Schedule inspection times for the property.</div>
      </div>
      {sessions.map((s, i) => (
        <div key={s.id} style={{ border: `1px solid ${BORDER}`, padding: '16px', background: '#fff' }}>
          {sessions.length > 1 && <div style={{ fontSize: 11, fontWeight: 700, color: TEXT3, marginBottom: 12 }}>INSPECTION {i + 1}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div><Label>DATE</Label><input type="date" style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: TEXT, boxSizing: 'border-box', background: '#fff' }} /></div>
            <div><Label>START TIME</Label><input type="time" defaultValue="11:30" style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: TEXT, boxSizing: 'border-box', background: '#fff' }} /></div>
            <div><Label>END TIME</Label><input type="time" defaultValue="12:00" style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: TEXT, boxSizing: 'border-box', background: '#fff' }} /></div>
          </div>
        </div>
      ))}
      <button onClick={() => setSessions(s => [...s, { id: Date.now() }])}
        style={{ border: `1.5px dashed ${BLUE}40`, background: `${BLUE}04`, color: BLUE, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        + Add another open home
      </button>
    </div>
  )
}

function StepMedia() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Media & Documents</div>
        <div style={{ fontSize: 13, color: TEXT3 }}>Upload photos, floor plan and required legal documents.</div>
      </div>

      <div>
        <Label>PROPERTY PHOTOS</Label>
        <PhotoUploadZone />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Label>FLOOR PLAN & DOCUMENTS</Label>
        <DocUploadZone label="Floor Plan" hint="PDF or image · Displayed on portals alongside photos" icon={Image} />
        <DocUploadZone label="Copy of Contract" hint="PDF · Draft or executed contract of sale" icon={FileIcon} />
        <DocUploadZone label="Selling / Managing Agency Agreement" hint="PDF · Signed agency agreement required before listing goes live" icon={Paperclip} />
      </div>
    </div>
  )
}

function StepAgent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 4 }}>Assigned Agent</div>
        <div style={{ fontSize: 13, color: TEXT3 }}>Who is managing this listing?</div>
      </div>
      <div>
        <Label>LISTING AGENT</Label>
        <FieldSelect options={['Jye San Jurjo — Principal','Sarah Mitchell — Senior Agent','Tom Barker — Agent']} defaultValue="Jye San Jurjo — Principal" />
      </div>
      <div>
        <Label>SECOND AGENT (optional)</Label>
        <FieldSelect options={['— None —','Jye San Jurjo — Principal','Sarah Mitchell — Senior Agent','Tom Barker — Agent']} defaultValue="— None —" />
      </div>
      {/* Review summary */}
      <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}25`, padding: '16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Check size={13} /> Ready to publish
        </div>
        <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.7 }}>
          All required sections are complete. Click <strong>Publish Listing</strong> to make it live on REA and Domain, or <strong>Save Draft</strong> to come back later.
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewListingPage() {
  const router = useRouter()

  // Form state
  const [beds,  setBeds]  = useState(4)
  const [baths, setBaths] = useState(2)
  const [cars,  setCars]  = useState(2)
  const [checkedFeatures, setCheckedFeatures] = useState<string[]>(['Air Conditioning', 'Built-in Wardrobes', 'Internal Laundry'])
  const toggleFeature = (f: string) => setCheckedFeatures(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])

  // Step navigation with slide animation
  const [step, setStep]     = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [slideX, setSlideX] = useState(0)
  const animating = useRef(false)

  const goTo = useCallback((next: number) => {
    if (animating.current || next < 0 || next >= STEPS.length) return
    animating.current = true
    const fwd = next > step

    // Fade + slide out current
    setOpacity(0)
    setSlideX(fwd ? -40 : 40)

    setTimeout(() => {
      setStep(next)
      // Position new content off-screen on the other side instantly (no transition)
      setSlideX(fwd ? 40 : -40)
      setOpacity(0)

      // Then animate into place
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setSlideX(0)
        setOpacity(1)
        setTimeout(() => { animating.current = false }, 320)
      }))
    }, 220)
  }, [step])

  const stepContent = [
    <StepAddress key="address" />,
    <StepDetails key="details" />,
    <StepDescription key="description" />,
    <StepFeatures key="features" beds={beds} setBeds={setBeds} baths={baths} setBaths={setBaths} cars={cars} setCars={setCars} checkedFeatures={checkedFeatures} toggleFeature={toggleFeature} />,
    <StepFinancials key="financials" />,
    <StepOpenHome key="open-home" />,
    <StepMedia key="media" />,
    <StepAgent key="agent" />,
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f8fafc' }}>
      {/* Top bar */}
      <div style={{ padding: '12px 24px', background: '#fff', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
          <ChevronLeft size={12} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>New Listing</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            <Save size={11} /> Save Draft
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: BLUE, border: 'none', color: '#fff', padding: '6px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Send size={11} /> Publish Listing
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '12px 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
          {STEPS.map((s, i) => {
            const done    = i < step
            const current = i === step
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <button onClick={() => goTo(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? GREEN : current ? BLUE : '#f1f5f9', border: `2px solid ${done ? GREEN : current ? BLUE : BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    {done
                      ? <Check size={13} color="#fff" strokeWidth={2.5} />
                      : <span style={{ fontSize: 11, fontWeight: 700, color: current ? '#fff' : TEXT3 }}>{i + 1}</span>
                    }
                  </div>
                  <span style={{ fontSize: 9, fontWeight: current ? 700 : 500, color: current ? BLUE : done ? TEXT2 : TEXT3, whiteSpace: 'nowrap' }}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? GREEN : BORDER, margin: '0 4px', marginBottom: 14, transition: 'background 0.2s' }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content + preview */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', gap: 0 }}>
        {/* Sliding step content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 40px' }}>
          <div style={{ width: '100%', maxWidth: 560, transform: `translateX(${slideX}px)`, opacity, transition: 'transform 0.28s ease, opacity 0.22s ease' }}>
            {stepContent[step]}
          </div>
        </div>

        {/* Right preview panel */}
        <div style={{ width: 260, borderLeft: `1px solid ${BORDER}`, background: '#fff', overflowY: 'auto', padding: '20px 16px', flexShrink: 0 }}>
          {/* Mini listing card */}
          <div style={{ border: `1px solid ${BORDER}`, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ height: 100, background: 'linear-gradient(135deg,#1e3a5f,#0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Camera size={18} color="rgba(255,255,255,0.15)" strokeWidth={1} />
              <div style={{ position: 'absolute', top: 7, left: 7, fontSize: 8, fontWeight: 800, color: '#fff', background: BLUE, padding: '2px 6px' }}>FOR SALE</div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>$2,850,000</div>
              <div style={{ fontSize: 11, color: TEXT2, marginBottom: 8, lineHeight: 1.4 }}>42 Foreshore Crescent,<br />Cronulla NSW 2230</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ icon: Bed, val: beds }, { icon: Bath, val: baths }, { icon: Car, val: cars }].map(({ icon: Icon, val }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Icon size={11} color={TEXT3} strokeWidth={1.5} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.07em', marginBottom: 8 }}>PROGRESS</div>
          {STEPS.map((s, i) => {
            const done = i < step
            const cur  = i === step
            const Icon = s.icon
            return (
              <button key={s.id} onClick={() => goTo(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 8px', border: 'none', background: cur ? `${BLUE}08` : 'transparent', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 2, borderLeft: `2px solid ${cur ? BLUE : 'transparent'}` }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: done ? GREEN : cur ? BLUE : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {done ? <Check size={9} color="#fff" strokeWidth={2.5} /> : <span style={{ fontSize: 8, fontWeight: 700, color: cur ? '#fff' : TEXT3 }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: 11.5, color: cur ? TEXT : done ? TEXT2 : TEXT3, fontWeight: cur ? 700 : 400 }}>{s.label}</span>
                {done && <Check size={11} color={GREEN} style={{ marginLeft: 'auto' }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom navigation */}
      <div style={{ padding: '14px 40px', background: '#fff', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button onClick={() => goTo(step - 1)} disabled={step === 0}
          style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${BORDER}`, background: '#fff', color: step === 0 ? TEXT3 : TEXT2, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: step === 0 ? 'default' : 'pointer', fontFamily: 'inherit', opacity: step === 0 ? 0.4 : 1 }}>
          <ChevronLeft size={14} /> Previous
        </button>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 6 }}>
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ width: i === step ? 20 : 7, height: 7, borderRadius: 4, background: i === step ? BLUE : i < step ? GREEN : BORDER, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }} />
          ))}
        </div>

        {step < STEPS.length - 1
          ? <button onClick={() => goTo(step + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: BLUE, border: 'none', color: '#fff', padding: '9px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Next <ChevronRight size={14} />
            </button>
          : <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: GREEN, border: 'none', color: '#fff', padding: '9px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Send size={13} /> Publish Listing
            </button>
        }
      </div>
    </div>
  )
}
