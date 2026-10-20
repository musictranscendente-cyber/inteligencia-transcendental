import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/components/coming-soon';
import { TodayIcon } from '@/components/icons';
import { useProfile } from '@/storage/profile';
import { useTheme } from '@/theme';

export default function TodayScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const profile = useProfile();
  const firstName = profile?.fullName.split(' ')[0] ?? '';
  return (
    <ComingSoon
      kicker={t('screens.today.greeting', { name: firstName })}
      title={t('screens.today.title')}
      description={t('screens.today.description')}
      color={colors.gold}
      Icon={TodayIcon}
    />
  );
}
