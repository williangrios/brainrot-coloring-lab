import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { View, PanResponder, StyleSheet } from 'react-native'
import Svg, { Path, Defs, G, ClipPath, Mask, Rect, Circle as SvgCircle, Ellipse as SvgEllipse } from 'react-native-svg'
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

interface Point { x: number; y: number }

// Minimum squared distance between consecutive points (skip redundant touch events)
const MIN_DIST_SQ = 4 // ~2px in viewBox space — imperceptible, saves tons of points

// Douglas-Peucker path simplification — removes points that don't affect the shape
function simplifyPoints(pts: Point[], tolerance: number): Point[] {
  if (pts.length <= 2) return pts

  // Find the point farthest from the line between first and last
  const first = pts[0]
  const last = pts[pts.length - 1]
  let maxDist = 0
  let maxIdx = 0

  const dx = last.x - first.x
  const dy = last.y - first.y
  const lenSq = dx * dx + dy * dy

  for (let i = 1; i < pts.length - 1; i++) {
    let dist: number
    if (lenSq === 0) {
      // first and last are the same point
      const ex = pts[i].x - first.x
      const ey = pts[i].y - first.y
      dist = Math.sqrt(ex * ex + ey * ey)
    } else {
      // Perpendicular distance from point to line
      const t = ((pts[i].x - first.x) * dx + (pts[i].y - first.y) * dy) / lenSq
      const projX = first.x + t * dx
      const projY = first.y + t * dy
      const ex = pts[i].x - projX
      const ey = pts[i].y - projY
      dist = Math.sqrt(ex * ex + ey * ey)
    }
    if (dist > maxDist) {
      maxDist = dist
      maxIdx = i
    }
  }

  if (maxDist > tolerance) {
    const left = simplifyPoints(pts.slice(0, maxIdx + 1), tolerance)
    const right = simplifyPoints(pts.slice(maxIdx), tolerance)
    return left.slice(0, -1).concat(right)
  }

  return [first, last]
}

// Build smooth SVG path using quadratic Bézier curves through midpoints
function buildSmoothPath(pts: Point[]): string {
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`

  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`

  if (pts.length === 2) {
    d += `L${pts[1].x.toFixed(1)},${pts[1].y.toFixed(1)}`
    return d
  }

  // First segment: line to midpoint between p0 and p1
  const mid0x = (pts[0].x + pts[1].x) / 2
  const mid0y = (pts[0].y + pts[1].y) / 2
  d += `L${mid0x.toFixed(1)},${mid0y.toFixed(1)}`

  // Middle segments: quadratic Bézier with actual point as control, midpoint as endpoint
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i].x + pts[i + 1].x) / 2
    const midY = (pts[i].y + pts[i + 1].y) / 2
    d += `Q${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)} ${midX.toFixed(1)},${midY.toFixed(1)}`
  }

  // Last segment: line to final point
  const last = pts[pts.length - 1]
  d += `L${last.x.toFixed(1)},${last.y.toFixed(1)}`

  return d
}

// Incremental smooth path: append only the new tail (from prevLen onward)
function appendSmoothPath(pts: Point[], prevD: string, prevLen: number): string {
  const n = pts.length
  if (n <= prevLen) return prevD
  if (n <= 1) return `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`

  // If prevLen < 2, just rebuild (rare: only on first move)
  if (prevLen < 2) return buildSmoothPath(pts)

  // We need to redo from prevLen-1 because the last segment changes
  // Strip the old tail (last L segment) and recompute from prevLen-1
  // For simplicity and correctness, rebuild the tail from the midpoint before prevLen-1
  let d = prevD

  // Remove the trailing "L..." (the old last-point line segment)
  const lastL = d.lastIndexOf('L')
  if (lastL > 0 && prevLen >= 3) {
    d = d.substring(0, lastL)
  }

  // Re-emit from prevLen-1 (the last control point that was "final" before)
  const start = Math.max(1, prevLen - 1)
  for (let i = start; i < n - 1; i++) {
    const midX = (pts[i].x + pts[i + 1].x) / 2
    const midY = (pts[i].y + pts[i + 1].y) / 2
    d += `Q${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)} ${midX.toFixed(1)},${midY.toFixed(1)}`
  }

  // Final point
  const last = pts[n - 1]
  d += `L${last.x.toFixed(1)},${last.y.toFixed(1)}`

  return d
}

