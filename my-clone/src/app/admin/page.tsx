import type { Metadata } from "next"

import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { AdminOrdersPanel } from "@/components/admin/admin-orders-panel"
import { fetchAdminOrders } from "@/lib/admin-orders-data"
import { isAdminOpenMode, isAdminSession } from "@/lib/admin-session"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Админ заказов",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const authed = await isAdminSession()

  if (!authed) {
    const hasSecret = Boolean(process.env.ORDER_ADMIN_SECRET?.trim())
    const vercelEnv = process.env.VERCEL_ENV
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {!hasSecret ? (
          <div
            role="alert"
            className="mb-8 space-y-3 rounded-[var(--radius-md)] border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
          >
            <p>
              На <strong>этом</strong> деплое не видно переменной{" "}
              <code className="text-amber-50">ORDER_ADMIN_SECRET</code> (сервер
              отвечает без секрета).
            </p>
            {vercelEnv === "preview" ? (
              <p className="text-amber-50/95">
                Вы на <strong>Preview</strong>-URL: в Vercel откройте переменные и
                включите секрет для <strong>Preview</strong> или для{" "}
                <strong>All Environments</strong>, затем Redeploy.
              </p>
            ) : (
              <p className="text-amber-50/95">
                В Vercel → Settings → Environment Variables: добавьте{" "}
                <code className="text-amber-50">ORDER_ADMIN_SECRET</code> (длинная
                случайная строка) для <strong>Production</strong> или{" "}
                <strong>All Environments</strong>, затем <strong>Redeploy</strong>.
              </p>
            )}
            <p>
              Быстрая проверка без пароля: переменная{" "}
              <code className="text-amber-50">ADMIN_OPEN</code> ={" "}
              <code className="text-amber-50">1</code> для того же окружения
              (Preview/Production), Redeploy — страница откроется сразу. Потом
              уберите <code className="text-amber-50">ADMIN_OPEN</code>.
            </p>
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

  return (
    <AdminOrdersPanel
      initialOrders={data.orders}
      openMode={isAdminOpenMode()}
    />
  )
}
