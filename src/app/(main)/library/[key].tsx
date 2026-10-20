import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { GlassCard } from '@/components/glass-card';
import { BookIcon } from '@/components/icons';
import { SectionTitle } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { LIBRARY, type LibraryKey } from '@/content/library';
import { useLang } from '@/content/types';
import { spacing, useTheme } from '@/theme';

export default function LibraryPage() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const page = LIBRARY[(key in LIBRARY ? key : 'numerology') as LibraryKey][lang];
  return (
    <Screen title={page.title} kicker={t('lib.title')}>
      <View style={styles.center}>
        <BookIcon size={64} color={colors.gold} strokeWidth={1} />
      </View>
      <GlassCard style={styles.gap}>
        <SectionTitle>{t('lib.what')}</SectionTitle>
        <AppText>{page.what}</AppText>
        <SectionTitle>{t('lib.origin')}</SectionTitle>
        <AppText>{page.origin}</AppText>
        <SectionTitle>{t('lib.howToRead')}</SectionTitle>
        <AppText>{page.howToRead}</AppText>
      </GlassCard>
      <GlassCard style={styles.gap}>
        <SectionTitle>{t('lib.glossary')}</SectionTitle>
        {page.glossary.map(([term, def]) => (
          <View key={term}>
            <AppText variant="bodyStrong">{term}</AppText>
            <AppText muted>{def}</AppText>
          </View>
        ))}
      </GlassCard>
      <AppText variant="caption" muted center>{t('lib.disclaimer')}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
});
