import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { MoonPhase } from '@/components/charts/moon-phase';
import { Wings } from '@/components/charts/wings';
import { GlassCard } from '@/components/glass-card';
import { TarotFace } from '@/components/tarot-face';
import { NumberRing, ScoreBars, Tag } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { ANGEL_ATTRIBUTES, CHOIR_NAMES } from '@/content/angels';
import { SIGNS_TEXT } from '@/content/astrology';
import { MOON_PHASES } from '@/content/daily';
import { NUMBERS, PERSONAL_YEAR } from '@/content/numbers';
import { cardInfo } from '@/content/tarot';
import { AREA_ADVICE, levelOf, MOON_PHASE_DEEP, PERSONAL_DAY } from '@/content/today';
import { useLang } from '@/content/types';
import { ANGELS } from '@/engines/angels';
import type { Area } from '@/engines/daily';
import { describeTransit, transitTone } from '@/features/today/describe';
import { ShareChip } from '@/features/today/today-card';
import { TODAY_TOPICS, useToday, type TodayTopic } from '@/features/today/use-today';
import { formatMinutes, formatWeekday } from '@/lib/format';
import { prefsStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

/** Bloco de texto com rótulo, usado em todas as explicações. */
function Block({ label, color, children, delay = 0 }: { label: string; color: string; children: ReactNode; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)}>
      <GlassCard accent={color} style={styles.block}>
        <AppText variant="label" color={color}>{label}</AppText>
        {children}
      </GlassCard>
    </Animated.View>
  );
}

function Pair({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.pair}>
      <AppText variant="caption" color={color} style={styles.pairLabel}>{label}</AppText>
      <AppText style={styles.flex}>{value}</AppText>
    </View>
  );
}

const SHARE: Record<TodayTopic, string> = { energy: 'day', card: 'card', angel: 'angel', moon: 'moon', numbers: 'numbers', sky: 'sky' };
const AREAS: Area[] = ['love', 'work', 'energy'];

