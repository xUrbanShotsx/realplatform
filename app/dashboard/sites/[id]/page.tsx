'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { sites } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Drawer, Field, TextInput, TextArea, Select, RadioGroup, SubmitRow } from '@/components/ui/Drawer'
import {
  ArrowLeft, MapPin, Users, AlertTriangle, Shield, CheckCircle2, XCircle,
  ClipboardCheck, FileText, Settings2, BookOpen, ChevronRight, Plus,
  Clock, User, Wrench, Camera, CloudSun, Wind, Thermometer, Droplets,
  FileSignature, KeyRound, HardHat, Zap, Phone, Mail, Star, Circle,
  BarChart2, CalendarDays, MessageSquare, QrCode, Download, Eye,
  CheckSquare, Square, TrendingUp, Activity, FlaskConical, TriangleAlert,
  PackageOpen, Info,
} from 'lucide-react'

// ─── Site-specific mock data ──────────────────────────────────────────────────

const SITE_PERSONNEL: Record<string, { id: string; name: string; initials: string; role: string; company: string; inducted: boolean; onSite: boolean; signInTime?: string; licences: string[] }[]> = {
  '1': [
    { id: 'p1', name: 'James Chen', initials: 'JC', role: 'Site Supervisor', company: 'Acme Construction', inducted: true, onSite: true, signInTime: '07:02', licences: ['WHS Supervisor', 'Working at Heights'] },
    { id: 'p2', name: 'Tom Baker', initials: 'TB', role: 'Labourer', company: 'Acme Construction', inducted: false, onSite: true, signInTime: '07:18', licences: [] },
    { id: 'p3', name: 'Dave Harris', initials: 'DH', role: 'Structural Worker', company: 'BuildRight Pty Ltd', inducted: true, onSite: true, signInTime: '07:30', licences: ['Working at Heights', 'Rigging'] },
    { id: 'p4', name: 'Anna Kowalski', initials: 'AK', role: 'Electrician', company: 'SafeElect Services', inducted: true, onSite: true, signInTime: '08:00', licences: ['Electrician Licence A-Grade'] },
    { id: 'p5', name: 'Ben Moore', initials: 'BM', role: 'Scaffold Erector', company: 'FastAccess Scaffolding', inducted: true, onSite: false, licences: ['Scaffolding High Risk'] },
    { id: 'p6', name: 'Maria Garcia', initials: 'MG', role: 'Cleaner', company: 'CleanSite Services', inducted: true, onSite: false, licences: [] },
  ],
  '2': [
    { id: 'p1', name: 'Marcus Torres', initials: 'MT', role: 'Project Manager', company: 'Acme Construction', inducted: true, onSite: true, signInTime: '06:55', licences: ['WHS Supervisor', 'Dogging'] },
    { id: 'p2', name: 'Nick Turner', initials: 'NT', role: 'Plumber', company: 'ProPlumb Co.', inducted: true, onSite: true, signInTime: '07:10', licences: ['Plumbing Licence'] },
    { id: 'p3', name: 'Paul Zhang', initials: 'PZ', role: 'Mechanical Fitter', company: 'TechMech Engineering', inducted: true, onSite: true, signInTime: '07:15', licences: ['Working at Heights'] },
    { id: 'p4', name: 'Steve Hill', initials: 'SH', role: 'Civil Worker', company: 'GroundWorks Excavation', inducted: false, onSite: true, signInTime: '07:45', licences: [] },
  ],
  '3': [
    { id: 'p1', name: 'Raj Patel', initials: 'RP', role: 'WHS Officer', company: 'Acme Construction', inducted: true, onSite: true, signInTime: '07:00', licences: ['WHS Coordinator', 'First Aid'] },
    { id: 'p2', name: 'Rachel Kim', initials: 'RK', role: 'HVAC Technician', company: 'AirTech HVAC', inducted: true, onSite: true, signInTime: '07:30', licences: ['Refrigeration Licence'] },
    { id: 'p3', name: 'Lisa Wong', initials: 'LW', role: 'Emergency Warden', company: 'Acme Construction', inducted: true, onSite: false, licences: ['First Aid', 'Emergency Warden'] },
  ],
  '4': [
    { id: 'p1', name: 'Chris Davis', initials: 'CD', role: 'Electrician', company: 'Acme Construction', inducted: true, onSite: true, signInTime: '08:00', licences: ['Electrician Licence'] },
    { id: 'p2', name: 'Tom Baker', initials: 'TB', role: 'Forklift Operator', company: 'Acme Construction', inducted: false, onSite: true, signInTime: '08:15', licences: ['Forklift Licence LF'] },
  ],
}

const SITE_PERMITS: Record<string, { id: string; type: string; number: string; issuedTo: string; issuedBy: string; startDate: string; expiryDate: string; status: 'active' | 'expired' | 'pending' }[]> = {
  '1': [
    { id: 'ptw1', type: 'Hot Work Permit', number: 'PTW-001', issuedTo: 'James Chen', issuedBy: 'Sarah Mitchell', startDate: '2025-05-05', expiryDate: '2025-05-05', status: 'active' },
    { id: 'ptw2', type: 'Working at Heights', number: 'PTW-004', issuedTo: 'Dave Harris', issuedBy: 'James Chen', startDate: '2025-05-05', expiryDate: '2025-05-06', status: 'active' },
  ],
  '2': [
    { id: 'ptw1', type: 'Excavation Permit', number: 'PTW-003', issuedTo: 'Marcus Torres', issuedBy: 'Sarah Mitchell', startDate: '2025-04-28', expiryDate: '2025-05-10', status: 'active' },
    { id: 'ptw2', type: 'Confined Space Entry', number: 'PTW-005', issuedTo: 'Nick Turner', issuedBy: 'Marcus Torres', startDate: '2025-05-01', expiryDate: '2025-05-08', status: 'active' },
    { id: 'ptw3', type: 'Electrical Isolation', number: 'PTW-006', issuedTo: 'Paul Zhang', issuedBy: 'Sarah Mitchell', startDate: '2025-04-20', expiryDate: '2025-04-25', status: 'expired' },
    { id: 'ptw4', type: 'Crane Operation', number: 'PTW-007', issuedTo: 'Marcus Torres', issuedBy: 'Sarah Mitchell', startDate: '2025-05-06', expiryDate: '2025-05-07', status: 'pending' },
  ],
  '3': [
    { id: 'ptw1', type: 'Hot Work Permit', number: 'PTW-008', issuedTo: 'Raj Patel', issuedBy: 'James Chen', startDate: '2025-05-05', expiryDate: '2025-05-05', status: 'active' },
  ],
  '4': [],
}

