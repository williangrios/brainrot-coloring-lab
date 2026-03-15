import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../core/types/navigation';
import LanguageSelectScreen from '../features/onboarding/LanguageSelectScreen';
import OnboardingScreen from '../features/onboarding/OnboardingScreen';
import SubscriptionScreen from '../features/subscription/SubscriptionScreen';
import PaintingScreen from '../features/painting/PaintingScreen';
import FinalizationScreen from '../features/painting/FinalizationScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LanguageSelect"
    >
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Painting" component={PaintingScreen} />
      <Stack.Screen name="Finalization" component={FinalizationScreen} />
    </Stack.Navigator>
  );
}
