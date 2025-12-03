// ===== ПРЕМИУМ ПРЕЛОУДЕР =====
window.addEventListener('load', function() {
    const preloader = document.querySelector('.luxury-preloader');
    if (preloader) {
        // Задержка для демонстрации анимации
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 800);
        }, 1500);
    }
});

// ===== ПРЕМИУМ МОБИЛЬНОЕ МЕНЮ =====
class PremiumMobileMenu {
    constructor() {
        this.burger = document.querySelector('.premium-burger');
        this.menu = document.querySelector('.premium-menu');
        this.menuLinks = document.querySelectorAll('.premium-menu a');
        
        if (this.burger && this.menu) {
            this.init();
        }
    }
    
    init() {
        // Открытие/закрытие меню
        this.burger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // Закрытие при клике на ссылку
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (this.menu.classList.contains('active') && 
                !e.target.closest('.premium-menu') && 
                !e.target.closest('.premium-burger')) {
                this.closeMenu();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menu.classList.contains('active')) {
                this.closeMenu();
            }
        });
        
        // Предотвращение прокрутки при открытом меню на мобильных
        this.preventScrollOnMobile();
    }
    
    toggleMenu() {
        this.burger.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : 'auto';
        
        // Анимация для иконок в меню
        if (this.menu.classList.contains('active')) {
            this.animateMenuItems();
        }
    }
    
    closeMenu() {
        this.burger.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    animateMenuItems() {
        this.menuLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
            link.classList.add('animated');
        });
    }
    
    preventScrollOnMobile() {
        if ('ontouchstart' in window) {
            this.menu.addEventListener('touchmove', (e) => {
                if (this.menu.classList.contains('active')) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }
}

// ===== ПРЕМИУМ СЛАЙДЕР ГЕРОЯ =====
class PremiumHeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.premium-slide');
        this.indicators = document.querySelectorAll('.premium-indicator');
        this.progressBar = document.querySelector('.premium-bar');
        this.prevBtn = document.querySelector('.premium-prev');
        this.nextBtn = document.querySelector('.premium-next');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 8000; // 8 секунд
        this.isMobile = window.innerWidth <= 768;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
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
        
        // Свайп для мобильных
        if (this.isMobile) {
            this.initTouchControls();
        }
        
        // Автоплей
        this.startAutoPlay();
        
        // Пауза при наведении
        this.slides.forEach(slide => {
            slide.addEventListener('mouseenter', () => this.stopAutoPlay());
            slide.addEventListener('mouseleave', () => this.startAutoPlay());
            
            // Для мобильных: пауза при касании
            if (this.isMobile) {
                slide.addEventListener('touchstart', () => this.stopAutoPlay());
                slide.addEventListener('touchend', () => {
                    setTimeout(() => this.startAutoPlay(), 3000);
                });
            }
        });
        
        // Навигация клавишами
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Обновление при изменении размера окна
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }
    
    initTouchControls() {
        this.slides.forEach(slide => {
            slide.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });
            
            slide.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Свайп вправо - предыдущий слайд
                this.prevSlide();
            } else {
                // Свайп влево - следующий слайд
                this.nextSlide();
            }
        }
    }
    
    showSlide(index) {
        // Скрыть все слайды
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });
        
        // Убрать активные классы у индикаторов
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Показать текущий слайд
        if (this.slides[index]) {
            setTimeout(() => {
                this.slides[index].classList.add('active');
                this.slides[index].style.opacity = '1';
            }, 50);
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
        const content = activeSlide.querySelector('.premium-text');
        
        if (content) {
            content.style.animation = 'none';
            setTimeout(() => {
                content.style.animation = 'slideReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            }, 100);
        }
        
        // Анимация декоративных элементов
        this.animateDecorativeElements();
    }
    
    animateDecorativeElements() {
        const particles = document.querySelectorAll('.luxury-particle');
        particles.forEach((particle, index) => {
            particle.style.animation = 'none';
            setTimeout(() => {
                particle.style.animation = `particleFloat 20s linear infinite ${index * 5}s`;
            }, 100);
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
        if (this.totalSlides > 1 && !this.isMobile) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
        }
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        if (!this.isMobile) {
            this.startAutoPlay();
        }
    }
}

// ===== ПРЕМИУМ ПАРАЛЛАКС ЭФФЕКТ =====
class PremiumParallax {
    constructor() {
        this.parallaxElements = document.querySelectorAll('.premium-card, .premium-image, .premium-icon');
        this.isMobile = window.innerWidth <= 768;
        
        if (this.parallaxElements.length > 0 && !this.isMobile) {
            this.init();
        }
    }
    
    init() {
        // Параллакс при движении мыши
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
            
            this.parallaxElements.forEach((element, index) => {
                setTimeout(() => {
                    const speed = 0.5 + (index * 0.1);
                    element.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
                }, index * 10);
            });
        });
        
        // Параллакс при скролле
        window.addEventListener('scroll', () => {
            if (this.isMobile) return;
            
            const scrolled = window.pageYOffset;
            
            this.parallaxElements.forEach((element, index) => {
                const rate = scrolled * -0.3 * (1 + index * 0.1);
                const currentTransform = element.style.transform.match(/translate\(([^)]+)\)/);
                
                if (currentTransform) {
                    const [_, x, y] = currentTransform[1].split(',').map(v => parseFloat(v));
                    element.style.transform = `translate(${x}px, ${y + rate}px)`;
                }
            });
        });
        
        // Обновление при изменении размера окна
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            if (this.isMobile) {
                // Сброс трансформаций на мобильных
                this.parallaxElements.forEach(element => {
                    element.style.transform = '';
                });
            }
        });
    }
}

