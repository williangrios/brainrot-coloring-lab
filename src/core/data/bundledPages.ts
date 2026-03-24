export type Difficulty = 'easy' | 'medium' | 'hard'

// Bundled pages removidas — todas as imagens agora vêm do backend remoto
// com cache local via imageCache.ts.

export interface BundledPage {
  id: string
  name: string
  difficulty: Difficulty
  isPremium: boolean
  imageSource: number
  thumbnailSource: number
}

export const BUNDLED_PAGES: BundledPage[] = []
