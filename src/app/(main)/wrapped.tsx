import { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { ConstellationLogo } from '@/components/constellation-logo';
import { TarotFace } from '@/components/tarot-face';
import { NumberRing } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { ShareButton } from '@/components/ui/share-button';
import { ANIMAL_EMOJI, ANIMALS_TEXT } from '@/content/chinese';
import { TRAITS_TEXT } from '@/content/misc';
import { PERSONAL_YEAR } from '@/content/numbers';
import { cardInfo } from '@/content/tarot';
import { MAJOR_ARCANA } from '@/content/tarot-major';
import { useLang } from '@/content/types';
import { firstName } from '@/engines/reading';
import { wrappedData } from '@/features/wrapped/data';
import { useReading } from '@/hooks/use-reading';
import { formatDate } from '@/lib/format';
import { historyStore, streakStore } from '@/storage/app-data';
import { fonts, spacing, useTheme } from '@/theme';

export default function WrappedScreen() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const r = useReading();
  const history = historyStore.use();
  const streak = streakStore.use();
  const [page, setPage] = useState(0);
  if (!r) return null;
  const d = wrappedData(r, history, streak);
  const tc = colors.technique;
  const pageW = width;
  const pageH = height * 0.72;

  const slides = [
    { color: colors.gold, body: <><ConstellationLogo size={160} /><AppText variant="display" center>{t('wrap.intro', { name: firstName(r.person.fullName) })}</AppText><AppText muted center>{t('wrap.range', { from: formatDate(d.start, i18n.language), to: formatDate(d.end, i18n.language) })}</AppText></> },
    { color: tc.numerology, body: <><AppText variant="subtitle" center>{t('wrap.pyTitle', { n: d.personalYear })}</AppText><NumberRing value={d.personalYear} color={tc.numerology} size={150} /><AppText variant="title" center color={tc.numerology}>{PERSONAL_YEAR[d.personalYear][lang].title}</AppText><AppText center>{PERSONAL_YEAR[d.personalYear][lang].text}</AppText></> },
    { color: tc.tarot, body: <><AppText variant="subtitle" center>{t('wrap.arcTitle')}</AppText><TarotFace id={`M${d.yearArcana}`} width={150} color={tc.tarot} /><AppText variant="title" center color={tc.tarot}>{MAJOR_ARCANA[d.yearArcana][lang].name}</AppText><AppText center>{MAJOR_ARCANA[d.yearArcana][lang].summary}</AppText></> },
    { color: tc.oracles, body: <><AppText variant="subtitle" center>{t('wrap.readingsTitle')}</AppText><AppText style={styles.big} color={tc.oracles}>{d.readings}</AppText><AppText variant="title" center>{t('wrap.readings', { n: d.readings })}</AppText><AppText center muted>{d.topCard ? t('wrap.topCard', { card: cardInfo(d.topCard, lang).name }) : t('wrap.noReadings')}</AppText></> },
    { color: tc.humanDesign, body: <><AppText variant="subtitle" center>{t('wrap.streakTitle', { n: d.daysOpened })}</AppText><AppText style={styles.big} color={tc.humanDesign}>{d.daysOpened}</AppText><AppText center>{t('wrap.streakBest', { n: d.bestStreak })}</AppText></> },
    ...(d.trait ? [{ color: colors.gold, body: <><AppText variant="subtitle" center>{t('wrap.traitTitle')}</AppText><AppText variant="display" center color={colors.gold}>{TRAITS_TEXT[d.trait][lang].label}</AppText><AppText center>{TRAITS_TEXT[d.trait][lang].gift}</AppText></> }] : []),
    { color: tc.chinese, body: <><AppText variant="subtitle" center>{t('wrap.chineseTitle')}</AppText><AppText style={styles.big} color={tc.chinese}>{ANIMAL_EMOJI[d.chinese.animal]}</AppText><AppText variant="title" center>{ANIMALS_TEXT[d.chinese.animal][lang].name}</AppText><AppText center muted>{ANIMALS_TEXT[d.chinese.animal][lang].summary}</AppText></> },
    { color: tc.astrology, body: <><AppText variant="subtitle" center>{t('wrap.nextTitle', { n: d.nextPersonalYear })}</AppText><NumberRing value={d.nextPersonalYear} color={tc.astrology} size={140} /><AppText variant="title" center color={tc.astrology}>{PERSONAL_YEAR[d.nextPersonalYear][lang].title}</AppText><AppText center>{PERSONAL_YEAR[d.nextPersonalYear][lang].text}</AppText></> },
    { color: colors.gold, body: <><ConstellationLogo size={140} /><AppText variant="title" center>{t('wrap.outro')}</AppText><AppText center gold>{t('app.name')}</AppText></> },
  ];

  return (
    <Screen title={t('cyc.wrapped')} scroll={false} right={<ShareButton template="wrapped" params={{ slide: String(page) }} />}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / pageW))}
        onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / pageW))}
        scrollEventThrottle={64}>
        {slides.map((s, i) => (
          <View key={i} style={[styles.page, { width: pageW, height: pageH }]}>
            <View style={[styles.slide, { borderColor: s.color }]}>
              {i === page ? (
                <Animated.View entering={ZoomIn.duration(500)} style={styles.inner}>
                  {s.body}
                </Animated.View>
              ) : (
                <View style={styles.inner}>{s.body}</View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <Animated.View entering={FadeInDown} style={styles.dots}>
        {slides.map((s, i) => <View key={i} style={[styles.dot, { backgroundColor: i === page ? colors.gold : colors.border }]} />)}
      </Animated.View>
      <AppText variant="caption" muted center>{t('wrap.swipe')}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  slide: { flex: 1, borderWidth: 1, borderRadius: 28, padding: spacing.lg, justifyContent: 'center' },
  inner: { alignItems: 'center', gap: spacing.lg },
  big: { fontFamily: fonts.title, fontSize: 96, lineHeight: 110 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
