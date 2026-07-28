import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { TopBar } from '@/components/layout/TopBar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#000' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar variant="admin" />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
