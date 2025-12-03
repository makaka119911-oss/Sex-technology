// ===== МОБИЛЬНОЕ МЕНЮ =====
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // ===== ПЛАВНЫЙ СКРОЛЛ =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#0') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Закрытие меню на мобильных
                if (window.innerWidth <= 768 && navMenu && navMenu.classList.contains('active')) {
                    burgerMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                // Вычисление позиции с учётом хедера
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== ЭФФЕКТЫ ПРИ СКРОЛЛЕ =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами для анимации
    document.querySelectorAll('.expert-card, .help-item, .level-card, .testimonial').forEach(el => {
        observer.observe(el);
    });
    
    // ===== АДАПТИВНЫЕ ИЗОБРАЖЕНИЯ =====
    function optimizeImages() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Замена src на меньшие изображения для мобильных
            if (window.innerWidth <= 768) {
                const src = img.getAttribute('src');
                if (src && src.endsWith('.jpg')) {
                    // Можно добавить логику для респонсивных изображений
                }
            }
        });
    }
    
    optimizeImages();
    
    // ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Валидация
            const name = this.querySelector('#name').value.trim();
            const contact = this.querySelector('#contact').value.trim();
            
            if (!name || !contact) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            // Имитация отправки
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // ===== ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ =====
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Ошибка загрузки изображения:', this.src);
            this.style.opacity = '0.5';
            this.style.filter = 'grayscale(100%)';
        });
    });
    
    // ===== ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ =====
    function optimizeForMobile() {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Увеличиваем область клика для кнопок на мобильных
            document.querySelectorAll('.btn, .nav-link').forEach(el => {
                el.style.minHeight = '44px';
                el.style.minWidth = '44px';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
            });
        }
    }
    
    optimizeForMobile();
    
    // ===== FIX ДЛЯ IOS =====
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        // Предотвращение масштабирования при фокусе на инпутах
        document.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('focus', () => {
                document.body.style.zoom = '1';
            });
        });
    }
});

// ===== ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА =====
window.addEventListener('resize', function() {
    // Закрытие меню при переходе на десктоп
    if (window.innerWidth > 768) {
        const burgerMenu = document.querySelector('.burger-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (burgerMenu && burgerMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ===== ПРЕЛОУДЕР =====
window.addEventListener('load', function() {
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
        
        // Инициализация после загрузки
        console.log('Сайт полностью загружен');
    }, 1000);
});
