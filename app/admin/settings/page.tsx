'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Settings, Bell, Shield, Globe, Database, Mail, CheckCircle2 } from 'lucide-react'

type ToggleKey =
  | 'selfRegistration' | 'require2FA' | 'aiDocGen'
  | 'mobileAccess' | 'auditLogs' | 'publicApi'
  | 'autoBackup' | 'maintenanceMode'

const TOGGLE_DEFS: { key: ToggleKey; label: string; description: string; defaultOn: boolean }[] = [
  { key: 'selfRegistration', label: 'Allow user self-registration',      description: 'Users can sign up without admin invite',              defaultOn: false },
  { key: 'require2FA',       label: 'Require 2FA for admins',            description: 'Enforce two-factor authentication for admin accounts', defaultOn: true  },
  { key: 'aiDocGen',         label: 'AI document generation',            description: 'Enable AI-powered document drafting for clients',     defaultOn: true  },
  { key: 'mobileAccess',     label: 'Mobile app access',                 description: 'Allow access from the Briesa mobile app',             defaultOn: true  },
  { key: 'auditLogs',        label: 'Audit log retention (12 months)',   description: 'Retain full platform audit logs for 12 months',       defaultOn: true  },
  { key: 'publicApi',        label: 'Public API access',                 description: 'Allow clients to access the Briesa REST API',         defaultOn: false },
  { key: 'autoBackup',       label: 'Automatic daily backups',           description: 'Run encrypted backups every 24 hours',               defaultOn: true  },
  { key: 'maintenanceMode',  label: 'Maintenance mode',                  description: 'Show maintenance page to all users (admin only)',     defaultOn: false },
]

type Tab = 'general' | 'notifications' | 'security' | 'integrations'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'general',       label: 'General',       icon: Settings  },
  { key: 'notifications', label: 'Notifications', icon: Bell      },
  { key: 'security',      label: 'Security',      icon: Shield    },
  { key: 'integrations',  label: 'Integrations',  icon: Globe     },
]

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
        {hint && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  )
}

