import { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import {
  getAppraisal, saveAppraisal, blankAppraisal,
  type Appraisal, type AppraisalType, type CampaignType,
} from '../../store/appraisals'

const BLUE = '#3B6BF7'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.09)'

const PROPERTY_TYPES = ['House', 'Unit', 'Townhouse', 'Villa', 'Land', 'Rural']
const CAMPAIGNS: CampaignType[] = ['Auction', 'Private Treaty', 'EOI', 'TBD']
const LEASE_TERMS = ['6 months', '12 months', '18 months', '24 months']

function SectionHeader({ icon, title, color = BLUE }: { icon: string; title: string; color?: string }) {
  return (
    <View style={sh.row}>
      <View style={[sh.iconWrap, { backgroundColor: color + '18' }]}>
        <Feather name={icon as any} size={14} color={color} />
      </View>
      <Text style={sh.title}>{title}</Text>
    </View>
  )
}

function Field({
  label, value, onChange, placeholder = '', multiline = false,
  keyboardType = 'default', prefix, suffix, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; multiline?: boolean
  keyboardType?: any; prefix?: string; suffix?: string; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}{required && <Text style={f.req}> *</Text>}</Text>
      <View style={[f.inputRow, focused && f.focused]}>
        {prefix && <Text style={f.affix}>{prefix}</Text>}
        <TextInput
          style={[f.input, multiline && f.multi]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={TEXT3}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffix && <Text style={f.affix}>{suffix}</Text>}
      </View>
    </View>
  )
}

