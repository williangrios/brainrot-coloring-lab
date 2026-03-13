import React, { useState, useCallback, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent, ScrollView,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import { useLanguage } from '../../i18n/LanguageContext'
import CharacterPreview from '../creation/components/CharacterPreview'
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
  fills: Record<string, string>
  strokes: Stroke[]
}

export default function PaintingScreen() {
  const route = useRoute<PaintingRoute>()
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const { headId, bodyId, environmentId } = route.params

  const [fills, setFills] = useState<Record<string, string>>({})
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([{ fills: {}, strokes: [] }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedTool, setSelectedTool] = useState<ToolType>('fill')
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [baseColor, setBaseColor] = useState('#FF0000')
  const [brushSize, setBrushSize] = useState(14)
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null)
  const [recentColors, setRecentColors] = useState<string[]>([])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const toolDef = TOOLS.find((t) => t.id === selectedTool)
  const isDrawingTool = toolDef?.isDrawingTool ?? false
  const isEyedropper = selectedTool === 'eyedropper'
  const showBrushSize = toolDef?.hasBrushSize ?? false
  const effectiveBrushSize = toolDef?.fixedBrushSize ?? brushSize

  const pushHistory = useCallback((newFills: Record<string, string>, newStrokes: Stroke[]) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), { fills: newFills, strokes: newStrokes }])
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

  // Fill or eyedropper: tap on SVG region
  const handleRegionPress = useCallback((regionId: string) => {
    if (isEyedropper) {
      const regionColor = fills[regionId] || '#FFFFFF'
      setSelectedColor(regionColor)
      setBaseColor(regionColor)
      addRecentColor(regionColor)
      return
    }
    if (selectedTool !== 'fill') return
    const newFills = { ...fills, [regionId]: selectedColor }
    setFills(newFills)
    pushHistory(newFills, strokes)
    addRecentColor(selectedColor)
  }, [fills, strokes, selectedColor, selectedTool, isEyedropper, pushHistory, addRecentColor])

  const handleStrokeComplete = useCallback((stroke: Stroke) => {
    const newStrokes = [...strokes, stroke]
    setStrokes(newStrokes)
    pushHistory(fills, newStrokes)
  }, [fills, strokes, pushHistory])

  const handleUndo = useCallback(() => {
    if (!canUndo) return
    const i = historyIndex - 1
    setHistoryIndex(i)
    setFills(history[i].fills)
    setStrokes(history[i].strokes)
  }, [canUndo, historyIndex, history])

  const handleRedo = useCallback(() => {
    if (!canRedo) return
    const i = historyIndex + 1
    setHistoryIndex(i)
    setFills(history[i].fills)
    setStrokes(history[i].strokes)
  }, [canRedo, historyIndex, history])

  const handleFinish = () => {
    navigation.navigate('Finalization', {
      headId, bodyId, environmentId, fills, strokes,
      canvasWidth: canvasSize?.w || 400,
      canvasHeight: canvasSize?.h || 500,
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

  // For drawing tools and eyedropper, CharacterPreview handles taps differently
  const canvasRegionPress = (isDrawingTool) ? undefined : handleRegionPress

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

        {/* Canvas area with zoom */}
        <View style={styles.canvasOuter} onLayout={handleCanvasLayout}>
          {canvasSize && (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              maximumZoomScale={5}
              minimumZoomScale={1}
              bouncesZoom
              centerContent
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!isDrawingTool}
            >
              <View style={{ width: canvasSize.w, height: canvasSize.h }}>
                <CharacterPreview
                  headId={headId} bodyId={bodyId} environmentId={environmentId}
                  fills={fills} onRegionPress={canvasRegionPress}
                  width={canvasSize.w} height={canvasSize.h}
                />
                <DrawingCanvas
                  width={canvasSize.w}
                  height={canvasSize.h}
                  tool={selectedTool}
                  color={selectedColor}
                  brushSize={effectiveBrushSize}
                  strokes={strokes}
                  onStrokeComplete={handleStrokeComplete}
                  enabled={isDrawingTool}
                />
              </View>
            </ScrollView>
          )}
          {/* Brush size slider as sibling to avoid gesture conflicts */}
          <View style={styles.sliderOverlay} pointerEvents="box-none">
            <BrushSizeSlider size={brushSize} onSizeChange={setBrushSize} visible={showBrushSize} />
          </View>
        </View>

        {/* Bottom panel */}
        <View style={styles.bottomPanel}>
          {/* Tool icons row */}
          <ToolBar selectedTool={selectedTool} onSelectTool={setSelectedTool} />

          {/* Tone slider */}
          <ToneSlider baseColor={baseColor} selectedColor={selectedColor} onSelectColor={handleSelectTone} />

          {/* Palette bar + colors */}
          <PaletteBar selectedColor={selectedColor} onSelectColor={handleSelectColor} recentColors={recentColors} />

          {/* Bottom controls: undo/redo */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={[styles.historyBtn, !canUndo && styles.historyBtnDisabled]}
              onPress={handleUndo} disabled={!canUndo}
            >
              <Undo2 color={canUndo ? '#fff' : '#444'} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.historyBtn, !canRedo && styles.historyBtnDisabled]}
              onPress={handleRedo} disabled={!canRedo}
            >
              <Redo2 color={canRedo ? '#fff' : '#444'} size={18} />
            </TouchableOpacity>
          </View>
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
  canvasOuter: { flex: 1 },
  scrollContent: { alignItems: 'center', justifyContent: 'center', minHeight: '100%' },
  sliderOverlay: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 },
  bottomPanel: { backgroundColor: '#1a1a1a', borderTopWidth: 1, borderTopColor: '#333' },
  bottomControls: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 6, gap: 12 },
  historyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  historyBtnDisabled: { opacity: 0.3 },
})
