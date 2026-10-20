import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Radar } from '@/components/charts/misc-charts';
import { GlassCard } from '@/components/glass-card';
import { ScreenHeader } from '@/components/screen-header';
import { RowCard, SectionTitle } from '@/components/ui/bits';
import { RADAR_AXES } from '@/engines/compatibility';
import { buildReading } from '@/engines/reading';
import { compareReadings } from '@/features/relations/compat';
import { toPersonInput, useReading } from '@/hooks/use-reading';
import { usePremium } from '@/services/purchases';
import { peopleStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

export default function RelationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const premium = usePremium();
  const people = peopleStore.use();
  const me = useReading();
  const c = colors.technique.oracles;
  const canAdd = premium || people.length < 1;

  return (
    <View style={styles.flex}>
      <ScreenHeader title={t('rel.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        {people.length === 0 ? (
          <GlassCard accent={c} style={[styles.gap, styles.center]}>
            <Radar values={[70, 55, 80, 60, 75]} labels={RADAR_AXES.map((k) => t(`rel.radar.${k}`))} color={c} size={240} />
            <AppText center>{t('rel.empty')}</AppText>
          </GlassCard>
        ) : null}
        {me
          ? people.map((p, i) => {
              const score = compareReadings(me, buildReading(toPersonInput(p))).overall;
              return (
                <Animated.View key={p.id} entering={FadeInDown.delay(i * 60)}>
                  <RowCard
                    title={p.fullName}
                    subtitle={t(`rel.types.${p.relation}`)}
                    color={c}
                    onPress={() => router.push({ pathname: '/relations/[id]', params: { id: p.id } })}
                    right={<AppText variant="title" color={c}>{`${score}`}</AppText>}
                  />
                </Animated.View>
              );
            })
          : null}
        {canAdd ? <Button title={t('rel.add')} onPress={() => router.push('/relations/new')} /> : <AppText variant="caption" muted center>{t('rel.freeLimit')}</AppText>}
        {!canAdd ? <Button variant="secondary" title={t('paywall.unlock')} onPress={() => router.push('/paywall')} /> : null}

        <SectionTitle color={c}>{t('rel.names')}</SectionTitle>
        <RowCard title={t('rel.names')} subtitle={t('rel.namesHint')} color={colors.technique.numerology} onPress={() => router.push('/relations/names')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md, paddingBottom: spacing.xxl },
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
});
