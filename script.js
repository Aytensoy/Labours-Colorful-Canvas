var submitNewsletter; // Global tanımlama
// ==========================================
// ACİL DÜZELTME - BU KODU script.js'in EN BAŞINA EKLEYİN
// ==========================================

// TÜM ESKİ FONKSİYONLARI TEMİZLE VE YENİDEN TANIMLA
(function () {
  console.log('🚨 Acil düzeltme başlatılıyor...');

  // 1. PREMIUM MODAL DÜZELTMESİ
  window.showPremiumModal = function () {
    console.log('Premium modal açılıyor...');

    // Önce eski modalı temizle
    var oldModal = document.getElementById('premiumModal');
    if (oldModal) {
      oldModal.remove();
    }

    // Yeni modal HTML'i
    var modalHTML = '<div id="premiumModal" class="premium-modal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 99999;">' +
      '<div class="premium-content" style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white; border-radius: 20px; padding: 30px; margin: auto; max-width: 450px; position: relative;">' +
      '<button onclick="closePremiumModal()" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>' +
      '<h2 style="color: #FFD700;">🌟 Unlock Premium Features 🌟</h2>' +
      '<div class="premium-features">' +
      '<p>📱 Download & Play Offline</p>' +
      '<p>📁 Upload Your Own Images</p>' +
      '<p>🎨 All 50+ Coloring Pages</p>' +
      '<p>💾 Unlimited HD Saves</p>' +
      '<p>✨ Premium Magic Brushes</p>' +
      '</div>' +
      '<div style="text-align: center; margin: 20px 0;">' +
      '<p style="text-decoration: line-through; color: #999;">Regular Price: $19.99</p>' +
      '<p style="font-size: 2em; color: #FFD700;">🚀 Launch Price: $14.99</p>' +
      '<p style="color: #FF6B6B;">Save $5 • Limited Time!</p>' +
      '</div>' +
      '<button onclick="buyPremium()" style="background: linear-gradient(45deg, #FFD700, #FFA500); color: #2c3e50; border: none; padding: 15px 40px; font-size: 1.2em; border-radius: 30px; cursor: pointer; width: 100%;">🎨 Get Premium Now</button>' +
      '</div></div>';

    // Modal'ı body'e ekle
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  // Modal kapatma fonksiyonu
  window.closePremiumModal = function () {
    console.log('Premium modal kapatılıyor...');
    var modal = document.getElementById('premiumModal');
    if (modal) {
      modal.remove();
    }
  };

  // 2. NEWSLETTER DÜZELTMESİ
  window.showNewsletterModal = function () {
    console.log('Newsletter modal açılıyor...');
    var modal = document.getElementById('newsletterModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  };

  window.closeNewsletterModal = function () {
    console.log('Newsletter modal kapatılıyor...');
    var modal = document.getElementById('newsletterModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  // Sayfa yüklendiğinde
  window.addEventListener('DOMContentLoaded', function () {
    console.log('DOM yüklendi, düzeltmeler uygulanıyor...');

    // 3. PREMIUM BUTONLARI GİZLE
    var isPremium = localStorage.getItem('isPremium') === 'true';
    var premiumTools = document.getElementById('premiumTools');

    if (premiumTools) {
      premiumTools.style.display = isPremium ? 'flex' : 'none';
    }

    // Premium butonları tek tek kontrol et
    ['glitterBtn', 'rainbowBtn', 'glowBtn'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn && !isPremium) {
        btn.style.display = 'none';
      }
    });

    // 4. NEWSLETTER BUTONU BAĞLA
    var newsletterBtn = document.getElementById('newsletterTrigger');
    if (newsletterBtn) {
      newsletterBtn.onclick = function (e) {
        e.preventDefault();
        showNewsletterModal();
        return false;
      };
    }

    // 5. BUTON SIRALAMA DÜZELTMESİ
    var style = document.createElement('style');
    style.textContent = `
          /* Buton sıralama resetleme */
          .toolbar > * {
              order: initial !important;
          }
          
          /* Premium tools gizleme */
          #premiumTools {
              display: ${isPremium ? 'flex' : 'none'} !important;
          }
          
          /* Premium butonları gizle */
          ${isPremium ? '' : '#glitterBtn, #rainbowBtn, #glowBtn { display: none !important; }'}
          
          /* Modal z-index düzeltmesi */
          #premiumModal, #newsletterModal {
              z-index: 99999 !important;
          }
      `;
    document.head.appendChild(style);

    console.log('✅ Tüm düzeltmeler uygulandı!');
  });

  // Hata yakalayıcı
  window.onerror = function (msg, url, line) {
    if (msg.includes('closePremiumModal') || msg.includes('showNewsletterModal')) {
      console.log('Hata yakalandı ve yok sayıldı:', msg);
      return true;
    }
  };

})();

// TEST FONKSİYONLARI
function testPremiumModal() {
  console.log('Premium modal test ediliyor...');
  showPremiumModal();
}

function testNewsletter() {
  console.log('Newsletter test ediliyor...');
  showNewsletterModal();
}

console.log('📌 Test için kullanabilirsiniz:');
console.log('- testPremiumModal()');
console.log('- testNewsletter()');
console.log('- closePremiumModal()');
console.log('- closeNewsletterModal()');
// PREMIUM SİSTEM - script.js dosyanızın EN BAŞINA ekleyin

// Premium durumu
let isPremiumUser = localStorage.getItem('isPremium') === 'true';
const PREMIUM_PRICE = 12.99;
// GÜVENLİ ADMIN ACCESS SİSTEMİ
document.addEventListener('DOMContentLoaded', function () {
  // Secret admin code - güncel!
  const ADMIN_SECRET = atob('TWFnaWNhbENvbG9yczIwMjUh'); // 

  // URL parameter kontrolü
  const urlParams = new URLSearchParams(window.location.search);
  const adminCode = urlParams.get('admin');

  if (adminCode === ADMIN_SECRET) {
    // Admin mode aktif
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('adminMode', 'true');
    isPremiumUser = true;

    // Admin badge ekle
    const adminBadge = document.createElement('div');
    adminBadge.style.cssText = `
          position: fixed; top: 10px; left: 10px; 
          background: #ff4757; color: white; 
          padding: 5px 10px; border-radius: 15px; 
          font-size: 12px; z-index: 9999;
      `;
    adminBadge.textContent = '👑 ADMIN MODE';
    document.body.appendChild(adminBadge);

    console.log('👑 Admin mode activated');

    // URL'den admin parametresini temizle
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
// Günlük kaydetme sayacı
let dailySaveCount = parseInt(localStorage.getItem('dailySaves') || '0');
const lastResetDate = localStorage.getItem('lastResetDate');
const today = new Date().toDateString();

// Günlük limitleri sıfırla
if (lastResetDate !== today) {
  localStorage.setItem('lastResetDate', today);
  localStorage.setItem('dailySaves', '0');
  dailySaveCount = 0;
}

// Premium modal oluştur
function createPremiumModal() {
  // Eğer modal zaten varsa, tekrar oluşturma
  if (document.getElementById('premiumModal')) return;

  const modal = document.createElement('div');
  modal.id = 'premiumModal';
  modal.className = 'premium-modal';

  modal.innerHTML = `
      <div class="premium-content">
        <span class="close-modal" onclick="closePremiumModal(); return false;" style="z-index: 99999; pointer-events: auto;">&times;</span>
        <h2>🌟 Unlock Premium Features 🌟</h2>
        <div class="premium-features">
            <div class="feature">📱 <strong>Download & Play Offline</strong><br>
                <small>Perfect for road trips & travel with kids!</small></div>
            <div class="feature">📁 <strong>Upload Your Own Images</strong><br>
                <small>Upload any coloring page to color</small></div>
            <div class="feature">🎨 <strong>All 50+ Coloring Pages</strong><br>
                <small>Magical, animals, flowers & more</small></div>
            <div class="feature">💾 <strong>Unlimited HD Saves</strong><br>
                <small>No daily limits, save all masterpieces</small></div>
            <div class="feature">✨ <strong>Premium Magic Brushes</strong><br>
                <small>Glitter, Rainbow & Glow effects</small></div>
        </div>
        <div class="launch-pricing">
    <div class="original-price">
        <span class="crossed">Regular Price: $19.99</span>
    </div>
    <div class="sale-price">
        🚀 Launch Price: $14.99
    </div>
    <div class="savings">
        Save $5 • Limited Time!
    </div>
</div>
        <button class="buy-premium-btn" onclick="buyPremium()">
            🎨 Get Premium Now
        </button>
        <p class="premium-note">Instant activation • Perfect for families</p>
        </div>
    `;
  document.body.appendChild(modal);
}

// Premium modal göster
function showPremiumModal() {
  createPremiumModal();
  document.getElementById('premiumModal').style.display = 'flex';
}

// Premium satın alma
function buyPremium() {
  // Gumroad sayfasına yönlendir
  window.open('https://magicalcoloringgame.gumroad.com/l/skdwom', '_blank');

  // Aktivasyon formunu göster
  closePremiumModal();
  showActivationForm();
}

// Aktivasyon formu
function showActivationForm() {
  const form = document.createElement('div');
  form.id = 'activationForm';
  form.className = 'activation-form';
  form.innerHTML = `
        <div class="activation-content">
            <h3>Enter Your License Key</h3>
            <p>After purchase, you'll receive a license key via email</p>
            <input type="text" id="licenseInput" placeholder="XXXX-XXXX-XXXX-XXXX" />
            <button onclick="activateLicense()">Activate Premium</button>
            <button onclick="closeActivationForm()" class="cancel-btn">Cancel</button>
        </div>
    `;
  document.body.appendChild(form);
}

// Aktivasyon formunu kapat
function closeActivationForm() {
  const form = document.getElementById('activationForm');
  if (form) form.remove();
}
/*
// 🔒 SÜPER GÜVENLİ LİSANS SİSTEMİ
function activateLicense() {
  const license = document.getElementById('licenseInput').value.trim().toUpperCase();

  console.log('🔒 Lisans doğrulama başlatılıyor...');

  // Gelişmiş validasyon
  if (!validateLicenseFormat(license)) {
    showLicenseError('❌ Invalid license format! Please check your key.');
    return;
  }

  if (!validateLicenseChecksum(license)) {
    showLicenseError('❌ Invalid license! Please contact support.');
    return;
  }

  // Lisans veritabanı kontrolü (simulated)
  if (!isValidLicenseKey(license)) {
    showLicenseError('❌ License not found! Please verify your purchase.');
    return;
  }

  // Başarılı aktivasyon
  console.log('✅ Lisans başarıyla doğrulandı!');
  activatePremiumFeatures(license);
}

// Lisans format kontrolü
function validateLicenseFormat(license) {
  // XXXX-XXXX-XXXX-XXXX formatını kontrol et
  const format = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return format.test(license);
}

// Checksum kontrolü (basit hash)
function validateLicenseChecksum(license) {
  const parts = license.split('-');
  if (parts.length !== 4) return false;

  // Son parça checksum olsun
  const data = parts.slice(0, 3).join('');
  const checksum = parts[3];

  // Basit hash hesapla
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) & 0xffff;
  }

  const expectedChecksum = hash.toString(16).toUpperCase().padStart(4, '0');
  return checksum === expectedChecksum;
}

// Geçerli lisans anahtarları listesi
function isValidLicenseKey(license) {
  const validKeys = [
    'MAGIC-COLO-RING-2024',
    'PAINT-AWAY-KIDS-2024',
    'ARTIS-TICO-CREA-2024',
    'SUPER-PREM-ACCE-2024',
    'TEST-1234-5678-ABCD'  // ← Bu satırı ekleyin (test için)
  ];

  return validKeys.includes(license) || generateValidKey(license);
}

// Dinamik geçerli anahtar üretimi
function generateValidKey(inputKey) {
  // Belirli bir pattern'e göre geçerli anahtar üret
  const prefix = inputKey.substring(0, 14);
  const hash = calculateKeyHash(prefix);
  const validKey = prefix + hash;

  return inputKey === validKey;
}

function calculateKeyHash(prefix) {
  let hash = 2024; // Magic number
  for (let i = 0; i < prefix.length; i++) {
    hash = ((hash * 31) + prefix.charCodeAt(i)) % 10000;
  }
  return hash.toString().padStart(4, '0');
}

// Hata gösterme
function showLicenseError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'license-error';
  errorDiv.innerHTML = `
    <div class="error-content">
      <h3>License Error</h3>
      <p>${message}</p>
      <button onclick="this.parentElement.parentElement.remove()">Try Again</button>
    </div>
  `;
  document.body.appendChild(errorDiv);

  setTimeout(() => errorDiv.remove(), 5000);
}

// Premium özellikleri etkinleştir
function activatePremiumFeatures(license) {
  localStorage.setItem('isPremium', 'true');
  localStorage.setItem('licenseKey', license);
  localStorage.setItem('activationDate', new Date().toISOString());
  isPremiumUser = true;

  closeActivationForm();
  showSuccessMessage();
  setTimeout(() => location.reload(), 2000);
}  */
// 🔒 SÜPER GÜVENLİ LİSANS SİSTEMİ (Test Mode)
function activateLicense() {
  const license = document.getElementById('licenseInput').value.trim();

  console.log('🔒 Test modunda lisans kontrolü...');

  // Test modunda basit kontrol
  if (license && license.length >= 5) {
    console.log('✅ Test lisansı kabul edildi:', license);

    // Premium'u aktif et
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('licenseKey', license);
    localStorage.setItem('activationDate', new Date().toISOString());
    isPremiumUser = true;

    // Formu kapat
    closeActivationForm();
    showSuccessMessage();
    setTimeout(() => location.reload(), 2000);
  } else {
    alert('Test için en az 5 karakter girin');
  }
}

// Başarı mesajı
function showSuccessMessage() {
  const success = document.createElement('div');
  success.className = 'success-message';
  success.innerHTML = `
        <div class="success-content">
            <h2>🎉 Premium Activated!</h2>
            <p>Enjoy all premium features!</p>
        </div>
    `;
  document.body.appendChild(success);

  setTimeout(() => success.remove(), 3000);
}

// Get Offline Pro butonu için
function handleOfflineProClick() {
  if (isPremiumUser) {
    enableOfflineMode();
  } else {
    showPremiumModal();
  }
}

// Offline modu etkinleştir
function enableOfflineMode() {
  console.log('✅ Premium offline mode başlatılıyor...');

  // Progress göster
  const progress = document.createElement('div');
  progress.className = 'download-progress';
  progress.innerHTML = `
    <div class="progress-content">
      <h3>🚀 Installing Premium App...</h3>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <p>Please wait while we prepare your offline app</p>
    </div>
  `;
  document.body.appendChild(progress);

  // 2 saniye sonra PWA install başlat
  setTimeout(() => {
    if (deferredPrompt) {
      progress.querySelector('h3').textContent = '📱 Installing to Device...';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((result) => {
        if (result.outcome === 'accepted') {
          progress.querySelector('h3').textContent = '✅ App Installed!';
          progress.querySelector('p').textContent = 'Check your home screen!';
        }
        setTimeout(() => progress.remove(), 3000);
      });
    } else {
      progress.querySelector('h3').textContent = '✅ Offline Mode Ready!';
      setTimeout(() => progress.remove(), 2000);
    }
  }, 2000);
}
// Kaydetme limiti kontrolü
function checkSaveLimit() {
  if (!isPremiumUser && dailySaveCount >= 3) {
    showPremiumModal();
    return false;
  }
  return true;
}

// Premium badge ekle
function addPremiumBadge() {
  if (isPremiumUser && !document.querySelector('.premium-badge')) {
    const badge = document.createElement('div');
    badge.className = 'premium-badge';
    badge.innerHTML = '⭐ PREMIUM';
    document.body.appendChild(badge);
  }
}

// DOMContentLoaded'da çalışacak kodlar
document.addEventListener('DOMContentLoaded', function () {
  // Premium durumunu kontrol et
  addPremiumBadge();

  // Premium araçları göster/gizle - DOMContentLoaded içine ekleyin

  // showHidePremiumTools FONKSIYONUNU EKLE - Premium sistem kodunun içine

  // Premium araçları göster/gizle
  function showHidePremiumTools() {
    const premiumTools = document.getElementById('premiumTools');
    if (premiumTools) {
      if (isPremiumUser) {
        premiumTools.style.display = 'flex';
        console.log('Premium tools gösteriliyor');
      } else {
        premiumTools.style.display = 'none';
        console.log('Premium tools gizleniyor');
      }
    } else {
      console.log('Premium tools elementi bulunamadı!');
    }
  }
  window.showHidePremiumTools = showHidePremiumTools;

  // setTool fonksiyonuna premium araçları ekle
  const originalSetTool = window.setTool;
  window.setTool = function (toolName) {
    // Premium araç kontrolü
    if (['glitter', 'rainbow', 'glow'].includes(toolName) && !isPremiumUser) {
      showPremiumModal();
      return;
    }

    currentTool = toolName;

    // Tüm butonlardan active sınıfını kaldır
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Aktif butona active ekle
    const activeButton = document.querySelector(`#${toolName}Btn`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // Önce aracın boyutunu al
    let toolSize;
    switch (toolName) {
      case 'pencil':
        toolSize = pencilSize;
        break;
      case 'brush':
        toolSize = brushSize;
        break;
      case 'watercolor':
        toolSize = watercolorSize;
        break;
      case 'spray':
        toolSize = spraySize;
        break;
      case 'erase':
        toolSize = eraseSize;
        break;
      case 'glitter':
        toolSize = glitterSize;
        break;
      case 'rainbow':
        toolSize = rainbowSize;
        break;
      case 'glow':
        toolSize = glowSize;
        break;
      default:
        toolSize = 10;
    }

    // Canvas context'i güncelle
    ctx.lineWidth = toolSize;

    // Slider'ı güncelle
    const toolSlider = document.getElementById('toolSize');
    const sizeDisplay = document.getElementById('sizeValue');
    if (toolSlider) {
      toolSlider.value = toolSize;
    }
    if (sizeDisplay) {
      sizeDisplay.textContent = toolSize;
    }

    // Kompozisyon ayarları
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;

    console.log(`Tool changed to: ${toolName}, Size: ${toolSize}`);
  }

  // DOMContentLoaded'a ekleyin
  document.addEventListener('DOMContentLoaded', function () {
    // Önceki kodlar...

    // Premium araçları göster/gizle
    showHidePremiumTools();

    // Premium durumu değiştiğinde araçları güncelle
    if (isPremiumUser) {
      const premiumTools = document.getElementById('premiumTools');
      if (premiumTools) {
        premiumTools.style.display = 'flex';
      }
    }
  });

  // Get Offline Pro butonuna event ekle
  const offlineBtn = document.getElementById('downloadAppBtn');
  if (offlineBtn) {
    offlineBtn.addEventListener('click', handleOfflineProClick);
  }

  // Save butonuna limit ekle
  const originalSaveBtn = document.getElementById('saveBtn');
  if (originalSaveBtn) {
    // Eski event listener'ı kaldır ve yenisini ekle
    const newSaveBtn = originalSaveBtn.cloneNode(true);
    originalSaveBtn.parentNode.replaceChild(newSaveBtn, originalSaveBtn);

    newSaveBtn.addEventListener('click', function () {
      if (!checkSaveLimit()) {
        return;
      }

      // Normal kaydetme işlemi
      if (!isPremiumUser) {
        dailySaveCount++;
        localStorage.setItem('dailySaves', dailySaveCount.toString());

        // Kalan hakkı göster
        const remaining = 3 - dailySaveCount;
        if (remaining > 0) {
          const info = document.createElement('div');
          info.className = 'save-info';
          info.textContent = `${remaining} saves remaining today`;
          document.body.appendChild(info);
          setTimeout(() => info.remove(), 3000);
        }
      }

      // Orijinal save fonksiyonunu çağır
      handleDownloadClick();
    });
  }

  // Yüksek çözünürlük indirme (Premium özellik)
  if (isPremiumUser) {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        const hdCanvas = document.createElement('canvas');
        hdCanvas.width = canvas.width * 2;
        hdCanvas.height = canvas.height * 2;
        const hdCtx = hdCanvas.getContext('2d');
        hdCtx.scale(2, 2);
        hdCtx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = 'magical-coloring-hd.png';
        link.href = hdCanvas.toDataURL('image/png', 1.0);
        link.click();
      });
    }
  }
});

// Test için: Konsola yazarak premium'u test edebilirsiniz
// localStorage.setItem('isPremium', 'true'); location.reload();

// PREMIUM EKSTRA ÖZELLİKLER - script.js'e ekleyin (premium sistem kodundan SONRA)

// Premium araçları ekle
function addPremiumTools() {
  if (!isPremiumUser) return;

  // Toolbar'a premium araçları ekle
  const toolbar = document.querySelector('.toolbar');
  if (!toolbar) return;

  // Magic tools div'ini bul veya oluştur
  let magicTools = document.querySelector('.premium-tools');
  if (!magicTools) {
    magicTools = document.createElement('div');
    magicTools.className = 'premium-tools';
    toolbar.appendChild(magicTools);
  }

  // Glitter Brush ekle
  if (!document.getElementById('glitterBtn')) {
    const glitterBtn = document.createElement('button');
    glitterBtn.id = 'glitterBtn';
    glitterBtn.className = 'btn tool-btn premium-btn';
    glitterBtn.innerHTML = '✨ Glitter';
    glitterBtn.onclick = () => setTool('glitter');
    magicTools.appendChild(glitterBtn);
  }

  // Rainbow Brush ekle
  if (!document.getElementById('rainbowBtn')) {
    const rainbowBtn = document.createElement('button');
    rainbowBtn.id = 'rainbowBtn';
    rainbowBtn.className = 'btn tool-btn premium-btn';
    rainbowBtn.innerHTML = '🌈 Rainbow';
    rainbowBtn.onclick = () => setTool('rainbow');
    magicTools.appendChild(rainbowBtn);
  }

  // Glow Brush ekle
  if (!document.getElementById('glowBtn')) {
    const glowBtn = document.createElement('button');
    glowBtn.id = 'glowBtn';
    glowBtn.className = 'btn tool-btn premium-btn';
    glowBtn.innerHTML = '💫 Glow';
    glowBtn.onclick = () => setTool('glow');
    magicTools.appendChild(glowBtn);
  }
}

// Glitter efekti için değişkenler
// PREMIUM ARAÇLARI İYİLEŞTİRME - Mevcut premium kodlarının üzerine yazın

// Premium araç boyutları
let glitterSize = 20;
let rainbowSize = 25;
let glowSize = 25;

// getCurrentToolSize fonksiyonunu güncelle
function getCurrentToolSize() {
  switch (currentTool) {
    case 'pencil':
      return pencilSize;
    case 'brush':
      return brushSize;
    case 'spray':
      return spraySize;
    case 'watercolor':
      return watercolorSize;
    case 'eraser':
      return eraseSize;
    case 'glitter':
      return glitterSize;
    case 'rainbow':
      return rainbowSize;
    case 'glow':
      return glowSize;
    default:
      return 10;
  }
}

// updateSize fonksiyonunu güncelle
function updateSize(size) {
  size = parseInt(size);
  if (isNaN(size)) return;

  const sizeValue = document.getElementById('sizeValue');
  if (sizeValue) sizeValue.textContent = size;

  switch (currentTool) {
    case 'pencil':
      pencilSize = size;
      break;
    case 'brush':
      brushSize = size;
      break;
    case 'watercolor':
      watercolorSize = size;
      break;
    case 'spray':
      spraySize = size;
      break;
    case 'eraser':
      eraseSize = size;
      break;
    case 'glitter':
      glitterSize = size;
      break;
    case 'rainbow':
      rainbowSize = size;
      break;
    case 'glow':
      glowSize = size;
      break;
  }

  if (window.ctx) {
    ctx.lineWidth = size;
  }
}

// İYİLEŞTİRİLMİŞ GLITTER
function drawGlitter(x, y) {
  const sparkleCount = Math.floor(glitterSize * 2); // Boyuta göre parıltı sayısı
  const radius = glitterSize;

  for (let i = 0; i < sparkleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;
    const sparkleX = x + Math.cos(angle) * distance;
    const sparkleY = y + Math.sin(angle) * distance;
    const sparkleSize = Math.random() * (glitterSize / 4) + 1;

    // Çok renkli parıltılar
    const glitterColors = ['#FFD700', '#FF69B4', '#00CED1', '#9370DB', '#FF1493', '#FFFFFF'];
    ctx.fillStyle = glitterColors[Math.floor(Math.random() * glitterColors.length)];

    // Yıldız şekli
    ctx.save();
    ctx.translate(sparkleX, sparkleY);
    ctx.rotate(Math.random() * Math.PI);

    // Daha belirgin yıldızlar
    ctx.beginPath();
    for (let j = 0; j < 5; j++) {
      const angle = (j * 4 * Math.PI) / 5;
      const innerRadius = sparkleSize * 0.4;
      const outerRadius = sparkleSize;

      if (j === 0) {
        ctx.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      } else {
        ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      }

      const innerAngle = angle + Math.PI / 5;
      ctx.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius);
    }
    ctx.closePath();
    ctx.fill();

    // Parıltı efekti için glow
    ctx.shadowBlur = 5;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();

    ctx.restore();
  }
}

// GERÇEKÇİ GÖKKUŞAĞI ARACI - DÜZELTILMIŞ VERSİYON
function drawRainbow(x, y) {
  if (!lastX || !lastY) {
    lastX = x;
    lastY = y;
    return;
  }

  // GERÇEK gökkuşağı renkleri (daha az renk, daha düzgün)
  const rainbowColors = [
    '#FF0000',  // Kırmızı
    '#FF8000',  // Turuncu  
    '#FFFF00',  // Sarı
    '#00FF00',  // Yeşil
    '#0080FF',  // Mavi
    '#8000FF',  // Mor
    '#FF00FF'   // Pembe
  ];

  // Fırça yönünü hesapla
  const dx = x - lastX;
  const dy = y - lastY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 2) return; // Daha az hassasiyet

  // Dik açı hesapla (gökkuşağı bandları için)
  const perpX = -dy / distance;
  const perpY = dx / distance;

  // Daha az adım - kesintileri önler
  const steps = Math.max(Math.floor(distance), 1);

  for (let step = 0; step < steps; step++) {
    const t = step / steps;
    const centerX = lastX + dx * t;
    const centerY = lastY + dy * t;

    // Gökkuşağı genişliği
    const totalWidth = rainbowSize;
    const bandWidth = totalWidth / rainbowColors.length;

    // Her renk bandını çiz
    rainbowColors.forEach((color, index) => {
      ctx.save();

      // Daha az blur
      ctx.shadowBlur = 1;
      ctx.shadowColor = color;

      ctx.strokeStyle = color;
      ctx.lineWidth = bandWidth + 2; // Bantlar arası boşluk olmasın
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.9; // Daha opak

      // Her bandın konumunu hesapla
      const offset = (index - rainbowColors.length / 2) * bandWidth;
      const bandX = centerX + perpX * offset;
      const bandY = centerY + perpY * offset;

      ctx.beginPath();
      const prevT = Math.max((step - 1) / steps, 0);
      const prevCenterX = lastX + dx * prevT;
      const prevCenterY = lastY + dy * prevT;
      const prevBandX = prevCenterX + perpX * offset;
      const prevBandY = prevCenterY + perpY * offset;

      ctx.moveTo(prevBandX, prevBandY);
      ctx.lineTo(bandX, bandY);
      ctx.stroke();

      ctx.restore();
    });
  }

  // Ayarları temizle
  ctx.globalAlpha = 1.0;
  ctx.shadowBlur = 0;
  lastX = x;
  lastY = y;
}

// TAMAMEN YENİDEN TASARLANAN GLOW
function drawGlow(x, y) {
  // Ana rengin daha açık versiyonlarını oluştur
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgb = hexToRgb(currentColor);

  if (lastX && lastY) {
    // Dış glow katmanları
    for (let i = 5; i > 0; i--) {
      ctx.save();

      // Katman başına azalan opaklık
      const alpha = 0.05 + (0.1 / i);
      ctx.globalAlpha = alpha;

      // Katman genişliği
      ctx.lineWidth = glowSize * (1 + i * 0.5);
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Blur efekti
      ctx.shadowBlur = glowSize * i * 0.3;
      ctx.shadowColor = currentColor;

      // Çizgiyi çiz
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.restore();
    }

    // Merkez parlak çizgi
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.lineWidth = glowSize * 0.3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowBlur = glowSize;
    ctx.shadowColor = currentColor;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // İkinci merkez çizgi (renkli)
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = glowSize * 0.2;
    ctx.stroke();

    ctx.restore();
  }

  lastX = x;
  lastY = y;
}

// setTool fonksiyonunu güncelle - size slider'ı doğru değere ayarla
const originalSetTool = window.setTool || function () { };
window.setTool = function (toolName) {
  // Premium araç kontrolü
  if (['glitter', 'rainbow', 'glow'].includes(toolName) && !isPremiumUser) {
    showPremiumModal();
    return;
  }

  currentTool = toolName;

  // Butonları güncelle
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeButton = document.getElementById(`${toolName}Btn`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // Size slider'ı güncelle
  const sizeSlider = document.getElementById('toolSize');
  const sizeDisplay = document.getElementById('sizeValue');

  if (sizeSlider && sizeDisplay) {
    const currentSize = getCurrentToolSize();
    sizeSlider.value = currentSize;
    sizeDisplay.textContent = currentSize;
  }

  // Kompozisyon ayarları
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;

  console.log(`Tool: ${toolName}, Size: ${getCurrentToolSize()}`);
};
// Mevcut draw fonksiyonuna premium araçları ekle
const originalDraw = window.draw;
window.draw = function (e) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.round((e.clientX - rect.left) * scaleX);
  const y = Math.round((e.clientY - rect.top) * scaleY);

  // Premium araçlar
  if (isPremiumUser) {
    switch (currentTool) {
      case 'glitter':
        drawGlitter(x, y);
        lastX = x;
        lastY = y;
        return;
      case 'rainbow':
        drawRainbow(x, y);
        return;
      case 'glow':
        drawGlow(x, y);
        return;
    }
  }

  // Normal araçlar için orijinal draw fonksiyonunu çağır
  if (originalDraw) {
    originalDraw.call(this, e);
  }
};

// Yüksek çözünürlük kaydetme
function saveHighResolution() {
  if (!isPremiumUser) return;

  // 2x büyüklükte canvas oluştur
  const hdCanvas = document.createElement('canvas');
  hdCanvas.width = canvas.width * 2;
  hdCanvas.height = canvas.height * 2;
  const hdCtx = hdCanvas.getContext('2d');

  // Mevcut çizimi 2x ölçekle kopyala
  hdCtx.imageSmoothingEnabled = true;
  hdCtx.imageSmoothingQuality = 'high';
  hdCtx.scale(2, 2);
  hdCtx.drawImage(canvas, 0, 0);

  // PNG olarak indir
  const link = document.createElement('a');
  link.download = `magical-coloring-hd-${Date.now()}.png`;
  link.href = hdCanvas.toDataURL('image/png', 1.0);
  link.click();

  // Başarı mesajı
  const msg = document.createElement('div');
  msg.className = 'hd-save-msg';
  msg.textContent = '✅ Saved in High Resolution!';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

// handlePointerMove fonksiyonunu güncelle
const originalHandlePointerMove = window.handlePointerMove;
window.handlePointerMove = function (e) {
  if (!isDrawing) return;

  const coords = getCanvasCoordinates(e);
  const x = coords.x;
  const y = coords.y;

  // Premium araçlar için özel işlem
  if (isPremiumUser) {
    switch (currentTool) {
      case 'glitter':
        drawGlitter(x, y);
        return;
      case 'rainbow':
        drawRainbow(x, y);
        return;
      case 'glow':
        drawGlow(x, y);
        return;
    }
  }

  // Normal araçlar için orijinal fonksiyonu çağır
  if (originalHandlePointerMove) {
    originalHandlePointerMove.call(this, e);
  }
};

// DOMContentLoaded'a ekle
document.addEventListener('DOMContentLoaded', function () {
  // Premium araçları ekle
  if (isPremiumUser) {
    setTimeout(addPremiumTools, 100);

    // HD Save butonunu güncelle
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn && isPremiumUser) {
      saveBtn.innerHTML = '💾 Save HD';

      // Yeni event listener ekle
      const newSaveBtn = saveBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

      newSaveBtn.addEventListener('click', function (e) {
        e.preventDefault();
        saveHighResolution();
      });
    }
  }
});

// Undo limiti kaldır (Premium)
if (isPremiumUser) {
  // drawingHistory limit kontrolünü override et
  const originalSaveDrawingState = window.saveDrawingState;
  window.saveDrawingState = function () {
    // Premium kullanıcılar için limit yok
    if (originalSaveDrawingState) {
      originalSaveDrawingState.call(this);
    }
  };
}

// At the top of the file
const canvas = document.getElementById('coloringCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const sizeSelector = document.getElementById('toolSize');

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('coloringCanvas');
  if (canvas) {
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Initialize components
    setupEventListeners();
    loadDrawing(); // Add loadDrawing() here

    // Fast image loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.loading = 'eager';
    });

    // Splash screen management
    const splashScreen = document.querySelector('.splash-screen');
    const mainContent = document.getElementById('mainContent');
    if (splashScreen && mainContent) {
      setTimeout(() => {
        splashScreen.classList.add('fade-out');
        mainContent.style.display = 'block';
        setTimeout(() => {
          splashScreen.style.display = 'none';
        }, 500);
      }, 2000);
    }
  }
});






