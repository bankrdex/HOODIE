'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { ZABAL_COLORS, ZABAL_PRODUCT } from '@/lib/products'
import { Flame, Package, ChevronRight, Clock } from 'lucide-react'

export default function ShopPage() {
  const totalLeft = ZABAL_COLORS.reduce((sum, c) => sum + c.units, 0)
  const soldPct = Math.round(((ZABAL_PRODUCT.unitsTotal - totalLeft) / ZABAL_PRODUCT.unitsTotal) * 100)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black">Shop</h1>
            <div className="flex items-center gap-1 rounded-full bg-lime-400/10 px-2 py-0.5">
              <Flame size={10} className="text-lime-400" />
              <span className="text-[10px] font-bold text-lime-400">Live Drop</span>
            </div>
          </div>
          <p className="text-xs text-zinc-600">
            Each bundle includes Hoodie + Hat + Key Holder · Pay with USDC on Base
          </p>
        </motion.div>

        {/* ── ZABAL EDITION HERO CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link
            href="/products/zabal"
            className="group block overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition hover:border-zinc-700"
          >
            {/* Image grid — show first 4 colors as preview */}
            <div className="grid grid-cols-2 gap-0.5">
              {ZABAL_COLORS.slice(0, 4).map((color) => (
                <div
                  key={color.id}
                  className="relative aspect-square overflow-hidden"
                  style={{ backgroundColor: color.hex + '33' }}
                >
                  <img
                    src={color.imagePath}
                    alt={color.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if image not yet copied
                      const target = e.currentTarget
                      target.style.display = 'none'
                      if (target.parentElement) {
                        target.parentElement.style.backgroundColor = color.hex
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="p-5">
              {/* Labels */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="rounded-full bg-lime-400 px-2.5 py-0.5 text-[10px] font-bold text-black">
                  DROP 001
                </span>
                <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
                  Front & Back Print
                </span>
              </div>

              <h2 className="text-xl font-black tracking-tight">
                HOOD Zabal Edition
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">{ZABAL_PRODUCT.tagline}</p>

              {/* Color swatches */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ZABAL_COLORS.map((color) => (
                  <div
                    key={color.id}
                    title={color.name}
                    className="h-5 w-5 rounded-full border border-zinc-700 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              {/* Stock bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] mb-1.5">
                  <span className="text-zinc-500">{totalLeft} of {ZABAL_PRODUCT.unitsTotal} remaining</span>
                  <span className="text-zinc-600">{soldPct}% claimed</span>
                </div>
                <div className="h-1 w-full rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-lime-400 transition-all"
                    style={{ width: `${soldPct || 2}%` }}
                  />
                </div>
              </div>

              {/* Price + CTA */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xl font-black">${ZABAL_PRODUCT.price} USDC</p>
                  <p className="text-[10px] text-zinc-600">Hoodie + Hat + Key Holder</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-black transition group-hover:bg-lime-300">
                  Shop Now
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Bundle info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5"
        >
          <Package size={15} className="mt-0.5 flex-shrink-0 text-zinc-600" />
          <p className="text-xs leading-relaxed text-zinc-500">
            Every HOOD bundle includes a{' '}
            <span className="font-semibold text-white">premium hoodie</span>,{' '}
            <span className="font-semibold text-white">matching hat</span>, and{' '}
            <span className="font-semibold text-white">key holder</span>.
            Add your custom text and logo at checkout.
          </p>
        </motion.div>

        {/* Coupon hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-3 flex items-center gap-2 rounded-xl border border-lime-400/20 bg-lime-400/5 px-4 py-3"
        >
          <span className="text-sm">🎟</span>
          <p className="text-xs text-lime-400/80">
            Have a coupon? Save <span className="font-bold text-lime-400">$20</span> off one hoodie at checkout.
          </p>
        </motion.div>

        {/* Coming soon drops */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-700">
            More Drops Coming
          </p>
          {['Drop 002 — TBA', 'Drop 003 — TBA'].map((label) => (
            <div
              key={label}
              className="mb-2 flex items-center justify-between rounded-xl border border-zinc-900 px-4 py-3.5 opacity-40"
            >
              <span className="text-sm font-bold text-zinc-600">{label}</span>
              <div className="flex items-center gap-1 text-zinc-700">
                <Clock size={11} />
                <span className="text-[10px]">Soon</span>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
