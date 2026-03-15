import AsyncStorage from '@react-native-async-storage/async-storage'

const FAVORITES_KEY = '@brainrot_favorites'

export async function getFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY)
  if (!raw) return []
  return JSON.parse(raw)
}

export async function addFavorite(pageId: string): Promise<void> {
  const favs = await getFavorites()
  if (!favs.includes(pageId)) {
    favs.unshift(pageId)
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
  }
}

export async function removeFavorite(pageId: string): Promise<void> {
  const favs = await getFavorites()
  const filtered = favs.filter((id) => id !== pageId)
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
}

export async function isFavorite(pageId: string): Promise<boolean> {
  const favs = await getFavorites()
  return favs.includes(pageId)
}
