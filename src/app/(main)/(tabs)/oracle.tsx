import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/components/coming-soon';
import { OracleIcon } from '@/components/icons';
import { useTheme } from '@/theme';

export default function OracleScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <ComingSoon
      title={t('screens.oracle.title')}
      description={t('screens.oracle.description')}
      color={colors.technique.tarot}
      Icon={OracleIcon}
    />
  );
}
