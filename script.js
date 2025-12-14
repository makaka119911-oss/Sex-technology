// ===== ПРЕЛОАДЕР =====
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.cinematic-preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                preloader.remove();
            }, 500);
        }, 1500);
    }
});

// ===== ПРОВЕРКА ВОЗРАСТА =====
function initAgeVerification() {
    const ageVerification = document.getElementById('ageVerification');
    const ageYesBtn = document.getElementById('ageYes');
    const ageNoBtn = document.getElementById('ageNo');
    
    const ageConfirmed = localStorage.getItem('ageConfirmed');
    
    if (!ageConfirmed) {
        setTimeout(() => {
            if (ageVerification) {
                ageVerification.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }, 1500);
    }
    
    if (ageYesBtn) {
        ageYesBtn.addEventListener('click', () => {
            localStorage.setItem('ageConfirmed', 'true');
            if (ageVerification) {
                ageVerification.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    if (ageNoBtn) {
        ageNoBtn.addEventListener('click', () => {
            alert('Доступ запрещён. Сайт предназначен для лиц старше 18 лет.');
            window.location.href = 'about:blank';
        });
    }
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!burgerMenu || !navMenu) return;
    
    burgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        
        // Обновляем ARIA атрибуты
        const isExpanded = burgerMenu.classList.contains('active');
        burgerMenu.setAttribute('aria-expanded', isExpanded);
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            burgerMenu.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            burgerMenu.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            burgerMenu.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== ХЕДЕР ПРИ СКРОЛЛЕ =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ===== КИНЕМАТОГРАФИЧЕСКИЙ СЛАЙДЕР ГЕРОЯ =====
class CinematicHeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.progressBar = document.querySelector('.progress-bar');
        this.prevBtn = document.querySelector('.slider-prev');
        this.nextBtn = document.querySelector('.slider-next');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 7000;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchThreshold = 50;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.showSlide(this.currentSlide);
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.startAutoPlay();
        
        this.slides.forEach(slide => {
            slide.addEventListener('mouseenter', () => this.stopAutoPlay());
            slide.addEventListener('mouseleave', () => this.startAutoPlay());
            
            slide.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                this.stopAutoPlay();
            }, { passive: true });
            
            slide.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
                setTimeout(() => this.startAutoPlay(), 3000);
            }, { passive: true });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        this.initParallax();
        this.initResponsiveBehaviors();
    }
    
    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > this.touchThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    initResponsiveBehaviors() {
        const checkMobile = () => window.innerWidth <= 768;
        
        const handleResize = () => {
            if (checkMobile()) {
                this.stopAutoPlay();
            } else {
                this.startAutoPlay();
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
    }
    
    showSlide(index) {
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
            indicator.setAttribute('aria-selected', 'false');
        });
        
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
            this.indicators[index].setAttribute('aria-selected', 'true');
        }
        
        this.currentSlide = index;
        this.updateProgressBar();
        this.animateContent();
    }
    
    animateContent() {
        const activeSlide = this.slides[this.currentSlide];
        const content = activeSlide.querySelector('.slide-text');
        
        if (content) {
            content.style.animation = 'none';
            setTimeout(() => {
                content.style.animation = 'slideReveal 1s ease forwards';
            }, 10);
        }
        
        this.animateElements();
    }
    
    animateElements() {
        const rays = document.querySelectorAll('.light-ray');
        rays.forEach((ray, index) => {
            ray.style.animation = 'none';
            setTimeout(() => {
                ray.style.animation = `rayMove 15s infinite ease-in-out ${index * 2}s`;
            }, 10);
        });
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
        this.resetAutoPlay();
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
            this.resetAutoPlay();
        }
    }
    
    updateProgressBar() {
        if (this.progressBar) {
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }
    
    startAutoPlay() {
        if (this.totalSlides > 1 && window.innerWidth > 768) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
        }
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    initParallax() {
        if (window.innerWidth <= 768) return;
        
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
            
            this.slides.forEach(slide => {
                const parallaxLayer = slide.querySelector('.parallax-layer');
                if (parallaxLayer && slide.classList.contains('active')) {
                    parallaxLayer.style.transform = `scale(1.1) translate(${mouseX}px, ${mouseY}px)`;
                }
            });
        });
    }
}

// ===== СЛАЙДЕР ОТЗЫВОВ =====
class TestimonialsSlider {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.testimonial-dot');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        this.currentSlide = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchThreshold = 50;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.showSlide(this.currentSlide);
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.initTouchEvents();
        
        if (this.slides.length > 1 && window.innerWidth > 768) {
            setInterval(() => this.nextSlide(), 8000);
        }
    }
    
    initTouchEvents() {
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (!sliderContainer) return;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        sliderContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }
    
    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > this.touchThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    showSlide(index) {
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
}

// ===== FAQ АККОРДЕОН =====
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        
        if (this.faqItems.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (window.innerWidth <= 768) {
                question.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.toggleItem(item);
                }, { passive: false });
            }
            
            question.addEventListener('click', () => {
                if (window.innerWidth > 768) {
                    this.toggleItem(item);
                }
            });
            
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleItem(item);
                }
            });
        });
    }
    
    toggleItem(clickedItem) {
        this.faqItems.forEach(item => {
            if (item !== clickedItem && item.classList.contains('active')) {
                item.classList.remove('active');
            }
        });
        
        clickedItem.classList.toggle('active');
    }
}

