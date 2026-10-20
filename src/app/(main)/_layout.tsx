import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { langOf } from '@/content/types';
import { scheduleDaily } from '@/services/notifications';
import { initPurchases } from '@/services/purchases';
import { touchStreak } from '@/storage/app-data';

export default function MainLayout() {
  const { t, i18n } = useTranslation();

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
