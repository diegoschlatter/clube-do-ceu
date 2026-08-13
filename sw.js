// Service worker do app do Clube do Céu: rede primeiro, cache como reserva offline.
const CACHE = 'clube-ceu-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(['./app_clube_do_ceu.html', './manifest.webmanifest', './icone-192.png', './icone-512.png'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // só o próprio site: chamadas ao Supabase passam direto (nunca servir dado velho do cache)
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const cp = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, cp));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
