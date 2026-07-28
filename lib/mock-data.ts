export const companyInfo = {
  name: 'Acme Construction Pty Ltd',
  industry: 'Construction',
  complianceScore: 82,
  auditReadiness: 78,
  areas: [
    { name: 'Workers', score: 83 },
    { name: 'Contractors', score: 74 },
    { name: 'Training', score: 84 },
    { name: 'Equipment', score: 88 },
    { name: 'Sites', score: 79 },
    { name: 'Documents', score: 81 },
  ],
}

export const tasks = [
  { id: '1', title: 'Renew Public Liability Insurance', assignedTo: 'Sarah Mitchell', dueDate: '2025-05-03', priority: 'high' as const, status: 'due-today' as const, category: 'Insurance' },
  { id: '2', title: 'Complete Monthly WHS Inspection – Site A', assignedTo: 'James Chen', dueDate: '2025-05-03', priority: 'high' as const, status: 'due-today' as const, category: 'Inspection' },
  { id: '3', title: 'Upload updated Hazard Register', assignedTo: 'Sarah Mitchell', dueDate: '2025-04-28', priority: 'high' as const, status: 'overdue' as const, category: 'Documents' },
  { id: '4', title: 'Induction – New hire Tom Baker', assignedTo: 'HR Team', dueDate: '2025-04-30', priority: 'medium' as const, status: 'overdue' as const, category: 'Training' },
  { id: '5', title: 'Review Corrective Action CA-004', assignedTo: 'James Chen', dueDate: '2025-05-08', priority: 'medium' as const, status: 'upcoming' as const, category: 'Corrective Action' },
  { id: '6', title: 'Schedule annual fire safety audit', assignedTo: 'Sarah Mitchell', dueDate: '2025-05-12', priority: 'medium' as const, status: 'upcoming' as const, category: 'Audit' },
  { id: '7', title: 'Update contractor compliance records', assignedTo: 'Admin', dueDate: '2025-05-15', priority: 'low' as const, status: 'upcoming' as const, category: 'Contractors' },
  { id: '8', title: 'ISO 9001 internal audit prep', assignedTo: 'Quality Team', dueDate: '2025-05-20', priority: 'high' as const, status: 'upcoming' as const, category: 'ISO' },
]

export const expiringItems = [
  { id: '1', name: 'Public Liability Insurance', type: 'insurance' as const, owner: 'Acme Construction', expiryDate: '2025-05-10', status: 'expiring-soon' as const },
  { id: '2', name: 'Elevated Work Platform Licence – J. Chen', type: 'licence' as const, owner: 'James Chen', expiryDate: '2025-05-18', status: 'expiring-soon' as const },
  { id: '3', name: 'First Aid Certificate – S. Mitchell', type: 'certificate' as const, owner: 'Sarah Mitchell', expiryDate: '2025-05-25', status: 'expiring-soon' as const },
  { id: '4', name: 'WHS Management Plan 2024', type: 'document' as const, owner: 'Safety Team', expiryDate: '2025-04-20', status: 'expired' as const },
  { id: '5', name: 'Forklift Licence – M. Torres', type: 'licence' as const, owner: 'Marcus Torres', expiryDate: '2025-06-01', status: 'expiring-soon' as const },
  { id: '6', name: 'Scaffolding Certificate – R. Patel', type: 'certificate' as const, owner: 'Raj Patel', expiryDate: '2025-06-05', status: 'expiring-soon' as const },
  { id: '7', name: 'Workers Compensation Policy', type: 'insurance' as const, owner: 'Acme Construction', expiryDate: '2025-06-30', status: 'active' as const },
  { id: '8', name: 'Trade Contractor Agreement – BuildRight', type: 'document' as const, owner: 'BuildRight Pty Ltd', expiryDate: '2025-04-15', status: 'expired' as const },
]

export const workers = [
  {
    id: '1', name: 'James Chen', role: 'Site Manager', department: 'Operations',
    employmentType: 'permanent' as const, status: 'active' as const,
    complianceStatus: 'expiring' as const,
    approvalStatus: 'approved' as const,
    licences: [
      { type: 'Elevated Work Platform (EWP)', expiry: '2025-05-18', status: 'expiring-soon' as const },
      { type: 'Forklift (LF)', expiry: '2025-09-01', status: 'active' as const },
    ],
    trainingCompletion: 85, inductionStatus: 'complete' as const, lastOnSite: '2025-05-03',
    whiteCard: true, photo: null,
  },
  {
    id: '2', name: 'Sarah Mitchell', role: 'Compliance Manager', department: 'Safety',
    employmentType: 'permanent' as const, status: 'active' as const,
    complianceStatus: 'compliant' as const,
    approvalStatus: 'approved' as const,
    licences: [
      { type: 'First Aid Level 2', expiry: '2025-05-25', status: 'expiring-soon' as const },
    ],
    trainingCompletion: 100, inductionStatus: 'complete' as const, lastOnSite: '2025-05-03',
    whiteCard: true, photo: null,
  },
  {
    id: '3', name: 'Marcus Torres', role: 'Forklift Operator', department: 'Logistics',
    employmentType: 'permanent' as const, status: 'active' as const,
    complianceStatus: 'compliant' as const,
    approvalStatus: 'approved' as const,
    licences: [
      { type: 'Forklift (LF)', expiry: '2025-06-01', status: 'expiring-soon' as const },
      { type: 'Manual Handling', expiry: '2026-08-20', status: 'active' as const },
    ],
    trainingCompletion: 100, inductionStatus: 'complete' as const, lastOnSite: '2025-05-02',
    whiteCard: true, photo: null,
  },
  {
    id: '4', name: 'Raj Patel', role: 'Scaffolder', department: 'Structural',
    employmentType: 'casual' as const, status: 'active' as const,
    complianceStatus: 'compliant' as const,
    approvalStatus: 'pending' as const,
    licences: [
      { type: 'Scaffolding Certificate', expiry: '2025-06-05', status: 'expiring-soon' as const },
      { type: 'Working at Heights', expiry: '2026-06-12', status: 'active' as const },
    ],
    trainingCompletion: 100, inductionStatus: 'complete' as const, lastOnSite: '2025-05-01',
    whiteCard: true, photo: null,
  },
  {
    id: '5', name: 'Tom Baker', role: 'Labourer', department: 'General',
    employmentType: 'labour-hire' as const, status: 'active' as const,
    complianceStatus: 'non-compliant' as const,
    approvalStatus: 'declined' as const,
    licences: [],
    trainingCompletion: 0, inductionStatus: 'overdue' as const, lastOnSite: '2025-04-29',
    whiteCard: false, photo: null,
  },
  {
    id: '6', name: 'Lisa Wong', role: 'Site Administrator', department: 'Administration',
    employmentType: 'permanent' as const, status: 'active' as const,
    complianceStatus: 'compliant' as const,
    approvalStatus: 'approved' as const,
    licences: [
      { type: 'Emergency Warden', expiry: '2025-11-01', status: 'active' as const },
    ],
    trainingCompletion: 100, inductionStatus: 'complete' as const, lastOnSite: '2025-05-03',
    whiteCard: true, photo: null,
  },
  {
    id: '7', name: 'Chris Davis', role: 'Electrician', department: 'Electrical',
    employmentType: 'casual' as const, status: 'active' as const,
    complianceStatus: 'compliant' as const,
    approvalStatus: 'pending' as const,
    licences: [
      { type: 'Electrical Licence (EL)', expiry: '2026-09-05', status: 'active' as const },
      { type: 'Electrical Safety', expiry: '2026-09-05', status: 'active' as const },
    ],
    trainingCompletion: 100, inductionStatus: 'complete' as const, lastOnSite: '2025-04-30',
    whiteCard: true, photo: null,
  },
]

export const sites = [
  {
    id: '1', name: 'Site A – George St', address: '123 George St, Sydney NSW 2000',
    projectNumber: 'PRJ-2025-001', projectType: 'Commercial Office Fitout',
    projectValue: 2400000, supervisor: 'James Chen', whsCoordinator: 'Sarah Mitchell',
    startDate: '2025-01-10', endDate: '2025-08-30',
    status: 'active' as const, currentOccupancy: 14, complianceScore: 88,
    hasWhsmp: true, activePermits: 2, openHazards: 3, lastInspection: '2025-04-28',
  },
  {
    id: '2', name: 'Site B – Parramatta', address: '45 Church St, Parramatta NSW 2150',
    projectNumber: 'PRJ-2025-002', projectType: 'Residential Development',
    projectValue: 8500000, supervisor: 'Marcus Torres', whsCoordinator: 'Sarah Mitchell',
    startDate: '2025-02-15', endDate: '2025-12-20',
    status: 'active' as const, currentOccupancy: 22, complianceScore: 79,
    hasWhsmp: true, activePermits: 4, openHazards: 5, lastInspection: '2025-04-30',
  },
  {
    id: '3', name: 'Site C – Penrith', address: '78 High St, Penrith NSW 2750',
    projectNumber: 'PRJ-2025-003', projectType: 'Retail Fitout',
    projectValue: 750000, supervisor: 'Raj Patel', whsCoordinator: 'James Chen',
    startDate: '2025-03-01', endDate: '2025-06-30',
    status: 'active' as const, currentOccupancy: 8, complianceScore: 91,
    hasWhsmp: true, activePermits: 1, openHazards: 1, lastInspection: '2025-04-25',
  },
  {
    id: '4', name: 'Warehouse – Ryde', address: '12 Carlingford Rd, Ryde NSW 2112',
    projectNumber: 'PRJ-2024-008', projectType: 'Warehouse Operations',
    projectValue: 0, supervisor: 'Chris Davis', whsCoordinator: 'Sarah Mitchell',
    startDate: '2024-06-01', endDate: '2026-06-01',
    status: 'active' as const, currentOccupancy: 6, complianceScore: 74,
    hasWhsmp: false, activePermits: 0, openHazards: 4, lastInspection: '2025-04-15',
  },
]

export const equipment = [
  {
    id: '1', assetId: 'EQ-001', name: 'Toyota Forklift 2.5T', category: 'Forklift',
    make: 'Toyota', model: '8FG25', year: 2020, serialNumber: 'TY8FG2001234',
    registrationNumber: 'FL-4521', siteLocation: 'Warehouse – Ryde',
    requiredLicence: 'Forklift (LF)', status: 'active' as const,
    preStartToday: true, preStartScore: 96, defects: 0,
    nextServiceDate: '2025-06-15', lastServiceDate: '2025-03-15', serviceIntervalKm: 500,
  },
  {
    id: '2', assetId: 'EQ-002', name: 'JLG Scissor Lift 19ft', category: 'Elevated Work Platform',
    make: 'JLG', model: '1930ES', year: 2021, serialNumber: 'JLG193021987',
    registrationNumber: 'EWP-1832', siteLocation: 'Site A – George St',
    requiredLicence: 'EWP (WP)', status: 'active' as const,
    preStartToday: true, preStartScore: 100, defects: 0,
    nextServiceDate: '2025-07-01', lastServiceDate: '2025-01-01', serviceIntervalKm: 0,
  },
  {
    id: '3', assetId: 'EQ-003', name: 'Caterpillar Excavator 5T', category: 'Excavator',
    make: 'Caterpillar', model: '305.5', year: 2019, serialNumber: 'CAT3055201945',
    registrationNumber: 'EX-7742', siteLocation: 'Site B – Parramatta',
    requiredLicence: 'Plant Operator', status: 'under-service' as const,
    preStartToday: false, preStartScore: undefined, defects: 2,
    nextServiceDate: '2025-05-10', lastServiceDate: '2025-02-10', serviceIntervalKm: 250,
  },
  {
    id: '4', assetId: 'EQ-004', name: 'Hilti Rotary Hammer Drill', category: 'Power Tool',
    make: 'Hilti', model: 'TE 60-ATC', year: 2022, serialNumber: 'HLT6022567',
    registrationNumber: 'PT-0234', siteLocation: 'Site A – George St',
    requiredLicence: 'None', status: 'active' as const,
    preStartToday: false, preStartScore: undefined, defects: 0,
    nextServiceDate: '2025-09-01', lastServiceDate: '2024-09-01', serviceIntervalKm: 0,
  },
  {
    id: '5', assetId: 'EQ-005', name: 'Scaffolding System – Type A', category: 'Scaffolding',
    make: 'Layher', model: 'Allround', year: 2018, serialNumber: 'LYH18003421',
    registrationNumber: 'SC-0087', siteLocation: 'Site B – Parramatta',
    requiredLicence: 'Scaffolding Certificate', status: 'active' as const,
    preStartToday: true, preStartScore: 88, defects: 1,
    nextServiceDate: '2025-08-01', lastServiceDate: '2025-02-01', serviceIntervalKm: 0,
  },
  {
    id: '6', assetId: 'EQ-006', name: 'Compressor – 185 CFM', category: 'Compressor',
    make: 'Atlas Copco', model: 'XAS 185', year: 2020, serialNumber: 'AC185202078',
    registrationNumber: 'CP-0341', siteLocation: 'Site C – Penrith',
    requiredLicence: 'None', status: 'active' as const,
    preStartToday: true, preStartScore: 100, defects: 0,
    nextServiceDate: '2025-05-20', lastServiceDate: '2025-02-20', serviceIntervalKm: 0,
  },
]

export const kpiMetrics = {
  ltifr: 2.4,
  trifr: 8.6,
  nearMissFrequency: 4.2,
  mtifr: 3.1,
  daysLostToInjury: 8,
  preStartsDoneToday: 4,
  preStartsScheduled: 6,
  trainingCompletionRate: 84,
  contractorsFullyQualified: 75,
  workersWithCurrentLicences: 82,
  inductionsCompletedRate: 86,
  toolboxTalksThisMonth: 8,
  toolboxTalksTarget: 10,
  inspectionsOnTime: 3,
  inspectionsScheduled: 4,
  hazardsReportedThisMonth: 7,
  openCAPAs: 4,
  overdueCAPAs: 1,
  onTimeCAPAClosureRate: 78,
  overdueDocReviews: 3,
  activePermits: 7,
  expiringPermits: 2,
  siteOccupancyTotal: 50,
  monthlyTrend: [
    { month: 'Nov', score: 74 },
    { month: 'Dec', score: 76 },
    { month: 'Jan', score: 78 },
    { month: 'Feb', score: 77 },
    { month: 'Mar', score: 80 },
    { month: 'Apr', score: 82 },
  ],
  ltifrTrend: [
    { month: 'Nov', value: 4.1 },
    { month: 'Dec', value: 3.8 },
    { month: 'Jan', value: 3.2 },
    { month: 'Feb', value: 2.9 },
    { month: 'Mar', value: 2.6 },
    { month: 'Apr', value: 2.4 },
  ],
}

export const swmsList = [
  { id: '1', title: 'Working at Heights – Level 3 Formwork', site: 'Site A – George St', revision: 'v2.1', createdBy: 'James Chen', createdDate: '2025-04-10', status: 'active' as const, signedCount: 6, totalWorkers: 6, linkedPermit: 'PTW-001', riskRating: 'high' as const },
  { id: '2', title: 'Excavation and Trenching – Site B', site: 'Site B – Parramatta', revision: 'v1.0', createdBy: 'Marcus Torres', createdDate: '2025-04-22', status: 'active' as const, signedCount: 4, totalWorkers: 5, linkedPermit: 'PTW-003', riskRating: 'high' as const },
  { id: '3', title: 'Confined Space Entry – Stormwater Pit', site: 'Warehouse – Ryde', revision: 'v1.2', createdBy: 'Chris Davis', createdDate: '2025-03-15', status: 'active' as const, signedCount: 3, totalWorkers: 3, linkedPermit: 'PTW-002', riskRating: 'critical' as const },
  { id: '4', title: 'Hot Work – Welding and Cutting', site: 'Site B – Parramatta', revision: 'v1.1', createdBy: 'Raj Patel', createdDate: '2025-04-28', status: 'draft' as const, signedCount: 0, totalWorkers: 0, linkedPermit: '', riskRating: 'high' as const },
  { id: '5', title: 'Manual Handling – Precast Panel Installation', site: 'Site A – George St', revision: 'v1.0', createdBy: 'James Chen', createdDate: '2025-02-20', status: 'superseded' as const, signedCount: 8, totalWorkers: 8, linkedPermit: '', riskRating: 'medium' as const },
]

export const trainingRecords = [
  { id: '1', staffName: 'James Chen', course: 'WHS Induction', completedDate: '2024-03-10', expiryDate: '2025-03-10', status: 'overdue' as const, completion: 100 },
  { id: '2', staffName: 'Sarah Mitchell', course: 'First Aid Level 2', completedDate: '2023-05-15', expiryDate: '2025-05-15', status: 'expiring-soon' as const, completion: 100 },
  { id: '3', staffName: 'Marcus Torres', course: 'Manual Handling', completedDate: '2024-08-20', expiryDate: '2026-08-20', status: 'current' as const, completion: 100 },
  { id: '4', staffName: 'Raj Patel', course: 'Working at Heights', completedDate: '2024-06-12', expiryDate: '2026-06-12', status: 'current' as const, completion: 100 },
  { id: '5', staffName: 'Tom Baker', course: 'WHS Induction', completedDate: '', expiryDate: '', status: 'overdue' as const, completion: 0 },
  { id: '6', staffName: 'Lisa Wong', course: 'Emergency Warden Training', completedDate: '2024-11-01', expiryDate: '2025-11-01', status: 'current' as const, completion: 100 },
  { id: '7', staffName: 'Chris Davis', course: 'Electrical Safety', completedDate: '2024-09-05', expiryDate: '2026-09-05', status: 'current' as const, completion: 100 },
]

export const contractors = [
  { id: '1', company: 'BuildRight Pty Ltd', contact: 'Dave Harris', phone: '0412 345 678', industry: 'Structural', insuranceExpiry: '2025-05-10', licenceStatus: 'Valid', complianceScore: 74, status: 'expiring' as const, preQualStatus: 'approved' as const, workers: 5 },
  { id: '2', company: 'SafeElect Services', contact: 'Anna Kowalski', phone: '0423 456 789', industry: 'Electrical', insuranceExpiry: '2025-09-20', licenceStatus: 'Valid', complianceScore: 95, status: 'compliant' as const, preQualStatus: 'approved' as const, workers: 3 },
  { id: '3', company: 'ProPlumb Co.', contact: 'Nick Turner', phone: '0434 567 890', industry: 'Plumbing', insuranceExpiry: '2025-07-15', licenceStatus: 'Valid', complianceScore: 88, status: 'compliant' as const, preQualStatus: 'approved' as const, workers: 2 },
  { id: '4', company: 'FastAccess Scaffolding', contact: 'Ben Moore', phone: '0445 678 901', industry: 'Scaffolding', insuranceExpiry: '2025-04-01', licenceStatus: 'Expired', complianceScore: 42, status: 'non-compliant' as const, preQualStatus: 'suspended' as const, workers: 4 },
  { id: '5', company: 'CleanSite Services', contact: 'Maria Garcia', phone: '0456 789 012', industry: 'Cleaning', insuranceExpiry: '2025-11-30', licenceStatus: 'Valid', complianceScore: 91, status: 'compliant' as const, preQualStatus: 'approved' as const, workers: 2 },
  { id: '6', company: 'TechMech Engineering', contact: 'Paul Zhang', phone: '0467 890 123', industry: 'Mechanical', insuranceExpiry: '2025-06-20', licenceStatus: 'Valid', complianceScore: 83, status: 'compliant' as const, preQualStatus: 'approved' as const, workers: 3 },
  { id: '7', company: 'GroundWorks Excavation', contact: 'Steve Hill', phone: '0478 901 234', industry: 'Civil', insuranceExpiry: '2025-05-28', licenceStatus: 'Valid', complianceScore: 67, status: 'expiring' as const, preQualStatus: 'pending' as const, workers: 6 },
  { id: '8', company: 'AirTech HVAC', contact: 'Rachel Kim', phone: '0489 012 345', industry: 'HVAC', insuranceExpiry: '2025-10-10', licenceStatus: 'Valid', complianceScore: 90, status: 'compliant' as const, preQualStatus: 'approved' as const, workers: 2 },
]

