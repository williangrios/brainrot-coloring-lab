import { BUNDLED_PAGES, BundledPage, Difficulty } from './bundledPages'
import { getRemotePageById } from './pagesStore'

export type { Difficulty }

export interface ColoringPage {
  id: string
  name: string
  nameKey: string
  difficulty: Difficulty
  isPremiumResource: boolean
  isBitmap: boolean
  imageSource?: number
  thumbnailSource?: number
  imageUrl?: string
  thumbnailUrl?: string
}

function bundledToColoringPage(bp: BundledPage): ColoringPage {
  return {
    id: bp.id,
    name: bp.name,
    nameKey: bp.id,
    difficulty: bp.difficulty,
    isPremiumResource: bp.isPremium,
    isBitmap: true,
    imageSource: bp.imageSource,
    thumbnailSource: bp.thumbnailSource,
  }
}

export const coloringPages: ColoringPage[] = BUNDLED_PAGES.map(bundledToColoringPage)

export function getPageById(id: string): ColoringPage | undefined {
  return coloringPages.find((p) => p.id === id) ?? getRemotePageById(id)
}

export function getPagesByDifficulty(difficulty: Difficulty): ColoringPage[] {
  return coloringPages.filter((p) => p.difficulty === difficulty)
}

export function getFreePages(): ColoringPage[] {
  return coloringPages.filter((p) => !p.isPremiumResource)
}
