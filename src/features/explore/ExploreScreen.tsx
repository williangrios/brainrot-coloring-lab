import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import Svg from 'react-native-svg'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import { useLanguage } from '../../i18n/LanguageContext'
import { heads, bodies, environments, headComponents, bodyComponents, environmentComponents } from '../../features/creation/data/partsRegistry'

function MiniCombo({ head, body, env }: { head: string; body: string; env: string }) {
  const H = headComponents[head]; const B = bodyComponents[body]; const E = environmentComponents[env]
  return (<View style={styles.miniCombo}><Svg width={80} height={100} viewBox="0 0 400 500">{E && <E fills={{}} />}{B && <B fills={{}} />}{H && <H fills={{}} />}</Svg></View>)
}

export default function ExploreScreen() {
  const { t } = useLanguage()

  const CATEGORIES = [
    { id: 'animals', name: t('brainrotAnimals'), description: t('brainrotAnimalsDesc'), combos: [{ head: 'capybara', body: 'buff', env: 'jungle' }, { head: 'frog', body: 'skater', env: 'city' }, { head: 'cat', body: 'chef', env: 'pizza_land' }] },
    { id: 'memes', name: t('memeLegends'), description: t('memeLegendsDesc'), combos: [{ head: 'skibidi', body: 'suit', env: 'city' }, { head: 'skibidi', body: 'buff', env: 'space' }, { head: 'alien', body: 'robot', env: 'space' }] },
    { id: 'absurd', name: t('maximumBrainrot'), description: t('maximumBrainrotDesc'), combos: [{ head: 'capybara', body: 'robot', env: 'underwater' }, { head: 'frog', body: 'suit', env: 'pizza_land' }, { head: 'alien', body: 'chef', env: 'jungle' }] },
    { id: 'cool', name: t('coolVibes'), description: t('coolVibesDesc'), combos: [{ head: 'cat', body: 'skater', env: 'city' }, { head: 'alien', body: 'suit', env: 'space' }, { head: 'capybara', body: 'chef', env: 'pizza_land' }] },
  ]

  return (
    <ScreenWrapper noBottom>
      <Header title={t('explore')} />
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: cat }) => (
          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Text style={styles.categoryDesc}>{cat.description}</Text>
            <FlatList horizontal showsHorizontalScrollIndicator={false} data={cat.combos} keyExtractor={(_, i) => String(i)} contentContainerStyle={styles.combosRow}
              renderItem={({ item: c }) => <MiniCombo head={c.head} body={c.body} env={c.env} />} />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>{t('collectionStats')}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}><Text style={styles.statNumber}>{heads.length}</Text><Text style={styles.statLabel}>{t('heads')}</Text></View>
              <View style={styles.stat}><Text style={styles.statNumber}>{bodies.length}</Text><Text style={styles.statLabel}>{t('bodies')}</Text></View>
              <View style={styles.stat}><Text style={styles.statNumber}>{environments.length}</Text><Text style={styles.statLabel}>{t('environments')}</Text></View>
              <View style={styles.stat}><Text style={styles.statNumber}>{heads.length * bodies.length * environments.length}</Text><Text style={styles.statLabel}>{t('combos')}</Text></View>
            </View>
          </View>
        }
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 16 },
  categoryCard: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#222' },
  categoryName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  categoryDesc: { color: '#888', fontSize: 13, marginBottom: 12 },
  combosRow: { gap: 10 },
  miniCombo: { width: 90, height: 110, backgroundColor: '#0d0d0d', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  statsCard: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#222', marginTop: 8 },
  statsTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNumber: { color: '#00ff88', fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 11, fontWeight: '600', marginTop: 2 },
})