export const inspections = [
  { id: '1', site: 'Site A – George St', formType: 'Monthly WHS Inspection', date: '2025-04-28', inspector: 'James Chen', score: 87, status: 'completed' as const },
  { id: '2', site: 'Site B – Parramatta', formType: 'Pre-Start Safety Check', date: '2025-04-30', inspector: 'Sarah Mitchell', score: 92, status: 'completed' as const },
  { id: '3', site: 'Site A – George St', formType: 'Fire Safety Inspection', date: '2025-05-03', inspector: 'James Chen', score: 0, status: 'in-progress' as const },
  { id: '4', site: 'Site C – Penrith', formType: 'Monthly WHS Inspection', date: '2025-05-10', inspector: 'Marcus Torres', score: 0, status: 'scheduled' as const },
  { id: '5', site: 'Warehouse – Ryde', formType: 'Chemical Storage Audit', date: '2025-04-15', inspector: 'Raj Patel', score: 78, status: 'completed' as const },
]

export const incidents = [
  { id: 'INC-001', type: 'Near Miss – Falling Object', date: '2025-04-22', location: 'Site A – George St', severity: 'near-miss' as const, reportedBy: 'James Chen', status: 'closed' as const },
  { id: 'INC-002', type: 'Slip & Fall – Wet Surface', date: '2025-04-28', location: 'Site B – Parramatta', severity: 'minor' as const, reportedBy: 'Sarah Mitchell', status: 'under-review' as const },
  { id: 'INC-003', type: 'Equipment Malfunction – Forklift', date: '2025-04-30', location: 'Warehouse – Ryde', severity: 'major' as const, reportedBy: 'Marcus Torres', status: 'open' as const },
  { id: 'INC-004', type: 'Chemical Spill', date: '2025-05-01', location: 'Warehouse – Ryde', severity: 'minor' as const, reportedBy: 'Raj Patel', status: 'open' as const },
]

export const hazards = [
  { id: 'HAZ-001', description: 'Unsecured scaffolding at Level 4 perimeter', site: 'Site A – George St', category: 'fall' as const, likelihood: 3, consequence: 4, riskRating: 'high' as const, raisedBy: 'James Chen', raisedDate: '2025-04-20', status: 'open' as const, control: 'Install guardrails and toe boards', assignedTo: 'James Chen' },
  { id: 'HAZ-002', description: 'Wet concrete causing slipping hazard near entry', site: 'Site B – Parramatta', category: 'slip-trip' as const, likelihood: 4, consequence: 2, riskRating: 'medium' as const, raisedBy: 'Sarah Mitchell', raisedDate: '2025-04-28', status: 'in-progress' as const, control: 'Place warning signs and non-slip mats', assignedTo: 'Sarah Mitchell' },
  { id: 'HAZ-003', description: 'Overhead powerlines within 3m of crane operation', site: 'Site A – George St', category: 'electrical' as const, likelihood: 2, consequence: 5, riskRating: 'high' as const, raisedBy: 'Marcus Torres', raisedDate: '2025-04-29', status: 'open' as const, control: 'Exclusion zone and spotter required', assignedTo: 'Marcus Torres' },
  { id: 'HAZ-004', description: 'Inadequate lighting in lower basement level', site: 'Warehouse – Ryde', category: 'environment' as const, likelihood: 3, consequence: 2, riskRating: 'medium' as const, raisedBy: 'Raj Patel', raisedDate: '2025-04-15', status: 'closed' as const, control: 'Temporary lighting installed', assignedTo: 'Raj Patel' },
  { id: 'HAZ-005', description: 'Unguarded rotating machinery on compressor', site: 'Warehouse – Ryde', category: 'plant' as const, likelihood: 2, consequence: 4, riskRating: 'high' as const, raisedBy: 'Chris Davis', raisedDate: '2025-05-01', status: 'open' as const, control: 'Machine guarding required immediately', assignedTo: 'Chris Davis' },
  { id: 'HAZ-006', description: 'Chemical drums stored without secondary containment', site: 'Site C – Penrith', category: 'chemical' as const, likelihood: 2, consequence: 3, riskRating: 'medium' as const, raisedBy: 'Tom Baker', raisedDate: '2025-05-02', status: 'open' as const, control: 'Install bunded storage pallets', assignedTo: 'Sarah Mitchell' },
]

export const correctiveActions = [
  { id: 'CA-001', action: 'Install additional safety netting at Level 3', relatedIncident: 'INC-001', assignedTo: 'James Chen', dueDate: '2025-05-10', priority: 'high' as const, status: 'in-progress' as const },
  { id: 'CA-002', action: 'Apply non-slip matting to wet work areas', relatedIncident: 'INC-002', assignedTo: 'Sarah Mitchell', dueDate: '2025-05-07', priority: 'high' as const, status: 'open' as const },
  { id: 'CA-003', action: 'Schedule forklift maintenance inspection', relatedIncident: 'INC-003', assignedTo: 'Marcus Torres', dueDate: '2025-05-05', priority: 'high' as const, status: 'open' as const },
  { id: 'CA-004', action: 'Update chemical storage procedures and signage', relatedIncident: 'INC-004', assignedTo: 'Raj Patel', dueDate: '2025-05-08', priority: 'medium' as const, status: 'open' as const },
  { id: 'CA-005', action: 'Conduct team briefing on manual handling', relatedIncident: '', assignedTo: 'HR Team', dueDate: '2025-04-25', priority: 'low' as const, status: 'overdue' as const },
  { id: 'CA-006', action: 'Review and update Emergency Response Plan', relatedIncident: '', assignedTo: 'Safety Team', dueDate: '2025-04-01', priority: 'medium' as const, status: 'completed' as const },
]

export const documents = [
  { id: '1', name: 'WHS Management Plan 2025', category: 'policy' as const, version: 'v3.1', lastUpdated: '2025-01-15', fileType: 'pdf' as const },
  { id: '2', name: 'Emergency Response Procedure', category: 'procedure' as const, version: 'v2.0', lastUpdated: '2025-02-10', fileType: 'pdf' as const },
  { id: '3', name: 'Contractor Onboarding Checklist', category: 'form' as const, version: 'v1.4', lastUpdated: '2025-03-01', fileType: 'docx' as const },
  { id: '4', name: 'Chemical Register', category: 'register' as const, version: 'v5.2', lastUpdated: '2025-04-20', fileType: 'xlsx' as const },
  { id: '5', name: 'Privacy Policy', category: 'policy' as const, version: 'v1.0', lastUpdated: '2024-12-01', fileType: 'pdf' as const },
  { id: '6', name: 'Site Induction Form', category: 'form' as const, version: 'v2.1', lastUpdated: '2025-02-28', fileType: 'docx' as const },
  { id: '7', name: 'Hazard Register', category: 'register' as const, version: 'v4.0', lastUpdated: '2025-01-30', fileType: 'xlsx' as const },
  { id: '8', name: 'Safe Work Method Statement – Working at Heights', category: 'procedure' as const, version: 'v1.2', lastUpdated: '2025-03-15', fileType: 'pdf' as const },
  { id: '9', name: 'ISO 9001 Quality Manual', category: 'policy' as const, version: 'v2.3', lastUpdated: '2025-01-05', fileType: 'pdf' as const },
  { id: '10', name: 'Public Liability Insurance Certificate', category: 'certificate' as const, version: 'v1.0', lastUpdated: '2024-05-10', fileType: 'pdf' as const },
]

export const registers = [
  { id: '1', name: 'Chemical Register', description: 'SDS sheets and chemical inventory', icon: 'flask', entries: 24, lastUpdated: '2025-04-20', status: 'current' as const },
  { id: '2', name: 'Hazard Register', description: 'Identified site hazards and controls', icon: 'alert-triangle', entries: 18, lastUpdated: '2025-04-28', status: 'current' as const },
  { id: '3', name: 'Plant & Equipment Register', description: 'Plant, tools and equipment records', icon: 'wrench', entries: 31, lastUpdated: '2025-04-15', status: 'current' as const },
  { id: '4', name: 'Incident Register', description: 'All recorded incidents and near misses', icon: 'file-warning', entries: 12, lastUpdated: '2025-05-01', status: 'current' as const },
  { id: '5', name: 'Training Register', description: 'Staff training and certification records', icon: 'graduation-cap', entries: 47, lastUpdated: '2025-04-30', status: 'current' as const },
  { id: '6', name: 'Contractor Register', description: 'Approved contractor records and compliance', icon: 'users', entries: 8, lastUpdated: '2025-04-25', status: 'current' as const },
]

export const activityFeed = [
  { id: '1', action: 'Inspection completed', detail: 'Site B – Monthly WHS Inspection scored 92/100', user: 'Sarah Mitchell', time: '2h ago', type: 'inspection' as const },
  { id: '2', action: 'Incident reported', detail: 'Chemical spill at Warehouse – Ryde', user: 'Raj Patel', time: '5h ago', type: 'incident' as const },
  { id: '3', action: 'Document uploaded', detail: 'Updated Emergency Response Procedure v2.0', user: 'Sarah Mitchell', time: '1d ago', type: 'document' as const },
  { id: '4', action: 'Corrective action opened', detail: 'CA-003: Schedule forklift maintenance', user: 'System', time: '1d ago', type: 'action' as const },
  { id: '5', action: 'Contractor onboarded', detail: 'AirTech HVAC – compliance documents received', user: 'Admin', time: '2d ago', type: 'contractor' as const },
  { id: '6', action: 'Training completed', detail: 'Lisa Wong completed Emergency Warden Training', user: 'HR Team', time: '3d ago', type: 'training' as const },
]

export const adminClients = [
  { id: '1', company: 'Acme Construction Pty Ltd', industry: 'Construction', plan: 'professional' as const, users: 12, complianceScore: 82, lastActive: '2025-05-03', status: 'active' as const },
  { id: '2', company: 'Meridian Facilities Group', industry: 'Facilities', plan: 'enterprise' as const, users: 34, complianceScore: 91, lastActive: '2025-05-03', status: 'active' as const },
  { id: '3', company: 'Apex Real Estate', industry: 'Real Estate', plan: 'professional' as const, users: 8, complianceScore: 75, lastActive: '2025-05-02', status: 'active' as const },
  { id: '4', company: 'TradePro Services', industry: 'Trades', plan: 'starter' as const, users: 4, complianceScore: 63, lastActive: '2025-04-30', status: 'active' as const },
  { id: '5', company: 'Horizon Manufacturing', industry: 'Manufacturing', plan: 'enterprise' as const, users: 57, complianceScore: 88, lastActive: '2025-05-03', status: 'active' as const },
  { id: '6', company: 'Pinnacle Engineering', industry: 'Engineering', plan: 'professional' as const, users: 15, complianceScore: 79, lastActive: '2025-05-01', status: 'active' as const },
  { id: '7', company: 'BlueSky Aviation', industry: 'Aviation', plan: 'enterprise' as const, users: 28, complianceScore: 94, lastActive: '2025-05-03', status: 'active' as const },
  { id: '8', company: 'Metro Cleaning Solutions', industry: 'Cleaning', plan: 'starter' as const, users: 6, complianceScore: 58, lastActive: '2025-04-25', status: 'trial' as const },
  { id: '9', company: 'Coastal Landscaping Co.', industry: 'Landscaping', plan: 'starter' as const, users: 3, complianceScore: 45, lastActive: '2025-04-18', status: 'trial' as const },
  { id: '10', company: 'UrbanTech Developers', industry: 'Construction', plan: 'professional' as const, users: 19, complianceScore: 72, lastActive: '2025-05-02', status: 'active' as const },
  { id: '11', company: 'NovaCare Health Services', industry: 'Healthcare', plan: 'enterprise' as const, users: 44, complianceScore: 96, lastActive: '2025-05-03', status: 'active' as const },
  { id: '12', company: 'FastTrack Logistics', industry: 'Logistics', plan: 'professional' as const, users: 21, complianceScore: 81, lastActive: '2025-04-29', status: 'active' as const },
  { id: '13', company: 'Summit Security Group', industry: 'Security', plan: 'professional' as const, users: 11, complianceScore: 77, lastActive: '2025-04-27', status: 'active' as const },
  { id: '14', company: 'Greenfield Agriculture', industry: 'Agriculture', plan: 'starter' as const, users: 5, complianceScore: 52, lastActive: '2025-04-10', status: 'suspended' as const },
  { id: '15', company: 'Pacific Retail Group', industry: 'Retail', plan: 'professional' as const, users: 17, complianceScore: 84, lastActive: '2025-05-01', status: 'active' as const },
]

// ─── Smart Alerts ──────────────────────────────────────────────────────────
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success'
export const smartAlerts = [
  { id: 'sa1', severity: 'critical' as AlertSeverity, title: 'Insurance Expiring', message: 'Public Liability Insurance expires in 7 days', action: 'Renew Now', link: '/dashboard/documents' },
  { id: 'sa2', severity: 'critical' as AlertSeverity, title: 'Permit Awaiting Approval', message: 'Hot Work Permit — Site A is awaiting your sign-off', action: 'Review', link: '/dashboard/permits' },
  { id: 'sa3', severity: 'warning' as AlertSeverity, title: 'Toolbox Talk Overdue', message: 'Site B — 9 days since last toolbox talk (policy: weekly)', action: 'Schedule Now', link: '/dashboard/toolbox' },
  { id: 'sa4', severity: 'warning' as AlertSeverity, title: 'Training Expiring', message: '3 workers have training certificates expiring this month', action: 'View Workers', link: '/dashboard/training' },
  { id: 'sa5', severity: 'info' as AlertSeverity, title: 'SWMS Signature Pending', message: '4 workers yet to acknowledge the Roofing SWMS', action: 'Send Reminder', link: '/dashboard/swms' },
  { id: 'sa6', severity: 'success' as AlertSeverity, title: 'Pre-starts Complete', message: 'All 3 scheduled pre-starts submitted today', action: null, link: null },
]

// ─── Permits to Work ───────────────────────────────────────────────────────
export type PermitStatus = 'active' | 'pending' | 'expired' | 'closed'
export type PermitType = 'hot-work' | 'confined-space' | 'working-at-heights' | 'electrical' | 'excavation' | 'chem-handling'
export const permitTypes: Record<PermitType, { label: string; icon: string; color: string }> = {
  'hot-work':           { label: 'Hot Work',            icon: '🔥', color: '#ef4444' },
  'confined-space':     { label: 'Confined Space',      icon: '🕳️', color: '#8b5cf6' },
  'working-at-heights': { label: 'Working at Heights',  icon: '🪜', color: '#f59e0b' },
  'electrical':         { label: 'Electrical',          icon: '⚡', color: '#3b82f6' },
  'excavation':         { label: 'Excavation',          icon: '⛏️', color: '#78716c' },
  'chem-handling':      { label: 'Chemical Handling',   icon: '⚗️', color: '#10b981' },
}
export const permits = [
  { id: 'PTW-001', type: 'hot-work' as PermitType,           site: 'Site A — Level 3', description: 'Welding of structural steel beams',           requestedBy: 'James Chen',   approvedBy: 'Sarah Mitchell', status: 'active' as PermitStatus,  startDate: '2025-05-04', endDate: '2025-05-04', validHours: 8,  riskLevel: 'high'   },
  { id: 'PTW-002', type: 'working-at-heights' as PermitType, site: 'Site A — Roof',    description: 'Roofing installation, eave line work',          requestedBy: 'Marcus Torres', approvedBy: null,           status: 'pending' as PermitStatus, startDate: '2025-05-05', endDate: '2025-05-05', validHours: 10, riskLevel: 'high'   },
  { id: 'PTW-003', type: 'electrical' as PermitType,         site: 'Site B — DB Room', description: 'Distribution board upgrade and testing',        requestedBy: 'Raj Patel',    approvedBy: 'Sarah Mitchell', status: 'active' as PermitStatus,  startDate: '2025-05-04', endDate: '2025-05-04', validHours: 6,  riskLevel: 'medium' },
  { id: 'PTW-004', type: 'confined-space' as PermitType,     site: 'Site B — Basement',description: 'Stormwater pit inspection and pump maintenance', requestedBy: 'Tom Nguyen',   approvedBy: 'Sarah Mitchell', status: 'closed' as PermitStatus,  startDate: '2025-05-02', endDate: '2025-05-02', validHours: 4,  riskLevel: 'high'   },
  { id: 'PTW-005', type: 'excavation' as PermitType,         site: 'Site C — North',   description: 'Trenching for stormwater drainage',             requestedBy: 'David Park',   approvedBy: null,           status: 'pending' as PermitStatus, startDate: '2025-05-06', endDate: '2025-05-07', validHours: 16, riskLevel: 'medium' },
  { id: 'PTW-006', type: 'hot-work' as PermitType,           site: 'Site A — Level 1', description: 'Pipe brazing — mechanical services',            requestedBy: 'Aisha Patel',  approvedBy: 'Sarah Mitchell', status: 'expired' as PermitStatus, startDate: '2025-05-01', endDate: '2025-05-01', validHours: 6,  riskLevel: 'high'   },
]

// ─── Pre-start Checklists ──────────────────────────────────────────────────
export const prestartTemplates = [
  {
    id: 'ps-001', name: 'General Site Pre-start', trade: 'General', site: 'All Sites',
    items: ['All workers inducted for this site', 'PPE inspected and worn correctly', 'Exclusion zones established', 'Emergency procedures reviewed', 'Plant & equipment pre-start checks complete', 'SWMS reviewed and signed', 'First aid kit accessible and stocked', 'Weather conditions suitable for work'],
  },
  {
    id: 'ps-002', name: 'Working at Heights Pre-start', trade: 'Roofing', site: 'Site A',
    items: ['Harness inspected and fitted', 'Anchor points rated and certified', 'Edge protection in place', 'Ladder secured at correct angle', 'Drop zone barricaded', 'Rescue plan reviewed with team', 'Wind speed below 45km/h', 'Permit to Work sighted'],
  },
  {
    id: 'ps-003', name: 'Plant & Equipment Pre-start', trade: 'Civil', site: 'Site B',
    items: ['Operator licence verified', 'Walk-around inspection complete', 'Fluids checked (oil, hydraulic, coolant)', 'Lights and mirrors functional', 'Seatbelt fitted and working', 'Horn and reversing alarm tested', 'Exclusion zone established', 'Ground conditions assessed'],
  },
]
export const prestartSubmissions = [
  { id: 'sub-001', templateId: 'ps-001', submittedBy: 'Marcus Torres', site: 'Site A', date: '2025-05-04', time: '06:47', status: 'pass' as const, fails: 0, total: 8 },
  { id: 'sub-002', templateId: 'ps-002', submittedBy: 'James Chen',    site: 'Site A', date: '2025-05-04', time: '07:02', status: 'fail' as const, fails: 1, total: 8, failedItems: ['Wind speed below 45km/h'] },
  { id: 'sub-003', templateId: 'ps-003', submittedBy: 'Tom Nguyen',    site: 'Site B', date: '2025-05-04', time: '06:55', status: 'pass' as const, fails: 0, total: 8 },
  { id: 'sub-004', templateId: 'ps-001', submittedBy: 'Raj Patel',     site: 'Site B', date: '2025-05-04', time: '07:10', status: 'pass' as const, fails: 0, total: 8 },
  { id: 'sub-005', templateId: 'ps-001', submittedBy: 'David Park',    site: 'Site C', date: '2025-05-03', time: '07:30', status: 'pass' as const, fails: 0, total: 8 },
]

