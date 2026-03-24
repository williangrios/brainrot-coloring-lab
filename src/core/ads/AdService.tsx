import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native'

/**
 * AdMob com fallback para Expo Go.
 *
 * Em Expo Go: mostra anúncios mock (módulo nativo não disponível).
 * Em dev build / produção: usa react-native-google-mobile-ads real.
 *
 * TODO: substituir os ad unit IDs de teste pelos reais do AdMob.
 */

// ── Detectar se módulo nativo está disponível ────────────────

let AdMob: any = null
let TestIds: any = { INTERSTITIAL: '', BANNER: '' }

try {
  AdMob = require('react-native-google-mobile-ads')
  TestIds = AdMob.TestIds
} catch {
  // Módulo nativo não disponível (Expo Go)
}

const isNativeAvailable = AdMob !== null

// TODO: substituir pelos ad unit IDs reais
const INTERSTITIAL_ID = Platform.select({
  ios: TestIds.INTERSTITIAL,
  android: TestIds.INTERSTITIAL,
}) ?? TestIds.INTERSTITIAL

const BANNER_ID = Platform.select({
  ios: TestIds.BANNER,
  android: TestIds.BANNER,
}) ?? TestIds.BANNER

// ── Interstitial Ad Hook ─────────────────────────────────────

export function useInterstitialAd() {
  const [loaded, setLoaded] = useState(false)
  const onCloseRef = useRef<(() => void) | null>(null)
  const interstitialRef = useRef<any>(null)

  // Mock state
  const [mockVisible, setMockVisible] = useState(false)

  useEffect(() => {
    if (!isNativeAvailable) return

    const { InterstitialAd, AdEventType } = AdMob
    const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID)
    interstitialRef.current = interstitial

    const loadedUnsub = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true)
    })
    const closedUnsub = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false)
      onCloseRef.current?.()
      onCloseRef.current = null
      interstitial.load()
    })
    const errorUnsub = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      setLoaded(false)
      setTimeout(() => interstitial.load(), 30_000)
    })

    interstitial.load()

    return () => {
      loadedUnsub()
      closedUnsub()
      errorUnsub()
    }
  }, [])

  const showAd = useCallback((onComplete?: () => void) => {
    if (!isNativeAvailable) {
      // Mock: mostra modal fake
      onCloseRef.current = onComplete ?? null
      setMockVisible(true)
      return
    }

    if (loaded && interstitialRef.current) {
      onCloseRef.current = onComplete ?? null
      interstitialRef.current.show()
    } else {
      onComplete?.()
    }
  }, [loaded])

  const closeMock = useCallback(() => {
    setMockVisible(false)
    onCloseRef.current?.()
    onCloseRef.current = null
  }, [])

  return { loaded: isNativeAvailable ? loaded : true, showAd, mockVisible, closeMock }
}

// ── Banner Ad Component ──────────────────────────────────────

interface AdBannerProps {
  visible: boolean
}

export function AdBanner({ visible }: AdBannerProps) {
  if (!visible) return null

  if (isNativeAvailable) {
    const { BannerAd, BannerAdSize } = AdMob
    return (
      <View style={bannerStyles.container}>
        <BannerAd
          unitId={BANNER_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    )
  }

  // Mock banner para Expo Go
  return (
    <View style={mockBannerStyles.container}>
      <Text style={mockBannerStyles.label}>AD</Text>
      <Text style={mockBannerStyles.text}>Banner Ad (dev mode)</Text>
    </View>
  )
}

// ── Mock Interstitial Component ──────────────────────────────

interface MockInterstitialProps {
  visible: boolean
  onClose: () => void
}

export function MockInterstitial({ visible, onClose }: MockInterstitialProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!visible) { setCountdown(5); return }
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [visible])

  if (!visible) return null

  return (
    <Modal visible transparent animationType="fade">
      <View style={mockAdStyles.overlay}>
        <View style={mockAdStyles.container}>
          <Text style={mockAdStyles.label}>AD</Text>
          <Text style={mockAdStyles.title}>Interstitial (dev mode)</Text>
          <Text style={mockAdStyles.body}>
            Em produção, aqui aparece o anúncio real do AdMob.
          </Text>
          {countdown > 0 ? (
            <Text style={mockAdStyles.countdown}>Fechar em {countdown}s</Text>
          ) : (
            <TouchableOpacity style={mockAdStyles.closeBtn} onPress={onClose}>
              <Text style={mockAdStyles.closeBtnText}>Fechar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  )
}

// ── Styles ───────────────────────────────────────────────────

const bannerStyles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: '#111' },
})

const mockBannerStyles = StyleSheet.create({
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
  text: { color: '#666', fontSize: 12 },
})

const mockAdStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#333',
  },
  label: {
    color: '#FFD600',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 16,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  body: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  countdown: { color: '#666', fontSize: 14, fontWeight: '600' },
  closeBtn: { backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20 },
  closeBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
})
