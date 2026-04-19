"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"

import { adminUpdateOrderStatus } from "@/app/actions/admin-orders"
import { Button } from "@/components/ui/button"
import { formatRub } from "@/lib/format"
import type { AdminOrderRow } from "@/lib/admin-orders-data"
import { cn } from "@/lib/utils"

const STATUSES = [
  { value: "pending", label: "Принят" },
  { value: "paid", label: "Оплачен" },
  { value: "shipped", label: "В пути" },
  { value: "delivered", label: "Доставлен" },
  { value: "cancelled", label: "Отменён" },
] as const

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

function formatAddress(addr: unknown): string {
  if (!addr || typeof addr !== "object") return "—"
  const a = addr as Record<string, unknown>
  const parts = [
    a.city,
    a.street,
    a.building,
    a.apartment,
    a.postalCode,
  ]
    .filter((x) => typeof x === "string" && x.trim())
    .map((x) => (x as string).trim())
  return parts.length ? parts.join(", ") : "—"
}

type Props = {
  initialOrders: AdminOrderRow[]
  /** Включено ADMIN_OPEN=1 — без пароля, не для публичного продакшена */
  openMode?: boolean
}

export function AdminOrdersPanel({ initialOrders, openMode }: Props) {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [isOut, startOut] = useTransition()

  const rows = useMemo(() => initialOrders, [initialOrders])

  async function onStatusChange(orderId: string, status: string) {
    setMsg(null)
    setPendingId(orderId)
    const res = await adminUpdateOrderStatus(orderId, status)
    setPendingId(null)
    if (!res.ok) {
      setMsg(res.error)
      return
    }
    router.refresh()
  }

  async function logout() {
    startOut(async () => {
      await fetch("/api/admin/logout", { method: "POST" })
      router.refresh()
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {openMode ? (
        <div
          role="alert"
          className="mb-6 rounded-[var(--radius-md)] border border-red-500/45 bg-red-950/40 px-4 py-3 text-sm text-red-100"
        >
          <strong className="text-red-50">Открытый режим:</strong> задано{" "}
          <code className="text-red-50">ADMIN_OPEN=1</code> — пароль не требуется, зайти
          может любой, кто знает URL. Уберите переменную в Vercel и используйте{" "}
          <code className="text-red-50">ORDER_ADMIN_SECRET</code> для нормального входа.
        </div>
      ) : null}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-luxury text-2xl font-semibold text-white md:text-3xl">
            Заказы
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Отдельная ссылка:{" "}
            <span className="text-[#d4af37]/90">/admin</span> — не показывается в меню
            магазина.
          </p>
        </div>
        {!openMode ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void logout()}
            disabled={isOut}
          >
            Выйти
          </Button>
        ) : (
          <span className="text-xs text-white/45">Выйти: отключите ADMIN_OPEN в Vercel</span>
        )}
      </div>

      {msg ? (
        <p className="mb-4 rounded-[var(--radius-md)] border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {msg}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <p className="tl-section p-10 text-center text-white/65">
          Пока нет заказов.
        </p>
      ) : (
        <ul className="space-y-6">
          {rows.map((o) => (
            <li
              key={o.id}
              className="tl-section overflow-hidden border border-[rgba(128,0,32,0.35)] p-0"
            >
              <div className="flex flex-col gap-4 border-b border-white/10 bg-black/30 p-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-lg font-semibold text-[#e8d5a3]">
                    № {o.order_number}
                  </p>
                  <p className="text-sm text-white/55">{formatWhen(o.created_at)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <span className="text-white/50">Статус</span>
                    <select
                      className={cn(
                        "rounded-xl border border-white/20 bg-black/50 px-3 py-2 text-white",
                        "focus:border-[#800020] focus:outline-none",
                      )}
                      value={o.status ?? "pending"}
                      disabled={pendingId === o.id}
                      onChange={(e) => void onStatusChange(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="grid gap-6 p-5 md:grid-cols-2">
                <div className="space-y-2 text-sm">
                  <p className="text-white/50">Клиент</p>
                  <p className="text-white">{o.customer_name}</p>
                  <p className="text-white/85">{o.customer_phone}</p>
                  {o.customer_email ? (
                    <p className="text-[#d4af37]/90">{o.customer_email}</p>
                  ) : null}
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-white/50">Суммы</p>
                  <p className="text-white">
                    Товары + доставка:{" "}
                    <span className="font-semibold text-[#e8d5a3]">
                      {formatRub(o.total_amount)}
                    </span>
                    {" "}
                    <span className="text-white/45">
                      (доставка {formatRub(o.delivery_cost)})
                    </span>
                  </p>
                  <p className="text-white/70">
                    Способ:{" "}
                    {o.delivery_method === "courier"
                      ? "Курьер"
                      : o.delivery_method === "pickup"
                        ? "ПВЗ"
                        : o.delivery_method === "post"
                          ? "Почта"
                          : o.delivery_method}
                  </p>
                  <p className="text-white/70">
                    Дискретная упаковка: {o.discreet_packaging ? "да" : "нет"}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 px-5 py-4 text-sm">
                <p className="text-white/50">Адрес / доставка</p>
                <p className="mt-1 text-white/88">{formatAddress(o.delivery_address)}</p>
                {o.pickup_point_label ? (
                  <p className="mt-2 whitespace-pre-wrap text-white/75">
                    ПВЗ: {o.pickup_point_label}
                  </p>
                ) : null}
                {o.customer_comment ? (
                  <p className="mt-2 text-white/70">
                    Комментарий: {o.customer_comment}
                  </p>
                ) : null}
              </div>

              <div className="border-t border-white/10 bg-black/20 px-5 py-4">
                <p className="text-sm text-white/50">Состав</p>
                <ul className="mt-2 space-y-1 text-sm text-white/90">
                  {o.lines.length === 0 ? (
                    <li className="text-white/45">Позиции не загрузились</li>
                  ) : (
                    o.lines.map((l, i) => (
                      <li key={i}>
                        {l.product_name ?? "Товар"}{" "}
                        <span className="text-white/55">×{l.quantity}</span>
                        {" · "}
                        {formatRub(l.price_at_time)} за ед.
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
