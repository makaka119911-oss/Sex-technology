# Lead Worker (VK)

Безопасная отправка заявок с сайта в VK: токен хранится в секретах Cloudflare Worker, а не в `assets/js/script.js`.

## 1) Установка

```bash
npm i -g wrangler
cd backend/lead-worker
wrangler login
```

## 2) Секреты

```bash
wrangler secret put VK_TOKEN
```

Вставьте новый токен сообщества VK (старый не используйте).

## 3) Проверка user id

В `wrangler.toml` уже задан:

- `VK_USER_ID = "34157047"`

Если получатель изменится, обновите значение.

## 4) Деплой

```bash
wrangler deploy
```

После деплоя получите URL вида:

- `https://sex-technology-lead-worker.<subdomain>.workers.dev`

## 5) Подключение на сайте

В `index.html` найдите:

```html
<script>
  window.__LEAD_BACKEND_URL__ = '';
</script>
```

И вставьте URL worker:

```html
<script>
  window.__LEAD_BACKEND_URL__ = 'https://...workers.dev';
</script>
```

После этого форма будет отправляться в VK через backend.

## Важно

- Не храните VK токен в репозитории.
- Если токен где-то засветился, сразу перевыпускайте.
