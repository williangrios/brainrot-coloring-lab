import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import { useCredits } from '../../core/context/CreditsContext'
import { useLanguage } from '../../i18n/LanguageContext'
import AppLogo from '../../core/components/AppLogo'

export default function ProfileScreen() {
  const navigation = useNavigation<any>()
  const { isPremium, restore, credits, shareCreditsCount, hasRated } = useCredits()
  const { t, language } = useLanguage()

  const handleChangeLanguage = () => {
    navigation.getParent()?.navigate('LanguageSelect')
  }

  const handleRestore = async () => {
    const success = await restore()
    if (success) {
      Alert.alert(t('restored'), t('premiumRestored'))
    } else {
      Alert.alert(t('noSubscription'), t('noSubscriptionMsg'))
    }
  }

  return (
    <ScreenWrapper noBottom>
      <Header title={t('profile')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('yourPlan')}</Text>
          {isPremium ? (
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{t('premium')}</Text>
            </View>
          ) : (
            <>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>{t('free')}</Text>
              </View>
              <View style={styles.creditsRow}>
                <View style={styles.creditStat}>
                  <Text style={styles.creditNumber}>{credits}</Text>
                  <Text style={styles.creditLabel}>{t('available')}</Text>
                </View>
                <View style={styles.creditDivider} />
                <View style={styles.creditStat}>
                  <Text style={styles.creditNumber}>{shareCreditsCount}</Text>
                  <Text style={styles.creditLabel}>{t('sharesUsed')}</Text>
                </View>
              </View>
              {!hasRated && (
                <Text style={styles.shareHint}>{t('shareToEarn')}</Text>
              )}
              {hasRated && shareCreditsCount < 3 && (
                <Text style={styles.shareHint}>{t('shareCreditsHint')}</Text>
              )}
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => navigation.getParent()?.navigate('Subscription')}
              >
                <Text style={styles.upgradeBtnText}>{t('upgradeToPremium')}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
            <Text style={styles.restoreBtnText}>{t('restorePurchases')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings')}</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleChangeLanguage}
          >
            <Text style={styles.settingLabel}>{t('language')}</Text>
            <Text style={styles.settingValue}>{language.toUpperCase()} ›</Text>
          </TouchableOpacity>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.settingLabel}>{t('version')}</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>

        <View style={styles.logoFooter}>
          <AppLogo size={130} />
          <Text style={styles.logoText}>Brainrot Coloring</Text>
          <Text style={styles.logoVersion}>v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  planBadge: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  planBadgeText: { color: '#111', fontSize: 14, fontWeight: '700' },
  freeBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  freeBadgeText: { color: '#aaa', fontSize: 14, fontWeight: '700' },
  creditsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  creditStat: { flex: 1, alignItems: 'center' },
  creditNumber: { color: '#00ff88', fontSize: 28, fontWeight: '800' },
  creditLabel: { color: '#888', fontSize: 12, fontWeight: '600', marginTop: 2 },
  creditDivider: { width: 1, height: 36, backgroundColor: '#333' },
  shareHint: { color: '#aaa', fontSize: 12, textAlign: 'center', lineHeight: 18, marginBottom: 12 },
  upgradeBtn: {
    backgroundColor: '#00ff88',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  upgradeBtnText: { color: '#111', fontSize: 14, fontWeight: '700' },
  restoreBtn: { paddingVertical: 10, alignItems: 'center' },
  restoreBtnText: { color: '#888', fontSize: 13 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  settingLabel: { color: '#ccc', fontSize: 15 },
  settingValue: { color: '#888', fontSize: 14 },
  logoFooter: { alignItems: 'center', paddingTop: 20 },
  logoText: { color: '#444', fontSize: 16, fontWeight: '700' },
  logoVersion: { color: '#333', fontSize: 12, marginTop: 4 },
})
