'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount)
  const openCart = useCartStore((s) => s.openCart)
  const count = itemCount()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-5">
        <Link href="/" className="text-xl font-black tracking-tighter">
          HOOD
        </Link>

        <button
          onClick={openCart}
          className="relative p-2"
          aria-label="Open cart"
        >
          <ShoppingBag size={22} className="text-white" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-lime-400 text-[10px] font-bold text-black">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
