import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { spacing, useTheme } from '@/theme';
import { AppText } from './app-text';
import { ProfileIcon } from './icons';

/** Cabeçalho das abas: título à esquerda, acesso ao perfil à direita. */
export function ScreenHeader({ title, kicker }: { title: string; kicker?: string }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.flex}>
        {kicker ? <AppText variant="label" gold>{kicker}</AppText> : null}
        <AppText variant="title">{title}</AppText>
      </View>
      <Pressable
        onPress={() => router.push('/profile')}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={t('a11y.openProfile')}
        style={[styles.profile, { borderColor: colors.border }]}>
        <ProfileIcon color={colors.gold} size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  flex: { flex: 1 },
  profile: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
