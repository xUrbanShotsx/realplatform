import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const BLUE  = '#3B6BF7'
const RED   = '#ef4444'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

export default function SettingsScreen() {
  const [darkMode, setDarkMode]       = useState(false)
  const [haptics, setHaptics]         = useState(true)
  const [autoSave, setAutoSave]       = useState(true)
  const [biometric, setBiometric]     = useState(false)
  const [locationServices, setLoc]    = useState(true)

  const sections = [
    {
      title: 'Appearance',
      items: [
        { label: 'Dark Mode',       sub: 'Switch to dark theme', icon: 'moon',    color: '#6366f1', type: 'toggle', val: darkMode,  set: setDarkMode  },
      ],
    },
    {
      title: 'App Behaviour',
      items: [
        { label: 'Haptic Feedback',  sub: 'Vibration on interactions',    icon: 'zap',         color: '#f59e0b', type: 'toggle', val: haptics,    set: setHaptics    },
        { label: 'Auto-save Forms',  sub: 'Save forms automatically',      icon: 'save',        color: BLUE,      type: 'toggle', val: autoSave,   set: setAutoSave   },
        { label: 'Location Services',sub: 'For nearby property features',  icon: 'map-pin',     color: '#10b981', type: 'toggle', val: locationServices, set: setLoc },
      ],
    },
    {
      title: 'Security',
      items: [
        { label: 'Face ID / Touch ID', sub: 'Use biometrics to unlock', icon: 'shield',      color: '#10b981', type: 'toggle', val: biometric,  set: setBiometric  },
        { label: 'Change PIN',         sub: '4-digit app PIN',           icon: 'lock',        color: TEXT2,     type: 'arrow',  val: false,      set: () => Alert.alert('Change PIN', 'PIN settings coming soon.') },
      ],
    },
    {
      title: 'Data',
      items: [
        { label: 'Sync Data',          sub: 'Sync with Real Platform CRM', icon: 'refresh-cw',  color: BLUE,  type: 'arrow', val: false, set: () => Alert.alert('Sync', 'Data synced successfully.') },
        { label: 'Export Contacts',    sub: 'Export to CSV',               icon: 'download',    color: TEXT2, type: 'arrow', val: false, set: () => Alert.alert('Export', 'Export feature coming soon.') },
        { label: 'Clear Cache',        sub: 'Free up storage space',       icon: 'trash-2',     color: RED,   type: 'arrow', val: false, set: () => Alert.alert('Clear Cache', 'Cache cleared.') },
      ],
    },
    {
      title: 'About',
      items: [
        { label: 'Version',           sub: 'Open Home v1.0.0',             icon: 'info',        color: TEXT3, type: 'info',  val: false, set: () => {} },
        { label: 'Terms of Service',  sub: 'Read our terms',               icon: 'file-text',   color: TEXT3, type: 'arrow', val: false, set: () => Alert.alert('Terms', 'Terms of Service.') },
        { label: 'Privacy Policy',    sub: 'How we use your data',         icon: 'eye-off',     color: TEXT3, type: 'arrow', val: false, set: () => Alert.alert('Privacy', 'Privacy Policy.') },
      ],
    },
  ]

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {sections.map(sec => (
          <View key={sec.title} style={s.section}>
            <Text style={s.sectionLabel}>{sec.title}</Text>
            <View style={s.card}>
              {sec.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[s.row, i > 0 && s.rowBorder]}
                  onPress={item.type !== 'toggle' ? item.set as any : undefined}
                  activeOpacity={item.type === 'toggle' ? 1 : 0.65}
                >
                  <View style={[s.iconWrap, { backgroundColor: (item.color as string) + '15' }]}>
                    <Feather name={item.icon as any} size={17} color={item.color as string} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemLabel}>{item.label}</Text>
                    <Text style={s.itemSub}>{item.sub}</Text>
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.val as boolean}
                      onValueChange={item.set as any}
                      trackColor={{ false: '#e2e8f0', true: BLUE + '60' }}
                      thumbColor={item.val ? BLUE : '#f4f4f5'}
                    />
                  ) : item.type === 'arrow' ? (
                    <Feather name="chevron-right" size={18} color={TEXT3} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={s.logoutBtn}
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => {} },
          ])}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={16} color={RED} />
          <Text style={s.logoutTxt}>Sign Out</Text>
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
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  iconWrap: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 14, fontWeight: '600', color: TEXT },
  itemSub: { fontSize: 12, color: TEXT3, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 16, marginTop: 24, borderRadius: 14, paddingVertical: 15, backgroundColor: '#fff' },
  logoutTxt: { fontSize: 15, fontWeight: '700', color: RED },
})
