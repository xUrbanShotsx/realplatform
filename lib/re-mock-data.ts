// ── Real Estate mock data ────────────────────────────────────────────────────

export const reAgency = {
  name: 'Briesa Real Estate',
  tradingAs: 'Briesa Property Group',
  licenceNo: 'L-1234567',
  licenceHolder: 'James Thornton',
  state: 'NSW',
  complianceScore: 87,
  auditReadiness: 82,
  areas: [
    { name: 'Licence & CPD',     score: 94 },
    { name: 'AML / KYC',         score: 79 },
    { name: 'Trust Accounting',  score: 91 },
    { name: 'Policies & Procs',  score: 88 },
    { name: 'Disclosure Obs.',   score: 83 },
    { name: 'PM Compliance',     score: 76 },
  ],
}

// ── Listings ──────────────────────────────────────────────────────────────────
export type ListingStatus = 'Active' | 'Under Contract' | 'Sold' | 'Withdrawn' | 'Off Market'
export interface Listing {
  id: string
  address: string
  suburb: string
  type: 'House' | 'Unit' | 'Land' | 'Commercial' | 'Rural'
  listingType: 'Sale' | 'Auction'
  price: number
  agent: string
  daysOnMarket: number
  status: ListingStatus
  checklistPct: number
  amlStatus: 'Verified' | 'Pending' | 'Flagged'
  section32: boolean
  vendorStatement: boolean
  marketingApproved: boolean
  photosUploaded: boolean
  signedAgencyAgreement: boolean
  createdAt: string
}

export const listings: Listing[] = [
  {
    id: 'L001', address: '14 Parkview Drive', suburb: 'Castle Hill', type: 'House',
    listingType: 'Auction', price: 1850000, agent: 'Sarah Nguyen', daysOnMarket: 18,
    status: 'Active', checklistPct: 85, amlStatus: 'Verified', section32: true,
    vendorStatement: true, marketingApproved: true, photosUploaded: true,
    signedAgencyAgreement: true, createdAt: '2025-05-26',
  },
  {
    id: 'L002', address: '7/22 Harbour Street', suburb: 'Pyrmont', type: 'Unit',
    listingType: 'Sale', price: 920000, agent: 'Michael Torres', daysOnMarket: 5,
    status: 'Active', checklistPct: 60, amlStatus: 'Pending', section32: false,
    vendorStatement: true, marketingApproved: true, photosUploaded: false,
    signedAgencyAgreement: true, createdAt: '2025-06-08',
  },
  {
    id: 'L003', address: '3 Banksia Court', suburb: 'Cherrybrook', type: 'House',
    listingType: 'Auction', price: 2100000, agent: 'Sarah Nguyen', daysOnMarket: 32,
    status: 'Under Contract', checklistPct: 100, amlStatus: 'Verified', section32: true,
    vendorStatement: true, marketingApproved: true, photosUploaded: true,
    signedAgencyAgreement: true, createdAt: '2025-05-12',
  },
  {
    id: 'L004', address: '88 Mulgoa Road', suburb: 'Penrith', type: 'Land',
    listingType: 'Sale', price: 540000, agent: 'James Walters', daysOnMarket: 47,
    status: 'Active', checklistPct: 40, amlStatus: 'Flagged', section32: false,
    vendorStatement: false, marketingApproved: false, photosUploaded: true,
    signedAgencyAgreement: true, createdAt: '2025-04-27',
  },
  {
    id: 'L005', address: '21 The Boulevarde', suburb: 'Strathfield', type: 'House',
    listingType: 'Auction', price: 3200000, agent: 'Michael Torres', daysOnMarket: 11,
    status: 'Active', checklistPct: 90, amlStatus: 'Verified', section32: true,
    vendorStatement: true, marketingApproved: true, photosUploaded: true,
    signedAgencyAgreement: true, createdAt: '2025-06-02',
  },
  {
    id: 'L006', address: '5/10 Miller Street', suburb: 'North Sydney', type: 'Unit',
    listingType: 'Sale', price: 750000, agent: 'Lisa Chen', daysOnMarket: 3,
    status: 'Active', checklistPct: 30, amlStatus: 'Pending', section32: false,
    vendorStatement: false, marketingApproved: true, photosUploaded: false,
    signedAgencyAgreement: true, createdAt: '2025-06-10',
  },
]