// ===== ПРЕМИУМ АНИМАЦИИ ПРИ СКРОЛЛЕ =====
class PremiumScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-aos]');
        this.observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        if (this.animatedElements.length > 0) {
            this.init();
        }
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        this.animateElement(entry.target);
                    }
                });
            }, this.observerOptions);
            
            this.animatedElements.forEach(el => this.observer.observe(el));
        } else {
            // Fallback для старых браузеров
            this.animatedElements.forEach(el => {
                el.classList.add('animated');
                this.animateElement(el);
            });
        }
    }
    
    animateElement(element) {
        const delay = element.dataset.aosDelay || 0;
        
        setTimeout(() => {
            // Добавляем различные анимации в зависимости от типа элемента
            if (element.classList.contains('premium-card')) {
                this.animateCard(element);
            } else if (element.classList.contains('premium-icon')) {
                this.animateIcon(element);
            }
        }, delay);
    }
    
    animateCard(card) {
        // Эффект появления карточки
        card.style.transform = 'translateY(0) rotateX(0)';
        card.style.opacity = '1';
        
        // Эффект при наведении (только не на мобильных)
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        }
    }
    
    animateIcon(icon) {
        // Вращающаяся анимация для иконок
        icon.style.animation = 'rotateIn 0.6s ease forwards';
        
        // Эффект свечения при наведении
        icon.addEventListener('mouseenter', () => {
            icon.style.filter = 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.filter = 'none';
        });
    }
}

// ===== ПРЕМИУМ ГАЛЕРЕЯ =====
class PremiumGallery {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item.premium-item');
        this.modal = document.querySelector('.premium-modal');
        this.modalImage = this.modal?.querySelector('.modal-image.premium-image');
        this.modalTitle = this.modal?.querySelector('.image-title');
        this.modalDescription = this.modal?.querySelector('.image-description');
        this.closeBtn = this.modal?.querySelector('.premium-close');
        this.currentImageIndex = 0;
        
        if (this.galleryItems.length > 0 && this.modal) {
            this.init();
        }
    }
    
    init() {
        // Открытие модального окна
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.openModal(item);
            });
            
            // Клавиатурная навигация
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.currentImageIndex = index;
                    this.openModal(item);
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
            
            // Навигация стрелками
            if (this.modal.classList.contains('active')) {
                if (e.key === 'ArrowLeft') this.showPreviousImage();
                if (e.key === 'ArrowRight') this.showNextImage();
            }
        });
        
        // Свайп для мобильных
        this.initSwipeControls();
    }
    
    initSwipeControls() {
        if ('ontouchstart' in window) {
            let touchStartX = 0;
            
            this.modal.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
            });
            
            this.modal.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const swipeThreshold = 50;
                const swipeDistance = touchEndX - touchStartX;
                
                if (Math.abs(swipeDistance) > swipeThreshold) {
                    if (swipeDistance > 0) {
                        this.showPreviousImage();
                    } else {
                        this.showNextImage();
                    }
                }
            });
        }
    }
    
    openModal(galleryItem) {
        const img = galleryItem.querySelector('img');
        const caption = galleryItem.querySelector('.image-caption');
        
        if (img && this.modalImage) {
            // Установка изображения
            this.modalImage.src = img.src;
            this.modalImage.alt = img.alt;
            
            // Установка заголовка и описания
            if (caption && this.modalTitle && this.modalDescription) {
                const title = caption.querySelector('h4');
                const description = caption.querySelector('p');
                
                if (title) this.modalTitle.textContent = title.textContent;
                if (description) this.modalDescription.textContent = description.textContent;
            }
            
            // Показ модального окна
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Анимация появления
            setTimeout(() => {
                this.modalImage.style.opacity = '1';
            }, 100);
        }
    }
    
    closeModal() {
        this.modalImage.style.opacity = '0';
        
        setTimeout(() => {
            this.modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    showNextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryItems.length;
        const nextItem = this.galleryItems[this.currentImageIndex];
        this.openModal(nextItem);
    }
    
    showPreviousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        const prevItem = this.galleryItems[this.currentImageIndex];
        this.openModal(prevItem);
    }
}

