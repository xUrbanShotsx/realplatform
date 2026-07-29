'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Brain, CheckCircle2, Circle, Zap, ArrowRight, Sparkles,
  Globe, Megaphone, DollarSign, FileText,
  Mail, Phone, Calendar, Users, Wifi, Lock, ChevronRight,
  X, Key, ExternalLink, Eye, EyeOff, AlertCircle, Info,
} from 'lucide-react'

// ─── Palette ─────────────────────────────────────────────────────────────────

const PINK    = '#e3008c'
const PINK_S  = 'rgba(227,0,140,0.10)'
const BLUE    = '#4361ee'
const GREEN   = '#10b981'
const GREEN_S = 'rgba(16,185,129,0.10)'
const AMBER   = '#f59e0b'
const TEXT    = '#0f172a'
const TEXT2   = '#475569'
const TEXT3   = '#94a3b8'
const BORDER  = 'rgba(0,0,0,0.09)'
const BG      = '#f8fafc'

// ─── Built-in features ───────────────────────────────────────────────────────

const BUILTIN = [
  {
    icon: Mail, color: BLUE, label: 'Email & eNewsletter',
    desc: 'Full email engine built in — campaigns, automations, vendor updates, buyer alerts.',
    ai: ['AI drafts vendor updates before you ask', 'Follow-up sequences auto-sent after every OFI', 'Buyer match alerts when a new listing goes live', 'Weekly newsletter campaigns created and sent by AI'],
  },
  {
    icon: Phone, color: '#8b5cf6', label: 'Phone & SMS',
    desc: 'SMS campaigns, automated sequences, and call logging — all native to the platform.',
    ai: ['SMS follow-up sent automatically 2 hours after every OFI', 'AI call notes logged instantly after each conversation', 'Bulk SMS campaigns to buyer and vendor segments', 'Appointment reminders sent the day before automatically'],
  },
  {
    icon: Calendar, color: '#06b6d4', label: 'Calendar & Scheduling',
    desc: 'Built-in calendar for appraisals, open homes, tasks, and follow-ups.',
    ai: ['AI schedules follow-up calls based on intent scores', 'Pre-meeting brief auto-generated before every appraisal', 'Missed follow-ups rescheduled automatically', 'Open home schedule synced to all agents in real time'],
  },
  {
    icon: Users, color: GREEN, label: 'Contacts & CRM',
    desc: 'Real Platform is your CRM — full contact history, lead scoring, and pipeline.',
    ai: ['Intent scores recalculated daily across every contact', 'AI surfaces who to call before you open the app', 'Full interaction history — calls, emails, OFIs — in one view', 'Pipeline stage progression tracked and flagged automatically'],
  },
]

// ─── Connection flow definitions ──────────────────────────────────────────────

type FlowType = 'oauth' | 'apikey' | 'credentials'

interface ConnectFlow {
  type: FlowType
  // OAuth
  oauthLabel?: string
  oauthColor?: string
  oauthProvider?: string
  permissions?: string[]
  // API key
  keyLabel?: string
  keyPlaceholder?: string
  keyHelpUrl?: string
  keyHelpText?: string
  // Credentials
  fields?: { label: string; type: 'text' | 'password' | 'email'; placeholder: string }[]
  // Shared
  whatYouGet: string[]
  docUrl?: string
}

// ─── Integrations ─────────────────────────────────────────────────────────────

type Status = 'connected' | 'available' | 'coming'

interface Integration {
  id: string
  name: string
  short: string
  color: string
  status: Status
  desc: string
  aiLine: string
  flow: ConnectFlow
}

interface Category {
  id: string
  label: string
  icon: React.ElementType
  color: string
  tagline: string
  integrations: Integration[]
  aiUnlocked: string[]
}

