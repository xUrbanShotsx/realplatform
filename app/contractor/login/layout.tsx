// This layout intentionally overrides the parent /contractor layout
// so the login page renders without the sidebar.
export default function ContractorLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
