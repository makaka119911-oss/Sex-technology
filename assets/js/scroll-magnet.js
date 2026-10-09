/**
 * Плавный довод к началу секции — «магнит» прокрутки.
 *
 * Зачем: на телефоне у нас ничего между блоками не доводит, и прокрутка встаёт «как попало»:
 * посетитель останавливается за 20–140 px до начала блока, и стык висит в середине экрана.
 *
 * Как работает (тот же приём, что на сайте-музее LADARA, там он обкатан):
 *   · срабатывает по событию `scrollend` — то есть когда палец отпущен и инерция закончилась;
 *   · тянет только если до начала секции осталось меньше 140 px; дальше — не трогает вовсе;
 *   · доводит родной плавной прокруткой браузера: кадры ровные, а новое касание её отменяет;
 *   · если до стыка меньше 2 px — не трогает (иначе наш же довод заводил бы новый);
 *   · `prefers-reduced-motion` — не включается совсем.
 *
 * Область: до 1024 px. На большом экране у сайта своё CSS-прилипание
 * (`html.section-snap-enabled { scroll-snap-type: y proximity }` в enhancements.css) —
 * два механизма одновременно спорили бы друг с другом.
 *
 * Выключить: window.__SITE_ENHANCEMENTS__.scrollMagnet = false (до загрузки скрипта).
 */
(function initScrollMagnet() {
    const cfg = window.__SITE_ENHANCEMENTS__ || {};
    if (cfg.scrollMagnet === false) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 1023px)');
    const THRESHOLD = 140;   // ближе этого — доводим

    function joints() {
        const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        return Array.prototype.map.call(
            document.querySelectorAll('#main > .section'),
            function (s) { return Math.min(max, Math.round(s.getBoundingClientRect().top + window.scrollY)); }
        );
    }

    function settle() {
        if (reduced.matches || !narrow.matches) return;
        if (document.body.style.overflow === 'hidden') return;   // открыто меню или шторка
        const y = window.scrollY;
        let best = null, bestD = Infinity;
        joints().forEach(function (t) {
            const d = Math.abs(t - y);
            if (d < bestD) { bestD = d; best = t; }
        });
        if (best === null || bestD < 2 || bestD > THRESHOLD) return;
        window.scrollTo({ top: best, behavior: 'smooth' });
    }

    if ('onscrollend' in window) {
        window.addEventListener('scrollend', settle, { passive: true });
    } else {
        let timer = null;
        window.addEventListener('scroll', function () {
            clearTimeout(timer);
            timer = setTimeout(settle, 160);
        }, { passive: true });
    }
})();
