import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { PROPERTIES } from '../../store/sessions'

const BLUE = '#3B6BF7'; const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.10)'
const SOURCES = ['REA', 'Domain', 'Sign Board', 'Social Media', 'Referral', 'Walk-in']

export default function AddEnquiryScreen() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', propertyId: PROPERTIES[0].id, source: 'REA', notes: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const selectedProp = PROPERTIES.find(p => p.id === form.propertyId)!

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) { Alert.alert('Required', 'Name and phone are required.'); return }
    Alert.alert('Enquiry Logged', `Enquiry from ${form.name} recorded.`, [{ text: 'OK', onPress: () => router.back() }])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}><Feather name="x" size={22} color={TEXT} /></TouchableOpacity>
        <Text style={s.title}>Log Enquiry</Text>
        <TouchableOpacity onPress={handleSave} style={s.saveBtn}><Text style={s.saveTxt}>Save</Text></TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

          <Text style={s.sectionHead}>Contact Details</Text>
          {[{ k: 'name', label: 'Full Name *', ph: 'e.g. Alex Thompson', kb: 'default' },
            { k: 'phone', label: 'Phone *', ph: 'e.g. 0412 345 678', kb: 'phone-pad' },
            { k: 'email', label: 'Email', ph: 'e.g. alex@email.com', kb: 'email-address' }].map(f => (
            <View key={f.k} style={s.fieldWrap}>
              <Text style={s.label}>{f.label}</Text>
              <TextInput style={[s.input, focused === f.k && s.inputFocused]} placeholder={f.ph} placeholderTextColor={TEXT3} keyboardType={f.kb as any} autoCapitalize={f.kb === 'email-address' ? 'none' : 'words'} value={(form as any)[f.k]} onChangeText={v => set(f.k, v)} onFocus={() => setFocused(f.k)} onBlur={() => setFocused(null)} />
            </View>
          ))}

          <Text style={[s.sectionHead, { marginTop: 8 }]}>Property</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {PROPERTIES.map(p => (
              <TouchableOpacity key={p.id} onPress={() => set('propertyId', p.id)} style={[s.propChip, form.propertyId === p.id && s.propChipActive]} activeOpacity={0.7}>
                <Text style={[s.propChipTxt, form.propertyId === p.id && s.propChipTxtActive]} numberOfLines={1}>{p.address}</Text>
                <Text style={[s.propChipSub, form.propertyId === p.id && { color: 'rgba(255,255,255,0.8)' }]}>{p.suburb}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[s.sectionHead, { marginTop: 4 }]}>Source</Text>
          <View style={[s.segRow, { marginBottom: 18 }]}>
            {SOURCES.map(src => (
              <TouchableOpacity key={src} onPress={() => set('source', src)} style={[s.seg, form.source === src && s.segActive]} activeOpacity={0.7}>
                <Text style={[s.segTxt, form.source === src && s.segTxtActive]}>{src}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.fieldWrap}>
            <Text style={s.label}>Notes</Text>
            <TextInput style={[s.input, s.inputMulti, focused === 'notes' && s.inputFocused]} placeholder="Details about the enquiry…" placeholderTextColor={TEXT3} multiline numberOfLines={3} value={form.notes} onChangeText={v => set('notes', v)} onFocus={() => setFocused('notes')} onBlur={() => setFocused(null)} textAlignVertical="top" />
          </View>

          <TouchableOpacity onPress={handleSave} style={s.btn} activeOpacity={0.85}>
            <Text style={s.btnTxt}>Log Enquiry</Text>
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
  label: { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 7 },
  input: { backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: TEXT },
  inputFocused: { borderColor: BLUE, backgroundColor: '#fff' },
  inputMulti: { height: 90, textAlignVertical: 'top' },
  segRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  seg: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: BORDER },
  segActive: { backgroundColor: BLUE, borderColor: BLUE },
  segTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  segTxtActive: { color: '#fff' },
  propChip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: BORDER, minWidth: 120 },
  propChipActive: { backgroundColor: BLUE, borderColor: BLUE },
  propChipTxt: { fontSize: 13, fontWeight: '700', color: TEXT },
  propChipTxtActive: { color: '#fff' },
  propChipSub: { fontSize: 11, color: TEXT3, marginTop: 2 },
  btn: { backgroundColor: BLUE, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
