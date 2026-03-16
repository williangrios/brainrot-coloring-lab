import { Asset } from 'expo-asset'
import { File } from 'expo-file-system'

export async function loadImageAsBase64(source: number): Promise<string> {
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
