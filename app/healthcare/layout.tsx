import { HealthcareSidebar } from '@/components/layout/HealthcareSidebar'
import { TopBar } from '@/components/layout/TopBar'

export default function HealthcareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-canvas)' }}>
      <HealthcareSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar variant="user" />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
