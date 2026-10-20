/**
 * Assinaturas via RevenueCat.
 * Sem chave configurada (desenvolvimento), o app fica totalmente liberado.
 * No Expo Go, o RevenueCat roda em modo de pré-visualização (compras simuladas).
 */
import { Platform } from 'react-native';

import { subscriptionStore } from '@/storage/app-data';
import { CONFIG } from './config';

type Purchases = typeof import('react-native-purchases').default;
type PurchasesPackage = import('react-native-purchases').PurchasesPackage;

let purchases: Purchases | null = null;
let configured = false;

function apiKey() {
  return Platform.OS === 'ios' ? CONFIG.revenueCatIosKey : CONFIG.revenueCatAndroidKey;
}

/** Monetização ativa? (só quando há chave do RevenueCat) */
export const paywallEnabled = () => !!apiKey() && Platform.OS !== 'web';

export async function initPurchases() {
  if (!paywallEnabled() || configured) return;
  try {
    purchases = (await import('react-native-purchases')).default;
    purchases.configure({ apiKey: apiKey() });
    configured = true;
    await refreshEntitlements();
  } catch (e) {
    console.warn('RevenueCat indisponível', e);
  }
}

export async function refreshEntitlements() {
  if (!purchases) return;
  try {
    const info = await purchases.getCustomerInfo();
    const active = info.entitlements.active[CONFIG.entitlement];
    subscriptionStore.set({ premium: !!active, plan: active?.productIdentifier ?? null, checkedAt: new Date().toISOString() });
  } catch (e) {
    console.warn('Falha ao ler assinatura', e);
  }
}

export type Offer = { id: string; period: 'weekly' | 'monthly' | 'annual' | 'other'; price: string; pkg: PurchasesPackage };

export async function loadOffers(): Promise<Offer[]> {
  if (!purchases) return [];
  const offerings = await purchases.getOfferings();
  const pkgs = offerings.current?.availablePackages ?? [];
  return pkgs.map((pkg) => ({
    id: pkg.identifier,
    period: pkg.packageType === 'WEEKLY' ? 'weekly' : pkg.packageType === 'MONTHLY' ? 'monthly' : pkg.packageType === 'ANNUAL' ? 'annual' : 'other',
    price: pkg.product.priceString,
    pkg,
  }));
}

export async function buy(offer: Offer) {
  if (!purchases) return false;
  try {
    await purchases.purchasePackage(offer.pkg);
    await refreshEntitlements();
    return subscriptionStore.get().premium;
  } catch (e: unknown) {
    if ((e as { userCancelled?: boolean }).userCancelled) return false;
    throw e;
  }
}

export async function restore() {
  if (!purchases) return false;
  await purchases.restorePurchases();
  await refreshEntitlements();
  return subscriptionStore.get().premium;
}

/** Recursos pagos liberados? */
export function usePremium() {
  const { premium } = subscriptionStore.use();
  return premium || !paywallEnabled();
}
