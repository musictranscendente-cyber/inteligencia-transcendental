import { View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { AppText } from '@/components/app-text';
import type { Pinnacle } from '@/engines/numerology';
import { fonts, spacing, useTheme } from '@/theme';

/** Grade de Pitágoras (3 6 9 / 2 5 8 / 1 4 7): bolinhas = quantas letras valem cada número. */
export function NumberGrid({ counts, color, size = 240 }: { counts: number[]; color: string; size?: number }) {
  const { colors } = useTheme();
  const layout = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];
  const cell = size / 3;
  return (
    <Svg width={size} height={size} accessibilityLabel={layout.flat().map((n) => `${n}: ${counts[n]}`).join(', ')}>
      {layout.map((row, r) =>
        row.map((n, c) => {
          const x = c * cell;
          const y = r * cell;
          const k = counts[n];
          const dots = Math.min(k, 9);
          return (
            <G key={n}>
              <Rect x={x + 3} y={y + 3} width={cell - 6} height={cell - 6} rx={12} fill={k ? `${color}14` : 'transparent'} stroke={k ? color : colors.border} strokeWidth={k ? 1 : 0.8} strokeDasharray={k ? undefined : [3, 3]} />
              <SvgText x={x + 14} y={y + 24} fill={k ? color : colors.textMuted} fontSize={15} fontFamily={fonts.title}>{n}</SvgText>
              {Array.from({ length: dots }, (_, i) => (
                <Circle key={i} cx={x + cell / 2 + ((i % 3) - 1) * 14} cy={y + cell / 2 + 6 + (Math.floor(i / 3) - 0.5) * 14} r={4.5} fill={color} />
              ))}
            </G>
          );
        })
      )}
    </Svg>
  );
}

/** Pirâmide dos números principais: Destino no topo, Expressão e Motivação no meio, Impressão e Missão na base. */
export function NumberPyramid({ items, color, width = 300 }: { items: { label: string; value: number }[]; color: string; width?: number }) {
  const { colors } = useTheme();
  const h = width * 0.8;
  const pos: [number, number][] = [
    [width / 2, h * 0.2],
    [width * 0.32, h * 0.52],
    [width * 0.68, h * 0.52],
    [width * 0.18, h * 0.84],
    [width * 0.5, h * 0.84],
    [width * 0.82, h * 0.84],
  ];
  return (
    <View>
      <Svg width={width} height={h}>
        <Path d={`M${width / 2} ${h * 0.04}L${width * 0.04} ${h * 0.98}H${width * 0.96}Z`} stroke={color} strokeOpacity={0.35} fill="none" />
        <Line x1={width * 0.22} y1={h * 0.37} x2={width * 0.78} y2={h * 0.37} stroke={color} strokeOpacity={0.2} />
        <Line x1={width * 0.12} y1={h * 0.68} x2={width * 0.88} y2={h * 0.68} stroke={color} strokeOpacity={0.2} />
        {items.slice(0, 6).map((it, i) => (
          <G key={it.label}>
            <Circle cx={pos[i][0]} cy={pos[i][1]} r={i === 0 ? 26 : 21} fill={colors.surface} stroke={color} strokeWidth={i === 0 ? 1.6 : 1} />
            <SvgText x={pos[i][0]} y={pos[i][1] + (i === 0 ? 8 : 7)} fill={color} fontSize={i === 0 ? 24 : 19} textAnchor="middle" fontFamily={fonts.title}>{it.value}</SvgText>
          </G>
        ))}
      </Svg>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' }}>
        {items.slice(0, 6).map((it) => (
          <AppText key={it.label} variant="caption" muted>{`${it.label} ${it.value}`}</AppText>
        ))}
      </View>
    </View>
  );
}

/** Linha do tempo dos pináculos com o "você está aqui". */
export function PinnacleTimeline({ pinnacles, age, color, width = 320, hereLabel }: { pinnacles: Pinnacle[]; age: number; color: string; width?: number; hereLabel: string }) {
  const { colors } = useTheme();
  const maxAge = 90;
  const x = (a: number) => 10 + (Math.min(a, maxAge) / maxAge) * (width - 20);
  return (
    <Svg width={width} height={96}>
      <Line x1={10} y1={50} x2={width - 10} y2={50} stroke={colors.border} strokeWidth={2} />
      {pinnacles.map((p, i) => {
        const x1 = x(p.fromAge);
        const x2 = x(p.toAge ?? maxAge);
        const active = age >= p.fromAge && (p.toAge == null || age <= p.toAge);
        return (
          <G key={i}>
            <Line x1={x1 + 2} y1={50} x2={x2 - 2} y2={50} stroke={color} strokeOpacity={active ? 1 : 0.4} strokeWidth={active ? 6 : 3} strokeLinecap="round" />
            <SvgText x={(x1 + x2) / 2} y={38} fill={color} fontSize={18} textAnchor="middle" fontFamily={fonts.title}>{p.number}</SvgText>
            <SvgText x={x1} y={70} fill={colors.textMuted} fontSize={10} textAnchor="middle">{p.fromAge}</SvgText>
          </G>
        );
      })}
      <Circle cx={x(age)} cy={50} r={6} fill={colors.gold} />
      <SvgText x={x(age)} y={88} fill={colors.gold} fontSize={10} textAnchor="middle">{hereLabel}</SvgText>
    </Svg>
  );
}

/** Anel do ciclo de 9 anos com o ano atual destacado. */
export function NineYearRing({ current, color, size = 200 }: { current: number; color: string; size?: number }) {
  const { colors } = useTheme();
  const c = size / 2;
  const R = size / 2 - 22;
  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={R} stroke={colors.border} fill="none" />
      {Array.from({ length: 9 }, (_, i) => {
        const n = i + 1;
        const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
        const x = c + R * Math.cos(a);
        const y = c + R * Math.sin(a);
        const active = n === current;
        return (
          <G key={n}>
            <Circle cx={x} cy={y} r={active ? 17 : 12} fill={active ? color : colors.surface} stroke={color} strokeOpacity={active ? 1 : 0.5} />
            <SvgText x={x} y={y + 5} fill={active ? colors.onGold : color} fontSize={active ? 16 : 13} textAnchor="middle" fontFamily={fonts.title}>{n}</SvgText>
          </G>
        );
      })}
      <SvgText x={c} y={c + 8} fill={color} fontSize={28} textAnchor="middle" fontFamily={fonts.title}>{current}</SvgText>
    </Svg>
  );
}
