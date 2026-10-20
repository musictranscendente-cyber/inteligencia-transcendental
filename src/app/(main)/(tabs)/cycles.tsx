import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { HeatCalendar, LifeTimeline } from '@/components/charts/misc-charts';
import { NineYearRing } from '@/components/charts/numerology-charts';
import { GlassCard } from '@/components/glass-card';
import { BackIcon } from '@/components/icons';
import { ScreenHeader } from '@/components/screen-header';
import { Pill, SectionTitle } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { PLANETS_TEXT, SIGNS_TEXT, ASPECTS_TEXT } from '@/content/astrology';
import { ANIMALS_TEXT, FIVE_ELEMENTS_TEXT } from '@/content/chinese';
import { SEPTENIOS, TRANSIT_THEMES } from '@/content/misc';
import { PERSONAL_YEAR } from '@/content/numbers';
import { MAJOR_ARCANA } from '@/content/tarot-major';
import { useLang } from '@/content/types';
import { pointOf, signOf, solarReturn } from '@/engines/astro/chart';
import { timeline, type TimelineEvent } from '@/engines/astro/transits';
import { chineseSign } from '@/engines/chinese';
import { lifePosition, monthCalendar, nineYearStarts } from '@/engines/cycles';
import { parseDate } from '@/engines/numerology';
import { useDeferred } from '@/hooks/use-deferred';
import { useReading } from '@/hooks/use-reading';
import { formatDate, formatMonth } from '@/lib/format';
import { spacing, useTheme } from '@/theme';

type Metric = 'love' | 'work' | 'decisions';