// ===== ПРЕМИУМ СЛАЙДЕР ОТЗЫВОВ =====
class PremiumTestimonialsSlider {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial-slide.premium-slide');
        this.dots = document.querySelectorAll('.testimonial-dot.premium-dot');
        this.prevBtn = document.querySelector('.testimonial-prev.premium-prev');
        this.nextBtn = document.querySelector('.testimonial-next.premium-next');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.isMobile = window.innerWidth <= 768;
        
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
        
        // Навигация точками
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Свайп для мобильных
        if (this.isMobile) {
            this.initTouchControls();
        }
        
        // Автоплей (только на десктопе)
        if (!this.isMobile && this.slides.length > 1) {
            this.startAutoPlay();
        }
        
        // Пауза при наведении
        this.slides.forEach(slide => {
            slide.addEventListener('mouseenter', () => this.stopAutoPlay());
            slide.addEventListener('mouseleave', () => {
                if (!this.isMobile) this.startAutoPlay();
            });
        });
    }
    
    initTouchControls() {
        this.slides.forEach(slide => {
            let touchStartX = 0;
            
            slide.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
            });
            
            slide.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const swipeThreshold = 30;
                const swipeDistance = touchEndX - touchStartX;
                
                if (Math.abs(swipeDistance) > swipeThreshold) {
                    if (swipeDistance > 0) {
                        this.prevSlide();
                    } else {
                        this.nextSlide();
                    }
                }
            });
        });
    }
    
    showSlide(index) {
        // Скрыть все слайды
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(20px)';
        });
        
        // Убрать активные классы у точек
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Показать текущий слайд
        if (this.slides[index]) {
            setTimeout(() => {
                this.slides[index].classList.add('active');
                this.slides[index].style.opacity = '1';
                this.slides[index].style.transform = 'translateX(0)';
            }, 50);
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
        this.resetAutoPlay();
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
            this.resetAutoPlay();
        }
    }
    
    startAutoPlay() {
        if (this.slides.length > 1 && !this.isMobile) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 10000);
        }
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        if (!this.isMobile) {
            this.startAutoPlay();
        }
    }
}

