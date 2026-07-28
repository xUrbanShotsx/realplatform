// ── Healthcare mock data ─────────────────────────────────────────────────────

export const hcFacility = {
  name: 'Briesa Healthcare',
  tradingAs: 'Briesa Health Services',
  type: 'Private Hospital & Day Surgery',
  accreditationBody: 'ACHS',
  accreditationNo: 'ACC-2024-08741',
  state: 'NSW',
  complianceScore: 84,
  auditReadiness: 79,
  areas: [
    { name: 'AHPRA / Credentialling',   score: 91 },
    { name: 'Infection Control',        score: 88 },
    { name: 'Clinical Governance',      score: 78 },
    { name: 'Medication Management',    score: 82 },
    { name: 'NSQHS Accreditation',      score: 75 },
    { name: 'Privacy & Data Security',  score: 87 },
    { name: 'WHS Compliance',           score: 90 },
    { name: 'Mandatory Training',       score: 71 },
  ],
}

// ── Practitioners ─────────────────────────────────────────────────────────────
export type AHPRAStatus = 'Current' | 'Expiring Soon' | 'Expired' | 'Suspended' | 'Provisional'
export interface Practitioner {
  id: string
  name: string
  role: string
  profession: string
  ahpraNo: string
  ahpraStatus: AHPRAStatus
  registrationExpiry: string
  workingWithChildrenCheck: boolean
  wwccExpiry: string
  credentialledFor: string[]
  indemnityInsurer: string
  indemnityExpiry: string
  vaccineCompliant: boolean
  mandatoryTrainingPct: number
  department: string
}

export const practitioners: Practitioner[] = [
  {
    id: 'PR001', name: 'Dr. Sarah Okonkwo', role: 'Senior Consultant',
    profession: 'Medical Practitioner', ahpraNo: 'MED0001234567',
    ahpraStatus: 'Current', registrationExpiry: '2025-09-30',
    workingWithChildrenCheck: true, wwccExpiry: '2027-03-15',
    credentialledFor: ['General Surgery', 'Laparoscopic Surgery', 'Emergency'],
    indemnityInsurer: 'MDA National', indemnityExpiry: '2025-06-30',
    vaccineCompliant: true, mandatoryTrainingPct: 88, department: 'Surgery',
  },
  {
    id: 'PR002', name: 'Dr. James Patel', role: 'Anaesthetist',
    profession: 'Medical Practitioner', ahpraNo: 'MED0009876543',
    ahpraStatus: 'Current', registrationExpiry: '2025-09-30',
    workingWithChildrenCheck: true, wwccExpiry: '2026-11-20',
    credentialledFor: ['General Anaesthesia', 'Regional Anaesthesia', 'ICU'],
    indemnityInsurer: 'Avant', indemnityExpiry: '2025-09-30',
    vaccineCompliant: true, mandatoryTrainingPct: 100, department: 'Anaesthetics',
  },
  {
    id: 'PR003', name: 'Nurse Lisa Tran', role: 'Clinical Nurse Specialist',
    profession: 'Nursing', ahpraNo: 'NMW0001122334',
    ahpraStatus: 'Current', registrationExpiry: '2025-05-31',
    workingWithChildrenCheck: true, wwccExpiry: '2028-01-10',
    credentialledFor: ['IV Therapy', 'Wound Management', 'Peri-operative Care'],
    indemnityInsurer: 'Guild Insurance', indemnityExpiry: '2025-12-31',
    vaccineCompliant: true, mandatoryTrainingPct: 75, department: 'Surgical Ward',
  },
  {
    id: 'PR004', name: 'Dr. Michael Byrne', role: 'Emergency Physician',
    profession: 'Medical Practitioner', ahpraNo: 'MED0005566778',
    ahpraStatus: 'Expiring Soon', registrationExpiry: '2025-07-31',
    workingWithChildrenCheck: true, wwccExpiry: '2025-08-01',
    credentialledFor: ['Emergency Medicine', 'Trauma', 'Resuscitation'],
    indemnityInsurer: 'Avant', indemnityExpiry: '2025-07-31',
    vaccineCompliant: false, mandatoryTrainingPct: 60, department: 'Emergency',
  },
  {
    id: 'PR005', name: 'Rachel Kim', role: 'Physiotherapist',
    profession: 'Physiotherapy', ahpraNo: 'PHY0008899001',
    ahpraStatus: 'Current', registrationExpiry: '2025-11-30',
    workingWithChildrenCheck: true, wwccExpiry: '2026-06-15',
    credentialledFor: ['Post-surgical Rehabilitation', 'Musculoskeletal'],
    indemnityInsurer: 'APA Insurance', indemnityExpiry: '2025-12-31',
    vaccineCompliant: true, mandatoryTrainingPct: 95, department: 'Allied Health',
  },
  {
    id: 'PR006', name: 'Nurse David Chen', role: 'Infection Control Nurse',
    profession: 'Nursing', ahpraNo: 'NMW0003344556',
    ahpraStatus: 'Current', registrationExpiry: '2026-05-31',
    workingWithChildrenCheck: false, wwccExpiry: '–',
    credentialledFor: ['Infection Control', 'Sterilisation', 'Surveillance'],
    indemnityInsurer: 'Guild Insurance', indemnityExpiry: '2025-12-31',
    vaccineCompliant: true, mandatoryTrainingPct: 100, department: 'IPC',
  },
  {
    id: 'PR007', name: 'Dr. Angela Moss', role: 'Psychiatrist',
    profession: 'Medical Practitioner', ahpraNo: 'MED0007788990',
    ahpraStatus: 'Suspended', registrationExpiry: '2024-09-30',
    workingWithChildrenCheck: false, wwccExpiry: '–',
    credentialledFor: [],
    indemnityInsurer: '–', indemnityExpiry: '–',
    vaccineCompliant: false, mandatoryTrainingPct: 0, department: 'Psychiatry',
  },
]

