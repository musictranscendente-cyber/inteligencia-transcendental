import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { GlassCard } from '@/components/glass-card';
import { TarotFace } from '@/components/tarot-face';
import { Screen } from '@/components/ui/screen';
import { MAJOR_ARCANA } from '@/content/tarot-major';
import { useLang } from '@/content/types';
import { useReading } from '@/hooks/use-reading';
import { enableNotifications } from '@/services/notifications';
import { paywallEnabled } from '@/services/purchases';
import { prefsStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

/** Depois da revelação: compartilhar o arcano, ativar o lembrete e ver a assinatura (opcional). */
export default function WelcomeScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const r = useReading();
  const prefs = prefsStore.use();
  if (!r) return null;
  const a = MAJOR_ARCANA[r.arcana][lang];
  const next = () => (paywallEnabled() ? router.replace('/paywall') : router.back());

  return (
    <Screen title={t('welcome.title')}>
      <View style={styles.center}>
        <TarotFace id={`M${r.arcana}`} width={160} color={colors.technique.tarot} />
        <AppText variant="subtitle" center>{t('welcome.arcana', { name: a.name })}</AppText>
        <AppText muted center>{a.summary}</AppText>
      </View>
      <Button variant="secondary" title={t('welcome.share')} onPress={() => router.push({ pathname: '/share', params: { template: 'arcana' } })} />
      <GlassCard style={styles.gap}>
        <AppText center>{t('welcome.notify')}</AppText>
        {prefs.notifications ? <AppText center gold>{t('welcome.notifyDone')}</AppText> : <Button variant="ghost" title={t('welcome.notifyCta')} onPress={() => enableNotifications(lang, t('app.name'))} />}
      </GlassCard>
      <Button title={t('welcome.continue')} onPress={next} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.md },
  gap: { gap: spacing.sm },
});