// ===== ПРЕМИУМ ФОРМА =====
class PremiumContactForm {
    constructor() {
        this.form = document.getElementById('premiumForm');
        this.statusEl = document.getElementById('formStatus');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Валидация формы
            if (this.validateForm()) {
                // Показать статус отправки
                this.showStatus('Отправляем вашу заявку...', 'sending');
                
                // Имитация отправки
                try {
                    await this.simulateApiCall();
                    
                    // Успешная отправка
                    this.showStatus('✅ Спасибо! Мы получили вашу заявку и скоро свяжемся с вами.', 'success');
                    
                    // Очистка формы через 5 секунд
                    setTimeout(() => {
                        this.form.reset();
                        this.hideStatus();
                    }, 5000);
                    
                } catch (error) {
                    console.error('Form submission error:', error);
                    this.showStatus('❌ Произошла ошибка. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.', 'error');
                }
            }
        });
        
        // Валидация в реальном времени
        this.initRealTimeValidation();
    }
    
    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        // Очистка предыдущих ошибок
        this.clearErrors();
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showError(field, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });
        
        // Валидация email (если есть)
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showError(emailField, 'Пожалуйста, введите корректный email');
                isValid = false;
            }
        }
        
        // Валидация телефона (если есть)
        const phoneField = this.form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(phoneField.value.replace(/\D/g, ''))) {
                this.showError(phoneField, 'Пожалуйста, введите корректный номер телефона');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    initRealTimeValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
    }
    
    validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                this.showError(field, 'Пожалуйста, введите корректный email');
                return false;
            }
        }
        
        return true;
    }
    
    showError(field, message) {
        field.classList.add('error');
        
        let errorEl = field.parentElement.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            field.parentElement.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        errorEl.style.color = '#ff6b6b';
        errorEl.style.fontSize = '14px';
        errorEl.style.marginTop = '8px';
        errorEl.style.fontWeight = '500';
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }
    
    clearErrors() {
        this.form.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        this.form.querySelectorAll('.error-message').forEach(el => {
            el.remove();
        });
    }
    
    showStatus(message, type) {
        if (this.statusEl) {
            this.statusEl.textContent = message;
            this.statusEl.className = `form-status premium-status ${type}`;
            
            // Анимация появления
            setTimeout(() => {
                this.statusEl.style.opacity = '1';
                this.statusEl.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    hideStatus() {
        if (this.statusEl) {
            this.statusEl.style.opacity = '0';
            this.statusEl.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                this.statusEl.textContent = '';
                this.statusEl.className = 'form-status premium-status';
                this.statusEl.style.opacity = '';
                this.statusEl.style.transform = '';
            }, 300);
        }
    }
    
    async simulateApiCall() {
        // Имитация задержки сети
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }
}

// ===== ПРЕМИУМ ПЛАВНЫЙ СКРОЛЛ =====
class PremiumSmoothScroll {
    constructor() {
        this.headerHeight = document.querySelector('.luxury-header')?.offsetHeight || 80;
        this.mobileBreakpoint = 768;
        this.isMobile = window.innerWidth <= this.mobileBreakpoint;
        
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
                    const mobileMenu = document.querySelector('.premium-menu');
                    const burger = document.querySelector('.premium-burger');
                    if (this.isMobile && mobileMenu && mobileMenu.classList.contains('active')) {
                        burger?.classList.remove('active');
                        mobileMenu.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                    
                    // Скролл к цели
                    this.scrollToElement(target);
                }
            });
        });
        
        // Обновление при изменении размера окна
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= this.mobileBreakpoint;
        });
    }
    
    scrollToElement(element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - this.headerHeight;
        
        // Для мобильных устройств добавляем дополнительный отступ
        const mobileOffset = this.isMobile ? 20 : 0;
        
        window.scrollTo({
            top: offsetPosition - mobileOffset,
            behavior: 'smooth'
        });
    }
}

// ===== ПРЕМИУМ ЭФФЕКТЫ ДЛЯ КНОПОК =====
class PremiumButtonEffects {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-premium, .btn-outline-premium, .btn-premium-level');
        
        if (this.buttons.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.buttons.forEach(button => {
            // Эффект волны при клике
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            // Эффект при наведении (только на десктопе)
            if (window.innerWidth > 768) {
                button.addEventListener('mousemove', (e) => {
                    this.createHoverEffect(e, button);
                });
            }
        });
    }
    
    createRippleEffect(e, button) {
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    createHoverEffect(e, button) {
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / button.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / button.clientHeight) * 100;
        
        button.style.setProperty('--mouse-x', `${x}%`);
        button.style.setProperty('--mouse-y', `${y}%`);
    }
}

// ===== ПРЕМИУМ ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ =====
class PremiumMobileOptimization {
    constructor() {
        this.init();
    }
    
    init() {
        // Обнаружение тач-устройств
        this.detectTouchDevice();
        
        // Оптимизация изображений для мобильных
        this.optimizeImages();
        
        // Улучшение производительности на мобильных
        this.optimizePerformance();
        
        // Предотвращение масштабирования при фокусе на инпутах на iOS
        this.preventZoomOnFocus();
    }
    
