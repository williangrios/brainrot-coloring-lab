import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Share } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCredits } from '../../core/context/CreditsContext'
import { getDrawings, deleteDrawing, Drawing } from '../../core/storage/drawingStorage'
import Svg, { Path, G } from 'react-native-svg'
import ColoringPageRenderer from '../painting/pages'
import { TOOL_RENDER_CONFIG } from '../painting/data/tools'

function renderStroke(stroke: any, i: number) {
  if (stroke.strands) {
    return <G key={i}>{stroke.strands.map((d: string, j: number) => (
      <Path key={j} d={d} stroke={stroke.color} strokeWidth={stroke.width} fill="none" strokeLinecap="round" opacity={stroke.opacity} />
    ))}</G>
  } else if (stroke.pathD) {
    return <Path key={i} d={stroke.pathD} fill={stroke.color} opacity={stroke.opacity ?? 0.6} />
  } else if (stroke.points) {
    const cfg = TOOL_RENDER_CONFIG[stroke.type]
    if (cfg?.passes) {
      return <G key={i}>{Array.from({ length: cfg.passes }).map((_, p) => (
        <Path key={p} d={stroke.points} stroke={stroke.color} strokeWidth={stroke.width + p * (cfg.passWidthInc || 3)} fill="none" strokeLinecap="round" opacity={cfg.passOpacity || 0.15} />
      ))}</G>
    }
    if (stroke.glowWidth) {
      return <G key={i}>
        <Path d={stroke.points} stroke={stroke.color} strokeWidth={stroke.glowWidth} fill="none" strokeLinecap="round" opacity={stroke.glowOpacity ?? 0.25} />
        <Path d={stroke.points} stroke={stroke.color} strokeWidth={stroke.width} fill="none" strokeLinecap="round" opacity={stroke.opacity} />
      </G>
    }
    return <Path key={i} d={stroke.points} stroke={stroke.color} strokeWidth={stroke.width}
      fill="none" strokeLinecap={stroke.strokeLinecap || 'round'} strokeLinejoin={stroke.strokeLinejoin || 'round'}
      strokeDasharray={stroke.strokeDasharray} opacity={stroke.opacity ?? 0.8} />
  }
  return null
}

function DrawingPreview({ drawing, size = 140 }: { drawing: Drawing; size?: number }) {
  const drawStrokes = drawing.strokes || []
  return (
    <View style={{ width: size, height: size * 1.25, backgroundColor: '#fff', borderRadius: 6, overflow: 'hidden' }}>
      <ColoringPageRenderer
        pageId={drawing.pageId}
        width={size}
        height={size * 1.25}
        regionColors={drawing.regionColors || {}}
      />
      {drawStrokes.length > 0 && (
        <Svg width={size} height={size * 1.25} viewBox="0 0 400 500" style={{ position: 'absolute', top: 0, left: 0 }}>
          {drawStrokes.map((s: any, i: number) => renderStroke(s, i))}
        </Svg>
      )}
    </View>
  )
}

export default function LibraryScreen() {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const { t } = useLanguage()
  const { earnFromShare, shareCount } = useCredits()

  const loadDrawings = useCallback(async () => {
    const d = await getDrawings()
    setDrawings(d)
  }, [])

  useFocusEffect(useCallback(() => { loadDrawings() }, [loadDrawings]))

  const handleDelete = (drawing: Drawing) => {
    Alert.alert(t('deleteDrawing'), t('deleteConfirm').replace('{name}', drawing.name), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: async () => { await deleteDrawing(drawing.id); loadDrawings() } },
    ])
  }

  const handleShare = async (drawing: Drawing) => {
    try {
      const message = t('shareMessage').replace('{name}', drawing.name)
      const result = await Share.share({ message })
      if (result.action === Share.sharedAction && shareCount < 3) {
        const earned = await earnFromShare()
        if (earned) Alert.alert(t('creditEarned'), t('earnedCreditMsg'))
      }
    } catch { /* cancelled */ }
  }

  if (drawings.length === 0) {
    return (
      <ScreenWrapper noBottom>
        <Header title={t('library')} />
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎨</Text>
          <Text style={styles.emptyTitle}>{t('noDrawings')}</Text>
          <Text style={styles.emptyText}>{t('createFirst')}</Text>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper noBottom>
      <Header title={t('library')} />
      <FlatList
        data={drawings}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardPreview}><DrawingPreview drawing={item} size={150} /></View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => handleShare(item)} style={styles.cardBtn}>
                  <Text style={styles.cardBtnText}>{t('share')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.cardBtnDanger}>
                  <Text style={styles.cardBtnDangerText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  grid: { padding: 12 },
  row: { gap: 12, marginBottom: 12 },
  card: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  cardPreview: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, backgroundColor: '#0d0d0d' },
  cardInfo: { padding: 10 },
  cardName: { color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBtn: { backgroundColor: '#0a2a18', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  cardBtnText: { color: '#00ff88', fontSize: 12, fontWeight: '600' },
  cardBtnDanger: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2a1a1a', alignItems: 'center', justifyContent: 'center' },
  cardBtnDangerText: { color: '#ff4444', fontSize: 12, fontWeight: '700' },
})