// ── Clinical Incidents ────────────────────────────────────────────────────────
export type IncidentSeverity = 'Sentinel' | 'Serious' | 'Moderate' | 'Minor' | 'Near Miss'
export type IncidentStatus   = 'Open' | 'Under Investigation' | 'Closed' | 'Escalated'
export interface ClinicalIncident {
  id: string
  date: string
  title: string
  category: string
  severity: IncidentSeverity
  status: IncidentStatus
  department: string
  reportedBy: string
  rootCauseCompleted: boolean
  correctiveActionDue: string
  notifiedToAHPRA: boolean
  notifiedToCEEC: boolean
}

export const clinicalIncidents: ClinicalIncident[] = [
  {
    id: 'INC001', date: '2025-06-10', title: 'Medication Administration Error — Wrong Dose',
    category: 'Medication', severity: 'Serious', status: 'Under Investigation',
    department: 'Surgical Ward', reportedBy: 'Nurse Lisa Tran',
    rootCauseCompleted: false, correctiveActionDue: '2025-06-24',
    notifiedToAHPRA: false, notifiedToCEEC: true,
  },
  {
    id: 'INC002', date: '2025-06-08', title: 'Patient Fall — Unassisted',
    category: 'Patient Fall', severity: 'Moderate', status: 'Open',
    department: 'Medical Ward', reportedBy: 'David Chen',
    rootCauseCompleted: false, correctiveActionDue: '2025-06-22',
    notifiedToAHPRA: false, notifiedToCEEC: false,
  },
  {
    id: 'INC003', date: '2025-06-01', title: 'Surgical Site Infection — Post-op',
    category: 'Infection', severity: 'Serious', status: 'Under Investigation',
    department: 'Surgery', reportedBy: 'Dr. Sarah Okonkwo',
    rootCauseCompleted: true, correctiveActionDue: '2025-06-15',
    notifiedToAHPRA: false, notifiedToCEEC: true,
  },
  {
    id: 'INC004', date: '2025-05-28', title: 'Wrong Patient Procedure (Near Miss)',
    category: 'Patient ID', severity: 'Near Miss', status: 'Closed',
    department: 'Operating Theatre', reportedBy: 'Dr. James Patel',
    rootCauseCompleted: true, correctiveActionDue: '2025-06-11',
    notifiedToAHPRA: false, notifiedToCEEC: false,
  },
  {
    id: 'INC005', date: '2025-05-15', title: 'Unexpected Patient Death — ICU',
    category: 'Adverse Event', severity: 'Sentinel', status: 'Escalated',
    department: 'ICU', reportedBy: 'Dr. James Patel',
    rootCauseCompleted: false, correctiveActionDue: '2025-06-15',
    notifiedToAHPRA: true, notifiedToCEEC: true,
  },
  {
    id: 'INC006', date: '2025-06-12', title: 'Needlestick Injury — Theatre Staff',
    category: 'WHS', severity: 'Minor', status: 'Open',
    department: 'Operating Theatre', reportedBy: 'Nurse Lisa Tran',
    rootCauseCompleted: false, correctiveActionDue: '2025-06-19',
    notifiedToAHPRA: false, notifiedToCEEC: false,
  },
]

