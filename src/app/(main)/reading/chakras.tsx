import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { ChakraFigure } from '@/components/charts/misc-charts';
import { GlassCard } from '@/components/glass-card';
import { SectionTitle, Tag } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { ELEMENTS_TEXT } from '@/content/astrology';
import { CHAKRA_COLORS, CHAKRAS } from '@/content/misc';
import { useLang } from '@/content/types';
import type { ElementKey } from '@/engines/astro/chart';
import { useReading } from '@/hooks/use-reading';
import { spacing } from '@/theme';

const BY_ELEMENT: Record<ElementKey, number> = { fire: 2, earth: 0, air: 4, water: 1 };
const BY_NUMBER: Record<number, number> = { 1: 2, 2: 1, 3: 4, 4: 0, 5: 1, 6: 3, 7: 5, 8: 2, 9: 6, 11: 5, 22: 0, 33: 3 };

export default function ChakrasScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const r = useReading();
  if (!r) return null;
  const lowest = (Object.keys(r.chart.elements) as ElementKey[]).reduce((a, b) => (r.chart.elements[b] < r.chart.elements[a] ? b : a));
  const focus = BY_ELEMENT[lowest];
  let support = BY_NUMBER[r.numerology.destiny] ?? 3;
  if (support === focus) support = (support + 3) % 7;
  const f = CHAKRAS[focus][lang];
  const s = CHAKRAS[support][lang];

  return (
    <Screen title={t('map.techniques.chakras')} accent={CHAKRA_COLORS[focus]}>
      <GlassCard style={[styles.gap, styles.center]}>
        <ChakraFigure focus={focus} support={support} />
        <AppText variant="caption" muted center>{t('chk.why', { element: ELEMENTS_TEXT[lowest][lang].name, n: r.numerology.destiny })}</AppText>
      </GlassCard>
      <PremiumGate>
        <View style={styles.gap}>
          {[
            { label: t('chk.focus'), ch: f, color: CHAKRA_COLORS[focus] },
            { label: t('chk.support'), ch: s, color: CHAKRA_COLORS[support] },
          ].map(({ label, ch, color }) => (
            <GlassCard key={label} accent={color} style={styles.gap}>
              <SectionTitle color={color}>{label}</SectionTitle>
              <AppText variant="subtitle">{`${ch.name} · ${ch.sanskrit}`}</AppText>
              <AppText muted>{ch.theme}</AppText>
              <AppText>{ch.text}</AppText>
              <SectionTitle color={color}>{t('chk.crystals')}</SectionTitle>
              <View style={styles.tags}>{ch.crystals.map((c) => <Tag key={c} label={c} color={color} />)}</View>
            </GlassCard>
          ))}
          <AppText variant="caption" muted center>{t('chk.disclaimer')}</AppText>
        </View>
      </PremiumGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
