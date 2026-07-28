import AsyncStorage from '@react-native-async-storage/async-storage'

export type ListingType = 'For Sale' | 'For Lease'
export type ContactType = 'Buyer' | 'Investor' | 'Tenant' | 'Just looking'
export type PreApproval = 'Yes' | 'No' | 'In progress'

export type Attendee = {
  id: string
  name: string
  phone: string
  email: string
  contactType: ContactType
  budget: string
  preApproved: PreApproval
  livingSuburb: string
  hearAbout: string
  comments: string
  score: number
  signedInAt: string
  propertyId: string
  tags: string[]
}

export type Property = {
  id: string
  address: string
  suburb: string
  postcode: string
  price: string
  type: string
  bedrooms: number
  bathrooms: number
  agent: string
  listingType: ListingType
}

export type Session = {
  id: string
  property: Property
  date: string
  startTime: string
  attendees: Attendee[]
}

// ── Vendor / Contact types ────────────────────────────────────────────────────
export type Vendor = {
  id: string
  propertyId: string
  name: string
  phone: string
  email: string
  role: 'Vendor' | 'Joint Vendor' | 'Landlord' | 'Joint Landlord'
}

export const VENDORS: Vendor[] = [
  { id: 'v1', propertyId: '1', name: 'Michael Chen',          phone: '0412 111 222', email: 'mchen@email.com',      role: 'Vendor' },
  { id: 'v2', propertyId: '1', name: 'Sarah Chen',            phone: '0413 222 333', email: 'schen@email.com',      role: 'Joint Vendor' },
  { id: 'v3', propertyId: '2', name: "James O'Brien",         phone: '0421 333 444', email: 'jobrien@email.com',    role: 'Vendor' },
  { id: 'v4', propertyId: '3', name: 'Emma Walsh',            phone: '0418 555 666', email: 'ewalsh@email.com',     role: 'Vendor' },
  { id: 'v5', propertyId: '4', name: 'David Park',            phone: '0411 777 888', email: 'dpark@email.com',      role: 'Landlord' },
  { id: 'v6', propertyId: '5', name: 'Coastal Properties Pty',phone: '0422 999 000', email: 'admin@coastal.com.au', role: 'Landlord' },
  { id: 'v7', propertyId: '6', name: 'Rachel Nguyen',         phone: '0415 111 333', email: 'rnguyen@email.com',    role: 'Vendor' },
  { id: 'v8', propertyId: '6', name: 'Tom Nguyen',            phone: '0416 444 555', email: 'tnguyen@email.com',    role: 'Joint Vendor' },
]

// ── Mock properties (matches Real Platform data) ──────────────────────────────
export const PROPERTIES: Property[] = [
  { id: '1', address: '42 Foreshore Cres', suburb: 'Cronulla',    postcode: '2230', price: '$3.2M–$3.6M', type: 'House', bedrooms: 4, bathrooms: 3, agent: 'Jye San Jurjo', listingType: 'For Sale' },
  { id: '2', address: '14 Arcadia St',     suburb: 'Bondi Beach', postcode: '2026', price: '$2.15M',      type: 'House', bedrooms: 4, bathrooms: 2, agent: 'Jye San Jurjo', listingType: 'For Sale' },
  { id: '3', address: '42 Glenmore Rd',    suburb: 'Paddington',  postcode: '2021', price: '$2.65M',      type: 'House', bedrooms: 4, bathrooms: 2, agent: 'Jye San Jurjo', listingType: 'For Sale' },
  { id: '4', address: '48 Woodford Ave',   suburb: 'Warilla',     postcode: '2528', price: '$650/wk',     type: 'House', bedrooms: 3, bathrooms: 2, agent: 'Jye San Jurjo', listingType: 'For Lease' },
  { id: '5', address: '22 Thirroul Esp',   suburb: 'Thirroul',    postcode: '2515', price: '$580/wk',     type: 'House', bedrooms: 3, bathrooms: 2, agent: 'Jye San Jurjo', listingType: 'For Lease' },
  { id: '6', address: '7 Raglan St',       suburb: 'Mosman',      postcode: '2088', price: '$2.5M',       type: 'House', bedrooms: 4, bathrooms: 2, agent: 'Jye San Jurjo', listingType: 'For Sale' },
]

