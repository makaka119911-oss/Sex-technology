"use client"

import { useEffect, useState } from "react"

import { lookupOrder } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import { SavedAddressesPanel } from "@/components/shop/saved-addresses"
import { formatRub } from "@/lib/format"
import { readGuestOrders, type GuestOrderRef } from "@/lib/guest-orders"

const statusRu: Record<string, string> = {
  pending: "Принят",
  paid: "Оплачен",
  shipped: "В пути",
  delivered: "Доставлен",
  cancelled: "Отменён",
}

export function CabinetPanel() {
  const [guest, setGuest] = useState<GuestOrderRef[]>([])
  const [orderNumber, setOrderNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [lookupResult, setLookupResult] = useState<
    Awaited<ReturnType<typeof lookupOrder>> | null
  >(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setGuest(readGuestOrders())
  }, [])

  async function onLookup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setLookupResult(null)
    const res = await lookupOrder(orderNumber, phone)
    setLookupResult(res)
    setLoading(false)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="tl-section space-y-4 p-6">
        <h2 className="font-luxury text-xl font-semibold text-white">
          Недавние заказы (этот браузер)
        </h2>
        {guest.length === 0 ? (
          <p className="text-sm text-white/65">
            После оформления заказа номер появится здесь автоматически.
          </p>
        ) : (
          <ul className="space-y-3">
            {guest.map((g) => (
              <li
                key={g.orderId}
                className="rounded-[var(--radius-md)] border border-[rgba(128,0,32,0.35)] bg-[rgba(128,0,32,0.12)] px-4 py-3 text-sm"
              >
                <p className="font-medium text-[#d4af37]">{g.orderNumber}</p>
                <p className="text-white/65">
                  {new Date(g.createdAt).toLocaleString("ru-RU")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="tl-section space-y-4 p-6">
        <h2 className="font-luxury text-xl font-semibold text-white">
          Найти заказ
        </h2>
        <p className="text-sm text-white/65">
          Введите номер заказа и телефон, указанные при оформлении.
        </p>
        <form onSubmit={onLookup} className="space-y-3">
          <label className="space-y-1.5 text-sm">
            <span className="text-white/70">Номер заказа</span>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="tl-input"
              placeholder="TL-20260419-AB12"
            />
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="text-white/70">Телефон</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="tl-input"
              placeholder="+7 …"
            />
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? "Поиск…" : "Показать статус"}
          </Button>
        </form>
        {lookupResult?.ok && lookupResult.order ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(128,0,32,0.45)] bg-[rgba(128,0,32,0.12)] p-4 text-sm">
            <p className="font-medium text-white">
              {lookupResult.order.order_number}
            </p>
            <p className="text-white/70">
              Статус:{" "}
              {statusRu[lookupResult.order.status] ?? lookupResult.order.status}
            </p>
            <p className="text-white/70">
              Сумма: {formatRub(Number(lookupResult.order.total_amount))}
            </p>
            <p className="text-white/70">
              Доставка: {formatRub(Number(lookupResult.order.delivery_cost))}
            </p>
          </div>
        ) : null}
        {lookupResult && !lookupResult.ok ? (
          <p className="text-sm text-red-400">{lookupResult.error}</p>
        ) : null}
      </section>

      <section className="tl-section space-y-4 p-6 lg:col-span-2">
        <h2 className="font-luxury text-xl font-semibold text-white">
          Сохранённые адреса
        </h2>
        <SavedAddressesPanel />
      </section>
    </div>
  )
}
