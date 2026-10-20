import Svg, { G, Path } from 'react-native-svg';

const WING = 'M84 46C98 22 126 10 156 12C148 20 142 24 134 27C144 29 149 33 152 38C140 41 130 41 121 41C129 46 133 51 135 57C121 56 109 53 99 50C104 56 106 61 106 67C95 62 88 55 84 46Z';
const FEATHERS = 'M90 44C108 32 128 24 150 16M94 47C110 40 126 36 146 37M98 50C110 47 120 46 130 50M100 54C102 58 103 61 104 64';

/** Asas em traço fino para o cartão do anjo. */
export function Wings({ width = 160, color }: { width?: number; color: string }) {
  return (
    <Svg width={width} height={width * 0.5} viewBox="0 0 160 80" accessibilityElementsHidden>
      <G stroke={color} strokeWidth={1.1} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Path d={WING} fill={color} fillOpacity={0.08} />
        <Path d={FEATHERS} strokeOpacity={0.7} />
        <G transform="translate(160 0) scale(-1 1)">
          <Path d={WING} fill={color} fillOpacity={0.08} />
          <Path d={FEATHERS} strokeOpacity={0.7} />
        </G>
        <Path d="M80 30a4 4 0 1 0 0.01 0M80 38v16" />
      </G>
    </Svg>
  );
}
