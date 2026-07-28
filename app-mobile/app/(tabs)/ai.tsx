import { useState, useRef, useCallback } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { HOT_LEADS, PROPERTIES } from '../../store/sessions'

const BLUE = '#3B6BF7'
const PURPLE = '#7C3AED'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'
const HOT_RED = '#ef4444'
const WARM_AMB = '#f59e0b'
const GREEN = '#10b981'

// ── Types ──────────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant'
type CardKind = 'lead' | 'property' | 'email' | 'tasks'

interface ChatCard { kind: CardKind; data: any }
interface Message { id: string; role: Role; text: string; cards?: ChatCard[]; timestamp: number }

// ── OFI-focused AI responses ──────────────────────────────────────────────────
function getAIResponse(input: string): { text: string; cards?: ChatCard[] } {
  const q = input.toLowerCase()

  // Greeting
  if (/\b(hello|hi|hey|g'?day|morning|afternoon)\b/.test(q)) {
    return {
      text: "G'day! Here's a quick snapshot:\n\n🏠 3 OFIs scheduled this Saturday\n🔥 2 HOT leads needing follow-up — Sarah Wilson is 3 days overdue\n📝 0 sign-ins captured today\n\nWhat would you like help with?",
    }
  }

  // Who to follow up / hot leads
  if (/\b(follow.?up|hot|lead|call|who|contact|ring|reach)\b/.test(q)) {
    const leads = HOT_LEADS.filter(l => l.hotness !== 'COOL').slice(0, 3)
    return {
      text: `${leads[0].name} is your top priority — HOT lead, inspected ${leads[0].propertyAddress} ${leads[0].inspections}× and hasn't been contacted in ${leads[0].daysSinceContact} days. I'd call her before the next OFI.\n\nMarcus Lee made a verbal offer at yesterday's OFI — follow up while he's still warm.`,
      cards: leads.map(l => ({ kind: 'lead' as CardKind, data: l })),
    }
  }

  // Today's / upcoming OFIs
  if (/\b(today|schedule|ofi|inspection|weekend|saturday|sunday|upcoming)\b/.test(q)) {
    const props = PROPERTIES.slice(0, 3)
    return {
      text: "This Saturday's open homes:\n\n🏠 42 Foreshore Cres, Cronulla — 10:00 AM\n🏠 14 Arcadia St, Bondi Beach — 10:30 AM\n🏠 42 Glenmore Rd, Paddington — 11:00 AM\n\nSarah Wilson is pre-registered for Foreshore. Have the contract guide ready — she's attended 3 times and is pre-approved.",
      cards: props.map(p => ({ kind: 'property' as CardKind, data: p })),
    }
  }

  // Draft email / follow-up
  if (/\b(email|draft|write|message|text|send)\b/.test(q)) {
    const lead = HOT_LEADS[0]
    return {
      text: `Here's a personalised follow-up for ${lead.name}:`,
      cards: [{
        kind: 'email' as CardKind,
        data: {
          to: lead.name,
          subject: `Your interest in ${lead.propertyAddress}`,
          body: `Hi ${lead.name.split(' ')[0]},\n\nI hope you're well. I just wanted to personally follow up after your visit${lead.inspections > 1 ? 's' : ''} to ${lead.propertyAddress} — it's been great showing you through.\n\nThere's been genuine interest from a few parties and I expect things to move soon. Given your pre-approval and the effort you've put into viewing, I'd love to have a quick chat about next steps.\n\nAre you free for a call tomorrow?\n\nKind regards,\nJye San Jurjo\nSpinelli Real Estate · 0412 345 678`,
        },
      }],
    }
  }

  // Sign-in / attendee info
  if (/\b(sign.?in|attendee|who attended|signed|register)\b/.test(q)) {
    return {
      text: "You can view all sign-ins for each property by tapping into a listing and going to the Activity tab.\n\nFrom the home screen, tapping 'Sign in' on any OFI card opens the sign-in form for visitors — they fill in their details and it's automatically scored and tagged.\n\nWould you like me to pull up a specific property's sign-ins?",
    }
  }

  // Prepare / prep OFI
  if (/\b(prep|prepare|bring|checklist|pack|ready)\b/.test(q)) {
    return {
      text: "OFI Checklist for Saturday:",
      cards: [{
        kind: 'tasks' as CardKind,
        data: [
          { icon: 'file-text', color: BLUE,   label: 'Print contract guides × 3',    sub: 'One per property' },
          { icon: 'tablet',    color: BLUE,    label: 'Open sign-in app',             sub: 'Test QR + manual entry' },
          { icon: 'users',     color: GREEN,   label: 'Check pre-registrations',      sub: 'Sarah Wilson confirmed at Foreshore' },
          { icon: 'map-pin',   color: WARM_AMB,label: 'Confirm property access',      sub: 'Keys + lockbox codes' },
          { icon: 'phone',     color: PURPLE,  label: 'Call vendor day before',       sub: 'Heads-up call — 10 mins' },
          { icon: 'camera',    color: HOT_RED, label: 'Directional signage ready',    sub: 'Put out 1hr before start' },
        ],
      }],
    }
  }

  // Score / buyer score
  if (/\b(score|rank|best|strongest|buyer|match|suit)\b/.test(q)) {
    const leads = HOT_LEADS.slice(0, 4)
    return {
      text: "AI scores are based on: pre-approval status, number of inspections, budget alignment, and engagement level.\n\nYour highest-scored buyers right now:",
      cards: leads.map(l => ({ kind: 'lead' as CardKind, data: l })),
    }
  }

  // What should I do
  if (/\b(task|todo|do today|action|priority|what should)\b/.test(q)) {
    return {
      text: "Your field priorities for today:",
      cards: [{
        kind: 'tasks' as CardKind,
        data: [
          { icon: 'phone',     color: HOT_RED,  label: 'Call Sarah Wilson',         sub: 'HOT · 3 days no contact · Foreshore Cres' },
          { icon: 'phone',     color: WARM_AMB, label: 'Follow up Marcus Lee',      sub: 'Verbal offer from OFI · 14 Arcadia St' },
          { icon: 'home',      color: BLUE,     label: 'Prep Saturday OFIs × 3',   sub: 'Cronulla · Bondi Beach · Paddington' },
          { icon: 'file-text', color: PURPLE,   label: 'Update OFI sign-in packs',  sub: 'Add new property brochures' },
        ],
      }],
    }
  }

  // Default
  return {
    text: "I can help you with field work:\n\n• **Follow-ups** — who to call after an OFI\n• **Schedule** — this week's open homes\n• **Draft emails** — personalised follow-ups\n• **OFI prep checklist** — what to bring\n• **Lead scores** — who's hottest right now\n• **Action list** — what to prioritise today\n\nWhat do you need?",
  }
}

// ── Typing dots ────────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <View style={mb.wrapAI}>
      <View style={mb.aiAvatar}><Ionicons name="sparkles" size={13} color="#fff" /></View>
      <View style={[mb.bubbleAI, { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 14 }]}>
        {[0.4, 0.6, 0.8].map((op, i) => (
          <View key={i} style={[td.dot, { opacity: op }]} />
        ))}
      </View>
    </View>
  )
}

