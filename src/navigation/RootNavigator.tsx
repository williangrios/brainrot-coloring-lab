import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../core/types/navigation';
import LanguageSelectScreen from '../features/onboarding/LanguageSelectScreen';
import EmailScreen from '../features/onboarding/EmailScreen';
import OnboardingScreen from '../features/onboarding/OnboardingScreen';
import SubscriptionScreen from '../features/subscription/SubscriptionScreen';
import RatingScreen from '../features/rating/RatingScreen';
import PaintingScreen from '../features/painting/PaintingScreen';
import FinalizationScreen from '../features/painting/FinalizationScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();
const ONBOARDING_KEY = '@brainrot_onboarding_done';

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setInitialRoute(val === 'true' ? 'MainTabs' : 'LanguageSelect');
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <Stack.Screen name="Email" component={EmailScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Rating" component={RatingScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Painting" component={PaintingScreen} />
      <Stack.Screen name="Finalization" component={FinalizationScreen} />
    </Stack.Navigator>
  );
}
