/**
 * Приём заявок с сайта «Сексология».
 *
 * Отправляет заявку сразу в ДВА канала:
 *   1) Telegram — канал «Заявки с сайта» (токен в секретах Cloudflare, НЕ в коде);
 *   2) VK — личные сообщения сообщества (как было).
 *
 * Заявка считается доставленной, если её принял хотя бы один канал.
 * Если оба упали — вернём ошибку, и на сайте появится честное сообщение,
 * а не «Спасибо» при потерянной заявке.
 *
 * Секреты (задаются через `wrangler secret put`):
 *   VK_TOKEN            — токен сообщества VK
 *   TELEGRAM_BOT_TOKEN  — токен бота Telegram
 * Переменные (wrangler.toml [vars]):
 *   VK_USER_ID, TELEGRAM_CHAT_ID, ALLOWED_ORIGINS
 */

function json(data, status = 200, corsOrigin = "*") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": corsOrigin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  if (!origin) return allowed[0] || "*";
  return allowed.includes(origin) ? origin : "";
}

function sanitize(v) {
  return String(v ?? "").trim().slice(0, 1000);
}

/** Заявка в Telegram-канал. */
async function sendTelegram(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return { channel: "telegram", ok: false, error: "не настроен (нет токена или chat id)" };
  }
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: String(env.TELEGRAM_CHAT_ID),
          text,
          disable_web_page_preview: true,
        }),
      }
    );
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.ok === false) {
      return {
        channel: "telegram",
        ok: false,
        error: data.description || `HTTP ${resp.status}`,
      };
    }
    return { channel: "telegram", ok: true, id: data.result?.message_id };
  } catch (err) {
    return { channel: "telegram", ok: false, error: String(err?.message || err) };
  }
}

/** Заявка в личные сообщения сообщества VK. */
async function sendVk(env, text) {
  if (!env.VK_TOKEN || !env.VK_USER_ID) {
    return { channel: "vk", ok: false, error: "не настроен (нет токена или user id)" };
  }
  try {
    const params = new URLSearchParams({
      user_id: String(env.VK_USER_ID),
      random_id: String(Date.now()),
      message: text,
      access_token: String(env.VK_TOKEN),
      v: "5.199",
    });
    const resp = await fetch(`https://api.vk.com/method/messages.send?${params.toString()}`);
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.error) {
      return {
        channel: "vk",
        ok: false,
        error: data.error?.error_msg || `HTTP ${resp.status}`,
      };
    }
    return { channel: "vk", ok: true, id: data.response };
  } catch (err) {
    return { channel: "vk", ok: false, error: String(err?.message || err) };
  }
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);

    if (request.method === "OPTIONS") {
      if (!origin) return new Response("Forbidden", { status: 403 });
      return json({ ok: true }, 200, origin);
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, origin || "*");
    }

    if (!origin) {
      return json({ ok: false, error: "Origin not allowed" }, 403, "*");
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, origin);
    }

    const name = sanitize(body.name);
    const contact = sanitize(body.contact);
    const format = sanitize(body.format);
    const message = sanitize(body.message) || "Не указано";
    const date = sanitize(body.date || new Date().toLocaleString("ru-RU"));

    if (!name || !contact) {
      return json({ ok: false, error: "Name and contact are required" }, 400, origin);
    }

    const text =
      "📝 НОВАЯ ЗАЯВКА С САЙТА\n\n" +
      `👤 Имя: ${name}\n` +
      `📞 Контакт: ${contact}\n` +
      `🎯 Формат: ${format || "Не указан"}\n` +
      `📝 Сообщение: ${message}\n` +
      `📅 Дата: ${date}`;

    // Оба канала параллельно: если один лежит, заявка всё равно дойдёт.
    const results = await Promise.all([sendTelegram(env, text), sendVk(env, text)]);
    const delivered = results.filter((r) => r.ok);

    if (!delivered.length) {
      return json(
        { ok: false, error: "Не удалось доставить заявку ни в один канал", details: results },
        502,
        origin
      );
    }

    return json({ ok: true, delivered: delivered.map((r) => r.channel), details: results }, 200, origin);
  },
};
