import { Text, type TextProps } from 'react-native';

import { fonts, useTheme } from '@/theme';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'bodyStrong' | 'caption' | 'label';

const variants = {
  display: { fontFamily: fonts.title, fontSize: 40, lineHeight: 44 },
  title: { fontFamily: fonts.title, fontSize: 30, lineHeight: 36 },
  subtitle: { fontFamily: fonts.titleMedium, fontSize: 21, lineHeight: 27 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 12, lineHeight: 16, letterSpacing: 1.4, textTransform: 'uppercase' as const },
};

export type AppTextProps = TextProps & {
  variant?: Variant;
  muted?: boolean;
  gold?: boolean;
  color?: string;
  center?: boolean;
};

export function AppText({ variant = 'body', muted, gold, color, center, style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  const tint = color ?? (gold ? colors.gold : muted ? colors.textMuted : colors.text);
  return (
    <Text
      maxFontSizeMultiplier={1.6}
      accessibilityRole={variant === 'display' || variant === 'title' ? 'header' : undefined}
      style={[variants[variant], { color: tint }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
