import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

const BLUE  = '#3B6BF7'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

type Field = { key: string; label: string; value: string; keyboard?: 'default' | 'email-address' | 'phone-pad'; placeholder?: string }

export default function ProfileScreen() {
  const [form, setForm] = useState({
    firstName: 'Jye',
    lastName: 'San Jurjo',
    email: 'jye@spinellire.com',
    phone: '0412 345 678',
    agency: 'Spinelli Real Estate',
    license: 'RE12345NSW',
    suburb: 'Cronulla',
    bio: 'Award-winning agent specialising in the Sutherland Shire and Illawarra regions. Known for exceptional results and transparent communication.',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const fields: Field[] = [
    { key: 'firstName', label: 'First Name',      value: form.firstName,  placeholder: 'First name' },
    { key: 'lastName',  label: 'Last Name',        value: form.lastName,   placeholder: 'Last name' },
    { key: 'email',     label: 'Email',            value: form.email,      keyboard: 'email-address', placeholder: 'Email address' },
    { key: 'phone',     label: 'Mobile',           value: form.phone,      keyboard: 'phone-pad', placeholder: '04XX XXX XXX' },
    { key: 'agency',    label: 'Agency',           value: form.agency,     placeholder: 'Agency name' },
    { key: 'license',   label: 'Licence Number',   value: form.license,    placeholder: 'e.g. RE12345NSW' },
    { key: 'suburb',    label: 'Primary Suburb',   value: form.suburb,     placeholder: 'e.g. Cronulla' },
  ]

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your profile has been saved.', [{ text: 'OK' }])
  }

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut()
          router.replace('/login')
        },
      },
    ])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>My Profile</Text>
        <TouchableOpacity onPress={handleSave} style={s.saveBtn}>
          <Text style={s.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>JS</Text>
          </View>
          <TouchableOpacity style={s.changePhotoBtn} activeOpacity={0.7}>
            <Text style={s.changePhotoTxt}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        <Text style={s.sectionLabel}>Personal Details</Text>
        <View style={s.card}>
          {fields.map((f, i) => (
            <View key={f.key} style={[s.fieldRow, i > 0 && s.rowBorder]}>
              <Text style={s.fieldLabel}>{f.label}</Text>
              <TextInput
                style={s.fieldInput}
                value={f.value}
                onChangeText={v => set(f.key, v)}
                keyboardType={f.keyboard ?? 'default'}
                placeholder={f.placeholder}
                placeholderTextColor={TEXT3}
                autoCapitalize={f.keyboard === 'email-address' ? 'none' : 'words'}
              />
            </View>
          ))}
        </View>

        <Text style={s.sectionLabel}>Bio</Text>
        <View style={[s.card, { paddingHorizontal: 14, paddingVertical: 12 }]}>
          <TextInput
            style={s.bioInput}
            value={form.bio}
            onChangeText={v => set('bio', v)}
            multiline
            numberOfLines={4}
            placeholder="Write a short bio..."
            placeholderTextColor={TEXT3}
          />
        </View>

        <TouchableOpacity style={s.saveFullBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={s.saveFullTxt}>Save Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut} activeOpacity={0.75}>
          <Feather name="log-out" size={16} color="#ef4444" />
          <Text style={s.signOutTxt}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },
  saveBtn: { width: 44, alignItems: 'flex-end' },
  saveTxt: { fontSize: 15, fontWeight: '700', color: BLUE },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarTxt: { fontSize: 28, fontWeight: '800', color: '#fff' },
  changePhotoBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#EEF2FF' },
  changePhotoTxt: { fontSize: 13, fontWeight: '600', color: BLUE },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 4, marginBottom: 8, paddingHorizontal: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginHorizontal: 16 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  fieldLabel: { width: 120, fontSize: 13, fontWeight: '600', color: TEXT2 },
  fieldInput: { flex: 1, fontSize: 14, color: TEXT, textAlign: 'right' },
  bioInput: { fontSize: 14, color: TEXT, minHeight: 80, textAlignVertical: 'top' },
  saveFullBtn: { marginHorizontal: 16, marginTop: 24, backgroundColor: BLUE, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  saveFullTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, paddingVertical: 16, borderRadius: 14, backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
  signOutTxt: { fontSize: 15, fontWeight: '600', color: '#ef4444' },
})