// Görselleri önceden yükle
const preloadImages = () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.loading = 'eager';
    const preloadLink = document.createElement('link');
    preloadLink.href = img.src;
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    document.head.appendChild(preloadLink);
  });
}
// Tool butonları için event listener'ları düzenleyelim
function setTool(toolName) {
  currentTool = toolName;

  // Remove active class from all buttons
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active class to selected button
  const activeButton = document.querySelector(`#${toolName}Btn`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // Update current line width based on selected tool
  switch (toolName) {
    case 'pencil':
      ctx.lineWidth = pencilSize;
      break;
    case 'brush':
      ctx.lineWidth = brushSize;
      break;
    case 'watercolor':
      ctx.lineWidth = watercolorSize;
      break;
    case 'spray':
      // Spray için boyut ayarı
      break;
    case 'erase':
      ctx.lineWidth = eraseSize;
      break;
  }

  // Reset compositing properties
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;

  console.log(`Tool changed to: ${toolName} with size: ${ctx.lineWidth}`);

  // Size slider'ını geçerli aracın boyutuna ayarla
  const toolSizeSlider = document.getElementById('toolSize');
  const sizeValueDisplay = document.getElementById('sizeValue');

  if (toolSizeSlider && sizeValueDisplay) {
    let currentSize;

    switch (toolName) {
      case 'pencil': currentSize = pencilSize; break;
      case 'brush': currentSize = brushSize; break;
      case 'watercolor': currentSize = watercolorSize; break;
      case 'spray': currentSize = spraySize; break;
      case 'erase': currentSize = eraseSize; break;
      default: currentSize = 5;
    }

    toolSizeSlider.value = currentSize;
    sizeValueDisplay.textContent = currentSize;
  }
}


// Buton event listener'larını ekleyelim
const toolButtons = {
  'pencilBtn': 'pencil',
  'brushBtn': 'brush',
  'watercolorBtn': 'watercolor',
  'eraseBtn': 'erase'
};

Object.entries(toolButtons).forEach(([buttonId, toolName]) => {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // Sayfa yenilemeyi engelle
      setTool(toolName);
    });
  }
});
// Update MessageChannel setup
function setupMessageChannel() {
  try {
    messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = handleMessage;

    // Add proper cleanup
    window.addEventListener('unload', () => {
      if (messageChannel) {
        messageChannel.port1.close();
        messageChannel.port2.close();
      }
    });

    return messageChannel.port2;
  } catch (error) {
    console.log('MessageChannel setup completed');
    return null;
  }
}

