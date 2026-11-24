import { useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { GlassCard } from '@/components/glass-card';
import { Screen } from '@/components/ui/screen';
import { LEGAL, LEGAL_UPDATED, type LegalDoc } from '@/content/legal';
import { useLang } from '@/content/types';
import { formatDate } from '@/lib/format';
import { CONFIG } from '@/services/config';
import { spacing } from '@/theme';

/** Política de privacidade e termos de uso, no idioma do app. */
export default function LegalScreen() {
  const { doc: raw } = useLocalSearchParams<{ doc: string }>();
  const doc: LegalDoc = raw === 'terms' ? 'terms' : 'privacy';
  const { t, i18n } = useTranslation();
  const lang = useLang();
  return (
    <Screen title={t(doc === 'terms' ? 'menu.terms' : 'menu.privacy')}>
      <AppText variant="caption" muted>{t('menu.updated', { date: formatDate(new Date(`${LEGAL_UPDATED}T12:00:00`), i18n.language) })}</AppText>
      {LEGAL[doc][lang].map((s) => (
        <GlassCard key={s.title} style={{ gap: spacing.sm }}>
          <AppText variant="bodyStrong">{s.title}</AppText>
          <AppText muted>{s.text}</AppText>
        </GlassCard>
      ))}
      {CONFIG.supportEmail ? <Button variant="secondary" title={t('menu.contact')} onPress={() => Linking.openURL(`mailto:${CONFIG.supportEmail}`)} /> : null}
    </Screen>
  );
}
