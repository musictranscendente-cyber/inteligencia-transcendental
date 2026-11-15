import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { GlassCard } from '@/components/glass-card';
import { ChevronIcon, ShareIcon } from '@/components/icons';
import { fonts, spacing, withAlpha } from '@/theme';

/** Botão redondo de compartilhar, usado nos cards e nas telas de detalhe. */
export function ShareChip({ template, color }: { template: string; color: string }) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/share', params: { template } })}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={t('common.share')}
      style={({ pressed }) => [styles.chip, { borderColor: withAlpha(color, 0.4), backgroundColor: withAlpha(color, pressed ? 0.24 : 0.1) }]}>
      <ShareIcon size={18} color={color} />
    </Pressable>
  );
}

type Props = {
  title: string;
  color: string;
  /** Modelo do card de compartilhamento. */
  share?: string;
  onPress: () => void;
  /** Texto do rodapé ("Ver mais"); some quando vazio. */
  more?: string | null;
  children: ReactNode;
  style?: ViewStyle;
  center?: boolean;
};

/** Cartão da aba Hoje: título, botão de compartilhar e toque para abrir a explicação completa. */
export function TodayCard({ title, color, share, onPress, more, children, style, center }: Props) {
  const { t } = useTranslation();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityHint={t('today.tapForMore')} style={({ pressed }) => [style, { opacity: pressed ? 0.85 : 1 }]}>
      <GlassCard accent={color} style={[styles.card, center && styles.center]}>
        {center ? (
          <AppText variant="label" color={color} center>{title}</AppText>
        ) : (
          <View style={styles.head}>
            <AppText variant="label" color={color} style={styles.flex} numberOfLines={1}>{title}</AppText>
            {share ? <ShareChip template={share} color={color} /> : null}
          </View>
        )}
        {children}
        <View style={[styles.foot, center && styles.footCenter]}>
          {center && share ? <ShareChip template={share} color={color} /> : null}
          {more !== null ? (
            <View style={styles.more}>
              <AppText variant="caption" color={color} style={styles.moreText}>{more ?? t('today.seeMore')}</AppText>
              <ChevronIcon size={14} color={color} strokeWidth={2} />
            </View>
          ) : null}
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: spacing.md, flexGrow: 1 },
  center: { alignItems: 'center', padding: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'stretch' },
  chip: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.md, alignSelf: 'stretch', marginTop: 'auto' },
  footCenter: { justifyContent: 'space-between' },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  moreText: { fontFamily: fonts.bodySemiBold },
});
