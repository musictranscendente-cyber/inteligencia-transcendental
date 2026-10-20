import { StyleSheet, View, type ViewProps } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

/** Cartão translúcido com borda dourada fina, sobre o céu estrelado. */
export function GlassCard({ style, accent, ...rest }: ViewProps & { accent?: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surfaceGlass, borderColor: accent ?? colors.border },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 0,
  },
});
