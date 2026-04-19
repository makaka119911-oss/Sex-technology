"use server"

import { calculateDeliveryMvp } from "@/lib/delivery-pricing"
import { generateOrderNumber } from "@/lib/order-number"
import { sendOrderConfirmationEmail } from "@/lib/notifications/email"
import { notifyTelegramNewOrder } from "@/lib/notifications/telegram"
import { normalizePhone } from "@/lib/phone"
import { getServiceRoleClient } from "@/lib/supabase/admin"
import type { DeliveryAddress, DeliveryMethod } from "@/types/shop"

export type CheckoutPayload = {
  items: { productId: string; quantity: number }[]
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryMethod: DeliveryMethod
  deliveryAddress: DeliveryAddress
  customerComment: string
  discreetPackaging: boolean
  pickupPointLabel?: string
}

export async function submitOrder(payload: CheckoutPayload) {
  const admin = getServiceRoleClient()
  if (!admin) {
    return {
      ok: false as const,
      error:
        "Сервер заказов недоступен: в Vercel (Production) задайте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY; для каталога ещё NEXT_PUBLIC_SUPABASE_ANON_KEY. Сохраните и сделайте Redeploy.",
    }
  }

  if (!payload.items.length) {
    return { ok: false as const, error: "Корзина пуста" }
  }

  const ids = [...new Set(payload.items.map((i) => i.productId))]
  const { data: products, error: pe } = await admin
    .from("products")
    .select("id, price, name")
    .in("id", ids)

  if (pe || !products?.length) {
    return {
      ok: false as const,
      error: pe
        ? `Не удалось загрузить товары: ${pe.message}`
        : "В корзине устаревшие позиции (например, демо-каталог). Очистите корзину и снова добавьте товары из каталога.",
    }
  }

  const priceMap = new Map(
    products.map((p) => [p.id, { price: Number(p.price), name: String(p.name) }]),
  )

  let subtotal = 0
  const rows: {
    product_id: string
    quantity: number
    price_at_time: number
  }[] = []

  for (const item of payload.items) {
    const meta = priceMap.get(item.productId)
    if (!meta || item.quantity < 1) {
      return { ok: false as const, error: "Некорректные позиции в корзине" }
    }
    subtotal += meta.price * item.quantity
    rows.push({
      product_id: item.productId,
      quantity: item.quantity,
      price_at_time: meta.price,
    })
  }

  const itemCount = payload.items.reduce((s, i) => s + i.quantity, 0)
  const city = payload.deliveryAddress.city?.trim() || "Москва"
  const deliveryCost = calculateDeliveryMvp({
    method: payload.deliveryMethod,
    city,
    subtotalRub: subtotal,
    itemCount,
  }).priceRub
  const total = subtotal + deliveryCost
  const orderNumber = generateOrderNumber()

  const pickupLabelParts = [
    payload.deliveryAddress.pickupPoint?.label,
    payload.pickupPointLabel?.trim(),
  ].filter(Boolean)
  const pickupPointLabelMerged =
    pickupLabelParts.length > 0 ? pickupLabelParts.join("\n") : null

  const { data: order, error: oe } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: null,
      customer_name: payload.customerName.trim(),
      customer_phone: normalizePhone(payload.customerPhone),
      customer_email: payload.customerEmail.trim() || null,
      delivery_address: payload.deliveryAddress,
      delivery_method: payload.deliveryMethod,
      delivery_cost: deliveryCost,
      total_amount: total,
      status: "pending",
      discreet_packaging: payload.discreetPackaging,
      customer_comment: payload.customerComment.trim() || null,
      pickup_point_label: pickupPointLabelMerged,
    })
    .select("id, order_number")
    .single()

  if (oe || !order) {
    return {
      ok: false as const,
      error: oe?.message ?? "Не удалось создать заказ",
    }
  }

  const { error: ie } = await admin.from("order_items").insert(
    rows.map((r) => ({
      order_id: order.id,
      product_id: r.product_id,
      quantity: r.quantity,
      price_at_time: r.price_at_time,
    })),
  )

  if (ie) {
    return { ok: false as const, error: ie.message }
  }

  const deliveryMethodLabel =
    payload.deliveryMethod === "courier"
      ? "Курьер"
      : payload.deliveryMethod === "pickup"
        ? "Пункт выдачи"
        : "Почта России"

  const linesSummary = rows
    .map((r) => {
      const meta = priceMap.get(r.product_id)!
      return `• ${meta.name} ×${r.quantity}`
    })
    .join("\n")

  const unitsTotal = rows.reduce((s, r) => s + r.quantity, 0)

  try {
    const em = payload.customerEmail.trim()
    if (em) {
      await sendOrderConfirmationEmail({
        to: em,
        orderNumber,
        totalRub: total,
        deliveryRub: deliveryCost,
        uniqueLines: rows.length,
        unitsTotal,
        deliveryMethodLabel,
      })
    }
  } catch (e) {
    console.error("sendOrderConfirmationEmail", e)
  }

  try {
    await notifyTelegramNewOrder({
      orderNumber,
      totalRub: total,
      customerName: payload.customerName.trim(),
      customerPhone: normalizePhone(payload.customerPhone),
      linesSummary,
    })
  } catch (e) {
    console.error("notifyTelegramNewOrder", e)
  }

  return {
    ok: true as const,
    orderId: order.id,
    orderNumber: order.order_number,
  }
}

export async function lookupOrder(orderNumber: string, phone: string) {
  const admin = getServiceRoleClient()
  if (!admin) {
    return { ok: false as const, error: "База данных не настроена" }
  }

  const on = orderNumber.trim()
  const ph = normalizePhone(phone)
  if (!on || !ph) {
    return { ok: false as const, error: "Укажите номер заказа и телефон" }
  }

  const { data, error } = await admin
    .from("orders")
    .select(
      "id, order_number, status, total_amount, created_at, delivery_method, delivery_cost",
    )
    .eq("order_number", on)
    .eq("customer_phone", ph)
    .maybeSingle()

  if (error) return { ok: false as const, error: error.message }
  if (!data) return { ok: false as const, error: "Заказ не найден" }

  return { ok: true as const, order: data }
}
