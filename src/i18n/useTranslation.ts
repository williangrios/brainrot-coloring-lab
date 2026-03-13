import { useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { translations } from './translations'

const LANGUAGE_KEY = '@brainrot_language'

export function useTranslation() {
  const [language, setLanguage] = useState('en')

  const t = useCallback(
    (key: string) =>
      translations[language]?.[key] || translations['en']?.[key] || key,
    [language],
  )

  const changeLanguage = useCallback(async (lang: string) => {
    setLanguage(lang)
    await AsyncStorage.setItem(LANGUAGE_KEY, lang)
  }, [])

  const loadLanguage = useCallback(async () => {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY)
    if (saved) setLanguage(saved)
    return saved
  }, [])

  return { t, language, changeLanguage, loadLanguage }
}
