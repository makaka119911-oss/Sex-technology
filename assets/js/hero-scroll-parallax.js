/**
 * Лёгкий scroll-parallax на фоне слайдов 2–3 (десктоп).
 * Отключить: window.__SITE_ENHANCEMENTS__.heroScrollParallax = false
 */
(function initHeroScrollParallax() {
    const cfg = window.__SITE_ENHANCEMENTS__ || {};
    if (cfg.heroScrollParallax === false) return;

    const mq = window.matchMedia(
        '(min-width: 769px) and (prefers-reduced-motion: no-preference)'
    );

    const hero = document.querySelector('.hero-slider');
    const backgrounds = [
        document.querySelector('.slide--circles .slide-background.slide-hero-circles'),
        document.querySelector('.slide--desire .slide-background.slide-hero-desire'),
    ].filter(Boolean);

    if (!hero || !backgrounds.length) return;

    let ticking = false;

    function update() {
        ticking = false;
        if (!mq.matches) {
            backgrounds.forEach((bg) => {
                bg.style.transform = '';
            });
            return;
        }

        const rect = hero.getBoundingClientRect();
        const vh = window.innerHeight;

        if (rect.bottom <= 0 || rect.top >= vh) {
            backgrounds.forEach((bg) => {
                bg.style.transform = '';
            });
            return;
        }

        const progress = Math.max(0, Math.min(1, (-rect.top + vh * 0.15) / (rect.height + vh * 0.2)));
        const y = (progress - 0.5) * 14;

        backgrounds.forEach((bg) => {
            const slide = bg.closest('.slide');
            if (slide && slide.classList.contains('active')) {
                bg.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
            } else {
                bg.style.transform = '';
            }
        });
    }

    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    const slider = document.querySelector('.slider-container');
    if (slider) {
        slider.addEventListener('click', () => {
            setTimeout(requestUpdate, 80);
        });
    }

    const slideObserver = new MutationObserver(requestUpdate);
    document.querySelectorAll('.hero-slider .slide').forEach((slide) => {
        slideObserver.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });

    mq.addEventListener('change', requestUpdate);
    requestUpdate();
})();
