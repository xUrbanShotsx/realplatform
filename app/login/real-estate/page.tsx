import { IndustryLogin } from '@/components/auth/IndustryLogin'

export default function RealEstateLoginPage() {
  return (
    <IndustryLogin
      label="Briesa Real Estate"
      tagline="Property & Agent Compliance"
      accent="#2563EB"
      accentText="#fff"
      photo="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80"
      dashboard="/real-estate"
      headline={['Licence.', 'Trust.', 'Compliant.']}
      features={[
        'AML / KYC checks for buyers & sellers',
        'Licence & CPD register',
        'Trust account reconciliation',
        'Property management compliance',
        'Policies & procedures library',
        'Listing & PM checklist automation',
      ]}
      backHref="/"
    />
  )
}
