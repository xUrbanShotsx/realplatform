import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const BLUE  = '#3B6BF7'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

type NotifItem = { id: string; label: string; sub: string; icon: string; color: string; on: boolean }

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotifItem[]>([
    { id: 'n1',  label: 'OFI Reminders',           sub: '1 hour before each inspection',       icon: 'home',       color: BLUE,  on: true  },
    { id: 'n2',  label: 'New Sign-ins',             sub: 'When attendees register at your OFI', icon: 'user-plus',  color: GREEN, on: true  },
    { id: 'n3',  label: 'Hot Lead Alerts',          sub: 'When a lead score hits 80+',          icon: 'zap',        color: AMBER, on: true  },
    { id: 'n4',  label: 'Follow-up Nudges',         sub: 'When a contact hasn\'t been called',  icon: 'bell',       color: BLUE,  on: true  },
    { id: 'n5',  label: 'Appraisal Reminders',      sub: '30 minutes before appraisals',        icon: 'clipboard',  color: '#8b5cf6', on: true },
    { id: 'n6',  label: 'Offer Notifications',      sub: 'New offers on your listings',         icon: 'dollar-sign',color: GREEN, on: true  },
    { id: 'n7',  label: 'Task Due Reminders',       sub: 'Day of task due date',                icon: 'check-circle',color: AMBER,on: false },
    { id: 'n8',  label: 'Vendor Report Due',        sub: 'Weekly vendor report reminders',      icon: 'file-text',  color: TEXT2, on: false },
    { id: 'n9',  label: 'AI Suggestions',           sub: 'Daily AI-powered follow-up tips',     icon: 'cpu',        color: BLUE,  on: true  },
    { id: 'n10', label: 'Marketing Expiry',         sub: 'Portal listings about to expire',     icon: 'alert-circle',color: AMBER,on: false },
  ])

  const toggle = (id: string) =>
    setItems(prev => prev.map(n => n.id === id ? { ...n, on: !n.on } : n))

  const activeCount = items.filter(n => n.on).length

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.summaryCard}>
          <Feather name="bell" size={20} color={BLUE} />
          <Text style={s.summaryTxt}>{activeCount} of {items.length} notifications enabled</Text>
        </View>

        <Text style={s.sectionLabel}>Notification Types</Text>
        <View style={s.card}>
          {items.map((item, i) => (
            <View key={item.id} style={[s.row, i > 0 && s.rowBorder]}>
              <View style={[s.iconWrap, { backgroundColor: item.color + '15' }]}>
                <Feather name={item.icon as any} size={17} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.itemLabel}>{item.label}</Text>
                <Text style={s.itemSub}>{item.sub}</Text>
              </View>
              <Switch
                value={item.on}
                onValueChange={() => toggle(item.id)}
                trackColor={{ false: '#e2e8f0', true: BLUE + '60' }}
                thumbColor={item.on ? BLUE : '#f4f4f5'}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },
  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, backgroundColor: '#EEF2FF', borderRadius: 12, padding: 14 },
  summaryTxt: { fontSize: 14, fontWeight: '600', color: BLUE },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, paddingHorizontal: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  iconWrap: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 14, fontWeight: '600', color: TEXT },
  itemSub: { fontSize: 12, color: TEXT3, marginTop: 2 },
})