// ── Property Management ───────────────────────────────────────────────────────
export type PMStatus = 'Leased' | 'Vacant' | 'Notice Given' | 'Periodic'
export interface PMProperty {
  id: string
  address: string
  suburb: string
  landlord: string
  tenant: string
  weeklyRent: number
  leaseStart: string
  leaseEnd: string
  status: PMStatus
  nextInspection: string
  smokeAlarmDate: string
  poolComplianceDate: string | null
  checklistPct: number
  rentInArrears: boolean
  maintenanceOpen: number
}

export const pmProperties: PMProperty[] = [
  {
    id: 'PM001', address: '12 Rosemont Ave', suburb: 'Baulkham Hills',
    landlord: 'David Lim', tenant: 'Emma Kovacs', weeklyRent: 620,
    leaseStart: '2024-07-01', leaseEnd: '2025-07-01', status: 'Periodic',
    nextInspection: '2025-07-15', smokeAlarmDate: '2025-02-10',
    poolComplianceDate: null, checklistPct: 100, rentInArrears: false, maintenanceOpen: 1,
  },
  {
    id: 'PM002', address: '3 Calder Road', suburb: 'Ryde',
    landlord: 'Angela West', tenant: 'Thomas Brennan', weeklyRent: 550,
    leaseStart: '2025-01-15', leaseEnd: '2026-01-15', status: 'Leased',
    nextInspection: '2025-07-15', smokeAlarmDate: '2025-01-14',
    poolComplianceDate: '2025-01-10', checklistPct: 95, rentInArrears: false, maintenanceOpen: 0,
  },
  {
    id: 'PM003', address: '7/88 Pacific Hwy', suburb: 'St Leonards',
    landlord: 'Pacific Assets Pty Ltd', tenant: '–', weeklyRent: 480,
    leaseStart: '–', leaseEnd: '–', status: 'Vacant',
    nextInspection: '–', smokeAlarmDate: '2024-11-20',
    poolComplianceDate: null, checklistPct: 60, rentInArrears: false, maintenanceOpen: 3,
  },
  {
    id: 'PM004', address: '22 Elm Street', suburb: 'Parramatta',
    landlord: 'John & Mary Elias', tenant: 'Sophie Huang', weeklyRent: 690,
    leaseStart: '2024-12-01', leaseEnd: '2025-11-30', status: 'Leased',
    nextInspection: '2025-06-20', smokeAlarmDate: '2024-11-28',
    poolComplianceDate: '2024-11-25', checklistPct: 88, rentInArrears: true, maintenanceOpen: 2,
  },
  {
    id: 'PM005', address: '15 Ironbark Close', suburb: 'Kellyville',
    landlord: 'Ryan Properties Trust', tenant: 'Jake Morrison', weeklyRent: 780,
    leaseStart: '2025-03-01', leaseEnd: '2026-03-01', status: 'Leased',
    nextInspection: '2025-09-01', smokeAlarmDate: '2025-02-28',
    poolComplianceDate: '2025-02-20', checklistPct: 100, rentInArrears: false, maintenanceOpen: 0,
  },
]

// ── AML Checks ────────────────────────────────────────────────────────────────
export type AMLStatus = 'Verified' | 'Pending' | 'Flagged' | 'Expired'
export interface AMLCheck {
  id: string
  name: string
  role: 'Buyer' | 'Seller' | 'Landlord' | 'Tenant'
  property: string
  idType: string
  pepCheck: boolean
  sanctionsCheck: boolean
  sourceOfFunds: boolean
  status: AMLStatus
  checkedBy: string
  checkedAt: string
  expiryDate: string
  riskRating: 'Low' | 'Medium' | 'High'
  notes: string
}

