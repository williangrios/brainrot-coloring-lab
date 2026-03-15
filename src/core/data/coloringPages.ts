export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ColoringPage {
  id: string
  name: string
  nameKey: string
  difficulty: Difficulty
  isPremiumResource: boolean
}

export const coloringPages: ColoringPage[] = [
  {
    id: 'img1',
    name: 'Butterfly Garden',
    nameKey: 'page_butterfly',
    difficulty: 'easy',
    isPremiumResource: false,
  },
  {
    id: 'img2',
    name: 'Happy Dino',
    nameKey: 'page_dino',
    difficulty: 'easy',
    isPremiumResource: false,
  },
]

export function getPageById(id: string): ColoringPage | undefined {
  return coloringPages.find((p) => p.id === id)
}

export function getPagesByDifficulty(difficulty: Difficulty): ColoringPage[] {
  return coloringPages.filter((p) => p.difficulty === difficulty)
}

export function getFreePages(): ColoringPage[] {
  return coloringPages.filter((p) => !p.isPremiumResource)
}
