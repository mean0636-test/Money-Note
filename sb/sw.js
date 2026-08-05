// Service Worker — កំណែ Supabase (scope /sb/ ដាច់ដោយឡែកពីកម្មវិធីពិត)
const CACHE = 'money-note-sb-v1';
const ASSETS = ['./', './index.html', './styles.css', './manifest.json',
                '../icon-192.png', '../icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // សំណើទៅ Supabase — កុំ cache (ត្រូវការទិន្នន័យថ្មីជានិច្ច)
  if (e.request.url.includes('.supabase.co')) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r =>
      r || fetch(e.request).then(res => {
        const cp = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
