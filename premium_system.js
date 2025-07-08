// SADECE PREMIUM SİSTEMİ - Temiz ve basit

// Premium durumu
let isPremiumUser = localStorage.getItem('isPremium') === 'true';

// Premium modal oluştur
function createPremiumModal() {
  if (document.getElementById('premiumModal')) return;

  const modal = document.createElement('div');
  modal.id = 'premiumModal';
  modal.className = 'premium-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white;
                padding: 30px; border-radius: 20px; max-width: 500px; width: 90%;
                text-align: center; position: relative;">
      <span onclick="closePremiumModal()" style="position: absolute; top: 15px; right: 20px;
            font-size: 30px; cursor: pointer; color: #fff;">&times;</span>
      <h2 style="color: #FFD700; margin-bottom: 20px;">🌟 Premium Özellikler 🌟</h2>
      <div style="text-align: left; margin: 20px auto; max-width: 300px;">
        <div style="margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;">
          ✨ Tüm 21 Boyama Sayfası
        </div>
        <div style="margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;">
          💾 Sınırsız Kaydetme
        </div>
        <div style="margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;">
          🎨 Özel Sihirli Fırçalar
        </div>
      </div>
      <div style="font-size: 2em; color: #FFD700; margin: 20px 0;">Sadece $4.99</div>
      <button onclick="buyPremium()" style="background: linear-gradient(45deg, #FFD700, #FFA500);
              color: #2c3e50; border: none; padding: 15px 40px; font-size: 1.2em;
              border-radius: 30px; cursor: pointer; font-weight: bold;">
        Premium Satın Al
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Premium modal göster
function showPremiumModal() {
  createPremiumModal();
  document.getElementById('premiumModal').style.display = 'flex';
}

// Premium modal kapat
function closePremiumModal() {
  const modal = document.getElementById('premiumModal');
  if (modal) modal.style.display = 'none';
}

// Premium satın alma
function buyPremium() {
  // Test için direkt premium aktif et
  localStorage.setItem('isPremium', 'true');
  isPremiumUser = true;
  closePremiumModal();
  alert('🎉 Premium aktif edildi! Sayfa yenileniyor...');
  location.reload();
}

// Premium içerikleri kilitle/aç - Her kategoride 2'şer sayfa ücretsiz
function updateContentLocks() {
  console.log('Premium sistem başlatılıyor...');
  console.log('isPremiumUser:', isPremiumUser);
  
  // Kategori bazında ücretsiz sayfa sayısı
  const categories = {
    'magical': 2,
    'flowers': 2, 
    'animals': 2,
    'mandalas': 2,
    'various': 2
  };

  // Her kategori için thumbnail'ları kontrol et
  Object.keys(categories).forEach(category => {
    const categoryThumbnails = document.querySelectorAll(`.page-thumbnails.${category} .page-thumbnail`);
    console.log(`${category} kategorisinde ${categoryThumbnails.length} thumbnail bulundu`);
    
    categoryThumbnails.forEach((thumb, index) => {
      console.log(`${category} - ${index}. thumbnail işleniyor`);
      
      // Her kategoride ilk 2 sayfa ücretsiz
      if (index >= categories[category] && !isPremiumUser) {
        console.log(`${category} - ${index}. thumbnail KİLİTLENİYOR`);
        
        // Kilitli görünüm
        thumb.classList.add('locked');

        // Kilit ikonu ekle
        if (!thumb.querySelector('.lock-overlay')) {
          const lockOverlay = document.createElement('div');
          lockOverlay.className = 'lock-overlay';
          lockOverlay.style.cssText = `
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 2.5em; background: rgba(0, 0, 0, 0.7); width: 60px; height: 60px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
          `;
          lockOverlay.innerHTML = '🔒';
          thumb.appendChild(lockOverlay);
        }

        // Tıklama olayını değiştir
        thumb.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Kilitli sayfa tıklandı, premium modal açılıyor');
          showPremiumModal();
        };
      } else {
        console.log(`${category} - ${index}. thumbnail SERBEST`);
        
        // Kilidi kaldır
        thumb.classList.remove('locked');
        const lock = thumb.querySelector('.lock-overlay');
        if (lock) lock.remove();
        
        // Normal tıklama - Canvas'a yükle
        thumb.onclick = function (e) {
          const pageName = thumb.getAttribute('data-page');
          console.log('Ücretsiz sayfa tıklandı:', pageName);
          loadColoringPage(pageName);
        };
      }
    });
  });
  
  console.log('Premium sistem tamamlandı');
}

// Boyama sayfasını yükle
function loadColoringPage(pageName) {
  console.log(`Boyama sayfası yükleniyor: ${pageName}`);
  
  const canvas = document.getElementById('coloringCanvas');
  if (!canvas) {
    console.error('Canvas bulunamadı!');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = "anonymous";
  
  img.onload = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log(`${pageName} başarıyla yüklendi!`);
  };
  
  img.onerror = function() {
    console.error(`${pageName} yüklenemedi!`);
  };
  
  img.src = `coloring-pages-png/${pageName}.png`;
}

// Premium badge ekle
function addPremiumBadge() {
  if (isPremiumUser && !document.querySelector('.premium-badge')) {
    const badge = document.createElement('div');
    badge.className = 'premium-badge';
    badge.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: linear-gradient(45deg, #FFD700, #FFA500);
      color: #2c3e50; padding: 8px 20px; border-radius: 20px; font-weight: bold;
      box-shadow: 0 3px 10px rgba(255, 215, 0, 0.4); z-index: 1000;
    `;
    badge.innerHTML = '⭐ PREMIUM';
    document.body.appendChild(badge);
  }
}

// Window load olduğunda başlat (script_updated.js'den sonra)
window.addEventListener('load', function() {
  console.log('Premium sistem override başlatılıyor...');
  
  // script_updated.js'nin yüklenmesini bekle
  setTimeout(() => {
    console.log('Premium sistem devreye giriyor...');
    updateContentLocks();
    addPremiumBadge();
  }, 2000);
});
