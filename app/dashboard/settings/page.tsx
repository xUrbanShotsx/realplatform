'use client'
import React, { useState, useRef } from 'react'
import { User, Building2, Bell, Shield, Key, CreditCard, Globe, ChevronRight, Settings2, Check } from 'lucide-react'

const BORDER = 'rgba(0,0,0,0.09)'
const BLUE = '#4361ee'; const GREEN = '#10b981'; const RED = '#ef4444'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const SECTIONS = [
  { icon: User,      color: BLUE,      label: 'Profile',       desc: 'Name, photo, contact details' },
  { icon: Building2, color: '#06b6d4', label: 'Agency',        desc: 'Office details, logo, ABN' },
  { icon: Bell,      color: '#f59e0b', label: 'Notifications', desc: 'Email, push and in-app alerts' },
  { icon: Globe,     color: GREEN,     label: 'Integrations',  desc: 'REA, Domain, Rex, DocuSign' },
  { icon: Shield,    color: '#8b5cf6', label: 'Privacy',       desc: 'Data, GDPR and access controls' },
  { icon: Key,       color: '#64748b', label: 'Security',      desc: '2FA, sessions, password' },
  { icon: CreditCard,color: '#e3008c', label: 'Billing',       desc: 'Plan, invoices, payment method' },
]

const INTEGRATIONS = [
  { name: 'realestate.com.au', status: 'connected', color: '#e34234' },
  { name: 'Domain.com.au', status: 'connected', color: '#6e2fcc' },
  { name: 'Rex CRM', status: 'disconnected', color: '#1877f2' },
  { name: 'DocuSign', status: 'connected', color: '#ffb03a' },
  { name: 'Mailchimp', status: 'disconnected', color: '#ffe01b' },
  { name: 'Xero', status: 'connected', color: '#13b5ea' },
]

