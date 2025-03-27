
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
function saveDrawingState() {
  const canvas = document.getElementById('coloringCanvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!canvas || !ctx) {
    console.error("Canvas or context not available");
    return;
  }

  try {
    // Capture the current state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // If we're in the middle of the history and making a new change,
    // remove all future states
    if (currentStep < drawingHistory.length - 1) {
      drawingHistory = drawingHistory.slice(0, currentStep + 1);
    }

    // Add the new state to history
    currentStep++;
    drawingHistory.push(imageData);

    console.log('Saving state:', currentStep, 'History length:', drawingHistory.length);

    // Update undo button state
    updateUndoButtonState();
  } catch (error) {
    console.error("Error saving drawing state:", error);
  }
}

function imageDataEqual(data1, data2) {
  if (data1.width !== data2.width || data1.height !== data2.height) {
    return false;
  }
  for (let i = 0; i < data1.data.length; i++) {
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
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
  const data = imageData.data;
  const stack = [[startX, startY]];
  const baseColor = getPixelColor(imageData, startX, startY);
  const tolerance = 50;
  const visited = new Set();

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
  ctx.globalAlpha = 1.0;
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

  // Dış kenarlar için hafif şeffaf katmanlar ekleyelim - fırça efekti yaratmak için
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();

    // Hafif rastgelelik ekleyelim (tipik fırça davranışı)
    const offsetX1 = lastX + (Math.random() * 2 - 1);
    const offsetY1 = lastY + (Math.random() * 2 - 1);
    const offsetX2 = x + (Math.random() * 2 - 1);
    const offsetY2 = y + (Math.random() * 2 - 1);

    ctx.moveTo(offsetX1, offsetY1);
    ctx.lineTo(offsetX2, offsetY2);

    // Her katman için azalan opaklık
    const opacity = 0.3 - (i * 0.1);
    ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
    ctx.lineWidth = brushSize * (1.2 + i * 0.3); // Dış katmanlar daha geniş
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

window.addEventListener('load', () => {
  if (window.location.protocol === 'file:') {
    console.log('Running locally - WebSocket not required');
  }

  // Canvas başlatma ve event listener'ları
  initializeCanvas();
  setupEventListeners();

  // Görsel yükleme
  preloadImages();
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.style.display = 'inline-block';
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
          installBtn.style.display = 'none';
        }
        deferredPrompt = null;
      }
    });
  }
});
function registerNotifications() {
  const notification = new Notification('Welcome to Magical Coloring Game!', {
    body: 'Ready to start your creative journey?',
    icon: '/icons/icon-192x192.png'
  });
}


// Notifications kodu
try {
  const notifyBtn = document.getElementById('notifyBtn');
  notifyBtn.addEventListener('click', () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test notification',
          icon: '/icons/icon-192x192.png'
        });
        notifyBtn.textContent = '🔔 Notifications Enabled';
      } else {
        Notification.requestPermission()
          .then(result => {
            if (result === 'granted') {
              new Notification('Test Notification', {
                body: 'This is a test notification',
                icon: '/icons/icon-192x192.png'
              });
              notifyBtn.textContent = '🔔 Notifications Enabled';
            }
          });
      }
    }
  });
} catch (error) {
  console.log('Initialization in progress...');
}

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