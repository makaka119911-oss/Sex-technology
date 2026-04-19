export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  image_url: string | null
  in_stock: boolean
}

export type CartLine = {
  product: Product
  quantity: number
}

export type DeliveryMethod = "courier" | "pickup" | "post"

export type PickupPointSelection = {
  lat: number
  lon: number
  label: string
}

export type DeliveryAddress = {
  city: string
  street: string
  building: string
  apartment: string
  postalCode?: string
  /** Выбор на карте (ПВЗ), опционально */
  pickupPoint?: PickupPointSelection
}
