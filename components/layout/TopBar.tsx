'use client'

import { Bell, Search, HelpCircle, Award, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface TopBarProps {
  title?:   string
  variant?: 'user' | 'admin' | 'contractor'
}

export function TopBar({ title, variant = 'user' }: TopBarProps) {
  const isAdmin      = variant === 'admin'
  const isContractor = variant === 'contractor'

  return (
    <header className="h-12 flex items-center px-5 flex-shrink-0 border-b"
      style={{ background: '#fff', borderColor: '#e2e8f0' }}>

      <div className="flex-1">
        {title && (
          <p className="text-[10px] font-medium uppercase tracking-[2px]"
            style={{ color: '#94a3b8' }}>
            {title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">

        <div className="relative hidden md:flex items-center mr-3">
          <Search size={11} className="absolute left-0" style={{ color: '#94a3b8' }} />
          <input
            placeholder="Search…"
            className="pl-5 w-40 text-xs bg-transparent outline-none pb-px"
            style={{
              borderBottom: '1px solid #e2e8f0',
              color: '#0f172a',
              caretColor: '#FFD940',
            }}
            onFocus={e  => (e.currentTarget.style.borderBottomColor = '#FFD940')}
            onBlur={e   => (e.currentTarget.style.borderBottomColor = '#e2e8f0')}
          />
        </div>

        <button className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ color: '#94a3b8' }}>
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#ef4444' }} />
        </button>

        <button className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ color: '#94a3b8' }}>
          <HelpCircle size={14} />
        </button>

        {!isAdmin && !isContractor && (
          <>
            <Link href="/dashboard/communications"
              className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ color: '#94a3b8' }}
              title="Communications">
              <MessageSquare size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#ef4444' }} />
            </Link>

            <Link href="/dashboard/iso"
              className="flex items-center gap-1.5 px-2.5 h-7 text-[10px] font-bold transition-opacity hover:opacity-80 ml-1 uppercase tracking-[1px]"
              style={{ background: '#FFD940', color: '#000' }}
              title="Generate ISO-ready documentation">
              <Award size={11} />ISO Docs
            </Link>
          </>
        )}

        <div className="text-[9px] font-bold uppercase tracking-[2px] px-2 py-1 ml-1 border"
          style={{
            borderColor: isAdmin ? '#e8c200' : '#e2e8f0',
            color:       isAdmin ? '#854d0e' : '#94a3b8',
            background:  isAdmin ? '#fef9c3' : 'transparent',
          }}>
          {isAdmin ? 'Admin' : isContractor ? 'Contractor' : 'Acme Construction'}
        </div>
      </div>
    </header>
  )
}
