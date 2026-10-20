import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { GlassCard } from '@/components/glass-card';
import { TarotFace } from '@/components/tarot-face';
import { SectionTitle } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { useLang } from '@/content/types';
import { draw, TAROT_DECK } from '@/engines/divination';
import { firstName } from '@/engines/reading';
import { cardMeaning, cardName, localAnswer, type Drawn } from '@/features/oracle/interpret';
import { readingSummary } from '@/features/summary';
import { useReading } from '@/hooks/use-reading';
import { aiEnabled, aiOracle } from '@/services/ai';
import { usePremium } from '@/services/purchases';
import { addHistory, prefsStore } from '@/storage/app-data';
import { fonts, noOutline, radius, spacing, useTheme } from '@/theme';

export default function AskScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const premium = usePremium();
  const r = useReading();
  const [question, setQuestion] = useState('');
  const [cards, setCards] = useState<Drawn[] | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [busy, setBusy] = useState(false);
  const positions = t('oracle.positions.ask', { returnObjects: true }) as string[];
  const c = colors.gold;

  if (!premium || !r) {
    return (
      <Screen title={t('oracle.ask')} accent={c}>
        <GlassCard style={styles.gap}>
          <AppText>{t('oracle.askHint')}</AppText>
          <Button title={t('paywall.unlock')} onPress={() => router.push('/paywall')} />
        </GlassCard>
      </Screen>
    );
  }

  const ask = async () => {
    const drawn = draw(TAROT_DECK, 3, { reversals: prefsStore.get().reversals });
    setCards(drawn);
    setAnswer(null);
    setBusy(true);
    const name = firstName(r.person.fullName);
    let text: string;
    let isOffline = false;
    try {
      if (!aiEnabled()) throw new Error('offline');
      const res = await aiOracle({
        lang,
        firstName: name,
        question: question.trim(),
        spread: 'three',
        cards: drawn.map((d, i) => ({ name: cardName('tarot', d.id, lang), position: positions[i], reversed: d.reversed, meaning: cardMeaning('tarot', d, lang) })),
        profile: readingSummary(r),
      });
      text = res.answer;
    } catch {
      text = localAnswer(drawn, positions, lang, name);
      isOffline = true;
    }
    setAnswer(text);
    setOffline(isOffline);
    setBusy(false);
    addHistory({ kind: 'ask', spread: 'ask', question: question.trim(), cards: drawn.map((d) => ({ id: d.id, reversed: d.reversed })), answer: text });
  };

  return (
    <Screen title={t('oracle.ask')} accent={c}>
      <AppText muted>{t('oracle.askHint')}</AppText>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder={t('oracle.askPlaceholder')}
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={400}
        maxFontSizeMultiplier={1.6}
        style={[styles.input, noOutline, { color: colors.text, borderColor: c, backgroundColor: colors.surfaceGlass }]}
      />
      <Button title={t('oracle.askCta')} onPress={ask} disabled={question.trim().length < 3 || busy} />

      {cards ? (
        <Animated.View entering={FadeIn.duration(500)} style={styles.gap}>
          <View style={styles.cards}>
            {cards.map((d, i) => (
              <View key={i} style={styles.card}>
                <TarotFace id={String(d.id)} width={92} color={colors.technique.tarot} reversed={d.reversed} />
                <AppText variant="caption" muted center>{positions[i]}</AppText>
                <AppText variant="caption" center>{cardName('tarot', d.id, lang)}</AppText>
              </View>
            ))}
          </View>
          <GlassCard accent={c} style={styles.gap}>
            <SectionTitle>{offline ? t('oracle.offlineAnswer') : t('oracle.interpretation')}</SectionTitle>
            {busy ? (
              <View style={styles.busy}>
                <ActivityIndicator color={c} />
                <AppText muted>{t('oracle.interpreting')}</AppText>
              </View>
            ) : (
              <AppText>{answer}</AppText>
            )}
          </GlassCard>
        </Animated.View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  input: { minHeight: 90, borderWidth: 1, borderRadius: radius.card, padding: spacing.md, fontFamily: fonts.body, fontSize: 16, textAlignVertical: 'top' },
  cards: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { alignItems: 'center', gap: 4, width: 100 },
  busy: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
