'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  width?: string
}

export function Drawer({ open, onClose, title, subtitle, children, width = 'w-[480px]' }: DrawerProps) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-50 ${width} flex flex-col`}
        style={{ background: 'var(--bg)', borderLeft: '1px solid var(--border)', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>{title}</h2>
            {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </>
  )
}

// ── Reusable form field helpers ───────────────────────────────────────────────

export function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

export function TextInput({
  value, onChange, placeholder, type = 'text',
}: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm outline-none"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
    />
  )
}

export function TextArea({
  value, onChange, placeholder, rows = 3,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm outline-none resize-none"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
    />
  )
}

export function Select({
  value, onChange, options, placeholder = 'Select…',
}: { value: string; onChange: (v: string) => void; options: string[] | { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm outline-none"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
    >
      <option value="">{placeholder}</option>
      {(options as Array<string | { value: string; label: string }>).map(o =>
        typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  )
}

export function RadioGroup({
  value, onChange, options, colorMap,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  colorMap?: Record<string, string>
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = value === o.value
        const accentColor = colorMap?.[o.value]
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="px-3 py-1.5 text-xs font-semibold transition-all"
            style={active
              ? { background: accentColor ?? 'var(--accent)', color: accentColor ? '#fff' : 'var(--accent-text)', border: `1px solid ${accentColor ?? 'var(--accent)'}` }
              : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function SubmitRow({
  saving, saved, savedLabel = 'Saved!', submitLabel = 'Save', onCancel,
}: { saving: boolean; saved: boolean; savedLabel?: string; submitLabel?: string; onCancel: () => void }) {
  return (
    <div className="flex gap-3 pt-4 mt-4" style={{ borderTop: '1px solid var(--border)' }}>
      <button
        type="submit"
        disabled={saving || saved}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold disabled:opacity-60 transition-opacity"
        style={{ background: saved ? '#22c55e' : 'var(--accent)', color: saved ? '#fff' : 'var(--accent-text)' }}
      >
        {saved ? savedLabel : saving ? 'Saving…' : submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--bg-hover)]"
        style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
      >
        Cancel
      </button>
    </div>
  )
}