function TextInput({ value, onChange, type = 'text', placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-sm px-3 py-2 text-sm outline-none transition-all"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
    />
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex h-6 w-11 items-center flex-shrink-0 transition-colors"
      style={{ background: on ? 'var(--accent)' : 'var(--bg-secondary)', border: on ? '1px solid var(--accent)' : '1px solid var(--border)' }}
    >
      <span
        className="inline-block h-4 w-4 bg-white shadow transition-transform"
        style={{ transform: on ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [saved, setSaved] = useState(false)

  // General settings state
  const [general, setGeneral] = useState({
    platformName:  'Briesa',
    supportEmail:  'support@briesa.com.au',
    timezone:      'Australia/Sydney',
    currency:      'AUD',
    country:       'Australia',
    dateFormat:    'DD/MM/YYYY',
  })

  // Notification settings state
  const [notifs, setNotifs] = useState({
    expiryWarningDays:  '30',
    overdueFrequency:   'Daily',
    incidentAlertDelay: '0',
    digestEmail:        'Weekly',
  })

  // Security settings state
  const [security, setSecurity] = useState({
    sessionTimeout:      '60',
    minPasswordLength:   '10',
    maxLoginAttempts:    '5',
    ipWhitelist:         '',
  })

  // Feature toggles
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>(
    Object.fromEntries(TOGGLE_DEFS.map(t => [t.key, t.defaultOn])) as Record<ToggleKey, boolean>
  )

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="Settings" description="Platform configuration and system preferences" />

      {/* Tabs */}
      <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-colors"
            style={{
              color: activeTab === key ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: activeTab === key ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none',
              marginBottom: '-1px',
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>General Settings</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Core platform configuration</p>
          </div>
          <div className="px-5">
            <Field label="Platform Name" hint="Displayed in emails and browser title">
              <TextInput value={general.platformName} onChange={v => setGeneral(g => ({ ...g, platformName: v }))} />
            </Field>
            <Field label="Support Email" hint="Where support requests are routed">
              <TextInput type="email" value={general.supportEmail} onChange={v => setGeneral(g => ({ ...g, supportEmail: v }))} />
            </Field>
            <Field label="Default Timezone">
              <TextInput value={general.timezone} onChange={v => setGeneral(g => ({ ...g, timezone: v }))} placeholder="e.g. Australia/Sydney" />
            </Field>
            <Field label="Currency">
              <TextInput value={general.currency} onChange={v => setGeneral(g => ({ ...g, currency: v }))} placeholder="e.g. AUD" />
            </Field>
            <Field label="Date Format">
              <select
                value={general.dateFormat}
                onChange={e => setGeneral(g => ({ ...g, dateFormat: e.target.value }))}
                className="px-3 py-2 text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
          </div>
          <div className="px-5 py-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              Save Changes
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#22c55e' }}>
                <CheckCircle2 size={13} /> Saved!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Notification Settings</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Default alert and email cadence for all clients</p>
          </div>
          <div className="px-5">
            <Field label="Expiry Warning" hint="Days before expiry to trigger alert">
              <TextInput type="number" value={notifs.expiryWarningDays} onChange={v => setNotifs(n => ({ ...n, expiryWarningDays: v }))} />
            </Field>
            <Field label="Overdue Reminder Frequency" hint="How often to re-notify on overdue items">
              <select
                value={notifs.overdueFrequency}
                onChange={e => setNotifs(n => ({ ...n, overdueFrequency: e.target.value }))}
                className="px-3 py-2 text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {['Immediately', 'Daily', 'Every 3 days', 'Weekly'].map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Incident Alert Delay (mins)" hint="Delay before alerting manager on new incident">
              <TextInput type="number" value={notifs.incidentAlertDelay} onChange={v => setNotifs(n => ({ ...n, incidentAlertDelay: v }))} />
            </Field>
            <Field label="Compliance Digest" hint="How often to send summary email to clients">
              <select
                value={notifs.digestEmail}
                onChange={e => setNotifs(n => ({ ...n, digestEmail: e.target.value }))}
                className="px-3 py-2 text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {['Daily', 'Weekly', 'Fortnightly', 'Monthly', 'Off'].map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
          </div>
          <div className="px-5 py-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              Save Changes
            </button>
            {saved && <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#22c55e' }}><CheckCircle2 size={13} /> Saved!</span>}
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Authentication & Access</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Session and password controls</p>
            </div>
            <div className="px-5">
              <Field label="Session Timeout" hint="Minutes of inactivity before logout">
                <TextInput type="number" value={security.sessionTimeout} onChange={v => setSecurity(s => ({ ...s, sessionTimeout: v }))} />
              </Field>
              <Field label="Minimum Password Length">
                <TextInput type="number" value={security.minPasswordLength} onChange={v => setSecurity(s => ({ ...s, minPasswordLength: v }))} />
              </Field>
              <Field label="Max Login Attempts" hint="Lockout threshold before account freeze">
                <TextInput type="number" value={security.maxLoginAttempts} onChange={v => setSecurity(s => ({ ...s, maxLoginAttempts: v }))} />
              </Field>
              <Field label="IP Whitelist" hint="Comma-separated IPs (leave blank for open access)">
                <TextInput value={security.ipWhitelist} onChange={v => setSecurity(s => ({ ...s, ipWhitelist: v }))} placeholder="e.g. 203.0.113.0, 198.51.100.0" />
              </Field>
            </div>
            <div className="px-5 py-4 flex items-center gap-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
              >
                Save Changes
              </button>
              {saved && <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#22c55e' }}><CheckCircle2 size={13} /> Saved!</span>}
            </div>
          </div>

          {/* Feature toggles */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Feature Flags</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Enable or disable platform-wide features</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {TOGGLE_DEFS.map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
                  </div>
                  <Toggle on={toggles[key]} onChange={() => setToggles(t => ({ ...t, [key]: !t[key] }))} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          {[
            { name: 'Xero',          desc: 'Sync billing and invoices with Xero accounting',       status: 'connected',     icon: '𝕏', color: '#1ab4d7' },
            { name: 'Slack',         desc: 'Send compliance alerts to Slack channels',              status: 'not-connected', icon: 'S',  color: '#4a154b' },
            { name: 'Microsoft 365', desc: 'SSO and SharePoint document integration',              status: 'connected',     icon: 'M',  color: '#0078d4' },
            { name: 'Zapier',        desc: 'Automate workflows with 5000+ apps via Zapier',        status: 'not-connected', icon: 'Z',  color: '#ff4a00' },
            { name: 'SendGrid',      desc: 'Transactional email delivery via SendGrid',            status: 'connected',     icon: '✉',  color: '#1a82e2' },
            { name: 'AWS S3',        desc: 'Document and media storage on Amazon S3',              status: 'connected',     icon: '☁',  color: '#f90' },
          ].map(({ name, desc, status, icon, color }) => (
            <div
              key={name}
              className="flex items-center gap-4 p-4"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-sm font-black"
                style={{ background: color + '18', color }}
              >
                {icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold px-2 py-0.5"
                  style={status === 'connected'
                    ? { background: '#22c55e18', color: '#22c55e' }
                    : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                  }
                >
                  {status === 'connected' ? '● Connected' : '○ Not connected'}
                </span>
                <button
                  className="text-xs font-semibold px-3 py-1.5 transition-opacity hover:opacity-70"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
                >
                  {status === 'connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
