// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.cinematic-preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                preloader.remove();
            }, 500);
        }, 1000);
    }
});

// ===== MOBILE MENU =====
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

if (burgerMenu && navMenu) {
    burgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Закрытие по клику на ссылку
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Закрытие по клику вне меню
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.header');
let lastScrollTop = 0;

if (header) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Добавление класса при скролле
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Скрытие/показ хедера при скролле
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Скролл вниз
            header.style.transform = 'translateY(-100%)';
        } else {
            // Скролл вверх
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== CINEMATIC HERO SLIDER =====
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
        this.autoPlayDelay = 7000; // 7 секунд
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Показать первый слайд
        this.showSlide(this.currentSlide);
        
        // Навигация кнопками
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Навигация индикаторами
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Автоплей
        this.startAutoPlay();
        
        // Пауза при наведении
        this.slides.forEach(slide => {
            slide.addEventListener('mouseenter', () => this.stopAutoPlay());
            slide.addEventListener('mouseleave', () => this.startAutoPlay());
        });
        
        // Навигация клавишами
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Параллакс эффект
        this.initParallax();
    }
    
    showSlide(index) {
        // Скрыть все слайды
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Убрать активные классы у индикаторов
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Показать текущий слайд
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        // Активировать индикатор
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }
        
        this.currentSlide = index;
        
        // Обновить прогресс бар
        this.updateProgressBar();
        
        // Анимация контента
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
        
        // Анимация кинематографических элементов
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
        if (this.totalSlides > 1) {
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
        // Простой параллакс эффект при движении мыши
        document.addEventListener('mousemove', (e) => {
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

// ===== TESTIMONIALS SLIDER =====
class TestimonialsSlider {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.testimonial-dot');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        this.currentSlide = 0;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Показать первый слайд
        this.showSlide(this.currentSlide);
        
        // Навигация
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Навигация точками
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Автоплей
        if (this.slides.length > 1) {
            setInterval(() => this.nextSlide(), 8000);
        }
    }
    
    showSlide(index) {
        // Скрыть все слайды
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Убрать активные классы у точек
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Показать текущий слайд
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        // Активировать точку
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

// ===== FAQ ACCORDION =====
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
            question.addEventListener('click', () => {
                // Закрыть все остальные элементы
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Переключить текущий элемент
                item.classList.toggle('active');
            });
        });
    }
}

// ===== GALLERY MODAL =====
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
        // Открытие модального окна
        this.galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const img = item.querySelector('img');
                if (img) {
                    this.openModal(img.src, img.alt);
                }
            });
        });
        
        // Закрытие модального окна
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Закрытие по Escape
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

// ===== CONTACT FORM =====
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
            
            // Валидация
            if (!this.validateForm()) {
                return;
            }
            
            // Сбор данных
            const formData = new FormData(this.form);
            const data = {
                name: formData.get('name'),
                contact: formData.get('contact'),
                format: formData.get('format'),
                message: formData.get('message'),
                date: new Date().toISOString()
            };
            
            // Показать статус отправки
            this.showStatus('Отправляем заявку...', 'loading');
            
            try {
                // Имитация отправки (в реальном проекте заменить на fetch)
                await this.simulateApiCall();
                
                // Успешная отправка
                this.showStatus('Спасибо! Мы получили вашу заявку и скоро свяжемся с вами.', 'success');
                
                // Очистка формы через 5 секунд
                setTimeout(() => {
                    this.form.reset();
                    this.clearStatus();
                }, 5000);
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showStatus('Произошла ошибка. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.', 'error');
            }
        });
    }
    
    validateForm() {
        const name = this.form.querySelector('#name');
        const contact = this.form.querySelector('#contact');
        const consent = this.form.querySelector('#consent');
        
        let isValid = true;
        
        // Очистка предыдущих ошибок
        this.clearErrors();
        
        // Валидация имени
        if (!name.value.trim()) {
            this.showError(name, 'Пожалуйста, введите ваше имя');
            isValid = false;
        }
        
        // Валидация контакта
        if (!contact.value.trim()) {
            this.showError(contact, 'Пожалуйста, введите контактные данные');
            isValid = false;
        }
        
        // Валидация согласия
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
        errorEl.style.color = '#F44336';
        errorEl.style.fontSize = '14px';
        errorEl.style.marginTop = '8px';
        errorEl.style.fontWeight = '500';
        
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
        // Имитация задержки сети
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Плавный скролл для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || href === '#0') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    // Закрытие мобильного меню если открыто
                    if (burgerMenu && navMenu && navMenu.classList.contains('active')) {
                        burgerMenu.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                    
                    // Вычисление высоты хедера
                    const headerHeight = header ? header.offsetHeight : 80;
                    
                    // Скролл к цели
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

// ===== SCROLL ANIMATIONS =====
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
        // Создание Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Обработка задержки
                    const delay = entry.target.dataset.aosDelay;
                    if (delay) {
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }
                }
            });
        }, this.observerOptions);
        
        // Наблюдение за всеми элементами с data-aos
        document.querySelectorAll('[data-aos]').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// ===== LEVELS INTERACTION =====
