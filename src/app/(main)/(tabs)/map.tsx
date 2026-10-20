import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/components/coming-soon';
import { MapIcon } from '@/components/icons';
import { useTheme } from '@/theme';

export default function MyMapScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <ComingSoon
      title={t('screens.myMap.title')}
      description={t('screens.myMap.description')}
      color={colors.technique.numerology}
      Icon={MapIcon}
    />
  );
}
