import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { ConstellationLogo } from '@/components/constellation-logo';
import { GoogleButton } from '@/components/google-button';
import { useOnboardingDraft } from '@/features/onboarding/draft';
import { googleEnabled } from '@/services/auth';
import { spacing } from '@/theme';

/** Boas-vindas: a constelação se desenha e o nome do app aparece. */
export default function Welcome() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [logoDone, setLogoDone] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { update } = useOnboardingDraft();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.center}>
        <ConstellationLogo size={200} onDone={() => setLogoDone(true)} />
        {logoDone ? (
          <>
            <Animated.View entering={FadeInDown.duration(700)}>
              <AppText variant="display" center style={styles.title}>
                {t('onboarding.welcome.title')}
              </AppText>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(250).duration(700)}>
              <AppText muted center style={styles.subtitle}>
                {t('onboarding.welcome.subtitle')}
              </AppText>
            </Animated.View>
          </>
        ) : null}
      </View>
      {logoDone ? (
        <Animated.View entering={FadeIn.delay(600).duration(600)} style={styles.actions}>
          <Button title={t('onboarding.welcome.start')} onPress={() => router.push('/onboarding/language')} />
          {googleEnabled() ? (
            <GoogleButton
              onResult={(r) => {
                setAuthError(!r.ok && r.reason === 'error');
                if (!r.ok) return;
                // O nome da conta Google adianta a etapa do nome (a pessoa ainda pode corrigir).
                if (r.account.name) update({ fullName: r.account.name });
                router.push('/onboarding/language');
              }}
            />
          ) : null}
          {authError ? <AppText variant="caption" muted center>{t('auth.error')}</AppText> : null}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  title: { marginTop: spacing.md },
  subtitle: { maxWidth: 320 },
  actions: { gap: spacing.md },
});
