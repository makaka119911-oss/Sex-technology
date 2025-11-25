// Age Verification
document.addEventListener('DOMContentLoaded', function() {
    // Проверка возраста только при первом посещении
    if (!localStorage.getItem('ageVerified')) {
        document.getElementById('age-verification').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Подтверждение возраста
    document.getElementById('age-confirm').addEventListener('click', function() {
        localStorage.setItem('ageVerified', 'true');
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
        // Создаем уведомление
        alert(message); // Простой alert вместо сложного уведомления
    }

    // Subscribe Form Handler
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            const message = `📧 Новая подписка на рассылку\n\nEmail: ${email}`;
            sendToTelegram(message);
            
            this.reset();
            showNotification('Спасибо за подписку! Проверьте вашу почту для получения бесплатного гайда.');
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
            
            const telegramMessage = `📞 Новая заявка с сайта\n\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}\nУслуга: ${service}\nСообщение: ${message}`;
            sendToTelegram(telegramMessage);
            
            this.reset();
            showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
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
            
            const telegramMessage = `🎓 Новая заявка на тренинг\n\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}\nПакет: ${package}`;
            sendToTelegram(telegramMessage);
            
            this.reset();
            showNotification('Спасибо за вашу заявку! Мы свяжемся с вами для подтверждения записи.');
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

    // Mobile menu toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.className = 'mobile-menu-btn';
    
    const headerInner = document.querySelector('.header-inner');
    const nav = document.querySelector('.nav');
    
    if (headerInner && nav) {
        headerInner.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-active');
        });
        
        // Close mobile menu when clicking on links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-active');
            });
        });
    }
});
