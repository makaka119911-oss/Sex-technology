import type { DeliveryMethod } from "@/types/shop"

/** Упрощённый расчёт для UX; в проде — API СДЭК / Boxberry / Почты России */
export function estimateDeliveryRub(
  method: DeliveryMethod,
  subtotalRub: number,
  itemCount: number,
): number {
  const base =
    method === "courier"
      ? 390
      : method === "pickup"
        ? 220
        : 310
  const weightHint = Math.min(150, itemCount * 35)
  const remoteHint = subtotalRub > 8000 ? -50 : 0
  return Math.max(0, base + weightHint + remoteHint)
}
