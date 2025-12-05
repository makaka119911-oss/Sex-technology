// ===== ПРЕЛОАДЕР =====
window.addEventListener('load', () => {
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
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

function initMobileMenu() {
    if (!burgerMenu || !navMenu) return;
    
    burgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== ХЕДЕР ПРИ СКРОЛЛЕ =====
const header = document.querySelector('.header');
let lastScrollTop = 0;
let ticking = false;

function initHeaderScroll() {
    if (!header) return;
    
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
        });
        
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
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
            
            if (window.innerWidth <= 768) {
                item.addEventListener('touchstart', (e) => {
                    if (e.touches.length === 1) {
                        const img = item.querySelector('img');
                        if (img) {
                            this.openModal(img.src, img.alt);
                        }
                    }
                }, { passive: true });
            }
        });
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
            
            if (window.innerWidth <= 768) {
                this.closeBtn.addEventListener('touchstart', () => this.closeModal());
            }
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
        
        if (window.innerWidth <= 768) {
            this.modalImage.style.maxHeight = '70vh';
            this.modalImage.style.maxWidth = '90vw';
        }
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
                    
                    if (burgerMenu && navMenu && navMenu.classList.contains('active')) {
                        burgerMenu.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                    
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

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                        
                        const delay = entry.target.dataset.aosDelay;
                        if (delay) {
                            entry.target.style.transitionDelay = `${delay}ms`;
                        }
                    }
                });
            }, this.observerOptions);
            
            document.querySelectorAll('[data-aos]').forEach(el => {
                this.observer.observe(el);
            });
        } else {
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.classList.add('aos-animate');
            });
        }
    }
}

// ===== ВЗАИМОДЕЙСТВИЕ С КАРТОЧКАМИ УРОВНЕЙ =====
class LevelsInteraction {
    constructor() {
        this.levelCards = document.querySelectorAll('.level-card');
        
        if (this.levelCards.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.levelCards.forEach(card => {
            if (window.innerWidth > 768) {
                card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
                card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
            } else {
                card.addEventListener('touchstart', () => {
                    this.levelCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                }, { passive: true });
            }
        });
    }
    
    handleMouseEnter(card) {
        card.style.zIndex = '10';
        
        const number = card.querySelector('.level-number');
        if (number) {
            number.style.color = 'rgba(128, 0, 32, 0.4)';
            number.style.transform = 'scale(1.1)';
        }
        
        const icon = card.querySelector('.level-icon');
        if (icon) {
            icon.style.transform = 'rotate(10deg) scale(1.1)';
        }
    }
    
    handleMouseLeave(card) {
        card.style.zIndex = '';
        
        const number = card.querySelector('.level-number');
        if (number) {
            number.style.color = '';
            number.style.transform = '';
        }
        
        const icon = card.querySelector('.level-icon');
        if (icon) {
            icon.style.transform = '';
        }
    }
}

// ===== КИНЕМАТОГРАФИЧЕСКИЕ ЭФФЕКТЫ =====
class CinematicEffects {
    constructor() {
        this.init();
    }
    
    init() {
        if (window.innerWidth > 768) {
            this.initTitleShine();
            this.initBackgroundParallax();
            this.initButtonGlow();
        }
    }
    
    initTitleShine() {
        const titles = document.querySelectorAll('.title-line, .section-title');
        
        titles.forEach(title => {
            setInterval(() => {
                const brightness = Math.random() * 0.2 + 0.9;
                title.style.filter = `brightness(${brightness})`;
            }, 3000);
        });
    }
    
    initBackgroundParallax() {
        const sections = document.querySelectorAll('.section');
        
        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 768) return;
            
            const scrollTop = window.pageYOffset;
            
            sections.forEach(section => {
                const speed = 0.5;
                const yPos = -(scrollTop * speed);
                section.style.backgroundPosition = `center ${yPos}px`;
            });
        });
    }
    
    initButtonGlow() {
        const buttons = document.querySelectorAll('.btn-primary');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = '0 0 25px rgba(128, 0, 32, 0.6)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '';
            });
        });
    }
}

// ===== ВИННЫЕ ЭФФЕКТЫ =====
class WineEffects {
    constructor() {
        this.init();
    }
    
