import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, PlusCircle, BookOpen, Compass, User } from 'lucide-react-native'
import { MainTabParamList } from '../core/types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import HomeScreen from '../features/onboarding/HomeScreen'
import CreationScreen from '../features/creation/CreationScreen'
import LibraryScreen from '../features/library/LibraryScreen'
import ExploreScreen from '../features/explore/ExploreScreen'
import ProfileScreen from '../features/profile/ProfileScreen'

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function TabNavigator() {
  const { t } = useLanguage()
  const insets = useSafeAreaInsets()
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0)

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#333',
          paddingBottom: bottomPad,
          height: 56 + bottomPad,
        },
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarLabel: t('home'), tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tab.Screen name="Create" component={CreationScreen}
        options={{ tabBarLabel: t('create'), tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} /> }} />
      <Tab.Screen name="Library" component={LibraryScreen}
        options={{ tabBarLabel: t('library'), tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} /> }} />
      <Tab.Screen name="Explore" component={ExploreScreen}
        options={{ tabBarLabel: t('explore'), tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: t('profile'), tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tab.Navigator>
  )
}
