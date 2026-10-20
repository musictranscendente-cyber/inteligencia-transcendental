import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { CardBack } from '@/components/card-back';
import { FoolJourney } from '@/components/charts/misc-charts';
import { GlassCard } from '@/components/glass-card';
import { TarotFace } from '@/components/tarot-face';
import { Layered, SectionTitle, Tag } from '@/components/ui/bits';
import { FlipCard } from '@/components/ui/flip-card';
import { Screen } from '@/components/ui/screen';
import { ShareButton } from '@/components/ui/share-button';
import { MAJOR_ARCANA } from '@/content/tarot-major';
import { useLang } from '@/content/types';
import { useReading } from '@/hooks/use-reading';
import { spacing, useTheme } from '@/theme';

export default function ArcanaScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [flipped, setFlipped] = useState(false);
  const r = useReading();
  if (!r) return null;
  const c = colors.technique.tarot;
  const a = MAJOR_ARCANA[r.arcana][lang];
  const y = MAJOR_ARCANA[r.yearArcana][lang];
  const year = new Date().getFullYear();
  const w = Math.min(width - 4 * spacing.lg, 400);

  return (
    <Screen title={a.name} kicker={t('arc.birth')} accent={c} right={<ShareButton template="arcana" color={c} />}>
      <View style={styles.center}>
        <FlipCard
          width={180}
          height={288}
          flipped={flipped}
          onFlip={() => setFlipped(true)}
          label={t('today.tapToReveal')}
          back={<CardBack width={180} accent={c} />}
          front={<TarotFace id={`M${r.arcana}`} width={180} color={c} />}
        />
        {!flipped ? <AppText variant="caption" muted>{t('today.tapToReveal')}</AppText> : null}
      </View>

      <GlassCard accent={c} style={styles.gap}>
        <View style={styles.tags}>{a.keywords.map((k) => <Tag key={k} label={k} color={c} />)}</View>
        <Layered summary={a.summary} text={a.personal} deep={`${t('arc.upright')}: ${a.upright} ${t('arc.reversed')}: ${a.reversed}`} color={c} />
      </GlassCard>

      <GlassCard style={styles.gap}>
        <SectionTitle color={c}>{t('arc.year', { year })}</SectionTitle>
        <View style={styles.row}>
          <TarotFace id={`M${r.yearArcana}`} width={84} color={colors.gold} />
          <View style={styles.flex}>
            <AppText variant="subtitle">{y.name}</AppText>
            <AppText muted>{y.summary}</AppText>
          </View>
        </View>
        <AppText>{y.upright}</AppText>
      </GlassCard>

      <GlassCard style={[styles.gap, styles.center]}>
        <SectionTitle color={c}>{t('arc.journey')}</SectionTitle>
        <FoolJourney highlight={r.arcana} secondary={r.yearArcana} color={c} width={w} names={MAJOR_ARCANA.map((m) => m[lang].name)} />
        <AppText variant="caption" muted center>{t('arc.journeyHint')}</AppText>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  center: { alignItems: 'center', gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