// ── Infection Control ─────────────────────────────────────────────────────────
export interface InfectionMetric {
  label: string
  value: number
  unit: string
  target: number
  higherIsBetter: boolean
  trend: 'up' | 'down' | 'stable'
}

export const infectionMetrics: InfectionMetric[] = [
  { label: 'Hand Hygiene Compliance', value: 87, unit: '%',   target: 90,  higherIsBetter: true,  trend: 'up'    },
  { label: 'HAI Rate (per 1000 BD)',  value: 2.1, unit: '/1k',target: 2.0, higherIsBetter: false, trend: 'down'  },
  { label: 'MRSA Bacteraemia',        value: 0,   unit: 'cases',target: 0, higherIsBetter: false, trend: 'stable'},
  { label: 'SSI Rate',               value: 1.4, unit: '%',   target: 1.0, higherIsBetter: false, trend: 'down'  },
  { label: 'C. diff Rate',           value: 0.8, unit: '/1k', target: 1.0, higherIsBetter: false, trend: 'down'  },
  { label: 'Vaccination Coverage',   value: 92,  unit: '%',   target: 95,  higherIsBetter: true,  trend: 'up'    },
]

export interface VaccinationRecord {
  id: string
  name: string
  role: string
  influenza: boolean
  covid19: boolean
  hepatitisB: boolean
  mmr: boolean
  varicella: boolean
  pertussis: boolean
  compliant: boolean
}

export const vaccinationRecords: VaccinationRecord[] = [
  { id: 'V001', name: 'Dr. Sarah Okonkwo', role: 'Consultant', influenza: true, covid19: true, hepatitisB: true, mmr: true, varicella: true, pertussis: true, compliant: true },
  { id: 'V002', name: 'Dr. James Patel',   role: 'Anaesthetist', influenza: true, covid19: true, hepatitisB: true, mmr: true, varicella: true, pertussis: true, compliant: true },
  { id: 'V003', name: 'Nurse Lisa Tran',   role: 'CNS', influenza: true, covid19: true, hepatitisB: true, mmr: false, varicella: true, pertussis: true, compliant: false },
  { id: 'V004', name: 'Dr. Michael Byrne', role: 'ED Physician', influenza: false, covid19: true, hepatitisB: true, mmr: true, varicella: false, pertussis: false, compliant: false },
  { id: 'V005', name: 'Rachel Kim',        role: 'Physio', influenza: true, covid19: true, hepatitisB: true, mmr: true, varicella: true, pertussis: true, compliant: true },
  { id: 'V006', name: 'David Chen',        role: 'IPC Nurse', influenza: true, covid19: true, hepatitisB: true, mmr: true, varicella: true, pertussis: true, compliant: true },
]

// ── NSQHS Accreditation ───────────────────────────────────────────────────────
export interface NSQHSStandard {
  id: string
  number: number
  title: string
  score: number
  lastAudit: string
  nextAudit: string
  criticalActions: number
  openActions: number
  status: 'Met' | 'Not Met' | 'Partial' | 'Not Assessed'
}

