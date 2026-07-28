import { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, SectionList,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather, Ionicons } from '@expo/vector-icons'
import { getSessions, PROPERTIES, HOT_LEADS, type Property, type Session } from '../../store/sessions'

const BLUE = '#3B6BF7'
const PURPLE = '#7C3AED'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'
const HOT_RED = '#ef4444'
const WARM_AMB = '#f59e0b'

const OFI_SCHEDULE: Record<string, { day: string; time: string }> = {
  '1': { day: 'Saturday', time: '10:00 AM' },
  '2': { day: 'Saturday', time: '10:30 AM' },
  '3': { day: 'Saturday', time: '11:00 AM' },
  '4': { day: 'Saturday', time: '11:00 AM' },
  '5': { day: 'Saturday', time: '11:30 AM' },
  '6': { day: 'Sunday',   time: '10:00 AM' },
}

const THUMB_COLORS: Record<string, string> = {
  '1': '#0ea5e9', '2': '#f59e0b', '3': '#10b981',
  '4': '#8b5cf6', '5': '#06b6d4', '6': '#ec4899',
}

type Tab = 'TODAY' | 'UPCOMING' | 'ALL'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomeScreen() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [filter, setFilter] = useState<Tab>('TODAY')

  useEffect(() => { getSessions().then(setSessions) }, [])

  const totalSignIns = sessions.reduce((acc, s) => acc + s.attendees.length, 0)
  const todayOFIs = PROPERTIES.length
  const hotCount = HOT_LEADS.filter(l => l.hotness === 'HOT').length

  const grouped = PROPERTIES.reduce<Record<string, Property[]>>((acc, p) => {
    const sched = OFI_SCHEDULE[p.id]
    if (!sched) return acc
    if (!acc[sched.day]) acc[sched.day] = []
    acc[sched.day].push(p)
    return acc
  }, {})

  const sections = Object.entries(grouped).map(([day, data]) => ({
    title: day,
    data,
  }))

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{greeting()}, Jye</Text>
          <Text style={s.date}>
            {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.aiPill}
            onPress={() => router.push('/(tabs)/ai' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={13} color="#fff" />
            <Text style={s.aiPillTxt}>AI</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/attendees')} style={s.iconBtn}>
            <Feather name="users" size={20} color={TEXT} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={s.statsRow}>
          <TouchableOpacity style={s.statCard} activeOpacity={0.7}>
            <Text style={s.statNum}>{todayOFIs}</Text>
            <Text style={s.statLbl}>OFIs Scheduled</Text>
          </TouchableOpacity>
          <View style={s.statDiv} />
          <TouchableOpacity style={s.statCard} activeOpacity={0.7}>
            <Text style={[s.statNum, { color: HOT_RED }]}>{hotCount}</Text>
            <Text style={s.statLbl}>Hot Leads</Text>
          </TouchableOpacity>
          <View style={s.statDiv} />
          <TouchableOpacity style={s.statCard} activeOpacity={0.7}>
            <Text style={[s.statNum, { color: BLUE }]}>{totalSignIns}</Text>
            <Text style={s.statLbl}>Sign-ins</Text>
          </TouchableOpacity>
        </View>

        {/* AI follow-up nudge */}
        {HOT_LEADS[0] && HOT_LEADS[0].daysSinceContact >= 2 && (
          <TouchableOpacity
            style={s.nudge}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/ai' as any)}
          >
            <View style={s.nudgeIcon}>
              <Ionicons name="sparkles" size={14} color={PURPLE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.nudgeTitle}>AI Follow-up Reminder</Text>
              <Text style={s.nudgeSub} numberOfLines={1}>
                {HOT_LEADS[0].name} hasn't been contacted in {HOT_LEADS[0].daysSinceContact} days — tap to draft a message
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={PURPLE} />
          </TouchableOpacity>
        )}

        {/* Filter tabs */}
        <View style={s.filterWrap}>
          {(['TODAY', 'UPCOMING', 'ALL'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[s.filterBtn, filter === tab && s.filterBtnActive]}
              activeOpacity={0.7}
            >
              <Text style={[s.filterTxt, filter === tab && s.filterTxtActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* OFI list */}
        {sections.map(section => (
          <View key={section.title}>
            <View style={s.sectionHead}>
              <Text style={s.sectionTitle}>{section.title}</Text>
              <Text style={s.sectionCount}>{section.data.length} inspections</Text>
            </View>
            {section.data.map((prop, idx) => {
              const sched = OFI_SCHEDULE[prop.id]!
              const color = THUMB_COLORS[prop.id] ?? '#64748b'
              const attended = sessions
                .filter(se => se.property.id === prop.id)
                .reduce((a, se) => a + se.attendees.length, 0)
              return (
                <TouchableOpacity
                  key={prop.id}
                  onPress={() => router.push({ pathname: '/property/[id]', params: { id: prop.id } })}
                  activeOpacity={0.6}
                  style={[s.card, idx < section.data.length - 1 && s.cardBorder]}
                >
                  <View style={[s.thumb, { backgroundColor: color }]}>
                    <Text style={s.thumbBed}>{prop.bedrooms}</Text>
                    <Text style={s.thumbLbl}>bed</Text>
                  </View>
                  <View style={s.cardBody}>
                    <Text style={s.ofiTag}>OFI</Text>
                    <Text style={s.addr}>{prop.address}</Text>
                    <Text style={s.suburb}>{prop.suburb} · {prop.postcode}</Text>
                    <View style={s.cardFooter}>
                      <Feather name="clock" size={11} color={TEXT3} />
                      <Text style={s.time}>{sched.day} {sched.time}</Text>
                      {attended > 0 && (
                        <View style={s.countBadge}>
                          <Ionicons name="people" size={11} color={BLUE} />
                          <Text style={s.countTxt}>{attended}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={s.cardRight}>
                    <Text style={s.price}>{prop.price}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        ))}

        {/* Hot leads from OFIs */}
        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Hot Leads from OFIs</Text>
          <TouchableOpacity>
            <Text style={s.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {HOT_LEADS.filter(l => l.hotness !== 'COOL').slice(0, 3).map(lead => {
          const hotnessColor = lead.hotness === 'HOT' ? HOT_RED : WARM_AMB
          return (
            <TouchableOpacity
              key={lead.id}
              style={s.leadRow}
              activeOpacity={0.7}
              onPress={() => Alert.alert(lead.name, `${lead.propertyAddress}\nBudget: ${lead.budget}\n\n${lead.notes}`)}
            >
              <View style={[s.leadAvatar, { backgroundColor: hotnessColor + '20', borderColor: hotnessColor + '40', borderWidth: 1.5 }]}>
                <Text style={[s.leadInitials, { color: hotnessColor }]}>{lead.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.leadNameRow}>
                  <Text style={s.leadName}>{lead.name}</Text>
                  <View style={[s.hotBadge, { backgroundColor: hotnessColor }]}>
                    <Text style={s.hotBadgeTxt}>{lead.hotness}</Text>
                  </View>
                </View>
                <Text style={s.leadProp} numberOfLines={1}>{lead.propertyAddress} · {lead.lastContact}</Text>
              </View>
              <View style={s.leadActions}>
                <TouchableOpacity
                  style={s.actionBtn}
                  onPress={() => Alert.alert('Call', `Calling ${lead.name} on ${lead.phone}`)}
                >
                  <Feather name="phone" size={14} color={BLUE} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.actionBtn}
                  onPress={() => router.push('/(tabs)/ai' as any)}
                >
                  <Ionicons name="sparkles" size={14} color={PURPLE} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )
        })}

      </ScrollView>
    </SafeAreaView>
  )
}

// Avoid importing Alert at top level – use inline
const { Alert } = require('react-native')

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 6, paddingBottom: 14,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: TEXT, letterSpacing: -0.4 },
  date: { fontSize: 13, color: TEXT3, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 2 },
  aiPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: PURPLE, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  aiPillTxt: { fontSize: 12, fontWeight: '700', color: '#fff' },
  iconBtn: { padding: 4 },

  statsRow: {
    flexDirection: 'row', backgroundColor: '#f8fafc',
    marginHorizontal: 16, borderRadius: 14, marginBottom: 14, overflow: 'hidden',
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statDiv: { width: StyleSheet.hairlineWidth, backgroundColor: '#e2e8f0', marginVertical: 12 },
  statNum: { fontSize: 22, fontWeight: '800', color: TEXT, letterSpacing: -0.5 },
  statLbl: { fontSize: 11, color: TEXT3, marginTop: 2, textAlign: 'center' },

  nudge: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 14,
    backgroundColor: PURPLE + '0D', borderWidth: 1.5, borderColor: PURPLE + '25',
    borderRadius: 14, padding: 12,
  },
  nudgeIcon: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: PURPLE + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  nudgeTitle: { fontSize: 13, fontWeight: '700', color: TEXT, marginBottom: 2 },
  nudgeSub: { fontSize: 12, color: TEXT2 },

  filterWrap: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  filterBtnActive: { backgroundColor: TEXT },
  filterTxt: { fontSize: 12, fontWeight: '600', color: TEXT2 },
  filterTxtActive: { color: '#fff' },

  sectionHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: TEXT },
  sectionCount: { fontSize: 12, color: TEXT3 },
  seeAll: { fontSize: 12, fontWeight: '600', color: BLUE },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 13, backgroundColor: '#fff',
  },
  cardBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  cardBody: { flex: 1 },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  thumb: {
    width: 56, height: 56, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  thumbBed: { fontSize: 18, fontWeight: '800', color: '#fff' },
  thumbLbl: { fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginTop: -2 },
  ofiTag: { fontSize: 10, fontWeight: '700', color: BLUE, letterSpacing: 0.5, marginBottom: 2 },
  addr: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 1 },
  suburb: { fontSize: 12, color: TEXT2, marginBottom: 5 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  time: { fontSize: 12, color: TEXT3, marginLeft: 2 },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#EEF2FF', borderRadius: 7, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6,
  },
  countTxt: { fontSize: 11, fontWeight: '600', color: BLUE },
  price: { fontSize: 12, fontWeight: '700', color: TEXT2 },

  leadRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9',
  },
  leadAvatar: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  leadInitials: { fontSize: 14, fontWeight: '800' },
  leadNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  leadName: { fontSize: 14, fontWeight: '700', color: TEXT },
  hotBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  hotBadgeTxt: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  leadProp: { fontSize: 12, color: TEXT2 },
  leadActions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center',
  },
})
