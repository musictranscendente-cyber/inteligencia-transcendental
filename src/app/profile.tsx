import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { GlassCard } from '@/components/glass-card';
import { BackIcon, SparkIcon } from '@/components/icons';
import { OptionRow } from '@/components/option-row';
import { deviceLanguage, LANGUAGES, languageIndex } from '@/i18n';
import { formatLongDate } from '@/i18n/format';
import { formatOffset } from '@/lib/birth';
import { placeSubtitle } from '@/lib/cities';
import { eraseAllData, useProfile } from '@/storage/profile';
import { reloadSettings, setLanguagePreference, setThemePreference, useSettings, type ThemePreference } from '@/storage/settings';
import { radius, spacing, useTheme } from '@/theme';

const THEMES: ThemePreference[] = ['dark', 'light', 'system'];

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const profile = useProfile();
  const settings = useSettings();
  const moreItems = t('profile.moreItems', { returnObjects: true }) as string[];

  const erase = () => {
    const run = () => {
      eraseAllData();
      reloadSettings();
      i18n.changeLanguage(deviceLanguage());
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`${t('profile.eraseTitle')}\n\n${t('profile.eraseMessage')}`)) run();
      return;
    }
    Alert.alert(t('profile.eraseTitle'), t('profile.eraseMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.eraseConfirm'), style: 'destructive', onPress: run },
    ]);
  };

  if (!profile) return null;
  const [year, month, day] = profile.birthDate.split('-').map(Number);

  return (
    <View style={[styles.flex, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('common.back')}>
          <BackIcon color={colors.text} />
        </Pressable>
        <AppText variant="title">{t('profile.title')}</AppText>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Section title={t('profile.birthData')}>
          <GlassCard>
            <AppText variant="subtitle">{profile.fullName}</AppText>
            <AppText muted style={styles.line}>
              {`${formatLongDate(t, i18n.language, year, month, day)} · ${profile.birthTime ?? t('onboarding.review.timeUnknown')}`}
            </AppText>
            <AppText muted>{`${profile.place.name} · ${placeSubtitle(profile.place, languageIndex(i18n.language))}`}</AppText>
            <AppText variant="caption" muted style={styles.line}>
              {t('onboarding.review.timezone', { offset: formatOffset(profile.utcOffsetMinutes) })}
            </AppText>
          </GlassCard>
        </Section>

        <Section title={t('profile.appearance')}>
          {THEMES.map((theme) => (
            <OptionRow key={theme} label={t(`profile.theme.${theme}`)} selected={settings.theme === theme} onPress={() => setThemePreference(theme)} />
          ))}
        </Section>

        <Section title={t('profile.language')}>
          {LANGUAGES.map((lang) => (
            <OptionRow
              key={lang.code}
              label={lang.label}
              selected={i18n.language === lang.code}
              onPress={() => {
                i18n.changeLanguage(lang.code);
                setLanguagePreference(lang.code);
              }}
            />
          ))}
        </Section>

        <Section title={t('profile.more')}>
          <GlassCard style={styles.moreCard}>
            {moreItems.map((item) => (
              <View key={item} style={styles.moreRow}>
                <SparkIcon size={16} color={colors.gold} />
                <AppText muted>{item}</AppText>
              </View>
            ))}
          </GlassCard>
        </Section>

        <View style={[styles.banner, { borderColor: colors.border }]}>
          <AppText variant="caption" muted center>{t('profile.meditation')}</AppText>
        </View>

        <Pressable onPress={erase} accessibilityRole="button" style={({ pressed }) => [styles.erase, { borderColor: colors.danger, opacity: pressed ? 0.7 : 1 }]}>
          <AppText variant="bodyStrong" color={colors.danger}>{t('profile.erase')}</AppText>
        </Pressable>

        <AppText variant="caption" muted center>{t('profile.privacy')}</AppText>
        <AppText variant="caption" muted center>{t('profile.disclaimer')}</AppText>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="label" gold>{title}</AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  content: { padding: spacing.lg, gap: spacing.lg },
  section: { gap: spacing.sm },
  line: { marginTop: spacing.xs },
  moreCard: { gap: spacing.sm, paddingVertical: spacing.md },
  moreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  banner: { borderWidth: 1, borderStyle: 'dashed', borderRadius: radius.card, padding: spacing.md },
  erase: { borderWidth: 1, borderRadius: radius.pill, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
});
