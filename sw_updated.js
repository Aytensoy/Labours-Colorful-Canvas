const CACHE_NAME = 'magical-coloring-v2'; // Versiyon numarasını değiştirin
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    './thumbnails-png/unicorn.png',
    './thumbnails-png/dragon.png',
    './thumbnails-png/fairy.png',
    './thumbnails-png/castle.png',
    './thumbnails-png/owl_mandala.png',
    './thumbnails-png/wizard.png',
    './thumbnails-png/cat.png'
];

// Premium kullanıcılar için ek içerik
const PREMIUM_ASSETS = [
    // Premium sayfaların listesi
    './coloring-pages-png/unicorn.png',
    './coloring-pages-png/dragon.png',
    './coloring-pages-png/fairy.png'
    // Daha fazla premium içerik...
];

// Premium durumu
let isPremiumUser = false;

// Hata yönetimi
self.addEventListener('error', function (e) {
    console.error('Service Worker hata:', e.message);
});

// Service Worker kurulumu
self.addEventListener('install', event => {
    console.log('Service Worker kurulum başladı');

    // Önceki service worker'ı beklemeden etkinleştir
    self.skipWaiting();

    // Temel varlıkları cache'e ekle
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Temel varlıklar önbelleğe alınıyor');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('Önbelleğe alma hatası:', error);
            })
    );
});

// Service Worker aktifleştirildiğinde
self.addEventListener('activate', event => {
    console.log('Service Worker aktifleştiriliyor');

    // İstemcileri hemen kontrol et
    event.waitUntil(clients.claim());

    // Eski önbellekleri temizle
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eski önbellek siliniyor:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// İstek yakalandığında (offline erişim için)
self.addEventListener('fetch', event => {
    // Sadece GET isteklerini işle
    if (event.request.method !== 'GET') return;

    // API veya dinamik içerik isteklerini atla
    if (event.request.url.includes('/api/') ||
        event.request.url.includes('chrome-extension')) {
        return;
    }

    // Ağ öncelikli stratejisi
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Başarılı cevabı cache'e ekle
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Ağ bağlantısı yoksa cache'ten al
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        // Eğer navigate isteği ise ve cache'te yoksa
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }

                        // Diğer durumlar için 404
                        return new Response('Not found', {
                            status: 404,
                            statusText: 'Not found'
                        });
                    });
            })
    );
});

// Ana sayfadan gelen mesajları dinle
self.addEventListener('message', event => {
    try {
        console.log('Service Worker mesaj aldı:', event.data);

        if (event.data && event.data.type === 'PREMIUM_STATUS') {
            isPremiumUser = event.data.isPremium;
            console.log('Premium kullanıcı durumu güncellendi:', isPremiumUser);

            // Premium kullanıcı ise ek içeriği önbelleğe al
            if (isPremiumUser) {
                caches.open(CACHE_NAME).then(cache => {
                    console.log('Premium içerikler önbelleğe alınıyor');
                    return cache.addAll(PREMIUM_ASSETS);
                });
            }
        }

        if (event.data && event.data.type === 'CACHE_PREMIUM_CONTENT' && isPremiumUser) {
            caches.open(CACHE_NAME).then(cache => {
                console.log('Premium içerikler önbelleğe alınıyor (talep üzerine)');
                return cache.addAll(PREMIUM_ASSETS);
            });
        }
    } catch (error) {
        console.error('Mesaj işleme hatası:', error);
    }
});

// Bildirim tıklama olayı
self.addEventListener('notificationclick', event => {
    event.notification.close();

    // Sayfayı aç veya odaklan
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Açık bir pencere var mı?
            for (let client of windowClients) {
                if (client.url === './' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Yoksa yeni pencere aç
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});

// Servis başlangıcı
console.log('Service Worker başlatıldı - Versiyon: Magical Coloring v2');