function generateFuzzyStrands(mainPoints: Point[], strandCount: number): string[] {
  const strands: string[] = []
  for (let s = 0; s < strandCount; s++) {
    const offsetX = (Math.random() - 0.5) * 12
    const offsetY = (Math.random() - 0.5) * 12
    const strandPts = mainPoints.map((p) => ({
      x: p.x + offsetX + (Math.random() - 0.5) * 4,
      y: p.y + offsetY + (Math.random() - 0.5) * 4,
    }))
    strands.push(buildSmoothPath(strandPts))
  }
  return strands
}

const SCATTER_TOOLS = new Set(['spray', 'glitter', 'airbrush'])
const PATH_TOOLS = new Set(['brush', 'eraser', 'crayon', 'thick_pencil', 'laser', 'neon', 'watercolor', 'flat_brush', 'marker', 'fine_tip'])

// --- Stroke rendering helpers (used by both committed layer and live preview) ---

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

// --- Committed strokes layer (React.memo — only re-renders when strokes change) ---

interface CommittedStrokesLayerProps {
  strokes: Stroke[]
  regionData?: PageRegionData | null
  width: number
  height: number
  buildMaskElements: (regionId: string) => React.ReactNode[] | null
}

const CommittedStrokesLayer = React.memo<CommittedStrokesLayerProps>(({ strokes, regionData, width, height, buildMaskElements }) => {
  if (strokes.length === 0) return null

  // Group strokes by clipRegionId
  const groups: Record<string, { indices: number[] }> = {}
  const unclipped: number[] = []

  strokes.forEach((s, i) => {
    const clipId = (s as any).clipRegionId as string | undefined
    if (clipId) {
      if (!groups[clipId]) groups[clipId] = { indices: [] }
      groups[clipId].indices.push(i)
    } else {
      unclipped.push(i)
    }
  })

  const regionIds = Object.keys(groups)

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`} style={committedStyles.svgLayer}>
      <Defs>
        {regionIds.map((rid) => {
          const maskEls = buildMaskElements(rid)
          if (!maskEls) return null
          return (
            <Mask key={rid} id={`mask-c-${rid}`} maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
              {maskEls}
            </Mask>
          )
        })}
      </Defs>

      {/* Unclipped strokes */}
      {unclipped.length > 0 && (
        <G>
          {unclipped.map((i) => renderStroke(strokes[i], i))}
        </G>
      )}

      {/* Clipped stroke groups */}
      {regionIds.map((rid) => (
        <G key={rid} mask={`url(#mask-c-${rid})`}>
          {groups[rid].indices.map((i) => renderStroke(strokes[i], i))}
        </G>
      ))}
    </Svg>
  )
})

const committedStyles = StyleSheet.create({
  svgLayer: { position: 'absolute' as const, top: 0, left: 0 },
})

