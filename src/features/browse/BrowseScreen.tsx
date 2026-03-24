import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Heart } from 'lucide-react-native'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import PremiumModal from '../../core/components/PremiumModal'
import { useCredits } from '../../core/context/CreditsContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { coloringPages, ColoringPage, Difficulty } from '../../core/data/coloringPages'
import { useImages } from '../../core/api/useImages'
import { getFavorites, addFavorite, removeFavorite } from '../../core/storage/favoritesStorage'
import ColoringPageRenderer from '../painting/pages'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#00ff88',
  medium: '#FFD600',
  hard: '#ff4444',
}

const FILTERS: { key: 'all' | Difficulty | 'favorites'; labelKey: string }[] = [
  { key: 'all', labelKey: 'all' },
  { key: 'easy', labelKey: 'easy' },
  { key: 'medium', labelKey: 'medium' },
  { key: 'hard', labelKey: 'hard' },
  { key: 'favorites', labelKey: 'favorites' },
]

export default function BrowseScreen() {
  const navigation = useNavigation<any>()
  const { isPremium } = useCredits()
  const { t } = useLanguage()
  const [filter, setFilter] = useState<'all' | Difficulty | 'favorites'>('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [premiumModal, setPremiumModal] = useState(false)

  const { pages: remotePages } = useImages()

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites)
    }, [])
  )

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

  const filteredPages = filter === 'favorites'
    ? allPages.filter((p) => favorites.includes(p.id))
    : filter === 'all'
      ? allPages
      : allPages.filter((p) => p.difficulty === filter)

  const handleToggleFavorite = async (pageId: string) => {
    if (favorites.includes(pageId)) {
      await removeFavorite(pageId)
      setFavorites((prev) => prev.filter((id) => id !== pageId))
    } else {
      await addFavorite(pageId)
      setFavorites((prev) => [pageId, ...prev])
    }
  }

  const handleSelectPage = async (page: ColoringPage) => {
    if (page.isPremiumResource && !isPremium) {
      setPremiumModal(true)
      return
    }
    navigation.getParent()?.navigate('Painting', { pageId: page.id })
  }

  const renderCard = ({ item }: { item: ColoringPage }) => {
    const isFav = favorites.includes(item.id)
    const locked = item.isPremiumResource && !isPremium
    const diffColor = DIFFICULTY_COLORS[item.difficulty]

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelectPage(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardImageContainer}>
          <View pointerEvents="none">
            <ColoringPageRenderer pageId={item.id} width={CARD_WIDTH - 16} height={CARD_WIDTH * 1.1 - 16} thumbnailUrl={item.thumbnailUrl} />
          </View>
          {locked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>{'\uD83D\uDD12'}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => handleToggleFavorite(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              size={18}
              color={isFav ? '#ff4466' : '#fff'}
              fill={isFav ? '#ff4466' : 'none'}
              strokeWidth={isFav ? 2 : 1.5}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name || t(item.nameKey)}
          </Text>
          <View style={[styles.diffBadge, { backgroundColor: diffColor + '22' }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>
              {t(item.difficulty)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ScreenWrapper noBottom>
      <Header title={t('browse')} />

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {t(f.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredPages.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{filter === 'favorites' ? '\u2764\uFE0F' : '\uD83C\uDFA8'}</Text>
          <Text style={styles.emptyText}>
            {filter === 'favorites' ? t('noFavorites') : t('noPages')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPages}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={renderCard}
        />
      )}

      <PremiumModal
        visible={premiumModal}
        onClose={() => setPremiumModal(false)}
        onSubscribe={() => setPremiumModal(false)}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  filterBtnActive: {
    backgroundColor: '#0a2a18',
    borderColor: '#00ff88',
  },
  filterText: { color: '#888', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#00ff88' },
  grid: { padding: 12 },
  row: { gap: 12, marginBottom: 12 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  cardImageContainer: {
    height: CARD_WIDTH * 1.1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: { fontSize: 28 },
  favBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: { color: '#fff', fontSize: 12, fontWeight: '600', flex: 1, marginRight: 6 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  diffText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center' },
})