export const nsqhsStandards: NSQHSStandard[] = [
  { id: 'NS01', number: 1, title: 'Clinical Governance',              score: 78, lastAudit: '2024-08-15', nextAudit: '2026-08-15', criticalActions: 2, openActions: 5, status: 'Partial'      },
  { id: 'NS02', number: 2, title: 'Partnering with Consumers',        score: 82, lastAudit: '2024-08-15', nextAudit: '2026-08-15', criticalActions: 0, openActions: 3, status: 'Partial'      },
  { id: 'NS03', number: 3, title: 'Preventing & Controlling Infection',score: 91, lastAudit: '2024-08-15', nextAudit: '2026-08-15', criticalActions: 0, openActions: 1, status: 'Met'         },
  { id: 'NS04', number: 4, title: 'Medication Safety',                 score: 74, lastAudit: '2024-08-15', nextAudit: '2026-08-15', criticalActions: 3, openActions: 7, status: 'Partial'      },
  { id: 'NS05', number: 5, title: 'Comprehensive Care',               score: 80, lastAudit: '2024-08-15', nextAudit: '2026-08-15', criticalActions: 1, openActions: 4, status: 'Partial'      },
  { id: 'NS06', number: 6, title: 'Communicating for Safety',         score: 88, lastAudit: '2024-08-15', nextAudit: '2026-08-15', criticalActions: 0, openActions: 2, status: 'Met'         },
  { id: 'NS07', number: 7, title: 'Blood Management',                  score: 95, lastAudit: '2024-08-15', nextAudit: '2026-08-15', criticalActions: 0, openActions: 0, status: 'Met'         },
  { id: 'NS08', number: 8, title: 'Recognising & Responding to Deterioration', score: 69, lastAudit: '2024-08-15', nextAudit: '2026-08-15', criticalActions: 4, openActions: 9, status: 'Not Met' },
]

// ── Mandatory Training ────────────────────────────────────────────────────────
export interface TrainingModule {
  id: string
  title: string
  category: string
  frequencyMonths: number
  completedCount: number
  totalStaff: number
  overdueCount: number
  expiringCount: number
}

export const trainingModules: TrainingModule[] = [
  { id: 'TM01', title: 'Basic Life Support (BLS)',           category: 'Clinical', frequencyMonths: 12, completedCount: 42, totalStaff: 48, overdueCount: 4, expiringCount: 6 },
  { id: 'TM02', title: 'Fire Safety & Evacuation',           category: 'Safety',   frequencyMonths: 12, completedCount: 45, totalStaff: 48, overdueCount: 3, expiringCount: 2 },
  { id: 'TM03', title: 'Manual Handling',                    category: 'Safety',   frequencyMonths: 24, completedCount: 38, totalStaff: 48, overdueCount: 5, expiringCount: 3 },
  { id: 'TM04', title: 'Infection Control & Hand Hygiene',   category: 'Clinical', frequencyMonths: 12, completedCount: 44, totalStaff: 48, overdueCount: 2, expiringCount: 4 },
  { id: 'TM05', title: 'Medication Safety',                  category: 'Clinical', frequencyMonths: 12, completedCount: 31, totalStaff: 36, overdueCount: 7, expiringCount: 2 },
  { id: 'TM06', title: 'Privacy & Confidentiality',          category: 'Compliance',frequencyMonths: 24, completedCount: 40, totalStaff: 48, overdueCount: 6, expiringCount: 1 },
  { id: 'TM07', title: 'Recognising Deteriorating Patient',  category: 'Clinical', frequencyMonths: 12, completedCount: 28, totalStaff: 36, overdueCount: 9, expiringCount: 3 },
  { id: 'TM08', title: 'WHS & Incident Reporting',           category: 'Safety',   frequencyMonths: 12, completedCount: 43, totalStaff: 48, overdueCount: 3, expiringCount: 2 },
  { id: 'TM09', title: 'Child Safety & Mandatory Reporting', category: 'Compliance',frequencyMonths: 24, completedCount: 35, totalStaff: 48, overdueCount: 8, expiringCount: 0 },
  { id: 'TM10', title: 'Mental Health First Aid',            category: 'Clinical', frequencyMonths: 36, completedCount: 20, totalStaff: 48, overdueCount: 12, expiringCount: 2 },
]

// ── Medication Management ─────────────────────────────────────────────────────
export interface MedicationIncident {
  id: string
  date: string
  type: string
  drug: string
  severity: string
  outcome: string
  department: string
  status: 'Open' | 'Reviewed' | 'Closed'
}

