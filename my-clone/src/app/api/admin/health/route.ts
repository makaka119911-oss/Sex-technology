import { NextResponse } from "next/server"

/** Проверка: видит ли рантайм ORDER_ADMIN_SECRET (значение не раскрывается). */
export async function GET() {
  const orderAdminSecret = Boolean(process.env.ORDER_ADMIN_SECRET?.trim())
  return NextResponse.json({
    orderAdminSecret,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  })
}
