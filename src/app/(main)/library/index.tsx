import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { RowCard } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { LIBRARY, type LibraryKey } from '@/content/library';
import { useLang } from '@/content/types';
import { useTheme } from '@/theme';

export default function LibraryScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const tc = colors.technique;
  const color: Record<LibraryKey, string> = { numerology: tc.numerology, tarot: tc.tarot, astrology: tc.astrology, humanDesign: tc.humanDesign, chinese: tc.chinese, angel: tc.angel, lenormand: tc.oracles, iching: colors.gold, runes: tc.humanDesign, chakras: '#46A758' };
  return (
    <Screen title={t('lib.title')}>
      {(Object.keys(LIBRARY) as LibraryKey[]).map((k) => (
        <RowCard key={k} title={LIBRARY[k][lang].title} subtitle={`${LIBRARY[k][lang].what.split('.')[0]}.`} color={color[k]} onPress={() => router.push({ pathname: '/library/[key]', params: { key: k } })} />
      ))}
      <AppText variant="caption" muted center>{t('lib.disclaimer')}</AppText>
    </Screen>
  );
}
