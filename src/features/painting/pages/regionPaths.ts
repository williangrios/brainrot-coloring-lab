// SVG path d-strings for each region of each page, used for hit testing and clipping
// Order matters: later entries are "on top" and get priority in hit testing

export const BUTTERFLY_PATHS: Record<string, string> = {
  'bg': 'M0,0 H400 V500 H0 Z',
  'grass': 'M0,470 C30,460 60,470 90,460 C120,470 150,460 180,470 C210,460 240,470 270,460 C300,470 330,460 360,470 C390,460 400,465 400,470 L400,500 L0,500 Z',
  'wing-upper-left': 'M200,200 C180,160 120,100 60,120 C20,135 10,180 30,220 C50,260 120,260 160,240 C180,230 195,215 200,200 Z',
  'wing-upper-right': 'M200,200 C220,160 280,100 340,120 C380,135 390,180 370,220 C350,260 280,260 240,240 C220,230 205,215 200,200 Z',
  'wing-lower-left': 'M200,220 C185,240 140,290 90,300 C50,310 25,290 20,260 C15,230 40,210 80,210 C130,210 175,215 200,220 Z',
  'wing-lower-right': 'M200,220 C215,240 260,290 310,300 C350,310 375,290 380,260 C385,230 360,210 320,210 C270,210 225,215 200,220 Z',
  'spot-left-upper': 'M120,170 C130,150 155,145 165,160 C175,175 165,195 150,195 C135,195 115,185 120,170 Z',
  'spot-right-upper': 'M280,170 C270,150 245,145 235,160 C225,175 235,195 250,195 C265,195 285,185 280,170 Z',
  'body': 'M195,160 L205,160 L208,340 C208,350 192,350 192,340 Z',
  'head': 'M200,150 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0',
  'flower1-petal1': 'M70,420 C65,400 80,390 90,400 C100,390 115,400 110,420 C115,430 100,445 90,435 C80,445 65,430 70,420 Z',
  'flower2-petal1': 'M300,440 C295,420 310,410 320,420 C330,410 345,420 340,440 C345,450 330,465 320,455 C310,465 295,450 300,440 Z',
}

// Ellipses are stored as center + radii for easier hit testing
export const BUTTERFLY_ELLIPSES: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  'spot-left-lower': { cx: 100, cy: 255, rx: 25, ry: 18 },
  'spot-right-lower': { cx: 300, cy: 255, rx: 25, ry: 18 },
  'flower1-center': { cx: 90, cy: 418, rx: 8, ry: 8 },
  'flower2-center': { cx: 320, cy: 438, rx: 8, ry: 8 },
  'antenna-left-tip': { cx: 155, cy: 85, rx: 5, ry: 5 },
  'antenna-right-tip': { cx: 245, cy: 85, rx: 5, ry: 5 },
}

export const DINO_PATHS: Record<string, string> = {
  'sky': 'M0,0 H400 V350 H0 Z',
  'ground': 'M0,350 C50,340 100,355 150,345 C200,355 250,340 300,350 C350,340 400,350 400,345 L400,500 L0,500 Z',
  'dino-tail': 'M120,280 C100,290 70,295 50,280 C30,265 20,240 30,225 C40,215 55,220 60,235 C65,250 80,270 120,275 Z',
  'dino-body': 'M120,280 C100,260 90,230 100,200 C110,180 130,170 150,170 L250,170 C270,170 280,180 285,195 C290,210 295,240 280,270 C270,290 250,310 230,320 L170,320 C150,310 130,300 120,280 Z',
  'dino-belly': 'M140,260 C135,240 140,220 155,210 C170,200 200,200 220,210 C240,220 250,240 245,260 C240,280 220,295 200,300 C175,300 150,285 140,260 Z',
  'spike1': 'M160,170 L170,140 L180,170 Z',
  'spike2': 'M185,170 L198,132 L210,170 Z',
  'spike3': 'M215,170 L230,138 L245,170 Z',
  'dino-head': 'M250,170 C260,150 280,130 310,125 C340,120 360,130 365,150 C370,170 360,190 340,200 C320,210 290,210 270,200 C255,190 250,180 250,170 Z',
  'dino-jaw': 'M310,180 C320,185 340,190 355,185 C365,180 370,170 365,165 C355,175 340,178 325,175 Z',
  'leg-back': 'M160,315 L155,360 C155,370 165,370 165,360 L168,315 Z',
  'foot-back': 'M150,358 C145,370 150,380 160,380 C170,380 175,370 170,358 Z',
  'leg-front': 'M240,310 L245,360 C245,370 255,370 255,360 L252,310 Z',
  'foot-front': 'M240,358 C235,370 240,380 250,380 C260,380 265,370 260,358 Z',
  'cloud1': 'M250,70 C245,50 260,35 280,40 C290,25 315,25 325,40 C340,35 355,45 352,62 C365,70 360,90 345,90 L260,90 C245,90 240,80 250,70 Z',
  'cloud2': 'M140,110 C137,95 148,85 162,88 C168,78 185,78 192,88 C202,84 213,92 210,104 C218,108 215,122 205,122 L148,122 C138,122 134,115 140,110 Z',
}

export const DINO_ELLIPSES: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  'sun': { cx: 60, cy: 60, rx: 35, ry: 35 },
  'dino-eye-outer': { cx: 320, cy: 148, rx: 14, ry: 14 },
}

// Hit test order: later = on top (higher priority)
export const BUTTERFLY_HIT_ORDER = [
  'bg', 'grass',
  'wing-upper-left', 'wing-upper-right', 'wing-lower-left', 'wing-lower-right',
  'spot-left-upper', 'spot-right-upper', 'spot-left-lower', 'spot-right-lower',
  'body', 'head',
  'antenna-left-tip', 'antenna-right-tip',
  'flower1-petal1', 'flower1-center', 'flower2-petal1', 'flower2-center',
]

export const DINO_HIT_ORDER = [
  'sky', 'ground',
  'dino-tail',
  'leg-back', 'foot-back',
  'dino-body', 'dino-belly',
  'spike1', 'spike2', 'spike3',
  'dino-head', 'dino-jaw', 'dino-eye-outer',
  'leg-front', 'foot-front',
  'sun', 'cloud1', 'cloud2',
]

export interface PageRegionData {
  paths: Record<string, string>
  ellipses: Record<string, { cx: number; cy: number; rx: number; ry: number }>
  hitOrder: string[]
}

const PAGE_REGION_DATA: Record<string, PageRegionData> = {
  img1: { paths: BUTTERFLY_PATHS, ellipses: BUTTERFLY_ELLIPSES, hitOrder: BUTTERFLY_HIT_ORDER },
  img2: { paths: DINO_PATHS, ellipses: DINO_ELLIPSES, hitOrder: DINO_HIT_ORDER },
}

export function getPageRegionData(pageId: string): PageRegionData | null {
  return PAGE_REGION_DATA[pageId] || null
}
