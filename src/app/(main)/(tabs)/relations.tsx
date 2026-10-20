import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/components/coming-soon';
import { RelationsIcon } from '@/components/icons';
import { useTheme } from '@/theme';

export default function RelationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <ComingSoon
      title={t('screens.relations.title')}
      description={t('screens.relations.description')}
      color={colors.technique.oracles}
      Icon={RelationsIcon}
    />
  );
}
