import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ShareIcon } from '@/components/icons';
import { useTheme } from '@/theme';

/** Abre a tela de compartilhamento com o modelo de card indicado. */
export function ShareButton({ template, params, color }: { template: string; params?: Record<string, string>; color?: string }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Pressable onPress={() => router.push({ pathname: '/share', params: { template, ...params } })} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('common.share')}>
      <ShareIcon color={color ?? colors.gold} />
    </Pressable>
  );
}
