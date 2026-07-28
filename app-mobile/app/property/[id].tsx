import { useEffect, useRef, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SectionList, Linking, Modal, Pressable, Alert, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { Feather, Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import {
  PROPERTIES, VENDORS, getSessions, saveSession, newSession, calcScore, buildTags,
  type Property, type Session, type Attendee, type Vendor,
} from '../../store/sessions'

const BLUE  = '#3B6BF7'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const RED   = '#ef4444'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'
const GRAY_BG = '#f8fafc'

const THUMB_COLORS: Record<string, [string, string]> = {
  '1': ['#0ea5e9', '#0369a1'],
  '2': ['#f59e0b', '#b45309'],
  '3': ['#10b981', '#047857'],
  '4': ['#8b5cf6', '#6d28d9'],
  '5': ['#06b6d4', '#0e7490'],
  '6': ['#ec4899', '#be185d'],
}

type TabId = 'Details' | 'Contacts' | 'Buyer Match' | 'Activity' | 'Notes' | 'OFI' | 'Tasks' | 'Appointments'
const TABS: TabId[] = ['Details', 'Contacts', 'Buyer Match', 'Activity', 'Notes', 'OFI', 'Tasks', 'Appointments']

// ── Mock Data ─────────────────────────────────────────────────────────────────

type MockContact = {
  id: string; name: string; hotness: 'HOT' | 'WARM' | null
  inspections: number; notes: number; reports: number
  date: string; phone: string; email: string
}

const MOCK_CONTACTS: MockContact[] = [
  { id: 'mc1', name: 'Sarah Johnson',  hotness: 'HOT',  inspections: 2, notes: 3, reports: 1, date: '28/07/2026', phone: '0412 111 222', email: 'sarah.johnson@email.com' },
  { id: 'mc2', name: 'Mark Williams',  hotness: 'WARM', inspections: 1, notes: 2, reports: 0, date: '28/07/2026', phone: '0421 333 444', email: 'mark.williams@email.com'  },
  { id: 'mc3', name: 'Emma Brown',     hotness: null,   inspections: 1, notes: 1, reports: 0, date: '28/07/2026', phone: '0418 555 666', email: 'emma.brown@email.com'    },
  { id: 'mc4', name: 'David Lee',      hotness: 'WARM', inspections: 2, notes: 3, reports: 1, date: '20/07/2026', phone: '0411 777 888', email: 'david.lee@email.com'     },
  { id: 'mc5', name: 'Priya Sharma',   hotness: null,   inspections: 1, notes: 1, reports: 0, date: '20/07/2026', phone: '0422 999 000', email: 'priya.sharma@email.com'  },
  { id: 'mc6', name: "James O'Brien",  hotness: null,   inspections: 1, notes: 1, reports: 0, date: '20/07/2026', phone: '0415 111 333', email: 'james.obrien@email.com'  },
  { id: 'mc7', name: 'Anna Mitchell',  hotness: 'HOT',  inspections: 3, notes: 4, reports: 2, date: '12/07/2026', phone: '0419 222 444', email: 'anna.mitchell@email.com' },
  { id: 'mc8', name: 'Tom Nguyen',     hotness: null,   inspections: 1, notes: 0, reports: 0, date: '12/07/2026', phone: '0413 555 777', email: 'tom.nguyen@email.com'    },
  { id: 'mc9', name: 'Claire Walsh',   hotness: 'WARM', inspections: 1, notes: 2, reports: 1, date: '05/07/2026', phone: '0416 888 000', email: 'claire.walsh@email.com'  },
]

type CallLog = {
  id: string; result: string; direction: 'Outbound' | 'Inbound'
  note: string; date: string; contact: string; phone: string
}

const MOCK_CALL_LOGS: CallLog[] = [
  { id: 'cl1', result: 'Connected',            direction: 'Outbound', note: 'Looking for a newer home, keen on the area. Wants to book a second inspection.',          date: '28 Jul 2026', contact: 'Sarah Johnson',  phone: '0412 111 222' },
  { id: 'cl2', result: 'Left Voicemail + Text', direction: 'Outbound', note: '',    date: '28 Jul 2026', contact: 'Mark Williams',  phone: '0421 333 444' },
  { id: 'cl3', result: 'Left Voicemail',        direction: 'Outbound', note: '',    date: '28 Jul 2026', contact: 'Emma Brown',     phone: '0418 555 666' },
  { id: 'cl4', result: 'Connected',            direction: 'Outbound', note: 'Very interested, discussing contract conditions with their solicitor.',                    date: '21 Jul 2026', contact: 'David Lee',      phone: '0411 777 888' },
  { id: 'cl5', result: 'No Answer',            direction: 'Outbound', note: '',    date: '21 Jul 2026', contact: 'Priya Sharma',   phone: '0422 999 000' },
]

type OFISession = {
  id: string; date: string; timeRange: string; attendees: number; notes: number; reports: number; isPast: boolean
}

const MOCK_OFI_SESSIONS: OFISession[] = [
  { id: 'fo1', date: 'Sat, 02 Aug 2026',  timeRange: '10:00AM – 10:30AM', attendees: 0, notes: 0, reports: 0, isPast: false },
  { id: 'fo2', date: 'Sat, 26 Jul 2026',  timeRange: '10:00AM – 10:30AM', attendees: 3, notes: 3, reports: 1, isPast: true },
  { id: 'fo3', date: 'Sat, 19 Jul 2026',  timeRange: '10:00AM – 10:30AM', attendees: 3, notes: 0, reports: 0, isPast: true },
  { id: 'fo4', date: 'Sat, 12 Jul 2026',  timeRange: '10:00AM – 10:30AM', attendees: 2, notes: 1, reports: 0, isPast: true },
  { id: 'fo5', date: 'Sat, 05 Jul 2026',  timeRange: '10:00AM – 10:30AM', attendees: 1, notes: 2, reports: 1, isPast: true },
  { id: 'fo6', date: 'Sat, 28 Jun 2026',  timeRange: '10:00AM – 10:30AM', attendees: 2, notes: 0, reports: 0, isPast: true },
  { id: 'fo7', date: 'Sat, 21 Jun 2026',  timeRange: '01:45PM – 02:15PM', attendees: 3, notes: 1, reports: 0, isPast: true },
  { id: 'fo8', date: 'Sat, 14 Jun 2026',  timeRange: '10:00AM – 10:30AM', attendees: 1, notes: 0, reports: 0, isPast: true },
]

const MOCK_TASKS = [
  { id: 't1', title: 'Send vendor weekly report',       due: 'Today',       priority: 'High',   done: false },
  { id: 't2', title: 'Follow up pre-approved buyers',   due: 'Tomorrow',    priority: 'High',   done: false },
  { id: 't3', title: 'Update price guide on REA',       due: 'This week',   priority: 'Medium', done: false },
  { id: 't4', title: 'Schedule professional photography', due: 'Next week', priority: 'Low',    done: true  },
  { id: 't5', title: 'Prepare contract of sale',        due: 'Next week',   priority: 'Medium', done: false },
]

const MOCK_APPTS = [
  { id: 'a1', title: 'Open for Inspection',  day: 'Saturday', date: '2 Aug',  time: '10:00 AM', icon: 'home'     },
  { id: 'a2', title: 'Vendor Meeting',       day: 'Monday',   date: '4 Aug',  time: '2:00 PM',  icon: 'users'    },
  { id: 'a3', title: 'Building & Pest Insp', day: 'Tuesday',  date: '5 Aug',  time: '11:00 AM', icon: 'search'   },
  { id: 'a4', title: 'Open for Inspection',  day: 'Saturday', date: '9 Aug',  time: '10:00 AM', icon: 'home'     },
  { id: 'a5', title: 'Private Inspection',   day: 'Sunday',   date: '10 Aug', time: '1:30 PM',  icon: 'eye'      },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}
function hotnessStyle(h: string | null): { bg: string; color: string } | null {
  if (h === 'HOT')  return { bg: '#fee2e2', color: RED }
  if (h === 'WARM') return { bg: '#fef3c7', color: AMBER }
  return null
}
function callResultIcon(result: string): { icon: string; color: string } {
  if (result === 'Connected')             return { icon: 'phone-outgoing', color: GREEN }
  if (result.includes('Voicemail'))       return { icon: 'phone-missed',   color: AMBER }
  if (result === 'No Answer')             return { icon: 'phone-off',       color: RED   }
  return { icon: 'phone',                                                    color: TEXT3  }
}
function callNumber(phone: string) { Linking.openURL(`tel:${phone.replace(/\s/g,'')}`) }
function emailAddress(email: string) { Linking.openURL(`mailto:${email}`) }

// ── Contact Menu Sheet ────────────────────────────────────────────────────────
type MenuContact = { name: string; phone: string; email: string }

function ContactMenuSheet({ contact, visible, onClose }: { contact: MenuContact | null; visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets()
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [noteText, setNoteText] = useState('')

  const handleClose = () => { setShowNoteInput(false); setNoteText(''); onClose() }

  const handleSaveNote = () => {
    if (noteText.trim()) {
      Alert.alert('Note saved', `Note added for ${contact?.name}.`)
    }
    handleClose()
  }

  if (!contact) return null

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={ms.backdrop} onPress={handleClose}>
          <Pressable style={[ms.sheet, { paddingBottom: insets.bottom + 8 }]} onPress={e => e.stopPropagation()}>
            <View style={ms.handle} />

            {/* Contact header */}
            <View style={ms.contactHeader}>
              <View style={ms.avatar}>
                <Text style={ms.avatarTxt}>{initials(contact.name)}</Text>
              </View>
              <View>
                <Text style={ms.contactName}>{contact.name}</Text>
                <Text style={ms.contactPhone}>{contact.phone}</Text>
              </View>
            </View>

            <View style={ms.divider} />

            {showNoteInput ? (
              /* ── Inline note input ── */
              <View style={ms.noteWrap}>
                <Text style={ms.noteLabel}>Add a note for {contact.name}</Text>
                <TextInput
                  style={ms.noteInput}
                  placeholder="Type your note here…"
                  placeholderTextColor={TEXT3}
                  multiline
                  numberOfLines={4}
                  value={noteText}
                  onChangeText={setNoteText}
                  autoFocus
                />
                <View style={ms.noteActions}>
                  <TouchableOpacity onPress={() => setShowNoteInput(false)} style={ms.noteCancelBtn}>
                    <Text style={ms.noteCancelTxt}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveNote} style={ms.noteSaveBtn}>
                    <Text style={ms.noteSaveTxt}>Save Note</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* ── Action list ── */
              <>
                {[
                  { icon: 'phone',     label: 'Call',          color: GREEN,    fn: () => { callNumber(contact.phone); handleClose() } },
                  { icon: 'mail',      label: 'Email',         color: BLUE,     fn: () => { emailAddress(contact.email); handleClose() } },
                  { icon: 'file-text', label: 'Send Contract', color: '#8b5cf6', fn: () => { Alert.alert('Send Contract', `Contract sent to ${contact.name}.`); handleClose() } },
                  { icon: 'edit-2',    label: 'Add Note',      color: AMBER,    fn: () => setShowNoteInput(true) },
                ].map((a, i) => (
                  <TouchableOpacity key={a.label} onPress={a.fn} style={[ms.action, i > 0 && ms.actionBorder]} activeOpacity={0.65}>
                    <View style={[ms.actionIcon, { backgroundColor: a.color + '15' }]}>
                      <Feather name={a.icon as any} size={19} color={a.color} />
                    </View>
                    <Text style={ms.actionLabel}>{a.label}</Text>
                    <Feather name="chevron-right" size={18} color={TEXT3} />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={handleClose} style={ms.cancelBtn}>
                  <Text style={ms.cancelTxt}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  )
}

// ── ALL / TODAY Toggle ────────────────────────────────────────────────────────
function AllTodayToggle({ value, onChange }: { value: 'ALL' | 'TODAY'; onChange: (v: 'ALL'|'TODAY') => void }) {
  return (
    <View style={tog.wrap}>
      {(['ALL', 'TODAY'] as const).map(v => (
        <TouchableOpacity key={v} onPress={() => onChange(v)} style={[tog.btn, value === v && tog.btnActive]} activeOpacity={0.8}>
          <Text style={[tog.txt, value === v && tog.txtActive]}>{v}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

// ── Details Tab ───────────────────────────────────────────────────────────────
function DetailsTab({ prop }: { prop: Property }) {
  const colors = THUMB_COLORS[prop.id] ?? ['#64748b', '#475569']
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
      <View style={[dt.hero, { backgroundColor: colors[0] }]}>
        <View style={[dt.heroOverlay, { backgroundColor: colors[1] }]} />
        <View style={dt.heroContent}>
          <View style={[dt.badge, { backgroundColor: prop.listingType === 'For Lease' ? GREEN : BLUE }]}>
            <Text style={dt.badgeTxt}>{prop.listingType}</Text>
          </View>
          <Text style={dt.heroPrice}>{prop.price}</Text>
          <Text style={dt.heroAddr}>{prop.address}, {prop.suburb}</Text>
        </View>
      </View>
      <View style={dt.specsRow}>
        {[{ icon: 'home', val: prop.type },{ icon: 'moon', val: `${prop.bedrooms} Bed` },{ icon: 'droplet', val: `${prop.bathrooms} Bath` }].map(s => (
          <View key={s.val} style={dt.specItem}>
            <Feather name={s.icon as any} size={15} color={BLUE} />
            <Text style={dt.specTxt}>{s.val}</Text>
          </View>
        ))}
      </View>
      <View style={cd.wrap}>
        <Text style={cd.sectionTitle}>Property Details</Text>
        {[['Address', `${prop.address}, ${prop.suburb} ${prop.postcode}`],['Type', prop.type],['Listing', prop.listingType],['Price', prop.price],['Bedrooms', String(prop.bedrooms)],['Bathrooms', String(prop.bathrooms)],['Agent', prop.agent]].map(([label, val], i, arr) => (
          <View key={label} style={[cd.row, i < arr.length-1 && cd.rowBorder]}>
            <Text style={cd.label}>{label}</Text>
            <Text style={cd.val}>{val}</Text>
          </View>
        ))}
      </View>
      <View style={cd.wrap}>
        <Text style={cd.sectionTitle}>Description</Text>
        <Text style={dt.desc}>Stunning {prop.type.toLowerCase()} in {prop.suburb} offering exceptional living with {prop.bedrooms} bedrooms, {prop.bathrooms} bathrooms and premium finishes throughout. Ideally positioned in one of the area's most sought-after streets.</Text>
      </View>
    </ScrollView>
  )
}

// ── Contacts Tab ──────────────────────────────────────────────────────────────
function ContactsTab({ prop, vendors }: { prop: Property; vendors: Vendor[] }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
      {vendors.length === 0 && <Text style={empty.txt}>No contacts added yet.</Text>}
      {vendors.map(v => (
        <View key={v.id} style={cd.wrap}>
          <View style={ct.topRow}>
            <View style={ct.avatar}><Text style={ct.avatarTxt}>{initials(v.name)}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={ct.name}>{v.name}</Text>
              <Text style={ct.role}>{v.role}</Text>
            </View>
          </View>
          <View style={ct.infoCol}>
            <TouchableOpacity onPress={() => callNumber(v.phone)} style={ct.infoRow}>
              <Feather name="phone" size={14} color={TEXT3} /><Text style={ct.infoTxt}>{v.phone}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => emailAddress(v.email)} style={ct.infoRow}>
              <Feather name="mail" size={14} color={TEXT3} /><Text style={ct.infoTxt}>{v.email}</Text>
            </TouchableOpacity>
          </View>
          <View style={ct.actionsRow}>
            {[{icon:'phone',label:'Call',fn:() => callNumber(v.phone)},{icon:'message-square',label:'SMS',fn:() => callNumber(v.phone)},{icon:'mail',label:'Email',fn:() => emailAddress(v.email)}].map(a => (
              <TouchableOpacity key={a.label} onPress={a.fn} style={ct.actionBtn}>
                <Feather name={a.icon as any} size={15} color={BLUE} />
                <Text style={ct.actionLbl}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

// ── Buyer Match Tab ───────────────────────────────────────────────────────────
function BuyerMatchTab({ prop, sessions }: { prop: Property; sessions: Session[] }) {
  const [menuContact, setMenuContact] = useState<MenuContact | null>(null)
  const fromSessions: MockContact[] = sessions
    .filter(s => s.property.id === prop.id)
    .flatMap(s => s.attendees.map(a => ({
      id: a.id, name: a.name, phone: a.phone,
      hotness: a.score >= 70 ? 'HOT' as const : a.score >= 50 ? 'WARM' as const : null,
      inspections: 1, notes: 0, reports: 0,
      date: s.date,
    })))

  const all = [...fromSessions, ...MOCK_CONTACTS].sort((a, b) => {
    if (a.hotness === 'HOT' && b.hotness !== 'HOT') return -1
    if (a.hotness === 'WARM' && !b.hotness) return -1
    return 1
  })

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={bm.header}>
        <Text style={bm.headerTxt}>{all.length} Matched Buyers</Text>
      </View>
      {all.map((c, i) => {
        const hs = hotnessStyle(c.hotness)
        return (
          <View key={c.id} style={[cr.row, i < all.length-1 && cr.rowBorder]}>
            <View style={cr.avatar}><Text style={cr.initials}>{initials(c.name)}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={cr.nameRow}>
                <Text style={cr.name}>{c.name}</Text>
                {hs && <View style={[cr.badge, { backgroundColor: hs.bg }]}><Text style={[cr.badgeTxt, { color: hs.color }]}>{c.hotness}</Text></View>}
              </View>
              <View style={cr.statsRow}>
                {c.inspections > 0 && <><Feather name="home" size={13} color={TEXT3} /><Text style={cr.stat}>{c.inspections}</Text></>}
                {c.notes > 0 && <><Feather name="edit-2" size={13} color={TEXT3} /><Text style={cr.stat}>{c.notes}</Text></>}
                {c.reports > 0 && <><Feather name="clipboard" size={13} color={TEXT3} /><Text style={cr.stat}>{c.reports}</Text></>}
              </View>
            </View>
            <TouchableOpacity onPress={() => callNumber(c.phone)} style={cr.callBtn}>
              <Feather name="phone" size={15} color={BLUE} />
            </TouchableOpacity>
            <TouchableOpacity
              style={cr.more}
              onPress={() => setMenuContact({ name: c.name, phone: c.phone, email: c.email ?? '' })}
            >
              <Feather name="more-vertical" size={18} color={TEXT3} />
            </TouchableOpacity>
          </View>
        )
      })}
      <ContactMenuSheet contact={menuContact} visible={!!menuContact} onClose={() => setMenuContact(null)} />
    </ScrollView>
  )
}

// ── Activity Tab ──────────────────────────────────────────────────────────────
function ActivityTab({ prop, sessions }: { prop: Property; sessions: Session[] }) {
  const [filter, setFilter] = useState<'ALL' | 'TODAY'>('ALL')
  const [menuContact, setMenuContact] = useState<MenuContact | null>(null)
  const today = new Date().toLocaleDateString('en-AU', { day:'2-digit', month:'2-digit', year:'numeric' }).replace(/\//g, '/')

  const fromSessions: MockContact[] = sessions
    .filter(s => s.property.id === prop.id)
    .flatMap(s => s.attendees.map(a => ({
      id: a.id, name: a.name, phone: a.phone,
      hotness: a.score >= 70 ? 'HOT' as const : a.score >= 50 ? 'WARM' as const : null,
      inspections: 1, notes: 0, reports: 0, date: s.date,
    })))

  const all = [...fromSessions, ...MOCK_CONTACTS]
  const filtered = filter === 'TODAY' ? all.filter(c => c.date === today) : all

  // Group by date
  const grouped: Record<string, MockContact[]> = {}
  for (const c of filtered) {
    if (!grouped[c.date]) grouped[c.date] = []
    grouped[c.date].push(c)
  }
  const sections = Object.entries(grouped).map(([date, data]) => ({ title: `${date} (${data.length})`, data }))

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={c => c.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={<AllTodayToggle value={filter} onChange={setFilter} />}
        renderSectionHeader={({ section }) => (
          <View style={grp.header}><Text style={grp.title}>{section.title}</Text></View>
        )}
        renderItem={({ item: c, index, section }) => {
          const hs = hotnessStyle(c.hotness)
          return (
            <View style={[cr.row, index < section.data.length-1 && cr.rowBorder]}>
              <View style={cr.avatar}><Text style={cr.initials}>{initials(c.name)}</Text></View>
              <View style={{ flex: 1 }}>
                <View style={cr.nameRow}>
                  <Text style={cr.name}>{c.name}</Text>
                  {hs && <View style={[cr.badge, { backgroundColor: hs.bg }]}><Text style={[cr.badgeTxt, { color: hs.color }]}>{c.hotness}</Text></View>}
                </View>
                <View style={cr.statsRow}>
                  {c.inspections > 0 && <><Feather name="home" size={13} color={TEXT3} /><Text style={cr.stat}>{c.inspections}</Text></>}
                  {c.notes > 0 && <><Feather name="edit-2" size={13} color={TEXT3} /><Text style={cr.stat}>{c.notes}</Text></>}
                  {c.reports > 0 && <><Feather name="clipboard" size={13} color={TEXT3} /><Text style={cr.stat}>{c.reports}</Text></>}
                </View>
              </View>
              <TouchableOpacity
                style={cr.more}
                onPress={() => setMenuContact({ name: c.name, phone: c.phone, email: c.email })}
              >
                <Feather name="more-vertical" size={18} color={TEXT3} />
              </TouchableOpacity>
            </View>
          )
        }}
        ListEmptyComponent={
          <View style={empty.wrap}>
            <Feather name="activity" size={32} color={TEXT3} />
            <Text style={empty.txt}>No activity today.</Text>
          </View>
        }
      />
      <ContactMenuSheet
        contact={menuContact}
        visible={!!menuContact}
        onClose={() => setMenuContact(null)}
      />
    </>
  )
}

// ── Notes Tab ─────────────────────────────────────────────────────────────────
function NotesTab() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
      {MOCK_CALL_LOGS.map(log => {
        const ri = callResultIcon(log.result)
        return (
          <View key={log.id} style={nc.card}>
            <View style={nc.header}>
              <View style={[nc.iconWrap, { backgroundColor: ri.color + '18' }]}>
                <Feather name={ri.icon as any} size={20} color={ri.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={nc.title}>{log.result}</Text>
                <Text style={nc.sub}>Phone Call · {log.direction}</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert(log.result, log.note || 'No additional notes.', [{ text: 'Edit', style: 'default' }, { text: 'Delete', style: 'destructive' }, { text: 'Cancel', style: 'cancel' }])}>
                <Feather name="more-vertical" size={18} color={TEXT3} />
              </TouchableOpacity>
            </View>
            {log.note ? <Text style={nc.note}>{log.note}</Text> : null}
            <View style={nc.footer}>
              <Text style={nc.meta}>{log.date} by </Text>
              <Text style={nc.agent}>Jye San Jurjo</Text>
            </View>
            <View style={nc.contactRow}>
              <Ionicons name="person" size={14} color={BLUE} />
              <Text style={nc.contactName}>{log.contact}</Text>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}

// ── Add Attendee Sheet ────────────────────────────────────────────────────────
function AddAttendeeSheet({
  visible, ofiDate, propertyId, onClose, onCountUpdate,
}: {
  visible: boolean; ofiDate: string; propertyId: string
  onClose: () => void; onCountUpdate: (n: number) => void
}) {
  const insets = useSafeAreaInsets()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [count, setCount]         = useState(0)
  const [flash, setFlash]         = useState(false)
  const [saving, setSaving]       = useState(false)
  const lastRef  = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const firstRef = useRef<TextInput>(null)

  const canAdd = firstName.trim().length > 0 && lastName.trim().length > 0 && email.trim().length > 0

  const handleAdd = async () => {
    if (!canAdd || saving) return
    setSaving(true)
    const fullName = `${firstName.trim()} ${lastName.trim()}`
    const now = new Date()
    const partial = { name: fullName, email: email.trim(), contactType: 'Buyer' as const, preApproved: 'No' as const }
    const prop = PROPERTIES.find(p => p.id === propertyId)!
    const attendee: Attendee = {
      id: `${Date.now()}`,
      name: fullName, phone: '', email: email.trim(),
      contactType: prop.listingType === 'For Lease' ? 'Tenant' : 'Buyer',
      budget: '', preApproved: 'No', livingSuburb: '', hearAbout: '', comments: '',
      score: calcScore(partial, prop),
      tags: buildTags(partial, prop),
      signedInAt: now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      propertyId,
    }
    const sessions = await getSessions()
    let session = sessions.find(s => s.property.id === propertyId && s.date === ofiDate)
    if (!session) session = { ...newSession(prop), date: ofiDate }
    session.attendees.push(attendee)
    await saveSession(session)
    const newCount = count + 1
    setCount(newCount)
    onCountUpdate(newCount)
    setFirstName(''); setLastName(''); setEmail('')
    setSaving(false)
    setFlash(true)
    setTimeout(() => { setFlash(false); firstRef.current?.focus() }, 800)
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  const handleClose = () => { setCount(0); setFirstName(''); setLastName(''); setEmail(''); onClose() }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={ms.backdrop} onPress={handleClose}>
          <Pressable style={[aas.sheet, { paddingBottom: insets.bottom + 12 }]} onPress={e => e.stopPropagation()}>
            <View style={ms.handle} />

            {/* Header */}
            <View style={aas.header}>
              <View>
                <Text style={aas.title}>Add Attendee</Text>
                <Text style={aas.subtitle}>{ofiDate}</Text>
              </View>
              <View style={[aas.countBadge, flash && aas.countBadgeFlash]}>
                <Feather name="users" size={13} color={flash ? GREEN : BLUE} />
                <Text style={[aas.countTxt, flash && aas.countTxtFlash]}>{count} added</Text>
              </View>
            </View>

            {/* Fields */}
            <View style={aas.fields}>
              <TextInput
                ref={firstRef}
                style={aas.input}
                placeholder="First name"
                placeholderTextColor={TEXT3}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastRef.current?.focus()}
                blurOnSubmit={false}
                autoFocus
              />
              <TextInput
                ref={lastRef}
                style={aas.input}
                placeholder="Last name"
                placeholderTextColor={TEXT3}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                ref={emailRef}
                style={aas.input}
                placeholder="Email address"
                placeholderTextColor={TEXT3}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleAdd}
              />
            </View>

            <TouchableOpacity
              style={[aas.addBtn, (!canAdd || saving) && aas.addBtnOff]}
              onPress={handleAdd}
              disabled={!canAdd || saving}
              activeOpacity={0.85}
            >
              <Feather name="user-plus" size={17} color="#fff" />
              <Text style={aas.addBtnTxt}>{saving ? 'Saving…' : 'Add Attendee'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={aas.doneBtn} onPress={handleClose} activeOpacity={0.7}>
              <Text style={aas.doneBtnTxt}>Done{count > 0 ? ` (${count} registered)` : ''}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  )
}

// ── OFI Action Sheet ──────────────────────────────────────────────────────────
function OFIActionSheet({
  visible, ofiSession, onClose, onAddAttendee, onAddNote,
}: {
  visible: boolean; ofiSession: OFISession | null
  onClose: () => void; onAddAttendee: () => void; onAddNote: () => void
}) {
  const insets = useSafeAreaInsets()
  if (!ofiSession) return null
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={ms.backdrop} onPress={onClose}>
        <Pressable style={[ms.sheet, { paddingBottom: insets.bottom + 8 }]} onPress={e => e.stopPropagation()}>
          <View style={ms.handle} />
          <View style={aas.actionHeader}>
            <Text style={aas.actionDate}>{ofiSession.date}</Text>
            <Text style={aas.actionTime}>{ofiSession.timeRange}</Text>
          </View>
          <View style={ms.divider} />
          {[
            { icon: 'user-plus', label: 'Add Attendee',   color: BLUE,  fn: () => { onClose(); onAddAttendee() } },
            { icon: 'edit-2',    label: 'Add Note',        color: AMBER, fn: () => { onClose(); onAddNote()     } },
          ].map((a, i) => (
            <TouchableOpacity key={a.label} onPress={a.fn} style={[ms.action, i > 0 && ms.actionBorder]} activeOpacity={0.65}>
              <View style={[ms.actionIcon, { backgroundColor: a.color + '15' }]}>
                <Feather name={a.icon as any} size={19} color={a.color} />
              </View>
              <Text style={ms.actionLabel}>{a.label}</Text>
              <Feather name="chevron-right" size={18} color={TEXT3} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={ms.cancelBtn}>
            <Text style={ms.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

// ── OFI Tab ───────────────────────────────────────────────────────────────────
function OFITab({ prop, sessions: propSessions }: { prop: Property; sessions: Session[] }) {
  const [actionTarget, setActionTarget] = useState<OFISession | null>(null)
  const [showAction, setShowAction]     = useState(false)
  const [showAddAtt, setShowAddAtt]     = useState(false)
  const [ofiCounts, setOfiCounts]       = useState<Record<string, number>>({})

  const realSessions: OFISession[] = propSessions
    .filter(s => s.property.id === prop.id)
    .map(s => ({
      id: s.id, date: s.date, timeRange: `${s.startTime} – ongoing`,
      attendees: s.attendees.length, notes: 0, reports: 0, isPast: true,
    }))

  const all = [...MOCK_OFI_SESSIONS, ...realSessions]
  const upcoming = all.filter(o => !o.isPast)
  const past = all.filter(o => o.isPast)

  const openMenu = (item: OFISession) => { setActionTarget(item); setShowAction(true) }

  const OFIRow = ({ item }: { item: OFISession }) => {
    const extra = ofiCounts[item.id] ?? 0
    const total = item.attendees + extra
    return (
      <View style={or.row}>
        <View style={{ flex: 1 }}>
          <Text style={or.date}>{item.date}</Text>
          <Text style={or.time}>{item.timeRange}</Text>
        </View>
        <View style={or.stats}>
          {total > 0 && (
            <View style={or.attBadge}>
              <Feather name="users" size={12} color={BLUE} />
              <Text style={or.attTxt}>{total}</Text>
            </View>
          )}
          {item.notes > 0 && <><Feather name="edit-2" size={14} color={TEXT3} /><Text style={or.stat}>{item.notes}</Text></>}
        </View>
        <TouchableOpacity style={or.more} onPress={() => openMenu(item)}>
          <Feather name="more-vertical" size={18} color={TEXT3} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/sign-in/[id]', params: { id: prop.id } })}
        style={or.startBtn}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={16} color={BLUE} />
        <Text style={or.startBtnTxt}>Start New Sign-In</Text>
      </TouchableOpacity>

      {upcoming.length > 0 && (
        <>
          <View style={grp.centreHeader}><Text style={grp.centreTitle}>Upcoming Inspections</Text></View>
          {upcoming.map((item, i) => (
            <View key={item.id}>
              <OFIRow item={item} />
              {i < upcoming.length - 1 && <View style={sep.line} />}
            </View>
          ))}
        </>
      )}

      <View style={grp.centreHeader}>
        <Text style={grp.centreTitle}>Past Inspections ({past.length})</Text>
      </View>
      {past.map((item, i) => (
        <View key={item.id}>
          <OFIRow item={item} />
          {i < past.length - 1 && <View style={sep.line} />}
        </View>
      ))}

      <OFIActionSheet
        visible={showAction}
        ofiSession={actionTarget}
        onClose={() => setShowAction(false)}
        onAddAttendee={() => setShowAddAtt(true)}
        onAddNote={() => Alert.alert('Add Note', 'Note added to this inspection.', [{ text: 'OK' }])}
      />
      <AddAttendeeSheet
        visible={showAddAtt}
        ofiDate={actionTarget?.date ?? ''}
        propertyId={prop.id}
        onClose={() => setShowAddAtt(false)}
        onCountUpdate={n => setOfiCounts(prev => ({ ...prev, [actionTarget?.id ?? '']: n }))}
      />
    </ScrollView>
  )
}

// ── Tasks Tab ─────────────────────────────────────────────────────────────────
function TasksTab() {
  const [tasks, setTasks] = useState(MOCK_TASKS)
  const toggle = (id: string) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const priorityColor = (p: string) => p === 'High' ? RED : p === 'Medium' ? AMBER : TEXT3

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={bm.header}>
        <Text style={bm.headerTxt}>{tasks.filter(t => !t.done).length} open tasks</Text>
      </View>
      {tasks.map((t, i) => (
        <TouchableOpacity key={t.id} onPress={() => toggle(t.id)} style={[cr.row, i < tasks.length - 1 && cr.rowBorder]} activeOpacity={0.7}>
          <View style={[tk.check, t.done && tk.checkDone]}>
            {t.done && <Feather name="check" size={11} color="#fff" />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[tk.title, t.done && tk.titleDone]}>{t.title}</Text>
            <Text style={tk.due}>Due: {t.due}</Text>
          </View>
          <View style={[tk.chip, { backgroundColor: priorityColor(t.priority) + '18' }]}>
            <Text style={[tk.chipTxt, { color: priorityColor(t.priority) }]}>{t.priority}</Text>
          </View>
          <TouchableOpacity style={cr.more}><Feather name="more-vertical" size={18} color={TEXT3} /></TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

// ── Appointments Tab ──────────────────────────────────────────────────────────
function AppointmentsTab() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
      {MOCK_APPTS.map(a => (
        <TouchableOpacity key={a.id} style={cd.wrap} activeOpacity={0.7}
          onPress={() => Alert.alert(a.title, `${a.day}, ${a.date} at ${a.time}`, [{ text: 'OK' }])}>
          <View style={ap.row}>
            <View style={ap.iconWrap}>
              <Feather name={a.icon as any} size={18} color={BLUE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={ap.title}>{a.title}</Text>
              <Text style={ap.sub}>{a.day}, {a.date}</Text>
              <Text style={ap.time}>{a.time}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={TEXT3} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

// ── Root Screen ───────────────────────────────────────────────────────────────
export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const prop = PROPERTIES.find(p => p.id === id)!
  const vendors = VENDORS.filter(v => v.propertyId === id)
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeTab, setActiveTab] = useState<TabId>('Details')
  const tabRef = useRef<ScrollView>(null)

  useEffect(() => { getSessions().then(setSessions) }, [])
  if (!prop) return null

  const isLease = prop.listingType === 'For Lease'

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Feather name="chevron-left" size={26} color={TEXT} />
        </TouchableOpacity>
        <View style={s.headerMid}>
          <Text style={s.headerTitle} numberOfLines={1}>{prop.address}</Text>
        </View>
        <TouchableOpacity style={s.iconBtn} onPress={() => Alert.alert('Edit Listing', `Edit ${prop.address}`, [{ text: 'Edit Price', onPress: () => {} }, { text: 'Edit Details', onPress: () => {} }, { text: 'Cancel', style: 'cancel' }])}>
          <Feather name="edit" size={20} color={BLUE} />
        </TouchableOpacity>
      </View>

      {/* Status strip */}
      <View style={s.strip}>
        <View style={[s.listingBadge, { backgroundColor: isLease ? GREEN : BLUE }]}>
          <Text style={s.listingBadgeTxt}>{prop.listingType}</Text>
        </View>
        <Text style={s.stripPrice}>{prop.price}</Text>
        <View style={s.stripDot} />
        <Text style={s.stripSpecs}>{prop.bedrooms}bd {prop.bathrooms}ba · {prop.type}</Text>
      </View>

      {/* Tab bar */}
      <View style={s.tabWrap}>
        <ScrollView ref={tabRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[s.tab, activeTab === tab && s.tabActive]} activeOpacity={0.7}>
              <Text style={[s.tabTxt, activeTab === tab && s.tabTxtActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={{ flex: 1, backgroundColor: activeTab === 'Activity' || activeTab === 'Buyer Match' || activeTab === 'Tasks' || activeTab === 'OFI' ? '#fff' : GRAY_BG }}>
        {activeTab === 'Details'       && <DetailsTab prop={prop} />}
        {activeTab === 'Contacts'      && <ContactsTab prop={prop} vendors={vendors} />}
        {activeTab === 'Buyer Match'   && <BuyerMatchTab prop={prop} sessions={sessions} />}
        {activeTab === 'Activity'      && <ActivityTab prop={prop} sessions={sessions} />}
        {activeTab === 'Notes'         && <NotesTab />}
        {activeTab === 'OFI'           && <OFITab prop={prop} sessions={sessions} />}
        {activeTab === 'Tasks'         && <TasksTab />}
        {activeTab === 'Appointments'  && <AppointmentsTab />}
      </View>
    </SafeAreaView>
  )
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 10 },
  iconBtn: { padding: 6, width: 44, alignItems: 'center' },
  headerMid: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT, letterSpacing: -0.3 },
  strip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  listingBadge: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  listingBadgeTxt: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.4 },
  stripPrice: { fontSize: 14, fontWeight: '700', color: TEXT },
  stripDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: TEXT3 },
  stripSpecs: { fontSize: 13, color: TEXT2 },
  tabWrap: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  tabBar: { paddingHorizontal: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 11 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: BLUE },
  tabTxt: { fontSize: 13, fontWeight: '600', color: TEXT3 },
  tabTxtActive: { color: BLUE },
})

const cd = StyleSheet.create({
  wrap: { backgroundColor: '#fff', borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e2e8f0', padding: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  label: { fontSize: 13, color: TEXT2 },
  val: { fontSize: 13, fontWeight: '600', color: TEXT, maxWidth: '55%', textAlign: 'right' },
})

const dt = StyleSheet.create({
  hero: { height: 150, borderRadius: 14, overflow: 'hidden', justifyContent: 'flex-end' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.35 },
  heroContent: { padding: 14, gap: 3 },
  badge: { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  badgeTxt: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.4 },
  heroPrice: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.4 },
  heroAddr: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  specsRow: { flexDirection: 'row', gap: 8 },
  specItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 10, padding: 11, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e2e8f0' },
  specTxt: { fontSize: 12, fontWeight: '600', color: TEXT },
  desc: { fontSize: 14, color: TEXT2, lineHeight: 22 },
})

const ct = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: BLUE + '18', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 15, fontWeight: '700', color: BLUE },
  name: { fontSize: 15, fontWeight: '700', color: TEXT },
  role: { fontSize: 12, color: TEXT3, marginTop: 2 },
  infoCol: { gap: 7, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoTxt: { fontSize: 13, color: TEXT2 },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#EEF2FF', borderRadius: 8, paddingVertical: 9 },
  actionLbl: { fontSize: 13, fontWeight: '600', color: BLUE },
})

// Contact row (shared by Activity + Buyer Match)
const cr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#fff' },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 13, fontWeight: '700', color: TEXT2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  name: { fontSize: 14, fontWeight: '700', color: TEXT },
  badge: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  badgeTxt: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  stat: { fontSize: 12, color: TEXT3, marginRight: 6 },
  callBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  more: { padding: 4, marginLeft: 2 },
})

const grp = StyleSheet.create({
  header: { backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingVertical: 9 },
  title: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  centreHeader: { backgroundColor: '#f1f5f9', paddingVertical: 10, alignItems: 'center' },
  centreTitle: { fontSize: 13, fontWeight: '600', color: TEXT2 },
})

const tog = StyleSheet.create({
  wrap: { flexDirection: 'row', margin: 14, backgroundColor: '#f1f5f9', borderRadius: 10, padding: 3 },
  btn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8 },
  btnActive: { backgroundColor: TEXT },
  txt: { fontSize: 13, fontWeight: '700', color: TEXT3, letterSpacing: 0.4 },
  txtActive: { color: '#fff' },
})

const bm = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  headerTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
})

const nc = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e2e8f0', padding: 14, marginHorizontal: 16, marginBottom: 0 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  iconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: TEXT },
  sub: { fontSize: 12, color: TEXT3, marginTop: 2 },
  note: { fontSize: 14, color: TEXT2, lineHeight: 20, marginBottom: 10 },
  footer: { flexDirection: 'row', marginBottom: 8 },
  meta: { fontSize: 12, color: TEXT3 },
  agent: { fontSize: 12, color: BLUE, fontWeight: '600' },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  contactName: { fontSize: 13, color: TEXT2, fontWeight: '500' },
})

const or = StyleSheet.create({
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9' },
  startBtnTxt: { fontSize: 14, fontWeight: '600', color: BLUE },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  date: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 2 },
  time: { fontSize: 13, color: TEXT3 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 4 },
  stat: { fontSize: 13, color: TEXT3, marginRight: 6 },
  more: { padding: 4 },
  attBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: BLUE + '12', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, marginRight: 4 },
  attTxt: { fontSize: 12, fontWeight: '700', color: BLUE },
})

const aas = StyleSheet.create({
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 10, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, paddingTop: 4 },
  title: { fontSize: 18, fontWeight: '800', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 13, color: TEXT3, marginTop: 2 },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: BLUE + '12', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  countBadgeFlash: { backgroundColor: GREEN + '18' },
  countTxt: { fontSize: 13, fontWeight: '700', color: BLUE },
  countTxtFlash: { color: GREEN },
  fields: { gap: 10, marginBottom: 16 },
  input: {
    backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.09)',
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: TEXT,
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: BLUE, borderRadius: 13, paddingVertical: 15, marginBottom: 10,
  },
  addBtnOff: { backgroundColor: '#cbd5e1' },
  addBtnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
  doneBtn: { borderRadius: 13, paddingVertical: 13, alignItems: 'center', backgroundColor: '#f1f5f9', marginBottom: 4 },
  doneBtnTxt: { fontSize: 15, fontWeight: '600', color: TEXT2 },
  actionHeader: { paddingBottom: 12, paddingTop: 4 },
  actionDate: { fontSize: 16, fontWeight: '700', color: TEXT },
  actionTime: { fontSize: 13, color: TEXT3, marginTop: 2 },
})

const sep = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: '#f1f5f9', marginLeft: 16 },
})

const tk = StyleSheet.create({
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: GREEN, borderColor: GREEN },
  title: { fontSize: 14, fontWeight: '600', color: TEXT, marginBottom: 2 },
  titleDone: { color: TEXT3, textDecorationLine: 'line-through' },
  due: { fontSize: 12, color: TEXT3 },
  chip: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4 },
  chipTxt: { fontSize: 11, fontWeight: '700' },
})

const ap = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 2 },
  sub: { fontSize: 12, color: TEXT2 },
  time: { fontSize: 12, color: TEXT3, marginTop: 2 },
})

const empty = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  txt: { fontSize: 15, fontWeight: '600', color: TEXT2 },
})

// ── Contact Menu Sheet styles ─────────────────────────────────────────────────
const ms = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingTop: 10, paddingHorizontal: 16 },
  handle: { width: 36, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },

  contactHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4, paddingBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 15, fontWeight: '700', color: TEXT2 },
  contactName: { fontSize: 16, fontWeight: '700', color: TEXT },
  contactPhone: { fontSize: 13, color: TEXT3, marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#e2e8f0', marginBottom: 4 },

  action: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  actionBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  actionIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: TEXT },

  cancelBtn: { marginTop: 8, marginBottom: 4, backgroundColor: '#f1f5f9', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelTxt: { fontSize: 15, fontWeight: '600', color: TEXT2 },

  noteWrap: { paddingVertical: 8, gap: 12 },
  noteLabel: { fontSize: 14, fontWeight: '600', color: TEXT },
  noteInput: {
    backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0',
    padding: 12, fontSize: 14, color: TEXT, minHeight: 100, textAlignVertical: 'top',
  },
  noteActions: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 8 },
  noteCancelBtn: { flex: 1, paddingVertical: 13, backgroundColor: '#f1f5f9', borderRadius: 12, alignItems: 'center' },
  noteCancelTxt: { fontSize: 14, fontWeight: '600', color: TEXT2 },
  noteSaveBtn: { flex: 2, paddingVertical: 13, backgroundColor: BLUE, borderRadius: 12, alignItems: 'center' },
  noteSaveTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
})
