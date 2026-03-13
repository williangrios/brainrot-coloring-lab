export interface PartProps {
  fills: Record<string, string>
  onRegionPress?: (regionId: string) => void
}

export interface PartMeta {
  id: string
  name: string
  category: 'head' | 'body' | 'environment'
  regions: string[]
}
