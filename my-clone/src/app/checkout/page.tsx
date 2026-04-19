import { CheckoutForm } from "@/components/shop/checkout-form"

export const metadata = {
  title: "Оформление заказа — Территория любви",
  description:
    "Дискретная упаковка и конфиденциальные уведомления без названий товаров",
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="tl-gradient-title mb-8 text-[clamp(1.75rem,4vw,2.5rem)]">
        Оформление заказа
      </h1>
      <CheckoutForm />
    </div>
  )
}
