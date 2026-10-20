import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Wings } from '@/components/charts/wings';
import { GlassCard } from '@/components/glass-card';
import { SectionTitle } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { ANGEL_ATTRIBUTES, CHOIR_NAMES } from '@/content/angels';
import { useLang } from '@/content/types';
import { ANGELS, regencyMinutes } from '@/engines/angels';
import { useReading } from '@/hooks/use-reading';
import { spacing, useTheme } from '@/theme';

const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function AngelScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const r = useReading();
  if (!r) return null;
  const c = colors.technique.angel;
  const a = r.angel;
  const next = ANGELS[a.number % 72];
  const months = t('months', { returnObjects: true }) as string[];
  const endDay = new Date(2001, next.start[0] - 1, next.start[1] - 1);
  const [from, to] = regencyMinutes(a);

  return (
    <Screen title={a.name} kicker={t('ang.number', { n: a.number })} accent={c}>
      <GlassCard accent={c} style={[styles.gap, styles.center]}>
        <Wings width={240} color={c} />
        <AppText variant="display" center color={c}>{a.name}</AppText>
        <AppText variant="subtitle" center>{ANGEL_ATTRIBUTES[a.number - 1][lang]}</AppText>
      </GlassCard>
      <PremiumGate>
        <GlassCard style={styles.gap}>
          <Row label={t('ang.period')} value={`${a.start[1]} ${months[a.start[0] - 1]} – ${endDay.getDate()} ${months[endDay.getMonth()]}`} />
          <Row label={t('ang.choir')} value={CHOIR_NAMES[a.choir][lang]} />
          <Row label={t('ang.psalm')} value={a.psalm} />
          <Row label={t('ang.regency')} value={`${hhmm(from)} – ${hhmm(to)}`} />
        </GlassCard>
      </PremiumGate>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <SectionTitle color={colors.technique.angel}>{label}</SectionTitle>
      <AppText variant="bodyStrong">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  row: { gap: 2 },
});
