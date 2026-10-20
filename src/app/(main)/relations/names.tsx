import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { GlassCard } from '@/components/glass-card';
import { NumberRing, Pill } from '@/components/ui/bits';
import { PremiumGate } from '@/components/ui/premium-gate';
import { Screen } from '@/components/ui/screen';
import { NUMBERS } from '@/content/numbers';
import { useLang } from '@/content/types';
import { numberPairScore } from '@/engines/compatibility';
import { reduce, textNumber } from '@/engines/numerology';
import { useReading } from '@/hooks/use-reading';
import { fonts, noOutline, radius, spacing, useTheme } from '@/theme';

type Kind = 'baby' | 'company' | 'house' | 'phone';

export default function NamesScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const r = useReading();
  const [kind, setKind] = useState<Kind>('baby');
  const [options, setOptions] = useState<string[]>(['', '']);
  const c = colors.technique.numerology;
  if (!r) return null;

  const results = options.map((o) => {
    const n = o.trim() ? textNumber(o) : 0;
    return { text: o, n, score: n ? numberPairScore(n, r.numerology.destiny) : 0 };
  });
  const best = Math.max(...results.map((x) => x.score));

  return (
    <Screen title={t('rel.names')} accent={c}>
      <AppText muted>{t('rel.namesHint')}</AppText>
      <View style={styles.pills}>
        {(['baby', 'company', 'house', 'phone'] as Kind[]).map((k) => <Pill key={k} label={t(`rel.nameType.${k}`)} active={kind === k} onPress={() => setKind(k)} color={c} />)}
      </View>
      <PremiumGate>
        <View style={styles.gap}>
          {options.map((o, i) => (
            <TextInput
              key={i}
              value={o}
              onChangeText={(v) => setOptions((arr) => arr.map((x, k) => (k === i ? v : x)))}
              placeholder={t('rel.option', { n: i + 1 })}
              placeholderTextColor={colors.textMuted}
              keyboardType={kind === 'phone' ? 'phone-pad' : 'default'}
              autoCapitalize={kind === 'phone' ? 'none' : 'words'}
              maxFontSizeMultiplier={1.6}
              style={[styles.input, noOutline, { color: colors.text, borderColor: c, backgroundColor: colors.surfaceGlass }]}
            />
          ))}
          {options.length < 6 ? <Button variant="ghost" title={t('rel.addOption')} onPress={() => setOptions((o) => [...o, ''])} /> : null}
          <View style={styles.compare}>
            {results.filter((x) => x.n).map((x, i) => {
              const e = (NUMBERS[x.n] ?? NUMBERS[reduce(x.n, false)])[lang];
              return (
                <GlassCard key={i} accent={x.score === best ? colors.gold : c} style={[styles.card, styles.gap]}>
                  <AppText variant="bodyStrong" numberOfLines={2}>{x.text}</AppText>
                  <NumberRing value={x.n} color={x.score === best ? colors.gold : c} size={64} />
                  <AppText variant="caption" gold>{e.title}</AppText>
                  <AppText variant="caption" muted>{e.summary}</AppText>
                  <AppText variant="caption">{t('rel.harmony', { score: x.score })}</AppText>
                </GlassCard>
              );
            })}
          </View>
        </View>
      </PremiumGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  input: { borderWidth: 1, borderRadius: radius.card, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: fonts.body, fontSize: 17 },
  compare: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: { width: '48%', alignItems: 'center', padding: spacing.md },
});
