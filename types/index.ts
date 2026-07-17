export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export type PrintPlacement =
  | 'Front Print'
  | 'Back Print'
  | 'Front & Back Print'
  | 'Sleeve Print'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface User {
  id: string
  fid: number
  username: string
  display_name: string
  avatar_url: string
  wallet_address: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  base_price: number
  images: string[]
  category: string
  is_active: boolean
  is_drop: boolean
  print_placement: PrintPlacement
  units_total: number
  units_left: number
  variants?: ProductVariant[]
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  size: Size
  color: string
  color_hex: string
  stock_quantity: number
  price_modifier: number
  sku: string
}

export interface Drop {
  id: string
  name: string
  description: string
  product_id: string
  drop_date: string
  end_date: string | null
  total_units: number
  units_sold: number
  is_active: boolean
  product?: Product
}

export interface ShippingAddress {
  name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total_amount: number
  currency: string
  tx_hash?: string
  wallet_address: string
  shipping_address: ShippingAddress
  items?: OrderItem[]
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  quantity: number
  unit_price: number
}
