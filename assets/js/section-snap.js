/**
 * Полноэкранные секции: класс на html + подсветка активного блока.
 * Отключить: window.__SITE_ENHANCEMENTS__.sectionSnap = false
 */
(function initSectionSnap() {
    const cfg = window.__SITE_ENHANCEMENTS__ || {};
    if (cfg.sectionSnap === false) return;

    const mq = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer = null;

    function enable() {
        if (!mq.matches) return;
        document.documentElement.classList.add('section-snap-enabled');

        const sections = document.querySelectorAll('#main > .section');
        if (!sections.length || observer) return;

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle('section--in-view', entry.isIntersecting && entry.intersectionRatio > 0.38);
                });
            },
            { threshold: [0.2, 0.38, 0.55] }
        );

        sections.forEach((section) => observer.observe(section));
    }

    function disable() {
        document.documentElement.classList.remove('section-snap-enabled');
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        document.querySelectorAll('#main > .section.section--in-view').forEach((el) => {
            el.classList.remove('section--in-view');
        });
    }

    function sync() {
        if (mq.matches) enable();
        else disable();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sync);
    } else {
        sync();
    }

    mq.addEventListener('change', sync);
})();
