import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { usePremium } from '@/services/purchases';
import { radius, spacing, useTheme } from '@/theme';

/** Mostra o conteúdo pago, ou uma prévia apagada com convite para assinar. */
export function PremiumGate({ children, preview, message }: { children: ReactNode; preview?: ReactNode; message?: string }) {
  const premium = usePremium();
  const { t } = useTranslation();
  const { colors } = useTheme();
  if (premium) return <>{children}</>;
  return (
    <View style={styles.wrap}>
      <View style={styles.preview} pointerEvents="none" importantForAccessibility="no-hide-descendants">
        {preview ?? children}
      </View>
      <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: `${colors.background}CC` }]}>
        <AppText variant="subtitle" center>{message ?? t('paywall.lockedTitle')}</AppText>
        <Button title={t('paywall.unlock')} onPress={() => router.push('/paywall')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.card, overflow: 'hidden', minHeight: 180 },
  preview: { opacity: 0.35 },
  overlay: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
});