export default function TodayDetailScreen() {
  const { topic: raw } = useLocalSearchParams<{ topic: string }>();
  const topic: TodayTopic = TODAY_TOPICS.includes(raw as TodayTopic) ? (raw as TodayTopic) : 'energy';
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const data = useToday();
  const prefs = prefsStore.useValue();
  const dayKey = data?.today.key;

  // Abrir a explicação da carta conta como revelar a carta do dia.
  useEffect(() => {
    if (topic === 'card' && dayKey && prefs.revealedDay !== dayKey) prefsStore.set((p) => ({ ...p, revealedDay: dayKey }));
  }, [topic, dayKey, prefs.revealedDay]);

  if (!data) return null;
  const { today } = data;
  const { energy } = today;
  const tc = colors.technique;
  const areaColor: Record<Area, string> = { love: tc.oracles, work: tc.astrology, energy: tc.humanDesign };
  const color = { energy: colors.gold, card: tc.tarot, angel: tc.angel, moon: tc.astrology, numbers: tc.numerology, sky: tc.astrology }[topic];
  const share = SHARE[topic];

  let body: ReactNode = null;

  if (topic === 'energy') {
    const day = PERSONAL_DAY[energy.personalDay][lang];
    const phase = MOON_PHASES[lang][energy.moon.phaseIndex];
    body = (
      <>
        <View style={styles.hero}>
          <AppText variant="display" center>{today.line.title}</AppText>
          <AppText muted center>{today.line.phrase}</AppText>
          <View>
            <Tag label={t('today.highlight', { area: t(`today.${energy.highlight}`) })} color={colors.gold} />
          </View>
        </View>
        <Block label={t('today.areaAdvice')} color={colors.gold} delay={60}>
          {AREAS.map((a) => (
            <View key={a} style={styles.area}>
              <View style={styles.areaScore}>
                <ScoreBars label={t(`today.${a}`)} value={energy.scores[a]} color={areaColor[a]} />
              </View>
              <AppText style={styles.flex}>{AREA_ADVICE[a][lang][levelOf(energy.scores[a])]}</AppText>
            </View>
          ))}
        </Block>
        <Block label={`${t('today.personalDay')} ${energy.personalDay} · ${day.title}`} color={tc.numerology} delay={120}>
          <AppText>{day.text}</AppText>
          <Pair label={t('today.favors')} value={day.favors} color={tc.humanDesign} />
          <Pair label={t('today.avoid')} value={day.avoid} color={tc.chinese} />
        </Block>
        <Block label={t('today.howTitle')} color={colors.gold} delay={180}>
          <AppText muted>{t('today.howEnergy')}</AppText>
          <View style={styles.tags}>
            <Tag label={`${t('today.personalDay')} ${energy.personalDay}`} color={tc.numerology} />
            <Tag label={`${phase.name} · ${SIGNS_TEXT[energy.moon.sign][lang].name}`} color={tc.astrology} />
            <Tag label={`${t('today.sky')}: ${energy.transits.length}`} color={tc.tarot} />
          </View>
        </Block>
      </>
    );
  }

  if (topic === 'card') {
    const info = cardInfo(today.card.id, lang);
    const rev = today.card.reversed;
    body = (
      <>
        <View style={styles.hero}>
          <TarotFace id={today.card.id} width={180} color={tc.tarot} reversed={rev} />
          <AppText variant="display" center>{info.name}</AppText>
          {rev ? <View><Tag label={t('today.reversed')} color={tc.tarot} /></View> : null}
        </View>
        <Block label={t('today.cardSummary')} color={tc.tarot} delay={60}>
          <AppText variant="subtitle">{info.summary}</AppText>
          <View style={styles.tags}>{info.keywords.map((k) => <Tag key={k} label={k} color={tc.tarot} />)}</View>
        </Block>
        <Block label={rev ? t('today.reversedMeaning') : t('today.upright')} color={tc.tarot} delay={120}>
          <AppText>{rev ? info.reversed : info.upright}</AppText>
        </Block>
        <Block label={rev ? t('today.upright') : t('today.reversedMeaning')} color={tc.tarot} delay={180}>
          <AppText muted>{rev ? info.upright : info.reversed}</AppText>
        </Block>
        <Block label={t('today.howTitle')} color={colors.gold} delay={240}>
          <AppText muted>{t('today.cardHowTo')}</AppText>
        </Block>
      </>
    );
  }

  if (topic === 'angel') {
    const a = today.angel;
    const next = ANGELS[a.number % ANGELS.length].start;
    const end = new Date(today.date.getFullYear(), next[0] - 1, next[1] - 1);
    const period = `${String(a.start[1]).padStart(2, '0')}/${String(a.start[0]).padStart(2, '0')} – ${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}`;
    const h = today.hourAngel;
    body = (
      <>
        <View style={styles.hero}>
          <Wings width={220} color={tc.angel} />
          <AppText variant="label" color={tc.angel}>#{a.number}</AppText>
          <AppText variant="display" center>{a.name}</AppText>
          <AppText muted center>{ANGEL_ATTRIBUTES[a.number - 1][lang]}</AppText>
        </View>
        <Block label={t('today.angelOfDay')} color={tc.angel} delay={60}>
          <Pair label={t('today.attribute')} value={ANGEL_ATTRIBUTES[a.number - 1][lang]} color={tc.angel} />
          <Pair label={t('today.choir')} value={CHOIR_NAMES[a.choir]?.[lang] ?? a.choir} color={tc.angel} />
          <Pair label={t('today.psalm')} value={a.psalm} color={tc.angel} />
          <Pair label={t('today.period')} value={period} color={tc.angel} />
          <AppText muted>{t('today.angelHow')}</AppText>
        </Block>
        <Block label={t('today.angelOfHour')} color={colors.gold} delay={120}>
          <AppText variant="subtitle">{h.name}</AppText>
          <AppText variant="caption" muted>{t('today.angelHourAt', { from: formatMinutes(today.hourAngelRange[0]), to: formatMinutes(today.hourAngelRange[1]) })}</AppText>
          <AppText>{ANGEL_ATTRIBUTES[h.number - 1][lang]}</AppText>
        </Block>
        <Block label={t('today.howTitle')} color={colors.gold} delay={180}>
          <AppText muted>{t('today.angelAbout')}</AppText>
        </Block>
      </>
    );
  }

  if (topic === 'moon') {
    const m = energy.moon;
    const phase = MOON_PHASES[lang][m.phaseIndex];
    const deep = MOON_PHASE_DEEP[lang][m.phaseIndex];
    const sign = SIGNS_TEXT[m.sign][lang];
    body = (
      <>
        <View style={styles.hero}>
          <MoonPhase phase={m.phase} size={170} southern={today.southern} />
          <AppText variant="display" center>{phase.name}</AppText>
          <AppText muted center>{t('today.moonIn', { sign: sign.name })} · {t('today.illumination', { pct: Math.round(m.illumination * 100) })}</AppText>
        </View>
        <Block label={t('today.moonPhaseLabel')} color={tc.astrology} delay={60}>
          <AppText variant="subtitle">{phase.tip}</AppText>
          <AppText>{deep.text}</AppText>
        </Block>
        <Block label={t('today.moonSignLabel', { sign: sign.name })} color={tc.astrology} delay={120}>
          <AppText>{t('today.moonSignText', { sign: sign.name, summary: sign.summary })}</AppText>
          <View style={styles.tags}>{sign.keywords.map((k) => <Tag key={k} label={k} color={tc.astrology} />)}</View>
        </Block>
        <Block label={t('today.ritual')} color={colors.gold} delay={180}>
          <AppText>{deep.ritual}</AppText>
        </Block>
      </>
    );
  }

  if (topic === 'numbers') {
    const day = PERSONAL_DAY[energy.personalDay][lang];
    const month = PERSONAL_YEAR[energy.personalMonth][lang];
    const year = PERSONAL_YEAR[energy.personalYear][lang];
    body = (
      <>
        <View style={[styles.hero, styles.rings]}>
          <NumberRing value={energy.personalDay} label={t('today.personalDay')} color={tc.numerology} size={92} />
          <NumberRing value={energy.personalMonth} label={t('today.personalMonth')} color={tc.numerology} size={92} />
          <NumberRing value={energy.personalYear} label={t('today.personalYear')} color={tc.numerology} size={92} />
        </View>
        <Block label={`${t('today.personalDay')} ${energy.personalDay}`} color={tc.numerology} delay={60}>
          <AppText variant="subtitle">{day.title}</AppText>
          <AppText>{day.text}</AppText>
          <Pair label={t('today.favors')} value={day.favors} color={tc.humanDesign} />
          <Pair label={t('today.avoid')} value={day.avoid} color={tc.chinese} />
          <View style={styles.tags}>{(NUMBERS[energy.personalDay][lang].keywords ?? []).map((k) => <Tag key={k} label={k} color={tc.numerology} />)}</View>
        </Block>
        <Block label={t('today.monthTheme', { n: energy.personalMonth, title: month.title })} color={tc.numerology} delay={120}>
          <AppText>{month.text}</AppText>
        </Block>
        <Block label={t('today.yearTheme', { n: energy.personalYear, title: year.title })} color={tc.numerology} delay={180}>
          <AppText>{year.text}</AppText>
        </Block>
        <Block label={t('today.howTitle')} color={colors.gold} delay={240}>
          <AppText muted>{t('today.numbersAbout')}</AppText>
        </Block>
      </>
    );
  }

  if (topic === 'sky') {
    const tone = { flow: tc.humanDesign, tense: tc.chinese, blend: colors.gold };
    body = (
      <>
        <AppText muted>{t('today.skyAbout')}</AppText>
        {today.sky.length ? (
          today.sky.slice(0, 8).map((tr, i) => {
            const d = describeTransit(tr, lang, t);
            const c = tone[transitTone(tr)];
            return (
              <Block key={i} label={d.orb} color={c} delay={i * 50}>
                <AppText variant="bodyStrong" style={styles.transitTitle}>{d.title}</AppText>
                <AppText>{d.text}</AppText>
                <AppText muted>{d.touches}</AppText>
              </Block>
            );
          })
        ) : (
          <Block label={t('today.sky')} color={tc.astrology}>
            <AppText>{t('today.skyEmpty')}</AppText>
          </Block>
        )}
      </>
    );
  }

  return (
    <Screen kicker={formatWeekday(today.date, i18n.language)} title={t(`today.detail.${topic}`)} accent={color} right={<ShareChip template={share} color={color} />}>
      {body}
      <Button title={t('common.share')} onPress={() => router.push({ pathname: '/share', params: { template: share } })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  rings: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' },
  block: { gap: spacing.md },
  area: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  areaScore: { width: 72 },
  pair: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  pairLabel: { width: 76, paddingTop: 3, textTransform: 'uppercase', letterSpacing: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  transitTitle: { fontSize: 19, lineHeight: 26 },
});
