import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import { useLanguage } from '../../i18n/LanguageContext'
import ScreenWrapper from '../../core/components/ScreenWrapper'
import AppLogo from '../../core/components/AppLogo'

const languages = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
]

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function LanguageSelectScreen() {
  const navigation = useNavigation<Nav>()
  const { language, changeLanguage, t } = useLanguage()

  const handleSelect = async (code: string) => {
    await changeLanguage(code)
  }

  const handleContinue = () => {
    navigation.replace('Onboarding')
  }

  return (
    <ScreenWrapper backgroundColor="#0a0a0a">
    <View style={styles.container}>
      <AppLogo size={64} />
      <Text style={styles.subtitle}>Brainrot Coloring Lab</Text>

      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.langButton,
              language === item.code && styles.langButtonActive,
            ]}
            onPress={() => handleSelect(item.code)}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text
              style={[
                styles.langText,
                language === item.code && styles.langTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
    </ScreenWrapper>
  )
}

const { width } = Dimensions.get('window')
const BUTTON_WIDTH = (width - 60) / 2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 30,
  },
  list: {
    paddingHorizontal: 20,
  },
  langButton: {
    width: BUTTON_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  langButtonActive: {
    borderColor: '#00ff88',
    backgroundColor: '#0d2818',
  },
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  langText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
  },
  langTextActive: {
    color: '#00ff88',
  },
  continueButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginVertical: 30,
  },
  continueText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
