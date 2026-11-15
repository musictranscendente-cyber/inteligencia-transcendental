/**
 * Login com Google (Android e iOS) via @react-native-google-signin/google-signin.
 * Sem o Client ID configurado, no navegador ou no Expo Go, o botão some e o app segue sem conta.
 * A conta identifica a pessoa na assinatura (RevenueCat), para a compra valer em outro celular.
 */
import { Platform } from 'react-native';

import { accountStore, type Account } from '@/storage/app-data';
import { CONFIG } from './config';
import { identifyPurchases, resetPurchasesUser } from './purchases';

type Module = typeof import('@react-native-google-signin/google-signin');

let mod: Module | null = null;

/** Login com Google disponível neste aparelho? */
export const googleEnabled = () => !!CONFIG.googleWebClientId && Platform.OS !== 'web';

async function load(): Promise<Module | null> {
  if (!googleEnabled()) return null;
  if (mod) return mod;
  try {
    // No Expo Go o módulo nativo não existe: a importação falha e o login fica oculto.
    const m = await import('@react-native-google-signin/google-signin');
    m.GoogleSignin.configure({ webClientId: CONFIG.googleWebClientId, iosClientId: CONFIG.googleIosClientId || undefined });
    mod = m;
  } catch (e) {
    console.warn('Login com Google indisponível', e);
  }
  return mod;
}

export type SignInResult = { ok: true; account: Account } | { ok: false; reason: 'cancelled' | 'unavailable' | 'error' };

export async function signInWithGoogle(): Promise<SignInResult> {
  const m = await load();
  if (!m) return { ok: false, reason: 'unavailable' };
  try {
    if (Platform.OS === 'android') await m.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const res = await m.GoogleSignin.signIn();
    if (res.type !== 'success') return { ok: false, reason: 'cancelled' };
    const { id, name, email, photo } = res.data.user;
    const account: Account = { provider: 'google', id, name, email, photo };
    accountStore.set(account);
    identifyPurchases(`google:${id}`).catch(() => {});
    return { ok: true, account };
  } catch (e) {
    if (m.isErrorWithCode(e) && e.code === m.statusCodes.IN_PROGRESS) return { ok: false, reason: 'cancelled' };
    console.warn('Falha no login com Google', e);
    return { ok: false, reason: 'error' };
  }
}

export async function signOut() {
  const m = await load();
  await m?.GoogleSignin.signOut().catch(() => {});
  accountStore.set(null);
  resetPurchasesUser().catch(() => {});
}
