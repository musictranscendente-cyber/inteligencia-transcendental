import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { CHAKRA_COLORS } from '@/content/misc';
import type { CartoLine } from '@/engines/astro/cartography';
import { WORLD_LAND_PATH } from '@/data/world-land';
import { fonts, useTheme } from '@/theme';

/** Radar de 5 eixos (0–100). */
export function Radar({ values, labels, color, size = 260, compare }: { values: number[]; labels: string[]; color: string; size?: number; compare?: { values: number[]; color: string } }) {
  const { colors } = useTheme();
  const c = size / 2;
  const R = size / 2 - 40;
  const n = values.length;
  const pt = (i: number, v: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [c + (R * v * Math.cos(a)) / 100, c + (R * v * Math.sin(a)) / 100];
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(',')).join(' ');
  return (
    <Svg width={size} height={size}>
      {[25, 50, 75, 100].map((r) => (
        <Polygon key={r} points={poly(Array(n).fill(r))} fill="none" stroke={colors.border} />
      ))}
      {values.map((_, i) => {
        const [x, y] = pt(i, 100);
        const [lx, ly] = pt(i, 122);
        return (
          <G key={i}>
            <Line x1={c} y1={c} x2={x} y2={y} stroke={colors.border} />
            <SvgText x={lx} y={ly + 4} fontSize={11} fill={colors.text} textAnchor="middle">{labels[i]}</SvgText>
          </G>
        );
      })}
      {compare ? <Polygon points={poly(compare.values)} fill={compare.color} fillOpacity={0.15} stroke={compare.color} strokeWidth={1.2} /> : null}
      <Polygon points={poly(values)} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.8} />
      {values.map((v, i) => {
        const [x, y] = pt(i, v);
        return <Circle key={i} cx={x} cy={y} r={3.5} fill={color} />;
      })}
    </Svg>
  );
}

/** Jornada do Louco: os 22 arcanos num caminho serpenteante, com a posição da pessoa. */
export function FoolJourney({ highlight, secondary, color, width = 320, names }: { highlight: number; secondary?: number; color: string; width?: number; names?: string[] }) {
  const { colors } = useTheme();
  const cols = 6;
  const rowH = 64;
  const rows = Math.ceil(22 / cols);
  const pos = (i: number): [number, number] => {
    const r = Math.floor(i / cols);
    const k = i % cols;
    const col = r % 2 === 0 ? k : cols - 1 - k;
    return [24 + (col * (width - 48)) / (cols - 1), 30 + r * rowH];
  };
  const d = Array.from({ length: 22 }, (_, i) => pos(i)).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
  return (
    <Svg width={width} height={rows * rowH + 20}>
      <Path d={d} stroke={color} strokeOpacity={0.35} strokeWidth={2} fill="none" strokeDasharray={[4, 4]} />
      {Array.from({ length: 22 }, (_, i) => {
        const [x, y] = pos(i);
        const main = i === highlight;
        const sec = i === secondary;
        return (
          <G key={i}>
            <Circle cx={x} cy={y} r={main ? 16 : sec ? 13 : 10} fill={main ? color : colors.surface} stroke={sec ? colors.gold : color} strokeWidth={sec ? 2 : 1} />
            <SvgText x={x} y={y + 4} fontSize={main ? 13 : 10} fill={main ? colors.onGold : color} textAnchor="middle" fontFamily={fonts.title}>{i}</SvgText>
            {main && names ? <SvgText x={x} y={y + 30} fontSize={10} fill={colors.text} textAnchor="middle">{names[i]}</SvgText> : null}
          </G>
        );
      })}
    </Svg>
  );
}

/** Roda dos 12 animais chineses. */
export function AnimalWheel({ index, labels, hanzi, color, size = 260 }: { index: number; labels: string[]; hanzi: string[]; color: string; size?: number }) {
  const { colors } = useTheme();
  const c = size / 2;
  const R = size / 2 - 6;
  const r = R - 52;
  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={R} stroke={color} strokeOpacity={0.6} fill="none" />
      <Circle cx={c} cy={c} r={r} stroke={color} strokeOpacity={0.4} fill="none" />
      {labels.map((l, i) => {
        const a0 = ((i - 0.5) / 12) * Math.PI * 2 - Math.PI / 2;
        const am = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const active = i === index;
        const x = c + ((R + r) / 2) * Math.cos(am);
        const y = c + ((R + r) / 2) * Math.sin(am);
        return (
          <G key={l}>
            <Line x1={c + r * Math.cos(a0)} y1={c + r * Math.sin(a0)} x2={c + R * Math.cos(a0)} y2={c + R * Math.sin(a0)} stroke={color} strokeOpacity={0.4} />
            {active ? <Circle cx={x} cy={y} r={22} fill={color} /> : null}
            <SvgText x={x} y={y + 2} fontSize={active ? 18 : 15} fill={active ? colors.onGold : colors.text} textAnchor="middle">{hanzi[i]}</SvgText>
            <SvgText x={x} y={y + 14} fontSize={7} fill={active ? colors.onGold : colors.textMuted} textAnchor="middle">{l}</SvgText>
          </G>
        );
      })}
      <SvgText x={c} y={c + 14} fontSize={42} fill={color} textAnchor="middle">{hanzi[index]}</SvgText>
    </Svg>
  );
}

