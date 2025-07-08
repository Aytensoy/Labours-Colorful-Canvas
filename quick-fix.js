// QUICK-FIX.JS - Acil düzeltme dosyası
// Bu dosyayı script.js'den ÖNCE çağırın: <script src="quick-fix.js"></script>

console.log('🚀 Quick Fix başlatılıyor...');

// 1. MODAL KAPANMA SORUNU ÇÖZÜMÜ
window.closePremiumModal = function () {
    const modals = document.querySelectorAll('#premiumModal, .premium-modal');
    modals.forEach(modal => {
        if (modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    });
    document.body.style.overflow = 'auto';
    console.log('✅ Premium modal kapatıldı');
};

// Escape tuşu ile kapatma
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closePremiumModal();
        closeNewsletterModal();
    }
});

// 2. NEWSLETTER ÇÖZÜMÜ
window.showNewsletterModal = function () {
    let modal = document.getElementById('newsletterModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'newsletterModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; align-items: center;
            justify-content: center; z-index: 10000;
        `;
        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; 
                        padding: 40px; border-radius: 20px; max-width: 400px; width: 90%; 
                        text-align: center; position: relative;">
                <span onclick="closeNewsletterModal()" style="position: absolute; top: 15px; 
                      right: 20px; font-size: 30px; cursor: pointer; color: white;">&times;</span>
                <h2 style="color: #FFD700; margin-bottom: 15px;">🎨 Special Offers & Updates!</h2>
                <p>Get exclusive discounts and free coloring pages!</p>
                <input type="email" id="quickEmail" placeholder="Your Email" 
                       style="width: 100%; padding: 12px; margin: 15px 0; border: none; 
                              border-radius: 10px; font-size: 1em;">
                <button onclick="quickSubscribe()" style="background: linear-gradient(45deg, #FFD700, #FFA500); 
                        color: #2c3e50; border: none; padding: 15px 30px; border-radius: 10px; 
                        font-size: 1.1em; font-weight: bold; cursor: pointer; width: 100%;">
                    ✨ Subscribe
                </button>
                <p style="font-size: 0.9em; opacity: 0.8; margin-top: 15px;">We'll only send you the good stuff! 🌟</p>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeNewsletterModal = function () {
    const modal = document.getElementById('newsletterModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
};

window.quickSubscribe = function () {
    const email = document.getElementById('quickEmail').value;
    if (email && email.includes('@')) {
        localStorage.setItem('newsletterSubscribed', 'true');
        closeNewsletterModal();

        // Success message
        const success = document.createElement('div');
        success.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #4CAF50; color: white; padding: 20px 40px; border-radius: 10px;
            font-size: 1.2em; z-index: 10001;
        `;
        success.textContent = '✅ Successfully subscribed!';
        document.body.appendChild(success);

        setTimeout(() => success.remove(), 3000);

        // Hide trigger
        const trigger = document.getElementById('newsletterTrigger');
        if (trigger) trigger.style.display = 'none';
    } else {
        alert('Please enter a valid email address!');
    }
};

// 3. PERFORMANS İYİLEŞTİRMESİ
document.addEventListener('DOMContentLoaded', function () {
    // Lazy load thumbnails
    setTimeout(() => {
        const thumbnails = document.querySelectorAll('.page-thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index > 5) {
                const originalSrc = thumb.src;
                thumb.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="100"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Loading...</text></svg>';

                // Load on scroll into view
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.src = originalSrc;
                            observer.unobserve(entry.target);
                        }
                    });
                });
                observer.observe(thumb);
            }
        });
    }, 1000);

    // Optimize category switching
    const categoryBtns = document.querySelectorAll('.tab-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Hide all
            document.querySelectorAll('.page-thumbnails').forEach(container => {
                container.style.display = 'none';
            });

            // Show selected
            const category = this.getAttribute('data-category');
            const target = document.querySelector(`.page-thumbnails.${category}`);
            if (target) {
                target.style.display = 'grid';
            }
        });
    });
});

// 4. EMAILJS YEDEKLEMESİ
window.addEventListener('load', function () {
    if (typeof emailjs === 'undefined') {
        console.log('📧 EmailJS yükleniyor...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            emailjs.init('eJH9fimtojrTRRsA2');
            console.log('✅ EmailJS yüklendi');
        };
        document.head.appendChild(script);
    }
});

// 5. MODAL DİŞI TIKLAMA İLE KAPATMA
document.addEventListener('click', function (e) {
    const premiumModal = document.getElementById('premiumModal');
    const newsletterModal = document.getElementById('newsletterModal');

    if (premiumModal && e.target === premiumModal) {
        closePremiumModal();
    }

    if (newsletterModal && e.target === newsletterModal) {
        closeNewsletterModal();
    }
});

// 6. CANVAS OPTİMİZASYONU
window.addEventListener('load', function () {
    const canvas = document.getElementById('coloringCanvas');
    if (canvas) {
        canvas.style.imageRendering = 'pixelated';
        canvas.style.transform = 'translate3d(0, 0, 0)';
    }
});

console.log('✅ Quick Fix tamamlandı!');