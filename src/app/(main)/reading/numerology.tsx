import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { NineYearRing, NumberGrid, NumberPyramid, PinnacleTimeline } from '@/components/charts/numerology-charts';
import { GlassCard } from '@/components/glass-card';
import { Layered, NumberRing, SectionTitle, Tag } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { ShareButton } from '@/components/ui/share-button';
import { CHALLENGE_TEXT, KARMIC_DEBT_TEXT, KARMIC_LESSON_TEXT, NUMBERS, PERSONAL_YEAR } from '@/content/numbers';
import { useLang } from '@/content/types';
import { ageOn, currentIndex, reduce } from '@/engines/numerology';
import { useReading } from '@/hooks/use-reading';
import { spacing, useTheme } from '@/theme';

export default function NumerologyScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const r = useReading();
  if (!r) return null;
  const n = r.numerology;
  const c = colors.technique.numerology;
  const w = Math.min(width - 2 * spacing.lg - 2 * spacing.lg, 420);
  const age = ageOn(r.person.birthDate);
  const entry = (x: number) => (NUMBERS[x] ?? NUMBERS[reduce(x, false)])[lang];
  const destiny = entry(n.destiny);
  const py = r.personal.year;
  const cycleNames = t('num.cycleNames', { returnObjects: true }) as string[];
  const ageLabel = (from: number, to: number | null) => (to == null ? t('num.agesFrom', { from }) : t('num.ages', { from, to }));

  const core = [
    { key: 'expression', value: n.expression, hint: t('num.expressionHint') },
    { key: 'soul', value: n.soul, hint: t('num.soulHint') },
    { key: 'personality', value: n.personality, hint: t('num.personalityHint') },
    { key: 'mission', value: n.mission, hint: t('num.missionHint') },
    { key: 'birthday', value: n.birthday, hint: '' },
  ];

  return (
    <Screen title={t('map.techniques.numerology')} accent={c} kicker={`${t('num.destiny')} ${n.destiny}`} right={<ShareButton template="destiny" color={c} />}>
      <GlassCard accent={c} style={styles.gap}>
        <View style={styles.hero}>
          <NumberRing value={n.destiny} color={c} size={96} />
          <View style={styles.flex}>
            <AppText variant="label" color={c}>{t('num.destiny')}</AppText>
            <AppText variant="title">{destiny.title}</AppText>
            <AppText variant="caption" muted>{t('num.destinyHint')}</AppText>
          </View>
        </View>
        <Layered summary={destiny.summary} text={destiny.text} deep={destiny.deep} color={c} />
        <View style={styles.tags}>{destiny.keywords?.map((k) => <Tag key={k} label={k} color={c} />)}</View>
      </GlassCard>

      <PremiumGate>
        <View style={styles.gap}>
          <GlassCard style={[styles.gap, styles.center]}>
            <SectionTitle color={c}>{t('num.pyramid')}</SectionTitle>
            <NumberPyramid
              width={w}
              color={c}
              items={[
                { label: t('num.destiny'), value: n.destiny },
                { label: t('num.expression'), value: n.expression },
                { label: t('num.soul'), value: n.soul },
                { label: t('num.personality'), value: n.personality },
                { label: t('num.mission'), value: n.mission },
                { label: t('num.birthday'), value: n.birthday },
              ]}
            />
          </GlassCard>

          {core.map((item) => {
            const e = entry(item.value);
            return (
              <GlassCard key={item.key} style={styles.gap}>
                <View style={styles.hero}>
                  <NumberRing value={item.value} color={c} size={64} />
                  <View style={styles.flex}>
                    <AppText variant="label" color={c}>{t(`num.${item.key}`)}</AppText>
                    <AppText variant="subtitle">{e.title}</AppText>
                    {item.hint ? <AppText variant="caption" muted>{item.hint}</AppText> : null}
                  </View>
                </View>
                <Layered summary={e.summary} text={item.key === 'soul' ? e.love : item.key === 'mission' ? e.work : e.text} deep={`${e.gifts} ${e.challenges}`} color={c} />
              </GlassCard>
            );
          })}

          <GlassCard style={[styles.gap, styles.center]}>
            <SectionTitle color={c}>{t('num.grid')}</SectionTitle>
            <NumberGrid counts={n.nameGrid} color={c} size={Math.min(w, 280)} />
            <AppText variant="caption" muted center>{t('num.gridHint')}</AppText>
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('num.lessons')}</SectionTitle>
            {n.karmicLessons.length ? n.karmicLessons.map((l) => <AppText key={l}>{`${l} · ${KARMIC_LESSON_TEXT[l][lang]}`}</AppText>) : <AppText muted>{t('num.none')}</AppText>}
            <SectionTitle color={c}>{t('num.debts')}</SectionTitle>
            {n.karmicDebts.length ? n.karmicDebts.map((d) => <AppText key={d}>{KARMIC_DEBT_TEXT[d][lang]}</AppText>) : <AppText muted>{t('num.none')}</AppText>}
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('num.pinnacles')}</SectionTitle>
            <PinnacleTimeline pinnacles={n.pinnacles} age={age} color={c} width={w} hereLabel={t('num.youAreHere')} />
            {n.pinnacles.map((p, i) => {
              const active = i === currentIndex(n.pinnacles, age);
              return (
                <AppText key={i} color={active ? c : undefined} muted={!active}>
                  {`${p.number} · ${entry(p.number).title} — ${ageLabel(p.fromAge, p.toAge)}`}
                </AppText>
              );
            })}
          </GlassCard>

          <GlassCard style={styles.gap}>
            <SectionTitle color={c}>{t('num.cycles')}</SectionTitle>
            {n.cycles.map((cy, i) => (
              <AppText key={i} color={i === currentIndex(n.cycles, age) ? c : undefined}>
                {`${cycleNames[i]}: ${cy.number} · ${entry(cy.number).title} — ${ageLabel(cy.fromAge, cy.toAge)}`}
              </AppText>
            ))}
            <SectionTitle color={c}>{t('num.challenges')}</SectionTitle>
            {n.challenges.map((ch, i) => (
              <AppText key={i} muted={i !== 2}>{`${i === 2 ? `${t('num.challengeMain')} · ` : ''}${ch}: ${CHALLENGE_TEXT[ch][lang]}`}</AppText>
            ))}
          </GlassCard>

          <GlassCard style={[styles.gap, styles.center]}>
            <SectionTitle color={c}>{t('num.nineYear')}</SectionTitle>
            <NineYearRing current={py} color={c} />
            <AppText variant="subtitle" center>{PERSONAL_YEAR[py][lang].title}</AppText>
            <AppText center>{PERSONAL_YEAR[py][lang].text}</AppText>
          </GlassCard>
        </View>
      </PremiumGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
