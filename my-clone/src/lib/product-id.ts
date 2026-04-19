/** UUID из Supabase (товары из БД). Демо-каталог использует id вида `demo-1`. */
export function isLikelySupabaseProductId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  )
}
