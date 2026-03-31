import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Platform } from 'react-native'
import { loadCreditsData, saveCreditsData, CreditsData } from '../storage/creditsStorage'

// ── RevenueCat ────────────────────────────────────────────────
let Purchases: any = null
try {
  Purchases = require('react-native-purchases').default
} catch {
  // Não disponível em Expo Go
}
const isNativeAvailable = Purchases !== null

const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_hrOjCMkRrVKRDVXuOpbEzuBfsjQ',
  android: 'goog_tyHvfuVAWrNYeLbNTvhcgnzDlkp',
}) ?? ''

const PREMIUM_ENTITLEMENT = 'premium'

// ── Tipos ─────────────────────────────────────────────────────
interface PurchasesPackage {
  product: { priceString: string }
  [key: string]: any
}

const MAX_SHARE_CREDITS_AFTER_RATING = 3
const CREDITS_PER_SHARE = 1

interface CreditsContextType {
  // Premium (RevenueCat)
  isPremium: boolean
  packages: PurchasesPackage[]
  purchase: (pkg: PurchasesPackage) => Promise<boolean>
  restore: () => Promise<boolean>
  // Créditos
  credits: number
  hasRated: boolean
  shareCreditsCount: number
  canEarnBySharing: boolean
  loading: boolean
  spendCredit: () => Promise<boolean>
  earnCreditsFromShare: () => Promise<boolean>
  completeRating: () => Promise<void>
  shouldShowRating: () => boolean
}

const CreditsContext = createContext<CreditsContextType>({
  isPremium: false,
  packages: [],
  purchase: async () => false,
  restore: async () => false,
  credits: 3,
  hasRated: false,
  shareCreditsCount: 0,
  canEarnBySharing: true,
  loading: true,
  spendCredit: async () => false,
  earnCreditsFromShare: async () => false,
  completeRating: async () => {},
  shouldShowRating: () => false,
})

// ── Provider ──────────────────────────────────────────────────
export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false)
  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [creditsData, setCreditsData] = useState<CreditsData>({
    credits: 3,
    hasRated: false,
    shareCreditsCount: 0,
  })
  const [loading, setLoading] = useState(true)

  // Inicializar RevenueCat + créditos
  useEffect(() => {
    async function init() {
      // Carregar créditos do AsyncStorage
      const data = await loadCreditsData()
      setCreditsData(data)

      // Inicializar RevenueCat
      if (isNativeAvailable) {
        try {
          Purchases.configure({ apiKey: REVENUECAT_API_KEY })
          const info = await Purchases.getCustomerInfo()
          setIsPremium(info.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined)
          const offerings = await Purchases.getOfferings()
          if (offerings.current?.availablePackages) {
            setPackages(offerings.current.availablePackages)
          }
        } catch {
          // RevenueCat não configurado
        }
      }

      setLoading(false)
    }

    init()

    if (isNativeAvailable) {
      Purchases.addCustomerInfoUpdateListener((info: any) => {
        setIsPremium(info.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined)
      })
    }

    return () => {}
  }, [])

  const persistCredits = useCallback((newData: CreditsData) => {
    setCreditsData(newData)
    saveCreditsData(newData)
  }, [])

  // ── RevenueCat ──
  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    if (!isNativeAvailable) return false
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg)
      const active = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined
      setIsPremium(active)
      return active
    } catch {
      return false
    }
  }, [])

  const restore = useCallback(async (): Promise<boolean> => {
    if (!isNativeAvailable) return false
    try {
      const info = await Purchases.restorePurchases()
      const active = info.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined
      setIsPremium(active)
      return active
    } catch {
      return false
    }
  }, [])

  // ── Créditos ──
  const canEarnBySharing = !creditsData.hasRated || creditsData.shareCreditsCount < MAX_SHARE_CREDITS_AFTER_RATING

  const spendCredit = useCallback(async (): Promise<boolean> => {
    if (isPremium) return true // premium não gasta crédito
    if (creditsData.credits <= 0) return false
    persistCredits({ ...creditsData, credits: creditsData.credits - 1 })
    return true
  }, [isPremium, creditsData, persistCredits])

  const earnCreditsFromShare = useCallback(async (): Promise<boolean> => {
    const eligible = !creditsData.hasRated || creditsData.shareCreditsCount < MAX_SHARE_CREDITS_AFTER_RATING
    if (!eligible) return false
    persistCredits({
      ...creditsData,
      credits: creditsData.credits + CREDITS_PER_SHARE,
      shareCreditsCount: creditsData.shareCreditsCount + 1,
    })
    return true
  }, [creditsData, persistCredits])

  const completeRating = useCallback(async (): Promise<void> => {
    persistCredits({ ...creditsData, hasRated: true })
  }, [creditsData, persistCredits])

  const shouldShowRating = useCallback(() => !creditsData.hasRated, [creditsData.hasRated])

  return (
    <CreditsContext.Provider value={{
      isPremium,
      packages,
      purchase,
      restore,
      ...creditsData,
      canEarnBySharing,
      loading,
      spendCredit,
      earnCreditsFromShare,
      completeRating,
      shouldShowRating,
    }}>
      {children}
    </CreditsContext.Provider>
  )
}

export const useCredits = () => useContext(CreditsContext)
