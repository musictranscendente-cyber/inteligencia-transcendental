import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { RowCard } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { useLang } from '@/content/types';
import { cardName } from '@/features/oracle/interpret';
import { SPREADS, isSpread } from '@/features/oracle/spreads';
import { ICHING } from '@/content/oracles';
import { formatDate } from '@/lib/format';
import { historyStore, type HistoryEntry } from '@/storage/app-data';

export function entrySummary(e: HistoryEntry, lang: ReturnType<typeof useLang>) {
  if (e.kind === 'iching') return e.cards.map((c) => `${c.id} · ${ICHING[Number(c.id) - 1].name[lang]}`).join(' → ');
  const deck = isSpread(e.spread) ? SPREADS[e.spread].deck : 'tarot';
  return e.cards.map((c) => cardName(deck, c.id, lang)).join(' · ');
}

export default function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const history = historyStore.use();
  return (
    <Screen title={t('oracle.history')}>
      {history.length === 0 ? <AppText muted>{t('oracle.historyEmpty')}</AppText> : null}
      {history.map((e) => (
        <RowCard
          key={e.id}
          title={`${t(`oracle.kinds.${e.kind}`)} · ${e.kind === 'iching' ? t('oracle.iching') : t(`oracle.spreads.${e.spread}`)}`}
          subtitle={`${formatDate(new Date(e.date), i18n.language, true)}${e.question ? ` · “${e.question}”` : ''}\n${entrySummary(e, lang)}`}
          onPress={() => router.push({ pathname: '/oracle/entry/[id]', params: { id: e.id } })}
          style={styles.row}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({ row: {} });
