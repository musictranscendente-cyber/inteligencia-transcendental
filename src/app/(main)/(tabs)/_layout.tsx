import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { CyclesIcon, MapIcon, OracleIcon, RelationsIcon, TodayIcon } from '@/components/icons';
import { fonts, useTheme } from '@/theme';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // O céu estrelado fica atrás de tudo; a transição "fade" esconde as abas inativas.
        sceneStyle: { backgroundColor: 'transparent' },
        animation: 'fade',
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 64 + insets.bottom,
          paddingTop: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: t('tabs.today'), tabBarIcon: ({ color }) => <TodayIcon color={color} /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: t('tabs.myMap'), tabBarIcon: ({ color }) => <MapIcon color={color} /> }}
      />
      <Tabs.Screen
        name="relations"
        options={{ title: t('tabs.relations'), tabBarIcon: ({ color }) => <RelationsIcon color={color} /> }}
      />
      <Tabs.Screen
        name="oracle"
        options={{ title: t('tabs.oracle'), tabBarIcon: ({ color }) => <OracleIcon color={color} /> }}
      />
      <Tabs.Screen
        name="cycles"
        options={{ title: t('tabs.cycles'), tabBarIcon: ({ color }) => <CyclesIcon color={color} /> }}
      />
    </Tabs>
  );
}
