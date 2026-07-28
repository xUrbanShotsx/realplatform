import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const BLUE   = '#3B6BF7'
const GREEN  = '#10b981'
const AMBER  = '#f59e0b'
const PURPLE = '#8b5cf6'
const TEXT   = '#0f172a'
const TEXT2  = '#475569'
const TEXT3  = '#94a3b8'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const SIGN_INS = [14, 22, 18, 31, 27, 38, 24]
const MAX_BAR = Math.max(...SIGN_INS)

type StatCard = { label: string; value: string; change: string; up: boolean; color: string }

const STATS: StatCard[] = [
  { label: 'Total Sign-ins (Jul)',  value: '24',    change: '+18% vs last month', up: true,  color: BLUE   },
  { label: 'OFIs Held',            value: '12',    change: '+4 vs last month',   up: true,  color: GREEN  },
  { label: 'New Leads Generated',  value: '31',    change: '+12% vs last month', up: true,  color: PURPLE },
  { label: 'Appraisals Completed', value: '8',     change: '+2 vs last month',   up: true,  color: AMBER  },
  { label: 'Active Pipeline',      value: '$14.7M',change: '+$2.1M vs last month',up: true, color: GREEN  },
  { label: 'Avg. Days to Offer',   value: '18d',   change: '-3d vs last month',  up: true,  color: BLUE   },
  { label: 'Conversion Rate',      value: '34%',   change: '+5% vs last month',  up: true,  color: PURPLE },
  { label: 'Properties Listed',    value: '6',     change: 'No change',          up: false, color: TEXT3  },
]

const RECENT_WINS = [
  { id: 'w1', title: '7 Raglan St under offer',    sub: '$2.48M · Alex Turner',   date: '4 days ago', icon: 'trending-up', color: PURPLE },
  { id: 'w2', title: '14 Arcadia St offer received', sub: '$2.1M · Marcus Lee',   date: '1 week ago', icon: 'dollar-sign', color: GREEN  },
  { id: 'w3', title: 'Record sign-ins – Cronulla',  sub: '38 sign-ins in June',   date: 'Last month', icon: 'award',       color: AMBER  },
]

export default function PerformanceScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Performance</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Sign-in bar chart */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Sign-ins per Month</Text>
          <View style={s.barChart}>
            {MONTHS.map((m, i) => {
              const height = Math.round((SIGN_INS[i] / MAX_BAR) * 80)
              const isLast = i === MONTHS.length - 1
              return (
                <View key={m} style={s.barCol}>
                  <Text style={[s.barVal, isLast && { color: BLUE }]}>{SIGN_INS[i]}</Text>
                  <View style={[s.bar, { height, backgroundColor: isLast ? BLUE : '#e2e8f0' }]} />
                  <Text style={[s.barLabel, isLast && { color: BLUE, fontWeight: '700' }]}>{m}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Stats grid */}
        <View style={s.grid}>
          {STATS.map(stat => (
            <View key={stat.label} style={s.statCard}>
              <Text style={[s.statVal, { color: stat.color }]}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
              <View style={s.changeRow}>
                <Feather
                  name={stat.up ? 'trending-up' : 'minus'}
                  size={11}
                  color={stat.up ? GREEN : TEXT3}
                />
                <Text style={[s.changeTxt, { color: stat.up ? GREEN : TEXT3 }]}>{stat.change}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent wins */}
        <Text style={s.sectionLabel}>Recent Highlights</Text>
        <View style={s.card}>
          {RECENT_WINS.map((w, i) => (
            <View key={w.id} style={[s.winRow, i > 0 && s.rowBorder]}>
              <View style={[s.winIcon, { backgroundColor: w.color + '15' }]}>
                <Feather name={w.icon as any} size={17} color={w.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.winTitle}>{w.title}</Text>
                <Text style={s.winSub}>{w.sub}</Text>
              </View>
              <Text style={s.winDate}>{w.date}</Text>
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
  chartCard: { margin: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16 },
  chartTitle: { fontSize: 13, fontWeight: '700', color: TEXT2, marginBottom: 16 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '60%', borderRadius: 4, minHeight: 4 },
  barVal: { fontSize: 10, fontWeight: '700', color: TEXT3 },
  barLabel: { fontSize: 10, color: TEXT3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  statCard: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginLeft: 4 },
  statVal: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: TEXT2, marginTop: 4 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  changeTxt: { fontSize: 10, fontWeight: '600' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 8, marginBottom: 8, paddingHorizontal: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginHorizontal: 16 },
  winRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  winIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  winTitle: { fontSize: 14, fontWeight: '700', color: TEXT },
  winSub: { fontSize: 12, color: TEXT2, marginTop: 2 },
  winDate: { fontSize: 11, color: TEXT3 },
})
