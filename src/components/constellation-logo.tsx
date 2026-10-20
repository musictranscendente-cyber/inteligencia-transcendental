import { useEffect } from 'react';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';

import { useTheme } from '@/theme';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Point = [number, number];

// Estrela-bússola: losango externo, losango interno e o centro.
const OUTER: Point[] = [[100, 22], [178, 100], [100, 178], [22, 100]];
const INNER: Point[] = [[100, 70], [130, 100], [100, 130], [70, 100]];
const CENTER: Point = [100, 100];
const NODES: Point[] = [...OUTER, ...INNER, CENTER];

const EDGES: [Point, Point][] = [
  ...OUTER.map((p, i) => [p, INNER[i]] as [Point, Point]),
  ...INNER.map((p, i) => [p, INNER[(i + 1) % 4]] as [Point, Point]),
  ...OUTER.map((p, i) => [p, INNER[(i + 1) % 4]] as [Point, Point]),
];

const length = ([a, b]: [Point, Point]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const RING_RADIUS = 92;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/** Fração [início, fim] da animação total ocupada por cada elemento. */
function window(i: number, total: number, start: number, span: number): [number, number] {
  const step = span / total;
  return [start + i * step, start + i * step + step * 1.8];
}

function Node({ point, progress, range, color, big }: { point: Point; progress: SharedValue<number>; range: [number, number]; color: string; big?: boolean }) {
  const props = useAnimatedProps(() => {
    const t = interpolate(progress.get(), range, [0, 1], 'clamp');
    return { r: (big ? 5 : 3.2) * t, opacity: t };
  });
  return <AnimatedCircle cx={point[0]} cy={point[1]} fill={color} animatedProps={props} />;
}

function Edge({ edge, progress, range, color }: { edge: [Point, Point]; progress: SharedValue<number>; range: [number, number]; color: string }) {
  const len = length(edge);
  const props = useAnimatedProps(() => ({
    strokeDashoffset: len * (1 - interpolate(progress.get(), range, [0, 1], 'clamp')),
  }));
  return (
    <AnimatedLine
      x1={edge[0][0]}
      y1={edge[0][1]}
      x2={edge[1][0]}
      y2={edge[1][1]}
      stroke={color}
      strokeWidth={1.1}
      strokeOpacity={0.75}
      strokeDasharray={[len, len]}
      animatedProps={props}
    />
  );
}

/** Logo do app: uma constelação que se desenha ponto a ponto. */
export function ConstellationLogo({ size = 180, duration = 2600, onDone }: { size?: number; duration?: number; onDone?: () => void }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      progress.set(1);
      onDone?.();
      return;
    }
    progress.set(withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
    const timer = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, reduceMotion]);

  const ring = useAnimatedProps(() => ({
    strokeDashoffset: RING_LENGTH * (1 - interpolate(progress.get(), [0.55, 1], [0, 1], 'clamp')),
  }));

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <AnimatedCircle
        cx={100}
        cy={100}
        r={RING_RADIUS}
        stroke={colors.gold}
        strokeWidth={0.9}
        strokeOpacity={0.6}
        fill="none"
        strokeDasharray={[RING_LENGTH, RING_LENGTH]}
        animatedProps={ring}
        transform="rotate(-90 100 100)"
      />
      {EDGES.map((e, i) => (
        <Edge key={i} edge={e} progress={progress} range={window(i, EDGES.length, 0.15, 0.55)} color={colors.gold} />
      ))}
      {NODES.map((p, i) => (
        <Node key={i} point={p} progress={progress} range={window(i, NODES.length, 0, 0.4)} color={colors.gold} big={i === NODES.length - 1} />
      ))}
    </Svg>
  );
}
