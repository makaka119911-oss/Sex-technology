import type { Metadata } from "next"
import { Cormorant_Garamond, Montserrat } from "next/font/google"

import { SiteHeader } from "@/components/shop/site-header"
import { CartProvider } from "@/lib/cart-context"

import "./globals.css"

const fontLuxury = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-luxury",
  weight: ["500", "600", "700"],
})

const fontBody = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Магазин — Территория любви",
    template: "%s — Территория любви",
  },
  description:
    "Магазин на сайте секс-терапии для женщин: доставка, дискретная упаковка",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`dark ${fontLuxury.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
