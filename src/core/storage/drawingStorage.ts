import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Drawing {
  id: string
  headId: string
  bodyId: string
  environmentId: string
  fills: Record<string, string>
  strokes?: any[]
  canvasWidth?: number
  canvasHeight?: number
  name: string
  createdAt: number
  shared: boolean
}

const DRAWINGS_KEY = '@brainrot_drawings'

export async function getDrawings(): Promise<Drawing[]> {
  const raw = await AsyncStorage.getItem(DRAWINGS_KEY)
  if (!raw) return []
  return JSON.parse(raw)
}

export async function saveDrawing(drawing: Drawing): Promise<void> {
  const drawings = await getDrawings()
  const index = drawings.findIndex((d) => d.id === drawing.id)
  if (index >= 0) {
    drawings[index] = drawing
  } else {
    drawings.unshift(drawing)
  }
  await AsyncStorage.setItem(DRAWINGS_KEY, JSON.stringify(drawings))
}

export async function deleteDrawing(id: string): Promise<void> {
  const drawings = await getDrawings()
  const filtered = drawings.filter((d) => d.id !== id)
  await AsyncStorage.setItem(DRAWINGS_KEY, JSON.stringify(filtered))
}

export async function markDrawingShared(id: string): Promise<void> {
  const drawings = await getDrawings()
  const drawing = drawings.find((d) => d.id === id)
  if (drawing) {
    drawing.shared = true
    await AsyncStorage.setItem(DRAWINGS_KEY, JSON.stringify(drawings))
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
