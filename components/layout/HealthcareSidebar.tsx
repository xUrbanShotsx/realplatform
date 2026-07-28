'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, ShieldCheck, Activity, Pill,
  ClipboardList, Heart, Lock, Wrench, BarChart3,
  LogOut, ChevronDown, ChevronRight, Zap, Bell,
  FileText, AlertTriangle, Thermometer, Stethoscope,
  BookOpen, CreditCard, UserCheck, Microscope,
} from 'lucide-react'

const HC_ACCENT = '#059669'

type NavItem  = { href: string; label: string; icon: React.ElementType; badge?: number; exact?: boolean }
type NavGroup = { label: string | null; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { href: '/healthcare', label: 'Overview', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { href: '/healthcare/practitioners', label: 'AHPRA Register',    icon: UserCheck,  badge: 2 },
      { href: '/healthcare/training',      label: 'Mandatory Training', icon: BookOpen,   badge: 5 },
      { href: '/healthcare/payroll',       label: 'Payroll Compliance', icon: CreditCard           },
    ],
  },
  {
    label: 'Clinical Governance',
    items: [
      { href: '/healthcare/incidents',       label: 'Incident Reporting',  icon: AlertTriangle, badge: 3 },
      { href: '/healthcare/accreditation',   label: 'NSQHS Accreditation', icon: ShieldCheck             },
      { href: '/healthcare/clinical-audits', label: 'Clinical Audits',     icon: ClipboardList           },
      { href: '/healthcare/indicators',      label: 'Clinical Indicators', icon: BarChart3               },
    ],
  },
  {
    label: 'Infection Control',
    items: [
      { href: '/healthcare/infection-control', label: 'IPC Dashboard',       icon: Microscope  },
      { href: '/healthcare/vaccinations',      label: 'Vaccination Records', icon: Thermometer },
      { href: '/healthcare/hand-hygiene',      label: 'Hand Hygiene',        icon: Activity    },
    ],
  },
  {
    label: 'Medication Safety',
    items: [
      { href: '/healthcare/medications', label: 'Medication Management', icon: Pill,     badge: 1 },
      { href: '/healthcare/s8-register', label: 'S8 Drug Register',      icon: FileText, badge: 1 },
      { href: '/healthcare/pharmacy',    label: 'PBS Compliance',        icon: Heart              },
    ],
  },
  {
    label: 'Privacy & Data',
    items: [
      { href: '/healthcare/privacy',           label: 'Privacy Compliance',  icon: Lock,       badge: 1 },
      { href: '/healthcare/my-health-records', label: 'My Health Records',   icon: Stethoscope          },
    ],
  },
  {
    label: 'Facilities & WHS',
    items: [
      { href: '/healthcare/whs',       label: 'WHS Compliance',        icon: ShieldCheck, badge: 3 },
      { href: '/healthcare/equipment', label: 'Equipment & Biomedical', icon: Wrench,      badge: 2 },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { href: '/healthcare/ai',      label: 'AI Document Generator',  icon: Zap       },
      { href: '/healthcare/alerts',  label: 'Alerts & Notifications', icon: Bell      },
      { href: '/healthcare/reports', label: 'Reports',                icon: BarChart3 },
    ],
  },
]

const activeStyle   = { background: HC_ACCENT, color: '#fff' }
const inactiveStyle = { color: '#64748b' }

export function HealthcareSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const initialOpen = Object.fromEntries(
    navGroups
      .filter(g => g.label !== null)
      .map(g => [g.label!, g.items.some(i => isActive(i.href, i.exact))])
  )
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen)
  const toggle = (label: string) => setOpenGroups(p => ({ ...p, [label]: !p[label] }))

  return (
    <aside className="w-56 h-full flex flex-col flex-shrink-0 border-r"
      style={{ background: '#fff', borderColor: '#e2e8f0' }}>

      <div className="h-12 flex items-center justify-between px-4 flex-shrink-0 border-b"
        style={{ borderColor: '#e2e8f0' }}>
        <span className="font-black" style={{ fontSize: 18, letterSpacing: '-0.3px', color: '#000' }}>
          Briesa
        </span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase"
          style={{ background: HC_ACCENT + '15', color: HC_ACCENT }}>HC</span>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {navGroups.map((group, gi) => {

          if (group.label === null) {
            return (
              <div key={gi} className="mb-1">
                {group.items.map(({ href, label, icon: Icon, badge, exact }) => {
                  const active = isActive(href, exact)
                  return (
                    <Link key={href} href={href}
                      className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors"
                      style={active ? activeStyle : inactiveStyle}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f1f5f9' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '' }}
                    >
                      <Icon size={14} className="shrink-0"
                        style={{ color: active ? '#fff' : '#94a3b8' }} />
                      <span className="flex-1 truncate">{label}</span>
                      {badge != null && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none"
                          style={active
                            ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                            : { background: '#e2e8f0', color: '#475569' }}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )
          }

          const isOpen    = openGroups[group.label] ?? false
          const hasActive = group.items.some(i => isActive(i.href, i.exact))

          return (
            <div key={gi} className="pt-1">
              <button onClick={() => toggle(group.label!)}
                className="w-full flex items-center justify-between px-2 py-1.5 transition-colors"
                style={{ background: 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
              >
                <span className="text-[9px] font-bold uppercase tracking-[3px]"
                  style={{ color: hasActive ? '#64748b' : '#94a3b8' }}>
                  {group.label}
                </span>
                {isOpen
                  ? <ChevronDown size={10} style={{ color: '#94a3b8' }} />
                  : <ChevronRight size={10} style={{ color: '#cbd5e1' }} />}
              </button>

              {isOpen && (
                <div className="space-y-0.5 mt-0.5">
                  {group.items.map(({ href, label, icon: Icon, badge, exact }) => {
                    const active = isActive(href, exact)
                    return (
                      <Link key={href} href={href}
                        className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors"
                        style={active ? activeStyle : inactiveStyle}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f1f5f9' }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '' }}
                      >
                        <Icon size={14} className="shrink-0"
                          style={{ color: active ? '#fff' : '#94a3b8' }} />
                        <span className="flex-1 truncate">{label}</span>
                        {badge != null && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none"
                            style={active
                              ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                              : { background: '#e2e8f0', color: '#475569' }}>
                            {badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <div className="pt-2 mt-2 border-t" style={{ borderColor: '#e2e8f0' }}>
          <Link href="/"
            className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors"
            style={{ color: '#94a3b8' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#f0fdf4'
              ;(e.currentTarget as HTMLElement).style.color = HC_ACCENT
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = ''
              ;(e.currentTarget as HTMLElement).style.color = '#94a3b8'
            }}
          >
            <LogOut size={14} className="shrink-0" style={{ color: 'inherit' }} />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      <div className="flex-shrink-0 border-t p-3" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center text-[10px] font-black flex-shrink-0"
            style={{ background: HC_ACCENT, color: '#fff' }}>
            QM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#0f172a' }}>Quality Manager</p>
            <p className="text-[10px] truncate" style={{ color: '#94a3b8' }}>Briesa Healthcare</p>
          </div>
          <Link href="/" className="p-1 transition-opacity hover:opacity-70"
            style={{ color: '#94a3b8' }}>
            <LogOut size={13} />
          </Link>
        </div>
      </div>
    </aside>
  )
}
