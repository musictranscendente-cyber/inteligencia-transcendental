import { router, type Href } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { CardBack } from '@/components/card-back';
import { Hexagram } from '@/components/charts/misc-charts';
import { LockIcon } from '@/components/icons';
import { LenormandFace, RuneStone } from '@/components/oracle-faces';
import { ScreenHeader } from '@/components/screen-header';
import { RowCard, SectionTitle } from '@/components/ui/bits';
import { SPREADS, type SpreadKey } from '@/features/oracle/spreads';
import { usePremium } from '@/services/purchases';
import { historyStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

export default function OracleScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const premium = usePremium();
  const history = historyStore.use();

  const item = (key: SpreadKey, color: string, delay: number) => (
    <Animated.View key={key} entering={FadeInDown.delay(delay).duration(400)}>
      <RowCard
        title={t(`oracle.spreads.${key}`)}
        subtitle={(t(`oracle.positions.${key}`, { returnObjects: true }) as string[]).join(' · ')}
        color={color}
        onPress={() => router.push(`/oracle/${key}` as Href)}
        right={!premium && !SPREADS[key].free ? <LockIcon size={20} color={colors.textMuted} /> : null}
      />
    </Animated.View>
  );

  return (
    <View style={styles.flex}>
      <ScreenHeader title={t('oracle.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <CardBack width={70} accent={colors.technique.tarot} />
          <LenormandFace number={24} name="" width={70} />
          <RuneStone rune="ansuz" size={64} color={colors.technique.oracles} />
          <Hexagram lines={[true, true, false, true, false, true]} color={colors.gold} width={56} />
        </View>

        <Animated.View entering={FadeInDown.duration(400)}>
          <RowCard
            title={t('oracle.ask')}
            subtitle={t('oracle.askHint')}
            color={colors.gold}
            onPress={() => router.push('/oracle/ask')}
            right={!premium ? <LockIcon size={20} color={colors.textMuted} /> : null}
          />
        </Animated.View>

        <SectionTitle color={colors.technique.tarot}>{t('oracle.tarot')}</SectionTitle>
        {(['yesno', 'three', 'love', 'work', 'celtic'] as SpreadKey[]).map((k, i) => item(k, colors.technique.tarot, 60 * i))}

        <SectionTitle color={colors.technique.oracles}>{t('oracle.lenormand')}</SectionTitle>
        {(['len3', 'len9'] as SpreadKey[]).map((k, i) => item(k, colors.technique.oracles, 60 * i))}

        <SectionTitle color={colors.gold}>{`${t('oracle.iching')} · ${t('oracle.runes')}`}</SectionTitle>
        <RowCard title={t('oracle.spreads.iching')} subtitle={t('oracle.iching')} color={colors.gold} onPress={() => router.push('/oracle/iching')} right={!premium ? <LockIcon size={20} color={colors.textMuted} /> : null} />
        {(['rune1', 'rune3'] as SpreadKey[]).map((k, i) => item(k, colors.technique.humanDesign, 60 * i))}

        <SectionTitle>{t('oracle.history')}</SectionTitle>
        <RowCard title={t('oracle.history')} subtitle={history.length ? `${history.length}` : t('oracle.historyEmpty')} onPress={() => router.push('/oracle/history')} />
        <AppText variant="caption" muted center>{t('lib.disclaimer')}</AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md, paddingBottom: spacing.xxl },
  hero: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: spacing.sm },
});
