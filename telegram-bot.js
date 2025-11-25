// Telegram Bot Integration
class TelegramBot {
    constructor() {
        this.token = '8511281654:AAFc-7eif0tGwB9bFvp_lrnibLYNYdQgvmw';
        this.chatId = '846572018';
        this.baseUrl = `https://api.telegram.org/bot${this.token}`;
    }
    
    async sendMessage(text) {
        try {
            const response = await fetch(`${this.baseUrl}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: text,
                    parse_mode: 'HTML'
                })
            });
            
            const result = await response.json();
            return result.ok;
        } catch (error) {
            console.error('Error sending message to Telegram:', error);
            return false;
        }
    }
    
    async sendApplication(formData, formType = 'general') {
        let message = '';
        
        switch(formType) {
            case 'training':
                message = this.formatTrainingApplication(formData);
                break;
            case 'consultation':
                message = this.formatConsultationApplication(formData);
                break;
            case 'contact':
                message = this.formatContactApplication(formData);
                break;
            case 'newsletter':
                message = this.formatNewsletterSubscription(formData);
                break;
            default:
                message = this.formatGeneralApplication(formData);
        }
        
        return await this.sendMessage(message);
    }
    
    formatTrainingApplication(data) {
        return `
🎯 <b>Новая заявка на тренинг</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
💼 <b>Пакет:</b> ${data.package}
📝 <b>Сообщение:</b> ${data.message || 'Не указано'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> Страница тренинга
        `;
    }
    
    formatConsultationApplication(data) {
        return `
🤝 <b>Запрос на консультацию</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
🎯 <b>Услуга:</b> ${data.service || 'Не указана'}
📝 <b>Ситуация:</b> ${data.message || 'Не указана'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> Страница услуг
        `;
    }
    
    formatContactApplication(data) {
        return `
📞 <b>Новое сообщение с сайта</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone || 'Не указан'}
📧 <b>Email:</b> ${data.email}
🎯 <b>Услуга:</b> ${data.service || 'Не указана'}
📝 <b>Сообщение:</b> ${data.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> Страница контактов
        `;
    }
    
    formatNewsletterSubscription(data) {
        return `
📧 <b>Новая подписка на рассылку</b>

📧 <b>Email:</b> ${data.email}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> Главная страница
        `;
    }
    
    formatGeneralApplication(data) {
        return `
🆕 <b>Новая заявка с сайта</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone || 'Не указан'}
📧 <b>Email:</b> ${data.email}
📝 <b>Сообщение:</b> ${data.message || 'Не указано'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
        `;
    }
}

// Initialize Telegram Bot
const telegramBot = new TelegramBot();

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[data-telegram]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formType = this.getAttribute('data-telegram');
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Отправка...';
            
            try {
                const result = await telegramBot.sendApplication(data, formType);
                
                if (result) {
                    // Success
                    submitBtn.textContent = '✓ Успешно отправлено!';
                    submitBtn.style.background = '#4CAF50';
                    this.reset();
                    
                    // Show success message
                    showNotification('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                    
                    // Track conversion
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': formType,
                            'event_label': 'success'
                        });
                    }
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.textContent = '❌ Ошибка отправки';
                submitBtn.style.background = '#f44336';
                
                showNotification('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.', 'error');
            } finally {
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Allow manual close
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
}

// Add loading spinner styles
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .notification {
        cursor: pointer;
    }
`;
document.head.appendChild(style);
