/** Порядок категорий в каталоге (тематика сексологов / терапии) */
export const SHOP_CATEGORY_ORDER = [
  "Интим-аксессуары",
  "Книги и образовательные материалы",
  "Подарочные наборы",
  "Сертификаты на терапию",
] as const

export function sortCategoriesForFilter(categoriesPresent: Set<string>): string[] {
  const ordered = SHOP_CATEGORY_ORDER.filter((c) => categoriesPresent.has(c))
  const extras = [...categoriesPresent].filter(
    (c) => !SHOP_CATEGORY_ORDER.some((x) => x === c),
  )
  extras.sort((a, b) => a.localeCompare(b, "ru"))
  return [...ordered, ...extras]
}
