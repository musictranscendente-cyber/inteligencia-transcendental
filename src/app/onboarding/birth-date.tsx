import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { WheelPicker } from '@/components/wheel-picker';
import { pad2, useOnboardingDraft } from '@/features/onboarding/draft';
import { StepScreen } from '@/features/onboarding/step-screen';
import { daysInMonth } from '@/lib/birth';
import { spacing } from '@/theme';

const FIRST_YEAR = 1900;

export default function BirthDateStep() {
  const { t } = useTranslation();
  const { draft, update } = useOnboardingDraft();
  const months = t('months', { returnObjects: true }) as string[];

  const today = new Date();
  const lastYear = today.getFullYear();
  const years = useMemo(() => Array.from({ length: lastYear - FIRST_YEAR + 1 }, (_, i) => String(FIRST_YEAR + i)), [lastYear]);
  const maxDay = daysInMonth(draft.year, draft.month);
  const days = useMemo(() => Array.from({ length: maxDay }, (_, i) => pad2(i + 1)), [maxDay]);

  const setDate = (patch: { year?: number; month?: number; day?: number }) => {
    const year = patch.year ?? draft.year;
    const month = patch.month ?? draft.month;
    const day = Math.min(patch.day ?? draft.day, daysInMonth(year, month));
    update({ year, month, day });
  };

  const chosen = new Date(draft.year, draft.month - 1, draft.day);
  const inFuture = chosen > today;

  return (
    <StepScreen
      step="birth-date"
      title={t('onboarding.date.title')}
      hint={t('onboarding.date.hint')}
      cta={t('common.continue')}
      canContinue={!inFuture}
      onNext={() => router.push('/onboarding/birth-time')}>
      <View style={styles.wheels}>
        <WheelPicker label={t('onboarding.date.day')} items={days} index={draft.day - 1} onChange={(i) => setDate({ day: i + 1 })} width={72} />
        <WheelPicker label={t('onboarding.date.month')} items={months} index={draft.month - 1} onChange={(i) => setDate({ month: i + 1 })} width={140} />
        <WheelPicker label={t('onboarding.date.year')} items={years} index={draft.year - FIRST_YEAR} onChange={(i) => setDate({ year: FIRST_YEAR + i })} width={90} />
      </View>
      <AppText variant="subtitle" gold center>
        {`${draft.day} · ${months[draft.month - 1]} · ${draft.year}`}
      </AppText>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  wheels: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md },
});
