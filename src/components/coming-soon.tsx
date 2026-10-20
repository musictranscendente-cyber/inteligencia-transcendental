import type { ComponentType } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { radius, spacing, useTheme } from '@/theme';
import { AppText } from './app-text';
import { GlassCard } from './glass-card';
import type { IconProps } from './icons';
import { ScreenHeader } from './screen-header';

type Props = {
  title: string;
  kicker?: string;
  description: string;
  color: string;
  Icon: ComponentType<IconProps>;
};

/** Tela provisória das abas que ainda serão construídas nas próximas etapas. */
export function ComingSoon({ title, kicker, description, color, Icon }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.flex}>
      <ScreenHeader title={title} kicker={kicker} />
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <GlassCard accent={color} style={styles.card}>
            <View style={[styles.iconRing, { borderColor: color }]}>
              <Icon color={color} size={44} strokeWidth={1.1} />
            </View>
            <AppText center>{description}</AppText>
            <Badge color={color} label={t('common.comingSoon')} />
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  const { name } = useTheme();
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: name === 'dark' ? 'transparent' : `${color}22` }]}>
      <AppText variant="label" color={color}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.sm },
  card: { alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xl },
  iconRing: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 6 },
});
