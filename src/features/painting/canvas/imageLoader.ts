import { readAsStringAsync } from 'expo-file-system/legacy'
import { getCachedImageUri } from '../../../core/cache/imageCache'

export async function loadImageAsBase64(source: number | string): Promise<string> {
  // String URL — pode ser remota ou local (cache)
  if (typeof source === 'string') {
    // Pegar do cache local (ou baixar se necessário)
    const localUri = await getCachedImageUri(source)

    // Se é um arquivo local (file://), ler como base64
    if (localUri.startsWith('file://') || localUri.startsWith('/')) {
      const base64 = await readAsStringAsync(localUri, {
        encoding: 'base64' as any,
      })
      const ext = localUri.match(/\.(png|jpg|jpeg|webp|gif)/i)?.[1] ?? 'png'
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
      return `data:${mime};base64,${base64}`
    }

    // Fallback: fetch da URL remota e converter
    const res = await fetch(localUri)
    const blob = await res.blob()
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Number source (bundled asset) — fallback para compatibilidade
  const { Asset } = require('expo-asset')
  const asset = Asset.fromModule(source)
  await asset.downloadAsync()

  const base64 = await readAsStringAsync(asset.localUri!, {
    encoding: 'base64' as any,
  })
  return `data:image/png;base64,${base64}`
}
