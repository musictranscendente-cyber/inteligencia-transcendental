/**
 * Chaves e endereços configurados no arquivo `.env` (veja `.env.example`).
 * Tudo é opcional: sem elas o app funciona offline, com a Síntese local e tudo liberado para testes.
 */
export const CONFIG = {
  aiUrl: process.env.EXPO_PUBLIC_AI_URL ?? '',
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '',
  revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '',
  entitlement: process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT ?? 'premium',
  shareUrl: process.env.EXPO_PUBLIC_SHARE_URL ?? 'inteligenciatranscendental.app',
  meditationAppUrl: process.env.EXPO_PUBLIC_MEDITATION_APP_URL ?? '',
};
