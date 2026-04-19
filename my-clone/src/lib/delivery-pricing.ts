import type { DeliveryMethod } from "@/types/shop"

export function normalizeCityName(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, " ")
}

/** Москва и Реутов — зона фиксированного курьера (MVP) */
export function isMoscowReutovZone(city: string): boolean {
  const c = normalizeCityName(city)
  if (!c) return false
  if (c === "москва" || c.startsWith("москва ")) return true
  if (c.includes("реутов")) return true
  return false
}

export type CalculateDeliveryInput = {
  method: DeliveryMethod
  city: string
  subtotalRub: number
  itemCount: number
}

export type CalculateDeliveryResult = {
  priceRub: number
  note?: string
}

const COURIER_FIXED_MSK = 390
const COURIER_OUTSIDE_ZONE = 690
const PICKUP_CDEK_BASE = 220
const POST_BASE = 310

export function calculateDeliveryMvp(
  input: CalculateDeliveryInput,
): CalculateDeliveryResult {
  const { method, city, subtotalRub, itemCount } = input
  const weightHint = Math.min(150, itemCount * 35)
  const remoteHint = subtotalRub > 8000 ? -50 : 0

  if (method === "courier") {
    if (isMoscowReutovZone(city)) {
      return {
        priceRub: Math.max(0, COURIER_FIXED_MSK + remoteHint),
        note: "Курьер по Москве и Реутову — фиксированный тариф",
      }
    }
    return {
      priceRub: Math.max(0, COURIER_OUTSIDE_ZONE + weightHint + remoteHint),
      note: "Вне зоны Москва/Реутов — ориентировочная стоимость, уточняется у менеджера",
    }
  }

  if (method === "pickup") {
    return {
      priceRub: Math.max(0, PICKUP_CDEK_BASE + weightHint + remoteHint),
      note: "Пункт выдачи СДЭК — расчёт-заглушка (итог по тарифам ПВЗ)",
    }
  }

  return {
    priceRub: Math.max(0, POST_BASE + weightHint + remoteHint),
    note: "Почта России — ориентировочно по весу",
  }
}
