'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { PRODUCTS } from '@/lib/products'
import { Flame, Package, ChevronRight, Clock, Gift } from 'lucide-react'

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black">Shop</h1>
            <div className="flex items-center gap-1 rounded-full bg-lime-400/10 px-2 py-0.5">
              <Flame size={10} className="text-lime-400" />
              <span className="text-[10px] font-bold text-lime-400">
                {PRODUCTS.filter(p => p.isDrop).length} Live Drops
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-600">
            Every bundle: Hoodie + Hat + Key Holder · Pay with USDC on Base
          </p>
        </motion.div>

        {/* Free coupon banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-5 flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-lime-400/5 px-4 py-3.5"
        >
          <Gift size={16} className="flex-shrink-0 text-lime-400" />
          <div>
            <p className="text-xs font-bold text-lime-400">FREE HOOD FIRST 50</p>
            <p className="text-[11px] text-zinc-500">
              Have a code? Get a free hoodie — pay $9.99 shipping only at checkout.
            </p>
          </div>
        </motion.div>

        {/* Product cards */}
        <div className="space-y-4">
          {PRODUCTS.map((product, i) => {
            const firstColor = product.colors[0]
            const lastColor = product.colors[product.colors.length - 1]
            const midColor = product.colors[Math.floor(product.colors.length / 2)]

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <Link
                  href={`/products/${product.id}`}
                  className="group block overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition hover:border-zinc-700"
                >
                  {/* Image preview grid */}
                  <div className="grid grid-cols-3 gap-0.5">
                    {[firstColor, midColor, lastColor].map((color) => (
                      <div
                        key={color.id}
                        className="relative aspect-square overflow-hidden"
                        style={{ backgroundColor: color.hex + '22' }}
                      >
                        <img
                          src={color.imagePath}
                          alt={color.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.style.backgroundColor = color.hex
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="rounded-full bg-lime-400 px-2.5 py-0.5 text-[10px] font-bold text-black">
                        {product.collection}
                      </span>
                      <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
                        {product.printPlacement}
                      </span>
                    </div>

                    <h2 className="text-xl font-black tracking-tight">{product.name}</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">{product.tagline}</p>

                    {/* Color swatches */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.colors.map((color) => (
                        <div
                          key={color.id}
                          title={color.name}
                          className="h-5 w-5 rounded-full border border-zinc-700 flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                      <span className="text-[10px] text-zinc-600 self-center ml-1">
                        {product.colors.length} colors
                      </span>
                    </div>

                    {/* Units remaining */}
                    <div className="mt-3 flex justify-between text-[10px]">
                      <span className="text-zinc-600">
                        {product.unitsTotal} units total
                      </span>
                      {product.unitsTotal <= 30 && (
                        <span className="text-red-400 font-bold">Very limited</span>
                      )}
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xl font-black">${product.price} USDC</p>
                        <p className="text-[10px] text-zinc-600">Hoodie + Hat + Key Holder</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-black transition group-hover:bg-lime-300">
                        Shop
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bundle info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-5 flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5"
        >
          <Package size={15} className="mt-0.5 flex-shrink-0 text-zinc-600" />
          <p className="text-xs leading-relaxed text-zinc-500">
            Every HOOD bundle includes a{' '}
            <span className="font-semibold text-white">premium hoodie</span>,{' '}
            <span className="font-semibold text-white">matching hat</span>, and{' '}
            <span className="font-semibold text-white">key holder</span>.
            Designed exclusively by the HOOD team.
          </p>
        </motion.div>

        {/* Coming soon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-3"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-800">
            More Drops Coming
          </p>
          {['Drop 003 — TBA', 'Drop 004 — TBA'].map((label) => (
            <div
              key={label}
              className="mb-2 flex items-center justify-between rounded-xl border border-zinc-900 px-4 py-3.5 opacity-30"
            >
              <span className="text-sm font-bold text-zinc-600">{label}</span>
              <Clock size={11} className="text-zinc-700" />
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
