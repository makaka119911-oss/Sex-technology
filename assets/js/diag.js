/**
 * Диагностика кадров — включается флагом в адресе: ?diag=1
 *
 * Зачем: плавность нельзя мерить в эмуляторе (там счётчик кадров шумит), а на телефоне
 * владелец сайта сам видит цифры и не верит на слово.
 *
 * Что показывает в углу (мелким, бронзой):
 *   к/с        — кадров в секунду в среднем за последнюю секунду
 *   >33 мс      — сколько кадров оказались длиннее 33 мс (это уже заметный рывок при 30 к/с)
 *   худший      — самый долгий кадр за замер, в миллисекундах
 *
 * Как смотреть: «?diag=1» в конце адреса. Листать страницу и смотреть: в покое должно быть
 * 55–60 к/с и почти ноль кадров >33 мс; рывки видно как всплески «худший».
 * Выключить — открыть адрес без флага. Ничего не ломает: без флага скрипт сразу выходит.
 */
(function initDiag() {
    if (!/[?&]diag=1\b/.test(location.search)) return;
    if (window.__diagOn) return;
    window.__diagOn = true;

    const box = document.createElement('div');
    box.setAttribute('aria-hidden', 'true');
    box.style.cssText = [
        'position:fixed', 'left:8px', 'bottom:8px', 'z-index:99',
        'padding:6px 9px', 'border-radius:8px',
        'background:rgba(21,18,15,.86)', 'color:#c9a15e',
        'font:500 11px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace',
        'letter-spacing:.04em', 'pointer-events:none', 'white-space:pre',
        'box-shadow:0 6px 18px rgba(0,0,0,.4)'
    ].join(';');
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(box));

    let frames = 0, long = 0, worst = 0, t0 = performance.now(), last = t0;

    function tick(now) {
        const dt = now - last;
        last = now;
        frames++;
        if (dt > 33) long++;
        if (dt > worst) worst = dt;
        if (now - t0 >= 1000) {
            const fps = frames * 1000 / (now - t0);
            box.textContent = `к/с ${fps.toFixed(0)}   >33мс ${long}   худший ${worst.toFixed(0)}`;
            frames = 0; long = 0; worst = 0; t0 = now;
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();
