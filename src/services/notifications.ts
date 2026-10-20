/** Lembrete diário local (sem servidor). O texto muda a cada vez que o app é aberto. */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { NOTIFICATION_LINES } from '@/content/daily';
import type { Lang } from '@/content/types';
import { prefsStore } from '@/storage/app-data';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

export async function requestNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily', { name: 'Diário', importance: Notifications.AndroidImportance.DEFAULT });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Agenda (ou reagenda) o lembrete diário conforme as preferências. */
export async function scheduleDaily(lang: Lang, title: string) {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  const p = prefsStore.get();
  if (!p.notifications) return;
  const lines = NOTIFICATION_LINES[lang];
  const day = Math.floor(Date.now() / 86400000);
  await Notifications.scheduleNotificationAsync({
    content: { title, body: lines[day % lines.length] },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: p.notifyHour, minute: p.notifyMinute, channelId: 'daily' },
  });
}

export async function enableNotifications(lang: Lang, title: string) {
  const ok = await requestNotifications();
  prefsStore.set((p) => ({ ...p, notifications: ok }));
  if (ok) await scheduleDaily(lang, title);
  return ok;
}

export async function disableNotifications() {
  prefsStore.set((p) => ({ ...p, notifications: false }));
  if (Platform.OS !== 'web') await Notifications.cancelAllScheduledNotificationsAsync();
}