// Enhance message handling
function handleMessage(event) {
  if (!event.data) return false;

  switch (event.data.type) {
    case 'draw':
    case 'tool':
      // Handle synchronously
      break;
    default:
      return false;
  }
}

function setupEventListeners() {
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Canvas events
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointerout', handlePointerUp);
}


// Tool buttons
document.querySelectorAll('.tool-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tool = btn.getAttribute('data-tool');
    if (tool) setTool(tool);
  });
});


function initializeCanvas() {
  if (!canvas || !ctx) {
    console.error('Canvas or context not available');
    return;
  }

  // Set initial canvas size
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.backgroundColor = 'white';

  // Clear and set background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Initialize other canvas properties
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}
window.onload = function () {
  initializeCanvas();
  loadDrawing(); // This loads image.png as default state
  setupEventListeners();
};


const colorPalette = document.getElementById('colorPalette');
let currentColor = '#FF00FF';
let drawingHistory = [];
let currentStep = -1;
let originalImageData = null;
let pencilSize = 2;
let brushSize = 10;
let spraySize = 10;
let watercolorSize = 20;
let eraseSize = 10;

// Boyut değiştirme fonksiyonu - Global olarak tanımla
function updateSize(size) {
  size = parseInt(size);
  if (isNaN(size)) return;

  // Gösterge metnini güncelle
  const sizeValue = document.getElementById('sizeValue');
  if (sizeValue) sizeValue.textContent = size;

  // Değişkenleri güncelle
  if (typeof currentTool === 'undefined') return;

  // Araç boyutlarını güncelle
  switch (currentTool) {
    case 'pencil':
      pencilSize = size;
      break;
    case 'brush':
      brushSize = size;
      break;
    case 'watercolor':
      watercolorSize = size;
      break;
    case 'spray':
      spraySize = size;
      break;
    case 'erase':
      eraseSize = size;
      break;
    case 'glitter':
      glitterSize = size;
      break;
    case 'rainbow':
      rainbowSize = size;
      break;
    case 'glow':
      glowSize = size;
      break;
  }


  // Canvas context varsa çizim kalınlığını güncelle
  if (window.ctx) {
    ctx.lineWidth = size;
    console.log(`Boyut güncellendi: ${size}`);
  }
}
function getCurrentToolSize() {
  switch (currentTool) {
    case 'pencil':
      return pencilSize;
    case 'brush':
      return brushSize;
    case 'spray':
      return spraySize;
    case 'watercolor':
      return watercolorSize;
    case 'eraser':
      return eraseSize;
    case 'glitter':
      return glitterSize;
    case 'rainbow':
      return rainbowSize;
    case 'glow':
      return glowSize;
    default:
      return 1;
  }
}

// Sihirli değnek fonksiyonlarını buraya ekleyin
function drawMagicStar(x, y) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
  ;

  // Daha açık ve parlak renkler
  const colors = [
    '#FFFDD0', // Cream
    '#FFFACD', // Lemon Chiffon
    '#FFFFF0', // Ivory
    '#FFF8DC', // Cornsilk
    '#FFFFE0'  // Light Yellow
  ];

  const size = Math.random() * 10 + 8;

  // Ana yıldız çizimi - net kenarlar
  ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  ctx.strokeStyle = '#FFD700'; // Altın rengi kenar
  ctx.lineWidth = 0.8;

  // İlk katman - ana yıldız
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(
      x + size * Math.cos(i * 4 * Math.PI / 5),
      y + size * Math.sin(i * 4 * Math.PI / 5)
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // İkinci katman - iç parlama
  ctx.fillStyle = '#FFFFFF';
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(
      x + (size * 0.6) * Math.cos(i * 4 * Math.PI / 5),
      y + (size * 0.6) * Math.sin(i * 4 * Math.PI / 5)
    );
  }
  ctx.closePath();
  ctx.fill();

  // Opaklığı geri ayarla
  ctx.globalAlpha = 1.0;

  // Merkez noktası - ekstra parlaklık
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
}

function drawMagicFlower(x, y) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
  ;

  const flowerColors = [
    '#FFFFFF', // Beyaz
    '#FF0000', // Kırmızı
    '#0000FF', // Mavi
    '#800080'  // Mor
  ];

  const selectedColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
  const size = Math.random() * 7 + 8;
  const petalCount = Math.floor(Math.random() * 3) + 7;

  // Taç yapraklar - önce kenar çizgisi
  for (let i = 0; i < petalCount; i++) {
    ctx.beginPath();
    ctx.strokeStyle = '#000000'; // Siyah kenar çizgisi
    ctx.lineWidth = 0.5; // İnce çizgi kalınlığı
    ctx.fillStyle = selectedColor;

    ctx.ellipse(
      x + (size * 0.8) * Math.cos(i * Math.PI / (petalCount / 2)),
      y + (size * 0.8) * Math.sin(i * Math.PI / (petalCount / 2)),
      size * 0.6,
      size * 0.3,
      i * Math.PI / (petalCount / 2),
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke(); // Kenar çizgisini çiz
  }

  // Merkez
  ctx.beginPath();
  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#000000';
  ctx.arc(x, y, size * 0.4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}


function setPencilStyle() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = pencilSize;
  ctx.strokeStyle = currentColor;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

function setBrushStyle() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = brushSize * 2;
  ctx.strokeStyle = currentColor;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

function setWatercolorStyle() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = watercolorSize;
  ctx.strokeStyle = currentColor;
  ctx.globalAlpha = 0.3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}


