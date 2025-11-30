// Telegram configuration
const TELEGRAM_BOT_TOKEN = '8511281654:AAFc-7eif0tGwB9bFvp_lrnibLYNYdQgvmw';
const TELEGRAM_CHAT_ID = '846572018';

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeNavigation();
    initializeFormHandler();
});

// Gallery functionality (from original template)
function initializeGallery() {
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

    // Start autoplay
    startAutoPlay();
    updateParallax();

    // Disable parallax on mobile
    if (window.innerWidth <= 768) {
        slider.removeEventListener("mousemove", updateParallax);
    }
}

// Navigation functionality
function initializeNavigation() {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    // Mobile menu toggle
    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        mainNav.classList.toggle("active");
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove("active");
                mainNav.classList.remove("active");
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form handling
function initializeFormHandler() {
    const trainingForm = document.getElementById('trainingForm');
    
    trainingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            service: formData.get('service'),
            message: formData.get('message') || 'Не указано'
        };
        
        // Send to Telegram
        const success = await sendToTelegram(data);
        
        if (success) {
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            trainingForm.reset();
        } else {
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
        }
    });
}

// Telegram integration
async function sendToTelegram(data) {
    const message = `
🎯 Новая заявка на тренинг:

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
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return false;
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function openOverlay(type) {
    const overlay = document.getElementById(type + 'Overlay');
    if (overlay) {
        overlay.classList.add('active');
        clearInterval(autoPlayInterval);
    }
}

function closeOverlay(type) {
    const overlay = document.getElementById(type + 'Overlay');
    if (overlay) {
        overlay.classList.remove('active');
        if (!isPausedByUser) startAutoPlay();
    }
}

// Add the rest of the original JavaScript functionality from the template below
// ... (copy all the original JavaScript from the template) ...
