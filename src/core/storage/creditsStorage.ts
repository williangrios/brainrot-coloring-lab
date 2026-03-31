import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = '@brainrot_credits_v2'

export interface CreditsData {
  credits: number
  hasRated: boolean
  shareCreditsCount: number // vezes que ganhou créditos por compartilhar
}

const DEFAULTS: CreditsData = {
  credits: 3,
  hasRated: false,
  shareCreditsCount: 0,
}

export async function loadCreditsData(): Promise<CreditsData> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export async function saveCreditsData(data: CreditsData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data))
  } catch {}
}
