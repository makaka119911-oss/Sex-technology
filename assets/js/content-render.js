/**
 * Рендер services.json / events.json в существующие секции.
 * При ошибке загрузки HTML остаётся как есть.
 * Отключить: window.__SITE_ENHANCEMENTS__.contentJson = false
 */
(function initContentJson() {
    const cfg = window.__SITE_ENHANCEMENTS__ || {};
    if (cfg.contentJson === false) return;

    const DATA_BASE = 'assets/data';

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function renderServices(data, mount) {
        const frag = document.createDocumentFragment();
        data.items.forEach((item) => {
            const card = el('article', 'help-card');
            if (item.collapsible) card.classList.add('mobile-collapsible-item', 'is-collapsed-mobile');

            const iconWrap = el('div', 'help-icon');
            const icon = el('i', `fas ${item.icon}`);
            icon.setAttribute('aria-hidden', 'true');
            iconWrap.appendChild(icon);

            card.appendChild(iconWrap);
            card.appendChild(el('h3', null, item.title));
            card.appendChild(el('p', null, item.text));
            frag.appendChild(card);
        });
        mount.replaceChildren(frag);
    }

    function renderMetaItem(item) {
        const span = el('span', 'event-meta-item');
        const icon = el('i', `fas ${item.icon}`);
        icon.setAttribute('aria-hidden', 'true');
        span.appendChild(icon);
        span.appendChild(el('span', null, item.text));
        return span;
    }

    function renderParagraph(className, text) {
        return el('p', className ? `event-desc ${className}` : 'event-desc', text);
    }

    function renderEvent(event, index) {
        const article = el('article', 'event-card event-card--featured');
        const cardId = `event-card-${index + 1}`;
        article.id = cardId;
        const layout = el('div', 'event-featured-layout');

        const posterWrap = el('div', 'event-poster-wrap');
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.srcset = event.poster.webp;
        source.type = 'image/webp';
        const img = document.createElement('img');
        img.src = event.poster.jpg;
        img.alt = event.poster.alt;
        img.className = 'event-poster';
        img.width = 1080;
        img.height = 1350;
        img.loading = 'lazy';
        img.decoding = 'async';
        picture.appendChild(source);
        picture.appendChild(img);
        posterWrap.appendChild(picture);
        layout.appendChild(posterWrap);

        const body = el('div', 'event-featured-body');
        const meta = el('div', 'event-meta');
        event.meta.forEach((m) => meta.appendChild(renderMetaItem(m)));
        body.appendChild(meta);
        body.appendChild(el('h3', 'event-title', event.title));
        body.appendChild(renderParagraph('event-desc--hosts', event.hosts));
        body.appendChild(renderParagraph(null, event.intro));

        const more = el('div', 'event-body-more mobile-collapsible-item is-collapsed-mobile');
        event.moreParagraphs.forEach((text, i) => {
            const cls = i === event.moreParagraphs.length - 1 ? 'event-desc--lead' : null;
            more.appendChild(renderParagraph(cls, text));
        });

        const doors = el('div', 'event-doors event-doors--keys');
        doors.setAttribute('role', 'list');
        event.doors.forEach((door) => {
            const doorEl = el('div', `event-door event-door--${door.mod}`);
            doorEl.setAttribute('role', 'listitem');
            doorEl.appendChild(el('h4', 'event-door-title', door.title));
            doorEl.appendChild(el('p', null, door.text));
            doors.appendChild(doorEl);
        });
        more.appendChild(doors);

        event.closingParagraphs.forEach((text, i) => {
            const isLast = i === event.closingParagraphs.length - 1;
            const isHighlight = i === event.closingParagraphs.length - 2;
            let cls = null;
            if (isHighlight) cls = 'event-desc--highlight';
            more.appendChild(renderParagraph(cls, text));
        });
        body.appendChild(more);

        const toggleWrap = el('div', 'mobile-collapsible-toggle mobile-collapsible-toggle--events');
        const toggleBtn = el('button', 'btn btn-secondary');
        toggleBtn.type = 'button';
        // своя карточка: иначе updateState() в script.js применяет состояние
        // одной кнопки ко ВСЕМ карточкам секции (побеждала последняя) —
        // из-за этого «Читать полностью» не раскрывал текст.
        toggleBtn.dataset.target = `#${cardId}`;
        toggleBtn.dataset.items = '.event-body-more';
        toggleBtn.dataset.expandLabel = 'Читать полностью';
        toggleBtn.dataset.collapseLabel = 'Свернуть';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-controls', cardId);

        // Плавность: анимируем ТОЧНУЮ высоту блока, а не «потолок» max-height 4000px из CSS
        // (иначе короткая карточка раскрывалась почти мгновенно). Слушатель навешивается
        // раньше общего в script.js, поэтому срабатывает ДО переключения класса.
        toggleBtn.addEventListener('click', () => {
            const COLLAPSED = 'is-collapsed-mobile';
            const DUR = 450;
            const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
            const wasCollapsed = more.classList.contains(COLLAPSED);
            const full = more.scrollHeight; // полная высота контента (не зависит от обрезки)
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                more.style.maxHeight = '';
                more.style.transition = '';
                more.removeEventListener('transitionend', finish);
            };
            // 1) мгновенно ставим точную стартовую высоту (иначе анимация ехала от CSS-потолка 4000px)
            more.style.transition = 'none';
            more.style.maxHeight = wasCollapsed ? '0px' : `${full}px`;
            void more.offsetHeight;
            // 2) включаем переход и едем к целевой высоте
            more.style.transition = `max-height ${DUR}ms ${EASE}, opacity ${Math.round(DUR * 0.7)}ms ease`;
            more.style.maxHeight = wasCollapsed ? `${full}px` : '0px';
            void more.offsetHeight;
            more.addEventListener('transitionend', finish);
            setTimeout(finish, DUR + 120);
        });
        const toggleSpan = el('span', null, 'Читать полностью');
        const toggleIcon = el('i', 'fas fa-chevron-down');
        toggleIcon.setAttribute('aria-hidden', 'true');
        toggleBtn.appendChild(toggleSpan);
        toggleBtn.appendChild(toggleIcon);
        toggleWrap.appendChild(toggleBtn);
        body.appendChild(toggleWrap);

        body.appendChild(renderParagraph('event-desc--price', event.priceNote));

        const contacts = renderParagraph('event-desc--contacts', '');
        contacts.append('Запись: ');
        event.contacts.forEach((c, i) => {
            if (i > 0) contacts.append(' · ');
            const link = document.createElement('a');
            link.href = c.href;
            link.className = 'event-contact-link';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = c.label;
            contacts.appendChild(link);
        });
        body.appendChild(contacts);

        const cta = document.createElement('a');
        cta.href = event.ctaHref;
        cta.className = 'btn btn-primary event-cta';
        cta.appendChild(el('span', null, event.ctaLabel));
        const ctaIcon = el('i', 'fas fa-arrow-right');
        ctaIcon.setAttribute('aria-hidden', 'true');
        cta.appendChild(ctaIcon);
        body.appendChild(cta);

        layout.appendChild(body);
        article.appendChild(layout);
        return article;
    }

    function renderEvents(data, mount) {
        const frag = document.createDocumentFragment();
        data.items.forEach((event, i) => frag.appendChild(renderEvent(event, i)));
        mount.replaceChildren(frag);
    }

    async function hydrate() {
        const servicesMount = document.querySelector('[data-json-mount="services"]');
        const eventsMount = document.querySelector('[data-json-mount="events"]');

        const tasks = [];

        if (servicesMount) {
            tasks.push(
                fetch(`${DATA_BASE}/services.json?v=1`)
                    .then((r) => {
                        if (!r.ok) throw new Error('services.json');
                        return r.json();
                    })
                    .then((data) => {
                        if (!data?.items?.length) throw new Error('services empty');
                        renderServices(data, servicesMount);
                        servicesMount.classList.add('is-json-rendered');
                    })
            );
        }

        if (eventsMount) {
            tasks.push(
                fetch(`${DATA_BASE}/events.json?v=20261031`)
                    .then((r) => {
                        if (!r.ok) throw new Error('events.json');
                        return r.json();
                    })
                    .then((data) => {
                        if (!data?.items?.length) throw new Error('events empty');
                        renderEvents(data, eventsMount);
                        eventsMount.classList.add('is-json-rendered');
                    })
            );
        }

        try {
            await Promise.all(tasks);
            document.dispatchEvent(new CustomEvent('content:hydrated'));
        } catch (err) {
            console.warn('[content-render] Оставляем HTML-фолбэк:', err.message || err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hydrate);
    } else {
        hydrate();
    }
})();
