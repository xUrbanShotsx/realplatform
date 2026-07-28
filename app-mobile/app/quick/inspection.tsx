import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { PROPERTIES } from '../../store/sessions'

const BLUE = '#3B6BF7'; const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.10)'
const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const TIMES = ['9:00 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']
const DURATIONS = ['30 min', '45 min', '1 hour', '90 min']

export default function AddInspectionScreen() {
  const [form, setForm] = useState({ propertyId: PROPERTIES[0].id, day: 'Saturday', startTime: '10:00 AM', duration: '30 min', notes: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const selectedProp = PROPERTIES.find(p => p.id === form.propertyId)!

  const handleSave = () => {
    Alert.alert('Inspection Scheduled', `OFI at ${selectedProp.address} on ${form.day} at ${form.startTime}.`, [{ text: 'OK', onPress: () => router.back() }])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}><Feather name="x" size={22} color={TEXT} /></TouchableOpacity>
        <Text style={s.title}>Schedule OFI</Text>
        <TouchableOpacity onPress={handleSave} style={s.saveBtn}><Text style={s.saveTxt}>Save</Text></TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

          <Text style={s.sectionHead}>Property</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {PROPERTIES.map(p => (
              <TouchableOpacity key={p.id} onPress={() => set('propertyId', p.id)} style={[s.propChip, form.propertyId === p.id && s.propChipActive]} activeOpacity={0.7}>
                <Text style={[s.propChipTxt, form.propertyId === p.id && s.propChipTxtActive]} numberOfLines={1}>{p.address}</Text>
                <Text style={[s.propChipSub, form.propertyId === p.id && { color: 'rgba(255,255,255,0.8)' }]}>{p.suburb}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.sectionHead}>Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {DAYS.map(d => (
              <TouchableOpacity key={d} onPress={() => set('day', d)} style={[s.pill, form.day === d && s.pillActive]} activeOpacity={0.7}>
                <Text style={[s.pillTxt, form.day === d && s.pillTxtActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.sectionHead}>Start Time</Text>
          <View style={[s.segRow, { marginBottom: 20, flexWrap: 'wrap' }]}>
            {TIMES.map(t => (
              <TouchableOpacity key={t} onPress={() => set('startTime', t)} style={[s.timePill, form.startTime === t && s.timePillActive]} activeOpacity={0.7}>
                <Text style={[s.timeTxt, form.startTime === t && s.timeTxtActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.sectionHead}>Duration</Text>
          <View style={[s.segRow, { marginBottom: 20 }]}>
            {DURATIONS.map(d => (
              <TouchableOpacity key={d} onPress={() => set('duration', d)} style={[s.pill, form.duration === d && s.pillActive]} activeOpacity={0.7}>
                <Text style={[s.pillTxt, form.duration === d && s.pillTxtActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.fieldWrap}>
            <Text style={s.sectionHead}>Notes</Text>
            <TextInput style={[s.input, s.inputMulti, focused === 'notes' && s.inputFocused]} placeholder="Any specific instructions…" placeholderTextColor={TEXT3} multiline numberOfLines={3} value={form.notes} onChangeText={v => set('notes', v)} onFocus={() => setFocused('notes')} onBlur={() => setFocused(null)} textAlignVertical="top" />
          </View>

          <View style={s.summaryCard}>
            <Feather name="home" size={16} color={BLUE} />
            <View style={{ flex: 1 }}>
              <Text style={s.summaryAddr}>{selectedProp.address}</Text>
              <Text style={s.summarySub}>{form.day} · {form.startTime} · {form.duration}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleSave} style={s.btn} activeOpacity={0.85}>
            <Text style={s.btnTxt}>Schedule Inspection</Text>
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
  fieldWrap: { marginBottom: 18 },
  input: { backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: TEXT },
  inputFocused: { borderColor: BLUE, backgroundColor: '#fff' },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  segRow: { flexDirection: 'row', gap: 8 },
  pill: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: 'transparent' },
  pillActive: { backgroundColor: '#EEF2FF', borderColor: BLUE },
  pillTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  pillTxtActive: { color: BLUE },
  timePill: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: BORDER, marginBottom: 8 },
  timePillActive: { backgroundColor: BLUE, borderColor: BLUE },
  timeTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  timeTxtActive: { color: '#fff' },
  propChip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: BORDER, minWidth: 130 },
  propChipActive: { backgroundColor: BLUE, borderColor: BLUE },
  propChipTxt: { fontSize: 13, fontWeight: '700', color: TEXT },
  propChipTxtActive: { color: '#fff' },
  propChipSub: { fontSize: 11, color: TEXT3, marginTop: 2 },
  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#EEF2FF', borderRadius: 12, padding: 14, marginBottom: 16 },
  summaryAddr: { fontSize: 13, fontWeight: '700', color: TEXT },
  summarySub: { fontSize: 12, color: TEXT2, marginTop: 2 },
  btn: { backgroundColor: BLUE, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
