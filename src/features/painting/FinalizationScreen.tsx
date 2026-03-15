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
  Linking,
  Platform,
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
import { useCredits } from '../../core/context/CreditsContext'
import { useAppGate } from '../../core/context/AppGateContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { saveDrawing, generateId } from '../../core/storage/drawingStorage'
import { getPageById } from '../../core/data/coloringPages'
import Svg, { Path, G } from 'react-native-svg'
import ColoringPageRenderer from './pages'
import { TOOL_RENDER_CONFIG } from './data/tools'

type FinalizationRoute = RouteProp<RootStackParamList, 'Finalization'>
type Nav = NativeStackNavigationProp<RootStackParamList, 'Finalization'>

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PREVIEW_SIZE = Math.min(SCREEN_WIDTH - 80, 250)

export default function FinalizationScreen() {
  const route = useRoute<FinalizationRoute>()
  const navigation = useNavigation<Nav>()
  const { pageId, regionColors, strokes = [] } = route.params
  const { earnFromShare, shareCount } = useCredits()
  const { incrementDrawingCount, shouldShowRating } = useAppGate()
  const { t } = useLanguage()

  // Count this drawing completion
  React.useEffect(() => {
    incrementDrawingCount()
  }, [])

  const page = getPageById(pageId)
  const backendName = page?.name ?? 'My Drawing'
  const [customName, setCustomName] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [saved, setSaved] = useState(false)
  const [shared, setShared] = useState(false)

  const finalName = useCustom ? customName : backendName

  const handleSave = async () => {
    if (!finalName.trim()) {
      Alert.alert(t('nameRequired'), t('giveAName'))
      return
    }
    await saveDrawing({
      id: generateId(),
      pageId,
      regionColors,
      strokes,
      name: finalName.trim(),
      createdAt: Date.now(),
      shared: false,
    })
    setSaved(true)
    Alert.alert(t('saved'), t('drawingSaved'))
  }

  const onShareComplete = async () => {
    if (shareCount < 3) {
      const earned = await earnFromShare()
      if (earned) {
        setShared(true)
        Alert.alert(t('creditEarned'), t('earnedCreditMsg'))
      }
    } else {
      setShared(true)
    }
  }

  const handleShare = async () => {
    if (!saved) await handleSave()
    const message = t('shareMessage').replace('{name}', finalName)
    Alert.alert(t('share'), message, [
      {
        text: 'Instagram',
        onPress: async () => {
          const igUrl =
            Platform.OS === 'ios' ? 'instagram://camera' : 'instagram://share'
          try {
            await Linking.openURL(igUrl)
          } catch {
            await Linking.openURL('https://www.instagram.com')
          }
          await onShareComplete()
        },
      },
      {
        text: 'TikTok',
        onPress: async () => {
          try {
            await Linking.openURL('snssdk1233://')
          } catch {
            await Linking.openURL('https://www.tiktok.com')
          }
          await onShareComplete()
        },
      },
      { text: t('cancel'), style: 'cancel' },
    ])
  }

  const handleDone = () => {
    if (shouldShowRating()) {
      // Show rating modal, then go home when it's dismissed
      navigation.navigate('Rating')
      // After rating screen pops back, the user is still on Finalization.
      // We'll add a listener to go home when we get focus back.
    } else {
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
      )
    }
  }

  // After returning from Rating screen, go to MainTabs
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // If user already rated (came back from Rating), go home
      if (saved && !shouldShowRating()) {
        // Small delay to avoid navigation conflict
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
          )
        }, 100)
      }
    })
    return unsubscribe
  }, [navigation, saved, shouldShowRating])

  const renderStroke = (stroke: any, i: number) => {
    if (stroke.strands) {
      return (
        <G key={i}>
          {stroke.strands.map((d: string, j: number) => (
            <Path
              key={j}
              d={d}
              stroke={stroke.color}
              strokeWidth={stroke.width}
              fill="none"
              strokeLinecap="round"
              opacity={stroke.opacity}
            />
          ))}
        </G>
      )
    } else if (stroke.pathD) {
      return (
        <Path
          key={i}
          d={stroke.pathD}
          fill={stroke.color}
          opacity={stroke.opacity ?? 0.6}
        />
      )
    } else if (stroke.points) {
      const cfg = TOOL_RENDER_CONFIG[stroke.type]
      if (cfg?.passes) {
        return (
          <G key={i}>
            {Array.from({ length: cfg.passes }).map((_, p) => (
              <Path
                key={p}
                d={stroke.points}
                stroke={stroke.color}
                strokeWidth={stroke.width + p * (cfg.passWidthInc || 3)}
                fill="none"
                strokeLinecap="round"
                opacity={cfg.passOpacity || 0.15}
              />
            ))}
          </G>
        )
      }
      if (stroke.glowWidth) {
        return (
          <G key={i}>
            <Path
              d={stroke.points}
              stroke={stroke.color}
              strokeWidth={stroke.glowWidth}
              fill="none"
              strokeLinecap="round"
              opacity={stroke.glowOpacity ?? 0.25}
            />
            <Path
              d={stroke.points}
              stroke={stroke.color}
              strokeWidth={stroke.width}
              fill="none"
              strokeLinecap="round"
              opacity={stroke.opacity}
            />
          </G>
        )
      }
      return (
        <Path
          key={i}
          d={stroke.points}
          stroke={stroke.color}
          strokeWidth={stroke.width}
          fill="none"
          strokeLinecap={stroke.strokeLinecap || 'round'}
          strokeLinejoin={stroke.strokeLinejoin || 'round'}
          strokeDasharray={stroke.strokeDasharray}
          opacity={stroke.opacity ?? 0.8}
        />
      )
    }
    return null
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{t('yourCreation')}</Text>
        <View style={styles.previewContainer}>
          <View
            style={{
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE * 1.25,
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <ColoringPageRenderer
              pageId={pageId}
              width={PREVIEW_SIZE}
              height={PREVIEW_SIZE * 1.25}
              regionColors={regionColors}
            />
            {strokes.length > 0 && (
              <Svg
                width={PREVIEW_SIZE}
                height={PREVIEW_SIZE * 1.25}
                viewBox="0 0 400 500"
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                {strokes.map((s: any, i: number) => renderStroke(s, i))}
              </Svg>
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
            <Text
              style={[
                styles.nameOptionText,
                useCustom && styles.nameOptionTextSelected,
              ]}
            >
              {t('customName')}
            </Text>
          </TouchableOpacity>
        </View>

        {useCustom && (
          <TextInput
            style={styles.nameInput}
            placeholder={t('typeAName')}
            placeholderTextColor="#666"
            value={customName}
            onChangeText={setCustomName}
            maxLength={30}
          />
        )}

        <View style={styles.actions}>
          {!saved && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{t('saveToLibrary')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.shareBtn, shared && styles.shareBtnDone]}
            onPress={handleShare}
            disabled={shared}
          >
            <Text style={styles.shareBtnText}>
              {shared
                ? t('shared')
                : shareCount < 3
                  ? t('shareAndEarn')
                  : t('share')}
            </Text>
          </TouchableOpacity>
          {saved && (
            <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
              <Text style={styles.doneBtnText}>{t('done')}</Text>
            </TouchableOpacity>
          )}
        </View>
        {!shared && shareCount < 3 && (
          <Text style={styles.hint}>
            {t('shareHint').replace('{count}', String(3 - shareCount))}
          </Text>
        )}
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  previewContainer: {
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 20,
  },
  nameLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  namesContainer: { alignSelf: 'stretch', gap: 8, marginBottom: 12 },
  nameOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
  },
  nameOptionSelected: { borderColor: '#00ff88', backgroundColor: '#0a2a18' },
  nameOptionText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  nameOptionTextSelected: { color: '#00ff88' },
  nameInput: {
    alignSelf: 'stretch',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#00ff88',
    marginBottom: 12,
  },
  actions: { alignSelf: 'stretch', gap: 10, marginTop: 8 },
  saveBtn: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  shareBtn: {
    backgroundColor: '#00ff88',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  shareBtnDone: { backgroundColor: '#333' },
  shareBtnText: { color: '#111', fontSize: 16, fontWeight: '700' },
  doneBtn: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: { color: '#FFD600', fontSize: 12, marginTop: 12, textAlign: 'center' },
})
