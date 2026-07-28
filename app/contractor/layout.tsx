import { ContractorSidebar } from '@/components/layout/ContractorSidebar'

export default function ContractorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#000' }}>
      <ContractorSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
