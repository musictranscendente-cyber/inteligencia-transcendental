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
  /** Client ID do tipo "Aplicativo da Web" no Google Cloud (usado pelo login com Google). */
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  /** E-mail de contato mostrado no Menu (vazio = esconde a opção). */
  supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? '',
  privacyUrl: process.env.EXPO_PUBLIC_PRIVACY_URL ?? 'https://musictranscendente-cyber.github.io/inteligencia-transcendental/privacy.html',
  meditationAppUrl: process.env.EXPO_PUBLIC_MEDITATION_APP_URL ?? '',
};
