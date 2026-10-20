import { router, type ErrorBoundaryProps } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import i18n from '@/i18n';

/** Mostra o erro em vez de uma tela em branco, para o usuário poder mandar um print. */
export function ErrorScreen({ error, retry }: ErrorBoundaryProps) {
  const goHome = () => {
    try {
      router.replace('/');
    } catch {
      retry();
    }
  };
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{i18n.t('error.title')}</Text>
      <Text style={styles.hint}>{i18n.t('error.hint')}</Text>
      <Text style={styles.detail} selectable>{`${error.name}: ${error.message}\n\n${(error.stack ?? '').split('\n').slice(0, 6).join('\n')}`}</Text>
      <Pressable style={styles.button} onPress={retry} accessibilityRole="button">
        <Text style={styles.buttonText}>{i18n.t('error.retry')}</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.secondary]} onPress={goHome} accessibilityRole="button">
        <Text style={[styles.buttonText, styles.secondaryText]}>{i18n.t('error.home')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0B0A1A' },
  content: { padding: 24, paddingTop: 80, gap: 16 },
  title: { color: '#F4EFE6', fontSize: 22, fontWeight: '600' },
  hint: { color: '#B9B3C9', fontSize: 15, lineHeight: 22 },
  detail: { color: '#E8A0A0', fontSize: 12, fontFamily: 'monospace', backgroundColor: '#1A1830', padding: 12, borderRadius: 12 },
  button: { backgroundColor: '#D9B56A', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#1A1426', fontSize: 16, fontWeight: '600' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D9B56A' },
  secondaryText: { color: '#D9B56A' },
});
