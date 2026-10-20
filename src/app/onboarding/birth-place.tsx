import { router } from 'expo-router';
import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { PinIcon, SearchIcon } from '@/components/icons';
import { useOnboardingDraft } from '@/features/onboarding/draft';
import { StepScreen } from '@/features/onboarding/step-screen';
import { languageIndex } from '@/i18n';
import type { BirthPlace } from '@/lib/birth';
import { placeSubtitle, searchCities } from '@/lib/cities';
import { fonts, noOutline, radius, spacing, useTheme } from '@/theme';

const samePlace = (a: BirthPlace | null, b: BirthPlace) =>
  !!a && a.name === b.name && a.countryCode === b.countryCode && a.lat === b.lat && a.lon === b.lon;

export default function BirthPlaceStep() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { draft, update } = useOnboardingDraft();
  const lang = languageIndex(i18n.language);
  const [query, setQuery] = useState(draft.place?.name ?? '');
  const deferred = useDeferredValue(query);
  const results = useMemo(() => searchCities(deferred, lang), [deferred, lang]);
  const searching = deferred.trim().length >= 2;

  return (
    <StepScreen
      step="birth-place"
      title={t('onboarding.place.title')}
      hint={t('onboarding.place.hint')}
      cta={t('common.continue')}
      canContinue={!!draft.place}
      scroll={false}
      onNext={() => router.push('/onboarding/review')}>
      <View style={[styles.search, { borderColor: colors.gold, backgroundColor: colors.surfaceGlass }]}>
        <SearchIcon size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (draft.place) update({ place: null });
          }}
          placeholder={t('onboarding.place.placeholder')}
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          autoCapitalize="words"
          autoFocus={!draft.place}
          returnKeyType="search"
          accessibilityLabel={t('onboarding.place.placeholder')}
          maxFontSizeMultiplier={1.6}
          style={[styles.input, noOutline, { color: colors.text }]}
        />
      </View>

      {draft.place ? (
        <View style={[styles.selected, { borderColor: colors.gold, backgroundColor: colors.goldSoft }]} accessibilityLabel={t('onboarding.place.selected')}>
          <PinIcon size={22} color={colors.gold} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">{draft.place.name}</AppText>
            <AppText variant="caption" muted>{placeSubtitle(draft.place, lang)}</AppText>
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(p) => `${p.name}|${p.state}|${p.countryCode}|${p.lat}|${p.lon}`}
          ListHeaderComponent={!searching ? <AppText variant="caption" muted>{t('onboarding.place.tip')}</AppText> : undefined}
          ListEmptyComponent={searching ? <AppText muted style={styles.empty}>{t('onboarding.place.noResults')}</AppText> : undefined}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                update({ place: item });
                setQuery(item.name);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: samePlace(draft.place, item) }}
              style={({ pressed }) => [styles.result, { borderBottomColor: colors.border, opacity: pressed ? 0.6 : 1 }]}>
              <PinIcon size={18} color={colors.gold} />
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{item.name}</AppText>
                <AppText variant="caption" muted>{placeSubtitle(item, lang)}</AppText>
              </View>
            </Pressable>
          )}
        />
      )}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 17, paddingVertical: spacing.md },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.md,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  empty: { marginTop: spacing.md },
});
