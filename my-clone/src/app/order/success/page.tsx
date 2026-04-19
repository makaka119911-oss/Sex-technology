import Link from "next/link"

import { OrderSuccessTracker } from "@/components/shop/order-success-tracker"
import { buttonVariants } from "@/components/ui/button-variants"

type Props = {
  searchParams: Promise<{ orderId?: string; orderNumber?: string }>
}

export const metadata = {
  title: "Заказ оформлен",
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const sp = await searchParams
  const orderId = sp.orderId ?? ""
  const orderNumber = sp.orderNumber ?? ""

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      {orderId && orderNumber ? (
        <OrderSuccessTracker orderId={orderId} orderNumber={orderNumber} />
      ) : null}
      <div className="tl-section rounded-[var(--radius-xl)] p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]/90">
          Спасибо
        </p>
        <h1 className="tl-gradient-title mt-3 text-[clamp(1.5rem,4vw,2rem)]">
          Заказ принят
        </h1>
        {orderNumber ? (
          <p className="mt-4 text-lg text-white">
            Номер заказа:{" "}
            <span className="font-semibold tabular-nums text-[#d4af37]">
              {orderNumber}
            </span>
          </p>
        ) : (
          <p className="mt-4 text-white/65">
            Мы отправим подтверждение на указанный email или SMS.
          </p>
        )}
        <p className="mt-4 text-sm leading-relaxed text-white/65">
          Анонимная упаковка учтена. Курьер свяжется для уточнения времени, если
          выбрана доставка до двери. Статус можно посмотреть в разделе ниже.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/cabinet"
            className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}
          >
            Отслеживание и кабинет
          </Link>
          <Link
            href="/shop"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            В каталог
          </Link>
        </div>
      </div>
    </div>
  )
}
