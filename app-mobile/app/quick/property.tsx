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

const LISTING_TYPES = ['For Sale', 'For Lease']
const PROPERTY_TYPES = ['House', 'Unit', 'Townhouse', 'Land', 'Rural']

export default function AddPropertyScreen() {
  const [form, setForm] = useState({ address: '', suburb: '', postcode: '', price: '', bedrooms: '', bathrooms: '', listingType: 'For Sale', propertyType: 'House', agent: 'Jye San Jurjo' })
  const [focused, setFocused] = useState<string | null>(null)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.address.trim() || !form.suburb.trim()) {
      Alert.alert('Required', 'Address and suburb are required.')
      return
    }
    Alert.alert('Property Added', `${form.address}, ${form.suburb} has been listed.`, [{ text: 'OK', onPress: () => router.back() }])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Feather name="x" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Add Property</Text>
        <TouchableOpacity onPress={handleSave} style={s.saveBtn}>
          <Text style={s.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <View style={s.fieldWrap}>
            <Text style={s.label}>Listing Type</Text>
            <View style={s.segRow}>
              {LISTING_TYPES.map(t => (
                <TouchableOpacity key={t} onPress={() => set('listingType', t)} style={[s.seg, form.listingType === t && s.segActive]} activeOpacity={0.7}>
                  <Text style={[s.segTxt, form.listingType === t && s.segTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Field label="Street Address *" placeholder="e.g. 42 Foreshore Cres" value={form.address} onChangeText={v => set('address', v)} focused={focused === 'address'} onFocus={() => setFocused('address')} onBlur={() => setFocused(null)} />
          <Field label="Suburb *" placeholder="e.g. Cronulla" value={form.suburb} onChangeText={v => set('suburb', v)} focused={focused === 'suburb'} onFocus={() => setFocused('suburb')} onBlur={() => setFocused(null)} />
          <Field label="Postcode" placeholder="e.g. 2230" value={form.postcode} onChangeText={v => set('postcode', v)} keyboardType="number-pad" focused={focused === 'postcode'} onFocus={() => setFocused('postcode')} onBlur={() => setFocused(null)} />
          <Field label={form.listingType === 'For Lease' ? 'Weekly Rent' : 'Price / Guide'} placeholder={form.listingType === 'For Lease' ? 'e.g. $650/wk' : 'e.g. $2.8M – $3.2M'} value={form.price} onChangeText={v => set('price', v)} focused={focused === 'price'} onFocus={() => setFocused('price')} onBlur={() => setFocused(null)} />

          <View style={s.fieldWrap}>
            <Text style={s.label}>Property Type</Text>
            <View style={s.segRow}>
              {PROPERTY_TYPES.map(t => (
                <TouchableOpacity key={t} onPress={() => set('propertyType', t)} style={[s.seg, form.propertyType === t && s.segActive]} activeOpacity={0.7}>
                  <Text style={[s.segTxt, form.propertyType === t && s.segTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Field label="Bedrooms" placeholder="e.g. 4" value={form.bedrooms} onChangeText={v => set('bedrooms', v)} keyboardType="number-pad" focused={focused === 'bed'} onFocus={() => setFocused('bed')} onBlur={() => setFocused(null)} />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Bathrooms" placeholder="e.g. 2" value={form.bathrooms} onChangeText={v => set('bathrooms', v)} keyboardType="number-pad" focused={focused === 'bath'} onFocus={() => setFocused('bath')} onBlur={() => setFocused(null)} />
            </View>
          </View>

          <Field label="Agent" placeholder="Agent name" value={form.agent} onChangeText={v => set('agent', v)} focused={focused === 'agent'} onFocus={() => setFocused('agent')} onBlur={() => setFocused(null)} />

          <TouchableOpacity onPress={handleSave} style={s.btn} activeOpacity={0.85}>
            <Text style={s.btnTxt}>Add Listing</Text>
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
      <TextInput style={[s.input, focused && s.inputFocused, multiline && s.inputMulti]} placeholderTextColor={TEXT3} multiline={multiline} numberOfLines={multiline ? 3 : 1} autoCapitalize={props.keyboardType === 'email-address' || props.keyboardType === 'number-pad' ? 'none' : 'words'} {...props} />
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
  content: { padding: 20, paddingBottom: 48 },
  row: { flexDirection: 'row', gap: 12 },
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