    detectTouchDevice() {
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            document.body.classList.add('touch-device');
            
            // Отключение hover эффектов на тач-устройствах
            this.disableHoverEffects();
        } else {
            document.body.classList.add('no-touch-device');
        }
    }
    
    disableHoverEffects() {
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) and (pointer: coarse) {
                .premium-card:hover,
                .premium-link:hover,
                .btn:hover {
                    transform: none !important;
                }
                
                .premium-card::before,
                .btn::after {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    optimizeImages() {
        // Ленивая загрузка для всех изображений
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Оптимизация srcset для респонсивных изображений
            if (window.innerWidth <= 768) {
                const src = img.getAttribute('src');
                if (src && !src.includes('?width=')) {
                    img.setAttribute('src', src + '?width=400');
                }
            }
        });
    }
    
    optimizePerformance() {
        // Уменьшение количества анимаций на слабых устройствах
        if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency <= 2) {
            document.body.classList.add('low-performance');
            
            // Отключение сложных анимаций
            const style = document.createElement('style');
            style.textContent = `
                .low-performance * {
                    animation-duration: 0.001ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.001ms !important;
                }
                
                .luxury-particle,
                .gold-sparkle {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    preventZoomOnFocus() {
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            document.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('focus', () => {
                    document.body.style.zoom = '1';
                });
            });
        }
    }
}

// ===== ПРЕМИУМ ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация всех премиум компонентов
    const premiumComponents = [
        new PremiumMobileMenu(),
        new PremiumHeroSlider(),
        new PremiumParallax(),
        new PremiumScrollAnimations(),
        new PremiumGallery(),
        new PremiumTestimonialsSlider(),
        new PremiumContactForm(),
        new PremiumSmoothScroll(),
        new PremiumButtonEffects(),
        new PremiumMobileOptimization()
    ];
    
    // Добавление премиум эффектов после загрузки
    window.addEventListener('load', () => {
        // Премиум предзагрузка критичных изображений
        this.preloadCriticalImages();
        
        // Премиум обновление года в футере
        this.updateCurrentYear();
        
        // Премиум инициализация кастомного скроллбара
        this.initCustomScrollbar();
    });
});

// ===== ПРЕМИУМ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

// Предзагрузка критичных изображений
function preloadCriticalImages() {
    const criticalImages = [
        'фото 2х сексологов вместе.jpg',
        'фото Татьяны Солнечной.jpg',
        'Фото Виктории РУмянцевой.jpg',
        'галерея3.jpg',
        'фото замка.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            console.log(`Премиум изображение загружено: ${src}`);
        };
    });
}

// Обновление текущего года в футере
function updateCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Инициализация кастомного скроллбара
function initCustomScrollbar() {
    if (window.innerWidth > 768) {
        // Добавление стилей для кастомного скроллбара
        const scrollbarStyles = `
            ::-webkit-scrollbar {
                width: 10px;
            }
            
            ::-webkit-scrollbar-track {
                background: var(--color-velvet);
            }
            
            ::-webkit-scrollbar-thumb {
                background: var(--gradient-gold);
                border-radius: 5px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: var(--color-gold-light);
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = scrollbarStyles;
        document.head.appendChild(style);
    }
}

// Премиум обработка ошибок изображений
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.error('Ошибка загрузки изображения:', this.src);
        this.style.display = 'none';
        
        // Замена на fallback изображение
        const fallbackSrc = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230a0a1a"/><text x="200" y="150" text-anchor="middle" fill="%23D4AF37" font-family="Arial" font-size="20">Изображение</text></svg>';
        this.src = fallbackSrc;
        this.style.display = 'block';
    });
});

// Премиум оптимизация для медленных сетей
if ('connection' in navigator) {
    const connection = navigator.connection;
    
    if (connection.saveData || connection.effectiveType.includes('2g') || connection.effectiveType.includes('3g')) {
        // Режим экономии данных
        document.body.classList.add('save-data');
        
        // Отключение тяжелых элементов
        document.querySelectorAll('.luxury-particle, .gold-sparkle').forEach(el => {
            el.style.display = 'none';
        });
        
        // Упрощение анимаций
        const style = document.createElement('style');
        style.textContent = `
            .save-data * {
                animation: none !important;
                transition: none !important;
            }
            
            .save-data .premium-card:hover {
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Премиум Service Worker для офлайн-доступа (опционально)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// Премиум аналитика (пример)
function trackPremiumEvent(eventName, data = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
    
    // Отслеживание кликов по основным кнопкам
    document.querySelectorAll('.btn-premium').forEach(btn => {
        btn.addEventListener('click', () => {
            trackPremiumEvent('premium_button_click', {
                button_text: btn.textContent.trim(),
                page_section: btn.closest('section')?.id || 'unknown'
            });
        });
    });
}

// Инициализация трекинга после загрузки
window.addEventListener('load', () => {
    trackPremiumEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
});
