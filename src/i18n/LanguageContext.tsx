import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { translations } from './translations'

const LANGUAGE_KEY = '@brainrot_language'

type LanguageContextType = {
  language: string
  t: (key: string) => string
  changeLanguage: (lang: string) => Promise<void>
  isReady: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: (key) => key,
  changeLanguage: async () => {},
  isReady: false,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved) setLanguage(saved)
      setIsReady(true)
    })
  }, [])

  const t = useCallback(
    (key: string) =>
      translations[language]?.[key] || translations['en']?.[key] || key,
    [language],
  )

  const changeLanguage = useCallback(async (lang: string) => {
    setLanguage(lang)
    await AsyncStorage.setItem(LANGUAGE_KEY, lang)
  }, [])

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, isReady }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
