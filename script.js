// =========================================================================
// MAGICAL COLORING GAME - KONSOLİDE VE ONARILMIŞ SCRIPT (v.FINAL)
// Bu dosya, tüm oyun fonksiyonlarını, hata düzeltmelerini ve 
// çalışan Magic Photos sistemini içerir.
// =========================================================================

console.log('🚀 Magical Coloring Game Ana Script Yükleniyor...');

let hasInitialized = false; // Bu bayrak, initialize fonksiyonunun sadece bir kere çalışmasını garantiler.

// --- BÖLÜM 1: GLOBAL DEĞİŞKENLER VE TEMEL AYARLAR ---

let isPremiumUser = localStorage.getItem('isPremium') === 'true';
let currentTool = 'pencil';
let currentColor = '#FF00FF';
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let characterImage = new Image();
let lastDraggableTextPosition = { x: 0, y: 0 }; // Sürüklenen yazının son pozisyonunu saklar
// Araç boyutları
let pencilSize = 2,
  brushSize = 10,
  spraySize = 10,
  watercolorSize = 20,
  eraseSize = 10;
let glitterSize = 20,
  rainbowSize = 25,
  glowSize = 15;
markerSize = 15,
  pastelSize = 20;
let rainbowHue = 0; // <-- BU SATIRI EKLEYİN

// Undo/Redo sistemi
let drawingHistory = [];
let currentStep = -1;
const HISTORY_LIMIT = 15;

// İsim yazma modu
window.isWritingMode = false;
window.selectedFont = 'Comic Sans MS';
window.selectedFontSize = 24;
window.textColor = '#FF69B4';

// PWA Yükleme istemi için
let deferredPrompt;

window.saveStateTimeout = null; // <-- BU SATIRI EKLEYİN

// --- BÖLÜM 2: ANA OYUN MANTIKLARI VE YARDIMCI FONKSİYONLAR ---

// Araç değiştirme fonksiyonu
function setTool(toolName) {
  if (window.isWritingMode) {
    exitNameWritingMode();
  }
  if (['glitter', 'rainbow', 'glow'].includes(toolName) && !isPremiumUser) {
    if (typeof showPremiumModal === 'function') showPremiumModal();
    return;
  }

  if (window.isWritingMode) {
    exitNameWritingMode();
  }

  currentTool = toolName;

  document.querySelectorAll('.tool-btn, .magic-btn, #nameBtn, #quickNameBtn').forEach(btn => btn.classList.remove('active'));

  const toolButtons = document.querySelectorAll(`[onclick="setTool('${toolName}')"]`);
  toolButtons.forEach(btn => btn.classList.add('active'));

  const activeButtonById = document.getElementById(`${toolName}Btn`) || document.getElementById(toolName);
  if (activeButtonById) activeButtonById.classList.add('active');


  const sizeSlider = document.getElementById('toolSize');
  const sizeDisplay = document.getElementById('sizeValue');
  const currentSize = getCurrentToolSize();

  if (sizeSlider) sizeSlider.value = currentSize;
  if (sizeDisplay) sizeDisplay.textContent = currentSize;

  const canvas = document.getElementById('coloringCanvas');
  if (canvas) canvas.style.cursor = 'crosshair';

  console.log(`Tool changed to: ${toolName}, Size: ${currentSize}`);
}

// Boyut güncelleme
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
    case 'marker':         // Yeni isim
      markerSize = size;
      break;
    case 'pastel':       // Yeni isim
      pastelSize = size;
      break;
  }
}

// Mevcut aracın boyutunu al
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
    case 'erase':
      return eraseSize;
    case 'glitter':
      return glitterSize;
    case 'rainbow':
      return rainbowSize;
    case 'glow':
      return glowSize;
    case 'marker':         // Yeni isim
      return markerSize;
    case 'pastel':       // Yeni isim
      return pastelSize;
    default:
      return 10;
  }
}

// Canvas koordinatlarını al
function getCanvasCoordinates(e) {
  const canvas = document.getElementById('coloringCanvas');
  const rect = canvas.getBoundingClientRect();
  let clientX = e.clientX,
    clientY = e.clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }
  const x = (clientX - rect.left) * (canvas.width / rect.width);
  const y = (clientY - rect.top) * (canvas.height / rect.height);
  return {
    x,
    y
  };
}

// Geri alma sistemi
function saveDrawingState() {
  try {
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    if (currentStep < drawingHistory.length - 1) {
      drawingHistory = drawingHistory.slice(0, currentStep + 1);
    }
    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    currentStep++;
    if (drawingHistory.length > HISTORY_LIMIT) {
      drawingHistory.shift();
      currentStep--;
    }
    updateUndoButtonState();
  } catch (error) {
    console.error("Error saving drawing state:", error);
  }
}

function handleUndoClick() {
  if (currentStep > 0) {
    currentStep--;
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    ctx.putImageData(drawingHistory[currentStep], 0, 0);
  }
  updateUndoButtonState();
}

function updateUndoButtonState() {
  const undoButton = document.getElementById('undoBtn');
  if (undoButton) undoButton.disabled = currentStep <= 0;
}

// Renk yardımcı fonksiyonu
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    r,
    g,
    b
  };
}

function resizeCanvas() {
  const canvas = document.getElementById('coloringCanvas');
  if (!canvas) return;
  const container = canvas.parentElement;
  if (!container) return;

  // Oranı koru (4:3)
  let newWidth = container.clientWidth;
  if (window.innerWidth < 850) { // Sadece mobil ve tablet boyutlarında küçült
    newWidth = window.innerWidth * 0.95;
  } else {
    newWidth = 800; // Geniş ekranlarda sabit boyut
  }

  canvas.style.width = newWidth + "px";
  canvas.style.height = (newWidth * (600 / 800)) + "px"; // Oranı koru
}
// NİHAİ ÇÖZÜM v13: Doğrudan HTML'den çağrılacak merkezi upload fonksiyonu
function triggerMainUpload() {
  console.log("⬆️ Upload Image tıklandı! Input hazırlanıyor...");
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (event) => handleFileUpload(event);
  fileInput.click();
}

// NİHAİ handleFileUpload (createImageBitmap ile)
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  // FileReader ve new Image() yerine createImageBitmap kullan
  createImageBitmap(file)
    .then(imageBitmap => {
      console.log("🖼️ User image loaded via createImageBitmap. Drawing to canvas.");
      const canvas = document.getElementById('coloringCanvas');
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(canvas.width / imageBitmap.width, canvas.height / imageBitmap.height);
      const x = (canvas.width / 2) - (imageBitmap.width / 2) * scale;
      const y = (canvas.height / 2) - (imageBitmap.height / 2) * scale;
      ctx.drawImage(imageBitmap, x, y, imageBitmap.width * scale, imageBitmap.height * scale);

      drawingHistory = [];
      currentStep = -1;
      saveDrawingState();
    })
    .catch(e => {
      console.error("createImageBitmap failed for Upload Image:", e);
      alert("Sorry, there was an error processing your image.");
    });
}

// =======================================================
// YENİ VE ÇÖKME KARŞITI FLOOD FILL FONKSİYONU
// =======================================================
function floodFill(imageData, startX, startY, fillColor) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  startX = Math.floor(startX);
  startY = Math.floor(startY);

  const startPos = (startY * width + startX) * 4;
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];

  // Tıklanan yer zaten doldurulacak renk ise, hiçbir şey yapma.
  if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b) {
    return false;
  }

  // Tıklanan yer siyah bir çizgi ise, hiçbir şey yapma.
  const blackThreshold = 50;
  if (startR < blackThreshold && startG < blackThreshold && startB < blackThreshold) {
    return false;
  }

  const pixelStack = [[startX, startY]];
  // YENİ: Ziyaret edilen pikselleri takip etmek için bir set oluştur
  const visited = new Set();
  visited.add(`${startX},${startY}`);

  while (pixelStack.length > 0) {
    const [x, y] = pixelStack.pop();

    const currentPos = (y * width + x) * 4;
    data[currentPos] = fillColor.r;
    data[currentPos + 1] = fillColor.g;
    data[currentPos + 2] = fillColor.b;
    data[currentPos + 3] = 255;

    // Komşuları kontrol et
    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of neighbors) {
      const key = `${nx},${ny}`;

      // Eğer komşu sınırlar içindeyse VE daha önce ziyaret edilmediyse...
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(key)) {
        visited.add(key); // Ziyaret edildi olarak işaretle

        const neighborPos = (ny * width + nx) * 4;
        const nR = data[neighborPos];
        const nG = data[neighborPos + 1];
        const nB = data[neighborPos + 2];

        // Renk toleransı kontrolü
        const tolerance = 10;
        if (Math.abs(nR - startR) <= tolerance &&
          Math.abs(nG - startG) <= tolerance &&
          Math.abs(nB - startB) <= tolerance) {
          // Boyanacaklar listesine ekle
          pixelStack.push([nx, ny]);
        }
      }
    }
  }
  return true;
}

// YENİ EKLENEN FONKSİYONLAR: SİHİRLİ DEĞNEKLER
function drawMagicStar(x, y, ctx) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
  const colors = ['#FFFDD0', '#FFFACD', '#FFFFF0', '#FFF8DC', '#FFFFE0'];
  const size = Math.random() * 10 + 8;

  ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 0.8;

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
  ctx.globalAlpha = 1.0;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
}

