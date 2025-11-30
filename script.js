// Конфигурация Telegram
const TELEGRAM_BOT_TOKEN = '8511281654:AAFc-7eif0tGwB9bFvp_lrnibLYNYdQgvmw';
const TELEGRAM_CHAT_ID = '846572018';

// Оригинальный код Living Parallax с добавлением Telegram
const slider = document.getElementById("slider"),
      slides = document.querySelectorAll(".slide"),
      dots = document.querySelectorAll(".dot"),
      prevBtn = document.querySelector(".nav-arrow.prev"),
      nextBtn = document.querySelector(".nav-arrow.next"),
      menuToggle = document.getElementById("menuToggle"),
      mainNav = document.getElementById("mainNav");

let autoPlayInterval, progressInterval, progressStart,
    currentSlide = 0, isAnimating = false,
    mouseX = 0, mouseY = 0, isPausedByUser = false,
    slideDuration = 5000;

// Parallax effect
function updateParallax() {
    const backgroundLayer = slides[currentSlide].querySelector(".background-layer"),
          shapes = document.querySelectorAll(".parallax-shape");
    
    if (backgroundLayer) {
        backgroundLayer.style.transform = `translate(${20 * mouseX}px, ${20 * mouseY}px)`;
    }
    
    shapes.forEach((shape, index) => {
        if (shape.style.transform && shape.style.transform.includes("rotate")) return;
        const multiplier = 15 * (index + 1);
        shape.style.transform = `translate(${mouseX * multiplier}px, ${mouseY * multiplier}px)`;
    });
}

function getTransitionDuration() {
    return currentDuration <= 3 ? 300 : 700;
}

function showSlide(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    const duration = getTransitionDuration();
    document.documentElement.style.setProperty("--slide-transition-duration", duration + "ms");
    
    slides.forEach(slide => {
        slide.classList.remove("active", "prev");
    });
    dots.forEach(dot => dot.classList.remove("active"));
    
    if (currentSlide !== index) {
        slides[currentSlide].classList.add("prev");
    }
    
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
    
    updateParallax();
    setTimeout(() => { isAnimating = false; }, duration);
}

function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startAutoPlay() {
    clearInterval(autoPlayInterval);
    stopProgressBar();
    
    if (!isPausedByUser) {
        startProgressBar();
        autoPlayInterval = setInterval(() => {
            nextSlide();
            stopProgressBar();
            startProgressBar();
        }, slideDuration);
    }
}

function startProgressBar() {
    const progressBar = document.getElementById("progressBar");
    
    function updateProgress() {
        const elapsed = Date.now() - progressStart;
        const progress = Math.min(elapsed / slideDuration, 1);
        const width = 100 * progress;
        progressBar.style.width = width + "%";
        
        if (progress >= 1) {
            progressBar.style.width = "100%";
        }
    }
    
    if (progressBar) {
        progressBar.style.width = "0%";
        progressStart = Date.now();
        clearInterval(progressInterval);
        progressInterval = setInterval(updateProgress, 50);
        updateProgress();
    }
}

function stopProgressBar() {
    clearInterval(progressInterval);
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        progressBar.style.width = "0%";
    }
}

// Mouse move parallax
slider.addEventListener("mousemove", (e) => {
    const rect = slider.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    updateParallax();
});

// Navigation events
nextBtn.addEventListener("click", () => {
    clearInterval(autoPlayInterval);
    nextSlide();
    if (!isPausedByUser) startAutoPlay();
});

prevBtn.addEventListener("click", () => {
    clearInterval(autoPlayInterval);
    prevSlide();
    if (!isPausedByUser) startAutoPlay();
});

dots.forEach(dot => {
    dot.addEventListener("click", () => {
        clearInterval(autoPlayInterval);
        showSlide(parseInt(dot.getAttribute("data-slide")));
        if (!isPausedByUser) startAutoPlay();
    });
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        clearInterval(autoPlayInterval);
        prevSlide();
        if (!isPausedByUser) startAutoPlay();
    } else if (e.key === "ArrowRight") {
        clearInterval(autoPlayInterval);
        nextSlide();
        if (!isPausedByUser) startAutoPlay();
    } else if (e.key.toLowerCase() === "h") {
        uiToggleBtn.click();
    }
});

// Mobile menu
menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    mainNav.classList.toggle("active");
});

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove("active");
            mainNav.classList.remove("active");
        }
    });
});

// Start autoplay
startAutoPlay();
updateParallax();

// Disable parallax on mobile
if (window.innerWidth <= 768) {
    slider.removeEventListener("mousemove", updateParallax);
}

// Shape interactions
document.querySelectorAll(".parallax-shape").forEach(shape => {
    shape.addEventListener("click", function(e) {
        e.stopPropagation();
        moveShapeToRandomPosition(this);
    });
});

