import { ProductGrid } from "@/components/shop/product-grid"
import { fetchProducts } from "@/lib/supabase/public"

export const metadata = {
  title: "Магазин",
  description: "Каталог товаров с деликатной доставкой",
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
          Фильтры по категориям и дискретная доставка — на этапе оформления
          заказа.
        </p>
      </header>
      <ProductGrid products={products} />
    </div>
  )
}
