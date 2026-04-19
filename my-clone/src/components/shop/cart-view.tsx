"use client"

import Image from "next/image"
import Link from "next/link"

import { Minus, Plus, Trash2 } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatRub } from "@/lib/format"
import { cn } from "@/lib/utils"

export function CartView() {
  const { lines, ready, remove, setQuantity, subtotal } = useCart()

  if (!ready) {
    return (
      <p className="text-center text-white/60">Загрузка корзины…</p>
    )
  }

  if (!lines.length) {
    return (
      <div className="tl-section mx-auto max-w-lg p-10 text-center">
        <p className="text-lg text-white/70">Корзина пока пуста.</p>
        <Link
          href="/shop"
          className={buttonVariants({ className: "mt-6 inline-flex" })}
        >
          В каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {lines.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="tl-card-product flex flex-wrap gap-4 p-4 sm:flex-nowrap"
          >
            <div className="relative size-24 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-black/50">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {product.category ? (
                  <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#d4af37]/80">
                    {product.category}
                  </p>
                ) : null}
                <p className="font-luxury font-semibold text-white">
                  {product.name}
                </p>
                <p className="text-sm text-white/65">
                  {formatRub(product.price)} за шт.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-[var(--radius-md)] border border-white/20 bg-white/[0.04]">
                  <button
                    type="button"
                    className={cn(
                      "p-2 text-white/70 transition-colors hover:text-white",
                    )}
                    onClick={() => setQuantity(product.id, quantity - 1)}
                    aria-label="Уменьшить"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-8 text-center text-sm tabular-nums text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="p-2 text-white/70 transition-colors hover:text-white"
                    onClick={() => setQuantity(product.id, quantity + 1)}
                    aria-label="Увеличить"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <button
                  type="button"
                  className="p-2 text-white/50 hover:text-red-400"
                  onClick={() => remove(product.id)}
                  aria-label="Удалить"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="w-full text-right text-base font-bold text-[#d4af37] sm:w-28 sm:self-center">
              {formatRub(product.price * quantity)}
            </div>
          </li>
        ))}
      </ul>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="tl-section p-6">
          <p className="text-sm text-white/65">Итого</p>
          <p className="tl-text-gold mt-1 text-2xl font-bold">{formatRub(subtotal)}</p>
          <Link
            href="/checkout"
            className={buttonVariants({ size: "lg", className: "mt-6 w-full" })}
          >
            Перейти к оформлению
          </Link>
          <Link
            href="/shop"
            className={buttonVariants({
              variant: "outline",
              className: "mt-3 w-full",
            })}
          >
            Продолжить покупки
          </Link>
        </div>
      </aside>
    </div>
  )
}
