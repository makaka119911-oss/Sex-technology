// Age Verification - показывается только при первом входе
document.addEventListener('DOMContentLoaded', function() {
    // Проверка возраста только при первом посещении
    if (!sessionStorage.getItem('ageVerified')) {
        document.getElementById('age-verification').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Подтверждение возраста
    document.getElementById('age-confirm').addEventListener('click', function() {
        sessionStorage.setItem('ageVerified', 'true');
        document.getElementById('age-verification').style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Отказ
    document.getElementById('age-deny').addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });

    // Telegram Bot Configuration
    const TELEGRAM_BOT_TOKEN = '8511281654:AAFc-7eif0tGwB9bFvp_lrnibLYNYdQgvmw';
    const TELEGRAM_CHAT_ID = '846572018';
    
    // Функция отправки в Telegram
    function sendToTelegram(message) {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Message sent to Telegram:', data);
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
        })
        .catch(error => {
            console.error('Error sending message to Telegram:', error);
            showNotification('Ошибка отправки. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
        });
    }

    // Показать уведомление
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Обработчики для всех кнопок "Записаться"
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            
            if (buttonText.includes('Записаться') || buttonText.includes('Забронировать') || 
                buttonText.includes('Выбрать') || buttonText.includes('Подробнее')) {
                
                if (buttonText.includes('тренинг') || buttonText.includes('Выбрать') || buttonText.includes('Забронировать')) {
                    // Прокрутка к форме на странице тренинга
                    const trainingForm = document.getElementById('training-form-section');
                    if (trainingForm) {
                        e.preventDefault();
                        trainingForm.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // Если формы нет на странице, переходим на страницу тренинга
                        window.location.href = 'training.html';
                    }
                } else if (buttonText.includes('консультацию')) {
                    // Прокрутка к форме контактов
                    const contactForm = document.getElementById('contact-form');
                    if (contactForm) {
                        e.preventDefault();
                        contactForm.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.location.href = 'contacts.html';
                    }
                } else if (buttonText.includes('Подробнее')) {
                    if (buttonText.includes('нас')) {
                        window.location.href = 'about.html';
                    } else if (buttonText.includes('тренинг') || this.closest('.service-card')) {
                        window.location.href = 'training.html';
                    } else if (this.closest('.blog-card')) {
                        // Для блога - заглушка
                        e.preventDefault();
                        showNotification('Статья скоро будет доступна!');
                    }
                }
            }
        });
    });

    // Subscribe Form Handler
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            const message = `📧 <b>Новая подписка на рассылку</b>\n\nEmail: ${email}`;
            sendToTelegram(message);
            
            this.reset();
        });
    }
    
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const phone = this.querySelector('input[name="phone"]').value;
            const service = this.querySelector('select[name="service"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            const telegramMessage = `📞 <b>Новая заявка с сайта</b>\n\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}\nУслуга: ${service}\nСообщение: ${message}`;
            sendToTelegram(telegramMessage);
            
            this.reset();
        });
    }
    
    // Training Registration Form Handler
    const trainingForm = document.getElementById('training-form');
    if (trainingForm) {
        trainingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const phone = this.querySelector('input[name="phone"]').value;
            const package = this.querySelector('select[name="package"]').value;
            
            const telegramMessage = `🎓 <b>Новая заявка на тренинг</b>\n\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}\nПакет: ${package}`;
            sendToTelegram(telegramMessage);
            
            this.reset();
        });
    }
    
    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    
    // Blog Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            blogCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--primary-color);
        cursor: pointer;
    `;

    const headerInner = document.querySelector('.header-inner');
    const nav = document.querySelector('.nav');
    
    if (headerInner && nav) {
        headerInner.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-active');
        });
    }
});