// ── Inline cards ───────────────────────────────────────────────────────────────
function LeadCard({ d }: { d: any }) {
  const col = d.hotness === 'HOT' ? HOT_RED : d.hotness === 'WARM' ? WARM_AMB : TEXT3
  return (
    <TouchableOpacity style={ic.card} activeOpacity={0.8}
      onPress={() => Alert.alert(d.name, `${d.propertyAddress}\nBudget: ${d.budget}\n\n${d.notes}`)}>
      <View style={[ic.avatar, { backgroundColor: col }]}>
        <Text style={ic.avatarTxt}>{d.initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={ic.nameRow}>
          <Text style={ic.name}>{d.name}</Text>
          <View style={[ic.badge, { backgroundColor: col }]}>
            <Text style={ic.badgeTxt}>{d.hotness}</Text>
          </View>
        </View>
        <Text style={ic.sub} numberOfLines={1}>{d.propertyAddress} · {d.inspections} visits</Text>
        <View style={ic.scoreWrap}>
          <View style={ic.scoreTrack}>
            <View style={[ic.scoreFill, { width: `${d.score}%`, backgroundColor: col }]} />
          </View>
          <Text style={[ic.scoreTxt, { color: col }]}>{d.score}</Text>
        </View>
      </View>
      <TouchableOpacity style={ic.callBtn}
        onPress={() => Alert.alert('Call', `Calling ${d.name} on ${d.phone}`)}>
        <Feather name="phone" size={14} color={BLUE} />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

function PropCard({ d }: { d: any }) {
  const COLS: Record<string, string> = { '1': '#0ea5e9', '2': '#f59e0b', '3': '#10b981', '4': '#8b5cf6', '5': '#06b6d4', '6': '#ec4899' }
  return (
    <TouchableOpacity style={ic.card} activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: d.id } })}>
      <View style={[ic.propDot, { backgroundColor: COLS[d.id] ?? BLUE }]} />
      <View style={{ flex: 1 }}>
        <Text style={ic.name}>{d.address}</Text>
        <Text style={ic.sub}>{d.suburb} · {d.price}</Text>
      </View>
      <Feather name="chevron-right" size={16} color={TEXT3} />
    </TouchableOpacity>
  )
}

