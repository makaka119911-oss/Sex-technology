import { NextResponse } from "next/server"

import { getOrderAdminSecret } from "@/lib/admin-session"

/** Проверка: видит ли рантайм секрет админки (значение не раскрывается). */
export async function GET() {
  const orderAdminSecret = Boolean(getOrderAdminSecret())
  return NextResponse.json({
    orderAdminSecret,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  })
}
