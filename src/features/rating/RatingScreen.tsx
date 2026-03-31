import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCredits } from '../../core/context/CreditsContext'

type Nav = NativeStackNavigationProp<RootStackParamList>

const STORE_URL = Platform.select({
  ios: 'https://apps.apple.com/app/id6761076641?action=write-review',
  android: 'https://play.google.com/store/apps/details?id=br.com.wrsolucoesdigitais.brainrotcoloring',
  default: '',
})

function StarRow({ rating, onRate }: { rating: number; onRate: (n: number) => void }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onRate(n)} activeOpacity={0.7}>
          <Text style={[styles.star, n <= rating && styles.starActive]}>{'\u2605'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default function RatingScreen() {
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const { completeRating } = useCredits()
  const [rating, setRating] = useState(0)

  const handleRate = async (stars: number) => {
    setRating(stars)
    await completeRating()

    if (stars >= 4) {
      try {
        if (STORE_URL) await Linking.openURL(STORE_URL)
      } catch {}
    }
    navigation.goBack()
  }

  const handleDismiss = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss}>
        <Text style={styles.closeBtnText}>{'\u2715'}</Text>
      </TouchableOpacity>
      <Text style={styles.emoji}>{'\uD83C\uDFA8'}</Text>
      <Text style={styles.title}>{t('enjoyingApp')}</Text>
      <Text style={styles.subtitle}>{t('enjoyingAppSubtitle')}</Text>

      <StarRow rating={rating} onRate={handleRate} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  starRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  star: {
    fontSize: 44,
    color: '#333',
  },
  starActive: {
    color: '#FFD600',
  },
})
