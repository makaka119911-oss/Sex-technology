/**
 * Лёгкий scroll-parallax на фоне слайдов 2–3 (десктоп).
 * Смещение через --hero-parallax-y на слайде, не transform контейнера (иначе двойной сдвиг и прыжок при смене).
 * Отключить: window.__SITE_ENHANCEMENTS__.heroScrollParallax = false
 */
(function initHeroScrollParallax() {
    const cfg = window.__SITE_ENHANCEMENTS__ || {};
    if (cfg.heroScrollParallax === false) return;

    const mq = window.matchMedia(
        '(min-width: 769px) and (prefers-reduced-motion: no-preference)'
    );

    const hero = document.querySelector('.hero-slider');
    const parallaxSlides = [
        document.querySelector('.slide--circles'),
        document.querySelector('.slide--desire'),
    ].filter(Boolean);

    if (!hero || !parallaxSlides.length) return;

    let ticking = false;

    function clearParallax(slide) {
        slide.style.removeProperty('--hero-parallax-y');
    }

    function update() {
        ticking = false;
        if (!mq.matches) {
            parallaxSlides.forEach(clearParallax);
            return;
        }

        const rect = hero.getBoundingClientRect();
        const vh = window.innerHeight;

        if (rect.bottom <= 0 || rect.top >= vh) {
            parallaxSlides.forEach(clearParallax);
            return;
        }

        const progress = Math.max(0, Math.min(1, (-rect.top + vh * 0.15) / (rect.height + vh * 0.2)));
        const y = (progress - 0.5) * 14;

        parallaxSlides.forEach((slide) => {
            if (slide.classList.contains('active')) {
                slide.style.setProperty('--hero-parallax-y', `${y.toFixed(2)}px`);
            } else {
                clearParallax(slide);
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
    parallaxSlides.forEach((slide) => {
        slideObserver.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });

    mq.addEventListener('change', requestUpdate);
    requestUpdate();
})();