// ===== МОДАЛЬНОЕ ОКНО ГАЛЕРЕИ =====
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('galleryModal');
        this.modalImage = this.modal?.querySelector('.modal-image');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.closeBtn = this.modal?.querySelector('.modal-close');
        
        if (this.modal && this.modalImage && this.galleryItems.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const img = item.querySelector('img');
                if (img) {
                    this.openModal(img.src, img.alt);
                }
            });
        });
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal(imgSrc, imgAlt) {
        this.modalImage.src = imgSrc;
        this.modalImage.alt = imgAlt;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ===== КОНТАКТНАЯ ФОРМА =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('consultationForm');
        this.statusEl = document.getElementById('formStatus');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) {
                return;
            }
            
            const formData = new FormData(this.form);
            const data = {
                name: formData.get('name'),
                contact: formData.get('contact'),
                format: formData.get('format'),
                message: formData.get('message'),
                date: new Date().toISOString()
            };
            
            this.showStatus('Отправляем заявку...', 'loading');
            
            try {
                await this.simulateApiCall();
                
                this.showStatus('Спасибо! Мы получили вашу заявку и скоро свяжемся с вами.', 'success');
                
                setTimeout(() => {
                    this.form.reset();
                    this.clearStatus();
                }, 5000);
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showStatus('Произошла ошибка. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.', 'error');
            }
        });
        
        this.initMobileInputOptimization();
    }
    
    initMobileInputOptimization() {
        if (window.innerWidth <= 768) {
            const inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    setTimeout(() => {
                        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                });
            });
        }
    }
    
    validateForm() {
        const name = this.form.querySelector('#name');
        const contact = this.form.querySelector('#contact');
        const consent = this.form.querySelector('#consent');
        
        let isValid = true;
        
        this.clearErrors();
        
        if (!name.value.trim()) {
            this.showError(name, 'Пожалуйста, введите ваше имя');
            isValid = false;
        }
        
        if (!contact.value.trim()) {
            this.showError(contact, 'Пожалуйста, введите контактные данные');
            isValid = false;
        }
        
        if (!consent.checked) {
            this.showError(consent.parentElement, 'Необходимо согласие на обработку данных');
            isValid = false;
        }
        
        return isValid;
    }
    
    showError(element, message) {
        element.classList.add('error');
        
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: #F44336; font-size: 14px; margin-top: 8px; font-weight: 500;';
        
        element.parentElement.appendChild(errorEl);
    }
    
    clearErrors() {
        this.form.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        this.form.querySelectorAll('.error-message').forEach(el => {
            el.remove();
        });
    }
    
    showStatus(message, type = 'info') {
        if (this.statusEl) {
            this.statusEl.textContent = message;
            this.statusEl.className = 'form-status';
            this.statusEl.classList.add(type);
        }
    }
    
    clearStatus() {
        if (this.statusEl) {
            this.statusEl.textContent = '';
            this.statusEl.className = 'form-status';
        }
    }
    
    async simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || href === '#0') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const burgerMenu = document.querySelector('.burger-menu');
                    const navMenu = document.querySelector('.nav-menu');
                    
                    if (burgerMenu && navMenu && navMenu.classList.contains('active')) {
                        burgerMenu.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        burgerMenu.setAttribute('aria-expanded', 'false');
                    }
                    
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ =====
class MobileOptimization {
    constructor() {
        this.init();
    }
    
    init() {
        this.detectTouchDevice();
        this.optimizeImages();
        this.preventZoomOnInput();
        this.optimizeAnimations();
    }
    
    detectTouchDevice() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
            
            const style = document.createElement('style');
            style.textContent = `
                @media (hover: none) and (pointer: coarse) {
                    .level-card:hover, .help-card:hover, .expert-card:hover {
                        transform: none !important;
                    }
                    
                    .btn:hover {
                        transform: none !important;
                        box-shadow: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    preventZoomOnInput() {
        if (window.innerWidth <= 768) {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    setTimeout(() => {
                        window.scrollTo({
                            top: input.getBoundingClientRect().top + window.pageYOffset - 100,
                            behavior: 'smooth'
                        });
                    }, 100);
                });
            });
        }
    }
    
    optimizeAnimations() {
        if (window.innerWidth <= 768) {
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    * {
                        animation-duration: 0.5s !important;
                        transition-duration: 0.3s !important;
                    }
                    
                    .parallax-layer {
                        transform: none !important;
                    }
                }
                
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ВСЕГО =====
document.addEventListener('DOMContentLoaded', () => {
    // Базовые компоненты
    initAgeVerification();
    initMobileMenu();
    initHeaderScroll();
    
    // Слайдеры и интерактивные компоненты
    new CinematicHeroSlider();
    new TestimonialsSlider();
    new FAQAccordion();
    new GalleryModal();
    new ContactForm();
    new SmoothScroll();
    
    // Мобильная оптимизация
    new MobileOptimization();
    
    // Добавление текущего года в футер
    const yearSpan = document.querySelector('#currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Обработчик изменения размера окна
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }, 250);
});
