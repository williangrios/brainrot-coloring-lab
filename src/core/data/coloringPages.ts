import { MOCK_PAGES, ApiColoringPage } from './mockApiPages'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ColoringPage {
  id: string
  name: string
  nameKey: string
  difficulty: Difficulty
  isPremiumResource: boolean
}

// Build page list from API data (currently mock)
function apiToColoringPage(api: ApiColoringPage): ColoringPage {
  return {
    id: api.id,
    name: api.name,
    nameKey: api.nameKey,
    difficulty: api.difficulty,
    isPremiumResource: api.isPremium,
  }
}

export const coloringPages: ColoringPage[] = MOCK_PAGES.map(apiToColoringPage)

export function getPageById(id: string): ColoringPage | undefined {
  return coloringPages.find((p) => p.id === id)
}

export function getPagesByDifficulty(difficulty: Difficulty): ColoringPage[] {
  return coloringPages.filter((p) => p.difficulty === difficulty)
}

export function getFreePages(): ColoringPage[] {
  return coloringPages.filter((p) => !p.isPremiumResource)
}
