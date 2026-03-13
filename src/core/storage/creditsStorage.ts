import AsyncStorage from '@react-native-async-storage/async-storage'

const CREDITS_KEY = '@brainrot_credits'
const SHARES_KEY = '@brainrot_share_count'
const INITIALIZED_KEY = '@brainrot_initialized'

const INITIAL_CREDITS = 10 // TODO: change to 1 for production
const MAX_SHARE_CREDITS = 3

export async function initCredits(): Promise<number> {
  // Reset for testing - force re-init with new credit amount
  const currentVersion = 'v2_10credits'
  const initialized = await AsyncStorage.getItem(INITIALIZED_KEY)
  if (initialized !== currentVersion) {
    await AsyncStorage.setItem(CREDITS_KEY, String(INITIAL_CREDITS))
    await AsyncStorage.setItem(SHARES_KEY, '0')
    await AsyncStorage.setItem(INITIALIZED_KEY, currentVersion)
    return INITIAL_CREDITS
  }
  return getCredits()
}

export async function getCredits(): Promise<number> {
  const raw = await AsyncStorage.getItem(CREDITS_KEY)
  return raw ? parseInt(raw, 10) : 0
}

export async function spendCredit(): Promise<boolean> {
  const credits = await getCredits()
  if (credits <= 0) return false
  await AsyncStorage.setItem(CREDITS_KEY, String(credits - 1))
  return true
}

export async function earnCreditFromShare(): Promise<boolean> {
  const shareCount = await getShareCount()
  if (shareCount >= MAX_SHARE_CREDITS) return false
  const credits = await getCredits()
  await AsyncStorage.setItem(CREDITS_KEY, String(credits + 1))
  await AsyncStorage.setItem(SHARES_KEY, String(shareCount + 1))
  return true
}

export async function getShareCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(SHARES_KEY)
  return raw ? parseInt(raw, 10) : 0
}

export async function getMaxShareCredits(): Promise<number> {
  return MAX_SHARE_CREDITS
}
