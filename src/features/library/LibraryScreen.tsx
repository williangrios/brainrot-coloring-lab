import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Share, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import { useLanguage } from '../../i18n/LanguageContext'
import { getDrawings, deleteDrawing, Drawing } from '../../core/storage/drawingStorage'

function DrawingPreview({ drawing, size = 140 }: { drawing: Drawing; size?: number }) {
  if (drawing.snapshotUri) {
    return (
      <View style={{ width: size, height: size, backgroundColor: '#fff', borderRadius: 6, overflow: 'hidden' }}>
        <Image
          source={{ uri: drawing.snapshotUri }}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </View>
    )
  }
  return (
    <View style={{ width: size, height: size, backgroundColor: '#222', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#666', fontSize: 12 }}>No preview</Text>
    </View>
  )
}

export default function LibraryScreen() {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const { t } = useLanguage()

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
      await Share.share({ message })
    } catch { /* cancelled */ }
  }

  if (drawings.length === 0) {
    return (
      <ScreenWrapper noBottom>
        <Header title={t('library')} />
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{'\uD83C\uDFA8'}</Text>
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
                  <Text style={styles.cardBtnDangerText}>{'\u2715'}</Text>
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
