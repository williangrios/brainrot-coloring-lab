// ============================================================
// MOCK — Simula o retorno da API de páginas para colorir
// Este arquivo será removido quando o backend real estiver pronto.
// O endpoint real será algo como: GET /api/v1/coloring-pages
// ============================================================

/**
 * Formato que o backend deve retornar.
 *
 * Cada página é auto-contida: traz metadados + todas as formas SVG
 * (paths e ellipses) + ordem de camadas + informações de outline.
 * O app renderiza dinamicamente a partir desse JSON, sem precisar
 * de componentes SVG hardcoded.
 */

export interface ApiRegionShape {
  id: string
  /** 'path' | 'ellipse' | 'circle' */
  type: 'path' | 'ellipse' | 'circle'
  /** SVG path d-string (only for type=path) */
  d?: string
  /** Ellipse / circle properties */
  cx?: number
  cy?: number
  rx?: number
  ry?: number
  /** Outline stroke */
  strokeWidth: number
  /** If true, this region is non-interactive (decorative outline like eyes) */
  decorative?: boolean
  /** Default fill when not colored (usually "white", or "black" for eyes) */
  defaultFill?: string
}

export interface ApiColoringPage {
  id: string
  name: string
  nameKey: string
  difficulty: 'easy' | 'medium' | 'hard'
  isPremium: boolean
  /** viewBox dimensions */
  viewBox: { width: number; height: number }
  /**
   * Ordered array of regions — render order (first = bottom, last = top).
   * The same order is used for hit testing (reversed: last = topmost priority).
   */
  regions: ApiRegionShape[]
  /** IDs of background-like regions (fill only, no brush clipping) */
  bgRegionIds: string[]
}

// ---- Fake API call ----

export async function fetchColoringPages(_baseUrl: string): Promise<ApiColoringPage[]> {
  // Simula latência de rede
  await new Promise((r) => setTimeout(r, 300))
  return MOCK_PAGES
}

// ---- Mock data: 3 sample pages ----

