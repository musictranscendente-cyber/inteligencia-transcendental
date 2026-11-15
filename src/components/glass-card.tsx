import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { radius, spacing, useTheme, withAlpha } from '@/theme';

/** Cartão translúcido com borda fina na cor da técnica e um brilho suave no canto superior. */
export function GlassCard({ style, accent, children, ...rest }: ViewProps & { accent?: string }) {
  const { colors, name } = useTheme();
  const glow = accent ? withAlpha(accent, name === 'dark' ? 0.13 : 0.1) : null;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surfaceGlass, borderColor: accent ? withAlpha(accent, 0.42) : colors.border },
        style,
      ]}
      {...rest}>
      {glow ? (
        <LinearGradient
          pointerEvents="none"
          colors={[glow, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.7, y: 0.7 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
    overflow: 'hidden',
  },
});
