import { Pressable, StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';
import { AppText } from './app-text';
import { CheckIcon } from './icons';

type Props = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

/** Opção selecionável (idioma, tema…), com borda dourada quando escolhida. */
export function OptionRow({ label, description, selected, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: selected ? colors.goldSoft : colors.surfaceGlass,
          borderColor: selected ? colors.gold : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}>
      <View style={styles.text}>
        <AppText variant="bodyStrong">{label}</AppText>
        {description ? <AppText variant="caption" muted>{description}</AppText> : null}
      </View>
      <View style={[styles.check, { borderColor: selected ? colors.gold : colors.border, backgroundColor: selected ? colors.gold : 'transparent' }]}>
        {selected ? <CheckIcon size={16} color={colors.onGold} strokeWidth={2.2} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    minHeight: 60,
  },
  text: { flex: 1, gap: 2 },
  check: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
