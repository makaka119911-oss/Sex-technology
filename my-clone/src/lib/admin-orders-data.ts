import { getServiceRoleClient } from "@/lib/supabase/admin"

export type AdminOrderLine = {
  quantity: number
  price_at_time: number
  product_name: string | null
}

export type AdminOrderRow = {
  id: string
  order_number: string
  created_at: string
  status: string | null
  total_amount: number
  delivery_cost: number
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_method: string
  delivery_address: unknown
  customer_comment: string | null
  pickup_point_label: string | null
  discreet_packaging: boolean | null
  lines: AdminOrderLine[]
}

export async function fetchAdminOrders(): Promise<{
  ok: true
  orders: AdminOrderRow[]
} | { ok: false; error: string }> {
  const admin = getServiceRoleClient()
  if (!admin) {
    return { ok: false, error: "База не настроена" }
  }

  const { data: orders, error: oe } = await admin
    .from("orders")
    .select(
      `
      id,
      order_number,
      created_at,
      status,
      total_amount,
      delivery_cost,
      customer_name,
      customer_phone,
      customer_email,
      delivery_method,
      delivery_address,
      customer_comment,
      pickup_point_label,
      discreet_packaging
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100)

  if (oe || !orders) {
    return { ok: false, error: oe?.message ?? "Не удалось загрузить заказы" }
  }

  const ids = orders.map((o) => o.id)
  if (ids.length === 0) {
    return { ok: true, orders: [] }
  }

  const { data: items, error: ie } = await admin
    .from("order_items")
    .select("order_id, quantity, price_at_time, products(name)")
    .in("order_id", ids)

  if (ie) {
    return { ok: false, error: ie.message }
  }

  const byOrder = new Map<string, AdminOrderLine[]>()
  for (const o of orders) {
    byOrder.set(o.id, [])
  }

  for (const raw of items ?? []) {
    const row = raw as {
      order_id: string
      quantity: number
      price_at_time: number
      products: { name: string } | { name: string }[] | null
    }
    const list = byOrder.get(row.order_id)
    if (!list) continue
    const p = row.products
    const name =
      p == null
        ? null
        : Array.isArray(p)
          ? p[0]?.name ?? null
          : p.name
    list.push({
      quantity: row.quantity,
      price_at_time: Number(row.price_at_time),
      product_name: name,
    })
  }

  const rows: AdminOrderRow[] = orders.map((o) => ({
    id: o.id,
    order_number: o.order_number,
    created_at: o.created_at,
    status: o.status,
    total_amount: Number(o.total_amount),
    delivery_cost: Number(o.delivery_cost ?? 0),
    customer_name: o.customer_name,
    customer_phone: o.customer_phone,
    customer_email: o.customer_email,
    delivery_method: o.delivery_method,
    delivery_address: o.delivery_address,
    customer_comment: o.customer_comment,
    pickup_point_label: o.pickup_point_label,
    discreet_packaging: o.discreet_packaging,
    lines: byOrder.get(o.id) ?? [],
  }))

  return { ok: true, orders: rows }
}
