import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Heart } from 'lucide-react-native'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import PremiumModal from '../../core/components/PremiumModal'
import { useCredits } from '../../core/context/CreditsContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { getDrawings, Drawing } from '../../core/storage/drawingStorage'
import { coloringPages, ColoringPage, Difficulty } from '../../core/data/coloringPages'
import { getFavorites, addFavorite, removeFavorite } from '../../core/storage/favoritesStorage'
import { getPageById } from '../../core/data/coloringPages'
import { useImages } from '../../core/api/useImages'
import ColoringPageRenderer from '../../features/painting/pages'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#00ff88',
  medium: '#FFD600',
  hard: '#ff4444',
}

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const { credits, isPremium } = useCredits()
  const { t } = useLanguage()
  const [recentDrawings, setRecentDrawings] = useState<Drawing[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [premiumModal, setPremiumModal] = useState(false)

  const { pages: remotePages } = useImages()

  useFocusEffect(
    useCallback(() => {
      getDrawings().then((d) => setRecentDrawings(d.slice(0, 6)))
      getFavorites().then(setFavorites)
    }, [])
  )

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

  const handleToggleFavorite = async (pageId: string) => {
    if (favorites.includes(pageId)) {
      await removeFavorite(pageId)
      setFavorites((prev) => prev.filter((id) => id !== pageId))
    } else {
      await addFavorite(pageId)
      setFavorites((prev) => [pageId, ...prev])
    }
  }

  const allPages = useMemo(() => {
    const seen = new Set<string>()
    const merged: ColoringPage[] = []
    for (const p of [...remotePages, ...coloringPages]) {
      if (!seen.has(p.id)) {
        seen.add(p.id)
        merged.push(p)
      }
    }
    return merged
  }, [remotePages])

  const freePages = allPages.filter((p) => !p.isPremiumResource)
  const favPages = allPages.filter((p) => favorites.includes(p.id))

  return (
    <ScreenWrapper noBottom>
      <Header title={t('brainrotLab')} />
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.content}>
            {/* Hero */}
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>{t('startColoring')}</Text>
              <Text style={styles.heroSubtitle}>{t('chooseDrawing')}</Text>
              <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Browse')}>
                <Text style={styles.browseBtnText}>{t('browseAll')}</Text>
              </TouchableOpacity>
            </View>

            {/* Free drawings */}
            <Text style={styles.sectionTitle}>{t('freeDrawings')}</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={freePages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.hScroll}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pageCard} onPress={() => handleSelectPage(item)} activeOpacity={0.7}>
                  <View style={styles.pageImageWrap}>
                    <View pointerEvents="none">
                      <ColoringPageRenderer pageId={item.id} width={110} height={120} thumbnailUrl={item.thumbnailUrl} />
                    </View>
                    <TouchableOpacity
                      style={styles.favBtn}
                      onPress={() => handleToggleFavorite(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Heart size={14} color={favorites.includes(item.id) ? '#ff4466' : '#fff'} fill={favorites.includes(item.id) ? '#ff4466' : 'none'} strokeWidth={favorites.includes(item.id) ? 2 : 1.5} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pageInfo}>
                    <Text style={styles.pageName} numberOfLines={1}>{item.name || t(item.nameKey)}</Text>
                    <View style={[styles.diffDot, { backgroundColor: DIFFICULTY_COLORS[item.difficulty] }]} />
                  </View>
                </TouchableOpacity>
              )}
            />

            {/* Favorites */}
            {favPages.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>{t('favorites')}</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={favPages}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.hScroll}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.pageCard} onPress={() => handleSelectPage(item)} activeOpacity={0.7}>
                      <View style={styles.pageImageWrap}>
                        <View pointerEvents="none">
                          <ColoringPageRenderer pageId={item.id} width={110} height={120} thumbnailUrl={item.thumbnailUrl} />
                        </View>
                        {item.isPremiumResource && !isPremium && (
                          <View style={styles.lockBadge}><Text style={styles.lockText}>🔒</Text></View>
                        )}
                      </View>
                      <Text style={styles.pageName} numberOfLines={1}>{item.name || t(item.nameKey)}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {/* Recent */}
            {recentDrawings.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>{t('recentDrawings')}</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={recentDrawings}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.hScroll}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.recentCard}
                      onPress={() => navigation.getParent()?.navigate('Painting', { pageId: item.pageId })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.recentPreview}>
                        <ColoringPageRenderer pageId={item.pageId} width={90} height={80} />
                      </View>
                      <Text style={styles.recentName} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {/* Credits info */}
            {!isPremium && (
              <View style={styles.creditsInfo}>
                <Text style={styles.creditsInfoTitle}>{t('freePlan')}</Text>
                <Text style={styles.creditsInfoText}>
                  {t('creditsRemaining').replace('{count}', String(credits))}{'\n'}
                  {t('shareToEarn')}
                </Text>
                <TouchableOpacity
                  style={styles.upgradeSmall}
                  onPress={() => setPremiumModal(true)}
                >
                  <Text style={styles.upgradeSmallText}>{t('upgradeToPremium')}</Text>
                </TouchableOpacity>
              </View>
            )}
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
  content: { padding: 16 },
  hero: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#222' },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 8, lineHeight: 34 },
  heroSubtitle: { color: '#888', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  browseBtn: { backgroundColor: '#00ff88', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  browseBtnText: { color: '#111', fontSize: 17, fontWeight: '800' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  hScroll: { gap: 12, paddingBottom: 20 },
  pageCard: { width: 130, backgroundColor: '#1a1a1a', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  pageImageWrap: { height: 140, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  pageImage: { width: 110, height: 120 },
  pageInfo: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 6 },
  pageName: { color: '#ccc', fontSize: 11, fontWeight: '600', flex: 1 },
  diffDot: { width: 8, height: 8, borderRadius: 4 },
  favBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: { fontSize: 12 },
  recentCard: { width: 110, backgroundColor: '#1a1a1a', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  recentPreview: { height: 100, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  recentImage: { width: 90, height: 80 },
  recentName: { color: '#ccc', fontSize: 11, fontWeight: '600', padding: 6, textAlign: 'center' },
  creditsInfo: { backgroundColor: '#1a1a0a', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#333300', marginTop: 8 },
  creditsInfoTitle: { color: '#FFD600', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  creditsInfoText: { color: '#999', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  upgradeSmall: { backgroundColor: '#00ff88', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  upgradeSmallText: { color: '#111', fontSize: 14, fontWeight: '700' },
})
