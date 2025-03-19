const CACHE_NAME = 'magical-coloring-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index_magical.html',
    '/styles_magical.css',
    '/script_magical.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/thumbnails/unicorn.svg',
    '/thumbnails/dragon.svg',
    '/thumbnails/fairy.svg',
    '/thumbnails/castle.svg',
    '/thumbnails/owl_mandala.svg',
    '/thumbnails/wizard.svg',
    '/thumbnails/cat.svg'
];



// Cache tüm varlıkları yükle
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

// Offline erişim için network-first stratejisi
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
