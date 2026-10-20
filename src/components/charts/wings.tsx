import Svg, { G, Path } from 'react-native-svg';

/** Asas em traço fino para o cartão do anjo. */
export function Wings({ width = 160, color }: { width?: number; color: string }) {
  const feathers = (dir: 1 | -1) =>
    [0, 1, 2, 3, 4].map((i) => {
      const y = 22 + i * 9;
      const len = 58 - i * 9;
      return <Path key={i} d={`M80 ${30 + i * 4}c${dir * 20} ${-10 - i} ${dir * (len - 10)} ${y - 40} ${dir * len} ${y - 20}`} />;
    });
  return (
    <Svg width={width} height={width * 0.5} viewBox="0 0 160 80" accessibilityElementsHidden>
      <G stroke={color} strokeWidth={1.1} fill="none" strokeLinecap="round">
        {feathers(1)}
        {feathers(-1)}
        <Path d="M80 26c3 6 3 14 0 24-3-10-3-18 0-24z" />
      </G>
    </Svg>
  );
}