const SITE_DIARY: Record<string, { id: string; date: string; author: string; weather: string; temp: string; workers: number; notes: string; issues: string; photos: number }[]> = {
  '1': [
    { id: 'd1', date: '2025-05-05', author: 'James Chen', weather: 'Partly Cloudy', temp: '21°C', workers: 14, notes: 'Level 3 formwork completed ahead of schedule. Crane lifts went smoothly with no delays. Exclusion zones maintained throughout.', issues: 'Minor concrete blowout on column C4 — repaired same day.', photos: 6 },
    { id: 'd2', date: '2025-05-04', author: 'James Chen', weather: 'Sunny', temp: '23°C', workers: 12, notes: 'Reinforcement works continued on Level 3. All workers briefed on HAZ-003 at toolbox talk.', issues: 'None', photos: 3 },
    { id: 'd3', date: '2025-05-03', author: 'James Chen', weather: 'Overcast', temp: '18°C', workers: 10, notes: 'Fire safety inspection completed — minor findings addressed immediately.', issues: 'Blocked egress route on Level 2, cleared within 2 hours.', photos: 4 },
  ],
  '2': [
    { id: 'd1', date: '2025-05-05', author: 'Marcus Torres', weather: 'Sunny', temp: '24°C', workers: 22, notes: 'Excavation on eastern boundary completed. Concrete pour scheduled for tomorrow morning. SWMS reviewed with all workers.', issues: 'INC-002 logged — slip near site entry. Non-slip mats ordered.', photos: 8 },
    { id: 'd2', date: '2025-05-04', author: 'Marcus Torres', weather: 'Partly Cloudy', temp: '22°C', workers: 19, notes: 'Structural works on Levels 1–3 progressing well. Pre-cast panels installed on north elevation.', issues: 'None', photos: 5 },
  ],
  '3': [
    { id: 'd1', date: '2025-05-05', author: 'Raj Patel', weather: 'Sunny', temp: '22°C', workers: 8, notes: 'HVAC rough-in completed on ground floor. Retail fitout framing underway. All workers inducted and on site by 7am.', issues: 'None', photos: 2 },
  ],
  '4': [
    { id: 'd1', date: '2025-05-05', author: 'Chris Davis', weather: 'Overcast', temp: '19°C', workers: 6, notes: 'Forklift pre-start checks completed. Chemical storage audit conducted — all SDS up to date. Warehouse racking inspection scheduled for Friday.', issues: 'HAZ-005 raised — unguarded rotating machinery on compressor. Immediate action taken.', photos: 3 },
  ],
}

const SITE_DOCUMENTS: Record<string, { id: string; name: string; type: string; version: string; updated: string; fileType: 'pdf' | 'docx' | 'xlsx' }[]> = {
  '1': [
    { id: 'doc1', name: 'Site A WHSMP', type: 'Safety Plan', version: 'v2.1', updated: '2025-01-10', fileType: 'pdf' },
    { id: 'doc2', name: 'Emergency Response Plan', type: 'Procedure', version: 'v1.3', updated: '2025-02-05', fileType: 'pdf' },
    { id: 'doc3', name: 'Site A Induction Register', type: 'Register', version: 'v4.0', updated: '2025-05-01', fileType: 'xlsx' },
    { id: 'doc4', name: 'George St Drawings Rev D', type: 'Drawing', version: 'Rev D', updated: '2025-03-20', fileType: 'pdf' },
    { id: 'doc5', name: 'Site A Inspection Checklist', type: 'Form', version: 'v1.0', updated: '2025-04-15', fileType: 'docx' },
  ],
  '2': [
    { id: 'doc1', name: 'Site B WHSMP', type: 'Safety Plan', version: 'v1.2', updated: '2025-02-15', fileType: 'pdf' },
    { id: 'doc2', name: 'Excavation Safe Work Plan', type: 'Procedure', version: 'v1.0', updated: '2025-04-22', fileType: 'pdf' },
    { id: 'doc3', name: 'Parramatta Induction Register', type: 'Register', version: 'v2.1', updated: '2025-04-30', fileType: 'xlsx' },
  ],
  '3': [
    { id: 'doc1', name: 'Site C WHSMP', type: 'Safety Plan', version: 'v1.0', updated: '2025-03-01', fileType: 'pdf' },
    { id: 'doc2', name: 'Retail Fitout Specification', type: 'Drawing', version: 'v2.0', updated: '2025-03-10', fileType: 'pdf' },
  ],
  '4': [
    { id: 'doc1', name: 'Warehouse Operations Manual', type: 'Procedure', version: 'v3.0', updated: '2024-06-01', fileType: 'pdf' },
    { id: 'doc2', name: 'Chemical Register – Warehouse', type: 'Register', version: 'v5.2', updated: '2025-04-20', fileType: 'xlsx' },
    { id: 'doc3', name: 'Ryde Induction Register', type: 'Register', version: 'v1.5', updated: '2025-05-01', fileType: 'xlsx' },
  ],
}

const SITE_EQUIPMENT: Record<string, { id: string; assetId: string; name: string; category: string; preStartDone: boolean; score: number; nextService: string; status: 'active' | 'under-service' | 'decommissioned' }[]> = {
  '1': [
    { id: 'eq1', assetId: 'EQ-003', name: 'Elevated Work Platform 12m', category: 'EWP', preStartDone: true, score: 97, nextService: '2025-06-15', status: 'active' },
    { id: 'eq2', assetId: 'EQ-006', name: 'Compressor 185 CFM', category: 'Compressor', preStartDone: false, score: 0, nextService: '2025-05-20', status: 'active' },
  ],
  '2': [
    { id: 'eq1', assetId: 'EQ-004', name: 'Excavator CAT 320', category: 'Excavator', preStartDone: true, score: 96, nextService: '2025-07-01', status: 'active' },
    { id: 'eq2', assetId: 'EQ-007', name: 'Concrete Mixer 350L', category: 'Other', preStartDone: true, score: 94, nextService: '2025-06-01', status: 'active' },
    { id: 'eq3', assetId: 'EQ-008', name: 'Tower Crane Liebherr', category: 'Crane', preStartDone: false, score: 0, nextService: '2025-05-10', status: 'under-service' },
  ],
  '3': [
    { id: 'eq1', assetId: 'EQ-005', name: 'Scissor Lift 8m', category: 'EWP', preStartDone: true, score: 99, nextService: '2025-08-01', status: 'active' },
  ],
  '4': [
    { id: 'eq1', assetId: 'EQ-001', name: 'Toyota Forklift 2.5T', category: 'Forklift', preStartDone: true, score: 98, nextService: '2025-06-01', status: 'active' },
    { id: 'eq2', assetId: 'EQ-002', name: 'Generator 20kVA', category: 'Generator', preStartDone: false, score: 0, nextService: '2025-04-15', status: 'active' },
  ],
}

