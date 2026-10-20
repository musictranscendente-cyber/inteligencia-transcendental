import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { ConstellationLogo } from '@/components/constellation-logo';
import { GlassCard } from '@/components/glass-card';
import { CheckIcon } from '@/components/icons';
import { Screen } from '@/components/ui/screen';
import { buy, loadOffers, paywallEnabled, restore, usePremium, type Offer } from '@/services/purchases';
import { radius, spacing, useTheme } from '@/theme';

export default function PaywallScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const premium = usePremium();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(paywallEnabled());
  const [error, setError] = useState(false);
  const benefits = t('paywall.benefits', { returnObjects: true }) as string[];

  useEffect(() => {
    if (!paywallEnabled()) return;
    loadOffers()
      .then((o) => {
        setOffers(o);
        setSelected(o.find((x) => x.period === 'annual')?.id ?? o[0]?.id ?? null);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const order = { annual: 0, monthly: 1, weekly: 2, other: 3 } as const;
  const sorted = [...offers].sort((a, b) => order[a.period] - order[b.period]);

  const purchase = async () => {
    const offer = offers.find((o) => o.id === selected);
    if (!offer) return;
    setError(false);
    try {
      if (await buy(offer)) router.back();
    } catch {
      setError(true);
    }
  };

  return (
    <Screen title={t('paywall.title')}>
      <View style={styles.center}>
        <ConstellationLogo size={120} duration={1600} />
        <AppText variant="subtitle" center>{t('paywall.subtitle')}</AppText>
      </View>

      <GlassCard accent={colors.gold} style={styles.gap}>
        {benefits.map((b, i) => (
          <Animated.View key={b} entering={FadeInDown.delay(i * 70)} style={styles.benefit}>
            <CheckIcon size={20} color={colors.gold} />
            <AppText style={styles.flex}>{b}</AppText>
          </Animated.View>
        ))}
      </GlassCard>

      {premium && paywallEnabled() ? <AppText variant="subtitle" center gold>{t('paywall.active')}</AppText> : null}
      {!paywallEnabled() ? <AppText variant="caption" muted center>{t('paywall.notConfigured')}</AppText> : null}
      {loading ? <ActivityIndicator color={colors.gold} /> : null}

      {sorted.map((o) => {
        const active = o.id === selected;
        return (
          <Pressable key={o.id} onPress={() => setSelected(o.id)} accessibilityRole="radio" accessibilityState={{ selected: active }}>
            <View style={[styles.plan, { borderColor: active ? colors.gold : colors.border, backgroundColor: active ? colors.goldSoft : colors.surfaceGlass }]}>
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{t(`paywall.${o.period === 'other' ? 'monthly' : o.period}`)}</AppText>
                {o.period === 'annual' ? <AppText variant="caption" gold>{`${t('paywall.mostChosen')} · ${t('paywall.trial')}`}</AppText> : null}
              </View>
              <AppText variant="subtitle">{o.price}</AppText>
            </View>
          </Pressable>
        );
      })}

      {error ? <AppText variant="caption" color={colors.danger} center>{t('paywall.error')}</AppText> : null}
      {sorted.length ? <Button title={t('paywall.subscribe')} onPress={purchase} disabled={!selected} /> : null}
      {paywallEnabled() ? <Button variant="ghost" title={t('paywall.restore')} onPress={() => restore().then((ok) => ok && router.back())} /> : null}
      <Button variant="secondary" title={t('paywall.continueFree')} onPress={() => router.back()} />
      <AppText variant="caption" muted center>{t('paywall.terms')}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  center: { alignItems: 'center', gap: spacing.sm },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  plan: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.4, borderRadius: radius.card, padding: spacing.lg, gap: spacing.md },
});