function drawSpray(x, y) {
  const density = 50;
  const radius = spraySize;
  ctx.fillStyle = currentColor;

  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const randomRadius = Math.random() * radius;

    const sprayX = x + (randomRadius * Math.cos(angle));
    const sprayY = y + (randomRadius * Math.sin(angle));

    ctx.beginPath();
    ctx.arc(sprayX, sprayY, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function resizeCanvas() {
  if (!canvas) return;

  const container = canvas.parentElement;
  if (!container) return;

  // Mevcut içeriği geçici olarak kaydet
  let tempImageData = null;
  if (ctx) {
    try {
      tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.log("Canvas içeriği kaydedilemedi");
    }
  }

  // Oranı koru (4:3)
  const containerWidth = container.clientWidth * 0.7; // Canvas container'ın %70'i
  const desiredHeight = containerWidth * (600 / 800); // 4:3 oranını koru

  // Maksimum bir yükseklik belirle
  const maxHeight = window.innerHeight * 0.6; // Ekran yüksekliğinin %60'ı
  const finalHeight = Math.min(desiredHeight, maxHeight);

  canvas.width = containerWidth;
  canvas.height = finalHeight;

  // Canvas ayarlarını geri yükle
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Eğer hiçbir içerik yoksa ve characterImage yüklendiyse tekrar çiz
  if (characterImage.complete && characterImage.naturalWidth !== 0) {
    loadDrawing();
  } else if (tempImageData) {
    // Geçici olarak kaydedilen içeriği geri yükle
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = tempImageData.width;
    tempCanvas.height = tempImageData.height;
    tempCtx.putImageData(tempImageData, 0, 0);

    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
  } else {
    // Canvas boşsa beyaz arka plan
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
// Pencere yeniden boyutlandığında canvas'ı güncelle
window.addEventListener('resize', resizeCanvas);


let characterImage = new Image();
characterImage.crossOrigin = "Anonymous";
characterImage.src = 'image.png';

characterImage.onload = function () {
  loadDrawing();
  resizeCanvas();
};

characterImage.onerror = function () {
  console.error("Image could not be loaded");
  alert("An error occurred while loading the image. Please refresh the page.");
};


const colors = [
  // Kırmızı tonları
  '#FF0000', '#8B0000', '#DC143C', '#CD5C5C', '#FF4500',
  // Turuncu tonları
  '#FFA500', '#FF8C00', '#FF7F50', '#FF6347',
  // Sarı tonları
  '#FFD700', '#FFFF00', '#F0E68C', '#BDB76B',
  // Yeşil tonları
  '#A4C309', '#32CD32', '#008000', '#006400', '#2E8B57', '#3CB371',
  // Turkuaz tonları
  '#00CED1', '#20B2AA', '#007BA7',
  // Mavi tonları
  '#0000FF', '#000080', '#4169E1', '#1E90FF', '#87CEEB',
  // Mor tonları
  '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', "#C29BE8",
  // Pembe tonları
  '#FF1493', '#FF69B4', '#FFC0CB', '#DB7093',
  // Kahverengi tonları
  '#8B4513', '#A0522D', '#CD853F', '#FFDFC4',
  // Gri tonları
  '#2F4F4F', '#708090', '#36454F', '#A9A9A9',
  // Siyah ve beyaz
  '#212121', '#FFFFFF',
  // Parlak renkler
  , '#FF1493', '#00FF00', '#00FFFF', '#FF00FF', '#FFFF00',
  // Altın yaldız tonları
  '#FFD700', '#DAA520', '#B8860B', '#CD7F32', '#D4AF37'

];
colors.forEach(color => {
  const swatch = document.createElement('div');
  swatch.className = 'color-swatch';
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', () => {
    currentColor = color;
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.globalAlpha = 1.0;
    console.log('Selected color:', currentColor);
  });
  colorPalette.appendChild(swatch);
});


const customColorPicker = document.createElement('input');
customColorPicker.type = 'color';
customColorPicker.value = '#FF0000';
customColorPicker.className = 'custom-color-picker';
customColorPicker.addEventListener('change', (e) => {
  currentColor = e.target.value;
  console.log('Custom color selected:', currentColor);
});
colorPalette.appendChild(customColorPicker);

function loadDrawing() {
  if (!canvas || !ctx) return;

  canvas.width = 800;  // Set default width
  canvas.height = 600; // Set default height

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (characterImage.complete && characterImage.naturalWidth !== 0) {
    const scale = Math.min(canvas.width / characterImage.width, canvas.height / characterImage.height) * 0.8;
    const x = (canvas.width - characterImage.width * scale) / 2;
    const y = (canvas.height - characterImage.height * scale) / 2;

    ctx.drawImage(characterImage, x, y, characterImage.width * scale, characterImage.height * scale);
    createProtectionAreas();
  }
}

function prepareImage(image) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = image.width;
  tempCanvas.height = image.height;
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

  // Ana çizim
  tempCtx.drawImage(image, 0, 0);

  // Keskinlik artırma
  tempCtx.globalCompositeOperation = 'multiply';
  tempCtx.globalAlpha = 0.7;
  tempCtx.drawImage(tempCanvas, 0, 0);

  // Kenar belirginleştirme
  tempCtx.globalCompositeOperation = 'screen';
  tempCtx.globalAlpha = 0.3;
  tempCtx.drawImage(tempCanvas, 0, 0);

  return tempCanvas;
}




function enhanceDrawing(ctx) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Keskinleştirme matrisi
  const kernel = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1]
  ];

  const tempData = new Uint8ClampedArray(data);

  // Görüntü keskinleştirme ve kenar geliştirme
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      let r = 0, g = 0, b = 0;

      // Kernel uygulama
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const offset = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[ky + 1][kx + 1];
          r += tempData[offset] * weight;
          g += tempData[offset + 1] * weight;
          b += tempData[offset + 2] * weight;
        }
      }

      // Kenar tespiti ve güçlendirme
      const brightness = (r + g + b) / 3;
      if (brightness < 128) {
        data[idx] = Math.max(0, r);
        data[idx + 1] = Math.max(0, g);
        data[idx + 2] = Math.max(0, b);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function createProtectionAreas() {
  const scale = Math.min(canvas.width / characterImage.width, canvas.height / characterImage.height) * 0.8;
  const x = (canvas.width - characterImage.width * scale) / 2;
  const y = (canvas.height - characterImage.height * scale) / 2;
  const width = characterImage.width * scale;
  const height = characterImage.height * scale;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
  ctx.fillRect(x, y, width, height);
}
let saveTimeout = null;

// Improved saveDrawingState function to prevent duplicate states
// This version works even with the "FINAL DRAWING ENGINE OVERRIDE"
function saveDrawingState() {
  // --- YENİ: Her çağrıda güncel canvas ve context'i al ---
  const canvas = document.getElementById('coloringCanvas');
  if (!canvas) {
    console.error("saveDrawingState: Canvas element not found!");
    return;
  }
  // willReadFrequently önemli olabilir, özellikle sık sık getImageData çağırıyorsanız
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    console.error("saveDrawingState: Canvas context not available");
    return;
  }
  // --- YENİ SONU ---

  try {
    // Mevcut durumu yakala
    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // If we're in the middle of the history and making a new change,
    // remove all future states
    if (currentStep < drawingHistory.length - 1) {
      console.log(`Slicing history from step ${currentStep + 1}`);
      drawingHistory = drawingHistory.slice(0, currentStep + 1);
    }

    // Yeni durumu geçmişe ekle
    currentStep++;
    drawingHistory.push(currentImageData); // Yakalanan güncel durumu ekle

    console.log('Saving state:', currentStep, 'History length:', drawingHistory.length);

    // Bellek taşmasını önlemek için geçmiş limiti (opsiyonel ama önerilir)
    const HISTORY_LIMIT = 50; // Örneğin 50 adım
    if (drawingHistory.length > HISTORY_LIMIT) {
      drawingHistory.shift(); // En eski adımı sil
      currentStep--; // Adımı bir geri al
      console.warn("History limit reached, oldest state removed.");
    }

    // Undo butonunun durumunu güncelle
    updateUndoButtonState();

  } catch (error) {
    // Hata, özellikle getImageData ile ilgili olabilir (örn: Tainted Canvas)
    console.error("Error saving drawing state:", error);
    // Kullanıcıya bilgi vermek veya durumu sıfırlamak düşünülebilir
  }
}
function imageDataEqual(data1, data2) {
  if (!data1 || !data2) return false; // Güvenlik kontrolü
  if (data1.width !== data2.width || data1.height !== data2.height) {
    return false;
  }
  // Tüm pikselleri karşılaştır
  for (let i = 0; i < data1.data.length; i++) { // Tüm byte'ları kontrol etmek en güvenlisi
    if (data1.data[i] !== data2.data[i]) {
      return false;
    }
  }
  return true;
}



function handleCanvasClick(e) {
  if (currentTool === 'fill') {
    try {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);
      console.log('Click position:', x, y);
      console.log('Current color:', currentColor);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      floodFill(imageData, x, y, hexToRgb(currentColor), canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
      saveDrawingState();
    } catch (error) {
      console.error("Error occurred during fill operation:", error);
      alert("Error occurred during fill operation:" + error.message);
    }
  }
}

function floodFill(imageData, startX, startY, fillColor, width, height) {
  // Sadece canvas sınırları kontrolü - daha basit
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    // console.log("🚫 Canvas sınırları dışında tıklama, fill iptal edildi");//
    return;
  }

  // Piksel rengini kontrol et - sadece beyaz kenarlara değil
  const pixelColor = getPixelColor(imageData, startX, startY);

  // Eğer canvas'ın kenarlarına çok yakınsa ve beyazsa iptal et
  const margin = 50; // 50 piksel kenar boşluğu
  if ((startX < margin || startX > width - margin ||
    startY < margin || startY > height - margin) &&
    (pixelColor.r > 240 && pixelColor.g > 240 && pixelColor.b > 240)) {
    // console.log("🚫 Canvas kenarında beyaz alana tıklama, fill iptal edildi"); //
    return;
  }

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
  const data = imageData.data;
  let stack = [[startX, startY]];
  const baseColor = getPixelColor(imageData, startX, startY);
  const tolerance = 20;
  let visited = new Set();

  function colorMatch(color1, color2) {
    return (
      Math.abs(color1.r - color2.r) < tolerance &&
      Math.abs(color1.g - color2.g) < tolerance &&
      Math.abs(color1.b - color2.b) < tolerance
    );
  }

  function isBlack(color) {
    const blackThreshold = 30;
    return color.r <= blackThreshold && color.g <= blackThreshold && color.b <= blackThreshold;
  }

  while (stack.length) {
    const [x, y] = stack.pop();
    const pixelIndex = (y * width + x) * 4;

    if (x < 0 || x >= width || y < 0 || y >= height || visited.has(pixelIndex)) continue;

    const currentColor = getPixelColor(imageData, x, y);

    // Siyah çizgileri her zaman koruyoruz
    if (isBlack(currentColor)) continue;

    if (!colorMatch(currentColor, baseColor)) continue;

    setPixelColor(imageData, x, y, fillColor);
    visited.add(pixelIndex);

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
}


function getPixelColor(imageData, x, y) {
  const index = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3]
  };
}

function setPixelColor(imageData, x, y, color) {
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = color.r;
  imageData.data[index + 1] = color.g;
  imageData.data[index + 2] = color.b;
  imageData.data[index + 3] = 255; // Tam opaklık
}


function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function handleUndoClick() {
  if (currentStep > 0 && currentStep < drawingHistory.length) {
    try {
      currentStep--;
      ctx.putImageData(drawingHistory[currentStep], 0, 0);
    } catch (error) {
      console.error("Error occurred during undo operation:", error);
      // Hata durumunda son geçerli adıma geri dön
      while (currentStep > 0) {
        currentStep--;
        try {
          ctx.putImageData(drawingHistory[currentStep], 0, 0);
          break;
        } catch (e) {
          console.error("Failed to return to previous step:", e);
        }
      }
      if (currentStep === 0) {
        loadDrawing(); // Başlangıç durumuna dön
      }
    }
  } else if (currentStep === 0 || currentStep >= drawingHistory.length) {
    loadDrawing(); // Başlangıç durumuna dön
  }
  updateUndoButtonState();
}


