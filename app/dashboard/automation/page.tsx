'use client'
import { useState } from 'react'
import { Cpu, Play, Pause, Plus, ChevronRight, Zap, Brain, Mail, Phone, Calendar, Users, CheckCircle } from 'lucide-react'

const CARD = '#ffffff'; const CARD2 = '#f1f5f9'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const AUTOMATIONS = [
  { id: 1, name: 'New Lead → AI Qualification',   status: 'active', runs: 847,  last: '2 min ago',   color: BLUE,   contacts: 34  },
  { id: 2, name: 'Seller Intent → Nurture',        status: 'active', runs: 1203, last: '5 min ago',   color: PINK,   contacts: 127 },
  { id: 3, name: 'Appraisal Follow-Up Sequence',   status: 'active', runs: 312,  last: '1 hr ago',    color: PURPLE, contacts: 6   },
  { id: 4, name: 'Open Home → Buyer Follow-Up',    status: 'active', runs: 214,  last: '3 days ago',  color: AMBER,  contacts: 18  },
  { id: 5, name: 'Birthday & Anniversary Nurture', status: 'active', runs: 93,   last: 'Yesterday',   color: GREEN,  contacts: 412 },
  { id: 6, name: 'Settlement → Referral Request',  status: 'paused', runs: 47,   last: '1 week ago',  color: TEAL,   contacts: 3   },
  { id: 7, name: 'Expired Listing Outreach',       status: 'paused', runs: 28,   last: '2 weeks ago', color: AMBER,  contacts: 22  },
]

type FlowNode = { type: string; icon: React.ElementType; label: string; sub: string; color: string }

const FLOW_NODES: FlowNode[] = [
  { type: 'trigger',   icon: Zap,           label: 'Trigger',          sub: 'New lead enquiry received',           color: BLUE   },
  { type: 'condition', icon: Brain,         label: 'AI Qualification', sub: 'Score lead 1–100 · Check budget fit', color: PURPLE },
  { type: 'condition', icon: CheckCircle,   label: 'Check Budget',     sub: 'Pre-approval > $800K',                color: AMBER  },
  { type: 'action',    icon: Calendar,      label: 'Book Inspection',  sub: 'Send calendar link · Add to CRM',     color: GREEN  },
  { type: 'action',    icon: Users,         label: 'Create Follow-Up', sub: 'Task for agent · Set 48hr reminder',  color: TEAL   },
  { type: 'action',    icon: Mail,          label: 'AI Email',         sub: 'Personalised confirmation email',     color: BLUE   },
  { type: 'action',    icon: Phone,         label: 'Schedule Call',    sub: 'AI Voice call in 24 hrs',             color: PINK   },
  { type: 'action',    icon: Zap,           label: 'Social Audience',  sub: 'Add to Facebook retargeting list',    color: PURPLE },
]

export default function AutomationPage() {
  const [sel, setSel] = useState(AUTOMATIONS[0])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* Left: Automation list */}
      <div style={{ width: 300, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Automation</div>
            <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Plus size={10} /> New
            </button>
          </div>
          <div style={{ fontSize: 11, color: TEXT3 }}>Think Zapier, built inside your CRM</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px 16px', gap: 8, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {[{ label: 'Active', val: '5', color: GREEN }, { label: 'Runs today', val: '284', color: BLUE }, { label: 'Contacts enrolled', val: '622', color: PURPLE }, { label: 'Hours saved', val: '18h', color: AMBER }].map(s => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '8px 10px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: TEXT3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {AUTOMATIONS.map(a => (
            <div key={a.id} onClick={() => setSel(a)} style={{ padding: '11px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.id === a.id ? `${a.color}08` : 'transparent', borderLeft: `2px solid ${sel.id === a.id ? a.color : 'transparent'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, flex: 1, lineHeight: 1.3 }}>{a.name}</div>
                <div style={{ width: 7, height: 7, background: a.status === 'active' ? GREEN : TEXT3, borderRadius: 9999, marginTop: 3, flexShrink: 0, marginLeft: 8 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 10, color: TEXT3 }}>{a.runs.toLocaleString()} runs</span>
                <span style={{ fontSize: 10, color: TEXT3 }}>{a.contacts} contacts</span>
                <span style={{ fontSize: 10, color: TEXT3, marginLeft: 'auto' }}>{a.last}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Flow Builder */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{sel.name}</div>
            <div style={{ fontSize: 11, color: TEXT3 }}>Visual Flow Builder · {sel.runs.toLocaleString()} runs total</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${BORDER}`, color: TEXT2, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
              {sel.status === 'active' ? <><Pause size={11} /> Pause</> : <><Play size={11} /> Activate</>}
            </button>
            <button style={{ background: BLUE, border: 'none', color: '#fff', padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Save Changes</button>
          </div>
        </div>

        {/* Flow canvas */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 24 }}>AUTOMATION FLOW — {sel.name.toUpperCase()}</div>

          {FLOW_NODES.map((node, i) => {
            const Icon = node.icon
            const typeColors: Record<string, string> = { trigger: BLUE, condition: PURPLE, action: GREEN }
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 480 }}>
                {/* Node */}
                <div style={{
                  width: '100%',
                  background: CARD,
                  border: `1px solid ${node.color}30`,
                  borderLeft: `3px solid ${node.color}`,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                }}>
                  <div style={{ width: 32, height: 32, background: `${node.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color={node.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 9, color: node.color, background: `${node.color}15`, padding: '1px 6px', fontWeight: 700, letterSpacing: '0.06em' }}>{node.type.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{node.label}</div>
                    <div style={{ fontSize: 11, color: TEXT2 }}>{node.sub}</div>
                  </div>
                  <div style={{ width: 20, height: 20, background: 'rgba(0,0,0,0.02)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={10} color={TEXT3} />
                  </div>
                </div>

                {/* Connector */}
                {i < FLOW_NODES.length - 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
                    <div style={{ width: 1, height: 20, background: `linear-gradient(180deg, ${node.color}60, ${FLOW_NODES[i+1].color}60)` }} />
                    <div style={{ width: 6, height: 6, background: FLOW_NODES[i+1].color, borderRadius: 9999 }} />
                  </div>
                )}
              </div>
            )
          })}

          {/* Add node */}
          <div style={{ marginTop: 16 }}>
            <button style={{ background: 'rgba(0,0,0,0.02)', border: `1px dashed rgba(0,0,0,0.10)`, color: TEXT3, padding: '10px 24px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={12} /> Add Step
            </button>
          </div>

          {/* Run stats */}
          <div style={{ marginTop: 32, width: '100%', maxWidth: 480, background: CARD, border: `1px solid ${BORDER}`, padding: 16 }}>
            <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>LAST 7 DAYS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[{ label: 'Triggered', val: `${Math.floor(sel.runs / 4)}` }, { label: 'Completed', val: `${Math.floor(sel.runs / 4 * 0.94)}` }, { label: 'Success rate', val: '94%' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: GREEN, letterSpacing: '-0.04em' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: TEXT3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
