import { ProductGrid } from "@/components/shop/product-grid"
import { fetchProducts } from "@/lib/supabase/public"

export const metadata = {
  title: "Магазин",
  description:
    "Каталог: интим-аксессуары, книги, наборы и сертификаты на терапию — деликатно и конфиденциально",
}

export default async function ShopPage() {
  const products = await fetchProducts()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-10 max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]/90">
          Интернет-магазин
        </p>
        <h1 className="tl-gradient-title text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
          Каталог
        </h1>
        <p className="text-sm leading-relaxed text-white/72 sm:text-base">
          Подборка для взрослых в деликатной подаче: аксессуары, литература,
          подарочные наборы и сертификаты на терапию. Описания сформулированы
          нейтрально, без вульгарных формулировок.
        </p>
      </header>
      <ProductGrid products={products} />
    </div>
  )
}
