// Конфигурация Telegram
const TELEGRAM_BOT_TOKEN = '8511281654:AAFc-7eif0tGwB9bFvp_lrnibLYNYdQgvmw';
const TELEGRAM_CHAT_ID = '846572018';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initFormHandler();
    initSmoothScroll();
});

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Закрываем мобильное меню после клика
                const mainNav = document.querySelector('.main-nav');
                if (mainNav) {
                    mainNav.classList.remove('active');
                }
            }
        });
    });
}

// Обработка формы
function initFormHandler() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            service: formData.get('service'),
            message: formData.get('message') || 'Не указано'
        };
        
        // Валидация
        if (!data.name || !data.phone || !data.email || !data.service) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            const success = await sendToTelegram(data);
            
            if (success) {
                alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                form.reset();
            } else {
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
            }
        } catch (error) {
            alert('Ошибка сети. Пожалуйста, проверьте соединение и попробуйте еще раз.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Отправка в Telegram
async function sendToTelegram(data) {
    const message = `
🎯 Новая заявка на тренинг

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
                text: message
            })
        });

        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

// Вспомогательная функция для прокрутки к секции
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Простая валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Простая валидация телефона
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
