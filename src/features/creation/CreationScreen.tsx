import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import { useCredits } from '../../core/context/CreditsContext'
import { useLanguage } from '../../i18n/LanguageContext'
import CharacterPreview from './components/CharacterPreview'
import PartSelector from './components/PartSelector'
import { heads, bodies, environments } from './data/partsRegistry'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PREVIEW_SIZE = Math.min(SCREEN_WIDTH - 32, 360)

export default function CreationScreen() {
  const navigation = useNavigation<any>()
  const { credits, isPremium, spend } = useCredits()
  const { t } = useLanguage()
  const [selectedHead, setSelectedHead] = useState(heads[0].id)
  const [selectedBody, setSelectedBody] = useState(bodies[0].id)
  const [selectedEnv, setSelectedEnv] = useState(environments[0].id)

  const handleStartPainting = async () => {
    if (!isPremium) {
      if (credits <= 0) {
        Alert.alert(t('noCredits'), t('noCreditsMsg'), [
          { text: 'OK', onPress: () => navigation.navigate('Library') },
        ])
        return
      }
      const success = await spend()
      if (!success) {
        Alert.alert(t('noCredits'), t('noCreditsMsg'), [
          { text: 'OK', onPress: () => navigation.navigate('Library') },
        ])
        return
      }
    }

    navigation.getParent()?.navigate('Painting', {
      headId: selectedHead,
      bodyId: selectedBody,
      environmentId: selectedEnv,
    })
  }

  const handleShuffle = () => {
    setSelectedHead(heads[Math.floor(Math.random() * heads.length)].id)
    setSelectedBody(bodies[Math.floor(Math.random() * bodies.length)].id)
    setSelectedEnv(environments[Math.floor(Math.random() * environments.length)].id)
  }

  return (
    <ScreenWrapper noBottom>
      <Header title={t('create')} />
      <View style={styles.previewContainer}>
        <CharacterPreview
          headId={selectedHead}
          bodyId={selectedBody}
          environmentId={selectedEnv}
          fills={{}}
          width={PREVIEW_SIZE}
          height={PREVIEW_SIZE * 1.25}
        />
      </View>
      <View style={styles.selectorsContainer}>
        <PartSelector label={t('head')} parts={heads} selectedId={selectedHead} onSelect={setSelectedHead} />
        <PartSelector label={t('body')} parts={bodies} selectedId={selectedBody} onSelect={setSelectedBody} />
        <PartSelector label={t('environment')} parts={environments} selectedId={selectedEnv} onSelect={setSelectedEnv} />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.shuffleButton} onPress={handleShuffle}>
          <Text style={styles.shuffleText}>{t('shuffle')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paintButton} onPress={handleStartPainting}>
          <Text style={styles.paintText}>
            {isPremium ? t('startPainting') : t('paint').replace('{count}', String(credits))}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  previewContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 200 },
  selectorsContainer: { paddingHorizontal: 12, paddingBottom: 8 },
  actions: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  shuffleButton: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#1a1a1a', borderWidth: 2, borderColor: '#444', alignItems: 'center' },
  shuffleText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  paintButton: { flex: 2, paddingVertical: 14, borderRadius: 14, backgroundColor: '#00ff88', alignItems: 'center' },
  paintText: { color: '#111', fontSize: 16, fontWeight: '700' },
})
