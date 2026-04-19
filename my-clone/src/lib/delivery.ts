import { calculateDeliveryMvp } from "@/lib/delivery-pricing"
import type { DeliveryMethod } from "@/types/shop"

/** Упрощённый расчёт для UX (fallback); основной источник — `/api/calculate-delivery` и `calculateDeliveryMvp` на сервере */
export function estimateDeliveryRub(
  method: DeliveryMethod,
  subtotalRub: number,
  itemCount: number,
  city = "Москва",
): number {
  return calculateDeliveryMvp({
    method,
    city,
    subtotalRub,
    itemCount,
  }).priceRub
}

export { calculateDeliveryMvp } from "@/lib/delivery-pricing"
