// Бургер-меню
const burger = document.querySelector('.burger');
const nav = document.querySelector('.main-nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
  });
  
  // Закрытие меню при клике на ссылку
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      burger.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });
  
  // Закрытие меню при клике вне его
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav') && !e.target.closest('.burger') && nav.classList.contains('active')) {
      nav.classList.remove('active');
      burger.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

// Плавный скролл к форме
const scrollBtn = document.querySelector('.js-scroll-to-form');
const formSection = document.querySelector('#contact');

if (scrollBtn && formSection) {
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    formSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// Анимация появления элементов при скролле
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

// Наблюдаем за элементами с классом fade-in
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// Обработка формы
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

if (form && statusEl) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      contact: formData.get('contact'),
      format: formData.get('format'),
      message: formData.get('message'),
      date: new Date().toISOString()
    };
    
    // Показываем сообщение об отправке
    statusEl.textContent = 'Отправляем заявку...';
    statusEl.style.color = 'var(--color-text)';
    
    try {
      // В реальном проекте здесь будет fetch на ваш сервер
      // Для демонстрации используем setTimeout для имитации отправки
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Показываем сообщение об успехе
      statusEl.textContent = 'Спасибо! Мы получили вашу заявку и скоро свяжемся с вами.';
      statusEl.style.color = '#2e7d32';
      
      // Очистка формы через 5 секунд
      setTimeout(() => {
        form.reset();
        statusEl.textContent = '';
      }, 5000);
      
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      statusEl.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.';
      statusEl.style.color = '#d32f2f';
    }
  });
}

// Изменение стиля header при скролле
let lastScrollTop = 0;
const header = document.querySelector('.site-header');

if (header) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
      header.style.backgroundColor = 'rgba(247, 249, 250, 0.98)';
    } else {
      header.style.boxShadow = 'none';
      header.style.backgroundColor = 'rgba(247, 249, 250, 0.95)';
    }
    
    // Скрытие/показ header при скролле
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Прокрутка вниз - скрываем header
      header.style.transform = 'translateY(-100%)';
    } else {
      // Прокрутка вверх - показываем header
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// Плавный скролл для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Закрываем меню на мобильных
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        burger.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
      
      // Плавный скролл к элементу
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Показываем элементы в hero сразу
  const heroElements = document.querySelectorAll('.hero .fade-in');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('animated');
    }, index * 200);
  });
});
