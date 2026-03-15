import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  initCredits,
  getCredits,
  spendCredit,
  earnCreditFromShare,
  getShareCount,
} from '../storage/creditsStorage'

const PREMIUM_KEY = '@brainrot_premium'

interface CreditsContextType {
  credits: number
  shareCount: number
  isPremium: boolean
  loading: boolean
  spend: () => Promise<boolean>
  earnFromShare: () => Promise<boolean>
  refresh: () => Promise<void>
  togglePremium: () => Promise<void>
}

const CreditsContext = createContext<CreditsContextType>({
  credits: 0,
  shareCount: 0,
  isPremium: false,
  loading: true,
  spend: async () => false,
  earnFromShare: async () => false,
  refresh: async () => {},
  togglePremium: async () => {},
})

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(0)
  const [shareCount, setShareCount] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const c = await getCredits()
    const s = await getShareCount()
    setCredits(c)
    setShareCount(s)
  }, [])

  useEffect(() => {
    Promise.all([
      initCredits(),
      getShareCount(),
      AsyncStorage.getItem(PREMIUM_KEY),
    ]).then(([c, s, p]) => {
      setCredits(c)
      setShareCount(s)
      setIsPremium(p === 'true')
      setLoading(false)
    })
  }, [])

  const spend = useCallback(async () => {
    if (isPremium) return true
    const success = await spendCredit()
    if (success) await refresh()
    return success
  }, [isPremium, refresh])

  const earnFromShare = useCallback(async () => {
    const success = await earnCreditFromShare()
    if (success) await refresh()
    return success
  }, [refresh])

  const togglePremium = useCallback(async () => {
    const newVal = !isPremium
    setIsPremium(newVal)
    await AsyncStorage.setItem(PREMIUM_KEY, newVal ? 'true' : 'false')
  }, [isPremium])

  return (
    <CreditsContext.Provider value={{ credits, shareCount, isPremium, loading, spend, earnFromShare, refresh, togglePremium }}>
      {children}
    </CreditsContext.Provider>
  )
}

export const useCredits = () => useContext(CreditsContext)
