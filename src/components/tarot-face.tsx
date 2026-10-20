/** Face das cartas do tarô — ilustrações originais do app em traço fino. */
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { Suit } from '@/engines/divination';
import { useTheme } from '@/theme';

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

/** Símbolo central de cada arcano maior, desenhado em torno de (50, 80). */
function MajorSymbol({ n }: { n: number }) {
  switch (n) {
    case 0: // Louco: estrada sinuosa até uma estrela
      return <G><Path d="M30 112c10-8 30-6 22-18s14-12 18-22" /><Path d="M68 52l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /><Circle cx={36} cy={110} r={2} /></G>;
    case 1: // Mago: lemniscata sobre a varinha
      return <G><Path d="M38 60c0-6 10-6 12 0s12 6 12 0-10-6-12 0-12 6-12 0z" /><Line x1={50} y1={70} x2={50} y2={112} /><Circle cx={50} cy={70} r={2.5} /><Path d="M40 112h20" /></G>;
    case 2: // Sacerdotisa: lua entre colunas
      return <G><Rect x={28} y={56} width={8} height={56} /><Rect x={64} y={56} width={8} height={56} /><Path d="M54 70a12 12 0 1 0 0 20 9 9 0 1 1 0-20z" /></G>;
    case 3: // Imperatriz: símbolo de Vênus com espigas
      return <G><Circle cx={50} cy={68} r={12} /><Line x1={50} y1={80} x2={50} y2={108} /><Line x1={41} y1={96} x2={59} y2={96} /><Path d="M30 108c4-8 4-16 0-22M70 108c-4-8-4-16 0-22" /></G>;
    case 4: // Imperador: trono com chifres
      return <G><Rect x={34} y={74} width={32} height={36} /><Path d="M34 74c-10 0-12-14-2-14M66 74c10 0 12-14 2-14" /><Path d="M42 74V62h16v12" /></G>;
    case 5: // Papa: cruz tripla
      return <G><Line x1={50} y1={52} x2={50} y2={112} /><Line x1={42} y1={62} x2={58} y2={62} /><Line x1={38} y1={72} x2={62} y2={72} /><Line x1={34} y1={82} x2={66} y2={82} /></G>;
    case 6: // Enamorados: dois círculos que se tocam
      return <G><Circle cx={42} cy={80} r={14} /><Circle cx={58} cy={80} r={14} /><Path d="M50 52l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" /></G>;
    case 7: // Carro: caixa e rodas
      return <G><Rect x={32} y={64} width={36} height={28} /><Circle cx={36} cy={100} r={8} /><Circle cx={64} cy={100} r={8} /><Path d="M40 64l10-12 10 12" /></G>;
    case 8: // Justiça: balança
      return <G><Line x1={50} y1={54} x2={50} y2={112} /><Line x1={28} y1={64} x2={72} y2={64} /><Path d="M28 64l-8 18h16zM72 64l-8 18h16z" /><Line x1={40} y1={112} x2={60} y2={112} /></G>;
    case 9: // Eremita: lanterna
      return <G><Path d="M42 68h16l4 10-4 16H42l-4-16z" /><Path d="M50 74l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /><Line x1={50} y1={56} x2={50} y2={68} /><Line x1={50} y1={94} x2={50} y2={112} /></G>;
    case 10: // Roda
      return <G><Circle cx={50} cy={82} r={24} /><Circle cx={50} cy={82} r={8} />{Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return <Line key={i} x1={50 + 8 * Math.cos(a)} y1={82 + 8 * Math.sin(a)} x2={50 + 24 * Math.cos(a)} y2={82 + 24 * Math.sin(a)} />; })}</G>;
    case 11: // Força: lemniscata sobre a juba
      return <G><Path d="M40 56c0-5 8-5 10 0s10 5 10 0-8-5-10 0-10 5-10 0z" /><Circle cx={50} cy={86} r={12} />{Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return <Line key={i} x1={50 + 14 * Math.cos(a)} y1={86 + 14 * Math.sin(a)} x2={50 + 21 * Math.cos(a)} y2={86 + 21 * Math.sin(a)} />; })}</G>;
    case 12: // Enforcado: triângulo invertido sobre cruz
      return <G><Line x1={30} y1={56} x2={70} y2={56} /><Line x1={50} y1={56} x2={50} y2={70} /><Path d="M38 82h24L50 104z" /><Circle cx={50} cy={74} r={4} /></G>;
    case 13: // Transformação: broto nascendo da terra
      return <G><Line x1={28} y1={108} x2={72} y2={108} /><Path d="M50 108V74" /><Path d="M50 88c-10 0-16-8-16-16 10 0 16 8 16 16zM50 80c10 0 16-8 16-16-10 0-16 8-16 16z" /></G>;
    case 14: // Temperança: dois cálices e o fluxo
      return <G><Path d="M30 64h14l-2 12h-10zM56 92h14l-2 12h-10z" /><Path d="M40 76c4 10 14 6 20 16" /><Line x1={37} y1={76} x2={37} y2={84} /><Line x1={63} y1={104} x2={63} y2={112} /></G>;
    case 15: // Correntes
      return <G><Path d="M34 70a8 12 0 1 0 16 0 8 12 0 1 0-16 0zM50 92a8 12 0 1 0 16 0 8 12 0 1 0-16 0z" /><Path d="M44 56l6-6 6 6" /></G>;
    case 16: // Torre com raio
      return <G><Path d="M38 112V66h24v46" /><Path d="M36 66l4-8h20l4 8" /><Path d="M66 48l-10 16h8l-10 18" /><Rect x={46} y={92} width={8} height={20} /></G>;
    case 17: // Estrela de oito pontas
      return <G><Path d="M50 54l5 18 18 5-18 5-5 18-5-18-18-5 18-5z" /><Path d="M50 66l12 11-12 11-12-11z" /><Circle cx={30} cy={104} r={2} /><Circle cx={70} cy={58} r={2} /></G>;
    case 18: // Lua
      return <G><Circle cx={50} cy={78} r={20} /><Path d="M56 62a16 16 0 1 0 0 32 20 20 0 1 1 0-32z" /><Path d="M40 104l2 6M50 104l0 7M60 104l-2 6" /></G>;
    case 19: // Sol
      return <G><Circle cx={50} cy={80} r={14} />{Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8; const r2 = i % 2 ? 24 : 30; return <Line key={i} x1={50 + 18 * Math.cos(a)} y1={80 + 18 * Math.sin(a)} x2={50 + r2 * Math.cos(a)} y2={80 + r2 * Math.sin(a)} />; })}</G>;
    case 20: // Julgamento: trombeta e raios
      return <G><Path d="M30 96l30-20v24z" /><Path d="M60 76c6 2 8 12 0 24" /><Path d="M64 60l6-6M70 70l8-2M58 54l2-8" /></G>;
    default: // 21 Mundo: guirlanda oval
      return <G><Path d="M50 52c16 0 22 14 22 28s-6 28-22 28-22-14-22-28 6-28 22-28z" /><Path d="M50 60c10 0 14 10 14 20s-4 20-14 20-14-10-14-20 4-20 14-20z" strokeOpacity={0.5} /><Circle cx={50} cy={80} r={3} /></G>;
  }
}

