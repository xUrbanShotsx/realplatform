import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { PIPELINE, type DealStage, type Deal } from '../store/sessions'

const BLUE   = '#3B6BF7'
const GREEN  = '#10b981'
const AMBER  = '#f59e0b'
const PURPLE = '#8b5cf6'
const RED    = '#ef4444'
const TEXT   = '#0f172a'
const TEXT2  = '#475569'
const TEXT3  = '#94a3b8'

const STAGES: DealStage[] = ['New Lead', 'Viewing', 'Negotiating', 'Under Offer', 'Settled']

const STAGE_COLOR: Record<DealStage, string> = {
  'New Lead':    TEXT3,
  'Viewing':     BLUE,
  'Negotiating': AMBER,
  'Under Offer': PURPLE,
  'Settled':     GREEN,
}

const STAGE_BG: Record<DealStage, string> = {
  'New Lead':    '#f1f5f9',
  'Viewing':     '#EEF2FF',
  'Negotiating': '#fffbeb',
  'Under Offer': '#f5f3ff',
  'Settled':     '#f0fdf4',
}

function totalValue(deals: Deal[]): string {
  const nums = deals.map(d => {
    const m = d.price.replace(/[^0-9.]/g, '')
    return m ? parseFloat(m) : 0
  })
  const total = nums.reduce((a, b) => a + b, 0)
  if (total >= 1) return `$${total.toFixed(2)}M`
  return `$${(total * 1000).toFixed(0)}K`
}

export default function PipelineScreen() {
  const grouped = STAGES.map(stage => ({
    stage,
    deals: PIPELINE.filter(d => d.stage === stage),
  }))

  const activePipeline = PIPELINE.filter(d => d.stage !== 'Settled')

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={s.title}>Pipeline</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Summary */}
        <View style={s.summaryRow}>
          <View style={s.summaryItem}>
            <Text style={s.summaryVal}>{activePipeline.length}</Text>
            <Text style={s.summaryLabel}>Active Deals</Text>
          </View>
          <View style={[s.summaryItem, s.summaryBorder]}>
            <Text style={[s.summaryVal, { color: PURPLE }]}>{PIPELINE.filter(d => d.stage === 'Under Offer').length}</Text>
            <Text style={s.summaryLabel}>Under Offer</Text>
          </View>
          <View style={[s.summaryItem, s.summaryBorder]}>
            <Text style={[s.summaryVal, { color: GREEN }]}>{totalValue(activePipeline)}</Text>
            <Text style={s.summaryLabel}>Pipeline Value</Text>
          </View>
        </View>

        {/* Stages */}
        {grouped.map(({ stage, deals }) => (
          <View key={stage} style={s.stageSection}>
            <View style={s.stageHeader}>
              <View style={[s.stageDot, { backgroundColor: STAGE_COLOR[stage] }]} />
              <Text style={s.stageTitle}>{stage}</Text>
              <Text style={s.stageCount}>{deals.length}</Text>
            </View>

            {deals.length > 0 ? (
              <View style={s.card}>
                {deals.map((deal, i) => (
                  <TouchableOpacity key={deal.id} style={[s.dealRow, i > 0 && s.rowBorder]} activeOpacity={0.65}>
                    <View style={[s.stagePill, { backgroundColor: STAGE_BG[deal.stage] }]}>
                      <Feather name="home" size={14} color={STAGE_COLOR[deal.stage]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dealAddress}>{deal.address}</Text>
                      <Text style={s.dealContact}>{deal.contactName} · {deal.suburb}</Text>
                      <Text style={s.dealDays}>{deal.daysInStage}d in stage</Text>
                    </View>
                    <Text style={[s.dealPrice, { color: STAGE_COLOR[deal.stage] }]}>{deal.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={s.emptyStage}>
                <Text style={s.emptyTxt}>No deals in this stage</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TEXT },
  summaryRow: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 16 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryBorder: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: '#e2e8f0' },
  summaryVal: { fontSize: 22, fontWeight: '800', color: TEXT, letterSpacing: -0.5 },
  summaryLabel: { fontSize: 11, color: TEXT3, marginTop: 2, textAlign: 'center' },
  stageSection: { paddingHorizontal: 16, marginTop: 20 },
  stageHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  stageDot: { width: 8, height: 8, borderRadius: 4 },
  stageTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: TEXT2 },
  stageCount: { fontSize: 12, fontWeight: '700', color: TEXT3 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  dealRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f1f5f9' },
  stagePill: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  dealAddress: { fontSize: 14, fontWeight: '700', color: TEXT },
  dealContact: { fontSize: 12, color: TEXT2, marginTop: 2 },
  dealDays: { fontSize: 11, color: TEXT3, marginTop: 2 },
  dealPrice: { fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
  emptyStage: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  emptyTxt: { fontSize: 12, color: TEXT3 },
})
