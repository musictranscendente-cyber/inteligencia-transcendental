import { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { WorldMap } from '@/components/charts/misc-charts';
import { GlassCard } from '@/components/glass-card';
import { Pill, SectionTitle } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { PLANETS_TEXT } from '@/content/astrology';
import { useLang } from '@/content/types';
import { bestCities, cartographyLines, CARTO_PLANETS, type CartoCategory } from '@/engines/astro/cartography';
import { languageIndex } from '@/i18n';
import { countryName, topCities } from '@/lib/cities';
import { useReading } from '@/hooks/use-reading';
import { spacing, useTheme } from '@/theme';

const CATS: CartoCategory[] = ['love', 'money', 'career'];

export default function CartographyScreen() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [cat, setCat] = useState<CartoCategory>('love');
  const r = useReading();
  const birth = r ? new Date(r.person.birthUtc) : null;
  const lines = useMemo(() => (birth ? cartographyLines(birth) : []), [r]); // eslint-disable-line react-hooks/exhaustive-deps
  const cities = useMemo(() => (birth ? bestCities(birth, topCities(), cat) : []), [r, cat]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!r) return null;
  const c = colors.technique.astrology;
  const planetColors = { sun: colors.gold, moon: '#C9CED6', venus: colors.technique.oracles, mars: colors.danger, jupiter: colors.technique.humanDesign };

  return (
    <Screen title={t('carto.title')} accent={c}>
      <AppText muted>{t('carto.hint')}</AppText>
      <PremiumGate>
        <View style={styles.gap}>
          <GlassCard style={styles.gap}>
            <WorldMap lines={lines} colorsByPlanet={planetColors} width={width - 4 * spacing.lg} birth={r.person.place} />
            <View style={styles.legend}>
              {CARTO_PLANETS.map((p) => (
                <View key={p} style={styles.legendItem}>
                  <View style={[styles.swatch, { backgroundColor: planetColors[p] }]} />
                  <AppText variant="caption">{PLANETS_TEXT[p][lang].name}</AppText>
                </View>
              ))}
            </View>
          </GlassCard>
          <View style={styles.pills}>
            {CATS.map((k) => <Pill key={k} label={t(`carto.${k}`)} active={cat === k} onPress={() => setCat(k)} color={c} />)}
          </View>
          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('carto.best', { cat: t(`carto.${cat}`).toLowerCase() })}</SectionTitle>
            {cities.length ? (
              cities.map((m) => (
                <View key={`${m.city.name}-${m.city.countryCode}`}>
                  <AppText variant="bodyStrong">{`${m.city.name} · ${countryName(m.city.countryCode, languageIndex(i18n.language))}`}</AppText>
                  <AppText variant="caption" muted>{t('carto.km', { km: m.km, line: t(`carto.lines.${m.kind}`), planet: PLANETS_TEXT[m.planet][lang].name })}</AppText>
                </View>
              ))
            ) : (
              <AppText muted>{t('carto.none')}</AppText>
            )}
          </GlassCard>
        </View>
      </PremiumGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 3, borderRadius: 2 },
  pills: { flexDirection: 'row', gap: spacing.sm },
});