export default function CyclesScreen() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const r = useReading();
  const now = new Date();
  const [offset, setOffset] = useState(0);
  const [metric, setMetric] = useState<Metric>('love');
  const month = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const key = r ? `${r.person.birthUtc}|${r.chart.houseSystem}|${now.toDateString()}` : null;
  const cal = useDeferred(key && `${key}|cal|${offset}`, () => monthCalendar(r!.person.birthDate, r!.chart, month.getFullYear(), month.getMonth())) ?? [];
  const events = useDeferred(key && `${key}|timeline`, () => timeline(r!.chart, now, 365));
  if (!r) return null;

  const c = colors.technique.humanDesign;
  const w = width - 4 * spacing.lg;
  const metricColor = { love: colors.technique.oracles, work: colors.technique.astrology, decisions: colors.technique.numerology }[metric];
  const values = cal.map((d) => d[metric]);
  const best = cal.filter((d) => d[metric] >= 5).map((d) => d.date.getDate());
  const bestDays = (best.length >= 3 ? best : cal.filter((d) => d[metric] >= 4).map((d) => d.date.getDate())).slice(0, 8);
  const py = r.personal.year;
  const life = lifePosition(r.person.birthDate);
  const birthYear = parseDate(r.person.birthDate).year;
  const nineAges = nineYearStarts(r.person.birthDate).map((y) => y - birthYear);
  const sept = SEPTENIOS[lang][Math.min(life.septenio, 12)];
  const sun = pointOf(r.chart, 'sun')!;
  const srThis = solarReturn(sun.lon, r.person.birthDate, now.getFullYear());
  // A próxima revolução solar (se a deste ano já passou, mostra a do ano que vem).
  const sr = srThis && srThis < now ? solarReturn(sun.lon, r.person.birthDate, now.getFullYear() + 1) : srThis;
  const cn = chineseSign(`${now.getFullYear()}-06-01`);
  const themes = TRANSIT_THEMES[lang];
  const planet = (k: string) => PLANETS_TEXT[k as keyof typeof PLANETS_TEXT][lang].name;
  const date = (d: Date) => formatDate(d, i18n.language);

  const eventText = (e: TimelineEvent) => {
    if (e.kind === 'retrograde') {
      const key = `${e.planet}Retro` as 'mercuryRetro';
      return { title: t('cyc.retro', { planet: planet(e.planet) }), when: `${date(e.start)} – ${date(e.end)}`, text: themes[key] ?? '', color: colors.technique.numerology };
    }
    if (e.kind === 'eclipse') {
      return {
        title: `${e.eclipse === 'solar' ? t('cyc.eclipseSolar') : t('cyc.eclipseLunar')} · ${SIGNS_TEXT[signOf(e.lon)][lang].name}`,
        when: date(e.date),
        text: `${e.eclipse === 'solar' ? themes.solarEclipse : themes.lunarEclipse}${e.sensitive ? ` ${themes.sensitive.replace('{point}', planet(e.sensitive))}` : ''}`,
        color: colors.gold,
      };
    }
    const special = e.planet === 'saturn' && e.natal === 'saturn' && e.type === 'conjunction' ? themes.saturnReturn : e.planet === 'jupiter' && e.natal === 'sun' && e.type === 'conjunction' ? themes.jupiterSun : null;
    return {
      title: `${planet(e.planet)} ${ASPECTS_TEXT[e.type][lang].symbol} ${planet(e.natal)}`,
      when: t('cyc.peak', { date: date(e.peak) }),
      text: special ?? `${ASPECTS_TEXT[e.type][lang].name}: ${themes[e.planet] ?? ''}.`,
      color: colors.technique.astrology,
    };
  };

  return (
    <View style={styles.flex}>
      <ScreenHeader title={t('cyc.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard accent={colors.technique.numerology} style={[styles.gap, styles.center]}>
          <SectionTitle color={colors.technique.numerology}>{t('cyc.year')}</SectionTitle>
          <NineYearRing current={py} color={colors.technique.numerology} size={180} />
          <AppText variant="subtitle" center>{PERSONAL_YEAR[py][lang].title}</AppText>
          <AppText center>{PERSONAL_YEAR[py][lang].text}</AppText>
        </GlassCard>

        <PremiumGate>
          <View style={styles.gap}>
            <GlassCard style={styles.gap}>
              <SectionTitle color={metricColor}>{t('cyc.calendar')}</SectionTitle>
              <View style={styles.monthRow}>
                <Pressable onPress={() => setOffset((o) => o - 1)} hitSlop={10} accessibilityLabel={t('cyc.prevMonth')}><BackIcon color={colors.text} /></Pressable>
                <AppText variant="subtitle">{formatMonth(month, i18n.language)}</AppText>
                <Pressable onPress={() => setOffset((o) => o + 1)} hitSlop={10} accessibilityLabel={t('cyc.nextMonth')} style={{ transform: [{ rotate: '180deg' }] }}><BackIcon color={colors.text} /></Pressable>
              </View>
              <View style={styles.pills}>
                {(['love', 'work', 'decisions'] as Metric[]).map((m) => <Pill key={m} label={t(`cyc.${m}`)} active={metric === m} onPress={() => setMetric(m)} color={metricColor} />)}
              </View>
              {!cal.length ? <ActivityIndicator color={metricColor} /> : null}
              <HeatCalendar days={values} firstWeekday={month.getDay()} color={metricColor} width={w} weekdays={t('cyc.weekdays', { returnObjects: true }) as string[]} today={offset === 0 ? now.getDate() : undefined} />
              <AppText variant="caption">{t('cyc.best', { days: bestDays.join(', ') })}</AppText>
            </GlassCard>

            <GlassCard style={styles.gap}>
              <SectionTitle color={colors.gold}>{t('cyc.forecast')}</SectionTitle>
              {sr ? <AppText>{t('astro.solarReturnAt', { date: formatDate(sr, i18n.language) })}</AppText> : null}
              <AppText>{t('cyc.yearArcana', { name: MAJOR_ARCANA[r.yearArcana][lang].name })} — <AppText muted>{MAJOR_ARCANA[r.yearArcana][lang].summary}</AppText></AppText>
              <AppText>{t('cyc.chineseYear', { animal: ANIMALS_TEXT[cn.animal][lang].name, element: FIVE_ELEMENTS_TEXT[cn.element][lang].name })}</AppText>
            </GlassCard>

            <GlassCard style={styles.gap}>
              <SectionTitle color={colors.technique.astrology}>{t('cyc.timeline')}</SectionTitle>
              {!events ? <ActivityIndicator color={colors.technique.astrology} /> : null}
              {(events ?? []).slice(0, 18).map((e, i) => {
                const x = eventText(e);
                return (
                  <View key={i} style={[styles.event, { borderLeftColor: x.color }]}>
                    <AppText variant="bodyStrong">{x.title}</AppText>
                    <AppText variant="caption" color={x.color}>{x.when}</AppText>
                    <AppText variant="caption" muted>{x.text}</AppText>
                  </View>
                );
              })}
            </GlassCard>

            <GlassCard style={styles.gap}>
              <SectionTitle color={c}>{t('cyc.life')}</SectionTitle>
              <LifeTimeline age={life.age} nineYearAges={nineAges.filter((a) => a >= 0 && a <= 90)} color={c} width={w} hereLabel={t('num.youAreHere')} />
              <AppText variant="subtitle">{t('cyc.septenio', { n: life.septenio + 1, title: sept.title })}</AppText>
              <AppText muted>{sept.text}</AppText>
              <AppText variant="caption" muted>{t('cyc.lifeHint')}</AppText>
            </GlassCard>

            <Button title={t('cyc.wrapped')} onPress={() => router.push('/wrapped')} />
            <AppText variant="caption" muted center>{t('cyc.wrappedHint')}</AppText>
          </View>
        </PremiumGate>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.lg, paddingBottom: spacing.xxl },
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pills: { flexDirection: 'row', gap: spacing.sm },
  event: { borderLeftWidth: 2, paddingLeft: spacing.md, gap: 2 },
});