function drawMagicFlower(x, y, ctx) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
  const flowerColors = ['#FFFFFF', '#FF0000', '#0000FF', '#800080'];
  const selectedColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
  const size = Math.random() * 7 + 8;
  const petalCount = Math.floor(Math.random() * 3) + 7;

  for (let i = 0; i < petalCount; i++) {
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = selectedColor;
    ctx.ellipse(
      x + (size * 0.8) * Math.cos(i * Math.PI / (petalCount / 2)),
      y + (size * 0.8) * Math.sin(i * Math.PI / (petalCount / 2)),
      size * 0.6, size * 0.3, i * Math.PI / (petalCount / 2), 0, 2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#000000';
  ctx.arc(x, y, size * 0.4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}
// SİHİRLİ DEĞNEK FONKSİYONLARI BİTTİ
// =======================================================
// NİHAİ GÖRSEL YÜKLEME FONKSİYONU (Tüm zamanlama sorunlarını çözer)
// =======================================================
// =======================================================
// DOSYA YOLU HATASI GİDERİLMİŞ NİHAİ YÜKLEME FONKSİYONU
// =======================================================
function loadAndDrawImage(imageName) {
  const logName = imageName || 'boş sayfa';
  console.log(`🖼️ Yükleme ve çizme başlatıldı: ${logName}`);

  resetCanvasState();

  const canvas = document.getElementById('coloringCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Eğer bir resim adı YOKSA (Drawing Page), burada dur.
  if (!imageName) {
    saveDrawingState();
    return;
  }

  // Yükleniyor... mesajını sadece resim yüklenecekse göster
  ctx.font = '24px Poppins';
  ctx.fillStyle = '#cccccc';
  ctx.textAlign = 'center';
  ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);

  // DOSYA YOLUNU DOĞRU BİR ŞEKİLDE BELİRLE
  const imagePath = imageName.includes('.png') ? imageName : `coloring-pages-png/${imageName}.png`;

  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = function () {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    saveDrawingState();
    console.log(`✅ ${imagePath} başarıyla canvas'a çizildi.`);
  };

  img.onerror = function () {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff0000';
    ctx.fillText('Error loading image.', canvas.width / 2, canvas.height / 2);
    console.error(`HATA: ${imagePath} yüklenemedi.`);
  };

  img.src = imagePath;
}
// YENİ VE TAM KAPSAMLI resetCanvasState FONKSİYONU
function resetCanvasState() {
  console.log("🔄 Tüm canvas ve oyun durumları sıfırlanıyor...");
  isDrawing = false;
  isDragging = false;
  lastX = 0;
  lastY = 0;
  drawingHistory = [];
  currentStep = -1;
  boundaryColor = null; // Akıllı fırça için

  const canvas = document.getElementById('coloringCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    // Canvas'ın çizim durumunu (şeffaflık, dönüşüm vb.) sıfırla
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  updateUndoButtonState();

  if (typeof setTool === 'function') {
    setTool('pencil');
  } else {
    currentTool = 'pencil';
  }
}

// =======================================================
// GÖREV 23: ANİMASYON FONKSİYONU
// =======================================================
// =======================================================
// ADIM 1: ANİMASYON MENÜSÜNÜ AÇAN ANA FONKSİYON
// =======================================================
let animationFrameId = null; // Animasyonu durdurmak için global değişken

function animateCharacter() {
  console.log("✨ Canlı Animasyon menüsü açılıyor...");

  // Eğer zaten animasyon varsa durdur
  if (animationFrameId) {
    stopAnimation();
    return;
  }

  showAnimationSelectionModal();
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;

    // Canvas'ı orijinal haline (Undo geçmişindeki son hale) döndür
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    if (typeof drawingHistory !== 'undefined' && drawingHistory.length > 0 && currentStep >= 0) {
      ctx.putImageData(drawingHistory[currentStep], 0, 0);
    }

    // Buton yazısını düzelt
    const btn = document.getElementById('animateBtn');
    if (btn) btn.innerHTML = '✨ Animate!';
  }
}
// =================================================================
// GÖREV 28 NİHAİ VE SON ÇÖZÜM (v17 - SAF DOKUNMATİK KOORDİNATLARI)
// =================================================================
// =================================================================
// EKSİK PARÇA: BU FONKSİYONU writeNameToCanvas'ın HEMEN ÜSTÜNE EKLEYİN
// =================================================================

function writeNameToCanvas(initialX, initialY) {
  // Element kontrolleri aynı kalacak...
  const textInput = document.getElementById('textInput');
  const fontSelect = document.getElementById('fontSelect');
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const textColorPicker = document.getElementById('textColorPicker');

  if (!textInput || !fontSelect || !fontSizeSlider || !textColorPicker) {
    console.error('Modal elementleri bulunamadı!');
    return;
  }

  const text = textInput.value.trim();
  const font = fontSelect.value;
  const size = parseInt(fontSizeSlider.value);
  const color = textColorPicker.value;

  if (!text) {
    alert('Please enter some text!');
    return;
  }

  console.log('✍️ Writing text to canvas:', { text, font, size, color, x: initialX, y: initialY });

  closeNameModal();

  // SADECE CANVAS'A YAZ - SÜRÜKLENEBILIR ELEMENT OLUŞTURMA
  const canvas = document.getElementById('coloringCanvas');
  const ctx = canvas.getContext('2d');

  // DOĞRU KOORDİNAT HESAPLAMA
  const canvasRect = canvas.getBoundingClientRect();

  // Canvas'ın görsel boyutundan gerçek boyutuna dönüştürme
  const scaleX = canvas.width / canvasRect.width;
  const scaleY = canvas.height / canvasRect.height;

  // initialX ve initialY zaten canvas koordinatları, tekrar dönüştürme
  const finalX = Math.max(10, Math.min(initialX, canvas.width - 100));
  const finalY = Math.max(20, Math.min(initialY, canvas.height - 50));

  // Canvas'a direkt yaz
  ctx.save();
  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, finalX, finalY);

  // Gölge efekti
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // TEK SEFER YAZ
  ctx.fillText(text, finalX, finalY);
  ctx.restore();

  saveDrawingState();
  exitNameWritingMode();

  // Başarı mesajı
  const successMsg = document.createElement('div');
  successMsg.textContent = `✅ "${text}" added to canvas!`;
  successMsg.style.cssText = 'position:fixed; top:20%; left:50%; transform:translateX(-50%); background:#4CAF50; color:white; padding:10px 20px; border-radius:10px; z-index:10002; font-weight:bold;';
  document.body.appendChild(successMsg);
  setTimeout(() => successMsg.remove(), 2000);
}
// =======================================================
// GÖREV 24: "WRITE MESSAGE" SİSTEMİ
// =======================================================

function activateNameWriting() {
  console.log('✍️ Write Message modu aktive ediliyor...');
  window.isWritingMode = true;

  // Diğer tüm araçların 'active' durumunu kaldır
  document.querySelectorAll('.tool-btn, .magic-btn, #quickNameBtn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('nameBtn').classList.add('active');

  const canvas = document.getElementById('coloringCanvas');
  canvas.style.cursor = 'text';

  // Kullanıcıya bilgi ver
  const infoBox = document.createElement('div');
  infoBox.textContent = 'Write Message Mode: Click on the canvas to place your text!';
  infoBox.style.cssText = 'position:fixed; top:15%; left:50%; transform:translateX(-50%); background: #FF69B4; color:white; padding:10px 20px; border-radius:15px; z-index:10001; font-weight:bold;';
  document.body.appendChild(infoBox);
  setTimeout(() => infoBox.remove(), 3000);
}

function exitNameWritingMode() {
  window.isWritingMode = false;
  const canvas = document.getElementById('coloringCanvas');
  canvas.style.cursor = 'crosshair';
  document.getElementById('nameBtn').classList.remove('active');
  setTool('pencil'); // Varsayılan araca geri dön
}

function showNameInputModal(x, y) {
  // Önceki modal varsa kaldır
  const oldModal = document.querySelector('.text-input-modal');
  if (oldModal) oldModal.remove();

  // Yeni modal'ı oluştur
  const modalHTML = `
        <div class="text-input-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:10000;">
            <div class="text-input-content" style="background:white; padding:20px; border-radius:10px; width:90%; max-width:400px; text-align:center;">
                <h3>Write Your Message</h3>
                <input type="text" id="textInput" placeholder="Enter text..." style="width:95%; padding:10px; margin-bottom:15px; font-size:16px;">
                <div style="margin-bottom:10px;">
                    <label>Font: </label>
                    <select id="fontSelect">
                        <option value="Comic Sans MS">Comic Sans MS</option>
                        <option value="Arial">Arial</option>
                        <option value="Brush Script MT">Brush Script</option>
                        <option value="Papyrus">Papyrus</option>
                    </select>
                </div>
                <div style="margin-bottom:10px;">
                    <label>Size: </label>
                    <input type="range" id="fontSizeSlider" min="12" max="72" value="24"> <span id="fontSizeDisplay">24px</span>
                </div>
                <div style="margin-bottom:20px;">
                    <label>Color: </label>
                    <input type="color" id="textColorPicker" value="#FF69B4">
                </div>
                <button id="addTextBtn" style="padding:10px 20px; background: #4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">Add Text</button>
                <button id="cancelTextBtn" style="padding:10px 20px; background: #f44336; color:white; border:none; border-radius:5px; cursor:pointer; margin-left:10px;">Cancel</button>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Modal içindeki olayları bağla
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const fontSizeDisplay = document.getElementById('fontSizeDisplay');
  fontSizeSlider.addEventListener('input', () => { fontSizeDisplay.textContent = `${fontSizeSlider.value}px`; });

  // 706. satır civarı...
  // "Add Text" butonu "damgalama" işlemini başlatacak.
  document.getElementById('addTextBtn').onclick = () => writeNameToCanvas(x, y);
  document.getElementById('cancelTextBtn').onclick = closeNameModal;
}

function closeNameModal() {
  const modal = document.querySelector('.text-input-modal');
  if (modal) modal.remove();
}


// =======================================================
// GÖREV 27: "SIGNATURE" SİSTEMİ
// =======================================================

function activateSignatureMode() {
  console.log("✍️ Signature modu aktive ediliyor...");

  // Önceki modal varsa kaldır
  const oldModal = document.querySelector('.signature-input-modal');
  if (oldModal) oldModal.remove();

  // Yeni modal'ı oluştur
  // activateSignatureMode fonksiyonu içindeyiz...

  // YENİ VE MOBİL UYUMLU MODAL HTML'İ
  const modalHTML = `
    <div class="signature-input-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:10000; padding: 15px;">
        <div class="signature-input-content" style="background:linear-gradient(135deg, #8B4513, #D2691E); color:white; padding:20px; border-radius:15px; width:100%; max-width:400px; text-align:center; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
            <h3>Create Your Signature</h3>
            <input type="text" id="signatureInput" placeholder="Enter your name for signature" maxlength="20" style="width:95%; padding:10px; margin-bottom:15px; border-radius:8px; border:none; font-size:16px;">
            
            <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <label for="signatureFontSelect">Style:</label>
                <select id="signatureFontSelect" style="flex-grow:1; padding:8px; border-radius:5px; border:none;">
                    <option value="Brush Script MT">Brush Script</option>
                    <option value="Lucida Handwriting">Handwriting</option>
                    <option value="Segoe Script">Elegant Script</option>
                </select>
            </div>
            
            <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between; align-items:center; margin-bottom:20px;">
                 <label for="signatureColorPicker">Color:</label>
                 <input type="color" id="signatureColorPicker" value="#444444" style="border-radius:5px; border:none; height:35px; width:50px;">
            </div>

            <div style="display:flex; gap:10px; justify-content:center;">
                <button id="addSignatureBtn" style="padding:12px 20px; background:#4CAF50; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; flex-grow:1;">Add Signature</button>
                <button id="cancelSignatureBtn" style="padding:12px 20px; background:#f44336; color:white; border:none; border-radius:8px; cursor:pointer;">Cancel</button>
            </div>
        </div>
    </div>
`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Modal içindeki olayları bağla
  document.getElementById('addSignatureBtn').onclick = writeSignatureToCanvas;
  document.getElementById('cancelSignatureBtn').onclick = () => {
    const modal = document.querySelector('.signature-input-modal');
    if (modal) modal.remove();
  };
}

function writeSignatureToCanvas() {
  const text = document.getElementById('signatureInput').value;
  const font = document.getElementById('signatureFontSelect').value;
  const color = document.getElementById('signatureColorPicker').value;
  const size = 22; // İmza için sabit veya ayarlanabilir bir boyut

  if (!text) {
    alert("Please enter your name for the signature!");
    return;
  }

  const canvas = document.getElementById('coloringCanvas');
  const ctx = canvas.getContext('2d');

  ctx.font = `italic ${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'right'; // Sağa hizala
  ctx.textBaseline = 'bottom'; // Alta hizala

  // Canvas'ın sağ alt köşesine yerleştir (küçük bir boşluk bırakarak)
  const x = canvas.width - 20;
  const y = canvas.height - 20;

  ctx.fillText(text, x, y);

  saveDrawingState();

  const modal = document.querySelector('.signature-input-modal');
  if (modal) modal.remove();
}
// --- BÖLÜM 3: SAYFA YÜKLENDİĞİNDE ÇALIŞACAK ANA KOD BLOĞU ---

document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ DOM Yüklendi. Tüm oyun sistemleri başlatılıyor...');

  const canvas = document.getElementById('coloringCanvas');
  if (!canvas) {
    console.error('KRİTİK HATA: Canvas elementi bulunamadı!');
    return;
  }
  const ctx = canvas.getContext('2d', {
    willReadFrequently: true


  });

  // 1. RENK PALETİNİ OLUŞTUR
  const colorPalette = document.getElementById('colorPalette');
  // ESKİ HALİ:
  // const colors = ['#FF0000', '#8B0000', ...];

  // YENİ VE ZENGİNLEŞTİRİLMİŞ HALİ:
  const colors = [
    // Kırmızılar & Pembeler
    '#FF0000', '#DC143C', '#FF69B4', '#FFC0CB', '#8B0000',
    // Turuncular & Sarılar
    '#FFA500', '#FF8C00', '#FFD700', '#FFFF00', '#F0E68C',
    // Yeşiller
    '#32CD32', '#008000', '#9ACD32', '#2E8B57', '#006400',
    // Maviler & Turkuazlar
    '#0000FF', '#1E90FF', '#87CEEB', '#00CED1', '#000080',
    // Morlar
    '#8A2BE2', '#9400D3', '#BA55D3', '#4B0082', '#E6E6FA',
    // Kahverengiler & Ten Renkleri
    '#A0522D', '#D2691E', '#8B4513', '#F4A460', '#FFDFC4',
    // Griler, Siyah & Beyaz
    '#FFFFFF', '#708090', '#A9A9A9', '#D3D3D3', '#724B4B', '#2A2323',
  ];
  colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', () => {
      currentColor = color;
    });
    colorPalette.appendChild(swatch);
  });
  const customColorPicker = document.createElement('input');
  customColorPicker.type = 'color';
  customColorPicker.className = 'custom-color-picker';
  customColorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
  });
  colorPalette.appendChild(customColorPicker);


  // 3. ÇİZİM OLAYLARINI AYARLA (v2 - MOBİL VE MASAÜSTÜ UYUMLU)

  let isDragging = false; // Sadece sürükleme yapılıp yapılmadığını kontrol eder.

  function startDrawing(e) {
    if (currentTool === 'text' || window.isWritingMode) return;

    const coords = getCanvasCoordinates(e);
    lastX = coords.x;
    lastY = coords.y;

    isDrawing = true; // Çizim başladı (tıklandı)
    isDragging = false; // Henüz sürüklenmedi
  }

  // =======================================================
  // PRO ARAÇLAR EKLENMİŞ, MEVCUT YAPIYI KORUYAN DRAW FONKSİYONU
  // =======================================================
  function draw(e) {
    // 1. KORUMA KALKANI: Sadece sürükleme araçları için çalış.
    // Pro araçları listeye eklendi.
    const dragTools = ['pencil', 'brush', 'marker', 'pastel', 'watercolor', 'spray', 'erase', 'glitter', 'rainbow', 'glow',];
    if (!isDrawing || !dragTools.includes(currentTool)) {
      return;
    }
    isDragging = true;

    // 2. KOORDİNATLARI AL
    const coords = getCanvasCoordinates(e);
    const x = coords.x, y = coords.y;

    // 3. HER ARAÇ İÇİN ÖZEL MANTIK
    switch (currentTool) {

      // --- YENİ EKLENEN PRO ARAÇLAR ---
      case 'glow':
        // ==========================================
        // NEON SİHİRBAZI (PRO IŞIK EFEKTİ) - DÜZELTİLMİŞ
        // ==========================================

        // 1. IŞIK MODU: Renkleri parlatır
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 2. Işık Halesi (Glow)
        // getCurrentToolSize() yerine doğrudan 'glowSize' değişkenini kullanıyoruz.
        ctx.shadowBlur = glowSize * 1.5;
        ctx.shadowColor = currentColor;

        // 3. Çekirdek (Core)
        // Beyaz kısım, glowSize'ın %70'i kadar olsun
        ctx.lineWidth = glowSize * 0.7;
        ctx.strokeStyle = "#FFFFFF"; // Saf beyaz çekirdek

        // 4. Çiz
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // 5. Temizlik (Ayarları sıfırla)
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.globalCompositeOperation = 'source-over'; // Normale dön
        break;

      case 'rainbow':
        // Seçenek 2: Gradyan Gökkuşağı Fırçası

        // Renk döngüsü için global rainbowHue değişkenini kullanmaya devam ediyoruz.
        rainbowHue = (rainbowHue + 5) % 360; // Renk geçişini hızlandıralım
        const nextHue = (rainbowHue + 30) % 360; // Çizginin sonundaki renk

        // Çizdiğimiz kısa çizginin başlangıç ve bitiş noktaları arasında bir gradyan oluştur.
        const gradient = ctx.createLinearGradient(lastX, lastY, x, y);

        // Gradyanın başlangıç ve bitiş renklerini belirle.
        gradient.addColorStop(0, `hsl(${rainbowHue}, 90%, 60%)`); // Başlangıç rengi
        gradient.addColorStop(1, `hsl(${nextHue}, 90%, 60%)`); // Bitiş rengi

        // Şimdi bu gradyanı "boya" olarak kullanarak çizgiyi çiz.
        ctx.strokeStyle = gradient;
        ctx.lineWidth = getCurrentToolSize();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;

      // ... diğer case bloklarınız (pencil, brush, glow, vs.) burada devam eder ...

      case 'glitter':
        // Glitter artık canlı bir renk paleti ve daha parlak parçacıklar kullanıyor
        const glitterColors = ['#FFD700', '#FFFFFF', '#FF69B4', '#00BFFF', '#7CFC00']; // Altın, Beyaz, Pembe, Mavi, Yeşil
        const glitterDensity = 30;
        const size = getCurrentToolSize();

        for (let i = 0; i < glitterDensity; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * size;
          const particleX = x + Math.cos(angle) * distance;
          const particleY = y + Math.sin(angle) * distance;

          // Her parçacığın boyutunu ve opaklığını rastgele ayarla
          const particleSize = Math.random() * 3 + 1.5;

          // PARILTI EFEKTİ: Renkli bir dairenin içine daha küçük beyaz bir daire çiziyoruz

          // 1. Ana Renkli Daire
          ctx.beginPath();
          ctx.globalAlpha = Math.random() * 0.5 + 0.3; // Yarı saydam
          ctx.fillStyle = glitterColors[Math.floor(Math.random() * glitterColors.length)];
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fill();

          // 2. İçteki Parlak Beyaz Nokta
          ctx.beginPath();
          ctx.globalAlpha = 0.9; // Neredeyse opak
          ctx.fillStyle = '#FFFFFF';
          ctx.arc(particleX, particleY, particleSize * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0; // Opaklığı sıfırla
        break;

      // --- MEVCUT, ÇALIŞAN ARAÇLARINIZ (DEĞİŞTİRİLMEDİ) ---

      case 'pencil':
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = getCurrentToolSize();
        ctx.strokeStyle = currentColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;

      case 'brush':
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = currentColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const brushDistance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
        const steps = Math.max(Math.floor(brushDistance / 2), 1);
        for (let i = 0; i < steps; i++) {
          const t = (i + 1) / steps;
          const interpolatedX = lastX + (x - lastX) * t;
          const interpolatedY = lastY + (y - lastY) * t;
          const variation = getCurrentToolSize() * 0.1;
          const offsetX = (Math.random() - 0.5) * variation;
          const offsetY = (Math.random() - 0.5) * variation;
          ctx.beginPath();
          ctx.arc(interpolatedX + offsetX, interpolatedY + offsetY, getCurrentToolSize() / 2, 0, Math.PI * 2);
          ctx.fillStyle = currentColor;
          ctx.fill();
        }
        break;

      // =... switch (currentTool) ...


      // ... switch (currentTool) { ...

      case 'marker':
        // YENİ VE NİHAİ MARKER: Üst üste binen, yarı şeffaf daireler çizer.

        // 1. ŞEFFAFLIĞI AYARLA: Bu, rengin üst üste binince koyulaşmasını sağlar.
        ctx.globalAlpha = 0.03; // %30 opaklık. Değeri düşürdükçe daha şeffaf olur.

        // 2. DİĞER AYARLAR
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 3. PÜRÜZSÜZ ÇİZİM İÇİN ARA NOKTALARI HESAPLA
        const markerDistance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
        const markerSteps = Math.max(Math.floor(markerDistance / 2), 1);

        for (let i = 0; i < markerSteps; i++) {
          const markerT = (i + 1) / markerSteps;
          const markerInterpolatedX = lastX + (x - lastX) * markerT;
          const markerInterpolatedY = lastY + (y - lastY) * markerT;

          // 4. HER ARA NOKTAYA BİR YARI ŞEFFAF DAİRE ÇİZ
          ctx.beginPath();
          ctx.arc(markerInterpolatedX, markerInterpolatedY, getCurrentToolSize() / 2, 0, Math.PI * 2);
          ctx.fillStyle = currentColor;
          ctx.fill();
        }

        // 5. SONRAKİ ARAÇLAR İÇİN ŞEFFAFLIĞI SIFIRLA (ÇOK ÖNEMLİ)
        ctx.globalAlpha = 1.0;
        break;

      // ... diğer case bloklarınız (brush, pastel, vs.) burada devam eder ...
      case 'watercolor':
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.05;
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = getCurrentToolSize();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;

      case 'pastel':
        ctx.globalCompositeOperation = 'multiply';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const pastelDistance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
        const pastelSteps = Math.max(Math.floor(pastelDistance), 1);
        for (let i = 0; i < pastelSteps; i++) {
          const pastelT = (i + 1) / pastelSteps;
          const pastelCenterX = lastX + (x - lastX) * pastelT;
          const pastelCenterY = lastY + (y - lastY) * pastelT;
          const pastelRadius = getCurrentToolSize();
          for (let j = 0; j < 30; j++) {
            // EKSİK OLAN VE ŞİMDİ EKLENEN KRİTİK SATIR:
            const angle = Math.random() * Math.PI * 2;

            const r = Math.random() * pastelRadius;
            const pixelX = Math.floor(pastelCenterX + Math.cos(angle) * r);
            const pixelY = Math.floor(pastelCenterY + Math.sin(angle) * r);
            const dist = r / pastelRadius;
            ctx.globalAlpha = 0.03 * (1 - dist);
            ctx.fillStyle = currentColor;
            ctx.fillRect(pixelX, pixelY, 2, 2);
          }
        }
        ctx.globalAlpha = 1.0;
        break;

      case 'spray':
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
        const radius = getCurrentToolSize();
        const density = 50;
        ctx.fillStyle = currentColor;
        for (let i = 0; i < density; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const sprayDistance = Math.random() * radius;
          ctx.fillRect(x + Math.cos(angle) * sprayDistance, y + Math.sin(angle) * sprayDistance, 1, 1);
        }
        break;

      case 'erase':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = getCurrentToolSize();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
    }

    // 4. SON POZİSYONU GÜNCELLE
    [lastX, lastY] = [x, y];
  }

  function stopDrawing(e) {
    if (isDrawing && isDragging) {
      clearTimeout(window.saveStateTimeout);
      window.saveStateTimeout = setTimeout(() => {
        saveDrawingState();
      }, 100);
    }
    isDrawing = false;
    isDragging = false;
  }
  // Tüm platformlar için olay dinleyicileri
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', () => { isDrawing = false; isDragging = false; }); // Sadece durumu sıfırla

  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e.touches[0]); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    // SADECE 'isDrawing' durumu aktifken varsayılan davranışı (kaydırmayı) engelle.
    if (isDrawing) {
      e.preventDefault();
      draw(e.touches[0]);
    }
  }, { passive: false });

  // DOKUNMA BİTTİĞİNDE (MOBİL)
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();

    // Sürüklenip sürüklenmediğini kontrol etmek için bir kopya al
    const wasDragging = isDragging;

    // Önce normal çizim bitirme fonksiyonunu çağır (bu, isDragging'i sıfırlar)
    stopDrawing(e.changedTouches[0]);

    // Şimdi, eğer bu bir sürükleme DEĞİLSE,
    // bu dokunmanın bir "click" olduğunu simüle et.
    if (!wasDragging) {
      console.log("📱 Mobile tap detected, simulating a click event.");

      // Gerçek bir click olayı oluştur
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY
      });
      // Oluşturduğun bu olayı canvas'a gönder
      e.target.dispatchEvent(clickEvent);
    }
  }, { passive: false });

  // =======================================================
  // GÖREV 24 DÜZELTMESİ: NİHAİ TIKLAMA OLAY YÖNETİCİSİ
  // Hem tek tık araçlarını hem de metin yazma modunu yönetir.
  // =======================================================

  canvas.addEventListener('click', function (e) {
    const coords = getCanvasCoordinates(e);
    const x = Math.round(coords.x);
    const y = Math.round(coords.y);

    // 1. ÖNCELİK KONTROLÜ: Metin yazma modu aktif mi?
    if (window.isWritingMode) {
      console.log("✍️ Text mode is active. Opening text input modal.");
      showNameInputModal(x, y);
      return; // Başka hiçbir işlem yapma, fonksiyondan çık.
    }

    // 2. KONTROL: Tek tık çizim araçları mı seçili?
    const singleClickTools = ['fill', 'star', 'flower'];
    if (singleClickTools.includes(currentTool)) {

      console.log(`Tek tık aracı aktive edildi: ${currentTool}`);
      let stateChanged = false;

      switch (currentTool) {
        case 'fill':
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (floodFill(imageData, x, y, hexToRgb(currentColor))) {
            ctx.putImageData(imageData, 0, 0);
            stateChanged = true;
          }
          break;
        case 'star':
          drawMagicStar(x, y, ctx);
          stateChanged = true;
          break;
        case 'flower':
          drawMagicFlower(x, y, ctx);
          stateChanged = true;
          break;
      }

      if (stateChanged) {
        setTimeout(() => {
          saveDrawingState();
        }, 10);
      }
    }
    // Eğer metin yazma modu veya tek tık aracı aktif değilse, bu 'click' olayı hiçbir şey yapmaz.
  });

  // 4. BUTONLARI BAĞLA
  document.getElementById('undoBtn').addEventListener('click', handleUndoClick);
  document.getElementById('toolSize').addEventListener('input', (e) => updateSize(e.target.value));
  document.getElementById('homeBtn').addEventListener('click', () => loadAndDrawImage('image.png'));

  document.getElementById('newPageBtn').addEventListener('click', () => loadAndDrawImage());

  // ...
  document.getElementById('uploadBtn').addEventListener('click', function () {
    console.log('📁 Upload Image tıklandı! Global input hazırlanıyor...');

    // HTML'deki gizli input elementini seç
    const globalFileInput = document.getElementById('globalFileInput');

    // Bu butona özel 'onchange' olayını ata
    // Dosya seçildiğinde 'handleFileUpload' fonksiyonu çalışacak
    globalFileInput.onchange = handleFileUpload;

    // Gizli input'un tıklanmasını tetikle
    globalFileInput.click();
  });
  // --- YENİ EKLENEN BUTON BAĞLANTILARI ---
  document.getElementById('pencilBtn').addEventListener('click', () => setTool('pencil'));
  document.getElementById('brushBtn').addEventListener('click', () => setTool('brush'));
  document.getElementById('markerBtn').addEventListener('click', () => setTool('marker')); // <<< DÜZELTİLDİ
  document.getElementById('watercolorBtn').addEventListener('click', () => setTool('watercolor'));
  document.getElementById('pastelBtn').addEventListener('click', () => setTool('pastel'))
  document.getElementById('sprayBtn').addEventListener('click', () => setTool('spray'));
  document.getElementById('eraseBtn').addEventListener('click', () => setTool('erase'));
  document.getElementById('fillBtn').addEventListener('click', () => setTool('fill')); // Fill'i de buraya ekledik.

  // Henüz yapmasak da, sihirli değnekleri de şimdiden bağlayalım
  document.getElementById('starWand').addEventListener('click', () => setTool('star'));
  document.getElementById('flowerWand').addEventListener('click', () => setTool('flower'));
  document.getElementById('animateBtn').addEventListener('click', animateCharacter);
  document.getElementById('nameBtn').addEventListener('click', activateNameWriting);
  document.getElementById('quickNameBtn').addEventListener('click', activateSignatureMode);


  // ... Diğer butonlar (Home, Upload, New Page etc.) ...
  // 5. THUMBNAIL VE KATEGORİLERİ BAĞLA (ONARILMIŞ)
  document.querySelectorAll('.page-thumbnail').forEach(thumbnail => { thumbnail.addEventListener('click', function () { loadAndDrawImage(this.dataset.page); }); });

  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Önce tüm sekmelerden ve thumbnail gruplarından 'active' sınıfını kaldır
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.page-thumbnails').forEach(c => c.classList.remove('active'));

      // Tıklanan sekmeye ve ilgili thumbnail grubuna 'active' sınıfını ekle
      button.classList.add('active');
      const category = button.dataset.category;
      const categoryContainer = document.querySelector(`.page-thumbnails.${category}`);
      if (categoryContainer) {
        categoryContainer.classList.add('active');
        console.log(`Kategori değiştirildi: ${category}`);
      } else {
        console.error(`Kategori konteyneri bulunamadı: .page-thumbnails.${category}`);
      }
    });
  });

  // =======================================================
  // GÖREV 19 & 20: ONARILMIŞ GÖRSEL YÜKLEME FONKSİYONLARI
  // =======================================================

  /**
   * Belirtilen bir boyama sayfasını yükler, canvas'ı temizler ve çizer.
   * @param {string} pageName - Yüklenecek resmin adı (uzantısız).
   */
  // --- NİHAİ NEWSLETTER MODAL KONTROLÜ ---
  const newsletterModal = document.getElementById('newsletterModal');
  const newsletterTrigger = document.getElementById('newsletterTrigger');
  const newsletterCloseBtn = document.getElementById('newsletterCloseBtn');

  if (newsletterModal && newsletterTrigger && newsletterCloseBtn) {
    const openModal = () => {
      newsletterModal.style.display = 'flex';
    };
    const closeModal = () => {
      newsletterModal.style.display = 'none';
    };

    newsletterTrigger.addEventListener('click', openModal);
    newsletterCloseBtn.addEventListener('click', closeModal);

    // Dışarı tıklayınca kapatma
    window.addEventListener('click', (event) => {
      if (event.target === newsletterModal) {
        closeModal();
      }
    });
  }
  // 6. BAŞLANGIÇ AYARLARI
  loadAndDrawImage('image.png');
  setTool('pencil');
  // Sayfa yüklendiğinde URL'de başarı mesajı var mı diye kontrol et
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('subscription') === 'success') {
    // Kendi şık başarı mesajımızı gösterelim
    const successMsg = document.createElement('div');
    successMsg.textContent = '✅ Thank you! Your subscription has been successful.';
    // Bu mesaja CSS'te .success-message sınıfı ile stil verebiliriz
    successMsg.className = 'subscription-success-message'; // <<< DOĞRU SINIF ADI
    document.body.appendChild(successMsg);

    // Mesaj birkaç saniye sonra kaybolsun
    setTimeout(() => {
      successMsg.remove();
      // URL'den gereksiz parametreyi temizle
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 4000);
  }

  console.log('✅ Tüm oyun sistemleri başarıyla başlatıldı.');
});
// <--- Ana DOMContentLoaded bloğu burada biter

