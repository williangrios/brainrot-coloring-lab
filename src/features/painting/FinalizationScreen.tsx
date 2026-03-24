import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  Share,
  Image,
} from 'react-native'
import {
  useNavigation,
  useRoute,
  RouteProp,
  CommonActions,
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import { useAppGate } from '../../core/context/AppGateContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { saveDrawing, generateId } from '../../core/storage/drawingStorage'
import { getPageById } from '../../core/data/coloringPages'

type FinalizationRoute = RouteProp<RootStackParamList, 'Finalization'>
type Nav = NativeStackNavigationProp<RootStackParamList, 'Finalization'>

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PREVIEW_SIZE = Math.min(SCREEN_WIDTH - 80, 250)

export default function FinalizationScreen() {
  const route = useRoute<FinalizationRoute>()
  const navigation = useNavigation<Nav>()
  const { pageId, snapshotDataUrl } = route.params
  const { shouldShowRating } = useAppGate()
  const { t } = useLanguage()

  const page = getPageById(pageId)
  const backendName = page?.name ?? 'My Drawing'
  const [customName, setCustomName] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [saved, setSaved] = useState(false)

  const finalName = useCustom ? customName : backendName

  const handleSave = async () => {
    if (!finalName.trim()) {
      Alert.alert(t('nameRequired'), t('giveAName'))
      return
    }
    await saveDrawing({
      id: generateId(),
      pageId,
      snapshotUri: snapshotDataUrl,
      name: finalName.trim(),
      createdAt: Date.now(),
      shared: false,
    })
    setSaved(true)
    Alert.alert(t('saved'), t('drawingSaved'))
  }

  const handleShare = async () => {
    try {
      const message = t('shareMessage').replace('{name}', finalName)
      await Share.share({ message })
    } catch {
      // Cancelled
    }
  }

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
    )
  }

  const handleDone = () => {
    if (shouldShowRating()) {
      // Mostrar tela de avaliação antes de voltar
      navigation.navigate('Rating')
    } else {
      goHome()
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Ao voltar do RatingScreen (se o usuário avaliou ou fechou), ir para home
      if (saved && !shouldShowRating()) {
        setTimeout(() => goHome(), 100)
      }
    })
    return unsubscribe
  }, [navigation, saved, shouldShowRating])

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{t('yourCreation')}</Text>
        <View style={styles.previewContainer}>
          <View
            style={{
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE,
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {snapshotDataUrl && (
              <Image
                source={{ uri: snapshotDataUrl }}
                style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
                resizeMode="contain"
              />
            )}
          </View>
        </View>

        <Text style={styles.nameLabel}>{t('nameYourCharacter')}</Text>
        <View style={styles.namesContainer}>
          <TouchableOpacity
            style={[styles.nameOption, !useCustom && styles.nameOptionSelected]}
            onPress={() => setUseCustom(false)}
          >
            <Text style={[styles.nameOptionText, !useCustom && styles.nameOptionTextSelected]}>
              {backendName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nameOption, useCustom && styles.nameOptionSelected]}
            onPress={() => setUseCustom(true)}
          >
            <Text style={[styles.nameOptionText, useCustom && styles.nameOptionTextSelected]}>
              {t('customName')}
            </Text>
          </TouchableOpacity>
        </View>

        {useCustom && (
          <TextInput
            style={styles.input}
            value={customName}
            onChangeText={setCustomName}
            placeholder={t('typeAName')}
            placeholderTextColor="#666"
            maxLength={30}
          />
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.savedBtn]}
            onPress={saved ? handleDone : handleSave}
          >
            <Text style={styles.saveBtnText}>
              {saved ? t('done') : t('saveToLibrary')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
          >
            <Text style={styles.shareBtnText}>{t('share')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  previewContainer: { marginBottom: 20, borderRadius: 12, overflow: 'hidden', elevation: 4 },
  nameLabel: { color: '#aaa', fontSize: 13, marginBottom: 8 },
  namesContainer: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  nameOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#222', borderWidth: 1, borderColor: '#333' },
  nameOptionSelected: { backgroundColor: '#0a2a18', borderColor: '#00ff88' },
  nameOptionText: { color: '#888', fontSize: 14, fontWeight: '600' },
  nameOptionTextSelected: { color: '#00ff88' },
  input: { width: '100%', backgroundColor: '#1a1a1a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  actions: { width: '100%', gap: 10, marginTop: 8 },
  saveBtn: { backgroundColor: '#00ff88', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  savedBtn: { backgroundColor: '#00cc6a' },
  saveBtnText: { color: '#111', fontSize: 16, fontWeight: '700' },
  shareBtn: { backgroundColor: '#1a1a1a', paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#00ff88' },
  shareBtnText: { color: '#00ff88', fontSize: 16, fontWeight: '700' },
})
