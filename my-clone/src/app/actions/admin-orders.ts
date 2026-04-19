"use server"

import { revalidatePath } from "next/cache"

import { isAdminSession } from "@/lib/admin-session"
import { sendOrderStatusEmail } from "@/lib/notifications/email"
import { getServiceRoleClient } from "@/lib/supabase/admin"

const STATUS_LABELS: Record<string, string> = {
  pending: "Принят",
  paid: "Оплачен",
  shipped: "В пути",
  delivered: "Доставлен",
  cancelled: "Отменён",
}

const ALLOWED = new Set(Object.keys(STATUS_LABELS))

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  if (!(await isAdminSession())) {
    return { ok: false as const, error: "Нет доступа" }
  }

  const s = status.trim()
  if (!ALLOWED.has(s)) {
    return { ok: false as const, error: "Недопустимый статус" }
  }

  const admin = getServiceRoleClient()
  if (!admin) {
    return { ok: false as const, error: "База не настроена" }
  }

  const { data: before, error: fe } = await admin
    .from("orders")
    .select("id, status, order_number, customer_email")
    .eq("id", orderId)
    .maybeSingle()

  if (fe || !before) {
    return { ok: false as const, error: "Заказ не найден" }
  }

  if (before.status === s) {
    return { ok: true as const }
  }

  const { error: ue } = await admin.from("orders").update({ status: s }).eq("id", orderId)

  if (ue) {
    return { ok: false as const, error: ue.message }
  }

  const email = before.customer_email?.trim()
  if (email) {
    try {
      await sendOrderStatusEmail({
        to: email,
        orderNumber: before.order_number,
        statusLabel: STATUS_LABELS[s] ?? s,
      })
    } catch (e) {
      console.error("sendOrderStatusEmail", e)
    }
  }

  revalidatePath("/admin")
  return { ok: true as const }
}
