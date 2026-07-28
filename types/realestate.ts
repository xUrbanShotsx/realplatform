// Agentbox CRM types
export interface AgentboxListing {
  id: string
  uniqueID: string
  class: 'residential' | 'commercial' | 'rural' | 'land'
  type: string
  status: 'current' | 'sold' | 'leased' | 'withdrawn' | 'offmarket'
  displayPrice: string
  priceFrom?: number
  priceTo?: number
  address: {
    streetNumber: string
    street: string
    suburb: string
    state: string
    postcode: string
    country: string
    display: string
  }
  bedrooms?: number
  bathrooms?: number
  garages?: number
  landArea?: number
  buildingArea?: number
  features: string[]
  description: string
  images: { url: string; order: number }[]
  agent: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  vendor?: AgentboxContact
  listedDate: string
  modifiedDate: string
  daysOnMarket: number
  inspections: { date: string; from: string; to: string }[]
  suburb: string
  postcode: string
}

export interface AgentboxContact {
  id: string
  type: 'vendor' | 'buyer' | 'tenant' | 'landlord' | 'other'
  firstName: string
  lastName: string
  email: string
  phone: string
  mobile: string
  address?: {
    street: string
    suburb: string
    state: string
    postcode: string
  }
  createdDate: string
  modifiedDate: string
  tags: string[]
  notes: string
  source: string
  rating: 1 | 2 | 3 | 4 | 5
  associatedListings: string[]
}

export interface AgentboxEnquiry {
  id: string
  listingId: string
  contact: AgentboxContact
  message: string
  source: string
  createdDate: string
  status: 'new' | 'contacted' | 'qualified' | 'lost'
}

// Campaign types
export type CampaignType = 'property' | 'prospecting' | 'suburb' | 'appraisal'
export type CampaignChannel = 'email' | 'social' | 'sms' | 'print'
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'paused'

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  channels: CampaignChannel[]
  listingId?: string
  targetSuburbs?: string[]
  audienceSize: number
  startDate: string
  endDate?: string
  createdAt: string
  stats: CampaignStats
  budget?: number
  spent?: number
}

export interface CampaignStats {
  sent: number
  delivered: number
  opened: number
  clicked: number
  replied: number
  leads: number
  impressions?: number
  reach?: number
  engagements?: number
}

// Email marketing types
export type EmailTemplateCategory =
  | 'appraisal'
  | 'market_update'
  | 'just_listed'
  | 'just_sold'
  | 'open_home'
  | 'newsletter'
  | 'follow_up'
  | 'anniversary'

export interface EmailTemplate {
  id: string
  name: string
  category: EmailTemplateCategory
  subject: string
  previewText: string
  htmlContent: string
  thumbnailUrl?: string
  tags: string[]
  usageCount: number
  lastUsed?: string
}

export interface EmailCampaign {
  id: string
  name: string
  templateId: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  subject: string
  fromName: string
  fromEmail: string
  recipientList: string[]
  recipientCount: number
  scheduledAt?: string
  sentAt?: string
  stats: {
    sent: number
    delivered: number
    opened: number
    openRate: number
    clicked: number
    clickRate: number
    bounced: number
    unsubscribed: number
  }
  createdAt: string
}

// Social media types
export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin'
export type SocialPostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export interface SocialPost {
  id: string
  platform: SocialPlatform
  status: SocialPostStatus
  content: string
  mediaUrls: string[]
  scheduledAt?: string
  publishedAt?: string
  listingId?: string
  campaignId?: string
  stats: {
    impressions: number
    reach: number
    likes: number
    comments: number
    shares: number
    clicks: number
    leads: number
  }
  createdAt: string
}

export interface SocialCampaign {
  id: string
  name: string
  type: 'property_launch' | 'just_sold' | 'open_home' | 'vendor_prospecting' | 'brand_awareness'
  platforms: SocialPlatform[]
  status: CampaignStatus
  posts: SocialPost[]
  budget?: number
  spent?: number
  listingId?: string
  targetAudience: {
    suburbs: string[]
    ageRange?: [number, number]
    interests?: string[]
  }
  stats: {
    totalImpressions: number
    totalReach: number
    totalEngagements: number
    totalLeads: number
    costPerLead?: number
  }
  startDate: string
  endDate?: string
  createdAt: string
}

// Prospecting funnel types
export type FunnelStage = 'awareness' | 'interest' | 'consideration' | 'intent' | 'appraisal' | 'listed'

export interface ProspectingFunnel {
  id: string
  name: string
  description: string
  type: 'suburb_farming' | 'past_client' | 'portal_lead' | 'social_lead' | 'referral'
  status: 'active' | 'paused' | 'draft'
  targetSuburbs: string[]
  leads: ProspectLead[]
  steps: FunnelStep[]
  stats: {
    totalLeads: number
    activeLeads: number
    converted: number
    conversionRate: number
  }
  createdAt: string
}

export interface ProspectLead {
  id: string
  contact: AgentboxContact
  funnelId: string
  stage: FunnelStage
  score: number
  source: string
  suburb: string
  estimatedValue?: number
  timelineMonths?: number
  lastContact: string
  nextAction: string
  nextActionDate: string
  notes: string
  tags: string[]
  createdAt: string
}

export interface FunnelStep {
  id: string
  order: number
  name: string
  type: 'email' | 'sms' | 'social_ad' | 'task' | 'call'
  delayDays: number
  templateId?: string
  content?: string
  condition?: string
}

// Analytics types
export interface AnalyticsMetric {
  label: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  period: string
}

export interface SuburbPerformance {
  suburb: string
  postcode: string
  medianPrice: number
  priceGrowth: number
  daysOnMarket: number
  clearanceRate: number
  listingsCount: number
  soldCount: number
}

// Agent / settings types
export interface AgentProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  mobile: string
  licenseNumber: string
  agency: string
  agencyAddress: string
  photoUrl?: string
  bio: string
  specialties: string[]
  serviceSuburbs: string[]
}

export interface AppSettings {
  agentboxApiKey: string
  agentboxClientKey: string
  sendgridApiKey: string
  facebookAccessToken: string
  instagramAccountId: string
  linkedinAccessToken: string
  defaultFromEmail: string
  defaultFromName: string
  brandColor: string
  logoUrl?: string
}
