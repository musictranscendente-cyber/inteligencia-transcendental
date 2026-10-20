import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { GlassCard } from '@/components/glass-card';
import { Pill, SectionTitle } from '@/components/ui/bits';
import { FlipCard } from '@/components/ui/flip-card';
import { Screen } from '@/components/ui/screen';
import { yesNo } from '@/content/tarot';
import { useLang } from '@/content/types';
import { draw, shuffle } from '@/engines/divination';
import { Back, Face, ASPECT } from '@/features/oracle/faces';
import { cardMeaning, cardName, type Drawn } from '@/features/oracle/interpret';
import { deckOf, isSpread, SPREADS, type SpreadKey } from '@/features/oracle/spreads';
import { usePremium } from '@/services/purchases';
import { addHistory, countUsage, prefsStore, todayUsage, type HistoryKind } from '@/storage/app-data';
import { fonts, noOutline, radius, spacing, useTheme } from '@/theme';

type Phase = 'intro' | 'shuffling' | 'picking' | 'reading';

export default function SpreadScreen() {
  const { spread: raw } = useLocalSearchParams<{ spread: string }>();
  const spread: SpreadKey = isSpread(raw) ? raw : 'three';
  const cfg = SPREADS[spread];
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const premium = usePremium();
  const prefs = prefsStore.use();
  const [phase, setPhase] = useState<Phase>('intro');
  const [question, setQuestion] = useState('');
  const [fan, setFan] = useState<Drawn[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const saved = useRef(false);

  const color = cfg.deck === 'tarot' ? colors.technique.tarot : cfg.deck === 'lenormand' ? colors.technique.oracles : colors.technique.humanDesign;
  const positions = t(`oracle.positions.${spread}`, { returnObjects: true }) as string[];
  const locked = !premium && (!cfg.free || (cfg.deck === 'tarot' && todayUsage().tarot >= 1));
  const cards = picked.map((i) => fan[i]);
  const allFlipped = flipped.length === cfg.count && flipped.every(Boolean);

  // Embaralhar: o monte balança e depois abre em leque.
  const wobble = useSharedValue(0);
  const wobbleStyle = useAnimatedStyle(() => ({ transform: [{ translateX: wobble.get() * 16 }, { rotate: `${wobble.get() * 6}deg` }] }));
  const start = () => {
    const reversals = cfg.deck !== 'lenormand' && prefs.reversals;
    setFan(draw(deckOf(cfg.deck), Math.min(24, deckOf(cfg.deck).length), { reversals }));
    setPicked([]);
    setFlipped(Array(cfg.count).fill(false));
    saved.current = false;
    setPhase('shuffling');
    wobble.set(withRepeat(withSequence(withTiming(1, { duration: 140 }), withTiming(-1, { duration: 140 })), 4, true, () => {}));
    setTimeout(() => {
      wobble.set(withTiming(0, { duration: 120 }));
      setPhase('picking');
    }, 1300);
  };

  const pick = (i: number) => {
    if (picked.includes(i) || picked.length >= cfg.count) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length === cfg.count) setTimeout(() => setPhase('reading'), 450);
  };

  useEffect(() => {
    if (phase !== 'reading' || !allFlipped || saved.current) return;
    const kind: HistoryKind = cfg.deck === 'tarot' ? 'tarot' : cfg.deck === 'lenormand' ? 'lenormand' : 'runes';
    addHistory({ kind, spread, question: question.trim() || undefined, cards: cards.map((c) => ({ id: c.id, reversed: c.reversed })), answer: spread === 'yesno' ? yesNo(String(cards[0].id), cards[0].reversed) : undefined });
    if (cfg.deck === 'tarot') countUsage('tarot');
    saved.current = true;
  }, [phase, allFlipped]); // eslint-disable-line react-hooks/exhaustive-deps

  const slotW = cfg.count > 4 ? Math.min(78, (width - 2 * spacing.lg - 3 * spacing.sm) / 4) : Math.min(120, (width - 2 * spacing.lg - (cfg.count - 1) * spacing.md) / cfg.count);
  const fanW = 64;
  const shuffledStack = useMemo(() => shuffle([0, 1, 2, 3, 4]), []);

  if (locked) {
    return (
      <Screen title={t(`oracle.spreads.${spread}`)} accent={color}>
        <GlassCard accent={color} style={styles.gap}>
          <AppText>{cfg.free ? t('oracle.freeLimit') : t('paywall.lockedTitle')}</AppText>
          <Button title={t('paywall.unlock')} onPress={() => router.push('/paywall')} />
        </GlassCard>
      </Screen>
    );
  }

  return (
    <Screen title={t(`oracle.spreads.${spread}`)} accent={color} kicker={t(`oracle.kinds.${cfg.deck === 'tarot' ? 'tarot' : cfg.deck === 'lenormand' ? 'lenormand' : 'runes'}`)}>
      {phase === 'intro' ? (
        <Animated.View entering={FadeIn} style={styles.gap}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={t('oracle.questionPlaceholder')}
            placeholderTextColor={colors.textMuted}
            multiline
            maxFontSizeMultiplier={1.6}
            style={[styles.input, noOutline, { color: colors.text, borderColor: color, backgroundColor: colors.surfaceGlass }]}
          />
          {cfg.deck !== 'lenormand' ? (
            <View style={styles.row}>
              <AppText variant="caption" muted>{t('oracle.reversals')}</AppText>
              <Pill label={prefs.reversals ? t('settings.on') : t('settings.off')} active={prefs.reversals} onPress={() => prefsStore.set((p) => ({ ...p, reversals: !p.reversals }))} color={color} />
            </View>
          ) : null}
          <View style={styles.stack}>
            {shuffledStack.map((k, i) => (
              <View key={k} style={[styles.stackCard, { transform: [{ rotate: `${(i - 2) * 4}deg` }] }]}>
                <Back deck={cfg.deck} width={110} color={color} />
              </View>
            ))}
          </View>
          <Button title={t('oracle.shuffle')} onPress={start} />
        </Animated.View>
      ) : null}

      {phase === 'shuffling' ? (
        <View style={styles.center}>
          <Animated.View style={[styles.stack, wobbleStyle]}>
            {shuffledStack.map((k, i) => (
              <View key={k} style={[styles.stackCard, { transform: [{ rotate: `${(i - 2) * 7}deg` }] }]}>
                <Back deck={cfg.deck} width={110} color={color} />
              </View>
            ))}
          </Animated.View>
          <AppText muted>{t('oracle.shuffling')}</AppText>
        </View>
      ) : null}

      {phase === 'picking' ? (
        <Animated.View entering={FadeIn} style={styles.gap}>
          <AppText center>{t('oracle.pick', { n: cfg.count })}</AppText>
          <AppText variant="caption" gold center>{t('oracle.picked', { done: picked.length, n: cfg.count })}</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fan}>
            {fan.map((_, i) => {
              const chosen = picked.includes(i);
              return (
                <Pressable key={i} onPress={() => pick(i)} accessibilityRole="button" style={[styles.fanCard, { marginLeft: i ? -fanW * 0.45 : 0, transform: [{ translateY: chosen ? -26 : 0 }, { rotate: `${(i - fan.length / 2) * 1.2}deg` }], opacity: chosen ? 0.35 : 1 }]}>
                  <Back deck={cfg.deck} width={fanW} color={color} />
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      ) : null}

      {phase === 'reading' ? (
        <View style={styles.gap}>
          {question.trim() ? <AppText variant="subtitle" center>{`“${question.trim()}”`}</AppText> : null}
          <AppText variant="caption" muted center>{t('oracle.tapToFlip')}</AppText>
          <View style={[styles.slots, cfg.count > 4 && styles.slotsWrap]}>
            {cards.map((c, i) => (
              <Animated.View key={i} entering={FadeInDown.delay(i * 120)} style={[styles.slot, { width: slotW }]}>
                <FlipCard
                  width={slotW}
                  height={slotW * ASPECT[cfg.deck]}
                  flipped={flipped[i]}
                  onFlip={() => setFlipped((f) => f.map((v, k) => (k === i ? true : v)))}
                  back={<Back deck={cfg.deck} width={slotW} color={color} />}
                  front={<Face deck={cfg.deck} card={c} width={slotW} lang={lang} color={color} />}
                />
                <AppText variant="caption" muted center numberOfLines={2}>{positions[i]}</AppText>
              </Animated.View>
            ))}
          </View>
          {!allFlipped ? <Button variant="secondary" title={t('oracle.revealAll')} onPress={() => setFlipped(Array(cfg.count).fill(true))} /> : null}

          {allFlipped ? (
            <Animated.View entering={FadeIn.duration(500)} style={styles.gap}>
              {spread === 'yesno' ? (
                <GlassCard accent={color} style={styles.center}>
                  <AppText style={styles.answer} color={color}>{t(`common.${yesNo(String(cards[0].id), cards[0].reversed)}`)}</AppText>
                </GlassCard>
              ) : null}
              {cards.map((c, i) => (
                <GlassCard key={i} style={styles.small}>
                  <SectionTitle color={color}>{positions[i]}</SectionTitle>
                  <AppText variant="subtitle">{`${cardName(cfg.deck, c.id, lang)}${c.reversed && cfg.deck === 'tarot' ? ` · ${t('today.reversed')}` : ''}`}</AppText>
                  <AppText>{cardMeaning(cfg.deck, c, lang)}</AppText>
                </GlassCard>
              ))}
              <AppText variant="caption" muted center>{t('oracle.saved')}</AppText>
              <Button variant="secondary" title={t('oracle.again')} onPress={() => setPhase('intro')} />
            </Animated.View>
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  small: { gap: spacing.xs },
  center: { alignItems: 'center', gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  input: { minHeight: 70, borderWidth: 1, borderRadius: radius.card, padding: spacing.md, fontFamily: fonts.body, fontSize: 16, textAlignVertical: 'top' },
  stack: { height: 200, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.md },
  stackCard: { position: 'absolute' },
  fan: { paddingVertical: 40, paddingHorizontal: spacing.lg },
  fanCard: {},
  slots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  slotsWrap: { flexWrap: 'wrap', gap: spacing.sm },
  slot: { alignItems: 'center', gap: 4 },
  answer: { fontFamily: fonts.title, fontSize: 48, lineHeight: 56 },
});
