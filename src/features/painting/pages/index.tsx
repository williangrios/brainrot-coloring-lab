import React from 'react'
import { Image } from 'react-native'
import { BUNDLED_PAGES } from '../../../core/data/bundledPages'
import { getPageById } from '../../../core/data/coloringPages'

// Build bitmap lookup
const BITMAP_MAP: Record<string, number> = {}
for (const bp of BUNDLED_PAGES) {
  BITMAP_MAP[bp.id] = bp.imageSource
}

interface ColoringPageRendererProps {
  pageId: string
  width: number
  height: number
  thumbnailUrl?: string
}

const ColoringPageRenderer: React.FC<ColoringPageRendererProps> = ({
  pageId, width, height, thumbnailUrl,
}) => {
  // Explicit thumbnailUrl prop takes priority
  if (thumbnailUrl) {
    return (
      <Image
        source={{ uri: thumbnailUrl }}
        style={{ width, height }}
        resizeMode="contain"
      />
    )
  }

  // Try bundled image
  const source = BITMAP_MAP[pageId]
  if (source) {
    return (
      <Image
        source={source}
        style={{ width, height }}
        resizeMode="contain"
      />
    )
  }

  // Fallback: look up remote page data for thumbnailUrl or imageUrl
  const page = getPageById(pageId)
  const remoteUrl = page?.thumbnailUrl || page?.imageUrl
  if (remoteUrl) {
    return (
      <Image
        source={{ uri: remoteUrl }}
        style={{ width, height }}
        resizeMode="contain"
      />
    )
  }

  return null
}

export default React.memo(ColoringPageRenderer)
