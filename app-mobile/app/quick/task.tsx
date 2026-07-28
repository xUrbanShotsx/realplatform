import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const BLUE = '#3B6BF7'; const RED = '#ef4444'; const AMBER = '#f59e0b'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.10)'

const PRIORITIES = ['High', 'Medium', 'Low']
const DUE_OPTIONS = ['Today', 'Tomorrow', 'This week', 'Next week', 'Custom']

export default function AddTaskScreen() {
  const [form, setForm] = useState({ title: '', priority: 'Medium', due: 'Today', notes: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const priorityColor = (p: string) => p === 'High' ? RED : p === 'Medium' ? AMBER : TEXT3

  const handleSave = () => {
    if (!form.title.trim()) { Alert.alert('Required', 'Task title is required.'); return }
    Alert.alert('Task Created', `"${form.title}" has been added.`, [{ text: 'OK', onPress: () => router.back() }])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}><Feather name="x" size={22} color={TEXT} /></TouchableOpacity>
        <Text style={s.title}>Create Task</Text>
        <TouchableOpacity onPress={handleSave} style={s.saveBtn}><Text style={s.saveTxt}>Save</Text></TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <View style={s.fieldWrap}>
            <Text style={s.label}>Task Title *</Text>
            <TextInput style={[s.input, focused === 'title' && s.inputFocused]} placeholder="e.g. Follow up pre-approved buyer" placeholderTextColor={TEXT3} value={form.title} onChangeText={v => set('title', v)} onFocus={() => setFocused('title')} onBlur={() => setFocused(null)} />
          </View>

          <View style={s.fieldWrap}>
            <Text style={s.label}>Priority</Text>
            <View style={s.segRow}>
              {PRIORITIES.map(p => (
                <TouchableOpacity key={p} onPress={() => set('priority', p)} style={[s.seg, form.priority === p && { backgroundColor: priorityColor(p), borderColor: priorityColor(p) }]} activeOpacity={0.7}>
                  <Text style={[s.segTxt, form.priority === p && { color: '#fff' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={s.fieldWrap}>
            <Text style={s.label}>Due Date</Text>
            <View style={s.segRow}>
              {DUE_OPTIONS.map(d => (
                <TouchableOpacity key={d} onPress={() => set('due', d)} style={[s.seg, form.due === d && s.segActive]} activeOpacity={0.7}>
                  <Text style={[s.segTxt, form.due === d && s.segTxtActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={s.fieldWrap}>
            <Text style={s.label}>Notes</Text>
            <TextInput style={[s.input, s.inputMulti, focused === 'notes' && s.inputFocused]} placeholder="Additional details…" placeholderTextColor={TEXT3} multiline numberOfLines={3} value={form.notes} onChangeText={v => set('notes', v)} onFocus={() => setFocused('notes')} onBlur={() => setFocused(null)} textAlignVertical="top" />
          </View>

          <TouchableOpacity onPress={handleSave} style={s.btn} activeOpacity={0.85}>
            <Text style={s.btnTxt}>Create Task</Text>
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
  fieldWrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 7 },
  input: { backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: TEXT },
  inputFocused: { borderColor: BLUE, backgroundColor: '#fff' },
  inputMulti: { height: 90, textAlignVertical: 'top' },
  segRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  seg: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: BORDER },
  segActive: { backgroundColor: BLUE, borderColor: BLUE },
  segTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  segTxtActive: { color: '#fff' },
  btn: { backgroundColor: BLUE, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