// =========================================================================
// NİHAİ VE KURŞUN GEÇİRMEZ MAGIC PHOTOS SİSTEMİ (v6 - Tüm Hatalar Giderildi)
// =========================================================================

(function enhancedMagicPhotosSystemFinal() {
  console.log('🎨 Magic Photos sistemi (v6 Final) başlatılıyor...');

  // --- Global Değişkenler ---
  let isEditingPhoto = false;
  let userPhoto = new Image();
  let templateImage = new Image();
  let currentTemplate = null;
  let selectedStyle = 'colored';
  let editingSettings = { x: 0, y: 0, scale: 1, isDragging: false, startX: 0, startY: 0, width: 0, height: 0 };
  let initialPinchDistance = null;

  const TEMPLATES_CONFIG = {
    princess: { name: "Magical Princess", icon: "👑", colored: "princess_colored_transparent.png", outline: "princess_outline_transparent.png", colored_thumb: "princess_colored_thumb.png", outline_thumb: "princess_outline_thumb.png", faceArea: { x: 400, y: 310, width: 200, height: 240 } },
    birthday: { name: "Birthday Star", icon: "🎂", colored: "birthday_colored_transparent.png", outline: "birthday_outline_transparent.png", colored_thumb: "birthday_colored_thumb.png", outline_thumb: "birthday_outline_thumb.png", faceArea: { x: 400, y: 300, width: 200, height: 240 } },
    firefighter: { name: "Hero Firefighter", icon: "🚒", colored: "firefighter_colored_transparent.png", outline: "firefighter_outline_transparent.png", colored_thumb: "firefighter_colored_thumb.png", outline_thumb: "firefighter_outline_thumb.png", faceArea: { x: 550, y: 240, width: 170, height: 210 } },
    pirate: { name: "Adventure Pirate", icon: "🏴‍☠️", colored: "pirate_colored_transparent.png", outline: "pirate_outline_transparent.png", colored_thumb: "pirate_colored_thumb.png", outline_thumb: "pirate_outline_thumb.png", faceArea: { x: 400, y: 280, width: 180, height: 220 } },
    safari: { name: "Safari Explorer", icon: "🦁", colored: "safari_colored_transparent.png", outline: "safari_outline_transparent.png", colored_thumb: "safari_colored_thumb.png", outline_thumb: "safari_outline_thumb.png", faceArea: { x: 400, y: 290, width: 180, height: 220 }, isPremium: true },
    space: { name: "Space Explorer", icon: "🚀", colored: "space_colored_transparent.png", outline: "space_outline_transparent.png", colored_thumb: "space_colored_thumb.png", outline_thumb: "space_outline_thumb.png", faceArea: { x: 400, y: 300, width: 200, height: 240 }, isPremium: true },
    superhero: { name: "Super Hero", icon: "🦸‍♂️", colored: "superhero_colored_transparent.png", outline: "superhero_outline_transparent.png", colored_thumb: "superhero_colored_thumb.png", outline_thumb: "superhero_outline_thumb.png", faceArea: { x: 400, y: 240, width: 160, height: 200 }, isPremium: true },
    underwater: { name: "Underwater World", icon: "🐠", colored: "underwater_colored_transparent.png", outline: "underwater_outline_transparent.png", colored_thumb: "underwater_colored_thumb.png", outline_thumb: "underwater_outline_thumb.png", faceArea: { x: 400, y: 290, width: 200, height: 240 }, isPremium: true },
    unicorn: { name: "Unicorn Magic", icon: "🦄", colored: "unicorn_colored_transparent.png", outline: "unicorn_outline_transparent.png", colored_thumb: "unicorn_colored_thumb.png", outline_thumb: "unicorn_outline_thumb.png", faceArea: { x: 360, y: 250, width: 200, height: 220 }, isPremium: true },
    unicorn_girl: { name: "Unicorn Girl", icon: "👧🦄", colored: "unicorn_girl_colored_transparent.png", outline: "unicorn_girl_outline_transparent.png", colored_thumb: "unicorn_girl_colored_thumb.png", outline_thumb: "unicorn_girl_outline_thumb.png", faceArea: { x: 450, y: 215, width: 190, height: 220 }, isPremium: true },
    wizzard: { name: "Wizard Academy", icon: "🧙‍♂️", colored: "wizzard_colored_transparent.png", outline: "wizzard_outline_transparent.png", colored_thumb: "wizzard_colored_thumb.png", outline_thumb: "wizzard_outline_thumb.png", faceArea: { x: 445, y: 295, width: 160, height: 200 }, isPremium: true }
  };

  // --- NİHAİ ÇÖZÜM v9: Merkezi Temizlik Fonksiyonu ---
  function _resetMagicPhotosState() {
    console.log("🧹 Tüm Magic Photos durumu temizleniyor...");
    isEditingPhoto = false;

    const canvas = document.getElementById('coloringCanvas');
    if (canvas) {
      canvas.style.cursor = 'crosshair';
      removeEditingEventListeners();
    }

    const instructions = document.getElementById('editingInstructions');
    if (instructions) instructions.classList.remove('visible');

    const faceInstruction = document.getElementById('faceClickInstruction');
    if (faceInstruction) faceInstruction.remove();

    document.body.style.height = '';
    document.body.style.overflow = '';

    currentTemplate = null;
    userPhoto = new Image();
    templateImage = new Image();
  }

  function openMagicPhotosStudio() {
    _resetMagicPhotosState();
    createMainModal();
  }

  function closeAllMagicPhotosUI() {
    document.querySelectorAll('.magic-photos-modal-container').forEach(modal => modal.remove());
  }

  function createMainModal() {
    closeAllMagicPhotosUI();
    const modal = document.createElement('div');
    modal.className = 'magic-photos-modal-container';
    modal.innerHTML = `
          <div class="magic-photos-content">
              <span class="magic-photos-close">×</span>
              <h2 class="magic-photos-title">✨ Magic Photos Studio ✨</h2>
              <p class="magic-photos-subtitle">Choose a template to begin!</p>
              <div class="magic-photos-style-selector">
                  <button id="mpColoredBtn" class="mp-style-btn active">🎨 Colored</button>
                  <button id="mpOutlineBtn" class="mp-style-btn">✏️ Outline</button>
              </div>
              <div class="magic-photos-grid"></div>
          </div>`;
    document.body.appendChild(modal);

    modal.querySelector('.magic-photos-close').onclick = closeAllMagicPhotosUI;
    const grid = modal.querySelector('.magic-photos-grid');

    const setStyle = (style) => {
      selectedStyle = style;
      modal.querySelector('#mpColoredBtn').classList.toggle('active', style === 'colored');
      modal.querySelector('#mpOutlineBtn').classList.toggle('active', style === 'outline');
      loadTemplates(grid);
    };

    modal.querySelector('#mpColoredBtn').onclick = () => setStyle('colored');
    modal.querySelector('#mpOutlineBtn').onclick = () => setStyle('outline');
    setStyle('colored');
  }

  function loadTemplates(grid) {
    grid.innerHTML = '';
    const isUserPremium = localStorage.getItem('isPremium') === 'true';
    for (const key in TEMPLATES_CONFIG) {
      const template = TEMPLATES_CONFIG[key];
      const isTemplatePremium = template.isPremium === true;
      const card = document.createElement('div');
      card.className = 'magic-template-card';
      const thumbnailFile = selectedStyle === 'colored' ? template.colored_thumb : template.outline_thumb;
      let cardHTML = `<div class="magic-template-image-wrapper"><img src="template-images/${thumbnailFile}" class="magic-template-thumb" alt="${template.name}"></div><div class="magic-template-name">${template.icon} ${template.name}</div>`;
      if (isTemplatePremium && !isUserPremium) {
        card.classList.add('locked');
        card.onclick = () => { typeof showPremiumModal === 'function' && showPremiumModal(); };
        cardHTML += `<div class="magic-pro-badge">⭐ Pro</div>`;
      } else {
        card.onclick = () => {
          loadTemplateToCanvas(key);
          closeAllMagicPhotosUI();
        };
      }
      card.innerHTML = cardHTML;
      grid.appendChild(card);
    }
  }

  function loadTemplateToCanvas(templateKey) {
    _resetMagicPhotosState();
    currentTemplate = TEMPLATES_CONFIG[templateKey];
    const templateFile = selectedStyle === 'colored' ? currentTemplate.colored : currentTemplate.outline;
    templateImage = new Image();
    templateImage.crossOrigin = "Anonymous";
    templateImage.onload = () => {
      const canvas = document.getElementById('coloringCanvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
      if (typeof saveDrawingState === 'function') {
        drawingHistory = []; currentStep = -1; saveDrawingState();
      }
      showClickableInstruction(); // Artık sadece talimat kutusunu gösteriyoruz
    };
    templateImage.src = `template-images/${templateFile}`;
  }

  // NİHAİ ÇÖZÜM v9: Basitleştirilmiş talimat ve tıklama mantığı
  function showClickableInstruction() {
    const oldInstruction = document.getElementById('faceClickInstruction');
    if (oldInstruction) oldInstruction.remove();

    const instructionDiv = document.createElement('div');
    instructionDiv.id = 'faceClickInstruction';
    instructionDiv.innerHTML = `<div class="instruction-icon">🖼️</div><div><strong>Click HERE</strong> to add your photo!</div>`;
    instructionDiv.style.cursor = 'pointer'; // Tıklanabilir olduğunu belirt

    // TIKLAMA OLAYINI DOĞRUDAN BU KUTUYA ATA
    instructionDiv.onclick = () => {
      instructionDiv.remove(); // Tıklandıktan sonra kendini kaldır
      triggerPhotoUpload();   // Dosya yüklemeyi tetikle
    };

    document.body.appendChild(instructionDiv);
  }

  function triggerPhotoUpload() {
    console.log('✨ Magic Photos için resim yükleme tetiklendi! Global input hazırlanıyor...');

    // HTML'deki gizli input elementini seç
    const globalFileInput = document.getElementById('globalFileInput');

    // Magic Photos'a özel 'onchange' olayını ata
    globalFileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const objectURL = URL.createObjectURL(file);
        userPhoto = new Image();
        userPhoto.crossOrigin = "Anonymous";
        userPhoto.onload = () => {
          startCanvasEditing();
          URL.revokeObjectURL(objectURL); // Bellek sızıntısını önlemek için önemli
        };
        userPhoto.src = objectURL;
      }
    };

    // Gizli input'un tıklanmasını tetikle
    globalFileInput.click();
  }

  function startCanvasEditing() {
    isEditingPhoto = true;
    const canvas = document.getElementById('coloringCanvas');
    const faceArea = currentTemplate.faceArea;
    const canvasScaleX = canvas.width / 800;
    const canvasScaleY = canvas.height / 600;
    const photoAspectRatio = userPhoto.width / userPhoto.height;
    const faceAreaAspectRatio = faceArea.width / faceArea.height;
    let photoWidth, photoHeight;
    if (photoAspectRatio > faceAreaAspectRatio) {
      photoWidth = faceArea.width * 1.5 * canvasScaleX;
      photoHeight = photoWidth / photoAspectRatio;
    } else {
      photoHeight = faceArea.height * 1.5 * canvasScaleY;
      photoWidth = photoHeight * photoAspectRatio;
    }
    editingSettings = { x: faceArea.x * canvasScaleX, y: faceArea.y * canvasScaleY, width: photoWidth, height: photoHeight, isDragging: false };
    setupEditingEventListeners();
    redrawCanvas();
    const instructions = document.getElementById('editingInstructions');
    if (instructions) {
      setTimeout(() => { instructions.classList.add('visible'); }, 10);
    }
  }

  function redrawCanvas() {
    if (!userPhoto.src || !templateImage.src) return;
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
    const drawX = editingSettings.x - (editingSettings.width / 2);
    const drawY = editingSettings.y - (editingSettings.height / 2);
    ctx.drawImage(userPhoto, drawX, drawY, editingSettings.width, editingSettings.height);
    ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  }

  function finishEditing() {
    const bodyHeight = document.body.clientHeight;
    document.body.style.height = `${bodyHeight}px`;
    document.body.style.overflow = 'hidden';
    redrawCanvas();
    if (typeof saveDrawingState === 'function') saveDrawingState();
    showSuccessMessage();
    _resetMagicPhotosState();
  }

  function cancelEditing() {
    const bodyHeight = document.body.clientHeight;
    document.body.style.height = `${bodyHeight}px`;
    document.body.style.overflow = 'hidden';
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    if (drawingHistory.length > 0) {
      ctx.putImageData(drawingHistory[0], 0, 0);
      drawingHistory.splice(1);
      currentStep = 0;
    }
    _resetMagicPhotosState();
  }

  function setupEditingEventListeners() {
    const canvas = document.getElementById('coloringCanvas');
    canvas.style.cursor = 'move';
    canvas.addEventListener('mousedown', handleEditMouseDown);
    canvas.addEventListener('mousemove', handleEditMouseMove);
    window.addEventListener('mouseup', handleEditMouseUp);
    canvas.addEventListener('wheel', handleEditWheel, { passive: false });
    canvas.addEventListener('touchstart', handleEditTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleEditTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleEditTouchEnd, { passive: false });
  }

  function removeEditingEventListeners() {
    const canvas = document.getElementById('coloringCanvas');
    if (!canvas) return;
    canvas.removeEventListener('mousedown', handleEditMouseDown);
    canvas.removeEventListener('mousemove', handleEditMouseMove);
    window.removeEventListener('mouseup', handleEditMouseUp);
    canvas.removeEventListener('wheel', handleEditWheel);
    canvas.removeEventListener('touchstart', handleEditTouchStart);
    canvas.removeEventListener('touchmove', handleEditTouchMove);
    canvas.removeEventListener('touchend', handleEditTouchEnd);
  }

  function getEventCoordinates(e, touchIndex = 0) {
    const canvas = document.getElementById('coloringCanvas');
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches[touchIndex]) {
      clientX = e.touches[touchIndex].clientX;
      clientY = e.touches[touchIndex].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function handleEditMouseDown(e) { e.preventDefault(); editingSettings.isDragging = true; const coords = getEventCoordinates(e); editingSettings.startX = coords.x; editingSettings.startY = coords.y; }
  function handleEditMouseUp() { editingSettings.isDragging = false; initialPinchDistance = null; }
  function handleEditMouseMove(e) { if (!isEditingPhoto || !editingSettings.isDragging) return; e.preventDefault(); const coords = getEventCoordinates(e); const deltaX = coords.x - editingSettings.startX; const deltaY = coords.y - editingSettings.startY; editingSettings.x += deltaX; editingSettings.y += deltaY; editingSettings.startX = coords.x; editingSettings.startY = coords.y; redrawCanvas(); }
  function handleEditWheel(e) { if (!isEditingPhoto) return; e.preventDefault(); const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05; editingSettings.width *= scaleFactor; editingSettings.height *= scaleFactor; redrawCanvas(); }
  function handleEditTouchStart(e) { e.preventDefault(); if (e.touches.length === 1) { handleEditMouseDown(e); } else if (e.touches.length === 2) { editingSettings.isDragging = false; initialPinchDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); } }
  function handleEditTouchEnd(e) { e.preventDefault(); handleEditMouseUp(); }
  function handleEditTouchMove(e) { e.preventDefault(); if (e.touches.length === 1 && editingSettings.isDragging) { handleEditMouseMove(e); } else if (e.touches.length === 2 && initialPinchDistance) { const newPinchDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); const scaleFactor = newPinchDistance / initialPinchDistance; editingSettings.width *= scaleFactor; editingSettings.height *= scaleFactor; initialPinchDistance = newPinchDistance; redrawCanvas(); } }

  function showSuccessMessage() {
    const msg = document.createElement('div');
    msg.className = 'magic-success-message';
    msg.textContent = '🎉 Magic Photo Applied Successfully!';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2500);
  }

  function initialize() {
    // NİHAİ ÇÖZÜM v11: Bu fonksiyonun SADECE BİR KERE çalışmasını garantile.
    if (hasInitialized) {
      return; // Eğer daha önce çalıştıysa, hemen çık.
    }
    hasInitialized = true; // Bayrağı kaldır, bir daha çalışmasın.

    console.log("🚀 Uygulama başlatılıyor... Olay dinleyicileri SADECE BİR KERE atanacak.");

    // --- Olay dinleyicileri ---

    const magicButton = document.getElementById('magicPhotoBtn');
    if (magicButton) {
      magicButton.addEventListener('click', (e) => {
        e.preventDefault();
        openMagicPhotosStudio();
      });
    }

    // --- Sayfa başında SADECE BİR KERE oluşturulacak elementler ---

    if (!document.getElementById('editingInstructions')) {
      let instructions = document.createElement('div');
      instructions.id = 'editingInstructions';
      instructions.className = 'mp-editor-actions';
      instructions.innerHTML = `<button id="finishEditingBtn" class="mp-confirm-btn">✅ Finish</button><button id="cancelEditingBtn" class="mp-cancel-btn">❌ Cancel</button>`;
      document.body.appendChild(instructions);
      document.getElementById('finishEditingBtn').onclick = finishEditing;
      document.getElementById('cancelEditingBtn').onclick = cancelEditing;
    }

    // --- Pencere olayları ---

    // BU SATIRI SİLİN VEYA YORUM SATIRI HALİNE GETİRİN
    /*
    window.addEventListener('resize', () => {
      const instruction = document.getElementById('faceClickInstruction');
      if (instruction) instruction.remove();
    });
    */

    // YUKARIDAKİ KODU KALDIRIN
  }

  // NİHAİ ÇÖZÜM v9.1: Olayı doğru zamanda dinle
  // DOMContentLoaded, tüm HTML'in yüklendiğini ama resimlerin beklenmediğini garantiler.
  // Bu, butonların var olduğundan emin olmak için en doğru zamandır.
  window.addEventListener('DOMContentLoaded', initialize);

})();

