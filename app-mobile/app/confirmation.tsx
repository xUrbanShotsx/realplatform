import { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'

const GREEN = '#10b981'
const BLUE = '#4361ee'
const TEXT = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? GREEN : score >= 50 ? BLUE : '#f59e0b'
  return (
    <View style={r.ringWrap}>
      <View style={[r.ring, { borderColor: color }]}>
        <Text style={[r.scoreNum, { color }]}>{score}</Text>
        <Text style={r.scoreLabel}>score</Text>
      </View>
    </View>
  )
}

export default function ConfirmationScreen() {
  const { name, score, tags, propertyId, sessionId } = useLocalSearchParams<{
    name: string; score: string; tags: string; propertyId: string; sessionId: string
  }>()

  const scoreNum = parseInt(score ?? '0')
  const tagList = tags ? tags.split(',').filter(Boolean) : []

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scaleAnim = useRef(new Animated.Value(0.7)).current

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 14 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 150 }),
    ]).start()
  }, [])

  return (
    <LinearGradient colors={['#f0fdf4', '#f8fafc', '#eff6ff']} style={s.container}>
      <ScrollView contentContainerStyle={s.inner} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Check mark */}
          <Animated.View style={[s.checkWrap, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient colors={[GREEN, '#059669']} style={s.checkCircle}>
              <Text style={s.checkMark}>✓</Text>
            </LinearGradient>
          </Animated.View>

          <Text style={s.title}>Signed In!</Text>
          <Text style={s.name}>{name}</Text>
          <Text style={s.sub}>Successfully registered for today's open home.</Text>

          {/* Score */}
          <ScoreRing score={scoreNum} />
          <Text style={s.scoreCaption}>
            {scoreNum >= 75 ? 'Hot lead — pre-approval confirmed and strong budget match.' :
             scoreNum >= 50 ? 'Warm lead — good buyer profile for this property.' :
             'Browsing — early stage, worth following up.'}
          </Text>

          {/* Tags */}
          {tagList.length > 0 && (
            <View style={s.tagsSection}>
              <Text style={s.tagsTitle}>Auto-tagged</Text>
              <View style={s.tagsRow}>
                {tagList.map(tag => (
                  <View key={tag} style={s.tag}>
                    <Text style={s.tagTxt}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Actions */}
          <TouchableOpacity
            onPress={() => router.replace({ pathname: '/sign-in/[id]', params: { id: propertyId } })}
            style={s.primaryBtn}
            activeOpacity={0.85}
          >
            <Text style={s.primaryBtnTxt}>Next Visitor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/attendees', params: { sessionId } })}
            style={s.secondaryBtn}
            activeOpacity={0.8}
          >
            <Text style={s.secondaryBtnTxt}>View All Attendees</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/')} style={s.ghostBtn} activeOpacity={0.7}>
            <Text style={s.ghostBtnTxt}>Back to Properties</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, paddingBottom: 48 },
  checkWrap: { marginBottom: 20 },
  checkCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', shadowColor: GREEN, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 8 }, shadowRadius: 20 },
  checkMark: { fontSize: 38, color: '#fff', fontWeight: '800' },
  title: { fontSize: 32, fontWeight: '800', color: '#0f172a', letterSpacing: -0.8, marginBottom: 6 },
  name: { fontSize: 20, fontWeight: '700', color: '#4361ee', marginBottom: 8 },
  sub: { fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  scoreCaption: { fontSize: 13, color: '#475569', textAlign: 'center', marginTop: 10, marginBottom: 24, paddingHorizontal: 12, lineHeight: 18 },
  tagsSection: { width: '100%', marginBottom: 28 },
  tagsTitle: { fontSize: 12, fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, textAlign: 'center' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, justifyContent: 'center' },
  tag: { backgroundColor: '#eff6ff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(67,97,238,0.15)' },
  tagTxt: { fontSize: 12, color: '#4361ee', fontWeight: '600' },
  primaryBtn: { backgroundColor: '#4361ee', borderRadius: 14, paddingVertical: 15, paddingHorizontal: 40, width: '100%', alignItems: 'center', marginBottom: 12, shadowColor: '#4361ee', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12 },
  primaryBtnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryBtn: { backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40, width: '100%', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' },
  secondaryBtnTxt: { fontSize: 15, fontWeight: '600', color: '#10b981' },
  ghostBtn: { paddingVertical: 10 },
  ghostBtnTxt: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
})

const r = StyleSheet.create({
  ringWrap: { alignItems: 'center', marginBottom: 4 },
  ring: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 30, fontWeight: '800', letterSpacing: -1 },
  scoreLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginTop: -2 },
})