export const medicationIncidents: MedicationIncident[] = [
  { id: 'MED001', date: '2025-06-10', type: 'Wrong Dose',       drug: 'Morphine 10mg IV',   severity: 'Serious', outcome: 'Patient monitored, no harm',    department: 'Surgical Ward', status: 'Open'     },
  { id: 'MED002', date: '2025-06-05', type: 'Omission',         drug: 'Metoprolol 50mg',    severity: 'Moderate',outcome: 'Dose administered late',         department: 'Cardiac',       status: 'Reviewed' },
  { id: 'MED003', date: '2025-05-28', type: 'Wrong Drug',       drug: 'Metformin / Lantus', severity: 'Serious', outcome: 'Hypoglycaemia – treated',        department: 'Medical Ward',  status: 'Closed'   },
  { id: 'MED004', date: '2025-05-20', type: 'Near Miss',        drug: 'Warfarin – wrong pt',severity: 'Near Miss',outcome: 'Caught at bedside check',       department: 'Cardiology',    status: 'Closed'   },
  { id: 'MED005', date: '2025-06-11', type: 'Administration',   drug: 'Fentanyl patch',     severity: 'Minor',   outcome: 'Delay in application',          department: 'Palliative',    status: 'Open'     },
]

export interface S8Register {
  id: string
  drug: string
  schedule: string
  currentBalance: number
  unit: string
  lastCount: string
  lastCountBy: string
  discrepancy: boolean
  location: string
}

export const s8Register: S8Register[] = [
  { id: 'S8001', drug: 'Morphine Sulfate 10mg/ml', schedule: 'S8', currentBalance: 24, unit: 'ampoules', lastCount: '2025-06-13', lastCountBy: 'Nurse Lisa Tran', discrepancy: false, location: 'Surgical Ward Drugs Safe' },
  { id: 'S8002', drug: 'Fentanyl 100mcg/2ml',      schedule: 'S8', currentBalance: 18, unit: 'ampoules', lastCount: '2025-06-13', lastCountBy: 'Dr. James Patel',  discrepancy: false, location: 'Anaesthetics Trolley'     },
  { id: 'S8003', drug: 'Oxycodone 5mg tablets',    schedule: 'S8', currentBalance: 42, unit: 'tablets',  lastCount: '2025-06-12', lastCountBy: 'Nurse Lisa Tran', discrepancy: true,  location: 'Surgical Ward Drugs Safe' },
  { id: 'S8004', drug: 'Midazolam 5mg/ml',         schedule: 'S8', currentBalance: 10, unit: 'ampoules', lastCount: '2025-06-13', lastCountBy: 'Dr. James Patel',  discrepancy: false, location: 'ICU Drugs Safe'           },
  { id: 'S8005', drug: 'Ketamine 200mg/10ml',       schedule: 'S8', currentBalance: 6,  unit: 'vials',    lastCount: '2025-06-11', lastCountBy: 'Dr. James Patel',  discrepancy: false, location: 'Anaesthetics Trolley'     },
]

// ── Equipment / Biomedical ────────────────────────────────────────────────────
export interface Equipment {
  id: string
  name: string
  assetNo: string
  department: string
  lastServiced: string
  nextService: string
  calibrationDue: string | null
  status: 'Operational' | 'Due Service' | 'Overdue' | 'Out of Service'
  isBiomedical: boolean
}

