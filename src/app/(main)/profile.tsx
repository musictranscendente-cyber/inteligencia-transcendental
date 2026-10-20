import { router } from 'expo-router';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { GlassCard } from '@/components/glass-card';
import { BackIcon } from '@/components/icons';
import { OptionRow } from '@/components/option-row';
import { Pill, RowCard } from '@/components/ui/bits';
import { langOf } from '@/content/types';
import { deviceLanguage, LANGUAGES, languageIndex } from '@/i18n';
import { formatLongDate } from '@/i18n/format';
import { formatOffset } from '@/lib/birth';
import { placeSubtitle } from '@/lib/cities';
import { CONFIG } from '@/services/config';
import { disableNotifications, enableNotifications, scheduleDaily } from '@/services/notifications';
import { paywallEnabled, usePremium } from '@/services/purchases';
import { prefsStore } from '@/storage/app-data';
import { eraseAllData, useProfile } from '@/storage/profile';
import { reloadSettings, setLanguagePreference, setThemePreference, useSettings, type ThemePreference } from '@/storage/settings';
import { radius, spacing, useTheme } from '@/theme';

const THEMES: ThemePreference[] = ['dark', 'light', 'system'];
const TIMES: [number, number][] = [[7, 0], [8, 30], [12, 0], [19, 0], [21, 30]];

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const profile = useProfile();
  const settings = useSettings();
  const prefs = prefsStore.use();
  const premium = usePremium();
  const lang = langOf(i18n.language);

  const erase = () => {
    const run = () => {
      eraseAllData();
      reloadSettings();
      i18n.changeLanguage(deviceLanguage());
      disableNotifications().catch(() => {});
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
  const pad = (n: number) => String(n).padStart(2, '0');

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
          <GlassCard style={styles.gapSm}>
            <AppText variant="subtitle">{profile.fullName}</AppText>
            <AppText muted>{`${formatLongDate(t, i18n.language, year, month, day)} · ${profile.birthTime ?? t('onboarding.review.timeUnknown')}`}</AppText>
            <AppText muted>{`${profile.place.name} · ${placeSubtitle(profile.place, languageIndex(i18n.language))}`}</AppText>
            <AppText variant="caption" muted>{t('onboarding.review.timezone', { offset: formatOffset(profile.utcOffsetMinutes) })}</AppText>
            <Button variant="secondary" title={t('profile.edit')} onPress={() => router.push('/profile-edit')} />
          </GlassCard>
        </Section>

        <Section title={t('settings.subscription')}>
          <RowCard
            title={premium ? t('paywall.active') : t('paywall.title')}
            subtitle={paywallEnabled() ? t('paywall.subtitle') : t('paywall.notConfigured')}
            color={colors.gold}
            onPress={() => router.push('/paywall')}
          />
        </Section>

        <Section title={t('profile.appearance')}>
          {THEMES.map((theme) => (
            <OptionRow key={theme} label={t(`profile.theme.${theme}`)} selected={settings.theme === theme} onPress={() => setThemePreference(theme)} />
          ))}
        </Section>

        <Section title={t('profile.language')}>
          {LANGUAGES.map((l) => (
            <OptionRow
              key={l.code}
              label={l.label}
              selected={i18n.language === l.code}
              onPress={() => {
                i18n.changeLanguage(l.code);
                setLanguagePreference(l.code);
              }}
            />
          ))}
        </Section>

        <Section title={t('settings.readings')}>
          <View style={styles.row}>
            <AppText style={styles.flex}>{t('settings.reversals')}</AppText>
            <Pill label={prefs.reversals ? t('settings.on') : t('settings.off')} active={prefs.reversals} onPress={() => prefsStore.set((p) => ({ ...p, reversals: !p.reversals }))} />
          </View>
          <View style={styles.row}>
            <AppText style={styles.flex}>{t('astro.houseSystem')}</AppText>
            <Pill label={t('astro.placidus')} active={prefs.houseSystem === 'placidus'} onPress={() => prefsStore.set((p) => ({ ...p, houseSystem: 'placidus' }))} />
            <Pill label={t('astro.whole')} active={prefs.houseSystem === 'whole'} onPress={() => prefsStore.set((p) => ({ ...p, houseSystem: 'whole' }))} />
          </View>
        </Section>

        <Section title={t('settings.notifications')}>
          <View style={styles.row}>
            <AppText style={styles.flex}>{t('settings.notifications')}</AppText>
            <Pill
              label={prefs.notifications ? t('settings.on') : t('settings.off')}
              active={prefs.notifications}
              onPress={() => (prefs.notifications ? disableNotifications() : enableNotifications(lang, t('app.name')))}
            />
          </View>
          {prefs.notifications ? (
            <>
              <AppText variant="caption" muted>{t('settings.notifyTime')}</AppText>
              <View style={styles.pills}>
                {TIMES.map(([h, m]) => (
                  <Pill
                    key={`${h}${m}`}
                    label={`${pad(h)}:${pad(m)}`}
                    active={prefs.notifyHour === h && prefs.notifyMinute === m}
                    onPress={() => {
                      prefsStore.set((p) => ({ ...p, notifyHour: h, notifyMinute: m }));
                      scheduleDaily(lang, t('app.name')).catch(() => {});
                    }}
                  />
                ))}
              </View>
            </>
          ) : null}
        </Section>

        <Section title={t('settings.library')}>
          <RowCard title={t('lib.title')} subtitle={t('lib.disclaimer')} onPress={() => router.push('/library')} />
        </Section>

        <Section title={t('settings.privacy')}>
          <AppText muted>{t('settings.privacyText')}</AppText>
        </Section>

        <Pressable
          onPress={() => (CONFIG.meditationAppUrl ? Linking.openURL(CONFIG.meditationAppUrl) : undefined)}
          accessibilityRole="link"
          style={[styles.banner, { borderColor: colors.border }]}>
          <AppText variant="caption" muted center>{t('profile.meditation')}</AppText>
          {CONFIG.meditationAppUrl ? <AppText variant="caption" gold center>{t('settings.meditationCta')}</AppText> : null}
        </Pressable>

        <Pressable onPress={erase} accessibilityRole="button" style={({ pressed }) => [styles.erase, { borderColor: colors.danger, opacity: pressed ? 0.7 : 1 }]}>
          <AppText variant="bodyStrong" color={colors.danger}>{t('profile.erase')}</AppText>
        </Pressable>
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
  gapSm: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  banner: { borderWidth: 1, borderStyle: 'dashed', borderRadius: radius.card, padding: spacing.md, gap: 4 },
  erase: { borderWidth: 1, borderRadius: radius.pill, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
});
