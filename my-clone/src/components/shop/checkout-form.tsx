"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

import { submitOrder } from "@/app/actions/orders"
import { Button, buttonVariants } from "@/components/ui/button"
import { YandexPickupMap } from "@/components/shop/yandex-pickup-map"
import { useCart } from "@/lib/cart-context"
import { estimateDeliveryRub } from "@/lib/delivery"
import { formatRub } from "@/lib/format"
import { rememberAddress } from "@/components/shop/saved-addresses"
import type { DeliveryMethod, PickupPointSelection } from "@/types/shop"
import { cn } from "@/lib/utils"

const methods: { id: DeliveryMethod; title: string; hint: string }[] = [
  {
    id: "courier",
    title: "Курьером по адресу",
    hint: "Доставим в удобное время — стоимость рассчитывается ниже",
  },
  {
    id: "pickup",
    title: "Пункт выдачи СДЭК / Boxberry",
    hint: "Выберите город и пункт на карте (интеграция подключается на бэкенде)",
  },
  {
    id: "post",
    title: "Почта России",
    hint: "Укажите индекс для расчёта сроков",
  },
]

export function CheckoutForm() {
  const router = useRouter()
  const { lines, subtotal, clear } = useCart()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [street, setStreet] = useState("")
  const [building, setBuilding] = useState("")
  const [apartment, setApartment] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [comment, setComment] = useState("")
  const [method, setMethod] = useState<DeliveryMethod>("courier")
  const [pickupNote, setPickupNote] = useState("")
  const [pickupSelection, setPickupSelection] =
    useState<PickupPointSelection | null>(null)
  const [discreet, setDiscreet] = useState(true)
  const [saveAddress, setSaveAddress] = useState(false)

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  )

  const [deliveryCost, setDeliveryCost] = useState(() =>
    estimateDeliveryRub(method, subtotal, itemCount, "Москва"),
  )
  const [deliveryNote, setDeliveryNote] = useState<string | null>(null)

  const onPickupMapSelect = useCallback((p: PickupPointSelection) => {
    setPickupSelection(p)
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await fetch("/api/calculate-delivery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              method,
              city,
              subtotalRub: subtotal,
              itemCount,
            }),
          })
          const data = (await res.json()) as {
            priceRub?: number
            note?: string | null
          }
          if (res.ok && typeof data.priceRub === "number") {
            setDeliveryCost(data.priceRub)
            setDeliveryNote(
              typeof data.note === "string" ? data.note : null,
            )
          } else {
            setDeliveryCost(
              estimateDeliveryRub(method, subtotal, itemCount, city),
            )
            setDeliveryNote(null)
          }
        } catch {
          setDeliveryCost(
            estimateDeliveryRub(method, subtotal, itemCount, city),
          )
          setDeliveryNote(null)
        }
      })()
    }, 400)
    return () => window.clearTimeout(t)
  }, [method, city, subtotal, itemCount])

  const total = subtotal + deliveryCost

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!lines.length) {
      setError("Корзина пуста")
      return
    }
    setPending(true)
    const res = await submitOrder({
      items: lines.map((l) => ({
        productId: l.product.id,
        quantity: l.quantity,
      })),
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      deliveryMethod: method,
      deliveryAddress: {
        city,
        street,
        building,
        apartment,
        postalCode: method === "post" ? postalCode : undefined,
        pickupPoint:
          method === "pickup" && pickupSelection ? pickupSelection : undefined,
      },
      customerComment: comment,
      discreetPackaging: discreet,
      pickupPointLabel: method === "pickup" ? pickupNote : undefined,
    })
    setPending(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    if (saveAddress && city && street && building) {
      rememberAddress({
        label: `${city}, ${street}`,
        city,
        street,
        building,
        apartment,
      })
    }
    clear()
    const q = new URLSearchParams({
      orderId: res.orderId,
      orderNumber: res.orderNumber,
    })
    router.push(`/order/success?${q.toString()}`)
  }

  if (!lines.length) {
    return (
      <div className="tl-section p-8 text-center">
        <p className="text-white/70">В корзине нет товаров.</p>
        <Link href="/shop" className={buttonVariants({ className: "mt-4" })}>
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <section className="tl-section space-y-4 p-6">
          <h2 className="font-luxury text-xl font-semibold text-white">Контакты</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm">
              <span className="text-white/70">Имя</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="tl-input"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="text-white/70">Телефон</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="tl-input"
              />
            </label>
            <label className="space-y-1.5 text-sm sm:col-span-2">
              <span className="text-white/70">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="tl-input"
              />
            </label>
          </div>
        </section>

        <section className="tl-section space-y-4 p-6">
          <h2 className="font-luxury text-xl font-semibold text-white">
            Адрес доставки
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm sm:col-span-2">
              <span className="text-white/70">Город</span>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="tl-input"
              />
            </label>
            <label className="space-y-1.5 text-sm sm:col-span-2">
              <span className="text-white/70">Улица</span>
              <input
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="tl-input"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="text-white/70">Дом</span>
              <input
                required
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="tl-input"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="text-white/70">Квартира</span>
              <input
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="tl-input"
              />
            </label>
            {method === "post" ? (
              <label className="space-y-1.5 text-sm sm:col-span-2">
                <span className="text-white/70">Индекс</span>
                <input
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="tl-input"
                />
              </label>
            ) : null}
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="accent-[#d4af37] mt-1 size-4 rounded border border-white/30 bg-transparent"
            />
            <span className="text-white/70">
              Сохранить этот адрес для следующих заказов (локально в браузере)
            </span>
          </label>
        </section>

        <section className="tl-section space-y-4 p-6">
          <h2 className="font-luxury text-xl font-semibold text-white">
            Способ доставки
          </h2>
          <div className="space-y-3">
            {methods.map((m) => (
              <label
                key={m.id}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-[var(--radius-md)] border p-4 transition-colors",
                  method === m.id
                    ? "border-[#800020] bg-[rgba(128,0,32,0.18)] shadow-[0_0_20px_rgba(128,0,32,0.2)]"
                    : "border-white/15 bg-white/[0.03] hover:border-[rgba(128,0,32,0.45)]",
                )}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="accent-[#d4af37] mt-1"
                />
                <div>
                  <p className="font-medium text-white">{m.title}</p>
                  <p className="text-sm text-white/65">{m.hint}</p>
                </div>
              </label>
            ))}
          </div>

          {method === "pickup" ? (
            <div className="space-y-3 rounded-[var(--radius-md)] border border-dashed border-[rgba(128,0,32,0.45)] bg-[rgba(128,0,32,0.08)] p-4">
              <p className="text-sm text-white/65">
                Выберите пункт на карте (Яндекс.Карты) — координаты и адрес
                сохранятся в заказе. Для полного расчёта стоимости ПВЗ позже
                подключим API СДЭК.
              </p>
              <YandexPickupMap onSelect={onPickupMapSelect} />
              <label className="space-y-1.5 text-sm">
                <span className="text-white/70">Комментарий к пункту</span>
                <textarea
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  rows={3}
                  className="tl-input min-h-[88px]"
                  placeholder="Например: удобное время, вход со двора…"
                />
              </label>
            </div>
          ) : null}

          <label className="space-y-1.5 text-sm">
            <span className="text-white/70">Комментарий к заказу</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Время звонка курьера, домофон…"
              className="tl-input min-h-[88px]"
            />
          </label>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={discreet}
              onChange={(e) => setDiscreet(e.target.checked)}
              className="accent-[#d4af37] mt-1 size-4 rounded border border-white/30"
            />
            <span>
              <span className="font-medium text-white">
                Дискретная упаковка
              </span>
              <span className="block text-white/65">
                Нейтральная коробка без названия магазина на маркировке
              </span>
            </span>
          </label>
        </section>
      </div>

      <aside className="space-y-4">
        <div className="tl-section sticky top-24 p-6">
          <h2 className="font-luxury text-lg font-semibold text-white">Итого</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/65">Товары</dt>
              <dd className="text-white">{formatRub(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/65">Доставка</dt>
              <dd className="text-right text-white">
                {formatRub(deliveryCost)}
                {deliveryNote ? (
                  <span className="mt-1 block text-xs font-normal text-white/50">
                    {deliveryNote}
                  </span>
                ) : null}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-[rgba(128,0,32,0.35)] pt-3 text-base font-semibold">
              <dt className="text-white">К оплате</dt>
              <dd className="tl-text-gold">{formatRub(total)}</dd>
            </div>
          </dl>
          {error ? (
            <p className="mt-4 rounded-[var(--radius-md)] border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={pending}
            className="mt-6 w-full"
            size="lg"
          >
            {pending ? "Отправка…" : "Подтвердить заказ"}
          </Button>
          <p className="mt-3 text-xs text-white/55">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных для
            оформления и доставки заказа.
          </p>
        </div>
      </aside>
    </form>
  )
}
