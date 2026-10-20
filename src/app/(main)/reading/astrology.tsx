import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { PlanetGlyph, SignGlyph } from '@/components/astro-glyphs';
import { AspectGrid, Bars, NatalWheel } from '@/components/charts/natal-wheel';
import { GlassCard } from '@/components/glass-card';
import { Pill, SectionTitle } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { ShareButton } from '@/components/ui/share-button';
import { ASPECTS_TEXT, ELEMENTS_TEXT, HOUSES_TEXT, MODALITIES_TEXT, PLANETS_TEXT, SIGN_STYLE, SIGNS_TEXT } from '@/content/astrology';
import { useLang } from '@/content/types';
import { dominant, formatDegree, pointOf, solarReturn, type PointKey } from '@/engines/astro/chart';
import { transitsOn } from '@/engines/astro/transits';
import { useReading } from '@/hooks/use-reading';
import { formatDate } from '@/lib/format';
import { prefsStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

export default function AstrologyScreen() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const prefs = prefsStore.useValue();
  const [selected, setSelected] = useState<PointKey | null>('sun');
  const r = useReading();
  if (!r) return null;
  const c = colors.technique.astrology;
  const chart = r.chart;
  const w = Math.min(width - 2 * spacing.lg, 440);
  const sun = pointOf(chart, 'sun')!;
  const moon = pointOf(chart, 'moon')!;
  const asc = pointOf(chart, 'asc');
  const planetName = (k: PointKey) => PLANETS_TEXT[k][lang].name;
  const signName = (s: Parameters<typeof SignGlyph>[0]['sign']) => SIGNS_TEXT[s][lang].name;
  const year = new Date().getFullYear();
  const sr = solarReturn(sun.lon, r.person.birthDate, year);
  const transits = transitsOn(chart, new Date()).filter((x) => x.transiting !== 'moon').slice(0, 8);
  const sel = selected ? pointOf(chart, selected) : null;
  const elColors = colors.element;

  const big3 = [
    { key: 'sun' as const, label: t('astro.sun'), p: sun, text: SIGNS_TEXT[sun.sign][lang].sun },
    { key: 'moon' as const, label: t('astro.moon'), p: moon, text: SIGNS_TEXT[moon.sign][lang].moon },
    ...(asc ? [{ key: 'asc' as const, label: t('astro.asc'), p: asc, text: SIGNS_TEXT[asc.sign][lang].asc }] : []),
  ];

  return (
    <Screen title={t('map.techniques.astrology')} accent={c} kicker={big3.map((b) => signName(b.p.sign)).join(' · ')} right={<ShareButton template="big3" color={c} />}>
      <SectionTitle color={c}>{t('astro.big3')}</SectionTitle>
      {big3.map((b) => (
        <GlassCard key={b.key} accent={c} style={styles.big}>
          <View style={styles.glyphBox}>
            <SignGlyph sign={b.p.sign} size={52} color={c} />
          </View>
          <View style={styles.flex}>
            <AppText variant="label" color={c}>{b.label}</AppText>
            <AppText variant="subtitle">{`${signName(b.p.sign)} ${formatDegree(b.p.lon)}`}</AppText>
            <AppText muted>{b.text}</AppText>
          </View>
        </GlassCard>
      ))}
      {!chart.timeKnown ? <AppText variant="caption" muted>{t('astro.noTime')}</AppText> : null}

      <PremiumGate>
        <View style={styles.gap}>
          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('astro.wheel')}</SectionTitle>
            <NatalWheel points={chart.points} cusps={chart.cusps} aspects={chart.aspects} size={w - 2 * spacing.md} selected={selected} onSelect={setSelected} />
            <AppText variant="caption" muted center>{t('astro.wheelHint')}</AppText>
            {sel ? (
              <View style={styles.selected}>
                <PlanetGlyph planet={sel.key} size={34} color={colors.gold} />
                <View style={styles.flex}>
                  <AppText variant="subtitle">{`${t('astro.planetIn', { planet: planetName(sel.key), sign: signName(sel.sign) })}${sel.house ? ` · ${t('astro.inHouse', { n: sel.house })}` : ''}`}</AppText>
                  <AppText muted>
                    {`${PLANETS_TEXT[sel.key][lang].function.charAt(0).toUpperCase()}${PLANETS_TEXT[sel.key][lang].function.slice(1)} — ${SIGN_STYLE[sel.sign][lang]}.`}
                    {sel.house ? ` ${HOUSES_TEXT[lang][sel.house - 1].name}: ${HOUSES_TEXT[lang][sel.house - 1].theme}.` : ''}
                    {sel.retrograde ? ` (${t('astro.retro')})` : ''}
                  </AppText>
                </View>
              </View>
            ) : null}
            <View style={styles.pills}>
              <AppText variant="caption" muted>{t('astro.houseSystem')}</AppText>
              <Pill label={t('astro.placidus')} active={prefs.houseSystem === 'placidus'} onPress={() => prefsStore.set((p) => ({ ...p, houseSystem: 'placidus' }))} color={c} />
              <Pill label={t('astro.whole')} active={prefs.houseSystem === 'whole'} onPress={() => prefsStore.set((p) => ({ ...p, houseSystem: 'whole' }))} color={c} />
            </View>
            {chart.houseSystem === 'porphyry' ? <AppText variant="caption" muted>{t('astro.porphyry')}</AppText> : null}
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('astro.planets')}</SectionTitle>
            {chart.points.map((p) => (
              <View key={p.key} style={styles.planetRow}>
                <PlanetGlyph planet={p.key} size={22} color={colors.gold} />
                <AppText style={styles.flex}>{planetName(p.key)}</AppText>
                <SignGlyph sign={p.sign} size={18} color={c} />
                <AppText muted>{`${signName(p.sign)} ${formatDegree(p.lon)}${p.house ? ` · ${p.house}` : ''}${p.retrograde ? ' R' : ''}`}</AppText>
              </View>
            ))}
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('astro.aspects')}</SectionTitle>
            {chart.aspects.slice(0, 12).map((a, i) => {
              const at = ASPECTS_TEXT[a.type][lang];
              return (
                <AppText key={i}>
                  {`${planetName(a.a)} ${at.symbol} ${planetName(a.b)} · ${at.name} (${a.orb.toFixed(1)}°): `}
                  <AppText muted>{`${at.meaning}.`}</AppText>
                </AppText>
              );
            })}
            <SectionTitle color={c}>{t('astro.aspectGrid')}</SectionTitle>
            <AspectGrid points={chart.points.filter((p) => p.key !== 'node')} aspects={chart.aspects} size={w - 2 * spacing.lg} />
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('astro.elements')}</SectionTitle>
            <Bars
              width={w - 2 * spacing.lg}
              items={(['fire', 'earth', 'air', 'water'] as const).map((e) => ({ label: ELEMENTS_TEXT[e][lang].name, value: chart.elements[e], color: elColors[e] }))}
            />
            <AppText>{`${t('astro.dominant', { name: ELEMENTS_TEXT[dominant(chart.elements)][lang].name })} — ${ELEMENTS_TEXT[dominant(chart.elements)][lang].text}`}</AppText>
            <SectionTitle color={c}>{t('astro.modalities')}</SectionTitle>
            <Bars
              width={w - 2 * spacing.lg}
              items={(['cardinal', 'fixed', 'mutable'] as const).map((m, i) => ({ label: MODALITIES_TEXT[m][lang].name, value: chart.modalities[m], color: [c, colors.gold, colors.technique.numerology][i] }))}
            />
            <AppText>{MODALITIES_TEXT[dominant(chart.modalities)][lang].text}</AppText>
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('astro.transits')}</SectionTitle>
            {transits.length ? (
              transits.map((x, i) => (
                <AppText key={i}>
                  {t('astro.transitLine', { planet: planetName(x.transiting), aspect: ASPECTS_TEXT[x.type][lang].name.toLowerCase(), natal: planetName(x.natal) })}
                  <AppText muted>{` · ${ASPECTS_TEXT[x.type][lang].meaning}`}</AppText>
                </AppText>
              ))
            ) : (
              <AppText muted>{t('astro.noTransits')}</AppText>
            )}
          </GlassCard>

          {sr ? (
            <GlassCard style={styles.gap}>
              <SectionTitle color={c}>{t('astro.solarReturn', { year })}</SectionTitle>
              <AppText>{t('astro.solarReturnAt', { date: formatDate(sr, i18n.language, chart.timeKnown) })}</AppText>
            </GlassCard>
          ) : null}
        </View>
      </PremiumGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  big: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  glyphBox: { width: 64, alignItems: 'center' },
  selected: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  pills: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  planetRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
