import { router } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { OptionRow } from '@/components/option-row';
import { StepScreen } from '@/features/onboarding/step-screen';
import { LANGUAGES } from '@/i18n';
import { setLanguagePreference } from '@/storage/settings';
import { spacing } from '@/theme';

export default function LanguageStep() {
  const { t, i18n } = useTranslation();

  return (
    <StepScreen
      step="language"
      title={t('onboarding.language.title')}
      hint={t('onboarding.language.subtitle')}
      cta={t('common.continue')}
      onNext={() => {
        setLanguagePreference(i18n.language as (typeof LANGUAGES)[number]['code']);
        router.push('/onboarding/name');
      }}>
      <View style={{ gap: spacing.sm }} accessibilityRole="radiogroup">
        {LANGUAGES.map((lang) => (
          <OptionRow
            key={lang.code}
            label={lang.label}
            selected={i18n.language === lang.code}
            onPress={() => i18n.changeLanguage(lang.code)}
          />
        ))}
      </View>
    </StepScreen>
  );
}
