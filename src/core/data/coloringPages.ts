import { BITMAP_PAGES, BitmapColoringPage } from './bitmapPages'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ColoringPage {
  id: string
  name: string
  nameKey: string
  difficulty: Difficulty
  isPremiumResource: boolean
  isBitmap: boolean
  imageSource?: number
}

function bitmapToColoringPage(bp: BitmapColoringPage): ColoringPage {
  return {
    id: bp.id,
    name: bp.name,
    nameKey: bp.id,
    difficulty: bp.difficulty,
    isPremiumResource: bp.isPremium,
    isBitmap: true,
    imageSource: bp.imageSource,
  }
}

export const coloringPages: ColoringPage[] = BITMAP_PAGES.map(bitmapToColoringPage)

export function getPageById(id: string): ColoringPage | undefined {
  return coloringPages.find((p) => p.id === id)
}

export function getPagesByDifficulty(difficulty: Difficulty): ColoringPage[] {
  return coloringPages.filter((p) => p.difficulty === difficulty)
}

export function getFreePages(): ColoringPage[] {
  return coloringPages.filter((p) => !p.isPremiumResource)
}