class LevelsInteraction {
    constructor() {
        this.levelCards = document.querySelectorAll('.level-card');
        
        if (this.levelCards.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.levelCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
            
            // Клик для мобильных устройств
            if (window.innerWidth <= 768) {
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('a')) {
                        this.handleClick(card);
                    }
                });
            }
        });
    }
    
    handleMouseEnter(card) {
        // Эффект подъема
        card.style.zIndex = '10';
        
        // Анимация номера уровня
        const number = card.querySelector('.level-number');
        if (number) {
            number.style.color = 'rgba(232, 180, 188, 0.4)';
            number.style.transform = 'scale(1.1)';
        }
        
        // Анимация иконки
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
    
    handleClick(card) {
        // Для мобильных: переключение активного состояния
        this.levelCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    }
}

// ===== CINEMATIC EFFECTS =====
class CinematicEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Эффект мерцания для заголовков
        this.initTitleShine();
        
        // Эффект параллакса для фона
        this.initBackgroundParallax();
        
        // Эффект свечения для кнопок
        this.initButtonGlow();
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
                button.style.boxShadow = '0 0 25px rgba(232, 180, 188, 0.6)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '';
            });
        });
    }
}
// ===== WINE EFFECTS =====
class WineEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Эффект винного свечения для кнопок
        this.initWineGlow();
        
        // Эффект капель вина для хедера
        this.initWineDrops();
        
        // Анимация виноградной лозы
        this.initVineAnimation();
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
        // Создаём эффект капель вина в хедере при скролле
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
        
        // Создаем несколько капель
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
                
                // Удаляем каплю после анимации
                setTimeout(() => drop.remove(), 1500);
            }, i * 300);
        }
    }
    
    initVineAnimation() {
        // Добавляем анимацию виноградной лозы для уровней
        const levelIcons = document.querySelectorAll('.level-icon');
        
        levelIcons.forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                // Создаем эффект виноградной лозы
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

// Добавляем анимации в CSS через JS
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
    
    /* Эффект мерцания вина */
    @keyframes wineShimmer {
        0%, 100% {
            filter: brightness(1);
        }
        50% {
            filter: brightness(1.3);
        }
    }
    
    /* Анимация для заголовков */
    .slide-title:hover .title-line {
        animation: wineShimmer 2s infinite;
    }
    
    /* Эффект винной ряби на кнопках */
    .btn-primary:active {
        transform: scale(0.98);
        transition: transform 0.1s;
    }
`;

document.head.appendChild(wineStyles);
// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация компонентов
    new CinematicHeroSlider();
    new TestimonialsSlider();
    new FAQAccordion();
    new GalleryModal();
    new ContactForm();
    new SmoothScroll();
    new ScrollAnimations();
    new LevelsInteraction();
    new CinematicEffects();
    new WineEffects();
    // Добавление текущего года в футер
    const yearSpan = document.querySelector('#currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Добавление lazy loading для изображений
    document.querySelectorAll('img:not([loading])').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Эффект для карточек помощи
    const helpCards = document.querySelectorAll('.help-card');
    helpCards.forEach(card => {
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
    });
    
    // Эффект для карточек специалистов
    const expertCards = document.querySelectorAll('.expert-card');
    expertCards.forEach(card => {
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
    });
    
    // Логика отправки формы
    const form = document.getElementById('consultationForm');
    if (form) {
        form.addEventListener('submit', () => {
            // Можно добавить аналитику или другие действия
            console.log('Форма отправлена');
        });
    }
});
// Оптимизация для мобильных устройств
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Отключение hover эффектов на тач-устройствах
    const style = document.createElement('style');
    style.textContent = `
        @media (hover: none) and (pointer: coarse) {
            .level-card:hover, .help-card:hover, .expert-card:hover {
                transform: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Предзагрузка критичных изображений
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

// Запуск после полной загрузки страницы
window.addEventListener('load', () => {
    preloadCriticalImages();
});
