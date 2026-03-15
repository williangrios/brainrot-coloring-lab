import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { LanguageProvider } from './src/i18n/LanguageContext'
import { CreditsProvider } from './src/core/context/CreditsContext'
import { AppGateProvider } from './src/core/context/AppGateContext'
import RootNavigator from './src/navigation/RootNavigator'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <CreditsProvider>
            <AppGateProvider>
              <NavigationContainer>
                <StatusBar style="light" />
                <RootNavigator />
              </NavigationContainer>
            </AppGateProvider>
          </CreditsProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
