/** Formulário de nascimento completo (nome, data, hora, cidade) para perfil e pessoas em Relações. */
import { useDeferredValue, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { CheckIcon, PinIcon, SearchIcon } from '@/components/icons';
import { SectionTitle } from '@/components/ui/bits';
import { WheelPicker } from '@/components/wheel-picker';
import { languageIndex } from '@/i18n';
import { daysInMonth, type BirthPlace } from '@/lib/birth';
import { placeSubtitle, searchCities } from '@/lib/cities';
import { fonts, noOutline, radius, spacing, useTheme } from '@/theme';

export type BirthFormValue = {
  fullName: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  timeUnknown: boolean;
  place: BirthPlace | null;
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const FIRST_YEAR = 1900;
const HOURS = Array.from({ length: 24 }, (_, i) => pad2(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad2(i));

export function fromStored(p: { fullName: string; birthDate: string; birthTime: string | null; place: BirthPlace }): BirthFormValue {
  const [year, month, day] = p.birthDate.split('-').map(Number);
  const [hour, minute] = (p.birthTime ?? '12:00').split(':').map(Number);
  return { fullName: p.fullName, year, month, day, hour, minute, timeUnknown: p.birthTime == null, place: p.place };
}

export function toStored(v: BirthFormValue) {
  return {
    fullName: v.fullName.trim().replace(/\s+/g, ' '),
    birthDate: `${v.year}-${pad2(v.month)}-${pad2(v.day)}`,
    birthTime: v.timeUnknown ? null : `${pad2(v.hour)}:${pad2(v.minute)}`,
    place: v.place!,
  };
}

export const isComplete = (v: BirthFormValue) => v.fullName.trim().split(/\s+/).filter((w) => /\p{L}/u.test(w)).length >= 1 && !!v.place;

export function BirthForm({ value, onChange, nameLabel }: { value: BirthFormValue; onChange: (v: BirthFormValue) => void; nameLabel?: string }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const lang = languageIndex(i18n.language);
  const months = t('months', { returnObjects: true }) as string[];
  const [query, setQuery] = useState(value.place?.name ?? '');
  const deferred = useDeferredValue(query);
  const results = useMemo(() => (value.place ? [] : searchCities(deferred, lang, 8)), [deferred, lang, value.place]);
  const lastYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: lastYear - FIRST_YEAR + 1 }, (_, i) => String(FIRST_YEAR + i)), [lastYear]);
  const maxDay = daysInMonth(value.year, value.month);
  const days = useMemo(() => Array.from({ length: maxDay }, (_, i) => pad2(i + 1)), [maxDay]);
  const set = (patch: Partial<BirthFormValue>) => {
    const next = { ...value, ...patch };
    next.day = Math.min(next.day, daysInMonth(next.year, next.month));
    onChange(next);
  };
  const inputStyle = [styles.input, noOutline, { color: colors.text, borderColor: colors.gold, backgroundColor: colors.surfaceGlass }];

  return (
    <View style={styles.gap}>
      <SectionTitle>{nameLabel ?? t('onboarding.name.placeholder')}</SectionTitle>
      <TextInput value={value.fullName} onChangeText={(fullName) => set({ fullName })} placeholder={t('onboarding.name.placeholder')} placeholderTextColor={colors.textMuted} autoCapitalize="words" autoCorrect={false} maxFontSizeMultiplier={1.6} style={inputStyle} />

      <SectionTitle>{t('onboarding.review.date')}</SectionTitle>
      <View style={styles.wheels}>
        <WheelPicker label={t('onboarding.date.day')} items={days} index={value.day - 1} onChange={(i) => set({ day: i + 1 })} width={64} />
        <WheelPicker label={t('onboarding.date.month')} items={months} index={value.month - 1} onChange={(i) => set({ month: i + 1 })} width={128} />
        <WheelPicker label={t('onboarding.date.year')} items={years} index={value.year - FIRST_YEAR} onChange={(i) => set({ year: FIRST_YEAR + i })} width={84} />
      </View>

      <SectionTitle>{t('onboarding.review.time')}</SectionTitle>
      {!value.timeUnknown ? (
        <View style={styles.wheels}>
          <WheelPicker label={t('onboarding.time.hour')} items={HOURS} index={value.hour} onChange={(hour) => set({ hour })} />
          <WheelPicker label={t('onboarding.time.minute')} items={MINUTES} index={value.minute} onChange={(minute) => set({ minute })} />
        </View>
      ) : null}
      <Pressable onPress={() => set({ timeUnknown: !value.timeUnknown })} accessibilityRole="checkbox" accessibilityState={{ checked: value.timeUnknown }} style={[styles.toggle, { borderColor: value.timeUnknown ? colors.gold : colors.border }]}>
        <View style={[styles.box, { borderColor: colors.gold, backgroundColor: value.timeUnknown ? colors.gold : 'transparent' }]}>
          {value.timeUnknown ? <CheckIcon size={16} color={colors.onGold} strokeWidth={2.2} /> : null}
        </View>
        <AppText>{t('onboarding.time.unknown')}</AppText>
      </Pressable>

      <SectionTitle>{t('onboarding.review.place')}</SectionTitle>
      <View style={[styles.search, { borderColor: colors.gold, backgroundColor: colors.surfaceGlass }]}>
        <SearchIcon size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (value.place) set({ place: null });
          }}
          placeholder={t('onboarding.place.placeholder')}
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          maxFontSizeMultiplier={1.6}
          style={[styles.searchInput, noOutline, { color: colors.text }]}
        />
      </View>
      {value.place ? (
        <View style={[styles.selected, { borderColor: colors.gold, backgroundColor: colors.goldSoft }]}>
          <PinIcon size={20} color={colors.gold} />
          <AppText style={styles.flex}>{`${value.place.name} · ${placeSubtitle(value.place, lang)}`}</AppText>
        </View>
      ) : (
        results.map((p) => (
          <Pressable
            key={`${p.name}|${p.state}|${p.countryCode}|${p.lat}`}
            onPress={() => {
              set({ place: p });
              setQuery(p.name);
            }}
            style={[styles.result, { borderBottomColor: colors.border }]}>
            <PinIcon size={16} color={colors.gold} />
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{p.name}</AppText>
              <AppText variant="caption" muted>{placeSubtitle(p, lang)}</AppText>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  input: { fontFamily: fonts.titleMedium, fontSize: 22, borderWidth: 1, borderRadius: radius.card, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  wheels: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderRadius: radius.card, paddingHorizontal: spacing.lg, minHeight: 52 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.4, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderRadius: radius.card, paddingHorizontal: spacing.md },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 17, paddingVertical: spacing.md },
  selected: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderRadius: radius.card, padding: spacing.md },
  result: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
});
