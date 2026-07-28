import { useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { Feather } from '@expo/vector-icons'
import {
  PROPERTIES, newSession, getSessions, saveSession,
  calcScore, buildTags, type Attendee,
} from '../../store/sessions'

const BLUE = '#3B6BF7'
const GREEN = '#10b981'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

const THUMB_COLORS: Record<string, string> = {
  '1': '#0ea5e9', '2': '#f59e0b', '3': '#10b981',
  '4': '#8b5cf6', '5': '#06b6d4', '6': '#ec4899',
}

export default function SignInScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const property = PROPERTIES.find(p => p.id === id)!

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [justSigned, setJustSigned] = useState(false)
  const [lastSignedName, setLastSignedName] = useState('')

  const lastRef  = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const scaleAnim = useRef(new Animated.Value(1)).current

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0 && email.trim().length > 0

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    const fullName = `${firstName.trim()} ${lastName.trim()}`
    const now = new Date()
    const partial = { name: fullName, email: email.trim(), contactType: 'Buyer' as const, preApproved: 'No' as const }
    const tags  = buildTags(partial, property)
    const score = calcScore(partial, property)

    const attendee: Attendee = {
      id: `${Date.now()}`,
      name: fullName,
      phone: '',
      email: email.trim(),
      contactType: property.listingType === 'For Lease' ? 'Tenant' : 'Buyer',
      budget: '',
      preApproved: 'No',
      livingSuburb: '',
      hearAbout: '',
      comments: '',
      score,
      tags,
      signedInAt: now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      propertyId: property.id,
    }

    const sessions = await getSessions()
    let session = sessions.find(s =>
      s.property.id === property.id &&
      s.date.includes(now.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }))
    )
    if (!session) session = newSession(property)
    session.attendees.push(attendee)
    await saveSession(session)

    // Flash success then reset for next person
    setLastSignedName(firstName.trim())
    setJustSigned(true)
    setFirstName('')
    setLastName('')
    setEmail('')
    setSubmitting(false)

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start()

    setTimeout(() => setJustSigned(false), 2800)
  }

  if (!property) return null

  const thumbColor = THUMB_COLORS[property.id] ?? BLUE

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.container}>

          {/* Property strip */}
          <View style={[s.propStrip, { backgroundColor: thumbColor }]}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Feather name="chevron-left" size={22} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
            <View style={s.propInfo}>
              <Text style={s.propAddr} numberOfLines={1}>{property.address}</Text>
              <Text style={s.propSub}>{property.suburb} · Open For Inspection</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/attendees')} style={s.attendeesBtn}>
              <Feather name="users" size={18} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>

          <View style={s.body}>
            <Text style={s.heading}>Sign In</Text>
            <Text style={s.sub}>Enter your details to register your attendance</Text>

            {/* Success flash */}
            {justSigned && (
              <Animated.View style={[s.successBanner, { transform: [{ scale: scaleAnim }] }]}>
                <View style={s.successIcon}>
                  <Feather name="check" size={16} color="#fff" />
                </View>
                <Text style={s.successTxt}>Thanks {lastSignedName}! Next person can sign in below.</Text>
              </Animated.View>
            )}

            {/* First name */}
            <View style={s.fieldWrap}>
              <Text style={s.label}>First Name</Text>
              <TextInput
                style={s.input}
                placeholder="e.g. Sarah"
                placeholderTextColor={TEXT3}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => lastRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Last name */}
            <View style={s.fieldWrap}>
              <Text style={s.label}>Last Name</Text>
              <TextInput
                ref={lastRef}
                style={s.input}
                placeholder="e.g. Johnson"
                placeholderTextColor={TEXT3}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Email */}
            <View style={s.fieldWrap}>
              <Text style={s.label}>Email</Text>
              <TextInput
                ref={emailRef}
                style={s.input}
                placeholder="e.g. sarah@email.com"
                placeholderTextColor={TEXT3}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            {/* Sign in button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit || submitting}
              activeOpacity={0.85}
              style={[s.btn, (!canSubmit || submitting) && s.btnOff]}
            >
              <Feather name="check" size={18} color="#fff" />
              <Text style={s.btnTxt}>{submitting ? 'Saving…' : 'Sign In'}</Text>
            </TouchableOpacity>

            <Text style={s.privacy}>Details are securely stored and only shared with the listing agent.</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },

  propStrip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 14, gap: 10,
  },
  backBtn: { width: 36, alignItems: 'flex-start' },
  propInfo: { flex: 1 },
  propAddr: { fontSize: 15, fontWeight: '700', color: '#fff' },
  propSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  attendeesBtn: { width: 36, alignItems: 'flex-end' },

  body: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },

  heading: { fontSize: 28, fontWeight: '800', color: TEXT, letterSpacing: -0.6, marginBottom: 4 },
  sub: { fontSize: 14, color: TEXT2, marginBottom: 28 },

  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: GREEN + '12', borderWidth: 1.5, borderColor: GREEN + '30',
    borderRadius: 12, padding: 12, marginBottom: 20,
  },
  successIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center',
  },
  successTxt: { flex: 1, fontSize: 13, fontWeight: '600', color: '#0f5132' },

  fieldWrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 8 },
  input: {
    backgroundColor: '#f8fafc', borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.09)',
    paddingHorizontal: 16, paddingVertical: 15,
    fontSize: 17, color: TEXT,
  },

  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: BLUE, borderRadius: 14, paddingVertical: 17, marginTop: 8,
    shadowColor: BLUE, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
  },
  btnOff: { backgroundColor: '#cbd5e1', shadowOpacity: 0 },
  btnTxt: { fontSize: 17, fontWeight: '700', color: '#fff' },
  privacy: { fontSize: 11, color: TEXT3, textAlign: 'center', marginTop: 16, lineHeight: 16 },
})