function SuitSymbol({ suit, x, y, s = 1 }: { suit: Suit; x: number; y: number; s?: number }) {
  const t = `translate(${x} ${y}) scale(${s})`;
  switch (suit) {
    case 'wands':
      return <G transform={t}><Line x1={0} y1={-9} x2={0} y2={9} /><Path d="M0-3c-3-1-4-3-4-5M0 2c3-1 4-3 4-5" /></G>;
    case 'cups':
      return <G transform={t}><Path d="M-6-7h12c0 7-3 10-6 10s-6-3-6-10z" /><Line x1={0} y1={3} x2={0} y2={7} /><Line x1={-4} y1={8} x2={4} y2={8} /></G>;
    case 'swords':
      return <G transform={t}><Line x1={0} y1={-10} x2={0} y2={6} /><Line x1={-5} y1={6} x2={5} y2={6} /><Line x1={0} y1={6} x2={0} y2={10} /></G>;
    default:
      return <G transform={t}><Circle r={7} /><Path d="M0-5l1.6 4.4H6l-3.6 2.8 1.4 4.4L0 3.8-3.8 6.6l1.4-4.4L-6-.6h4.4z" /></G>;
  }
}

/** Posições dos naipes para cartas de 1 a 10. */
const PIPS: [number, number][][] = [
  [[50, 80]],
  [[50, 62], [50, 98]],
  [[50, 56], [50, 80], [50, 104]],
  [[36, 62], [64, 62], [36, 98], [64, 98]],
  [[36, 60], [64, 60], [50, 80], [36, 100], [64, 100]],
  [[36, 58], [64, 58], [36, 80], [64, 80], [36, 102], [64, 102]],
  [[36, 56], [64, 56], [50, 68], [36, 82], [64, 82], [36, 106], [64, 106]],
  [[36, 56], [64, 56], [36, 72], [64, 72], [36, 88], [64, 88], [36, 104], [64, 104]],
  [[36, 54], [64, 54], [36, 70], [64, 70], [50, 80], [36, 90], [64, 90], [36, 106], [64, 106]],
  [[36, 52], [64, 52], [50, 62], [36, 72], [64, 72], [36, 88], [64, 88], [50, 98], [36, 108], [64, 108]],
];
const COURT = ['P', 'C', 'Q', 'K'];

export function TarotFace({ id, width = 120, color, reversed }: { id: string; width?: number; color?: string; reversed?: boolean }) {
  const { colors } = useTheme();
  const gold = color ?? colors.gold;
  const major = id.startsWith('M') ? Number(id.slice(1)) : null;
  const [suit, r] = major == null ? (id.split('-') as [Suit, string]) : [null, null];
  const rank = r ? Number(r) : 0;
  const label = major != null ? ROMAN[major] : rank <= 10 ? String(rank) : COURT[rank - 11];
  return (
    <Svg width={width} height={width * 1.6} viewBox="0 0 100 160" style={reversed ? { transform: [{ rotate: '180deg' }] } : undefined}>
      <Rect x={1} y={1} width={98} height={158} rx={10} fill={colors.surface} stroke={gold} strokeWidth={1.2} />
      <Rect x={7} y={7} width={86} height={146} rx={6} fill="none" stroke={gold} strokeWidth={0.5} strokeOpacity={0.6} />
      <SvgText x={50} y={26} fill={gold} fontSize={13} fontWeight="600" textAnchor="middle" fontFamily="serif">{label}</SvgText>
      <G stroke={gold} strokeWidth={1.3} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {major != null ? (
          <MajorSymbol n={major} />
        ) : rank <= 10 ? (
          PIPS[rank - 1].map(([x, y], i) => <SuitSymbol key={i} suit={suit!} x={x} y={y} s={rank === 1 ? 2.4 : 1} />)
        ) : (
          <G>
            <Path d="M36 66l6 8 8-12 8 12 6-8v14H36z" />
            <SuitSymbol suit={suit!} x={50} y={98} s={1.8} />
          </G>
        )}
      </G>
      <Line x1={30} y1={136} x2={70} y2={136} stroke={gold} strokeWidth={0.6} strokeOpacity={0.7} />
    </Svg>
  );
}
