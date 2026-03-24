import React, { useState, useEffect } from 'react'
import { Image, View, ActivityIndicator } from 'react-native'
import { getPageById } from '../../../core/data/coloringPages'
import { getCachedImageUri } from '../../../core/cache/imageCache'

interface ColoringPageRendererProps {
  pageId: string
  width: number
  height: number
  thumbnailUrl?: string
}

const ColoringPageRenderer: React.FC<ColoringPageRendererProps> = ({
  pageId, width, height, thumbnailUrl,
}) => {
  const [uri, setUri] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      // Prioridade: thumbnailUrl prop > page.thumbnailUrl > page.imageUrl
      const url = thumbnailUrl
        || getPageById(pageId)?.thumbnailUrl
        || getPageById(pageId)?.imageUrl

      if (!url) return

      const cached = await getCachedImageUri(url)
      if (!cancelled) setUri(cached)
    }

    resolve()
    return () => { cancelled = true }
  }, [pageId, thumbnailUrl])

  if (!uri) {
    return (
      <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="small" color="#666" />
      </View>
    )
  }

  return (
    <Image
      source={{ uri }}
      style={{ width, height }}
      resizeMode="contain"
    />
  )
}

export default React.memo(ColoringPageRenderer)
