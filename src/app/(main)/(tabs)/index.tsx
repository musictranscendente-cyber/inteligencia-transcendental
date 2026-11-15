import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { CardBack } from '@/components/card-back';
import { MoonPhase } from '@/components/charts/moon-phase';
import { Wings } from '@/components/charts/wings';
import { GlassCard } from '@/components/glass-card';
import { SparkIcon } from '@/components/icons';
import { ScreenHeader } from '@/components/screen-header';
import { TarotFace } from '@/components/tarot-face';
import { NumberRing, ScoreBars, Tag } from '@/components/ui/bits';
import { FlipCard } from '@/components/ui/flip-card';
import { ANGEL_ATTRIBUTES } from '@/content/angels';
import { SIGNS_TEXT } from '@/content/astrology';
import { MOON_PHASES } from '@/content/daily';
import { cardInfo } from '@/content/tarot';
import { PERSONAL_DAY } from '@/content/today';
import { useLang } from '@/content/types';
import { firstName } from '@/engines/reading';
import { describeTransit, transitTone } from '@/features/today/describe';
import { ShareChip, TodayCard } from '@/features/today/today-card';
import { useToday, type TodayTopic } from '@/features/today/use-today';
import { isBirthday } from '@/features/wrapped/data';
import { formatWeekday } from '@/lib/format';
import { enableNotifications } from '@/services/notifications';
import { prefsStore, streakStore } from '@/storage/app-data';
import { spacing, useTheme, withAlpha } from '@/theme';

const open = (topic: TodayTopic) => router.push({ pathname: '/today/[topic]', params: { topic } });