export default function SettingsPage() {
  const [active, setActive]         = useState('Profile')
  const [saved, setSaved]           = useState('')
  const [integrations, setInts]     = useState(INTEGRATIONS)
  const [pwSaved, setPwSaved]       = useState(false)
  const photoRef                    = useRef<HTMLInputElement>(null)

  const handleSave = (section: string) => {
    setSaved(section)
    setTimeout(() => setSaved(''), 2000)
  }
  const toggleInt = (name: string) => setInts(prev => prev.map(i => i.name === name ? { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' } : i))
  const handlePw = () => { setPwSaved(true); setTimeout(() => setPwSaved(false), 2000) }

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: `1px solid ${BORDER}`, background: '#fff', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '20px 16px 12px', fontSize: 11, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em' }}>SETTINGS</div>
        {SECTIONS.map(({ icon: Icon, color, label, desc }) => (
          <button key={label} onClick={() => setActive(label)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', background: active === label ? `${color}08` : 'none', border: 'none', borderLeft: active === label ? `2px solid ${color}` : '2px solid transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
            <Icon size={14} color={active === label ? color : TEXT3} strokeWidth={1.5} />
            <div>
              <div style={{ fontSize: 12, fontWeight: active === label ? 700 : 500, color: active === label ? TEXT : TEXT2 }}>{label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {active === 'Profile' && (
          <div style={{ maxWidth: 540 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 4, letterSpacing: '-0.03em' }}>Profile</div>
            <div style={{ fontSize: 12, color: TEXT3, marginBottom: 24 }}>Your personal details shown across the platform</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px 0', borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ width: 52, height: 52, background: `${BLUE}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: BLUE }}>JS</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Jye San Jurjo</div>
                <div style={{ fontSize: 11, color: TEXT3 }}>Principal Agent · Spinelli RE, Cronulla</div>
              </div>
              <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} />
              <button onClick={() => photoRef.current?.click()} style={{ marginLeft: 'auto', border: `1px solid ${BORDER}`, background: '#fff', color: TEXT2, padding: '6px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Change Photo</button>
            </div>
            {[
              { label: 'First Name', value: 'Jye' },
              { label: 'Last Name', value: 'San Jurjo' },
              { label: 'Email', value: 'jye@spinellire.com' },
              { label: 'Mobile', value: '+61 400 000 000' },
              { label: 'Licence No.', value: '00123456' },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                <input defaultValue={value} style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '8px 10px', fontSize: 13, color: TEXT, background: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <button onClick={() => handleSave('Profile')} style={{ background: saved === 'Profile' ? GREEN : BLUE, border: 'none', color: '#fff', padding: '9px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}>
              {saved === 'Profile' && <Check size={13} />}{saved === 'Profile' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        )}

        {active === 'Agency' && (
          <div style={{ maxWidth: 540 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 4, letterSpacing: '-0.03em' }}>Agency Details</div>
            <div style={{ fontSize: 12, color: TEXT3, marginBottom: 24 }}>Office information used on documents and portals</div>
            {[
              { label: 'Agency Name', value: 'Spinelli Real Estate' },
              { label: 'ABN', value: '12 345 678 901' },
              { label: 'Real Estate Licence', value: '00123456' },
              { label: 'Office Address', value: '1 Cronulla St, Cronulla NSW 2230' },
              { label: 'Office Phone', value: '(02) 9527 0000' },
              { label: 'Website', value: 'www.spinellire.com.au' },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                <input defaultValue={value} style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '8px 10px', fontSize: 13, color: TEXT, background: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <button onClick={() => handleSave('Agency')} style={{ background: saved === 'Agency' ? GREEN : BLUE, border: 'none', color: '#fff', padding: '9px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}>
              {saved === 'Agency' && <Check size={13} />}{saved === 'Agency' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        )}

        {active === 'Integrations' && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 4, letterSpacing: '-0.03em' }}>Integrations</div>
            <div style={{ fontSize: 12, color: TEXT3, marginBottom: 24 }}>Connect external platforms and services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {integrations.map((int, i) => (
                <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, background: int.color, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{int.name}</div>
                    <div style={{ fontSize: 10, color: int.status === 'connected' ? GREEN : TEXT3, fontWeight: 700, marginTop: 1 }}>{int.status === 'connected' ? 'Connected' : 'Not connected'}</div>
                  </div>
                  <button onClick={() => toggleInt(int.name)} style={{ border: `1px solid ${int.status === 'connected' ? BORDER : BLUE}`, background: int.status === 'connected' ? '#fff' : `${BLUE}10`, color: int.status === 'connected' ? RED : BLUE, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {int.status === 'connected' ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'Security' && (
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 4, letterSpacing: '-0.03em' }}>Security</div>
            <div style={{ fontSize: 12, color: TEXT3, marginBottom: 24 }}>Two-factor authentication and session management</div>
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '16px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: 11, color: TEXT3 }}>Secure your account with an authenticator app</div>
                </div>
                <div style={{ background: `${GREEN}12`, padding: '3px 10px', fontSize: 10, color: GREEN, fontWeight: 700 }}>ENABLED</div>
              </div>
            </div>
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '16px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Change Password</div>
              {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: TEXT3, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                  <input type="password" style={{ width: '100%', border: `1px solid ${BORDER}`, padding: '8px 10px', fontSize: 13, color: TEXT, background: '#f8fafc', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <button onClick={handlePw} style={{ background: pwSaved ? GREEN : BLUE, border: 'none', color: '#fff', padding: '9px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}>
                {pwSaved && <Check size={13} />}{pwSaved ? 'Password Updated!' : 'Update Password'}
              </button>
            </div>
          </div>
        )}

        {!['Profile', 'Agency', 'Integrations', 'Security'].includes(active) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, color: TEXT3, gap: 8 }}>
            <Settings2 size={32} strokeWidth={1} color={TEXT3} style={{ opacity: 0.2 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT2 }}>{active} settings</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Coming soon</div>
          </div>
        )}
      </div>
    </div>
  )
}
