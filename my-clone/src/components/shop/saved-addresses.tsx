"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import type { SavedAddress } from "@/lib/guest-orders"
import { SAVED_ADDRESSES_KEY } from "@/lib/guest-orders"
import { cn } from "@/lib/utils"

function load(): SavedAddress[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SAVED_ADDRESSES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedAddress[]
  } catch {
    return []
  }
}

export function SavedAddressesPanel({
  onPick,
}: {
  onPick?: (a: SavedAddress) => void
}) {
  const [list, setList] = useState<SavedAddress[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setList(load())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(list))
  }, [list, ready])

  if (!ready || list.length === 0) {
    return (
      <p className="text-sm text-white/65">
        Сохранённых адресов пока нет — они появятся после оформления заказа, если
        вы сохраните адрес в форме ниже.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {list.map((a) => (
        <li
          key={a.id}
          className={cn(
            "flex flex-col gap-2 rounded-[var(--radius-md)] border border-[rgba(128,0,32,0.35)] bg-[rgba(255,255,255,0.04)] p-3 sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div>
            <p className="font-medium text-white">{a.label}</p>
            <p className="text-sm text-white/65">
              {a.city}, {a.street}, {a.building}
              {a.apartment ? `, кв. ${a.apartment}` : ""}
            </p>
          </div>
          {onPick ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPick(a)}
            >
              Подставить
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export function rememberAddress(a: Omit<SavedAddress, "id">) {
  if (typeof window === "undefined") return
  const id = crypto.randomUUID()
  const next: SavedAddress = {
    id,
    ...a,
  }
  const prev = load().filter(
    (x) =>
      `${x.city}${x.street}` !== `${next.city}${next.street}`,
  )
  localStorage.setItem(
    SAVED_ADDRESSES_KEY,
    JSON.stringify([next, ...prev].slice(0, 8)),
  )
}
