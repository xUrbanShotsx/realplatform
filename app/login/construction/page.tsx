import { IndustryLogin } from '@/components/auth/IndustryLogin'

export default function ConstructionLoginPage() {
  return (
    <IndustryLogin
      label="Briesa Construction"
      tagline="WHS, SWMS & Site Compliance"
      accent="#FFD940"
      accentText="#000"
      photo="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80"
      dashboard="/dashboard"
      headline={['Compliance.', 'Simplified.', 'Audit-ready.']}
      features={[
        'Compliance score & audit readiness',
        'SWMS & permit management',
        'Contractor compliance oversight',
        'Incident & corrective action tracking',
        'Staff training & induction records',
        'Site inspection forms & registers',
      ]}
      backHref="/"
    />
  )
}
