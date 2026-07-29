import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

const BLUE  = '#3B6BF7'
const TEXT  = '#0f172a'
const TEXT2 = '#475569'
const TEXT3 = '#94a3b8'

export default function LoginScreen() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSignIn = async () => {
    if (!email.trim() || !password) { setError('Enter your email and password.'); return }
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (err) { setError(err.message); return }
    router.replace('/')
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) { Alert.alert('Enter your email address first.'); return }
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim())
    if (err) { Alert.alert('Error', err.message); return }
    Alert.alert('Password Reset', 'Check your email for reset instructions.')
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.container}>

          {/* Logo */}
          <View style={s.logo}>
            <View style={s.logoBox}>
              <Text style={s.logoText}>RP</Text>
            </View>
            <View>
              <Text style={s.appName}>Real Platform</Text>
              <Text style={s.appSub}>Open Home App</Text>
            </View>
          </View>

          <Text style={s.heading}>Welcome back</Text>
          <Text style={s.sub}>Sign in to your agent account</Text>

          {/* Email */}
          <View style={s.fieldWrap}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              placeholder="you@agency.com.au"
              placeholderTextColor={TEXT3}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={s.fieldWrap}>
            <Text style={s.label}>Password</Text>
            <View style={s.passWrap}>
              <TextInput
                style={[s.input, { flex: 1, borderWidth: 0, marginBottom: 0 }]}
                placeholder="••••••••"
                placeholderTextColor={TEXT3}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)} style={s.eyeBtn}>
                <Feather name={showPass ? 'eye-off' : 'eye'} size={18} color={TEXT3} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error */}
          {!!error && (
            <View style={s.errBox}>
              <Feather name="alert-circle" size={14} color="#dc2626" />
              <Text style={s.errTxt}>{error}</Text>
            </View>
          )}

          {/* Sign in */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.85}
            style={[s.btn, loading && s.btnOff]}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <><Feather name="log-in" size={18} color="#fff" /><Text style={s.btnTxt}>Sign In</Text></>
            }
          </TouchableOpacity>

          {/* Forgot password */}
          <TouchableOpacity onPress={handleForgotPassword} style={s.forgotBtn}>
            <Text style={s.forgotTxt}>Forgot password?</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 48, justifyContent: 'flex-start' },

  logo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
  logoBox: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  appName: { fontSize: 16, fontWeight: '800', color: TEXT, letterSpacing: -0.4 },
  appSub: { fontSize: 11, color: TEXT3, marginTop: 1 },

  heading: { fontSize: 28, fontWeight: '800', color: TEXT, letterSpacing: -0.6, marginBottom: 6 },
  sub: { fontSize: 15, color: TEXT2, marginBottom: 32 },

  fieldWrap: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 8 },
  input: {
    backgroundColor: '#f8fafc', borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.09)',
    paddingHorizontal: 16, paddingVertical: 15,
    fontSize: 17, color: TEXT, marginBottom: 0,
  },
  passWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8fafc', borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.09)',
    paddingHorizontal: 16,
  },
  eyeBtn: { padding: 4 },

  errBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca',
    borderRadius: 10, padding: 12, marginBottom: 16,
  },
  errTxt: { flex: 1, fontSize: 13, color: '#dc2626', fontWeight: '500' },

  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: BLUE, borderRadius: 14, paddingVertical: 17, marginTop: 8,
    shadowColor: BLUE, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
  },
  btnOff: { backgroundColor: '#cbd5e1', shadowOpacity: 0 },
  btnTxt: { fontSize: 17, fontWeight: '700', color: '#fff' },

  forgotBtn: { alignSelf: 'center', marginTop: 20, padding: 8 },
  forgotTxt: { fontSize: 14, color: TEXT3, fontWeight: '500' },
})
