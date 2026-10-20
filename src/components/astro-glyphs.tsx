/** Símbolos de signos e planetas em traço fino, desenhados num quadro de 24×24. */
import type { ColorValue } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

import type { PointKey, SignKey } from '@/engines/astro/chart';

const SIGN_PATHS: Record<SignKey, string> = {
  aries: 'M5 20C5 9 4 4 8 4s4 6 4 10c0-4 0-10 4-10s3 5 3 16',
  taurus: 'M17 15a5 5 0 1 1-10 0 5 5 0 0 1 10 0zM4 4c1 4 4 6 8 6s7-2 8-6',
  gemini: 'M5 4h14M5 20h14M9 4v16M15 4v16',
  cancer: 'M4 10c3-5 13-5 16 0M20 14c-3 5-13 5-16 0M9.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19.5 14a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
  leo: 'M10.5 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM10 14C8 9 9 4 13 4s5 4 3 8-3 6 0 8 4-1 4-2',
  virgo: 'M4 6v13M4 8c0-3 4-3 4 0v11M8 8c0-3 4-3 4 0v11M12 8c0-3 4-3 4 0v7c0 3 4 3 4 0s-3-3-5 1-2 4-2 4',
  libra: 'M4 20h16M4 16h5a3.5 3.5 0 1 1 6 0h5',
  scorpio: 'M4 6v13M4 8c0-3 4-3 4 0v11M8 8c0-3 4-3 4 0v11c0 2 2 2 4 1l4-3M20 17l-3-.5M20 17l-.5 3',
  sagittarius: 'M5 19L19 5M12 5h7v7M8 12l4 4',
  capricorn: 'M4 6l3 11 3-11v10c0 3 3 4 5 3s2-5-1-5-3 3-3 5-2 4-4 4',
  aquarius: 'M3 10l3-3 3 3 3-3 3 3 3-3 3 3M3 16l3-3 3 3 3-3 3 3 3-3 3 3',
  pisces: 'M6 4c4 4 4 12 0 16M18 4c-4 4-4 12 0 16M5 12h14',
};

const PLANET_PATHS: Partial<Record<PointKey, string>> = {
  moon: 'M15 4a8 8 0 1 0 0 16 7 7 0 0 1 0-16z',
  mercury: 'M16 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 3c1 2 2.5 3 4 3s3-1 4-3M12 14v7M9 18h6',
  venus: 'M17 9a5 5 0 1 1-10 0 5 5 0 0 1 10 0zM12 14v7M9 18h6',
  mars: 'M15 15a5 5 0 1 1-10 0 5 5 0 0 1 10 0zM13.5 10.5L20 4M14 4h6v6',
  jupiter: 'M5 8c2-4 8-4 8 1s-5 7-8 7h13M16 4v17',
  saturn: 'M8 3v15M5 6h6M8 11c2-3 8-3 8 2s-5 4-3 8',
  uranus: 'M7 3v10M17 3v10M7 8h10M12 3v12M14.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
  neptune: 'M5 5c0 7 3 9 7 9s7-2 7-9M12 4v17M9 18h6',
  pluto: 'M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6 7c0 5 3 7 6 7s6-2 6-7M12 14v7M9 18h6',
  node: 'M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 15v-4a5 5 0 0 1 10 0v4',
};

type GlyphProps = { size?: number; color: ColorValue; strokeWidth?: number };

/** Para usar dentro de um <Svg> maior: desenha o símbolo centrado em (x, y). */
export function SignGlyphG({ sign, x, y, size = 16, color, strokeWidth = 1.4 }: GlyphProps & { sign: SignKey; x: number; y: number }) {
  const s = size / 24;
  return (
    <G transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`}>
      <Path d={SIGN_PATHS[sign]} stroke={color} strokeWidth={strokeWidth / s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  );
}

export function PlanetGlyphG({ planet, x, y, size = 16, color, strokeWidth = 1.4 }: GlyphProps & { planet: PointKey; x: number; y: number }) {
  const s = size / 24;
  if (planet === 'asc' || planet === 'mc') {
    return (
      <SvgText x={x} y={y + size * 0.3} fill={color} fontSize={size * 0.7} fontWeight="600" textAnchor="middle">
        {planet === 'asc' ? 'AC' : 'MC'}
      </SvgText>
    );
  }
  return (
    <G transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`}>
      {planet === 'sun' ? (
        <G stroke={color} strokeWidth={strokeWidth / s} fill="none">
          <Circle cx={12} cy={12} r={8} />
          <Circle cx={12} cy={12} r={1.6} fill={color} />
        </G>
      ) : (
        <Path d={PLANET_PATHS[planet]} stroke={color} strokeWidth={strokeWidth / s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </G>
  );
}

/** Versões avulsas (fora de um SVG). */
export function SignGlyph({ sign, size = 24, color, strokeWidth }: GlyphProps & { sign: SignKey }) {
  return (
    <Svg width={size} height={size} accessibilityElementsHidden>
      <SignGlyphG sign={sign} x={size / 2} y={size / 2} size={size * 0.9} color={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function PlanetGlyph({ planet, size = 24, color, strokeWidth }: GlyphProps & { planet: PointKey }) {
  return (
    <Svg width={size} height={size} accessibilityElementsHidden>
      <PlanetGlyphG planet={planet} x={size / 2} y={size / 2} size={size * 0.9} color={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
