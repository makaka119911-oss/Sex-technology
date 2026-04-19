export const GUEST_ORDERS_KEY = "territory-love-guest-orders-v1"

export type GuestOrderRef = {
  orderId: string
  orderNumber: string
  createdAt: string
}

export function saveGuestOrder(ref: GuestOrderRef) {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(GUEST_ORDERS_KEY)
    const list: GuestOrderRef[] = raw ? JSON.parse(raw) : []
    list.unshift(ref)
    localStorage.setItem(
      GUEST_ORDERS_KEY,
      JSON.stringify(list.slice(0, 20)),
    )
  } catch {
    /* ignore */
  }
}

export function readGuestOrders(): GuestOrderRef[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(GUEST_ORDERS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as GuestOrderRef[]
  } catch {
    return []
  }
}

export const SAVED_ADDRESSES_KEY = "territory-love-addresses-v1"

export type SavedAddress = {
  id: string
  label: string
  city: string
  street: string
  building: string
  apartment: string
}
