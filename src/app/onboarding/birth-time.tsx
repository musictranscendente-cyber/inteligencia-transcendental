import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { GlassCard } from '@/components/glass-card';
import { CheckIcon, SparkIcon } from '@/components/icons';
import { WheelPicker } from '@/components/wheel-picker';
import { pad2, useOnboardingDraft } from '@/features/onboarding/draft';
import { StepScreen } from '@/features/onboarding/step-screen';
import { radius, spacing, useTheme } from '@/theme';

const HOURS = Array.from({ length: 24 }, (_, i) => pad2(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad2(i));

export default function BirthTimeStep() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { draft, update } = useOnboardingDraft();
  const items = useMemo(() => t('onboarding.time.unknownItems', { returnObjects: true }) as string[], [t]);

  return (
    <StepScreen
      step="birth-time"
      title={t('onboarding.time.title')}
      hint={t('onboarding.time.hint')}
      cta={t('common.continue')}
      onNext={() => router.push('/onboarding/birth-place')}>
      {!draft.timeUnknown ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.wheels}>
          <WheelPicker label={t('onboarding.time.hour')} items={HOURS} index={draft.hour} onChange={(hour) => update({ hour })} />
          <AppText variant="title" gold style={styles.colon}>:</AppText>
          <WheelPicker label={t('onboarding.time.minute')} items={MINUTES} index={draft.minute} onChange={(minute) => update({ minute })} />
        </Animated.View>
      ) : null}

      <Pressable
        onPress={() => update({ timeUnknown: !draft.timeUnknown })}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: draft.timeUnknown }}
        style={[styles.toggle, { borderColor: draft.timeUnknown ? colors.gold : colors.border, backgroundColor: colors.surfaceGlass }]}>
        <View style={[styles.box, { borderColor: colors.gold, backgroundColor: draft.timeUnknown ? colors.gold : 'transparent' }]}>
          {draft.timeUnknown ? <CheckIcon size={16} color={colors.onGold} strokeWidth={2.2} /> : null}
        </View>
        <AppText variant="bodyStrong">{t('onboarding.time.unknown')}</AppText>
      </Pressable>

      {draft.timeUnknown ? (
        <Animated.View entering={FadeIn.duration(400)}>
          <GlassCard accent={colors.technique.astrology}>
            <AppText variant="subtitle" style={styles.cardTitle}>{t('onboarding.time.unknownTitle')}</AppText>
            {items.map((item, i) => (
              <View key={i} style={styles.item}>
                <SparkIcon size={16} color={i === items.length - 1 ? colors.technique.humanDesign : colors.technique.astrology} />
                <AppText style={styles.itemText}>{item}</AppText>
              </View>
            ))}
            <AppText variant="caption" muted style={styles.footer}>{t('onboarding.time.unknownFooter')}</AppText>
          </GlassCard>
        </Animated.View>
      ) : null}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  wheels: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  colon: { marginTop: 22 },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.4, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { marginBottom: spacing.sm },
  item: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', marginTop: spacing.sm },
  itemText: { flex: 1 },
  footer: { marginTop: spacing.md },
});
