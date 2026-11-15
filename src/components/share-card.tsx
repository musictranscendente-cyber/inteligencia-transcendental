/** Card de compartilhamento: 9:16 (Stories) ou 1:1 (feed). Nunca mostra data, hora ou local de nascimento. */
import type { ComponentRef, ReactNode, Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/app-text';
import { ConstellationLogo } from '@/components/constellation-logo';
import { makeStars } from '@/components/starfield-data';
import { fonts, useTheme, withAlpha } from '@/theme';

export type ShareFormat = 'story' | 'feed';
export const SHARE_W = 360;

type Props = {
  ref?: Ref<ComponentRef<typeof View>>;
  format: ShareFormat;
  color: string;
  art: ReactNode;
  kicker: string;
  title: string;
  phrase: string;
  footer: string;
  appName: string;
  /** Data do card (ex.: "sábado, 15 de novembro"), mostrada abaixo do título superior. */
  date?: string;
  /** Conteúdo extra abaixo da frase (barras, lista de aspectos…). */
  extra?: ReactNode;
};

function Ornament({ color }: { color: string }) {
  return (
    <View style={styles.ornament}>
      <View style={[styles.line, { backgroundColor: withAlpha(color, 0.45) }]} />
      <AppText color={color} style={styles.star}>✦</AppText>
      <View style={[styles.line, { backgroundColor: withAlpha(color, 0.45) }]} />
    </View>
  );
}

export function ShareCard({ ref, format, color, art, kicker, title, phrase, footer, appName, date, extra }: Props) {
  const { colors } = useTheme();
  const story = format === 'story';
  const h = story ? SHARE_W * (16 / 9) : SHARE_W;
  const stars = makeStars(SHARE_W, h, 0.0009);
  return (
    <View ref={ref} collapsable={false} style={[styles.card, { width: SHARE_W, height: h, backgroundColor: colors.background }]}>
      <Svg width={SHARE_W} height={h} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy={story ? '34%' : '38%'} r="65%">
            <Stop offset="0" stopColor={color} stopOpacity={0.32} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="floor" cx="50%" cy="100%" r="60%">
            <Stop offset="0" stopColor={colors.gold} stopOpacity={0.14} />
            <Stop offset="1" stopColor={colors.gold} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={SHARE_W} height={h} fill="url(#glow)" />
        <Rect x={0} y={0} width={SHARE_W} height={h} fill="url(#floor)" />
        {stars.map((s, i) => <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill={colors.star} opacity={0.55} />)}
      </Svg>
      <View pointerEvents="none" style={[styles.frame, { borderColor: withAlpha(color, 0.4) }]} />
      <View pointerEvents="none" style={[styles.frameInner, { borderColor: withAlpha(color, 0.14) }]} />

      <View style={[styles.inner, { paddingTop: story ? 52 : 30, paddingBottom: story ? 40 : 26 }]}>
        <View style={styles.top}>
          <AppText variant="label" color={color} center>{kicker}</AppText>
          {date ? <AppText variant="caption" muted center>{date}</AppText> : null}
        </View>
        <View style={[styles.middle, { gap: story ? 20 : 10 }]}>
          <View style={styles.art}>{art}</View>
          <AppText center style={{ fontFamily: fonts.title, fontSize: story ? 40 : 28, lineHeight: story ? 46 : 32 }}>{title}</AppText>
          {story ? <Ornament color={color} /> : null}
          {phrase ? <AppText center muted style={{ fontSize: story ? 16 : 13, lineHeight: story ? 24 : 18 }} numberOfLines={story ? 6 : 3}>{phrase}</AppText> : null}
          {extra}
        </View>
        <View style={styles.footer}>
          <ConstellationLogo size={story ? 40 : 28} still />
          <View>
            <AppText variant="bodyStrong" gold style={!story && styles.small}>{appName}</AppText>
            <AppText variant="caption" muted style={!story && styles.tiny}>{footer}</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  frame: { position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, borderWidth: 1, borderRadius: 22 },
  frameInner: { position: 'absolute', top: 19, left: 19, right: 19, bottom: 19, borderWidth: 1, borderRadius: 18 },
  inner: { flex: 1, paddingHorizontal: 34, alignItems: 'center', justifyContent: 'space-between' },
  top: { alignItems: 'center', gap: 4 },
  middle: { alignItems: 'center', alignSelf: 'stretch' },
  art: { alignItems: 'center', justifyContent: 'center' },
  ornament: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { width: 54, height: 1 },
  star: { fontSize: 14, lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  small: { fontSize: 13, lineHeight: 18 },
  tiny: { fontSize: 10, lineHeight: 14 },
});
