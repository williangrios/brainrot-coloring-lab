import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent, Alert,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import { useLanguage } from '../../i18n/LanguageContext'
import { getPageById } from '../../core/data/coloringPages'
import { useAppGate } from '../../core/context/AppGateContext'
import { useCredits } from '../../core/context/CreditsContext'
import { useInterstitialAd, AdBanner, MockInterstitial } from '../../core/ads/AdService'
import CanvasWebView, { CanvasWebViewHandle } from './canvas/CanvasWebView'
import ToolBar from './components/ToolBar'
import ToneSlider from './components/ToneSlider'
import PaletteBar from './components/PaletteBar'
import BrushSizeSlider from './components/BrushSizeSlider'
import OpacitySlider from './components/OpacitySlider'
import { ToolType, TOOLS } from './data/tools'
import { Undo2, Redo2 } from 'lucide-react-native'

type PaintingRoute = RouteProp<RootStackParamList, 'Painting'>
type Nav = NativeStackNavigationProp<RootStackParamList, 'Painting'>

export default function PaintingScreen() {
  const route = useRoute<PaintingRoute>()
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const { pageId } = route.params

  const page = getPageById(pageId)

  // Canvas state
  const canvasRef = useRef<CanvasWebViewHandle>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const pendingFinishRef = useRef(false)

  // Shared state
  const [selectedTool, setSelectedTool] = useState<ToolType>('fill')
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [baseColor, setBaseColor] = useState('#FF0000')
  const [brushSize, setBrushSize] = useState(14)
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null)
  const [recentColors, setRecentColors] = useState<string[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushOpacity, setBrushOpacity] = useState(1.0)
  const [brushSliderDismissed, setBrushSliderDismissed] = useState(false)
  const previousColorRef = useRef(selectedColor)

  // Ads
  const { adsUnlocked, shouldShowVideoAd, recordAdShown } = useAppGate()
  const { isPremium } = useCredits()
  const { showAd, mockVisible, closeMock } = useInterstitialAd()
  const [initialAdShown, setInitialAdShown] = useState(false)
  const adTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Mostrar interstitial ao entrar, se anúncios desbloqueados
  useEffect(() => {
    if (adsUnlocked && !isPremium && !initialAdShown && shouldShowVideoAd()) {
      setInitialAdShown(true)
      showAd(() => recordAdShown())
    }
  }, [adsUnlocked]) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer para interstitials periódicos
  useEffect(() => {
    if (!adsUnlocked || isPremium) return
    adTimerRef.current = setInterval(() => {
      if (shouldShowVideoAd()) {
        showAd(() => recordAdShown())
      }
    }, 60_000)
    return () => { if (adTimerRef.current) clearInterval(adTimerRef.current) }
  }, [adsUnlocked, isPremium, shouldShowVideoAd, showAd, recordAdShown])

  const toolDef = TOOLS.find((t) => t.id === selectedTool)
  const showBrushSize = (toolDef?.hasBrushSize ?? false) && !isDrawing && !brushSliderDismissed
  const showOpacity = (toolDef?.hasOpacity ?? false) && !isDrawing && !brushSliderDismissed
  const effectiveBrushSize = toolDef?.fixedBrushSize ?? brushSize

  const handleSelectTool = useCallback((tool: ToolType) => {
    if (tool === 'eraser') {
      if (selectedTool !== 'eraser') previousColorRef.current = selectedColor
      setSelectedColor('#FFFFFF')
    } else if (selectedTool === 'eraser') {
      setSelectedColor(previousColorRef.current)
    }
    setSelectedTool(tool)
    setBrushSliderDismissed(false)
  }, [selectedTool, selectedColor])

  const handleDrawStart = useCallback(() => setIsDrawing(true), [])
  const handleDrawEnd = useCallback(() => setIsDrawing(false), [])

  const addRecentColor = useCallback((c: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((x) => x.toLowerCase() !== c.toLowerCase())
      return [c, ...filtered].slice(0, 10)
    })
  }, [])

  const handleSelectColor = useCallback((c: string) => {
    setSelectedColor(c)
    setBaseColor(c)
    addRecentColor(c)
  }, [addRecentColor])

  const handleSelectTone = useCallback((c: string) => {
    setSelectedColor(c)
    addRecentColor(c)
  }, [addRecentColor])

  const handleUndo = useCallback(() => { canvasRef.current?.undo() }, [])
  const handleRedo = useCallback(() => { canvasRef.current?.redo() }, [])

  const handleFinish = () => {
    pendingFinishRef.current = true
    canvasRef.current?.capture()
  }

  const handleSnapshot = useCallback((dataUrl: string) => {
    if (pendingFinishRef.current) {
      pendingFinishRef.current = false
      navigation.navigate('Finalization', { pageId, snapshotDataUrl: dataUrl })
    }
  }, [navigation, pageId])

  const handleHistoryChanged = useCallback((cu: boolean, cr: boolean) => {
    setCanUndo(cu)
    setCanRedo(cr)
  }, [])

  const handleEyedropperColor = useCallback((c: string) => {
    setSelectedColor(c)
    setBaseColor(c)
    addRecentColor(c)
    setSelectedTool('brush')
  }, [addRecentColor])

  const handleCanvasLayout = useCallback((e: LayoutChangeEvent) => {
    const { width: areaW, height: areaH } = e.nativeEvent.layout
    const h = Math.min(areaW, areaH)
    setCanvasSize({ w: Math.floor(areaW), h: Math.floor(h) })
  }, [])

  const toolLabel = toolDef ? t(toolDef.nameKey) : ''

  if (!page) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>Page not found</Text>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={() => {
            Alert.alert(t('exitWithoutSaving'), t('exitWithoutSavingMsg'), [
              { text: t('cancel'), style: 'cancel' },
              { text: t('exit'), style: 'destructive', onPress: () => navigation.goBack() },
            ])
          }}>
            <Text style={styles.topBtnText}>{'\u2715'}</Text>
          </TouchableOpacity>
          <View style={styles.topCenter}>
            <View style={styles.colorPreview}>
              <View style={[styles.colorPreviewDot, { backgroundColor: selectedColor }]} />
              <Text style={styles.colorPreviewLabel}>{toolLabel}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
            <Text style={styles.finishText}>{t('done')}</Text>
          </TouchableOpacity>
        </View>

        {/* Canvas area */}
        <View style={styles.canvasOuter} onLayout={handleCanvasLayout}>
          {canvasSize && page.imageUrl && (
            <View style={styles.canvasCenter}>
              <CanvasWebView
                ref={canvasRef}
                imageSource={page.imageUrl}
                width={canvasSize.w}
                height={canvasSize.h}
                tool={selectedTool}
                color={selectedColor}
                brushSize={effectiveBrushSize}
                brushOpacity={brushOpacity}
                onEyedropperColor={handleEyedropperColor}
                onHistoryChanged={handleHistoryChanged}
                onDrawStart={handleDrawStart}
                onDrawEnd={handleDrawEnd}
                onSnapshot={handleSnapshot}
              />
            </View>
          )}

          {(showBrushSize || showOpacity) && (
            <View style={styles.sliderOverlay} pointerEvents="box-none">
              <View style={styles.sliderColumn} pointerEvents="box-none">
                {showBrushSize && (
                  <BrushSizeSlider
                    size={brushSize}
                    onSizeChange={setBrushSize}
                    visible={true}
                    onClose={() => setBrushSliderDismissed(true)}
                  />
                )}
                {showOpacity && (
                  <OpacitySlider
                    opacity={brushOpacity}
                    onOpacityChange={setBrushOpacity}
                    visible={true}
                  />
                )}
              </View>
            </View>
          )}
        </View>

        {/* Bottom panel */}
        <View style={styles.bottomPanel}>
          <View style={styles.toolRow}>
            <View style={styles.toolRowSide}>
              <TouchableOpacity
                style={[styles.historyBtn, !canUndo && styles.historyBtnDisabled]}
                onPress={handleUndo} disabled={!canUndo}
              >
                <Undo2 color={canUndo ? '#fff' : '#444'} size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.historyBtn, !canRedo && styles.historyBtnDisabled]}
                onPress={handleRedo} disabled={!canRedo}
              >
                <Redo2 color={canRedo ? '#fff' : '#444'} size={16} />
              </TouchableOpacity>
            </View>
            <View style={styles.toolRowCenter}>
              <ToolBar selectedTool={selectedTool} onSelectTool={handleSelectTool} />
            </View>
          </View>

          <ToneSlider baseColor={baseColor} selectedColor={selectedColor} onSelectColor={handleSelectTone} />
          <PaletteBar selectedColor={selectedColor} onSelectColor={handleSelectColor} recentColors={recentColors} />
        </View>

        <AdBanner visible={!isPremium && adsUnlocked} />
        <MockInterstitial visible={mockVisible} onClose={closeMock} />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#222' },
  topBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  topBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  topCenter: { flex: 1, alignItems: 'center' },
  colorPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, gap: 8 },
  colorPreviewDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#444' },
  colorPreviewLabel: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  finishBtn: { backgroundColor: '#00ff88', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 14 },
  finishText: { color: '#111', fontSize: 14, fontWeight: '700' },
  canvasOuter: { flex: 1, overflow: 'hidden' },
  canvasCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sliderOverlay: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center' },
  sliderColumn: { flexDirection: 'column', alignItems: 'flex-start' },
  bottomPanel: { backgroundColor: '#1a1a1a', borderTopWidth: 1, borderTopColor: '#333' },
  toolRow: { flexDirection: 'row', alignItems: 'center' },
  toolRowSide: { flexDirection: 'column', gap: 4, paddingHorizontal: 4, paddingVertical: 4 },
  toolRowCenter: { flex: 1 },
  historyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  historyBtnDisabled: { opacity: 0.3 },
})