// --- YENİ VE GELİŞTİRİLMİŞ CANVAS YAZDIRMA FONKSİYONU ---
function printCanvas() {
  const canvas = document.getElementById('coloringCanvas');
  const dataUrl = canvas.toDataURL('image/png');

  // Yazdırma için geçici bir kapsayıcı oluştur
  const printContainer = document.createElement('div');
  printContainer.className = 'print-image-container'; // CSS'te tanımladığımız sınıfı ver
  printContainer.style.display = 'none'; // Başlangıçta gizli olsun

  const img = document.createElement('img');
  img.src = dataUrl;

  printContainer.appendChild(img);
  document.body.appendChild(printContainer);

  // Resmi yazdır
  window.print();

  // Yazdırma işlemi bittikten sonra (veya iptal edildikten sonra)
  // oluşturduğumuz geçici elementi temizle
  document.body.removeChild(printContainer);
}
// ==================================================
// PREMIUM HD İNDİRME SİSTEMİ
// ==================================================

function handleSaveClick() {
  const isUserPremium = localStorage.getItem('isPremium') === 'true';

  if (isUserPremium) {
    // --- PREMIUM KULLANICI İÇİN HD İNDİRME ---
    console.log("💎 Premium kullanıcı için HD indirme başlatılıyor...");
    saveCanvasAsImage(2); // 2 katı çözünürlükte indir
  } else {
    // --- STANDART KULLANICI İÇİN NORMAL İNDİRME ---
    console.log("💾 Standart kullanıcı için normal indirme başlatılıyor...");
    saveCanvasAsImage(1); // Normal (1 katı) çözünürlükte indir
  }
}
// --- YENİ VE DOSYA ADINI DİNAMİK OLARAK AYARLAYAN FONKSİYON ---
function saveCanvasAsImage(scaleFactor) {
  const canvas = document.getElementById('coloringCanvas');
  const link = document.createElement('a');

  // Geçici, yüksek çözünürlüklü bir canvas oluştur
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  // Boyutları ölçek faktörüne göre ayarla
  tempCanvas.width = canvas.width * scaleFactor;
  tempCanvas.height = canvas.height * scaleFactor;

  // Yüksek çözünürlüklü canvas'a mevcut çizimi ölçekleyerek çiz
  tempCtx.imageSmoothingEnabled = true;
  tempCtx.imageSmoothingQuality = 'high';
  tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

  // <<< DEĞİŞİKLİK BURADA BAŞLIYOR >>>
  // Dosya adını ölçek faktörüne göre belirle
  const fileName = scaleFactor > 1
    ? 'magical-coloring-HD.png'  // Eğer ölçek 1'den büyükse (Premium)
    : 'magical-coloring.png';    // Aksi halde (Standart)

  link.download = fileName;
  // <<< DEĞİŞİKLİK BURADA BİTİYOR >>>

  link.href = tempCanvas.toDataURL('image/png');
  link.click();

  // Sadece Premium kullanıcıya "HD" mesajını göster
  if (scaleFactor > 1) {
    showPremiumSaveMessage();
  }
}