const CATEGORIES: Category[] = [
  {
    id: 'portals',
    label: 'Portals',
    icon: Globe,
    color: '#e34234',
    tagline: 'Feed the AI live enquiry data, comparable sales and market signals from Australia\'s major property platforms.',
    aiUnlocked: [
      'Every new enquiry auto-qualified with an intent score',
      'Buyer matched to existing listings in your database instantly',
      'Open home registrations synced directly into contacts',
      'Automated CMA generated before every appraisal prep (CoreLogic)',
      'New reviews detected and AI response drafted in seconds (RMA)',
    ],
    integrations: [
      {
        id: 'rea', name: 'realestate.com.au', short: 'REA', color: '#e34234', status: 'available',
        desc: 'Primary portal · enquiries + listings',
        aiLine: 'All enquiries auto-qualified and scored on arrival',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with REA Agent Admin',
          oauthColor: '#e34234',
          oauthProvider: 'realestate.com.au',
          permissions: [
            'Read and sync all enquiries in real time',
            'Import listing performance and view data',
            'Access buyer profile data and contact details',
            'Receive webhook alerts for new enquiries',
          ],
          whatYouGet: ['Live enquiry sync → CRM in under 60 seconds', 'Buyer intent scores from enquiry behaviour', 'Listing view counts and engagement metrics', 'Automated buyer–property matching'],
        },
      },
      {
        id: 'domain', name: 'Domain.com.au', short: 'Domain', color: '#6e2fcc', status: 'available',
        desc: 'Secondary portal · buyers + data',
        aiLine: 'Live price benchmarking for every appraisal',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with Domain Agent',
          oauthColor: '#6e2fcc',
          oauthProvider: 'Domain.com.au',
          permissions: [
            'Read enquiries and buyer contact data',
            'Access Domain market insights and suburb trends',
            'Sync listing performance statistics',
            'Import Domain agent profile and reviews',
          ],
          whatYouGet: ['Enquiries synced alongside REA into one inbox', 'Domain price estimates for appraisal benchmarking', 'Market trend data for suburb reports', 'Combined buyer pool across both portals'],
        },
      },
      {
        id: 'rma', name: 'RateMyAgent', short: 'RMA', color: '#00b4d8', status: 'available',
        desc: 'Reviews · reputation management',
        aiLine: 'New reviews detected, AI response drafted instantly',
        flow: {
          type: 'apikey',
          keyLabel: 'RateMyAgent API Key',
          keyPlaceholder: 'rma_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          keyHelpText: 'Go to RateMyAgent → Account Settings → API Access → Generate Key.',
          keyHelpUrl: 'https://www.ratemyagent.com.au/agent-admin/api',
          whatYouGet: ['New reviews imported as they land', 'AI-drafted response ready before you open the app', 'Reputation score tracked against local competitors', 'Review alerts sent to your phone via SMS'],
        },
      },
      {
        id: 'core', name: 'CoreLogic / PropTrack', short: 'CoreLogic', color: '#1a73e8', status: 'available',
        desc: 'Valuation data · CMAs',
        aiLine: 'Full automated CMA generated for every appraisal prep',
        flow: {
          type: 'apikey',
          keyLabel: 'CoreLogic API Key',
          keyPlaceholder: 'cl_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          keyHelpText: 'Log in to the CoreLogic Developer Portal and generate a Production API key. You\'ll need an active agency subscription.',
          keyHelpUrl: 'https://developer.corelogic.com.au',
          whatYouGet: ['Automated CMA inserted into every appraisal prep', 'Real-time AVM estimates per property', 'Suburb median and clearance rate data', '12-month sales history for any address'],
        },
      },
    ],
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: Megaphone,
    color: PINK,
    tagline: 'Connect your social accounts and the AI creates, schedules and posts listing content, market updates and campaigns automatically.',
    aiUnlocked: [
      'Listing goes live → AI creates and posts to all connected platforms',
      'Weekly suburb market updates auto-posted every Monday',
      'Sold results announced with AI-written copy and visuals',
      'Google Ads budget adjusted by AI based on listing urgency',
      'Content calendar populated 4 weeks ahead automatically',
    ],
    integrations: [
      {
        id: 'meta', name: 'Facebook & Instagram', short: 'Meta', color: '#1877f2', status: 'available',
        desc: 'Posts, Stories + paid ads',
        aiLine: 'Listing goes live → AI posts to Facebook and Instagram',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with Facebook',
          oauthColor: '#1877f2',
          oauthProvider: 'Meta Business',
          permissions: [
            'Post to your Facebook Business Page',
            'Post to your connected Instagram Business account',
            'Create and manage Facebook Ads',
            'Read Page insights and ad performance metrics',
          ],
          whatYouGet: ['Listings auto-posted to Facebook and Instagram on launch', 'Open home event posts created automatically', 'Paid ads created from listing data with AI copy', 'Monthly performance report delivered to your inbox'],
        },
      },
      {
        id: 'linkedin', name: 'LinkedIn', short: 'LI', color: '#0a66c2', status: 'available',
        desc: 'Professional content',
        aiLine: 'Market updates and sold results auto-posted',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with LinkedIn',
          oauthColor: '#0a66c2',
          oauthProvider: 'LinkedIn',
          permissions: [
            'Post to your LinkedIn personal profile',
            'Post to your LinkedIn Company Page (if applicable)',
            'Read post engagement and follower analytics',
          ],
          whatYouGet: ['Sold results posted with professional market commentary', 'Monthly suburb reports published automatically', 'New listing announcements with AI-written copy', 'Profile views tracked and hot leads surfaced'],
        },
      },
      {
        id: 'tiktok', name: 'TikTok', short: 'TT', color: '#010101', status: 'available',
        desc: 'Short-form video',
        aiLine: 'Property highlight clips queued and scheduled by AI',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with TikTok',
          oauthColor: '#010101',
          oauthProvider: 'TikTok Business',
          permissions: [
            'Upload and publish videos to your TikTok Business account',
            'Schedule posts via Content Posting API',
            'Read video performance and engagement analytics',
          ],
          whatYouGet: ['Property walkthrough videos scheduled from your media library', 'Market update clips scripted and queued by AI', 'Optimal posting times selected based on your audience', 'Comment monitoring for buyer lead detection'],
        },
      },
      {
        id: 'google', name: 'Google Ads', short: 'GAds', color: '#4285f4', status: 'available',
        desc: 'Search + Display ads',
        aiLine: 'Listing ads auto-created, targeted and budget-managed',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with Google',
          oauthColor: '#4285f4',
          oauthProvider: 'Google Ads',
          permissions: [
            'Create and manage Google Search campaigns',
            'Create Display and Performance Max campaigns',
            'Set and adjust campaign budgets',
            'Read ad performance and conversion reports',
          ],
          whatYouGet: ['Search ads auto-created for every new listing', 'Budget adjusted by AI based on days on market and urgency', 'Retargeting ads to past portal enquirers', 'Performance report tied to CRM conversion outcomes'],
        },
      },
      {
        id: 'youtube', name: 'YouTube', short: 'YT', color: '#ff0000', status: 'coming',
        desc: 'Property videos',
        aiLine: 'Video listings uploaded and optimised automatically',
        flow: { type: 'oauth', oauthProvider: 'YouTube', whatYouGet: [] },
      },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    color: '#13b5ea',
    tagline: 'Connect your accounting platform and the AI tracks commission, raises invoices at settlement and forecasts your GCI automatically.',
    aiUnlocked: [
      'Commission invoices raised the moment a settlement is confirmed',
      'MTD GCI tracked against targets in real time',
      'Monthly GCI forecast based on pipeline stage probability',
      'Automatic reconciliation of all commission payments',
    ],
    integrations: [
      {
        id: 'xero', name: 'Xero', short: 'Xero', color: '#13b5ea', status: 'available',
        desc: 'Accounting + invoicing',
        aiLine: 'Commission invoices raised automatically at settlement',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with Xero',
          oauthColor: '#13b5ea',
          oauthProvider: 'Xero',
          permissions: [
            'Create and send invoices to vendors and landlords',
            'Read account and contact data for reconciliation',
            'Access payment and bank transaction records',
          ],
          whatYouGet: ['Commission invoice raised on settlement confirmation', 'Vendor and landlord billing contacts synced', 'Outstanding invoices flagged in the AI daily brief', 'GCI dashboard pulls live from Xero actuals'],
        },
      },
      {
        id: 'myob', name: 'MYOB', short: 'MYOB', color: '#4e5b69', status: 'available',
        desc: 'Accounting + payroll',
        aiLine: 'GCI tracking and commission reconciliation automated',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with MYOB',
          oauthColor: '#4e5b69',
          oauthProvider: 'MYOB',
          permissions: [
            'Create sales and commission invoices',
            'Access payroll data for agent commission splits',
            'Read general ledger for GCI reconciliation',
          ],
          whatYouGet: ['Commission splits calculated and posted automatically', 'Payroll data feeds into agent leaderboard', 'Monthly GCI reconciliation done with zero manual entry', 'Tax reporting data exported at financial year end'],
        },
      },
    ],
  },
  {
    id: 'signing',
    label: 'Signing & Legal',
    icon: FileText,
    color: '#ffb03a',
    tagline: 'Connect e-signature and settlement platforms so the AI auto-generates agreements and tracks every document to completion.',
    aiUnlocked: [
      'Sale contracts auto-generated the moment an offer is accepted',
      'Unsigned documents flagged and parties nudged automatically',
      'Form 6 pre-filled from contact data before every appointment',
      'Settlement milestones pushed to vendor portal in real time',
    ],
    integrations: [
      {
        id: 'docusign', name: 'DocuSign', short: 'DocuSign', color: '#ffb03a', status: 'available',
        desc: 'eSignatures · contracts',
        aiLine: 'Sale contracts generated and sent on offer acceptance',
        flow: {
          type: 'oauth',
          oauthLabel: 'Connect with DocuSign',
          oauthColor: '#ffb03a',
          oauthProvider: 'DocuSign',
          permissions: [
            'Send envelopes and request signatures',
            'Access envelope status and signing progress',
            'Create and manage document templates',
            'Read completed document audit trails',
          ],
          whatYouGet: ['Sale contract sent automatically on offer acceptance', 'Signing status tracked live in every deal record', 'Pre-built templates for Form 6, sale contracts, and PTOs', 'Unsigned documents escalated in the AI daily brief'],
        },
      },
      {
        id: 'pexa', name: 'PEXA', short: 'PEXA', color: '#00629b', status: 'available',
        desc: 'Digital settlements',
        aiLine: 'Settlement milestones synced to vendor portal',
        flow: {
          type: 'credentials',
          fields: [
            { label: 'PEXA Key Username', type: 'email', placeholder: 'you@agency.com.au' },
            { label: 'PEXA Key Password', type: 'password', placeholder: '••••••••••••' },
          ],
          whatYouGet: ['Settlement workspace status synced to every deal record', 'Key dates pushed to calendar and vendor portal automatically', 'Settlement confirmed → commission invoice triggered in Xero', 'Title transfer status visible without logging into PEXA'],
        },
      },
      {
        id: 'reiform', name: 'REI Forms', short: 'REIForms', color: '#0d47a1', status: 'available',
        desc: 'Form 6 + standard forms library',
        aiLine: 'Form 6 pre-filled from CRM data before every appointment',
        flow: {
          type: 'credentials',
          fields: [
            { label: 'REI Forms Username', type: 'email', placeholder: 'you@agency.com.au' },
            { label: 'REI Forms Password', type: 'password', placeholder: '••••••••••••' },
          ],
          whatYouGet: ['Form 6 pre-filled from CRM contact and property data', 'Signed forms saved directly to the deal record', 'Form library available inside the AI document composer', 'Compliance deadlines tracked from form submission dates'],
        },
      },
    ],
  },
]

