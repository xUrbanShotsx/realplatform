'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, Sparkles, ChevronDown } from 'lucide-react'

type Message = { role: 'user' | 'ai'; text: string; typing?: boolean }

const SUGGESTIONS = [
  "What's my biggest compliance risk right now?",
  "Which workers need urgent attention?",
  "How do I improve my audit readiness score?",
  "Summarise today's compliance status",
]

const AI_RESPONSES: Record<string, string> = {
  "What's my biggest compliance risk right now?":
    "Based on your current data, your biggest risk is **contractor compliance** — 1 contractor has expired insurance and 2 have pre-qual reviews overdue. This affects your overall score by ~8 points. I'd recommend sending renewal requests today.\n\nSecondary risk: 3 workers have licences expiring within 14 days. Use the Workers page to send automated renewal reminders.",

  "Which workers need urgent attention?":
    "**4 workers need immediate attention:**\n\n1. James Chen — EWP licence expires in 6 days\n2. Marco Torres — Forklift licence expired (non-compliant)\n3. Raj Patel — Scaffolding cert expiring in 11 days\n4. Lisa Park — Induction overdue by 3 weeks\n\nWould you like me to draft renewal reminder emails for these workers?",

  "How do I improve my audit readiness score?":
    "Your audit readiness is at **78%**. Here are the top 3 actions to reach 90%+:\n\n1. **Upload 4 missing documents** (+6 pts) — WHS Management Plan and 3 site-specific risk assessments are missing\n2. **Close 2 corrective actions** (+5 pts) — Both are overdue by more than 30 days\n3. **Complete contractor pre-qualification** for 2 pending contractors (+4 pts)\n\nCompleting these would take your score to ~93% — audit ready.",

  "Summarise today's compliance status":
    "**Today's compliance snapshot for Acme Construction:**\n\n✅ Overall score: 82/100 (↑2 from last week)\n⚠️ 5 tasks due today, 2 overdue\n🔴 2 open incidents under review\n⏳ 4 expiring certs/licences this month\n\n**What's working:** Training completion is up to 84% (↑5%). Site A passed yesterday's inspection with 97%.\n\n**What needs attention:** Contractor compliance has dropped to 87%. Review the Contractors page for details.",
}

function getResponse(input: string): string {
  const key = Object.keys(AI_RESPONSES).find(k =>
    k.toLowerCase() === input.toLowerCase()
  )
  if (key) return AI_RESPONSES[key]
  return "That's a great question about your compliance data. Based on your current metrics, I'd recommend focusing on the expiring items and overdue tasks first — these have the highest impact on your audit readiness score. Head to the Tasks page to see a prioritised action list, or ask me something more specific."
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === 'ai'
  const lines = msg.text.split('\n').filter(Boolean)

  return (
    <div className={`flex gap-2 ${isAI ? '' : 'flex-row-reverse'}`}>
      {isAI && (
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--accent)' }}>
          <Sparkles size={13} style={{ color: 'var(--accent-text)' }} />
        </div>
      )}
      <div
        className="max-w-[85%] px-3 py-2.5 text-xs leading-relaxed"
        style={isAI
          ? { background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }
          : { background: 'var(--accent)', color: 'var(--accent-text)' }}
      >
        {msg.typing ? (
          <span className="flex gap-1 py-0.5">
            <span className="w-1.5 h-1.5 animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: '300ms' }} />
          </span>
        ) : (
          lines.map((line, i) => {
            // Bold **text**
            const parts = line.split(/\*\*(.*?)\*\*/g)
            return (
              <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                {parts.map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )}
              </p>
            )
          })
        )}
      </div>
    </div>
  )
}

export function AIAssistant() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi Sarah 👋 I'm your AI compliance assistant. I can analyse your data, predict risks, and recommend actions. What would you like to know?" }
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', text }
    const typingMsg: Message = { role: 'ai', text: '', typing: true }
    setMessages(m => [...m, userMsg, typingMsg])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const response = getResponse(text)
      setMessages(m => [...m.slice(0, -1), { role: 'ai', text: response }])
      setLoading(false)
    }, 1400)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
        title="AI Compliance Assistant"
      >
        {open ? <ChevronDown size={20} /> : <Sparkles size={20} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-22 right-6 z-50 w-80 flex flex-col shadow-2xl overflow-hidden"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            height: '480px',
            bottom: '80px',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} />
              <div>
                <p className="text-xs font-bold leading-none">AI Compliance Assistant</p>
                <p className="text-[10px] opacity-70 mt-0.5">Powered by Briesa AI</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="opacity-70 hover:opacity-100 transition-opacity">
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only at start) */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Suggested questions</p>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-xs px-2.5 py-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 px-3 py-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            <input
              className="flex-1 px-3 py-1.5 text-xs outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="Ask anything about compliance…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              disabled={loading}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
