import { useEffect, useRef, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Keyboard,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { PROPERTIES, getSessions, type Property, type Attendee, type Session } from '../../store/sessions'

const BLUE  = '#3B6BF7'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

type ResultKind = 'property' | 'contact' | 'session'

type Result =
  | { kind: 'property'; data: Property }
  | { kind: 'contact';  data: Attendee & { propertyAddress: string } }
  | { kind: 'session';  data: Session }

function scoreColor(s: number) {
  if (s >= 70) return GREEN
  if (s >= 50) return AMBER
  return TEXT3
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    getSessions().then(setSessions)
  }, [])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) { setResults([]); return }

    setLoading(true)
    const timer = setTimeout(() => {
      const out: Result[] = []

      // Properties
      for (const p of PROPERTIES) {
        if (
          p.address.toLowerCase().includes(q) ||
          p.suburb.toLowerCase().includes(q) ||
          p.postcode.includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.agent.toLowerCase().includes(q)
        ) {
          out.push({ kind: 'property', data: p })
        }
      }

      // Contacts (attendees across all sessions)
      const seen = new Set<string>()
      for (const s of sessions) {
        for (const a of s.attendees) {
          if (seen.has(a.phone)) continue
          if (
            a.name.toLowerCase().includes(q) ||
            a.phone.includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.livingSuburb.toLowerCase().includes(q) ||
            a.budget.toLowerCase().includes(q) ||
            a.contactType.toLowerCase().includes(q)
          ) {
            seen.add(a.phone)
            out.push({ kind: 'contact', data: { ...a, propertyAddress: s.property.address } })
          }
        }
      }

      // Sessions
      for (const s of sessions) {
        if (
          s.property.address.toLowerCase().includes(q) ||
          s.property.suburb.toLowerCase().includes(q) ||
          s.date.toLowerCase().includes(q)
        ) {
          out.push({ kind: 'session', data: s })
        }
      }

      setResults(out)
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [query, sessions])

  const hasQuery = query.trim().length > 0

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Search bar */}
      <View style={s.barWrap}>
        <View style={[s.bar, focused && s.barFocused]}>
          <Feather name="search" size={18} color={focused ? BLUE : TEXT3} />
          <TextInput
            ref={inputRef}
            style={s.input}
            placeholder="Search properties, contacts, sessions…"
            placeholderTextColor={TEXT3}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {hasQuery && (
            <TouchableOpacity onPress={() => { setQuery(''); inputRef.current?.focus() }}>
              <Feather name="x-circle" size={17} color={TEXT3} />
            </TouchableOpacity>
          )}
        </View>
        {focused && (
          <TouchableOpacity onPress={() => { Keyboard.dismiss(); setFocused(false) }} style={s.cancelBtn}>
            <Text style={s.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      {!hasQuery ? (
        <EmptyState />
      ) : loading ? (
        <ActivityIndicator color={BLUE} style={{ marginTop: 48 }} />
      ) : results.length === 0 ? (
        <View style={s.noResults}>
          <Feather name="search" size={36} color={TEXT3} />
          <Text style={s.noResultsTxt}>No results for "{query}"</Text>
          <Text style={s.noResultsSub}>Try a name, address, suburb, or postcode.</Text>
        </View>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Counts row */}
          <View style={s.countRow}>
            <Text style={s.countTxt}>{results.length} result{results.length !== 1 ? 's' : ''}</Text>
          </View>

          {/* Properties */}
          {results.filter(r => r.kind === 'property').length > 0 && (
            <Section title="Properties" icon="home">
              {results.filter(r => r.kind === 'property').map(r => {
                const p = (r as { kind: 'property'; data: Property }).data
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={row.wrap}
                    onPress={() => router.push({ pathname: '/property/[id]', params: { id: p.id } })}
                    activeOpacity={0.7}
                  >
                    <View style={[row.icon, { backgroundColor: p.listingType === 'For Lease' ? GREEN + '18' : BLUE + '18' }]}>
                      <Feather name="home" size={18} color={p.listingType === 'For Lease' ? GREEN : BLUE} />
                    </View>
                    <View style={row.body}>
                      <Text style={row.title}>{p.address}</Text>
                      <Text style={row.sub}>{p.suburb} · {p.postcode}</Text>
                    </View>
                    <View style={row.right}>
                      <View style={[row.badge, { backgroundColor: p.listingType === 'For Lease' ? GREEN + '18' : BLUE + '18' }]}>
                        <Text style={[row.badgeTxt, { color: p.listingType === 'For Lease' ? GREEN : BLUE }]}>{p.listingType === 'For Lease' ? 'Lease' : 'Sale'}</Text>
                      </View>
                      <Text style={row.price}>{p.price}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={TEXT3} />
                  </TouchableOpacity>
                )
              })}
            </Section>
          )}

          {/* Contacts */}
          {results.filter(r => r.kind === 'contact').length > 0 && (
            <Section title="Contacts" icon="user">
              {results.filter(r => r.kind === 'contact').map(r => {
                const a = (r as { kind: 'contact'; data: Attendee & { propertyAddress: string } }).data
                return (
                  <View key={a.id} style={row.wrap}>
                    <View style={row.avatar}>
                      <Text style={row.avatarTxt}>{initials(a.name)}</Text>
                    </View>
                    <View style={row.body}>
                      <Text style={row.title}>{a.name}</Text>
                      <Text style={row.sub}>{a.phone}{a.email ? ` · ${a.email}` : ''}</Text>
                      <Text style={row.sub2}>{a.contactType}{a.budget ? ` · ${a.budget}` : ''} · {a.propertyAddress}</Text>
                    </View>
                    <View style={[row.scoreDot, { backgroundColor: scoreColor(a.score) }]}>
                      <Text style={row.scoreNum}>{a.score}</Text>
                    </View>
                  </View>
                )
              })}
            </Section>
          )}

          {/* Sessions */}
          {results.filter(r => r.kind === 'session').length > 0 && (
            <Section title="Sessions" icon="calendar">
              {results.filter(r => r.kind === 'session').map(r => {
                const sess = (r as { kind: 'session'; data: Session }).data
                return (
                  <TouchableOpacity
                    key={sess.id}
                    style={row.wrap}
                    onPress={() => router.push('/attendees')}
                    activeOpacity={0.7}
                  >
                    <View style={[row.icon, { backgroundColor: '#EEF2FF' }]}>
                      <Feather name="clipboard" size={18} color={BLUE} />
                    </View>
                    <View style={row.body}>
                      <Text style={row.title}>{sess.property.address}</Text>
                      <Text style={row.sub}>{sess.date} · {sess.startTime}</Text>
                    </View>
                    <View style={row.right}>
                      <Feather name="users" size={14} color={TEXT3} />
                      <Text style={row.attendeeCount}>{sess.attendees.length}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={TEXT3} />
                  </TouchableOpacity>
                )
              })}
            </Section>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <View style={sec.wrap}>
      <View style={sec.header}>
        <Feather name={icon as any} size={14} color={TEXT3} />
        <Text style={sec.title}>{title}</Text>
      </View>
      <View style={sec.list}>{children}</View>
    </View>
  )
}

function EmptyState() {
  const recents = [
    { label: 'Cronulla',    icon: 'map-pin' },
    { label: 'Bondi Beach', icon: 'map-pin' },
    { label: 'Buyers',      icon: 'users'   },
    { label: 'Pre-approved',icon: 'check-circle' },
  ]
  return (
    <ScrollView contentContainerStyle={es.wrap}>
      <Text style={es.heading}>Search</Text>
      <Text style={es.sub}>Find properties, contacts and sessions.</Text>
      <View style={es.chipRow}>
        {recents.map(r => (
          <View key={r.label} style={es.chip}>
            <Feather name={r.icon as any} size={13} color={TEXT2} />
            <Text style={es.chipTxt}>{r.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  barWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  bar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9,
    backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  barFocused: { backgroundColor: '#fff', borderColor: BLUE },
  input: { flex: 1, fontSize: 15, color: TEXT, padding: 0 },
  cancelBtn: { paddingVertical: 4 },
  cancelTxt: { fontSize: 15, fontWeight: '600', color: BLUE },
  countRow: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  countTxt: { fontSize: 13, color: TEXT3, fontWeight: '500' },
  noResults: { alignItems: 'center', paddingTop: 64, gap: 8, paddingHorizontal: 40 },
  noResultsTxt: { fontSize: 16, fontWeight: '700', color: TEXT2, textAlign: 'center' },
  noResultsSub: { fontSize: 13, color: TEXT3, textAlign: 'center' },
})

const sec = StyleSheet.create({
  wrap: { marginTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#f8fafc' },
  title: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.5 },
  list: { backgroundColor: '#fff' },
})

const row = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  icon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 13, fontWeight: '700', color: TEXT2 },
  body: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 2 },
  sub: { fontSize: 12, color: TEXT2 },
  sub2: { fontSize: 11, color: TEXT3, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 3 },
  badge: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  badgeTxt: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  price: { fontSize: 12, fontWeight: '600', color: TEXT2 },
  attendeeCount: { fontSize: 13, fontWeight: '600', color: TEXT2, marginLeft: 2 },
  scoreDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 12, fontWeight: '800', color: '#fff' },
})

const es = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 32, gap: 8 },
  heading: { fontSize: 22, fontWeight: '800', color: TEXT, letterSpacing: -0.4 },
  sub: { fontSize: 14, color: TEXT2, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  chipTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
})
