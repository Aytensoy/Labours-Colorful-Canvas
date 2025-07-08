// TEMİZ OYUN + PREMİUM SİSTEMİ

// Global değişkenler
let canvas = null;
let ctx = null;
let currentTool = 'brush';
let currentColor = '#FF0000';
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isPremiumUser = localStorage.getItem('isPremium') === 'true';

// Canvas ve UI başlatma
function initializeGame() {
  console.log('Oyun başlatılıyor...');
  
  // Canvas'ı ayarla
  canvas = document.getElementById('coloringCanvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setupCanvasEvents();
    console.log('Canvas hazır');
  }
  
  // Renk paletini oluştur
  setupColorPalette();
  
  // Tool butonlarını ayarla
  setupToolButtons();
  
  // Kategori tablarını ayarla
  setupCategoryTabs();
  
  // Premium sistemi başlat
  setTimeout(() => {
    updateContentLocks();
    addPremiumBadge();
  }, 500);
  
  console.log('Oyun başlatma tamamlandı');
}

// Renk paleti oluştur
function setupColorPalette() {
  const colorPalette = document.getElementById('colorPalette');
  if (!colorPalette) return;
  
  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000000'
  ];
  
  colorPalette.innerHTML = '';
  
  colors.forEach(color => {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color-swatch';
    colorDiv.style.cssText = `
      width: 30px; height: 30px; background-color: ${color};
      margin: 5px; border-radius: 50%; cursor: pointer;
      border: 2px solid transparent; display: inline-block;
    `;
    
    colorDiv.onclick = () => {
      currentColor = color;
      // Tüm renk swatchlerinin border'ını temizle
      document.querySelectorAll('.color-swatch').forEach(s => s.style.border = '2px solid transparent');
      // Seçili olan rengin border'ını vurgula
      colorDiv.style.border = '2px solid #000';
      console.log('Renk seçildi:', color);
    };
    
    colorPalette.appendChild(colorDiv);
  });
  
  console.log('Renk paleti oluşturuldu');
}

// Tool butonlarını ayarla
function setupToolButtons() {
  const toolButtons = {
    'pencilBtn': 'pencil',
    'brushBtn': 'brush',
    'eraseBtn': 'erase'
  };
  
  Object.entries(toolButtons).forEach(([buttonId, toolName]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.onclick = () => setTool(toolName);
    }
  });
  
  console.log('Tool butonları ayarlandı');
}

// Tool değiştir
function setTool(toolName) {
  currentTool = toolName;
  
  // Buton aktif durumunu güncelle
  document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
  const activeButton = document.getElementById(`${toolName}Btn`);
  if (activeButton) activeButton.classList.add('active');
  
  console.log('Tool değiştirildi:', toolName);
}

// Canvas çizim olayları
function setupCanvasEvents() {
  if (!canvas) return;
  
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  
  // Touch events
  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('touchmove', handleTouch);
  canvas.addEventListener('touchend', stopDrawing);
  
  console.log('Canvas event listeners eklendi');
}

function startDrawing(e) {
  isDrawing = true;
  const coords = getCanvasCoords(e);
  lastX = coords.x;
  lastY = coords.y;
}

function draw(e) {
  if (!isDrawing) return;
  
  const coords = getCanvasCoords(e);
  const x = coords.x;
  const y = coords.y;
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentTool === 'pencil' ? 2 : currentTool === 'brush' ? 8 : 15;
  ctx.lineCap = 'round';
  ctx.globalCompositeOperation = currentTool === 'erase' ? 'destination-out' : 'source-over';
  ctx.stroke();
  
  lastX = x;
  lastY = y;
}

function stopDrawing() {
  isDrawing = false;
  ctx.globalCompositeOperation = 'source-over';
}

function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                   e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  };
}

// Kategori tabları
function setupCategoryTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(tab => {
    tab.onclick = () => {
      // Tüm tabları pasif yap
      tabButtons.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.page-thumbnails').forEach(p => p.classList.remove('active'));
      
      // Seçili tabı aktif yap
      tab.classList.add('active');
      const category = tab.getAttribute('data-category');
      const targetThumbnails = document.querySelector(`.page-thumbnails.${category}`);
      if (targetThumbnails) {
        targetThumbnails.classList.add('active');
      }
      
      console.log('Kategori değiştirildi:', category);
    };
  });
  
  console.log('Kategori tabları ayarlandı');
}

