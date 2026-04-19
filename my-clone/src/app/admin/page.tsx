import type { Metadata } from "next"

import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { AdminOrdersPanel } from "@/components/admin/admin-orders-panel"
import { fetchAdminOrders } from "@/lib/admin-orders-data"
import { isAdminSession } from "@/lib/admin-session"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Админ заказов",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const authed = await isAdminSession()

  if (!authed) {
    const hasSecret = Boolean(process.env.ORDER_ADMIN_SECRET?.trim())
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {!hasSecret ? (
          <div
            role="alert"
            className="mb-8 rounded-[var(--radius-md)] border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
          >
            На сервере не задан{" "}
            <code className="text-amber-50">ORDER_ADMIN_SECRET</code>. Добавьте
            длинную случайную строку в Vercel (Production) и сделайте Redeploy —
            без неё вход в админку отключён.
          </div>
        ) : null}
        <AdminLoginForm />
      </div>
    )
  }

  const data = await fetchAdminOrders()
  if (!data.ok) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="tl-section p-8 text-center text-red-300">{data.error}</p>
      </div>
    )
  }

  return <AdminOrdersPanel initialOrders={data.orders} />
}