export const amlChecks: AMLCheck[] = [
  {
    id: 'AML001', name: 'David Lim', role: 'Seller', property: '14 Parkview Dr, Castle Hill',
    idType: 'Australian Passport', pepCheck: true, sanctionsCheck: true, sourceOfFunds: true,
    status: 'Verified', checkedBy: 'Sarah Nguyen', checkedAt: '2025-05-26',
    expiryDate: '2027-05-26', riskRating: 'Low', notes: '',
  },
  {
    id: 'AML002', name: 'Christine Baker', role: 'Buyer', property: '3 Banksia Ct, Cherrybrook',
    idType: 'Australian Driver Licence', pepCheck: true, sanctionsCheck: true, sourceOfFunds: true,
    status: 'Verified', checkedBy: 'Sarah Nguyen', checkedAt: '2025-06-01',
    expiryDate: '2027-06-01', riskRating: 'Low', notes: '',
  },
  {
    id: 'AML003', name: 'Wei Zhang', role: 'Buyer', property: '7/22 Harbour St, Pyrmont',
    idType: 'Chinese Passport', pepCheck: true, sanctionsCheck: false, sourceOfFunds: false,
    status: 'Pending', checkedBy: 'Michael Torres', checkedAt: '2025-06-08',
    expiryDate: '2027-06-08', riskRating: 'Medium', notes: 'Awaiting source of funds documentation',
  },
  {
    id: 'AML004', name: 'Hassan Al-Rashid', role: 'Buyer', property: '88 Mulgoa Rd, Penrith',
    idType: 'UAE Passport', pepCheck: false, sanctionsCheck: false, sourceOfFunds: false,
    status: 'Flagged', checkedBy: 'James Walters', checkedAt: '2025-04-27',
    expiryDate: '2027-04-27', riskRating: 'High', notes: 'PEP flag – requires enhanced due diligence. Foreign national, FIRB clearance required.',
  },
  {
    id: 'AML005', name: 'Angela West', role: 'Landlord', property: '3 Calder Rd, Ryde',
    idType: 'Australian Passport', pepCheck: true, sanctionsCheck: true, sourceOfFunds: true,
    status: 'Verified', checkedBy: 'Lisa Chen', checkedAt: '2024-12-10',
    expiryDate: '2026-12-10', riskRating: 'Low', notes: '',
  },
  {
    id: 'AML006', name: 'Robert Nguyen', role: 'Seller', property: '21 The Boulevarde, Strathfield',
    idType: 'Australian Driver Licence', pepCheck: true, sanctionsCheck: true, sourceOfFunds: true,
    status: 'Verified', checkedBy: 'Michael Torres', checkedAt: '2025-06-02',
    expiryDate: '2027-06-02', riskRating: 'Low', notes: '',
  },
]

// ── Trust Account ─────────────────────────────────────────────────────────────
export interface TrustEntry {
  id: string
  date: string
  description: string
  reference: string
  type: 'Deposit' | 'Disbursement' | 'Transfer'
  amount: number
  property: string
  status: 'Cleared' | 'Pending' | 'Reconciled'
}

export const trustEntries: TrustEntry[] = [
  {
    id: 'T001', date: '2025-06-12', description: 'Deposit – Exchange of Contracts',
    reference: 'REF-2025-0612-01', type: 'Deposit', amount: 105000,
    property: '3 Banksia Ct, Cherrybrook', status: 'Cleared',
  },
  {
    id: 'T002', date: '2025-06-10', description: 'Rent Receipt – June 2025',
    reference: 'REF-2025-0610-01', type: 'Deposit', amount: 2480,
    property: '12 Rosemont Ave, Baulkham Hills', status: 'Reconciled',
  },
  {
    id: 'T003', date: '2025-06-09', description: 'Disbursement to Vendor – Settlement',
    reference: 'REF-2025-0609-01', type: 'Disbursement', amount: -480000,
    property: '45 Old Windsor Rd, Windsor', status: 'Reconciled',
  },
  {
    id: 'T004', date: '2025-06-08', description: 'Bond Received – New Tenancy',
    reference: 'REF-2025-0608-01', type: 'Deposit', amount: 2200,
    property: '7/88 Pacific Hwy, St Leonards', status: 'Pending',
  },
  {
    id: 'T005', date: '2025-06-05', description: 'Disbursement – Landlord Monthly Payout',
    reference: 'REF-2025-0605-01', type: 'Disbursement', amount: -2140,
    property: '22 Elm Street, Parramatta', status: 'Reconciled',
  },
  {
    id: 'T006', date: '2025-06-01', description: 'Maintenance Funds – Plumbing Repair',
    reference: 'REF-2025-0601-01', type: 'Transfer', amount: -650,
    property: '3 Calder Rd, Ryde', status: 'Cleared',
  },
]

