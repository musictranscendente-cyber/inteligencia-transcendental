import { router, type Href } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { GlassCard } from '@/components/glass-card';
import { draftDate, draftTime, useOnboardingDraft } from '@/features/onboarding/draft';
import { StepScreen } from '@/features/onboarding/step-screen';
import { languageIndex } from '@/i18n';
import { formatLongDate } from '@/i18n/format';
import { formatOffset, resolveBirth } from '@/lib/birth';
import { placeSubtitle } from '@/lib/cities';
import { spacing, useTheme } from '@/theme';

export default function ReviewStep() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { draft } = useOnboardingDraft();
  const time = draftTime(draft);

  const birth = useMemo(
    () => (draft.place ? resolveBirth({ date: draftDate(draft), time, timezone: draft.place.timezone }) : null),
    [draft, time]
  );

  const rows: { label: string; value: string; href: Href }[] = [
    { label: t('onboarding.review.name'), value: draft.fullName.trim(), href: '/onboarding/name' },
    { label: t('onboarding.review.date'), value: formatLongDate(t, i18n.language, draft.year, draft.month, draft.day), href: '/onboarding/birth-date' },
    { label: t('onboarding.review.time'), value: time ?? t('onboarding.review.timeUnknown'), href: '/onboarding/birth-time' },
    {
      label: t('onboarding.review.place'),
      value: draft.place ? `${draft.place.name} · ${placeSubtitle(draft.place, languageIndex(i18n.language))}` : '—',
      href: '/onboarding/birth-place',
    },
  ];

  return (
    <StepScreen
      step="review"
      title={t('onboarding.review.title')}
      hint={t('onboarding.review.subtitle')}
      cta={t('onboarding.review.confirm')}
      canContinue={!!draft.place}
      onNext={() => router.push('/onboarding/reveal')}>
      <GlassCard style={styles.card}>
        {rows.map((row, i) => (
          <View key={row.label} style={[styles.row, i > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
            <View style={styles.flex}>
              <AppText variant="label" muted>{row.label}</AppText>
              <AppText variant="bodyStrong">{row.value}</AppText>
            </View>
            <Pressable onPress={() => router.dismissTo(row.href)} hitSlop={10} accessibilityRole="button" accessibilityLabel={`${t('common.edit')} ${row.label}`}>
              <AppText gold variant="caption">{t('common.edit')}</AppText>
            </Pressable>
          </View>
        ))}
      </GlassCard>
      {birth && draft.place ? (
        <View style={styles.notes}>
          <AppText variant="caption" muted center>
            {`${t('onboarding.review.timezone', { offset: formatOffset(birth.offsetMinutes) })} · ${draft.place.timezone}`}
          </AppText>
          {birth.shiftedByDst ? (
            <AppText variant="caption" color={colors.technique.astrology} center>
              {t('onboarding.review.dstShift', { time: birth.localTime })}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  card: { paddingVertical: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  notes: { gap: spacing.sm },
});
