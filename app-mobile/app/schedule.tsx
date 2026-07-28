import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { PROPERTIES } from '../store/sessions'

const BLUE  = '#3B6BF7'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const PURPLE = '#8b5cf6'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

type ScheduleItem = {
  id: string; type: 'OFI' | 'Appraisal' | 'Meeting' | 'Call'
  title: string; subtitle: string; time: string; duration: string; day: string
}

const DAYS = ['Mon 28 Jul', 'Tue 29 Jul', 'Wed 30 Jul', 'Thu 31 Jul', 'Sat 2 Aug']

const SCHEDULE: ScheduleItem[] = [
  { id: 's1',  type: 'Appraisal', title: '12 Ocean View Dr', subtitle: 'Cronulla · Sale Appraisal',       time: '9:00 AM',  duration: '1h',    day: 'Mon 28 Jul' },
  { id: 's2',  type: 'Call',      title: 'Sarah Wilson',     subtitle: 'Follow-up re 42 Foreshore Cres',  time: '11:00 AM', duration: '20m',   day: 'Mon 28 Jul' },
  { id: 's3',  type: 'Meeting',   title: 'Vendor Meeting',   subtitle: 'Michael & Sarah Chen',            time: '2:00 PM',  duration: '45m',   day: 'Mon 28 Jul' },
  { id: 's4',  type: 'Call',      title: 'Marcus Lee',       subtitle: 'Negotiate offer 14 Arcadia St',   time: '9:30 AM',  duration: '20m',   day: 'Tue 29 Jul' },
  { id: 's5',  type: 'Appraisal', title: '88 Marine Pde',    subtitle: 'Cronulla · Rental Appraisal',     time: '11:30 AM', duration: '1h',    day: 'Tue 29 Jul' },
  { id: 's6',  type: 'Meeting',   title: 'Team Catchup',     subtitle: 'Spinelli RE Office',              time: '3:00 PM',  duration: '1h',    day: 'Wed 30 Jul' },
  { id: 's7',  type: 'Call',      title: 'James Clark',      subtitle: 'Cash buyer update – Foreshore',   time: '10:00 AM', duration: '15m',   day: 'Thu 31 Jul' },
  { id: 's8',  type: 'OFI',       title: '42 Foreshore Cres',subtitle: 'Cronulla · 4bd 3ba',              time: '10:00 AM', duration: '30m',   day: 'Sat 2 Aug'  },
  { id: 's9',  type: 'OFI',       title: '14 Arcadia St',    subtitle: 'Bondi Beach · 4bd 2ba',           time: '10:30 AM', duration: '30m',   day: 'Sat 2 Aug'  },
  { id: 's10', type: 'OFI',       title: '42 Glenmore Rd',   subtitle: 'Paddington · 4bd 2ba',            time: '11:00 AM', duration: '30m',   day: 'Sat 2 Aug'  },
  { id: 's11', type: 'OFI',       title: '48 Woodford Ave',  subtitle: 'Warilla · 3bd 2ba',               time: '11:00 AM', duration: '30m',   day: 'Sat 2 Aug'  },
  { id: 's12', type: 'OFI',       title: '22 Thirroul Esp',  subtitle: 'Thirroul · 3bd 2ba',              time: '11:30 AM', duration: '30m',   day: 'Sat 2 Aug'  },
  { id: 's13', type: 'OFI',       title: '7 Raglan St',      subtitle: 'Mosman · 4bd 2ba',                time: '12:00 PM', duration: '30m',   day: 'Sat 2 Aug'  },
]

const TYPE_COLOR: Record<string, string> = {
  OFI: BLUE, Appraisal: PURPLE, Meeting: GREEN, Call: AMBER,
}
const TYPE_ICON: Record<string, string> = {
  OFI: 'home', Appraisal: 'clipboard', Meeting: 'users', Call: 'phone',
}

export default function ScheduleScreen() {
  const grouped = DAYS.map(day => ({
    day,
    items: SCHEDULE.filter(s => s.day === day),
  }))

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>My Schedule</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {grouped.map(({ day, items }) => (
          <View key={day} style={s.daySection}>
            <Text style={s.dayLabel}>{day}</Text>
            {items.length === 0 ? (
              <View style={s.emptyDay}><Text style={s.emptyDayTxt}>No events</Text></View>
            ) : (
              <View style={s.card}>
                {items.map((item, i) => {
                  const color = TYPE_COLOR[item.type]
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[s.row, i > 0 && s.rowBorder]}
                      activeOpacity={0.65}
                    >
                      <View style={[s.iconWrap, { backgroundColor: color + '15' }]}>
                        <Feather name={TYPE_ICON[item.type] as any} size={17} color={color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.itemTitle}>{item.title}</Text>
                        <Text style={s.itemSub}>{item.subtitle}</Text>
                      </View>
                      <View style={s.timeWrap}>
                        <Text style={s.time}>{item.time}</Text>
                        <Text style={s.dur}>{item.duration}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },
  daySection: { paddingHorizontal: 16, marginTop: 20 },
  dayLabel: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  iconWrap: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '700', color: TEXT },
  itemSub: { fontSize: 12, color: TEXT2, marginTop: 2 },
  timeWrap: { alignItems: 'flex-end' },
  time: { fontSize: 13, fontWeight: '600', color: TEXT },
  dur: { fontSize: 11, color: TEXT3, marginTop: 2 },
  emptyDay: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 20, alignItems: 'center' },
  emptyDayTxt: { fontSize: 13, color: TEXT3 },
})
