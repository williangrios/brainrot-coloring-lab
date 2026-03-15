// Flatten an SVG path d-string into an array of [x, y] points (polygon approximation)

type Point = [number, number]

const CURVE_STEPS = 24

function cubicBezier(p0: Point, p1: Point, p2: Point, p3: Point): Point[] {
  const pts: Point[] = []
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS
    const u = 1 - t
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
    pts.push([x, y])
  }
  return pts
}

function quadBezier(p0: Point, p1: Point, p2: Point): Point[] {
  const pts: Point[] = []
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS
    const u = 1 - t
    const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0]
    const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]
    pts.push([x, y])
  }
  return pts
}

// Convert SVG arc parameters to center parameterization, then sample points
function arcToSampledPoints(
  x1: number, y1: number,
  rx: number, ry: number,
  xRotation: number,
  largeArc: number,
  sweep: number,
  x2: number, y2: number,
): Point[] {
  // Handle degenerate cases
  if (rx === 0 || ry === 0) return [[x2, y2]]

  rx = Math.abs(rx)
  ry = Math.abs(ry)

  const phi = (xRotation * Math.PI) / 180
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)

  // Step 1: compute (x1', y1')
  const dx = (x1 - x2) / 2
  const dy = (y1 - y2) / 2
  const x1p = cosPhi * dx + sinPhi * dy
  const y1p = -sinPhi * dx + cosPhi * dy

  // Step 2: compute (cx', cy')
  let rxSq = rx * rx
  let rySq = ry * ry
  const x1pSq = x1p * x1p
  const y1pSq = y1p * y1p

  // Ensure radii are large enough
  const lambda = x1pSq / rxSq + y1pSq / rySq
  if (lambda > 1) {
    const s = Math.sqrt(lambda)
    rx *= s
    ry *= s
    rxSq = rx * rx
    rySq = ry * ry
  }

  let sq = Math.max(0, (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq))
  let root = Math.sqrt(sq)
  if (largeArc === sweep) root = -root

  const cxp = root * (rx * y1p) / ry
  const cyp = root * (-(ry * x1p) / rx)

  // Step 3: compute (cx, cy)
  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2

  // Step 4: compute angles
  const angle = (ux: number, uy: number, vx: number, vy: number) => {
    const n = Math.sqrt(ux * ux + uy * uy)
    const p = Math.sqrt(vx * vx + vy * vy)
    const sign = ux * vy - uy * vx < 0 ? -1 : 1
    const dot = (ux * vx + uy * vy) / (n * p)
    return sign * Math.acos(Math.max(-1, Math.min(1, dot)))
  }

  const theta1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
  let dtheta = angle(
    (x1p - cxp) / rx, (y1p - cyp) / ry,
    (-x1p - cxp) / rx, (-y1p - cyp) / ry
  )

  if (sweep === 0 && dtheta > 0) dtheta -= 2 * Math.PI
  if (sweep === 1 && dtheta < 0) dtheta += 2 * Math.PI

  // Sample points along the arc
  const steps = Math.max(CURVE_STEPS, Math.ceil(Math.abs(dtheta) / (Math.PI / 12)))
  const pts: Point[] = []
  for (let i = 1; i <= steps; i++) {
    const t = theta1 + (dtheta * i) / steps
    const xr = rx * Math.cos(t)
    const yr = ry * Math.sin(t)
    pts.push([cosPhi * xr - sinPhi * yr + cx, sinPhi * xr + cosPhi * yr + cy])
  }
  return pts
}

export function flattenSvgPath(d: string): Point[] {
  const points: Point[] = []
  let cx = 0, cy = 0
  let startX = 0, startY = 0

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
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            cx = num()
            points.push([cx, cy])
          }
          break
        case 'h':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            cx += num()
            points.push([cx, cy])
          }
          break
        case 'V':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            cy = num()
            points.push([cx, cy])
          }
          break
        case 'v':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            cy += num()
            points.push([cx, cy])
          }
          break
        case 'C':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const x1 = num(), y1 = num()
            const x2 = num(), y2 = num()
            const x = num(), y = num()
            points.push(...cubicBezier([cx, cy], [x1, y1], [x2, y2], [x, y]))
            cx = x; cy = y
          }
          break
        case 'c':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const x1 = cx + num(), y1 = cy + num()
            const x2 = cx + num(), y2 = cy + num()
            const x = cx + num(), y = cy + num()
            points.push(...cubicBezier([cx, cy], [x1, y1], [x2, y2], [x, y]))
            cx = x; cy = y
          }
          break
        case 'Q':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const x1 = num(), y1 = num()
            const x = num(), y = num()
            points.push(...quadBezier([cx, cy], [x1, y1], [x, y]))
            cx = x; cy = y
          }
          break
        case 'q':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const x1 = cx + num(), y1 = cy + num()
            const x = cx + num(), y = cy + num()
            points.push(...quadBezier([cx, cy], [x1, y1], [x, y]))
            cx = x; cy = y
          }
          break
        case 'A':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const arx = num(), ary = num()
            const xRot = num(), la = num(), sw = num()
            const ex = num(), ey = num()
            points.push(...arcToSampledPoints(cx, cy, arx, ary, xRot, la, sw, ex, ey))
            cx = ex; cy = ey
          }
          break
        case 'a':
          while (i < tokens.length && /^[-+\d.]/.test(tokens[i])) {
            const arx = num(), ary = num()
            const xRot = num(), la = num(), sw = num()
            const ex = cx + num(), ey = cy + num()
            points.push(...arcToSampledPoints(cx, cy, arx, ary, xRot, la, sw, ex, ey))
            cx = ex; cy = ey
          }
          break
        case 'Z': case 'z':
          cx = startX; cy = startY
          break
      }
    } else {
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
