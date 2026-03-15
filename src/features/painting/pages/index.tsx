import React from 'react'
import ButterflyPage, { ColoringPageProps, BUTTERFLY_REGIONS } from './ButterflyPage'
import DinoPage, { DINO_REGIONS } from './DinoPage'

export type { ColoringPageProps }

interface PageEntry {
  component: React.FC<ColoringPageProps>
  regions: string[]
}

const PAGE_MAP: Record<string, PageEntry> = {
  img1: { component: ButterflyPage, regions: BUTTERFLY_REGIONS },
  img2: { component: DinoPage, regions: DINO_REGIONS },
}

export function getPageComponent(pageId: string): React.FC<ColoringPageProps> | null {
  return PAGE_MAP[pageId]?.component || null
}

export function getPageRegions(pageId: string): string[] {
  return PAGE_MAP[pageId]?.regions || []
}

export function hasPageSvg(pageId: string): boolean {
  return pageId in PAGE_MAP
}

interface ColoringPageRendererProps {
  pageId: string
  width: number
  height: number
  regionColors: Record<string, string>
  onRegionPress?: (regionId: string) => void
  outlineOnly?: boolean
}

const ColoringPageRenderer: React.FC<ColoringPageRendererProps> = ({
  pageId, width, height, regionColors, onRegionPress, outlineOnly,
}) => {
  const PageComponent = getPageComponent(pageId)
  if (!PageComponent) return null
  return <PageComponent width={width} height={height} regionColors={regionColors} onRegionPress={onRegionPress} outlineOnly={outlineOnly} />
}

export default React.memo(ColoringPageRenderer)
