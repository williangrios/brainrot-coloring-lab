import React, { useRef, useState, useCallback, useEffect } from 'react'
import { View, PanResponder, StyleSheet } from 'react-native'
import Svg, { Path, Defs, G, ClipPath, Mask, Rect } from 'react-native-svg'
import { ToolType, TOOL_RENDER_CONFIG } from '../data/tools'
import { PageRegionData } from '../pages/regionPaths'
import { flattenSvgPath, pointInPolygon, pointInEllipse, ellipseToPath } from '../utils/pointInPath'

const VB_W = 400
const VB_H = 500

export interface PathStroke {
  type: string
  points: string
  color: string
  width: number
  opacity: number
  strokeLinecap?: string
  strokeLinejoin?: string
  strokeDasharray?: string
  glowWidth?: number
  glowOpacity?: number
  clipRegionId?: string
  clipPathD?: string
}

export interface ScatterStroke {
  type: string
  pathD: string
  color: string
  opacity: number
  clipRegionId?: string
  clipPathD?: string
}

export interface FuzzyStroke {
  type: 'fuzzy'
  strands: string[]
  color: string
  width: number
  opacity: number
  clipRegionId?: string
  clipPathD?: string
}

export type Stroke = PathStroke | ScatterStroke | FuzzyStroke

interface DrawingCanvasProps {
  width: number
  height: number
  tool: ToolType
  color: string
  brushSize: number
  strokes: Stroke[]
  onStrokeComplete: (stroke: Stroke) => void
  enabled: boolean
  regionData?: PageRegionData | null
  onDrawStart?: () => void
  onDrawEnd?: () => void
}

function dotToArc(cx: number, cy: number, r: number): string {
  return `M${(cx - r).toFixed(1)},${cy.toFixed(1)}a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(r * 2).toFixed(1)},0a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 -${(r * 2).toFixed(1)},0`
}

function generateScatter(x: number, y: number, radius: number, type: 'uniform' | 'gaussian'): string {
  const count = Math.max(4, Math.floor(radius * 0.8))
  let d = ''
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    let dist: number
    if (type === 'gaussian') {
      const u = Math.random() || 0.001
      dist = Math.abs(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random())) * radius * 0.4
      dist = Math.min(dist, radius)
    } else {
      dist = Math.random() * radius
    }
    const dotR = 0.3 + Math.random() * 1.0
    const cx = Math.max(0, Math.min(VB_W, x + Math.cos(angle) * dist))
    const cy = Math.max(0, Math.min(VB_H, y + Math.sin(angle) * dist))
    d += dotToArc(cx, cy, dotR)
  }
  return d
}

function generateGlitter(x: number, y: number, radius: number): string {
  const count = Math.max(3, Math.floor(radius * 0.5))
  let d = ''
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * radius
    const dotR = 0.5 + Math.random() * 2.5
    const cx = Math.max(0, Math.min(VB_W, x + Math.cos(angle) * dist))
    const cy = Math.max(0, Math.min(VB_H, y + Math.sin(angle) * dist))
    d += dotToArc(cx, cy, dotR)
  }
  return d
}

