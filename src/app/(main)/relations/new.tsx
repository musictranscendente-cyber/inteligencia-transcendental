import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Pill, SectionTitle } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { BirthForm, isComplete, toStored, type BirthFormValue } from '@/features/forms/birth-form';
import { resolveBirth } from '@/lib/birth';
import { peopleStore, type Person } from '@/storage/app-data';
import { spacing, useTheme } from '@/theme';

const RELATIONS: Person['relation'][] = ['partner', 'child', 'friend', 'partnerBiz', 'family', 'other'];

export default function NewPersonScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [relation, setRelation] = useState<Person['relation']>('partner');
  const [value, setValue] = useState<BirthFormValue>({ fullName: '', year: 1990, month: 1, day: 1, hour: 12, minute: 0, timeUnknown: false, place: null });

  const save = () => {
    const s = toStored(value);
    const birth = resolveBirth({ date: s.birthDate, time: s.birthTime, timezone: s.place.timezone });
    const person: Person = { id: `${Date.now()}`, relation, ...s, birthUtc: birth.utc };
    peopleStore.set((p) => [...p, person]);
    router.replace({ pathname: '/relations/[id]', params: { id: person.id } });
  };

  return (
    <Screen title={t('rel.add')} accent={colors.technique.oracles}>
      <SectionTitle>{t('rel.relation')}</SectionTitle>
      <View style={styles.pills}>
        {RELATIONS.map((r) => <Pill key={r} label={t(`rel.types.${r}`)} active={relation === r} onPress={() => setRelation(r)} color={colors.technique.oracles} />)}
      </View>
      <BirthForm value={value} onChange={setValue} />
      {value.timeUnknown ? <AppText variant="caption" muted>{t('rel.noTimeOk')}</AppText> : null}
      <Button title={t('rel.saveP')} onPress={save} disabled={!isComplete(value)} />
    </Screen>
  );
}

const styles = StyleSheet.create({ pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
