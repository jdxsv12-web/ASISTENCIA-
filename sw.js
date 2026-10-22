// Si cambias index.html, subi la version (v2 -> v3) para que los celulares se actualicen.
const V = 'asistencia-v2';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(async c => {
    await c.addAll(CORE);
    await Promise.all(CDN.map(u => fetch(u, {mode: 'no-cors'}).then(r => c.put(u, r)).catch(() => {})));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r;
  }).catch(() => caches.match('./index.html'))));
});