function showPremiumSaveMessage() {
  const msg = document.createElement('div');
  msg.className = 'hd-save-msg'; // Bu sınıfı CSS'te tanımlamıştık
  msg.textContent = '✨ HD image downloaded! ✨';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}


// --- SAVE BUTONUNU YENİ FONKSİYONA BAĞLAMA ---
// Bu kod, sayfa yüklendiğinde çalışarak butonu ayarlar.
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveBtn');
  if (saveButton) {
    saveButton.addEventListener('click', handleSaveClick);
  }
});
// --- DOWNLOAD & PLAY OFFLINE SİSTEMİ (NİHAİ VERSİYON) ---

// =======================================================
// DOWNLOAD & PLAY OFFLINE SİSTEMİ (PWA KURULUM TEKLİFİ İLE)
// =======================================================
function initiateOfflineDownload() {
  const isUserPremium = localStorage.getItem('isPremium') === 'true';

  if (!isUserPremium) {
    if (typeof showPremiumModal === 'function') {
      showPremiumModal();
    } else {
      alert('This is a Premium feature.');
    }
    return;
  }

  if (!('serviceWorker' in navigator)) {
    alert("Sorry, your browser doesn't support the offline feature.");
    return;
  }

  const downloadMsg = document.createElement('div');
  downloadMsg.className = 'download-progress-msg';
  downloadMsg.textContent = '📥 Downloading all game content for offline play...';
  document.body.appendChild(downloadMsg);

  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered for offline caching.');
      downloadMsg.textContent = '✅ Success! The game is downloaded.';

      // --- YENİ EKLENEN PWA KURULUM MANTIĞI BURADA BAŞLIYOR ---

      // Saklanmış bir kurulum teklifi var mı diye kontrol et
      if (deferredPrompt) {
        console.log('Saklanmış kurulum teklifi bulundu, kullanıcıya gösteriliyor...');
        // Saklanan teklifi kullanıcıya sun
        deferredPrompt.prompt();

        // Kullanıcının cevabını dinle
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          // Teklif sadece bir kere kullanılabilir, o yüzden sıfırla
          deferredPrompt = null;
        });
      } else {
        // Eğer bir teklif yakalanmadıysa (örneğin, uygulama zaten kuruluysa
        // veya tarayıcı desteklemiyorsa), kullanıcıya manuel yolu göster
        console.log('Kurulum teklifi bulunamadı, manuel yol gösteriliyor.');
        alert("✅ Download Complete!\n\n" +
          "To add the game to your Home Screen like an app:\n\n" +
          "1. Click the (⋮) menu button in your browser.\n" +
          "2. Go to 'Save and Share'.\n" +
          "3. Select 'Install App' or 'Create shortcut...'."
        );
      }

      // --- PWA KURULUM MANTIĞI BURADA BİTİYOR ---

      setTimeout(() => downloadMsg.remove(), 4000);
    })
    .catch(error => {
      console.error('Offline download failed:', error);
      downloadMsg.textContent = '❌ Sorry, there was an error downloading the game content.';
      setTimeout(() => downloadMsg.remove(), 4000);
    });
}
// Butonu fonksiyona bağla
document.addEventListener('DOMContentLoaded', () => {
  const downloadBtn = document.getElementById('downloadAppBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', initiateOfflineDownload);
  }
  // --- NAZİK İPUCU SİSTEMİ (DÜZELTİLMİŞ VERSİYON) ---
  const canvasForHint = document.getElementById('coloringCanvas');
  const scrollHintKey = 'hasSeenScrollHint'; // Tarayıcı hafızası için anahtar

  const showScrollHint = () => {
    // Eğer kullanıcı ipucunu daha önce görmüşse, olay dinleyiciyi kaldır ve çık.
    if (localStorage.getItem(scrollHintKey)) {
      canvasForHint.removeEventListener('touchstart', showScrollHint);
      return;
    }

    // İpucu kutusunu oluştur
    const hintBox = document.createElement('div');
    hintBox.id = 'scrollHint';
    hintBox.innerHTML = '✨ <strong>İpucu:</strong> Please use areas outside the canvas to scroll the page.';
    document.body.appendChild(hintBox);

    // 4 saniye sonra ipucunu yavaşça kaldır
    setTimeout(() => {
      hintBox.style.opacity = '0';
      // Solma animasyonu bittikten SONRA (600ms sonra) DOM'dan kaldır.
      setTimeout(() => {
        hintBox.remove();
      }, 600);
    }, 4000);

    // Kullanıcının ipucunu gördüğünü kaydet.
    localStorage.setItem(scrollHintKey, 'true');

    // Olay dinleyiciyi artık gereksiz olduğu için kaldır.
    canvasForHint.removeEventListener('touchstart', showScrollHint);
  };

  // Kullanıcı canvas'a İLK KEZ dokunduğunda ipucunu göster.
  canvasForHint.addEventListener('touchstart', showScrollHint, { once: true });
});
// ==================================================
// PREMIUM MODAL SİSTEMİ
// ==================================================

