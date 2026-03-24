import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Platform } from 'react-native'

/**
 * Contexto Premium com RevenueCat.
 *
 * Em Expo Go: RevenueCat não está disponível, opera em modo free.
 * Em dev build / produção: usa react-native-purchases real.
 *
 * TODO: substituir as chaves e entitlement ID pelos valores reais.
 */

// ── Detectar se módulo nativo está disponível ────────────────

let Purchases: any = null

try {
  Purchases = require('react-native-purchases').default
} catch {
  // Módulo nativo não disponível (Expo Go)
}

const isNativeAvailable = Purchases !== null

const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_YOUR_REVENUECAT_IOS_KEY',
  android: 'goog_YOUR_REVENUECAT_ANDROID_KEY',
}) ?? ''

const PREMIUM_ENTITLEMENT = 'premium'

// ── Tipos ────────────────────────────────────────────────────

interface PurchasesPackage {
  product: { priceString: string }
  [key: string]: any
}

interface PremiumContextType {
  isPremium: boolean
  loading: boolean
  packages: PurchasesPackage[]
  purchase: (pkg: PurchasesPackage) => Promise<boolean>
  restore: () => Promise<boolean>
}

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  loading: true,
  packages: [],
  purchase: async () => false,
  restore: async () => false,
})

// ── Provider ─────────────────────────────────────────────────

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<PurchasesPackage[]>([])

  useEffect(() => {
    async function init() {
      if (!isNativeAvailable) {
        setLoading(false)
        return
      }

      try {
        Purchases.configure({ apiKey: REVENUECAT_API_KEY })

        const info = await Purchases.getCustomerInfo()
        setIsPremium(info.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined)

        const offerings = await Purchases.getOfferings()
        if (offerings.current?.availablePackages) {
          setPackages(offerings.current.availablePackages)
        }
      } catch {
        // RevenueCat não configurado — modo free
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

  return (
    <PremiumContext.Provider value={{ isPremium, loading, packages, purchase, restore }}>
      {children}
    </PremiumContext.Provider>
  )
}

export const useCredits = () => useContext(PremiumContext)
