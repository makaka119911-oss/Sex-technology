import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import type { Product } from "@/types/shop"

import { DEMO_PRODUCTS } from "@/data/demo-products"

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getClient()
  if (!supabase) return DEMO_PRODUCTS

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, category, image_url, in_stock")
    .eq("in_stock", true)
    .order("created_at", { ascending: false })

  if (error || !data?.length) return DEMO_PRODUCTS

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    image_url: row.image_url,
    in_stock: row.in_stock ?? true,
  }))
}

export async function fetchProductByIds(
  ids: string[],
): Promise<Map<string, Product>> {
  const map = new Map<string, Product>()
  if (!ids.length) return map

  const supabase = getClient()
  if (!supabase) {
    for (const p of DEMO_PRODUCTS) {
      if (ids.includes(p.id)) map.set(p.id, p)
    }
    return map
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, category, image_url, in_stock")
    .in("id", ids)

  if (error || !data) return map

  for (const row of data) {
    map.set(row.id, {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      category: row.category,
      image_url: row.image_url,
      in_stock: row.in_stock ?? true,
    })
  }
  return map
}
