"use client"

import { useEffect } from "react"

import { saveGuestOrder } from "@/lib/guest-orders"

type Props = {
  orderId: string
  orderNumber: string
}

export function OrderSuccessTracker({ orderId, orderNumber }: Props) {
  useEffect(() => {
    saveGuestOrder({
      orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
    })
  }, [orderId, orderNumber])

  return null
}
