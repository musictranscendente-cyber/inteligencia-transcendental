import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Hexagram } from '@/components/charts/misc-charts';
import { GlassCard } from '@/components/glass-card';
import { SectionTitle } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { ICHING } from '@/content/oracles';
import { useLang } from '@/content/types';
import { hexagramLines } from '@/engines/divination';
import { Face } from '@/features/oracle/faces';
import { cardMeaning, cardName } from '@/features/oracle/interpret';
import { SPREADS, isSpread } from '@/features/oracle/spreads';
import { formatDate } from '@/lib/format';
import { historyStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

export default function EntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const e = historyStore.use().find((h) => h.id === id);
  if (!e) return <Screen title={t('oracle.history')}><AppText muted>{t('oracle.historyEmpty')}</AppText></Screen>;

  if (e.kind === 'iching') {
    return (
      <Screen title={t('oracle.iching')} kicker={formatDate(new Date(e.date), i18n.language, true)}>
        {e.cards.map((c, i) => (
          <GlassCard key={i} style={[styles.gap, styles.center]}>
            <Hexagram lines={hexagramLines(Number(c.id))} color={colors.gold} width={100} />
            <AppText variant="subtitle" center>{`${c.id} · ${ICHING[Number(c.id) - 1].name[lang]}`}</AppText>
            <AppText center>{ICHING[Number(c.id) - 1].judgement[lang]}</AppText>
          </GlassCard>
        ))}
      </Screen>
    );
  }

  const deck = e.kind === 'ask' ? 'tarot' : isSpread(e.spread) ? SPREADS[e.spread].deck : 'tarot';
  const positions = t(`oracle.positions.${e.spread}`, { returnObjects: true }) as string[];
  const color = deck === 'tarot' ? colors.technique.tarot : deck === 'lenormand' ? colors.technique.oracles : colors.technique.humanDesign;
  return (
    <Screen title={t(`oracle.spreads.${e.spread}`, { defaultValue: t('oracle.ask') })} kicker={formatDate(new Date(e.date), i18n.language, true)} accent={color}>
      {e.question ? <AppText variant="subtitle" center>{`“${e.question}”`}</AppText> : null}
      {e.cards.map((c, i) => {
        const card = { id: c.id, reversed: !!c.reversed };
        return (
          <GlassCard key={i} style={styles.row}>
            <Face deck={deck} card={card} width={64} lang={lang} color={color} />
            <View style={styles.flex}>
              <SectionTitle color={color}>{positions[i] ?? ''}</SectionTitle>
              <AppText variant="bodyStrong">{cardName(deck, c.id, lang)}</AppText>
              <AppText muted>{cardMeaning(deck, card, lang)}</AppText>
            </View>
          </GlassCard>
        );
      })}
      {e.answer && e.kind === 'ask' ? (
        <GlassCard style={styles.gap}>
          <SectionTitle>{t('oracle.interpretation')}</SectionTitle>
          <AppText>{e.answer}</AppText>
        </GlassCard>
      ) : null}
      {e.answer && e.spread === 'yesno' ? <AppText variant="title" center color={color}>{t(`common.${e.answer}`)}</AppText> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
});