export const trustSummary = {
  salesTrustBalance: 1_247_500,
  pmTrustBalance: 84_320,
  totalTrust: 1_331_820,
  lastReconciled: '2025-06-10',
  nextReconciliation: '2025-06-17',
  reconciliationStatus: 'On Track' as const,
  unreconciled: 3,
}

// ── Licences & CPD ────────────────────────────────────────────────────────────
export interface Licence {
  id: string
  name: string
  role: string
  licenceType: string
  licenceNo: string
  issuer: string
  expiryDate: string
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Suspended'
  cpdHoursCompleted: number
  cpdHoursRequired: number
  cpdDueDate: string
}

export const licences: Licence[] = [
  {
    id: 'LIC001', name: 'James Thornton', role: 'Principal Licensee',
    licenceType: 'Real Estate Agent', licenceNo: 'L-1234567', issuer: 'NSW Fair Trading',
    expiryDate: '2026-03-15', status: 'Active', cpdHoursCompleted: 14, cpdHoursRequired: 16, cpdDueDate: '2025-12-31',
  },
  {
    id: 'LIC002', name: 'Sarah Nguyen', role: 'Licensed Agent',
    licenceType: 'Real Estate Agent', licenceNo: 'L-9876543', issuer: 'NSW Fair Trading',
    expiryDate: '2025-08-10', status: 'Expiring Soon', cpdHoursCompleted: 16, cpdHoursRequired: 16, cpdDueDate: '2025-12-31',
  },
  {
    id: 'LIC003', name: 'Michael Torres', role: 'Licensed Agent',
    licenceType: 'Real Estate Agent', licenceNo: 'L-5554321', issuer: 'NSW Fair Trading',
    expiryDate: '2026-11-20', status: 'Active', cpdHoursCompleted: 8, cpdHoursRequired: 16, cpdDueDate: '2025-12-31',
  },
  {
    id: 'LIC004', name: 'Lisa Chen', role: 'Registered Salesperson',
    licenceType: 'Certificate of Registration', licenceNo: 'R-3334455', issuer: 'NSW Fair Trading',
    expiryDate: '2025-06-30', status: 'Expiring Soon', cpdHoursCompleted: 10, cpdHoursRequired: 16, cpdDueDate: '2025-12-31',
  },
  {
    id: 'LIC005', name: 'James Walters', role: 'Licensed Agent',
    licenceType: 'Real Estate Agent', licenceNo: 'L-7778899', issuer: 'NSW Fair Trading',
    expiryDate: '2027-01-05', status: 'Active', cpdHoursCompleted: 16, cpdHoursRequired: 16, cpdDueDate: '2025-12-31',
  },
  {
    id: 'LIC006', name: 'Rachel Kim', role: 'Property Manager',
    licenceType: 'Certificate of Registration', licenceNo: 'R-1122334', issuer: 'NSW Fair Trading',
    expiryDate: '2025-05-01', status: 'Expired', cpdHoursCompleted: 6, cpdHoursRequired: 16, cpdDueDate: '2025-12-31',
  },
]

// ── Policies & Procedures ─────────────────────────────────────────────────────
export interface Policy {
  id: string
  title: string
  category: string
  version: string
  lastReviewed: string
  nextReview: string
  owner: string
  status: 'Current' | 'Under Review' | 'Overdue Review' | 'Draft'
  acknowledgedCount: number
  totalStaff: number
}