function showPremiumModal() {
  // Eğer modal zaten varsa, tekrar oluşturma
  if (document.getElementById('premiumModal')) return;

  const modalHTML = `
      <div id="premiumModal" class="premium-modal">
          <div class="premium-content">
              <span class="close-modal">×</span>
              <h2>⭐ Unlock the Full Magical Experience! ⭐</h2>
              
              <ul class="premium-features">
                  <li>🖼️ <strong>Magic Photos:</strong> Become a hero, princess, or astronaut!</li>
                  <li>💾 <strong>Download & Play Offline:</strong> The perfect travel companion!</li>
                  <li>⬆️ <strong>Upload Your Own Images:</strong> Color any drawing you want.</li>
                  <li>🎨 <strong>Unlock All 50+ Coloring Pages:</strong> An entire library of fun.</li>
                  <li>💾 <strong>Unlimited HD Saves:</strong> Save your art in stunning quality.</li>
                  <li>✨ <strong>Exclusive Magic Brushes:</strong> Dazzle with Glitter, Rainbow & Glow!</li>
                  <li>🖍️ <strong>Unique Creative Tools:</strong> Master your art with the new Marker & Pastel!</li>
              </ul>

              <!-- ========================================== -->
              <!--   YENİ VE DOĞRU FİYATLANDIRMA BÖLÜMÜ      -->
              <!-- ========================================== -->
              <div class="launch-pricing">
                  <p class="regular-price">Regular Price: <span class="crossed">$24.99</span></p>
                  <p class="sale-price">🚀 Launch Price: $14.99</p>
                  <p class="savings" style="color: #FF6B6B; font-weight: bold; font-size: 1em; margin-top: 5px;">
                      You Save $10 • Limited Time Offer!
                  </p>
              </div>

              <button class="buy-premium-btn">🎨 Get Premium Now</button>
          </div>
      </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('premiumModal');
  const closeBtn = modal.querySelector('.close-modal');
  const buyBtn = modal.querySelector('.buy-premium-btn');

  const closeModal = () => modal.remove();

  closeBtn.onclick = closeModal;

  // EN ÖNEMLİ DÜZELTME: Buton artık premium.html'e yönlendiriyor!
  buyBtn.onclick = () => {
    window.location.href = 'premium.html';
    closeModal();
  };

  // Dışarı tıklayınca kapatma
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}
// --- PWA KURULUM TEKLİFİNİ YAKALAMA ---
window.addEventListener('beforeinstallprompt', (e) => {
  // Tarayıcının teklifi otomatik olarak göstermesini engelle
  e.preventDefault();
  // Teklifi daha sonra kullanmak üzere sakla
  deferredPrompt = e;
  console.log('beforeinstallprompt olayı yakalandı ve teklif saklandı.');
});
// =======================================================
// MAGIC PHOTOS "AYNI DOSYAYI SEÇME" SORUNU İÇİN NİHAİ DÜZELTME
// =======================================================
// Bu kod, sayfa tamamen yüklendiğinde SADECE BİR KERE çalışır.
document.addEventListener('DOMContentLoaded', function () {
  // Magic Photos ve diğer yüklemeler tarafından kullanılan genel input elementini bul
  const fileInput = document.getElementById('globalFileInput');

  // Eğer bu element varsa...
  if (fileInput) {
    // ...üzerine bir 'change' (dosya seçildi) olayı dinleyicisi ekle.
    fileInput.addEventListener('click', function (event) {
      // Tıklanma eylemi gerçekleştiğinde, dosya seçilmeden hemen önce değeri sıfırla.
      // Bu, aynı dosyanın tekrar seçilmesi durumunda 'change' olayının tetiklenmesini sağlar.
      event.target.value = '';
      console.log('Dosya input hafızası sıfırlandı.');
    });
  }
});
// =======================================================
// SAYFA YÜKLENDİĞİNDE ÇALIŞACAK SON KONTROLLER (v5 - Final)
// Bu blok, hem Hediye Sistemini hem de Etsy Güvenliğini yönetir.
// =======================================================

// Önce Hediye Sistemi fonksiyonunu tanımlıyoruz.
function setupGiftingSystem() {
  const validGiftCodes = new Set([
    "MAGIC-GIFT-2025",
    "COLOR-FUN-123",
    "PREMIUM-KID-789",
    "BIRTHDAY-SPECIAL",
    "ETSYMAGIC2025",
    "IZNIK-BARIS"
  ]);

  const redeemButton = document.getElementById('redeemGiftBtn');
  if (!redeemButton) {
    console.error("Hediye kodu butonu bulunamadı!");
    return;
  }

  redeemButton.addEventListener('click', () => {
    const userCode = prompt("Please enter your gift code:", "");
    if (!userCode || userCode.trim() === "") return;

    const formattedUserCode = userCode.trim().toUpperCase();

    if (validGiftCodes.has(formattedUserCode)) {
      let usedCodes = JSON.parse(localStorage.getItem('usedGiftCodes')) || [];
      if (usedCodes.includes(formattedUserCode)) {
        alert("This gift code has already been used on this device. Premium features should already be active.");
        return;
      }

      alert("Congratulations! 🎉 Premium features have been activated. The page will now reload.");
      localStorage.setItem('isPremium', 'true');

      usedCodes.push(formattedUserCode);
      localStorage.setItem('usedGiftCodes', JSON.stringify(usedCodes));

      location.reload();
    } else {
      alert("Sorry, that gift code is not valid. Please check and try again.");
    }
  });
}

// Şimdi, sayfa tamamen yüklendiğinde çalışacak TEK BİR ana olay dinleyici oluşturuyoruz.
document.addEventListener('DOMContentLoaded', () => {

  // GÖREV 1: Hediye sistemini çalıştır.
  setupGiftingSystem();
  console.log('Hediye kodu sistemi başarıyla kuruldu.');

  // GÖREV 2: Etsy güvenlik kontrolünü yap.
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('source') === 'etsy') {
    console.log("Etsy ziyaretçisi algılandı. Gizleme sınıfı (.etsy-hidden) eklenecek.");

    // Statik elementleri gizle
    const premiumSection = document.getElementById('premium-benefits-section');
    if (premiumSection) {
      premiumSection.classList.add('etsy-hidden');
      console.log('"Why Go Premium" bölümüne gizleme sınıfı eklendi.');
    }
    const newsletterTrigger = document.getElementById('newsletterTrigger');
    if (newsletterTrigger) {
      newsletterTrigger.classList.add('etsy-hidden');
      console.log('Bülten aboneliği butonuna gizleme sınıfı eklendi.');
    }

    // Dinamik (sonradan oluşan) Premium Penceresini izle ve gizle
    const observer = new MutationObserver(() => {
      const premiumModal = document.getElementById('premiumModal');
      if (premiumModal) {
        const premiumBuyButton = premiumModal.querySelector('.buy-premium-btn');
        const pricingSection = premiumModal.querySelector('.launch-pricing');

        if (premiumBuyButton) premiumBuyButton.classList.add('etsy-hidden');
        if (pricingSection) pricingSection.classList.add('etsy-hidden');
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
});
// =======================================================
// ADIM 2: GELİŞMİŞ ORGANİK ANİMASYON MOTORU
// =======================================================

function showAnimationSelectionModal() {
  const oldModal = document.getElementById('animationModal');
  if (oldModal) oldModal.remove();

  const modalHTML = `
    <div id="animationModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); display: flex; justify-content: center; align-items: center; z-index: 10000;">
      <div style="background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%); padding: 25px; border-radius: 25px; max-width: 450px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; border: 4px solid white;">
        <h2 style="color: #333; margin-bottom: 20px; font-family: 'Poppins', sans-serif;">✨ Make it Alive! ✨</h2>
        <p style="color: #555; margin-bottom: 20px; font-size: 14px;">Choose how your drawing moves:</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
          <button onclick="startOrganicAnimation('breathe')" class="magic-anim-btn">🫁 Breathe</button>
          <button onclick="startOrganicAnimation('float')" class="magic-anim-btn">☁️ Float</button>
          <button onclick="startOrganicAnimation('wave')" class="magic-anim-btn">🌊 Wave</button>
          <button onclick="startOrganicAnimation('jelly')" class="magic-anim-btn">🍮 Jelly</button>
          
          <!-- GÜNCELLENEN BUTON BURADA -->
          <!-- Canlı Gökkuşağı Gradyanı: Kırmızı -> Sarı -> Mavi -> Mor -->
          <button onclick="startOrganicAnimation('color')" class="magic-anim-btn" style="
              grid-column: span 2; 
              background: linear-gradient(90deg, #FF6B6B, #FECA57, #48DBFB, #FF9FF3); 
              color: white; 
              text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
              font-size: 19px;
              border: 2px solid white;
          ">🌈 Rainbow Party</button>
        </div>
        
        <button onclick="document.getElementById('animationModal').remove()" style="width: 100%; padding: 12px; background: white; color: #FF69B4; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px;">Cancel</button>
      </div>
    </div>
    <style>
        .magic-anim-btn { padding: 15px; border: none; border-radius: 15px; background: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; transition: 0.2s; font-weight: bold; color: #444; }
        .magic-anim-btn:hover { background: white; transform: scale(1.05); box-shadow: 0 5px 15px rgba(255,105,180,0.3); }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function startOrganicAnimation(type) {
  // Modalı kapat
  const modal = document.getElementById('animationModal');
  if (modal) modal.remove();

  // Buton yazısını değiştir
  const btn = document.getElementById('animateBtn');
  if (btn) btn.innerHTML = '⏹ Stop Animation';

  const canvas = document.getElementById('coloringCanvas');
  const ctx = canvas.getContext('2d');

  // O anki çizimin kopyasını al (Performans için)
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);

  let time = 0;
  let frameCount = 0; // Renk animasyonu için sayaç

  function loop() {
    time += 0.05;
    frameCount++;

    // Ekranı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- YENİ EKLENEN: ESKİ RENK ANİMASYONU ---
    if (type === 'color') {
      // 1. Orijinal resmi çiz
      ctx.drawImage(tempCanvas, 0, 0);

      // 2. Renk Değiştiren Katman (Hue Rotate)
      // Senin eski kodundaki mantık: hue = frame * 3
      const hue = (frameCount * 2) % 360;

      ctx.globalCompositeOperation = 'hue'; // Renk tonunu değiştir
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Parıltı Efekti (Sparkles)
      ctx.globalCompositeOperation = 'lighter'; // Parlaklık modu

      // Her karede 10 tane rastgele yıldız at
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 80%)`;
        ctx.fill();
      }

      // Modu normale döndür (Çok önemli, yoksa sonraki çizimler bozulur)
      ctx.globalCompositeOperation = 'source-over';
    }

    // --- DİĞER ORGANİK ANİMASYONLAR ---
    else {
      // Diğerlerinde composite moda gerek yok, direkt çiziyoruz
      ctx.save();

      if (type === 'breathe') {
        const scale = 1 + Math.sin(time) * 0.03;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(tempCanvas, 0, 0);
      }
      else if (type === 'float') {
        const yOffset = Math.sin(time) * 15;
        const rotate = Math.sin(time * 0.5) * 0.02;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotate);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(tempCanvas, 0, yOffset);
      }
      else if (type === 'wave') {
        // Wave özel olduğu için save/restore dışında döngüyle çizilir
        for (let y = 0; y < canvas.height; y += 2) {
          const xOffset = Math.sin(y * 0.02 + time) * 5;
          ctx.drawImage(tempCanvas, 0, y, canvas.width, 2, xOffset, y, canvas.width, 2);
        }
      }
      else if (type === 'jelly') {
        const scaleX = 1 + Math.sin(time * 2) * 0.05;
        const scaleY = 1 + Math.cos(time * 2) * 0.05;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scaleX, scaleY);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(tempCanvas, 0, 0);
      }

      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  loop();
}
// ==========================================
// YENİ TOOLBAR & DROPDOWN YÖNETİMİ
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
  // Tüm dropdown toggle butonlarını bul
  const dropdowns = document.querySelectorAll('.custom-dropdown');

  dropdowns.forEach(dropdown => {
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Tıklamanın dışarı yayılmasını engelle

      // Diğer açık olanları kapat
      dropdowns.forEach(other => {
        if (other !== dropdown) other.classList.remove('active');
      });

      // Tıklananı aç/kapa
      dropdown.classList.toggle('active');
    });
  });

  // Sayfanın herhangi bir yerine tıklayınca menüleri kapat
  document.addEventListener('click', () => {
    dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
  });
});

// Dropdown içinden bir araç seçildiğinde menüyü kapat ve ana butona yansıt (Opsiyonel)
function selectDropdownTool(btn) {
  // Burada setTool fonksiyonunu zaten onclick ile çağırıyoruz.
  // Sadece menüyü kapatmak yeterli.
  // (Document click listener bunu zaten yapacak ama görsel geri bildirim için):
  const dropdown = btn.closest('.custom-dropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
    // İstersen ana butonun metnini seçilen araçla değiştirebilirsin:
    // dropdown.querySelector('.dropdown-toggle').innerHTML = btn.innerHTML + ' ▼';
  }
}
// ==========================================
// SCRATCH CITY (KAZI KAZAN) OYUN MOTORU
// ==========================================

// 1. ŞEHİR VERİTABANI (Premium Ayarları Eklendi)
const scratchCities = {
  'paris': {
    name: 'Magical Paris',
    back: 'assets/scratch/paris_back.jpg',
    front: 'assets/scratch/paris_front.jpg',
    isFree: true // ✨ Sadece bu ÜCRETSİZ
  },
  'istanbul': {
    name: 'Golden Istanbul',
    back: 'assets/scratch/istanbul_galata_back.jpg',
    front: 'assets/scratch/istanbul_galata_front.jpg',
    isFree: false // 🔒 KİLİTLİ
  },
  'ny': {
    name: 'New York Night',
    back: 'assets/scratch/ny_back.jpg',
    front: 'assets/scratch/ny_front.jpg',
    isFree: false // 🔒 KİLİTLİ
  },
  'rome': {
    name: 'Eternal Rome',
    back: 'assets/scratch/rome_back.jpg',
    front: 'assets/scratch/rome_front.jpg',
    isFree: false // 🔒 KİLİTLİ
  },
  'venice': {
    name: 'Venice Dream',
    back: 'assets/scratch/venice_back.jpg',
    front: 'assets/scratch/venice_front.jpg',
    isFree: false // 🔒 KİLİTLİ
  },
  'tokyo': {
    name: 'Neon Tokyo',
    back: 'assets/scratch/tokyo_back.jpg',
    front: 'assets/scratch/tokyo_front.jpg',
    isFree: false // 🔒 KİLİTLİ
  }
};



let currentScratchGame = null;

// --- ARAYÜZ FONKSİYONLARI ---

function openScratchGallery() {
  document.getElementById('scratchModal').style.display = 'flex';
  document.getElementById('scratchGalleryView').style.display = 'block';
  document.getElementById('scratchGameView').style.display = 'none';
}

function closeScratchModal() {
  document.getElementById('scratchModal').style.display = 'none';
  if (currentScratchGame) {
    document.getElementById('scratch-canvas-container').innerHTML = '';
    currentScratchGame = null;
  }
}

// 3. Oyunu Başlat (KİLİT KONTROLÜ EKLENDİ)
function startScratchGame(cityKey) {
  const cityData = scratchCities[cityKey];
  if (!cityData) return;

  // Premium Kontrolü
  const isPremium = localStorage.getItem('isPremium') === 'true';

  // Eğer şehir ücretsiz DEĞİLSE ve kullanıcı Premium DEĞİLSE engelle
  if (!cityData.isFree && !isPremium) {
    if (typeof showPremiumModal === 'function') {
      showPremiumModal(); // Satın alma penceresini aç
    } else {
      alert("This city is locked! Upgrade to Premium to play. ⭐");
    }
    return; // Oyunu başlatma, buradan çık
  }

  // --- Buradan aşağısı standart başlatma ---
  document.getElementById('scratchGalleryView').style.display = 'none';
  document.getElementById('scratchGameView').style.display = 'flex';
  document.getElementById('scratchGameView').style.flexDirection = 'column';
  document.getElementById('scratchGameView').style.height = '100%';

  document.getElementById('cityNameDisplay').textContent = cityData.name;
  document.getElementById('scratchHintText').style.display = 'block';

  const container = document.getElementById('scratch-canvas-container');
  container.innerHTML = '';
  currentScratchGame = new ScratchEngine(container, cityData.back, cityData.front);
}
// 4. Galeriye Dön
function backToGallery() {
  document.getElementById('scratchGameView').style.display = 'none';
  document.getElementById('scratchGalleryView').style.display = 'block';

  // Oyunu temizle ki arka planda çalışmasın
  const container = document.getElementById('scratch-canvas-container');
  if (container) container.innerHTML = '';
  currentScratchGame = null;
}
// 5. İNDİRME FONKSİYONU (YENİ)
function downloadRevealedArt() {
  if (!currentScratchGame) return;

  // Alttaki gizli (renkli) resmin linkini al
  const link = document.createElement('a');
  link.href = currentScratchGame.backImg.src;
  link.download = `magical-scratch-art.jpg`; // İndirilen dosya adı
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// SCRATCH MOTORU SINIFI (HİZALAMA DÜZELTİLDİ)
// ==========================================
class ScratchEngine {
  constructor(container, backSrc, frontSrc) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    // --- ARKA PLAN RESMİ (GİZLİ RESİM) ---
    this.backImg = new Image();
    this.backImg.src = backSrc;

    // JS ile stil vermek yerine CSS'e güveniyoruz ama
    // kapsayıcıya tam oturması için %100 diyoruz.
    this.backImg.style.width = '100%';
    this.backImg.style.height = '100%';

    // Konteyner zaten 4:3 olduğu için 'fill' resmi bozmadan dolduracaktır.
    this.backImg.style.objectFit = 'fill';

    this.backImg.style.position = 'absolute';
    this.backImg.style.top = '0';
    this.backImg.style.left = '0';
    // Sürüklemeyi engelle
    this.backImg.draggable = false;
    this.backImg.onmousedown = (e) => e.preventDefault();

    this.container.appendChild(this.backImg);

    // --- CANVAS (KAZINACAK KATMAN) ---
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.touchAction = 'none'; // Mobilde sayfa kaymasını engeller

    this.container.appendChild(this.canvas);

    this.frontImg = new Image();
    this.frontImg.crossOrigin = "Anonymous";
    this.frontImg.src = frontSrc;

    this.frontImg.onload = () => this.initCanvas(true);
    this.frontImg.onerror = () => this.initCanvas(false);
  }

  initCanvas(imageLoaded) {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;

    if (imageLoaded) {
      // Canvas zaten resmi 'fill' mantığıyla (stretch) çizer.
      // Arkadaki resmi de 'fill' yaptığımız için şimdi hizalanacaklar.
      this.ctx.drawImage(this.frontImg, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.ctx.globalCompositeOperation = 'destination-out';
    this.addEvents();
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Canvas boyutlandırmasından kaynaklı oran hatasını önlemek için:
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  addEvents() {
    const start = (e) => {
      this.isDrawing = true;
      const hint = document.getElementById('scratchHintText');
      if (hint) hint.style.display = 'none';

      const pos = this.getPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
      this.scratchLine(pos.x, pos.y);
    };

    const move = (e) => {
      if (!this.isDrawing) return;
      e.preventDefault();
      const pos = this.getPos(e);
      this.scratchLine(pos.x, pos.y);
      this.lastX = pos.x;
      this.lastY = pos.y;
    };

    const end = () => { this.isDrawing = false; };

    this.canvas.addEventListener('mousedown', start);
    this.canvas.addEventListener('mousemove', move);
    this.canvas.addEventListener('mouseup', end);
    this.canvas.addEventListener('mouseleave', end);

    this.canvas.addEventListener('touchstart', start, { passive: false });
    this.canvas.addEventListener('touchmove', move, { passive: false });
    this.canvas.addEventListener('touchend', end);
  }

  scratchLine(x, y) {
    // Mavi boyama sorununu önlemek için ayarları her seferinde zorluyoruz
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'transparent';
    this.ctx.fillStyle = '#000000';

    const dist = Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2));
    const angle = Math.atan2(y - this.lastY, x - this.lastX);

    const baseSize = 8;
    const roughness = 2;

    for (let i = 0; i < dist; i += 3) {
      const drawX = this.lastX + (Math.cos(angle) * i);
      const drawY = this.lastY + (Math.sin(angle) * i);
      const currentSize = baseSize + (Math.random() * roughness);

      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, currentSize, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.closePath();
    }

    this.ctx.restore();
  }
}
