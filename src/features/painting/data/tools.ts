export type ToolType =
  | 'fill' | 'brush' | 'spray' | 'eraser'
  | 'crayon' | 'thick_pencil' | 'laser' | 'neon'
  | 'watercolor' | 'glitter' | 'eyedropper'
  | 'flat_brush' | 'fuzzy' | 'marker' | 'fine_tip' | 'airbrush'

export interface ToolDef {
  id: ToolType
  nameKey: string
  emoji: string
  isDrawingTool: boolean
  hasBrushSize: boolean
  fixedBrushSize?: number
}

export const TOOLS: ToolDef[] = [
  { id: 'fill', nameKey: 'tool_fill', emoji: '🪣', isDrawingTool: false, hasBrushSize: false },
  { id: 'brush', nameKey: 'tool_brush', emoji: '🖌️', isDrawingTool: true, hasBrushSize: true },
  { id: 'crayon', nameKey: 'tool_crayon', emoji: '🖍️', isDrawingTool: true, hasBrushSize: true },
  { id: 'marker', nameKey: 'tool_marker', emoji: '🖊️', isDrawingTool: true, hasBrushSize: true },
  { id: 'thick_pencil', nameKey: 'tool_thick_pencil', emoji: '✏️', isDrawingTool: true, hasBrushSize: false, fixedBrushSize: 20 },
  { id: 'fine_tip', nameKey: 'tool_fine_tip', emoji: '🔖', isDrawingTool: true, hasBrushSize: false, fixedBrushSize: 2 },
  { id: 'flat_brush', nameKey: 'tool_flat_brush', emoji: '🔲', isDrawingTool: true, hasBrushSize: true },
  { id: 'watercolor', nameKey: 'tool_watercolor', emoji: '💧', isDrawingTool: true, hasBrushSize: true },
  { id: 'spray', nameKey: 'tool_spray', emoji: '💨', isDrawingTool: true, hasBrushSize: true },
  { id: 'airbrush', nameKey: 'tool_airbrush', emoji: '🌫️', isDrawingTool: true, hasBrushSize: true },
  { id: 'laser', nameKey: 'tool_laser', emoji: '⚡', isDrawingTool: true, hasBrushSize: false, fixedBrushSize: 2 },
  { id: 'neon', nameKey: 'tool_neon', emoji: '✨', isDrawingTool: true, hasBrushSize: false, fixedBrushSize: 4 },
  { id: 'glitter', nameKey: 'tool_glitter', emoji: '💎', isDrawingTool: true, hasBrushSize: true },
  { id: 'fuzzy', nameKey: 'tool_fuzzy', emoji: '🧶', isDrawingTool: true, hasBrushSize: true },
  { id: 'eraser', nameKey: 'tool_eraser', emoji: '🧹', isDrawingTool: true, hasBrushSize: true },
  { id: 'eyedropper', nameKey: 'tool_eyedropper', emoji: '💉', isDrawingTool: false, hasBrushSize: false },
]

// Stroke rendering config for each tool type
export interface ToolRenderConfig {
  opacity: number
  strokeLinecap: 'round' | 'butt' | 'square'
  strokeLinejoin: 'round' | 'miter' | 'bevel'
  strokeDasharray?: string
  glowWidth?: number
  glowOpacity?: number
  passes?: number        // multi-pass rendering (watercolor)
  passWidthInc?: number  // width increase per pass
  passOpacity?: number   // opacity per pass
  strandCount?: number   // fuzzy brush
  scatterType?: 'uniform' | 'gaussian'  // spray vs airbrush
}

export const TOOL_RENDER_CONFIG: Record<string, ToolRenderConfig> = {
  brush:        { opacity: 0.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
  eraser:       { opacity: 1.0, strokeLinecap: 'round', strokeLinejoin: 'round' },
  crayon:       { opacity: 0.7, strokeLinecap: 'round', strokeLinejoin: 'round', strokeDasharray: '4,2,1,2' },
  thick_pencil: { opacity: 1.0, strokeLinecap: 'square', strokeLinejoin: 'round' },
  fine_tip:     { opacity: 1.0, strokeLinecap: 'round', strokeLinejoin: 'round' },
  marker:       { opacity: 0.5, strokeLinecap: 'square', strokeLinejoin: 'round' },
  flat_brush:   { opacity: 0.85, strokeLinecap: 'butt', strokeLinejoin: 'miter' },
  laser:        { opacity: 1.0, strokeLinecap: 'round', strokeLinejoin: 'round', glowWidth: 12, glowOpacity: 0.3 },
  neon:         { opacity: 1.0, strokeLinecap: 'round', strokeLinejoin: 'round', glowWidth: 20, glowOpacity: 0.25 },
  watercolor:   { opacity: 0.15, strokeLinecap: 'round', strokeLinejoin: 'round', passes: 3, passWidthInc: 3, passOpacity: 0.15 },
  fuzzy:        { opacity: 0.6, strokeLinecap: 'round', strokeLinejoin: 'round', strandCount: 6 },
  spray:        { opacity: 0.6, strokeLinecap: 'round', strokeLinejoin: 'round', scatterType: 'uniform' },
  glitter:      { opacity: 0.8, strokeLinecap: 'round', strokeLinejoin: 'round', scatterType: 'uniform' },
  airbrush:     { opacity: 0.4, strokeLinecap: 'round', strokeLinejoin: 'round', scatterType: 'gaussian' },
}
