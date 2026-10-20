// Service worker mínimo para o site poder ser instalado como app.
// Não guarda nada em cache: cada abertura busca a versão mais nova no servidor.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
  }
});
