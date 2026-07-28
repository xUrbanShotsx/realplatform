import { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { saveAppraisal, blankAppraisal, type AppraisalType } from '../../store/appraisals'

const BLUE = '#3B6BF7'
const GREEN = '#10b981'
const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.10)'

const TIMES = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
const DATES = ['Today', 'Tomorrow', 'This Week', 'Next Week']

export default function ScheduleAppraisalScreen() {
  const [form, setForm] = useState({
    type: 'Sale' as AppraisalType,
    address: '',
    suburb: '',
    clientName: '',
    clientPhone: '',
    date: 'Today',
    time: '10:00 AM',
  })
  const [focused, setFocused] = useState<string | null>(null)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (startNow = false) => {
    if (!form.address.trim()) { Alert.alert('Required', 'Please enter the property address.'); return }
    const appraisal = blankAppraisal({
      type: form.type,
      address: form.address,
      suburb: form.suburb,
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      date: form.date,
      time: form.time,
      status: startNow ? 'In Progress' : 'Scheduled',
    })
    await saveAppraisal(appraisal)
    if (startNow) {
      router.replace({ pathname: '/appraisal/[id]', params: { id: appraisal.id } })
    } else {
      Alert.alert('Appraisal Scheduled', `${form.address} added to your appraisals.`, [
        { text: 'View All', onPress: () => { router.back(); router.push('/appraisals') } },
        { text: 'Done', onPress: () => router.back() },
      ])
    }
  }

  const TYPE_COLORS: Record<AppraisalType, string> = { Sale: BLUE, Rental: GREEN, Both: PURPLE }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Feather name="x" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Schedule Appraisal</Text>
        <TouchableOpacity onPress={() => handleSave(false)} style={s.saveBtn}>
          <Text style={s.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

          <Text style={s.sectionHead}>Appraisal Type</Text>
          <View style={s.typeRow}>
            {(['Sale', 'Rental', 'Both'] as AppraisalType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[s.typeBtn, form.type === t && { backgroundColor: TYPE_COLORS[t], borderColor: TYPE_COLORS[t] }]}
                onPress={() => set('type', t)}
                activeOpacity={0.7}
              >
                <Text style={[s.typeTxt, form.type === t && s.typeTxtActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.sectionHead}>Property</Text>
          <View style={s.fieldWrap}>
            <TextInput
              style={[s.input, focused === 'address' && s.inputFocused]}
              placeholder="Street address *"
              placeholderTextColor={TEXT3}
              value={form.address}
              onChangeText={v => set('address', v)}
              onFocus={() => setFocused('address')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={s.fieldWrap}>
            <TextInput
              style={[s.input, focused === 'suburb' && s.inputFocused]}
              placeholder="Suburb"
              placeholderTextColor={TEXT3}
              value={form.suburb}
              onChangeText={v => set('suburb', v)}
              onFocus={() => setFocused('suburb')}
              onBlur={() => setFocused(null)}
            />
          </View>

          <Text style={s.sectionHead}>Client / Vendor</Text>
          <View style={s.fieldWrap}>
            <TextInput
              style={[s.input, focused === 'client' && s.inputFocused]}
              placeholder="Client name"
              placeholderTextColor={TEXT3}
              value={form.clientName}
              onChangeText={v => set('clientName', v)}
              onFocus={() => setFocused('client')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={s.fieldWrap}>
            <TextInput
              style={[s.input, focused === 'phone' && s.inputFocused]}
              placeholder="Phone number"
              placeholderTextColor={TEXT3}
              keyboardType="phone-pad"
              value={form.clientPhone}
              onChangeText={v => set('clientPhone', v)}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
            />
          </View>

          <Text style={s.sectionHead}>Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {DATES.map(d => (
              <TouchableOpacity key={d} style={[s.pill, form.date === d && s.pillActive]} onPress={() => set('date', d)} activeOpacity={0.7}>
                <Text style={[s.pillTxt, form.date === d && s.pillTxtActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.sectionHead}>Time</Text>
          <View style={[s.timeGrid, { marginBottom: 24 }]}>
            {TIMES.map(t => (
              <TouchableOpacity key={t} style={[s.timePill, form.time === t && s.timePillActive]} onPress={() => set('time', t)} activeOpacity={0.7}>
                <Text style={[s.timeTxt, form.time === t && s.timeTxtActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {form.address.trim().length > 0 && (
            <View style={s.summaryCard}>
              <View style={[s.summaryIcon, { backgroundColor: TYPE_COLORS[form.type] + '18' }]}>
                <Feather name="clipboard" size={16} color={TYPE_COLORS[form.type]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.summaryAddr}>{form.address}{form.suburb ? `, ${form.suburb}` : ''}</Text>
                <Text style={s.summarySub}>{form.type} Appraisal · {form.date} at {form.time}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={() => handleSave(true)} style={[s.btn, { backgroundColor: TYPE_COLORS[form.type] }]} activeOpacity={0.85}>
            <Feather name="play" size={16} color="#fff" />
            <Text style={s.btnTxt}>Start Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSave(false)} style={s.btnSecondary} activeOpacity={0.85}>
            <Text style={s.btnSecondaryTxt}>Schedule for Later</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  iconBtn: { width: 44, alignItems: 'flex-start' },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },
  saveBtn: { width: 44, alignItems: 'flex-end' },
  saveTxt: { fontSize: 15, fontWeight: '700', color: BLUE },
  content: { padding: 20, paddingBottom: 48 },
  sectionHead: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: 'transparent' },
  typeTxt: { fontSize: 13, fontWeight: '700', color: TEXT2 },
  typeTxtActive: { color: '#fff' },
  fieldWrap: { marginBottom: 12 },
  input: { backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: TEXT },
  inputFocused: { borderColor: BLUE, backgroundColor: '#fff' },
  pill: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: 'transparent' },
  pillActive: { backgroundColor: '#EEF2FF', borderColor: BLUE },
  pillTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  pillTxtActive: { color: BLUE },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timePill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: BORDER },
  timePillActive: { backgroundColor: BLUE, borderColor: BLUE },
  timeTxt: { fontSize: 12, fontWeight: '600', color: TEXT2 },
  timeTxtActive: { color: '#fff' },
  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 20 },
  summaryIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  summaryAddr: { fontSize: 13, fontWeight: '700', color: TEXT },
  summarySub: { fontSize: 12, color: TEXT2, marginTop: 2 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16, marginBottom: 10 },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
  btnSecondary: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: '#f1f5f9' },
  btnSecondaryTxt: { fontSize: 15, fontWeight: '600', color: TEXT2 },
})
