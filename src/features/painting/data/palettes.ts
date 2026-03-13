export interface Palette {
  id: string
  nameKey: string
  colors: string[]
}

export const PALETTES: Palette[] = [
  // Utility palettes
  { id: 'basic', nameKey: 'palette_basic', colors: ['#FF0000', '#FF6600', '#FFD600', '#00E676', '#2979FF', '#7C4DFF', '#000000', '#FFFFFF', '#888888', '#8D5524'] },
  { id: 'skin', nameKey: 'palette_skin', colors: ['#FFDBAC', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#FFDAB9', '#DEB887', '#D2B48C', '#5C3317', '#3B1F0B'] },
  { id: 'lips', nameKey: 'palette_lips', colors: ['#E8515C', '#C4364A', '#B5274E', '#D4555A', '#F08080', '#CC5577', '#A52A4A', '#FF6B81', '#D44D5C', '#8B2252'] },
  { id: 'eyes', nameKey: 'palette_eyes', colors: ['#4E342E', '#1B5E20', '#0D47A1', '#263238', '#5D4037', '#2E7D32', '#1565C0', '#37474F', '#8D6E63', '#90A4AE'] },
  { id: 'hair', nameKey: 'palette_hair', colors: ['#1A1A1A', '#3E2723', '#5D4037', '#8D6E63', '#FFD54F', '#FF8F00', '#D84315', '#B71C1C', '#F5F5F5', '#9E9E9E'] },
  { id: 'makeup', nameKey: 'palette_makeup', colors: ['#E91E63', '#FF4081', '#F48FB1', '#CE93D8', '#BA68C8', '#D500F9', '#FF6090', '#AD1457', '#880E4F', '#FCE4EC'] },

  // Themed palettes
  { id: 'halloween', nameKey: 'palette_halloween', colors: ['#FF6600', '#000000', '#8B00FF', '#1A1A2E', '#FF4500', '#2D0A31', '#FFD700', '#4A0E4E', '#CC3300', '#1C1C1C'] },
  { id: 'independence', nameKey: 'palette_independence', colors: ['#B22234', '#FFFFFF', '#3C3B6E', '#002868', '#BF0A30', '#FFD700', '#C8102E', '#041E42', '#E8E8E8', '#1A237E'] },
  { id: 'cottage', nameKey: 'palette_cottage', colors: ['#D4A574', '#F5E6D3', '#8FBC8F', '#DEB887', '#FFE4C4', '#90EE90', '#F0E68C', '#FAEBD7', '#BDB76B', '#E0CDA9'] },
  { id: 'miami', nameKey: 'palette_miami', colors: ['#FF6EC7', '#00CED1', '#FF4500', '#FFD700', '#FF69B4', '#00FFFF', '#FF1493', '#40E0D0', '#FFA500', '#7FFFD4'] },
  { id: 'mystical', nameKey: 'palette_mystical', colors: ['#4A148C', '#6A1B9A', '#8E24AA', '#CE93D8', '#1A237E', '#311B92', '#B388FF', '#EA80FC', '#7C4DFF', '#E040FB'] },
  { id: 'underwater', nameKey: 'palette_underwater', colors: ['#006994', '#0077B6', '#00B4D8', '#48CAE4', '#90E0EF', '#023E8A', '#0096C7', '#CAF0F8', '#03045E', '#40E0D0'] },
  { id: 'forest', nameKey: 'palette_forest', colors: ['#1B5E20', '#2E7D32', '#4CAF50', '#81C784', '#A5D6A7', '#33691E', '#558B2F', '#689F38', '#8BC34A', '#3E2723'] },
  { id: 'flowers', nameKey: 'palette_flowers', colors: ['#FF4081', '#E91E63', '#F48FB1', '#FFB6C1', '#FF69B4', '#FF1493', '#DB7093', '#FFC0CB', '#9C27B0', '#4CAF50'] },
  { id: 'rainbow', nameKey: 'palette_rainbow', colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF', '#FF1493', '#00CED1', '#FFD700'] },
  { id: 'sunset', nameKey: 'palette_sunset', colors: ['#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FFD700', '#FF8C00', '#DC143C', '#FF1493', '#C71585', '#2F1B41'] },
  { id: 'street_party', nameKey: 'palette_street_party', colors: ['#FFD600', '#FF1744', '#00E5FF', '#76FF03', '#FF9100', '#D500F9', '#00BCD4', '#FF3D00', '#651FFF', '#AEEA00'] },
  { id: 'memories', nameKey: 'palette_memories', colors: ['#D7CCC8', '#BCAAA4', '#A1887F', '#8D6E63', '#EFEBE9', '#F5F0EB', '#C8B8A9', '#A69080', '#E8D5C4', '#BFA68E'] },
  { id: 'vintage_pop', nameKey: 'palette_vintage_pop', colors: ['#E74C3C', '#F39C12', '#1ABC9C', '#3498DB', '#9B59B6', '#E67E22', '#2ECC71', '#E91E63', '#00BCD4', '#FF5722'] },
  { id: 'fallen_leaves', nameKey: 'palette_fallen_leaves', colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460', '#A0522D', '#B8860B', '#DAA520', '#FFD700', '#556B2F'] },
  { id: 'rubber_sky', nameKey: 'palette_rubber_sky', colors: ['#87CEEB', '#B0E0E6', '#ADD8E6', '#87CEFA', '#00BFFF', '#6495ED', '#4682B4', '#5F9EA0', '#AFEEEE', '#E0FFFF'] },
]
