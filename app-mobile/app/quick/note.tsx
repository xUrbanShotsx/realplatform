import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { PROPERTIES } from '../../store/sessions'

const BLUE = '#3B6BF7'; const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const NOTE_TYPES = ['General', 'Call', 'Vendor Update', 'Buyer Feedback', 'Price Discussion']

export default function AddNoteScreen() {
  const [note, setNote] = useState('')
  const [noteType, setNoteType] = useState('General')
  const [focused, setFocused] = useState(false)

  const handleSave = () => {
    if (!note.trim()) { Alert.alert('Required', 'Please enter a note.'); return }
    Alert.alert('Note Saved', 'Your note has been added.', [{ text: 'OK', onPress: () => router.back() }])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}><Feather name="x" size={22} color={TEXT} /></TouchableOpacity>
        <Text style={s.title}>Add Note</Text>
        <TouchableOpacity onPress={handleSave} style={s.saveBtn}><Text style={s.saveTxt}>Save</Text></TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.content}>
          <Text style={s.label}>Note Type</Text>
          <View style={s.chipRow}>
            {NOTE_TYPES.map(t => (
              <TouchableOpacity key={t} onPress={() => setNoteType(t)} style={[s.chip, noteType === t && s.chipActive]} activeOpacity={0.7}>
                <Text style={[s.chipTxt, noteType === t && s.chipTxtActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[s.label, { marginTop: 20 }]}>Note *</Text>
          <TextInput
            style={[s.noteInput, focused && s.noteInputFocused]}
            placeholder="Write your note here…"
            placeholderTextColor={TEXT3}
            multiline
            value={note}
            onChangeText={setNote}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            textAlignVertical="top"
            autoFocus
          />

          <TouchableOpacity onPress={handleSave} style={s.btn} activeOpacity={0.85}>
            <Feather name="check" size={16} color="#fff" />
            <Text style={s.btnTxt}>Save Note</Text>
          </TouchableOpacity>
        </View>
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
  content: { flex: 1, padding: 20 },
  label: { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: 'transparent' },
  chipActive: { backgroundColor: '#EEF2FF', borderColor: BLUE },
  chipTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  chipTxtActive: { color: BLUE },
  noteInput: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)', padding: 14, fontSize: 15, color: TEXT, marginBottom: 16 },
  noteInputFocused: { borderColor: BLUE, backgroundColor: '#fff' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: BLUE, borderRadius: 14, paddingVertical: 16 },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
