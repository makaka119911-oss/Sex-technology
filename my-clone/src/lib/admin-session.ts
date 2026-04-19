import { createHash, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

const COOKIE = "tl_shop_admin"
const PEPPER = "::territory-love-admin-v1"

export function adminSessionToken(): string | null {
  const secret = process.env.ORDER_ADMIN_SECRET?.trim()
  if (!secret) return null
  return createHash("sha256").update(secret + PEPPER).digest("hex")
}

export async function isAdminSession(): Promise<boolean> {
  const expected = adminSessionToken()
  if (!expected) return false
  const jar = await cookies()
  const got = jar.get(COOKIE)?.value
  if (!got || got.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(got), Buffer.from(expected))
  } catch {
    return false
  }
}

export const ADMIN_COOKIE_NAME = COOKIE
