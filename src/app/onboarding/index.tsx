import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { ConstellationLogo } from '@/components/constellation-logo';
import { spacing } from '@/theme';

/** Boas-vindas: a constelação se desenha e o nome do app aparece. */
export default function Welcome() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [logoDone, setLogoDone] = useState(false);

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
        <Animated.View entering={FadeIn.delay(600).duration(600)}>
          <Button title={t('onboarding.welcome.start')} onPress={() => router.push('/onboarding/language')} />
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
});