// Boyama sayfası yükleme
function loadColoringPage(pageName) {
  if (!canvas || !ctx) return;
  
  console.log(`Boyama sayfası yükleniyor: ${pageName}`);
  
  const img = new Image();
  img.crossOrigin = "anonymous";
  
  img.onload = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log(`${pageName} yüklendi!`);
  };
  
  img.onerror = function() {
    console.error(`${pageName} yüklenemedi!`);
  };
  
  img.src = `coloring-pages-png/${pageName}.png`;
}

// PREMIUM SİSTEMİ
function showPremiumModal() {
  if (document.getElementById('premiumModal')) {
    document.getElementById('premiumModal').style.display = 'flex';
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'premiumModal';
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
          ✨ Tüm Boyama Sayfaları
        </div>
        <div style="margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;">
          💾 Sınırsız Kaydetme
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

function closePremiumModal() {
  const modal = document.getElementById('premiumModal');
  if (modal) modal.style.display = 'none';
}

function buyPremium() {
  localStorage.setItem('isPremium', 'true');
  isPremiumUser = true;
  closePremiumModal();
  alert('🎉 Premium aktif edildi!');
  updateContentLocks();
  addPremiumBadge();
}

function updateContentLocks() {
  console.log('Premium sistem çalışıyor...');
  
  const categories = { 'magical': 2, 'flowers': 2, 'animals': 2, 'mandalas': 2, 'various': 2 };

  Object.keys(categories).forEach(category => {
    const categoryThumbnails = document.querySelectorAll(`.page-thumbnails.${category} .page-thumbnail`);
    console.log(`${category}: ${categoryThumbnails.length} thumbnail`);
    
    categoryThumbnails.forEach((thumb, index) => {
      if (index >= categories[category] && !isPremiumUser) {
        // Kilitle
        thumb.classList.add('locked');
        thumb.style.opacity = '0.7';
        
        if (!thumb.querySelector('.lock-overlay')) {
          const lockOverlay = document.createElement('div');
          lockOverlay.className = 'lock-overlay';
          lockOverlay.style.cssText = `
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 2em; background: rgba(0, 0, 0, 0.7); width: 50px; height: 50px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
          `;
          lockOverlay.innerHTML = '🔒';
          thumb.appendChild(lockOverlay);
        }

        thumb.onclick = (e) => {
          e.preventDefault();
          showPremiumModal();
        };
      } else {
        // Serbest bırak
        thumb.classList.remove('locked');
        thumb.style.opacity = '1';
        const lock = thumb.querySelector('.lock-overlay');
        if (lock) lock.remove();
        
        thumb.onclick = () => {
          const pageName = thumb.getAttribute('data-page');
          loadColoringPage(pageName);
        };
      }
    });
  });
}

function addPremiumBadge() {
  if (isPremiumUser && !document.querySelector('.premium-badge')) {
    const badge = document.createElement('div');
    badge.className = 'premium-badge';
    badge.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: linear-gradient(45deg, #FFD700, #FFA500);
      color: #2c3e50; padding: 8px 20px; border-radius: 20px; font-weight: bold; z-index: 1000;
    `;
    badge.innerHTML = '⭐ PREMIUM';
    document.body.appendChild(badge);
  }
}

// Splash screen yönetimi
function manageSplashScreen() {
  const splashScreen = document.querySelector('.splash-screen');
  const mainContent = document.getElementById('mainContent');
  
  if (splashScreen && mainContent) {
    setTimeout(() => {
      splashScreen.style.transition = 'opacity 0.5s';
      splashScreen.style.opacity = '0';
      mainContent.style.display = 'block';
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 500);
    }, 1500);
  }
}

// Ana başlatma
document.addEventListener('DOMContentLoaded', function() {
  console.log('Sayfa yükleniyor...');
  manageSplashScreen();
  
  setTimeout(() => {
    initializeGame();
  }, 2000);
});