// ── Nearby postcodes map ──────────────────────────────────────────────────────
const NEARBY: Record<string, string[]> = {
  '2230': ['2229', '2232', '2228', '2227', '2217'], // Cronulla area
  '2026': ['2025', '2024', '2029', '2022', '2031'], // Bondi area
  '2021': ['2010', '2022', '2040', '2050', '2041'], // Paddington area
  '2528': ['2527', '2529', '2517', '2515', '2519'], // Warilla/Illawarra
  '2515': ['2516', '2517', '2528', '2527', '2508'], // Thirroul area
  '2088': ['2089', '2090', '2093', '2065', '2087'], // Mosman area
}

// ── Score calculator ──────────────────────────────────────────────────────────
export function calcScore(a: Partial<Attendee>, property: Property): number {
  let score = 40
  if (a.preApproved === 'Yes') score += 25
  if (a.preApproved === 'In progress') score += 10
  if (a.contactType === 'Buyer' || a.contactType === 'Tenant') score += 10
  if (a.budget) {
    const budgetNum = parseBudget(a.budget)
    const propNum   = parseBudget(property.price)
    if (budgetNum > 0 && propNum > 0) {
      const ratio = budgetNum / propNum
      if (ratio >= 0.9 && ratio <= 1.2) score += 15
      else if (ratio >= 0.7 && ratio <= 1.5) score += 8
    }
  }
  if (a.comments && a.comments.trim().length > 10) score += 5
  return Math.min(100, score)
}

function parseBudget(s: string): number {
  const m = s.replace(/[^0-9.MKk]/g, '').match(/([\d.]+)([MKk]?)/)
  if (!m) return 0
  const n = parseFloat(m[1])
  if (m[2] === 'M') return n * 1_000_000
  if (m[2] === 'K' || m[2] === 'k') return n * 1_000
  return n
}

// ── Tag builder ───────────────────────────────────────────────────────────────
export function buildTags(a: Partial<Attendee>, property: Property): string[] {
  const tags: string[] = [
    `${property.suburb}`,
    `${property.bedrooms}bd+`,
    property.type,
    a.contactType ?? 'Buyer',
  ]
  if (a.preApproved === 'Yes') tags.push('Pre-approved')
  if (a.budget) tags.push(a.budget)

  const nearby = NEARBY[property.postcode] ?? []
  nearby.slice(0, 2).forEach(pc => tags.push(pc))

  // Similar price suburbs
  if (property.postcode === '2230' || property.postcode === '2528') tags.push('Sutherland Shire')
  if (property.postcode === '2026' || property.postcode === '2021') tags.push('Eastern Suburbs')
  if (property.postcode === '2088') tags.push('Lower North Shore')

  return tags
}

// ── Hot Leads ─────────────────────────────────────────────────────────────────
export interface Lead {
  id: string
  name: string
  initials: string
  phone: string
  email: string
  score: number
  hotness: 'HOT' | 'WARM' | 'COOL'
  propertyId: string
  propertyAddress: string
  suburb: string
  inspections: number
  lastContact: string
  daysSinceContact: number
  budget: string
  preApproved: boolean
  notes: string
}