function generateFuzzyStrands(mainPoints: string[], strandCount: number): string[] {
  const strands: string[] = []
  for (let s = 0; s < strandCount; s++) {
    const offsetX = (Math.random() - 0.5) * 12
    const offsetY = (Math.random() - 0.5) * 12
    const strand = mainPoints.map((p) => {
      const match = p.match(/([ML])([\d.-]+),([\d.-]+)/)
      if (!match) return p
      const cmd = match[1]
      const x = parseFloat(match[2]) + offsetX + (Math.random() - 0.5) * 4
      const y = parseFloat(match[3]) + offsetY + (Math.random() - 0.5) * 4
      return `${cmd}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
    strands.push(strand)
  }
  return strands
}

const SCATTER_TOOLS = new Set(['spray', 'glitter', 'airbrush'])
const PATH_TOOLS = new Set(['brush', 'eraser', 'crayon', 'thick_pencil', 'laser', 'neon', 'watercolor', 'flat_brush', 'marker', 'fine_tip'])

// Get the path d-string for a region (path or ellipse)
function getRegionPathD(id: string, regionData: PageRegionData): string | null {
  if (regionData.ellipses[id]) {
    const e = regionData.ellipses[id]
    return ellipseToPath(e.cx, e.cy, e.rx, e.ry)
  }
  if (regionData.paths[id]) {
    return regionData.paths[id]
  }
  return null
}

// Build a compound clip path for a region.
// For regions that have higher-priority regions on top,
// we combine the region's path with all higher regions' paths.
// Using fillRule="evenodd", overlapping areas become holes.
function buildCompoundClipPath(hitIndex: number, regionData: PageRegionData): string {
  const { hitOrder } = regionData
  const hitId = hitOrder[hitIndex]
  let compound = getRegionPathD(hitId, regionData) || ''

  // Add all regions above this one (they'll be subtracted via evenodd)
  for (let j = hitIndex + 1; j < hitOrder.length; j++) {
    const aboveId = hitOrder[j]
    const abovePath = getRegionPathD(aboveId, regionData)
    if (abovePath) {
      compound += ' ' + abovePath
    }
  }

  return compound
}

// Hit test: find which region contains the point (topmost wins)
function hitTestRegion(
  x: number, y: number,
  regionData: PageRegionData
): { regionId: string; clipPathD: string } | null {
  const { paths, ellipses, hitOrder } = regionData

  // Test in reverse order (topmost first)
  for (let i = hitOrder.length - 1; i >= 0; i--) {
    const id = hitOrder[i]

    // Check ellipses first
    if (ellipses[id]) {
      const e = ellipses[id]
      if (pointInEllipse(x, y, e.cx, e.cy, e.rx, e.ry)) {
        return { regionId: id, clipPathD: buildCompoundClipPath(i, regionData) }
      }
    }

    // Check paths
    if (paths[id]) {
      const polygon = flattenSvgPath(paths[id])
      if (polygon.length >= 3 && pointInPolygon(x, y, polygon)) {
        return { regionId: id, clipPathD: buildCompoundClipPath(i, regionData) }
      }
    }
  }

  return null
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width, height, tool, color, brushSize, strokes, onStrokeComplete, enabled, regionData, onDrawStart, onDrawEnd,
}) => {
  const currentPoints = useRef<string[]>([])
  const currentScatterD = useRef<string>('')
  const [livePathD, setLivePathD] = useState<string | null>(null)
  const [liveScatterD, setLiveScatterD] = useState<string | null>(null)
  const [liveClipId, setLiveClipId] = useState<string | null>(null)
  const [liveClipPathD, setLiveClipPathD] = useState<string | null>(null)

  const toolRef = useRef(tool)
  const colorRef = useRef(color)
  const brushSizeRef = useRef(brushSize)
  const enabledRef = useRef(enabled)
  const onStrokeCompleteRef = useRef(onStrokeComplete)
  const widthRef = useRef(width)
  const heightRef = useRef(height)
  const regionDataRef = useRef(regionData)
  const onDrawStartRef = useRef(onDrawStart)
  const onDrawEndRef = useRef(onDrawEnd)
  const clipRegionIdRef = useRef<string | null>(null)
  const clipPathDRef = useRef<string | null>(null)

  useEffect(() => { toolRef.current = tool }, [tool])
  useEffect(() => { colorRef.current = color }, [color])
  useEffect(() => { brushSizeRef.current = brushSize }, [brushSize])
  useEffect(() => { enabledRef.current = enabled }, [enabled])
  useEffect(() => { onStrokeCompleteRef.current = onStrokeComplete }, [onStrokeComplete])
  useEffect(() => { widthRef.current = width }, [width])
  useEffect(() => { heightRef.current = height }, [height])
  useEffect(() => { regionDataRef.current = regionData }, [regionData])
  useEffect(() => { onDrawStartRef.current = onDrawStart }, [onDrawStart])
  useEffect(() => { onDrawEndRef.current = onDrawEnd }, [onDrawEnd])

  const isOutOfBounds = useCallback((evt: any) => {
    const { locationX, locationY } = evt.nativeEvent
    const m = 5
    return locationX < m || locationX > widthRef.current - m ||
           locationY < m || locationY > heightRef.current - m
  }, [])

  const toViewBox = useCallback((evt: any) => {
    const margin = 2
    const px = Math.max(margin, Math.min(widthRef.current - margin, evt.nativeEvent.locationX))
    const py = Math.max(margin, Math.min(heightRef.current - margin, evt.nativeEvent.locationY))
    const x = (px / widthRef.current) * VB_W
    const y = (py / heightRef.current) * VB_H
    return { x, y }
  }, [])

  const drawingActive = useRef(false)

  const finishStroke = useCallback(() => {
    if (!drawingActive.current) return
    drawingActive.current = false
    onDrawEndRef.current?.()
    const t = toolRef.current
    const c = colorRef.current
    const bs = brushSizeRef.current
    const cfg = TOOL_RENDER_CONFIG[t]
    const clipId = clipRegionIdRef.current || undefined
    const clipD = clipPathDRef.current || undefined

    if (SCATTER_TOOLS.has(t)) {
      if (currentScatterD.current.length > 0) {
        onStrokeCompleteRef.current({
          type: t,
          pathD: currentScatterD.current,
          color: c,
          opacity: cfg?.opacity ?? 0.6,
          clipRegionId: clipId,
          clipPathD: clipD,
        } as ScatterStroke)
      }
      currentScatterD.current = ''
      setLiveScatterD(null)
    } else if (t === 'fuzzy') {
      if (currentPoints.current.length > 0) {
        const strands = generateFuzzyStrands(currentPoints.current, cfg?.strandCount ?? 6)
        onStrokeCompleteRef.current({
          type: 'fuzzy',
          strands,
          color: c,
          width: Math.max(1, bs * 0.15),
          opacity: cfg?.opacity ?? 0.6,
          clipRegionId: clipId,
          clipPathD: clipD,
        } as FuzzyStroke)
      }
      currentPoints.current = []
      setLivePathD(null)
    } else {
      if (currentPoints.current.length > 0) {
        const effectiveWidth = t === 'eraser' ? bs * 2 : bs
        onStrokeCompleteRef.current({
          type: t,
          points: currentPoints.current.join(' '),
          color: t === 'eraser' ? 'white' : c,
          width: effectiveWidth,
          opacity: cfg?.opacity ?? 0.8,
          strokeLinecap: cfg?.strokeLinecap ?? 'round',
          strokeLinejoin: cfg?.strokeLinejoin ?? 'round',
          strokeDasharray: cfg?.strokeDasharray,
          glowWidth: cfg?.glowWidth,
          glowOpacity: cfg?.glowOpacity,
          clipRegionId: clipId,
          clipPathD: clipD,
        } as PathStroke)
      }
      currentPoints.current = []
      setLivePathD(null)
    }
    clipRegionIdRef.current = null
    clipPathDRef.current = null
    setLiveClipId(null)
    setLiveClipPathD(null)
  }, [])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabledRef.current,
      onMoveShouldSetPanResponder: () => enabledRef.current,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { x, y } = toViewBox(evt)
        const t = toolRef.current

        // Hit test to find which region we're in
        // If touch starts outside all regions, block drawing entirely
        if (regionDataRef.current) {
          const hit = hitTestRegion(x, y, regionDataRef.current)
          if (hit) {
            clipRegionIdRef.current = hit.regionId
            clipPathDRef.current = hit.clipPathD
            setLiveClipId(hit.regionId)
            setLiveClipPathD(hit.clipPathD)
          } else {
            // Touch started outside any region — don't draw
            drawingActive.current = false
            return
          }
        }

        drawingActive.current = true
        onDrawStartRef.current?.()

        if (SCATTER_TOOLS.has(t)) {
          const d = t === 'glitter'
            ? generateGlitter(x, y, brushSizeRef.current)
            : generateScatter(x, y, brushSizeRef.current, t === 'airbrush' ? 'gaussian' : 'uniform')
          currentScatterD.current = d
          setLiveScatterD(d)
        } else {
          currentPoints.current = [`M${x.toFixed(1)},${y.toFixed(1)}`]
          setLivePathD(`M${x.toFixed(1)},${y.toFixed(1)}`)
        }
      },
      onPanResponderMove: (evt) => {
        if (!drawingActive.current) return
        if (isOutOfBounds(evt)) { finishStroke(); return }
        const { x, y } = toViewBox(evt)
        const t = toolRef.current
        if (SCATTER_TOOLS.has(t)) {
          const d = t === 'glitter'
            ? generateGlitter(x, y, brushSizeRef.current)
            : generateScatter(x, y, brushSizeRef.current, t === 'airbrush' ? 'gaussian' : 'uniform')
          currentScatterD.current += d
          setLiveScatterD(currentScatterD.current)
        } else {
          currentPoints.current.push(`L${x.toFixed(1)},${y.toFixed(1)}`)
          setLivePathD(currentPoints.current.join(' '))
        }
      },
      onPanResponderRelease: () => { finishStroke() },
      onPanResponderTerminate: () => { finishStroke() },
    })
  ).current

  // Collect unique clip paths from strokes
  const clipPaths = new Map<string, string>()
  strokes.forEach((s) => {
    const clipId = (s as any).clipRegionId
    const clipD = (s as any).clipPathD
    if (clipId && clipD) {
      clipPaths.set(clipId, clipD)
    }
  })

  // Group strokes by clip region
  const unclippedStrokes: { stroke: Stroke; idx: number }[] = []
  const clippedGroups = new Map<string, { stroke: Stroke; idx: number }[]>()

  strokes.forEach((s, i) => {
    const clipId = (s as any).clipRegionId
    if (clipId) {
      if (!clippedGroups.has(clipId)) clippedGroups.set(clipId, [])
      clippedGroups.get(clipId)!.push({ stroke: s, idx: i })
    } else {
      unclippedStrokes.push({ stroke: s, idx: i })
    }
  })

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`} style={styles.svgLayer}>
        <Defs>
          {/* Clip paths for each region */}
          {Array.from(clipPaths.entries()).map(([id, d]) => (
            <ClipPath key={`clip-${id}`} id={`clip-${id}`}>
              <Path d={d} fillRule="evenodd" />
            </ClipPath>
          ))}
          {/* Live clip path */}
          {liveClipId && liveClipPathD && (
            <ClipPath id="clip-live">
              <Path d={liveClipPathD} fillRule="evenodd" />
            </ClipPath>
          )}
        </Defs>

        {/* Render clipped stroke groups */}
        {Array.from(clippedGroups.entries()).map(([regionId, items]) => (
          <G key={`cg-${regionId}`} clipPath={`url(#clip-${regionId})`}>
            {items.map(({ stroke, idx }) => renderStroke(stroke, idx))}
          </G>
        ))}

        {/* Render unclipped strokes */}
        {unclippedStrokes.map(({ stroke, idx }) => renderStroke(stroke, idx))}

        {/* Live preview — clipped if we have a region */}
        {liveClipId ? (
          <G clipPath="url(#clip-live)">
            {renderLivePreview(livePathD, liveScatterD, tool, color, brushSize)}
          </G>
        ) : (
          renderLivePreview(livePathD, liveScatterD, tool, color, brushSize)
        )}
      </Svg>

      <View
        style={styles.touchLayer}
        {...panResponder.panHandlers}
        pointerEvents={enabled ? 'auto' : 'none'}
      />
    </View>
  )
}

function renderStroke(stroke: Stroke, index: number) {
  if ((stroke as FuzzyStroke).type === 'fuzzy') {
    const fs = stroke as FuzzyStroke
    return (
      <G key={index}>
        {fs.strands.map((d, j) => (
          <Path key={j} d={d} stroke={fs.color} strokeWidth={fs.width} fill="none"
            strokeLinecap="round" strokeLinejoin="round" opacity={fs.opacity} />
        ))}
      </G>
    )
  }

  if ((stroke as ScatterStroke).pathD !== undefined && typeof (stroke as ScatterStroke).pathD === 'string') {
    const ss = stroke as ScatterStroke
    return <Path key={index} d={ss.pathD} fill={ss.color} opacity={ss.opacity} />
  }

  const ps = stroke as PathStroke
  if (!ps.points) return null
  const cfg = TOOL_RENDER_CONFIG[ps.type]

  if (cfg?.passes) {
    return (
      <G key={index}>
        {Array.from({ length: cfg.passes }).map((_, p) => (
          <Path key={p} d={ps.points} stroke={ps.color}
            strokeWidth={ps.width + p * (cfg.passWidthInc || 3)}
            fill="none" strokeLinecap="round" strokeLinejoin="round"
            opacity={cfg.passOpacity || 0.15} />
        ))}
      </G>
    )
  }

  if (ps.glowWidth) {
    return (
      <G key={index}>
        <Path d={ps.points} stroke={ps.color} strokeWidth={ps.glowWidth}
          fill="none" strokeLinecap="round" strokeLinejoin="round"
          opacity={ps.glowOpacity || 0.25} />
        <Path d={ps.points} stroke={ps.color} strokeWidth={ps.width}
          fill="none" strokeLinecap={ps.strokeLinecap as any || 'round'}
          strokeLinejoin={ps.strokeLinejoin as any || 'round'} opacity={ps.opacity} />
      </G>
    )
  }

  return (
    <Path key={index} d={ps.points} stroke={ps.color} strokeWidth={ps.width}
      fill="none" strokeLinecap={ps.strokeLinecap as any || 'round'}
      strokeLinejoin={ps.strokeLinejoin as any || 'round'}
      strokeDasharray={ps.strokeDasharray} opacity={ps.opacity} />
  )
}

function renderLivePreview(
  livePathD: string | null,
  liveScatterD: string | null,
  tool: ToolType,
  color: string,
  brushSize: number,
) {
  const cfg = TOOL_RENDER_CONFIG[tool]

  if (liveScatterD && SCATTER_TOOLS.has(tool)) {
    return <Path d={liveScatterD} fill={color} opacity={cfg?.opacity ?? 0.6} />
  }

  if (livePathD && PATH_TOOLS.has(tool)) {
    const w = brushSize

    if (cfg?.passes) {
      return (
        <G>
          {Array.from({ length: cfg.passes }).map((_, p) => (
            <Path key={p} d={livePathD} stroke={color}
              strokeWidth={w + p * (cfg.passWidthInc || 3)}
              fill="none" strokeLinecap="round" strokeLinejoin="round"
              opacity={cfg.passOpacity || 0.15} />
          ))}
        </G>
      )
    }

    if (cfg?.glowWidth) {
      return (
        <G>
          <Path d={livePathD} stroke={color} strokeWidth={cfg.glowWidth}
            fill="none" strokeLinecap="round" strokeLinejoin="round"
            opacity={cfg.glowOpacity || 0.25} />
          <Path d={livePathD} stroke={color} strokeWidth={w}
            fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={1} />
        </G>
      )
    }

    return (
      <Path d={livePathD} stroke={color} strokeWidth={w}
        fill="none"
        strokeLinecap={cfg?.strokeLinecap || 'round'}
        strokeLinejoin={cfg?.strokeLinejoin || 'round'}
        strokeDasharray={cfg?.strokeDasharray}
        opacity={cfg?.opacity ?? 0.8} />
    )
  }

  if (livePathD && tool === 'fuzzy') {
    return (
      <Path d={livePathD} stroke={color} strokeWidth={brushSize * 0.5}
        fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
    )
  }

  return null
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0 },
  svgLayer: { position: 'absolute', top: 0, left: 0 },
  touchLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
})

export default DrawingCanvas
