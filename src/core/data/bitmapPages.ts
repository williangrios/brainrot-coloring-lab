import { Difficulty } from './coloringPages'

export interface BitmapColoringPage {
  id: string
  name: string
  difficulty: Difficulty
  isPremium: boolean
  imageSource: number
}

export const BITMAP_PAGES: BitmapColoringPage[] = [
  {
    id: 'hand',
    name: 'Rock Hand',
    difficulty: 'medium',
    isPremium: false,
    imageSource: require('../../assets/pages/hand.png'),
  },
  {
    id: 'woman',
    name: 'Woman',
    difficulty: 'medium',
    isPremium: false,
    imageSource: require('../../assets/pages/woman.png'),
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    difficulty: 'easy',
    isPremium: false,
    imageSource: require('../../assets/pages/butterfly.png'),
  },
]
