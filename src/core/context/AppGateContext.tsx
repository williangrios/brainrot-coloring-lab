import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Controls the "gates" a free user must pass through:
 * 1. After first drawing → rating prompt (before any ads appear)
 * 2. After rating/feedback → ads are unlocked
 *
 * Also tracks ad timing (1-minute interval).
 */

interface AppGateState {
  hasRated: boolean        // user completed the rating flow (yes or no)
  adsUnlocked: boolean     // ads can now be shown
  drawingCount: number     // how many drawings the user has finished
  lastAdTime: number       // timestamp of last video ad shown
}

interface AppGateContextValue extends AppGateState {
  incrementDrawingCount: () => void
  shouldShowRating: () => boolean
  completeRating: () => void
  shouldShowVideoAd: () => boolean
  recordAdShown: () => void
}

const AppGateContext = createContext<AppGateContextValue | null>(null)

const STORAGE_KEY = '@brainrot_app_gate'
const AD_INTERVAL_MS = 60_000 // 1 minute

export function AppGateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppGateState>({
    hasRated: false,
    adsUnlocked: false,
    drawingCount: 0,
    lastAdTime: 0,
  })
  const loaded = useRef(false)

  // Load persisted state on first render
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

  const incrementDrawingCount = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, drawingCount: prev.drawingCount + 1 }
      persist(next)
      return next
    })
  }, [persist])

  const shouldShowRating = useCallback(() => {
    // Show rating after first completed drawing, only once
    return !state.hasRated && state.drawingCount >= 1
  }, [state.hasRated, state.drawingCount])

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
      incrementDrawingCount,
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
