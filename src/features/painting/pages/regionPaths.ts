// Type definition for page region data, used for hit testing and clipping

export interface PageRegionData {
  paths: Record<string, string>
  ellipses: Record<string, { cx: number; cy: number; rx: number; ry: number }>
  hitOrder: string[]
  bgRegions: Set<string>  // regions where drawing is not allowed (fill only)
}
