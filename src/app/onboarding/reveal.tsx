import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { CardBack } from '@/components/card-back';
import { ConstellationLogo } from '@/components/constellation-logo';
import { SignGlyph } from '@/components/astro-glyphs';
import { TarotFace } from '@/components/tarot-face';
import { NumberRing } from '@/components/ui/bits';
import { FlipCard } from '@/components/ui/flip-card';
import { SIGNS_TEXT } from '@/content/astrology';
import { MAJOR_ARCANA } from '@/content/tarot-major';
import { useLang } from '@/content/types';
import { birthArcana } from '@/engines/arcana';
import { longitude } from '@/engines/astro/ephemeris';
import { signOf } from '@/engines/astro/chart';
import { destinyNumber } from '@/engines/numerology';
import { draftDate, draftTime, useOnboardingDraft } from '@/features/onboarding/draft';
import { resolveBirth } from '@/lib/birth';
import { kv } from '@/storage/kv';
import { saveProfile } from '@/storage/profile';
import { spacing, useTheme } from '@/theme';

const BUILD_MS = 5200;

/** Revelação: o "Mapa Transcendental" se monta e três cartas aparecem. */
export default function Reveal() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { draft } = useOnboardingDraft();
  const lang = useLang();
  const [revealed, setRevealed] = useState(false);
  const [flipped, setFlipped] = useState([false, false, false]);
  const date = draftDate(draft);
  const birthUtc = draft.place ? new Date(resolveBirth({ date, time: draftTime(draft), timezone: draft.place.timezone }).utc) : new Date();
  const destiny = destinyNumber(date);
  const arcana = birthArcana(date);
  const sunSign = signOf(longitude('sun', birthUtc));
  const moonSign = signOf(longitude('moon', birthUtc));
  const results = [
    MAJOR_ARCANA[arcana][lang].name,
    `${SIGNS_TEXT[sunSign][lang].name} · ${SIGNS_TEXT[moonSign][lang].name}`,
  ];
  const firstName = draft.fullName.trim().split(/\s+/)[0] ?? '';
  const labels = t('onboarding.reveal.cards', { returnObjects: true }) as string[];
  const accents = [colors.technique.numerology, colors.technique.tarot, colors.technique.astrology];

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
      [0, 1, 2].forEach((i) => setTimeout(() => setFlipped((f) => f.map((v, k) => (k === i ? true : v))), 1100 + i * 700));
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }, reduceMotion ? 600 : BUILD_MS);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  // Pulso suave do texto "Alinhando as estrelas…"
  const pulse = useSharedValue(0.4);
  useEffect(() => {
    if (!reduceMotion) pulse.set(withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [pulse, reduceMotion]);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.get() }));

  const enter = () => {
    if (!draft.place) return;
    // Ao salvar o perfil, a navegação troca sozinha para as abas do app.
    kv.setString('onboarding.welcome', '1');
    saveProfile({ fullName: draft.fullName, birthDate: draftDate(draft), birthTime: draftTime(draft), place: draft.place });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
      {!revealed ? (
        <Animated.View exiting={FadeOut.duration(400)} style={styles.center}>
          <ConstellationLogo size={260} duration={BUILD_MS - 600} />
          <Animated.View style={pulseStyle}>
            <AppText variant="subtitle" gold center>{t('onboarding.reveal.building')}</AppText>
          </Animated.View>
        </Animated.View>
      ) : (
        <>
          <View style={styles.center}>
            <Animated.View entering={FadeInDown.duration(700)}>
              <AppText variant="display" center>{t('onboarding.reveal.title')}</AppText>
              <AppText muted center style={styles.subtitle}>{t('onboarding.reveal.subtitle', { name: firstName })}</AppText>
            </Animated.View>
            <View style={styles.cards}>
              {labels.map((label, i) => (
                <Animated.View key={label} entering={FadeInDown.delay(400 + i * 260).duration(700)} style={styles.card}>
                  <View style={{ transform: [{ rotate: `${(i - 1) * 6}deg` }, { translateY: i === 1 ? -12 : 0 }] }}>
                    <FlipCard
                      width={92}
                      height={147}
                      flipped={flipped[i]}
                      back={<CardBack width={92} accent={accents[i]} />}
                      front={
                        <View style={[styles.face, { borderColor: accents[i], backgroundColor: colors.surface }]}>
                          {i === 0 ? <NumberRing value={destiny} color={accents[0]} size={64} /> : null}
                          {i === 1 ? <TarotFace id={`M${arcana}`} width={88} color={accents[1]} /> : null}
                          {i === 2 ? (
                            <View style={styles.signs}>
                              <SignGlyph sign={sunSign} size={40} color={accents[2]} />
                              <SignGlyph sign={moonSign} size={32} color={colors.textMuted} />
                            </View>
                          ) : null}
                        </View>
                      }
                    />
                  </View>
                  <AppText variant="caption" center color={accents[i]} style={styles.cardLabel}>{label}</AppText>
                  {flipped[i] ? <AppText variant="caption" center muted>{i === 0 ? String(destiny) : results[i - 1]}</AppText> : null}
                </Animated.View>
              ))}
            </View>
          </View>
          <Animated.View entering={FadeIn.delay(1500).duration(600)}>
            <Button title={t('onboarding.reveal.enter')} onPress={enter} />
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  subtitle: { marginTop: spacing.sm },
  cards: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  card: { alignItems: 'center', width: 96 },
  cardLabel: { marginTop: spacing.sm },
  face: { width: 92, height: 147, borderRadius: 10, borderWidth: 1.2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  signs: { alignItems: 'center', gap: 6 },
});