export const HOT_LEADS: Lead[] = [
  { id: 'l1', name: 'Sarah Wilson',  initials: 'SW', phone: '0412 881 234', email: 'sarah.w@gmail.com',       score: 94, hotness: 'HOT',  propertyId: '1', propertyAddress: '42 Foreshore Cres', suburb: 'Cronulla',    inspections: 3, lastContact: '3 days ago', daysSinceContact: 3, budget: '$3.2M–$3.5M', preApproved: true,  notes: 'Very interested, loves the ocean view. Bringing family next visit.' },
  { id: 'l2', name: 'Marcus Lee',    initials: 'ML', phone: '0421 567 890', email: 'marcus.lee@outlook.com',  score: 88, hotness: 'HOT',  propertyId: '2', propertyAddress: '14 Arcadia St',     suburb: 'Bondi Beach', inspections: 2, lastContact: 'Yesterday',    daysSinceContact: 1, budget: '$2.1M–$2.3M', preApproved: true,  notes: 'Wants quick settlement. Made verbal offer $2.1M.' },
  { id: 'l3', name: 'Priya Sharma',  initials: 'PS', phone: '0418 234 567', email: 'priya.s@gmail.com',       score: 76, hotness: 'WARM', propertyId: '3', propertyAddress: '42 Glenmore Rd',    suburb: 'Paddington',  inspections: 2, lastContact: 'Today',        daysSinceContact: 0, budget: '$2.5M–$2.8M', preApproved: false, notes: 'Pre-approval in progress. Very motivated buyer.' },
  { id: 'l4', name: 'James Clark',   initials: 'JC', phone: '0405 111 999', email: 'j.clark@gmail.com',       score: 71, hotness: 'WARM', propertyId: '1', propertyAddress: '42 Foreshore Cres', suburb: 'Cronulla',    inspections: 1, lastContact: '2 days ago',  daysSinceContact: 2, budget: '$3.4M+',      preApproved: true,  notes: 'Cash buyer, interstate investor. Flexible on settlement.' },
  { id: 'l5', name: 'Nina Patel',    initials: 'NP', phone: '0411 987 654', email: 'nina.p@icloud.com',       score: 65, hotness: 'WARM', propertyId: '6', propertyAddress: '7 Raglan St',       suburb: 'Mosman',      inspections: 2, lastContact: '5 days ago',  daysSinceContact: 5, budget: '$2.3M–$2.6M', preApproved: false, notes: 'Downsizer, flexible on timing. Loves the area.' },
  { id: 'l6', name: 'Tom Nguyen',    initials: 'TN', phone: '0499 888 111', email: 'tmnguyen@gmail.com',      score: 58, hotness: 'COOL', propertyId: '3', propertyAddress: '42 Glenmore Rd',    suburb: 'Paddington',  inspections: 1, lastContact: '7 days ago',  daysSinceContact: 7, budget: '$2.4M–$2.7M', preApproved: false, notes: 'First home buyer. Still exploring options.' },
]

// ── Pipeline ──────────────────────────────────────────────────────────────────
export type DealStage = 'New Lead' | 'Viewing' | 'Negotiating' | 'Under Offer' | 'Settled'

export interface Deal {
  id: string
  propertyId: string
  address: string
  suburb: string
  contactName: string
  stage: DealStage
  price: string
  daysInStage: number
}

export const PIPELINE: Deal[] = [
  { id: 'd1', propertyId: '6', address: '7 Raglan St',       suburb: 'Mosman',      contactName: 'Alex Turner',  stage: 'Under Offer',  price: '$2.48M',  daysInStage: 4  },
  { id: 'd2', propertyId: '3', address: '42 Glenmore Rd',    suburb: 'Paddington',  contactName: 'Nina Patel',   stage: 'Negotiating',  price: '$2.55M',  daysInStage: 12 },
  { id: 'd3', propertyId: '1', address: '42 Foreshore Cres', suburb: 'Cronulla',    contactName: 'Sarah Wilson', stage: 'Viewing',      price: '$3.2M',   daysInStage: 8  },
  { id: 'd4', propertyId: '2', address: '14 Arcadia St',     suburb: 'Bondi Beach', contactName: 'Marcus Lee',   stage: 'Viewing',      price: '$2.1M',   daysInStage: 5  },
  { id: 'd5', propertyId: '1', address: '42 Foreshore Cres', suburb: 'Cronulla',    contactName: 'James Clark',  stage: 'New Lead',     price: '$3.4M+',  daysInStage: 2  },
]

// ── Storage helpers ───────────────────────────────────────────────────────────
const SESSIONS_KEY = 'rp_sessions'

export async function getSessions(): Promise<Session[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function saveSession(session: Session): Promise<void> {
  const all = await getSessions()
  const idx = all.findIndex(s => s.id === session.id)
  if (idx >= 0) all[idx] = session
  else all.unshift(session)
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(all))
}

export async function getSession(id: string): Promise<Session | null> {
  const all = await getSessions()
  return all.find(s => s.id === id) ?? null
}

export function newSession(property: Property): Session {
  const now = new Date()
  return {
    id: `${property.id}_${now.getTime()}`,
    property,
    date: now.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
    startTime: now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
    attendees: [],
  }
}