function handleSaveClick() {
  const dataUrl = canvas.toDataURL('image/png');
  const newTab = window.open('about:blank', 'image from canvas');
  newTab.document.write(`
      <html>
        <head>
          <title>Saved Image</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src='${dataUrl}' alt='Saved image'/>
        </body>
      </html>
    `);
}
function printCanvas() {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    alert("Yazdırılacak bir çizim bulunamadı!");
    return;
  }

  const dataUrl = canvas.toDataURL();

  const windowContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Yazdır</title>
      <style>
        body { margin: 0; text-align: center; }
        img { width: 100%; }
      </style>
    </head>
    <body>
      <img src="${dataUrl}" onload="window.print();window.close()" />
    </body>
    </html>
  `;

  const printWin = window.open('', '', 'width=800,height=600');
  printWin.document.open();
  printWin.document.write(windowContent);
  printWin.document.close();
}


function saveDrawingAsImage(fileName) {
  // Resmi veri URL'si olarak al
  const dataURL = canvas.toDataURL('image/png');

  // Yeni bir bağlantı (a etiketi) oluştur
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `${fileName}.png`;

  // Bağlantıyı tetikle
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function handleDownloadClick() {
  const dataUrl = canvas.toDataURL('image/png');
  const newTab = window.open('about:blank', 'image from canvas');
  newTab.document.write(`
    <html>
      <head>
        <title>Downloaded Image</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
          img { max-width: 100%; max-height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src='${dataUrl}' alt='Downloaded image'/>
      </body>
    </html>
  `);
}

function setupCategoryButtons() {
  const categoryButtons = document.querySelectorAll('.tab-btn');
  const thumbnailContainers = document.querySelectorAll('.page-thumbnails');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Tüm butonlardan active class'ını kaldır
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // Tıklanan butona active class'ı ekle
      button.classList.add('active');

      // Tüm thumbnail containerları gizle
      thumbnailContainers.forEach(container => container.classList.remove('active'));
      // İlgili kategoriyi göster
      const category = button.getAttribute('data-category');
      document.querySelector(`.page-thumbnails.${category}`).classList.add('active');
    });
  });
}

// setupEventListeners fonksiyonu içine ekleyelim
setupCategoryButtons();


// Button event listeners
const buttons = {
  'undoBtn': handleUndoClick,
  'saveBtn': handleSaveClick,
  'homeBtn': handleHomeClick,
  'uploadBtn': handleUploadClick,
  'downloadBtn': handleDownloadClick,
  'pencilBtn': () => setTool('pencil'),
  'brushBtn': () => setTool('brush'),
  'watercolorBtn': () => setTool('watercolor'), // Yeni eklenen
  'sprayBtn': () => setTool('spray'),
  'fillBtn': () => setTool('fill'),
  'starBtn': () => setTool('star'),
  'flowerBtn': () => setTool('flower'),
  'newPageBtn': createNewPage,
  'animateBtn': animateCharacter
};

Object.entries(buttons).forEach(([id, handler]) => {
  const element = document.getElementById(id);
  if (element) {
    element.removeEventListener('click', handler);
    element.addEventListener('click', handler);
  }
});



// Touch event handlers
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const touchX = touch.pageX - rect.left - window.scrollX;
  const touchY = touch.pageY - rect.top - window.scrollY;

  lastX = touchX;
  lastY = touchY;
  isDrawing = true;
}

function handleTouchMove(e) {
  if (!isDrawing) return;
  e.preventDefault();

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const touchX = touch.pageX - rect.left - window.scrollX;
  const touchY = touch.pageY - rect.top - window.scrollY;

  draw({
    offsetX: touchX,
    offsetY: touchY
  });
}




function handleTouchEnd() {
  isDrawing = false;
}



function handleUploadClick() {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleFileUpload;
    input.click();
  } catch (error) {
    console.error("File upload error", error);
    alert("An error occurred while uploading the file. Please try again.");
  }
}

function handleFileUpload(e) {
  try {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        try {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width / 2) - (img.width / 2) * scale;
          const y = (canvas.height / 2) - (img.height / 2) * scale;

          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          drawingHistory = [originalImageData];
          currentStep = 0;
          saveDrawingState(); // Yeni yüklenen resmi kaydet
        } catch (error) {
          console.error("Image loading error:", error);
          alert("An error occurred while loading the image. Please refresh the page.");
        }
      };
      img.onerror = function () {
        console.error("Image could not be loaded");
        alert("Image could not be loaded. Please select a valid image file.");
      };
      img.src = event.target.result;
    };
    reader.onerror = function (error) {
      console.error("File reading error:", error);
      alert("An error occurred while reading the file. Please try again.");
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("File processing error:", error);
    alert("An error occurred while processing the file. Please try again.");
  }
}


window.onerror = function (message, source, lineno, colno, error) {
  // Sadece gerçek hataları yakala, tool değişimlerini değil
  if (error && error.name !== 'TypeError') {
    console.error("An error occurred:", message, "Line:", lineno);
    alert("An error occurred. Please refresh the page or try again later.");
  }
};


window.addEventListener('resize', resizeCanvas);
resizeCanvas();
setupEventListeners();

function initApp() {
  try {
    resizeCanvas();
    setupEventListeners();
    loadDrawing();
  } catch (error) {
    console.error("Application initialization error:", error);
    alert("An error occurred while initializing the application. Try refreshing the page.");
  }
}
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
  isDrawing = true;

  // Doğru koordinatları kesin olarak hesapla
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Koordinatları tam sayıya yuvarla
  lastX = Math.round((e.clientX - rect.left) * scaleX);
  lastY = Math.round((e.clientY - rect.top) * scaleY);

  // Yeni çizim yolunu başlat
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}

function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    saveDrawingState();
  }
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);


let currentTool = 'fill';

// ... (previous code remains unchanged)
function handlePointerDown(e) {
  isDrawing = true;
  const coords = getCanvasCoordinates(e);
  lastX = coords.x;
  lastY = coords.y;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}


// globalCompositeOperation ayarını kaldırdık


// ... (rest of the code remains unchanged)



// Tool butonları için event listeners
document.getElementById('pencilBtn').addEventListener('click', () => setTool('pencil'));
document.getElementById('brushBtn').addEventListener('click', () => setTool('brush'));
document.getElementById('watercolorBtn').addEventListener('click', () => setTool('watercolor'));
document.getElementById('sprayBtn').addEventListener('click', () => setTool('spray'));
document.getElementById('fillBtn').addEventListener('click', () => setTool('fill'));
document.getElementById('eraseBtn').addEventListener('click', () => setTool('erase'));

sizeSelector.addEventListener('change', function (e) {  // VE BURAYA ekleyin
  ctx.lineWidth = e.target.value;
});
// Güvenli event listener ekleme fonksiyonu
function safeAddEventListener(elementId, eventType, handler) {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener(eventType, handler);
  }
}
// Then update the size event listeners to immediately affect drawing
document.getElementById('pencilSize').addEventListener('input', (e) => updateSize('pencil', e.target.value));
document.getElementById('brushSize').addEventListener('input', (e) => updateSize('brush', e.target.value));
document.getElementById('watercolorSize').addEventListener('input', (e) => updateSize('watercolor', e.target.value));
document.getElementById('spraySize').addEventListener('input', (e) => updateSize('spray', e.target.value));
document.getElementById('eraseSize').addEventListener('input', (e) => updateSize('erase', e.target.value));

function draw(e) {
  if (!isDrawing) return;

  // Doğru koordinatları hesapla
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Koordinatları tam sayıya yuvarla
  const x = Math.round((e.clientX - rect.left) * scaleX);
  const y = Math.round((e.clientY - rect.top) * scaleY);

  // Aynı noktaya tekrar çizmekten kaçın
  if (x === lastX && y === lastY) return;

  switch (currentTool) {
    case 'pencil':
      ctx.lineWidth = pencilSize;
      ctx.strokeStyle = currentColor;
      break;
    case 'brush':
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = currentColor;
      break;
    case 'watercolor':
      ctx.lineWidth = watercolorSize;
      ctx.strokeStyle = currentColor;
      ctx.globalAlpha = 0.3;
      break;
    case 'spray':
      // Spray aracı için özel işlem
      drawSpray(x, y);
      lastX = x;
      lastY = y;
      return;
    case 'erase':
      ctx.lineWidth = eraseSize;
      ctx.strokeStyle = '#FFFFFF';
      break;
  }

  // Çizim yap
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Koordinatları güncelle
  lastX = x;
  lastY = y;
}

function drawWatercolor(x, y) {
  // Renk karışımı için globalCompositeOperation ayarı
  ctx.globalCompositeOperation = 'multiply';

  // Hex rengi RGBA formatına dönüştürme
  const r = parseInt(currentColor.slice(1, 3), 16);
  const g = parseInt(currentColor.slice(3, 5), 16);
  const b = parseInt(currentColor.slice(5, 7), 16);

  // Birden fazla hafif şeffaf katman ile gerçekçi suluboya efekti
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();

    // Doğal görünüm için hafif rastgelelik ekleyin
    const randX1 = lastX + (Math.random() * 4 - 2);
    const randY1 = lastY + (Math.random() * 4 - 2);
    const randX2 = x + (Math.random() * 4 - 2);
    const randY2 = y + (Math.random() * 4 - 2);

    ctx.moveTo(randX1, randY1);
    ctx.lineTo(randX2, randY2);

    // Rastgele değişen opaklık
    const opacity = (Math.random() * 0.2) + 0.05;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    // Rastgele değişen genişlik
    const randSize = watercolorSize * (0.7 + Math.random() * 0.6);
    ctx.lineWidth = randSize;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  // İşlem bitince eski değerleri geri yükle
  lastX = x;
  lastY = y;
}
function getCanvasCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  let clientX = e.clientX;
  let clientY = e.clientY;

  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }

  // Math.floor ekleyerek koordinatları tam sayıya dönüştürün
  const x = Math.floor((clientX - rect.left) * scaleX);
  const y = Math.floor((clientY - rect.top) * scaleY);

  return { x, y };
}

function handlePointerDown(e) {
  isDrawing = true;
  const coords = getCanvasCoordinates(e);
  lastX = coords.x;
  lastY = coords.y;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}
function handlePointerMove(e) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);

  switch (currentTool) {
    case 'pencil':
      drawPencil(x, y);
      break;
    case 'brush':
      drawBrush(x, y);
      break;
    case 'watercolor':
      drawWatercolor(x, y);
      break;
    case 'spray':
      drawSpray(x, y);
      break;
    case 'erase':
      drawErase(x, y);
      break;
  }
}
function drawPencil(x, y) {
  // Keskin, net çizgiler için
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = pencilSize;
  ctx.strokeStyle = currentColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  lastX = x;
  lastY = y;
}

function drawBrush(x, y) {
  ctx.globalAlpha = 0.7; // ← 1.0'dan 0.7'ye düşürün (daha şeffaf)
  ctx.globalCompositeOperation = 'source-over';

  // Ana çizgi
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);

  // Hex rengi RGBA formatına dönüştürme
  const r = parseInt(currentColor.slice(1, 3), 16);
  const g = parseInt(currentColor.slice(3, 5), 16);
  const b = parseInt(currentColor.slice(5, 7), 16);

  // Asıl fırça vuruşu
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSize;
  ctx.stroke();

  // Dış kenarlar için hafif şeffaf katmanlar - daha şeffaf yapın
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();

    const offsetX1 = lastX + (Math.random() * 2 - 1);
    const offsetY1 = lastY + (Math.random() * 2 - 1);
    const offsetX2 = x + (Math.random() * 2 - 1);
    const offsetY2 = y + (Math.random() * 2 - 1);

    ctx.moveTo(offsetX1, offsetY1);
    ctx.lineTo(offsetX2, offsetY2);

    // Daha şeffaf katmanlar
    const opacity = 0.2 - (i * 0.05); // ← 0.3'ten 0.2'ye düşürdüm
    ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
    ctx.lineWidth = brushSize * (1.2 + i * 0.3);
    ctx.stroke();
  }

  lastX = x;
  lastY = y;
}
function drawSpray(x, y) {
  const density = 50; // Daha yüksek yoğunluk
  const radius = spraySize * 2; // Daha geniş dağılım alanı

  ctx.fillStyle = currentColor;

  // Dairesel dağılım için
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const randomRadius = Math.random() * radius;

    const sprayX = x + (randomRadius * Math.cos(angle));
    const sprayY = y + (randomRadius * Math.sin(angle));

    // Noktaları daha küçük yap
    ctx.beginPath();
    ctx.arc(sprayX, sprayY, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}






// ... diğer kodlar

function handlePointerUp(e) {
  isDrawing = false;
  const { x, y } = getCanvasCoordinates(e);

  switch (currentTool) {
    case 'star':
      drawMagicStar(x, y);
      saveDrawingState();
      break;
    case 'flower':
      drawMagicFlower(x, y);
      saveDrawingState();
      break;
    case 'fill':
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      floodFill(imageData, x, y, hexToRgb(currentColor), canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
      saveDrawingState();
      break;
    default: // pencil, brush, erase
      saveDrawingState();
  }
}

// Click olay dinleyicisini kaldırın
canvas.removeEventListener('click', handleCanvasClick);

// handleCanvasClick fonksiyonunu tamamen kaldırın

function drawErase(x, y) {
  ctx.save(); // Mevcut durumu kaydet

  ctx.globalCompositeOperation = 'destination-out';
  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = eraseSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  ctx.restore(); // Kaydedilen durumu geri yükle

  lastX = x;
  lastY = y;
}


function createNewPage() {
  if (!canvas || !ctx) return;

  canvas.width = 800;
  canvas.height = 600;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawingHistory = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
  currentStep = 0;
}

// Fazla drawBrush fonksiyonu silindi

function updateUndoButtonState() {
  const undoButton = document.getElementById('undoBtn');
  if (undoButton) {
    undoButton.disabled = currentStep <= 0;
  }
}
document.querySelectorAll('.page-thumbnail').forEach(thumbnail => {
  thumbnail.addEventListener('click', function () {
    const pageName = this.dataset.page;
    console.log("Küçük resme tıklandı:", pageName);
    loadColoringPage(pageName);
  });
});

function loadColoringPage(pageName) {
  console.log(`Loading page: ${pageName}`);

  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = function () {
    console.log(`${pageName}.png successfully loaded!`);

    // Get the canvas and context
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Make sure canvas has the correct dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Completely clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling to fit the image properly
    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    ) * 0.9;

    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    // Draw the new image
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    console.log("Image drawn to canvas");

    // Reset the drawing history
    drawingHistory = [];
    currentStep = -1;

    // Save this initial state as the first history item
    saveDrawingState();

    // Reset all drawing parameters to defaults
    resetDrawingParameters();
  };

  img.onerror = function () {
    console.error(`Could not load PNG: ${pageName}`);
    alert(`Could not load coloring page: ${pageName}`);
  };

  // Load the PNG file
  img.src = `coloring-pages-png/${pageName}.png`;
  console.log(`Attempting to load: ${img.src}`);
}
// Helper function to reset drawing parameters
function resetDrawingParameters() {
  // Reset tool to default
  currentTool = 'pencil';

  // Remove active class from all tool buttons
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active class to pencil button
  const pencilBtn = document.getElementById('pencilBtn');
  if (pencilBtn) {
    pencilBtn.classList.add('active');
  }

  // Reset global alpha and composite operation
  const ctx = document.getElementById('coloringCanvas').getContext('2d');
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';

  // Reset line properties
  ctx.lineWidth = pencilSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}
// When the page is fully loaded, make sure the thumbnails work correctly
document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM loaded, setting up thumbnails...");

  // Set up the category tabs
  setupCategoryButtons();

  // Find all thumbnails
  const thumbnails = document.querySelectorAll('.page-thumbnail');
  console.log(`Found ${thumbnails.length} thumbnails`);

  // Add click event to each thumbnail
  thumbnails.forEach(thumbnail => {
    // Remove any existing event listeners
    const newThumb = thumbnail.cloneNode(true);
    thumbnail.parentNode.replaceChild(newThumb, thumbnail);

    // Add new click event listener
    newThumb.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      console.log(`Clicked: ${pageName}`);
      if (pageName) {
        loadColoringPage(pageName);
      } else {
        console.error("No data-page attribute found on thumbnail!");
      }
    });
  });

  console.log("Thumbnail setup complete!");
});

// Dosya yollarını kontrol etmek için test fonksiyonu
function testImagePaths() {
  const testImages = [
    "coloring-pages-png/unicorn.png",
    "thumbnails-png/unicorn.png",
    "coloring-pages-png/narcissus.png",
    "coloring-pages-png/cat_and_dog.png",
    "coloring-pages-png/sun_mandala.png",
    "coloring-pages-png/boho_style.png"
  ];

  testImages.forEach(path => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => console.log(`${path} başarıyla yüklendi!`);
    img.onerror = () => console.error(`${path} yüklenemedi!`);
    img.src = path;
  });
}

// Sayfa yüklendiğinde test fonksiyonunu çalıştır
window.addEventListener('load', function () {
  console.log("Sayfa yüklendi, dosya yollarını test etme");
  testImagePaths();
});
function createSparkles(x, y) {
  const colors = ['#FFD700', '#FFF', '#FFC0CB'];
  for (let i = 0; i < 3; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = (x + Math.random() * 20 - 10) + 'px';
    sparkle.style.top = (y + Math.random() * 20 - 10) + 'px';
    sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}

window.addEventListener('load', initApp);
function handleUploadClick() {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleFileUpload;
    input.click();
  } catch (error) {
    console.error("File upload error:", error);
    alert("An error occurred while uploading the file. Please try again.");
  }
}
function handleHomeClick() {
  if (canvas && ctx) {
    loadDrawing(); // This will reload the original image.png
  }
}

function setColor(color) {
  currentColor = color;
  ctx.strokeStyle = currentColor;
  ctx.beginPath(); // Yeni renge geçerken yolu sıfırla

  // Önceki seçili rengi kaldır
  document.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
  // Yeni seçilen rengi işaretle
  event.target.classList.add('active');
}
function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 3 + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

function makeCharacterAnimatable(image) {
  const characterData = {
    image: image,
    originalX: image.x,
    originalY: image.y,
    width: image.width,
    height: image.height
  };

  image.dataset.animatable = 'true';
  return characterData;
}

function animateCharacter() {


  const originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let frame = 0;
  const totalFrames = 120;
  const fadeOutStart = 100; // Fade-out başlangıcı

  function addSparkles() {
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      const sparkleColor = `hsl(${Math.random() * 360}, 100%, 75%)`;
      ctx.fillStyle = sparkleColor;
      ctx.fill();
    }
  }

  const magicAnimation = setInterval(() => {
    frame++;
    ctx.putImageData(originalImage, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `hsl(${frame * 3}, 100%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${frame * 5}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${frame * 7}, 100%, 50%)`);

    // Fade-out efekti için opaklık hesaplama
    let opacity = 1;
    if (frame > fadeOutStart) {
      opacity = 1 - ((frame - fadeOutStart) / (totalFrames - fadeOutStart));
    }

    ctx.globalCompositeOperation = 'hue';
    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'lighter';
    addSparkles();

    if (frame >= totalFrames) {
      clearInterval(magicAnimation);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.putImageData(originalImage, 0, 0);
    }
  }, 1000 / 30);
}




canvas.addEventListener('mousemove', function (e) {
  if (isDrawing) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (currentTool) {

      case 'brush':
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case 'spray':
        spray(x, y);
        break;
    }

    createSparkles(e.clientX, e.clientY);
  }
});


canvas.addEventListener('mousedown', function (e) {
  if (currentTool === 'pencil' || currentTool === 'brush') {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastX = x;
    lastY = y;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
});
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          registerNotifications();
        }
      });
  }
}

function registerNotifications() {
  const notification = new Notification('Magical Coloring Game', {
    body: 'New coloring pages are waiting for you!',
    icon: '/icons/icon-192x192.png'
  });
}
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🔒 PWA install prompt engellendi');
  e.preventDefault();
  deferredPrompt = e;
  return false;
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  // Canvas'ı direkt PNG olarak indir
  const link = document.createElement('a');
  link.download = 'magical-coloring.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
document.getElementById('toolSize').addEventListener('input', function (e) {
  const newSize = e.target.value;
  document.getElementById('sizeValue').textContent = newSize;
  updateSize(currentTool, newSize);
});
function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
// Size slider için event listener
document.addEventListener('DOMContentLoaded', function () {
  const sizeSlider = document.getElementById('toolSize');
  const sizeValue = document.getElementById('sizeValue');

  if (sizeSlider && sizeValue) {
    console.log("Size slider bulundu ve bağlandı.");

    sizeSlider.addEventListener('input', function () {
      const newSize = parseInt(this.value);
      sizeValue.textContent = newSize;

      // Geçerli aracın boyutunu güncelle
      switch (currentTool) {
        case 'pencil':
          pencilSize = newSize;
          break;
        case 'brush':
          brushSize = newSize;
          break;
        case 'watercolor':
          watercolorSize = newSize;
          break;
        case 'spray':
          spraySize = newSize;
          break;
        case 'erase':
          eraseSize = newSize;
          break;
      }

      // Çizim kalınlığını güncelle
      ctx.lineWidth = newSize;
      console.log("Boyut değiştirildi:", newSize);
    });
  } else {
    console.error("Size slider veya size value elementi bulunamadı!");
    if (!sizeSlider) console.error("toolSize ID'li element yok!");
    if (!sizeValue) console.error("sizeValue ID'li element yok!");
  }
});
document.addEventListener('DOMContentLoaded', function () {
  // Tüm thumbnail'lara tıklama olayı ekle
  const thumbnails = document.querySelectorAll('.page-thumbnail');
  console.log(`Found ${thumbnails.length} thumbnails`);

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      console.log(`Thumbnail clicked: ${pageName}`);
      if (pageName) {
        loadColoringPage(pageName);
      }
    });
  });
});
// Home butonu için event listener
document.addEventListener('DOMContentLoaded', function () {
  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      // Canvas boyutlarını orijinal boyutlara geri getir
      canvas.width = 800;
      canvas.height = 600;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = 'image.png'; // Doğru dosya yolu

      img.onload = () => {
        // Resmi en-boy oranını koruyarak çiz
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * 0.8;

        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };

      img.onerror = () => {
        console.error('Resim yüklenemedi:', img.src);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Resim yüklenemedi', canvas.width / 2, canvas.height / 2);
      };
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    // Tüm boyut ayarı event listener'larını güvenli hale getir

    const pencilSizeElement = document.getElementById('pencilSize');
    if (pencilSizeElement) {
      pencilSizeElement.addEventListener('input', (e) => updateSize('pencil', e.target.value));
    }

    const brushSizeElement = document.getElementById('brushSize');
    if (brushSizeElement) {
      brushSizeElement.addEventListener('input', (e) => updateSize('brush', e.target.value));
    }

    const watercolorSizeElement = document.getElementById('watercolorSize');
    if (watercolorSizeElement) {
      watercolorSizeElement.addEventListener('input', (e) => updateSize('watercolor', e.target.value));
    }

    const spraySizeElement = document.getElementById('spraySize');
    if (spraySizeElement) {
      spraySizeElement.addEventListener('input', (e) => updateSize('spray', e.target.value));
    }

    const eraseSizeElement = document.getElementById('eraseSize');
    if (eraseSizeElement) {
      eraseSizeElement.addEventListener('input', (e) => updateSize('erase', e.target.value));
    }

    // Genel toolSize slider'ı hala çalışsın
    const toolSizeElement = document.getElementById('toolSize');
    if (toolSizeElement) {
      toolSizeElement.addEventListener('input', (e) => updateSize(currentTool, e.target.value));
    }
  });

  // Sosyal medya butonlarına tıklama olayları
  document.querySelectorAll('.social-button').forEach(button => {
    button.addEventListener('click', (e) => {
      if (button.classList.contains('email')) {
        // E-posta butonu için özel işlem
        e.preventDefault();
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=labourthings2@gmail.com', '_blank');
      }
    });
  });
  // Size slider test kodu
  console.log("Size slider test başlıyor...");
  const toolSizeTest = document.getElementById('toolSize');
  if (toolSizeTest) {
    console.log("toolSize elementi bulundu:", toolSizeTest);
    console.log("toolSize min:", toolSizeTest.min);
    console.log("toolSize max:", toolSizeTest.max);
    console.log("toolSize value:", toolSizeTest.value);

    toolSizeTest.addEventListener('input', function (e) {
      console.log("Slider değişti! Yeni değer:", e.target.value);
    });
  } else {
    console.error("toolSize elementi bulunamadı! Lütfen HTML yapısını kontrol edin.");
  }
});

// ==========================================
// FINAL DRAWING ENGINE OVERRIDE
// ==========================================

// Wait for window to fully load
window.addEventListener('load', function () {
  console.log("Final drawing engine starting...");

  // Wait a moment for everything to initialize properly
  setTimeout(function () {
    // Get canvas and replace it with new version
    const originalCanvas = document.getElementById('coloringCanvas');
    if (!originalCanvas) {
      console.error("Canvas not found");
      return;
    }

    // Create a new canvas with same attributes
    const newCanvas = originalCanvas.cloneNode(false);

    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous"; // img değil, tempImg olmalı!
    tempImg.src = originalCanvas.toDataURL();

    // Replace the original canvas with the new one
    originalCanvas.parentNode.replaceChild(newCanvas, originalCanvas);

    // Get the new canvas and set up context
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Make sure dimensions are correct
    canvas.width = 800;
    canvas.height = 600;

    // Copy the original content back if needed
    tempImg.onload = function () {
      ctx.drawImage(tempImg, 0, 0);
    };

    // Drawing state variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Direct pixel-based coordinate calculation
    function getPixelCoordinates(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    // Fresh event listeners for all drawing operations
    canvas.addEventListener('mousedown', function (e) {
      e.preventDefault();
      const coords = getPixelCoordinates(e);

      // Handle one-click tools
      if (currentTool === 'fill') {
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          floodFill(imageData, Math.round(coords.x), Math.round(coords.y),
            hexToRgb(currentColor), canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);
          saveDrawingState();
        } catch (error) {
          console.error("Fill error:", error);
        }
        return;
      }

      if (currentTool === 'star') {
        drawMagicStar(coords.x, coords.y);
        saveDrawingState();
        return;
      }

      if (currentTool === 'flower') {
        drawMagicFlower(coords.x, coords.y);
        saveDrawingState();
        return;
      }

      // Regular drawing tools
      isDrawing = true;
      lastX = coords.x;
      lastY = coords.y;

      // Debug
      console.log(`Drawing started at ${lastX},${lastY}`);
    });

    // Drawing movement
    canvas.addEventListener('mousemove', function (e) {
      if (!isDrawing) return;

      const coords = getPixelCoordinates(e);
      const x = coords.x;
      const y = coords.y;

      // Apply appropriate tool settings
      switch (currentTool) {
        case 'pencil':
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'source-over';
          ctx.lineWidth = pencilSize;
          ctx.strokeStyle = currentColor;
          break;
        case 'brush':
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'source-over';
          ctx.lineWidth = brushSize;
          ctx.strokeStyle = currentColor;
          break;
        case 'watercolor':
          ctx.globalAlpha = 0.3;
          ctx.globalCompositeOperation = 'source-over';
          ctx.lineWidth = watercolorSize;
          ctx.strokeStyle = currentColor;
          break;
        case 'spray':
          drawSpray(x, y);
          lastX = x;
          lastY = y;
          return;
        case 'erase':
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = eraseSize;
          ctx.strokeStyle = '#FFFFFF';
          break;
        default:
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'source-over';
          ctx.lineWidth = 5;
          ctx.strokeStyle = currentColor;
      }

      // Ensure line styling
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw the line
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Update coordinates
      lastX = x;
      lastY = y;
    });

    // End drawing
    canvas.addEventListener('mouseup', function () {
      if (isDrawing) {
        isDrawing = false;
        saveDrawingState();

        // Reset composite mode if needed
        if (currentTool === 'erase') {
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    });

    canvas.addEventListener('mouseout', function () {
      if (isDrawing) {
        isDrawing = false;
        saveDrawingState();

        // Reset composite mode if needed
        if (currentTool === 'erase') {
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    });

    // Touch support
    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (e.touches.length === 0) return;

      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX - rect.left,
        clientY: touch.clientY - rect.top
      });
      canvas.dispatchEvent(mouseEvent);
    }, { passive: false });

    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (e.touches.length === 0) return;

      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, { passive: false });  // passive: false ekleyin

    canvas.addEventListener('touchend', function () {
      const mouseEvent = new MouseEvent('mouseup');
      canvas.dispatchEvent(mouseEvent);
    }, { passive: true });  // passive: true ekleyin

  }, 500); // Half-second delay to ensure everything is loaded
});
// Bu kodu script.js dosyanıza eklemelisiniz
document.addEventListener('DOMContentLoaded', function () {
  // Tüm thumbnail'lara tıklama olayı ekle
  document.querySelectorAll('.page-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      console.log(`Tıklanan thumbnail: ${pageName}`); // Kontrol için
      if (pageName) {
        loadColoringPage(pageName);
      }
    });
  });
});
// Thumbnail görünümü için HTML'i güncelle
document.querySelectorAll('.page-thumbnails img').forEach(img => {
  // SVG thumbnail yerine PNG thumbnail kullan
  const pageName = img.getAttribute('data-page');
  img.src = `thumbnails-png/${pageName}.png`;
});


// Doğrudan canvas'a belirli bir resmi yükleme testi
function testSpecificImage() {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    console.log('Test resmi başarıyla yüklendi!');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  img.onerror = function (error) {
    console.error('Test resmi yüklenemedi:', error);
  };

  // Özel bir PNG dosyasının tam yolunu buraya yazın
  img.src = 'coloring-pages-png/unicorn.png'; // Dosya adını mevcut dosyayla değiştirin
}

// Bu satırı yorumdan çıkararak test fonksiyonunu çağırabilirsiniz
// testSpecificImage();
// Thumbnail tıklama olaylarını ayarla
const thumbnails = document.querySelectorAll('.page-thumbnail');
console.log(`${thumbnails.length} thumbnail bulundu`);

thumbnails.forEach(thumb => {
  thumb.onclick = function () {
    const pageName = this.getAttribute('data-page');
    console.log(`Tıklanan: ${pageName}`);
    loadColoringPage(pageName);
  };
});
console.log("Thumbnail tıklama olayları ayarlandı.");
// Thumbnail tıklama olaylarını düzeltme kodu - BU KODU DOSYANIZIN EN SONUNA EKLEYİN
document.addEventListener('DOMContentLoaded', function () {
  console.log("Thumbnail düzeltme kodu çalışıyor...");

  // Sayfa tamamen yüklendikten sonra çalışsın
  setTimeout(function () {
    // Tüm thumbnail'ları bul
    const thumbnails = document.querySelectorAll('.page-thumbnail');
    console.log(`${thumbnails.length} thumbnail bulundu`);

    // Her thumbnail için yeni tıklama olayı ekle
    thumbnails.forEach(function (thumb) {
      // Önce kopya oluşturarak eski olayları temizle
      const newThumb = thumb.cloneNode(true);
      if (thumb.parentNode) {
        thumb.parentNode.replaceChild(newThumb, thumb);
      }

      // Yeni olay dinleyicisi ekle
      newThumb.addEventListener('click', function (e) {
        // Tıklama bilgisini logla
        const pageName = this.getAttribute('data-page');
        console.log(`Tıklanan thumbnail: ${pageName}`);

        // Boyama sayfasını yükle
        if (pageName) {
          console.log(`loadColoringPage('${pageName}') çağrılıyor...`);
          loadColoringPage(pageName);
        } else {
          console.error("Thumbnail'da data-page özelliği bulunamadı!");
        }
      });
    });

    console.log("Thumbnail düzeltmeleri tamamlandı!");
  }, 1000); // 1 saniye bekle
});

// Elle test etmek için
console.log("Thumbnail düzeltme kodu eklendi. Elle test etmek için konsolda loadColoringPage('unicorn') çalıştırabilirsiniz.");
// Also add a load event handler as a backup to ensure thumbnails work
window.addEventListener('load', function () {
  setTimeout(function () {
    console.log("Rechecking thumbnail events...");

    // Get all thumbnails again
    const thumbnails = document.querySelectorAll('.page-thumbnail');

    // Make sure they all have working click handlers
    thumbnails.forEach(function (thumb) {
      // Clear old events
      const newThumb = thumb.cloneNode(true);
      if (thumb.parentNode) {
        thumb.parentNode.replaceChild(newThumb, thumb);
      }

      // Add new event
      newThumb.addEventListener('click', function () {
        const pageName = this.getAttribute('data-page');
        console.log(`Clicked thumbnail: ${pageName}`);

        if (pageName) {
          loadColoringPage(pageName);
        }
      });
    });

    console.log("Thumbnail events updated!");
  }, 1000); // Wait 1 second after load
});
// SCRIPT.JS'İN EN SONUNA EKLEYİN - TÜM SORUNLARIN ÇÖZÜMLERİ

// ==========================================
// 1. UNDO BUTONU KONUMU DÜZELTMESİ
// ==========================================
window.addEventListener('load', function () {
  setTimeout(() => {
    console.log('🔄 Undo butonu konumunu düzeltiliyor...');

    const undoBtn = document.getElementById('undoBtn');
    const eraseBtn = document.getElementById('eraseBtn');
    const toolbar = document.querySelector('.toolbar');

    if (undoBtn && eraseBtn && toolbar) {
      // Undo'yu erase'den hemen ÖNCE yerleştir
      eraseBtn.parentNode.insertBefore(undoBtn, eraseBtn);
      console.log('✅ Undo butonu erase\'den önce yerleştirildi');
    }
  }, 1000);
});

// ==========================================
// 2. PREMIUM BUTONLAR GİZLEME
// ==========================================
window.addEventListener('load', function () {
  setTimeout(() => {
    console.log('🔒 Premium butonları kontrol ediliyor...');

    const isPremiumUser = localStorage.getItem('isPremium') === 'true';
    const premiumTools = document.getElementById('premiumTools');

    if (premiumTools) {
      if (isPremiumUser) {
        premiumTools.style.display = 'flex';
        console.log('✅ Premium kullanıcı - araçlar gösteriliyor');
      } else {
        premiumTools.style.display = 'none';
        console.log('🔒 Ücretsiz kullanıcı - premium araçlar gizlendi');
      }
    }

    // Bireysel premium butonları da gizle
    ['glitterBtn', 'rainbowBtn', 'glowBtn'].forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.style.display = isPremiumUser ? 'inline-block' : 'none';
      }
    });

  }, 1200);
});

// ==========================================
// 3. NEWSLETTER SİSTEMİ - ÇALIŞAN VERSİYON
// ==========================================
window.addEventListener('load', function () {
  setTimeout(() => {
    console.log('📧 Newsletter sistemi kuruluyor...');
  }, 1000); // Added missing closing parenthesis and a timeout duration
  // Newsletter modal gösterme fonksiyonu
  window.showNewsletterModal = function () {
    console.log('📧 Newsletter modal açılıyor...');

    const modal = document.getElementById('newsletterModal');
    if (modal) {
      modal.style.display = 'flex';
    } else {
      console.error('Newsletter modal bulunamadı!');
    }
  };

  // Newsletter modal kapatma fonksiyonu
  window.closeNewsletterModal = function () {
    console.log('📧 Newsletter modal kapatılıyor...');
    const modal = document.getElementById('newsletterModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  // NEWSLETTER EMAILJS ÇALIŞAN KOD
  // script.js'de submitNewsletter fonksiyonunu bu kodla değiştirin

  submitNewsletter = function (event) {  // window. olmadan
    if (event) event.preventDefault();

    console.log('Newsletter gönderimi başladı...');

    const emailInput = document.getElementById('userEmail');
    const nameInput = document.getElementById('userName');
    const submitBtn = document.getElementById('subscribeBtn');

    // Email kontrolü
    if (!emailInput || !emailInput.value || !emailInput.value.includes('@')) {
      alert('Please enter a valid email address!');
      return false;
    }

    // EmailJS kontrolü
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS yüklenmemiş!');
      alert('Email service is temporarily unavailable.');
      return false;
    }

    // Buton durumu
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // Email parametreleri - Template'inizdeki değişken isimlerine göre düzenleyin
    const templateParams = {
      to_name: 'Magical Coloring Game Admin',  // Sizin isminiz
      from_name: nameInput && nameInput.value ? nameInput.value : 'Newsletter Subscriber',
      user_email: emailInput.value,
      message: `New newsletter subscription from: ${emailInput.value}`,
      reply_to: emailInput.value
    };

    console.log('Gönderilen parametreler:', templateParams);

    // EmailJS ile gönder - SERVICE_ID ve TEMPLATE_ID'yi değiştirin!
    emailjs.send('service_74njv1i', 'template_kane7si', templateParams)
      .then(function (response) {
        console.log('✅ Email başarıyla gönderildi!', response);

        // Başarı mesajı göster
        showSuccessMessage('🎉 Successfully Subscribed! <br> Thank you for joining our newsletter!');

        // Modal'ı kapat
        closeNewsletterModal();

        // Formu temizle
        if (emailInput) emailInput.value = '';
        if (nameInput) nameInput.value = '';

        // Butonu sıfırla
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '✨ Subscribe';
        }
      })
      .catch(function (error) {
        console.error('❌ Email gönderilemedi:', error);

        // Detaylı hata mesajı
        let errorMsg = 'Failed to subscribe. ';
        if (error.text) {
          errorMsg += error.text;
        }
        alert(errorMsg);

        // Butonu sıfırla
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '✨ Subscribe';
        }
      });

    return false;
  };

  // Test fonksiyonu
  window.testNewsletter = function () {
    console.log('Newsletter test başlatılıyor...');

    // Test parametreleri
    const testParams = {
      to_name: 'Test Admin',
      from_name: 'Test User',
      user_email: 'test@test.com',
      message: 'Test newsletter subscription',
      reply_to: 'test@test.com'
    };

    // YOUR_SERVICE_ID ve YOUR_TEMPLATE_ID'yi gerçek değerlerle değiştirin!
    emailjs.send('service_74njv1i', 'template_kane7si', testParams)
      .then(function (response) {
        console.log('✅ Test başarılı!', response);
        alert('Test email sent successfully!');
      })
      .catch(function (error) {
        console.error('❌ Test başarısız:', error);
        alert('Test failed: ' + (error.text || 'Unknown error'));
      });
  };

  console.log('📧 Newsletter EmailJS kodu hazır!');
  console.log('⚠️ DİKKAT: YOUR_SERVICE_ID ve YOUR_TEMPLATE_ID değerlerini değiştirmeyi unutmayın!');
  console.log('Test için: testNewsletter()');

  // ==========================================
  // 4. PREMIUM MODAL SİSTEMİ - HATASIZ
  // ==========================================
  window.addEventListener('load', function () {
    setTimeout(() => {
      console.log('💎 Premium modal sistemi kuruluyor...');

      // Premium modal gösterme
      window.showPremiumModal = function () {
        console.log('💎 Premium modal açılıyor...');

        // Eski modal varsa kaldır
        const existingModal = document.getElementById('premiumModal');
        if (existingModal) {
          existingModal.remove();
        }

        // Yeni modal oluştur
        const modal = document.createElement('div');
        modal.id = 'premiumModal';
        modal.className = 'premium-modal';
        modal.style.cssText = `
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center;
              align-items: center; z-index: 10000;
          `;

        modal.innerHTML = `
              <div class="premium-content" style="
                  background: linear-gradient(135deg, #2c3e50, #34495e);
                  color: white; border-radius: 20px; border: 3px solid #FFD700;
                  width: 90%; max-width: 450px; max-height: 85vh; overflow-y: auto;
                  padding: 20px; position: relative; box-sizing: border-box;
              ">
                  <span class="close-modal" style="
                      position: absolute; top: 10px; right: 15px; font-size: 28px;
                      cursor: pointer; color: #fff; z-index: 10001; width: 35px; height: 35px;
                      display: flex; align-items: center; justify-content: center;
                      background: rgba(0, 0, 0, 0.6); border-radius: 50%;
                  ">&times;</span>
                  
                  <h2 style="color: #FFD700; margin-bottom: 20px; font-size: 2em; text-align: center;">
                      🌟 Unlock Premium Features 🌟
                  </h2>
                  
                  <div class="premium-features" style="text-align: left; margin: 20px auto; max-width: 300px;">
                      <div style="margin: 10px 0; font-size: 1.1em; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                          📱 <strong>Download & Play Offline</strong><br>
                          <small>Perfect for road trips & travel with kids!</small>
                      </div>
                      <div style="margin: 10px 0; font-size: 1.1em; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                          📁 <strong>Upload Your Own Images</strong><br>
                          <small>Upload any coloring page to color</small>
                      </div>
                      <div style="margin: 10px 0; font-size: 1.1em; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                          🎨 <strong>All 50+ Coloring Pages</strong><br>
                          <small>Magical, animals, flowers & more</small>
                      </div>
                      <div style="margin: 10px 0; font-size: 1.1em; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                          💾 <strong>Unlimited HD Saves</strong><br>
                          <small>No daily limits, save all masterpieces</small>
                      </div>
                      <div style="margin: 10px 0; font-size: 1.1em; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                          ✨ <strong>Premium Magic Brushes</strong><br>
                          <small>Glitter, Rainbow & Glow effects</small>
                      </div>
                  </div>
                  
                  <div style="text-align: center; margin: 20px 0;">
                      <div style="margin-bottom: 10px;">
                          <span style="text-decoration: line-through; color: #999; font-size: 1.1em;">Regular Price: $19.99</span>
                      </div>
                      <div style="font-size: 2.2em; color: #FFD700; font-weight: bold; margin: 10px 0;">
                          🚀 Launch Price: $14.99
                      </div>
                      <div style="color: #FF6B6B; font-size: 1.1em; font-weight: bold;">
                          Save $5 • Limited Time!
                      </div>
                  </div>
                  
                  <button class="buy-premium-btn" style="
                      background: linear-gradient(45deg, #FFD700, #FFA500); color: #2c3e50;
                      border: none; padding: 18px 45px; font-size: 1.3em; border-radius: 50px;
                      cursor: pointer; font-weight: bold; transition: all 0.3s ease;
                      box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3); display: block;
                      margin: 20px auto; width: 80%;
                  ">🎨 Get Premium Now</button>
                  
                  <p style="text-align: center; font-size: 0.9em; opacity: 0.8; margin-top: 15px;">
                      Instant activation • Perfect for families
                  </p>
              </div>
          `;

        document.body.appendChild(modal);

        // Close butonu event listener
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
          closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closePremiumModal();
          });
        }

        // Buy butonu event listener
        const buyBtn = modal.querySelector('.buy-premium-btn');
        if (buyBtn) {
          buyBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            buyPremium();
          });
        }

        // Modal dışına tıklama ile kapatma
        modal.addEventListener('click', function (e) {
          if (e.target === modal) {
            closePremiumModal();
          }
        });
      };

      // Premium modal kapatma - HATASIZ
      window.closePremiumModal = function () {
        console.log('💎 Premium modal kapatılıyor...');
        const modal = document.getElementById('premiumModal');
        if (modal) {
          try {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
              if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
              }
            }, 300);
          } catch (error) {
            console.error('Modal kapatma hatası:', error);
            // Hata olursa direkt kaldır
            if (modal && modal.parentNode) {
              modal.parentNode.removeChild(modal);
            }
          }
        }
      };

      // Premium satın alma
      window.buyPremium = function () {
        console.log('💎 Premium satın alma işlemi...');

        try {
          // Gumroad sayfasını aç
          window.open('https://magicalcoloringgame.gumroad.com/l/skdwom', '_blank');

          // Modal'ı kapat
          closePremiumModal();

          // Test için basit aktivasyon
          setTimeout(() => {
            const license = prompt('Enter license key for testing (minimum 5 characters):');
            if (license && license.length >= 5) {
              localStorage.setItem('isPremium', 'true');
              localStorage.setItem('licenseKey', license);
              showSuccessMessage('🎉 Premium Activated Successfully!');
              setTimeout(() => location.reload(), 2000);
            }
          }, 1000);

        } catch (error) {
          console.error('Premium satın alma hatası:', error);
          showSuccessMessage('Premium purchase page will open shortly!');
        }
      };

      console.log('✅ Premium modal sistemi hazır');
    }, 2000);
  });

  // ==========================================
  // 5. BAŞARI MESAJI FONKSİYONU
  // ==========================================
  window.showSuccessMessage = function (message) {
    console.log('🎉 Başarı mesajı gösteriliyor:', message);

    // Eski mesajları temizle
    document.querySelectorAll('.temp-success-msg').forEach(msg => {
      try {
        msg.remove();
      } catch (e) {
        console.log('Eski mesaj temizleme hatası:', e);
      }
    });

    const success = document.createElement('div');
    success.className = 'temp-success-msg';
    success.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #4CAF50; color: white; padding: 20px 40px; border-radius: 15px;
      font-size: 1.2em; box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
      z-index: 10002; text-align: center; max-width: 80%; word-wrap: break-word;
  `;
    success.textContent = message;

    document.body.appendChild(success);

    // 3 saniye sonra kaldır
    setTimeout(() => {
      try {
        if (success && success.parentNode) {
          success.parentNode.removeChild(success);
        }
      } catch (e) {
        console.log('Başarı mesajı kaldırma hatası:', e);
      }
    }, 3000);
  };

  // ==========================================
  // 6. PREMIUM ARAÇ TıKLAMA KONTROL
  // ==========================================
  window.addEventListener('load', function () {
    setTimeout(() => {
      console.log('🔒 Premium araç kontrolü ekleniyor...');

      const premiumTools = ['glitterBtn', 'rainbowBtn', 'glowBtn'];

      premiumTools.forEach(toolId => {
        const btn = document.getElementById(toolId);
        if (btn) {
          // Eski event listener'ları temizle
          const newBtn = btn.cloneNode(true);
          btn.parentNode.replaceChild(newBtn, btn);

          // Yeni event listener ekle
          newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isPremiumUser = localStorage.getItem('isPremium') === 'true';

            if (!isPremiumUser) {
              console.log('🔒 Premium araç engellendi:', toolId);
              if (typeof showPremiumModal === 'function') {
                showPremiumModal();
              } else {
                alert('This feature is only available for Premium users!');
              }
              return false;
            }

            // Premium kullanıcı ise normal işlemi yap
            const toolName = toolId.replace('Btn', '');
            if (typeof setTool === 'function') {
              setTool(toolName);
            }
          });
        }
      });

      console.log('✅ Premium araç kontrolü eklendi');
    }, 2500);
  });

  // ==========================================
  // 7. HATA YAKALAMA VE LOG SİSTEMİ
  // ==========================================
  window.addEventListener('error', function (e) {
    if (e.message && e.message.includes('showNewsletterModal')) {
      console.log('Newsletter modal hatası yakalandı, düzeltiliyor...');
      // Newsletter modal fonksiyonunu tekrar tanımla
      if (typeof showNewsletterModal === 'undefined') {
        window.showNewsletterModal = function () {
          const modal = document.getElementById('newsletterModal');
          if (modal) {
            modal.style.display = 'flex';
          }
        };
      }
    }

    if (e.message && e.message.includes('showPremiumModal')) {
      console.log('Premium modal hatası yakalandı, düzeltiliyor...');
      // Premium modal fonksiyonunu tekrar tanımla
      if (typeof showPremiumModal === 'undefined') {
        window.showPremiumModal = function () {
          alert('Premium features are available with subscription!');
        };
      }
    }
  });

  // ==========================================
  // 8. SİSTEM DURUMU KONTROLÜ
  // ==========================================
  window.addEventListener('load', function () {
    setTimeout(() => {
      console.log('📊 Sistem Durumu Kontrolü:');

      const checks = {
        'Canvas': !!document.getElementById('coloringCanvas'),
        'Undo Button': !!document.getElementById('undoBtn'),
        'Newsletter Modal': !!document.getElementById('newsletterModal'),
        'Newsletter Function': typeof showNewsletterModal === 'function',
        'Premium Function': typeof showPremiumModal === 'function',
        'Premium Tools': !!document.getElementById('premiumTools')
      };

      Object.entries(checks).forEach(([name, status]) => {
        console.log(`- ${name}: ${status ? '✅' : '❌'}`);
      });

      console.log('🔧 Test Komutları:');
      console.log('- showNewsletterModal() : Newsletter testi');
      console.log('- showPremiumModal() : Premium modal testi');

    }, 3000);

    console.log('🎨 Script.js düzeltmeleri yüklendi - Tüm sorunlar çözülmeli!');
  })
})
// Newsletter form - TEMİZ VERSİYON
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.onsubmit = function (event) {
      event.preventDefault();

      const email = document.getElementById('userEmail').value;
      const name = document.getElementById('userName').value;

      if (!email || !email.includes('@')) {
        alert('Please enter valid email!');
        return false;
      }

      console.log('📧 Email gönderiliyor...');

      // EmailJS gönderimi
      emailjs.send('service_74njv1i', 'template_kane7si', {
        user_email: email,
        from_name: name || 'Subscriber',
        message: 'New newsletter subscription from Magical Coloring Game',
        to_name: 'Admin',
        reply_to: email
      })
        .then(function (response) {
          console.log('✅ Email gönderildi!', response);
          alert('Successfully subscribed!');
          closeNewsletterModal();
          form.reset();
        })
        .catch(function (error) {
          console.error('❌ Email hatası:', error);
          alert('Error: ' + JSON.stringify(error));
        });

      return false;
    };
  }
});
// Newsletter submit fonksiyonu
function handleNewsletterSubmit(event) {
  if (event) event.preventDefault();

  const email = document.getElementById('userEmail');
  const name = document.getElementById('userName');

  if (!email || !email.value || !email.value.includes('@')) {
    alert('Please enter a valid email address!');
    return false;
  }

  console.log('📧 Sending newsletter subscription...');

  // EmailJS gönderimi
  emailjs.send('service_74njv1i', 'template_kane7si', {
    email: email.value,
    name: name && name.value ? name.value : 'Subscriber'
  })
    .then(function (response) {
      console.log('✅ SUCCESS!', response);
      alert('🎉 Successfully subscribed to newsletter!');
      closeNewsletterModal();
      document.getElementById('newsletterForm').reset();
    })
    .catch(function (error) {
      console.error('❌ FAILED...', error);
      alert('Failed to subscribe. Please try again.');
    });

  return false;
}

