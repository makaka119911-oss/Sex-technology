/**
 * Hero crossfade+zoom, golden wipe, card stagger.
 * Отключить: window.__SITE_ENHANCEMENTS__.heroCrossfadeZoom / heroGoldenWipe / cardStagger = false
 */
(function initMotionEnhancements() {
    const cfg = window.__SITE_ENHANCEMENTS__ || {};
    const zoom = cfg.heroCrossfadeZoom !== false;
    const wipe = cfg.heroGoldenWipe !== false;
    const stagger = cfg.cardStagger !== false;

    if (!zoom && !wipe && !stagger) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (zoom && !reduced.matches) {
        document.documentElement.classList.add('hero-motion-enhanced');
    }

    const STAGGER_GROUPS =
        '.experts-grid, .help-cards, .levels-container, .gallery-grid, .events-grid, .faq-grid';

    function applyCardStagger() {
        if (!stagger) return;

        document.querySelectorAll(STAGGER_GROUPS).forEach((group) => {
            Array.from(group.children).forEach((child, index) => {
                if (!child.classList.contains('reveal-on-scroll')) return;
                child.classList.remove('reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3');
                child.classList.add(`reveal-stagger-${Math.min(index, 8)}`);
            });
        });
    }

    let wipeEl = null;
    let lastHeroSlide = null;

    function playGoldenWipe() {
        if (!wipe || reduced.matches || !wipeEl) return;
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
        playGoldenWipe();
    }

    function boot() {
        applyCardStagger();

        if (wipe) {
            const hero = document.querySelector('.hero-slider');
            if (hero && !hero.querySelector('.hero-golden-wipe')) {
                wipeEl = document.createElement('div');
                wipeEl.className = 'hero-golden-wipe';
                wipeEl.setAttribute('aria-hidden', 'true');
                hero.appendChild(wipeEl);
            }
            document.addEventListener('hero:slide-change', onHeroSlideChange);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    document.addEventListener('content:hydrated', applyCardStagger);

    reduced.addEventListener('change', () => {
        if (reduced.matches) {
            document.documentElement.classList.remove('hero-motion-enhanced');
        } else if (zoom) {
            document.documentElement.classList.add('hero-motion-enhanced');
        }
    });
})();
