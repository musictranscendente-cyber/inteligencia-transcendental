import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import type { ComponentType } from 'react';
import { Linking, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { GlassCard } from '@/components/glass-card';
import { BookIcon, ChevronIcon, CyclesIcon, OracleIcon, ProfileIcon, ShareIcon, SparkIcon, type IconProps } from '@/components/icons';
import { ScreenHeader } from '@/components/screen-header';
import { firstName } from '@/engines/reading';
import { LANGUAGES } from '@/i18n';
import { CONFIG } from '@/services/config';
import { usePremium } from '@/services/purchases';
import { accountStore } from '@/storage/app-data';
import { useProfile } from '@/storage/profile';
import { fonts, spacing, useTheme, withAlpha } from '@/theme';

const PACKAGE = 'com.transcendental.inteligencia';

type Item = { label: string; hint?: string; icon: ComponentType<IconProps>; color: string; onPress: () => void };

function Group({ title, items }: { title: string; items: Item[] }) {
  const { colors } = useTheme();
  return (
    <View style={styles.group}>
      <AppText variant="label" gold>{title}</AppText>
      <GlassCard style={styles.list}>
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <Pressable
              key={it.label}
              onPress={it.onPress}
              accessibilityRole="button"
              style={({ pressed }) => [styles.item, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }, { opacity: pressed ? 0.7 : 1 }]}>
              <View style={[styles.icon, { backgroundColor: withAlpha(it.color, 0.14) }]}>
                <Icon size={20} color={it.color} />
              </View>
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{it.label}</AppText>
                {it.hint ? <AppText variant="caption" muted numberOfLines={1}>{it.hint}</AppText> : null}
              </View>
              <ChevronIcon size={16} color={colors.textMuted} strokeWidth={2} />
            </Pressable>
          );
        })}
      </GlassCard>
    </View>
  );
}

export default function MenuScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const profile = useProfile();
  const account = accountStore.useValue();
  const premium = usePremium();
  const tc = colors.technique;
  const go = (href: Href) => () => router.push(href);
  const language = LANGUAGES.find((l) => l.code === i18n.language)?.label ?? i18n.language;
  const name = profile ? firstName(profile.fullName) : '';
  const initial = (account?.name ?? profile?.fullName ?? '?').charAt(0).toUpperCase();

  const shareApp = () =>
    Share.share({ message: t('menu.shareMessage', { app: t('app.name'), url: `https://play.google.com/store/apps/details?id=${PACKAGE}` }) }).catch(() => {});
  const rate = () => Linking.openURL(`market://details?id=${PACKAGE}`).catch(() => Linking.openURL(`https://play.google.com/store/apps/details?id=${PACKAGE}`));

  const about: Item[] = [
    { label: t('menu.shareApp'), icon: ShareIcon, color: colors.gold, onPress: shareApp },
    { label: t('menu.rate'), icon: SparkIcon, color: colors.gold, onPress: rate },
    ...(CONFIG.supportEmail ? [{ label: t('menu.contact'), hint: CONFIG.supportEmail, icon: ProfileIcon, color: tc.numerology, onPress: () => Linking.openURL(`mailto:${CONFIG.supportEmail}`) }] : []),
    { label: t('menu.privacy'), icon: BookIcon, color: tc.humanDesign, onPress: go({ pathname: '/legal/[doc]', params: { doc: 'privacy' } }) },
    { label: t('menu.terms'), icon: BookIcon, color: tc.humanDesign, onPress: go({ pathname: '/legal/[doc]', params: { doc: 'terms' } }) },
  ];

  return (
    <View style={styles.flex}>
      <ScreenHeader title={t('menu.title')} hideProfile />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={go('/profile')} accessibilityRole="button">
          <GlassCard accent={colors.gold} style={styles.me}>
            {account?.photo ? (
              <Image source={{ uri: account.photo }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.initial, { backgroundColor: withAlpha(colors.gold, 0.16) }]}>
                <AppText style={styles.initialText} gold>{initial}</AppText>
              </View>
            )}
            <View style={styles.flex}>
              <AppText variant="subtitle">{profile?.fullName ?? name}</AppText>
              <AppText variant="caption" muted>{account?.email ?? t('menu.profileHint')}</AppText>
            </View>
            <ChevronIcon size={18} color={colors.gold} strokeWidth={2} />
          </GlassCard>
        </Pressable>

        <Group
          title={t('menu.account')}
          items={[
            { label: t('menu.profile'), hint: t('menu.profileHint'), icon: ProfileIcon, color: colors.gold, onPress: go('/profile') },
            { label: t('menu.language'), hint: language, icon: CyclesIcon, color: tc.astrology, onPress: go('/language') },
            { label: t('menu.subscription'), hint: premium ? t('paywall.active') : t('paywall.subtitle'), icon: SparkIcon, color: colors.gold, onPress: go('/paywall') },
          ]}
        />
        <Group
          title={t('menu.explore')}
          items={[
            { label: t('menu.library'), icon: BookIcon, color: tc.numerology, onPress: go('/library') },
            { label: t('menu.history'), icon: OracleIcon, color: tc.tarot, onPress: go('/oracle/history') },
            { label: t('menu.wrapped'), icon: CyclesIcon, color: tc.oracles, onPress: go('/wrapped') },
          ]}
        />
        <Group title={t('menu.about')} items={about} />

        <AppText variant="caption" muted center>
          {`${t('app.name')} · ${t('menu.version', { version: Constants.expoConfig?.version ?? '1.0.0' })}`}
        </AppText>
        <AppText variant="caption" muted center>{t('profile.disclaimer')}</AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.lg, paddingBottom: spacing.xxl },
  me: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  initial: { alignItems: 'center', justifyContent: 'center' },
  initialText: { fontFamily: fonts.title, fontSize: 26, lineHeight: 32 },
  group: { gap: spacing.sm },
  list: { padding: 0, paddingHorizontal: spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
