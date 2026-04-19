"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ShoppingBag } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

const links = [
  { href: "/", label: "Главная" },
  { href: "/shop", label: "Магазин" },
  { href: "/cabinet", label: "Кабинет" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { totalItems, ready } = useCart()

  if (pathname?.startsWith("/admin")) {
    return (
      <header className="sticky top-0 z-[1000] border-b border-[rgba(128,0,32,0.35)] bg-[rgba(5,5,12,0.97)] backdrop-blur-[10px]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <span className="text-sm font-semibold tracking-wide text-[#d4af37]/90">
            Админ заказов
          </span>
          <Link
            href="/"
            className="text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            На сайт магазина
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-[1000] border-b border-[rgba(128,0,32,0.3)] bg-[rgba(10,10,26,0.95)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-[clamp(56px,12vw,72px)] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 flex-col gap-0.5">
          <span className="tl-gradient-title truncate text-[clamp(1.2rem,2vw,1.5rem)] font-bold leading-tight">
            Территория любви
          </span>
          <span className="hidden text-[0.7rem] font-normal text-white/85 sm:block">
            и желаний
          </span>
        </Link>

        <nav className="hidden items-center gap-[clamp(15px,2vw,30px)] text-[clamp(0.9rem,1.5vw,1rem)] font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 text-white/95 transition-colors hover:text-white hover:underline hover:decoration-[#800020] hover:underline-offset-8"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/cart"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ShoppingBag className="size-4" />
            Корзина
            {ready && totalItems > 0 ? (
              <span className="ml-1 rounded-full bg-gradient-to-br from-[#800020] to-[#b22234] px-1.5 py-0.5 text-[10px] text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <nav className="flex border-t border-[rgba(128,0,32,0.2)] px-4 py-2 text-xs font-medium md:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-4 gap-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/85 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