type SDSStatus = 'current' | 'expiring' | 'missing'

const SITE_SDS: Record<string, {
  id: string; name: string; unNumber: string; hazardClass: string; hazardColor: string
  location: string; quantity: string; supplier: string; sdsDate: string; sdsStatus: SDSStatus; emergency: string
}[]> = {
  '1': [
    { id: 'sds1', name: 'Diesel Fuel (EN590)',         unNumber: 'UN1202', hazardClass: 'Class 3 – Flammable Liquid',    hazardColor: '#f97316', location: 'Fuel Bay',          quantity: '200 L',  supplier: 'Caltex',            sdsDate: '2024-11-01', sdsStatus: 'current',   emergency: '1800 093 333' },
    { id: 'sds2', name: 'Hydraulic Oil 46',            unNumber: 'UN1270', hazardClass: 'Class 3 – Flammable Liquid',    hazardColor: '#f97316', location: 'Plant Shed',        quantity: '60 L',   supplier: 'Mobil',             sdsDate: '2024-06-15', sdsStatus: 'expiring',  emergency: '1800 093 333' },
    { id: 'sds3', name: 'Concrete Release Agent',      unNumber: 'UN1993', hazardClass: 'Class 3 – Flammable Liquid',    hazardColor: '#f97316', location: 'Storage Area B',    quantity: '20 L',   supplier: 'Bostik',            sdsDate: '2025-01-20', sdsStatus: 'current',   emergency: '131 126' },
    { id: 'sds4', name: 'Spray Paint – White',         unNumber: 'UN1950', hazardClass: 'Class 2.1 – Flammable Gas',     hazardColor: '#ef4444', location: 'Tool Store',        quantity: '12 cans',supplier: 'Dulux Industrial',  sdsDate: '2025-02-01', sdsStatus: 'current',   emergency: '131 126' },
    { id: 'sds5', name: 'Battery Acid (Sulphuric)',    unNumber: 'UN2796', hazardClass: 'Class 8 – Corrosive',           hazardColor: '#8b5cf6', location: 'Electrical Room',   quantity: '5 L',    supplier: 'GFS Chemicals',     sdsDate: '2023-09-10', sdsStatus: 'missing',   emergency: '1800 093 333' },
    { id: 'sds6', name: 'Welding Gas – Argon/CO₂',   unNumber: 'UN1956', hazardClass: 'Class 2.2 – Non-Flammable Gas', hazardColor: '#3b82f6', location: 'Welding Bay',       quantity: 'D-size', supplier: 'BOC Gas',           sdsDate: '2025-03-01', sdsStatus: 'current',   emergency: '1800 093 333' },
  ],
  '2': [
    { id: 'sds1', name: 'Diesel Fuel (EN590)',         unNumber: 'UN1202', hazardClass: 'Class 3 – Flammable Liquid',    hazardColor: '#f97316', location: 'Fuel Tank',         quantity: '500 L',  supplier: 'Caltex',            sdsDate: '2024-11-01', sdsStatus: 'current',   emergency: '1800 093 333' },
    { id: 'sds2', name: 'Excavator Hydraulic Fluid',   unNumber: 'UN1270', hazardClass: 'Class 3 – Flammable Liquid',    hazardColor: '#f97316', location: 'Equipment Store',   quantity: '80 L',   supplier: 'Caterpillar',        sdsDate: '2025-01-15', sdsStatus: 'current',   emergency: '1800 093 333' },
    { id: 'sds3', name: 'Concrete Curing Compound',   unNumber: 'UN1263', hazardClass: 'Class 3 – Flammable Liquid',    hazardColor: '#f97316', location: 'Storage Area A',    quantity: '40 L',   supplier: 'Parchem',           sdsDate: '2024-08-20', sdsStatus: 'expiring',  emergency: '131 126' },
    { id: 'sds4', name: 'Lime (Hydrated)',             unNumber: 'UN2812', hazardClass: 'Class 8 – Corrosive',           hazardColor: '#8b5cf6', location: 'Mixing Zone',       quantity: '25 kg',  supplier: 'Cockburn Cement',   sdsDate: '2025-02-10', sdsStatus: 'current',   emergency: '131 126' },
  ],
  '3': [
    { id: 'sds1', name: 'Spray Adhesive',              unNumber: 'UN1950', hazardClass: 'Class 2.1 – Flammable Gas',     hazardColor: '#ef4444', location: 'Fitout Store',      quantity: '8 cans', supplier: '3M Australia',      sdsDate: '2025-03-01', sdsStatus: 'current',   emergency: '131 126' },
    { id: 'sds2', name: 'Silicone Sealant',            unNumber: 'Non-DG', hazardClass: 'Non-Dangerous Goods',           hazardColor: '#22c55e', location: 'Fitout Store',      quantity: '24 tubes',supplier: 'Selleys',          sdsDate: '2025-01-01', sdsStatus: 'current',   emergency: '131 126' },
    { id: 'sds3', name: 'HVAC Refrigerant R-410A',    unNumber: 'UN3337', hazardClass: 'Class 2.2 – Non-Flammable Gas', hazardColor: '#3b82f6', location: 'HVAC Plant Room',  quantity: '10 kg',  supplier: 'AirTech HVAC',      sdsDate: '2024-07-10', sdsStatus: 'expiring',  emergency: '1800 093 333' },
  ],
  '4': [
    { id: 'sds1', name: 'Forklift Battery Acid',       unNumber: 'UN2796', hazardClass: 'Class 8 – Corrosive',           hazardColor: '#8b5cf6', location: 'Battery Bay',       quantity: '10 L',   supplier: 'Crown Equipment',   sdsDate: '2025-04-01', sdsStatus: 'current',   emergency: '1800 093 333' },
    { id: 'sds2', name: 'Diesel Fuel (EN590)',          unNumber: 'UN1202', hazardClass: 'Class 3 – Flammable Liquid',    hazardColor: '#f97316', location: 'Fuel Store',        quantity: '300 L',  supplier: 'Caltex',            sdsDate: '2024-11-01', sdsStatus: 'current',   emergency: '1800 093 333' },
    { id: 'sds3', name: 'Industrial Degreaser',        unNumber: 'UN1993', hazardClass: 'Class 3 – Flammable Liquid',    hazardColor: '#f97316', location: 'Maintenance Bay',   quantity: '20 L',   supplier: 'Chemtech',          sdsDate: '2025-02-15', sdsStatus: 'current',   emergency: '131 126' },
    { id: 'sds4', name: 'Paint Stripper (Methylene)',  unNumber: 'UN1593', hazardClass: 'Class 6.1 – Toxic',             hazardColor: '#dc2626', location: 'Hazmat Cabinet',    quantity: '5 L',    supplier: 'Dulux Industrial',  sdsDate: '2023-06-01', sdsStatus: 'missing',   emergency: '131 126' },
    { id: 'sds5', name: 'LPG (Forklift)',              unNumber: 'UN1075', hazardClass: 'Class 2.1 – Flammable Gas',     hazardColor: '#ef4444', location: 'External Cage',     quantity: '2 x 45kg',supplier: 'Elgas',            sdsDate: '2025-01-20', sdsStatus: 'current',   emergency: '1800 093 333' },
    { id: 'sds6', name: 'Rust Converter',              unNumber: 'Non-DG', hazardClass: 'Non-Dangerous Goods',           hazardColor: '#22c55e', location: 'Maintenance Bay',   quantity: '5 L',    supplier: 'Septone',           sdsDate: '2025-03-10', sdsStatus: 'current',   emergency: '131 126' },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  return s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444'
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-11 h-11 text-sm' : 'w-9 h-9 text-xs'
  return (
    <div className={`${cls} flex items-center justify-center font-bold flex-shrink-0`}
      style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
      {initials}
    </div>
  )
}

const PERMIT_STATUS = {
  active:  { label: 'Active',   bg: '#dcfce7', color: '#15803d' },
  expired: { label: 'Expired',  bg: '#fee2e2', color: '#dc2626' },
  pending: { label: 'Pending',  bg: '#fef3c7', color: '#b45309' },
}

const FILE_TYPE_COLOR = { pdf: '#ef4444', docx: '#3b82f6', xlsx: '#22c55e' }

type Tab = 'overview' | 'personnel' | 'safety' | 'inspections' | 'diary' | 'documents' | 'equipment' | 'sds'

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SiteDashboardPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const site = sites.find(s => s.id === id)

  const [tab, setTab] = useState<Tab>('overview')
  const [showDiaryDrawer, setShowDiaryDrawer] = useState(false)
  const [diaryForm, setDiaryForm] = useState({ notes: '', issues: '', weather: 'Sunny', workers: '' })
  const [savingDiary, setSavingDiary] = useState(false)
  const [savedDiary, setSavedDiary] = useState(false)
  const [showPermitDrawer, setShowPermitDrawer] = useState(false)
  const [permitForm, setPermitForm] = useState({ type: '', issuedTo: '', expiryDate: '' })
  const [savingPermit, setSavingPermit] = useState(false)
  const [savedPermit, setSavedPermit] = useState(false)

  if (!site) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Site not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm underline" style={{ color: 'var(--text-secondary)' }}>← Back to sites</button>
      </div>
    )
  }

  const personnel = SITE_PERSONNEL[id] ?? []
  const permits   = SITE_PERMITS[id]   ?? []
  const diary     = SITE_DIARY[id]     ?? []
  const docs      = SITE_DOCUMENTS[id] ?? []
  const equipment = SITE_EQUIPMENT[id] ?? []

  const onSiteNow     = personnel.filter(p => p.onSite)
  const notInducted   = personnel.filter(p => !p.inducted)
  const activePermits = permits.filter(p => p.status === 'active')
  const preStartDone  = equipment.filter(e => e.preStartDone).length
  const color = scoreColor(site.complianceScore)

  const sdsData    = SITE_SDS[id] ?? []
  const sdsMissing = sdsData.filter(s => s.sdsStatus === 'missing').length

  const TABS: { key: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'overview',    label: 'Overview',          icon: BarChart2 },
    { key: 'personnel',   label: 'Personnel',         icon: Users,        badge: notInducted.length || undefined },
    { key: 'safety',      label: 'Safety',            icon: Shield,       badge: site.openHazards || undefined },
    { key: 'inspections', label: 'Inspections',       icon: ClipboardCheck },
    { key: 'diary',       label: 'Site Diary',        icon: BookOpen },
    { key: 'documents',   label: 'Documents',         icon: FileText },
    { key: 'equipment',   label: 'Equipment',         icon: Settings2 },
    { key: 'sds',         label: 'SDS / Chemicals',   icon: FlaskConical, badge: sdsMissing || undefined },
  ]

  // ── Diary submit ──
  function submitDiary(e: React.FormEvent) {
    e.preventDefault()
    setSavingDiary(true)
    setTimeout(() => {
      setSavingDiary(false)
      setSavedDiary(true)
      setTimeout(() => { setSavedDiary(false); setShowDiaryDrawer(false); setDiaryForm({ notes: '', issues: '', weather: 'Sunny', workers: '' }) }, 1100)
    }, 700)
  }

  // ── Permit submit ──
  function submitPermit(e: React.FormEvent) {
    e.preventDefault()
    setSavingPermit(true)
    setTimeout(() => {
      setSavingPermit(false)
      setSavedPermit(true)
      setTimeout(() => { setSavedPermit(false); setShowPermitDrawer(false); setPermitForm({ type: '', issuedTo: '', expiryDate: '' }) }, 1100)
    }, 700)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-0">

      {/* ── Back bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.push('/dashboard/sites')}
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={13} /> Sites
        </button>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{site.name}</span>
      </div>

      {/* ── Site header card ──────────────────────────────────────────────── */}
      <div className="p-5 mb-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Left: info */}
          <div className="flex items-start gap-4">
            {/* Score ring */}
            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center"
              style={{ border: `4px solid ${color}`, background: color + '15' }}>
              <div className="text-center">
                <p className="text-lg font-black leading-none" style={{ color }}>{site.complianceScore}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color }}>Score</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
                  style={{
                    background: site.status === 'active' ? '#dcfce7' : site.status === 'upcoming' ? '#eff6ff' : '#f3f4f6',
                    color: site.status === 'active' ? '#15803d' : site.status === 'upcoming' ? '#1d4ed8' : '#6b7280',
                  }}>
                  {site.status}
                </span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{site.projectNumber}</span>
              </div>
              <h1 className="text-xl font-black" style={{ color: 'var(--text)' }}>{site.name}</h1>
              <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={12} /> {site.address}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1"><User size={11} /> {site.supervisor}</span>
                <span className="flex items-center gap-1"><Shield size={11} /> {site.whsCoordinator}</span>
                <span className="flex items-center gap-1"><CalendarDays size={11} /> {formatDate(site.startDate)} → {site.endDate ? formatDate(site.endDate) : 'Ongoing'}</span>
              </div>
            </div>
          </div>

          {/* Right: quick actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <QrCode size={13} /> QR Sign-In
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <MessageSquare size={13} /> Team Chat
            </button>
            <button
              onClick={() => setShowDiaryDrawer(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ background: 'var(--text)', color: 'var(--bg)' }}>
              <Plus size={13} /> Add Diary Entry
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0 mt-5 border-t" style={{ borderColor: 'var(--border)' }}>
          {[
            { label: 'On Site Now',      value: onSiteNow.length,     icon: Users,        color: '#3b82f6' },
            { label: 'Active Permits',   value: activePermits.length, icon: KeyRound,     color: '#8b5cf6' },
            { label: 'Open Hazards',     value: site.openHazards,     icon: AlertTriangle,color: site.openHazards > 0 ? '#f59e0b' : '#22c55e' },
            { label: 'Pre-Starts Done',  value: `${preStartDone}/${equipment.length}`, icon: CheckSquare, color: preStartDone < equipment.length ? '#f59e0b' : '#22c55e' },
            { label: 'WHSMP',           value: site.hasWhsmp ? 'Uploaded' : 'Missing',  icon: FileText,   color: site.hasWhsmp ? '#22c55e' : '#ef4444' },
          ].map(({ label, value, icon: Icon, color: c }, i) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 border-r last:border-r-0" style={{ borderColor: 'var(--border)' }}>
              <Icon size={18} style={{ color: c, flexShrink: 0 }} />
              <div>
                <p className="text-sm font-black" style={{ color: c }}>{value}</p>
                <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab nav ───────────────────────────────────────────────────────── */}
      <div className="flex border-b mb-5 overflow-x-auto" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        {TABS.map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors relative"
            style={
              tab === key
                ? { color: 'var(--text)', borderBottom: '2px solid var(--text)' }
                : { color: 'var(--text-muted)', borderBottom: '2px solid transparent' }
            }
          >
            <Icon size={13} />
            {label}
            {badge != null && badge > 0 && (
              <span className="text-[9px] font-black px-1.5 py-0.5 leading-none"
                style={{ background: '#ef4444', color: '#fff' }}>{badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* OVERVIEW TAB */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Today snapshot */}
          <div className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Today at a Glance</p>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{ background: '#fef3c7', color: '#b45309' }}>
                <CloudSun size={18} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Partly Cloudy · 21°C</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
            </div>
            {[
              { label: 'Workers signed in', value: onSiteNow.length, good: true },
              { label: 'Not yet inducted', value: notInducted.length, good: notInducted.length === 0 },
              { label: 'Active permits', value: activePermits.length, good: true },
              { label: 'Open hazards', value: site.openHazards, good: site.openHazards === 0 },
              { label: 'Equipment pre-starts', value: `${preStartDone}/${equipment.length}`, good: preStartDone === equipment.length },
            ].map(({ label, value, good }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <div className="flex items-center gap-1.5">
                  {good
                    ? <CheckCircle2 size={12} style={{ color: '#22c55e' }} />
                    : <AlertTriangle size={12} style={{ color: '#f59e0b' }} />
                  }
                  <span className="text-xs font-bold" style={{ color: good ? '#22c55e' : '#f59e0b' }}>{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action required */}
          <div className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Action Required</p>
            <div className="space-y-2">
              {notInducted.length > 0 && notInducted.map(p => (
                <div key={p.id} className="flex items-start gap-2.5 p-3" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
                  <AlertTriangle size={13} style={{ color: '#b45309', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#92400e' }}>{p.name} — Induction Overdue</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#b45309' }}>Worker is on site without completing site induction</p>
                  </div>
                </div>
              ))}
              {equipment.filter(e => !e.preStartDone).map(eq => (
                <div key={eq.id} className="flex items-start gap-2.5 p-3" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
                  <AlertTriangle size={13} style={{ color: '#b45309', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#92400e' }}>{eq.name} — Pre-Start Incomplete</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#b45309' }}>Daily pre-start check has not been completed</p>
                  </div>
                </div>
              ))}
              {!site.hasWhsmp && (
                <div className="flex items-start gap-2.5 p-3" style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}>
                  <XCircle size={13} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#991b1b' }}>WHSMP Not Uploaded</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#dc2626' }}>Work Health & Safety Management Plan is required</p>
                  </div>
                </div>
              )}
              {notInducted.length === 0 && equipment.every(e => e.preStartDone) && site.hasWhsmp && (
                <div className="flex items-center gap-2 p-3" style={{ background: '#dcfce7', border: '1px solid #86efac' }}>
                  <CheckCircle2 size={13} style={{ color: '#15803d' }} />
                  <p className="text-xs font-bold" style={{ color: '#14532d' }}>All checks complete — no action required today</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Recent Activity</p>
            <div className="space-y-3">
              {[
                { icon: Users,        color: '#3b82f6', text: `${onSiteNow.length} workers signed in today`, time: '07:30' },
                { icon: ClipboardCheck, color: '#22c55e', text: 'Monthly WHS inspection completed', time: 'Yesterday' },
                { icon: BookOpen,     color: '#8b5cf6', text: 'Site diary entry logged', time: 'Yesterday' },
                { icon: AlertTriangle,color: '#f59e0b', text: `${site.openHazards} open hazards require attention`, time: '2d ago' },
                { icon: FileSignature,color: '#0ea5e9', text: 'SWMS reviewed and re-signed', time: '3d ago' },
                { icon: Settings2,    color: '#6b7280', text: 'Equipment pre-starts completed', time: '3d ago' },
              ].map(({ icon: Icon, color: c, text, time }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: c + '18' }}>
                    <Icon size={12} style={{ color: c }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance breakdown */}
          <div className="lg:col-span-2 p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Compliance Breakdown</p>
            <div className="space-y-3">
              {[
                { label: 'Health & Safety',     score: site.complianceScore,      },
                { label: 'Personnel Inductions', score: notInducted.length === 0 ? 100 : Math.round((1 - notInducted.length / personnel.length) * 100) },
                { label: 'Equipment Pre-Starts', score: equipment.length ? Math.round((preStartDone / equipment.length) * 100) : 100 },
                { label: 'Documentation',        score: site.hasWhsmp ? 90 : 55 },
                { label: 'Permits',              score: activePermits.length > 0 ? 95 : 80 },
              ].map(({ label, score }) => {
                const c = scoreColor(score)
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <span className="text-xs font-bold" style={{ color: c }}>{score}%</span>
                    </div>
                    <div className="h-1.5 w-full" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="h-full transition-all duration-500" style={{ width: `${score}%`, background: c }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Site contacts */}
          <div className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Key Contacts</p>
            <div className="space-y-3">
              {[
                { name: site.supervisor, role: 'Site Supervisor', phone: '0412 345 678', initials: site.supervisor.split(' ').map(n => n[0]).join('') },
                { name: site.whsCoordinator, role: 'WHS Coordinator', phone: '0423 456 789', initials: site.whsCoordinator.split(' ').map(n => n[0]).join('') },
              ].map(({ name, role, phone, initials }) => (
                <div key={name} className="flex items-center gap-3">
                  <Avatar initials={initials} size="md" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 flex items-center justify-center" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      <Phone size={11} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      <Mail size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PERSONNEL TAB */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {tab === 'personnel' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'On Site Now',    value: onSiteNow.length,           color: '#22c55e' },
              { label: 'Total Registered', value: personnel.length,          color: '#3b82f6' },
              { label: 'Induction Overdue', value: notInducted.length,       color: notInducted.length > 0 ? '#ef4444' : '#22c55e' },
            ].map(({ label, value, color: c }) => (
              <div key={label} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${c}` }}>
                <p className="text-3xl font-black" style={{ color: c }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Personnel table */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Site Personnel Register</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                <Plus size={12} /> Add Worker
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Worker', 'Company', 'Role', 'On Site', 'Inducted', 'Licences'].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {personnel.map(p => (
                  <tr key={p.id} className="border-b hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={p.initials} size="sm" />
                        <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{p.company}</td>
                    <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{p.role}</td>
                    <td className="py-3 px-4">
                      {p.onSite
                        ? <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>✓ {p.signInTime}</span>
                        : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Not on site</span>
                      }
                    </td>
                    <td className="py-3 px-4">
                      {p.inducted
                        ? <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: '#dcfce7', color: '#15803d' }}>Inducted</span>
                        : <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: '#fee2e2', color: '#dc2626' }}>Required</span>
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.licences.length > 0
                          ? p.licences.map(l => <span key={l} className="text-[9px] font-semibold px-1.5 py-0.5" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{l}</span>)
                          : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SAFETY TAB */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {tab === 'safety' && (
        <div className="space-y-4">
          {/* Permits */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Permits to Work</p>
              <button onClick={() => setShowPermitDrawer(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                <Plus size={12} /> New Permit
              </button>
            </div>
            {permits.length === 0 ? (
              <p className="text-xs py-8 text-center" style={{ color: 'var(--text-muted)' }}>No permits for this site</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Permit', 'Number', 'Issued To', 'Issued By', 'Expiry', 'Status'].map(h => (
                      <th key={h} className="text-left py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permits.map(p => {
                    const sc = PERMIT_STATUS[p.status]
                    return (
                      <tr key={p.id} className="border-b hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border)' }}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <KeyRound size={13} style={{ color: 'var(--text-muted)' }} />
                            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{p.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{p.number}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{p.issuedTo}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{p.issuedBy}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(p.expiryDate)}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* SWMS for this site */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>SWMS on Site</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <Plus size={12} /> New SWMS
              </button>
            </div>
            {[
              { title: 'Working at Heights – Formwork', revision: 'v2.1', signed: 6, total: 6, risk: 'high' },
              { title: 'Excavation & Trenching', revision: 'v1.0', signed: 4, total: 5, risk: 'high' },
              { title: 'Hot Work – Welding', revision: 'v1.1', signed: 0, total: 3, risk: 'high' },
            ].map(swms => (
              <div key={swms.title} className="flex items-center gap-4 px-5 py-3.5 border-b hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border)' }}>
                <FileSignature size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{swms.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Rev {swms.revision}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span style={{ color: swms.signed === swms.total ? '#22c55e' : '#f59e0b' }}>
                    {swms.signed}/{swms.total} signed
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: '#ffedd5', color: '#c2410c' }}>{swms.risk}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Open hazards */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Open Hazards</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <Plus size={12} /> Log Hazard
              </button>
            </div>
            {site.openHazards === 0 ? (
              <div className="flex items-center gap-2 px-5 py-4 text-xs" style={{ color: '#15803d' }}>
                <CheckCircle2 size={14} /> No open hazards on this site
              </div>
            ) : (
              [
                { id: 'HAZ-001', desc: 'Unsecured scaffolding at Level 4 perimeter', risk: 'high',   assignedTo: 'James Chen',  status: 'open' },
                { id: 'HAZ-003', desc: 'Overhead powerlines within 3m of crane operation', risk: 'high', assignedTo: 'Marcus Torres', status: 'open' },
                { id: 'HAZ-006', desc: 'Chemical drums stored without secondary containment', risk: 'medium', assignedTo: 'Sarah Mitchell', status: 'open' },
              ].slice(0, site.openHazards).map(h => (
                <div key={h.id} className="flex items-start gap-3 px-5 py-3.5 border-b hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <AlertTriangle size={14} style={{ color: h.risk === 'high' ? '#ef4444' : '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{h.id}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5" style={{
                        background: h.risk === 'high' ? '#fee2e2' : '#fef3c7',
                        color: h.risk === 'high' ? '#dc2626' : '#b45309',
                      }}>{h.risk}</span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text)' }}>{h.desc}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Assigned: {h.assignedTo}</p>
                  </div>
                  <button className="text-xs font-semibold px-2.5 py-1" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    Update
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* INSPECTIONS TAB */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {tab === 'inspections' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Completed',  value: 2, color: '#22c55e' },
              { label: 'In Progress',value: 1, color: '#3b82f6' },
              { label: 'Scheduled',  value: 1, color: '#f59e0b' },
            ].map(({ label, value, color: c }) => (
              <div key={label} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${c}` }}>
                <p className="text-3xl font-black" style={{ color: c }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Inspections</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                <Plus size={12} /> Start Inspection
              </button>
            </div>
            {[
              { type: 'Monthly WHS Inspection', date: '2025-04-28', inspector: 'James Chen', score: 87, status: 'completed' },
              { type: 'Pre-Start Safety Check', date: '2025-04-30', inspector: 'Sarah Mitchell', score: 92, status: 'completed' },
              { type: 'Fire Safety Inspection', date: '2025-05-03', inspector: 'James Chen', score: 0, status: 'in-progress' },
              { type: 'Monthly WHS Inspection', date: '2025-05-10', inspector: 'Marcus Torres', score: 0, status: 'scheduled' },
            ].map((insp, i) => {
              const statusStyle = insp.status === 'completed'
                ? { bg: '#dcfce7', color: '#15803d', label: 'Completed' }
                : insp.status === 'in-progress'
                  ? { bg: '#eff6ff', color: '#1d4ed8', label: 'In Progress' }
                  : { bg: '#fef3c7', color: '#b45309', label: 'Scheduled' }
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b hover:bg-[var(--bg-hover)] transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--bg-secondary)' }}>
                    <ClipboardCheck size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{insp.type}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatDate(insp.date)} · {insp.inspector}</p>
                  </div>
                  {insp.score > 0 && (
                    <p className="text-lg font-black" style={{ color: scoreColor(insp.score) }}>{insp.score}%</p>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                    {statusStyle.label}
                  </span>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SITE DIARY TAB */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {tab === 'diary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Daily Site Diary</p>
            <button onClick={() => setShowDiaryDrawer(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              style={{ background: 'var(--text)', color: 'var(--bg)' }}>
              <Plus size={12} /> Add Entry
            </button>
          </div>
          {diary.length === 0 && (
            <p className="text-xs py-8 text-center" style={{ color: 'var(--text-muted)' }}>No diary entries yet</p>
          )}
          {diary.map(entry => (
            <div key={entry.id} className="p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              {/* Entry header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-base" style={{ color: 'var(--text)' }}>
                    {new Date(entry.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <User size={10} /> {entry.author}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1"><Thermometer size={11} />{entry.temp}</span>
                  <span className="flex items-center gap-1"><CloudSun size={11} />{entry.weather}</span>
                  <span className="flex items-center gap-1"><Users size={11} />{entry.workers} workers</span>
                  {entry.photos > 0 && <span className="flex items-center gap-1"><Camera size={11} />{entry.photos} photos</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Works Completed</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{entry.notes}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Issues / Incidents</p>
                  <p className="text-sm leading-relaxed" style={{
                    color: entry.issues === 'None' ? 'var(--text-muted)' : '#b45309',
                  }}>{entry.issues}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENTS TAB */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {tab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Site Documents</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              style={{ background: 'var(--text)', color: 'var(--bg)' }}>
              <Plus size={12} /> Upload Document
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {docs.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 p-4 group hover:bg-[var(--bg-hover)] transition-colors"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-black"
                  style={{ background: FILE_TYPE_COLOR[doc.fileType] }}>
                  {doc.fileType.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{doc.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{doc.type} · {doc.version} · Updated {formatDate(doc.updated)}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-7 h-7 flex items-center justify-center" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}><Eye size={12} /></button>
                  <button className="w-7 h-7 flex items-center justify-center" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}><Download size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* EQUIPMENT TAB */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {tab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Plant & Equipment on Site</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              style={{ background: 'var(--text)', color: 'var(--bg)' }}>
              <Plus size={12} /> Add Asset
            </button>
          </div>

          {equipment.length === 0 && (
            <p className="text-xs py-8 text-center" style={{ color: 'var(--text-muted)' }}>No equipment registered for this site</p>
          )}

          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Asset', 'Category', 'Pre-Start', 'Next Service', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipment.map(eq => {
                  const statusStyle = {
                    active:         { label: 'Active',       bg: '#dcfce7', color: '#15803d' },
                    'under-service':{ label: 'Under Service',bg: '#fef3c7', color: '#b45309' },
                    decommissioned: { label: 'Decommissioned',bg:'#fee2e2',color: '#dc2626' },
                  }[eq.status]
                  return (
                    <tr key={eq.id} className="border-b hover:bg-[var(--bg-hover)] transition-colors group" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                            <Settings2 size={13} style={{ color: 'var(--text-muted)' }} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{eq.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{eq.assetId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{eq.category}</td>
                      <td className="py-3 px-4">
                        {eq.preStartDone
                          ? <div className="flex items-center gap-1.5"><CheckCircle2 size={13} style={{ color: '#22c55e' }} /><span className="text-xs font-semibold" style={{ color: '#22c55e' }}>{eq.score}%</span></div>
                          : <div className="flex items-center gap-1.5"><XCircle size={13} style={{ color: '#ef4444' }} /><span className="text-xs font-semibold" style={{ color: '#ef4444' }}>Not done</span></div>
                        }
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(eq.nextService)}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5" style={{ background: statusStyle.bg, color: statusStyle.color }}>{statusStyle.label}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-[var(--bg-hover)] transition-colors" style={{ color: '#22c55e' }} title="Complete pre-start">
                            <CheckSquare size={13} />
                          </button>
                          <button className="p-1.5 hover:bg-[var(--bg-hover)] transition-colors" style={{ color: 'var(--text-muted)' }} title="Log service">
                            <Wrench size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SDS / CHEMICAL REGISTER TAB */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {tab === 'sds' && (() => {
        const current  = sdsData.filter(s => s.sdsStatus === 'current').length
        const expiring = sdsData.filter(s => s.sdsStatus === 'expiring').length
        const missing  = sdsData.filter(s => s.sdsStatus === 'missing').length

        const SDS_STATUS_CONFIG: Record<SDSStatus, { label: string; bg: string; color: string }> = {
          current:  { label: 'Current',  bg: 'rgba(34,197,94,0.12)',  color: '#16a34a' },
          expiring: { label: 'Expiring', bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
          missing:  { label: 'Missing',  bg: 'rgba(239,68,68,0.12)',  color: '#dc2626' },
        }

        return (
          <div className="space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                SDS / Chemical Register
              </p>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                style={{ background: 'var(--text)', color: 'var(--bg)' }}
              >
                <Plus size={12} /> Add Chemical
              </button>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Chemicals',  value: sdsData.length, icon: FlaskConical,  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
                { label: 'SDS Current',      value: current,         icon: CheckCircle2,  color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
                { label: 'SDS Expiring',     value: expiring,        icon: Clock,         color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
                { label: 'SDS Missing',      value: missing,         icon: AlertTriangle, color: missing > 0 ? '#ef4444' : '#22c55e', bg: missing > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="p-4 flex items-center gap-3" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xl font-black" style={{ color: 'var(--text)' }}>{value}</p>
                    <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance banner if any missing */}
            {missing > 0 && (
              <div className="flex items-start gap-3 px-4 py-3" style={{ background: 'rgba(239,68,68,0.06)', borderLeft: '3px solid #ef4444', border: '1px solid rgba(239,68,68,0.2)', borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
                <AlertTriangle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {missing} chemical{missing > 1 ? 's are' : ' is'} missing a current SDS
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Under WHS Regulations, an up-to-date Safety Data Sheet must be available for all hazardous chemicals on site.
                  </p>
                </div>
                <button className="text-xs font-semibold whitespace-nowrap flex-shrink-0" style={{ color: '#ef4444' }}>
                  Download SDS →
                </button>
              </div>
            )}

            {/* Chemical table */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                <FlaskConical size={14} style={{ color: 'var(--text-muted)' }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Chemical Inventory — {site.name}
                </p>
              </div>
              {sdsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <FlaskConical size={28} style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No chemicals registered for this site</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click "Add Chemical" to start your register</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                        {['Chemical Name', 'UN No.', 'Hazard Class', 'Location', 'Qty', 'Supplier', 'SDS Date', 'Status', 'Emergency'].map(h => (
                          <th key={h} className="text-left py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sdsData.map(chem => {
                        const ss = SDS_STATUS_CONFIG[chem.sdsStatus]
                        return (
                          <tr key={chem.id} className="border-b hover:bg-[var(--bg-hover)] transition-colors group" style={{ borderColor: 'var(--border)' }}>
                            {/* Chemical name */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: chem.hazardColor + '18' }}>
                                  <FlaskConical size={12} style={{ color: chem.hazardColor }} />
                                </div>
                                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{chem.name}</span>
                              </div>
                            </td>
                            {/* UN number */}
                            <td className="py-3 px-4">
                              <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{chem.unNumber}</span>
                            </td>
                            {/* Hazard class */}
                            <td className="py-3 px-4">
                              <span className="text-[10px] font-bold px-2 py-0.5 whitespace-nowrap" style={{ background: chem.hazardColor + '15', color: chem.hazardColor }}>
                                {chem.hazardClass}
                              </span>
                            </td>
                            {/* Location */}
                            <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              <div className="flex items-center gap-1">
                                <PackageOpen size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                {chem.location}
                              </div>
                            </td>
                            {/* Qty */}
                            <td className="py-3 px-4 text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>
                              {chem.quantity}
                            </td>
                            {/* Supplier */}
                            <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-muted)' }}>{chem.supplier}</td>
                            {/* SDS date */}
                            <td className="py-3 px-4 text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                              {formatDate(chem.sdsDate)}
                            </td>
                            {/* Status */}
                            <td className="py-3 px-4">
                              <span className="text-[10px] font-bold px-2 py-0.5 whitespace-nowrap" style={{ background: ss.bg, color: ss.color }}>
                                {ss.label}
                              </span>
                            </td>
                            {/* Emergency */}
                            <td className="py-3 px-4">
                              <a
                                href={`tel:${chem.emergency}`}
                                className="text-xs font-mono font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                                style={{ color: '#3b82f6' }}
                              >
                                <Phone size={10} /> {chem.emergency}
                              </a>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* GHS Placards reference */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>GHS Hazard Class Reference</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                {[
                  { label: 'Class 2.1 – Flammable Gas',     color: '#ef4444', count: sdsData.filter(s => s.hazardClass.includes('2.1')).length },
                  { label: 'Class 3 – Flammable Liquid',    color: '#f97316', count: sdsData.filter(s => s.hazardClass.includes('Class 3')).length },
                  { label: 'Class 6.1 – Toxic',             color: '#dc2626', count: sdsData.filter(s => s.hazardClass.includes('6.1')).length },
                  { label: 'Class 8 – Corrosive',           color: '#8b5cf6', count: sdsData.filter(s => s.hazardClass.includes('Class 8')).length },
                  { label: 'Class 2.2 – Non-Flammable Gas', color: '#3b82f6', count: sdsData.filter(s => s.hazardClass.includes('2.2')).length },
                  { label: 'Non-Dangerous Goods',           color: '#22c55e', count: sdsData.filter(s => s.hazardClass.includes('Non-Dangerous')).length },
                ].filter(g => g.count > 0).map(g => (
                  <div key={g.label} className="flex items-center gap-3 px-4 py-3 border-r border-b last:border-r-0" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-6 h-6 flex-shrink-0" style={{ background: g.color, transform: 'rotate(45deg)', marginLeft: 2 }} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>{g.count}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{g.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Add Diary Entry Drawer ─────────────────────────────────────── */}
      <Drawer open={showDiaryDrawer} onClose={() => setShowDiaryDrawer(false)} title="Add Diary Entry" subtitle={`Daily log for ${site.name}`}>
        <form onSubmit={submitDiary} className="space-y-4">
          <Field label="Weather">
            <Select value={diaryForm.weather} onChange={v => setDiaryForm(f => ({ ...f, weather: v }))}
              options={['Sunny', 'Partly Cloudy', 'Overcast', 'Rain', 'Windy', 'Extreme Heat']} placeholder="Select weather…" />
          </Field>
          <Field label="Workers on Site">
            <TextInput type="number" value={diaryForm.workers} onChange={v => setDiaryForm(f => ({ ...f, workers: v }))} placeholder="e.g. 14" />
          </Field>
          <Field label="Works Completed" required>
            <TextArea value={diaryForm.notes} onChange={v => setDiaryForm(f => ({ ...f, notes: v }))}
              placeholder="Describe what was completed today…" rows={4} />
          </Field>
          <Field label="Issues / Incidents">
            <TextArea value={diaryForm.issues} onChange={v => setDiaryForm(f => ({ ...f, issues: v }))}
              placeholder="Any issues, incidents or near-misses…" rows={3} />
          </Field>
          <SubmitRow saving={savingDiary} saved={savedDiary} submitLabel="Save Diary Entry" savedLabel="Entry Saved! ✓" onCancel={() => setShowDiaryDrawer(false)} />
        </form>
      </Drawer>

      {/* ── New Permit Drawer ──────────────────────────────────────────── */}
      <Drawer open={showPermitDrawer} onClose={() => setShowPermitDrawer(false)} title="New Permit to Work" subtitle={`Issue a permit for ${site.name}`}>
        <form onSubmit={submitPermit} className="space-y-4">
          <Field label="Permit Type" required>
            <Select value={permitForm.type} onChange={v => setPermitForm(f => ({ ...f, type: v }))}
              options={['Hot Work Permit', 'Working at Heights', 'Excavation Permit', 'Confined Space Entry', 'Electrical Isolation', 'Crane Operation', 'General Access']}
              placeholder="Select permit type…" />
          </Field>
          <Field label="Issued To" required>
            <Select value={permitForm.issuedTo} onChange={v => setPermitForm(f => ({ ...f, issuedTo: v }))}
              options={personnel.map(p => p.name)} placeholder="Select worker…" />
          </Field>
          <Field label="Expiry Date" required>
            <TextInput type="date" value={permitForm.expiryDate} onChange={v => setPermitForm(f => ({ ...f, expiryDate: v }))} />
          </Field>
          <SubmitRow saving={savingPermit} saved={savedPermit} submitLabel="Issue Permit" savedLabel="Permit Issued! ✓" onCancel={() => setShowPermitDrawer(false)} />
        </form>
      </Drawer>
    </div>
  )
}
