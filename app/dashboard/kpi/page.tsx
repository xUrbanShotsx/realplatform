'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { kpiMetrics, companyInfo } from '@/lib/mock-data'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  Activity, TrendingDown, TrendingUp, CheckCircle2, AlertTriangle,
  UserCheck, HardHat, GraduationCap, Settings2, MapPin, FolderOpen,
  FileText, Wrench, Clock, Shield, ArrowRight, Target,
} from 'lucide-react'

function trafficLight(score: number) {
  if (score >= 80) return { dot: 'bg-green-400', text: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', bar: '#4ade80', label: 'Good' }
  if (score >= 60) return { dot: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', bar: '#fbbf24', label: 'Review' }
  return { dot: 'bg-red-400', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', bar: '#f87171', label: 'Action' }
}

const moduleIcons = [UserCheck, HardHat, GraduationCap, Settings2, MapPin, FolderOpen]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 shadow-sm text-xs">
      <p className="font-semibold text-black dark:text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  )
}

export default function KPIPage() {
  const {
    ltifr, trifr, mtifr, nearMissFrequency, daysLostToInjury,
    preStartsDoneToday, preStartsScheduled, toolboxTalksThisMonth, toolboxTalksTarget,
    inspectionsOnTime, inspectionsScheduled, hazardsReportedThisMonth,
    trainingCompletionRate, workersWithCurrentLicences, contractorsFullyQualified, inductionsCompletedRate,
    openCAPAs, overdueCAPAs, onTimeCAPAClosureRate, overdueDocReviews, activePermits, expiringPermits,
    monthlyTrend, ltifrTrend,
  } = kpiMetrics

  const preStartPct = Math.round((preStartsDoneToday / preStartsScheduled) * 100)
  const toolboxPct = Math.round((toolboxTalksThisMonth / toolboxTalksTarget) * 100)
  const inspectionPct = Math.round((inspectionsOnTime / inspectionsScheduled) * 100)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="KPI Dashboard"
        description="Real-time compliance scoring and performance indicators"
        action={{ label: 'Export Report', icon: <FileText size={14} /> }}
      />

      {/* Overall Compliance + Module Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center gap-4">
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="var(--accent)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - companyInfo.complianceScore / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-black dark:text-white">{companyInfo.complianceScore}</span>
              <span className="text-[10px] text-neutral-400 font-medium">/ 100</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-semibold text-black dark:text-white text-sm">Overall Compliance</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Audit readiness: {companyInfo.auditReadiness}%</p>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
              <span>Audit Readiness</span>
              <span className="font-bold text-black dark:text-white">{companyInfo.auditReadiness}%</span>
            </div>
            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[var(--accent-bg)]" style={{ width: `${companyInfo.auditReadiness}%` }} />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-3 grid grid-cols-3 gap-3">
          {companyInfo.areas.map((area, idx) => {
            const Icon = moduleIcons[idx]
            const tl = trafficLight(area.score)
            return (
              <Card key={area.name} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg ${tl.bg} flex items-center justify-center`}>
                    <Icon size={15} className={tl.text} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${tl.dot}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${tl.text}`}>{tl.label}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-black dark:text-white">{area.score}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{area.name}</p>
                <div className="mt-2 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${area.score}%`, backgroundColor: tl.bar }} />
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-black dark:text-white">Compliance Score Trend</p>
              <p className="text-xs text-neutral-400 mt-0.5">6-month rolling average</p>
            </div>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">↑ +8 pts</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthlyTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[65, 90]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#4ade80" strokeDasharray="4 2" strokeWidth={1} />
              <Line type="monotone" dataKey="score" name="Score" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-black dark:text-white">LTIFR Trend</p>
              <p className="text-xs text-neutral-400 mt-0.5">Lost Time Injury Frequency Rate</p>
            </div>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">↓ from 4.1</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={ltifrTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={3.0} stroke="#fbbf24" strokeDasharray="4 2" strokeWidth={1} />
              <Line type="monotone" dataKey="value" name="LTIFR" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Lagging + Leading Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lagging */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={16} className="text-red-500" />
            <p className="font-semibold text-black dark:text-white">Lagging Indicators</p>
            <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full ml-auto">Reactive</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'LTIFR', value: ltifr.toFixed(1), sub: 'Lost Time Injury Frequency', icon: Activity, good: ltifr < 3, unit: 'per M hrs' },
              { label: 'TRIFR', value: trifr.toFixed(1), sub: 'Total Recordable Injury Frequency', icon: AlertTriangle, good: trifr < 10, unit: 'per M hrs' },
              { label: 'MTIFR', value: mtifr.toFixed(1), sub: 'Medical Treatment Injury Frequency', icon: AlertTriangle, good: mtifr < 4, unit: 'per M hrs' },
              { label: 'Near Miss Rate', value: nearMissFrequency.toFixed(1), sub: 'Near miss frequency rate', icon: Target, good: true, unit: 'per M hrs' },
              { label: 'Days Lost', value: daysLostToInjury, sub: 'Total days lost to injury (YTD)', icon: Clock, good: daysLostToInjury < 15, unit: 'days' },
            ].map(({ label, value, sub, icon: Icon, good, unit }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${good ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <Icon size={14} className={good ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-black dark:text-white">{label}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-black dark:text-white">{value}</span>
                      <span className="text-[10px] text-neutral-400">{unit}</span>
                      <div className={`w-2 h-2 rounded-full ${good ? 'bg-green-400' : 'bg-red-400'}`} />
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Leading */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-green-500" />
            <p className="font-semibold text-black dark:text-white">Leading Indicators</p>
            <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full ml-auto">Proactive</span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Pre-Starts Completed', done: preStartsDoneToday, total: preStartsScheduled, pct: preStartPct },
              { label: 'Toolbox Talks (Month)', done: toolboxTalksThisMonth, total: toolboxTalksTarget, pct: toolboxPct },
              { label: 'Inspections On Time', done: inspectionsOnTime, total: inspectionsScheduled, pct: inspectionPct },
            ].map(({ label, done, total, pct }) => {
              const tl = trafficLight(pct)
              return (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <p className="font-medium text-black dark:text-white">{label}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-black dark:text-white">{done}/{total}</span>
                      <span className={`text-xs font-bold ${tl.text}`}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: tl.bar }} />
                  </div>
                </div>
              )
            })}

            <div className="pt-1 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-black dark:text-white">Hazards Reported (Month)</p>
                <span className="text-sm font-bold text-black dark:text-white">{hazardsReportedThisMonth}</span>
              </div>
              <p className="text-[10px] text-neutral-400">Higher numbers indicate a proactive safety culture</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Workforce Compliance + Operational Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Workforce Compliance */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {[
            { label: 'Workers with current licences', value: workersWithCurrentLicences, icon: UserCheck },
            { label: 'Contractors fully pre-qualified', value: contractorsFullyQualified, icon: HardHat },
            { label: 'Inductions completed', value: inductionsCompletedRate, icon: CheckCircle2 },
            { label: 'Training completion rate', value: trainingCompletionRate, icon: GraduationCap },
          ].map(({ label, value, icon: Icon }) => {
            const tl = trafficLight(value)
            return (
              <Card key={label} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg ${tl.bg} flex items-center justify-center`}>
                    <Icon size={13} className={tl.text} />
                  </div>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300 leading-tight">{label}</p>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <p className="text-2xl font-bold text-black dark:text-white">{value}%</p>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${tl.dot}`} />
                    <span className={`text-xs font-semibold ${tl.text}`}>{tl.label}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: tl.bar }} />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Operational Metrics */}
        <Card className="p-5">
          <p className="font-semibold text-black dark:text-white mb-4">Operational Metrics</p>
          <div className="space-y-3">
            {[
              { label: 'Open CAPAs', value: openCAPAs, sub: `${overdueCAPAs} overdue`, icon: Wrench, warn: overdueCAPAs > 0 },
              { label: 'CAPA Closure Rate', value: `${onTimeCAPAClosureRate}%`, sub: 'on-time closure', icon: CheckCircle2, warn: onTimeCAPAClosureRate < 80 },
              { label: 'Overdue Doc Reviews', value: overdueDocReviews, sub: 'documents need review', icon: FileText, warn: overdueDocReviews > 0 },
              { label: 'Active Permits', value: activePermits, sub: `${expiringPermits} expiring soon`, icon: Shield, warn: expiringPermits > 0 },
            ].map(({ label, value, sub, icon: Icon, warn }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${warn ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                  <Icon size={14} className={warn ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-black dark:text-white">{label}</p>
                    <span className={`text-sm font-bold ${warn ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>{value}</span>
                  </div>
                  <p className="text-[10px] text-neutral-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 text-xs" variant="outline">
            View Full Report <ArrowRight size={12} className="ml-1" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
