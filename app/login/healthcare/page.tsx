import { IndustryLogin } from '@/components/auth/IndustryLogin'

export default function HealthcareLoginPage() {
  return (
    <IndustryLogin
      label="Briesa Healthcare"
      tagline="Clinical & Regulatory Compliance"
      accent="#059669"
      accentText="#fff"
      photo="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=80"
      dashboard="/healthcare"
      headline={['Clinical.', 'Governed.', 'Accredited.']}
      features={[
        'AHPRA register & credentialling',
        'NSQHS accreditation tracking',
        'Clinical incident reporting',
        'Infection prevention & control',
        'S8 drug register & medication safety',
        'Mandatory training matrix',
      ]}
      backHref="/"
    />
  )
}
