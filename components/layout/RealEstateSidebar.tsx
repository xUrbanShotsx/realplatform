'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Home, Building2, FileText, ShieldCheck,
  DollarSign, Users, FileCheck, ClipboardList, AlertCircle,
  Settings, LogOut, ChevronDown, ChevronRight, Zap,
  BookOpen, CreditCard, Key, UserCheck, BarChart3,
  Bell, Scale, Search,
} from 'lucide-react'

const RE_ACCENT = '#2563EB'

type NavItem  = { href: string; label: string; icon: React.ElementType; badge?: number; exact?: boolean }
type NavGroup = { label: string | null; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { href: '/real-estate', label: 'Overview', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Sales',
    items: [
      { href: '/real-estate/listings',   label: 'Listings',          icon: Home,          badge: 4 },
      { href: '/real-estate/contracts',  label: 'Contracts',         icon: FileText                },
      { href: '/real-estate/auctions',   label: 'Auctions',          icon: Scale                   },
    ],
  },
  {
    label: 'Property Management',
    items: [
      { href: '/real-estate/property-management', label: 'PM Properties',   icon: Building2,   badge: 2 },
      { href: '/real-estate/inspections',         label: 'Inspections',     icon: ClipboardList         },
      { href: '/real-estate/maintenance',         label: 'Maintenance',     icon: Settings,    badge: 3 },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { href: '/real-estate/aml',         label: 'AML / KYC Checker',    icon: Search,    badge: 2 },
      { href: '/real-estate/licences',    label: 'Licences & CPD',        icon: Key,       badge: 2 },
      { href: '/real-estate/policies',    label: 'Policies & Procedures', icon: BookOpen,  badge: 2 },
      { href: '/real-estate/disclosures', label: 'Disclosures',           icon: FileCheck          },
    ],
  },
  {
    label: 'Trust & Finance',
    items: [
      { href: '/real-estate/trust-account', label: 'Trust Account',    icon: DollarSign },
      { href: '/real-estate/payroll',       label: 'Payroll',          icon: CreditCard },
      { href: '/real-estate/commissions',   label: 'Commissions',      icon: BarChart3  },
    ],
  },
  {
    label: 'Team',
    items: [
      { href: '/real-estate/agents',  label: 'Agents',    icon: Users    },
      { href: '/real-estate/clients', label: 'Clients',   icon: UserCheck },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { href: '/real-estate/ai',      label: 'AI Document Generator', icon: Zap       },
      { href: '/real-estate/alerts',  label: 'Alerts',                icon: Bell       },
      { href: '/real-estate/reports', label: 'Reports',               icon: BarChart3  },
    ],
  },
]

const activeStyle  = { background: RE_ACCENT, color: '#fff' }
const inactiveStyle = { color: '#64748b' }

export function RealEstateSidebar() {
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

      {/* Logo */}
      <div className="h-12 flex items-center justify-between px-4 flex-shrink-0 border-b"
        style={{ borderColor: '#e2e8f0' }}>
        <span className="font-black" style={{ fontSize: 18, letterSpacing: '-0.3px', color: '#000' }}>
          Briesa
        </span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase"
          style={{ background: RE_ACCENT + '15', color: RE_ACCENT }}>RE</span>
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
              ;(e.currentTarget as HTMLElement).style.background = '#eff6ff'
              ;(e.currentTarget as HTMLElement).style.color = RE_ACCENT
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
            style={{ background: RE_ACCENT, color: '#fff' }}>
            JT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#0f172a' }}>James Thornton</p>
            <p className="text-[10px] truncate" style={{ color: '#94a3b8' }}>Principal Licensee</p>
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