function PillSelect<T extends string>({
  options, value, onChange, colors,
}: { options: T[]; value: T; onChange: (v: T) => void; colors?: Record<string, string> }) {
  return (
    <View style={ps.row}>
      {options.map(o => {
        const active = value === o
        const col = colors?.[o] ?? BLUE
        return (
          <TouchableOpacity
            key={o}
            style={[ps.pill, active && { backgroundColor: col, borderColor: col }]}
            onPress={() => onChange(o)}
            activeOpacity={0.7}
          >
            <Text style={[ps.txt, active && ps.txtActive]}>{o}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default function AppraisalSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [form, setForm] = useState<Appraisal | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) { setForm(blankAppraisal()); return }
    getAppraisal(id).then(a => setForm(a ?? blankAppraisal({ id })))
  }, [id])

  if (!form) return null

  const set = (k: keyof Appraisal, v: string) => setForm(f => f ? { ...f, [k]: v } : f)
  const setType = (t: AppraisalType) => setForm(f => f ? { ...f, type: t } : f)

  const isSale   = form.type === 'Sale'   || form.type === 'Both'
  const isRental = form.type === 'Rental' || form.type === 'Both'

  const handleSave = async (complete = false) => {
    if (!form.address.trim()) { Alert.alert('Required', 'Please enter the property address.'); return }
    setSaving(true)
    const updated: Appraisal = {
      ...form,
      status: complete ? 'Completed' : form.status === 'Scheduled' ? 'In Progress' : form.status,
      completedAt: complete ? new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : form.completedAt,
    }
    await saveAppraisal(updated)
    setSaving(false)
    if (complete) {
      Alert.alert('Appraisal Complete', 'Appraisal has been saved.', [{ text: 'Done', onPress: () => router.back() }])
    } else {
      Alert.alert('Saved', 'Progress saved.')
    }
  }

  const statusColor = form.status === 'Completed' ? GREEN : form.status === 'In Progress' ? AMBER : BLUE

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Feather name="chevron-left" size={24} color={TEXT} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerAddr} numberOfLines={1}>{form.address || 'New Appraisal'}</Text>
          <View style={[s.statusBadge, { backgroundColor: statusColor + '18' }]}>
            <Text style={[s.statusTxt, { color: statusColor }]}>{form.status}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleSave(false)} style={s.saveBtn} disabled={saving}>
          <Text style={s.saveTxt}>{saving ? '…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Type selector */}
          <View style={s.typeCard}>
            <Text style={s.typeLabel}>Appraisal Type</Text>
            <PillSelect<AppraisalType>
              options={['Sale', 'Rental', 'Both']}
              value={form.type}
              onChange={setType}
              colors={{ Sale: BLUE, Rental: GREEN, Both: PURPLE }}
            />
          </View>

          {/* Property details */}
          <View style={s.section}>
            <SectionHeader icon="home" title="Property Details" />
            <Field label="Address" value={form.address} onChange={v => set('address', v)} placeholder="123 Example St" required />
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <Field label="Suburb" value={form.suburb} onChange={v => set('suburb', v)} placeholder="Suburb" />
              </View>
              <View style={{ width: 90 }}>
                <Field label="Postcode" value={form.postcode} onChange={v => set('postcode', v)} placeholder="2000" keyboardType="number-pad" />
              </View>
            </View>
            <Text style={f.label}>Property Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
              {PROPERTY_TYPES.map(pt => (
                <TouchableOpacity
                  key={pt}
                  style={[ps.pill, form.propertyType === pt && { backgroundColor: BLUE, borderColor: BLUE }]}
                  onPress={() => set('propertyType', pt)}
                  activeOpacity={0.7}
                >
                  <Text style={[ps.txt, form.propertyType === pt && ps.txtActive]}>{pt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <Field label="Bedrooms" value={form.bedrooms} onChange={v => set('bedrooms', v)} keyboardType="number-pad" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Bathrooms" value={form.bathrooms} onChange={v => set('bathrooms', v)} keyboardType="number-pad" />
              </View>
            </View>
            <Field label="Condition Notes" value={form.conditionNotes} onChange={v => set('conditionNotes', v)} placeholder="Overall condition of the property…" multiline />
          </View>

          {/* Client */}
          <View style={s.section}>
            <SectionHeader icon="user" title="Client / Vendor" color={PURPLE} />
            <Field label="Client Name" value={form.clientName} onChange={v => set('clientName', v)} placeholder="Full name" />
            <Field label="Phone" value={form.clientPhone} onChange={v => set('clientPhone', v)} placeholder="04xx xxx xxx" keyboardType="phone-pad" />
          </View>

          {/* ── SALE PRICING ─────────────────────────────────────────────── */}
          {isSale && (
            <View style={s.section}>
              <SectionHeader icon="trending-up" title="Sale Pricing" color={BLUE} />
              <View style={s.row2}>
                <View style={{ flex: 1 }}>
                  <Field label="Price Low" value={form.saleLow} onChange={v => set('saleLow', v)} prefix="$" placeholder="2,800,000" keyboardType="number-pad" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Price High" value={form.saleHigh} onChange={v => set('saleHigh', v)} prefix="$" placeholder="3,100,000" keyboardType="number-pad" />
                </View>
              </View>
              <Field label="Price Guide (to show vendor)" value={form.saleGuide} onChange={v => set('saleGuide', v)} placeholder="e.g. $2.9M–$3.1M" />
              <Text style={f.label}>Campaign Type</Text>
              <PillSelect<CampaignType> options={CAMPAIGNS} value={form.campaign} onChange={v => set('campaign', v)} />
              <View style={{ height: 14 }} />
            </View>
          )}

          {/* ── SALE FEES ────────────────────────────────────────────────── */}
          {isSale && (
            <View style={s.section}>
              <SectionHeader icon="percent" title="Sale Fees" color={BLUE} />
              <View style={s.row2}>
                <View style={{ flex: 1 }}>
                  <Field label="Commission" value={form.commission} onChange={v => set('commission', v)} suffix="%" placeholder="2.0" keyboardType="decimal-pad" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Settlement (days)" value={form.settlement} onChange={v => set('settlement', v)} placeholder="42" keyboardType="number-pad" />
                </View>
              </View>
              <Field label="Marketing Budget" value={form.marketing} onChange={v => set('marketing', v)} prefix="$" placeholder="15,000" keyboardType="number-pad" />
            </View>
          )}

          {/* ── RENTAL PRICING ───────────────────────────────────────────── */}
          {isRental && (
            <View style={s.section}>
              <SectionHeader icon="home" title="Rental Pricing" color={GREEN} />
              <View style={s.row2}>
                <View style={{ flex: 1 }}>
                  <Field label="Rent Low (pw)" value={form.rentLow} onChange={v => set('rentLow', v)} prefix="$" placeholder="620" keyboardType="number-pad" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Rent High (pw)" value={form.rentHigh} onChange={v => set('rentHigh', v)} prefix="$" placeholder="680" keyboardType="number-pad" />
                </View>
              </View>
              <Field label="Recommended Rent (pw)" value={form.rentRecommended} onChange={v => set('rentRecommended', v)} prefix="$" placeholder="650" keyboardType="number-pad" />
              <Text style={f.label}>Lease Term</Text>
              <PillSelect<string>
                options={LEASE_TERMS}
                value={form.leaseTerm ? `${form.leaseTerm} months` : '12 months'}
                onChange={v => set('leaseTerm', v.replace(' months', ''))}
              />
              <View style={{ height: 14 }} />
            </View>
          )}

          {/* ── RENTAL FEES ──────────────────────────────────────────────── */}
          {isRental && (
            <View style={s.section}>
              <SectionHeader icon="percent" title="Rental Fees" color={GREEN} />
              <View style={s.row2}>
                <View style={{ flex: 1 }}>
                  <Field label="Management Fee" value={form.managementFee} onChange={v => set('managementFee', v)} suffix="%" placeholder="8.0" keyboardType="decimal-pad" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Letting Fee (weeks)" value={form.lettingFee} onChange={v => set('lettingFee', v)} placeholder="1" keyboardType="decimal-pad" />
                </View>
              </View>
            </View>
          )}

          {/* Notes */}
          <View style={s.section}>
            <SectionHeader icon="edit-2" title="Notes" color={AMBER} />
            <Field label="Property Notes" value={form.propertyNotes} onChange={v => set('propertyNotes', v)} placeholder="Features, unique selling points, improvements needed…" multiline />
            <Field label="Comparable Sales/Rentals" value={form.comparableNotes} onChange={v => set('comparableNotes', v)} placeholder="Recent comparable properties and prices…" multiline />
            <Field label="Vendor / Client Notes" value={form.vendorNotes} onChange={v => set('vendorNotes', v)} placeholder="Motivation, timeline, concerns, preferred method…" multiline />
          </View>

          {/* Complete button */}
          {form.status !== 'Completed' && (
            <TouchableOpacity
              style={s.completeBtn}
              onPress={() => {
                Alert.alert(
                  'Complete Appraisal',
                  'Mark this appraisal as complete and save all notes?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Complete', onPress: () => handleSave(true) },
                  ]
                )
              }}
              activeOpacity={0.85}
            >
              <Feather name="check-circle" size={18} color="#fff" />
              <Text style={s.completeTxt}>Complete Appraisal</Text>
            </TouchableOpacity>
          )}

          {form.status === 'Completed' && (
            <View style={s.doneCard}>
              <Feather name="check-circle" size={18} color={GREEN} />
              <Text style={s.doneTxt}>Completed {form.completedAt}</Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0',
  },
  iconBtn: { width: 44 },
  headerCenter: { flex: 1, alignItems: 'center', gap: 4 },
  headerAddr: { fontSize: 15, fontWeight: '700', color: TEXT, maxWidth: 220 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  statusTxt: { fontSize: 10, fontWeight: '700' },
  saveBtn: { width: 44, alignItems: 'flex-end' },
  saveTxt: { fontSize: 15, fontWeight: '700', color: BLUE },

  content: { padding: 16, gap: 12 },
  section: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, paddingBottom: 4,
    shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8,
  },
  typeCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8,
  },
  typeLabel: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  row2: { flexDirection: 'row', gap: 12 },
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: GREEN, borderRadius: 14, paddingVertical: 16, marginTop: 4,
  },
  completeTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
  doneCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: GREEN + '18', borderRadius: 14, paddingVertical: 14, marginTop: 4,
    borderWidth: 1.5, borderColor: GREEN + '30',
  },
  doneTxt: { fontSize: 14, fontWeight: '700', color: GREEN },
})

const sh = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  iconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 13, fontWeight: '700', color: TEXT, textTransform: 'uppercase', letterSpacing: 0.4 },
})

const f = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: TEXT3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3 },
  req: { color: '#ef4444' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8fafc', borderRadius: 10,
    borderWidth: 1.5, borderColor: BORDER,
    paddingHorizontal: 12,
  },
  focused: { borderColor: BLUE, backgroundColor: '#fff' },
  input: { flex: 1, fontSize: 15, color: TEXT, paddingVertical: 11 },
  multi: { height: 88, paddingTop: 10, paddingBottom: 10 },
  affix: { fontSize: 15, color: TEXT3, fontWeight: '500' },
})

const ps = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  pill: {
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20, backgroundColor: '#f1f5f9',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  txt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  txtActive: { color: '#fff' },
})