export const equipment: Equipment[] = [
  { id: 'EQ001', name: 'Anaesthetic Machine — Datex GE',     assetNo: 'BM-0021', department: 'Operating Theatre',  lastServiced: '2025-01-15', nextService: '2025-07-15', calibrationDue: '2025-08-01', status: 'Operational',  isBiomedical: true  },
  { id: 'EQ002', name: 'Ventilator — Maquet SERVO-U',        assetNo: 'BM-0034', department: 'ICU',                lastServiced: '2025-03-01', nextService: '2025-09-01', calibrationDue: '2025-09-01', status: 'Operational',  isBiomedical: true  },
  { id: 'EQ003', name: 'Defibrillator — Zoll X Series',      assetNo: 'BM-0012', department: 'Emergency',          lastServiced: '2025-02-20', nextService: '2025-08-20', calibrationDue: '2025-07-20', status: 'Due Service',  isBiomedical: true  },
  { id: 'EQ004', name: 'Patient Monitor — Philips MX750',    assetNo: 'BM-0044', department: 'Surgical Ward',       lastServiced: '2024-12-10', nextService: '2025-06-10', calibrationDue: null,         status: 'Overdue',      isBiomedical: true  },
  { id: 'EQ005', name: 'Infusion Pump — BD Alaris',          assetNo: 'BM-0061', department: 'Medical Ward',        lastServiced: '2025-04-01', nextService: '2025-10-01', calibrationDue: null,         status: 'Operational',  isBiomedical: true  },
  { id: 'EQ006', name: 'Autoclave — Getinge',               assetNo: 'BM-0078', department: 'CSSD',               lastServiced: '2025-05-01', nextService: '2025-11-01', calibrationDue: '2025-07-01', status: 'Operational',  isBiomedical: false },
  { id: 'EQ007', name: 'Ultrasound — GE Logiq E10',         assetNo: 'BM-0089', department: 'Radiology',           lastServiced: '2024-11-15', nextService: '2025-05-15', calibrationDue: '2025-06-15', status: 'Overdue',      isBiomedical: true  },
  { id: 'EQ008', name: 'Hoist — Arjo Maxi 500',             assetNo: 'EQ-0102', department: 'Allied Health',       lastServiced: '2025-03-15', nextService: '2025-09-15', calibrationDue: null,         status: 'Operational',  isBiomedical: false },
]

// ── WHS ───────────────────────────────────────────────────────────────────────
export interface WHSItem {
  id: string
  type: 'Hazard' | 'Risk Assessment' | 'Corrective Action' | 'Inspection'
  title: string
  area: string
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Open' | 'In Progress' | 'Closed'
  dueDate: string
  assignedTo: string
}

export const whsItems: WHSItem[] = [
  { id: 'WHS001', type: 'Hazard',            title: 'Wet floor — Ward 3 bathroom',             area: 'Ward 3',         riskLevel: 'High',     status: 'Closed',      dueDate: '2025-06-10', assignedTo: 'Facilities'    },
  { id: 'WHS002', type: 'Risk Assessment',   title: 'Manual handling — patient transfers',      area: 'Medical Ward',   riskLevel: 'High',     status: 'In Progress', dueDate: '2025-06-30', assignedTo: 'Rachel Kim'    },
  { id: 'WHS003', type: 'Corrective Action', title: 'Sharps disposal — inadequate bins',        area: 'ED',             riskLevel: 'Critical', status: 'Open',        dueDate: '2025-06-15', assignedTo: 'David Chen'    },
  { id: 'WHS004', type: 'Inspection',        title: 'Quarterly facility safety inspection',     area: 'Whole Facility', riskLevel: 'Medium',   status: 'In Progress', dueDate: '2025-06-28', assignedTo: 'WHS Officer'   },
  { id: 'WHS005', type: 'Risk Assessment',   title: 'Workplace violence — ED protocols',        area: 'Emergency',      riskLevel: 'High',     status: 'Open',        dueDate: '2025-07-01', assignedTo: 'Dr. M Byrne'   },
  { id: 'WHS006', type: 'Corrective Action', title: 'Needlestick follow-up — post exposure',   area: 'Operating Theatre',riskLevel: 'High',    status: 'Open',        dueDate: '2025-06-20', assignedTo: 'Occupational Physician' },
]