function EmailCard({ d }: { d: any }) {
  return (
    <View style={ic.emailCard}>
      <View style={ic.emailHeader}>
        <Feather name="mail" size={13} color={PURPLE} />
        <Text style={ic.emailTo}>To: {d.to} · {d.subject}</Text>
      </View>
      <Text style={ic.emailBody} numberOfLines={7}>{d.body}</Text>
      <View style={ic.emailBtns}>
        <TouchableOpacity style={ic.emailBtn} onPress={() => Alert.alert('Copied', 'Email copied.')}>
          <Feather name="copy" size={12} color={PURPLE} /><Text style={ic.emailBtnTxt}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[ic.emailBtn, ic.emailSend]}
          onPress={() => Alert.alert('Send', `Send to ${d.to}?`, [{ text: 'Send', onPress: () => Alert.alert('Sent!', '') }, { text: 'Cancel', style: 'cancel' }])}>
          <Feather name="send" size={12} color="#fff" /><Text style={[ic.emailBtnTxt, { color: '#fff' }]}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function TaskCard({ d }: { d: any[] }) {
  return (
    <View style={ic.taskCard}>
      {d.map((t, i) => (
        <TouchableOpacity key={i} style={[ic.taskRow, i < d.length - 1 && ic.taskBorder]}
          activeOpacity={0.7} onPress={() => Alert.alert(t.label, t.sub)}>
          <View style={[ic.taskIcon, { backgroundColor: t.color + '18' }]}>
            <Feather name={t.icon} size={14} color={t.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ic.taskLabel}>{t.label}</Text>
            <Text style={ic.taskSub} numberOfLines={1}>{t.sub}</Text>
          </View>
          <Feather name="chevron-right" size={15} color={TEXT3} />
        </TouchableOpacity>
      ))}
    </View>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === 'assistant'
  return (
    <View style={[mb.wrap, isAI ? mb.wrapAI : mb.wrapUser]}>
      {isAI && <View style={mb.aiAvatar}><Ionicons name="sparkles" size={13} color="#fff" /></View>}
      <View style={[mb.bubble, isAI ? mb.bubbleAI : mb.bubbleUser]}>
        <Text style={[mb.text, isAI ? mb.textAI : mb.textUser]}>{msg.text}</Text>
        {msg.cards?.map((card, i) => (
          <View key={i} style={{ marginTop: 8 }}>
            {card.kind === 'lead'     && <LeadCard d={card.data} />}
            {card.kind === 'property' && <PropCard d={card.data} />}
            {card.kind === 'email'    && <EmailCard d={card.data} />}
            {card.kind === 'tasks'    && <TaskCard d={card.data} />}
          </View>
        ))}
      </View>
    </View>
  )
}

const SUGGESTIONS = [
  { label: "Who should I follow up?",   icon: 'phone' },
  { label: "This week's OFIs",          icon: 'home' },
  { label: "Draft a follow-up email",   icon: 'mail' },
  { label: "OFI prep checklist",        icon: 'check-square' },
  { label: "Hottest leads right now",   icon: 'zap' },
  { label: "What should I do today?",   icon: 'list' },
]

export default function AIScreen() {
  const insets = useSafeAreaInsets()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  const send = useCallback((text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const res = getAIResponse(text)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        text: res.text, cards: res.cards, timestamp: Date.now(),
      }])
      setTyping(false)
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80)
    }, 900 + Math.random() * 700)
  }, [])

  const empty = messages.length === 0

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon}><Ionicons name="sparkles" size={16} color="#fff" /></View>
          <View>
            <Text style={s.headerTitle}>AI Assistant</Text>
            <Text style={s.headerSub}>Field companion · Powered by Claude</Text>
          </View>
        </View>
        {!empty && (
          <TouchableOpacity onPress={() => setMessages([])} style={s.clearBtn}>
            <Text style={s.clearTxt}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          style={s.scroll}
          contentContainerStyle={[s.scrollContent, empty && s.scrollEmpty]}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => !empty && scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {empty ? (
            <View style={s.emptyWrap}>
              <View style={s.emptyIcon}>
                <Ionicons name="sparkles" size={34} color={PURPLE} />
              </View>
              <Text style={s.emptyTitle}>Your OFI Field Assistant</Text>
              <Text style={s.emptySub}>Get follow-up help, lead scores, draft emails, and OFI checklists — all from your phone in the field.</Text>
              <View style={s.chips}>
                {SUGGESTIONS.map(sug => (
                  <TouchableOpacity key={sug.label} style={s.chip} activeOpacity={0.7} onPress={() => send(sug.label)}>
                    <Feather name={sug.icon as any} size={13} color={PURPLE} />
                    <Text style={s.chipTxt}>{sug.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              {typing && <TypingDots />}
            </>
          )}
        </ScrollView>

        <View style={[s.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <View style={s.inputRow}>
            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your OFIs, leads, or follow-ups…"
              placeholderTextColor={TEXT3}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => send(input)}
            />
            <TouchableOpacity
              style={[s.sendBtn, !input.trim() && s.sendOff]}
              onPress={() => send(input)}
              disabled={!input.trim()}
              activeOpacity={0.8}
            >
              <Feather name="send" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13,
    backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '700', color: TEXT },
  headerSub: { fontSize: 11, color: TEXT3, marginTop: 1 },
  clearBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  clearTxt: { fontSize: 13, fontWeight: '600', color: TEXT3 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 16 },
  scrollEmpty: { flex: 1, justifyContent: 'center' },
  emptyWrap: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24 },
  emptyIcon: { width: 76, height: 76, borderRadius: 22, backgroundColor: PURPLE + '12', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: TEXT, textAlign: 'center', marginBottom: 8 },
  emptySub: { fontSize: 14, color: TEXT2, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1.5, borderColor: PURPLE + '28', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 8 },
  chipTxt: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  inputBar: { backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e2e8f0', paddingHorizontal: 12, paddingTop: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, backgroundColor: '#f1f5f9', borderRadius: 22, paddingLeft: 16, paddingRight: 6, paddingVertical: 6 },
  input: { flex: 1, fontSize: 15, color: TEXT, maxHeight: 88, paddingTop: 4, paddingBottom: 4 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center' },
  sendOff: { backgroundColor: TEXT3 },
})

const mb = StyleSheet.create({
  wrap: { marginBottom: 14 },
  wrapAI: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  wrapUser: { alignItems: 'flex-end' },
  aiAvatar: { width: 28, height: 28, borderRadius: 8, backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  bubble: { maxWidth: '88%', borderRadius: 16, padding: 12 },
  bubbleAI: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: PURPLE, borderBottomRightRadius: 4 },
  text: { fontSize: 14, lineHeight: 21 },
  textAI: { color: TEXT },
  textUser: { color: '#fff' },
})

const td = StyleSheet.create({
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: TEXT3 },
})

const ic = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 10, marginTop: 4 },
  avatar: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 12, fontWeight: '800', color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontSize: 13, fontWeight: '700', color: TEXT },
  badge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5 },
  badgeTxt: { fontSize: 9, fontWeight: '800', color: '#fff' },
  sub: { fontSize: 11, color: TEXT2, marginBottom: 5 },
  scoreWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  scoreTrack: { width: 44, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 2 },
  scoreTxt: { fontSize: 12, fontWeight: '700' },
  callBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  propDot: { width: 10, height: 10, borderRadius: 5 },
  emailCard: { backgroundColor: '#faf5ff', borderRadius: 12, borderWidth: 1, borderColor: PURPLE + '28', padding: 12, marginTop: 4 },
  emailHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  emailTo: { fontSize: 11, color: PURPLE, fontWeight: '600', flex: 1 },
  emailBody: { fontSize: 12, color: TEXT2, lineHeight: 19, marginBottom: 10 },
  emailBtns: { flexDirection: 'row', gap: 8 },
  emailBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1.5, borderColor: PURPLE + '38' },
  emailSend: { backgroundColor: PURPLE, borderColor: PURPLE },
  emailBtnTxt: { fontSize: 12, fontWeight: '700', color: PURPLE },
  taskCard: { backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', marginTop: 4 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 },
  taskBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  taskIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  taskLabel: { fontSize: 13, fontWeight: '700', color: TEXT },
  taskSub: { fontSize: 11, color: TEXT2, marginTop: 1 },
})
