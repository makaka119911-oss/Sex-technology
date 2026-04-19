"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export function AdminLoginForm() {
  const router = useRouter()
  const [secret, setSecret] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Ошибка входа")
        setPending(false)
        return
      }
      setSecret("")
      router.refresh()
    } catch {
      setError("Сеть недоступна")
    }
    setPending(false)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="tl-section mx-auto max-w-md space-y-6 p-8"
    >
      <div>
        <h1 className="font-luxury text-2xl font-semibold text-white">
          Вход в админку
        </h1>
        <p className="mt-2 text-sm text-white/65">
          Тот же секрет, что и <code className="text-[#d4af37]/90">ORDER_ADMIN_SECRET</code>{" "}
          в Vercel.
        </p>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="text-white/70">Секрет</span>
        <input
          type="password"
          autoComplete="off"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="tl-input w-full"
          required
        />
      </label>
      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "Вход…" : "Войти"}
      </Button>
    </form>
  )
}
