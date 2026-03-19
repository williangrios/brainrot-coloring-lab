export type Difficulty = 'easy' | 'medium' | 'hard'

export interface BundledPage {
  id: string
  name: string
  difficulty: Difficulty
  isPremium: boolean
  imageSource: number
  thumbnailSource: number
}

// ─── IMAGENS DISPONÍVEIS ─────────────────────────────────────

const AVAILABLE_PAGES: BundledPage[] = [
  { id: 'hand',      name: 'Rock Hand',  difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/hand.png'),      thumbnailSource: require('../../assets/thumbnails/hand.png') },
  { id: 'woman',     name: 'Woman',      difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/woman.png'),     thumbnailSource: require('../../assets/thumbnails/woman.png') },
  { id: 'butterfly', name: 'Butterfly',  difficulty: 'easy',   isPremium: false, imageSource: require('../../assets/pages/butterfly.png'), thumbnailSource: require('../../assets/thumbnails/butterfly.png') },
]

// ─── EASY (20 imagens) ───────────────────────────────────────
// Coloque as imagens em: src/assets/pages/easy/
// Coloque os thumbnails em: src/assets/thumbnails/easy/
// Descomente conforme adicionar as imagens.

// const EASY_PAGES: BundledPage[] = [
//   { id: 'easy_01', name: 'Skibidi Toilet',        difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_01.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_01.png') },
//   { id: 'easy_02', name: 'Baby Gronk',            difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_02.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_02.png') },
//   { id: 'easy_03', name: 'Rizz Cat',              difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_03.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_03.png') },
//   { id: 'easy_04', name: 'Sigma Wolf',            difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_04.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_04.png') },
//   { id: 'easy_05', name: 'Ohio Monster',          difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_05.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_05.png') },
//   { id: 'easy_06', name: 'Fanum Tax Frog',        difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_06.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_06.png') },
//   { id: 'easy_07', name: 'Gyatt Bear',            difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_07.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_07.png') },
//   { id: 'easy_08', name: 'Mewing Dog',            difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_08.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_08.png') },
//   { id: 'easy_09', name: 'Bing Chilling Panda',   difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_09.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_09.png') },
//   { id: 'easy_10', name: 'Sus Bunny',             difficulty: 'easy', isPremium: false, imageSource: require('../../assets/pages/easy/easy_10.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_10.png') },
//   { id: 'easy_11', name: 'NPC Penguin',           difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_11.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_11.png') },
//   { id: 'easy_12', name: 'L + Ratio Duck',        difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_12.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_12.png') },
//   { id: 'easy_13', name: 'Bussin Hamster',        difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_13.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_13.png') },
//   { id: 'easy_14', name: 'No Cap Turtle',         difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_14.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_14.png') },
//   { id: 'easy_15', name: 'Slay Kitty',            difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_15.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_15.png') },
//   { id: 'easy_16', name: 'Vibe Check Owl',        difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_16.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_16.png') },
//   { id: 'easy_17', name: 'Drip Fish',             difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_17.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_17.png') },
//   { id: 'easy_18', name: 'Based Bee',             difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_18.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_18.png') },
//   { id: 'easy_19', name: 'Cope Snail',            difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_19.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_19.png') },
//   { id: 'easy_20', name: 'Yeet Chick',            difficulty: 'easy', isPremium: true,  imageSource: require('../../assets/pages/easy/easy_20.png'), thumbnailSource: require('../../assets/thumbnails/easy/easy_20.png') },
// ]

// ─── MEDIUM (20 imagens) ─────────────────────────────────────
// Coloque as imagens em: src/assets/pages/medium/
// Coloque os thumbnails em: src/assets/thumbnails/medium/
// Descomente conforme adicionar as imagens.

// const MEDIUM_PAGES: BundledPage[] = [
//   { id: 'medium_01', name: 'Skibidi Boss',          difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_01.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_01.png') },
//   { id: 'medium_02', name: 'Sigma Grindset Lion',   difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_02.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_02.png') },
//   { id: 'medium_03', name: 'Ohio Final Boss',       difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_03.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_03.png') },
//   { id: 'medium_04', name: 'Rizz Wizard',           difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_04.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_04.png') },
//   { id: 'medium_05', name: 'Mog Dragon',            difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_05.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_05.png') },
//   { id: 'medium_06', name: 'Alpha Unicorn',         difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_06.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_06.png') },
//   { id: 'medium_07', name: 'Goated Phoenix',        difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_07.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_07.png') },
//   { id: 'medium_08', name: 'Fanum Tax Robot',       difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_08.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_08.png') },
//   { id: 'medium_09', name: 'Gyatt Mermaid',         difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_09.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_09.png') },
//   { id: 'medium_10', name: 'Sus Astronaut',         difficulty: 'medium', isPremium: false, imageSource: require('../../assets/pages/medium/medium_10.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_10.png') },
//   { id: 'medium_11', name: 'NPC Knight',            difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_11.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_11.png') },
//   { id: 'medium_12', name: 'Ratio Samurai',         difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_12.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_12.png') },
//   { id: 'medium_13', name: 'Bussin Pirate',         difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_13.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_13.png') },
//   { id: 'medium_14', name: 'No Cap Ninja',          difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_14.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_14.png') },
//   { id: 'medium_15', name: 'Slay Fairy',            difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_15.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_15.png') },
//   { id: 'medium_16', name: 'Vibe Centaur',          difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_16.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_16.png') },
//   { id: 'medium_17', name: 'Drip Werewolf',         difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_17.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_17.png') },
//   { id: 'medium_18', name: 'Based Golem',           difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_18.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_18.png') },
//   { id: 'medium_19', name: 'Cope Yeti',             difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_19.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_19.png') },
//   { id: 'medium_20', name: 'Yeet Griffin',          difficulty: 'medium', isPremium: true,  imageSource: require('../../assets/pages/medium/medium_20.png'), thumbnailSource: require('../../assets/thumbnails/medium/medium_20.png') },
// ]

// ─── HARD (20 imagens) ───────────────────────────────────────
// Coloque as imagens em: src/assets/pages/hard/
// Coloque os thumbnails em: src/assets/thumbnails/hard/
// Descomente conforme adicionar as imagens.

// const HARD_PAGES: BundledPage[] = [
//   { id: 'hard_01', name: 'Skibidi Emperor',         difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_01.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_01.png') },
//   { id: 'hard_02', name: 'Sigma Citadel',           difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_02.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_02.png') },
//   { id: 'hard_03', name: 'Ohio Dimension',          difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_03.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_03.png') },
//   { id: 'hard_04', name: 'Rizz Kingdom',            difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_04.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_04.png') },
//   { id: 'hard_05', name: 'Mog Cathedral',           difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_05.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_05.png') },
//   { id: 'hard_06', name: 'Alpha Colosseum',         difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_06.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_06.png') },
//   { id: 'hard_07', name: 'Goated Mandala',          difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_07.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_07.png') },
//   { id: 'hard_08', name: 'Fanum Steampunk',         difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_08.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_08.png') },
//   { id: 'hard_09', name: 'Gyatt Kraken',            difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_09.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_09.png') },
//   { id: 'hard_10', name: 'Sus Labyrinth',           difficulty: 'hard', isPremium: false, imageSource: require('../../assets/pages/hard/hard_10.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_10.png') },
//   { id: 'hard_11', name: 'NPC Mech Warrior',        difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_11.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_11.png') },
//   { id: 'hard_12', name: 'Ratio Leviathan',         difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_12.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_12.png') },
//   { id: 'hard_13', name: 'Bussin Hydra',            difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_13.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_13.png') },
//   { id: 'hard_14', name: 'No Cap Chimera',          difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_14.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_14.png') },
//   { id: 'hard_15', name: 'Slay Valkyrie',           difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_15.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_15.png') },
//   { id: 'hard_16', name: 'Vibe Cthulhu',            difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_16.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_16.png') },
//   { id: 'hard_17', name: 'Drip Cerberus',           difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_17.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_17.png') },
//   { id: 'hard_18', name: 'Based Behemoth',          difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_18.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_18.png') },
//   { id: 'hard_19', name: 'Cope Ouroboros',          difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_19.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_19.png') },
//   { id: 'hard_20', name: 'Yeet Titan',              difficulty: 'hard', isPremium: true,  imageSource: require('../../assets/pages/hard/hard_20.png'), thumbnailSource: require('../../assets/thumbnails/hard/hard_20.png') },
// ]

// ─── EXPORT ──────────────────────────────────────────────────

export const BUNDLED_PAGES: BundledPage[] = [
  ...AVAILABLE_PAGES,
  // ...EASY_PAGES,    // descomente quando adicionar as imagens
  // ...MEDIUM_PAGES,  // descomente quando adicionar as imagens
  // ...HARD_PAGES,    // descomente quando adicionar as imagens
]
