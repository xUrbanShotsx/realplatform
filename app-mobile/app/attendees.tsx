import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { getSessions, PROPERTIES, type Session, type Attendee } from '../store/sessions'

const BLUE = '#4361ee'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'
const BORDER = 'rgba(0,0,0,0.07)'

function scoreColor(n: number) {
  if (n >= 75) return GREEN
  if (n >= 50) return BLUE
  return AMBER
}

function ScoreBadge({ score }: { score: number }) {
  const c = scoreColor(score)
  return (
    <View style={{ backgroundColor: `${c}15`, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4, borderWidth: 1, borderColor: `${c}30` }}>
      <Text style={{ fontSize: 13, fontWeight: '800', color: c }}>{score}</Text>
    </View>
  )
}

function AttendeeCard({ a }: { a: Attendee }) {
  const initials = a.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <View style={c.card}>
      <View style={c.avatar}>
        <Text style={c.initials}>{initials}</Text>
      </View>
      <View style={c.info}>
        <Text style={c.name}>{a.name}</Text>
        <Text style={c.phone}>{a.phone}{a.email ? `  ·  ${a.email}` : ''}</Text>
        <View style={c.tagRow}>
          <View style={[c.chip, { backgroundColor: a.contactType === 'Buyer' ? '#eff6ff' : a.contactType === 'Renter' ? '#f0fdf4' : '#fafafa' }]}>
            <Text style={[c.chipTxt, { color: a.contactType === 'Buyer' ? BLUE : a.contactType === 'Renter' ? GREEN : TEXT3 }]}>{a.contactType}</Text>
          </View>
          {a.preApproved === 'Yes' && (
            <View style={[c.chip, { backgroundColor: '#f0fdf4' }]}>
              <Text style={[c.chipTxt, { color: GREEN }]}>Pre-approved</Text>
            </View>
          )}
          {a.budget ? (
            <View style={[c.chip, { backgroundColor: '#fafafa' }]}>
              <Text style={[c.chipTxt, { color: TEXT2 }]}>{a.budget}</Text>
            </View>
          ) : null}
        </View>
        <Text style={c.time}>Signed in {a.signedInAt}</Text>
      </View>
      <ScoreBadge score={a.score} />
    </View>
  )
}

export default function AttendeesScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSession, setActiveSession] = useState<Session | null>(null)

  useEffect(() => {
    getSessions().then(all => {
      setSessions(all)
      const target = sessionId ? all.find(s => s.id === sessionId) : all[0]
      setActiveSession(target ?? null)
      setLoading(false)
    })
  }, [])

  const totalToday = sessions.reduce((acc, s) => acc + s.attendees.length, 0)
  const hotLeads = sessions.flatMap(s => s.attendees).filter(a => a.score >= 75).length

  if (loading) return <ActivityIndicator size="large" color={BLUE} style={{ marginTop: 80 }} />

  const allAttendees = activeSession?.attendees ?? []

  return (
    <View style={s.container}>
      {/* Stats strip */}
      <View style={s.statsRow}>
        <View style={s.stat}>
          <Text style={s.statNum}>{totalToday}</Text>
          <Text style={s.statLabel}>Total today</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.stat}>
          <Text style={[s.statNum, { color: GREEN }]}>{hotLeads}</Text>
          <Text style={s.statLabel}>Hot leads</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.stat}>
          <Text style={s.statNum}>{sessions.length}</Text>
          <Text style={s.statLabel}>Sessions</Text>
        </View>
      </View>

      {/* Session selector */}
      {sessions.length > 1 && (
        <FlatList
          horizontal
          data={sessions}
          keyExtractor={s => s.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveSession(item)}
              style={[
                p.pill,
                activeSession?.id === item.id && p.pillActive,
              ]}
            >
              <Text style={[p.pillTxt, activeSession?.id === item.id && p.pillTxtActive]}>
                {item.property.suburb} ({item.attendees.length})
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Attendee list */}
      {activeSession ? (
        <>
          <View style={s.sessionHeader}>
            <Text style={s.sessionAddr}>{activeSession.property.address}</Text>
            <Text style={s.sessionMeta}>{activeSession.date} · {activeSession.attendees.length} visitors</Text>
          </View>

          {allAttendees.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>No visitors yet</Text>
              <Text style={s.emptySub}>Sign-ins will appear here as people arrive.</Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/sign-in/[id]', params: { id: activeSession.property.id } })}
                style={s.emptyBtn}
              >
                <Text style={s.emptyBtnTxt}>Start Signing People In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={[...allAttendees].reverse()}
              keyExtractor={a => a.id}
              contentContainerStyle={{ padding: 16, gap: 10 }}
              renderItem={({ item }) => <AttendeeCard a={item} />}
            />
          )}
        </>
      ) : (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>No sessions yet</Text>
          <Text style={s.emptySub}>Start an open home from the properties screen.</Text>
          <TouchableOpacity onPress={() => router.replace('/')} style={s.emptyBtn}>
            <Text style={s.emptyBtnTxt}>Go to Properties</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: BORDER, padding: 16, gap: 0 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: TEXT, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: TEXT3, marginTop: 2, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: BORDER, marginVertical: 4 },
  sessionHeader: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: BORDER, backgroundColor: '#fff' },
  sessionAddr: { fontSize: 14, fontWeight: '700', color: TEXT },
  sessionMeta: { fontSize: 12, color: TEXT3, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: TEXT, marginBottom: 8 },
  emptySub: { fontSize: 14, color: TEXT2, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn: { backgroundColor: BLUE, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 13 },
  emptyBtnTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
})

const c = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 15, fontWeight: '700', color: BLUE },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: TEXT, marginBottom: 2 },
  phone: { fontSize: 12, color: TEXT2, marginBottom: 7 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 5 },
  chip: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  chipTxt: { fontSize: 11, fontWeight: '600' },
  time: { fontSize: 11, color: TEXT3 },
})

const p = StyleSheet.create({
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER },
  pillActive: { backgroundColor: BLUE, borderColor: BLUE },
  pillTxt: { fontSize: 13, color: TEXT2, fontWeight: '500' },
  pillTxtActive: { color: '#fff', fontWeight: '700' },
})
