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

    if (!env.VK_TOKEN || !env.VK_USER_ID) {
      return json({ ok: false, error: "Server is not configured" }, 500, origin);
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

    const params = new URLSearchParams({
      user_id: String(env.VK_USER_ID),
      random_id: String(Date.now()),
      message: text,
      access_token: String(env.VK_TOKEN),
      v: "5.199",
    });

    const vkResp = await fetch(`https://api.vk.com/method/messages.send?${params.toString()}`);
    const vkData = await vkResp.json();

    if (!vkResp.ok || vkData.error) {
      return json(
        {
          ok: false,
          error: "VK API error",
          details: vkData.error?.error_msg || `HTTP ${vkResp.status}`,
        },
        502,
        origin
      );
    }

    return json({ ok: true, result: vkData.response }, 200, origin);
  },
};
