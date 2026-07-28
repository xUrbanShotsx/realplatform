'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, Users, LayoutTemplate,
  CreditCard, Settings, ChevronLeft, LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/admin',           label: 'Overview',   icon: LayoutDashboard },
  { href: '/admin/clients',   label: 'Clients',    icon: Building2       },
  { href: '/admin/users',     label: 'Users',      icon: Users           },
  { href: '/admin/templates', label: 'Templates',  icon: LayoutTemplate  },
  { href: '/admin/billing',   label: 'Billing',    icon: CreditCard      },
  { href: '/admin/settings',  label: 'Settings',   icon: Settings        },
]

const activeStyle  = { background: '#FFD940', color: '#000' }
const inactiveStyle = { color: 'rgba(255,255,255,0.45)' }

export function AdminSidebar() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <aside className="w-56 h-full flex flex-col flex-shrink-0 border-r"
      style={{ background: '#000', borderColor: '#1e1e1e' }}>

      {/* Logo */}
      <div className="h-12 flex items-center px-4 flex-shrink-0 border-b gap-2"
        style={{ borderColor: '#1e1e1e' }}>
        <span className="font-black text-white" style={{ fontSize: 18, letterSpacing: '-0.3px' }}>
          Briesa
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[3px] px-1.5 py-0.5 ml-1"
          style={{ color: '#FFD940', border: '1px solid rgba(255,217,64,0.3)' }}>
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[3px]"
          style={{ color: 'rgba(255,255,255,0.18)' }}>
          Platform
        </p>
        <div className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href}
                className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors"
                style={active ? activeStyle : inactiveStyle}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '' }}
              >
                <Icon size={14} className="shrink-0"
                  style={{ color: active ? '#000' : 'rgba(255,255,255,0.28)' }} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-4 pt-3 border-t" style={{ borderColor: '#1e1e1e' }}>
          <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[3px]"
            style={{ color: 'rgba(255,255,255,0.18)' }}>
            Quick Links
          </p>
          <Link href="/dashboard"
            className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors"
            style={inactiveStyle}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
          >
            <ChevronLeft size={14} className="shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }} />
            <span>User View</span>
          </Link>
        </div>

        {/* Log Out */}
        <div className="pt-2 mt-2 border-t" style={{ borderColor: '#1e1e1e' }}>
          <Link href="/"
            className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
              ;(e.currentTarget as HTMLElement).style.color = '#f87171'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = ''
              ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'
            }}
          >
            <LogOut size={14} className="shrink-0" style={{ color: 'inherit' }} />
            <span>Log Out</span>
          </Link>
        </div>
      </nav>

      {/* Admin user row */}
      <div className="p-3 border-t flex-shrink-0" style={{ borderColor: '#1e1e1e' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center text-[10px] font-black flex-shrink-0"
            style={{ background: '#FFD940', color: '#000' }}>
            BA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-white">Briesa Admin</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
              System Administrator
            </p>
          </div>
          <Link href="/" className="p-1 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            <LogOut size={13} />
          </Link>
        </div>
      </div>
    </aside>
  )
}
