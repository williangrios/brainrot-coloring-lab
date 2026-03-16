import React from 'react'
import { Image } from 'react-native'
import { BITMAP_PAGES } from '../../../core/data/bitmapPages'

// Build bitmap lookup
const BITMAP_MAP: Record<string, number> = {}
for (const bp of BITMAP_PAGES) {
  BITMAP_MAP[bp.id] = bp.imageSource
}

interface ColoringPageRendererProps {
  pageId: string
  width: number
  height: number
}

const ColoringPageRenderer: React.FC<ColoringPageRendererProps> = ({
  pageId, width, height,
}) => {
  const source = BITMAP_MAP[pageId]
  if (!source) return null

  return (
    <Image
      source={source}
      style={{ width, height }}
      resizeMode="contain"
    />
  )
}

export default React.memo(ColoringPageRenderer)
