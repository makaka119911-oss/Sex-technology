// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 500);
    }
});

// ===== Mobile Menu =====
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

if (burgerMenu && navMenu) {
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== Header Scroll Effect =====
const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// ===== Main Slider =====
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.slider-prev');
        this.nextBtn = document.querySelector('.slider-next');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        // Set initial slide
        this.showSlide(this.currentSlide);
        
        // Event listeners for buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Event listeners for dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause on hover
        this.slides.forEach(slide => {
            slide.addEventListener('mouseenter', () => this.stopAutoPlay());
            slide.addEventListener('mouseleave', () => this.startAutoPlay());
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        this.currentSlide = index;
        
        // Reset animations
        this.resetAnimations();
    }
    
    resetAnimations() {
        const slideText = this.slides[this.currentSlide].querySelector('.slide-text');
        if (slideText) {
            const elements = slideText.querySelectorAll('[class*="slide-"]');
            elements.forEach(el => {
                const animation = window.getComputedStyle(el).animation;
                if (animation && animation !== 'none 0s ease 0s 1 normal none running') {
                    // Reset animation
                    el.style.animation = 'none';
                    void el.offsetWidth; // Trigger reflow
                    el.style.animation = null;
                }
            });
        }
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
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ===== Testimonials Slider =====
class TestimonialsSlider {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.testimonial-dot');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        this.currentSlide = 0;
        
        this.init();
    }
    
    init() {
        // Set initial slide
        this.showSlide(this.currentSlide);
        
        // Event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Event listeners for dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto advance every 7 seconds
        setInterval(() => this.nextSlide(), 7000);
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
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

// ===== FAQ Accordion =====
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close all other items
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
}

// ===== Gallery Modal =====
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('galleryModal');
        this.modalImage = this.modal.querySelector('.modal-image');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.closeBtn = this.modal.querySelector('.modal-close');
        
        this.init();
    }
    
    init() {
        // Open modal on gallery item click
        this.galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const imgSrc = item.querySelector('img').src;
                this.openModal(imgSrc);
            });
        });
        
        // Close modal
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal(imgSrc) {
        this.modalImage.src = imgSrc;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ===== Contact Form =====
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
            
            // Validate form
            if (!this.validateForm()) {
                return;
            }
            
            // Collect form data
            const formData = new FormData(this.form);
            const data = {
                name: formData.get('name'),
                contact: formData.get('contact'),
                format: formData.get('format'),
                message: formData.get('message'),
                date: new Date().toISOString()
            };
            
            // Show loading state
            this.showStatus('Отправляем заявку...', 'loading');
            
            try {
                // Simulate API call
                await this.simulateApiCall();
                
                // Show success message
                this.showStatus('Спасибо! Мы получили вашу заявку и скоро свяжемся с вами.', 'success');
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    this.form.reset();
                    this.clearStatus();
                }, 5000);
                
                // Send to Telegram (uncomment and configure if needed)
                // await this.sendToTelegram(data);
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showStatus('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.', 'error');
            }
        });
    }
    
    validateForm() {
        const name = this.form.querySelector('#name');
        const contact = this.form.querySelector('#contact');
        const consent = this.form.querySelector('input[name="consent"]');
        
        let isValid = true;
        
        // Clear previous errors
        this.clearErrors();
        
        // Validate name
        if (!name.value.trim()) {
            this.showError(name, 'Пожалуйста, введите ваше имя');
            isValid = false;
        }
        
        // Validate contact
        if (!contact.value.trim()) {
            this.showError(contact, 'Пожалуйста, введите контактные данные');
            isValid = false;
        }
        
        // Validate consent
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
        errorEl.style.color = '#D32F2F';
        errorEl.style.fontSize = '14px';
        errorEl.style.marginTop = '5px';
        
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
        this.statusEl.textContent = message;
        this.statusEl.className = 'form-status';
        this.statusEl.classList.add(type);
    }
    
    clearStatus() {
        this.statusEl.textContent = '';
        this.statusEl.className = 'form-status';
    }
    
    async simulateApiCall() {
        // Simulate network delay
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }
    
    async sendToTelegram(data) {
        // Configure your Telegram bot here
        const botToken = 'YOUR_BOT_TOKEN';
        const chatId = 'YOUR_CHAT_ID';
        
        const message = `
📞 Новая заявка с сайта:

👤 Имя: ${data.name}
📱 Контакт: ${data.contact}
🎯 Формат: ${data.format}
💬 Сообщение: ${data.message || 'Не указано'}
📅 Дата: ${new Date(data.date).toLocaleString('ru-RU')}
        `;
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            if (!response.ok) {
                throw new Error('Telegram API error');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Telegram error:', error);
            throw error;
        }
    }
}

// ===== Smooth Scroll =====
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (burgerMenu && navMenu) {
                        burgerMenu.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                    
                    // Calculate header height
                    const headerHeight = header ? header.offsetHeight : 80;
                    
                    // Scroll to target
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

// ===== Scroll Animations =====
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
        // Create Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Handle delay
                    const delay = entry.target.dataset.aosDelay;
                    if (delay) {
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }
                }
            });
        }, this.observerOptions);
        
        // Observe all elements with data-aos attribute
        document.querySelectorAll('[data-aos]').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    new HeroSlider();
    new TestimonialsSlider();
    new FAQAccordion();
    new GalleryModal();
    new ContactForm();
    new SmoothScroll();
    new ScrollAnimations();
    
    // Add current year to footer
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Parallax effect for gallery background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.circles-image img');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px) scale(1.1)`;
        });
    });
    
    // Add animation to cards on hover
    document.querySelectorAll('.help-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ===== Service Worker Registration (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}
