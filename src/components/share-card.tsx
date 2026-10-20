/** Card de compartilhamento: 9:16 (Stories) ou 1:1 (feed). Nunca mostra data, hora ou local de nascimento. */
import type { ComponentRef, ReactNode, Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/app-text';
import { ConstellationLogo } from '@/components/constellation-logo';
import { makeStars } from '@/components/starfield-data';
import { fonts, useTheme } from '@/theme';

export type ShareFormat = 'story' | 'feed';
export const SHARE_W = 360;

type Props = { ref?: Ref<ComponentRef<typeof View>>; format: ShareFormat; color: string; art: ReactNode; kicker: string; title: string; phrase: string; footer: string; appName: string };

export function ShareCard({ ref, format, color, art, kicker, title, phrase, footer, appName }: Props) {
  const { colors } = useTheme();
  const h = format === 'story' ? SHARE_W * (16 / 9) : SHARE_W;
  const stars = makeStars(SHARE_W, h, 0.0009);
  const story = format === 'story';
  return (
    <View ref={ref} collapsable={false} style={[styles.card, { width: SHARE_W, height: h, backgroundColor: colors.background, borderColor: color }]}>
      <Svg width={SHARE_W} height={h} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy={story ? '36%' : '40%'} r="70%">
            <Stop offset="0" stopColor={color} stopOpacity={0.28} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={SHARE_W} height={h} fill="url(#glow)" />
        {stars.map((s, i) => <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill={colors.star} opacity={0.5} />)}
      </Svg>
      <View style={[styles.inner, { paddingVertical: story ? 48 : 24, gap: story ? 22 : 10 }]}>
        <AppText variant="label" color={color} center>{kicker}</AppText>
        <View style={styles.art}>{art}</View>
        <AppText center style={{ fontFamily: fonts.title, fontSize: story ? 40 : 30, lineHeight: story ? 46 : 34 }}>{title}</AppText>
        <AppText center muted style={{ fontSize: story ? 17 : 14, lineHeight: story ? 25 : 20 }}>{phrase}</AppText>
        <View style={styles.footer}>
          <ConstellationLogo size={story ? 46 : 32} still />
          <View>
            <AppText variant="bodyStrong" gold>{appName}</AppText>
            <AppText variant="caption" muted>{footer}</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1.5, borderRadius: 28, overflow: 'hidden' },
  inner: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'space-between' },
  art: { alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
