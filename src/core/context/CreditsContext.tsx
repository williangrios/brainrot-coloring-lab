import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  initCredits,
  getCredits,
  spendCredit,
  earnCreditFromShare,
  getShareCount,
} from '../storage/creditsStorage'

interface CreditsContextType {
  credits: number
  shareCount: number
  isPremium: boolean
  loading: boolean
  spend: () => Promise<boolean>
  earnFromShare: () => Promise<boolean>
  refresh: () => Promise<void>
}

const CreditsContext = createContext<CreditsContextType>({
  credits: 0,
  shareCount: 0,
  isPremium: false,
  loading: true,
  spend: async () => false,
  earnFromShare: async () => false,
  refresh: async () => {},
})

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(0)
  const [shareCount, setShareCount] = useState(0)
  const [isPremium] = useState(false) // Future: hook into subscription
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const c = await getCredits()
    const s = await getShareCount()
    setCredits(c)
    setShareCount(s)
  }, [])

  useEffect(() => {
    initCredits().then((c) => {
      setCredits(c)
      getShareCount().then((s) => setShareCount(s))
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

  return (
    <CreditsContext.Provider value={{ credits, shareCount, isPremium, loading, spend, earnFromShare, refresh }}>
      {children}
    </CreditsContext.Provider>
  )
}

export const useCredits = () => useContext(CreditsContext)