// ─── Toolbox Talks ─────────────────────────────────────────────────────────
export const toolboxTalks = [
  { id: 'tb-001', topic: 'Working at Heights — Ladder Safety',       presenter: 'Sarah Mitchell', site: 'Site A', date: '2025-04-28', attendees: 8,  duration: 10, status: 'completed' as const, aiGenerated: false },
  { id: 'tb-002', topic: 'Heat Stress & Hydration in Hot Weather',    presenter: 'Marcus Chen',    site: 'Site B', date: '2025-04-21', attendees: 12, duration: 15, status: 'completed' as const, aiGenerated: true  },
  { id: 'tb-003', topic: 'Electrical Safety — Overhead Lines',        presenter: 'Sarah Mitchell', site: 'All',    date: '2025-05-07', attendees: 0,  duration: 0,  status: 'scheduled' as const, aiGenerated: true  },
  { id: 'tb-004', topic: 'Manual Handling & Ergonomics',             presenter: 'Jordan Lee',     site: 'Site B', date: '2025-04-14', attendees: 7,  duration: 12, status: 'completed' as const, aiGenerated: false },
  { id: 'tb-005', topic: 'Hazardous Chemicals — SDS & PPE',          presenter: 'Aisha Patel',    site: 'Site C', date: '2025-04-07', attendees: 5,  duration: 20, status: 'completed' as const, aiGenerated: true  },
  { id: 'tb-006', topic: 'Plant & Equipment Pre-start Inspections',  presenter: 'Sarah Mitchell', site: 'Site B', date: '2025-05-12', attendees: 0,  duration: 0,  status: 'scheduled' as const, aiGenerated: false },
]

// ─── Contractor Detail (profile dashboard) ────────────────────────────────
export type InsuranceDoc = {
  id: string
  type: string
  insurer: string
  policyNumber: string
  coverage: string
  expiry: string
  status: 'current' | 'expiring' | 'expired'
}

export type ContractorLicence = {
  id: string
  type: string
  number: string
  authority: string
  expiry: string | null
  status: 'current' | 'expiring' | 'expired'
}

export type ContractorWorkerEntry = {
  id: string
  name: string
  role: string
  whiteCard: boolean
  inductionStatus: 'complete' | 'pending' | 'overdue'
  lastOnSite: string
}

export type PreQualItem = {
  item: string
  complete: boolean
}

export type ContractorActivityEntry = {
  date: string
  action: string
  user: string
  type: 'document' | 'review' | 'system' | 'incident' | 'insurance'
}

export type ContractorDetail = {
  id: string
  abn: string
  address: string
  website: string
  notes: string
  assignedSites: string[]
  openIncidents: number
  openActions: number
  insuranceDocs: InsuranceDoc[]
  licences: ContractorLicence[]
  contractorWorkers: ContractorWorkerEntry[]
  preQualChecklist: PreQualItem[]
  activityLog: ContractorActivityEntry[]
}

