import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import { useLanguage } from '../../i18n/LanguageContext'
import ScreenWrapper from '../../core/components/ScreenWrapper'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function SubscriptionScreen() {
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()

  const handleContinue = () => {
    navigation.replace('MainTabs')
  }

  return (
    <ScreenWrapper>
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Brainrot Coloring</Text>
        <Text style={styles.subtitle}>Premium</Text>

        <View style={styles.features}>
          <Text style={styles.feature}>{t('unlimitedDrawings')}</Text>
          <Text style={styles.feature}>{t('noWatermark')}</Text>
          <Text style={styles.feature}>{t('allPalettes')}</Text>
          <Text style={styles.feature}>{t('restartAnytime')}</Text>
        </View>

        <TouchableOpacity style={styles.premiumButton} onPress={handleContinue}>
          <Text style={styles.premiumText}>{t('startFreeTrial')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleContinue}>
          <Text style={styles.skipText}>{t('continueFreePlan')}</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00ff88',
    marginBottom: 40,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: 40,
    gap: 14,
  },
  feature: {
    color: '#ccc',
    fontSize: 16,
    paddingLeft: 16,
  },
  premiumButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumText: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipText: {
    color: '#888',
    fontSize: 15,
  },
})
