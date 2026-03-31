import React from 'react'

// AppGateContext foi removido — lógica migrada para CreditsContext.
// Mantido como stub para evitar erros de importação residuais.

export function AppGateProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useAppGate() {
  return {
    hasRated: false,
    adsUnlocked: false,
    lastAdTime: 0,
    shouldShowRating: () => false,
    completeRating: () => {},
    shouldShowVideoAd: () => false,
    recordAdShown: () => {},
  }
}
