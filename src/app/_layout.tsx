import '@/i18n';

import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond/500Medium';
import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond/600SemiBold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StarField } from '@/components/star-field';
import { useProfile } from '@/storage/profile';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const ready = fontsLoaded || !!fontError;
  const profile = useProfile();
  const { name, colors } = useTheme();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  const base = name === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.gold,
      background: 'transparent',
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemeProvider value={navigationTheme}>
        <StarField />
        <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }}>
          <Stack.Protected guard={!!profile}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" options={{ animation: 'slide_from_bottom' }} />
          </Stack.Protected>
          <Stack.Protected guard={!profile}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