export const contractorDetails: Record<string, ContractorDetail> = {
  '1': {
    id: '1',
    abn: '12 345 678 901',
    address: '15 Industrial Ave, Blacktown NSW 2148',
    website: 'www.buildright.com.au',
    notes: 'Long-standing partner. Specialises in structural steel and formwork. Insurance renewal is overdue — follow up with Dave Harris directly.',
    assignedSites: ['Site A – George St', 'Site B – Parramatta'],
    openIncidents: 1,
    openActions: 1,
    insuranceDocs: [
      { id: 'ins-1-1', type: 'Public Liability', insurer: 'QBE Insurance', policyNumber: 'PL-2025-44321', coverage: '$20,000,000', expiry: '2025-05-10', status: 'expiring' },
      { id: 'ins-1-2', type: "Workers' Compensation", insurer: 'icare NSW', policyNumber: 'WC-2025-892341', coverage: 'Statutory', expiry: '2025-12-31', status: 'current' },
      { id: 'ins-1-3', type: 'Professional Indemnity', insurer: 'Allianz', policyNumber: 'PI-2025-98231', coverage: '$1,000,000', expiry: '2026-01-15', status: 'current' },
    ],
    licences: [
      { id: 'lic-1-1', type: 'Builder Licence (Unlimited)', number: 'BLD-245876', authority: 'NSW Fair Trading', expiry: '2026-06-01', status: 'current' },
      { id: 'lic-1-2', type: 'Asbestos Removal Licence (Class B)', number: 'AR-009341', authority: 'SafeWork NSW', expiry: '2025-09-01', status: 'current' },
      { id: 'lic-1-3', type: 'Business Registration', number: 'ABN 12 345 678 901', authority: 'ASIC', expiry: null, status: 'current' },
    ],
    contractorWorkers: [
      { id: 'cw-1-1', name: 'Dave Harris', role: 'Project Manager', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-02' },
      { id: 'cw-1-2', name: 'Phil North', role: 'Structural Carpenter', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-02' },
      { id: 'cw-1-3', name: 'Ben Watts', role: 'Steel Fixer', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-01' },
      { id: 'cw-1-4', name: 'Jon Lee', role: 'Formwork Labourer', whiteCard: true, inductionStatus: 'pending', lastOnSite: '2025-04-30' },
      { id: 'cw-1-5', name: 'Mike Ryan', role: 'Labourer', whiteCard: false, inductionStatus: 'overdue', lastOnSite: '2025-04-28' },
    ],
    preQualChecklist: [
      { item: 'Company ABN Verified', complete: true },
      { item: 'Public Liability Insurance', complete: true },
      { item: "Workers' Compensation Insurance", complete: true },
      { item: 'Contractor Agreement Signed', complete: true },
      { item: 'SWMS on File', complete: true },
      { item: 'Site Induction Completed', complete: true },
      { item: 'Licence / Registration Verified', complete: true },
      { item: 'Insurance Certificate Current (< 30 days)', complete: false },
    ],
    activityLog: [
      { date: '2025-05-01', action: 'Insurance expiry reminder sent to Dave Harris', user: 'System', type: 'insurance' },
      { date: '2025-04-22', action: 'Incident INC-001 linked to BuildRight workers', user: 'James Chen', type: 'incident' },
      { date: '2025-03-10', action: 'Pre-qualification review completed — Approved', user: 'Sarah Mitchell', type: 'review' },
      { date: '2025-01-15', action: 'Contractor agreement renewed for 2025', user: 'Admin', type: 'document' },
      { date: '2024-11-20', action: 'Worker induction updated for 4 workers', user: 'Sarah Mitchell', type: 'document' },
    ],
  },
  '2': {
    id: '2',
    abn: '98 765 432 109',
    address: '8 Trade Court, Wetherill Park NSW 2164',
    website: 'www.safeelect.com.au',
    notes: 'Highly reliable. All certifications up to date. Preferred vendor for all electrical works.',
    assignedSites: ['Site A – George St', 'Site B – Parramatta', 'Site C – Penrith'],
    openIncidents: 0,
    openActions: 0,
    insuranceDocs: [
      { id: 'ins-2-1', type: 'Public Liability', insurer: 'CGU Insurance', policyNumber: 'PL-2025-77214', coverage: '$20,000,000', expiry: '2025-09-20', status: 'current' },
      { id: 'ins-2-2', type: "Workers' Compensation", insurer: 'icare NSW', policyNumber: 'WC-2025-441290', coverage: 'Statutory', expiry: '2025-12-31', status: 'current' },
      { id: 'ins-2-3', type: 'Professional Indemnity', insurer: 'Vero Insurance', policyNumber: 'PI-2025-33921', coverage: '$2,000,000', expiry: '2025-11-01', status: 'current' },
      { id: 'ins-2-4', type: 'Tool & Equipment Insurance', insurer: 'CGU Insurance', policyNumber: 'TE-2025-88123', coverage: '$50,000', expiry: '2025-09-20', status: 'current' },
    ],
    licences: [
      { id: 'lic-2-1', type: 'Electrical Contractor Licence', number: 'ECL-88421', authority: 'NSW Fair Trading', expiry: '2026-09-20', status: 'current' },
      { id: 'lic-2-2', type: 'Nominated Supervisor Licence', number: 'NSL-44210', authority: 'NSW Fair Trading', expiry: '2026-03-15', status: 'current' },
      { id: 'lic-2-3', type: 'Working at Heights Certificate', number: 'WAH-2024-9981', authority: 'TAFE NSW', expiry: '2026-08-01', status: 'current' },
    ],
    contractorWorkers: [
      { id: 'cw-2-1', name: 'Anna Kowalski', role: 'Electrical Supervisor', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-03' },
      { id: 'cw-2-2', name: 'Greg Marsh', role: 'Electrician', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-02' },
      { id: 'cw-2-3', name: 'Tina Rhodes', role: 'Electrician', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-01' },
    ],
    preQualChecklist: [
      { item: 'Company ABN Verified', complete: true },
      { item: 'Public Liability Insurance', complete: true },
      { item: "Workers' Compensation Insurance", complete: true },
      { item: 'Contractor Agreement Signed', complete: true },
      { item: 'SWMS on File', complete: true },
      { item: 'Site Induction Completed', complete: true },
      { item: 'Licence / Registration Verified', complete: true },
      { item: 'Insurance Certificate Current (< 30 days)', complete: true },
    ],
    activityLog: [
      { date: '2025-04-30', action: 'Annual compliance review — all items current', user: 'Sarah Mitchell', type: 'review' },
      { date: '2025-03-18', action: 'New worker (Tina Rhodes) inducted on Site C', user: 'Admin', type: 'document' },
      { date: '2025-01-05', action: 'Electrical Contractor Licence renewed', user: 'Anna Kowalski', type: 'document' },
    ],
  },
  '3': {
    id: '3',
    abn: '55 234 876 431',
    address: '3/22 Plumbing Way, Rydalmere NSW 2116',
    website: 'www.proplumb.com.au',
    notes: 'Reliable plumbing subcontractor. Works across residential and commercial projects. Keep induction records updated when new workers are deployed.',
    assignedSites: ['Site B – Parramatta'],
    openIncidents: 0,
    openActions: 0,
    insuranceDocs: [
      { id: 'ins-3-1', type: 'Public Liability', insurer: 'Allianz', policyNumber: 'PL-2025-56341', coverage: '$20,000,000', expiry: '2025-07-15', status: 'current' },
      { id: 'ins-3-2', type: "Workers' Compensation", insurer: 'icare NSW', policyNumber: 'WC-2025-231540', coverage: 'Statutory', expiry: '2025-12-31', status: 'current' },
    ],
    licences: [
      { id: 'lic-3-1', type: 'Plumbing Contractor Licence', number: 'PCL-33219', authority: 'NSW Fair Trading', expiry: '2026-07-15', status: 'current' },
      { id: 'lic-3-2', type: 'Gasfitting Licence', number: 'GF-2024-7741', authority: 'NSW Fair Trading', expiry: '2026-07-15', status: 'current' },
      { id: 'lic-3-3', type: 'Drainage Contractor Licence', number: 'DCL-18920', authority: 'NSW Fair Trading', expiry: '2026-03-01', status: 'current' },
    ],
    contractorWorkers: [
      { id: 'cw-3-1', name: 'Nick Turner', role: 'Licensed Plumber', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-01' },
      { id: 'cw-3-2', name: 'Alex Ford', role: 'Plumbing Apprentice', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-04-30' },
    ],
    preQualChecklist: [
      { item: 'Company ABN Verified', complete: true },
      { item: 'Public Liability Insurance', complete: true },
      { item: "Workers' Compensation Insurance", complete: true },
      { item: 'Contractor Agreement Signed', complete: true },
      { item: 'SWMS on File', complete: true },
      { item: 'Site Induction Completed', complete: true },
      { item: 'Licence / Registration Verified', complete: true },
      { item: 'Insurance Certificate Current (< 30 days)', complete: true },
    ],
    activityLog: [
      { date: '2025-04-15', action: 'Plumbing Contractor Licence renewed', user: 'Nick Turner', type: 'document' },
      { date: '2025-02-20', action: 'Pre-qualification review completed — Approved', user: 'Sarah Mitchell', type: 'review' },
      { date: '2025-01-10', action: 'Added to Site B – Parramatta project', user: 'Admin', type: 'system' },
    ],
  },
  '4': {
    id: '4',
    abn: '43 118 654 290',
    address: '90 Steel Rd, Villawood NSW 2163',
    website: '',
    notes: 'SUSPENDED — Licence expired April 2025. Insurance also lapsed. Do not allow on site until fully reinstated. Follow up with Ben Moore for reinstatement timeline.',
    assignedSites: [],
    openIncidents: 0,
    openActions: 2,
    insuranceDocs: [
      { id: 'ins-4-1', type: 'Public Liability', insurer: 'QBE Insurance', policyNumber: 'PL-2024-31209', coverage: '$10,000,000', expiry: '2025-04-01', status: 'expired' },
      { id: 'ins-4-2', type: "Workers' Compensation", insurer: 'icare NSW', policyNumber: 'WC-2024-119023', coverage: 'Statutory', expiry: '2025-04-01', status: 'expired' },
    ],
    licences: [
      { id: 'lic-4-1', type: 'Scaffolding Contractor Licence', number: 'SCF-44109', authority: 'SafeWork NSW', expiry: '2025-04-01', status: 'expired' },
      { id: 'lic-4-2', type: 'Rigger Licence (Basic)', number: 'RIG-2023-6621', authority: 'SafeWork NSW', expiry: '2025-03-10', status: 'expired' },
    ],
    contractorWorkers: [
      { id: 'cw-4-1', name: 'Ben Moore', role: 'Scaffolding Supervisor', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-03-30' },
      { id: 'cw-4-2', name: 'Gary Sutton', role: 'Scaffolder', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-03-30' },
      { id: 'cw-4-3', name: 'Darren Cole', role: 'Scaffolder', whiteCard: false, inductionStatus: 'overdue', lastOnSite: '2025-03-28' },
      { id: 'cw-4-4', name: 'Victor Shaw', role: 'Labourer', whiteCard: false, inductionStatus: 'overdue', lastOnSite: '2025-03-25' },
    ],
    preQualChecklist: [
      { item: 'Company ABN Verified', complete: true },
      { item: 'Public Liability Insurance', complete: false },
      { item: "Workers' Compensation Insurance", complete: false },
      { item: 'Contractor Agreement Signed', complete: true },
      { item: 'SWMS on File', complete: false },
      { item: 'Site Induction Completed', complete: false },
      { item: 'Licence / Registration Verified', complete: false },
      { item: 'Insurance Certificate Current (< 30 days)', complete: false },
    ],
    activityLog: [
      { date: '2025-04-10', action: 'Account suspended — insurance and licence expired', user: 'System', type: 'system' },
      { date: '2025-04-02', action: 'Final notice sent — insurance renewal overdue', user: 'System', type: 'insurance' },
      { date: '2025-03-15', action: 'Pre-qual review — flagged for non-renewal', user: 'Sarah Mitchell', type: 'review' },
      { date: '2025-01-20', action: 'Reminder sent for upcoming licence renewal', user: 'System', type: 'insurance' },
    ],
  },
  '5': {
    id: '5',
    abn: '71 902 344 218',
    address: '4 Depot Lane, Homebush NSW 2140',
    website: 'www.cleansiteservices.com.au',
    notes: 'Excellent track record. Handles daily site cleaning across multiple projects. Low risk profile.',
    assignedSites: ['Site A – George St', 'Site B – Parramatta', 'Site C – Penrith', 'Warehouse – Ryde'],
    openIncidents: 0,
    openActions: 0,
    insuranceDocs: [
      { id: 'ins-5-1', type: 'Public Liability', insurer: 'Vero Insurance', policyNumber: 'PL-2025-90341', coverage: '$20,000,000', expiry: '2025-11-30', status: 'current' },
      { id: 'ins-5-2', type: "Workers' Compensation", insurer: 'icare NSW', policyNumber: 'WC-2025-774123', coverage: 'Statutory', expiry: '2025-12-31', status: 'current' },
    ],
    licences: [
      { id: 'lic-5-1', type: 'Commercial Cleaning Licence', number: 'CCL-2023-4419', authority: 'NSW Fair Trading', expiry: '2026-11-30', status: 'current' },
      { id: 'lic-5-2', type: 'Hazardous Waste Handler Certificate', number: 'HWH-8821', authority: 'EPA NSW', expiry: '2026-06-01', status: 'current' },
    ],
    contractorWorkers: [
      { id: 'cw-5-1', name: 'Maria Garcia', role: 'Cleaning Supervisor', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-03' },
      { id: 'cw-5-2', name: 'Fen Liu', role: 'Cleaner', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-03' },
    ],
    preQualChecklist: [
      { item: 'Company ABN Verified', complete: true },
      { item: 'Public Liability Insurance', complete: true },
      { item: "Workers' Compensation Insurance", complete: true },
      { item: 'Contractor Agreement Signed', complete: true },
      { item: 'SWMS on File', complete: true },
      { item: 'Site Induction Completed', complete: true },
      { item: 'Licence / Registration Verified', complete: true },
      { item: 'Insurance Certificate Current (< 30 days)', complete: true },
    ],
    activityLog: [
      { date: '2025-04-28', action: 'Annual compliance review passed — all clear', user: 'Sarah Mitchell', type: 'review' },
      { date: '2025-03-01', action: 'Added to Warehouse – Ryde project', user: 'Admin', type: 'system' },
      { date: '2025-01-12', action: 'Insurance documents received and filed', user: 'Admin', type: 'insurance' },
    ],
  },
  '6': {
    id: '6',
    abn: '33 567 213 094',
    address: '22 Precision Rd, Granville NSW 2142',
    website: 'www.techmechengineering.com.au',
    notes: 'Provides mechanical services across HVAC, hydraulics and general plant. Paul Zhang is the primary contact for all scheduling.',
    assignedSites: ['Site B – Parramatta', 'Warehouse – Ryde'],
    openIncidents: 0,
    openActions: 0,
    insuranceDocs: [
      { id: 'ins-6-1', type: 'Public Liability', insurer: 'CGU Insurance', policyNumber: 'PL-2025-62034', coverage: '$20,000,000', expiry: '2025-06-20', status: 'current' },
      { id: 'ins-6-2', type: "Workers' Compensation", insurer: 'icare NSW', policyNumber: 'WC-2025-339812', coverage: 'Statutory', expiry: '2025-12-31', status: 'current' },
      { id: 'ins-6-3', type: 'Professional Indemnity', insurer: 'Allianz', policyNumber: 'PI-2025-44012', coverage: '$1,000,000', expiry: '2026-06-20', status: 'current' },
    ],
    licences: [
      { id: 'lic-6-1', type: 'Mechanical Services Contractor Licence', number: 'MSC-77431', authority: 'NSW Fair Trading', expiry: '2026-06-20', status: 'current' },
      { id: 'lic-6-2', type: 'Refrigerant Handling Licence (ARC)', number: 'ARC-2024-56712', authority: 'ARCTICK', expiry: '2027-01-15', status: 'current' },
    ],
    contractorWorkers: [
      { id: 'cw-6-1', name: 'Paul Zhang', role: 'Mechanical Engineer', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-02' },
      { id: 'cw-6-2', name: 'Trevor Nash', role: 'Mechanical Fitter', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-01' },
      { id: 'cw-6-3', name: 'Sandra Ho', role: 'HVAC Technician', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-04-29' },
    ],
    preQualChecklist: [
      { item: 'Company ABN Verified', complete: true },
      { item: 'Public Liability Insurance', complete: true },
      { item: "Workers' Compensation Insurance", complete: true },
      { item: 'Contractor Agreement Signed', complete: true },
      { item: 'SWMS on File', complete: true },
      { item: 'Site Induction Completed', complete: true },
      { item: 'Licence / Registration Verified', complete: true },
      { item: 'Insurance Certificate Current (< 30 days)', complete: true },
    ],
    activityLog: [
      { date: '2025-04-20', action: 'SWMS updated for hydraulics works on Site B', user: 'Paul Zhang', type: 'document' },
      { date: '2025-03-05', action: 'Pre-qualification review completed — Approved', user: 'Sarah Mitchell', type: 'review' },
      { date: '2025-01-18', action: 'Added to Warehouse – Ryde project', user: 'Admin', type: 'system' },
    ],
  },
  '7': {
    id: '7',
    abn: '27 441 093 871',
    address: '11 Earthmover Cres, Penrith NSW 2750',
    website: 'www.groundworksexcavation.com.au',
    notes: 'Pre-qualification review in progress. Insurance expires end of May — pending renewal confirmation from Steve Hill. Large crew, ensure all workers are inducted before mobilisation.',
    assignedSites: ['Site C – Penrith'],
    openIncidents: 0,
    openActions: 1,
    insuranceDocs: [
      { id: 'ins-7-1', type: 'Public Liability', insurer: 'QBE Insurance', policyNumber: 'PL-2025-21983', coverage: '$20,000,000', expiry: '2025-05-28', status: 'expiring' },
      { id: 'ins-7-2', type: "Workers' Compensation", insurer: 'icare NSW', policyNumber: 'WC-2025-662210', coverage: 'Statutory', expiry: '2025-12-31', status: 'current' },
      { id: 'ins-7-3', type: 'Plant & Equipment Insurance', insurer: 'QBE Insurance', policyNumber: 'PE-2025-77821', coverage: '$500,000', expiry: '2025-05-28', status: 'expiring' },
    ],
    licences: [
      { id: 'lic-7-1', type: 'Civil Contractor Licence', number: 'CCL-99230', authority: 'NSW Fair Trading', expiry: '2026-05-28', status: 'current' },
      { id: 'lic-7-2', type: 'Excavator Operator Licence', number: 'EXC-2024-44190', authority: 'SafeWork NSW', expiry: '2026-08-01', status: 'current' },
      { id: 'lic-7-3', type: 'Demolition Contractor Licence (Class B)', number: 'DEM-B-12211', authority: 'SafeWork NSW', expiry: '2025-07-20', status: 'current' },
    ],
    contractorWorkers: [
      { id: 'cw-7-1', name: 'Steve Hill', role: 'Civil Supervisor', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-01' },
      { id: 'cw-7-2', name: 'Aaron Price', role: 'Excavator Operator', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-01' },
      { id: 'cw-7-3', name: 'Liam Cross', role: 'Labourer', whiteCard: true, inductionStatus: 'pending', lastOnSite: '2025-04-30' },
      { id: 'cw-7-4', name: 'Dan Walsh', role: 'Labourer', whiteCard: true, inductionStatus: 'pending', lastOnSite: '2025-04-29' },
      { id: 'cw-7-5', name: 'Frank Yuen', role: 'Labourer', whiteCard: false, inductionStatus: 'overdue', lastOnSite: '2025-04-28' },
      { id: 'cw-7-6', name: 'Jack Moran', role: 'Labourer', whiteCard: false, inductionStatus: 'overdue', lastOnSite: '2025-04-25' },
    ],
    preQualChecklist: [
      { item: 'Company ABN Verified', complete: true },
      { item: 'Public Liability Insurance', complete: true },
      { item: "Workers' Compensation Insurance", complete: true },
      { item: 'Contractor Agreement Signed', complete: true },
      { item: 'SWMS on File', complete: false },
      { item: 'Site Induction Completed', complete: false },
      { item: 'Licence / Registration Verified', complete: true },
      { item: 'Insurance Certificate Current (< 30 days)', complete: false },
    ],
    activityLog: [
      { date: '2025-05-01', action: 'Insurance expiry reminder sent — 27 days remaining', user: 'System', type: 'insurance' },
      { date: '2025-04-18', action: 'Pre-qualification review initiated', user: 'Sarah Mitchell', type: 'review' },
      { date: '2025-04-10', action: 'Contractor application received', user: 'Admin', type: 'system' },
    ],
  },
  '8': {
    id: '8',
    abn: '61 789 321 450',
    address: '5 Refrigeration Blvd, Chullora NSW 2190',
    website: 'www.airtechhvac.com.au',
    notes: 'Excellent compliance record. AirTech handles all HVAC commissioning and maintenance. Rachel Kim is highly responsive.',
    assignedSites: ['Site A – George St', 'Warehouse – Ryde'],
    openIncidents: 0,
    openActions: 0,
    insuranceDocs: [
      { id: 'ins-8-1', type: 'Public Liability', insurer: 'Vero Insurance', policyNumber: 'PL-2025-88120', coverage: '$20,000,000', expiry: '2025-10-10', status: 'current' },
      { id: 'ins-8-2', type: "Workers' Compensation", insurer: 'icare NSW', policyNumber: 'WC-2025-990341', coverage: 'Statutory', expiry: '2025-12-31', status: 'current' },
      { id: 'ins-8-3', type: 'Professional Indemnity', insurer: 'CGU Insurance', policyNumber: 'PI-2025-22819', coverage: '$2,000,000', expiry: '2026-10-10', status: 'current' },
    ],
    licences: [
      { id: 'lic-8-1', type: 'Refrigeration & Air Conditioning Licence', number: 'RAC-55412', authority: 'NSW Fair Trading', expiry: '2026-10-10', status: 'current' },
      { id: 'lic-8-2', type: 'Refrigerant Handling Licence (ARC)', number: 'ARC-2023-77231', authority: 'ARCTICK', expiry: '2026-12-01', status: 'current' },
      { id: 'lic-8-3', type: 'Electrical Contractor Licence', number: 'ECL-33102', authority: 'NSW Fair Trading', expiry: '2026-10-10', status: 'current' },
    ],
    contractorWorkers: [
      { id: 'cw-8-1', name: 'Rachel Kim', role: 'HVAC Project Manager', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-02' },
      { id: 'cw-8-2', name: 'James Lowe', role: 'HVAC Technician', whiteCard: true, inductionStatus: 'complete', lastOnSite: '2025-05-01' },
    ],
    preQualChecklist: [
      { item: 'Company ABN Verified', complete: true },
      { item: 'Public Liability Insurance', complete: true },
      { item: "Workers' Compensation Insurance", complete: true },
      { item: 'Contractor Agreement Signed', complete: true },
      { item: 'SWMS on File', complete: true },
      { item: 'Site Induction Completed', complete: true },
      { item: 'Licence / Registration Verified', complete: true },
      { item: 'Insurance Certificate Current (< 30 days)', complete: true },
    ],
    activityLog: [
      { date: '2025-05-02', action: 'HVAC commissioning SWMS submitted for Site A', user: 'Rachel Kim', type: 'document' },
      { date: '2025-04-25', action: 'Annual compliance review — all clear', user: 'Sarah Mitchell', type: 'review' },
      { date: '2025-03-10', action: 'Insurance documents renewed and filed', user: 'Admin', type: 'insurance' },
    ],
  },
}

// ─── Inspection Form Templates & Responses ────────────────────────────────
export type ItemResult = 'pass' | 'fail' | 'na' | 'pending'

export type InspTemplateItem = { id: string; question: string }
export type InspTemplateSection = { id: string; title: string; items: InspTemplateItem[] }
export type InspectionTemplate = { formType: string; sections: InspTemplateSection[] }

export type ItemCA = { description: string; assignedTo: string; dueDate: string }
export type ItemResponse = {
  result: ItemResult
  comment: string
  photos: string[]
  ca: ItemCA | null
}
export type InspectionFormData = {
  inspectionId: string
  responses: Record<string, ItemResponse>
  generalComment: string
  signOffName: string
  signOffDate: string
}

export const inspectionTemplates: Record<string, InspectionTemplate> = {
  'Monthly WHS Inspection': {
    formType: 'Monthly WHS Inspection',
    sections: [
      { id: 's1', title: 'Personnel & Induction', items: [
        { id: 's1-i1', question: 'All workers are inducted and briefed on current site hazards' },
        { id: 's1-i2', question: 'Site induction records are current, complete and on file' },
        { id: 's1-i3', question: 'Emergency contacts and assembly points are clearly displayed' },
        { id: 's1-i4', question: 'Visitor and contractor register is maintained at site entry' },
      ]},
      { id: 's2', title: 'Personal Protective Equipment', items: [
        { id: 's2-i1', question: 'All workers are wearing correct and compliant PPE' },
        { id: 's2-i2', question: 'PPE is in good condition, undamaged and fit for purpose' },
        { id: 's2-i3', question: 'Adequate PPE supplies are available on site for all tasks' },
        { id: 's2-i4', question: 'PPE storage is adequate, clean and clearly labelled' },
      ]},
      { id: 's3', title: 'Work Area & Housekeeping', items: [
        { id: 's3-i1', question: 'Work areas are clean, tidy and free from unnecessary materials' },
        { id: 's3-i2', question: 'Pedestrian and vehicle pathways are clear and unobstructed' },
        { id: 's3-i3', question: 'Adequate lighting is provided in all work and walkway areas' },
        { id: 's3-i4', question: 'Exclusion zones are established and clearly marked' },
      ]},
      { id: 's4', title: 'Plant & Equipment', items: [
        { id: 's4-i1', question: 'Plant and equipment pre-start checks have been completed today' },
        { id: 's4-i2', question: 'Operator licences and competencies verified for all plant' },
        { id: 's4-i3', question: 'Equipment defects and faults have been reported and tagged out' },
        { id: 's4-i4', question: 'Plant registration and service records are current' },
      ]},
      { id: 's5', title: 'SWMS & Permits', items: [
        { id: 's5-i1', question: 'Safe Work Method Statements are available for all high-risk work' },
        { id: 's5-i2', question: 'Workers have been briefed on and signed relevant SWMS' },
        { id: 's5-i3', question: 'Permits to Work are in place where required' },
        { id: 's5-i4', question: 'SWMS and permits are accessible at the point of work' },
      ]},
      { id: 's6', title: 'Emergency Preparedness', items: [
        { id: 's6-i1', question: 'First aid kit is accessible, fully stocked and within expiry' },
        { id: 's6-i2', question: 'Fire extinguishers are accessible, charged and within service date' },
        { id: 's6-i3', question: 'Emergency evacuation procedure is posted and understood by workers' },
        { id: 's6-i4', question: 'At least one trained first aider is present on site today' },
      ]},
      { id: 's7', title: 'Hazardous Materials', items: [
        { id: 's7-i1', question: 'Safety Data Sheets (SDS) are accessible for all chemicals on site' },
        { id: 's7-i2', question: 'Chemicals are stored correctly with adequate secondary containment' },
        { id: 's7-i3', question: 'Chemical containers are correctly labelled and in good condition' },
        { id: 's7-i4', question: 'Spill kits are available and accessible near chemical storage areas' },
      ]},
      { id: 's8', title: 'Environmental Controls', items: [
        { id: 's8-i1', question: 'Waste is segregated, labelled and stored in designated areas' },
        { id: 's8-i2', question: 'Sediment and erosion controls are in place and functional' },
        { id: 's8-i3', question: 'No evidence of fuel, oil or chemical spills on site' },
      ]},
    ],
  },

  'Pre-Start Safety Check': {
    formType: 'Pre-Start Safety Check',
    sections: [
      { id: 's1', title: 'Site & Personnel Readiness', items: [
        { id: 's1-i1', question: 'All workers have completed site induction and are authorised to work' },
        { id: 's1-i2', question: 'PPE inspected and worn correctly by all personnel' },
        { id: 's1-i3', question: 'SWMS reviewed and signed by all workers prior to commencing' },
        { id: 's1-i4', question: 'Weather conditions assessed and suitable for planned work' },
      ]},
      { id: 's2', title: 'Equipment & Tools', items: [
        { id: 's2-i1', question: 'Plant and equipment walk-around pre-start check complete' },
        { id: 's2-i2', question: 'Tools are in good condition, tagged and fit for purpose' },
        { id: 's2-i3', question: 'Operator licences verified for all plant and equipment' },
        { id: 's2-i4', question: 'No outstanding defects or faults on equipment to be used' },
      ]},
      { id: 's3', title: 'Hazards & Controls', items: [
        { id: 's3-i1', question: 'Exclusion zones established and clearly marked' },
        { id: 's3-i2', question: 'Overhead hazards identified (powerlines, falling objects)' },
        { id: 's3-i3', question: 'Underground services located and marked before ground disturbance' },
        { id: 's3-i4', question: 'Housekeeping standards adequate — no trip or slip hazards' },
      ]},
      { id: 's4', title: 'Emergency & Communications', items: [
        { id: 's4-i1', question: 'First aid kit is accessible and stocked' },
        { id: 's4-i2', question: 'Emergency procedures reviewed with the team this morning' },
        { id: 's4-i3', question: 'Communication devices charged and functional (phones / radios)' },
        { id: 's4-i4', question: 'Emergency contact numbers accessible to all workers' },
      ]},
    ],
  },

  'Fire Safety Inspection': {
    formType: 'Fire Safety Inspection',
    sections: [
      { id: 's1', title: 'Fire Suppression Equipment', items: [
        { id: 's1-i1', question: 'Fire extinguishers are present at all required locations' },
        { id: 's1-i2', question: 'Fire extinguishers are within current service date' },
        { id: 's1-i3', question: 'Extinguisher type is appropriate for the fire risk in each area' },
        { id: 's1-i4', question: 'Fire hose reels are accessible, undamaged and operational' },
      ]},
      { id: 's2', title: 'Evacuation & Egress', items: [
        { id: 's2-i1', question: 'Emergency exits are clearly signed, unobstructed and operational' },
        { id: 's2-i2', question: 'Evacuation plans are posted and clearly visible in all areas' },
        { id: 's2-i3', question: 'Assembly point is clearly marked and accessible' },
        { id: 's2-i4', question: 'Exit lighting and emergency lighting are functional' },
      ]},
      { id: 's3', title: 'Fire Hazards', items: [
        { id: 's3-i1', question: 'No combustible materials stored near ignition sources' },
        { id: 's3-i2', question: 'Hot work permit process is in place for welding / cutting' },
        { id: 's3-i3', question: 'Electrical panels are accessible and clear of obstructions' },
        { id: 's3-i4', question: 'Adequate fire separation between flammable storage and work areas' },
      ]},
      { id: 's4', title: 'Documentation & Training', items: [
        { id: 's4-i1', question: 'Fire warden list is current with trained wardens on site' },
        { id: 's4-i2', question: 'Last fire drill was conducted within required timeframe' },
        { id: 's4-i3', question: 'Fire safety logbook is current and available for inspection' },
      ]},
    ],
  },

  'Chemical Storage Audit': {
    formType: 'Chemical Storage Audit',
    sections: [
      { id: 's1', title: 'Storage & Containment', items: [
        { id: 's1-i1', question: 'All chemicals are stored in approved, compatible containers' },
        { id: 's1-i2', question: 'Bunded secondary containment is in place for liquid chemicals' },
        { id: 's1-i3', question: 'Incompatible chemicals are segregated appropriately' },
        { id: 's1-i4', question: 'Chemical storage area is cool, dry and adequately ventilated' },
      ]},
      { id: 's2', title: 'Labelling & SDS', items: [
        { id: 's2-i1', question: 'All chemical containers are correctly and legibly labelled' },
        { id: 's2-i2', question: 'Safety Data Sheets are accessible for every chemical on site' },
        { id: 's2-i3', question: 'SDS register is current and reflects all chemicals on site' },
        { id: 's2-i4', question: 'GHS hazard pictograms are displayed on all storage areas' },
      ]},
      { id: 's3', title: 'PPE & Emergency Response', items: [
        { id: 's3-i1', question: 'Appropriate PPE is available for all chemical handling tasks' },
        { id: 's3-i2', question: 'Chemical spill kit is available, accessible and fully stocked' },
        { id: 's3-i3', question: 'Eye wash station is accessible, functional and within date' },
      ]},
      { id: 's4', title: 'Waste & Disposal', items: [
        { id: 's4-i1', question: 'Chemical waste is stored in designated labelled containers' },
        { id: 's4-i2', question: 'Waste disposal records are maintained and current' },
        { id: 's4-i3', question: 'No empty chemical containers are present without disposal process' },
      ]},
    ],
  },
}

// Pre-filled responses for completed/in-progress inspections
const pass = (comment = '', photos: string[] = [], ca: ItemCA | null = null): ItemResponse => ({ result: 'pass', comment, photos, ca })
const fail = (comment = '', photos: string[] = [], ca: ItemCA | null = null): ItemResponse => ({ result: 'fail', comment, photos, ca })
const na   = (comment = ''): ItemResponse => ({ result: 'na', comment, photos: [], ca: null })

export const inspectionFormData: Record<string, InspectionFormData> = {
  // INS-001: Monthly WHS Inspection, Site A, score 87 (26 pass, 4 fail, 0 na = 86.7%)
  '1': {
    inspectionId: '1',
    responses: {
      's1-i1': pass(), 's1-i2': pass(), 's1-i3': pass(), 's1-i4': pass(),
      's2-i1': pass(), 's2-i2': pass(), 's2-i3': pass(), 's2-i4': pass(),
      's3-i1': pass(), 's3-i2': pass(), 's3-i3': pass(),
      's3-i4': fail('Exclusion zone at Level 3 scaffolding access point not re-established after lunch break.', ['photo_s3i4_1.jpg'],
        { description: 'Re-establish and barricade exclusion zone at Level 3 access point before resuming work', assignedTo: 'James Chen', dueDate: '2025-04-29' }),
      's4-i1': pass(), 's4-i2': pass(),
      's4-i3': fail('Caterpillar excavator EQ-003 has 2 logged defects not yet cleared. Tagged out of service.', ['photo_s4i3_1.jpg', 'photo_s4i3_2.jpg'],
        { description: 'Complete excavator defect repairs and re-inspect before return to service', assignedTo: 'Marcus Torres', dueDate: '2025-05-05' }),
      's4-i4': pass(),
      's5-i1': pass(), 's5-i2': pass(), 's5-i3': pass(), 's5-i4': pass(),
      's6-i1': pass(), 's6-i2': pass(), 's6-i3': pass(), 's6-i4': pass(),
      's7-i1': pass(),
      's7-i2': fail('Chemical drums in storage bay B stored without secondary containment bunding.', ['photo_s7i2_1.jpg'],
        { description: 'Install bunded pallets in storage bay B for all chemical drum storage', assignedTo: 'Sarah Mitchell', dueDate: '2025-05-02' }),
      's7-i3': pass(), 's7-i4': pass(),
      's8-i1': pass(),
      's8-i2': fail('Sediment fence on north boundary showing signs of damage — gap present at corner post.', ['photo_s8i2_1.jpg'],
        { description: 'Repair sediment fence at north boundary corner post', assignedTo: 'James Chen', dueDate: '2025-05-01' }),
      's8-i3': pass(),
    },
    generalComment: 'Generally a good inspection result. Main areas for improvement are the chemical storage area (bunding) and equipment defect management. Workers are engaged and cooperative.',
    signOffName: 'James Chen',
    signOffDate: '2025-04-28',
  },

  // INS-002: Pre-Start Safety Check, Site B, score 92 (14 pass, 1 fail, 1 na = 14/15 = 93%)
  '2': {
    inspectionId: '2',
    responses: {
      's1-i1': pass(), 's1-i2': pass(), 's1-i3': pass(), 's1-i4': pass(),
      's2-i1': pass(), 's2-i2': pass(), 's2-i3': pass(), 's2-i4': pass(),
      's3-i1': pass(),
      's3-i2': fail('Overhead powerline corridor to the north of the work zone not clearly marked. Spotter not yet deployed.', ['photo_s3i2_1.jpg'],
        { description: 'Establish exclusion zone around powerline corridor and assign dedicated spotter', assignedTo: 'Sarah Mitchell', dueDate: '2025-04-30' }),
      's3-i3': na('No ground-disturbing work scheduled for today'),
      's3-i4': pass(),
      's4-i1': pass(), 's4-i2': pass(), 's4-i3': pass(), 's4-i4': pass(),
    },
    generalComment: 'Pre-start check completed before commencement of works. Overhead powerline exclusion zone to be rectified before excavation resumes.',
    signOffName: 'Sarah Mitchell',
    signOffDate: '2025-04-30',
  },

  // INS-003: Fire Safety Inspection, Site A, in-progress (only first 2 sections done)
  '3': {
    inspectionId: '3',
    responses: {
      's1-i1': pass(), 's1-i2': pass(),
      's1-i3': fail('Extinguisher at Level 2 plant room door last serviced March 2024 — overdue by 13 months.', ['photo_s1i3_1.jpg'],
        { description: 'Service or replace fire extinguisher at Level 2 plant room door immediately', assignedTo: 'James Chen', dueDate: '2025-05-05' }),
      's1-i4': pass(),
      's2-i1': pass(), 's2-i2': pass(), 's2-i3': pass(), 's2-i4': pass(),
    },
    generalComment: '',
    signOffName: '',
    signOffDate: '',
  },

  // INS-005: Chemical Storage Audit, Warehouse, score 78 (11 pass, 3 fail = 78.6%)
  '5': {
    inspectionId: '5',
    responses: {
      's1-i1': pass(), 's1-i2': pass(),
      's1-i3': fail('Flammable solvents stored adjacent to oxidising agents in bay C.', ['photo_s1i3_1.jpg'],
        { description: 'Segregate flammable solvents from oxidising agents — install divider in bay C', assignedTo: 'Raj Patel', dueDate: '2025-04-20' }),
      's1-i4': pass(),
      's2-i1': pass(),
      's2-i2': fail('SDS not available on site for hydraulic fluid (brand changed last month). Register not updated.', [],
        { description: 'Obtain and file updated SDS for new hydraulic fluid brand', assignedTo: 'Sarah Mitchell', dueDate: '2025-04-18' }),
      's2-i3': fail('Chemical register last updated February 2025. Three new chemicals added since then not yet included.', [],
        { description: 'Update chemical register to include all current chemicals on site', assignedTo: 'Sarah Mitchell', dueDate: '2025-04-18' }),
      's2-i4': pass(),
      's3-i1': pass(), 's3-i2': pass(), 's3-i3': pass(),
      's4-i1': pass(), 's4-i2': pass(), 's4-i3': pass(),
    },
    generalComment: 'Chemical storage has improved since last audit but segregation and SDS management need attention. CA-004 already raised for storage procedures.',
    signOffName: 'Raj Patel',
    signOffDate: '2025-04-15',
  },
}

// ─── Incident Investigations ──────────────────────────────────────────────
export type InvestigationStatus = 'not-started' | 'in-progress' | 'complete'
export type TreatmentType = 'none' | 'first-aid' | 'medical-treatment' | 'hospital'
export type CausalClass = 'human-error' | 'equipment' | 'environment' | 'management-system' | 'multiple'

export type InvestigationWitness = {
  name: string
  role: string
  statement: string
}

export type InjuryDetail = {
  anyInjury: boolean
  personName: string
  natureOfInjury: string
  bodyPart: string
  treatmentType: TreatmentType
  lostTime: boolean
  lostTimeDays: number
}

export type InvAction = {
  id: string
  description: string
  type: 'corrective' | 'preventive'
  assignedTo: string
  dueDate: string
  status: 'open' | 'in-progress' | 'completed'
}

export type IncidentInvestigation = {
  incidentId: string
  status: InvestigationStatus
  investigatedBy: string
  investigationDate: string
  description: string
  immediateActions: string
  witnesses: InvestigationWitness[]
  injury: InjuryDetail
  whys: { why: string; answer: string }[]
  immediateCause: string
  underlyingCause: string
  rootCause: string
  contributingFactors: string[]
  causalClassification: CausalClass
  revisedLikelihood: number
  revisedConsequence: number
  actions: InvAction[]
  preventiveMeasures: string
  notifiable: boolean
  notifiedBody: string
  notificationDate: string
  notificationRef: string
  workerConsulted: boolean
  managerSignOff: string
  signOffDate: string
}

export const CONTRIBUTING_FACTORS = [
  'Inadequate training / instruction',
  'Inadequate supervision',
  'Equipment / plant failure',
  'Poor housekeeping',
  'Communication failure',
  'Fatigue or distraction',
  'Inadequate risk assessment',
  'Unsafe behaviour / shortcuts',
  'Environmental conditions',
  'Lack of or inadequate PPE',
  'Inadequate procedures / SWMS',
  'Time pressure',
]

export const investigations: Record<string, IncidentInvestigation> = {
  'INC-001': {
    incidentId: 'INC-001',
    status: 'complete',
    investigatedBy: 'Sarah Mitchell',
    investigationDate: '2025-04-24',
    description: 'A steel bracket became dislodged from Level 3 scaffolding and fell approximately 4 metres, landing in an active work area below. No workers were in the immediate zone at the time. The bracket had been improperly secured during the morning scaffolding erection.',
    immediateActions: 'Area below Level 3 immediately barricaded with exclusion zone tape. All remaining brackets on the scaffolding run inspected and tightened. Incident site preserved and photographed. Workers notified via toolbox talk within 30 minutes.',
    witnesses: [
      { name: 'Marcus Torres', role: 'Forklift Operator', statement: 'I was operating the forklift approximately 10 metres from the drop zone. I heard a loud clang and observed the bracket land on the concrete slab. No one was in the area at the time.' },
      { name: 'Phil North', role: 'Structural Carpenter', statement: 'I was on Level 2 when I heard the bracket fall. I immediately stopped work and notified the site supervisor.' },
    ],
    injury: {
      anyInjury: false,
      personName: '',
      natureOfInjury: '',
      bodyPart: '',
      treatmentType: 'none',
      lostTime: false,
      lostTimeDays: 0,
    },
    whys: [
      { why: 'Why did the bracket fall?', answer: 'The bracket was not properly secured to the scaffolding tube.' },
      { why: 'Why was it not properly secured?', answer: 'The correct coupler clamp was not used — a substandard clamp was substituted.' },
      { why: 'Why was a substandard clamp used?', answer: 'The correct clamps were not available on site at the time of erection.' },
      { why: 'Why were correct clamps not available?', answer: 'The scaffolding materials were not fully checked against the inventory before the task commenced.' },
      { why: 'Why was the inventory check not done?', answer: 'There is no formal pre-task materials checklist in the scaffolding SWMS.' },
    ],
    immediateCause: 'Bracket not secured with correct coupler clamp, leading to failure under load vibration.',
    underlyingCause: 'Incorrect scaffolding hardware used due to stock shortage. No check was performed before work commenced.',
    rootCause: 'Absence of a formal pre-task materials checklist in the scaffolding Safe Work Method Statement, allowing work to proceed with incorrect components.',
    contributingFactors: ['Equipment / plant failure', 'Inadequate procedures / SWMS', 'Inadequate risk assessment'],
    causalClassification: 'management-system',
    revisedLikelihood: 2,
    revisedConsequence: 4,
    actions: [
      { id: 'inv-a1', description: 'Update scaffolding SWMS to include pre-task materials checklist', type: 'preventive', assignedTo: 'Sarah Mitchell', dueDate: '2025-05-10', status: 'completed' },
      { id: 'inv-a2', description: 'Install additional safety netting at Level 3 perimeter', type: 'corrective', assignedTo: 'James Chen', dueDate: '2025-05-10', status: 'completed' },
      { id: 'inv-a3', description: 'Review scaffolding hardware inventory management process', type: 'preventive', assignedTo: 'Admin', dueDate: '2025-05-20', status: 'in-progress' },
    ],
    preventiveMeasures: 'All future scaffolding erections require a documented materials checklist sign-off before work commences. Scaffolding supervisor to conduct 100% hardware inspection at end of each day.',
    notifiable: false,
    notifiedBody: '',
    notificationDate: '',
    notificationRef: '',
    workerConsulted: true,
    managerSignOff: 'Sarah Mitchell',
    signOffDate: '2025-04-26',
  },

  'INC-002': {
    incidentId: 'INC-002',
    status: 'in-progress',
    investigatedBy: 'James Chen',
    investigationDate: '2025-04-29',
    description: 'Worker Sarah Mitchell slipped on wet concrete near the entry point of Building B at Site B – Parramatta. The concrete had been freshly poured that morning and signage was not adequately placed. Worker experienced mild bruising to the left knee. First aid was administered on site.',
    immediateActions: 'First aid administered by the site first aider. Area cordoned off with safety tape. Warning signage placed at all entry points to the wet concrete zone. Worker assessed and cleared to return to light duties.',
    witnesses: [
      { name: 'Marcus Torres', role: 'Site Supervisor', statement: 'I was nearby when the incident occurred. Sarah stepped into the wet concrete zone, her foot slipped and she fell to one knee. I immediately called for first aid.' },
    ],
    injury: {
      anyInjury: true,
      personName: 'Sarah Mitchell',
      natureOfInjury: 'Bruising and mild soft tissue injury to left knee',
      bodyPart: 'Left knee',
      treatmentType: 'first-aid',
      lostTime: false,
      lostTimeDays: 0,
    },
    whys: [
      { why: 'Why did the slip occur?', answer: 'Worker walked onto wet concrete surface that was not adequately marked.' },
      { why: 'Why was the area not adequately marked?', answer: 'The standard wet concrete signage was not deployed before work commenced.' },
      { why: 'Why was signage not deployed?', answer: 'The concreting crew did not follow the site induction requirement to barricade wet works before other workers arrive.' },
      { why: 'Why was the requirement not followed?', answer: '' },
      { why: 'Why did that systemic failure occur?', answer: '' },
    ],
    immediateCause: 'Worker slipped on inadequately marked wet concrete surface.',
    underlyingCause: 'Concreting crew did not deploy wet works signage and barricading before commencing pour.',
    rootCause: '',
    contributingFactors: ['Poor housekeeping', 'Communication failure', 'Inadequate supervision'],
    causalClassification: 'human-error',
    revisedLikelihood: 3,
    revisedConsequence: 2,
    actions: [
      { id: 'inv-b1', description: 'Apply non-slip matting to all wet work transition areas', type: 'corrective', assignedTo: 'Sarah Mitchell', dueDate: '2025-05-07', status: 'open' },
      { id: 'inv-b2', description: 'Conduct toolbox talk on wet works barricading requirements', type: 'preventive', assignedTo: 'James Chen', dueDate: '2025-05-05', status: 'in-progress' },
    ],
    preventiveMeasures: '',
    notifiable: false,
    notifiedBody: '',
    notificationDate: '',
    notificationRef: '',
    workerConsulted: true,
    managerSignOff: '',
    signOffDate: '',
  },

  'INC-003': {
    incidentId: 'INC-003',
    status: 'not-started',
    investigatedBy: '',
    investigationDate: '',
    description: '',
    immediateActions: '',
    witnesses: [],
    injury: { anyInjury: false, personName: '', natureOfInjury: '', bodyPart: '', treatmentType: 'none', lostTime: false, lostTimeDays: 0 },
    whys: [
      { why: 'Why did the equipment malfunction?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
    ],
    immediateCause: '',
    underlyingCause: '',
    rootCause: '',
    contributingFactors: [],
    causalClassification: 'equipment',
    revisedLikelihood: 2,
    revisedConsequence: 2,
    actions: [],
    preventiveMeasures: '',
    notifiable: false,
    notifiedBody: '',
    notificationDate: '',
    notificationRef: '',
    workerConsulted: false,
    managerSignOff: '',
    signOffDate: '',
  },

  'INC-004': {
    incidentId: 'INC-004',
    status: 'not-started',
    investigatedBy: '',
    investigationDate: '',
    description: '',
    immediateActions: '',
    witnesses: [],
    injury: { anyInjury: false, personName: '', natureOfInjury: '', bodyPart: '', treatmentType: 'none', lostTime: false, lostTimeDays: 0 },
    whys: [
      { why: 'Why did the chemical spill occur?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
    ],
    immediateCause: '',
    underlyingCause: '',
    rootCause: '',
    contributingFactors: [],
    causalClassification: 'human-error',
    revisedLikelihood: 2,
    revisedConsequence: 2,
    actions: [],
    preventiveMeasures: '',
    notifiable: true,
    notifiedBody: '',
    notificationDate: '',
    notificationRef: '',
    workerConsulted: false,
    managerSignOff: '',
    signOffDate: '',
  },
}

// ─── Training Needs Analysis (TNA) ────────────────────────────────────────
export type TnaCourseCategory = 'safety' | 'compliance' | 'licence' | 'operational'
export type TnaCourseFrequency = 'once' | 'annual' | 'biennial' | '3-year'

export type TnaCourse = {
  id: string
  name: string
  category: TnaCourseCategory
  frequency: TnaCourseFrequency
}

export type TnaRole = {
  id: string
  name: string
  department: string
}

export const tnaCourses: TnaCourse[] = [
  { id: 'tc-1',  name: 'WHS Induction',              category: 'compliance',  frequency: 'annual'   },
  { id: 'tc-2',  name: 'First Aid Level 2',           category: 'safety',      frequency: 'annual'   },
  { id: 'tc-3',  name: 'Manual Handling',             category: 'safety',      frequency: 'biennial' },
  { id: 'tc-4',  name: 'Working at Heights',          category: 'safety',      frequency: 'biennial' },
  { id: 'tc-5',  name: 'Forklift Licence (LF)',       category: 'licence',     frequency: '3-year'   },
  { id: 'tc-6',  name: 'Scaffolding Certificate',     category: 'licence',     frequency: '3-year'   },
  { id: 'tc-7',  name: 'Electrical Safety',           category: 'safety',      frequency: 'annual'   },
  { id: 'tc-8',  name: 'Electrical Licence (EL)',     category: 'licence',     frequency: 'once'     },
  { id: 'tc-9',  name: 'Emergency Warden',            category: 'safety',      frequency: 'biennial' },
  { id: 'tc-10', name: 'Plant Pre-Start Inspection',  category: 'operational', frequency: 'annual'   },
  { id: 'tc-11', name: 'Chemical Handling / SDS',     category: 'compliance',  frequency: 'annual'   },
  { id: 'tc-12', name: 'Confined Space Entry',        category: 'safety',      frequency: 'biennial' },
]

export const tnaRoles: TnaRole[] = [
  { id: 'tr-1', name: 'Site Manager',       department: 'Operations'     },
  { id: 'tr-2', name: 'Compliance Manager', department: 'Safety'         },
  { id: 'tr-3', name: 'Forklift Operator',  department: 'Logistics'      },
  { id: 'tr-4', name: 'Scaffolder',         department: 'Structural'     },
  { id: 'tr-5', name: 'Labourer',           department: 'General'        },
  { id: 'tr-6', name: 'Electrician',        department: 'Electrical'     },
  { id: 'tr-7', name: 'Site Administrator', department: 'Administration' },
]

// requirements[courseId][roleId] = true means that role requires that course
export const tnaInitialRequirements: Record<string, Record<string, boolean>> = {
  'tc-1':  { 'tr-1': true,  'tr-2': true,  'tr-3': true,  'tr-4': true,  'tr-5': true,  'tr-6': true,  'tr-7': true  }, // WHS Induction — all roles
  'tc-2':  { 'tr-1': true,  'tr-2': true,  'tr-3': false, 'tr-4': false, 'tr-5': false, 'tr-6': false, 'tr-7': false }, // First Aid
  'tc-3':  { 'tr-1': true,  'tr-2': true,  'tr-3': true,  'tr-4': true,  'tr-5': true,  'tr-6': true,  'tr-7': true  }, // Manual Handling — all roles
  'tc-4':  { 'tr-1': true,  'tr-2': false, 'tr-3': false, 'tr-4': true,  'tr-5': true,  'tr-6': false, 'tr-7': false }, // Working at Heights
  'tc-5':  { 'tr-1': false, 'tr-2': false, 'tr-3': true,  'tr-4': false, 'tr-5': false, 'tr-6': false, 'tr-7': false }, // Forklift
  'tc-6':  { 'tr-1': false, 'tr-2': false, 'tr-3': false, 'tr-4': true,  'tr-5': false, 'tr-6': false, 'tr-7': false }, // Scaffolding
  'tc-7':  { 'tr-1': false, 'tr-2': false, 'tr-3': false, 'tr-4': false, 'tr-5': false, 'tr-6': true,  'tr-7': false }, // Electrical Safety
  'tc-8':  { 'tr-1': false, 'tr-2': false, 'tr-3': false, 'tr-4': false, 'tr-5': false, 'tr-6': true,  'tr-7': false }, // Electrical Licence
  'tc-9':  { 'tr-1': true,  'tr-2': true,  'tr-3': false, 'tr-4': false, 'tr-5': false, 'tr-6': false, 'tr-7': true  }, // Emergency Warden
  'tc-10': { 'tr-1': true,  'tr-2': false, 'tr-3': true,  'tr-4': false, 'tr-5': false, 'tr-6': false, 'tr-7': false }, // Plant Pre-Start
  'tc-11': { 'tr-1': true,  'tr-2': true,  'tr-3': true,  'tr-4': true,  'tr-5': true,  'tr-6': true,  'tr-7': true  }, // Chemical Handling — all roles
  'tc-12': { 'tr-1': true,  'tr-2': true,  'tr-3': false, 'tr-4': false, 'tr-5': false, 'tr-6': false, 'tr-7': false }, // Confined Space
}

// ─── AI Template Library ───────────────────────────────────────────────────
export const aiTemplateCategories = ['SWMS', 'JSA', 'Inspection', 'Checklist', 'Risk Assessment', 'Toolbox Talk', 'Pre-start', 'Induction']
export const aiTemplateTrades    = ['General Construction', 'Roofing', 'Electrical', 'Plumbing', 'Civil / Earthworks', 'Mechanical', 'Demolition', 'Painting', 'Concreting', 'Scaffolding']
export const savedAiTemplates = [
  { id: 'ait-001', name: 'Rooftop Steel Installation SWMS',         type: 'SWMS',        trade: 'Roofing',            createdAt: '2025-04-22', usedCount: 4, aiGenerated: true  },
  { id: 'ait-002', name: 'Excavation & Trenching JSA',              type: 'JSA',         trade: 'Civil / Earthworks', createdAt: '2025-04-15', usedCount: 2, aiGenerated: true  },
  { id: 'ait-003', name: 'Electrical Panel Upgrade SWMS',           type: 'SWMS',        trade: 'Electrical',         createdAt: '2025-03-30', usedCount: 3, aiGenerated: true  },
  { id: 'ait-004', name: 'Site Induction Checklist',                type: 'Checklist',   trade: 'General Construction',createdAt: '2025-03-10', usedCount: 12,aiGenerated: false },
  { id: 'ait-005', name: 'Monthly Plant Inspection Form',           type: 'Inspection',  trade: 'Civil / Earthworks', createdAt: '2025-02-28', usedCount: 6, aiGenerated: false },
  { id: 'ait-006', name: 'Hot Work Permit Risk Assessment',         type: 'Risk Assessment',trade: 'Mechanical',      createdAt: '2025-04-30', usedCount: 1, aiGenerated: true  },
]

// ─── Build Management ──────────────────────────────────────────────────────

export type BuildStageStatus  = 'complete' | 'in-progress' | 'upcoming' | 'delayed'
export type BuildQuoteStatus  = 'pending' | 'approved' | 'declined' | 'expired'
export type BuildUpdateCategory = 'milestone' | 'progress' | 'delay' | 'request' | 'inspection'

export type BuildProject = {
  id: string
  name: string
  address: string
  builderName: string
  builderContact: string
  builderEmail: string
  ownerName: string
  ownerEmail: string
  contractValue: number
  startDate: string
  estimatedCompletion: string
  currentStage: string
  overallProgress: number
  status: 'on-track' | 'delayed' | 'ahead'
  contractType: string
  projectManager: string
  siteForeman: string
  heroColor: string
}

export type BuildStage = {
  id: string
  name: string
  startDate: string
  endDate: string
  progress: number
  status: BuildStageStatus
  color: string
  trades: string[]
}

export type ScheduledTrade = {
  id: string
  trade: string
  contractor: string
  stageId: string
  stageName: string
  startDate: string
  endDate: string
  status: 'confirmed' | 'tentative' | 'complete' | 'cancelled'
  notes: string
  contactName: string
  contactPhone: string
}

export type BuildQuote = {
  id: string
  title: string
  category: string
  description: string
  amount: number
  submittedDate: string
  expiryDate: string
  status: BuildQuoteStatus
  submittedBy: string
  notes: string
  isVariation: boolean
  documentName?: string
}

export type BuildUpdate = {
  id: string
  date: string
  title: string
  body: string
  stage: string
  category: BuildUpdateCategory
  photoCount: number
  author: string
  authorRole: string
  pinned: boolean
  requiresResponse: boolean
}

export const buildProject: BuildProject = {
  id: 'bp-001',
  name: 'The Mitchell Residence',
  address: '14 Harbour View Road, Newport NSW 2106',
  builderName: 'Acme Construction Pty Ltd',
  builderContact: '+61 2 9876 5432',
  builderEmail: 'builds@acmeconstruction.com.au',
  ownerName: 'David & Sarah Mitchell',
  ownerEmail: 'david.mitchell@gmail.com',
  contractValue: 1_250_000,
  startDate: '2025-04-01',
  estimatedCompletion: '2025-11-14',
  currentStage: 'Frame',
  overallProgress: 28,
  status: 'on-track',
  contractType: 'Fixed Price',
  projectManager: 'James Chen',
  siteForeman: 'Mark Dawson',
  heroColor: '#FFD940',
}

export const buildStages: BuildStage[] = [
  { id: 'bs-1', name: 'Site Preparation',          startDate: '2025-04-01', endDate: '2025-04-14', progress: 100, status: 'complete',    color: '#22c55e', trades: ['Demolition', 'Civil']             },
  { id: 'bs-2', name: 'Foundations',               startDate: '2025-04-15', endDate: '2025-05-05', progress: 100, status: 'complete',    color: '#22c55e', trades: ['Concretor', 'Steel Fixer']         },
  { id: 'bs-3', name: 'Frame',                     startDate: '2025-05-06', endDate: '2025-05-30', progress: 65,  status: 'in-progress', color: '#FFD940', trades: ['Carpenter', 'Steel Fabricator']    },
  { id: 'bs-4', name: 'Roof',                      startDate: '2025-06-02', endDate: '2025-06-20', progress: 0,   status: 'upcoming',    color: '#94a3b8', trades: ['Roofer', 'Plumber']               },
  { id: 'bs-5', name: 'Lock-up',                   startDate: '2025-06-23', endDate: '2025-07-18', progress: 0,   status: 'upcoming',    color: '#94a3b8', trades: ['Carpenter', 'Glazier', 'Bricklayer'] },
  { id: 'bs-6', name: 'Rough-in Services',         startDate: '2025-07-21', endDate: '2025-08-15', progress: 0,   status: 'upcoming',    color: '#94a3b8', trades: ['Plumber', 'Electrician', 'HVAC']  },
  { id: 'bs-7', name: 'Insulation & Plasterboard', startDate: '2025-08-18', endDate: '2025-09-12', progress: 0,   status: 'upcoming',    color: '#94a3b8', trades: ['Insulation', 'Plasterer']          },
  { id: 'bs-8', name: 'Fitout & Finishes',         startDate: '2025-09-15', endDate: '2025-10-31', progress: 0,   status: 'upcoming',    color: '#94a3b8', trades: ['Painter', 'Tiler', 'Joiner', 'Electrician', 'Plumber'] },
  { id: 'bs-9', name: 'Practical Completion',      startDate: '2025-11-03', endDate: '2025-11-14', progress: 0,   status: 'upcoming',    color: '#94a3b8', trades: ['Inspector', 'Builder']             },
]

export const scheduledTrades: ScheduledTrade[] = [
  // Site Prep
  { id: 'st-1',  trade: 'Demolition',         contractor: 'DemoPro Services',       stageId: 'bs-1', stageName: 'Site Preparation', startDate: '2025-04-01', endDate: '2025-04-04', status: 'complete',   notes: 'Existing slab removed',                 contactName: 'Rob Taylor',   contactPhone: '0412 111 222' },
  { id: 'st-2',  trade: 'Civil / Earthworks', contractor: 'GroundWorks Excavation', stageId: 'bs-1', stageName: 'Site Preparation', startDate: '2025-04-05', endDate: '2025-04-14', status: 'complete',   notes: 'Cut & fill complete, drainage installed', contactName: 'Steve Hill',   contactPhone: '0412 333 444' },
  // Foundations
  { id: 'st-3',  trade: 'Steel Fixer',        contractor: 'Precision Steel Pty Ltd',stageId: 'bs-2', stageName: 'Foundations',      startDate: '2025-04-15', endDate: '2025-04-22', status: 'complete',   notes: 'Reinforcement complete, inspected',      contactName: 'Tony Russo',   contactPhone: '0412 555 666' },
  { id: 'st-4',  trade: 'Concretor',          contractor: 'ClearSet Concrete',      stageId: 'bs-2', stageName: 'Foundations',      startDate: '2025-04-23', endDate: '2025-05-05', status: 'complete',   notes: 'Slab poured, 28-day cure',               contactName: 'Mick O\'Brien',contactPhone: '0412 777 888' },
  // Frame
  { id: 'st-5',  trade: 'Steel Fabricator',   contractor: 'ModSteel Fabrications',  stageId: 'bs-3', stageName: 'Frame',            startDate: '2025-05-06', endDate: '2025-05-14', status: 'complete',   notes: 'Portal frame erected and plumbed',       contactName: 'Dan Kowalski', contactPhone: '0412 999 000' },
  { id: 'st-6',  trade: 'Carpenter (Frame)',  contractor: 'ProBuild Carpentry',     stageId: 'bs-3', stageName: 'Frame',            startDate: '2025-05-15', endDate: '2025-05-30', status: 'confirmed',  notes: 'Timber frame, floor joists underway',    contactName: 'Luke Harris',  contactPhone: '0413 111 222' },
  // Roof
  { id: 'st-7',  trade: 'Roofer',             contractor: 'Apex Roofing Co.',       stageId: 'bs-4', stageName: 'Roof',             startDate: '2025-06-02', endDate: '2025-06-13', status: 'confirmed',  notes: 'Colorbond sheet roofing',                contactName: 'Pete Walsh',   contactPhone: '0413 333 444' },
  { id: 'st-8',  trade: 'Plumber (Rough)',    contractor: 'Coastal Plumbing Co.',   stageId: 'bs-4', stageName: 'Roof',             startDate: '2025-06-09', endDate: '2025-06-20', status: 'tentative',  notes: 'Roof penetrations and stormwater',       contactName: 'Rachel Kim',   contactPhone: '0413 555 666' },
  // Lock-up
  { id: 'st-9',  trade: 'Glazier',            contractor: 'ClearView Glass',        stageId: 'bs-5', stageName: 'Lock-up',          startDate: '2025-06-23', endDate: '2025-07-04', status: 'tentative',  notes: 'Double-glazed windows & sliding doors',  contactName: 'Sam Lee',      contactPhone: '0413 777 888' },
  { id: 'st-10', trade: 'Bricklayer',         contractor: 'Heritage Brickwork',     stageId: 'bs-5', stageName: 'Lock-up',          startDate: '2025-07-07', endDate: '2025-07-18', status: 'tentative',  notes: 'Feature brick facade',                   contactName: 'Gino Rossi',   contactPhone: '0413 999 000' },
  // Rough-in
  { id: 'st-11', trade: 'Electrician',        contractor: 'SafeElect Services',     stageId: 'bs-6', stageName: 'Rough-in Services',startDate: '2025-07-21', endDate: '2025-08-05', status: 'tentative',  notes: 'First fix electrical, smart home prep',  contactName: 'Anna Kowalski',contactPhone: '0414 111 222' },
  { id: 'st-12', trade: 'Plumber (Rough-in)', contractor: 'Coastal Plumbing Co.',   stageId: 'bs-6', stageName: 'Rough-in Services',startDate: '2025-07-21', endDate: '2025-08-08', status: 'tentative',  notes: 'First fix plumbing, hot water system',   contactName: 'Rachel Kim',   contactPhone: '0413 555 666' },
  { id: 'st-13', trade: 'HVAC',               contractor: 'ClimateRight Solutions', stageId: 'bs-6', stageName: 'Rough-in Services',startDate: '2025-08-04', endDate: '2025-08-15', status: 'tentative',  notes: 'Ducted AC installation, rough-in',       contactName: 'Chris Tan',    contactPhone: '0414 333 444' },
]

export const buildQuotes: BuildQuote[] = [
  {
    id: 'bq-001', title: 'Structural Steel Supply & Erection', category: 'Structural',
    description: 'Supply and erect all structural steel for portal frame and upper level beams per engineering drawings Rev C.',
    amount: 87_500, submittedDate: '2025-04-28', expiryDate: '2025-05-28',
    status: 'approved', submittedBy: 'ModSteel Fabrications', isVariation: false,
    notes: 'Includes all fixings, baseplate welding and engineer-certified drawings.',
    documentName: 'Quote_ModSteel_StructuralSteel_Rev1.pdf',
  },
  {
    id: 'bq-002', title: 'Double-Glazed Windows & External Doors', category: 'Glazing',
    description: 'Supply and install all double-glazed aluminium windows and sliding glass doors as per window schedule v2.',
    amount: 42_800, submittedDate: '2025-05-10', expiryDate: '2025-06-10',
    status: 'pending', submittedBy: 'ClearView Glass', isVariation: false,
    notes: 'Includes Low-E glass, flyscreen to operable windows, and all flashing.',
    documentName: 'Quote_ClearView_WindowsDoors_v2.pdf',
  },
  {
    id: 'bq-003', title: 'Variation #1 — Additional Basement Excavation', category: 'Civil',
    description: 'Unforeseen rock encountered at RL 4.2m. Additional excavation required to reach design foundation depth. Day-rate works.',
    amount: 18_200, submittedDate: '2025-04-20', expiryDate: '2025-05-05',
    status: 'approved', submittedBy: 'GroundWorks Excavation', isVariation: true,
    notes: 'Rock report and site photos attached. Engineer sign-off provided.',
    documentName: 'Variation_001_RockExcavation.pdf',
  },
  {
    id: 'bq-004', title: 'Smart Home Automation Package', category: 'Electrical',
    description: 'Crestron-based smart home system covering lighting, climate, security, AV and energy monitoring throughout all levels.',
    amount: 65_000, submittedDate: '2025-05-12', expiryDate: '2025-06-05',
    status: 'pending', submittedBy: 'SafeElect Services', isVariation: false,
    notes: 'Option A: Full Crestron package. Option B available at $38k with partial automation.',
    documentName: 'Quote_SafeElect_SmartHome_OptionA.pdf',
  },
  {
    id: 'bq-005', title: 'Feature Brick Facade (Lock-up)', category: 'Masonry',
    description: 'Supply and lay reclaimed-look face brickwork to street-facing elevation and entry feature walls, matching Heritage Blend sample approved 14 April.',
    amount: 29_400, submittedDate: '2025-05-01', expiryDate: '2025-05-25',
    status: 'expired', submittedBy: 'Heritage Brickwork', isVariation: false,
    notes: 'Quote expired — resubmission with updated pricing expected this week.',
    documentName: 'Quote_Heritage_BrickFacade.pdf',
  },
  {
    id: 'bq-006', title: 'Variation #2 — Upgrade to Colorbond Ultra Roofing', category: 'Roofing',
    description: 'Owner request to upgrade from standard Colorbond to Colorbond Ultra (Thermatech) in Surfmist. Colour sample approved 6 May.',
    amount: 4_850, submittedDate: '2025-05-14', expiryDate: '2025-05-28',
    status: 'pending', submittedBy: 'Apex Roofing Co.', isVariation: true,
    notes: 'Price difference from base specification. Includes modified contract sum adjustment.',
    documentName: 'Variation_002_ColorbondUltraUpgrade.pdf',
  },
]

export const buildUpdates: BuildUpdate[] = [
  {
    id: 'bu-001', date: '2025-05-14', title: 'Frame Progress — Level 1 Underway',
    body: 'Great progress this week. Level 1 timber frame is 80% complete. Floor joists for the upper level have been installed and are being sheeted this week. The carpenter crew is on track and we expect to have framing fully complete by 30 May as scheduled.\n\nA couple of things to note: the stairwell opening has been adjusted slightly to accommodate the updated architectural detail — your designer has been notified. We\'ll be ordering windows next week ahead of the glazier booking in June.',
    stage: 'Frame', category: 'progress', photoCount: 6, author: 'James Chen', authorRole: 'Project Manager', pinned: true, requiresResponse: false,
  },
  {
    id: 'bu-002', date: '2025-05-06', title: 'Frame Stage Commenced',
    body: 'Happy to report that framing has kicked off today as scheduled. The ModSteel portal frame was completed last week and has been approved by the structural engineer. Carpenter crew is on site and the ground floor stud frame is progressing well.\n\nWeather permitting we\'ll crack through the ground floor this week and start on level 1 next week.',
    stage: 'Frame', category: 'milestone', photoCount: 4, author: 'Mark Dawson', authorRole: 'Site Foreman', pinned: false, requiresResponse: false,
  },
  {
    id: 'bu-003', date: '2025-05-05', title: '✅ Foundation Stage Complete — Council Inspection Passed',
    body: 'The slab has been poured and cured, and we\'re pleased to advise that the Council footing inspection was passed without conditions today.\n\nThe slab is now at full 28-day cure strength and framing begins tomorrow. The site is looking great — attached are photos of the completed slab with survey pegs confirming setouts.',
    stage: 'Foundations', category: 'inspection', photoCount: 5, author: 'James Chen', authorRole: 'Project Manager', pinned: true, requiresResponse: false,
  },
  {
    id: 'bu-004', date: '2025-04-22', title: 'Rock Encountered — Variation Required',
    body: 'During excavation at the NW corner footprint we encountered a rock shelf at RL 4.2m, approximately 600mm above the design foundation depth. Our civil contractor has commenced rock breaking to achieve the required founding level.\n\nA variation request (Variation #1) has been submitted separately for your review and approval. We\'ve attached the geotechnical report and day-rate records. Works are paused in this zone pending your approval — all other excavation is continuing.',
    stage: 'Foundations', category: 'delay', photoCount: 3, author: 'James Chen', authorRole: 'Project Manager', pinned: false, requiresResponse: true,
  },
  {
    id: 'bu-005', date: '2025-04-14', title: '✅ Site Preparation Complete',
    body: 'Site prep is done and dusted! The existing slab has been demolished and removed, cut and fill is complete, and stormwater drainage has been installed. The site has been benched and levelled ready for footing set-out.\n\nFoundations commence Monday 15 April. Steel reinforcement crew is first on site, followed by concretor.',
    stage: 'Site Preparation', category: 'milestone', photoCount: 8, author: 'Mark Dawson', authorRole: 'Site Foreman', pinned: false, requiresResponse: false,
  },
  {
    id: 'bu-006', date: '2025-04-01', title: '🏗️ Project Commencement',
    body: 'Welcome to your Briesa project portal! We\'re excited to get started on your new home. This is where you\'ll receive all project updates, approve quotes and variations, and track the progress of your build from start to finish.\n\nSite establishment is underway today — site fencing, signage and ablutions have been installed. Demolition commences tomorrow.\n\nDon\'t hesitate to reach out via the Messages section if you have any questions.',
    stage: 'Site Preparation', category: 'milestone', photoCount: 2, author: 'James Chen', authorRole: 'Project Manager', pinned: true, requiresResponse: false,
  },
]

// ── Build Budget ──────────────────────────────────────────────────────────────
export type BuildBudgetCategory = 'base' | 'variation' | 'contingency' | 'provisional'

export type BuildBudgetItem = {
  id: string
  category: string
  description: string
  baseAmount: number
  revisedAmount: number
  type: BuildBudgetCategory
  status: 'approved' | 'pending' | 'forecast'
}

export const buildBudgetItems: BuildBudgetItem[] = [
  { id: 'bb-1',  category: 'Site & Civil',        description: 'Site preparation, excavation, drainage',          baseAmount: 95_000,  revisedAmount: 113_200, type: 'base',        status: 'approved' },
  { id: 'bb-2',  category: 'Concrete & Steel',    description: 'Foundations, slab, structural steel',             baseAmount: 185_000, revisedAmount: 185_000, type: 'base',        status: 'approved' },
  { id: 'bb-3',  category: 'Frame & Roof',         description: 'Timber frame, roofing supply & install',          baseAmount: 145_000, revisedAmount: 149_850, type: 'base',        status: 'approved' },
  { id: 'bb-4',  category: 'Lock-up',             description: 'Windows, doors, brickwork, external cladding',    baseAmount: 135_000, revisedAmount: 177_800, type: 'base',        status: 'pending'  },
  { id: 'bb-5',  category: 'Services Rough-in',   description: 'Electrical, plumbing, HVAC first-fix',            baseAmount: 145_000, revisedAmount: 210_000, type: 'base',        status: 'pending'  },
  { id: 'bb-6',  category: 'Fitout & Finishes',   description: 'Plasterboard, paint, tiling, joinery, fixtures',  baseAmount: 285_000, revisedAmount: 285_000, type: 'base',        status: 'forecast' },
  { id: 'bb-7',  category: 'External Works',      description: 'Landscaping, driveway, fencing, pool',            baseAmount: 95_000,  revisedAmount: 95_000,  type: 'base',        status: 'forecast' },
  { id: 'bb-8',  category: 'Contingency',         description: '5% project contingency allowance',                baseAmount: 62_500,  revisedAmount: 62_500,  type: 'contingency', status: 'forecast' },
  { id: 'bb-v1', category: 'Civil Variation',     description: 'Variation #1 — Additional rock excavation',       baseAmount: 0,       revisedAmount: 18_200,  type: 'variation',   status: 'approved' },
  { id: 'bb-v2', category: 'Roofing Variation',   description: 'Variation #2 — Colorbond Ultra upgrade',          baseAmount: 0,       revisedAmount: 4_850,   type: 'variation',   status: 'pending'  },
]

// ── Build Messages ────────────────────────────────────────────────────────────
export type BuildMessage = {
  id: string
  date: string
  time: string
  from: 'owner' | 'builder'
  sender: string
  body: string
  read: boolean
}

export const buildMessages: BuildMessage[] = [
  { id: 'bm-1', date: '2025-05-14', time: '9:14 AM',  from: 'builder', sender: 'James Chen',     body: 'David, just wanted to give you a heads-up that the glazing quote from ClearView has been uploaded for your review. They\'ve been very responsive and their product looks solid — happy to discuss if you have any questions.', read: true  },
  { id: 'bm-2', date: '2025-05-14', time: '10:32 AM', from: 'owner',   sender: 'David Mitchell', body: 'Thanks James. We\'ll review the glazing quote tonight. Quick question — is the smart home automation quote still on the table or do we need to decide before framing is finished?', read: true  },
  { id: 'bm-3', date: '2025-05-14', time: '11:05 AM', from: 'builder', sender: 'James Chen',     body: 'Good question. We\'d ideally like approval before lock-up starts (June) as SafeElect need to coordinate with the framing carpenter for conduit runs. No rush yet but worth reviewing in the next 2–3 weeks.', read: true  },
  { id: 'bm-4', date: '2025-05-15', time: '8:45 AM',  from: 'builder', sender: 'Mark Dawson',    body: 'Morning! Just to let you know, we had a small delay yesterday afternoon — one of the framing crew was unwell. We made it up this morning and are back on programme. No impact to completion date.', read: false },
  { id: 'bm-5', date: '2025-05-15', time: '2:30 PM',  from: 'owner',   sender: 'Sarah Mitchell', body: 'Hi Mark, thanks for the update. Can we organise a site visit this week or early next? We\'d love to see the frame progress in person.', read: false },
]

// ── Build Site Visits ─────────────────────────────────────────────────────────
export type BuildSiteVisit = {
  id: string
  date: string
  time: string
  type: 'owner-visit' | 'council-inspection' | 'engineer-inspection' | 'private-certifier'
  label: string
  notes: string
  confirmed: boolean
}

export const buildSiteVisits: BuildSiteVisit[] = [
  { id: 'sv-1', date: '2025-05-20', time: '10:00 AM', type: 'owner-visit',          label: 'Owner Walk-through',                  notes: 'Framing progress inspection with James Chen & Mark Dawson', confirmed: true  },
  { id: 'sv-2', date: '2025-05-28', time: '9:00 AM',  type: 'engineer-inspection',  label: 'Structural Engineer — Frame Sign-off', notes: 'Hold point: required before roofing commences',              confirmed: true  },
  { id: 'sv-3', date: '2025-06-05', time: '2:00 PM',  type: 'private-certifier',    label: 'Private Certifier — Frame Inspection', notes: 'Construction certificate hold point',                         confirmed: false },
]

// ── Site Diary ────────────────────────────────────────────────────────────────
export type WeatherCondition = 'sunny' | 'partly-cloudy' | 'overcast' | 'rain' | 'heavy-rain' | 'wind'

export type BuildDiaryEntry = {
  id: string
  date: string
  weather: WeatherCondition
  tempHigh: number
  tempLow: number
  workersOnSite: number
  trades: string[]
  activities: string[]
  issues: string
  photos: number
  author: string
  workHours: number
  delayMinutes: number
}

export const buildDiaryEntries: BuildDiaryEntry[] = [
  {
    id: 'bd-1', date: '2025-05-14', weather: 'partly-cloudy', tempHigh: 22, tempLow: 14,
    workersOnSite: 6, trades: ['Carpenter (Frame)', 'Labourer'],
    activities: ['Upper level timber frame 80% complete', 'Floor joists installed to upper level', 'Sheeting commenced to upper floor deck', 'Stairwell opening framed'],
    issues: 'One crew member unwell — replaced by casual labourer. Minor delay to upper level sheeting (~30min). No programme impact.',
    photos: 6, author: 'Mark Dawson', workHours: 8, delayMinutes: 30,
  },
  {
    id: 'bd-2', date: '2025-05-13', weather: 'sunny', tempHigh: 24, tempLow: 13,
    workersOnSite: 7, trades: ['Carpenter (Frame)', 'Steel Fabricator'],
    activities: ['Level 1 stud frame complete', 'Window rough openings formed', 'LVL beam installed to kitchen opening', 'Portal frame bolt inspection by engineer'],
    issues: '',
    photos: 4, author: 'Mark Dawson', workHours: 9, delayMinutes: 0,
  },
  {
    id: 'bd-3', date: '2025-05-12', weather: 'overcast', tempHigh: 19, tempLow: 12,
    workersOnSite: 5, trades: ['Carpenter (Frame)'],
    activities: ['Ground floor frame completed and plumbed', 'Stud walls for bathrooms framed', 'First-floor joists commenced'],
    issues: '',
    photos: 3, author: 'Mark Dawson', workHours: 8, delayMinutes: 0,
  },
  {
    id: 'bd-4', date: '2025-05-09', weather: 'rain', tempHigh: 16, tempLow: 11,
    workersOnSite: 4, trades: ['Carpenter (Frame)'],
    activities: ['Indoor framing only due to rain', 'Internal partition walls commenced', 'Bathroom framing and wet area layout'],
    issues: 'Afternoon rain halted external works for ~2 hours. Crew moved indoors — no net programme impact.',
    photos: 2, author: 'Mark Dawson', workHours: 6, delayMinutes: 120,
  },
  {
    id: 'bd-5', date: '2025-05-08', weather: 'sunny', tempHigh: 21, tempLow: 13,
    workersOnSite: 8, trades: ['Carpenter (Frame)', 'Steel Fabricator'],
    activities: ['Steel portal frame fully erected and plumbed', 'Baseplates welded and inspected', 'Timber frame commenced — ground floor'],
    issues: '',
    photos: 5, author: 'Mark Dawson', workHours: 9, delayMinutes: 0,
  },
  {
    id: 'bd-6', date: '2025-05-07', weather: 'sunny', tempHigh: 23, tempLow: 14,
    workersOnSite: 6, trades: ['Steel Fabricator'],
    activities: ['Portal frame columns erected (north elevation)', 'Cross-bracing installed', 'Engineer inspection of column connections — passed'],
    issues: '',
    photos: 4, author: 'Mark Dawson', workHours: 8, delayMinutes: 0,
  },
  {
    id: 'bd-7', date: '2025-05-06', weather: 'partly-cloudy', tempHigh: 20, tempLow: 13,
    workersOnSite: 5, trades: ['Steel Fabricator'],
    activities: ['Frame stage commenced', 'Site mobilisation for steel crew', 'First portal frame columns set out and installed'],
    issues: '',
    photos: 3, author: 'James Chen', workHours: 8, delayMinutes: 0,
  },
]

// ── Selections ────────────────────────────────────────────────────────────────
export type SelectionStatus = 'overdue' | 'required' | 'submitted' | 'approved' | 'ordered' | 'delivered'

export type BuildSelection = {
  id: string
  category: string
  item: string
  description: string
  supplier: string
  modelCode: string
  colour: string
  requiredByStage: string
  decisionDeadline: string
  status: SelectionStatus
  notes: string
  scheduleImpactDays: number
  price: number
  ownerNote: string
}

export const buildSelections: BuildSelection[] = [
  // Overdue
  {
    id: 'sel-1', category: 'External Cladding', item: 'Feature Brickwork Colour', description: 'Colour selection for Heritage Blend face bricks to street elevation and entry walls',
    supplier: 'Brickworks', modelCode: 'Heritage Blend', colour: '', requiredByStage: 'Lock-up',
    decisionDeadline: '2025-05-10', status: 'overdue', scheduleImpactDays: 7,
    notes: 'Bricklayer requires confirmation to re-quote. Quote has expired — decision needed urgently.',
    price: 0, ownerNote: '',
  },
  // Required (upcoming deadlines)
  {
    id: 'sel-2', category: 'Roofing', item: 'Colorbond Roof Colour', description: 'Colorbond Ultra Thermatech colour selection — Surfmist approved verbally, needs written confirmation',
    supplier: 'BlueScope Steel', modelCode: 'Colorbond Ultra', colour: 'Surfmist', requiredByStage: 'Roof',
    decisionDeadline: '2025-05-22', status: 'submitted', scheduleImpactDays: 5,
    notes: 'Verbally agreed Surfmist — upgrade variation submitted. Awaiting written approval of Variation #2.',
    price: 4850, ownerNote: 'We\'re happy with Surfmist.',
  },
  {
    id: 'sel-3', category: 'Windows & Doors', item: 'Window Frame Colour', description: 'Aluminium window frame powdercoat colour for all double-glazed windows and sliding doors',
    supplier: 'ClearView Glass', modelCode: 'Alspec ProGlide', colour: '', requiredByStage: 'Lock-up',
    decisionDeadline: '2025-05-28', status: 'required', scheduleImpactDays: 14,
    notes: 'Must be confirmed at time of order placement (by 19 May). Standard colours: Dune, Monument, Surfmist, Black.',
    price: 0, ownerNote: '',
  },
  {
    id: 'sel-4', category: 'External Doors', item: 'Front Door Design & Colour', description: 'Pivot entry door design selection — builder has presented 3 options (see attachments)',
    supplier: 'Corinthian Doors', modelCode: 'Pivot Series', colour: '', requiredByStage: 'Lock-up',
    decisionDeadline: '2025-06-01', status: 'required', scheduleImpactDays: 10,
    notes: 'Long lead time item — 6–8 weeks from order. Must order by 1 June for Lock-up.',
    price: 3800, ownerNote: '',
  },
  // Submitted / in progress
  {
    id: 'sel-5', category: 'Kitchen', item: 'Kitchen Benchtop Material & Colour', description: '40mm stone benchtop selection for kitchen, island and butler\'s pantry',
    supplier: 'Caesarstone', modelCode: '5143 White Attica', colour: 'White Attica', requiredByStage: 'Fitout & Finishes',
    decisionDeadline: '2025-08-01', status: 'submitted', scheduleImpactDays: 21,
    notes: 'Sample board approved 10 May. Awaiting quote from joiner for confirmation.',
    price: 12500, ownerNote: 'Love the White Attica — please confirm with joiner.',
  },
  {
    id: 'sel-6', category: 'Kitchen', item: 'Kitchen Cabinetry Colour', description: 'Painted MDF cabinetry colour — upper and lower cabinets, island and butler\'s pantry',
    supplier: 'Custom Joinery Co.', modelCode: 'Dulux Two Coat', colour: 'Vivid White', requiredByStage: 'Fitout & Finishes',
    decisionDeadline: '2025-08-01', status: 'approved', scheduleImpactDays: 0,
    notes: 'Vivid White approved 5 May. Joiner confirmed, deposit paid.',
    price: 0, ownerNote: '',
  },
  {
    id: 'sel-7', category: 'Bathrooms', item: 'Floor & Wall Tiles (Ensuite)', description: '600x600 rectified porcelain floor tile and 300x600 wall tile for ensuite',
    supplier: 'Tile Republic', modelCode: 'TR-Calacatta', colour: 'Ivory/Grey', requiredByStage: 'Rough-in Services',
    decisionDeadline: '2025-07-15', status: 'required', scheduleImpactDays: 14,
    notes: 'Tiler needs sizes confirmed before rough-in. Floor waste positions depend on tile size.',
    price: 4200, ownerNote: '',
  },
  {
    id: 'sel-8', category: 'Tapware', item: 'Tapware & Fixtures Package', description: 'All tapware, shower heads, bath fillers and basin mixers throughout house',
    supplier: 'Reece Plumbing', modelCode: 'Mecca Range', colour: 'Brushed Nickel', requiredByStage: 'Rough-in Services',
    decisionDeadline: '2025-07-20', status: 'submitted', scheduleImpactDays: 21,
    notes: 'Quote received — $8,400 for full package. Brushed nickel finish approved. Awaiting owner sign-off.',
    price: 8400, ownerNote: '',
  },
  {
    id: 'sel-9', category: 'Flooring', item: 'Engineered Timber Flooring', description: 'Engineered timber flooring for all living areas, bedrooms and hallways',
    supplier: 'Havwoods', modelCode: 'HW101 European Oak', colour: 'Blonde', requiredByStage: 'Fitout & Finishes',
    decisionDeadline: '2025-09-01', status: 'approved', scheduleImpactDays: 0,
    notes: 'HW101 Blonde approved 28 April. Long lead 10 weeks — order placed.',
    price: 18500, ownerNote: '',
  },
  {
    id: 'sel-10', category: 'Appliances', item: 'Kitchen Appliance Suite', description: 'Oven, cooktop, rangehood, dishwasher, and fridge cavity dimensions',
    supplier: 'Miele', modelCode: 'Generation 7000', colour: 'Stainless Steel', requiredByStage: 'Fitout & Finishes',
    decisionDeadline: '2025-09-15', status: 'required', scheduleImpactDays: 0,
    notes: 'Dimensions needed before joiner starts cutouts. Model selection can follow.',
    price: 22000, ownerNote: '',
  },
]

// ── Payment Claims ────────────────────────────────────────────────────────────
export type PaymentClaimStatus = 'submitted' | 'approved' | 'paid' | 'disputed'

export type BuildPaymentClaim = {
  id: string
  claimNumber: number
  title: string
  stage: string
  submittedDate: string
  dueDate: string
  amount: number
  gstAmount: number
  cumulativeAmount: number
  status: PaymentClaimStatus
  description: string
  percentageComplete: number
  supportingDocs: string[]
  notes: string
}

export const buildPaymentClaims: BuildPaymentClaim[] = [
  {
    id: 'pc-1', claimNumber: 1, title: 'Deposit — Contract Execution',
    stage: 'Pre-Construction', submittedDate: '2025-03-15', dueDate: '2025-03-22',
    amount: 62_500, gstAmount: 6_250, cumulativeAmount: 62_500,
    status: 'paid', percentageComplete: 5,
    description: 'Initial deposit per contract schedule of payments — 5% of contract value due on execution.',
    supportingDocs: ['SignedContract_MitchellResidence.pdf', 'Insurance_Certificate.pdf'],
    notes: 'Paid 18 March 2025 via bank transfer.',
  },
  {
    id: 'pc-2', claimNumber: 2, title: 'Base Stage — Foundations Complete',
    stage: 'Foundations', submittedDate: '2025-05-07', dueDate: '2025-05-21',
    amount: 125_000, gstAmount: 12_500, cumulativeAmount: 187_500,
    status: 'paid', percentageComplete: 15,
    description: 'Base stage payment — footings, slab and structural steel complete. Council inspection passed 5 May 2025.',
    supportingDocs: ['ClaimNo2_ProgressPhotos.pdf', 'CouncilInspection_Pass_05May.pdf', 'EngineerCert_Foundations.pdf'],
    notes: 'Paid 14 May 2025. Inspection certificates attached.',
  },
  {
    id: 'pc-3', claimNumber: 3, title: 'Frame Stage — Frame & Roof Complete',
    stage: 'Frame', submittedDate: '2025-05-30', dueDate: '2025-06-13',
    amount: 125_000, gstAmount: 12_500, cumulativeAmount: 312_500,
    status: 'submitted', percentageComplete: 25,
    description: 'Frame stage payment — timber frame, structural steel and roof framing complete. Awaiting engineer sign-off 28 May and private certifier inspection 5 June.',
    supportingDocs: ['ClaimNo3_FramePhotos.pdf', 'ClaimNo3_ScheduleOfWorks.pdf'],
    notes: 'Submitted for review. Hold point inspections scheduled — engineer 28 May, certifier 5 June.',
  },
  {
    id: 'pc-4', claimNumber: 4, title: 'Lock-up Stage',
    stage: 'Lock-up', submittedDate: '', dueDate: '2025-08-01',
    amount: 187_500, gstAmount: 18_750, cumulativeAmount: 500_000,
    status: 'submitted', percentageComplete: 40,
    description: 'Lock-up stage — windows, external doors, brickwork and roof cladding complete.',
    supportingDocs: [],
    notes: 'Not yet due — estimated July 2025.',
  },
  {
    id: 'pc-5', claimNumber: 5, title: 'Fixing Stage — Rough-in Complete',
    stage: 'Rough-in Services', submittedDate: '', dueDate: '2025-09-15',
    amount: 187_500, gstAmount: 18_750, cumulativeAmount: 687_500,
    status: 'submitted', percentageComplete: 55,
    description: 'First fix electrical, plumbing and HVAC complete and inspected.',
    supportingDocs: [],
    notes: 'Not yet due — estimated September 2025.',
  },
  {
    id: 'pc-6', claimNumber: 6, title: 'Practical Completion',
    stage: 'Practical Completion', submittedDate: '', dueDate: '2025-11-14',
    amount: 562_500, gstAmount: 56_250, cumulativeAmount: 1_250_000,
    status: 'submitted', percentageComplete: 100,
    description: 'Final payment on practical completion. All defects corrected and certificates of occupancy obtained.',
    supportingDocs: [],
    notes: 'Not yet due — estimated November 2025.',
  },
]

// ── Build Documents ───────────────────────────────────────────────────────────
export type BuildDocumentType = 'contract' | 'plans' | 'permit' | 'certificate' | 'warranty' | 'report' | 'insurance'

export type BuildDocument = {
  id: string
  title: string
  type: BuildDocumentType
  uploadedDate: string
  expiryDate: string
  fileSize: string
  uploadedBy: string
  description: string
  status: 'current' | 'superseded' | 'expiring'
  pages: number
}

export const buildDocuments: BuildDocument[] = [
  { id: 'doc-1',  title: 'HIA Fixed Price Contract',                      type: 'contract',     uploadedDate: '2025-03-15', expiryDate: '',           fileSize: '2.4 MB', uploadedBy: 'Acme Construction', description: 'Executed HIA residential building contract — $1,250,000 fixed price', status: 'current',    pages: 48 },
  { id: 'doc-2',  title: 'Architectural Plans — Rev D (Approved)',         type: 'plans',        uploadedDate: '2025-03-10', expiryDate: '',           fileSize: '18.2 MB',uploadedBy: 'Acme Construction', description: 'Council-approved architectural drawings, all levels and elevations', status: 'current',    pages: 24 },
  { id: 'doc-3',  title: 'Structural Engineering Drawings',                type: 'plans',        uploadedDate: '2025-04-02', expiryDate: '',           fileSize: '8.6 MB', uploadedBy: 'Acme Construction', description: 'Structural drawings and engineering specifications by ABC Structural', status: 'current',    pages: 16 },
  { id: 'doc-4',  title: 'Development Approval — DA2024/0412',             type: 'permit',       uploadedDate: '2025-02-20', expiryDate: '2027-02-20', fileSize: '1.1 MB', uploadedBy: 'James Chen',        description: 'Northern Beaches Council development approval with conditions', status: 'current',    pages: 12 },
  { id: 'doc-5',  title: 'Construction Certificate — CC2025/0118',        type: 'permit',       uploadedDate: '2025-03-28', expiryDate: '2027-03-28', fileSize: '0.8 MB', uploadedBy: 'James Chen',        description: 'Construction certificate issued by private certifier AllCert Pty Ltd', status: 'current',  pages: 6  },
  { id: 'doc-6',  title: 'Builder\'s Public Liability Insurance',          type: 'insurance',    uploadedDate: '2025-04-01', expiryDate: '2026-04-01', fileSize: '0.5 MB', uploadedBy: 'Acme Construction', description: '$20M public liability insurance — Acme Construction Pty Ltd', status: 'current',    pages: 4  },
  { id: 'doc-7',  title: 'Home Warranty Insurance (HBCF)',                 type: 'insurance',    uploadedDate: '2025-03-20', expiryDate: '2031-03-20', fileSize: '0.7 MB', uploadedBy: 'Acme Construction', description: 'Home Building Compensation Fund certificate — 6 year structural warranty', status: 'current', pages: 3 },
  { id: 'doc-8',  title: 'Geotechnical Report',                            type: 'report',       uploadedDate: '2025-03-05', expiryDate: '',           fileSize: '3.2 MB', uploadedBy: 'James Chen',        description: 'Site soil investigation and foundation recommendations by GeoSite Pty Ltd', status: 'current', pages: 28 },
  { id: 'doc-9',  title: 'Council Footing Inspection — PASSED 5 May',     type: 'certificate',  uploadedDate: '2025-05-05', expiryDate: '',           fileSize: '0.3 MB', uploadedBy: 'James Chen',        description: 'Council mandatory hold point inspection — footings and slab reinforcement', status: 'current', pages: 2 },
  { id: 'doc-10', title: 'Structural Engineer Frame Certificate (pending)','type': 'certificate', uploadedDate: '',           expiryDate: '',           fileSize: '',       uploadedBy: '',                  description: 'To be uploaded after 28 May engineer inspection', status: 'current', pages: 0 },
  { id: 'doc-11', title: 'Soil & Waste Drainage Approval',                 type: 'permit',       uploadedDate: '2025-04-10', expiryDate: '',           fileSize: '0.4 MB', uploadedBy: 'Acme Construction', description: 'Sydney Water approval for soil and waste drainage connection', status: 'current',    pages: 3  },
  { id: 'doc-12', title: 'Architectural Plans — Rev C (Superseded)',        type: 'plans',        uploadedDate: '2025-02-15', expiryDate: '',           fileSize: '16.8 MB',uploadedBy: 'Acme Construction', description: 'Previous revision — superseded by Rev D approved 10 March', status: 'superseded', pages: 22 },
]

// ── Build Risk Register ───────────────────────────────────────────────────────
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
export type RiskStatus = 'open' | 'mitigated' | 'closed' | 'monitoring'

export type BuildRisk = {
  id: string
  category: string
  description: string
  likelihood: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  level: RiskLevel
  status: RiskStatus
  owner: string
  mitigationAction: string
  raisedDate: string
  reviewDate: string
}

export const buildRisks: BuildRisk[] = [
  { id: 'br-1', category: 'Commercial',  description: 'Smart home automation quote ($65k) may escalate if owner requests additional zones after electrical rough-in', likelihood: 3, impact: 3, level: 'high',   status: 'open',       owner: 'James Chen',  mitigationAction: 'Fix scope in writing before approval. Include "no additional zones" clause in variation.', raisedDate: '2025-05-12', reviewDate: '2025-05-26' },
  { id: 'br-2', category: 'Programme',   description: 'Glazing lead time (8–10 weeks) will delay Lock-up if quote not approved by 19 May', likelihood: 4, impact: 4, level: 'critical', status: 'open',    owner: 'James Chen',  mitigationAction: 'Urgent: obtain owner approval by 19 May. Escalate if not received.', raisedDate: '2025-05-10', reviewDate: '2025-05-19' },
  { id: 'br-3', category: 'Design',      description: 'Stairwell opening dimension change may conflict with landing balustrade specification', likelihood: 2, impact: 3, level: 'medium', status: 'monitoring', owner: 'Mark Dawson', mitigationAction: 'Designer to confirm revised opening against balustrade spec before lock-up.', raisedDate: '2025-05-14', reviewDate: '2025-05-28' },
  { id: 'br-4', category: 'Weather',     description: 'June roofing stage coincides with early winter — heavy rain can halt sheet metal works', likelihood: 3, impact: 2, level: 'medium', status: 'open',    owner: 'Mark Dawson', mitigationAction: 'Apex Roofing to confirm wet-weather contingency. Build 2-day float into lock-up.', raisedDate: '2025-05-08', reviewDate: '2025-06-01' },
  { id: 'br-5', category: 'Commercial',  description: 'Brick facade re-quote likely to increase following market movements since original quote expired', likelihood: 4, impact: 2, level: 'medium', status: 'open',     owner: 'James Chen',  mitigationAction: 'Request re-quote immediately. Budget $3–5k contingency for price increase.', raisedDate: '2025-05-15', reviewDate: '2025-05-22' },
  { id: 'br-6', category: 'Structural',  description: 'Rock encountered in NW corner — risk of additional rock in undiscovered areas during services trenching', likelihood: 2, impact: 2, level: 'medium', status: 'monitoring', owner: 'James Chen', mitigationAction: 'Geotechnical report reviewed — lower risk than initial assessment. Monitor during any further excavation.', raisedDate: '2025-04-22', reviewDate: '2025-06-30' },
  { id: 'br-7', category: 'Programme',   description: 'HVAC rough-in booking unconfirmed — late confirmation risks delaying insulation start', likelihood: 3, impact: 2, level: 'medium', status: 'open',     owner: 'James Chen',  mitigationAction: 'Follow up ClimateRight by end of May for firm booking.', raisedDate: '2025-05-10', reviewDate: '2025-05-31' },
  { id: 'br-8', category: 'Commercial',  description: 'Additional basement excavation rock (Variation #1) — risk closed following approval', likelihood: 1, impact: 1, level: 'low',    status: 'closed',     owner: 'James Chen',  mitigationAction: 'Variation #1 approved $18,200. Works complete.', raisedDate: '2025-04-22', reviewDate: '2025-05-07' },
]


// ══════════════════════════════════════════════════════════════════════════════
// CONTRACTOR PORTAL
// ══════════════════════════════════════════════════════════════════════════════

export const contractorProfile = {
  id:           'ctr-001',
  companyName:  'SafeElect Pty Ltd',
  contactName:  'Pete Walsh',
  trade:        'Electrical',
  abn:          '45 678 901 234',
  licenceNumber:'EC12345',
  phone:        '0412 567 890',
  email:        'pete@safeelect.com.au',
  address:      '12 Trade St, Brookvale NSW 2100',
  plan:         'free' as const,
  joinedDate:   '2024-09-15',
}

export type ContractorDocStatus = 'current' | 'expiring' | 'expired' | 'missing'
export type ContractorOwnDoc = {
  id: string
  type: 'insurance' | 'licence' | 'certificate' | 'accreditation' | 'other'
  title: string
  issuer: string
  issueDate: string
  expiryDate: string
  fileSize: string
  status: ContractorDocStatus
  requiredByJobs: string[]
}

export const contractorOwnDocs: ContractorOwnDoc[] = [
  {
    id: 'cd-1',
    type: 'insurance',
    title: 'Public Liability Insurance',
    issuer: 'GIO Business Insurance',
    issueDate: '2025-04-01',
    expiryDate: '2026-04-01',
    fileSize: '0.6 MB',
    status: 'current',
    requiredByJobs: ['cj-1', 'cj-2', 'cj-3'],
  },
  {
    id: 'cd-2',
    type: 'insurance',
    title: "Workers Compensation Insurance",
    issuer: 'icare NSW',
    issueDate: '2025-04-01',
    expiryDate: '2026-04-01',
    fileSize: '0.4 MB',
    status: 'current',
    requiredByJobs: ['cj-1', 'cj-2', 'cj-3'],
  },
  {
    id: 'cd-3',
    type: 'licence',
    title: 'Electrical Contractor Licence (EC12345)',
    issuer: 'NSW Fair Trading',
    issueDate: '2022-01-10',
    expiryDate: '2026-01-10',
    fileSize: '0.3 MB',
    status: 'current',
    requiredByJobs: ['cj-1', 'cj-2', 'cj-3'],
  },
  {
    id: 'cd-4',
    type: 'licence',
    title: 'Electrical Worker Licence — Pete Walsh',
    issuer: 'NSW Fair Trading',
    issueDate: '2020-06-15',
    expiryDate: '2025-06-15',
    fileSize: '0.2 MB',
    status: 'expiring',
    requiredByJobs: ['cj-1', 'cj-2'],
  },
  {
    id: 'cd-5',
    type: 'certificate',
    title: 'White Card (CPCWHS1001)',
    issuer: 'SafeWork Australia',
    issueDate: '2019-03-20',
    expiryDate: '',
    fileSize: '0.2 MB',
    status: 'current',
    requiredByJobs: ['cj-1', 'cj-2', 'cj-3'],
  },
  {
    id: 'cd-6',
    type: 'certificate',
    title: 'CPR & First Aid Certificate',
    issuer: 'St John Ambulance',
    issueDate: '2024-08-10',
    expiryDate: '2027-08-10',
    fileSize: '0.2 MB',
    status: 'current',
    requiredByJobs: [],
  },
  {
    id: 'cd-7',
    type: 'accreditation',
    title: 'NECA Membership',
    issuer: 'National Electrical & Communications Association',
    issueDate: '2025-01-01',
    expiryDate: '2025-12-31',
    fileSize: '0.4 MB',
    status: 'current',
    requiredByJobs: [],
  },
]

export type ContractorJobDocStatus = 'not-submitted' | 'pending' | 'approved' | 'rejected'
export type ContractorJobDoc = {
  id: string
  title: string
  description: string
  required: boolean
  submitted: boolean
  status: ContractorJobDocStatus
  submittedDate?: string
  notes?: string
}

export type ContractorJobGuideline = {
  category: string
  items: string[]
}

export type ContractorJobStatus = 'active' | 'upcoming' | 'completed' | 'on-hold'

export type ContractorJob = {
  id: string
  projectName: string
  projectRef: string
  address: string
  suburb: string
  builder: string
  projectManager: string
  pmPhone: string
  pmEmail: string
  safetyOfficer: string
  safetyPhone: string
  trade: string
  scope: string[]
  startDate: string
  endDate: string
  status: ContractorJobStatus
  stage: string
  stageColor: string
  siteInducted: boolean
  inductionDate?: string
  requiredDocs: ContractorJobDoc[]
  guidelines: ContractorJobGuideline[]
  siteRules: string[]
  ppeRequired: string[]
  emergencyAssemblyPoint: string
  nearestHospital: string
  accessInstructions: string
}

export const contractorJobs: ContractorJob[] = [
  {
    id: 'cj-1',
    projectName: 'The Mitchell Residence',
    projectRef: 'ACM-2025-014',
    address: '42 Headland Drive, Newport NSW 2106',
    suburb: 'Newport',
    builder: 'Acme Construction Pty Ltd',
    projectManager: 'James Chen',
    pmPhone: '0421 123 456',
    pmEmail: 'james.chen@acmeconstruction.com.au',
    safetyOfficer: 'Mark Dawson',
    safetyPhone: '0432 567 890',
    trade: 'Electrical',
    scope: [
      'First fix electrical rough-in (all levels)',
      'Switchboard installation and labelling',
      'LED downlight installation — all rooms',
      'Smart home wiring — 22 zones (subject to approved variation)',
      'EV charger conduit and wiring to garage',
      'Solar inverter connection (post-PC)',
      'Telephone, data, and TV points throughout',
      'Smoke alarm installation (interconnected)',
    ],
    startDate: '2025-07-21',
    endDate: '2025-08-05',
    status: 'upcoming',
    stage: 'Rough-in Services',
    stageColor: '#f59e0b',
    siteInducted: true,
    inductionDate: '2025-05-10',
    requiredDocs: [
      { id: 'rd-1', title: 'Public Liability Insurance Certificate', description: '$20M minimum cover, naming Acme Construction as interested party', required: true, submitted: true, status: 'approved', submittedDate: '2025-05-10' },
      { id: 'rd-2', title: "Workers Compensation Certificate of Currency", description: 'Current certificate for all workers on site', required: true, submitted: true, status: 'approved', submittedDate: '2025-05-10' },
      { id: 'rd-3', title: 'Electrical Contractor Licence (NSW)', description: 'Must be current for the duration of works', required: true, submitted: true, status: 'approved', submittedDate: '2025-05-10' },
      { id: 'rd-4', title: 'SWMS — Electrical Rough-in', description: 'Site-specific SWMS for all electrical rough-in activities', required: true, submitted: true, status: 'pending', submittedDate: '2025-05-14', notes: 'Awaiting PM review' },
      { id: 'rd-5', title: 'Site Induction Record', description: 'Signed site induction form for all workers entering site', required: true, submitted: true, status: 'approved', submittedDate: '2025-05-10' },
      { id: 'rd-6', title: 'Worker White Cards', description: 'Copies of white cards for all workers on site', required: true, submitted: false, status: 'not-submitted', notes: 'Required before site access for additional workers' },
      { id: 'rd-7', title: 'Individual Electrical Worker Licences', description: 'Current licence for each licensed electrician on site', required: true, submitted: false, status: 'not-submitted', notes: 'Due before work commences 21 July' },
      { id: 'rd-8', title: 'Smart Home Specification Sheet', description: 'Technical spec for smart home zones if variation is approved', required: false, submitted: false, status: 'not-submitted', notes: 'Only required if Variation #3 is approved' },
    ],
    guidelines: [
      {
        category: 'Working Hours',
        items: [
          'Permitted hours: Monday – Friday 7:00 AM – 5:00 PM',
          'Saturday: 8:00 AM – 4:00 PM (prior approval required)',
          'No work Sundays or public holidays',
          'Notify PM at least 24 hours in advance of any schedule change',
        ],
      },
      {
        category: 'Site Access',
        items: [
          'Sign in/out on site register at the site office on arrival and departure',
          'Gates are padlocked — combination provided by PM on induction',
          'No visitors or unauthorised personnel on site at any time',
          'Parking on the grass verge only — no blocking neighbours\' driveways',
        ],
      },
      {
        category: 'WHS Requirements',
        items: [
          'Full PPE required at all times (see PPE list below)',
          'Toolbox talks held every Monday 7:15 AM — attendance required for active trades',
          'All hazards must be reported to Safety Officer Mark Dawson immediately',
          'No work at height without harness + anchor point. Scaffold is provided by builder.',
          'All electrical tools must have current RCD protection and test tag',
          'Permit to Work required for any work in ceiling cavities',
        ],
      },
      {
        category: 'Coordination',
        items: [
          'Coordinate wall cavity access with Plumber (Coastal Plumbing — Tom Richards 0411 222 333) before any penetrations',
          'Coordinate ceiling space with HVAC (ClimateRight — Dave Cole 0415 888 999)',
          'Notify PM before any structural penetrations — engineer approval may be required',
          'Do not interfere with or cut into existing Acme-installed temporary services',
        ],
      },
    ],
    siteRules: [
      'No smoking anywhere on the property — use the designated area on Headland Drive',
      'No music at audible levels beyond the site boundary',
      'Keep site clean and tidy — remove trade waste daily',
      'No alcohol or drugs on site — zero tolerance policy',
      'Take photos of all work before concealment and submit to PM',
      'Notify PM of any latent conditions (e.g. unexpected structural elements, services)',
    ],
    ppeRequired: ['Safety helmet', 'Hi-vis vest (Class 2)', 'Safety boots (steel-capped)', 'Safety glasses', 'Gloves (task-appropriate)', 'Hearing protection (as required)'],
    emergencyAssemblyPoint: 'Front footpath on Headland Drive, west side of site gate',
    nearestHospital: 'Mona Vale Hospital — 1 Coronation St, Mona Vale (5 min)',
    accessInstructions: 'Enter from Headland Drive. Site gate on left side of property. Combination: 4821. Site office is the silver shed on the right after entering.',
  },
  {
    id: 'cj-2',
    projectName: 'Bronte Terrace Renovation',
    projectRef: 'STR-2025-007',
    address: '18 Hewlett St, Bronte NSW 2024',
    suburb: 'Bronte',
    builder: 'Stride Build Group',
    projectManager: 'Rachel Lim',
    pmPhone: '0418 334 567',
    pmEmail: 'rachel.lim@stridebuild.com.au',
    safetyOfficer: 'Rachel Lim',
    safetyPhone: '0418 334 567',
    trade: 'Electrical',
    scope: [
      'Complete rewire of existing 3-bedroom terrace',
      'New switchboard upgrade (100A three-phase)',
      'Kitchen and bathroom circuit installation',
      'External lighting and security camera power',
      'Intercom system installation',
    ],
    startDate: '2025-06-09',
    endDate: '2025-06-20',
    status: 'active',
    stage: 'Rough-in',
    stageColor: '#FFD940',
    siteInducted: true,
    inductionDate: '2025-06-05',
    requiredDocs: [
      { id: 'rd-2-1', title: 'Public Liability Insurance Certificate', description: '$20M minimum cover', required: true, submitted: true, status: 'approved', submittedDate: '2025-06-03' },
      { id: 'rd-2-2', title: "Workers Compensation Certificate of Currency", description: 'Current certificate for all workers', required: true, submitted: true, status: 'approved', submittedDate: '2025-06-03' },
      { id: 'rd-2-3', title: 'Electrical Contractor Licence', description: 'Current NSW EC licence', required: true, submitted: true, status: 'approved', submittedDate: '2025-06-03' },
      { id: 'rd-2-4', title: 'SWMS — Electrical Rewire', description: 'Site-specific SWMS for rewire activities in occupied adjacent terrace', required: true, submitted: true, status: 'approved', submittedDate: '2025-06-04' },
      { id: 'rd-2-5', title: 'Asbestos Awareness Acknowledgement', description: 'Signed acknowledgement of asbestos register for pre-1990 terrace', required: true, submitted: true, status: 'approved', submittedDate: '2025-06-05' },
    ],
    guidelines: [
      {
        category: 'Working Hours',
        items: [
          'Permitted hours: Monday – Friday 7:30 AM – 5:00 PM only',
          'No weekend work — neighbours have objected to noise',
          'Noisy works (drilling, cutting) only 9:00 AM – 4:00 PM',
        ],
      },
      {
        category: 'Asbestos Awareness',
        items: [
          'This is a pre-1987 terrace — asbestos register has been prepared',
          'DO NOT drill, cut or disturb any material without checking the register first',
          'Suspected asbestos material: ceiling rosettes, some external eaves lining',
          'Contact Rachel Lim immediately if you discover any unlisted suspect material',
        ],
      },
      {
        category: 'Neighbour Management',
        items: [
          'Shared party wall with 16 Hewlett St — no heavy impact to party wall after 4:00 PM',
          'Keep front footpath clear — neighbours use pram/wheelchair',
          'Introduce yourself to neighbours on day 1 — Rachel Lim to accompany',
        ],
      },
    ],
    siteRules: [
      'This is a lived-in street — keep noise to reasonable levels at all times',
      'No rubbish bins blocking the footpath',
      'Lock the front door when leaving site each day',
      'The owner\'s cat may be on site — please do not let it out',
    ],
    ppeRequired: ['Safety helmet (in roof/ceiling spaces)', 'Hi-vis vest', 'Safety boots', 'P2 dust mask (in ceiling spaces)', 'Safety glasses'],
    emergencyAssemblyPoint: 'Footpath in front of 18 Hewlett St',
    nearestHospital: "St Vincent's Hospital — 390 Victoria St, Darlinghurst (12 min)",
    accessInstructions: 'Keysafe on front fence — code provided by Rachel. Park in driveway or Hewlett St.',
  },
  {
    id: 'cj-3',
    projectName: 'Surry Hills Commercial Fitout',
    projectRef: 'URB-2025-031',
    address: 'Level 2, 44 Foster St, Surry Hills NSW 2010',
    suburb: 'Surry Hills',
    builder: 'Urban Interiors Group',
    projectManager: 'Daniel Park',
    pmPhone: '0407 889 112',
    pmEmail: 'd.park@urbaninteriors.com.au',
    safetyOfficer: 'Daniel Park',
    safetyPhone: '0407 889 112',
    trade: 'Electrical',
    scope: [
      'Office lighting design and installation (72 fittings)',
      'Power circuit distribution — 24 workstation pods',
      'Server room power and UPS connection',
      'Emergency and exit lighting system',
      'Final connection and commissioning',
    ],
    startDate: '2025-08-18',
    endDate: '2025-09-05',
    status: 'upcoming',
    stage: 'Fitout',
    stageColor: '#94a3b8',
    siteInducted: false,
    requiredDocs: [
      { id: 'rd-3-1', title: 'Public Liability Insurance Certificate', description: '$20M cover minimum — commercial site requirement', required: true, submitted: false, status: 'not-submitted', notes: 'Required 1 week before site access' },
      { id: 'rd-3-2', title: "Workers Compensation Certificate of Currency", description: 'Current for all workers', required: true, submitted: false, status: 'not-submitted' },
      { id: 'rd-3-3', title: 'Electrical Contractor Licence', description: 'NSW EC licence', required: true, submitted: false, status: 'not-submitted' },
      { id: 'rd-3-4', title: 'SWMS — Commercial Fitout Electrical', description: 'Must reference live switchboard isolation procedure', required: true, submitted: false, status: 'not-submitted', notes: 'Template available from Daniel Park' },
      { id: 'rd-3-5', title: 'Building Management Approval', description: 'Approval from building manager for access and after-hours works', required: true, submitted: false, status: 'not-submitted', notes: 'Urban Interiors to obtain — just provide licence copy' },
      { id: 'rd-3-6', title: 'Energex Test & Tag Register', description: 'Current register for all portable electrical equipment', required: true, submitted: false, status: 'not-submitted' },
    ],
    guidelines: [
      {
        category: 'Working Hours',
        items: [
          'Standard hours: Monday – Friday 7:00 AM – 5:00 PM',
          'After-hours access available by arrangement with building manager',
          'Noisy works only before 8:00 AM or after 5:30 PM (adjacent tenants)',
        ],
      },
      {
        category: 'Building Requirements',
        items: [
          'Contractor ID pass required — issued by building manager on day 1',
          'All materials to be brought up via goods lift — not passenger lift',
          'No drilling into concrete slab without structural engineer approval',
          'Hot works permit required for any soldering on site',
        ],
      },
    ],
    siteRules: [
      'Commercial building — professional conduct at all times',
      'Clean up all trade waste same day',
      'Goods lift must be booked in advance with building manager',
      'Laptop/phone use restricted in server room',
    ],
    ppeRequired: ['Hi-vis vest', 'Safety boots', 'Safety glasses (for drilling/cutting)', 'Hearing protection (for drilling)'],
    emergencyAssemblyPoint: 'Foster Street footpath, opposite site entrance',
    nearestHospital: 'St Vincent\'s Hospital — 390 Victoria St, Darlinghurst (5 min)',
    accessInstructions: 'Building lobby on Foster St. Security desk will issue contractor passes. Level 2 via goods lift (key from building manager).',
  },
]
