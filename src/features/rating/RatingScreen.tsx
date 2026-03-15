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

export default function RatingScreen() {
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const { completeRating } = useAppGate()
  const [step, setStep] = useState<'ask' | 'rate' | 'feedback'>('ask')
  const [feedbackText, setFeedbackText] = useState('')
  const [sent, setSent] = useState(false)

  const handleYes = () => {
    setStep('rate')
  }

  const handleNo = () => {
    setStep('feedback')
  }

  const handleGoToStore = async () => {
    completeRating()
    try {
      if (STORE_URL) await Linking.openURL(STORE_URL)
    } catch {}
    navigation.goBack()
  }

  const handleSkipRate = () => {
    completeRating()
    navigation.goBack()
  }

  const handleSendFeedback = async () => {
    // Fake request — substituir pelo endpoint real
    // await fetch(FEEDBACK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ feedback: feedbackText }),
    // })
    setSent(true)
    completeRating()
    setTimeout(() => navigation.goBack(), 1500)
  }

  const handleSkipFeedback = () => {
    completeRating()
    navigation.goBack()
  }

  if (step === 'rate') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleSkipRate}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>⭐</Text>
        <Text style={styles.title}>{t('rateUsTitle')}</Text>
        <Text style={styles.subtitle}>{t('rateUsSubtitle')}</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleGoToStore}>
          <Text style={styles.primaryBtnText}>{t('rateNow')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (step === 'feedback') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleSkipFeedback}>
                <Text style={styles.secondaryBtnText}>{t('skip')}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  // step === 'ask'
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎨</Text>
      <Text style={styles.title}>{t('enjoyingApp')}</Text>
      <Text style={styles.subtitle}>{t('enjoyingAppSubtitle')}</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleYes}>
        <Text style={styles.primaryBtnText}>{t('yes')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.negativeBtn} onPress={handleNo}>
        <Text style={styles.negativeBtnText}>{t('notReally')}</Text>
      </TouchableOpacity>
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
  negativeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  negativeBtnText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
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