export const policies: Policy[] = [
  {
    id: 'POL001', title: 'Anti-Money Laundering & Counter-Terrorism Financing Policy',
    category: 'AML / CTF', version: '3.1', lastReviewed: '2025-01-15',
    nextReview: '2026-01-15', owner: 'James Thornton', status: 'Current',
    acknowledgedCount: 5, totalStaff: 6,
  },
  {
    id: 'POL002', title: 'Trust Account Management Procedures',
    category: 'Trust Accounting', version: '2.4', lastReviewed: '2025-03-01',
    nextReview: '2026-03-01', owner: 'James Thornton', status: 'Current',
    acknowledgedCount: 6, totalStaff: 6,
  },
  {
    id: 'POL003', title: 'Privacy Policy & Client Data Handling',
    category: 'Privacy', version: '2.0', lastReviewed: '2024-11-01',
    nextReview: '2025-11-01', owner: 'Sarah Nguyen', status: 'Current',
    acknowledgedCount: 4, totalStaff: 6,
  },
  {
    id: 'POL004', title: 'Professional Conduct & Ethics Code',
    category: 'Conduct', version: '1.8', lastReviewed: '2024-08-15',
    nextReview: '2025-08-15', owner: 'James Thornton', status: 'Current',
    acknowledgedCount: 6, totalStaff: 6,
  },
  {
    id: 'POL005', title: 'Residential Tenancies Compliance Procedures',
    category: 'Property Management', version: '1.5', lastReviewed: '2024-06-01',
    nextReview: '2025-06-01', owner: 'Rachel Kim', status: 'Overdue Review',
    acknowledgedCount: 3, totalStaff: 6,
  },
  {
    id: 'POL006', title: 'Vendor Disclosure & Marketing Approval',
    category: 'Sales', version: '2.2', lastReviewed: '2025-02-20',
    nextReview: '2026-02-20', owner: 'Michael Torres', status: 'Current',
    acknowledgedCount: 5, totalStaff: 6,
  },
  {
    id: 'POL007', title: 'Strata & Building Compliance Obligations',
    category: 'Compliance', version: '1.1', lastReviewed: '2024-04-01',
    nextReview: '2025-04-01', owner: 'James Thornton', status: 'Overdue Review',
    acknowledgedCount: 2, totalStaff: 6,
  },
  {
    id: 'POL008', title: 'Cyber Security & Information Technology Policy',
    category: 'IT Security', version: '1.0', lastReviewed: '2025-04-10',
    nextReview: '2026-04-10', owner: 'James Thornton', status: 'Under Review',
    acknowledgedCount: 1, totalStaff: 6,
  },
]

// ── Activity Feed ─────────────────────────────────────────────────────────────
export const reActivityFeed = [
  { id: 1, type: 'listing',  text: 'New listing created: 5/10 Miller St, North Sydney',       time: '2 hrs ago',  user: 'Lisa Chen'      },
  { id: 2, type: 'aml',      text: 'AML check verified: Robert Nguyen (Seller)',               time: '3 hrs ago',  user: 'Michael Torres' },
  { id: 3, type: 'trust',    text: 'Trust deposit received: $105,000 – 3 Banksia Ct',         time: '4 hrs ago',  user: 'System'         },
  { id: 4, type: 'policy',   text: 'Policy acknowledged: AML Policy – James Walters',          time: '5 hrs ago',  user: 'System'         },
  { id: 5, type: 'pm',       text: 'Routine inspection completed: 3 Calder Rd, Ryde',         time: '1 day ago',  user: 'Rachel Kim'     },
  { id: 6, type: 'licence',  text: 'CPD hours updated: Michael Torres – 8/16 hrs',             time: '1 day ago',  user: 'System'         },
  { id: 7, type: 'checklist',text: 'Listing checklist 100%: 3 Banksia Ct, Cherrybrook',       time: '2 days ago', user: 'Sarah Nguyen'   },
  { id: 8, type: 'trust',    text: 'Monthly reconciliation completed – June 2025',             time: '3 days ago', user: 'James Thornton' },
]

// ── Smart Alerts ──────────────────────────────────────────────────────────────
export const reAlerts = [
  {
    id: 1, severity: 'critical' as const,
    title: 'AML Check Flagged',
    message: 'Hassan Al-Rashid (Buyer – 88 Mulgoa Rd) has a PEP flag. Enhanced due diligence required before proceeding.',
    action: 'Review AML', link: '/real-estate/aml',
  },
  {
    id: 2, severity: 'critical' as const,
    title: 'Licence Expired – Rachel Kim',
    message: 'Certificate of Registration R-1122334 expired 1 Jun 2025. Rachel must not act until renewed.',
    action: 'View Licences', link: '/real-estate/licences',
  },
  {
    id: 3, severity: 'warning' as const,
    title: 'Licence Expiring – Sarah Nguyen',
    message: 'Agent licence L-9876543 expires 10 Aug 2025 (58 days). Renewal must be lodged 30 days prior.',
    action: 'Renew Licence', link: '/real-estate/licences',
  },
  {
    id: 4, severity: 'warning' as const,
    title: 'Policy Review Overdue',
    message: '2 policies are past their scheduled review date: Residential Tenancies Procedures & Strata Compliance.',
    action: 'Review Policies', link: '/real-estate/policies',
  },
  {
    id: 5, severity: 'info' as const,
    title: 'Trust Reconciliation Due',
    message: 'Next statutory trust account reconciliation is due 17 June 2025 (4 days). 3 entries unreconciled.',
    action: 'Open Trust Account', link: '/real-estate/trust-account',
  },
]

