'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { Drawer, Field, TextInput, Select, SubmitRow } from '@/components/ui/Drawer'
import { documents } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Plus, Search, FileText, FileSpreadsheet, Download, ExternalLink } from 'lucide-react'

const categories = [
  { key: 'all', label: 'All Documents' },
  { key: 'policy', label: 'Policies' },
  { key: 'procedure', label: 'Procedures' },
  { key: 'form', label: 'Forms' },
  { key: 'register', label: 'Registers' },
  { key: 'certificate', label: 'Certificates' },
]

const fileTypeConfig: Record<string, { icon: typeof FileText; color: string; bg: string; label: string }> = {
  pdf:  { icon: FileText,        color: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-900/20',   label: 'PDF'  },
  docx: { icon: FileText,        color: 'text-blue-500',  bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'DOCX' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'XLSX' },
}

type Doc = {
  id: string
  name: string
  category: 'policy' | 'procedure' | 'form' | 'register' | 'certificate'
  fileType: 'pdf' | 'docx' | 'xlsx'
  version: string
  lastUpdated: string
}

interface FormState {
  name: string
  category: string
  fileType: string
  version: string
}

const emptyForm = (): FormState => ({ name: '', category: '', fileType: '', version: '' })

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([...documents])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const filtered = docs.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || d.category === activeCategory
    return matchesSearch && matchesCategory
  })

  function openDrawer() {
    setForm(emptyForm())
    setSaved(false)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.category || !form.fileType) return
    setSaving(true)
    setTimeout(() => {
      const newDoc: Doc = {
        id: String(Date.now()),
        name: form.name,
        category: form.category as Doc['category'],
        fileType: form.fileType as Doc['fileType'],
        version: form.version || 'v1.0',
        lastUpdated: new Date().toISOString().slice(0, 10),
      }
      setDocs((prev) => [newDoc, ...prev])
      setSaving(false)
      setSaved(true)
      setTimeout(() => {
        setDrawerOpen(false)
        setSaved(false)
      }, 900)
    }, 600)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Document Library"
        description="Policies, procedures, forms, registers and certificates"
        action={{ label: 'Upload Document', icon: <Plus size={14} />, onClick: openDrawer }}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search documents…"
            className="pl-8 w-52"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <div className="w-48 flex-shrink-0">
          <Card className="p-2">
            {categories.map(({ key, label }) => {
              const count = key === 'all' ? docs.length : docs.filter((d) => d.category === key).length
              const isActive = activeCategory === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors"
                  style={
                    isActive
                      ? { background: 'var(--accent-bg)', color: 'var(--accent-text)' }
                      : { color: 'var(--text-secondary)' }
                  }
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '' }}
                >
                  <span>{label}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none"
                    style={
                      isActive
                        ? { background: 'rgba(0,0,0,0.15)', color: 'var(--accent-text)' }
                        : { background: 'var(--bg-secondary)', color: 'var(--text-muted)' }
                    }
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </Card>
        </div>

        {/* Document Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <Card className="py-16 text-center">
              <p className="text-neutral-400 text-sm">No documents found</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((doc) => {
                const { icon: Icon, color, bg, label } = fileTypeConfig[doc.fileType]
                return (
                  <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                          <span style={{ color: 'var(--border)' }}>·</span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{doc.version}</span>
                          <span style={{ color: 'var(--border)' }}>·</span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Updated {formatDate(doc.lastUpdated)}</span>
                        </div>
                        <span
                          className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5"
                          style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        >
                          {doc.category}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = '' }}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          className="p-1.5 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = '' }}
                        >
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title="Upload Document"
        subtitle="Add a new document to the library"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Document Name" required>
            <TextInput
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="e.g. WHS Management Plan 2026"
            />
          </Field>

          <Field label="Category" required>
            <Select
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              options={[
                { value: 'policy',      label: 'Policy'      },
                { value: 'procedure',   label: 'Procedure'   },
                { value: 'form',        label: 'Form'        },
                { value: 'register',    label: 'Register'    },
                { value: 'certificate', label: 'Certificate' },
              ]}
              placeholder="Select category…"
            />
          </Field>

          <Field label="File Type" required>
            <Select
              value={form.fileType}
              onChange={(v) => setForm((f) => ({ ...f, fileType: v }))}
              options={[
                { value: 'pdf',  label: 'PDF'  },
                { value: 'docx', label: 'DOCX' },
                { value: 'xlsx', label: 'XLSX' },
              ]}
              placeholder="Select file type…"
            />
          </Field>

          <Field label="Version">
            <TextInput
              value={form.version}
              onChange={(v) => setForm((f) => ({ ...f, version: v }))}
              placeholder="e.g. v1.0"
            />
          </Field>

          <Field label="File">
            <div
              className="w-full px-4 py-6 text-sm text-center cursor-pointer select-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px dashed var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              Click to select file (simulation)
            </div>
          </Field>

          <SubmitRow
            saving={saving}
            saved={saved}
            submitLabel="Upload Document"
            savedLabel="Uploaded!"
            onCancel={closeDrawer}
          />
        </form>
      </Drawer>
    </div>
  )
}
