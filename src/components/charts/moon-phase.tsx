import Svg, { Circle, Path } from 'react-native-svg';

import { useTheme } from '@/theme';

/**
 * Desenho da fase da Lua. `phase` em graus (0 nova, 180 cheia).
 * No hemisfério sul a Lua aparece espelhada (crescente iluminada à esquerda).
 */
export function MoonPhase({ phase, size = 72, southern = false }: { phase: number; size?: number; southern?: boolean }) {
  const { colors, name } = useTheme();
  const R = size / 2 - 2;
  const c = size / 2;
  const waxing = phase < 180;
  const theta = waxing ? phase : 360 - phase; // 0..180 de iluminação
  const rx = Math.abs(Math.cos((theta * Math.PI) / 180)) * R;
  const sweep = theta < 90 ? 0 : 1;
  const d = `M${c} ${c - R} A${R} ${R} 0 0 1 ${c} ${c + R} A${rx} ${R} 0 0 ${sweep} ${c} ${c - R}Z`;
  const mirror = waxing === southern; // espelha quando a parte iluminada deve ficar à esquerda
  const lit = name === 'dark' ? '#F5E6A8' : colors.gold;
  return (
    <Svg width={size} height={size} accessibilityElementsHidden>
      <Circle cx={c} cy={c} r={R} fill={name === 'dark' ? '#25223F' : '#E9E1D0'} stroke={colors.border} />
      {theta > 1 ? <Path d={d} fill={lit} transform={mirror ? `translate(${size} 0) scale(-1 1)` : undefined} /> : null}
    </Svg>
  );
}
