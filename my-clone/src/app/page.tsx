import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl flex-col justify-center px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]/90">
        Магазин «Территория любви»
      </p>
      <h1 className="tl-gradient-title mt-3 text-[clamp(1.75rem,4vw,2.25rem)] leading-tight">
        Каталог и заказы
      </h1>
      <p className="mt-4 leading-relaxed text-white/75">
        Подборка для взрослых в деликатной подаче: аксессуары, литература,
        подарочные наборы и сертификаты. Дискретная доставка и нейтральная
        упаковка — при оформлении заказа.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-white/60">
        О терапии, консультациях и женских кругах — на{" "}
        <a
          href="https://сексология.com/"
          className="text-[#d4af37]/95 underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          основном сайте проекта
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className={buttonVariants({ size: "lg" })}>
          Перейти в каталог
        </Link>
        <a
          href="https://сексология.com/"
          className={buttonVariants({ variant: "outline", size: "lg" })}
          target="_blank"
          rel="noreferrer"
        >
          Терапия и мероприятия
        </a>
      </div>
    </main>
  )
}
