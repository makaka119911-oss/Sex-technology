# Lead Worker — приём заявок с сайта (Telegram + VK)

Заявка с формы сайта уходит на этот воркер, а он рассылает её **в два канала сразу**:
канал Telegram «Заявки с сайта» и личные сообщения сообщества VK.
Заявка считается доставленной, если принял хотя бы один канал.

Почему два канала: раньше форма отправляла заявку только в VK, хотя ждали её в Telegram —
в канале было пусто. Плюс Telegram API бывает недоступен из российских сетей, поэтому
отправку делает сервер (Cloudflare), а не браузер посетителя.

Токены живут **только в секретах Cloudflare**. В коде и в репозитории их нет:
раньше токен бота лежал в `assets/js/script.js` открытым текстом, а репозиторий публичный.

## Разовая настройка (один раз)

```bash
npm i -g wrangler
cd backend/lead-worker
wrangler login
```

## Обновить бота в Telegram (важно)

Старый токен был в открытом репозитории — его надо перевыпустить:

1. Открыть **@BotFather** → `/mybots` → выбрать бота → *API Token* → **Revoke current token**.
2. Скопировать новый токен и положить в секреты:

```bash
wrangler secret put TELEGRAM_BOT_TOKEN   # вставить новый токен
```

Проверить бота можно так (ответ должен быть `"ok":true`):

```bash
curl -s "https://api.telegram.org/bot<НОВЫЙ_ТОКЕН>/getMe"
```

## Секреты

```bash
wrangler secret put VK_TOKEN              # токен сообщества VK
wrangler secret put TELEGRAM_BOT_TOKEN    # токен бота Telegram
```

## Переменные (в `wrangler.toml`, без секретов)

| переменная | значение | смысл |
|---|---|---|
| `VK_USER_ID` | `34157047` | кому в VK уходят заявки |
| `TELEGRAM_CHAT_ID` | `-1002313355102` | канал «Заявки с сайта» |
| `ALLOWED_ORIGINS` | домены сайта через запятую | откуда разрешён приём заявок |

## Выкладка

```bash
wrangler deploy
```

URL воркера вида `https://sex-technology-lead-worker.<subdomain>.workers.dev`
прописан на сайте в `index.html`:

```html
<script>
  window.__LEAD_BACKEND_URL__ = 'https://sex-technology-lead-worker.territory-love.workers.dev';
</script>
```

## Проверка после выкладки

```bash
curl -s -X POST https://sex-technology-lead-worker.territory-love.workers.dev \
  -H "Origin: https://xn--c1adkgfrbtc9l.com" \
  -H "Content-Type: application/json" \
  -d '{"name":"Проверка","contact":"тест","format":"тест","message":"проверка канала"}'
```

Ответ `{"ok":true,"delivered":["telegram","vk"],...}` — заявка ушла в оба канала.
Если один канал упал, он будет в `details` с текстом ошибки, а заявка всё равно дойдёт
через второй. Если упали оба — ответ `502`, и на сайте появится честное сообщение
об ошибке, а не «Спасибо» при потерянной заявке.

## Чего здесь больше нет

Локальный (браузерный) путь отправки в Telegram через токен в `script.js` — удалён.
Если бэкенд не настроен, форма честно сообщает, что приём заявок недоступен.
