import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Screen } from '@/components/ui/screen';
import { BirthForm, fromStored, isComplete, toStored } from '@/features/forms/birth-form';
import { saveProfile, useProfile } from '@/storage/profile';
import { synthesisStore } from '@/storage/app-data';

export default function ProfileEditScreen() {
  const { t } = useTranslation();
  const profile = useProfile();
  const [value, setValue] = useState(() => (profile ? fromStored(profile) : null));
  if (!profile || !value) return null;
  return (
    <Screen title={t('profile.edit')}>
      <BirthForm value={value} onChange={setValue} />
      <Button
        title={t('common.save')}
        disabled={!isComplete(value)}
        onPress={() => {
          saveProfile(toStored(value));
          synthesisStore.set(null);
          router.back();
        }}
      />
    </Screen>
  );
}
