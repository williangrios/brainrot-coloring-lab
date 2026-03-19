import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  Linking, Platform, KeyboardAvoidingView, ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAppGate } from '../../core/context/AppGateContext'

type Nav = NativeStackNavigationProp<RootStackParamList>

// TODO: substituir pelas URLs reais das lojas
const STORE_URL = Platform.select({
  ios: 'https://apps.apple.com/app/idXXXXXXXXXX?action=write-review',
  android: 'https://play.google.com/store/apps/details?id=com.brainrot.coloring',
  default: '',
})

// TODO: endpoint para receber feedback negativo
const FEEDBACK_URL = 'https://PLACEHOLDER_API_URL/api/v1/feedback'

function StarRow({ rating, onRate }: { rating: number; onRate: (n: number) => void }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onRate(n)} activeOpacity={0.7}>
          <Text style={[styles.star, n <= rating && styles.starActive]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default function RatingScreen() {
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const { completeRating } = useAppGate()
  const [step, setStep] = useState<'ask' | 'feedback'>('ask')
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [sent, setSent] = useState(false)

  const handleRate = async (stars: number) => {
    setRating(stars)
    if (stars >= 4) {
      // High rating → send to store
      completeRating()
      try {
        if (STORE_URL) await Linking.openURL(STORE_URL)
      } catch {}
      navigation.goBack()
    } else {
      // Low rating → feedback form
      setStep('feedback')
    }
  }

  const handleSendFeedback = async () => {
    // Fake request — substituir pelo endpoint real
    // await fetch(FEEDBACK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ rating, feedback: feedbackText }),
    // })
    setSent(true)
    completeRating()
    setTimeout(() => navigation.goBack(), 1500)
  }

  const handleSkip = () => {
    completeRating()
    navigation.goBack()
  }

  if (step === 'feedback') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.closeBtn} onPress={handleSkip}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.emoji}>💬</Text>
          <Text style={styles.title}>{t('feedbackTitle')}</Text>
          <Text style={styles.subtitle}>{t('feedbackSubtitle')}</Text>

          <TextInput
            style={styles.feedbackInput}
            placeholder={t('feedbackPlaceholder')}
            placeholderTextColor="#555"
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />

          {sent ? (
            <Text style={styles.thankYou}>{t('feedbackThanks')}</Text>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.primaryBtn, !feedbackText.trim() && styles.primaryBtnDisabled]}
                onPress={handleSendFeedback}
                disabled={!feedbackText.trim()}
              >
                <Text style={styles.primaryBtnText}>{t('sendFeedback')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleSkip}>
                <Text style={styles.secondaryBtnText}>{t('skip')}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  // step === 'ask' — star selector
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={handleSkip}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.emoji}>🎨</Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
  primaryBtn: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryBtnText: {
    color: '#111',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryBtn: {
    paddingVertical: 12,
  },
  secondaryBtnText: {
    color: '#666',
    fontSize: 15,
  },
  feedbackInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#333',
    width: '100%',
    minHeight: 120,
    marginBottom: 20,
  },
  thankYou: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
})
