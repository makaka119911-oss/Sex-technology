import { NextResponse } from "next/server"

import { getOrderAdminSecret } from "@/lib/admin-session"
import { sendOrderStatusEmail } from "@/lib/notifications/email"
import { getServiceRoleClient } from "@/lib/supabase/admin"

const statusRu: Record<string, string> = {
  pending: "Принят",
  paid: "Оплачен",
  shipped: "В пути",
  delivered: "Доставлен",
  cancelled: "Отменён",
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const secret = getOrderAdminSecret()
  if (!secret) {
    return NextResponse.json(
      { error: "ORDER_ADMIN_SECRET (или SHOP_ADMIN_SECRET) не задан" },
      { status: 503 },
    )
  }

  const auth = req.headers.get("authorization")
  const bearer =
    auth?.startsWith("Bearer ") ? auth.slice(7).trim() : req.headers.get("x-admin-secret")
  if (bearer !== secret) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 })
  }

  const status =
    body && typeof body === "object" && "status" in body
      ? String((body as { status: unknown }).status).trim()
      : ""

  if (!status) {
    return NextResponse.json({ error: "Укажите status" }, { status: 400 })
  }

  const { id } = await ctx.params
  const admin = getServiceRoleClient()
  if (!admin) {
    return NextResponse.json({ error: "База не настроена" }, { status: 503 })
  }

  const { data: before, error: fe } = await admin
    .from("orders")
    .select("id, status, order_number, customer_email")
    .eq("id", id)
    .maybeSingle()

  if (fe || !before) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 })
  }

  if (before.status === status) {
    return NextResponse.json({ ok: true, unchanged: true })
  }

  const { error: ue } = await admin
    .from("orders")
    .update({ status })
    .eq("id", id)

  if (ue) {
    return NextResponse.json({ error: ue.message }, { status: 500 })
  }

  const email = before.customer_email?.trim()
  if (email) {
    try {
      await sendOrderStatusEmail({
        to: email,
        orderNumber: before.order_number,
        statusLabel: statusRu[status] ?? status,
      })
    } catch (e) {
      console.error("sendOrderStatusEmail", e)
    }
  }

  return NextResponse.json({ ok: true })
}
