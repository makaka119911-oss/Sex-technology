# Магазин (`my-clone/`)

- **GitHub Pages** отдаёт статический лендинг (`index.html`). Next.js на Pages не запускается.
- **Основной домен лендинга:** `https://сексология.com/` (ASCII: `https://xn--c1adkgfrbtc9l.com/`)
- В файле **`CNAME`** указано `сексология.com` — после push в GitHub: **Settings → Pages → Custom domain** добавь тот же домен и включи HTTPS.
- **DNS у регистратора** для apex (корень домена) добавь **A-записи** GitHub Pages:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`  
  (актуальный список: [документация GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site))

- **Магазин (Vercel):** `https://my-clone-lac-eight.vercel.app` — в проекте Vercel можно добавить поддомен, например `shop.сексология.com`, и тогда в `shop/index.html` заменить `__SHOP_APP_ORIGIN__` на этот URL.
- **Переменные** в Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (см. `my-clone/.env.example`).

Пока DNS не привязан, лендинг доступен по GitHub: `https://makaka119911-oss.github.io/Sex-technology/`
