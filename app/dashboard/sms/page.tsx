'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Drawer, Field, TextInput, TextArea, Select, RadioGroup, SubmitRow,
} from '@/components/ui/Drawer'
import {
  ShieldCheck, BookOpen, Scale, ClipboardList, Siren, Users,
  CalendarCheck, BarChart3, Plus, CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Download, RefreshCw, Pencil, Eye, FileText,
  TrendingUp, TrendingDown, Minus, Star, ArrowUpRight, Lock,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type SMSTab = 'overview' | 'policy' | 'legal' | 'swp' | 'emergency' | 'meetings' | 'review' | 'audits'

type Status = 'current' | 'due-review' | 'overdue' | 'draft'
type AuditStatus = 'scheduled' | 'in-progress' | 'complete' | 'overdue'

interface PolicyDoc  { id: string; title: string; ref: string; version: string; owner: string; lastReviewed: string; nextReview: string; status: Status }
interface LegalItem  { id: string; legislation: string; jurisdiction: string; obligation: string; responsible: string; dueDate: string; status: 'compliant' | 'action-required' | 'monitoring' }
interface SWP        { id: string; title: string; taskType: string; riskLevel: 'high' | 'medium' | 'low'; lastReviewed: string; status: Status; approvedBy: string }
interface EmergencyPlan { id: string; title: string; site: string; lastDrill: string; nextDrill: string; wardenCount: number; status: 'active' | 'needs-update' }
interface MeetingRecord { id: string; type: string; date: string; attendees: number; facilitator: string; actionItems: number; status: 'complete' | 'pending-minutes' }
interface ReviewRecord  { id: string; date: string; chair: string; attendees: string[]; outcomes: number; openActions: number }
interface AuditItem    { id: string; title: string; type: 'internal' | 'external'; scope: string; auditor: string; scheduledDate: string; status: AuditStatus; findings?: number; score?: number }

// ── Mock data ──────────────────────────────────────────────────────────────────
const mockPolicies: PolicyDoc[] = [
  { id: 'POL-001', title: 'WHS Management System Policy',         ref: 'WHS-POL-001', version: '3.1', owner: 'CEO',          lastReviewed: '2024-11-01', nextReview: '2025-11-01', status: 'current' },
  { id: 'POL-002', title: 'Alcohol & Drug Policy',                ref: 'WHS-POL-002', version: '2.0', owner: 'HR Manager',   lastReviewed: '2024-08-15', nextReview: '2025-08-15', status: 'current' },
  { id: 'POL-003', title: 'Fatigue Management Policy',            ref: 'WHS-POL-003', version: '1.4', owner: 'HSE Manager',  lastReviewed: '2024-03-01', nextReview: '2025-03-01', status: 'due-review' },
  { id: 'POL-004', title: 'Personal Protective Equipment Policy', ref: 'WHS-POL-004', version: '2.2', owner: 'HSE Manager',  lastReviewed: '2023-12-10', nextReview: '2024-12-10', status: 'overdue' },
  { id: 'POL-005', title: 'Contractor Management Policy',         ref: 'WHS-POL-005', version: '1.1', owner: 'Ops Director', lastReviewed: '2024-10-01', nextReview: '2025-10-01', status: 'current' },
  { id: 'POL-006', title: 'Mental Health & Wellbeing Policy',     ref: 'WHS-POL-006', version: '1.0', owner: 'HR Manager',   lastReviewed: '2025-01-15', nextReview: '2026-01-15', status: 'current' },
]

const mockLegal: LegalItem[] = [
  { id: 'LEG-001', legislation: 'Work Health & Safety Act 2011 (Cth)', jurisdiction: 'Federal', obligation: 'Ensure PCBU duties met — safe systems of work, plant & structures, substances, welfare facilities', responsible: 'CEO', dueDate: 'Ongoing', status: 'compliant' },
  { id: 'LEG-002', legislation: 'WHS Regulation 2017', jurisdiction: 'NSW', obligation: 'Manage risks of hazardous chemicals including SDS, labelling, storage', responsible: 'HSE Manager', dueDate: '2025-06-30', status: 'action-required' },
  { id: 'LEG-003', legislation: 'Code of Practice: Managing Risks of Falls', jurisdiction: 'NSW', obligation: 'Edge protection, fall-arrest systems, scaffolding inspections at all sites >2m', responsible: 'Site Supervisors', dueDate: 'Ongoing', status: 'compliant' },
  { id: 'LEG-004', legislation: 'Electrical Safety Act 2002', jurisdiction: 'NSW', obligation: 'RCD testing every 3 months, tag & test all portable equipment', responsible: 'HSE Manager', dueDate: '2025-07-01', status: 'monitoring' },
  { id: 'LEG-005', legislation: 'Safe Work Method Statements', jurisdiction: 'NSW', obligation: 'SWMS required for all high-risk construction work prior to commencement', responsible: 'Site Supervisors', dueDate: 'Ongoing', status: 'compliant' },
  { id: 'LEG-006', legislation: 'Workers Compensation Act 1987', jurisdiction: 'NSW', obligation: 'Return to work programs, injury management plans within 5 days of injury notification', responsible: 'HR Manager', dueDate: 'Ongoing', status: 'action-required' },
]

const mockSWPs: SWP[] = [
  { id: 'SWP-001', title: 'Working at Heights',             taskType: 'High-Risk Construction', riskLevel: 'high',   lastReviewed: '2024-10-01', status: 'current',    approvedBy: 'J. Mitchell – HSE Manager' },
  { id: 'SWP-002', title: 'Excavation & Trenching',         taskType: 'Earthworks',             riskLevel: 'high',   lastReviewed: '2024-09-15', status: 'current',    approvedBy: 'J. Mitchell – HSE Manager' },
  { id: 'SWP-003', title: 'Hot Works (Welding & Cutting)',  taskType: 'Trade Work',             riskLevel: 'high',   lastReviewed: '2024-07-01', status: 'due-review', approvedBy: 'J. Mitchell – HSE Manager' },
  { id: 'SWP-004', title: 'Crane & Rigging Operations',     taskType: 'Plant Operation',        riskLevel: 'high',   lastReviewed: '2024-11-20', status: 'current',    approvedBy: 'J. Mitchell – HSE Manager' },
  { id: 'SWP-005', title: 'Electrical Isolation (LOTO)',    taskType: 'Electrical',             riskLevel: 'high',   lastReviewed: '2024-08-10', status: 'current',    approvedBy: 'J. Mitchell – HSE Manager' },
  { id: 'SWP-006', title: 'Chemical Handling & Storage',    taskType: 'Hazardous Substances',   riskLevel: 'medium', lastReviewed: '2024-05-01', status: 'overdue',    approvedBy: 'J. Mitchell – HSE Manager' },
  { id: 'SWP-007', title: 'Confined Space Entry',           taskType: 'High-Risk Construction', riskLevel: 'high',   lastReviewed: '2024-12-01', status: 'current',    approvedBy: 'J. Mitchell – HSE Manager' },
  { id: 'SWP-008', title: 'Manual Tasks & Ergonomics',      taskType: 'General',                riskLevel: 'low',    lastReviewed: '2024-04-10', status: 'due-review', approvedBy: 'J. Mitchell – HSE Manager' },
]

const mockEmergency: EmergencyPlan[] = [
  { id: 'EMP-001', title: 'Emergency Response Plan – Site A',           site: 'George St, Sydney',     lastDrill: '2024-12-10', nextDrill: '2025-06-10', wardenCount: 4, status: 'active' },
  { id: 'EMP-002', title: 'Emergency Response Plan – Site B',           site: 'Parramatta Rd, Strathfield', lastDrill: '2024-11-20', nextDrill: '2025-05-20', wardenCount: 3, status: 'active' },
  { id: 'EMP-003', title: 'Emergency Response Plan – Head Office',      site: 'CBD Office',            lastDrill: '2024-09-01', nextDrill: '2025-03-01', wardenCount: 2, status: 'needs-update' },
  { id: 'EMP-004', title: 'Spill Response Plan – Chemical Storage',     site: 'Depot – Wetherill Park', lastDrill: '2024-10-15', nextDrill: '2025-04-15', wardenCount: 2, status: 'active' },
]

const mockMeetings: MeetingRecord[] = [
  { id: 'MTG-001', type: 'WHS Committee Meeting',    date: '2025-06-02', attendees: 8,  facilitator: 'J. Mitchell', actionItems: 4, status: 'complete' },
  { id: 'MTG-002', type: 'Safety Leadership Walk',   date: '2025-05-28', attendees: 3,  facilitator: 'T. Walsh',    actionItems: 2, status: 'complete' },
  { id: 'MTG-003', type: 'Toolbox Talk – Site A',    date: '2025-06-09', attendees: 14, facilitator: 'R. Patel',    actionItems: 0, status: 'pending-minutes' },
  { id: 'MTG-004', type: 'WHS Committee Meeting',    date: '2025-07-07', attendees: 0,  facilitator: 'J. Mitchell', actionItems: 0, status: 'pending-minutes' },
  { id: 'MTG-005', type: 'Contractor Safety Briefing', date: '2025-06-05', attendees: 6, facilitator: 'T. Walsh',  actionItems: 3, status: 'complete' },
]

const mockReviews: ReviewRecord[] = [
  { id: 'REV-001', date: '2025-03-15', chair: 'Sarah Mitchell – CEO', attendees: ['J. Mitchell – HSE', 'T. Walsh – Ops', 'L. Chen – HR', 'R. Patel – Site'], outcomes: 12, openActions: 2 },
  { id: 'REV-002', date: '2024-09-20', chair: 'Sarah Mitchell – CEO', attendees: ['J. Mitchell – HSE', 'T. Walsh – Ops', 'L. Chen – HR'], outcomes: 9,  openActions: 0 },
  { id: 'REV-003', date: '2024-03-18', chair: 'Sarah Mitchell – CEO', attendees: ['J. Mitchell – HSE', 'T. Walsh – Ops'], outcomes: 7,  openActions: 0 },
]

const mockAudits: AuditItem[] = [
  { id: 'AUD-001', title: 'Q2 Internal WHS Audit',          type: 'internal', scope: 'All sites — safety systems, documentation, training',  auditor: 'J. Mitchell',    scheduledDate: '2025-06-25', status: 'scheduled' },
  { id: 'AUD-002', title: 'ISO 45001 Surveillance Audit',   type: 'external', scope: 'Full SMS review against ISO 45001:2018',               auditor: 'BSI Group',      scheduledDate: '2025-07-14', status: 'scheduled' },
  { id: 'AUD-003', title: 'Q1 Internal WHS Audit',          type: 'internal', scope: 'Sites A & B — hazard ID, SWMS, permits',               auditor: 'J. Mitchell',    scheduledDate: '2025-03-28', status: 'complete', findings: 4, score: 87 },
  { id: 'AUD-004', title: 'SafeWork NSW Inspection',        type: 'external', scope: 'Routine regulator visit — Site A',                     auditor: 'SafeWork NSW',   scheduledDate: '2025-02-12', status: 'complete', findings: 1, score: 96 },
  { id: 'AUD-005', title: 'Q4 Internal WHS Audit',          type: 'internal', scope: 'All sites — corrective action review',                 auditor: 'J. Mitchell',    scheduledDate: '2024-12-10', status: 'complete', findings: 6, score: 82 },
  { id: 'AUD-006', title: 'Site B Emergency Readiness Audit', type: 'internal', scope: 'Emergency plans, warden training, equipment',        auditor: 'T. Walsh',       scheduledDate: '2025-05-05', status: 'overdue', },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
const statusConfig: Record<Status, { label: string; cls: string }> = {
  current:     { label: 'Current',     cls: 'bg-green-100 text-green-700' },
  'due-review':{ label: 'Due Review',  cls: 'bg-amber-100 text-amber-700' },
  overdue:     { label: 'Overdue',     cls: 'bg-red-100 text-red-700' },
  draft:       { label: 'Draft',       cls: 'bg-blue-100 text-blue-700' },
}
const auditStatusConfig: Record<AuditStatus, { label: string; cls: string }> = {
  scheduled:   { label: 'Scheduled',   cls: 'bg-blue-100 text-blue-700' },
  'in-progress':{ label: 'In Progress',cls: 'bg-amber-100 text-amber-700' },
  complete:    { label: 'Complete',    cls: 'bg-green-100 text-green-700' },
  overdue:     { label: 'Overdue',     cls: 'bg-red-100 text-red-700' },
}
const riskBadge = { high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-green-100 text-green-700' }
const legalStatusCfg = {
  compliant:        { label: 'Compliant',        cls: 'bg-green-100 text-green-700' },
  'action-required':{ label: 'Action Required',  cls: 'bg-red-100 text-red-700' },
  monitoring:       { label: 'Monitoring',        cls: 'bg-amber-100 text-amber-700' },
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>{children}</span>
}

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: React.ElementType; label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: (accent ?? '#FFD940') + '18' }}>
          <Icon size={17} style={{ color: accent ?? '#FFD940' }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {sub && <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </Card>
  )
}

const TABS: { id: SMSTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',  label: 'Overview',          icon: BarChart3    },
  { id: 'policy',    label: 'Safety Policies',   icon: BookOpen     },
  { id: 'legal',     label: 'Legal Register',    icon: Scale        },
  { id: 'swp',       label: 'Safe Work Procedures', icon: ClipboardList },
  { id: 'emergency', label: 'Emergency Plans',   icon: Siren        },
  { id: 'meetings',  label: 'Safety Meetings',   icon: Users        },
  { id: 'review',    label: 'Management Review', icon: CalendarCheck},
  { id: 'audits',    label: 'Audits',            icon: ShieldCheck  },
]

// ── Main page ──────────────────────────────────────────────────────────────────
export default function SMSPage() {
  const [tab, setTab] = useState<SMSTab>('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<'policy' | 'swp' | 'audit' | 'meeting' | 'legal'>('policy')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state (shared/generic for simplicity)
  const [form, setForm] = useState<Record<string, string>>({})

  function openDrawer(type: typeof drawerType) {
    setDrawerType(type)
    setForm({})
    setSaved(false)
    setSaving(false)
    setDrawerOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setDrawerOpen(false), 1200)
    }, 800)
  }

  const drawerTitles: Record<typeof drawerType, string> = {
    policy:  'Add Safety Policy',
    swp:     'Add Safe Work Procedure',
    audit:   'Schedule Audit',
    meeting: 'Record Safety Meeting',
    legal:   'Add Legal Obligation',
  }

  // ── Compliance score ─────────────────────────────────────────────────────────
  const policyScore   = Math.round((mockPolicies.filter(p => p.status === 'current').length / mockPolicies.length) * 100)
  const legalScore    = Math.round((mockLegal.filter(l => l.status === 'compliant').length / mockLegal.length) * 100)
  const swpScore      = Math.round((mockSWPs.filter(s => s.status === 'current').length / mockSWPs.length) * 100)
  const overallScore  = Math.round((policyScore + legalScore + swpScore) / 3)

  const scoreColor = overallScore >= 85 ? '#22c55e' : overallScore >= 70 ? '#f59e0b' : '#ef4444'

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      <PageHeader
        title="Safety Management System"
        description="WHS policies, legal obligations, safe work procedures, audits and management review"
        action={{ label: 'Add Document', icon: <Plus size={14} />, onClick: () => openDrawer('policy') }}
      />

      {/* Tab bar */}
      <div className="flex gap-0.5 overflow-x-auto pb-0.5" style={{ borderBottom: '1px solid var(--border)' }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors"
              style={{
                color: active ? 'var(--text)' : 'var(--text-muted)',
                borderBottom: active ? '2px solid #FFD940' : '2px solid transparent',
                marginBottom: -1,
                background: 'none',
              }}
            >
              <Icon size={13} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Score + stats row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* SMS Score card */}
            <Card className="p-5 col-span-2 md:col-span-1" style={{ borderLeft: `3px solid ${scoreColor}` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>SMS Score</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black" style={{ color: scoreColor }}>{overallScore}%</span>
                <span className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>overall</span>
              </div>
              {/* Mini bar */}
              <div className="mt-3 space-y-1.5">
                {[
                  { label: 'Policies',    score: policyScore  },
                  { label: 'Legal',       score: legalScore   },
                  { label: 'Procedures',  score: swpScore     },
                ].map(({ label, score }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>
                      <span>{label}</span><span className="font-semibold">{score}%</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <StatCard icon={BookOpen}     label="Total Policies"      value={mockPolicies.length} sub={`${mockPolicies.filter(p=>p.status==='current').length} current`} accent="#2563eb" />
            <StatCard icon={ClipboardList} label="Safe Work Procedures" value={mockSWPs.length}    sub={`${mockSWPs.filter(s=>s.status==='overdue').length} overdue`}  accent="#ea580c" />
            <StatCard icon={ShieldCheck}  label="Audits This Year"    value={mockAudits.filter(a=>a.status==='complete').length} sub="completed audits" accent="#22c55e" />
            <StatCard icon={AlertTriangle} label="Action Items Open"   value={mockLegal.filter(l=>l.status==='action-required').length} sub="require attention" accent="#ef4444" />
          </div>

          {/* Quick status grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Policy health */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Policy Health</h3>
                <button onClick={() => setTab('policy')} className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#FFD940' }}>View all <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-2">
                {mockPolicies.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{p.title}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Rev {p.version} · Next review {p.nextReview}</p>
                    </div>
                    <Badge className={statusConfig[p.status].cls}>{statusConfig[p.status].label}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming audits */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Upcoming Audits</h3>
                <button onClick={() => setTab('audits')} className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#FFD940' }}>View all <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-2">
                {mockAudits.filter(a => a.status === 'scheduled' || a.status === 'overdue').map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.type === 'external' ? 'bg-purple-100' : 'bg-amber-100'}`}>
                      <ShieldCheck size={14} style={{ color: a.type === 'external' ? '#7c3aed' : '#d97706' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{a.title}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.scheduledDate} · {a.auditor}</p>
                    </div>
                    <Badge className={auditStatusConfig[a.status].cls}>{auditStatusConfig[a.status].label}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Legal obligations requiring action */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Legal Obligations Requiring Action</h3>
                <button onClick={() => setTab('legal')} className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#FFD940' }}>View all <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-2">
                {mockLegal.filter(l => l.status !== 'compliant').map(l => (
                  <div key={l.id} className="p-3 rounded-lg" style={{ background: l.status === 'action-required' ? '#fef2f2' : '#fefce8', border: `1px solid ${l.status === 'action-required' ? '#fecaca' : '#fde68a'}` }}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{l.legislation}</p>
                      <Badge className={legalStatusCfg[l.status].cls}>{legalStatusCfg[l.status].label}</Badge>
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{l.obligation.slice(0, 80)}…</p>
                    <p className="text-[10px] font-semibold mt-1" style={{ color: 'var(--text-secondary)' }}>Responsible: {l.responsible} · Due: {l.dueDate}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent meetings */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Recent Safety Meetings</h3>
                <button onClick={() => setTab('meetings')} className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#FFD940' }}>View all <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-2">
                {mockMeetings.slice(0, 4).map(m => (
                  <div key={m.id} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Users size={14} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{m.type}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{m.date} · {m.attendees} attendees · {m.actionItems} actions</p>
                    </div>
                    <Badge className={m.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                      {m.status === 'complete' ? 'Complete' : 'Pending Minutes'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Safety Policies ── */}
      {tab === 'policy' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => openDrawer('policy')}><Plus size={14} /> Add Policy</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Ref', 'Title', 'Version', 'Owner', 'Last Reviewed', 'Next Review', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockPolicies.map(p => (
                    <tr key={p.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <td className="py-3 px-4"><span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{p.ref}</span></td>
                      <td className="py-3 px-4"><p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{p.title}</p></td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>v{p.version}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{p.owner}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{p.lastReviewed}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: p.status === 'overdue' ? '#ef4444' : 'var(--text-secondary)' }}>{p.nextReview}</td>
                      <td className="py-3 px-4"><Badge className={statusConfig[p.status].cls}>{statusConfig[p.status].label}</Badge></td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1.5">
                          <button className="p-1.5 rounded transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Eye size={13} /></button>
                          <button className="p-1.5 rounded transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Pencil size={13} /></button>
                          <button className="p-1.5 rounded transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Download size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── Legal Register ── */}
      {tab === 'legal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'compliant', 'action-required', 'monitoring'] as const).map(f => (
                <button key={f} className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
                  style={{ background: f === 'all' ? '#FFD940' : 'var(--bg-hover)', color: f === 'all' ? '#000' : 'var(--text-secondary)' }}>
                  {f === 'all' ? 'All' : f === 'action-required' ? 'Action Required' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <Button className="gap-2" onClick={() => openDrawer('legal')}><Plus size={14} /> Add Obligation</Button>
          </div>
          <div className="space-y-3">
            {mockLegal.map(l => (
              <Card key={l.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{l.legislation}</p>
                      <Badge className="bg-slate-100 text-slate-600">{l.jurisdiction}</Badge>
                      <Badge className={legalStatusCfg[l.status].cls}>{legalStatusCfg[l.status].label}</Badge>
                    </div>
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{l.obligation}</p>
                    <div className="flex gap-6 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>Responsible: <strong style={{ color: 'var(--text)' }}>{l.responsible}</strong></span>
                      <span>Due: <strong style={{ color: l.status === 'action-required' ? '#ef4444' : 'var(--text)' }}>{l.dueDate}</strong></span>
                      <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{l.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button className="p-1.5 rounded transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Pencil size={13} /></button>
                    <button className="p-1.5 rounded transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><RefreshCw size={13} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Safe Work Procedures ── */}
      {tab === 'swp' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => openDrawer('swp')}><Plus size={14} /> Add SWP</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockSWPs.map(s => (
              <Card key={s.id} className="p-5 group cursor-pointer transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{s.id}</span>
                    <Badge className={riskBadge[s.riskLevel]}>{s.riskLevel.charAt(0).toUpperCase() + s.riskLevel.slice(1)} Risk</Badge>
                    <Badge className={statusConfig[s.status].cls}>{statusConfig[s.status].label}</Badge>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Eye size={12} /></button>
                    <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Download size={12} /></button>
                  </div>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{s.taskType}</p>
                <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <span>Reviewed: {s.lastReviewed}</span>
                  <span className="truncate max-w-[180px]">Approved by: {s.approvedBy}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Emergency Plans ── */}
      {tab === 'emergency' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2"><Plus size={14} /> Add Emergency Plan</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockEmergency.map(ep => (
              <Card key={ep.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${ep.status === 'active' ? 'bg-green-50' : 'bg-amber-50'}`}>
                    <Siren size={20} style={{ color: ep.status === 'active' ? '#22c55e' : '#f59e0b' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>{ep.title}</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{ep.site}</p>
                      </div>
                      <Badge className={ep.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {ep.status === 'active' ? 'Active' : 'Needs Update'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
                      <div>
                        <p style={{ color: 'var(--text-muted)' }}>Last Drill</p>
                        <p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{ep.lastDrill}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--text-muted)' }}>Next Drill</p>
                        <p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{ep.nextDrill}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--text-muted)' }}>Wardens</p>
                        <p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{ep.wardenCount} assigned</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5"><Eye size={11} /> View Plan</Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5"><Pencil size={11} /> Edit</Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5"><FileText size={11} /> Log Drill</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Safety Meetings ── */}
      {tab === 'meetings' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => openDrawer('meeting')}><Plus size={14} /> Record Meeting</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Meeting Type', 'Date', 'Facilitator', 'Attendees', 'Action Items', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockMeetings.map(m => (
                    <tr key={m.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Users size={13} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{m.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{m.date}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{m.facilitator}</td>
                      <td className="py-3 px-4 text-xs font-semibold" style={{ color: 'var(--text)' }}>{m.attendees > 0 ? m.attendees : '—'}</td>
                      <td className="py-3 px-4">
                        {m.actionItems > 0 ? (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{m.actionItems} open</span>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={m.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                          {m.status === 'complete' ? 'Complete' : 'Pending Minutes'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1.5">
                          <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Eye size={13} /></button>
                          <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Download size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── Management Review ── */}
      {tab === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Bi-annual management review meetings in accordance with ISO 45001 cl. 9.3</p>
            <Button className="gap-2"><Plus size={14} /> Record Review</Button>
          </div>
          <div className="space-y-4">
            {mockReviews.map((r, i) => (
              <Card key={r.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarCheck size={15} style={{ color: '#FFD940' }} />
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Management Review — {r.date}</h3>
                      {i === 0 && <Badge className="bg-blue-100 text-blue-700">Most Recent</Badge>}
                    </div>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Chaired by: {r.chair}</p>
                    <div className="flex gap-6 text-xs">
                      <div>
                        <p style={{ color: 'var(--text-muted)' }}>Attendees</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {r.attendees.map(a => (
                            <span key={a} className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-8 mt-4 text-xs">
                      <div>
                        <p style={{ color: 'var(--text-muted)' }}>Outcomes / Actions</p>
                        <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--text)' }}>{r.outcomes}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--text-muted)' }}>Open Actions</p>
                        <p className="text-xl font-bold mt-0.5" style={{ color: r.openActions > 0 ? '#f59e0b' : '#22c55e' }}>{r.openActions}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5"><Eye size={11} /> View Minutes</Button>
                    <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5"><Download size={11} /> Export</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Audits ── */}
      {tab === 'audits' && (
        <div className="space-y-4">
          {/* Score summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mockAudits.filter(a => a.status === 'complete' && a.score !== undefined).map(a => (
              <Card key={a.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{a.type}</span>
                  <Star size={12} style={{ color: '#FFD940' }} />
                </div>
                <p className="text-2xl font-black" style={{ color: (a.score ?? 0) >= 90 ? '#22c55e' : (a.score ?? 0) >= 80 ? '#f59e0b' : '#ef4444' }}>{a.score}%</p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{a.title}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.findings} finding{a.findings !== 1 ? 's' : ''}</p>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => openDrawer('audit')}><Plus size={14} /> Schedule Audit</Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Audit', 'Type', 'Scope', 'Auditor', 'Date', 'Score', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockAudits.map(a => (
                    <tr key={a.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{a.title}</p>
                          <p className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={a.type === 'external' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}>
                          {a.type === 'external' ? 'External' : 'Internal'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
                        <span className="line-clamp-2">{a.scope}</span>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{a.auditor}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{a.scheduledDate}</td>
                      <td className="py-3 px-4">
                        {a.score !== undefined ? (
                          <span className={`text-xs font-bold ${a.score >= 90 ? 'text-green-600' : a.score >= 80 ? 'text-amber-600' : 'text-red-600'}`}>{a.score}%</span>
                        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td className="py-3 px-4"><Badge className={auditStatusConfig[a.status].cls}>{auditStatusConfig[a.status].label}</Badge></td>
                      <td className="py-3 px-4">
                        <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}><Eye size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── Drawer ── */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={drawerTitles[drawerType]}>
        <form onSubmit={handleSubmit} className="space-y-4">

          {drawerType === 'policy' && (
            <>
              <Field label="Policy Title" required>
                <TextInput value={form.title ?? ''} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. WHS Management System Policy" />
              </Field>
              <Field label="Reference Number" required>
                <TextInput value={form.ref ?? ''} onChange={v => setForm(f => ({ ...f, ref: v }))} placeholder="e.g. WHS-POL-007" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Version">
                  <TextInput value={form.version ?? ''} onChange={v => setForm(f => ({ ...f, version: v }))} placeholder="1.0" />
                </Field>
                <Field label="Owner" required>
                  <TextInput value={form.owner ?? ''} onChange={v => setForm(f => ({ ...f, owner: v }))} placeholder="e.g. HSE Manager" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date Reviewed">
                  <TextInput type="date" value={form.reviewed ?? ''} onChange={v => setForm(f => ({ ...f, reviewed: v }))} />
                </Field>
                <Field label="Next Review Date">
                  <TextInput type="date" value={form.nextReview ?? ''} onChange={v => setForm(f => ({ ...f, nextReview: v }))} />
                </Field>
              </div>
              <Field label="Status">
                <RadioGroup value={form.status ?? 'current'} onChange={v => setForm(f => ({ ...f, status: v }))}
                  options={[{ value: 'current', label: 'Current' }, { value: 'draft', label: 'Draft' }, { value: 'due-review', label: 'Due Review' }]}
                  colorMap={{ current: '#22c55e', draft: '#3b82f6', 'due-review': '#f59e0b' }} />
              </Field>
              <Field label="Notes">
                <TextArea value={form.notes ?? ''} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Additional notes…" rows={3} />
              </Field>
            </>
          )}

          {drawerType === 'swp' && (
            <>
              <Field label="SWP Title" required>
                <TextInput value={form.title ?? ''} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Working at Heights" />
              </Field>
              <Field label="Task Type" required>
                <Select value={form.taskType ?? ''} onChange={v => setForm(f => ({ ...f, taskType: v }))}
                  options={['High-Risk Construction', 'Plant Operation', 'Electrical', 'Earthworks', 'Trade Work', 'Hazardous Substances', 'General']}
                  placeholder="Select task type…" />
              </Field>
              <Field label="Risk Level">
                <RadioGroup value={form.riskLevel ?? 'medium'} onChange={v => setForm(f => ({ ...f, riskLevel: v }))}
                  options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]}
                  colorMap={{ low: '#22c55e', medium: '#f59e0b', high: '#ef4444' }} />
              </Field>
              <Field label="Approved By" required>
                <TextInput value={form.approvedBy ?? ''} onChange={v => setForm(f => ({ ...f, approvedBy: v }))} placeholder="Name and role" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date Reviewed">
                  <TextInput type="date" value={form.reviewed ?? ''} onChange={v => setForm(f => ({ ...f, reviewed: v }))} />
                </Field>
                <Field label="Next Review Date">
                  <TextInput type="date" value={form.nextReview ?? ''} onChange={v => setForm(f => ({ ...f, nextReview: v }))} />
                </Field>
              </div>
              <Field label="Step-by-Step Summary">
                <TextArea value={form.steps ?? ''} onChange={v => setForm(f => ({ ...f, steps: v }))} placeholder="Outline the key steps and controls…" rows={4} />
              </Field>
            </>
          )}

          {drawerType === 'audit' && (
            <>
              <Field label="Audit Title" required>
                <TextInput value={form.title ?? ''} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Q3 Internal WHS Audit" />
              </Field>
              <Field label="Audit Type">
                <RadioGroup value={form.type ?? 'internal'} onChange={v => setForm(f => ({ ...f, type: v }))}
                  options={[{ value: 'internal', label: 'Internal' }, { value: 'external', label: 'External' }]}
                  colorMap={{ internal: '#2563eb', external: '#7c3aed' }} />
              </Field>
              <Field label="Auditor / Body" required>
                <TextInput value={form.auditor ?? ''} onChange={v => setForm(f => ({ ...f, auditor: v }))} placeholder="e.g. J. Mitchell or BSI Group" />
              </Field>
              <Field label="Scheduled Date" required>
                <TextInput type="date" value={form.date ?? ''} onChange={v => setForm(f => ({ ...f, date: v }))} />
              </Field>
              <Field label="Scope / Areas to Audit">
                <TextArea value={form.scope ?? ''} onChange={v => setForm(f => ({ ...f, scope: v }))} placeholder="Describe what will be audited…" rows={3} />
              </Field>
            </>
          )}

          {drawerType === 'meeting' && (
            <>
              <Field label="Meeting Type" required>
                <Select value={form.type ?? ''} onChange={v => setForm(f => ({ ...f, type: v }))}
                  options={['WHS Committee Meeting', 'Safety Leadership Walk', 'Toolbox Talk', 'Contractor Safety Briefing', 'Emergency Drill Debrief', 'Management Review']}
                  placeholder="Select type…" />
              </Field>
              <Field label="Date" required>
                <TextInput type="date" value={form.date ?? ''} onChange={v => setForm(f => ({ ...f, date: v }))} />
              </Field>
              <Field label="Facilitator" required>
                <TextInput value={form.facilitator ?? ''} onChange={v => setForm(f => ({ ...f, facilitator: v }))} placeholder="Full name" />
              </Field>
              <Field label="Number of Attendees">
                <TextInput type="number" value={form.attendees ?? ''} onChange={v => setForm(f => ({ ...f, attendees: v }))} placeholder="e.g. 8" />
              </Field>
              <Field label="Key Discussion Points">
                <TextArea value={form.points ?? ''} onChange={v => setForm(f => ({ ...f, points: v }))} placeholder="Summarise topics covered…" rows={3} />
              </Field>
              <Field label="Action Items">
                <TextArea value={form.actions ?? ''} onChange={v => setForm(f => ({ ...f, actions: v }))} placeholder="List action items, responsible persons and due dates…" rows={3} />
              </Field>
            </>
          )}

          {drawerType === 'legal' && (
            <>
              <Field label="Legislation / Standard" required>
                <TextInput value={form.legislation ?? ''} onChange={v => setForm(f => ({ ...f, legislation: v }))} placeholder="e.g. WHS Act 2011 (Cth)" />
              </Field>
              <Field label="Jurisdiction">
                <Select value={form.jurisdiction ?? ''} onChange={v => setForm(f => ({ ...f, jurisdiction: v }))}
                  options={['Federal', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']}
                  placeholder="Select…" />
              </Field>
              <Field label="Obligation Description" required>
                <TextArea value={form.obligation ?? ''} onChange={v => setForm(f => ({ ...f, obligation: v }))} placeholder="Describe the specific obligation…" rows={3} />
              </Field>
              <Field label="Responsible Person" required>
                <TextInput value={form.responsible ?? ''} onChange={v => setForm(f => ({ ...f, responsible: v }))} placeholder="e.g. HSE Manager" />
              </Field>
              <Field label="Review / Due Date">
                <TextInput type="date" value={form.dueDate ?? ''} onChange={v => setForm(f => ({ ...f, dueDate: v }))} />
              </Field>
              <Field label="Compliance Status">
                <RadioGroup value={form.status ?? 'compliant'} onChange={v => setForm(f => ({ ...f, status: v }))}
                  options={[{ value: 'compliant', label: 'Compliant' }, { value: 'monitoring', label: 'Monitoring' }, { value: 'action-required', label: 'Action Required' }]}
                  colorMap={{ compliant: '#22c55e', monitoring: '#f59e0b', 'action-required': '#ef4444' }} />
              </Field>
            </>
          )}

          <SubmitRow saving={saving} saved={saved} submitLabel="Save" savedLabel="Saved!" onCancel={() => setDrawerOpen(false)} />
        </form>
      </Drawer>
    </div>
  )
}
