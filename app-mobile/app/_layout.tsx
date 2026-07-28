import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="property/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in/[id]" options={{ headerShown: true, title: 'Sign In', headerBackTitle: 'Back', headerStyle: { backgroundColor: '#ffffff' }, headerTintColor: '#0f172a', headerTitleStyle: { fontWeight: '700' }, headerShadowVisible: false }} />
        <Stack.Screen name="confirmation" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="attendees" options={{ headerShown: true, title: "Today's Attendees", headerStyle: { backgroundColor: '#ffffff' }, headerTintColor: '#0f172a', headerTitleStyle: { fontWeight: '700' }, headerShadowVisible: false }} />
        <Stack.Screen name="more" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="quick/contact"    options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="quick/property"   options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="quick/task"       options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="quick/note"       options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="quick/enquiry"    options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="quick/appraisal"  options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="quick/inspection" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="appraisals"       options={{ headerShown: false }} />
        <Stack.Screen name="appraisal/[id]"   options={{ headerShown: false }} />
        <Stack.Screen name="schedule"          options={{ headerShown: false }} />
        <Stack.Screen name="tasks"             options={{ headerShown: false }} />
        <Stack.Screen name="contacts"          options={{ headerShown: false }} />
        <Stack.Screen name="pipeline"          options={{ headerShown: false }} />
        <Stack.Screen name="performance"       options={{ headerShown: false }} />
        <Stack.Screen name="profile"           options={{ headerShown: false }} />
        <Stack.Screen name="notifications"     options={{ headerShown: false }} />
        <Stack.Screen name="settings"          options={{ headerShown: false }} />
        <Stack.Screen name="help"              options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
