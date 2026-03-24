import { useState, useEffect, useMemo, useCallback } from 'react'
import { useApi } from './useApi'
import { DEFAULT_TENANT } from './apiClient'
import { setRemotePages } from '../data/pagesStore'
import { cachePageImages, savePagesToStorage, loadPagesFromStorage } from '../cache/imageCache'
import type { ColoringPage, Difficulty } from '../data/coloringPages'

interface ApiImage {
  id: string
  name: string
  imageUrl: string
  thumbnailUrl: string
  difficulty: Difficulty
  isPremium: boolean
  category?: string
}

interface GetImagesResponse {
  images: ApiImage[]
  limit: number
  skip: number
}

function apiImageToColoringPage(img: ApiImage): ColoringPage {
  return {
    id: img.id,
    name: img.name,
    nameKey: img.id,
    difficulty: img.difficulty,
    isPremiumResource: img.difficulty !== 'easy',
    isBitmap: true,
    imageUrl: img.imageUrl,
    thumbnailUrl: img.thumbnailUrl,
  }
}

export function useImages(limit = 100, skip = 0) {
  const [cachedPages, setCachedPages] = useState<ColoringPage[]>([])
  const [caching, setCaching] = useState(false)

  // Carregar páginas do cache local ao iniciar (funciona offline)
  useEffect(() => {
    loadPagesFromStorage().then((stored) => {
      if (stored.length > 0) {
        setCachedPages(stored)
        setRemotePages(stored)
      }
    })
  }, [])

  // Buscar do backend
  const { data, loading, error, refetch } = useApi<GetImagesResponse>(
    '/api/business/apps/images/getimages',
    {
      params: {
        tenant: DEFAULT_TENANT,
        limit,
        skip,
      },
    }
  )

  const freshPages: ColoringPage[] = useMemo(() => {
    if (!data?.images) return []
    return data.images.map(apiImageToColoringPage)
  }, [data])

  // Quando receber dados frescos do backend: atualizar store, persistir e cachear imagens
  useEffect(() => {
    if (freshPages.length === 0) return

    setRemotePages(freshPages)
    setCachedPages(freshPages)

    // Persistir lista e baixar imagens em background
    setCaching(true)
    Promise.all([
      savePagesToStorage(freshPages),
      cachePageImages(freshPages),
    ]).finally(() => setCaching(false))
  }, [freshPages])

  // Usar dados frescos se disponíveis, senão cache local
  const pages = freshPages.length > 0 ? freshPages : cachedPages

  return { pages, loading, error, caching, refetch }
}
