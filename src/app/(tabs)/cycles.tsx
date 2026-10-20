import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/components/coming-soon';
import { CyclesIcon } from '@/components/icons';
import { useTheme } from '@/theme';

export default function CyclesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <ComingSoon
      title={t('screens.cycles.title')}
      description={t('screens.cycles.description')}
      color={colors.technique.humanDesign}
      Icon={CyclesIcon}
    />
  );
}
