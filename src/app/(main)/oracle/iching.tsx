import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Hexagram } from '@/components/charts/misc-charts';
import { GlassCard } from '@/components/glass-card';
import { SectionTitle } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { ICHING } from '@/content/oracles';
import { useLang } from '@/content/types';
import { hexagramLines, readIChing, type Line } from '@/engines/divination';
import { firstName } from '@/engines/reading';
import { readIChingText } from '@/features/oracle/reader';
import { useReading } from '@/hooks/use-reading';
import { usePremium } from '@/services/purchases';
import { addHistory } from '@/storage/app-data';
import { fonts, noOutline, radius, spacing, useTheme } from '@/theme';

function Coin({ heads, color }: { heads: boolean; color: string }) {
  return (
    <Svg width={54} height={54}>
      <Circle cx={27} cy={27} r={24} fill={heads ? color : 'transparent'} fillOpacity={heads ? 0.25 : 0} stroke={color} strokeWidth={1.5} />
      <Circle cx={27} cy={27} r={8} fill="none" stroke={color} />
      <SvgText x={27} y={52} fontSize={9} fill={color} textAnchor="middle">{heads ? '3' : '2'}</SvgText>
    </Svg>
  );
}

export default function IChingScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const premium = usePremium();
  const r = useReading();
  const [question, setQuestion] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [coins, setCoins] = useState<boolean[]>([true, false, true]);
  const spin = useSharedValue(0);
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotateY: `${spin.get() * 720}deg` }, { translateY: -Math.sin(spin.get() * Math.PI) * 40 }] }));
  const c = colors.gold;
  const done = lines.length === 6;
  const reading = done ? readIChing(lines) : null;

  useEffect(() => {
    if (reading) addHistory({ kind: 'iching', spread: 'iching', question: question.trim() || undefined, cards: [{ id: reading.hexagram }, ...(reading.transformed ? [{ id: reading.transformed }] : [])], lines });
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!premium) {
    return (
      <Screen title={t('oracle.iching')} accent={c}>
        <GlassCard style={styles.gap}>
          <AppText>{t('paywall.lockedTitle')}</AppText>
          <Button title={t('paywall.unlock')} onPress={() => router.push('/paywall')} />
        </GlassCard>
      </Screen>
    );
  }

  const toss = () => {
    const faces = [Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5];
    spin.set(0);
    spin.set(withSequence(withTiming(1, { duration: 700 }), withTiming(1, { duration: 1 })));
    setTimeout(() => {
      setCoins(faces);
      const sum = faces.reduce<number>((s, h) => s + (h ? 3 : 2), 0) as Line;
      setLines((l) => [...l, sum]);
    }, 700);
  };

  return (
    <Screen title={t('oracle.iching')} accent={c}>
      {lines.length === 0 ? (
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder={t('oracle.questionPlaceholder')}
          placeholderTextColor={colors.textMuted}
          multiline
          maxFontSizeMultiplier={1.6}
          style={[styles.input, noOutline, { color: colors.text, borderColor: c, backgroundColor: colors.surfaceGlass }]}
        />
      ) : question.trim() ? (
        <AppText variant="subtitle" center>{`“${question.trim()}”`}</AppText>
      ) : null}
      <GlassCard style={[styles.gap, styles.center]}>
        <Animated.View style={[styles.coins, spinStyle]}>
          {coins.map((h, i) => <Coin key={i} heads={h} color={c} />)}
        </Animated.View>
        {!done ? (
          <>
            <AppText variant="caption" muted>{t('oracle.tossN', { n: lines.length + 1 })}</AppText>
            <Button title={t('oracle.toss')} onPress={toss} />
          </>
        ) : null}
        <View style={styles.built}>
          {lines.map((l, i) => (
            <Animated.View key={i} entering={FadeInUp.duration(400)}>
              <AppText variant="caption" muted>{`${t('oracle.line', { n: i + 1 })}: ${l}${l === 6 || l === 9 ? ' ✦' : ''}`}</AppText>
            </Animated.View>
          ))}
        </View>
      </GlassCard>

      {reading ? (
        <Animated.View entering={FadeIn.duration(600)} style={styles.gap}>
          <GlassCard accent={c} style={[styles.gap, styles.center]}>
            <SectionTitle>{t('oracle.hexagram', { n: reading.hexagram })}</SectionTitle>
            <Hexagram lines={hexagramLines(reading.hexagram)} changing={reading.changing} color={c} width={130} />
            <AppText variant="title" center>{ICHING[reading.hexagram - 1].name[lang]}</AppText>
            <AppText center>{ICHING[reading.hexagram - 1].judgement[lang]}</AppText>
            <AppText variant="caption" muted center>
              {reading.changing.length ? t('oracle.changing', { lines: reading.changing.join(', ') }) : t('oracle.noChanging')}
            </AppText>
          </GlassCard>
          {reading.transformed ? (
            <GlassCard style={[styles.gap, styles.center]}>
              <SectionTitle>{t('oracle.becomes')}</SectionTitle>
              <Hexagram lines={hexagramLines(reading.transformed)} color={colors.technique.humanDesign} width={100} />
              <AppText variant="subtitle" center>{`${reading.transformed} · ${ICHING[reading.transformed - 1].name[lang]}`}</AppText>
              <AppText center>{ICHING[reading.transformed - 1].judgement[lang]}</AppText>
            </GlassCard>
          ) : null}
          <GlassCard accent={c} style={styles.gap}>
            <SectionTitle>{t('oracle.interpretation')}</SectionTitle>
            {readIChingText({ ...reading, question, lang, firstName: r ? firstName(r.person.fullName) : '', personalYear: r?.personal.year }).map((p, i) => (
              <AppText key={i}>{p}</AppText>
            ))}
          </GlassCard>
          <Button variant="secondary" title={t('oracle.again')} onPress={() => setLines([])} />
        </Animated.View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  coins: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  built: { alignItems: 'center', gap: 2, flexDirection: 'column-reverse' },
  input: { minHeight: 70, borderWidth: 1, borderRadius: radius.card, padding: spacing.md, fontFamily: fonts.body, fontSize: 16, textAlignVertical: 'top' },
});
