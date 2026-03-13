import React, { useRef, useState, useCallback, useEffect } from 'react'
import { View, PanResponder, StyleSheet } from 'react-native'
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg'
import { ToolType, TOOL_RENDER_CONFIG } from '../data/tools'

// All coordinates are in viewBox space (0-400 x 0-500)
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
  clipPathD?: string
  // Glow effect
  glowWidth?: number
  glowOpacity?: number
}

export interface ScatterStroke {
  type: string
  pathD: string
  color: string
  opacity: number
  clipPathD?: string
}

export interface FuzzyStroke {
  type: 'fuzzy'
  strands: string[]
  color: string
  width: number
  opacity: number
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
  activeClipPathD?: string // from hit-test on region
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
      // Box-Muller for gaussian distribution
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
    const strand = mainPoints.map((p, i) => {
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

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  tool,
  color,
  brushSize,
  strokes,
  onStrokeComplete,
  enabled,
  activeClipPathD,
}) => {
  const currentPoints = useRef<string[]>([])
  const currentScatterD = useRef<string>('')
  const [livePathD, setLivePathD] = useState<string | null>(null)
  const [liveScatterD, setLiveScatterD] = useState<string | null>(null)

  const toolRef = useRef(tool)
  const colorRef = useRef(color)
  const brushSizeRef = useRef(brushSize)
  const enabledRef = useRef(enabled)
  const onStrokeCompleteRef = useRef(onStrokeComplete)
  const widthRef = useRef(width)
  const heightRef = useRef(height)
  const clipPathDRef = useRef(activeClipPathD)

  useEffect(() => { toolRef.current = tool }, [tool])
  useEffect(() => { colorRef.current = color }, [color])
  useEffect(() => { brushSizeRef.current = brushSize }, [brushSize])
  useEffect(() => { enabledRef.current = enabled }, [enabled])
  useEffect(() => { onStrokeCompleteRef.current = onStrokeComplete }, [onStrokeComplete])
  useEffect(() => { widthRef.current = width }, [width])
  useEffect(() => { heightRef.current = height }, [height])
  useEffect(() => { clipPathDRef.current = activeClipPathD }, [activeClipPathD])

  const isOutOfBounds = useCallback((evt: any) => {
    const { locationX, locationY } = evt.nativeEvent
    const margin = 5
    return locationX < -margin || locationX > widthRef.current + margin ||
           locationY < -margin || locationY > heightRef.current + margin
  }, [])

  // Convert pixel coords to viewBox coords
  const toViewBox = useCallback((evt: any) => {
    const px = Math.max(0, Math.min(widthRef.current, evt.nativeEvent.locationX))
    const py = Math.max(0, Math.min(heightRef.current, evt.nativeEvent.locationY))
    const x = (px / widthRef.current) * VB_W
    const y = (py / heightRef.current) * VB_H
    return { x, y }
  }, [])

  const drawingActive = useRef(false)

  const finishStroke = useCallback(() => {
    if (!drawingActive.current) return
    drawingActive.current = false
    const t = toolRef.current
    const c = colorRef.current
    const bs = brushSizeRef.current
    const clip = clipPathDRef.current
    const cfg = TOOL_RENDER_CONFIG[t]

    if (SCATTER_TOOLS.has(t)) {
      if (currentScatterD.current.length > 0) {
        onStrokeCompleteRef.current({
          type: t,
          pathD: currentScatterD.current,
          color: c,
          opacity: cfg?.opacity ?? 0.6,
          clipPathD: clip,
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
          clipPathD: clip,
        } as FuzzyStroke)
      }
      currentPoints.current = []
      setLivePathD(null)
    } else {
      // Path-based tools
      if (currentPoints.current.length > 0) {
        const effectiveWidth = t === 'eraser' ? bs * 2 : (cfg ? bs : bs)
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
          clipPathD: clip,
        } as PathStroke)
      }
      currentPoints.current = []
      setLivePathD(null)
    }
  }, [])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabledRef.current,
      onMoveShouldSetPanResponder: () => enabledRef.current,
      onPanResponderGrant: (evt) => {
        drawingActive.current = true
        const { x, y } = toViewBox(evt)
        const t = toolRef.current
        if (SCATTER_TOOLS.has(t)) {
          const scatterType = t === 'airbrush' ? 'gaussian' : 'uniform'
          const gen = t === 'glitter' ? generateGlitter : generateScatter
          const d = t === 'glitter'
            ? generateGlitter(x, y, brushSizeRef.current)
            : generateScatter(x, y, brushSizeRef.current, scatterType)
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
          const scatterType = t === 'airbrush' ? 'gaussian' : 'uniform'
          const d = t === 'glitter'
            ? generateGlitter(x, y, brushSizeRef.current)
            : generateScatter(x, y, brushSizeRef.current, scatterType)
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

  return (
    <View
      style={[styles.overlay, { width, height }]}
      {...(enabled ? panResponder.panHandlers : {})}
      pointerEvents={enabled ? 'auto' : 'none'}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Defs>
          {/* Generate clip paths for strokes that need them */}
          {strokes.map((stroke, i) => {
            const clipD = (stroke as any).clipPathD
            if (!clipD) return null
            return (
              <ClipPath key={`clip-s-${i}`} id={`clip-s-${i}`}>
                <Path d={clipD} />
              </ClipPath>
            )
          })}
          {/* Live clip path */}
          {activeClipPathD && (
            <ClipPath id="clip-live">
              <Path d={activeClipPathD} />
            </ClipPath>
          )}
        </Defs>

        {/* Rendered previous strokes */}
        {strokes.map((stroke, i) => renderStroke(stroke, i))}

        {/* Live preview */}
        {renderLivePreview(livePathD, liveScatterD, tool, color, brushSize, activeClipPathD)}
      </Svg>
    </View>
  )
}

function renderStroke(stroke: Stroke, index: number) {
  const clipD = (stroke as any).clipPathD
  const clipProp = clipD ? `url(#clip-s-${index})` : undefined

  if ((stroke as FuzzyStroke).type === 'fuzzy') {
    const fs = stroke as FuzzyStroke
    return (
      <G key={index} clipPath={clipProp}>
        {fs.strands.map((d, j) => (
          <Path key={j} d={d} stroke={fs.color} strokeWidth={fs.width} fill="none"
            strokeLinecap="round" strokeLinejoin="round" opacity={fs.opacity} />
        ))}
      </G>
    )
  }

  if ((stroke as ScatterStroke).pathD !== undefined && typeof (stroke as ScatterStroke).pathD === 'string') {
    const ss = stroke as ScatterStroke
    return (
      <G key={index} clipPath={clipProp}>
        <Path d={ss.pathD} fill={ss.color} opacity={ss.opacity} />
      </G>
    )
  }

  const ps = stroke as PathStroke
  if (!ps.points) return null
  const cfg = TOOL_RENDER_CONFIG[ps.type]

  // Watercolor: multi-pass
  if (cfg?.passes) {
    return (
      <G key={index} clipPath={clipProp}>
        {Array.from({ length: cfg.passes }).map((_, p) => (
          <Path key={p} d={ps.points} stroke={ps.color}
            strokeWidth={ps.width + p * (cfg.passWidthInc || 3)}
            fill="none" strokeLinecap="round" strokeLinejoin="round"
            opacity={cfg.passOpacity || 0.15} />
        ))}
      </G>
    )
  }

  // Glow tools (laser, neon)
  if (ps.glowWidth) {
    return (
      <G key={index} clipPath={clipProp}>
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
    <G key={index} clipPath={clipProp}>
      <Path
        d={ps.points}
        stroke={ps.color}
        strokeWidth={ps.width}
        fill="none"
        strokeLinecap={ps.strokeLinecap as any || 'round'}
        strokeLinejoin={ps.strokeLinejoin as any || 'round'}
        strokeDasharray={ps.strokeDasharray}
        opacity={ps.opacity}
      />
    </G>
  )
}

function renderLivePreview(
  livePathD: string | null,
  liveScatterD: string | null,
  tool: ToolType,
  color: string,
  brushSize: number,
  clipPathD?: string,
) {
  const clipProp = clipPathD ? 'url(#clip-live)' : undefined
  const cfg = TOOL_RENDER_CONFIG[tool]

  if (liveScatterD && SCATTER_TOOLS.has(tool)) {
    return (
      <G clipPath={clipProp}>
        <Path d={liveScatterD} fill={color} opacity={cfg?.opacity ?? 0.6} />
      </G>
    )
  }

  if (livePathD && PATH_TOOLS.has(tool)) {
    const w = tool === 'eraser' ? brushSize * 2 : brushSize
    const strokeColor = tool === 'eraser' ? 'white' : color

    if (cfg?.passes) {
      return (
        <G clipPath={clipProp}>
          {Array.from({ length: cfg.passes }).map((_, p) => (
            <Path key={p} d={livePathD} stroke={strokeColor}
              strokeWidth={w + p * (cfg.passWidthInc || 3)}
              fill="none" strokeLinecap="round" strokeLinejoin="round"
              opacity={cfg.passOpacity || 0.15} />
          ))}
        </G>
      )
    }

    if (cfg?.glowWidth) {
      return (
        <G clipPath={clipProp}>
          <Path d={livePathD} stroke={strokeColor} strokeWidth={cfg.glowWidth}
            fill="none" strokeLinecap="round" strokeLinejoin="round"
            opacity={cfg.glowOpacity || 0.25} />
          <Path d={livePathD} stroke={strokeColor} strokeWidth={w}
            fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={1} />
        </G>
      )
    }

    return (
      <G clipPath={clipProp}>
        <Path d={livePathD} stroke={strokeColor} strokeWidth={w}
          fill="none"
          strokeLinecap={cfg?.strokeLinecap || 'round'}
          strokeLinejoin={cfg?.strokeLinejoin || 'round'}
          strokeDasharray={cfg?.strokeDasharray}
          opacity={cfg?.opacity ?? 0.8} />
      </G>
    )
  }

  // Fuzzy live preview: just show a single path
  if (livePathD && tool === 'fuzzy') {
    return (
      <G clipPath={clipProp}>
        <Path d={livePathD} stroke={color} strokeWidth={brushSize * 0.5}
          fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
      </G>
    )
  }

  return null
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0 },
})

export default DrawingCanvas
