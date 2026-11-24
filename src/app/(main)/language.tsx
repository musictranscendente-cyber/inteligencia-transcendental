import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { OptionRow } from '@/components/option-row';
import { Screen } from '@/components/ui/screen';
import { langOf } from '@/content/types';
import { LANGUAGES } from '@/i18n';
import { scheduleDaily } from '@/services/notifications';
import { setLanguagePreference } from '@/storage/settings';

/** Escolha do idioma do app (telas e leituras). */
export default function LanguageScreen() {
  const { t, i18n } = useTranslation();
  return (
    <Screen title={t('menu.language')}>
      <AppText muted>{t('menu.languageHint')}</AppText>
      {LANGUAGES.map((l) => (
        <OptionRow
          key={l.code}
          label={l.label}
          description={l.english}
          selected={i18n.language === l.code}
          onPress={async () => {
            await i18n.changeLanguage(l.code);
            setLanguagePreference(l.code);
            // O lembrete diário é escrito no idioma escolhido.
            scheduleDaily(langOf(l.code), t('app.name')).catch(() => {});
          }}
        />
      ))}
    </Screen>
  );
}
