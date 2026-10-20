/** Faces do baralho cigano e das runas, desenhadas em SVG. */
import { View } from 'react-native';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { AppText } from '@/components/app-text';
import type { RuneKey } from '@/engines/divination';
import { useTheme } from '@/theme';

/** Traços de cada runa num quadro de 10 × 16. */
export const RUNE_PATHS: Record<RuneKey, string> = {
  fehu: 'M3 0V16M3 2L8 0M3 6L8 4',
  uruz: 'M2 16V0L8 5V16',
  thurisaz: 'M2 0V16M2 4L7 8L2 12',
  ansuz: 'M3 0V16M3 1L8 4M3 6L8 9',
  raidho: 'M2 0V16M2 0L7 4L2 8L8 16',
  kenaz: 'M8 3L2 8L8 13',
  gebo: 'M1 1L9 15M9 1L1 15',
  wunjo: 'M2 0V16M2 0L7 4L2 8',
  hagalaz: 'M2 0V16M8 0V16M2 5L8 11',
  nauthiz: 'M5 0V16M2 5L8 10',
  isa: 'M5 0V16',
  jera: 'M4 2L1 6L4 10M6 6L9 10L6 14',
  eihwaz: 'M5 0V16M5 0L8 3M5 16L2 13',
  perthro: 'M2 0V16M2 0L6 3M6 3V6M2 16L6 13M6 13V10',
  algiz: 'M5 0V16M5 6L1 1M5 6L9 1',
  sowilo: 'M7 0L2 5L8 11L3 16',
  tiwaz: 'M5 0V16M5 0L1 5M5 0L9 5',
  berkano: 'M2 0V16M2 0L7 4L2 8L7 12L2 16',
  ehwaz: 'M2 16V0L5 5L8 0V16',
  mannaz: 'M2 16V0L8 7M8 16V0L2 7',
  laguz: 'M3 0V16M3 0L8 5',
  ingwaz: 'M5 2L9 8L5 14L1 8Z',
  dagaz: 'M1 2L9 14V2L1 14Z',
  othala: 'M5 1L9 6L2 15M5 1L1 6L8 15',
};

export function RuneStone({ rune, size = 90, color, reversed }: { rune?: RuneKey; size?: number; color?: string; reversed?: boolean }) {
  const { colors, name } = useTheme();
  const c = color ?? colors.gold;
  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120">
      <Path d="M50 4C80 4 96 26 94 60s-18 56-44 56S4 96 6 60 20 4 50 4z" fill={name === 'dark' ? '#2A2742' : '#E8E0CF'} stroke={c} strokeWidth={1.5} />
      {rune ? (
        <G transform={`translate(${reversed ? 70 : 30} ${reversed ? 96 : 24}) scale(${reversed ? -4 : 4})`}>
          <Path d={RUNE_PATHS[rune]} stroke={c} strokeWidth={0.55} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      ) : null}
    </Svg>
  );
}

export function LenormandFace({ number, name, width = 110, color }: { number: number; name: string; width?: number; color?: string }) {
  const { colors } = useTheme();
  const c = color ?? colors.technique.oracles;
  return (
    <View style={{ width, height: width * 1.6 }}>
      <Svg width={width} height={width * 1.6} viewBox="0 0 100 160" style={{ position: 'absolute' }}>
        <Rect x={1} y={1} width={98} height={158} rx={10} fill={colors.surface} stroke={c} strokeWidth={1.2} />
        <Rect x={7} y={7} width={86} height={146} rx={6} fill="none" stroke={c} strokeWidth={0.5} strokeOpacity={0.6} />
        <SvgText x={50} y={74} fontSize={42} fill={c} textAnchor="middle" fontFamily="serif">{number}</SvgText>
        <Path d="M30 90h40M38 96h24" stroke={c} strokeWidth={0.8} />
      </Svg>
      <View style={{ position: 'absolute', left: 6, right: 6, bottom: width * 0.18, alignItems: 'center' }}>
        <AppText variant="caption" center color={c} numberOfLines={2}>{name}</AppText>
      </View>
    </View>
  );
}
