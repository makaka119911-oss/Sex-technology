export async function sendOrderConfirmationEmail(params: {
  to: string
  orderNumber: string
  totalRub: number
  deliveryRub: number
  /** Число строк в заказе (без названий в письме — конфиденциальность) */
  uniqueLines: number
  /** Суммарное количество единиц товара */
  unitsTotal: number
  deliveryMethodLabel: string
}) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!key || !from || !params.to.trim()) return

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;">
<p>Здравствуйте!</p>
<p>Ваш заказ <strong>${escapeHtml(params.orderNumber)}</strong> принят.</p>
<p>Позиций в заказе: <strong>${params.uniqueLines}</strong>, всего единиц: <strong>${params.unitsTotal}</strong>.</p>
<p><em>Наименования товаров в письме не указываются</em> — так мы сохраняем вашу конфиденциальность в переписке.</p>
<p>Доставка (${escapeHtml(params.deliveryMethodLabel)}): ${formatMoney(params.deliveryRub)}</p>
<p><strong>Итого: ${formatMoney(params.totalRub)}</strong></p>
<p>Спасибо за заказ.</p>
</body></html>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to.trim()],
      subject: `Заказ ${params.orderNumber} принят`,
      html,
    }),
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Resend: ${res.status} ${t}`)
  }
}

export async function sendOrderStatusEmail(params: {
  to: string
  orderNumber: string
  statusLabel: string
}) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!key || !from || !params.to.trim()) return

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;">
<p>Здравствуйте!</p>
<p>Статус заказа <strong>${escapeHtml(params.orderNumber)}</strong> изменён: <strong>${escapeHtml(params.statusLabel)}</strong>.</p>
</body></html>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to.trim()],
      subject: `Заказ ${params.orderNumber}: ${params.statusLabel}`,
      html,
    }),
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Resend: ${res.status} ${t}`)
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatMoney(n: number) {
  return `${Math.round(n).toLocaleString("ru-RU")} ₽`
}
