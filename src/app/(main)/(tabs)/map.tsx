import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { SignGlyph } from '@/components/astro-glyphs';
import { Wings } from '@/components/charts/wings';
import { GlassCard } from '@/components/glass-card';
import { MapIcon, SparkIcon } from '@/components/icons';
import { ScreenHeader } from '@/components/screen-header';
import { TarotFace } from '@/components/tarot-face';
import { NumberRing } from '@/components/ui/bits';
import { SIGNS_TEXT } from '@/content/astrology';
import { ANIMAL_EMOJI, ANIMALS_TEXT } from '@/content/chinese';
import { HD_TYPES } from '@/content/humanDesign';
import { CHAKRA_COLORS, TRAITS_TEXT } from '@/content/misc';
import { NUMBERS } from '@/content/numbers';
import { joinList } from '@/content/synthesis';
import { MAJOR_ARCANA } from '@/content/tarot-major';
import { useLang } from '@/content/types';
import { pointOf } from '@/engines/astro/chart';
import { convergences } from '@/engines/traits';
import { useReading } from '@/hooks/use-reading';
import { radius, spacing, useTheme } from '@/theme';

function Tile({ title, phrase, color, href, art, delay }: { title: string; phrase: string; color: string; href: Href; art: ReactNode; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)} style={styles.tileWrap}>
      <Pressable onPress={() => router.push(href)} accessibilityRole="button" style={({ pressed }) => [styles.flex, { opacity: pressed ? 0.8 : 1 }]}>
        <GlassCard accent={color} style={styles.tile}>
          <View style={styles.art}>{art}</View>
          <AppText variant="label" color={color}>{title}</AppText>
          <AppText variant="caption" muted numberOfLines={3}>{phrase}</AppText>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

export default function MyMapScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const r = useReading();
  if (!r) return null;

  const tc = colors.technique;
  const destiny = NUMBERS[r.numerology.destiny][lang];
  const arcana = MAJOR_ARCANA[r.arcana][lang];
  const sun = pointOf(r.chart, 'sun')!;
  const moon = pointOf(r.chart, 'moon')!;
  const asc = pointOf(r.chart, 'asc');
  const conv = convergences(r).slice(0, 3);
  const animal = ANIMALS_TEXT[r.chinese.animal][lang];

  return (
    <View style={styles.flex}>
      <ScreenHeader title={t('map.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        {!r.chart.timeKnown ? <AppText variant="caption" muted>{t('map.noTime')}</AppText> : null}

        <Animated.View entering={FadeInDown.duration(500)}>
          <Pressable onPress={() => router.push('/reading/synthesis')} accessibilityRole="button">
            <GlassCard accent={colors.gold} style={styles.synth}>
              <View style={styles.synthRow}>
                <SparkIcon size={34} color={colors.gold} />
                <View style={styles.flex}>
                  <AppText variant="label" gold>{t('map.synthesis')}</AppText>
                  <AppText variant="subtitle">{joinList(conv.map((c) => TRAITS_TEXT[c.trait][lang].label), lang)}</AppText>
                </View>
              </View>
              <AppText muted>{t('map.synthesisHint')}</AppText>
              <View style={styles.dots}>
                {conv.map((c) => (
                  <AppText key={c.trait} variant="caption" gold>
                    {t('syn.convergenceLine', { count: c.techniques.length, trait: TRAITS_TEXT[c.trait][lang].label })}
                  </AppText>
                ))}
              </View>
            </GlassCard>
          </Pressable>
        </Animated.View>

        <View style={styles.grid}>
          <Tile delay={60} href="/reading/numerology" color={tc.numerology} title={t('map.techniques.numerology')} phrase={`${t('num.destiny')} ${r.numerology.destiny}: ${destiny.summary}`} art={<NumberRing value={r.numerology.destiny} color={tc.numerology} size={64} />} />
          <Tile delay={120} href="/reading/arcana" color={tc.tarot} title={t('map.techniques.arcana')} phrase={`${arcana.name}: ${arcana.summary}`} art={<TarotFace id={`M${r.arcana}`} width={48} color={tc.tarot} />} />
          <Tile delay={180} href="/reading/astrology" color={tc.astrology} title={t('map.techniques.astrology')} phrase={`☉ ${SIGNS_TEXT[sun.sign][lang].name} · ☽ ${SIGNS_TEXT[moon.sign][lang].name}${asc ? ` · AC ${SIGNS_TEXT[asc.sign][lang].name}` : ''}`} art={<SignGlyph sign={sun.sign} size={60} color={tc.astrology} />} />
          <Tile delay={240} href="/reading/human-design" color={tc.humanDesign} title={t('map.techniques.humanDesign')} phrase={r.humanDesign ? `${HD_TYPES[r.humanDesign.type][lang].name} ${r.humanDesign.profile.join('/')}: ${HD_TYPES[r.humanDesign.type][lang].summary}` : t('hd.noTime')} art={<MapIcon size={58} color={tc.humanDesign} strokeWidth={1} />} />
          <Tile delay={300} href="/reading/chinese" color={tc.chinese} title={t('map.techniques.chinese')} phrase={`${animal.name}: ${animal.summary}`} art={<AppText style={{ fontSize: 46, lineHeight: 60 }} color={tc.chinese}>{ANIMAL_EMOJI[r.chinese.animal]}</AppText>} />
          <Tile delay={360} href="/reading/angel" color={tc.angel} title={t('map.techniques.angel')} phrase={r.angel.name} art={<Wings width={110} color={tc.angel} />} />
          <Tile delay={420} href="/reading/chakras" color={CHAKRA_COLORS[3]} title={t('map.techniques.chakras')} phrase={t('chk.disclaimer')} art={<View style={styles.chakraDots}>{CHAKRA_COLORS.map((c) => <View key={c} style={[styles.chakraDot, { backgroundColor: c }]} />)}</View>} />
          <Tile delay={480} href="/reading/cartography" color={tc.astrology} title={t('map.techniques.cartography')} phrase={t('carto.hint').split('.')[0] + '.'} art={<MapIcon size={58} color={tc.astrology} strokeWidth={1} />} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.lg, paddingBottom: spacing.xxl },
  synth: { gap: spacing.sm },
  synthRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dots: { gap: 2, marginTop: spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  tileWrap: { width: '50%', padding: spacing.xs },
  tile: { gap: spacing.sm, minHeight: 200, padding: spacing.md },
  art: { height: 84, alignItems: 'center', justifyContent: 'center' },
  chakraDots: { gap: 4, alignItems: 'center' },
  chakraDot: { width: 10, height: 10, borderRadius: radius.pill },
});
