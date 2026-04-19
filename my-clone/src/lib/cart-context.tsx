"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { CartLine, Product } from "@/types/shop"

/** v2: сброс после перехода с демо-ID на UUID из Supabase */
const STORAGE_KEY = "territory-love-cart-v2"

type CartContextValue = {
  lines: CartLine[]
  ready: boolean
  add: (product: Product, quantity?: number) => void
  remove: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartLine[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLines(readStorage())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, ready])

  const add = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === product.id)
      if (i === -1) return [...prev, { product, quantity }]
      const next = [...prev]
      next[i] = {
        ...next[i],
        quantity: next[i].quantity + quantity,
      }
      return next
    })
  }, [])

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId))
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      remove(productId)
      return
    }
    setLines((prev) =>
      prev.map((l) =>
        l.product.id === productId ? { ...l, quantity } : l,
      ),
    )
  }, [remove])

  const clear = useCallback(() => setLines([]), [])

  const totalItems = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  )

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.product.price * l.quantity, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      lines,
      ready,
      add,
      remove,
      setQuantity,
      clear,
      totalItems,
      subtotal,
    }),
    [lines, ready, add, remove, setQuantity, clear, totalItems, subtotal],
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
