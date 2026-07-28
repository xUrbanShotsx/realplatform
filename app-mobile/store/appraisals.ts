import AsyncStorage from '@react-native-async-storage/async-storage'

export type AppraisalType = 'Sale' | 'Rental' | 'Both'
export type AppraisalStatus = 'Scheduled' | 'In Progress' | 'Completed'
export type CampaignType = 'Auction' | 'Private Treaty' | 'EOI' | 'TBD'

export interface Appraisal {
  id: string
  type: AppraisalType
  status: AppraisalStatus

  // Property
  address: string
  suburb: string
  postcode: string
  propertyType: string
  bedrooms: string
  bathrooms: string

  // Client
  clientName: string
  clientPhone: string

  // Schedule
  date: string
  time: string

  // Sale
  saleLow: string
  saleHigh: string
  saleGuide: string
  campaign: CampaignType
  commission: string
  marketing: string
  settlement: string

  // Rental
  rentLow: string
  rentHigh: string
  rentRecommended: string
  managementFee: string
  lettingFee: string
  leaseTerm: string

  // Notes
  conditionNotes: string
  propertyNotes: string
  comparableNotes: string
  vendorNotes: string

  // Meta
  createdAt: string
  completedAt: string
}

export function blankAppraisal(overrides: Partial<Appraisal> = {}): Appraisal {
  return {
    id: Date.now().toString(),
    type: 'Sale',
    status: 'Scheduled',
    address: '',
    suburb: '',
    postcode: '',
    propertyType: 'House',
    bedrooms: '4',
    bathrooms: '2',
    clientName: '',
    clientPhone: '',
    date: '',
    time: '',
    saleLow: '',
    saleHigh: '',
    saleGuide: '',
    campaign: 'Auction',
    commission: '2.0',
    marketing: '',
    settlement: '42',
    rentLow: '',
    rentHigh: '',
    rentRecommended: '',
    managementFee: '8.0',
    lettingFee: '1',
    leaseTerm: '12',
    conditionNotes: '',
    propertyNotes: '',
    comparableNotes: '',
    vendorNotes: '',
    createdAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
    completedAt: '',
    ...overrides,
  }
}

// ── Mock data ─────────────────────────────────────────────────────────────────
export const MOCK_APPRAISALS: Appraisal[] = [
  {
    ...blankAppraisal(),
    id: 'a1',
    type: 'Sale',
    status: 'Completed',
    address: '18 Camellia Ave',
    suburb: 'Cronulla',
    postcode: '2230',
    propertyType: 'House',
    bedrooms: '4',
    bathrooms: '2',
    clientName: 'Robert & Lucy Kim',
    clientPhone: '0411 222 333',
    date: '24 Jul 2026',
    time: '10:00 AM',
    saleLow: '2,800,000',
    saleHigh: '3,100,000',
    saleGuide: '$2.9M–$3.1M',
    campaign: 'Auction',
    commission: '2.2',
    marketing: '18,000',
    settlement: '42',
    propertyNotes: 'Excellent street appeal. Updated kitchen and bathrooms. Large rear garden with pool. Strong natural light throughout.',
    comparableNotes: '12 Camellia Ave sold $2.88M Oct 2025. 4 Sandpiper Cl sold $3.05M Mar 2026.',
    vendorNotes: 'Motivated — upsizing. Happy with 6 week campaign. Prefer Saturday auctions.',
    createdAt: '22 Jul 2026',
    completedAt: '24 Jul 2026',
  },
  {
    ...blankAppraisal(),
    id: 'a2',
    type: 'Rental',
    status: 'In Progress',
    address: '3 Marina Blvd',
    suburb: 'Cronulla',
    postcode: '2230',
    propertyType: 'Unit',
    bedrooms: '2',
    bathrooms: '1',
    clientName: 'Daniel Marsh',
    clientPhone: '0422 555 777',
    date: '28 Jul 2026',
    time: '2:00 PM',
    rentLow: '620',
    rentHigh: '680',
    rentRecommended: '',
    managementFee: '8.5',
    lettingFee: '1',
    leaseTerm: '12',
    conditionNotes: 'Well maintained. New carpet in bedrooms. Small balcony with water glimpses.',
    createdAt: '25 Jul 2026',
    completedAt: '',
  },
  {
    ...blankAppraisal(),
    id: 'a3',
    type: 'Both',
    status: 'Scheduled',
    address: '77 Pacific Parade',
    suburb: 'Caringbah South',
    postcode: '2229',
    propertyType: 'House',
    bedrooms: '3',
    bathrooms: '2',
    clientName: 'Grace Sorensen',
    clientPhone: '0413 888 999',
    date: '30 Jul 2026',
    time: '11:30 AM',
    commission: '2.0',
    managementFee: '8.0',
    createdAt: '27 Jul 2026',
    completedAt: '',
  },
]

// ── Storage ───────────────────────────────────────────────────────────────────
const KEY = 'appraisals_v1'

export async function getAppraisals(): Promise<Appraisal[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    const stored: Appraisal[] = raw ? JSON.parse(raw) : []
    // Merge mock data with stored — stored takes precedence by id
    const storedIds = new Set(stored.map(a => a.id))
    return [...stored, ...MOCK_APPRAISALS.filter(a => !storedIds.has(a.id))]
  } catch {
    return MOCK_APPRAISALS
  }
}

export async function saveAppraisal(appraisal: Appraisal): Promise<void> {
  const all = await getAppraisals()
  const idx = all.findIndex(a => a.id === appraisal.id)
  if (idx >= 0) all[idx] = appraisal
  else all.unshift(appraisal)
  await AsyncStorage.setItem(KEY, JSON.stringify(all))
}

export async function getAppraisal(id: string): Promise<Appraisal | null> {
  const all = await getAppraisals()
  return all.find(a => a.id === id) ?? null
}
