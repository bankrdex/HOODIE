import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppliedCoupon } from '@/lib/coupons'

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface ProductVariant {
  id: string
  size: Size
  color: string
  color_hex: string
  stock_quantity: number
  price_modifier: number
  sku: string
}

export interface Product {
  id: string
  name: string
  description: string
  base_price: number
  images: string[]
  category: string
  is_drop: boolean
}

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
  previewImage?: string
}

export interface OrderCustomization {
  frontText: string
  backText: string
  chestLogoUrl: string
  chestLogoPreview: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  customization: OrderCustomization
  coupon: AppliedCoupon | null
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product, variant: ProductVariant, quantity?: number, previewImage?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
  setCustomization: (updates: Partial<OrderCustomization>) => void
  setCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
}

const DEFAULT_CUSTOMIZATION: OrderCustomization = {
  frontText: '',
  backText: '',
  chestLogoUrl: '',
  chestLogoPreview: '',
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      customization: DEFAULT_CUSTOMIZATION,
      coupon: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, variant, quantity = 1, previewImage) => {
        const { items } = get()
        const idx = items.findIndex((i) => i.variant.id === variant.id)
        if (idx > -1) {
          const updated = [...items]
          updated[idx].quantity += quantity
          set({ items: updated })
        } else {
          set({
            items: [...items, {
              id: `${variant.id}-${Date.now()}`,
              product, variant, quantity, previewImage,
            }],
          })
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) { get().removeItem(id); return }
        set({ items: get().items.map((i) => i.id === id ? { ...i, quantity } : i) })
      },

      clearCart: () => set({
        items: [],
        customization: DEFAULT_CUSTOMIZATION,
        coupon: null,
      }),

      total: () =>
        get().items.reduce((sum, item) =>
          sum + (item.product.base_price + item.variant.price_modifier) * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      setCustomization: (updates) =>
        set({ customization: { ...get().customization, ...updates } }),

      setCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
    }),
    { name: 'hood-cart-v3' }
  )
)
