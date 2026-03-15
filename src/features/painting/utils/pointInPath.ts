// Flatten an SVG path d-string into an array of [x, y] points (polygon approximation)
// Supports: M, L, H, V, C, Q, A, Z (absolute only — our SVG data uses absolute coords)

type Point = [number, number]

function cubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, steps: number): Point[] {
  const pts: Point[] = []
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
    pts.push([x, y])
  }
  return pts
}

function quadBezier(p0: Point, p1: Point, p2: Point, steps: number): Point[] {
  const pts: Point[] = []
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0]
    const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]
    pts.push([x, y])
  }
  return pts
}

function arcToPoints(
  cx: number, cy: number, rx: number, ry: number,
  startAngle: number, endAngle: number, steps: number
): Point[] {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / steps)
    pts.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)])
  }
  return pts
}

export function flattenSvgPath(d: string): Point[] {
  const points: Point[] = []
  let cx = 0, cy = 0
  let startX = 0, startY = 0

  // Tokenize: split into commands and numbers
  const tokens = d.match(/[MLHVCQAZmlhvcqaz]|[-+]?[\d]*\.?\d+(?:[eE][-+]?\d+)?/g)
  if (!tokens) return points

  let i = 0
  const num = () => parseFloat(tokens[i++])

  while (i < tokens.length) {
    const cmd = tokens[i]
    if (/^[MLHVCQAZmlhvcqaz]$/.test(cmd)) {
      i++
      switch (cmd) {
        case 'M':
          cx = num(); cy = num()
          startX = cx; startY = cy
          points.push([cx, cy])
          // Implicit L after M
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            cx = num(); cy = num()
            points.push([cx, cy])
          }
          break
        case 'm':
          cx += num(); cy += num()
          startX = cx; startY = cy
          points.push([cx, cy])
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            cx += num(); cy += num()
            points.push([cx, cy])
          }
          break
        case 'L':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            cx = num(); cy = num()
            points.push([cx, cy])
          }
          break
        case 'l':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            cx += num(); cy += num()
            points.push([cx, cy])
          }
          break
        case 'H':
          cx = num()
          points.push([cx, cy])
          break
        case 'h':
          cx += num()
          points.push([cx, cy])
          break
        case 'V':
          cy = num()
          points.push([cx, cy])
          break
        case 'v':
          cy += num()
          points.push([cx, cy])
          break
        case 'C':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const x1 = num(), y1 = num()
            const x2 = num(), y2 = num()
            const x = num(), y = num()
            const bezPts = cubicBezier([cx, cy], [x1, y1], [x2, y2], [x, y], 8)
            points.push(...bezPts)
            cx = x; cy = y
          }
          break
        case 'c':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const x1 = cx + num(), y1 = cy + num()
            const x2 = cx + num(), y2 = cy + num()
            const x = cx + num(), y = cy + num()
            const bezPts = cubicBezier([cx, cy], [x1, y1], [x2, y2], [x, y], 8)
            points.push(...bezPts)
            cx = x; cy = y
          }
          break
        case 'Q':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const x1 = num(), y1 = num()
            const x = num(), y = num()
            const qPts = quadBezier([cx, cy], [x1, y1], [x, y], 8)
            points.push(...qPts)
            cx = x; cy = y
          }
          break
        case 'a': case 'A': {
          // Simplified arc handling — approximate as ellipse segment
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const rx = num(), ry = num()
            const _xRotation = num()
            const _largeArc = num()
            const _sweep = num()
            const ex = cmd === 'A' ? num() : cx + num()
            const ey = cmd === 'A' ? num() : cy + num()
            // Simple line approximation for arcs (good enough for hit testing)
            const midX = (cx + ex) / 2
            const midY = (cy + ey) / 2 - Math.max(rx, ry) * 0.5
            points.push([midX, midY], [ex, ey])
            cx = ex; cy = ey
          }
          break
        }
        case 'Z': case 'z':
          cx = startX; cy = startY
          break
      }
    } else {
      // Number without command — skip
      i++
    }
  }

  return points
}

// Ray-casting point-in-polygon
export function pointInPolygon(x: number, y: number, polygon: Point[]): boolean {
  let inside = false
  const n = polygon.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }
  return inside
}

// Check if point is inside an ellipse
export function pointInEllipse(
  x: number, y: number,
  cx: number, cy: number, rx: number, ry: number
): boolean {
  const dx = (x - cx) / rx
  const dy = (y - cy) / ry
  return dx * dx + dy * dy <= 1
}

// Generate an ellipse path d-string for ClipPath use
export function ellipseToPath(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 -${rx * 2},0`
}
