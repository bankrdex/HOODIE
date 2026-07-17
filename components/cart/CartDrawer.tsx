'use client'

import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCartStore } from '@/store/cart'

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const total = useCartStore((s) => s.total)
  const coupon = useCartStore((s) => s.coupon)

  const couponDiscount = coupon ? Math.min(coupon.discount, Math.min(...items.map((i) => i.product.base_price * i.quantity))) : 0
  const finalTotal = Math.max(0, total() - couponDiscount)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col border-zinc-800 bg-zinc-950 p-0 text-white"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-zinc-800 px-5 py-4">
          <SheetTitle className="font-bold text-white">
            Cart ({items.length})
          </SheetTitle>
          <button onClick={closeCart} className="text-zinc-500 hover:text-white">
            <X size={18} />
          </button>
        </SheetHeader>

        {/* Empty */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-600">
            <ShoppingBag size={40} strokeWidth={1} />
            <p className="text-sm">Your cart is empty</p>
            <button onClick={closeCart} className="text-xs text-lime-400 underline">
              Browse drops
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 px-5 py-4">
                  {/* Color preview */}
                  <div
                    className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-800"
                    style={{ backgroundColor: item.variant.color_hex }}
                  >
                    {item.previewImage && (
                      <img
                        src={item.previewImage}
                        alt={item.variant.color}
                        className="h-full w-full object-cover"
                        onError={() => {}}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">{item.product.name}</p>
                        <p className="text-xs text-zinc-500">
                          {item.variant.color} · {item.variant.size}
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-zinc-700 hover:text-white">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:border-white hover:text-white"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:border-white hover:text-white"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <span className="text-sm font-bold">
                        ${(item.product.base_price * item.quantity).toFixed(2)} USDC
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-800 px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span>${total().toFixed(2)} USDC</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-lime-400">Coupon</span>
                  <span className="text-lime-400">-${couponDiscount.toFixed(2)} USDC</span>
                </div>
              )}
              <div className="flex justify-between font-black">
                <span>Total</span>
                <span className="text-lime-400">${finalTotal.toFixed(2)} USDC</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 py-3.5 text-sm font-bold text-black hover:bg-lime-300 transition"
              >
                Checkout
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={() => useCartStore.getState().clearCart()}
                className="w-full text-center text-xs text-zinc-700 hover:text-red-400 transition"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
