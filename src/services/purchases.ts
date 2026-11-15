/**
 * Assinaturas via RevenueCat.
 * Sem chave configurada (desenvolvimento), o app fica totalmente liberado.
 * No Expo Go, o RevenueCat roda em modo de pré-visualização (compras simuladas).
 */
import { Platform } from 'react-native';

import { accountStore, subscriptionStore } from '@/storage/app-data';
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
    const account = accountStore.get();
    purchases.configure({ apiKey: apiKey(), appUserID: account ? `google:${account.id}` : undefined });
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

/** Liga a assinatura à conta da pessoa, para valer em qualquer aparelho em que ela entrar. */
export async function identifyPurchases(userId: string) {
  if (!purchases) return;
  await purchases.logIn(userId);
  await refreshEntitlements();
}

export async function resetPurchasesUser() {
  if (!purchases) return;
  if (await purchases.isAnonymous()) return;
  await purchases.logOut();
  await refreshEntitlements();
}

export type Offer = {
  id: string;
  period: 'weekly' | 'monthly' | 'annual' | 'other';
  price: string;
  /** Preço anual equivalente (para calcular a economia do plano anual). */
  perYear: number | null;
  perMonthString: string | null;
  /** Dias de teste grátis configurados na loja (0 se não houver). */
  trialDays: number;
  pkg: PurchasesPackage;
};

const DAYS: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };

function trialDays(pkg: PurchasesPackage) {
  const p = pkg.product;
  // Android: fase grátis da oferta padrão. iOS: preço introdutório zero.
  const free = p.defaultOption?.freePhase?.billingPeriod;
  if (free) return free.value * (DAYS[free.unit] ?? 0);
  if (p.introPrice && p.introPrice.price === 0) return p.introPrice.periodNumberOfUnits * p.introPrice.cycles * (DAYS[p.introPrice.periodUnit] ?? 0);
  return 0;
}

export async function loadOffers(): Promise<Offer[]> {
  if (!purchases) return [];
  const offerings = await purchases.getOfferings();
  const pkgs = offerings.current?.availablePackages ?? [];
  return pkgs.map((pkg) => ({
    id: pkg.identifier,
    period: pkg.packageType === 'WEEKLY' ? 'weekly' : pkg.packageType === 'MONTHLY' ? 'monthly' : pkg.packageType === 'ANNUAL' ? 'annual' : 'other',
    price: pkg.product.priceString,
    perYear: pkg.product.pricePerYear,
    perMonthString: pkg.product.pricePerMonthString,
    trialDays: trialDays(pkg),
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
  const { premium } = subscriptionStore.useValue();
  return premium || !paywallEnabled();
}
