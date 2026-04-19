import { NextResponse } from "next/server"

import {
  ADMIN_COOKIE_NAME,
  adminSessionToken,
  getOrderAdminSecret,
} from "@/lib/admin-session"

export async function POST(req: Request) {
  const secret = getOrderAdminSecret()
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Секрет админки не задан на сервере: задайте ORDER_ADMIN_SECRET (или SHOP_ADMIN_SECRET) в Vercel и Redeploy.",
      },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 })
  }

  const pwd =
    body && typeof body === "object" && "secret" in body
      ? String((body as { secret: unknown }).secret).trim()
      : ""

  if (pwd !== secret) {
    return NextResponse.json({ error: "Неверный секрет" }, { status: 401 })
  }

  const token = adminSessionToken()
  if (!token) {
    return NextResponse.json({ error: "Ошибка сессии" }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
