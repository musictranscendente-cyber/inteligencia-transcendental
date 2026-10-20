import { router } from 'expo-router';
import { useMemo } from 'react';
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
import { NumberRing, ScoreBars, SectionTitle } from '@/components/ui/bits';
import { FlipCard } from '@/components/ui/flip-card';
import { ANGEL_ATTRIBUTES } from '@/content/angels';
import { SIGNS_TEXT } from '@/content/astrology';
import { MOON_PHASES } from '@/content/daily';
import { cardInfo } from '@/content/tarot';
import { useLang } from '@/content/types';
import { angelForDate } from '@/engines/angels';
import { dailyEnergy } from '@/engines/daily';
import { firstName } from '@/engines/reading';
import { cardOfDay, dayKey, dayLine } from '@/features/today/daily-picks';
import { useReading } from '@/hooks/use-reading';
import { enableNotifications } from '@/services/notifications';
import { prefsStore, streakStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

export default function TodayScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const reading = useReading();
  const prefs = prefsStore.use();
  const streak = streakStore.use();
  const today = new Date();
  const key = dayKey(today);

  const energy = useMemo(() => (reading ? dailyEnergy(reading.person.birthDate, reading.chart) : null), [reading]);
  if (!reading || !energy) return null;

  const name = firstName(reading.person.fullName);
  const line = dayLine(energy.personalDay, lang, energy.seed);
  const card = cardOfDay(reading.person.fullName, prefs.reversals, today);
  const info = cardInfo(card.id, lang);
  const revealed = prefs.revealedDay === key;
  const angel = angelForDate(today.getMonth() + 1, today.getDate());
  const moonPhase = MOON_PHASES[lang][energy.moon.phaseIndex];
  const southern = reading.person.place.lat < 0;
  const time = `${String(prefs.notifyHour).padStart(2, '0')}:${String(prefs.notifyMinute).padStart(2, '0')}`;

  return (
    <View style={styles.flex}>
      <ScreenHeader kicker={t('screens.today.greeting', { name })} title={t('tabs.today')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <GlassCard accent={colors.gold} style={styles.gap}>
            <AppText variant="label" gold>{t('today.energyKicker')}</AppText>
            <AppText variant="title">{line.title}</AppText>
            <AppText muted>{line.phrase}</AppText>
            <View style={styles.scores}>
              <ScoreBars label={t('today.love')} value={energy.scores.love} color={colors.technique.oracles} />
              <ScoreBars label={t('today.work')} value={energy.scores.work} color={colors.technique.astrology} />
              <ScoreBars label={t('today.energy')} value={energy.scores.energy} color={colors.technique.humanDesign} />
            </View>
            <Button variant="secondary" title={t('today.shareDay')} onPress={() => router.push({ pathname: '/share', params: { template: 'day' } })} />
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <GlassCard accent={colors.technique.tarot} style={styles.gap}>
            <SectionTitle color={colors.technique.tarot}>{t('today.cardOfDay')}</SectionTitle>
            <View style={styles.cardRow}>
              <FlipCard
                width={110}
                height={176}
                flipped={revealed}
                onFlip={() => prefsStore.set((p) => ({ ...p, revealedDay: key }))}
                label={t('today.tapToReveal')}
                back={<CardBack width={110} accent={colors.technique.tarot} />}
                front={<TarotFace id={card.id} width={110} color={colors.technique.tarot} reversed={card.reversed} />}
              />
              <View style={styles.flex}>
                {revealed ? (
                  <>
                    <AppText variant="subtitle">{info.name}{card.reversed ? ` · ${t('today.reversed')}` : ''}</AppText>
                    <AppText muted>{card.reversed ? info.reversed : info.upright}</AppText>
                  </>
                ) : (
                  <AppText muted>{t('today.tapToReveal')}</AppText>
                )}
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.twoCols}>
          <GlassCard accent={colors.technique.angel} style={[styles.flex, styles.center]}>
            <SectionTitle color={colors.technique.angel}>{t('today.angelOfDay')}</SectionTitle>
            <Wings width={120} color={colors.technique.angel} />
            <AppText variant="subtitle" center>{angel.name}</AppText>
            <AppText variant="caption" muted center>{ANGEL_ATTRIBUTES[angel.number - 1][lang]}</AppText>
          </GlassCard>
          <GlassCard accent={colors.technique.astrology} style={[styles.flex, styles.center]}>
            <SectionTitle color={colors.technique.astrology}>{t('today.moonToday')}</SectionTitle>
            <MoonPhase phase={energy.moon.phase} size={70} southern={southern} />
            <AppText variant="subtitle" center>{moonPhase.name}</AppText>
            <AppText variant="caption" muted center>
              {t('today.moonIn', { sign: SIGNS_TEXT[energy.moon.sign][lang].name })} · {t('today.illumination', { pct: Math.round(energy.moon.illumination * 100) })}
            </AppText>
            <AppText variant="caption" center>{moonPhase.tip}</AppText>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <GlassCard accent={colors.technique.numerology} style={styles.gap}>
            <SectionTitle color={colors.technique.numerology}>{t('today.numbersOfDay')}</SectionTitle>
            <View style={styles.rings}>
              <NumberRing value={energy.personalDay} label={t('today.personalDay')} color={colors.technique.numerology} />
              <NumberRing value={energy.personalMonth} label={t('today.personalMonth')} color={colors.technique.numerology} />
              <NumberRing value={energy.personalYear} label={t('today.personalYear')} color={colors.technique.numerology} />
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <GlassCard style={styles.streak}>
            <View style={styles.flame}>
              <SparkIcon size={22 + Math.min(streak.count, 30)} color={colors.gold} />
            </View>
            <View style={styles.flex}>
              <AppText variant="subtitle">{t('today.streak', { count: streak.count })}</AppText>
              <AppText variant="caption" muted>{t('today.streakBest', { best: streak.best })}</AppText>
            </View>
          </GlassCard>
        </Animated.View>

        {prefs.notifications ? (
          <AppText variant="caption" muted center>{t('today.notifyOn', { time })}</AppText>
        ) : (
          <Button variant="ghost" title={t('today.notifyCta')} onPress={() => enableNotifications(lang, t('app.name'))} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.lg, paddingBottom: spacing.xxl },
  gap: { gap: spacing.md },
  center: { alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  scores: { flexDirection: 'row', marginVertical: spacing.sm },
  cardRow: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  twoCols: { flexDirection: 'row', gap: spacing.md },
  rings: { flexDirection: 'row', justifyContent: 'space-around' },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  flame: { width: 56, alignItems: 'center' },
});
