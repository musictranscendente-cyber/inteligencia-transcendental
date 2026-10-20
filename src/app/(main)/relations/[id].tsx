import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Bodygraph } from '@/components/charts/bodygraph';
import { Radar } from '@/components/charts/misc-charts';
import { NatalWheel } from '@/components/charts/natal-wheel';
import { GlassCard } from '@/components/glass-card';
import { NumberRing, SectionTitle } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { ShareButton } from '@/components/ui/share-button';
import { RELATION_TEXT } from '@/content/chinese';
import { useLang } from '@/content/types';
import { RADAR_AXES } from '@/engines/compatibility';
import { buildReading, firstName } from '@/engines/reading';
import { compareReadings, compatTexts } from '@/features/relations/compat';
import { toPersonInput, useReading } from '@/hooks/use-reading';
import { aiEnabled, aiRelation } from '@/services/ai';
import { peopleStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

export default function PersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const people = peopleStore.use();
  const person = people.find((p) => p.id === id);
  const me = useReading();
  const other = useMemo(() => (person ? buildReading(toPersonInput(person)) : null), [person]);
  const [ai, setAi] = useState<{ unites: string; clashes: string; tips: string } | null>(null);
  const [busy, setBusy] = useState(false);
  if (!person || !me || !other) return <Screen title={t('rel.title')}><AppText muted>{t('rel.empty')}</AppText></Screen>;

  const c = colors.technique.oracles;
  const comp = compareReadings(me, other);
  const texts = ai ?? compatTexts(comp, lang);
  const w = Math.min(width - 4 * spacing.lg, 400);
  const names: [string, string] = [firstName(me.person.fullName), firstName(person.fullName)];

  const remove = () => {
    const run = () => {
      peopleStore.set((p) => p.filter((x) => x.id !== person.id));
      router.back();
    };
    if (Platform.OS === 'web') return globalThis.confirm?.(t('rel.deleteConfirm', { name: person.fullName })) && run();
    Alert.alert(t('rel.deleteConfirm', { name: person.fullName }), '', [{ text: t('common.cancel'), style: 'cancel' }, { text: t('common.delete'), style: 'destructive', onPress: run }]);
  };

  const askAi = async () => {
    setBusy(true);
    try {
      setAi(await aiRelation({ lang, names, data: { overall: comp.overall, radar: comp.radar, synastry: comp.synastry.slice(0, 10).map((s) => `${s.a} ${s.type} ${s.b}`), chinese: comp.chinese.relation, hdChannels: comp.humanDesign?.channels.length ?? null, numerology: comp.numerology } }));
    } catch {
      setAi(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen title={`${names[0]} & ${names[1]}`} kicker={t(`rel.types.${person.relation}`)} accent={c} right={<ShareButton template="compat" params={{ id: person.id }} color={c} />}>
      <GlassCard accent={c} style={[styles.gap, styles.center]}>
        <AppText variant="label" color={c}>{t('rel.overall')}</AppText>
        <NumberRing value={comp.overall} color={c} size={120} />
        <AppText center muted>{texts.tips}</AppText>
      </GlassCard>

      <PremiumGate>
        <View style={styles.gap}>
          <GlassCard style={[styles.gap, styles.center]}>
            <Radar values={RADAR_AXES.map((k) => comp.radar[k])} labels={RADAR_AXES.map((k) => t(`rel.radar.${k}`))} color={c} size={w} />
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('rel.unites')}</SectionTitle>
            <AppText>{texts.unites}</AppText>
            <SectionTitle color={c}>{t('rel.clashes')}</SectionTitle>
            <AppText>{texts.clashes}</AppText>
            <SectionTitle color={c}>{t('rel.tips')}</SectionTitle>
            <AppText>{texts.tips}</AppText>
            {aiEnabled() && !ai ? busy ? <ActivityIndicator color={c} /> : <Button variant="secondary" title={t('syn.regenerate')} onPress={askAi} /> : null}
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('rel.parts')}</SectionTitle>
            <AppText>{`${t('rel.numerology')}: ${comp.numerology}%`}</AppText>
            <AppText>{`${t('rel.chinese')}: ${comp.chinese.score}% · ${RELATION_TEXT[comp.chinese.relation][lang]}`}</AppText>
            {comp.humanDesign ? <AppText>{`${t('rel.hd')}: ${comp.humanDesign.score}% · ${t('rel.hdChannels', { n: comp.humanDesign.channels.length })}`}</AppText> : null}
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('rel.biwheel')}</SectionTitle>
            <NatalWheel points={me.chart.points} cusps={me.chart.cusps} aspects={[]} size={w} outer={other.chart.points} outerColor={c} />
            <AppText variant="caption" muted center>{`${names[0]} · ${names[1]}`}</AppText>
          </GlassCard>

          {me.humanDesign && other.humanDesign && comp.humanDesign ? (
            <GlassCard style={[styles.gap, styles.center]}>
              <SectionTitle color={colors.technique.humanDesign}>{t('rel.hd')}</SectionTitle>
              <Bodygraph
                defined={me.humanDesign.defined}
                gates={[...new Set([...me.humanDesign.gates, ...other.humanDesign.gates])]}
                channels={me.humanDesign.channels}
                color={colors.technique.humanDesign}
                width={Math.min(w, 300)}
                highlight={comp.humanDesign.channels}
                highlightColor={c}
              />
              <AppText variant="caption" muted center>{t('rel.hdChannels', { n: comp.humanDesign.channels.length })}</AppText>
            </GlassCard>
          ) : null}
        </View>
      </PremiumGate>

      <Button variant="ghost" title={t('common.delete')} onPress={remove} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
});
