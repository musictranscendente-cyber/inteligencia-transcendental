import Svg, { G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { CENTERS, CHANNELS, GATE_CENTER, type CenterKey } from '@/engines/humanDesign';
import { useTheme } from '@/theme';

/** Posição e forma de cada centro (viewBox 300 × 430). */
const CENTER_POS: Record<CenterKey, [number, number]> = {
  head: [150, 42],
  ajna: [150, 108],
  throat: [150, 178],
  g: [150, 250],
  heart: [212, 276],
  spleen: [52, 322],
  solarPlexus: [248, 322],
  sacral: [150, 332],
  root: [150, 400],
};

function shape(c: CenterKey) {
  const [x, y] = CENTER_POS[c];
  switch (c) {
    case 'head':
      return `M${x} ${y - 26}L${x + 28} ${y + 20}H${x - 28}Z`;
    case 'ajna':
      return `M${x - 28} ${y - 20}H${x + 28}L${x} ${y + 26}Z`;
    case 'g':
      return `M${x} ${y - 30}L${x + 30} ${y}L${x} ${y + 30}L${x - 30} ${y}Z`;
    case 'heart':
      return `M${x} ${y - 16}L${x + 18} ${y + 14}H${x - 18}Z`;
    case 'spleen':
      return `M${x - 22} ${y - 30}L${x + 26} ${y}L${x - 22} ${y + 30}Z`;
    case 'solarPlexus':
      return `M${x + 22} ${y - 30}L${x - 26} ${y}L${x + 22} ${y + 30}Z`;
    default: {
      const s = c === 'throat' ? 26 : 28;
      return `M${x - s} ${y - s}H${x + s}V${y + s}H${x - s}Z`;
    }
  }
}

type Props = {
  defined: CenterKey[];
  gates: number[];
  channels: [number, number][];
  color: string;
  width?: number;
  selected?: CenterKey | null;
  onSelect?: (c: CenterKey) => void;
  /** Canais formados só pela combinação de duas pessoas. */
  highlight?: [number, number][];
  highlightColor?: string;
};

export function Bodygraph({ defined, gates, channels, color, width = 300, selected, onSelect, highlight = [], highlightColor }: Props) {
  const { colors } = useTheme();
  const gateSet = new Set(gates);
  const isActive = (ch: [number, number]) => channels.some(([a, b]) => a === ch[0] && b === ch[1]);
  const isHighlight = (ch: [number, number]) => highlight.some(([a, b]) => a === ch[0] && b === ch[1]);
  const pairCount = new Map<string, number>();

  return (
    <Svg width={width} height={(width * 430) / 300} viewBox="0 0 300 430">
      {CHANNELS.map((ch) => {
        const ca = GATE_CENTER[ch[0]];
        const cb = GATE_CENTER[ch[1]];
        const pairKey = [ca, cb].sort().join('-');
        const idx = pairCount.get(pairKey) ?? 0;
        pairCount.set(pairKey, idx + 1);
        const [x1, y1] = CENTER_POS[ca];
        const [x2, y2] = CENTER_POS[cb];
        const len = Math.hypot(x2 - x1, y2 - y1);
        const off = (idx - 1) * 7;
        const ox = (-(y2 - y1) / len) * off;
        const oy = ((x2 - x1) / len) * off;
        const active = isActive(ch);
        const hl = isHighlight(ch);
        const half = (g: number, from: [number, number], to: [number, number]) => {
          const on = gateSet.has(g);
          return (
            <Line
              x1={from[0] + ox}
              y1={from[1] + oy}
              x2={(from[0] + to[0]) / 2 + ox}
              y2={(from[1] + to[1]) / 2 + oy}
              stroke={hl ? highlightColor : on ? color : colors.border}
              strokeWidth={active || hl ? 4 : on ? 3 : 2}
              strokeOpacity={on || hl ? 1 : 0.6}
              strokeLinecap="round"
            />
          );
        };
        return (
          <G key={`${ch[0]}-${ch[1]}`}>
            {half(ch[0], [x1, y1], [x2, y2])}
            {half(ch[1], [x2, y2], [x1, y1])}
          </G>
        );
      })}
      {CENTERS.map((c) => {
        const on = defined.includes(c);
        const [x, y] = CENTER_POS[c];
        return (
          <G key={c} onPress={() => onSelect?.(c)}>
            <Path d={shape(c)} fill={on ? color : colors.surface} fillOpacity={on ? 0.85 : 1} stroke={selected === c ? colors.gold : on ? color : colors.textMuted} strokeWidth={selected === c ? 2.5 : 1.2} />
            <Rect x={x - 1} y={y - 1} width={2} height={2} fill="transparent" />
          </G>
        );
      })}
      {gates.map((g) => {
        const c = GATE_CENTER[g];
        const [x, y] = CENTER_POS[c];
        const i = gates.filter((x2) => GATE_CENTER[x2] === c).indexOf(g);
        const total = gates.filter((x2) => GATE_CENTER[x2] === c).length;
        const a = (i / Math.max(total, 1)) * Math.PI * 2;
        return (
          <SvgText key={g} x={x + Math.cos(a) * 14} y={y + Math.sin(a) * 12 + 3} fontSize={8} fill={defined.includes(c) ? colors.onGold : colors.text} textAnchor="middle" fontWeight="600">
            {g}
          </SvgText>
        );
      })}
    </Svg>
  );
}