const TOTAL     = CATEGORIES.flatMap(c => c.integrations).filter(i => i.status !== 'coming').length
const FULL_AUTOPILOT = [
  { icon: '🏡', text: 'Listing live → social posts, ad copy, buyer alerts sent automatically' },
  { icon: '📊', text: 'Weekly vendor reports generated and sent every Friday with zero input' },
  { icon: '🎯', text: 'Every new enquiry scored, replied to, and added to nurture in 90 seconds' },
  { icon: '💰', text: 'Commission invoice raised the moment settlement is confirmed' },
  { icon: '📅', text: 'Appraisal booked → brief auto-prepared with comps and objection guide' },
  { icon: '⭐', text: 'New review posted → AI-drafted response ready before you open the app' },
  { icon: '📣', text: 'Sold result announced across all social platforms automatically' },
  { icon: '📑', text: 'Form 6 pre-filled and ready to sign before every listing appointment' },
]

// ─── Connect Modal ────────────────────────────────────────────────────────────

function ConnectModal({
  integration,
  onClose,
  onConnect,
}: {
  integration: Integration
  onClose: () => void
  onConnect: () => void
}) {
  const [apiKey, setApiKey]     = useState('')
  const [showKey, setShowKey]   = useState(false)
  const [creds, setCreds]       = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')

  const { flow } = integration

  const handleOAuth = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      setTimeout(() => { onConnect(); onClose() }, 1200)
    }, 1800)
  }

  const handleApiKey = () => {
    if (!apiKey.trim()) { setError('Please enter your API key.'); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      setTimeout(() => { onConnect(); onClose() }, 1200)
    }, 1400)
  }

  const handleCredentials = () => {
    const missing = (flow.fields ?? []).find(f => !creds[f.label]?.trim())
    if (missing) { setError(`Please enter your ${missing.label}.`); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      setTimeout(() => { onConnect(); onClose() }, 1200)
    }, 1600)
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(0,0,0,0.25)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '20px 22px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 44, height: 44, background: `${integration.color}18`, border: `1px solid ${integration.color}30`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: integration.color }}>{integration.short.slice(0, 5)}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>Connect {integration.name}</div>
            <div style={{ fontSize: 12, color: TEXT3, marginTop: 2 }}>{integration.desc}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, padding: 4, display: 'flex', marginTop: -2 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '18px 22px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

          {done ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 12 }}>
              <div style={{ width: 52, height: 52, background: GREEN_S, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={26} color={GREEN} strokeWidth={2} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>Connected!</div>
              <div style={{ fontSize: 12, color: TEXT3, textAlign: 'center' }}>{integration.name} is now syncing with Real Platform.</div>
            </div>
          ) : (
            <>
              {/* What you'll get */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 8 }}>WHAT REAL PLATFORM GETS ACCESS TO</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {flow.whatYouGet.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <Zap size={10} color={GREEN} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }} />
                      <span style={{ fontSize: 12, color: TEXT2, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions (OAuth only) */}
              {flow.type === 'oauth' && flow.permissions && (
                <div style={{ marginBottom: 18, padding: '12px 14px', background: 'rgba(67,97,238,0.04)', border: `1px solid rgba(67,97,238,0.12)`, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: BLUE, letterSpacing: '0.08em', marginBottom: 8 }}>PERMISSIONS REQUESTED</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {flow.permissions.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                        <div style={{ width: 4, height: 4, background: BLUE, borderRadius: 9999, flexShrink: 0, marginTop: 5 }} />
                        <span style={{ fontSize: 11.5, color: TEXT2, lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* API Key input */}
              {flow.type === 'apikey' && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: TEXT, display: 'block', marginBottom: 6 }}>{flow.keyLabel}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={e => { setApiKey(e.target.value); setError('') }}
                      placeholder={flow.keyPlaceholder}
                      style={{ width: '100%', border: `1px solid ${error ? '#ef4444' : BORDER}`, borderRadius: 8, padding: '9px 38px 9px 12px', fontSize: 13, color: TEXT, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', background: '#fafafa' }}
                    />
                    <button onClick={() => setShowKey(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, display: 'flex', padding: 2 }}>
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {flow.keyHelpText && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 8 }}>
                      <Info size={11} color={TEXT3} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 11, color: TEXT3, lineHeight: 1.5 }}>
                        {flow.keyHelpText}
                        {flow.keyHelpUrl && (
                          <> <a href={flow.keyHelpUrl} target="_blank" rel="noreferrer" style={{ color: BLUE, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>Open developer portal <ExternalLink size={9} /></a></>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Credentials input */}
              {flow.type === 'credentials' && (
                <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(flow.fields ?? []).map(field => (
                    <div key={field.label}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: TEXT, display: 'block', marginBottom: 6 }}>{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={creds[field.label] ?? ''}
                        onChange={e => { setCreds(prev => ({ ...prev, [field.label]: e.target.value })); setError('') }}
                        style={{ width: '100%', border: `1px solid ${error ? '#ef4444' : BORDER}`, borderRadius: 8, padding: '9px 12px', fontSize: 13, color: TEXT, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fafafa' }}
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '10px 12px', background: 'rgba(245,158,11,0.06)', border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 8 }}>
                    <AlertCircle size={11} color={AMBER} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 11, color: TEXT2, lineHeight: 1.5 }}>Your credentials are encrypted and stored securely. Real Platform never logs or shares your login details.</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 14 }}>
                  <AlertCircle size={12} color="#ef4444" />
                  <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>
                </div>
              )}

              {/* CTA */}
              <div style={{ display: 'flex', gap: 8 }}>
                {flow.type === 'oauth' && (
                  <button
                    onClick={handleOAuth}
                    disabled={loading}
                    style={{ flex: 1, background: loading ? 'rgba(0,0,0,0.08)' : flow.oauthColor ?? BLUE, border: 'none', color: loading ? TEXT3 : '#fff', padding: '11px 0', fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
                  >
                    {loading ? (
                      <>
                        <span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.15)', borderTopColor: TEXT3, borderRadius: 9999, display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Connecting to {flow.oauthProvider}…
                      </>
                    ) : (
                      <>{flow.oauthLabel ?? `Connect with ${flow.oauthProvider}`} <ExternalLink size={12} /></>
                    )}
                  </button>
                )}
                {flow.type === 'apikey' && (
                  <button
                    onClick={handleApiKey}
                    disabled={loading}
                    style={{ flex: 1, background: loading ? 'rgba(0,0,0,0.08)' : BLUE, border: 'none', color: loading ? TEXT3 : '#fff', padding: '11px 0', fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
                  >
                    {loading ? (
                      <>
                        <span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.15)', borderTopColor: TEXT3, borderRadius: 9999, display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Verifying API key…
                      </>
                    ) : (
                      <><Key size={13} /> Save & Connect</>
                    )}
                  </button>
                )}
                {flow.type === 'credentials' && (
                  <button
                    onClick={handleCredentials}
                    disabled={loading}
                    style={{ flex: 1, background: loading ? 'rgba(0,0,0,0.08)' : BLUE, border: 'none', color: loading ? TEXT3 : '#fff', padding: '11px 0', fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
                  >
                    {loading ? (
                      <>
                        <span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.15)', borderTopColor: TEXT3, borderRadius: 9999, display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Signing in…
                      </>
                    ) : (
                      <>Sign in & Connect</>
                    )}
                  </button>
                )}
                <button onClick={onClose} style={{ padding: '11px 18px', background: 'none', border: `1px solid ${BORDER}`, color: TEXT2, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>
                  Cancel
                </button>
              </div>

              <div style={{ marginTop: 12, fontSize: 10.5, color: TEXT3, textAlign: 'center', lineHeight: 1.5 }}>
                By connecting, you authorise Real Platform to access {integration.name} on your behalf.
                {flow.type === 'oauth' && ' You\'ll be redirected to complete authentication.'}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ConnectPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(CATEGORIES.flatMap(c => c.integrations).map(i => [i.id, i.status]))
  )
  const [activeCat, setActiveCat]         = useState('portals')
  const [modalInt, setModalInt]           = useState<Integration | null>(null)

  const connected = Object.values(statuses).filter(s => s === 'connected').length
  const readiness = Math.round((connected / TOTAL) * 100)
  const allReady  = connected === TOTAL

  const openModal = (integration: Integration) => {
    if (integration.status === 'coming') return
    setModalInt(integration)
  }

  const handleConnect = (id: string) => {
    setStatuses(prev => ({ ...prev, [id]: 'connected' }))
  }

  const handleDisconnect = (id: string) => {
    setStatuses(prev => ({ ...prev, [id]: 'available' }))
  }

  const cat      = CATEGORIES.find(c => c.id === activeCat)!
  const catConn  = (c: Category) => c.integrations.filter(i => statuses[i.id] === 'connected').length
  const catTotal = (c: Category) => c.integrations.filter(i => i.status !== 'coming').length

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG, fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0d0d14 0%, #111128 50%, #0d0d14 100%)', padding: '28px 28px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, background: `radial-gradient(circle, ${PINK}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: 80, width: 300, height: 300, background: `radial-gradient(circle, ${BLUE}18 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${BLUE}, ${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', borderRadius: 8, flexShrink: 0 }}>RP</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>AI Chief of Staff</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>Real Platform · Powered by Claude</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>{readiness}%</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>external integrations linked · {connected}/{TOTAL}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.10)', borderRadius: 9999, overflow: 'hidden', maxWidth: 420 }}>
                <div style={{ height: '100%', width: `${readiness}%`, background: `linear-gradient(90deg, ${BLUE}, ${PINK})`, borderRadius: 9999, transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 480 }}>
              {allReady ? '✦ All integrations connected — AI is running your agency automatically.' : 'Email, phone, calendar and contacts are already built in and AI-powered. Connect your portals, socials, finance and signing platforms to complete the picture.'}
            </div>
          </div>

          <div style={{ width: 256, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: '16px', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: 10 }}>ONCE FULLY CONNECTED</div>
            {FULL_AUTOPILOT.slice(0, 5).map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
                <span style={{ fontSize: 11, color: allReady ? '#fff' : 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{a.text}</span>
              </div>
            ))}
            <Link href="/dashboard/ai-hub" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11, fontWeight: 700, color: PINK, textDecoration: 'none' }}>
              <Brain size={12} /> Open AI Chat <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Built-in section ──────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <CheckCircle2 size={14} color={GREEN} />
          <span style={{ fontSize: 12, fontWeight: 800, color: TEXT }}>Built in & AI-powered</span>
          <span style={{ fontSize: 11, color: TEXT3 }}>— native to Real Platform, no connection needed</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {BUILTIN.map(item => {
            const Icon = item.icon
            return (
              <div key={item.label} style={{ border: `1px solid ${GREEN}30`, background: `${GREEN}04`, borderRadius: 12, padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, background: `${item.color}15`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color={item.color} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>{item.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <div style={{ width: 5, height: 5, background: GREEN, borderRadius: 9999 }} />
                      <span style={{ fontSize: 10, color: GREEN, fontWeight: 600 }}>AI Active</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: TEXT2, lineHeight: 1.5, marginBottom: 8 }}>{item.desc}</div>
                {item.ai.slice(0, 2).map((line, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 3 }}>
                    <Zap size={9} color={GREEN} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontSize: 10.5, color: '#065f46', lineHeight: 1.4 }}>{line}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Category tabs ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 28px', display: 'flex', gap: 0, overflowX: 'auto' }}>
        {CATEGORIES.map(c => {
          const Icon    = c.icon
          const conn    = catConn(c)
          const total   = catTotal(c)
          const active  = activeCat === c.id
          const allDone = conn === total
          return (
            <button key={c.id} onClick={() => setActiveCat(c.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: 'none', border: 'none', borderBottom: active ? `2px solid ${c.color}` : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', color: active ? c.color : TEXT3, fontWeight: active ? 700 : 400, fontSize: 12.5, whiteSpace: 'nowrap', transition: 'all 0.15s', marginBottom: -1 }}>
              <Icon size={13} strokeWidth={active ? 2 : 1.5} />
              {c.label}
              <span style={{ fontSize: 10, fontWeight: 700, color: allDone ? GREEN : active ? c.color : TEXT3, background: allDone ? GREEN_S : active ? `${c.color}15` : 'rgba(0,0,0,0.05)', padding: '1px 6px', borderRadius: 9999 }}>
                {conn}/{total}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Cards + capabilities ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 296px', minHeight: 0 }}>

        {/* Left: integration cards */}
        <div style={{ padding: '22px 28px', borderRight: `1px solid ${BORDER}` }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{cat.label}</div>
            <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.6 }}>{cat.tagline}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {cat.integrations.map(integration => {
              const status = statuses[integration.id]
              const isConn = status === 'connected'
              const isCom  = status === 'coming'
              return (
                <div key={integration.id}
                  style={{ border: `1px solid ${isConn ? GREEN + '40' : BORDER}`, background: isConn ? `${GREEN}05` : '#fff', borderRadius: 12, padding: '16px', transition: 'all 0.2s', opacity: isCom ? 0.55 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, background: `${integration.color}20`, border: `1px solid ${integration.color}30`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: integration.color, letterSpacing: '-0.02em' }}>{integration.short.slice(0, 4)}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>{integration.name}</div>
                        <div style={{ fontSize: 10.5, color: TEXT3, marginTop: 2 }}>{integration.desc}</div>
                      </div>
                    </div>
                    {isCom
                      ? <span style={{ fontSize: 9, fontWeight: 700, color: TEXT3, background: 'rgba(0,0,0,0.06)', padding: '2px 7px', borderRadius: 9999, flexShrink: 0 }}>SOON</span>
                      : isConn
                        ? <CheckCircle2 size={16} color={GREEN} strokeWidth={2} style={{ flexShrink: 0 }} />
                        : <Circle size={16} color={TEXT3} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    }
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '8px 10px', background: isConn ? `${GREEN}08` : 'rgba(0,0,0,0.03)', borderRadius: 7, marginBottom: 10 }}>
                    <Zap size={10} color={isConn ? GREEN : TEXT3} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 11, color: isConn ? '#059669' : TEXT3, lineHeight: 1.5 }}>{integration.aiLine}</span>
                  </div>

                  {!isCom && (
                    isConn ? (
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        style={{ width: '100%', padding: '7px 0', background: 'transparent', border: `1px solid ${GREEN}50`, color: GREEN, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <CheckCircle2 size={11} /> Connected · click to disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal(integration)}
                        style={{ width: '100%', padding: '7px 0', background: BLUE, border: 'none', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <Wifi size={11} /> Connect {integration.short}
                      </button>
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: capabilities */}
        <div style={{ padding: '22px 20px', background: '#fff' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 12 }}>WHAT AI DOES WITH {cat.label.toUpperCase()}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
            {cat.aiUnlocked.map((cap, i) => {
              const isActive = catConn(cat) > 0 && i < catConn(cat)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 10px', background: isActive ? GREEN_S : 'rgba(245,158,11,0.06)', borderRadius: 8, border: `1px solid ${isActive ? GREEN + '30' : 'rgba(245,158,11,0.2)'}` }}>
                  {isActive
                    ? <Zap size={10} color={GREEN} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                    : <Lock size={10} color={AMBER} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                  }
                  <span style={{ fontSize: 11.5, color: isActive ? '#065f46' : TEXT2, lineHeight: 1.5 }}>{cap}</span>
                </div>
              )
            })}
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT3, letterSpacing: '0.08em', marginBottom: 10 }}>ALL EXTERNAL INTEGRATIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CATEGORIES.map(c => {
                const cn = catConn(c); const tot = catTotal(c); const pct = Math.round((cn / tot) * 100)
                const CIcon = c.icon
                return (
                  <button key={c.id} onClick={() => setActiveCat(c.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: activeCat === c.id ? `${c.color}08` : 'none', border: activeCat === c.id ? `1px solid ${c.color}25` : '1px solid transparent', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}>
                    <CIcon size={12} color={cn === tot ? GREEN : c.color} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 11, color: TEXT2, fontWeight: activeCat === c.id ? 700 : 400 }}>{c.label}</span>
                    <div style={{ width: 44, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: cn === tot ? GREEN : c.color, borderRadius: 9999, transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ fontSize: 10, color: cn === tot ? GREEN : TEXT3, fontWeight: 600, minWidth: 26, textAlign: 'right' }}>{cn}/{tot}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: GREEN_S, borderRadius: 10, border: `1px solid ${GREEN}25` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: GREEN, marginBottom: 6 }}>BUILT IN · ALWAYS ACTIVE</div>
              {BUILTIN.map(b => {
                const Icon = b.icon
                return (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                    <Icon size={11} color={GREEN} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#065f46', fontWeight: 500 }}>{b.label}</span>
                    <CheckCircle2 size={10} color={GREEN} strokeWidth={2} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Autopilot CTA ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderTop: `1px solid ${BORDER}`, padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {FULL_AUTOPILOT.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 14px', background: allReady ? `${BLUE}06` : BG, border: `1px solid ${allReady ? BLUE + '25' : BORDER}`, borderRadius: 10 }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{a.icon}</span>
              <span style={{ fontSize: 11.5, color: allReady ? TEXT : TEXT2, lineHeight: 1.5 }}>{a.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em', marginBottom: 3 }}>
              {allReady ? '✦ AI Autopilot is ready to activate' : `${TOTAL - connected} more connection${TOTAL - connected !== 1 ? 's' : ''} to complete AI Autopilot`}
            </div>
            <div style={{ fontSize: 12, color: TEXT3 }}>Email, phone, calendar and CRM are already live. Connect portals, socials, finance and signing to unlock full automation.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <Link href="/dashboard/ai-hub" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: `1px solid ${BORDER}`, color: TEXT2, textDecoration: 'none', fontSize: 12, fontWeight: 700, borderRadius: 9999, background: '#fff' }}>
              <Brain size={14} /> Open AI Chat
            </Link>
            <button disabled={!allReady}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: allReady ? `linear-gradient(135deg, ${BLUE}, ${PINK})` : 'rgba(0,0,0,0.06)', border: 'none', color: allReady ? '#fff' : TEXT3, fontSize: 12, fontWeight: 800, cursor: allReady ? 'pointer' : 'not-allowed', fontFamily: 'inherit', borderRadius: 9999, opacity: allReady ? 1 : 0.65 }}>
              <Sparkles size={14} />
              {allReady ? 'AI Autopilot Active' : `Activate Autopilot (${connected}/${TOTAL})`}
            </button>
          </div>
        </div>
      </div>

      {/* ── Connect modal ─────────────────────────────────────────────────────── */}
      {modalInt && (
        <ConnectModal
          integration={modalInt}
          onClose={() => setModalInt(null)}
          onConnect={() => handleConnect(modalInt.id)}
        />
      )}
    </div>
  )
}
