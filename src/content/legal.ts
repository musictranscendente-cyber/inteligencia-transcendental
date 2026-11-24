/** Política de privacidade e termos de uso (mostrados no app e publicados em public/privacy.html). */
import { localized, type L } from './types';

export type LegalDoc = 'privacy' | 'terms';
type Section = { title: string; text: string };

export const LEGAL_UPDATED = '2026-11-22';

export const LEGAL = localized<Record<LegalDoc, L<Section[]>>>('LEGAL', {
  privacy: {
    pt: [
      { title: 'Resumo', text: 'Seus dados de nascimento ficam no seu celular. Não vendemos dados e não usamos publicidade.' },
      { title: 'O que o app guarda', text: 'Nome, data, hora e cidade de nascimento que você digita, as pessoas que você cadastra em Relações, seu histórico de leituras e suas preferências. Tudo fica armazenado somente no seu aparelho.' },
      { title: 'Login com Google (opcional)', text: 'Se você entrar com o Google, o app recebe seu nome, e-mail, foto e um identificador da conta. Esses dados ficam no seu celular. O identificador da conta é usado apenas para vincular a sua assinatura, para que ela funcione em outro aparelho.' },
      { title: 'Inteligência artificial', text: 'Quando você usa a Síntese, o "Pergunte ao Oráculo" ou textos de compatibilidade com IA, enviamos ao nosso servidor apenas resultados já calculados (por exemplo, "Destino 8, Sol em Capricórnio"), a pergunta que você escreveu e o seu primeiro nome. Nunca enviamos data, hora ou local de nascimento. O servidor usa a API da Anthropic para escrever o texto e guarda a resposta em cache por até 30 dias, ligada a um identificador aleatório do aparelho.' },
      { title: 'Assinaturas', text: 'Pagamentos são processados pela Google Play ou App Store e gerenciados pelo RevenueCat, que recebe um identificador da compra (anônimo, ou o identificador da sua conta Google se você entrou com ela). Não temos acesso aos dados do seu cartão.' },
      { title: 'Notificações', text: 'O lembrete diário é agendado no próprio celular. Não enviamos notificações remotas nem rastreamos sua localização.' },
      { title: 'Apagar seus dados', text: 'Em Menu → Perfil e ajustes → "Apagar todos os meus dados", tudo é removido do aparelho na hora. Para pedir a exclusão de dados guardados no servidor (cache de IA) ou tirar dúvidas, fale conosco pelo e-mail de contato da página do app na loja.' },
      { title: 'Seus direitos (LGPD e GDPR)', text: 'Você pode pedir acesso, correção ou exclusão de dados pessoais a qualquer momento pelo e-mail de contato. O app não é destinado a menores de 13 anos.' },
    ],
    en: [
      { title: 'Summary', text: 'Your birth details stay on your phone. We do not sell data and we do not show ads.' },
      { title: 'What the app stores', text: 'The name, birth date, time and city you enter, the people you add in Relationships, your reading history and your preferences. Everything is stored only on your device.' },
      { title: 'Sign in with Google (optional)', text: 'If you sign in with Google, the app receives your name, email, photo and an account identifier. This data stays on your phone. The account identifier is used only to link your subscription so it works on another device.' },
      { title: 'Artificial intelligence', text: 'When you use the Synthesis, "Ask the Oracle" or AI compatibility texts, we send our server only calculated results (for example, "Destiny 8, Sun in Capricorn"), the question you wrote and your first name. We never send your birth date, time or place. The server uses the Anthropic API to write the text and caches the answer for up to 30 days, linked to a random device identifier.' },
      { title: 'Subscriptions', text: 'Payments are processed by Google Play or the App Store and managed by RevenueCat, which receives a purchase identifier (anonymous, or your Google account identifier if you signed in). We never see your card details.' },
      { title: 'Notifications', text: 'The daily reminder is scheduled on your phone. We do not send remote notifications or track your location.' },
      { title: 'Deleting your data', text: 'In Menu → Profile and settings → "Delete all my data", everything is removed from the device immediately. To request deletion of data kept on the server (AI cache) or to ask questions, contact us through the email on the app’s store page.' },
      { title: 'Your rights (GDPR and LGPD)', text: 'You can request access to, correction or deletion of personal data at any time through the contact email. The app is not intended for children under 13.' },
    ],
    es: [
      { title: 'Resumen', text: 'Tus datos de nacimiento se quedan en tu teléfono. No vendemos datos ni mostramos publicidad.' },
      { title: 'Qué guarda la app', text: 'El nombre, la fecha, la hora y la ciudad de nacimiento que escribes, las personas que agregas en Relaciones, tu historial de lecturas y tus preferencias. Todo se guarda solo en tu dispositivo.' },
      { title: 'Inicio de sesión con Google (opcional)', text: 'Si entras con Google, la app recibe tu nombre, correo, foto y un identificador de la cuenta. Estos datos se quedan en tu teléfono. El identificador de la cuenta se usa solo para vincular tu suscripción y que funcione en otro dispositivo.' },
      { title: 'Inteligencia artificial', text: 'Cuando usas la Síntesis, "Pregunta al Oráculo" o textos de compatibilidad con IA, enviamos a nuestro servidor solo resultados ya calculados (por ejemplo, "Destino 8, Sol en Capricornio"), la pregunta que escribiste y tu primer nombre. Nunca enviamos fecha, hora ni lugar de nacimiento. El servidor usa la API de Anthropic para escribir el texto y guarda la respuesta en caché hasta 30 días, ligada a un identificador aleatorio del dispositivo.' },
      { title: 'Suscripciones', text: 'Los pagos los procesan Google Play o App Store y los gestiona RevenueCat, que recibe un identificador de la compra (anónimo, o el identificador de tu cuenta de Google si entraste con ella). Nunca vemos los datos de tu tarjeta.' },
      { title: 'Notificaciones', text: 'El recordatorio diario se programa en el propio teléfono. No enviamos notificaciones remotas ni rastreamos tu ubicación.' },
      { title: 'Borrar tus datos', text: 'En Menú → Perfil y ajustes → "Borrar todos mis datos", todo se elimina del dispositivo al instante. Para pedir que borremos datos guardados en el servidor (caché de IA) o hacer preguntas, escríbenos al correo de contacto de la página de la app en la tienda.' },
      { title: 'Tus derechos (RGPD y LGPD)', text: 'Puedes pedir acceso, corrección o eliminación de datos personales en cualquier momento por el correo de contacto. La app no está dirigida a menores de 13 años.' },
    ],
  },
  terms: {
    pt: [
      { title: 'Finalidade', text: 'O Inteligência Transcendental oferece conteúdo de autoconhecimento e entretenimento baseado em numerologia, tarô, astrologia e outras tradições simbólicas. As leituras não são previsões garantidas e não substituem orientação médica, psicológica, jurídica ou financeira.' },
      { title: 'Uso do app', text: 'Você pode usar o app para fins pessoais. Não é permitido copiar, revender ou redistribuir os textos e imagens do app, exceto pelos cards de compartilhamento feitos para isso.' },
      { title: 'Assinatura', text: 'Alguns recursos exigem assinatura. O valor, o período e o teste grátis (quando houver) aparecem antes da compra. A assinatura renova automaticamente até ser cancelada nas configurações da loja (Google Play ou App Store), pelo menos 24 horas antes do fim do período. Reembolsos seguem as regras da loja.' },
      { title: 'Conteúdo com IA', text: 'Alguns textos são escritos por inteligência artificial a partir dos seus resultados. Eles podem conter imprecisões e devem ser lidos como reflexão, não como verdade absoluta.' },
      { title: 'Mudanças', text: 'Podemos atualizar o app e estes termos. Mudanças importantes serão avisadas no próprio app.' },
    ],
    en: [
      { title: 'Purpose', text: 'Transcendental Intelligence offers self-knowledge and entertainment content based on numerology, tarot, astrology and other symbolic traditions. Readings are not guaranteed predictions and do not replace medical, psychological, legal or financial advice.' },
      { title: 'Using the app', text: 'You may use the app for personal purposes. Copying, reselling or redistributing the app’s texts and images is not allowed, except for the share cards made for that purpose.' },
      { title: 'Subscription', text: 'Some features require a subscription. The price, period and free trial (when available) are shown before purchase. The subscription renews automatically until cancelled in the store settings (Google Play or App Store) at least 24 hours before the end of the period. Refunds follow the store’s rules.' },
      { title: 'AI content', text: 'Some texts are written by artificial intelligence from your results. They may contain inaccuracies and should be read as reflection, not absolute truth.' },
      { title: 'Changes', text: 'We may update the app and these terms. Important changes will be announced in the app.' },
    ],
    es: [
      { title: 'Finalidad', text: 'Inteligencia Trascendental ofrece contenido de autoconocimiento y entretenimiento basado en numerología, tarot, astrología y otras tradiciones simbólicas. Las lecturas no son predicciones garantizadas y no sustituyen la orientación médica, psicológica, legal o financiera.' },
      { title: 'Uso de la app', text: 'Puedes usar la app con fines personales. No está permitido copiar, revender ni redistribuir los textos e imágenes de la app, salvo las tarjetas para compartir hechas para eso.' },
      { title: 'Suscripción', text: 'Algunas funciones requieren suscripción. El precio, el período y la prueba gratis (cuando exista) se muestran antes de la compra. La suscripción se renueva automáticamente hasta que la canceles en la configuración de la tienda (Google Play o App Store), al menos 24 horas antes del final del período. Los reembolsos siguen las reglas de la tienda.' },
      { title: 'Contenido con IA', text: 'Algunos textos los escribe la inteligencia artificial a partir de tus resultados. Pueden contener imprecisiones y deben leerse como reflexión, no como verdad absoluta.' },
      { title: 'Cambios', text: 'Podemos actualizar la app y estos términos. Los cambios importantes se avisarán en la propia app.' },
    ],
  },
});
