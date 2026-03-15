import { ApiColoringPage } from '../../../core/data/mockApiPages'
import { PageRegionData } from './regionPaths'

/**
 * Converts an ApiColoringPage to PageRegionData for hit testing and clipping.
 * This allows dynamic pages from the API to work with the existing DrawingCanvas.
 */
export function apiPageToRegionData(page: ApiColoringPage): PageRegionData {
  const paths: Record<string, string> = {}
  const ellipses: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {}
  const hitOrder: string[] = []

  for (const region of page.regions) {
    if (region.decorative) continue

    hitOrder.push(region.id)

    if (region.type === 'path' && region.d) {
      paths[region.id] = region.d
    } else if ((region.type === 'ellipse' || region.type === 'circle') && region.cx != null) {
      ellipses[region.id] = {
        cx: region.cx,
        cy: region.cy!,
        rx: region.rx!,
        ry: region.ry!,
      }
    }
  }

  const bgRegions = new Set(page.bgRegionIds)

  return { paths, ellipses, hitOrder, bgRegions }
}
