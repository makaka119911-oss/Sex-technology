"use client"

import Image from "next/image"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatRub } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/shop"

type Props = {
  products: Product[]
}

export function ProductGrid({ products }: Props) {
  const { add } = useCart()
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const p of products) {
      if (p.category) set.add(p.category)
    }
    return ["Все", ...Array.from(set).sort()]
  }, [products])

  const [cat, setCat] = useState("Все")

  const filtered = useMemo(() => {
    if (cat === "Все") return products
    return products.filter((p) => p.category === cat)
  }, [products, cat])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={cn(
              "rounded-2xl border-2 px-4 py-2 text-sm font-semibold transition-all",
              cat === c
                ? "border-white/90 bg-gradient-to-br from-[#800020] to-[#b22234] text-white shadow-[0_0_24px_rgba(128,0,32,0.45)]"
                : "border-white/25 bg-white/[0.06] text-white/85 hover:border-white/50 hover:bg-white/10",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <li
            key={p.id}
            className="tl-card-product flex flex-col overflow-hidden transition-shadow hover:shadow-[0_0_35px_rgba(128,0,32,0.25)]"
          >
            <div className="relative aspect-square bg-black/40">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover opacity-95"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <p className="font-luxury text-lg font-semibold leading-snug text-white">
                  {p.name}
                </p>
                {p.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-white/72">
                    {p.description}
                  </p>
                ) : null}
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                <span className="tl-text-gold text-lg font-bold tracking-wide">
                  {formatRub(p.price)}
                </span>
                <Button
                  size="sm"
                  disabled={!p.in_stock}
                  onClick={() => add(p, 1)}
                >
                  В корзину
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-white/60">
          В этой категории пока нет товаров.
        </p>
      ) : null}
    </div>
  )
}
