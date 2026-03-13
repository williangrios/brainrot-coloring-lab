import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../core/types/navigation'
import { useLanguage } from '../../i18n/LanguageContext'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>()
  const { t } = useLanguage()
  const videoRef = useRef<Video>(null)
  const [videoFinished, setVideoFinished] = useState(false)

  const handleEnter = () => {
    navigation.replace('Subscription')
  }

  const handleSkip = () => {
    navigation.replace('MainTabs')
  }

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      setVideoFinished(true)
    }
  }

  return (
    <View style={styles.container}>
      {!videoFinished ? (
        <Video
          ref={videoRef}
          source={require('../../assets/videos/onboarding.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          isMuted={false}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
      ) : (
        <Image
          source={require('../../assets/images/ui/splash.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}

      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('onboardingTitle')}</Text>
          <Text style={styles.subtitle}>{t('onboardingSubtitle')}</Text>

          <TouchableOpacity style={styles.enterButton} onPress={handleEnter}>
            <Text style={styles.enterText}>{t('enterLab')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>{t('skip')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  video: {
    width,
    height,
    position: 'absolute',
  },
  logo: {
    width,
    height,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  enterButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  enterText: {
    color: '#000',
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
