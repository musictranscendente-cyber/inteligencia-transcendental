import {
  Canvas,
  Circle,
  Group,
  RadialGradient,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';
import { makeStars } from './starfield-data';

/** Fundo de céu estrelado: três camadas de estrelas que cintilam fora de fase. */
export function StarField() {
  const { width, height } = useWindowDimensions();
  const { colors, name } = useTheme();
  const reduceMotion = useReducedMotion();
  const stars = useMemo(() => makeStars(width, height), [width, height]);
  const layers = useMemo(() => [0, 1, 2].map((l) => stars.filter((s) => s.layer === l)), [stars]);

  const phase = useSharedValue(0.5);
  useEffect(() => {
    if (reduceMotion) return;
    phase.set(withRepeat(withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [phase, reduceMotion]);

  const base = name === 'dark' ? 0.9 : 0.35;
  const o0 = useDerivedValue(() => base * (0.35 + 0.65 * phase.get()));
  const o1 = useDerivedValue(() => base * (1 - 0.6 * phase.get()));
  const o2 = useDerivedValue(() => base * (0.55 + 0.45 * Math.sin(phase.get() * Math.PI)));
  const opacities = [o0, o1, o2];

  const glow = name === 'dark' ? ['rgba(180,140,255,0.16)', 'rgba(180,140,255,0)'] : ['rgba(217,181,106,0.18)', 'rgba(217,181,106,0)'];
  const glow2 = name === 'dark' ? ['rgba(217,181,106,0.10)', 'rgba(217,181,106,0)'] : ['rgba(127,179,255,0.10)', 'rgba(127,179,255,0)'];

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect x={0} y={0} width={width} height={height} color={colors.background} />
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient c={vec(width * 0.85, height * 0.12)} r={width * 0.9} colors={glow} />
      </Rect>
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient c={vec(width * 0.1, height * 0.85)} r={width * 0.8} colors={glow2} />
      </Rect>
      {layers.map((layer, i) => (
        <Group key={i} opacity={opacities[i]}>
          {layer.map((s, j) => (
            <Circle key={j} cx={s.x} cy={s.y} r={s.r} color={colors.star} />
          ))}
        </Group>
      ))}
    </Canvas>
  );
}
