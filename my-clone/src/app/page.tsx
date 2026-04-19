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
        Оформление заказа и доставка — здесь. Основной лендинг с информацией о
        терапии и кругах — на{" "}
        <a
          href="https://xn--c1adkgfrbtc9l.com/"
          className="text-[#d4af37] underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          территория-любви.рф
        </a>
        .
      </p>
      <div className="tl-note mt-6 text-[13px]">
        Дизайн страниц магазина совпадает с цветовой схемой основного сайта
        (тёмный фон, бордо, золото).
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className={buttonVariants({ size: "lg" })}>
          Перейти в каталог
        </Link>
        <Link
          href="https://xn--c1adkgfrbtc9l.com/"
          className={buttonVariants({ variant: "outline", size: "lg" })}
          target="_blank"
          rel="noreferrer"
        >
          На главный сайт
        </Link>
      </div>
    </main>
  )
}