/** Pentágono dos cinco elementos com barras radiais. */
export function ElementPentagon({ values, labels, colorsList, size = 240 }: { values: number[]; labels: string[]; colorsList: string[]; size?: number }) {
  const { colors } = useTheme();
  const c = size / 2;
  const R = size / 2 - 34;
  const max = Math.max(...values, 1);
  const pt = (i: number, r: number) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  };
  return (
    <Svg width={size} height={size}>
      <Polygon points={[0, 1, 2, 3, 4].map((i) => pt(i, R).join(',')).join(' ')} fill="none" stroke={colors.border} />
      {values.map((v, i) => {
        const [x, y] = pt(i, R);
        const [vx, vy] = pt(i, (R * v) / max);
        const [lx, ly] = pt(i, R + 20);
        return (
          <G key={i}>
            <Line x1={c} y1={c} x2={x} y2={y} stroke={colors.border} />
            <Line x1={c} y1={c} x2={vx} y2={vy} stroke={colorsList[i]} strokeWidth={8} strokeLinecap="round" />
            <SvgText x={lx} y={ly + 4} fontSize={11} fill={colors.text} textAnchor="middle">{`${labels[i]} ${v}`}</SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

/** Silhueta meditando com os 7 chakras; o chakra em foco brilha. */
export function ChakraFigure({ focus, support, size = 220 }: { focus: number; support: number; size?: number }) {
  const { colors } = useTheme();
  const ys = [196, 176, 150, 124, 100, 70, 46];
  return (
    <Svg width={size} height={size * 1.05} viewBox="0 0 200 210">
      <G stroke={colors.gold} strokeOpacity={0.6} strokeWidth={1.2} fill="none" strokeLinecap="round">
        <Path d="M100 30a16 16 0 1 0 0.01 0" />
        <Path d="M100 62c-20 0-30 10-32 40-2 26 2 52 6 66M100 62c20 0 30 10 32 40 2 26-2 52-6 66" />
        <Path d="M68 112c-14 18-18 34-4 44M132 112c14 18 18 34 4 44" />
        <Path d="M40 196c20-20 50-24 60-24s40 4 60 24c-30 8-90 8-120 0z" />
      </G>
      {ys.map((y, i) => {
        const on = i === focus;
        const sup = i === support;
        return (
          <G key={i}>
            {on ? <Circle cx={100} cy={y} r={16} fill={CHAKRA_COLORS[i]} fillOpacity={0.25} /> : null}
            <Circle cx={100} cy={y} r={on ? 9 : 6} fill={CHAKRA_COLORS[i]} fillOpacity={on || sup ? 1 : 0.45} stroke={sup ? colors.gold : 'none'} strokeWidth={2} />
          </G>
        );
      })}
    </Svg>
  );
}

const LINE_DASH = { mc: undefined, ic: [6, 4], asc: [2, 3], dsc: [8, 3, 2, 3] } as const;

/** Mapa-múndi equiretangular com as linhas da astrocartografia. */
export function WorldMap({ lines, colorsByPlanet, width = 340, birth }: { lines: CartoLine[]; colorsByPlanet: Record<string, string>; width?: number; birth?: { lat: number; lon: number } }) {
  const { colors } = useTheme();
  const h = width / 2;
  const toPts = (pts: [number, number][]) => {
    // Quebra a linha quando ela atravessa o meridiano 180°.
    const segs: string[] = [];
    let cur = '';
    let prev: number | null = null;
    for (const [lon, lat] of pts) {
      const x = lon + 180;
      const y = 90 - lat;
      if (prev != null && Math.abs(x - prev) > 180) {
        segs.push(cur);
        cur = '';
      }
      cur += `${cur ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
      prev = x;
    }
    segs.push(cur);
    return segs.join('');
  };
  return (
    <Svg width={width} height={h} viewBox="0 0 360 180">
      <Rect x={0} y={0} width={360} height={180} fill={colors.surface} />
      <Path d={WORLD_LAND_PATH} fill={colors.gold} fillOpacity={0.14} stroke={colors.gold} strokeOpacity={0.4} strokeWidth={0.3} />
      {lines.map((l, i) => (
        <Path key={i} d={toPts(l.points)} stroke={colorsByPlanet[l.planet]} strokeWidth={0.9} fill="none" strokeDasharray={LINE_DASH[l.kind] as number[] | undefined} />
      ))}
      {birth ? <Circle cx={birth.lon + 180} cy={90 - birth.lat} r={2.4} fill={colors.text} stroke={colors.background} strokeWidth={0.6} /> : null}
    </Svg>
  );
}

/** Calendário de calor do mês (valores 1–5). */
export function HeatCalendar({ days, firstWeekday, color, width = 320, weekdays, today }: { days: number[]; firstWeekday: number; color: string; width?: number; weekdays: string[]; today?: number }) {
  const { colors } = useTheme();
  const cell = width / 7;
  const rows = Math.ceil((days.length + firstWeekday) / 7);
  return (
    <Svg width={width} height={cell * rows + 20}>
      {weekdays.map((w, i) => (
        <SvgText key={i} x={cell * i + cell / 2} y={12} fontSize={10} fill={colors.textMuted} textAnchor="middle">{w}</SvgText>
      ))}
      {days.map((v, i) => {
        const k = i + firstWeekday;
        const x = (k % 7) * cell;
        const y = 20 + Math.floor(k / 7) * cell;
        return (
          <G key={i}>
            <Rect x={x + 2} y={y + 2} width={cell - 4} height={cell - 4} rx={8} fill={color} fillOpacity={0.08 + (v - 1) * 0.2} stroke={today === i + 1 ? colors.gold : 'none'} strokeWidth={2} />
            <SvgText x={x + cell / 2} y={y + cell / 2 + 4} fontSize={12} fill={v >= 4 ? colors.text : colors.textMuted} textAnchor="middle">{i + 1}</SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

/** Linha da vida de 0 a 90 anos com setênios e o "você está aqui". */
export function LifeTimeline({ age, nineYearAges, color, width = 320, hereLabel }: { age: number; nineYearAges: number[]; color: string; width?: number; hereLabel: string }) {
  const { colors } = useTheme();
  const x = (a: number) => 8 + (a / 91) * (width - 16);
  return (
    <Svg width={width} height={92}>
      {Array.from({ length: 13 }, (_, i) => (
        <G key={i}>
          <Rect x={x(i * 7)} y={30} width={x(7) - x(0) - 2} height={22} rx={4} fill={color} fillOpacity={Math.floor(age / 7) === i ? 0.9 : 0.12 + (i % 2) * 0.08} />
          {i % 2 === 0 ? <SvgText x={x(i * 7)} y={68} fontSize={9} fill={colors.textMuted}>{i * 7}</SvgText> : null}
        </G>
      ))}
      {nineYearAges.map((a) => (
        <Line key={a} x1={x(a)} y1={24} x2={x(a)} y2={58} stroke={colors.gold} strokeWidth={1} strokeOpacity={0.7} />
      ))}
      <Circle cx={x(age)} cy={18} r={5} fill={colors.gold} />
      <SvgText x={x(age)} y={10} fontSize={9} fill={colors.gold} textAnchor="middle">{hereLabel}</SvgText>
      <SvgText x={x(age)} y={86} fontSize={10} fill={colors.text} textAnchor="middle">{age}</SvgText>
    </Svg>
  );
}

/** Diagrama de convergência: técnicas ao redor ligadas ao traço que têm em comum. */
export function ConvergenceDiagram({ trait, techniques, colorsList, labels, size = 280 }: { trait: string; techniques: string[]; colorsList: string[]; labels: string[]; size?: number }) {
  const { colors } = useTheme();
  const c = size / 2;
  const R = size / 2 - 44;
  const n = labels.length;
  return (
    <Svg width={size} height={size}>
      {labels.map((l, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = c + R * Math.cos(a);
        const y = c + R * Math.sin(a);
        const on = techniques.includes(l);
        return (
          <G key={l}>
            {on ? <Line x1={c} y1={c} x2={x} y2={y} stroke={colorsList[i]} strokeWidth={2} /> : null}
            <Circle cx={x} cy={y} r={30} fill={colorsList[i]} fillOpacity={on ? 0.28 : 0.06} stroke={colorsList[i]} strokeOpacity={on ? 1 : 0.35} />
            <SvgText x={x} y={y + 4} fontSize={9} fill={on ? colors.text : colors.textMuted} textAnchor="middle">{l.length > 12 ? `${l.slice(0, 11)}…` : l}</SvgText>
          </G>
        );
      })}
      <Circle cx={c} cy={c} r={38} fill={colors.gold} fillOpacity={0.2} stroke={colors.gold} />
      <SvgText x={c} y={c + 5} fontSize={13} fill={colors.text} textAnchor="middle" fontWeight="600">{trait}</SvgText>
    </Svg>
  );
}

/** Hexagrama do I Ching: linhas de baixo para cima; mutantes marcadas. */
export function Hexagram({ lines, changing = [], color, width = 120 }: { lines: boolean[]; changing?: number[]; color: string; width?: number }) {
  const lh = width / 8;
  return (
    <Svg width={width} height={lh * 6 * 1.7}>
      {lines.map((yang, i) => {
        const y = (5 - i) * lh * 1.7 + lh / 2;
        const ch = changing.includes(i + 1);
        return (
          <G key={i}>
            {yang ? (
              <Rect x={0} y={y} width={width} height={lh} rx={2} fill={color} />
            ) : (
              <G>
                <Rect x={0} y={y} width={width * 0.42} height={lh} rx={2} fill={color} />
                <Rect x={width * 0.58} y={y} width={width * 0.42} height={lh} rx={2} fill={color} />
              </G>
            )}
            {ch ? <Circle cx={width / 2} cy={y + lh / 2} r={lh * 0.45} fill="none" stroke="#FFFFFF" strokeWidth={1.5} /> : null}
          </G>
        );
      })}
    </Svg>
  );
}
