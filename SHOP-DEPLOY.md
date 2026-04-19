# Магазин (`my-clone/`)

- **GitHub Pages** (этот репозиторий) отдаёт только статический лендинг (`index.html`). Полноценный Next.js там не запускается.
- **Магазин на Vercel (текущий URL):** `https://my-clone-lac-eight.vercel.app/shop`  
  В шапке `index.html` кнопка «Магазин» ведёт на этот адрес (новая вкладка).
- После смены домена/проекта на Vercel обнови `href` у ссылки «Магазин» в `index.html`.
- **Переменные** в Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (см. `my-clone/.env.example`).

Чтобы **xn--c1adkgfrbtc9l.com** обновился: домен должен указывать на **этот** репозиторий (GitHub Pages из `main` / нужный branch) и нужен **push** + 1–2 минуты на сборку Pages.
