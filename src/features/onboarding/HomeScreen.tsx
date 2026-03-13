import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Svg from 'react-native-svg'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import { useCredits } from '../../core/context/CreditsContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { getDrawings, Drawing } from '../../core/storage/drawingStorage'
import { headComponents, bodyComponents, environmentComponents } from '../../features/creation/data/partsRegistry'

const COMBOS = [
  { head: 'capybara', body: 'buff', env: 'space', label: 'Buff Capybara in Space' },
  { head: 'skibidi', body: 'chef', env: 'pizza_land', label: 'Skibidi Chef in Pizza Land' },
  { head: 'frog', body: 'suit', env: 'city', label: 'Frog King CEO' },
  { head: 'cat', body: 'skater', env: 'jungle', label: 'Laser Cat Skater' },
  { head: 'alien', body: 'robot', env: 'underwater', label: 'Alien Robot Underwater' },
]

function MiniPreview({ headId, bodyId, envId, size = 80 }: { headId: string; bodyId: string; envId: string; size?: number }) {
  const Head = headComponents[headId]
  const Body = bodyComponents[bodyId]
  const Env = environmentComponents[envId]
  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 400 500">
      {Env && <Env fills={{}} />}
      {Body && <Body fills={{}} />}
      {Head && <Head fills={{}} />}
    </Svg>
  )
}

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const { credits, isPremium } = useCredits()
  const { t } = useLanguage()
  const [recentDrawings, setRecentDrawings] = useState<Drawing[]>([])

  useFocusEffect(
    useCallback(() => {
      getDrawings().then((d) => setRecentDrawings(d.slice(0, 3)))
    }, [])
  )

  const checkCreditsAndNavigate = (headId: string, bodyId: string, environmentId: string) => {
    if (!isPremium && credits <= 0) {
      Alert.alert(t('noCredits'), t('noCreditsMsg'), [
        { text: 'OK', onPress: () => navigation.navigate('Library') },
      ])
      return
    }
    navigation.getParent()?.navigate('Painting', { headId, bodyId, environmentId })
  }

  const handleCreate = () => {
    if (!isPremium && credits <= 0) {
      Alert.alert(t('noCredits'), t('noCreditsMsg'), [
        { text: 'OK', onPress: () => navigation.navigate('Library') },
      ])
      return
    }
    navigation.navigate('Create')
  }

  return (
    <ScreenWrapper noBottom>
      <Header title={t('brainrotLab')} />
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.content}>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>{t('createYourCharacter')}</Text>
              <Text style={styles.heroSubtitle}>{t('mixDescription')}</Text>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                <Text style={styles.createBtnText}>{t('createNew')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>{t('featuredCombos')}</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={COMBOS}
              keyExtractor={(item) => item.label}
              contentContainerStyle={styles.combosScroll}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.comboCard} onPress={() => checkCreditsAndNavigate(item.head, item.body, item.env)} activeOpacity={0.7}>
                  <View style={styles.comboPreview}>
                    <MiniPreview headId={item.head} bodyId={item.body} envId={item.env} size={100} />
                  </View>
                  <Text style={styles.comboLabel} numberOfLines={2}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            {recentDrawings.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>{t('recentDrawings')}</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={recentDrawings}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.combosScroll}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.comboCard} onPress={() => checkCreditsAndNavigate(item.headId, item.bodyId, item.environmentId)} activeOpacity={0.7}>
                      <View style={styles.comboPreview}>
                        <MiniPreview headId={item.headId} bodyId={item.bodyId} envId={item.environmentId} size={100} />
                      </View>
                      <Text style={styles.comboLabel} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {!isPremium && (
              <View style={styles.creditsInfo}>
                <Text style={styles.creditsInfoTitle}>{t('freePlan')}</Text>
                <Text style={styles.creditsInfoText}>
                  {t('creditsRemaining').replace('{count}', String(credits))}{'\n'}
                  {t('shareToEarn')}
                </Text>
              </View>
            )}
          </View>
        }
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  hero: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#222' },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 8, lineHeight: 34 },
  heroSubtitle: { color: '#888', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  createBtn: { backgroundColor: '#00ff88', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  createBtnText: { color: '#111', fontSize: 17, fontWeight: '800' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  combosScroll: { gap: 12, paddingBottom: 20 },
  comboCard: { width: 130, backgroundColor: '#1a1a1a', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  comboPreview: { height: 130, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d0d' },
  comboLabel: { color: '#ccc', fontSize: 12, fontWeight: '600', padding: 8, textAlign: 'center' },
  creditsInfo: { backgroundColor: '#1a1a0a', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#333300' },
  creditsInfoTitle: { color: '#FFD600', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  creditsInfoText: { color: '#999', fontSize: 13, lineHeight: 20 },
})
