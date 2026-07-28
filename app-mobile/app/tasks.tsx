import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const BLUE   = '#3B6BF7'
const GREEN  = '#10b981'
const AMBER  = '#f59e0b'
const RED    = '#ef4444'
const PURPLE = '#8b5cf6'
const TEXT   = '#0f172a'
const TEXT2  = '#475569'
const TEXT3  = '#94a3b8'

type Priority = 'High' | 'Medium' | 'Low'
type TaskItem = {
  id: string; title: string; subtitle: string; due: string
  priority: Priority; done: boolean; category: string
}

const PRIORITY_COLOR: Record<Priority, string> = { High: RED, Medium: AMBER, Low: GREEN }

const MOCK_TASKS: TaskItem[] = [
  { id: 't1',  title: 'Follow up Sarah Wilson',    subtitle: '42 Foreshore Cres – verbal offer',     due: 'Today',        priority: 'High',   done: false, category: 'Follow-up' },
  { id: 't2',  title: 'Send contract to Marcus Lee', subtitle: '14 Arcadia St – $2.1M offer',        due: 'Today',        priority: 'High',   done: false, category: 'Contracts' },
  { id: 't3',  title: 'Vendor report – 7 Raglan St', subtitle: 'Weekly update for Rachel Nguyen',   due: 'Today',        priority: 'High',   done: false, category: 'Reports' },
  { id: 't4',  title: 'Call James Clark',           subtitle: 'Cash buyer interest – Foreshore',     due: 'Tomorrow',     priority: 'Medium', done: false, category: 'Follow-up' },
  { id: 't5',  title: 'Upload photos – 42 Glenmore', subtitle: 'New photography received',           due: 'Tomorrow',     priority: 'Medium', done: false, category: 'Marketing' },
  { id: 't6',  title: 'Prepare OFI packs',          subtitle: 'Saturday inspections – 5 properties', due: 'Fri 1 Aug',    priority: 'Medium', done: false, category: 'OFI' },
  { id: 't7',  title: 'Submit rental inspection',   subtitle: '48 Woodford Ave routine inspection',  due: 'Fri 1 Aug',    priority: 'Low',    done: false, category: 'Rentals' },
  { id: 't8',  title: 'Review buyer match report',  subtitle: '42 Glenmore Rd buyer interest',       due: 'Next week',    priority: 'Low',    done: false, category: 'Reports' },
  { id: 't9',  title: 'Follow up Nina Patel',       subtitle: 'Mosman downsizer – call back',        due: 'Next week',    priority: 'Medium', done: false, category: 'Follow-up' },
  { id: 't10', title: 'Renew listing – 7 Raglan St', subtitle: 'Domain & realestate.com.au',         due: 'Next week',    priority: 'Low',    done: false, category: 'Marketing' },
  { id: 't11', title: 'Book photographer',          subtitle: '88 Marine Pde new listing',           due: 'Completed',    priority: 'High',   done: true,  category: 'Marketing' },
  { id: 't12', title: 'Send OFI report – Cronulla', subtitle: 'Post Saturday inspection',            due: 'Completed',    priority: 'Medium', done: true,  category: 'Reports' },
]

type Filter = 'Open' | 'Done' | 'All'

export default function TasksScreen() {
  const [filter, setFilter] = useState<Filter>('Open')
  const [tasks, setTasks] = useState(MOCK_TASKS)

  const filtered = tasks.filter(t =>
    filter === 'All' ? true : filter === 'Open' ? !t.done : t.done
  )

  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

  const open = tasks.filter(t => !t.done).length

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <View>
          <Text style={s.title}>All Tasks</Text>
          {open > 0 && <Text style={s.titleSub}>{open} open</Text>}
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={s.filters}>
        {(['Open', 'All', 'Done'] as Filter[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.pill, filter === f && s.pillActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[s.pillTxt, filter === f && s.pillTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <View style={s.card}>
          {filtered.map((task, i) => (
            <TouchableOpacity
              key={task.id}
              style={[s.row, i > 0 && s.rowBorder]}
              onPress={() => toggle(task.id)}
              activeOpacity={0.65}
            >
              <View style={[s.check, task.done && s.checkDone]}>
                {task.done && <Feather name="check" size={13} color="#fff" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.taskTitle, task.done && s.taskDone]}>{task.title}</Text>
                <Text style={s.taskSub}>{task.subtitle}</Text>
                <View style={s.metaRow}>
                  <View style={[s.priorityDot, { backgroundColor: PRIORITY_COLOR[task.priority] }]} />
                  <Text style={s.metaTxt}>{task.priority}</Text>
                  <Text style={s.dot}>·</Text>
                  <Text style={s.metaTxt}>{task.due}</Text>
                  <Text style={s.dot}>·</Text>
                  <Text style={s.metaTxt}>{task.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {filtered.length === 0 && (
            <View style={s.empty}>
              <Feather name="check-circle" size={28} color={GREEN} />
              <Text style={s.emptyTxt}>All caught up!</Text>
            </View>
          )}
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
  titleSub: { textAlign: 'center', fontSize: 11, color: TEXT3, marginTop: 1 },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  pill: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#f1f5f9' },
  pillActive: { backgroundColor: TEXT },
  pillTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  pillTxtActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginTop: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  check: { marginTop: 1, width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: GREEN, borderColor: GREEN },
  taskTitle: { fontSize: 14, fontWeight: '600', color: TEXT },
  taskDone: { color: TEXT3, textDecorationLine: 'line-through' },
  taskSub: { fontSize: 12, color: TEXT2, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  priorityDot: { width: 6, height: 6, borderRadius: 3 },
  metaTxt: { fontSize: 11, color: TEXT3 },
  dot: { fontSize: 11, color: TEXT3 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyTxt: { fontSize: 15, fontWeight: '600', color: TEXT2 },
})
