import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { BackIcon } from '@/components/icons';
import { spacing, useTheme } from '@/theme';

type Props = {
  title: string;
  kicker?: string;
  accent?: string;
  right?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
};

/** Tela interna padrão: voltar, título com a cor da técnica e conteúdo rolável. */
export function Screen({ title, kicker, accent, right, children, scroll = true, contentStyle }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.flex, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('common.back')}>
          <BackIcon color={colors.text} />
        </Pressable>
        <View style={styles.flex}>
          {kicker ? <AppText variant="label" color={accent ?? colors.gold}>{kicker}</AppText> : null}
          <AppText variant="title" numberOfLines={2}>{title}</AppText>
        </View>
        {right}
      </View>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }, contentStyle]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  content: { padding: spacing.lg, gap: spacing.lg },
});
