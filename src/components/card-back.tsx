import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme';

/** Verso das cartas do app: moldura dupla dourada, sol central e luas nos cantos. */
export function CardBack({ width = 96, accent }: { width?: number; accent?: string }) {
  const { colors } = useTheme();
  const gold = accent ?? colors.gold;
  const height = width * 1.6;
  return (
    <Svg width={width} height={height} viewBox="0 0 100 160">
      <Rect x={1} y={1} width={98} height={158} rx={10} fill={colors.surface} stroke={gold} strokeWidth={1.2} />
      <Rect x={7} y={7} width={86} height={146} rx={6} fill="none" stroke={gold} strokeWidth={0.6} strokeOpacity={0.7} />
      <G stroke={gold} strokeWidth={0.8} fill="none" strokeLinecap="round">
        <Circle cx={50} cy={80} r={16} />
        <Circle cx={50} cy={80} r={24} strokeOpacity={0.5} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          const r1 = 18.5;
          const r2 = i % 3 === 0 ? 30 : 26;
          return (
            <Path
              key={i}
              d={`M${50 + r1 * Math.cos(a)} ${80 + r1 * Math.sin(a)}L${50 + r2 * Math.cos(a)} ${80 + r2 * Math.sin(a)}`}
            />
          );
        })}
        <Path d="M50 70c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10z" fill={gold} fillOpacity={0.25} />
        <Path d="M18 20a6 6 0 1 0 6 8 5 5 0 0 1-6-8z" />
        <Path d="M82 140a6 6 0 1 1-6-8 5 5 0 0 0 6 8z" />
        <Path d="M50 18v8M46 22h8M50 134v8M46 138h8" strokeOpacity={0.7} />
      </G>
    </Svg>
  );
}
