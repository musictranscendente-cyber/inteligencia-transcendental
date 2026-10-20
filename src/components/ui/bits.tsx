import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { GlassCard } from '@/components/glass-card';
import { fonts, radius, spacing, useTheme } from '@/theme';

/** Título de seção com cor opcional. */
export function SectionTitle({ children, color }: { children: string; color?: string }) {
  const { colors } = useTheme();
  return <AppText variant="label" color={color ?? colors.gold}>{children}</AppText>;
}

export function Tag({ label, color }: { label: string; color?: string }) {
  const { colors } = useTheme();
  const c = color ?? colors.gold;
  return (
    <View style={[styles.tag, { borderColor: c }]}>
      <AppText variant="caption" color={c}>{label}</AppText>
    </View>
  );
}

/** Texto em três camadas: resumo → parágrafo → aprofundamento ("ler mais"). */
export function Layered({ summary, text, deep, color }: { summary?: string; text: string; deep?: string; color?: string }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.layered}>
      {summary ? <AppText variant="subtitle" color={color}>{summary}</AppText> : null}
      <AppText>{text}</AppText>
      {deep ? (
        open ? (
          <Animated.View entering={FadeIn.duration(400)}>
            <AppText muted>{deep}</AppText>
          </Animated.View>
        ) : (
          <Pressable onPress={() => setOpen(true)} accessibilityRole="button" hitSlop={8}>
            <AppText variant="bodyStrong" color={color ?? colors.gold}>{t('common.readMore')}</AppText>
          </Pressable>
        )
      ) : null}
    </View>
  );
}

/** Nota de 1 a 5 em mini-barras. */
export function ScoreBars({ label, value, color }: { label: string; value: number; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.score} accessible accessibilityLabel={`${label}: ${value}/5`}>
      <AppText variant="caption" muted style={styles.scoreLabel}>{label}</AppText>
      <View style={styles.bars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[styles.bar, { height: 6 + i * 3, backgroundColor: i <= value ? color : colors.border }]} />
        ))}
      </View>
    </View>
  );
}

/** Número que "conta" até o valor final, dentro de um anel. */
export function NumberRing({ value, label, color, size = 84 }: { value: number; label?: string; color: string; size?: number }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) return setShown(value);
    let i = 0;
    const steps = Math.min(value, 12);
    const id = setInterval(() => {
      i++;
      setShown(i >= steps ? value : Math.round((value * i) / steps));
      if (i >= steps) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [value, reduce]);
  return (
    <View style={styles.ring} accessible accessibilityLabel={`${label ?? ''} ${value}`}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle cx={size / 2} cy={size / 2} r={size / 2 - 2} stroke={color} strokeWidth={1.2} fill="none" />
          <Circle cx={size / 2} cy={size / 2} r={size / 2 - 7} stroke={color} strokeOpacity={0.35} strokeWidth={0.8} fill="none" />
        </Svg>
        <AppText style={{ fontFamily: fonts.title, fontSize: size * 0.42, lineHeight: size * 0.5, fontVariant: ['lining-nums'] }} color={color}>
          {shown}
        </AppText>
      </View>
      {label ? <AppText variant="caption" muted center style={{ maxWidth: size + 24 }}>{label}</AppText> : null}
    </View>
  );
}

/** Cartão clicável de lista. */
export function RowCard({ title, subtitle, color, onPress, right, style }: { title: string; subtitle?: string; color?: string; onPress?: () => void; right?: ReactNode; style?: ViewStyle }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }, style]}>
      <GlassCard accent={color} style={styles.row}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="bodyStrong">{title}</AppText>
          {subtitle ? <AppText variant="caption" muted>{subtitle}</AppText> : null}
        </View>
        {right}
      </GlassCard>
    </Pressable>
  );
}

export function Pill({ label, active, onPress, color }: { label: string; active: boolean; onPress: () => void; color?: string }) {
  const { colors } = useTheme();
  const c = color ?? colors.gold;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.pill, { borderColor: active ? c : colors.border, backgroundColor: active ? `${c}26` : 'transparent' }]}>
      <AppText variant="caption" color={active ? c : colors.textMuted}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  layered: { gap: spacing.sm },
  score: { flex: 1, alignItems: 'center', gap: 6 },
  scoreLabel: { textAlign: 'center' },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 22 },
  bar: { width: 6, borderRadius: 2 },
  ring: { alignItems: 'center', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  pill: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7 },
});
