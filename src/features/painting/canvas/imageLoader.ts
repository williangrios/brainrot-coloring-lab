import { Asset } from 'expo-asset'
import { File } from 'expo-file-system'

export async function loadImageAsBase64(source: number | string): Promise<string> {
  // Remote URL — fetch and convert to base64
  if (typeof source === 'string') {
    const res = await fetch(source)
    const blob = await res.blob()
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Bundled asset (number)
  const asset = Asset.fromModule(source)
  await asset.downloadAsync()

  const file = new File(asset.localUri!)
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // Convert Uint8Array to base64
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return `data:image/png;base64,${base64}`
}
