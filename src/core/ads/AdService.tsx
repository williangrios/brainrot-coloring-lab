import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'

/**
 * Mock Ad Service — substituir por react-native-google-mobile-ads
 * quando migrar para development build.
 *
 * Para usar AdMob de verdade:
 * 1. npm install react-native-google-mobile-ads
 * 2. npx expo prebuild
 * 3. Adicionar app.json → "react-native-google-mobile-ads": { "android_app_id": "ca-app-pub-XXX", "ios_app_id": "ca-app-pub-XXX" }
 * 4. Substituir MockVideoAd por InterstitialAd / RewardedAd
 * 5. Substituir MockBannerAd por BannerAd
 *
 * Test ad unit IDs (Google):
 * - Banner:       ca-app-pub-3940256099942544/6300978111
 * - Interstitial: ca-app-pub-3940256099942544/1033173712
 * - Rewarded:     ca-app-pub-3940256099942544/5224354917
 */

// ---- Mock Video Ad (Interstitial) ----

interface MockVideoAdProps {
  visible: boolean
  onClose: () => void
}

export function MockVideoAd({ visible, onClose }: MockVideoAdProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!visible) { setCountdown(5); return }
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [visible])

  if (!visible) return null

  return (
    <Modal visible transparent animationType="fade">
      <View style={adStyles.overlay}>
        <View style={adStyles.adContainer}>
          <Text style={adStyles.adLabel}>AD</Text>
          <Text style={adStyles.adTitle}>Video Advertisement</Text>
          <Text style={adStyles.adBody}>
            This is a mock ad placeholder.{'\n'}
            Replace with real AdMob interstitial.
          </Text>
          {countdown > 0 ? (
            <Text style={adStyles.countdown}>Skip in {countdown}s</Text>
          ) : (
            <TouchableOpacity style={adStyles.closeBtn} onPress={onClose}>
              <Text style={adStyles.closeBtnText}>Close Ad ✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  )
}

// ---- Mock Banner Ad ----

interface MockBannerAdProps {
  visible: boolean
}

export function MockBannerAd({ visible }: MockBannerAdProps) {
  if (!visible) return null
  return (
    <View style={bannerStyles.container}>
      <Text style={bannerStyles.label}>AD</Text>
      <Text style={bannerStyles.text}>Banner Ad Placeholder</Text>
    </View>
  )
}

// ---- Hook for video ad logic ----

export function useVideoAd() {
  const [showing, setShowing] = useState(false)
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null)

  const showAd = useCallback((onComplete?: () => void) => {
    if (onComplete) setPendingCallback(() => onComplete)
    setShowing(true)
  }, [])

  const onAdClosed = useCallback(() => {
    setShowing(false)
    pendingCallback?.()
    setPendingCallback(null)
  }, [pendingCallback])

  return { showing, showAd, onAdClosed }
}

// ---- Styles ----

const adStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#333',
  },
  adLabel: {
    color: '#FFD600',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 16,
  },
  adTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  adBody: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  countdown: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})

const bannerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#FFD600',
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  text: {
    color: '#666',
    fontSize: 12,
  },
})
