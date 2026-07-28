import type {
  AgentboxListing,
  AgentboxContact,
  AgentboxEnquiry,
} from '@/types/realestate'

const AGENTBOX_BASE_URL = 'https://api.agentboxcrm.com.au/v2'

interface AgentboxResponse<T> {
  response: {
    data: T
    pagination?: {
      total: number
      limit: number
      offset: number
    }
  }
}

function getHeaders(apiKey: string, clientKey: string) {
  return {
    'X-Api-Key': apiKey,
    'X-Client-Key': clientKey,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}

async function agentboxFetch<T>(
  path: string,
  apiKey: string,
  clientKey: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${AGENTBOX_BASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(apiKey, clientKey),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Agentbox API error ${res.status}: ${error}`)
  }

  const json: AgentboxResponse<T> = await res.json()
  return json.response.data
}

// Listings
export async function getListings(
  apiKey: string,
  clientKey: string,
  params: {
    status?: string
    limit?: number
    offset?: number
    suburb?: string
    agentId?: string
  } = {}
): Promise<AgentboxListing[]> {
  const qs = new URLSearchParams()
  if (params.status) qs.set('status', params.status)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))
  if (params.suburb) qs.set('suburb', params.suburb)
  if (params.agentId) qs.set('agentId', params.agentId)

  const query = qs.toString() ? `?${qs}` : ''
  return agentboxFetch<AgentboxListing[]>(`/listings${query}`, apiKey, clientKey)
}

export async function getListing(
  id: string,
  apiKey: string,
  clientKey: string
): Promise<AgentboxListing> {
  return agentboxFetch<AgentboxListing>(`/listings/${id}`, apiKey, clientKey)
}

// Contacts / Vendors
export async function getContacts(
  apiKey: string,
  clientKey: string,
  params: {
    type?: string
    limit?: number
    offset?: number
    suburb?: string
    search?: string
  } = {}
): Promise<AgentboxContact[]> {
  const qs = new URLSearchParams()
  if (params.type) qs.set('type', params.type)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))
  if (params.suburb) qs.set('suburb', params.suburb)
  if (params.search) qs.set('search', params.search)

  const query = qs.toString() ? `?${qs}` : ''
  return agentboxFetch<AgentboxContact[]>(`/contacts${query}`, apiKey, clientKey)
}

export async function getContact(
  id: string,
  apiKey: string,
  clientKey: string
): Promise<AgentboxContact> {
  return agentboxFetch<AgentboxContact>(`/contacts/${id}`, apiKey, clientKey)
}

export async function createContact(
  contact: Partial<AgentboxContact>,
  apiKey: string,
  clientKey: string
): Promise<AgentboxContact> {
  return agentboxFetch<AgentboxContact>(`/contacts`, apiKey, clientKey, {
    method: 'POST',
    body: JSON.stringify(contact),
  })
}

export async function updateContact(
  id: string,
  contact: Partial<AgentboxContact>,
  apiKey: string,
  clientKey: string
): Promise<AgentboxContact> {
  return agentboxFetch<AgentboxContact>(`/contacts/${id}`, apiKey, clientKey, {
    method: 'PUT',
    body: JSON.stringify(contact),
  })
}

// Enquiries
export async function getEnquiries(
  apiKey: string,
  clientKey: string,
  params: {
    listingId?: string
    status?: string
    limit?: number
    offset?: number
  } = {}
): Promise<AgentboxEnquiry[]> {
  const qs = new URLSearchParams()
  if (params.listingId) qs.set('listingId', params.listingId)
  if (params.status) qs.set('status', params.status)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))

  const query = qs.toString() ? `?${qs}` : ''
  return agentboxFetch<AgentboxEnquiry[]>(`/enquiries${query}`, apiKey, clientKey)
}

// Mock data for development (used when API keys are not configured)
export function getMockListings(): AgentboxListing[] {
  return [
    {
      id: '1',
      uniqueID: 'AB-001',
      class: 'residential',
      type: 'House',
      status: 'current',
      displayPrice: '$1,250,000',
      priceFrom: 1200000,
      priceTo: 1300000,
      address: {
        streetNumber: '24',
        street: 'Banksia Avenue',
        suburb: 'Mosman',
        state: 'NSW',
        postcode: '2088',
        country: 'Australia',
        display: '24 Banksia Avenue, Mosman NSW 2088',
      },
      bedrooms: 4,
      bathrooms: 2,
      garages: 2,
      landArea: 650,
      buildingArea: 320,
      features: ['Pool', 'Deck', 'Study', 'Alarm'],
      description: 'A stunning family home in the heart of Mosman...',
      images: [{ url: 'https://placehold.co/800x600/1B3A6B/FFFFFF?text=24+Banksia+Ave', order: 1 }],
      agent: { id: 'a1', firstName: 'James', lastName: 'Mitchell', email: 'james@agency.com.au', phone: '0412 345 678' },
      listedDate: '2024-11-01',
      modifiedDate: '2024-11-15',
      daysOnMarket: 14,
      inspections: [{ date: '2024-11-16', from: '10:00', to: '10:30' }],
      suburb: 'Mosman',
      postcode: '2088',
    },
    {
      id: '2',
      uniqueID: 'AB-002',
      class: 'residential',
      type: 'Apartment',
      status: 'current',
      displayPrice: '$895,000',
      priceFrom: 850000,
      priceTo: 950000,
      address: {
        streetNumber: '8/42',
        street: 'Clarke Street',
        suburb: 'Crow\'s Nest',
        state: 'NSW',
        postcode: '2065',
        country: 'Australia',
        display: '8/42 Clarke Street, Crow\'s Nest NSW 2065',
      },
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      features: ['Balcony', 'City Views', 'Gym', 'Pool'],
      description: 'Contemporary apartment with stunning city views...',
      images: [{ url: 'https://placehold.co/800x600/1B3A6B/FFFFFF?text=8/42+Clarke+St', order: 1 }],
      agent: { id: 'a1', firstName: 'James', lastName: 'Mitchell', email: 'james@agency.com.au', phone: '0412 345 678' },
      listedDate: '2024-11-05',
      modifiedDate: '2024-11-15',
      daysOnMarket: 10,
      inspections: [{ date: '2024-11-16', from: '11:00', to: '11:30' }],
      suburb: 'Crow\'s Nest',
      postcode: '2065',
    },
    {
      id: '3',
      uniqueID: 'AB-003',
      class: 'residential',
      type: 'House',
      status: 'sold',
      displayPrice: 'Sold $2,100,000',
      priceFrom: 2100000,
      address: {
        streetNumber: '15',
        street: 'Headland Road',
        suburb: 'Northbridge',
        state: 'NSW',
        postcode: '2063',
        country: 'Australia',
        display: '15 Headland Road, Northbridge NSW 2063',
      },
      bedrooms: 5,
      bathrooms: 3,
      garages: 2,
      landArea: 780,
      features: ['Pool', 'Tennis Court', 'Water Views'],
      description: 'Exceptional family estate with water views...',
      images: [{ url: 'https://placehold.co/800x600/1B3A6B/FFFFFF?text=15+Headland+Rd', order: 1 }],
      agent: { id: 'a1', firstName: 'James', lastName: 'Mitchell', email: 'james@agency.com.au', phone: '0412 345 678' },
      listedDate: '2024-09-15',
      modifiedDate: '2024-10-28',
      daysOnMarket: 43,
      inspections: [],
      suburb: 'Northbridge',
      postcode: '2063',
    },
    {
      id: '4',
      uniqueID: 'AB-004',
      class: 'residential',
      type: 'Terrace',
      status: 'current',
      displayPrice: 'Auction',
      address: {
        streetNumber: '33',
        street: 'Willoughby Road',
        suburb: 'Crows Nest',
        state: 'NSW',
        postcode: '2065',
        country: 'Australia',
        display: '33 Willoughby Road, Crows Nest NSW 2065',
      },
      bedrooms: 3,
      bathrooms: 2,
      garages: 1,
      landArea: 230,
      features: ['Courtyard', 'Updated Kitchen', 'Air Conditioning'],
      description: 'Charming terrace in the vibrant Crows Nest village...',
      images: [{ url: 'https://placehold.co/800x600/1B3A6B/FFFFFF?text=33+Willoughby+Rd', order: 1 }],
      agent: { id: 'a1', firstName: 'James', lastName: 'Mitchell', email: 'james@agency.com.au', phone: '0412 345 678' },
      listedDate: '2024-11-08',
      modifiedDate: '2024-11-15',
      daysOnMarket: 7,
      inspections: [{ date: '2024-11-16', from: '12:00', to: '12:30' }],
      suburb: 'Crows Nest',
      postcode: '2065',
    },
  ]
}

export function getMockContacts(): AgentboxContact[] {
  return [
    {
      id: 'c1',
      type: 'vendor',
      firstName: 'Robert',
      lastName: 'Chen',
      email: 'robert.chen@email.com',
      phone: '02 9876 5432',
      mobile: '0411 234 567',
      address: { street: '24 Banksia Ave', suburb: 'Mosman', state: 'NSW', postcode: '2088' },
      createdDate: '2024-08-01',
      modifiedDate: '2024-11-15',
      tags: ['vendor', 'mosman', 'high-value'],
      notes: 'Looking to upgrade to the Northern Beaches after sale.',
      source: 'referral',
      rating: 5,
      associatedListings: ['1'],
    },
    {
      id: 'c2',
      type: 'vendor',
      firstName: 'Sarah',
      lastName: 'Thompson',
      email: 'sarah.thompson@email.com',
      phone: '02 9876 1234',
      mobile: '0422 345 678',
      address: { street: '8/42 Clarke St', suburb: 'Crows Nest', state: 'NSW', postcode: '2065' },
      createdDate: '2024-09-10',
      modifiedDate: '2024-11-14',
      tags: ['vendor', 'crows-nest', 'downsizing'],
      notes: 'Retiring, looking to downsize to apartment closer to CBD.',
      source: 'appraisal_request',
      rating: 4,
      associatedListings: ['2'],
    },
  ]
}