// ── Listing checklist template ────────────────────────────────────────────────
export const salesChecklistTemplate = [
  { id: 'sc1',  label: 'Signed Agency Agreement (Exclusive or Open)',    category: 'Engagement'    },
  { id: 'sc2',  label: 'AML / KYC check completed for all vendors',     category: 'AML'            },
  { id: 'sc3',  label: 'Vendor ID verified (2 forms)',                   category: 'AML'            },
  { id: 'sc4',  label: 'Section 32 / Vendor Statement prepared',        category: 'Legal'          },
  { id: 'sc5',  label: 'Title search obtained',                          category: 'Legal'          },
  { id: 'sc6',  label: 'Contract of Sale prepared by solicitor',        category: 'Legal'          },
  { id: 'sc7',  label: 'Planning certificate (s149) obtained',          category: 'Legal'          },
  { id: 'sc8',  label: 'Smoke alarm compliance confirmed',               category: 'Compliance'     },
  { id: 'sc9',  label: 'Pool compliance certificate (if applicable)',    category: 'Compliance'     },
  { id: 'sc10', label: 'Vendor disclosure form signed',                  category: 'Disclosure'     },
  { id: 'sc11', label: 'FIRB clearance obtained (if foreign vendor)',    category: 'Compliance'     },
  { id: 'sc12', label: 'Marketing schedule approved by vendor',         category: 'Marketing'      },
  { id: 'sc13', label: 'Professional photography completed',             category: 'Marketing'      },
  { id: 'sc14', label: 'Floorplan prepared',                             category: 'Marketing'      },
  { id: 'sc15', label: 'Listed on realestate.com.au & domain.com.au',   category: 'Marketing'      },
  { id: 'sc16', label: 'Auction authority signed (if auction)',          category: 'Auction'        },
  { id: 'sc17', label: 'Auctioneer booked & licensed',                  category: 'Auction'        },
]

// ── PM checklist template ─────────────────────────────────────────────────────
export const pmChecklistTemplate = [
  { id: 'pm1',  label: 'Property Management Agreement signed',           category: 'Engagement'    },
  { id: 'pm2',  label: 'Landlord AML / KYC completed',                  category: 'AML'            },
  { id: 'pm3',  label: 'Landlord ID verified',                           category: 'AML'            },
  { id: 'pm4',  label: 'Smoke alarm compliance certificate obtained',    category: 'Compliance'     },
  { id: 'pm5',  label: 'Pool compliance certificate (if applicable)',    category: 'Compliance'     },
  { id: 'pm6',  label: 'Gas compliance certificate obtained',            category: 'Compliance'     },
  { id: 'pm7',  label: 'Electrical safety check completed',              category: 'Compliance'     },
  { id: 'pm8',  label: 'Residential tenancy agreement prepared',         category: 'Legal'          },
  { id: 'pm9',  label: 'Tenant application reference checks complete',  category: 'Tenant Checks'  },
  { id: 'pm10', label: 'Tenant ID verified',                             category: 'Tenant Checks'  },
  { id: 'pm11', label: 'Bond lodged with NSW Fair Trading',              category: 'Legal'          },
  { id: 'pm12', label: 'Condition report completed & signed',            category: 'Inspection'     },
  { id: 'pm13', label: 'Keys issued & logged',                           category: 'Handover'       },
  { id: 'pm14', label: 'Landlord insurance recommended',                 category: 'Risk'           },
  { id: 'pm15', label: 'Water efficiency certificate obtained',          category: 'Compliance'     },
]
