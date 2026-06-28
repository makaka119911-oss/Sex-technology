/**
 * Винный wipe при смене hero (десктоп). Не трогает автоплей и crossfade.
 * Выключить: window.__SITE_ENHANCEMENTS__.heroWipe = false
 */
(function initHeroWipe() {
    const cfg = window.__SITE_ENHANCEMENTS__ || {};
    if (cfg.heroWipe === false) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 769px)');

    let wipeEl = null;
    let lastHeroSlide = null;

    function syncRootClass() {
        const on = !reduced.matches && desktop.matches;
        document.documentElement.classList.toggle('hero-wipe-on', on);
    }

    function playWipe() {
        if (reduced.matches || !desktop.matches || !wipeEl) return;
        wipeEl.classList.remove('is-playing');
        void wipeEl.offsetWidth;
        wipeEl.classList.add('is-playing');
    }

    function onHeroSlideChange(e) {
        const index = e.detail?.index;
        if (typeof index !== 'number') return;

        if (lastHeroSlide === null) {
            lastHeroSlide = index;
            return;
        }
        if (lastHeroSlide === index) return;
        lastHeroSlide = index;
        playWipe();
    }

    function boot() {
        syncRootClass();
        reduced.addEventListener('change', syncRootClass);
        desktop.addEventListener('change', syncRootClass);

        const hero = document.querySelector('.hero-slider');
        if (!hero) return;

        wipeEl = hero.querySelector('.hero-wine-wipe');
        if (!wipeEl) {
            wipeEl = document.createElement('div');
            wipeEl.className = 'hero-wine-wipe';
            wipeEl.setAttribute('aria-hidden', 'true');
            hero.appendChild(wipeEl);
        }

        document.addEventListener('hero:slide-change', onHeroSlideChange);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
