// Age Verification
document.addEventListener('DOMContentLoaded', function() {
    // Check if age has been verified
    if (!localStorage.getItem('ageVerified')) {
        document.getElementById('age-verification').style.display = 'flex';
    }
    
    // Age confirmation
    document.getElementById('age-confirm').addEventListener('click', function() {
        localStorage.setItem('ageVerified', 'true');
        document.getElementById('age-verification').style.display = 'none';
    });
    
    // Age denial
    document.getElementById('age-deny').addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });
    
    // Telegram Bot Configuration
    const TELEGRAM_BOT_TOKEN = '8511281654:AAFc-7eif0tGwB9bFvp_lrnibLYNYdQgvmw';
    const TELEGRAM_CHAT_ID = '846572018';
    
    // Function to send message to Telegram
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
        })
        .catch(error => {
            console.error('Error sending message to Telegram:', error);
        });
    }
    
    // Subscribe Form Handler
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            const message = `📧 <b>Новая подписка на рассылку</b>\n\nEmail: ${email}`;
            sendToTelegram(message);
            
            alert('Спасибо за подписку! Проверьте вашу почту для получения бесплатного гайда.');
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
            
            alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
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
            
            alert('Спасибо за вашу заявку! Мы свяжемся с вами для подтверждения записи.');
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
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
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
    
    // Mobile menu toggle (if needed in future)
    // You can add a hamburger menu for mobile if needed
});