    init() {
        if (window.innerWidth > 768) {
            this.initWineGlow();
            this.initWineDrops();
            this.initVineAnimation();
        }
    }
    
    initWineGlow() {
        const buttons = document.querySelectorAll('.btn-primary, .nav-cta');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = '0 0 30px rgba(128, 0, 32, 0.7)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '';
            });
        });
    }
    
    initWineDrops() {
        if (window.innerWidth <= 768) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            if (scrollTop > 100 && !this.dropsCreated) {
                this.createWineDrops();
                this.dropsCreated = true;
            }
        });
    }
    
    createWineDrops() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const drop = document.createElement('div');
                drop.className = 'wine-drop';
                drop.style.cssText = `
                    position: absolute;
                    width: 3px;
                    height: 10px;
                    background: var(--color-primary);
                    border-radius: 50%;
                    top: -10px;
                    left: ${Math.random() * 100}%;
                    opacity: 0;
                    animation: wineDrop 1.5s ease-in-out forwards;
                `;
                
                header.appendChild(drop);
                
                setTimeout(() => drop.remove(), 1500);
            }, i * 300);
        }
    }
    
    initVineAnimation() {
        const levelIcons = document.querySelectorAll('.level-icon');
        
        levelIcons.forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                const vine = document.createElement('div');
                vine.className = 'vine-effect';
                vine.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 0;
                    background: linear-gradient(to bottom, transparent, var(--color-primary), transparent);
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: growVine 0.8s ease-out forwards;
                `;
                
                icon.appendChild(vine);
                
                setTimeout(() => vine.remove(), 1000);
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

// ===== ПРЕДЗАГРУЗКА КРИТИЧНЫХ ИЗОБРАЖЕНИЙ =====
function preloadCriticalImages() {
    const criticalImages = [
        'фото 2х сексологов вместе.jpg',
        'фото Татьяны Солнечной.jpg',
        'Фото Виктории РУмянцевой.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
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
    new ScrollAnimations();
    new LevelsInteraction();
    
    // Эффекты (только для десктопа)
    if (window.innerWidth > 768) {
        new CinematicEffects();
        new WineEffects();
    }
    
    // Мобильная оптимизация
    new MobileOptimization();
    
    // Добавление текущего года в футер
    const yearSpan = document.querySelector('#currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Эффект для карточек помощи
    const helpCards = document.querySelectorAll('.help-card');
    helpCards.forEach(card => {
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.help-icon');
                if (icon) {
                    icon.style.transform = 'rotate(15deg) scale(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.help-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        }
    });
    
    // Эффект для карточек специалистов
    const expertCards = document.querySelectorAll('.expert-card');
    expertCards.forEach(card => {
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                const image = card.querySelector('.expert-image img');
                if (image) {
                    image.style.transform = 'scale(1.05)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const image = card.querySelector('.expert-image img');
                if (image) {
                    image.style.transform = '';
                }
            });
        }
    });
});

// Запуск после полной загрузки страницы
window.addEventListener('load', () => {
    preloadCriticalImages();
    
    // Добавляем CSS анимации для винных эффектов (только для десктопа)
    if (window.innerWidth > 768) {
        const wineStyles = document.createElement('style');
        wineStyles.textContent = `
            @keyframes wineDrop {
                0% {
                    transform: translateY(0);
                    opacity: 0;
                }
                20% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(100px);
                    opacity: 0;
                }
            }
            
            @keyframes growVine {
                0% {
                    height: 0;
                    opacity: 0;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    height: 40px;
                    opacity: 0;
                }
            }
            
            @keyframes wineShimmer {
                0%, 100% {
                    filter: brightness(1);
                }
                50% {
                    filter: brightness(1.3);
                }
            }
            
            .slide-title:hover .title-line {
                animation: wineShimmer 2s infinite;
            }
            
            .btn-primary:active {
                transform: scale(0.98);
                transition: transform 0.1s;
            }
        `;
        document.head.appendChild(wineStyles);
    }
    
    // Инициализация ленивой загрузки для изображений
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
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

// Быстрое касание для мобильных устройств
document.addEventListener('touchstart', function() {}, {passive: true});
