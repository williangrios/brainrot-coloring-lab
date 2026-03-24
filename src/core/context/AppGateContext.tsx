import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Controla o fluxo de avaliação e liberação de anúncios:
 *
 * 1. Após cada desenho → pergunta quantas estrelas
 * 2. Se 4-5 → abre página de review na loja
 * 3. Se ≤3 → fecha
 * 4. Em ambos os casos → desbloqueia anúncios
 *
 * Anúncios só aparecem DEPOIS da primeira avaliação,
 * evitando reviews negativos por excesso de anúncio.
 */

interface AppGateState {
  hasRated: boolean
  adsUnlocked: boolean
  lastAdTime: number
}

interface AppGateContextValue extends AppGateState {
  shouldShowRating: () => boolean
  completeRating: () => void
  shouldShowVideoAd: () => boolean
  recordAdShown: () => void
}

const AppGateContext = createContext<AppGateContextValue | null>(null)

const STORAGE_KEY = '@brainrot_app_gate'
const AD_INTERVAL_MS = 60_000 // 1 minuto entre interstitials

export function AppGateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppGateState>({
    hasRated: false,
    adsUnlocked: false,
    lastAdTime: 0,
  })
  const loaded = useRef(false)

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          setState((prev) => ({ ...prev, ...parsed }))
        } catch {}
      }
      loaded.current = true
    })
  }, [])

  const persist = useCallback((newState: AppGateState) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState)).catch(() => {})
  }, [])

  const shouldShowRating = useCallback(() => {
    // Mostra a tela de rating enquanto o usuário não tiver avaliado
    return !state.hasRated
  }, [state.hasRated])

  const completeRating = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, hasRated: true, adsUnlocked: true }
      persist(next)
      return next
    })
  }, [persist])

  const shouldShowVideoAd = useCallback(() => {
    if (!state.adsUnlocked) return false
    const now = Date.now()
    return now - state.lastAdTime >= AD_INTERVAL_MS
  }, [state.adsUnlocked, state.lastAdTime])

  const recordAdShown = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, lastAdTime: Date.now() }
      persist(next)
      return next
    })
  }, [persist])

  return (
    <AppGateContext.Provider value={{
      ...state,
      shouldShowRating,
      completeRating,
      shouldShowVideoAd,
      recordAdShown,
    }}>
      {children}
    </AppGateContext.Provider>
  )
}

export function useAppGate() {
  const ctx = useContext(AppGateContext)
  if (!ctx) throw new Error('useAppGate must be used within AppGateProvider')
  return ctx
}
