import { CartView } from "@/components/shop/cart-view"

export const metadata = {
  title: "Корзина — Территория любви",
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="tl-gradient-title mb-8 text-[clamp(1.75rem,4vw,2.5rem)]">
        Корзина
      </h1>
      <CartView />
    </div>
  )
}
