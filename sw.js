// =================================================================
// SERVICE WORKER - NİHAİ, GÜVENLİ VE TAM KAPSAMLI SÜRÜM (A21)
// =================================================================

const CACHE_NAME = 'magical-coloring-A21';

const FILES_TO_CACHE = [
    // Çekirdek Dosyalar
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',

    // İkonlar ve Ana Görseller
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    './icons/splash-logo.png',
    './Background1.jpg',
    './image.png',

    // Harici FontAwesome (İkonlar için)
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

    // --- KÜÇÜK ÖNİZLEME RESİMLERİ (THUMBNAILS) ---
    './thumbnails-png/unicorn.png',
    './thumbnails-png/dragon.png',
    './thumbnails-png/fairy.png',
    './thumbnails-png/wizard.png',
    './thumbnails-png/narcissus.png',
    './thumbnails-png/poppies.png',
    './thumbnails-png/daisies.png',
    './thumbnails-png/carnation.png',
    './thumbnails-png/cat_and_dog.png',
    './thumbnails-png/flapping_bird.png',
    './thumbnails-png/iconic_birds.png',
    './thumbnails-png/smiling_fish.png',
    './thumbnails-png/sun_mandala.png',
    './thumbnails-png/modern_mandala.png',
    './thumbnails-png/tree_of_life.png',
    './thumbnails-png/oriental_mandala.png',
    './thumbnails-png/boho_style.png',
    './thumbnails-png/boat.png',
    './thumbnails-png/k-pop.png',
    './thumbnails-png/cute_cat.png',
    './thumbnails-png/shapes.png',
    './thumbnails-png/magic_wand.png',
    './thumbnails-png/fantasy_castle.png',
    './thumbnails-png/fantasy_unicorn.png',
    './thumbnails-png/fairytale_castle.png',
    './thumbnails-png/fairy_flying.png',
    './thumbnails-png/magical_book.png',
    './thumbnails-png/wizards_reading.png',
    './thumbnails-png/cute_bunny_fairy.png',
    './thumbnails-png/ornate_owl.png',
    './thumbnails-png/floral_frame.png',
    './thumbnails-png/doodle_flowers.png',
    './thumbnails-png/heart_flowers.png',
    './thumbnails-png/detailed_flowers.png',
    './thumbnails-png/big_flower.png',
    './thumbnails-png/simple_flower.png',
    './thumbnails-png/lotus_flowers.png',
    './thumbnails-png/cute_elephant.png',
    './thumbnails-png/birds_on_branch.png',
    './thumbnails-png/happy_kangaroo.png',
    './thumbnails-png/bear_in_forest.png',
    './thumbnails-png/funny_monkey.png',
    './thumbnails-png/cute_bunny.png',
    './thumbnails-png/kitten_in_garden.png',
    './thumbnails-png/happy_whale.png',
    './thumbnails-png/squirrel_with_acorn.png',
    './thumbnails-png/butterflies.png',
    './thumbnails-png/bulldog_portrait.png',
    './thumbnails-png/frog_on_grass.png',
    './thumbnails-png/cute_lamb.png',
    './thumbnails-png/kawaii_bunny_face.png',
    './thumbnails-png/cat_on_crocodile.png',
    './thumbnails-png/mandala_pattern.png',
    './thumbnails-png/mandala_horse.png',
    './thumbnails-png/mandala_bird.png',
    './thumbnails-png/panda_mandala.png',
    './thumbnails-png/detailed_lotus_mandala.png',
    './thumbnails-png/mandala_flower.png',
    './thumbnails-png/circle_mandala.png',
    './thumbnails-png/girl_on_swing.png',
    './thumbnails-png/beach_cleanup_boy.png',
    './thumbnails-png/boy_on_swing.png',
    './thumbnails-png/craft_girl.png',
    './thumbnails-png/boy_with_glasses.png',
    './thumbnails-png/kawaii_twin_girls.png',
    './thumbnails-png/dancing_bean_character.png',
    // --- Magic Photos Şablonları ---
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

    // --- Magic Photos Thumbnails ---
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

// 1. Install: Güvenli ve Kapsamlı Önbelleğe Alma
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install: Safe caching starting...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[ServiceWorker] Caching individual files...');
            for (const fileUrl of FILES_TO_CACHE) {
                try {
                    // Harici linkler için 'no-cors' modunu kullanmak daha güvenlidir.
                    const request = new Request(fileUrl, { mode: 'no-cors' });
                    const response = await fetch(request);
                    await cache.put(request, response);
                } catch (err) {
                    console.warn(`[ServiceWorker] Failed to cache: ${fileUrl}`, err);
                }
            }
        })
    );
});

// 2. Activate: Eski cache'leri sil
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache:', key);
                    return caches.delete(key);
                }
            }))
        )
    );
    return self.clients.claim();
});

// 3. Fetch: Cache First Stratejisi
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});