export default function TodayScreen() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const data = useToday();
  const prefs = prefsStore.useValue();
  const streak = streakStore.useValue();
  if (!data) return null;
  const { reading, today } = data;
  const { energy, line, card, angel } = today;

  const tc = colors.technique;
  const name = firstName(reading.person.fullName);
  const info = cardInfo(card.id, lang);
  const revealed = prefs.revealedDay === today.key;
  const reveal = () => prefsStore.set((p) => ({ ...p, revealedDay: today.key }));
  const moonPhase = MOON_PHASES[lang][energy.moon.phaseIndex];
  const day = PERSONAL_DAY[energy.personalDay][lang];
  const sky = today.sky.slice(0, 2);
  const time = `${String(prefs.notifyHour).padStart(2, '0')}:${String(prefs.notifyMinute).padStart(2, '0')}`;
  const toneColor = { flow: tc.humanDesign, tense: tc.chinese, blend: colors.gold };

  return (
    <View style={styles.flex}>
      <ScreenHeader kicker={formatWeekday(today.date, i18n.language)} title={t('screens.today.greeting', { name })} />
      <ScrollView contentContainerStyle={styles.content}>
        {isBirthday(reading.person.birthDate) ? (
          <Button title={t('wrap.birthdayBanner')} onPress={() => router.push('/wrapped')} />
        ) : null}

        <Animated.View entering={FadeInDown.duration(500)}>
          <TodayCard title={t('today.energyKicker')} color={colors.gold} share="day" onPress={() => open('energy')}>
            <AppText variant="display" style={styles.heroTitle}>{line.title}</AppText>
            <AppText muted>{line.phrase}</AppText>
            <Tag label={t('today.highlight', { area: t(`today.${energy.highlight}`) })} color={colors.gold} />
            <View style={[styles.scores, { borderColor: withAlpha(colors.gold, 0.2) }]}>
              <ScoreBars label={t('today.love')} value={energy.scores.love} color={tc.oracles} />
              <ScoreBars label={t('today.work')} value={energy.scores.work} color={tc.astrology} />
              <ScoreBars label={t('today.energy')} value={energy.scores.energy} color={tc.humanDesign} />
            </View>
          </TodayCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <TodayCard title={t('today.cardOfDay')} color={tc.tarot} share={revealed ? 'card' : undefined} onPress={revealed ? () => open('card') : reveal} more={revealed ? undefined : null}>
            <View style={styles.cardRow}>
              <FlipCard
                width={110}
                height={176}
                flipped={revealed}
                onFlip={reveal}
                label={t('today.tapToReveal')}
                back={<CardBack width={110} accent={tc.tarot} />}
                front={<TarotFace id={card.id} width={110} color={tc.tarot} reversed={card.reversed} />}
              />
              <View style={[styles.flex, styles.cardText]}>
                {revealed ? (
                  <>
                    <AppText variant="subtitle">{info.name}</AppText>
                    {card.reversed ? <Tag label={t('today.reversed')} color={tc.tarot} /> : null}
                    <AppText muted numberOfLines={5}>{card.reversed ? info.reversed : info.upright}</AppText>
                  </>
                ) : (
                  <>
                    <AppText variant="subtitle">{t('today.tapToReveal')}</AppText>
                    <AppText variant="caption" muted>{t('today.cardHowTo')}</AppText>
                  </>
                )}
              </View>
            </View>
          </TodayCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.twoCols}>
          <TodayCard title={t('today.angelOfDay')} color={tc.angel} share="angel" onPress={() => open('angel')} style={styles.flex} center>
            <Wings width={112} color={tc.angel} />
            <AppText variant="subtitle" center>{angel.name}</AppText>
            <AppText variant="caption" muted center>{ANGEL_ATTRIBUTES[angel.number - 1][lang]}</AppText>
          </TodayCard>
          <TodayCard title={t('today.moonToday')} color={tc.astrology} share="moon" onPress={() => open('moon')} style={styles.flex} center>
            <MoonPhase phase={energy.moon.phase} size={66} southern={today.southern} />
            <AppText variant="subtitle" center>{moonPhase.name}</AppText>
            <AppText variant="caption" muted center>
              {t('today.moonIn', { sign: SIGNS_TEXT[energy.moon.sign][lang].name })} · {t('today.illumination', { pct: Math.round(energy.moon.illumination * 100) })}
            </AppText>
          </TodayCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(500)}>
          <TodayCard title={t('today.numbersOfDay')} color={tc.numerology} share="numbers" onPress={() => open('numbers')}>
            <View style={styles.rings}>
              <NumberRing value={energy.personalDay} label={t('today.personalDay')} color={tc.numerology} size={76} />
              <NumberRing value={energy.personalMonth} label={t('today.personalMonth')} color={tc.numerology} size={76} />
              <NumberRing value={energy.personalYear} label={t('today.personalYear')} color={tc.numerology} size={76} />
            </View>
            <AppText variant="subtitle">{day.title}</AppText>
            <AppText muted numberOfLines={3}>{day.text}</AppText>
          </TodayCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(500)}>
          <TodayCard title={t('today.sky')} color={tc.astrology} share={sky.length ? 'sky' : undefined} onPress={() => open('sky')}>
            <AppText variant="caption" muted>{t('today.skyHint')}</AppText>
            {sky.length ? (
              sky.map((tr, i) => {
                const d = describeTransit(tr, lang, t);
                const c = toneColor[transitTone(tr)];
                return (
                  <View key={i} style={styles.transit}>
                    <View style={[styles.dot, { backgroundColor: c }]} />
                    <View style={styles.flex}>
                      <AppText variant="bodyStrong">{d.title}</AppText>
                      <AppText variant="caption" muted>{d.text}</AppText>
                    </View>
                  </View>
                );
              })
            ) : (
              <AppText muted>{t('today.skyEmpty')}</AppText>
            )}
          </TodayCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <GlassCard style={styles.streak}>
            <View style={[styles.flame, { backgroundColor: withAlpha(colors.gold, 0.12) }]}>
              <SparkIcon size={26} color={colors.gold} />
            </View>
            <View style={styles.flex}>
              <AppText variant="subtitle">{t('today.streak', { count: streak.count })}</AppText>
              <AppText variant="caption" muted>{t('today.streakBest', { best: streak.best })}</AppText>
            </View>
            <ShareChip template="day" color={colors.gold} />
          </GlassCard>
        </Animated.View>

        {prefs.notifications ? (
          <AppText variant="caption" muted center>{t('today.notifyOn', { time })}</AppText>
        ) : (
          <Button variant="secondary" title={t('today.notifyCta')} onPress={() => enableNotifications(lang, t('app.name'))} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.lg, paddingBottom: spacing.xxl },
  heroTitle: { fontSize: 36, lineHeight: 40 },
  scores: { flexDirection: 'row', paddingTop: spacing.md, borderTopWidth: 1 },
  cardRow: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  cardText: { gap: spacing.sm },
  twoCols: { flexDirection: 'row', gap: spacing.md },
  rings: { flexDirection: 'row', justifyContent: 'space-around' },
  transit: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  flame: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
