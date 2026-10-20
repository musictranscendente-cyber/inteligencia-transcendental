import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Bodygraph } from '@/components/charts/bodygraph';
import { GlassCard } from '@/components/glass-card';
import { SectionTitle, Tag } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { ShareButton } from '@/components/ui/share-button';
import { HD_AUTHORITIES, HD_CENTERS, HD_CROSS_ANGLES, HD_DEFINITIONS, HD_GATES, HD_LINES, HD_TYPES } from '@/content/humanDesign';
import { useLang } from '@/content/types';
import { HD_PLANETS, type CenterKey } from '@/engines/humanDesign';
import { useReading } from '@/hooks/use-reading';
import { spacing, useTheme } from '@/theme';

export default function HumanDesignScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [center, setCenter] = useState<CenterKey | null>(null);
  const r = useReading();
  if (!r) return null;
  const c = colors.technique.humanDesign;
  const hd = r.humanDesign;

  if (!hd) {
    return (
      <Screen title={t('map.techniques.humanDesign')} accent={c}>
        <GlassCard accent={c} style={styles.gap}>
          <AppText>{t('hd.noTime')}</AppText>
          <Button title={t('profile.edit')} onPress={() => router.push('/profile-edit')} />
        </GlassCard>
      </Screen>
    );
  }

  const type = HD_TYPES[hd.type][lang];
  const auth = HD_AUTHORITIES[hd.authority][lang];
  const lines = HD_LINES[lang];
  const gate = (g: number) => `${g} · ${HD_GATES[lang][g]}`;
  const sel = center ? HD_CENTERS[center][lang] : null;
  const w = Math.min(width - 4 * spacing.lg, 340);

  return (
    <Screen title={type.name} kicker={`${t('map.techniques.humanDesign')} · ${hd.profile.join('/')}`} accent={c} right={<ShareButton template="bodygraph" color={c} />}>
      <GlassCard accent={c} style={styles.gap}>
        <AppText variant="subtitle">{type.summary}</AppText>
        <View style={styles.tags}>
          <Tag label={`${t('hd.strategy')}: ${type.strategy}`} color={c} />
          <Tag label={`${t('hd.signature')}: ${type.signature}`} color={colors.gold} />
          <Tag label={`${t('hd.notSelf')}: ${type.notSelf}`} color={colors.textMuted} />
        </View>
        <AppText>{type.text}</AppText>
      </GlassCard>

      <PremiumGate>
        <View style={styles.gap}>
          <GlassCard style={[styles.gap, styles.center]}>
            <SectionTitle color={c}>{t('hd.centers')}</SectionTitle>
            <Bodygraph defined={hd.defined} gates={hd.gates} channels={hd.channels} color={c} width={w} selected={center} onSelect={setCenter} />
            <AppText variant="caption" muted center>{t('hd.centerHint')}</AppText>
            {sel && center ? (
              <View style={styles.full}>
                <AppText variant="subtitle">{`${sel.name} · ${hd.defined.includes(center) ? t('hd.defined') : t('hd.open')}`}</AppText>
                <AppText variant="caption" muted>{sel.theme}</AppText>
                <AppText>{hd.defined.includes(center) ? sel.defined : sel.open}</AppText>
              </View>
            ) : null}
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('hd.authority')}</SectionTitle>
            <AppText variant="subtitle">{auth.name}</AppText>
            <AppText>{auth.text}</AppText>
            <SectionTitle color={c}>{t('hd.profile')}</SectionTitle>
            <AppText variant="subtitle">{`${hd.profile.join('/')} · ${lines[hd.profile[0] - 1].name} / ${lines[hd.profile[1] - 1].name}`}</AppText>
            <AppText>{`${hd.profile[0]}: ${lines[hd.profile[0] - 1].text}. ${hd.profile[1]}: ${lines[hd.profile[1] - 1].text}.`}</AppText>
            <SectionTitle color={c}>{t('hd.definition')}</SectionTitle>
            <AppText>{HD_DEFINITIONS[hd.definition][lang]}</AppText>
            <SectionTitle color={c}>{t('hd.cross')}</SectionTitle>
            <AppText>{HD_CROSS_ANGLES[hd.cross.angle][lang]}</AppText>
            <AppText muted>{hd.cross.gates.map(gate).join(' | ')}</AppText>
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('hd.channels')}</SectionTitle>
            {hd.channels.length ? hd.channels.map(([a, b]) => <AppText key={`${a}-${b}`}>{`${a}–${b} · ${HD_GATES[lang][a]} / ${HD_GATES[lang][b]}`}</AppText>) : <AppText muted>{t('num.none')}</AppText>}
          </GlassCard>

          <GlassCard style={styles.gap}>
            <View style={styles.cols}>
              <View style={styles.flex}>
                <SectionTitle color={colors.text}>{t('hd.personality')}</SectionTitle>
                {HD_PLANETS.map((p) => <AppText key={p} variant="caption">{`${t(`hdPlanets.${p}`)} ${hd.personality[p].gate}.${hd.personality[p].line}`}</AppText>)}
              </View>
              <View style={styles.flex}>
                <SectionTitle color={colors.danger}>{t('hd.design')}</SectionTitle>
                {HD_PLANETS.map((p) => <AppText key={p} variant="caption">{`${t(`hdPlanets.${p}`)} ${hd.design[p].gate}.${hd.design[p].line}`}</AppText>)}
              </View>
            </View>
          </GlassCard>
        </View>
      </PremiumGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  full: { alignSelf: 'stretch', gap: spacing.xs },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cols: { flexDirection: 'row', gap: spacing.md },
});