// ── Activity feed ─────────────────────────────────────────────────────────────
export const hcActivityFeed = [
  { id: 1, type: 'incident', text: 'Incident reported: Needlestick injury — Operating Theatre', time: '1 hr ago',  user: 'Nurse Lisa Tran'   },
  { id: 2, type: 'ahpra',   text: 'AHPRA registration renewed: Rachel Kim (Physiotherapy)',     time: '3 hrs ago', user: 'System'            },
  { id: 3, type: 'drug',    text: 'S8 discrepancy flagged: Oxycodone 5mg — Surgical Ward',     time: '4 hrs ago', user: 'David Chen'        },
  { id: 4, type: 'training',text: 'Training completed: BLS — 3 staff (Cardiac ward)',           time: '5 hrs ago', user: 'System'            },
  { id: 5, type: 'ipc',     text: 'Hand hygiene audit completed — ICU: 91% compliance',        time: '6 hrs ago', user: 'David Chen'        },
  { id: 6, type: 'whs',     text: 'Corrective action closed: Wet floor hazard — Ward 3',       time: '1 day ago', user: 'Facilities'        },
  { id: 7, type: 'nsqhs',   text: 'NSQHS Standard 7 evidence submitted (Blood Management)',    time: '2 days ago',user: 'Quality Manager'   },
  { id: 8, type: 'privacy', text: 'Privacy breach notification submitted to OAIC',              time: '3 days ago',user: 'Privacy Officer'   },
]

// ── Smart Alerts ──────────────────────────────────────────────────────────────
export const hcAlerts = [
  {
    id: 1, severity: 'critical' as const,
    title: 'Sentinel Event — Mandatory Notification',
    message: 'Unexpected patient death (INC005) requires mandatory notification to ACSQHC and NSW Health within 14 days. Root cause analysis not started.',
    action: 'Open Incident', link: '/healthcare/incidents',
  },
  {
    id: 2, severity: 'critical' as const,
    title: 'Suspended Practitioner Still Rostered',
    message: 'Dr. Angela Moss (AHPRA Suspended) appears on the psychiatry roster for next week. Immediate action required — notify department head.',
    action: 'View Practitioners', link: '/healthcare/practitioners',
  },
  {
    id: 3, severity: 'critical' as const,
    title: 'S8 Drug Discrepancy — Oxycodone',
    message: 'A count discrepancy has been recorded for Oxycodone 5mg in the Surgical Ward safe. Requires dual-nurse recount and incident report per TGA regulations.',
    action: 'View S8 Register', link: '/healthcare/medications',
  },
  {
    id: 4, severity: 'warning' as const,
    title: 'NSQHS Standard 8 — Not Met',
    message: '9 open corrective actions for Recognising & Responding to Patient Deterioration. Re-accreditation visit due Aug 2026.',
    action: 'View NSQHS', link: '/healthcare/accreditation',
  },
  {
    id: 5, severity: 'warning' as const,
    title: 'Dr. Michael Byrne — AHPRA Expiring',
    message: 'AHPRA registration expires 31 Jul 2025 (48 days). Indemnity insurance also expires same date. Notify practitioner immediately.',
    action: 'View Practitioners', link: '/healthcare/practitioners',
  },
  {
    id: 6, severity: 'warning' as const,
    title: 'Mandatory Training Overdue',
    message: '12 staff are overdue Mental Health First Aid training. 9 overdue Recognising Deteriorating Patient. Board-reportable threshold (>15%) approaching.',
    action: 'View Training', link: '/healthcare/training',
  },
]

// ── Privacy / Data Breaches ───────────────────────────────────────────────────
export interface PrivacyBreach {
  id: string
  date: string
  title: string
  type: string
  severity: 'Eligible NDB' | 'Internal' | 'Minor'
  status: 'Notified OAIC' | 'Under Assessment' | 'Closed'
  affectedPatients: number
  notificationDate: string | null
}

export const privacyBreaches: PrivacyBreach[] = [
  {
    id: 'PB001', date: '2025-06-09', title: 'Misdirected patient records — fax',
    type: 'Accidental Disclosure', severity: 'Internal',
    status: 'Closed', affectedPatients: 1, notificationDate: null,
  },
  {
    id: 'PB002', date: '2025-05-20', title: 'Ransomware attempt — EMR system',
    type: 'Cyber Incident', severity: 'Eligible NDB',
    status: 'Notified OAIC', affectedPatients: 340, notificationDate: '2025-05-25',
  },
  {
    id: 'PB003', date: '2025-04-14', title: 'Staff accessed records without authorisation',
    type: 'Unauthorised Access', severity: 'Eligible NDB',
    status: 'Under Assessment', affectedPatients: 12, notificationDate: null,
  },
]
