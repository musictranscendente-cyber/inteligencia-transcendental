import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { fonts, radius, useTheme } from '@/theme';
import { AppText } from './app-text';

const ITEM_HEIGHT = 46;
const VISIBLE = 5;

type Props = {
  items: string[];
  index: number;
  onChange: (index: number) => void;
  label: string;
  width?: number;
};

/** Coluna giratória (estilo roleta) com encaixe, vibração leve e itens que esmaecem nas bordas. */
export function WheelPicker({ items, index, onChange, label, width = 90 }: Props) {
  const { colors } = useTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const offset = useSharedValue(index * ITEM_HEIGHT);
  const current = useSharedValue(index);
  const lastReported = useRef(index);
  // Ignora os eventos de rolagem até a roda ser posicionada no valor inicial.
  const ready = useSharedValue(false);

  // Mantém a roda na posição certa quando o valor muda por fora (ex.: dia 31 → 30).
  useEffect(() => {
    if (index !== lastReported.current) {
      lastReported.current = index;
      current.set(index);
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    }
  }, [index, current, scrollRef]);

  // Ao sair de cena (animação de saída), a lista pode "rolar" para o topo: isso não é escolha da pessoa.
  useEffect(() => () => ready.set(false), [ready]);

  const report = (i: number) => {
    if (!ready.get() || i === lastReported.current) return;
    lastReported.current = i;
    if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
    onChange(i);
  };

  const onScroll = useAnimatedScrollHandler((e) => {
    offset.set(e.contentOffset.y);
    if (!ready.get()) return;
    const i = Math.min(items.length - 1, Math.max(0, Math.round(e.contentOffset.y / ITEM_HEIGHT)));
    if (i !== current.get()) {
      current.set(i);
      scheduleOnRN(report, i);
    }
  });

  return (
    <View style={{ width }} accessible accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ text: items[index] }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        const next = e.nativeEvent.actionName === 'increment' ? Math.min(items.length - 1, index + 1) : Math.max(0, index - 1);
        scrollRef.current?.scrollTo({ y: next * ITEM_HEIGHT, animated: true });
      }}>
      <AppText variant="label" muted center style={styles.label}>
        {label}
      </AppText>
      <View style={{ height: ITEM_HEIGHT * VISIBLE }}>
        <View
          pointerEvents="none"
          style={[styles.band, { borderColor: colors.gold, backgroundColor: colors.goldSoft, top: ITEM_HEIGHT * 2 }]}
        />
        <Animated.ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          nestedScrollEnabled
          onLayout={() => {
            if (ready.get()) return;
            scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
            offset.set(index * ITEM_HEIGHT);
            requestAnimationFrame(() => requestAnimationFrame(() => ready.set(true)));
          }}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}>
          {items.map((item, i) => (
            <WheelItem key={i} text={item} i={i} offset={offset} color={colors.text} />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

function WheelItem({ text, i, offset, color }: { text: string; i: number; offset: SharedValue<number>; color: string }) {
  const style = useAnimatedStyle(() => {
    const d = Math.abs(offset.get() / ITEM_HEIGHT - i);
    return {
      opacity: interpolate(d, [0, 1, 2.5], [1, 0.45, 0.12], 'clamp'),
      transform: [{ scale: interpolate(d, [0, 2], [1.08, 0.86], 'clamp') }],
    };
  });
  return (
    <Animated.View style={[styles.item, style]}>
      <AppText numberOfLines={1} style={[styles.itemText, { color }]}>
        {text}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6 },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  item: { height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  itemText: { fontFamily: fonts.titleMedium, fontSize: 22, fontVariant: ['lining-nums'] },
});
