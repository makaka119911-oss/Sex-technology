/** Уведомление администратору о новом заказе (Telegram Bot API) */

export async function notifyTelegramNewOrder(params: {
  orderNumber: string
  totalRub: number
  customerName: string
  customerPhone: string
  linesSummary: string
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId) return

  const text = [
    "🛒 Новый заказ",
    "",
    `№ ${params.orderNumber}`,
    `Сумма: ${Math.round(params.totalRub).toLocaleString("ru-RU")} ₽`,
    `Клиент: ${params.customerName}`,
    `Тел.: ${params.customerPhone}`,
    "",
    params.linesSummary,
  ].join("\n")

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    },
  )

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Telegram: ${res.status} ${t}`)
  }
}
