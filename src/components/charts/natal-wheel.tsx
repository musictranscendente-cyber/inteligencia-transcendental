import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { PlanetGlyphG, SignGlyphG } from '@/components/astro-glyphs';
import { SIGN_ELEMENT, SIGNS, type Aspect, type ChartPoint, type PointKey } from '@/engines/astro/chart';
import { norm360 } from '@/engines/astro/ephemeris';
import { fonts, useTheme } from '@/theme';

type Props = {
  points: ChartPoint[];
  cusps: number[] | null;
  aspects: Aspect[];
  size: number;
  selected?: PointKey | null;
  onSelect?: (key: PointKey) => void;
  /** Bi-roda: planetas de outra pessoa no anel externo. */
  outer?: ChartPoint[];
  outerColor?: string;
};

const ASPECT_COLORS = { trine: '#5FE0B8', sextile: '#7FB3FF', square: '#FF6B6B', opposition: '#FF9F6B', conjunction: '#D9B56A' } as const;

/** Afasta glifos muito próximos para não se sobreporem. */
function spread(points: { key: PointKey; lon: number }[], minGap: number) {
  const sorted = [...points].sort((a, b) => a.lon - b.lon).map((p) => ({ ...p, pos: p.lon }));
  for (let iter = 0; iter < 30; iter++) {
    let moved = false;
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i];
      const b = sorted[(i + 1) % sorted.length];
      if (sorted.length < 2) break;
      const gap = norm360(b.pos - a.pos);
      if (gap < minGap) {
        const push = (minGap - gap) / 2;
        a.pos = norm360(a.pos - push);
        b.pos = norm360(b.pos + push);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return new Map(sorted.map((p) => [p.key, p.pos]));
}

export function NatalWheel({ points, cusps, aspects, size, selected, onSelect, outer, outerColor }: Props) {
  const { colors } = useTheme();
  const reduce = useReducedMotion();
  const spin = useSharedValue(reduce ? 0 : -60);
  useEffect(() => {
    spin.set(withTiming(0, { duration: 1400, easing: Easing.out(Easing.cubic) }));
  }, [spin]);
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.get()}deg` }] }));

  const c = size / 2;
  const asc = points.find((p) => p.key === 'asc')?.lon ?? 0;
  const toXY = (lon: number, r: number): [number, number] => {
    const th = Math.PI + ((lon - asc) * Math.PI) / 180;
    return [c + r * Math.cos(th), c - r * Math.sin(th)];
  };
  const elementColor = { fire: colors.element.fire, earth: colors.element.earth, air: colors.element.air, water: colors.element.water };

  const rOuter = size / 2 - 2;
  const rSigns = rOuter - (outer ? 46 : 2);
  const rSignInner = rSigns - 26;
  const rPlanets = rSignInner - 20;
  const rAspects = rSignInner - 40;
  const planets = points.filter((p) => p.key !== 'asc' && p.key !== 'mc');
  const pos = spread(planets, 8);
  const outerPos = outer ? spread(outer.filter((p) => p.key !== 'asc' && p.key !== 'mc'), 8) : null;
  const byKey = new Map(points.map((p) => [p.key, p]));

  return (
    <View style={{ width: size, height: size, alignSelf: 'center' }}>
      <Animated.View style={[{ width: size, height: size }, spinStyle]}>
        <Svg width={size} height={size}>
          <Circle cx={c} cy={c} r={rSigns} stroke={colors.gold} strokeOpacity={0.7} fill="none" />
          <Circle cx={c} cy={c} r={rSignInner} stroke={colors.gold} strokeOpacity={0.5} fill="none" />
          <Circle cx={c} cy={c} r={rAspects} stroke={colors.border} fill="none" />
          {outer ? <Circle cx={c} cy={c} r={rOuter} stroke={outerColor} strokeOpacity={0.6} fill="none" /> : null}

          {SIGNS.map((s, i) => {
            const [x1, y1] = toXY(i * 30, rSigns);
            const [x2, y2] = toXY(i * 30, rSignInner);
            const [gx, gy] = toXY(i * 30 + 15, (rSigns + rSignInner) / 2);
            return (
              <G key={s}>
                <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.gold} strokeOpacity={0.5} />
                <SignGlyphG sign={s} x={gx} y={gy} size={15} color={elementColor[SIGN_ELEMENT[i]]} />
              </G>
            );
          })}

          {cusps?.map((cu, i) => {
            const [x1, y1] = toXY(cu, rSignInner);
            const [x2, y2] = toXY(cu, rAspects);
            const [tx, ty] = toXY(cu + 4, rAspects + 8);
            const angle = i === 0 || i === 3 || i === 6 || i === 9;
            return (
              <G key={i}>
                <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={angle ? colors.gold : colors.border} strokeWidth={angle ? 1.4 : 0.8} />
                <SvgText x={tx} y={ty + 3} fontSize={8} fill={colors.textMuted} textAnchor="middle">{i + 1}</SvgText>
              </G>
            );
          })}

          {aspects
            .filter((a) => a.a !== 'asc' && a.a !== 'mc' && a.b !== 'asc' && a.b !== 'mc' && a.type !== 'conjunction')
            .map((a, i) => {
              const pa = byKey.get(a.a);
              const pb = byKey.get(a.b);
              if (!pa || !pb) return null;
              const [x1, y1] = toXY(pa.lon, rAspects);
              const [x2, y2] = toXY(pb.lon, rAspects);
              const dim = selected && a.a !== selected && a.b !== selected;
              return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ASPECT_COLORS[a.type]} strokeOpacity={dim ? 0.12 : 0.7} strokeWidth={1} />;
            })}

          {planets.map((p) => {
            const [x, y] = toXY(pos.get(p.key)!, rPlanets);
            const [tx, ty] = toXY(p.lon, rSignInner);
            const [tx2, ty2] = toXY(p.lon, rSignInner - 6);
            const active = selected === p.key;
            return (
              <G key={p.key} onPress={() => onSelect?.(p.key)}>
                <Line x1={tx} y1={ty} x2={tx2} y2={ty2} stroke={colors.gold} />
                <Circle cx={x} cy={y} r={11} fill={active ? `${colors.gold}40` : colors.surface} stroke={active ? colors.gold : 'transparent'} />
                <PlanetGlyphG planet={p.key} x={x} y={y} size={15} color={p.key === 'sun' || p.key === 'moon' ? colors.gold : colors.text} />
                {p.retrograde ? <SvgText x={x + 9} y={y + 11} fontSize={7} fill={colors.danger}>R</SvgText> : null}
              </G>
            );
          })}

          {(['asc', 'mc'] as PointKey[]).map((k) => {
            const p = byKey.get(k);
            if (!p) return null;
            const [x, y] = toXY(p.lon, rSigns + (outer ? 10 : -0));
            return (
              <G key={k} onPress={() => onSelect?.(k)}>
                <Rect x={x - 11} y={y - 7} width={22} height={14} rx={7} fill={colors.gold} />
                <SvgText x={x} y={y + 3.5} fontSize={9} fontWeight="700" fill={colors.onGold} textAnchor="middle" fontFamily={fonts.bodySemiBold}>{k === 'asc' ? 'AC' : 'MC'}</SvgText>
              </G>
            );
          })}

          {outer && outerPos
            ? outer
                .filter((p) => p.key !== 'asc' && p.key !== 'mc')
                .map((p) => {
                  const [x, y] = toXY(outerPos.get(p.key)!, (rOuter + rSigns) / 2);
                  return <PlanetGlyphG key={`o-${p.key}`} planet={p.key} x={x} y={y} size={14} color={outerColor ?? colors.text} />;
                })
            : null}
        </Svg>
      </Animated.View>
    </View>
  );
}

/** Grade triangular de aspectos entre os planetas. */
export function AspectGrid({ points, aspects, size }: { points: ChartPoint[]; aspects: Aspect[]; size: number }) {
  const { colors } = useTheme();
  const keys = points.map((p) => p.key);
  const n = keys.length;
  const cell = size / (n + 1);
  const find = (a: PointKey, b: PointKey) => aspects.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  const SYMBOL = { conjunction: '☌', opposition: '☍', trine: '△', square: '□', sextile: '⚹' } as const;
  return (
    <Svg width={size} height={size}>
      {keys.map((k, i) => (
        <G key={k}>
          <PlanetGlyphG planet={k} x={cell * (i + 0.5)} y={cell * (i + 1.5)} size={cell * 0.6} color={colors.gold} />
          {keys.slice(0, i).map((k2, j) => {
            const asp = find(k, k2);
            return (
              <G key={k2}>
                <Rect x={cell * j} y={cell * (i + 1)} width={cell} height={cell} fill="none" stroke={colors.border} strokeWidth={0.5} />
                {asp ? (
                  <SvgText x={cell * (j + 0.5)} y={cell * (i + 1.5) + cell * 0.2} fontSize={cell * 0.55} fill={ASPECT_COLORS[asp.type]} textAnchor="middle">
                    {SYMBOL[asp.type]}
                  </SvgText>
                ) : null}
              </G>
            );
          })}
        </G>
      ))}
    </Svg>
  );
}

/** Barras horizontais (elementos, modalidades, cinco elementos…). */
export function Bars({ items, width }: { items: { label: string; value: number; color: string }[]; width: number }) {
  const { colors } = useTheme();
  const max = Math.max(...items.map((i) => i.value), 1);
  const row = 30;
  return (
    <Svg width={width} height={items.length * row}>
      {items.map((it, i) => {
        const w = ((width - 110) * it.value) / max;
        return (
          <G key={it.label}>
            <SvgText x={0} y={i * row + 19} fontSize={13} fill={colors.text}>{it.label}</SvgText>
            <Rect x={80} y={i * row + 8} width={width - 110} height={12} rx={6} fill={colors.border} />
            <Rect x={80} y={i * row + 8} width={Math.max(w, 4)} height={12} rx={6} fill={it.color} />
            <SvgText x={width - 4} y={i * row + 19} fontSize={12} fill={colors.textMuted} textAnchor="end">{Math.round(it.value)}</SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

