'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Briefcase, FileText, User, LogOut,
  AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { contractorProfile, contractorOwnDocs, contractorJobs } from '@/lib/mock-data'

const navItems = [
  { href: '/contractor',           label: 'Overview',     icon: LayoutDashboard, exact: true },
  { href: '/contractor/jobs',      label: 'My Jobs',      icon: Briefcase                   },
  { href: '/contractor/documents', label: 'My Documents', icon: FileText                    },
  { href: '/contractor/profile',   label: 'Profile',      icon: User                        },
]

const activeStyle   = { background: '#FFD940', color: '#000' }
const inactiveStyle = { color: 'rgba(255,255,255,0.45)' }

export function ContractorSidebar() {
  const pathname = usePathname()
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const expiringDocs     = contractorOwnDocs.filter(d => d.status === 'expiring' || d.status === 'expired').length
  const pendingSubmissions = contractorJobs.flatMap(j => j.requiredDocs).filter(d => d.status === 'not-submitted' && d.required).length

  return (
    <aside className="w-52 h-full flex flex-col flex-shrink-0 border-r"
      style={{ background: '#000', borderColor: '#1e1e1e' }}>

      {/* Logo */}
      <div className="h-12 flex items-center px-4 flex-shrink-0 border-b gap-2"
        style={{ borderColor: '#1e1e1e' }}>
        <span className="font-black text-white" style={{ fontSize: 18, letterSpacing: '-0.3px' }}>
          Briesa
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[3px] px-1.5 py-0.5 ml-1"
          style={{ color: 'rgba(255,255,255,0.35)', border: '1px solid #1e1e1e' }}>
          Contractor
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[3px]"
          style={{ color: 'rgba(255,255,255,0.18)' }}>
          Portal
        </p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          const badge =
            href === '/contractor/documents' ? expiringDocs :
            href === '/contractor/jobs'      ? pendingSubmissions : undefined

          return (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors"
              style={active ? activeStyle : inactiveStyle}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '' }}
            >
              <Icon size={14} className="shrink-0"
                style={{ color: active ? '#000' : 'rgba(255,255,255,0.28)' }} />
              <span className="flex-1 truncate">{label}</span>
              {badge != null && badge > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none"
                  style={active
                    ? { background: 'rgba(0,0,0,0.2)', color: '#000' }
                    : { background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
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

      {/* Compliance status */}
      <div className="mx-3 mb-3 px-3 py-2.5 border" style={{ borderColor: '#1e1e1e', background: '#0d0d0d' }}>
        {expiringDocs > 0 ? (
          <div className="flex items-start gap-2">
            <AlertTriangle size={11} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="text-[11px] font-bold" style={{ color: '#f59e0b' }}>Action required</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {expiringDocs} doc{expiringDocs !== 1 ? 's' : ''} expiring
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle2 size={11} style={{ color: '#22c55e' }} />
            <p className="text-[11px] font-semibold" style={{ color: '#22c55e' }}>Documents current</p>
          </div>
        )}
      </div>

      {/* User row */}
      <div className="flex items-center gap-2.5 px-3 pb-3 border-t pt-3"
        style={{ borderColor: '#1e1e1e' }}>
        <div className="w-7 h-7 flex items-center justify-center text-[10px] font-black flex-shrink-0"
          style={{ background: '#FFD940', color: '#000' }}>
          {contractorProfile.contactName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate text-white">{contractorProfile.contactName}</p>
          <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {contractorProfile.companyName}
          </p>
        </div>
        <Link href="/" className="p-1 transition-opacity hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          <LogOut size={13} />
        </Link>
      </div>
    </aside>
  )
}
