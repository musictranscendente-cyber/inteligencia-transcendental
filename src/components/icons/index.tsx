/** Ícones próprios em traço fino (SVG). Todos usam `currentColor` via a prop `color`. */
import type { ColorValue } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

export type IconProps = { size?: number; color: ColorValue; strokeWidth?: number };

function Base({ size = 26, color, strokeWidth = 1.4, children }: IconProps & { children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </G>
    </Svg>
  );
}

/** Hoje: sol nascendo no horizonte. */
export function TodayIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M3 17.5h18" />
      <Path d="M7 17.5a5 5 0 0 1 10 0" />
      <Path d="M12 7v2.2M5.6 10.6l1.5 1.5M18.4 10.6l-1.5 1.5M3.5 14.5h1.6M18.9 14.5h1.6" />
      <Path d="M8 20.5h8" />
    </Base>
  );
}

/** Meu Mapa: roda do mapa natal. */
export function MapIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Circle cx={12} cy={12} r={9} />
      <Circle cx={12} cy={12} r={5.2} />
      <Path d="M12 3v3.8M12 17.2V21M3 12h3.8M17.2 12H21M5.6 5.6l2.7 2.7M15.7 15.7l2.7 2.7M18.4 5.6l-2.7 2.7M8.3 15.7l-2.7 2.7" />
      <Circle cx={12} cy={12} r={0.9} fill={p.color} />
    </Base>
  );
}

/** Relações: dois círculos entrelaçados. */
export function RelationsIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Circle cx={9} cy={12} r={5.6} />
      <Circle cx={15} cy={12} r={5.6} />
      <Path d="M12 8.2v.01M12 15.8v.01" />
    </Base>
  );
}

/** Oráculo: carta com um olho. */
export function OracleIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z" />
      <Path d="M8.5 12s1.4-2.6 3.5-2.6 3.5 2.6 3.5 2.6-1.4 2.6-3.5 2.6S8.5 12 8.5 12z" />
      <Circle cx={12} cy={12} r={0.9} fill={p.color} />
      <Path d="M12 6v.8M12 17.2v.8" />
    </Base>
  );
}

/** Ciclos: lua crescente envolvida por uma órbita. */
export function CyclesIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M20.5 12a8.5 8.5 0 1 1-4.1-7.3" />
      <Path d="M16.4 2.2l.4 2.6-2.6.5" />
      <Path d="M13.6 8.2a4.2 4.2 0 1 0 1.9 6.6 3.4 3.4 0 0 1-1.9-6.6z" />
    </Base>
  );
}

export function ProfileIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Circle cx={12} cy={12} r={9.2} />
      <Circle cx={12} cy={9.8} r={3.2} />
      <Path d="M6.4 18.6a6.6 6.6 0 0 1 11.2 0" />
    </Base>
  );
}

export function BackIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M14.5 5.5L8 12l6.5 6.5" />
    </Base>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Circle cx={10.5} cy={10.5} r={6} />
      <Path d="M15 15l5 5" />
    </Base>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M5 12.5l4.2 4.2L19 7" />
    </Base>
  );
}

export function PinIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
      <Circle cx={12} cy={10} r={2.3} />
    </Base>
  );
}

/** Estrela de quatro pontas, usada como detalhe decorativo. */
export function SparkIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M12 3c.6 4.6 1.4 5.4 6 6-4.6.6-5.4 1.4-6 6-.6-4.6-1.4-5.4-6-6 4.6-.6 5.4-1.4 6-6z" />
    </Base>
  );
}
