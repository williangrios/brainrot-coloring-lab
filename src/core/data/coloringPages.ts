import { getRemotePages, getRemotePageById } from './pagesStore'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ColoringPage {
  id: string
  name: string
  nameKey: string
  difficulty: Difficulty
  isPremiumResource: boolean
  isBitmap: boolean
  imageUrl?: string
  thumbnailUrl?: string
}

// Todas as páginas agora vêm do backend remoto (com cache local)
export const coloringPages: ColoringPage[] = []

export function getPageById(id: string): ColoringPage | undefined {
  return getRemotePageById(id)
}

export function getAllPages(): ColoringPage[] {
  return getRemotePages()
}

export function getPagesByDifficulty(difficulty: Difficulty): ColoringPage[] {
  return getRemotePages().filter((p) => p.difficulty === difficulty)
}

export function getFreePages(): ColoringPage[] {
  return getRemotePages().filter((p) => !p.isPremiumResource)
}
