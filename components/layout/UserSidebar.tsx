'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, UserCheck, HardHat, GraduationCap,
  Settings2, MapPin, FolderOpen, AlertTriangle,
  ClipboardCheck, ClipboardList, FileSignature, KeyRound,
  MessagesSquare, MessageSquare, Wrench, BarChart3,
  FileBarChart2, BookOpen, CheckSquare, Zap, Trophy,
  LogOut, ChevronDown, ChevronRight, Home, CalendarDays,
  FileCheck2, ImageIcon, Palette, CreditCard, ShieldAlert, ShieldCheck,
} from 'lucide-react'
import { userProfile } from '@/lib/gamification'

type NavItem  = { href: string; label: string; icon: React.ElementType; badge?: number; exact?: boolean }
type NavGroup = { label: string | null; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { href: '/dashboard/workers',        label: 'Workers',         icon: UserCheck,     badge: 2 },
      { href: '/dashboard/contractors',    label: 'Contractors',     icon: HardHat,       badge: 1 },
      { href: '/dashboard/training',       label: 'Training',        icon: GraduationCap           },
      { href: '/dashboard/communications', label: 'Communications',  icon: MessageSquare, badge: 8 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/dashboard/equipment', label: 'Equipment & Plant', icon: Settings2  },
      { href: '/dashboard/sites',     label: 'Sites',            icon: MapPin      },
      { href: '/dashboard/documents', label: 'Documents',        icon: FolderOpen  },
    ],
  },
  {
    label: 'Safety',
    items: [
      { href: '/dashboard/sms',                label: 'Safety Mgmt System',   icon: ShieldCheck             },
      { href: '/dashboard/incidents',          label: 'Incidents & Hazards',  icon: AlertTriangle, badge: 2 },
      { href: '/dashboard/inspections',        label: 'Inspections',          icon: ClipboardCheck          },
      { href: '/dashboard/swms',               label: 'SWMS / JSEA',          icon: FileSignature           },
      { href: '/dashboard/prestart',           label: 'Pre-start Checklists', icon: ClipboardList           },
      { href: '/dashboard/permits',            label: 'Permits to Work',      icon: KeyRound,      badge: 2 },
      { href: '/dashboard/toolbox',            label: 'Toolbox Talks',        icon: MessagesSquare          },
      { href: '/dashboard/corrective-actions', label: 'Corrective Actions',   icon: Wrench,        badge: 4 },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { href: '/dashboard/kpi',       label: 'KPI Dashboard',  icon: BarChart3    },
      { href: '/dashboard/reports',   label: 'Reports',        icon: FileBarChart2 },
      { href: '/dashboard/registers', label: 'Risk Registers', icon: BookOpen     },
      { href: '/dashboard/tasks',     label: 'Tasks',          icon: CheckSquare, badge: 4 },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { href: '/dashboard/ai-templates', label: 'AI Template Generator', icon: Zap    },
      { href: '/dashboard/achievements', label: 'Achievements',          icon: Trophy },
    ],
  },
  {
    label: 'Build Management',
    items: [
      { href: '/dashboard/build',               label: 'Project Overview', icon: Home,        exact: true },
      { href: '/dashboard/build/schedule',      label: 'Schedule',         icon: CalendarDays              },
      { href: '/dashboard/build/quotes',        label: 'Quote Approvals',  icon: FileCheck2,  badge: 3    },
      { href: '/dashboard/build/financials',    label: 'Financials',       icon: CreditCard               },
      { href: '/dashboard/build/updates',       label: 'Progress Updates', icon: ImageIcon                },
      { href: '/dashboard/build/diary',         label: 'Site Diary',       icon: BookOpen                 },
      { href: '/dashboard/build/selections',    label: 'Selections',       icon: Palette                  },
      { href: '/dashboard/build/risks',         label: 'Risk Register',    icon: ShieldAlert, badge: 2    },
      { href: '/dashboard/build/ai',            label: 'AI Build Tools',   icon: Zap                      },
    ],
  },
]

const ACCENT = '#FFD940'

export function UserSidebar() {
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

  const xpPct = Math.round((userProfile.xp / userProfile.xpToNextLevel) * 100)

  const activeStyle  = { background: ACCENT, color: '#000' }
  const inactiveStyle = { color: '#64748b' }

  return (
    <aside className="w-56 h-full flex flex-col flex-shrink-0 border-r"
      style={{ background: '#fff', borderColor: '#e2e8f0' }}>

      {/* Logo */}
      <div className="h-12 flex items-center px-4 flex-shrink-0 border-b"
        style={{ borderColor: '#e2e8f0' }}>
        <span className="font-black" style={{ fontSize: 18, letterSpacing: '-0.3px', color: '#000' }}>
          Briesa
        </span>
      </div>

      {/* Nav */}
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
                        style={{ color: active ? '#000' : '#94a3b8' }} />
                      <span className="flex-1 truncate">{label}</span>
                      {badge != null && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none"
                          style={active
                            ? { background: 'rgba(0,0,0,0.15)', color: '#000' }
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
                          style={{ color: active ? '#000' : '#94a3b8' }} />
                        <span className="flex-1 truncate">{label}</span>
                        {badge != null && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none"
                            style={active
                              ? { background: 'rgba(0,0,0,0.15)', color: '#000' }
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

        {/* Log Out */}
        <div className="pt-2 mt-2 border-t" style={{ borderColor: '#e2e8f0' }}>
          <Link href="/"
            className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors"
            style={{ color: '#94a3b8' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#fef2f2'
              ;(e.currentTarget as HTMLElement).style.color = '#ef4444'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = ''
              ;(e.currentTarget as HTMLElement).style.color = '#94a3b8'
            }}
          >
            <LogOut size={14} className="shrink-0" style={{ color: 'inherit' }} />
            <span>Log Out</span>
          </Link>
        </div>
      </nav>

      {/* XP bar */}
      <div className="flex-shrink-0 border-t" style={{ borderColor: '#e2e8f0' }}>
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black px-1.5 py-0.5 leading-none"
                style={{ background: ACCENT, color: '#000' }}>
                LV{userProfile.level}
              </span>
              <span className="text-[10px] font-medium" style={{ color: '#94a3b8' }}>
                {userProfile.levelName}
              </span>
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#92400e' }}>
              🔥 {userProfile.streak}d
            </span>
          </div>
          <div className="h-px w-full" style={{ background: '#e2e8f0' }}>
            <div className="h-full transition-all duration-700"
              style={{ width: `${xpPct}%`, background: ACCENT }} />
          </div>
        </div>

        {/* User row */}
        <div className="flex items-center gap-2.5 px-3 pb-3">
          <div className="w-7 h-7 flex items-center justify-center text-[10px] font-black flex-shrink-0"
            style={{ background: ACCENT, color: '#000' }}>
            SM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#0f172a' }}>Sarah Mitchell</p>
            <p className="text-[10px] truncate" style={{ color: '#94a3b8' }}>
              #{userProfile.rank} · {userProfile.totalPoints.toLocaleString()} pts
            </p>
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
