// =================================================================
// SERVICE WORKER - NİHAİ VE TEMİZLENMİŞ SÜRÜM (v8)
// =================================================================

const CACHE_NAME = 'magical-coloring-v8-final';

const FILES_TO_CACHE = [
    './',
    './index.html', // DOĞRU DOSYA ADI
    './styles.css', // DOĞRU DOSYA ADI
    './script.js',  // DOĞRU DOSYA ADI
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    './icons/splash-logo.png',
    './Background1.jpg',
    './image.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css',

    // --- Boyama Sayfaları ---
    './coloring-pages-png/image.png',
    './coloring-pages-png/unicorn.png', './coloring-pages-png/dragon.png', './coloring-pages-png/fairy.png', './coloring-pages-png/wizard.png',
    './coloring-pages-png/narcissus.png', './coloring-pages-png/poppies.png', './coloring-pages-png/daisies.png', './coloring-pages-png/carnation.png',
    './coloring-pages-png/cat_and_dog.png', './coloring-pages-png/flapping_bird.png', './coloring-pages-png/iconic_birds.png', './coloring-pages-png/smiling_fish.png',
    './coloring-pages-png/sun_mandala.png', './coloring-pages-png/modern_mandala.png', './coloring-pages-png/tree_of_life.png', './coloring-pages-png/oriental_mandala.png',
    './coloring-pages-png/boho_style.png', './coloring-pages-png/boat.png', './coloring-pages-png/k-pop.png', './coloring-pages-png/cute_cat.png', './coloring-pages-png/shapes.png',
    './coloring-pages-png/magic_wand.png', './coloring-pages-png/fantasy_castle.png', './coloring-pages-png/fantasy_unicorn.png', './coloring-pages-png/fairytale_castle.png',
    './coloring-pages-png/fairy_flying.png', './coloring-pages-png/magical_book.png', './coloring-pages-png/wizards_reading.png', './coloring-pages-png/cute_bunny_fairy.png', './coloring-pages-png/ornate_owl.png',
    './coloring-pages-png/floral_frame.png', './coloring-pages-png/doodle_flowers.png', './coloring-pages-png/heart_flowers.png', './coloring-pages-png/detailed_flowers.png',
    './coloring-pages-png/big_flower.png', './coloring-pages-png/simple_flower.png', './coloring-pages-png/lotus_flowers.png',
    './coloring-pages-png/cute_elephant.png', './coloring-pages-png/birds_on_branch.png', './coloring-pages-png/happy_kangaroo.png', './coloring-pages-png/bear_in_forest.png',
    './coloring-pages-png/funny_monkey.png', './coloring-pages-png/cute_bunny.png', './coloring-pages-png/kitten_in_garden.png', './coloring-pages-png/happy_whale.png',
    './coloring-pages-png/squirrel_with_acorn.png', './coloring-pages-png/butterflies.png', './coloring-pages-png/bulldog_portrait.png', './coloring-pages-png/frog_on_grass.png',
    './coloring-pages-png/cute_lamb.png', './coloring-pages-png/kawaii_bunny_face.png', './coloring-pages-png/cat_on_crocodile.png',
    './coloring-pages-png/mandala_pattern.png', './coloring-pages-png/mandala_horse.png', './coloring-pages-png/mandala_bird.png', './coloring-pages-png/panda_mandala.png',
    './coloring-pages-png/detailed_lotus_mandala.png', './coloring-pages-png/mandala_flower.png', './coloring-pages-png/circle_mandala.png',
    './coloring-pages-png/girl_on_swing.png', './coloring-pages-png/beach_cleanup_boy.png', './coloring-pages-png/boy_on_swing.png', './coloring-pages-png/craft_girl.png',
    './coloring-pages-png/boy_with_glasses.png', './coloring-pages-png/kawaii_twin_girls.png', './coloring-pages-png/dancing_bean_character.png',

    // --- Magic Photos Şablonları (Ana Dosyalar) ---
    './template-images/birthday_colored_transparent.png', './template-images/birthday_outline_transparent.png',
    './template-images/firefighter_colored_transparent.png', './template-images/firefighter_outline_transparent.png',
    './template-images/pirate_colored_transparent.png', './template-images/pirate_outline_transparent.png',
    './template-images/princess_colored_transparent.png', './template-images/princess_outline_transparent.png',
    './template-images/safari_colored_transparent.png', './template-images/safari_outline_transparent.png',
    './template-images/space_colored_transparent.png', './template-images/space_outline_transparent.png',
    './template-images/superhero_colored_transparent.png', './template-images/superhero_outline_transparent.png',
    './template-images/underwater_colored_transparent.png', './template-images/underwater_outline_transparent.png',
    './template-images/unicorn_colored_transparent.png', './template-images/unicorn_outline_transparent.png',
    './template-images/unicorn_girl_colored_transparent.png', './template-images/unicorn_girl_outline_transparent.png',
    './template-images/wizzard_colored_transparent.png', './template-images/wizzard_outline_transparent.png',

    // --- Magic Photos Küçük Resimleri (Thumbnails) ---
    './template-images/birthday_colored_thumb.png', './template-images/birthday_outline_thumb.png',
    './template-images/firefighter_colored_thumb.png', './template-images/firefighter_outline_thumb.png',
    './template-images/pirate_colored_thumb.png', './template-images/pirate_outline_thumb.png',
    './template-images/princess_colored_thumb.png', './template-images/princess_outline_thumb.png',
    './template-images/safari_colored_thumb.png', './template-images/safari_outline_thumb.png',
    './template-images/space_colored_thumb.png', './template-images/space_outline_thumb.png',
    './template-images/superhero_colored_thumb.png', './template-images/superhero_outline_thumb.png',
    './template-images/underwater_colored_thumb.png', './template-images/underwater_outline_thumb.png',
    './template-images/unicorn_colored_thumb.png', './template-images/unicorn_outline_thumb.png',
    './template-images/unicorn_girl_colored_thumb.png', './template-images/unicorn_girl_outline_thumb.png',
    './template-images/wizzard_colored_thumb.png', './template-images/wizzard_outline_thumb.png'
];

// 1. Install Olayı: Dosyaları önbelleğe al
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install: Caching all game assets for offline mode...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        }).catch(error => {
            console.error('[ServiceWorker] Caching failed:', error);
        })
    );
});

// 2. Activate Olayı: Eski önbellekleri temizle
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// 3. Fetch Olayı: İstekleri yönet (Cache First stratejisi)
self.addEventListener('fetch', (event) => {
    // Sadece GET isteklerine yanıt ver
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Önbellekte varsa, önbellekten döndür.
            // Yoksa, ağdan istemeye çalış.
            return response || fetch(event.request);
        })
    );
});