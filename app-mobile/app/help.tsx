import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const BLUE  = '#3B6BF7'
const GREEN = '#10b981'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

type FAQ = { q: string; a: string }

const FAQS: FAQ[] = [
  { q: 'How do I register attendees at an OFI?',           a: 'Go to the property, tap the OFI tab, then tap the 3-dot (⋯) next to the inspection. Choose "Add Attendee" to open the rapid sign-in form. It stays open after each entry so you can add multiple people quickly.' },
  { q: 'How do I start a new sign-in session?',           a: 'In the OFI tab of a property, tap "Start New Sign-In". This opens the sign-in screen where attendees can enter their own details. The form resets after each submission.' },
  { q: 'What is a lead score?',                           a: 'Lead scores (0–100) are calculated from pre-approval status, budget match, contact type, and notes. HOT = 80+, WARM = 60–79, COOL = below 60.' },
  { q: 'How do I schedule an appraisal?',                 a: 'Tap the + button at the bottom, choose "Appraisal", fill in the property details and select Sale, Rental, or Both. You can start the appraisal immediately or schedule for later.' },
  { q: 'How does the AI assistant work?',                 a: 'Tap the AI tab (sparkle icon). The assistant knows your OFI schedule, hot leads, and upcoming tasks. Ask it to draft follow-up emails, prep checklists, or get a summary of your day.' },
  { q: 'Can I call or email a lead directly from the app?', a: 'Yes. On the Hot Leads strip on the home screen, or in All Contacts, tap the phone or email icon on any contact to dial or compose directly.' },
  { q: 'How do I view all attendees for a past OFI?',     a: 'Open the property, go to the OFI tab, and tap any past inspection row to see the attendee list with scores and tags.' },
  { q: 'How is pipeline data updated?',                   a: 'The pipeline reflects deal stages based on offer activity. As deals progress (Viewing → Negotiating → Under Offer → Settled), they move through the stages automatically.' },
]

export default function HelpScreen() {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Contact cards */}
        <View style={s.contactRow}>
          <TouchableOpacity
            style={s.contactCard}
            onPress={() => Linking.openURL('mailto:help@openHome.com.au')}
            activeOpacity={0.75}
          >
            <View style={[s.contactIcon, { backgroundColor: BLUE + '15' }]}>
              <Feather name="mail" size={20} color={BLUE} />
            </View>
            <Text style={s.contactLabel}>Email Support</Text>
            <Text style={s.contactSub}>help@openhome.com.au</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.contactCard}
            onPress={() => Linking.openURL('tel:1800123456')}
            activeOpacity={0.75}
          >
            <View style={[s.contactIcon, { backgroundColor: GREEN + '15' }]}>
              <Feather name="phone" size={20} color={GREEN} />
            </View>
            <Text style={s.contactLabel}>Call Support</Text>
            <Text style={s.contactSub}>1800 123 456</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <Text style={s.sectionLabel}>Frequently Asked Questions</Text>
        <View style={s.card}>
          {FAQS.map((faq, i) => (
            <View key={i} style={i > 0 ? s.faqBorder : undefined}>
              <TouchableOpacity
                style={s.faqQ}
                onPress={() => setExpanded(expanded === i ? null : i)}
                activeOpacity={0.7}
              >
                <Text style={s.qTxt}>{faq.q}</Text>
                <Feather
                  name={expanded === i ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={TEXT3}
                />
              </TouchableOpacity>
              {expanded === i && (
                <View style={s.faqA}>
                  <Text style={s.aTxt}>{faq.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <Text style={s.version}>Open Home · v1.0.0 · Made for Australian real estate agents</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },
  contactRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 16 },
  contactCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', gap: 6 },
  contactIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  contactLabel: { fontSize: 13, fontWeight: '700', color: TEXT },
  contactSub: { fontSize: 11, color: TEXT3, textAlign: 'center' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 20, marginBottom: 8, paddingHorizontal: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginHorizontal: 16 },
  faqBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  faqQ: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 14, gap: 10 },
  qTxt: { flex: 1, fontSize: 14, fontWeight: '600', color: TEXT },
  faqA: { paddingHorizontal: 14, paddingBottom: 14 },
  aTxt: { fontSize: 13, color: TEXT2, lineHeight: 20 },
  version: { textAlign: 'center', fontSize: 11, color: TEXT3, marginTop: 32 },
})