// Hit test: find which region contains the point (topmost wins)
function hitTestRegion(
  x: number, y: number,
  regionData: PageRegionData
): { regionId: string; clipPathD: string } | null {
  const { paths, ellipses, hitOrder } = regionData

  // Test in reverse order (topmost first)
  for (let i = hitOrder.length - 1; i >= 0; i--) {
    const id = hitOrder[i]

    if (ellipses[id]) {
      const e = ellipses[id]
      if (pointInEllipse(x, y, e.cx, e.cy, e.rx, e.ry)) {
        return { regionId: id, clipPathD: ellipseToPath(e.cx, e.cy, e.rx, e.ry) }
      }
    }

    if (paths[id]) {
      const polygon = flattenSvgPath(paths[id])
      if (polygon.length >= 3 && pointInPolygon(x, y, polygon)) {
        return { regionId: id, clipPathD: paths[id] }
      }
    }
  }

  return null
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width, height, tool, color, brushSize, strokes, onStrokeComplete, enabled, regionData, onDrawStart, onDrawEnd,
}) => {
  const currentPoints = useRef<Point[]>([])
  const currentPathD = useRef<string>('')  // cached smooth path string
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

  // Emit the current segment as a completed stroke (without ending the gesture)
  const emitSegment = useCallback(() => {
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
    } else if (t === 'fuzzy') {
      if (currentPoints.current.length > 1) {
        const simplified = simplifyPoints(currentPoints.current, 0.8)
        const strands = generateFuzzyStrands(simplified, cfg?.strandCount ?? 6)
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
      currentPathD.current = ''
    } else {
      if (currentPoints.current.length > 1) {
        // Simplify path before storing — reduces SVG complexity for committed strokes
        const simplified = simplifyPoints(currentPoints.current, 0.8)
        const effectiveWidth = t === 'eraser' ? bs * 2 : bs
        onStrokeCompleteRef.current({
          type: t,
          points: buildSmoothPath(simplified),
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
      currentPathD.current = ''
    }
  }, [])

  const finishStroke = useCallback(() => {
    if (!drawingActive.current) return
    drawingActive.current = false
    onDrawEndRef.current?.()
    emitSegment()
    currentScatterD.current = ''
    currentPoints.current = []
    currentPathD.current = ''
    setLivePathD(null)
    setLiveScatterD(null)
    clipRegionIdRef.current = null
    clipPathDRef.current = null
    setLiveClipId(null)
    setLiveClipPathD(null)
  }, [emitSegment])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabledRef.current,
      onMoveShouldSetPanResponder: () => enabledRef.current,
      onPanResponderTerminationRequest: () => !drawingActive.current,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { x, y } = toViewBox(evt)
        const t = toolRef.current

        // Hit test: every region gets a mask (no bgRegions exception)
        if (regionDataRef.current) {
          const hit = hitTestRegion(x, y, regionDataRef.current)
          if (hit) {
            clipRegionIdRef.current = hit.regionId
            clipPathDRef.current = hit.clipPathD
            setLiveClipId(hit.regionId)
            setLiveClipPathD(hit.clipPathD)
          } else {
            clipRegionIdRef.current = null
            clipPathDRef.current = null
            setLiveClipId(null)
            setLiveClipPathD(null)
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
          currentPoints.current = [{ x, y }]
          const d = `M${x.toFixed(1)},${y.toFixed(1)}`
          currentPathD.current = d
          setLivePathD(d)
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
          // Skip points too close to the previous one (reduces work significantly)
          const pts = currentPoints.current
          if (pts.length > 0) {
            const prev = pts[pts.length - 1]
            const dx = x - prev.x
            const dy = y - prev.y
            if (dx * dx + dy * dy < MIN_DIST_SQ) return
          }
          const prevLen = pts.length
          pts.push({ x, y })
          const d = appendSmoothPath(pts, currentPathD.current, prevLen)
          currentPathD.current = d
          setLivePathD(d)
        }
      },
      onPanResponderRelease: () => { finishStroke() },
      onPanResponderTerminate: () => { finishStroke() },
    })
  ).current

  // Build mask elements for a single region
  const buildMaskElements = useCallback((regionId: string): React.ReactNode[] | null => {
    if (!regionData) return null
    const { paths, ellipses, hitOrder } = regionData
    const index = hitOrder.indexOf(regionId)
    if (index === -1) return null

    const elements: React.ReactNode[] = []

    // White: this region's shape
    if (ellipses[regionId]) {
      const e = ellipses[regionId]
      elements.push(<SvgEllipse key="w" cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
        fill="white" stroke="white" strokeWidth={3} />)
    } else if (paths[regionId]) {
      elements.push(<Path key="w" d={paths[regionId]} fill="white" stroke="white" strokeWidth={3} />)
    }

    // Black: all regions with higher hitOrder index
    for (let j = index + 1; j < hitOrder.length; j++) {
      const subId = hitOrder[j]
      if (ellipses[subId]) {
        const e = ellipses[subId]
        elements.push(<SvgEllipse key={subId} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
          fill="black" stroke="black" strokeWidth={3} />)
      } else if (paths[subId]) {
        elements.push(<Path key={subId} d={paths[subId]} fill="black" stroke="black" strokeWidth={3} />)
      }
    }

    return elements
  }, [regionData])

  // Live mask elements (stable during drawing — only changes when liveClipId changes)
  const liveMaskElements = useMemo(() => {
    if (!liveClipId) return null
    return buildMaskElements(liveClipId)
  }, [liveClipId, buildMaskElements])

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Layer A: Committed strokes — only re-renders when strokes change */}
      <CommittedStrokesLayer
        strokes={strokes}
        regionData={regionData}
        width={width}
        height={height}
        buildMaskElements={buildMaskElements}
      />

      {/* Layer B: Live preview — lightweight, re-renders during drawing */}
      {(livePathD || liveScatterD) && (
        <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`} style={styles.svgLayer}>
          {liveMaskElements && (
            <Defs>
              <Mask id="mask-live" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
                {liveMaskElements}
              </Mask>
            </Defs>
          )}
          <G mask={liveMaskElements ? 'url(#mask-live)' : undefined}>
            {renderLivePreview(livePathD, liveScatterD, tool, color, brushSize)}
          </G>
        </Svg>
      )}

      <View
        style={styles.touchLayer}
        {...panResponder.panHandlers}
        pointerEvents={enabled ? 'auto' : 'none'}
      />
    </View>
  )
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
