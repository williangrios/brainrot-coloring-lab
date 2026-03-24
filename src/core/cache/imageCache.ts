import {
  cacheDirectory,
  getInfoAsync,
  makeDirectoryAsync,
  downloadAsync,
  deleteAsync,
} from 'expo-file-system/legacy'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ColoringPage } from '../data/coloringPages'

/**
 * Cache de imagens remotas no dispositivo.
 *
 * - Imagens e thumbnails são baixados para o diretório de cache do app.
 * - A lista de páginas é persistida no AsyncStorage para funcionar offline.
 * - Usa hash da URL como nome do arquivo para evitar conflitos.
 */

const CACHE_DIR = `${cacheDirectory}images/`
const PAGES_STORAGE_KEY = '@brainrot_cached_pages'

// ── Inicialização ────────────────────────────────────────────

let initialized = false

async function ensureCacheDir() {
  if (initialized) return
  const info = await getInfoAsync(CACHE_DIR)
  if (!info.exists) {
    await makeDirectoryAsync(CACHE_DIR, { intermediates: true })
  }
  initialized = true
}

// ── Hash simples para nome de arquivo ────────────────────────

function urlToFilename(url: string): string {
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const ext = url.match(/\.(png|jpg|jpeg|webp|gif)/i)?.[1] ?? 'png'
  return `${Math.abs(hash).toString(36)}.${ext}`
}

// ── Cache de uma imagem individual ───────────────────────────

export async function getCachedImageUri(remoteUrl: string): Promise<string> {
  await ensureCacheDir()

  const filename = urlToFilename(remoteUrl)
  const localPath = CACHE_DIR + filename

  const info = await getInfoAsync(localPath)
  if (info.exists) {
    return localPath
  }

  // Baixar para o cache
  try {
    const download = await downloadAsync(remoteUrl, localPath)
    return download.uri
  } catch {
    // Se falhar o download, retorna URL remota como fallback
    return remoteUrl
  }
}

// ── Cache de múltiplas imagens (batch) ───────────────────────

export async function cachePageImages(pages: ColoringPage[]): Promise<void> {
  await ensureCacheDir()

  const urls: string[] = []
  for (const page of pages) {
    if (page.imageUrl) urls.push(page.imageUrl)
    if (page.thumbnailUrl) urls.push(page.thumbnailUrl)
  }

  // Baixar em paralelo (máx 5 simultâneos)
  const BATCH_SIZE = 5
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE).map((url) => cacheIfNeeded(url))
    await Promise.allSettled(batch)
  }
}

async function cacheIfNeeded(url: string): Promise<void> {
  const filename = urlToFilename(url)
  const localPath = CACHE_DIR + filename
  const info = await getInfoAsync(localPath)
  if (!info.exists) {
    try {
      await downloadAsync(url, localPath)
    } catch {
      // Ignora erros individuais
    }
  }
}

// ── Persistência da lista de páginas ─────────────────────────

export async function savePagesToStorage(pages: ColoringPage[]): Promise<void> {
  const serializable = pages.map((p) => ({
    id: p.id,
    name: p.name,
    nameKey: p.nameKey,
    difficulty: p.difficulty,
    isPremiumResource: p.isPremiumResource,
    isBitmap: p.isBitmap,
    imageUrl: p.imageUrl,
    thumbnailUrl: p.thumbnailUrl,
  }))
  await AsyncStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(serializable))
}

export async function loadPagesFromStorage(): Promise<ColoringPage[]> {
  const raw = await AsyncStorage.getItem(PAGES_STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ColoringPage[]
  } catch {
    return []
  }
}

// ── Limpar cache ─────────────────────────────────────────────

export async function clearImageCache(): Promise<void> {
  try {
    await deleteAsync(CACHE_DIR, { idempotent: true })
    initialized = false
  } catch {}
  await AsyncStorage.removeItem(PAGES_STORAGE_KEY)
}