function moveShapeToRandomPosition(shape) {
    const top = 60 * Math.random() + 10;
    const left = 80 * Math.random() + 5;
    shape.style.top = top + "%";
    shape.style.left = left + "%";
    shape.style.bottom = "auto";
    shape.style.right = "auto";
    
    const rotation = 360 * Math.random();
    shape.style.transform = `rotate(${rotation}deg)`;
    setTimeout(() => {
        shape.style.transform = "";
    }, 800);
}

function autoMoveShapes() {
    document.querySelectorAll(".parallax-shape").forEach((shape, index) => {
        setTimeout(() => {
            moveShapeToRandomPosition(shape);
        }, 2000 * index);
    });
}

setInterval(autoMoveShapes, 15000);
setTimeout(autoMoveShapes, 5000);

// Fullscreen functionality
const fullscreenBtn = document.getElementById("fullscreenBtn");
const expandIcon = '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
const collapseIcon = '<svg viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';

fullscreenBtn.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
        menuToggle.classList.remove("active");
        mainNav.classList.remove("active");
    }
    
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen).call(document);
        fullscreenBtn.classList.remove("active");
        fullscreenBtn.innerHTML = expandIcon;
    } else {
        const element = document.documentElement;
        (element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen || element.msRequestFullscreen).call(element);
        fullscreenBtn.classList.add("active");
        fullscreenBtn.innerHTML = collapseIcon;
    }
});

// Play/Pause functionality
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = '<svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';

playPauseBtn.innerHTML = pauseIcon;
playPauseBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (isPausedByUser) {
        isPausedByUser = false;
        startAutoPlay();
        playPauseBtn.innerHTML = pauseIcon;
        playPauseBtn.classList.remove("paused");
    } else {
        isPausedByUser = true;
        clearInterval(autoPlayInterval);
        stopProgressBar();
        playPauseBtn.innerHTML = playIcon;
        playPauseBtn.classList.add("paused");
    }
});

// Duration controls
const decreaseBtn = document.getElementById("decreaseDuration");
const increaseBtn = document.getElementById("increaseDuration");
const durationDisplay = document.getElementById("durationDisplay");
let currentDuration = 5;

function updateDuration(time) {
    currentDuration = Math.max(1, Math.min(9, time));
    slideDuration = 1000 * currentDuration;
    durationDisplay.innerHTML = currentDuration + "<span>s</span>";
    const duration = getTransitionDuration();
    document.documentElement.style.setProperty("--slide-transition-duration", duration + "ms");
    if (!isPausedByUser) startAutoPlay();
}

document.documentElement.style.setProperty("--slide-transition-duration", "700ms");

decreaseBtn.addEventListener("click", e => {
    e.stopPropagation();
    updateDuration(currentDuration - 1);
});

increaseBtn.addEventListener("click", e => {
    e.stopPropagation();
    updateDuration(currentDuration + 1);
});

// UI Toggle functionality
let uiVisible = true;
const uiToggleBtn = document.getElementById("uiToggleBtn");
const eyeIcon = document.getElementById("eyeIcon");
uiToggleBtn.title = "Hide UI Elements (Press H)";

const eyeOpenPath = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
const eyeClosedPath = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';

uiToggleBtn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    const uiElements = document.querySelectorAll(".ui-element");
    
    if (uiVisible) {
        uiElements.forEach(element => element.classList.add("hidden"));
        uiVisible = false;
        uiToggleBtn.classList.add("ui-hidden");
        eyeIcon.innerHTML = eyeClosedPath;
        uiToggleBtn.title = "Show UI Elements (Press H)";
    } else {
        uiElements.forEach(element => element.classList.remove("hidden"));
        uiVisible = true;
        uiToggleBtn.classList.remove("ui-hidden");
        eyeIcon.innerHTML = eyeOpenPath;
        uiToggleBtn.title = "Hide UI Elements (Press H)";
    }
});

// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Telegram form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('consultationForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message') || 'Не указано'
            };
            
            // Валидация
            if (!data.name || !data.phone || !data.email || !data.service) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Показываем индикатор загрузки
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            try {
                const success = await sendToTelegram(data);
                
                if (success) {
                    alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                    form.reset();
                } else {
                    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
                }
            } catch (error) {
                alert('Ошибка сети. Пожалуйста, проверьте соединение и попробуйте еще раз.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Отправка в Telegram
async function sendToTelegram(data) {
    const message = `
🎯 Новая заявка на консультацию

👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
📧 Email: ${data.email}
🎭 Услуга: ${data.service}
💬 Сообщение: ${data.message}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
    `.trim();

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        });

        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}
