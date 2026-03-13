import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import Header from '../../core/components/Header'
import { useCredits } from '../../core/context/CreditsContext'
import { useLanguage } from '../../i18n/LanguageContext'
import AppLogo from '../../core/components/AppLogo'

export default function ProfileScreen() {
  const navigation = useNavigation<any>()
  const { credits, shareCount, isPremium } = useCredits()
  const { t, language } = useLanguage()

  const handleChangeLanguage = () => { navigation.getParent()?.navigate('LanguageSelect') }
  const handleUpgrade = () => { navigation.getParent()?.navigate('Subscription') }

  return (
    <ScreenWrapper noBottom>
      <Header title={t('profile')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('yourPlan')}</Text>
          {isPremium ? (
            <View style={styles.planBadge}><Text style={styles.planBadgeText}>{t('premium')}</Text></View>
          ) : (
            <>
              <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>{t('free')}</Text></View>
              <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
                <Text style={styles.upgradeBtnText}>{t('upgradeToPremium')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {!isPremium && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('credits')}</Text>
            <View style={styles.creditsRow}>
              <View style={styles.creditItem}><Text style={styles.creditNumber}>{credits}</Text><Text style={styles.creditLabel}>{t('available')}</Text></View>
              <View style={styles.creditItem}><Text style={styles.creditNumber}>{shareCount}/3</Text><Text style={styles.creditLabel}>{t('sharesUsed')}</Text></View>
            </View>
            <Text style={styles.creditsHint}>{t('shareCreditsHint')}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings')}</Text>
          <TouchableOpacity style={styles.settingRow} onPress={handleChangeLanguage}>
            <Text style={styles.settingLabel}>{t('language')}</Text>
            <Text style={styles.settingValue}>{language.toUpperCase()} ›</Text>
          </TouchableOpacity>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.settingLabel}>{t('version')}</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>

        {!isPremium && (
          <View style={styles.premiumCard}>
            <Text style={styles.premiumTitle}>{t('premiumFeatures')}</Text>
            <Text style={styles.premiumFeature}>{t('unlimitedDrawings')}</Text>
            <Text style={styles.premiumFeature}>{t('noWatermark')}</Text>
            <Text style={styles.premiumFeature}>{t('allPalettes')}</Text>
            <Text style={styles.premiumFeature}>{t('restartAnytime')}</Text>
            <Text style={styles.premiumFeature}>{t('multipleDrawings')}</Text>
          </View>
        )}

        {/* Logo at bottom */}
        <View style={styles.logoFooter}>
          <AppLogo size={80} />
          <Text style={styles.logoText}>Brainrot Coloring Lab</Text>
          <Text style={styles.logoVersion}>v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#222' },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  planBadge: { backgroundColor: '#00ff88', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start' },
  planBadgeText: { color: '#111', fontSize: 14, fontWeight: '700' },
  freeBadge: { backgroundColor: '#333', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 12 },
  freeBadgeText: { color: '#aaa', fontSize: 14, fontWeight: '700' },
  upgradeBtn: { backgroundColor: '#00ff88', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  upgradeBtnText: { color: '#111', fontSize: 15, fontWeight: '700' },
  creditsRow: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  creditItem: { alignItems: 'center' },
  creditNumber: { color: '#FFD600', fontSize: 28, fontWeight: '800' },
  creditLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  creditsHint: { color: '#666', fontSize: 12, lineHeight: 18 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  settingLabel: { color: '#ccc', fontSize: 15 },
  settingValue: { color: '#888', fontSize: 14 },
  premiumCard: { backgroundColor: '#0a2a18', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#00ff8833', gap: 8 },
  premiumTitle: { color: '#00ff88', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  premiumFeature: { color: '#aaffcc', fontSize: 14 },
  logoFooter: { alignItems: 'center', paddingTop: 20 },
  logoText: { color: '#444', fontSize: 16, fontWeight: '700' },
  logoVersion: { color: '#333', fontSize: 12, marginTop: 4 },
})
