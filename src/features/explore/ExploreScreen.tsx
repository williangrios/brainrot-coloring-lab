import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import PremiumModal from '../../core/components/PremiumModal'
import { useCredits } from '../../core/context/CreditsContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { coloringPages, ColoringPage, Difficulty } from '../../core/data/coloringPages'
import ColoringPageRenderer from '../painting/pages'

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#00ff88',
  medium: '#FFD600',
  hard: '#ff4444',
}

export default function ExploreScreen() {
  const navigation = useNavigation<any>()
  const { credits, isPremium } = useCredits()
  const { t } = useLanguage()
  const [premiumModal, setPremiumModal] = useState(false)

  const handleSelectPage = (page: ColoringPage) => {
    if (page.isPremiumResource && !isPremium) {
      setPremiumModal(true)
      return
    }
    if (!isPremium && credits <= 0) {
      setPremiumModal(true)
      return
    }
    navigation.getParent()?.navigate('Painting', { pageId: page.id })
  }

  const easyPages = coloringPages.filter((p) => p.difficulty === 'easy')
  const mediumPages = coloringPages.filter((p) => p.difficulty === 'medium')
  const hardPages = coloringPages.filter((p) => p.difficulty === 'hard')

  const SECTIONS = [
    { id: 'easy', name: t('easy'), color: DIFFICULTY_COLORS.easy, pages: easyPages },
    { id: 'medium', name: t('medium'), color: DIFFICULTY_COLORS.medium, pages: mediumPages },
    { id: 'hard', name: t('hard'), color: DIFFICULTY_COLORS.hard, pages: hardPages },
  ]

  return (
    <ScreenWrapper noBottom>
      <Header title={t('explore')} />
      <FlatList
        data={SECTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: section }) => (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.diffDot, { backgroundColor: section.color }]} />
              <Text style={styles.sectionName}>{section.name}</Text>
              <Text style={styles.sectionCount}>{section.pages.length}</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={section.pages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.pagesRow}
              renderItem={({ item: page }) => (
                <TouchableOpacity style={styles.pageThumb} onPress={() => handleSelectPage(page)} activeOpacity={0.7}>
                  <View pointerEvents="none">
                    <ColoringPageRenderer pageId={page.id} width={100} height={110} />
                  </View>
                  <Text style={styles.thumbName} numberOfLines={1}>{t(page.nameKey) || page.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>{t('collectionStats')}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{coloringPages.length}</Text>
                <Text style={styles.statLabel}>{t('browseAll')}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{easyPages.length}</Text>
                <Text style={styles.statLabel}>{t('easy')}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{mediumPages.length}</Text>
                <Text style={styles.statLabel}>{t('medium')}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{hardPages.length}</Text>
                <Text style={styles.statLabel}>{t('hard')}</Text>
              </View>
            </View>
          </View>
        }
      />
      <PremiumModal
        visible={premiumModal}
        onClose={() => setPremiumModal(false)}
        onSubscribe={() => setPremiumModal(false)}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 16 },
  sectionCard: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#222' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  diffDot: { width: 10, height: 10, borderRadius: 5 },
  sectionName: { color: '#fff', fontSize: 18, fontWeight: '700', flex: 1 },
  sectionCount: { color: '#666', fontSize: 14 },
  pagesRow: { gap: 10 },
  pageThumb: { width: 100, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
  thumbImage: { width: 100, height: 110 },
  thumbName: { color: '#333', fontSize: 10, fontWeight: '600', padding: 4, textAlign: 'center' },
  statsCard: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#222', marginTop: 8 },
  statsTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNumber: { color: '#00ff88', fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 11, fontWeight: '600', marginTop: 2 },
})
