# Магазин (`my-clone/`)

- **GitHub Pages** (этот репозиторий) отдаёт только статический лендинг (`index.html`). Полноценный Next.js там не запускается.
- **Магазин** деплоится отдельно, например на **Vercel**: подключи папку `my-clone` как Root Directory или отдельный проект из этого репо.
- **Домен**: ссылка «Магазин» на лендинге должна вести на URL Vercel (или свой поддомен, CNAME на Vercel).
- **Переменные** в Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (см. `my-clone/.env.example`).
