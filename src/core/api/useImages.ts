import { useMemo, useEffect } from 'react'
import { useApi } from './useApi'
import { DEFAULT_TENANT } from './apiClient'
import { setRemotePages } from '../data/pagesStore'
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

  const pages: ColoringPage[] = useMemo(() => {
    if (!data?.images) return []
    return data.images.map(apiImageToColoringPage)
  }, [data])

  useEffect(() => {
    setRemotePages(pages)
  }, [pages])

  return { pages, loading, error, refetch }
}
