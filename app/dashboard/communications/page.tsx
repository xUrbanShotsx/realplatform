'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Search, Plus, Send, Paperclip, MoreHorizontal,
  Phone, Video, Users, Briefcase, Circle, X, ChevronDown, Hash,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Participant = { id: string; name: string; initials: string; role: string }

type Message = {
  id: string
  senderId: string
  senderName: string
  senderInitials: string
  content: string
  timestamp: string
  jobTag?: string
}

type Conversation = {
  id: string
  type: 'direct' | 'group' | 'job'
  name: string
  participants: Participant[]
  messages: Message[]
  unread: number
  online?: boolean
  jobSite?: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ME = { id: 'sarah', name: 'Sarah Mitchell', initials: 'SM' }

const INITIAL_CONVOS: Conversation[] = [
  {
    id: '1',
    type: 'direct',
    name: 'James Chen',
    participants: [{ id: 'james', name: 'James Chen', initials: 'JC', role: 'Site Supervisor' }],
    unread: 2,
    online: true,
    messages: [
      { id: 'm1', senderId: 'james', senderName: 'James Chen', senderInitials: 'JC', content: 'Hey Sarah, the forklift pre-start for EQ-001 is done. Score was 98%.', timestamp: '09:14', jobTag: 'Warehouse – Ryde' },
      { id: 'm2', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'Great work! Can you check the scaffold on Level 3 before the 10am shift starts?', timestamp: '09:17' },
      { id: 'm3', senderId: 'james', senderName: 'James Chen', senderInitials: 'JC', content: 'On it now. I\'ll send through photos when done.', timestamp: '09:19' },
      { id: 'm4', senderId: 'james', senderName: 'James Chen', senderInitials: 'JC', content: 'All good — scaffold looks solid, all guardrails are in place. INC-003 has been logged as well.', timestamp: '09:41', jobTag: 'Site A – George St' },
    ],
  },
  {
    id: '2',
    type: 'direct',
    name: 'Marcus Torres',
    participants: [{ id: 'marcus', name: 'Marcus Torres', initials: 'MT', role: 'Project Manager' }],
    unread: 0,
    online: true,
    messages: [
      { id: 'm1', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'Marcus, the SWMS for Excavation and Trenching needs sign-off by EOD today.', timestamp: 'Yesterday' },
      { id: 'm2', senderId: 'marcus', senderName: 'Marcus Torres', senderInitials: 'MT', content: 'Already on it — sent it to the team at 3pm. Should have all signatures by 5.', timestamp: 'Yesterday' },
      { id: 'm3', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'Perfect, thanks Marcus!', timestamp: 'Yesterday' },
    ],
  },
  {
    id: '3',
    type: 'group',
    name: 'Site A Safety Team',
    participants: [
      { id: 'james', name: 'James Chen', initials: 'JC', role: 'Site Supervisor' },
      { id: 'marcus', name: 'Marcus Torres', initials: 'MT', role: 'Project Manager' },
      { id: 'raj', name: 'Raj Patel', initials: 'RP', role: 'WHS Officer' },
    ],
    unread: 5,
    jobSite: 'Site A – George St',
    messages: [
      { id: 'm1', senderId: 'raj', senderName: 'Raj Patel', senderInitials: 'RP', content: 'Morning team — crane exclusion zone is set up for today\'s lift. All workers briefed.', timestamp: '07:30', jobTag: 'HAZ-003' },
      { id: 'm2', senderId: 'james', senderName: 'James Chen', senderInitials: 'JC', content: 'Confirmed. Spotter is in position. Barriers are up around the powerlines.', timestamp: '07:45' },
      { id: 'm3', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'Good to hear. Toolbox talk scheduled 8am — HAZ-003 is on the agenda.', timestamp: '07:50' },
      { id: 'm4', senderId: 'marcus', senderName: 'Marcus Torres', senderInitials: 'MT', content: 'I\'ll be on site by 8:15. Who\'s running the talk?', timestamp: '07:52' },
      { id: 'm5', senderId: 'james', senderName: 'James Chen', senderInitials: 'JC', content: 'Raj is running it — he\'s already there.', timestamp: '07:53' },
      { id: 'm6', senderId: 'raj', senderName: 'Raj Patel', senderInitials: 'RP', content: 'Correct. Will update the inspection log once done.', timestamp: '07:55' },
    ],
  },
  {
    id: '4',
    type: 'job',
    name: 'Site B – Parramatta',
    participants: [
      { id: 'marcus', name: 'Marcus Torres', initials: 'MT', role: 'Project Manager' },
      { id: 'sarah_m', name: 'Sarah Mitchell', initials: 'SM', role: 'WHS Coordinator' },
    ],
    unread: 0,
    jobSite: 'Site B – Parramatta',
    messages: [
      { id: 'm1', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'INC-002 has been logged. Wet surface near entry — non-slip mats are on order.', timestamp: 'Mon', jobTag: 'INC-002' },
      { id: 'm2', senderId: 'marcus', senderName: 'Marcus Torres', senderInitials: 'MT', content: 'CA-002 is now in-progress. Thanks for the quick turnaround.', timestamp: 'Mon' },
      { id: 'm3', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'ETA on the mats is Wednesday. Interim warning signs are already up.', timestamp: 'Mon' },
    ],
  },
  {
    id: '5',
    type: 'direct',
    name: 'Raj Patel',
    participants: [{ id: 'raj', name: 'Raj Patel', initials: 'RP', role: 'WHS Officer' }],
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', senderId: 'raj', senderName: 'Raj Patel', senderInitials: 'RP', content: 'Sarah, can you review the Chemical Register before the audit on Friday?', timestamp: 'Mon' },
      { id: 'm2', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'Sure — I\'ll take a look this afternoon and add my comments.', timestamp: 'Mon' },
      { id: 'm3', senderId: 'raj', senderName: 'Raj Patel', senderInitials: 'RP', content: 'Thanks! I\'ve updated the SDS entries for the new chemicals on-site.', timestamp: 'Mon' },
    ],
  },
  {
    id: '6',
    type: 'group',
    name: 'All Hands – Acme Construction',
    participants: [
      { id: 'james', name: 'James Chen', initials: 'JC', role: 'Site Supervisor' },
      { id: 'marcus', name: 'Marcus Torres', initials: 'MT', role: 'Project Manager' },
      { id: 'raj', name: 'Raj Patel', initials: 'RP', role: 'WHS Officer' },
      { id: 'tom', name: 'Tom Baker', initials: 'TB', role: 'Labourer' },
    ],
    unread: 1,
    messages: [
      { id: 'm1', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'Reminder: Monthly WHS committee meeting this Thursday at 2pm in the site office. All supervisors to attend.', timestamp: 'Fri' },
      { id: 'm2', senderId: 'james', senderName: 'James Chen', senderInitials: 'JC', content: '👍 Confirmed', timestamp: 'Fri' },
      { id: 'm3', senderId: 'marcus', senderName: 'Marcus Torres', senderInitials: 'MT', content: 'I\'ll be there.', timestamp: 'Fri' },
      { id: 'm4', senderId: 'raj', senderName: 'Raj Patel', senderInitials: 'RP', content: 'Same — I\'ll bring the quarterly hazard summary.', timestamp: 'Fri' },
    ],
  },
  {
    id: '7',
    type: 'direct',
    name: 'Tom Baker',
    participants: [{ id: 'tom', name: 'Tom Baker', initials: 'TB', role: 'Labourer' }],
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'Tom, your WHS induction is overdue. Please complete it before your next shift.', timestamp: 'Thu' },
      { id: 'm2', senderId: 'tom', senderName: 'Tom Baker', senderInitials: 'TB', content: 'Sorry about that Sarah. Will do it first thing tomorrow morning.', timestamp: 'Thu' },
      { id: 'm3', senderId: 'sarah', senderName: 'Sarah Mitchell', senderInitials: 'SM', content: 'Thanks Tom. Let me know once it\'s done and I\'ll update the training register.', timestamp: 'Thu' },
    ],
  },
]

