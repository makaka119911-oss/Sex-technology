import type { Product } from "@/types/shop"

/** Локальный каталог, если Supabase не настроен */
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    name: "Набор «Нежность»",
    description: "Подарочный набор для двоих",
    price: 3490,
    category: "Наборы",
    image_url: "/images/shop/placeholder.svg",
    in_stock: true,
  },
  {
    id: "demo-2",
    name: "Массажное масло",
    description: "С натуральными маслами, без запаха",
    price: 1290,
    category: "Уход",
    image_url: "/images/shop/placeholder.svg",
    in_stock: true,
  },
  {
    id: "demo-3",
    name: "Интимная гигиена",
    description: "pH-баланс, деликатная формула",
    price: 890,
    category: "Уход",
    image_url: "/images/shop/placeholder.svg",
    in_stock: true,
  },
  {
    id: "demo-4",
    name: "Игрушка-классика",
    description: "Бесшумный мотор, несколько режимов",
    price: 2490,
    category: "Игрушки",
    image_url: "/images/shop/placeholder.svg",
    in_stock: true,
  },
]
