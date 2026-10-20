import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { langOf } from '@/content/types';
import { scheduleDaily } from '@/services/notifications';
import { initPurchases } from '@/services/purchases';
import { touchStreak } from '@/storage/app-data';
import { kv } from '@/storage/kv';
export { ErrorScreen as ErrorBoundary } from '@/components/error-screen';

export default function MainLayout() {
  const { t, i18n } = useTranslation();

  // Logo após o cadastro, mostra a tela de boas-vindas uma única vez.
  useEffect(() => {
    if (kv.getString('onboarding.welcome')) {
      kv.remove('onboarding.welcome');
      setTimeout(() => router.push('/welcome'), 300);
    }
  }, []);

  useEffect(() => {
    touchStreak();
    initPurchases();
    scheduleDaily(langOf(i18n.language), t('app.name')).catch(() => {});
  }, [i18n.language, t]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'slide_from_right' }}>
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="paywall" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="share" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
