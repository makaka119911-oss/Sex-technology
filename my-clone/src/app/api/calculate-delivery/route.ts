import { NextResponse } from "next/server"

import { calculateDeliveryMvp } from "@/lib/delivery-pricing"
import type { DeliveryMethod } from "@/types/shop"

const methods: DeliveryMethod[] = ["courier", "pickup", "post"]

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ожидается объект" }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const method = b.method as string | undefined
  const city = typeof b.city === "string" ? b.city : ""
  const subtotalRub = Number(b.subtotalRub)
  const itemCount = Number(b.itemCount)

  if (!methods.includes(method as DeliveryMethod)) {
    return NextResponse.json(
      { error: "Некорректный способ доставки" },
      { status: 400 },
    )
  }
  if (!Number.isFinite(subtotalRub) || subtotalRub < 0) {
    return NextResponse.json({ error: "Некорректная сумма" }, { status: 400 })
  }
  if (!Number.isFinite(itemCount) || itemCount < 0) {
    return NextResponse.json({ error: "Некорректное количество" }, { status: 400 })
  }

  const result = calculateDeliveryMvp({
    method: method as DeliveryMethod,
    city,
    subtotalRub,
    itemCount,
  })

  return NextResponse.json({
    priceRub: result.priceRub,
    note: result.note ?? null,
  })
}