const STAFF = [
  { id: 'james', name: 'James Chen', initials: 'JC', role: 'Site Supervisor' },
  { id: 'marcus', name: 'Marcus Torres', initials: 'MT', role: 'Project Manager' },
  { id: 'raj', name: 'Raj Patel', initials: 'RP', role: 'WHS Officer' },
  { id: 'tom', name: 'Tom Baker', initials: 'TB', role: 'Labourer' },
  { id: 'lisa', name: 'Lisa Wong', initials: 'LW', role: 'Emergency Warden' },
  { id: 'chris', name: 'Chris Davis', initials: 'CD', role: 'Electrician' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 'md', online }: { initials: string; size?: 'sm' | 'md' | 'lg'; online?: boolean }) {
  const s = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-[11px]'
  return (
    <div className={`relative flex-shrink-0 ${s} flex items-center justify-center font-bold`}
      style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
      {initials}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2 h-2 border border-[var(--bg)]`}
          style={{ background: online ? '#22c55e' : '#9ca3af' }}
        />
      )}
    </div>
  )
}

function GroupIcon({ type }: { type: 'group' | 'job' }) {
  const Icon = type === 'job' ? Briefcase : Users
  return (
    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
      style={{ background: type === 'job' ? '#eff6ff' : 'var(--bg-secondary)', color: type === 'job' ? '#3b82f6' : 'var(--text-muted)' }}>
      <Icon size={14} />
    </div>
  )
}

function lastMessage(convo: Conversation) {
  const last = convo.messages[convo.messages.length - 1]
  if (!last) return ''
  const prefix = last.senderId === ME.id ? 'You: ' : ''
  return prefix + last.content
}

// ─── Component ────────────────────────────────────────────────────────────────

type Filter = 'all' | 'direct' | 'group' | 'job'

export default function CommunicationsPage() {
  const [convos, setConvos] = useState<Conversation[]>(INITIAL_CONVOS)
  const [selectedId, setSelectedId] = useState<string>('1')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [replyText, setReplyText] = useState('')
  const [showCompose, setShowCompose] = useState(false)

  // Compose state
  const [composeRecipient, setComposeRecipient] = useState('')
  const [composeText, setComposeText] = useState('')
  const [composeTag, setComposeTag] = useState('')

  const threadEndRef = useRef<HTMLDivElement>(null)

  const selected = convos.find(c => c.id === selectedId) ?? null

  // Mark as read when opening
  useEffect(() => {
    if (!selectedId) return
    setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, unread: 0 } : c))
  }, [selectedId])

  // Scroll to bottom on message change
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.messages.length])

  const filtered = convos.filter(c => {
    const matchFilter = filter === 'all' || c.type === filter
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  function sendReply() {
    if (!replyText.trim() || !selectedId) return
    const msg: Message = {
      id: Date.now().toString(),
      senderId: ME.id,
      senderName: ME.name,
      senderInitials: ME.initials,
      content: replyText.trim(),
      timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
    }
    setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, msg] } : c))
    setReplyText('')
  }

  function sendCompose() {
    if (!composeText.trim() || !composeRecipient) return
    const staff = STAFF.find(s => s.id === composeRecipient)
    if (!staff) return

    // Check if DM already exists
    const existing = convos.find(c => c.type === 'direct' && c.participants[0]?.id === composeRecipient)
    if (existing) {
      const msg: Message = {
        id: Date.now().toString(),
        senderId: ME.id,
        senderName: ME.name,
        senderInitials: ME.initials,
        content: composeText.trim(),
        timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
        jobTag: composeTag || undefined,
      }
      setConvos(prev => prev.map(c => c.id === existing.id ? { ...c, messages: [...c.messages, msg] } : c))
      setSelectedId(existing.id)
    } else {
      const newConvo: Conversation = {
        id: Date.now().toString(),
        type: 'direct',
        name: staff.name,
        participants: [staff],
        unread: 0,
        online: false,
        messages: [{
          id: Date.now().toString(),
          senderId: ME.id,
          senderName: ME.name,
          senderInitials: ME.initials,
          content: composeText.trim(),
          timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
          jobTag: composeTag || undefined,
        }],
      }
      setConvos(prev => [newConvo, ...prev])
      setSelectedId(newConvo.id)
    }
    setComposeText('')
    setComposeRecipient('')
    setComposeTag('')
    setShowCompose(false)
  }

  const totalUnread = convos.reduce((s, c) => s + c.unread, 0)

  return (
    // -m-6 cancels the layout's p-6 so we fill the full main area
    <div className="flex h-full -m-6 overflow-hidden" style={{ background: 'var(--bg-canvas)' }}>

      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div
        className="w-72 flex flex-col flex-shrink-0 h-full border-r"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm" style={{ color: 'var(--text)' }}>Messages</span>
            {totalUnread > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 leading-none"
                style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}>
                {totalUnread}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="w-7 h-7 flex items-center justify-center transition-colors hover:opacity-80"
            style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
            title="New message"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full pl-7 pr-3 py-1.5 text-xs outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          {(['all', 'direct', 'group', 'job'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors"
              style={
                filter === f
                  ? { color: 'var(--text)', borderBottom: '2px solid var(--text)' }
                  : { color: 'var(--text-muted)', borderBottom: '2px solid transparent' }
              }
            >
              {f === 'all' ? 'All' : f === 'direct' ? 'DMs' : f === 'group' ? 'Groups' : 'Jobs'}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>No conversations</p>
          )}
          {filtered.map(convo => {
            const isActive = convo.id === selectedId
            const last = convo.messages[convo.messages.length - 1]
            return (
              <button
                key={convo.id}
                onClick={() => setSelectedId(convo.id)}
                className="w-full flex items-start gap-2.5 px-3 py-3 text-left transition-colors border-b"
                style={{
                  borderColor: 'var(--border)',
                  background: isActive ? 'var(--accent-bg)' : 'transparent',
                }}
              >
                {/* Avatar */}
                {convo.type === 'direct'
                  ? <Avatar initials={convo.participants[0]?.initials ?? '?'} online={convo.online} />
                  : <GroupIcon type={convo.type} />
                }

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold truncate" style={{ color: isActive ? 'var(--accent-text)' : 'var(--text)' }}>
                      {convo.name}
                    </span>
                    <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {last?.timestamp ?? ''}
                    </span>
                  </div>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: convo.unread > 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    {lastMessage(convo)}
                  </p>
                </div>

                {/* Unread badge */}
                {convo.unread > 0 && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 leading-none flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}>
                    {convo.unread}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <>
            {/* Thread header */}
            <div
              className="flex items-center justify-between px-5 h-14 border-b flex-shrink-0"
              style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                {selected.type === 'direct'
                  ? <Avatar initials={selected.participants[0]?.initials ?? '?'} size="lg" online={selected.online} />
                  : <GroupIcon type={selected.type} />
                }
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{selected.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {selected.type === 'direct'
                      ? (selected.participants[0]?.role ?? '') + (selected.online ? ' · Online' : ' · Offline')
                      : selected.type === 'group'
                        ? `${selected.participants.length + 1} members`
                        : selected.jobSite ?? 'Job channel'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {selected.type === 'direct' && (
                  <>
                    <button className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }} title="Call">
                      <Phone size={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }} title="Video">
                      <Video size={14} />
                    </button>
                  </>
                )}
                <button className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-muted)' }}>
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ background: 'var(--bg-canvas)' }}>

              {/* Date divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2" style={{ color: 'var(--text-muted)' }}>Today</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>

              {selected.messages.map((msg, idx) => {
                const isMe = msg.senderId === ME.id
                const prevMsg = selected.messages[idx - 1]
                const sameAuthor = prevMsg?.senderId === msg.senderId
                return (
                  <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse' : ''} ${sameAuthor ? 'mt-1' : 'mt-4'}`}>
                    {/* Avatar — hide for consecutive same-author */}
                    {!isMe && (
                      <div className="flex-shrink-0 w-8">
                        {!sameAuthor && <Avatar initials={msg.senderInitials} size="sm" />}
                      </div>
                    )}

                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[68%]`}>
                      {/* Sender name (first in group only) */}
                      {!isMe && !sameAuthor && selected.type !== 'direct' && (
                        <span className="text-[10px] font-semibold mb-1 px-0.5" style={{ color: 'var(--text-muted)' }}>
                          {msg.senderName}
                        </span>
                      )}

                      {/* Bubble */}
                      <div
                        className="px-3.5 py-2.5 text-sm leading-relaxed"
                        style={
                          isMe
                            ? { background: 'var(--accent)', color: 'var(--accent-text)' }
                            : { background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }
                        }
                      >
                        {msg.content}
                      </div>

                      {/* Job tag */}
                      {msg.jobTag && (
                        <div className="flex items-center gap-1 mt-1 px-0.5">
                          <Hash size={9} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{msg.jobTag}</span>
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className="text-[10px] mt-1 px-0.5" style={{ color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                    </div>
                  </div>
                )
              })}
              <div ref={threadEndRef} />
            </div>

            {/* Reply input */}
            <div className="flex-shrink-0 border-t px-4 py-3" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <div className="flex items-end gap-2">
                <div
                  className="flex-1 flex items-end gap-2 px-3 py-2"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                    placeholder={`Message ${selected.name}…`}
                    rows={1}
                    className="flex-1 resize-none text-sm outline-none bg-transparent"
                    style={{ color: 'var(--text)', maxHeight: '120px' }}
                  />
                  <button className="p-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }} title="Attach file">
                    <Paperclip size={14} />
                  </button>
                </div>
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                  className="h-10 w-10 flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--text)', color: 'var(--bg)' }}
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--bg-canvas)' }}>
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg-secondary)' }}>
                <Hash size={28} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Select a conversation</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>or compose a new message</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Compose modal ────────────────────────────────────────────────── */}
      {showCompose && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
            onClick={() => setShowCompose(false)}
          />
          <div
            className="fixed z-50 w-[440px]"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>New Message</p>
              <button onClick={() => setShowCompose(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={15} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4">
              {/* Recipient */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  To
                </label>
                <select
                  value={composeRecipient}
                  onChange={e => setComposeRecipient(e.target.value)}
                  className="w-full px-3 py-2 text-sm outline-none"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: composeRecipient ? 'var(--text)' : 'var(--text-muted)',
                  }}
                >
                  <option value="">Select team member…</option>
                  {STAFF.map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.role}</option>
                  ))}
                </select>
              </div>

              {/* Job tag (optional) */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Job / Reference <span className="font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  value={composeTag}
                  onChange={e => setComposeTag(e.target.value)}
                  placeholder="e.g. Site A – George St, INC-003, CA-002…"
                  className="w-full px-3 py-2 text-sm outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Message
                </label>
                <textarea
                  value={composeText}
                  onChange={e => setComposeText(e.target.value)}
                  placeholder="Write your message…"
                  rows={4}
                  className="w-full px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-xs font-semibold transition-colors"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
              <button
                onClick={sendCompose}
                disabled={!composeRecipient || !composeText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-opacity disabled:opacity-40"
                style={{ background: 'var(--text)', color: 'var(--bg)' }}
              >
                <Send size={12} /> Send Message
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
