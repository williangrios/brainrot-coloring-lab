import React from 'react'
import { MOCK_PAGES, ApiColoringPage } from '../../../core/data/mockApiPages'
import DynamicPage from './DynamicPage'
import { apiPageToRegionData } from './dynamicRegionPaths'
import { PageRegionData } from './regionPaths'

export interface ColoringPageProps {
  width: number
  height: number
  regionColors: Record<string, string>
  onRegionPress?: (regionId: string) => void
  outlineOnly?: boolean
}

// Build lookup from mock data
const PAGE_DATA_MAP: Record<string, ApiColoringPage> = {}
for (const page of MOCK_PAGES) {
  PAGE_DATA_MAP[page.id] = page
}

// Cache region data
const REGION_DATA_CACHE: Record<string, PageRegionData> = {}

export function getPageRegions(pageId: string): string[] {
  const pageData = PAGE_DATA_MAP[pageId]
  if (!pageData) return []
  return pageData.regions.filter((r) => !r.decorative).map((r) => r.id)
}

export function hasPageSvg(pageId: string): boolean {
  return pageId in PAGE_DATA_MAP
}

export function getDynamicRegionData(pageId: string): PageRegionData | null {
  if (REGION_DATA_CACHE[pageId]) return REGION_DATA_CACHE[pageId]
  const pageData = PAGE_DATA_MAP[pageId]
  if (!pageData) return null
  const data = apiPageToRegionData(pageData)
  REGION_DATA_CACHE[pageId] = data
  return data
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
  const pageData = PAGE_DATA_MAP[pageId]
  if (!pageData) return null

  return (
    <DynamicPage
      pageData={pageData}
      width={width}
      height={height}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      outlineOnly={outlineOnly}
    />
  )
}

export default React.memo(ColoringPageRenderer)
