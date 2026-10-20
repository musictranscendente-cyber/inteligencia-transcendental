import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { AnimalWheel, ElementPentagon } from '@/components/charts/misc-charts';
import { GlassCard } from '@/components/glass-card';
import { SectionTitle, Tag } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { ANIMAL_EMOJI, ANIMALS_TEXT, DAY_MASTER_TEXT, FIVE_ELEMENTS_TEXT } from '@/content/chinese';
import { useLang } from '@/content/types';
import { ANIMALS, BRANCH_ELEMENT, BRANCH_HANZI, BRANCHES, FIVE_ELEMENTS, STEM_HANZI, STEMS, stemElement, type Pillar } from '@/engines/chinese';
import { useReading } from '@/hooks/use-reading';
import { radius, spacing, useTheme } from '@/theme';

const ELEMENT_COLORS = { wood: '#7BC47F', fire: '#FF7A59', earth: '#D9B56A', metal: '#C9CED6', water: '#6B8BFF' } as const;

function PillarColumn({ label, pillar, lang, noHour }: { label: string; pillar: Pillar | null; lang: 'pt' | 'en' | 'es'; noHour: string }) {
  const { colors } = useTheme();
  if (!pillar) {
    return (
      <View style={[styles.pillar, { borderColor: colors.border }]}>
        <AppText variant="label" muted center>{label}</AppText>
        <AppText variant="caption" muted center>{noHour}</AppText>
      </View>
    );
  }
  const se = stemElement(pillar.stem);
  const be = BRANCH_ELEMENT[pillar.branch];
  return (
    <View style={[styles.pillar, { borderColor: colors.border }]}>
      <AppText variant="label" muted center>{label}</AppText>
      <AppText style={styles.hanzi} color={ELEMENT_COLORS[se]} center>{STEM_HANZI[pillar.stem]}</AppText>
      <AppText variant="caption" center>{STEMS[pillar.stem]}</AppText>
      <AppText variant="caption" muted center>{FIVE_ELEMENTS_TEXT[se][lang].name}</AppText>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <AppText style={styles.hanzi} color={ELEMENT_COLORS[be]} center>{BRANCH_HANZI[pillar.branch]}</AppText>
      <AppText variant="caption" center>{BRANCHES[pillar.branch]}</AppText>
      <AppText variant="caption" muted center>{ANIMALS_TEXT[ANIMALS[pillar.branch]][lang].name}</AppText>
    </View>
  );
}

export default function ChineseScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const r = useReading();
  if (!r) return null;
  const c = colors.technique.chinese;
  const s = r.chinese;
  const a = ANIMALS_TEXT[s.animal][lang];
  const el = FIVE_ELEMENTS_TEXT[s.element][lang];
  const w = Math.min(width - 4 * spacing.lg, 320);
  const pillarNames = t('cn.pillarNames', { returnObjects: true }) as string[];

  return (
    <Screen title={a.name} kicker={t('cn.yearOf', { animal: a.name, element: el.name })} accent={c}>
      <GlassCard accent={c} style={[styles.gap, styles.center]}>
        <AnimalWheel index={ANIMALS.indexOf(s.animal)} labels={ANIMALS.map((x) => ANIMALS_TEXT[x][lang].name)} hanzi={ANIMALS.map((x) => ANIMAL_EMOJI[x])} color={c} size={w} />
        <View style={styles.tags}>
          <Tag label={el.name} color={ELEMENT_COLORS[s.element]} />
          <Tag label={s.yang ? t('cn.yang') : t('cn.yin')} color={colors.gold} />
          <Tag label={String(s.year)} color={colors.textMuted} />
        </View>
        <AppText variant="subtitle" center>{a.summary}</AppText>
        <AppText>{a.text}</AppText>
        <AppText muted>{el.text}</AppText>
      </GlassCard>

      <PremiumGate>
        <View style={styles.gap}>
          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('cn.pillars')}</SectionTitle>
            <View style={styles.pillars}>
              <PillarColumn label={pillarNames[3]} pillar={r.bazi.hour} lang={lang} noHour={t('cn.noHour')} />
              <PillarColumn label={pillarNames[2]} pillar={r.bazi.day} lang={lang} noHour="" />
              <PillarColumn label={pillarNames[1]} pillar={r.bazi.month} lang={lang} noHour="" />
              <PillarColumn label={pillarNames[0]} pillar={r.bazi.year} lang={lang} noHour="" />
            </View>
            <SectionTitle color={c}>{t('cn.dayMaster')}</SectionTitle>
            <AppText>{DAY_MASTER_TEXT[r.bazi.dayMaster][lang]}</AppText>
          </GlassCard>

          <GlassCard style={[styles.gap, styles.center]}>
            <SectionTitle color={c}>{t('cn.balance')}</SectionTitle>
            <ElementPentagon
              size={w}
              values={FIVE_ELEMENTS.map((e) => r.bazi.elements[e])}
              labels={FIVE_ELEMENTS.map((e) => FIVE_ELEMENTS_TEXT[e][lang].name)}
              colorsList={FIVE_ELEMENTS.map((e) => ELEMENT_COLORS[e])}
            />
            {FIVE_ELEMENTS.map((e) => (
              <AppText key={e} variant="caption" muted={r.bazi.elements[e] === 0}>{`${FIVE_ELEMENTS_TEXT[e][lang].name}: ${FIVE_ELEMENTS_TEXT[e][lang].text}`}</AppText>
            ))}
          </GlassCard>
        </View>
      </PremiumGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  pillars: { flexDirection: 'row', gap: spacing.sm },
  pillar: { flex: 1, borderWidth: 1, borderRadius: radius.sm, paddingVertical: spacing.sm, gap: 2 },
  hanzi: { fontSize: 30, lineHeight: 40 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: spacing.xs },
});
