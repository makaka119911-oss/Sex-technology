/**
 * Фиксированные точки справа — навигация по секциям (не hero).
 * Отключить: window.__SITE_ENHANCEMENTS__.sectionRail = false
 */
(function initSectionRail() {
    const cfg = window.__SITE_ENHANCEMENTS__ || {};
    if (cfg.sectionRail === false) return;

    const SECTIONS = [
        { id: 'about', label: 'О нас' },
        { id: 'help', label: 'Помощь' },
        { id: 'levels', label: 'Уровни' },
        { id: 'circles', label: 'Круги' },
        { id: 'gallery', label: 'Галерея' },
        { id: 'events', label: 'Афиша' },
        { id: 'testimonials', label: 'Отзывы' },
        { id: 'contact', label: 'Запись' },
    ];

    const mq = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = document.querySelector('.hero-slider');

    let rail = null;
    let buttons = [];
    let observer = null;

    function scrollToSection(id) {
        const target = document.getElementById(id);
        if (!target) return;
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const top = Math.max(0, target.offsetTop - headerHeight);

        if (id === 'about' && typeof window.openAboutSection === 'function') {
            window.openAboutSection();
        }

        window.scrollTo({
            top,
            behavior: reduced.matches ? 'auto' : 'smooth',
        });
        history.replaceState(null, '', `#${id}`);
    }

    function updateRailVisibility() {
        if (!rail || !hero) return;
        const heroBottom = hero.getBoundingClientRect().bottom;
        const show = heroBottom < window.innerHeight * 0.55;
        rail.classList.toggle('is-visible', show);
    }

    function bindObserver() {
        if (observer) observer.disconnect();
        const panels = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
        if (!panels.length) return;

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.42) {
                        const id = entry.target.id;
                        buttons.forEach((btn) => {
                            btn.setAttribute(
                                'aria-current',
                                btn.getAttribute('data-target') === id ? 'true' : 'false'
                            );
                        });
                    }
                });
            },
            { threshold: [0.42, 0.55, 0.7] }
        );

        panels.forEach((panel) => observer.observe(panel));
    }

    function mount() {
        if (!mq.matches || rail) return;

        rail = document.createElement('nav');
        rail.className = 'section-rail';
        rail.id = 'sectionRail';
        rail.setAttribute('aria-label', 'Навигация по разделам');

        SECTIONS.forEach((section, index) => {
            if (!document.getElementById(section.id)) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'section-rail__btn';
            btn.dataset.target = section.id;
            btn.setAttribute('aria-label', section.label);
            if (index === 0) btn.setAttribute('aria-current', 'true');

            const tip = document.createElement('span');
            tip.className = 'section-rail__tip';
            tip.textContent = section.label;
            btn.appendChild(tip);

            btn.addEventListener('click', () => scrollToSection(section.id));
            rail.appendChild(btn);
            buttons.push(btn);
        });

        if (!rail.children.length) {
            rail = null;
            return;
        }

        document.body.appendChild(rail);
        bindObserver();
        updateRailVisibility();
        window.addEventListener('scroll', updateRailVisibility, { passive: true });
    }

    function unmount() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (rail) {
            rail.remove();
            rail = null;
            buttons = [];
        }
    }

    function sync() {
        if (mq.matches) mount();
        else unmount();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sync);
    } else {
        sync();
    }

    mq.addEventListener('change', sync);
})();
