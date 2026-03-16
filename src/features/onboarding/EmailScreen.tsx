import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RootStackParamList } from '../../core/types/navigation'
import { useLanguage } from '../../i18n/LanguageContext'

type Nav = NativeStackNavigationProp<RootStackParamList>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// TODO: substituir pela URL real do backend
const SUBMIT_EMAIL_URL = 'https://PLACEHOLDER_API_URL/api/v1/subscribe'

export default function EmailScreen() {
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isValid = EMAIL_REGEX.test(email.trim())

  const handleSubmit = async () => {
    Keyboard.dismiss()
    const trimmed = email.trim().toLowerCase()

    if (!EMAIL_REGEX.test(trimmed)) {
      setError(t('emailInvalid'))
      return
    }

    setError('')
    setLoading(true)

    try {
      // Fake request — será substituída pelo endpoint real
      // await fetch(SUBMIT_EMAIL_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: trimmed }),
      // })

      // Simula latência
      await new Promise((r) => setTimeout(r, 400))

      await AsyncStorage.setItem('@brainrot_onboarding_done', 'true')
      navigation.replace('Subscription')
    } catch {
      // Se falhar, segue mesmo assim (não bloquear o usuário por erro de rede)
      navigation.replace('Subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🎨</Text>
        <Text style={styles.title}>{t('emailTitle')}</Text>
        <Text style={styles.subtitle}>{t('emailSubtitle')}</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder={t('emailPlaceholder')}
            placeholderTextColor="#555"
            value={email}
            onChangeText={(text) => { setEmail(text); setError('') }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="go"
            onSubmitEditing={isValid ? handleSubmit : undefined}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#111" size="small" />
          ) : (
            <Text style={styles.submitText}>{t('continue')}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.privacy}>{t('emailPrivacy')}</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
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
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#333',
    width: '100%',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  submitBtn: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: '#111',
    fontSize: 18,
    fontWeight: '800',
  },
  privacy: {
    color: '#444',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
})
