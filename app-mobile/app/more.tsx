import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const BLUE = '#3B6BF7'; const GREEN = '#10b981'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'

const MENU_SECTIONS = [
  {
    title: 'My Work',
    items: [
      { icon: 'calendar',   label: 'My Schedule',  color: BLUE,      onPress: () => router.push('/schedule')    },
      { icon: 'check-square', label: 'All Tasks',  color: '#8b5cf6', onPress: () => router.push('/tasks')       },
      { icon: 'users',      label: 'All Contacts', color: GREEN,     onPress: () => router.push('/contacts')    },
      { icon: 'home',       label: 'All Listings', color: '#f59e0b', onPress: () => router.back()               },
      { icon: 'clipboard',  label: 'Appraisals',   color: GREEN,     onPress: () => { router.back(); router.push('/appraisals') } },
    ],
  },
  {
    title: 'Reports',
    items: [
      { icon: 'bar-chart-2', label: 'Performance Report', color: BLUE,  onPress: () => router.push('/performance') },
      { icon: 'trending-up', label: 'Pipeline',           color: GREEN, onPress: () => router.push('/pipeline')    },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: 'user',        label: 'My Profile',      color: TEXT2,     onPress: () => router.push('/profile')       },
      { icon: 'bell',        label: 'Notifications',   color: '#f59e0b', onPress: () => router.push('/notifications') },
      { icon: 'settings',    label: 'Settings',        color: TEXT3,     onPress: () => router.push('/settings')      },
      { icon: 'help-circle', label: 'Help & Support',  color: TEXT3,     onPress: () => router.push('/help')          },
    ],
  },
]

export default function MoreScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
          <Feather name="x" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>More</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Agent card */}
        <View style={s.agentCard}>
          <View style={s.agentAvatar}>
            <Text style={s.agentAvatarTxt}>JS</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.agentName}>Jye San Jurjo</Text>
            <Text style={s.agentAgency}>Spinelli Real Estate</Text>
            <Text style={s.agentPhone}>0412 345 678</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')} style={s.editProfileBtn}>
            <Feather name="edit-2" size={16} color={BLUE} />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={s.statsRow}>
          {[{ label: 'Active Listings', val: '6' }, { label: 'OFIs This Month', val: '12' }, { label: 'Contacts', val: '48' }].map((stat, i) => (
            <View key={stat.label} style={[s.statItem, i < 2 && s.statBorder]}>
              <Text style={s.statVal}>{stat.val}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu sections */}
        {MENU_SECTIONS.map(section => (
          <View key={section.title} style={s.section}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.sectionCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity key={item.label} onPress={item.onPress} style={[s.menuRow, i < section.items.length - 1 && s.menuRowBorder]} activeOpacity={0.7}>
                  <View style={[s.menuIcon, { backgroundColor: item.color + '18' }]}>
                    <Feather name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={s.menuLabel}>{item.label}</Text>
                  <Feather name="chevron-right" size={18} color={TEXT3} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={s.version}>Open Home · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  closeBtn: { width: 44 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },

  agentCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8 },
  agentAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  agentAvatarTxt: { fontSize: 20, fontWeight: '800', color: '#fff' },
  agentName: { fontSize: 16, fontWeight: '800', color: TEXT, letterSpacing: -0.3 },
  agentAgency: { fontSize: 13, color: TEXT2, marginTop: 2 },
  agentPhone: { fontSize: 12, color: TEXT3, marginTop: 2 },
  editProfileBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },

  statsRow: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 8 },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#e2e8f0' },
  statVal: { fontSize: 22, fontWeight: '800', color: TEXT, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: TEXT3, marginTop: 2, textAlign: 'center' },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 14 },
  menuRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  menuIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: TEXT },

  version: { textAlign: 'center', fontSize: 12, color: TEXT3, marginTop: 32 },
})