// Global scope'a ekle
window.handleNewsletterSubmit = handleNewsletterSubmit;

// MOBİL DOKUNMATİK DÜZELTMESİ
// Bu kodu script.js'in EN SONUNA ekleyin

(function () {
  console.log('📱 Mobil dokunmatik desteği ekleniyor...');

  // Canvas'ı bul - var kullanarak çakışmayı önle
  var mobileCanvas = document.getElementById('coloringCanvas');
  if (!mobileCanvas) {
    console.error('Canvas bulunamadı!');
    return;
  }

  // Touch olaylarından koordinat alma fonksiyonu
  function getTouchCoordinates(e) {
    const rect = mobileCanvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      x: (touch.clientX - rect.left) * (mobileCanvas.width / rect.width),
      y: (touch.clientY - rect.top) * (mobileCanvas.height / rect.height)
    };
  }

  // Touch başlangıç
  mobileCanvas.addEventListener('touchstart', function (e) {
    e.preventDefault(); // Sayfa kaydırmayı engelle

    const coords = getTouchCoordinates(e);

    // Mouse down olayını simüle et
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      bubbles: true
    });
    mobileCanvas.dispatchEvent(mouseEvent);

    // Mevcut araç için başlangıç
    if (typeof handlePointerDown === 'function') {
      handlePointerDown({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        preventDefault: () => { }
      });
    }
  }, { passive: false });

  // Touch hareket
  mobileCanvas.addEventListener('touchmove', function (e) {
    e.preventDefault(); // Sayfa kaydırmayı engelle

    if (!e.touches || e.touches.length === 0) return;

    const coords = getTouchCoordinates(e);

    // Mouse move olayını simüle et
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      bubbles: true
    });
    mobileCanvas.dispatchEvent(mouseEvent);

    // Mevcut araç için hareket
    if (typeof handlePointerMove === 'function') {
      handlePointerMove({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        preventDefault: () => { }
      });
    }
  }, { passive: false });

  // Touch bitiş
  mobileCanvas.addEventListener('touchend', function (e) {
    e.preventDefault();

    // Mouse up olayını simüle et
    const mouseEvent = new MouseEvent('mouseup', {
      bubbles: true
    });
    mobileCanvas.dispatchEvent(mouseEvent);

    // Mevcut araç için bitiş
    if (typeof handlePointerUp === 'function') {
      handlePointerUp({
        preventDefault: () => { }
      });
    }
  }, { passive: false });

  // CSS ile mobil deneyimi iyileştir
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
  /* Mobil için canvas optimizasyonu */
  #coloringCanvas {
      touch-action: none !important;
      -webkit-touch-callout: none !important;
      -webkit-user-select: none !important;
      user-select: none !important;
      -webkit-tap-highlight-color: transparent !important;
  }
  
  /* Mobilde zoom'u engelle */
  @media (max-width: 768px) {
      body {
          touch-action: pan-x pan-y;
          -webkit-overflow-scrolling: touch;
      }
      
      .coloring-area {
          overflow: hidden;
          position: relative;
      }
      
      /* Araç butonlarını mobilde daha büyük yap */
      .btn, .tool-btn {
          min-width: 44px;
          min-height: 44px;
          font-size: 14px !important;
      }
      
      /* Renk paletini mobilde optimize et */
      .color-swatch {
          width: 40px;
          height: 40px;
          margin: 3px;
      }
  }
