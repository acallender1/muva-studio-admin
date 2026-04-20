const CACHE = 'muva-admin-v3';
const ASSETS = [
    '/muva-studio-admin/',
    '/muva-studio-admin/index.html',
    '/muva-studio-admin/icon-192.png',
    '/muva-studio-admin/icon-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.url.includes('script.google.com') || 
        e.request.url.includes('fonts.googleapis.com')) {
        return fetch(e.request).catch(() => {});
    }
    e.respondWith(
        caches.match(e.request).then(cached => {
            return cached || fetch(e.request).then(res => {
                const clone = res.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, clone));
                return res;
            });
        }).catch(() => caches.match('/muva-studio-admin/index.html'))
    );
});
