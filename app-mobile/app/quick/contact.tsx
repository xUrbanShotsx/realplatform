import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const BLUE = '#3B6BF7'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.10)'

const CONTACT_TYPES = ['Buyer', 'Investor', 'Tenant', 'Just looking']
const PRE_APPROVAL = ['Yes', 'No', 'In progress']

export default function AddContactScreen() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', suburb: '', budget: '', contactType: 'Buyer', preApproved: 'No', notes: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert('Required', 'Name and phone are required.')
      return
    }
    Alert.alert('Contact Saved', `${form.name} has been added.`, [{ text: 'OK', onPress: () => router.back() }])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Feather name="x" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Add Contact</Text>
        <TouchableOpacity onPress={handleSave} style={s.saveBtn}>
          <Text style={s.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <Field label="Full Name *" placeholder="e.g. Sarah Johnson" value={form.name} onChangeText={v => set('name', v)} focused={focused === 'name'} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
          <Field label="Phone *" placeholder="e.g. 0412 345 678" value={form.phone} onChangeText={v => set('phone', v)} keyboardType="phone-pad" focused={focused === 'phone'} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
          <Field label="Email" placeholder="e.g. sarah@email.com" value={form.email} onChangeText={v => set('email', v)} keyboardType="email-address" focused={focused === 'email'} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
          <Field label="Current Suburb" placeholder="e.g. Cronulla" value={form.suburb} onChangeText={v => set('suburb', v)} focused={focused === 'suburb'} onFocus={() => setFocused('suburb')} onBlur={() => setFocused(null)} />
          <Field label="Budget" placeholder="e.g. $2.8M – $3.2M" value={form.budget} onChangeText={v => set('budget', v)} focused={focused === 'budget'} onFocus={() => setFocused('budget')} onBlur={() => setFocused(null)} />

          <View style={s.fieldWrap}>
            <Text style={s.label}>Contact Type</Text>
            <View style={s.segRow}>
              {CONTACT_TYPES.map(t => (
                <TouchableOpacity key={t} onPress={() => set('contactType', t)} style={[s.seg, form.contactType === t && s.segActive]} activeOpacity={0.7}>
                  <Text style={[s.segTxt, form.contactType === t && s.segTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={s.fieldWrap}>
            <Text style={s.label}>Pre-approval</Text>
            <View style={s.segRow}>
              {PRE_APPROVAL.map(t => (
                <TouchableOpacity key={t} onPress={() => set('preApproved', t)} style={[s.seg, form.preApproved === t && s.segActive]} activeOpacity={0.7}>
                  <Text style={[s.segTxt, form.preApproved === t && s.segTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Field label="Notes" placeholder="Any additional notes…" value={form.notes} onChangeText={v => set('notes', v)} multiline focused={focused === 'notes'} onFocus={() => setFocused('notes')} onBlur={() => setFocused(null)} />

          <TouchableOpacity onPress={handleSave} style={s.btn} activeOpacity={0.85}>
            <Text style={s.btnTxt}>Save Contact</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function Field({ label, focused, multiline, ...props }: any) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.label}>{label}</Text>
      <TextInput style={[s.input, focused && s.inputFocused, multiline && s.inputMulti]} placeholderTextColor={TEXT3} multiline={multiline} numberOfLines={multiline ? 3 : 1} autoCapitalize={props.keyboardType === 'email-address' ? 'none' : 'words'} {...props} />
    </View>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  iconBtn: { width: 44, alignItems: 'flex-start' },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },
  saveBtn: { width: 44, alignItems: 'flex-end' },
  saveTxt: { fontSize: 15, fontWeight: '700', color: BLUE },
  content: { padding: 20, paddingBottom: 48, gap: 0 },
  fieldWrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 7 },
  input: { backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: TEXT },
  inputFocused: { borderColor: BLUE, backgroundColor: '#fff' },
  inputMulti: { height: 90, textAlignVertical: 'top' },
  segRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  seg: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: BORDER, alignItems: 'center' },
  segActive: { backgroundColor: BLUE, borderColor: BLUE },
  segTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  segTxtActive: { color: '#fff' },
  btn: { backgroundColor: BLUE, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
