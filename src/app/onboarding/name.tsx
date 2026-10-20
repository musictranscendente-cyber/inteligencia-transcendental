import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { isValidFullName, useOnboardingDraft } from '@/features/onboarding/draft';
import { StepScreen } from '@/features/onboarding/step-screen';
import { fonts, noOutline, radius, spacing, useTheme } from '@/theme';

export default function NameStep() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { draft, update } = useOnboardingDraft();
  const [touched, setTouched] = useState(false);
  const valid = isValidFullName(draft.fullName);

  const next = () => {
    setTouched(true);
    if (valid) router.push('/onboarding/birth-date');
  };

  return (
    <StepScreen
      step="name"
      title={t('onboarding.name.title')}
      hint={t('onboarding.name.hint')}
      cta={t('common.continue')}
      canContinue={valid}
      onNext={next}>
      <TextInput
        value={draft.fullName}
        onChangeText={(fullName) => update({ fullName })}
        onBlur={() => setTouched(true)}
        onSubmitEditing={next}
        placeholder={t('onboarding.name.placeholder')}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        autoCorrect={false}
        returnKeyType="next"
        autoFocus
        accessibilityLabel={t('onboarding.name.placeholder')}
        maxFontSizeMultiplier={1.6}
        style={[styles.input, noOutline, { color: colors.text, borderColor: colors.gold, backgroundColor: colors.surfaceGlass }]}
      />
      {touched && !valid && draft.fullName.length > 0 ? (
        <AppText variant="caption" color={colors.danger} style={styles.error}>
          {t('onboarding.name.error')}
        </AppText>
      ) : null}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: fonts.titleMedium,
    fontSize: 24,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  error: { marginTop: spacing.sm },
});
