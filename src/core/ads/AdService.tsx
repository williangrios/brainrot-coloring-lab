// AdMob removido — arquivo mantido como stub para compatibilidade de imports.
import React from 'react'
import { View } from 'react-native'

export function useInterstitialAd() {
  return { showAd: (_cb?: () => void) => {}, mockVisible: false, closeMock: () => {} }
}

export function AdBanner(_props: { visible?: boolean }) {
  return <View />
}

export function MockInterstitial(_props: { visible?: boolean; onClose?: () => void }) {
  return null
}
