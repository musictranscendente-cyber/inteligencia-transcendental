import * as Haptics from 'expo-haptics';
import { useEffect, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

/** Carta que vira com animação 3D. Controlada por `flipped`. */
export function FlipCard({ front, back, flipped, onFlip, width, height, label }: { front: ReactNode; back: ReactNode; flipped: boolean; onFlip?: () => void; width: number; height: number; label?: string }) {
  const reduce = useReducedMotion();
  const p = useSharedValue(flipped ? 1 : 0);
  useEffect(() => {
    p.set(withTiming(flipped ? 1 : 0, { duration: reduce ? 0 : 650 }));
    if (flipped && Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [flipped, p, reduce]);

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${interpolate(p.get(), [0, 1], [0, 180])}deg` }],
    opacity: p.get() < 0.5 ? 1 : 0,
  }));
  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${interpolate(p.get(), [0, 1], [-180, 0])}deg` }],
    opacity: p.get() >= 0.5 ? 1 : 0,
  }));

  return (
    <Pressable onPress={onFlip} disabled={!onFlip || flipped} accessibilityRole="button" accessibilityLabel={label} style={{ width, height }}>
      <View style={{ width, height }}>
        <Animated.View style={[StyleSheet.absoluteFill, backStyle]}>{back}</Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, frontStyle]}>{front}</Animated.View>
      </View>
    </Pressable>
  );
}
