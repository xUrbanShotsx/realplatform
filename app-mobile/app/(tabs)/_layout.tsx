import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native'
import { Tabs, router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons, Feather } from '@expo/vector-icons'

const BLUE = '#3B6BF7'
const PURPLE = '#7C3AED'
const TEXT = '#0f172a'
const TEXT3 = '#94a3b8'

const QUICK_ACTIONS = [
  { label: 'OFI',        icon: 'home-outline',             route: '/'                  },
  { label: 'Property',   icon: 'business-outline',         route: '/quick/property'    },
  { label: 'Contact',    icon: 'person-outline',           route: '/quick/contact'     },
  { label: 'Enquiry',    icon: 'chatbubble-outline',       route: '/quick/enquiry'     },
  { label: 'Appraisal',  icon: 'pricetag-outline',         route: '/quick/appraisal'   },
  { label: 'Task',       icon: 'checkmark-circle-outline', route: '/quick/task'        },
  { label: 'Note',       icon: 'document-text-outline',    route: '/quick/note'        },
  { label: 'Inspection', icon: 'search-outline',           route: '/quick/inspection'  },
]

function CustomTabBar({ state, navigation }: any) {
  const [showQuick, setShowQuick] = useState(false)
  const insets = useSafeAreaInsets()

  // Map route names to tab config
  const tabs = [
    { name: 'index', icon: 'home',     label: 'Home'   },
    { name: 'search', icon: 'search',  label: 'Search' },
    { name: 'ai',    icon: null,       label: 'AI'     }, // rendered separately
  ]

  const getTabIndex = (name: string) => state.routes.findIndex((r: any) => r.name === name)
  const activeIndex = state.index

  return (
    <>
      <View style={[bar.wrap, { paddingBottom: insets.bottom || 16 }]}>

        {/* Home */}
        {(['index', 'search'] as const).map((name, i) => {
          const icons = ['home', 'search']
          const focused = state.routes[activeIndex]?.name === name
          return (
            <TouchableOpacity
              key={name}
              onPress={() => {
                const idx = getTabIndex(name)
                const event = navigation.emit({ type: 'tabPress', target: state.routes[idx]?.key, canPreventDefault: true })
                if (!focused && !event.defaultPrevented) navigation.navigate(name)
              }}
              style={bar.tab}
              activeOpacity={0.7}
            >
              <Feather name={icons[i] as any} size={22} color={focused ? BLUE : TEXT3} />
            </TouchableOpacity>
          )
        })}

        {/* Plus */}
        <TouchableOpacity onPress={() => setShowQuick(true)} style={bar.tab} activeOpacity={0.7}>
          <View style={bar.plusCircle}>
            <Feather name="plus" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* AI */}
        <TouchableOpacity
          style={bar.tab}
          activeOpacity={0.7}
          onPress={() => {
            const idx = getTabIndex('ai')
            const focused = state.routes[activeIndex]?.name === 'ai'
            if (idx >= 0) {
              const event = navigation.emit({ type: 'tabPress', target: state.routes[idx]?.key, canPreventDefault: true })
              if (!focused && !event.defaultPrevented) navigation.navigate('ai')
            }
          }}
        >
          <View style={[bar.aiCircle, state.routes[activeIndex]?.name === 'ai' && bar.aiCircleActive]}>
            <Ionicons name="sparkles" size={16} color={state.routes[activeIndex]?.name === 'ai' ? '#fff' : PURPLE} />
          </View>
        </TouchableOpacity>

        {/* More */}
        <TouchableOpacity style={bar.tab} activeOpacity={0.7} onPress={() => router.push('/more')}>
          <Feather name="more-horizontal" size={22} color={TEXT3} />
        </TouchableOpacity>
      </View>

      <Modal visible={showQuick} transparent animationType="slide" onRequestClose={() => setShowQuick(false)}>
        <Pressable style={m.backdrop} onPress={() => setShowQuick(false)}>
          <Pressable style={[m.sheet, { paddingBottom: insets.bottom + 16 }]} onPress={e => e.stopPropagation()}>
            <View style={m.handle} />
            <Text style={m.title}>Add New</Text>
            <View style={m.grid}>
              {QUICK_ACTIONS.map(a => (
                <TouchableOpacity
                  key={a.label}
                  style={m.item}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowQuick(false)
                    router.push(a.route as any)
                  }}
                >
                  <View style={m.iconWrap}>
                    <Ionicons name={a.icon as any} size={22} color={BLUE} />
                  </View>
                  <Text style={m.itemLabel}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

export default function TabLayout() {
  return (
    <Tabs tabBar={props => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="ai" />
    </Tabs>
  )
}

const bar = StyleSheet.create({
  wrap: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#e2e8f0',
    paddingTop: 10, paddingHorizontal: 8, alignItems: 'center',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  plusCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center',
  },
  aiCircle: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: PURPLE + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  aiCircleActive: { backgroundColor: PURPLE },
})

const m = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 12, paddingHorizontal: 24 },
  handle: { width: 36, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 17, fontWeight: '700', color: TEXT, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { width: '25%', alignItems: 'center', gap: 8, paddingVertical: 14 },
  iconWrap: { width: 52, height: 52, borderRadius: 13, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 12, fontWeight: '600', color: TEXT, textAlign: 'center' },
})