export const MOCK_PAGES: ApiColoringPage[] = [
  // ==================== PAGE 1: Cute Cat ====================
  {
    id: 'cat1',
    name: 'Cute Cat',
    nameKey: 'page_cute_cat',
    difficulty: 'easy',
    isPremium: false,
    viewBox: { width: 400, height: 500 },
    bgRegionIds: ['bg', 'floor'],
    regions: [
      // Background
      { id: 'bg', type: 'path', d: 'M0,0 H400 V500 H0 Z', strokeWidth: 0 },
      // Floor
      { id: 'floor', type: 'path', d: 'M0,420 C50,410 100,425 150,415 C200,425 250,410 300,420 C350,410 400,418 400,420 L400,500 L0,500 Z', strokeWidth: 2 },
      // Tail
      { id: 'tail', type: 'path', d: 'M100,320 C80,300 50,270 40,240 C30,220 40,200 55,210 C70,220 80,250 95,280 C100,290 105,305 100,320 Z', strokeWidth: 2.5 },
      // Body
      { id: 'body', type: 'path', d: 'M130,230 C110,260 100,310 110,350 C120,380 150,400 200,410 C250,400 280,380 290,350 C300,310 290,260 270,230 C250,210 150,210 130,230 Z', strokeWidth: 2.5 },
      // Belly
      { id: 'belly', type: 'path', d: 'M160,280 C155,310 165,360 200,370 C235,360 245,310 240,280 C235,260 165,260 160,280 Z', strokeWidth: 2 },
      // Left paw
      { id: 'paw-left', type: 'path', d: 'M140,390 C135,405 140,420 155,420 C170,420 175,405 170,390 Z', strokeWidth: 2 },
      // Right paw
      { id: 'paw-right', type: 'path', d: 'M230,390 C225,405 230,420 245,420 C260,420 265,405 260,390 Z', strokeWidth: 2 },
      // Head
      { id: 'head', type: 'path', d: 'M120,180 C110,140 120,90 160,70 C180,60 220,60 240,70 C280,90 290,140 280,180 C275,200 260,220 200,225 C140,220 125,200 120,180 Z', strokeWidth: 2.5 },
      // Left ear
      { id: 'ear-left', type: 'path', d: 'M130,110 C120,70 125,35 150,30 C165,28 175,55 170,80 C168,90 150,105 130,110 Z', strokeWidth: 2.5 },
      // Right ear
      { id: 'ear-right', type: 'path', d: 'M270,110 C280,70 275,35 250,30 C235,28 225,55 230,80 C232,90 250,105 270,110 Z', strokeWidth: 2.5 },
      // Inner left ear
      { id: 'ear-inner-left', type: 'path', d: 'M138,100 C132,72 137,48 153,45 C162,43 168,60 165,78 C163,85 152,97 138,100 Z', strokeWidth: 1.5 },
      // Inner right ear
      { id: 'ear-inner-right', type: 'path', d: 'M262,100 C268,72 263,48 247,45 C238,43 232,60 235,78 C237,85 248,97 262,100 Z', strokeWidth: 1.5 },
      // Nose
      { id: 'nose', type: 'path', d: 'M195,155 L200,148 L205,155 Z', strokeWidth: 1.5, defaultFill: '#ffaaaa' },
      // Mouth lines (decorative)
      { id: 'mouth', type: 'path', d: 'M200,155 C200,165 190,172 180,170 M200,155 C200,165 210,172 220,170', strokeWidth: 1.5, decorative: true, defaultFill: 'none' },
      // Left eye
      { id: 'eye-left', type: 'ellipse', cx: 170, cy: 135, rx: 12, ry: 14, strokeWidth: 2 },
      // Right eye
      { id: 'eye-right', type: 'ellipse', cx: 230, cy: 135, rx: 12, ry: 14, strokeWidth: 2 },
      // Pupils (decorative)
      { id: 'pupil-left', type: 'circle', cx: 172, cy: 138, rx: 5, ry: 5, strokeWidth: 0, decorative: true, defaultFill: 'black' },
      { id: 'pupil-right', type: 'circle', cx: 232, cy: 138, rx: 5, ry: 5, strokeWidth: 0, decorative: true, defaultFill: 'black' },
      // Whiskers (decorative)
      { id: 'whiskers', type: 'path', d: 'M160,158 L110,150 M160,162 L115,168 M240,158 L290,150 M240,162 L285,168', strokeWidth: 1.5, decorative: true, defaultFill: 'none' },
      // Yarn ball
      { id: 'yarn', type: 'circle', cx: 320, cy: 440, rx: 30, ry: 30, strokeWidth: 2 },
    ],
  },

  // ==================== PAGE 2: Rocket Ship ====================
  {
    id: 'rocket1',
    name: 'Rocket Ship',
    nameKey: 'page_rocket',
    difficulty: 'medium',
    isPremium: false,
    viewBox: { width: 400, height: 500 },
    bgRegionIds: ['space'],
    regions: [
      // Space background
      { id: 'space', type: 'path', d: 'M0,0 H400 V500 H0 Z', strokeWidth: 0 },
      // Planet
      { id: 'planet', type: 'circle', cx: 320, cy: 400, rx: 60, ry: 60, strokeWidth: 2.5 },
      // Planet ring
      { id: 'planet-ring', type: 'path', d: 'M250,410 C270,395 370,395 390,410 C370,425 270,425 250,410 Z', strokeWidth: 2 },
      // Stars (decorative)
      { id: 'stars', type: 'path', d: 'M50,50 L55,40 L60,50 L50,50 Z M120,80 L125,70 L130,80 L120,80 Z M350,60 L355,50 L360,60 L350,60 Z M80,300 L85,290 L90,300 L80,300 Z M320,180 L325,170 L330,180 L320,180 Z', strokeWidth: 1, decorative: true, defaultFill: 'white' },
      // Flame
      { id: 'flame', type: 'path', d: 'M170,420 C180,450 190,480 200,500 C210,480 220,450 230,420 C220,430 210,440 200,445 C190,440 180,430 170,420 Z', strokeWidth: 2 },
      // Rocket body
      { id: 'rocket-body', type: 'path', d: 'M165,180 C165,120 175,60 200,20 C225,60 235,120 235,180 L235,400 C235,410 165,410 165,400 Z', strokeWidth: 2.5 },
      // Nose cone
      { id: 'nose-cone', type: 'path', d: 'M175,120 C175,80 185,45 200,20 C215,45 225,80 225,120 Z', strokeWidth: 2 },
      // Window
      { id: 'window', type: 'circle', cx: 200, cy: 220, rx: 25, ry: 25, strokeWidth: 2.5 },
      // Window inner (decorative shine)
      { id: 'window-shine', type: 'path', d: 'M190,208 C195,205 200,205 205,208', strokeWidth: 1.5, decorative: true, defaultFill: 'none' },
      // Left fin
      { id: 'fin-left', type: 'path', d: 'M165,340 C140,360 120,400 110,420 C130,415 150,400 165,380 Z', strokeWidth: 2.5 },
      // Right fin
      { id: 'fin-right', type: 'path', d: 'M235,340 C260,360 280,400 290,420 C270,415 250,400 235,380 Z', strokeWidth: 2.5 },
      // Stripe 1
      { id: 'stripe1', type: 'path', d: 'M165,280 L235,280 L235,300 L165,300 Z', strokeWidth: 1.5 },
      // Stripe 2
      { id: 'stripe2', type: 'path', d: 'M165,310 L235,310 L235,330 L165,330 Z', strokeWidth: 1.5 },
      // Moon
      { id: 'moon', type: 'path', d: 'M60,150 C40,150 25,170 25,195 C25,220 40,240 60,240 C45,230 38,210 38,195 C38,175 48,158 60,150 Z', strokeWidth: 2 },
    ],
  },

  // ==================== PAGE 3: Underwater Scene ====================
  {
    id: 'ocean1',
    name: 'Under the Sea',
    nameKey: 'page_under_sea',
    difficulty: 'hard',
    isPremium: false,
    viewBox: { width: 400, height: 500 },
    bgRegionIds: ['water'],
    regions: [
      // Water background
      { id: 'water', type: 'path', d: 'M0,0 H400 V500 H0 Z', strokeWidth: 0 },
      // Sand
      { id: 'sand', type: 'path', d: 'M0,430 C40,425 80,435 120,428 C160,435 200,425 240,432 C280,425 320,435 360,428 C380,432 400,430 400,430 L400,500 L0,500 Z', strokeWidth: 2 },
      // Seaweed left
      { id: 'seaweed-left', type: 'path', d: 'M60,430 C55,400 65,370 58,340 C52,310 62,280 56,250 C62,260 68,290 64,320 C70,350 60,380 66,410 C68,420 65,430 60,430 Z', strokeWidth: 2 },
      // Seaweed right
      { id: 'seaweed-right', type: 'path', d: 'M340,430 C345,395 335,365 342,335 C348,305 338,275 345,245 C338,255 332,285 336,315 C330,345 340,375 334,405 C332,415 335,430 340,430 Z', strokeWidth: 2 },
      // Big fish body
      { id: 'fish-body', type: 'path', d: 'M100,200 C120,170 180,150 230,170 C260,180 280,200 280,220 C280,240 260,260 230,270 C180,290 120,270 100,240 C90,225 90,215 100,200 Z', strokeWidth: 2.5 },
      // Fish tail
      { id: 'fish-tail', type: 'path', d: 'M100,215 C80,195 55,180 40,170 C50,195 50,235 40,260 C55,250 80,235 100,215 Z', strokeWidth: 2.5 },
      // Fish fin top
      { id: 'fish-fin-top', type: 'path', d: 'M180,170 C185,145 200,130 210,135 C215,140 210,155 200,170 Z', strokeWidth: 2 },
      // Fish fin bottom
      { id: 'fish-fin-bottom', type: 'path', d: 'M170,270 C175,285 185,295 195,290 C200,285 195,275 185,270 Z', strokeWidth: 2 },
      // Fish belly stripe
      { id: 'fish-stripe', type: 'path', d: 'M115,225 C140,235 190,245 240,235 C250,232 260,228 265,222 C255,235 230,252 190,258 C150,258 125,245 115,225 Z', strokeWidth: 1.5 },
      // Fish eye
      { id: 'fish-eye', type: 'circle', cx: 250, cy: 210, rx: 12, ry: 12, strokeWidth: 2 },
      // Fish pupil (decorative)
      { id: 'fish-pupil', type: 'circle', cx: 253, cy: 212, rx: 5, ry: 5, strokeWidth: 0, decorative: true, defaultFill: 'black' },
      // Fish lips (decorative)
      { id: 'fish-lips', type: 'path', d: 'M278,218 C282,220 282,225 278,228', strokeWidth: 2, decorative: true, defaultFill: 'none' },
      // Small fish 1
      { id: 'small-fish1', type: 'path', d: 'M300,120 C310,110 330,108 340,115 C350,108 355,115 345,120 C355,125 350,132 340,125 C330,132 310,130 300,120 Z', strokeWidth: 2 },
      // Small fish 2
      { id: 'small-fish2', type: 'path', d: 'M70,100 C80,90 100,88 110,95 C120,88 125,95 115,100 C125,105 120,112 110,105 C100,112 80,110 70,100 Z', strokeWidth: 2 },
      // Starfish
      { id: 'starfish', type: 'path', d: 'M200,460 L205,442 L215,455 L220,435 L225,455 L235,442 L230,460 L240,468 L225,465 L230,480 L220,470 L215,485 L210,470 L200,480 L205,465 L190,468 Z', strokeWidth: 2 },
      // Shell
      { id: 'shell', type: 'path', d: 'M130,460 C125,445 135,435 145,440 C155,435 165,445 160,460 C155,470 135,470 130,460 Z', strokeWidth: 2 },
      // Bubbles (decorative)
      { id: 'bubbles', type: 'path', d: 'M290,190 m-4,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0 M295,170 m-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 M288,155 m-2,0 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0', strokeWidth: 1, decorative: true, defaultFill: 'none' },
      // Coral
      { id: 'coral', type: 'path', d: 'M280,430 C278,415 270,400 265,390 C260,400 262,410 260,420 C255,410 250,395 248,385 C244,395 246,410 244,425 C242,415 235,400 232,430 L280,430 Z', strokeWidth: 2 },
    ],
  },
]
