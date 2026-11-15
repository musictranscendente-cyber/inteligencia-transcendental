import { router } from 'expo-router';
import { useEffect, useState, type ComponentType } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { ConstellationLogo } from '@/components/constellation-logo';
import { GlassCard } from '@/components/glass-card';
import { BookIcon, CyclesIcon, OracleIcon, RelationsIcon, SparkIcon, type IconProps } from '@/components/icons';
import { Screen } from '@/components/ui/screen';
import { firstName } from '@/engines/reading';
import { buy, loadOffers, paywallEnabled, restore, usePremium, type Offer } from '@/services/purchases';
import { useProfile } from '@/storage/profile';
import { fonts, radius, spacing, useTheme, withAlpha } from '@/theme';

const ICONS: ComponentType<IconProps>[] = [SparkIcon, BookIcon, RelationsIcon, CyclesIcon, OracleIcon];

export default function PaywallScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const premium = usePremium();
  const profile = useProfile();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(paywallEnabled());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const benefits = t('paywall.benefits', { returnObjects: true }) as string[];
  const tc = colors.technique;
  const benefitColors = [colors.gold, tc.numerology, tc.oracles, tc.astrology, tc.tarot];

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
  const monthly = offers.find((o) => o.period === 'monthly');
  const current = offers.find((o) => o.id === selected);

  /** Quanto o plano custa a menos por ano que o mensal. */
  const savings = (o: Offer) => {
    if (o.period !== 'annual' || !o.perYear || !monthly?.perYear) return 0;
    return Math.round((1 - o.perYear / monthly.perYear) * 100);
  };

  const purchase = async () => {
    if (!current) return;
    setError(false);
    setBusy(true);
    try {
      if (await buy(current)) router.back();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const title = profile ? t('paywall.heroTitle', { name: firstName(profile.fullName) }) : t('paywall.title');
  const trial = current?.trialDays ?? 0;

  return (
    <Screen title={t('paywall.title')}>
      <View style={styles.hero}>
        <ConstellationLogo size={110} duration={1600} />
        <AppText variant="display" center style={styles.heroTitle}>{title}</AppText>
        <AppText muted center>{t('paywall.subtitle')}</AppText>
      </View>

      <GlassCard accent={colors.gold} style={styles.gap}>
        {benefits.map((b, i) => {
          const Icon = ICONS[i % ICONS.length];
          const c = benefitColors[i % benefitColors.length];
          return (
            <Animated.View key={b} entering={FadeInDown.delay(i * 70)} style={styles.benefit}>
              <View style={[styles.benefitIcon, { backgroundColor: withAlpha(c, 0.14) }]}>
                <Icon size={20} color={c} />
              </View>
              <AppText style={styles.flex}>{b}</AppText>
            </Animated.View>
          );
        })}
      </GlassCard>

      {premium && paywallEnabled() ? <AppText variant="subtitle" center gold>{t('paywall.active')}</AppText> : null}
      {!paywallEnabled() ? <AppText variant="caption" muted center>{t('paywall.notConfigured')}</AppText> : null}
      {loading ? <ActivityIndicator color={colors.gold} /> : null}

      {sorted.map((o) => {
        const active = o.id === selected;
        const save = savings(o);
        return (
          <Pressable key={o.id} onPress={() => setSelected(o.id)} accessibilityRole="radio" accessibilityState={{ selected: active }}>
            <View style={[styles.plan, { borderColor: active ? colors.gold : colors.border, backgroundColor: active ? colors.goldSoft : colors.surfaceGlass }]}>
              <View style={[styles.radio, { borderColor: active ? colors.gold : colors.textMuted }]}>
                {active ? <View style={[styles.radioDot, { backgroundColor: colors.gold }]} /> : null}
              </View>
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{t(`paywall.${o.period === 'other' ? 'monthly' : o.period}`)}</AppText>
                {o.period === 'annual' && o.perMonthString ? <AppText variant="caption" muted>{t('paywall.perMonth', { price: o.perMonthString })}</AppText> : null}
                {o.trialDays ? <AppText variant="caption" gold>{t('paywall.startTrial', { days: o.trialDays })}</AppText> : null}
              </View>
              <AppText variant="subtitle">{o.price}</AppText>
              {save > 0 || o.period === 'annual' ? (
                <View style={[styles.badge, { backgroundColor: colors.gold }]}>
                  <AppText style={[styles.badgeText, { color: colors.onGold }]}>{save > 0 ? t('paywall.save', { pct: save }) : t('paywall.mostChosen')}</AppText>
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}

      {trial ? (
        <GlassCard style={styles.timeline}>
          <View style={styles.step}>
            <View style={[styles.stepDot, { backgroundColor: colors.gold }]} />
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{t('paywall.timelineToday')}</AppText>
              <AppText variant="caption" muted>{t('paywall.timelineTodayText')}</AppText>
            </View>
          </View>
          <View style={[styles.stepLine, { backgroundColor: withAlpha(colors.gold, 0.4) }]} />
          <View style={styles.step}>
            <View style={[styles.stepDot, { borderColor: colors.gold, borderWidth: 1.5 }]} />
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{t('paywall.timelineEnd', { day: trial + 1 })}</AppText>
              <AppText variant="caption" muted>{t('paywall.timelineEndText')}</AppText>
            </View>
          </View>
        </GlassCard>
      ) : null}

      {error ? <AppText variant="caption" color={colors.danger} center>{t('paywall.error')}</AppText> : null}
      {sorted.length ? (
        <Button title={trial ? t('paywall.startTrial', { days: trial }) : t('paywall.subscribe')} onPress={purchase} disabled={!selected || busy} />
      ) : null}
      {sorted.length ? <AppText variant="caption" muted center>{t('paywall.cancelAnytime')}</AppText> : null}
      {paywallEnabled() ? <Button variant="ghost" title={t('paywall.restore')} onPress={() => restore().then((ok) => ok && router.back())} /> : null}
      <Button variant="secondary" title={t('paywall.continueFree')} onPress={() => router.back()} />
      <AppText variant="caption" muted center>{t('paywall.terms')}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  hero: { alignItems: 'center', gap: spacing.sm },
  heroTitle: { fontSize: 34, lineHeight: 38 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  benefitIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  plan: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.4, borderRadius: radius.card, padding: spacing.lg, gap: spacing.md },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 11, height: 11, borderRadius: 6 },
  badge: { position: 'absolute', top: -11, right: spacing.lg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontFamily: fonts.bodySemiBold, fontSize: 11, lineHeight: 15, letterSpacing: 0.4 },
  timeline: { gap: 0, paddingVertical: spacing.md },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepDot: { width: 14, height: 14, borderRadius: 7, marginTop: 5 },
  stepLine: { width: 2, height: 18, marginLeft: 6, marginVertical: 2 },
});
