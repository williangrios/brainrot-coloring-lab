import React, { useState, useCallback, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent, Animated,
} from 'react-native'
import { PinchGestureHandler, State as GestureState } from 'react-native-gesture-handler'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import { useLanguage } from '../../i18n/LanguageContext'
import { getPageById } from '../../core/data/coloringPages'
import ColoringPageRenderer from './pages'
import { getPageRegionData } from './pages/regionPaths'
import DrawingCanvas, { Stroke } from './components/DrawingCanvas'
import ToolBar from './components/ToolBar'
import ToneSlider from './components/ToneSlider'
import PaletteBar from './components/PaletteBar'
import BrushSizeSlider from './components/BrushSizeSlider'
import { ToolType, TOOLS } from './data/tools'
import { Undo2, Redo2 } from 'lucide-react-native'

type PaintingRoute = RouteProp<RootStackParamList, 'Painting'>
type Nav = NativeStackNavigationProp<RootStackParamList, 'Painting'>

const ASPECT_RATIO = 500 / 400

interface HistoryEntry {
  regionColors: Record<string, string>
  strokes: Stroke[]
}

export default function PaintingScreen() {
  const route = useRoute<PaintingRoute>()
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const { pageId } = route.params

  const page = getPageById(pageId)
  const regionData = getPageRegionData(pageId)

  const [regionColors, setRegionColors] = useState<Record<string, string>>({})
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([{ regionColors: {}, strokes: [] }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedTool, setSelectedTool] = useState<ToolType>('fill')
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [baseColor, setBaseColor] = useState('#FF0000')
  const [brushSize, setBrushSize] = useState(14)
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null)
  const [recentColors, setRecentColors] = useState<string[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSliderDismissed, setBrushSliderDismissed] = useState(false)

  // Pinch-to-zoom
  const baseScale = useRef(new Animated.Value(1)).current
  const pinchScale = useRef(new Animated.Value(1)).current
  const lastScale = useRef(1)
  const scale = Animated.multiply(baseScale, pinchScale)

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true }
  )

  const onPinchStateChange = useCallback((event: any) => {
    if (event.nativeEvent.oldState === GestureState.ACTIVE) {
      const newScale = Math.min(5, Math.max(1, lastScale.current * event.nativeEvent.scale))
      lastScale.current = newScale
      baseScale.setValue(newScale)
      pinchScale.setValue(1)
    }
  }, [baseScale, pinchScale])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const toolDef = TOOLS.find((t) => t.id === selectedTool)
  const isDrawingTool = toolDef?.isDrawingTool ?? false
  const isFillTool = selectedTool === 'fill'
  const showBrushSize = (toolDef?.hasBrushSize ?? false) && !isDrawing && !brushSliderDismissed
  const effectiveBrushSize = toolDef?.fixedBrushSize ?? brushSize

  const handleSelectTool = useCallback((tool: ToolType) => {
    setSelectedTool(tool)
    setBrushSliderDismissed(false)
  }, [])

  const handleDrawStart = useCallback(() => setIsDrawing(true), [])
  const handleDrawEnd = useCallback(() => setIsDrawing(false), [])

  const pushHistory = useCallback((newRegionColors: Record<string, string>, newStrokes: Stroke[]) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), { regionColors: newRegionColors, strokes: newStrokes }])
    setHistoryIndex((prev) => prev + 1)
  }, [historyIndex])

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

  // Fill tool: tap a region to fill it
  const handleRegionPress = useCallback((regionId: string) => {
    if (!isFillTool) return
    const newColors = { ...regionColors, [regionId]: selectedColor }
    setRegionColors(newColors)
    pushHistory(newColors, strokes)
  }, [isFillTool, regionColors, selectedColor, strokes, pushHistory])

  // Drawing tools: stroke complete
  const handleStrokeComplete = useCallback((stroke: Stroke) => {
    const newStrokes = [...strokes, stroke]
    setStrokes(newStrokes)
    pushHistory(regionColors, newStrokes)
  }, [strokes, regionColors, pushHistory])

  const handleUndo = useCallback(() => {
    if (!canUndo) return
    const i = historyIndex - 1
    setHistoryIndex(i)
    setRegionColors(history[i].regionColors)
    setStrokes(history[i].strokes)
  }, [canUndo, historyIndex, history])

  const handleRedo = useCallback(() => {
    if (!canRedo) return
    const i = historyIndex + 1
    setHistoryIndex(i)
    setRegionColors(history[i].regionColors)
    setStrokes(history[i].strokes)
  }, [canRedo, historyIndex, history])

  const handleFinish = () => {
    navigation.navigate('Finalization', {
      pageId,
      regionColors,
      strokes,
    })
  }

  const handleCanvasLayout = useCallback((e: LayoutChangeEvent) => {
    const { width: areaW, height: areaH } = e.nativeEvent.layout
    let w = areaW
    let h = w * ASPECT_RATIO
    if (h > areaH) { h = areaH; w = h / ASPECT_RATIO }
    setCanvasSize({ w: Math.floor(w), h: Math.floor(h) })
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
          <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.topBtnText}>✕</Text>
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
          {canvasSize && (
            <PinchGestureHandler
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={onPinchStateChange}
              enabled={!isDrawing}
            >
              <Animated.View style={[styles.canvasCenter, { transform: [{ scale }] }]}>
                <View style={{ width: canvasSize.w, height: canvasSize.h, backgroundColor: '#fff', borderRadius: 4, overflow: 'hidden' }}>
                  {/* Layer 1: SVG coloring page with region fills */}
                  <ColoringPageRenderer
                    pageId={pageId}
                    width={canvasSize.w}
                    height={canvasSize.h}
                    regionColors={regionColors}
                    onRegionPress={isFillTool ? handleRegionPress : undefined}
                  />
                  {/* Layer 2: Drawing strokes overlay */}
                  <View style={StyleSheet.absoluteFill} pointerEvents={isDrawingTool ? 'auto' : 'none'}>
                    <DrawingCanvas
                      width={canvasSize.w}
                      height={canvasSize.h}
                      tool={selectedTool}
                      color={selectedColor}
                      brushSize={effectiveBrushSize}
                      strokes={strokes}
                      onStrokeComplete={handleStrokeComplete}
                      enabled={isDrawingTool}
                      regionData={regionData}
                      onDrawStart={handleDrawStart}
                      onDrawEnd={handleDrawEnd}
                    />
                  </View>
                </View>
              </Animated.View>
            </PinchGestureHandler>
          )}
          {showBrushSize && (
            <View style={styles.sliderOverlay} pointerEvents="box-none">
              <BrushSizeSlider size={brushSize} onSizeChange={setBrushSize} visible={true} onClose={() => setBrushSliderDismissed(true)} />
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
  sliderOverlay: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 },
  bottomPanel: { backgroundColor: '#1a1a1a', borderTopWidth: 1, borderTopColor: '#333' },
  toolRow: { flexDirection: 'row', alignItems: 'center' },
  toolRowSide: { flexDirection: 'column', gap: 4, paddingHorizontal: 4, paddingVertical: 4 },
  toolRowCenter: { flex: 1 },
  historyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  historyBtnDisabled: { opacity: 0.3 },
})
