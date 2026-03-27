import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCredits } from '../../core/context/CreditsContext'
import ScreenWrapper from '../../core/components/ScreenWrapper'

type Nav = NativeStackNavigationProp<RootStackParamList>

const { width } = Dimensions.get('window')

const PLAN_ORDER = ['$rc_weekly', '$rc_monthly', '$rc_annual'] as const

function getPlanMeta(packageType: string, t: (k: string) => string) {
  switch (packageType) {
    case '$rc_weekly':
      return { label: t('planWeekly'), period: t('perWeek'), badge: null }
    case '$rc_monthly':
      return { label: t('planMonthly'), period: t('perMonth'), badge: t('mostPopular') }
    case '$rc_annual':
      return { label: t('planYearly'), period: t('perYear'), badge: t('bestValue') }
    default:
      return { label: '', period: '', badge: null }
  }
}

export default function SubscriptionScreen() {
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const { packages, purchase, restore } = useCredits()
  const [purchasing, setPurchasing] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Sort packages by plan order, default select yearly
  const sortedPackages = [...packages].sort((a, b) => {
    const ai = PLAN_ORDER.indexOf(a.packageType as any)
    const bi = PLAN_ORDER.indexOf(b.packageType as any)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  // Default select yearly (index 2) or last available
  const effectiveSelected = selectedIndex >= 0
    ? selectedIndex
    : sortedPackages.length > 0
      ? sortedPackages.length - 1
      : 0

  const handlePurchase = async () => {
    if (sortedPackages.length === 0) {
      navigation.replace('MainTabs')
      return
    }
    setPurchasing(true)
    try {
      const success = await purchase(sortedPackages[effectiveSelected])
      if (success) {
        navigation.replace('MainTabs')
      } else {
        Alert.alert(t('purchaseFailed'), t('tryAgainLater'))
      }
    } catch {
      Alert.alert(t('purchaseFailed'), t('tryAgainLater'))
    }
    setPurchasing(false)
  }

  const handleRestore = async () => {
    setPurchasing(true)
    const success = await restore()
    setPurchasing(false)
    if (success) {
      navigation.replace('MainTabs')
    }
  }

  const handleContinue = () => {
    navigation.replace('MainTabs')
  }

  const selectedPkg = sortedPackages[effectiveSelected]
  const selectedPrice = selectedPkg?.product?.priceString ?? ''

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Top: logo + badge */}
        <View style={styles.topSection}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
        </View>

        {/* Plan cards */}
        <View style={styles.plansSection}>
          {sortedPackages.map((pkg, index) => {
            const meta = getPlanMeta(pkg.packageType, t)
            const isSelected = index === effectiveSelected

            return (
              <TouchableOpacity
                key={pkg.identifier ?? index}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => setSelectedIndex(index)}
                activeOpacity={0.7}
              >
                {meta.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{meta.badge}</Text>
                  </View>
                )}
                <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>
                  {meta.label}
                </Text>
                <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                  {pkg.product.priceString}
                  <Text style={styles.planPeriod}>{meta.period}</Text>
                </Text>
              </TouchableOpacity>
            )
          })}

          {sortedPackages.length === 0 && (
            <Text style={styles.noPlanText}>{t('subUnlockTitle')}</Text>
          )}
        </View>

        {/* Bottom: CTA always visible */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handlePurchase}
            disabled={purchasing}
            activeOpacity={0.85}
          >
            {purchasing ? (
              <ActivityIndicator color="#0a0a0a" />
            ) : (
              <Text style={styles.ctaText}>
                {selectedPrice
                  ? `${t('subscribe')} \u2014 ${selectedPrice}`
                  : t('subscribe')}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={handleRestore} disabled={purchasing}>
              <Text style={styles.linkText}>{t('restorePurchases')}</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>|</Text>
            <TouchableOpacity onPress={handleContinue}>
              <Text style={styles.linkText}>{t('continueFreePlan')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const CARD_WIDTH = (width - 48 - 16) / 3

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 36,
  },
  topSection: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: 24,
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  premiumBadgeText: {
    color: '#0a0a0a',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  plansSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    alignItems: 'center',
  },
  planCard: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a3e',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#00ff88',
    backgroundColor: '#0f2a1a',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#00ff88',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeText: {
    color: '#0a0a0a',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  planLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  planLabelSelected: {
    color: '#00ff88',
  },
  planPrice: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  planPriceSelected: {
    color: '#fff',
  },
  planPeriod: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  noPlanText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 12,
  },
  ctaButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: '800',
  },
  linksRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    color: '#666',
    fontSize: 13,
  },
  separator: {
    color: '#444',
    fontSize: 13,
  },
})