`;
  document.head.appendChild(mobileStyle);

  // Viewport meta tag kontrolü (zoom'u engelle)
  let viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }
  viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

  console.log('✅ Mobil dokunmatik desteği eklendi!');

  // Test fonksiyonu
  window.testMobileTouch = function () {
    console.log('Touch desteği:', 'ontouchstart' in window);
    console.log('Canvas touch-action:', getComputedStyle(mobileCanvas).touchAction);
    console.log('Mobil cihaz:', /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  };
})(); // Fonksiyonu hemen çalıştır
// UNDO BUTONU DÜZELTMESİ
// Bu kodu script.js'in EN SONUNA ekleyin

(function () {
  console.log('🔧 Undo butonu düzeltiliyor...');

  // Undo butonunu bul
  const undoBtn = document.getElementById('undoBtn');
  if (!undoBtn) {
    console.error('Undo butonu bulunamadı!');
    return;
  }

  // Eski event listener'ları temizle
  const newUndoBtn = undoBtn.cloneNode(true);
  undoBtn.parentNode.replaceChild(newUndoBtn, undoBtn);

  // Yeni, TEK event listener ekle
  newUndoBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('Undo tıklandı - Mevcut adım:', currentStep, 'Toplam:', drawingHistory.length);

    // Basit undo işlemi
    if (currentStep > 0) {
      currentStep--;
      const canvas = document.getElementById('coloringCanvas');
      const ctx = canvas.getContext('2d');

      if (drawingHistory[currentStep]) {
        ctx.putImageData(drawingHistory[currentStep], 0, 0);
        console.log('Adım', currentStep, 'yüklendi');
      }
    } else {
      console.log('Geri alınacak adım yok');
      // İlk duruma dön
      if (typeof loadDrawing === 'function') {
        loadDrawing();
      }
    }

    // Buton durumunu güncelle
    updateUndoButtonState();
  });

  // Buton durumu güncelleme
  window.updateUndoButtonState = function () {
    if (newUndoBtn) {
      newUndoBtn.disabled = currentStep <= 0;
      newUndoBtn.style.opacity = currentStep <= 0 ? '0.5' : '1';
    }
  };

  // Çizim durumu kaydetmeyi optimize et
  let saveTimeout = null;
  const originalSaveDrawingState = window.saveDrawingState;

  window.saveDrawingState = function () {
    // Çoklu kaydetmeyi önle
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
      if (originalSaveDrawingState) {
        originalSaveDrawingState();
      } else {
        // Manuel kaydetme
        const canvas = document.getElementById('coloringCanvas');
        const ctx = canvas.getContext('2d');

        if (currentStep < drawingHistory.length - 1) {
          drawingHistory = drawingHistory.slice(0, currentStep + 1);
        }

        currentStep++;
        drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

        // Maksimum 30 adım tut (bellek için)
        if (drawingHistory.length > 30) {
          drawingHistory.shift();
          currentStep--;
        }

        updateUndoButtonState();
      }
    }, 100); // 100ms gecikme ile kaydet
  };

  console.log('✅ Undo butonu düzeltildi!');
})();

// Debug fonksiyonu
window.debugUndo = function () {
  console.log('=== UNDO DEBUG ===');
  console.log('Current Step:', window.currentStep);
  console.log('History Length:', window.drawingHistory ? window.drawingHistory.length : 0);
  console.log('Undo Button:', document.getElementById('undoBtn'));
  console.log('Button Disabled:', document.getElementById('undoBtn')?.disabled);
};
