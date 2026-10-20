import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { BackIcon } from '@/components/icons';
import { spacing, useTheme } from '@/theme';
import { STEPS } from './draft';

type Props = {
  step: (typeof STEPS)[number];
  title: string;
  hint?: string;
  children: ReactNode;
  cta: string;
  onNext: () => void;
  canContinue?: boolean;
  /** Para telas com lista própria (busca de cidade), que não devem ficar dentro de outro scroll. */
  scroll?: boolean;
};

/** Moldura comum das etapas do cadastro: voltar, progresso, título, conteúdo e botão. */
export function StepScreen({ step, title, hint, children, cta, onNext, canContinue = true, scroll = true }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const current = STEPS.indexOf(step) + 1;
  const progress = current / STEPS.length;

  const body = (
    <>
      <Animated.View entering={FadeInDown.duration(500)}>
        <AppText variant="title">{title}</AppText>
        {hint ? (
          <AppText muted style={styles.hint}>
            {hint}
          </AppText>
        ) : null}
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(120).duration(500)} style={[styles.body, !scroll && styles.flex]}>
        {children}
      </Animated.View>
    </>
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.flex, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={styles.back}>
          <BackIcon color={colors.text} />
        </Pressable>
        <View
          style={[styles.track, { backgroundColor: colors.border }]}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={t('common.step', { current, total: STEPS.length })}
          accessibilityValue={{ min: 0, max: STEPS.length, now: current }}>
          <View style={[styles.fill, { backgroundColor: colors.gold, width: `${progress * 100}%` }]} />
        </View>
      </View>

      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex]}>{body}</View>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button title={cta} onPress={onNext} disabled={!canContinue} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.md, height: 44 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 3, borderRadius: 2, overflow: 'hidden', marginRight: 32 },
  fill: { height: 3, borderRadius: 2 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.lg },
  hint: { marginTop: spacing.sm },
  body: { gap: spacing.md },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
});
