import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { fonts, radius, spacing, useTheme } from '@/theme';
import { AppText } from './app-text';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
};

export function Button({ title, variant = 'primary', disabled, onPress, style, ...rest }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const bg = variant === 'primary' ? colors.gold : 'transparent';
  const fg = variant === 'primary' ? colors.onGold : colors.gold;
  const border = variant === 'secondary' ? colors.gold : 'transparent';

  return (
    <Animated.View style={[animated, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPressIn={() => scale.set(withSpring(0.96, { damping: 15, stiffness: 300 }))}
        onPressOut={() => scale.set(withSpring(1, { damping: 15, stiffness: 300 }))}
        onPress={(e) => {
          Haptics.selectionAsync().catch(() => {});
          onPress?.(e);
        }}
        style={[styles.base, { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.4 : 1 }]}
        {...rest}>
        <AppText style={[styles.label, { color: fg }]}>{title}</AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 16, letterSpacing: 0.3 },
});
