import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { ConvergenceDiagram } from '@/components/charts/misc-charts';
import { GlassCard } from '@/components/glass-card';
import { SectionTitle } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { ShareButton } from '@/components/ui/share-button';
import { TRAITS_TEXT } from '@/content/misc';
import { localSynthesis, SYNTHESIS_SECTIONS, type Synthesis } from '@/content/synthesis';
import { useLang } from '@/content/types';
import { firstName } from '@/engines/reading';
import type { Technique } from '@/engines/traits';
import { readingSummary } from '@/features/summary';
import { useReading } from '@/hooks/use-reading';
import { aiEnabled, aiSynthesis } from '@/services/ai';
import { synthesisStore } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

const TECHS: Technique[] = ['numerology', 'tarot', 'astrology', 'humanDesign', 'chinese'];

export default function SynthesisScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const r = useReading();
  const saved = synthesisStore.useValue();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  // Gerada uma vez e guardada; refeita quando o ano pessoal ou o idioma mudam.
  const local = r ? localSynthesis(r, lang, firstName(r.person.fullName)) : null;
  const valid = saved && r && saved.personalYear === r.personal.year && saved.lang === lang;
  const synthesis: Synthesis | null = valid ? saved : local;

  useEffect(() => {
    if (r && local && !valid) synthesisStore.set({ ...local, lang });
  }, [r, valid]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!r || !synthesis) return null;
  const c = colors.gold;
  const top = synthesis.convergences[0];
  const techLabels = TECHS.map((k) => t(`syn.techniques.${k}`));
  const techColors = [colors.technique.numerology, colors.technique.tarot, colors.technique.astrology, colors.technique.humanDesign, colors.technique.chinese];

  const generate = async () => {
    setBusy(true);
    setError(false);
    try {
      const res = await aiSynthesis({ lang, firstName: firstName(r.person.fullName), data: readingSummary(r) });
      synthesisStore.set({ ...synthesis, sections: { ...synthesis.sections, ...res.sections }, source: 'ai', createdAt: new Date().toISOString(), lang });
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const content = (
    <View style={styles.gap}>
      {SYNTHESIS_SECTIONS.map((k, i) => (
        <Animated.View key={k} entering={FadeInDown.delay(i * 80).duration(450)}>
          <GlassCard style={styles.gap}>
            <SectionTitle>{t(`syn.sections.${k}`)}</SectionTitle>
            <AppText>{synthesis.sections[k]}</AppText>
          </GlassCard>
        </Animated.View>
      ))}
      <AppText variant="caption" muted center>{synthesis.source === 'ai' ? t('syn.aiNote') : t('syn.localNote')}</AppText>
      {error ? <AppText variant="caption" color={colors.danger} center>{t('syn.aiError')}</AppText> : null}
      {aiEnabled() ? (
        busy ? (
          <View style={styles.busy}>
            <ActivityIndicator color={c} />
            <AppText muted>{t('syn.generating')}</AppText>
          </View>
        ) : (
          <Button variant="secondary" title={t('syn.regenerate')} onPress={generate} />
        )
      ) : null}
    </View>
  );

  return (
    <Screen title={t('syn.title')} accent={c} right={<ShareButton template="synthesis" />}>
      <GlassCard accent={c} style={[styles.gap, styles.center]}>
        <SectionTitle>{t('syn.convergence')}</SectionTitle>
        {top ? (
          <ConvergenceDiagram
            trait={TRAITS_TEXT[top.trait][lang].label}
            techniques={top.techniques.map((k) => t(`syn.techniques.${k}`))}
            labels={techLabels}
            colorsList={techColors}
            size={Math.min(width - 4 * spacing.lg, 320)}
          />
        ) : null}
        {synthesis.convergences.slice(0, 3).map((cv) => (
          <AppText key={cv.trait} variant="bodyStrong" center>
            {t('syn.convergenceLine', { count: cv.techniques.length, trait: TRAITS_TEXT[cv.trait][lang].label })}
          </AppText>
        ))}
      </GlassCard>
      <PremiumGate message={t('paywall.synthesisReady')} preview={<View style={styles.gap}>{SYNTHESIS_SECTIONS.slice(0, 2).map((k) => <GlassCard key={k}><AppText>{synthesis.sections[k]}</AppText></GlassCard>)}</View>}>
        {content}
      </PremiumGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  busy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
