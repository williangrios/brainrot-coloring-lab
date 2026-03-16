export type ToolType =
  | 'fill' | 'brush' | 'spray' | 'eraser'
  | 'crayon' | 'thick_pencil' | 'laser' | 'neon'
  | 'watercolor' | 'glitter' | 'eyedropper'
  | 'flat_brush' | 'fuzzy' | 'marker' | 'fine_tip' | 'airbrush'

// Messages from React Native to WebView
export type RNToCanvasMessage =
  | { type: 'setTool'; tool: ToolType }
  | { type: 'setColor'; color: string }
  | { type: 'setBrushSize'; size: number }
  | { type: 'setBrushOpacity'; opacity: number }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'captureCanvas' }
  | { type: 'loadImage'; base64: string }

// Messages from WebView to React Native
export type CanvasToRNMessage =
  | { type: 'canvasReady' }
  | { type: 'eyedropperColor'; color: string }
  | { type: 'historyChanged'; canUndo: boolean; canRedo: boolean }
  | { type: 'canvasSnapshot'; dataUrl: string }
  | { type: 'drawStart' }
  | { type: 'drawEnd' }
