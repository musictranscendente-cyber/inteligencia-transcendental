import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '@/theme';
import { makeStars } from './starfield-data';

/** Versão estática do céu para a pré-visualização no navegador. */
export function StarField() {
  const { width, height } = useWindowDimensions();
  const { colors, name } = useTheme();
  const stars = useMemo(() => makeStars(width, height), [width, height]);
  const glow = name === 'dark' ? '#B48CFF' : '#D9B56A';
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="g" cx="85%" cy="12%" r="90%">
            <Stop offset="0" stopColor={glow} stopOpacity={0.16} />
            <Stop offset="1" stopColor={glow} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#g)" />
        {stars.map((s, i) => (
          <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill={colors.star} opacity={(name === 'dark' ? 0.9 : 0.35) * (0.4 + 0.3 * s.layer)} />
        ))}
      </Svg>
    </View>
  );
}
