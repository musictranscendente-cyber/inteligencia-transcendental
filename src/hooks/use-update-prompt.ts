import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Alert, AppState, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * No APK: ao abrir o app (e ao voltar para ele), procura uma atualização publicada com `eas update`.
 * Se houver, baixa e pergunta se quer reiniciar agora para usar a versão nova.
 */
export function useUpdatePrompt() {
  const { t } = useTranslation();

  useEffect(() => {
    if (Platform.OS === 'web' || __DEV__ || !Updates.isEnabled) return;
    let busy = false;
    let asked = false;

    const check = async () => {
      if (busy || asked) return;
      busy = true;
      try {
        const { isAvailable } = await Updates.checkForUpdateAsync();
        if (!isAvailable) return;
        const { isNew } = await Updates.fetchUpdateAsync();
        if (!isNew) return;
        asked = true;
        Alert.alert(t('updates.title'), t('updates.message'), [
          { text: t('updates.later'), style: 'cancel' },
          { text: t('updates.now'), onPress: () => Updates.reloadAsync() },
        ]);
      } catch {
        // Sem internet ou servidor fora do ar: tenta de novo na próxima abertura.
      } finally {
        busy = false;
      }
    };

    check();
    const sub = AppState.addEventListener('change', (state) => state === 'active' && check());
    return () => sub.remove();
  }, [t]);
}
