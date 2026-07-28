import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { HOT_LEADS, VENDORS, type Lead } from '../store/sessions'

const BLUE  = '#3B6BF7'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const RED   = '#ef4444'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

type Filter = 'All' | 'HOT' | 'WARM' | 'COOL' | 'Vendors'

const HOTNESS_COLOR: Record<string, string> = { HOT: RED, WARM: AMBER, COOL: BLUE }

export default function ContactsScreen() {
  const [filter, setFilter] = useState<Filter>('All')

  const leads = filter === 'Vendors'
    ? []
    : HOT_LEADS.filter(l => filter === 'All' || l.hotness === filter)

  const vendors = filter === 'All' || filter === 'Vendors' ? VENDORS : []

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>All Contacts</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterBar} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 10 }}>
        {(['All', 'HOT', 'WARM', 'COOL', 'Vendors'] as Filter[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.pill, filter === f && s.pillActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            {f !== 'All' && f !== 'Vendors' && (
              <View style={[s.dot, { backgroundColor: HOTNESS_COLOR[f] }]} />
            )}
            <Text style={[s.pillTxt, filter === f && s.pillTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        {leads.length > 0 && (
          <>
            <Text style={s.sectionLabel}>Buyers & Tenants</Text>
            <View style={s.card}>
              {leads.map((lead, i) => (
                <View key={lead.id} style={[s.row, i > 0 && s.rowBorder]}>
                  <View style={[s.avatar, { backgroundColor: HOTNESS_COLOR[lead.hotness] + '20' }]}>
                    <Text style={[s.avatarTxt, { color: HOTNESS_COLOR[lead.hotness] }]}>{lead.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={s.nameRow}>
                      <Text style={s.name}>{lead.name}</Text>
                      <View style={[s.badge, { backgroundColor: HOTNESS_COLOR[lead.hotness] + '18' }]}>
                        <Text style={[s.badgeTxt, { color: HOTNESS_COLOR[lead.hotness] }]}>{lead.hotness}</Text>
                      </View>
                    </View>
                    <Text style={s.sub}>{lead.propertyAddress} · {lead.budget}</Text>
                    <Text style={s.sub2}>{lead.inspections} inspection{lead.inspections !== 1 ? 's' : ''} · {lead.lastContact}</Text>
                  </View>
                  <View style={s.actions}>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: GREEN + '15' }]}
                      onPress={() => Linking.openURL(`tel:${lead.phone.replace(/\s/g, '')}`)}
                    >
                      <Feather name="phone" size={15} color={GREEN} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: BLUE + '15' }]}
                      onPress={() => Linking.openURL(`mailto:${lead.email}`)}
                    >
                      <Feather name="mail" size={15} color={BLUE} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {vendors.length > 0 && (
          <>
            <Text style={s.sectionLabel}>Vendors & Landlords</Text>
            <View style={s.card}>
              {vendors.map((v, i) => (
                <View key={v.id} style={[s.row, i > 0 && s.rowBorder]}>
                  <View style={[s.avatar, { backgroundColor: '#e2e8f0' }]}>
                    <Text style={[s.avatarTxt, { color: TEXT2 }]}>
                      {v.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.name}>{v.name}</Text>
                    <Text style={s.sub}>{v.role}</Text>
                    <Text style={s.sub2}>{v.phone}</Text>
                  </View>
                  <View style={s.actions}>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: GREEN + '15' }]}
                      onPress={() => Linking.openURL(`tel:${v.phone.replace(/\s/g, '')}`)}
                    >
                      <Feather name="phone" size={15} color={GREEN} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: BLUE + '15' }]}
                      onPress={() => Linking.openURL(`mailto:${v.email}`)}
                    >
                      <Feather name="mail" size={15} color={BLUE} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {leads.length === 0 && vendors.length === 0 && (
          <View style={s.empty}>
            <Feather name="users" size={28} color={TEXT3} />
            <Text style={s.emptyTxt}>No contacts</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },
  filterBar: { backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f1f5f9' },
  pillActive: { backgroundColor: TEXT },
  pillTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  pillTxtActive: { color: '#fff' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 20, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 14, fontWeight: '700' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 14, fontWeight: '700', color: TEXT },
  badge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  sub: { fontSize: 12, color: TEXT2, marginTop: 2 },
  sub2: { fontSize: 11, color: TEXT3, marginTop: 1 },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTxt: { fontSize: 15, fontWeight: '600', color: TEXT2 },
})
