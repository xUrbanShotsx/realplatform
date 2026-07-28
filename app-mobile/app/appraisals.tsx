import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SectionList, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { getAppraisals, type Appraisal, type AppraisalType } from '../store/appraisals'

const BLUE = '#3B6BF7'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'
const GREEN = '#10b981'
const AMBER = '#f59e0b'

const STATUS_COLORS: Record<string, string> = {
  'Scheduled':   BLUE,
  'In Progress': AMBER,
  'Completed':   GREEN,
}

const TYPE_COLORS: Record<AppraisalType, string> = {
  'Sale':   '#3B6BF7',
  'Rental': '#10b981',
  'Both':   '#8b5cf6',
}

type FilterType = 'All' | 'Sale' | 'Rental' | 'Both'

export default function AppraisalsScreen() {
  const [appraisals, setAppraisals] = useState<Appraisal[]>([])
  const [filter, setFilter] = useState<FilterType>('All')

  useEffect(() => {
    getAppraisals().then(setAppraisals)
  }, [])

  const filtered = appraisals.filter(a => filter === 'All' || a.type === filter)

  const sections = [
    {
      title: 'In Progress',
      data: filtered.filter(a => a.status === 'In Progress'),
    },
    {
      title: 'Scheduled',
      data: filtered.filter(a => a.status === 'Scheduled'),
    },
    {
      title: 'Completed',
      data: filtered.filter(a => a.status === 'Completed'),
    },
  ].filter(s => s.data.length > 0)

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="chevron-left" size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Appraisals</Text>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push('/quick/appraisal')}
        >
          <Feather name="plus" size={20} color={BLUE} />
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <View style={s.filterRow}>
        {(['All', 'Sale', 'Rental', 'Both'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filterBtn, filter === f && s.filterBtnActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[s.filterTxt, filter === f && s.filterTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={a => a.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="clipboard" size={36} color={TEXT3} />
            <Text style={s.emptyTitle}>No appraisals yet</Text>
            <Text style={s.emptySub}>Tap + to schedule your first appraisal</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={s.sectionHead}>
            <View style={[s.sectionDot, { backgroundColor: STATUS_COLORS[section.title] }]} />
            <Text style={s.sectionTitle}>{section.title}</Text>
            <Text style={s.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        renderItem={({ item: a, index, section }) => (
          <TouchableOpacity
            style={[s.card, index < section.data.length - 1 && s.cardBorder]}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/appraisal/[id]', params: { id: a.id } })}
          >
            <View style={[s.typeBadge, { backgroundColor: TYPE_COLORS[a.type] + '18' }]}>
              <Text style={[s.typeTxt, { color: TYPE_COLORS[a.type] }]}>{a.type.toUpperCase()}</Text>
            </View>
            <View style={s.cardBody}>
              <Text style={s.addr}>{a.address}</Text>
              <Text style={s.cardSub}>{a.suburb} · {a.clientName || 'No client'}</Text>
              <View style={s.cardMeta}>
                <Feather name="calendar" size={11} color={TEXT3} />
                <Text style={s.metaTxt}>{a.date || 'No date set'} {a.time ? `· ${a.time}` : ''}</Text>
              </View>
            </View>
            <View style={s.cardRight}>
              <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[a.status] + '15' }]}>
                <Text style={[s.statusTxt, { color: STATUS_COLORS[a.status] }]}>{a.status}</Text>
              </View>
              {a.status !== 'Completed' && (
                <TouchableOpacity
                  style={s.startBtn}
                  onPress={() => router.push({ pathname: '/appraisal/[id]', params: { id: a.id } })}
                  activeOpacity={0.8}
                >
                  <Text style={s.startTxt}>
                    {a.status === 'In Progress' ? 'Continue' : 'Start'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0',
  },
  backBtn: { width: 40 },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: TEXT, textAlign: 'center' },
  addBtn: { width: 40, alignItems: 'flex-end' },

  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f1f5f9' },
  filterBtnActive: { backgroundColor: TEXT },
  filterTxt: { fontSize: 12, fontWeight: '600', color: TEXT2 },
  filterTxtActive: { color: '#fff' },

  sectionHead: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10,
  },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: TEXT2, flex: 1 },
  sectionCount: { fontSize: 12, color: TEXT3, fontWeight: '600' },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
  },
  cardBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', minWidth: 52 },
  typeTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  cardBody: { flex: 1 },
  addr: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 2 },
  cardSub: { fontSize: 12, color: TEXT2, marginBottom: 5 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt: { fontSize: 11, color: TEXT3 },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 },
  statusTxt: { fontSize: 10, fontWeight: '700' },
  startBtn: { backgroundColor: BLUE, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  startTxt: { fontSize: 11, fontWeight: '700', color: '#fff' },

  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: TEXT },
  emptySub: { fontSize: 13, color: TEXT3 },
})
