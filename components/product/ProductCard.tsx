'use client'

import Link from 'next/link'
import { Flame } from 'lucide-react'
import { PLACEMENT_COLORS } from '@/lib/products'
import type { PrintPlacement } from '@/types'

type ProductCardProps = {
  id: string
  name: string
  price: number
  isDrop?: boolean
  unitsLeft?: number
  unitsTotal?: number
  printPlacement?: PrintPlacement
  previewColor?: string
  collection?: string
}

export default function ProductCard({
  id,
  name,
  price,
  isDrop,
  unitsLeft,
  unitsTotal,
  printPlacement,
  previewColor = '#1a1a1a',
  collection,
}: ProductCardProps) {
  const soldPct =
    unitsTotal && unitsLeft !== undefined
      ? Math.round(((unitsTotal - unitsLeft) / unitsTotal) * 100)
      : null

  const placementStyle = printPlacement
    ? PLACEMENT_COLORS[printPlacement]
    : null

  return (
    <Link
      href={`/products/${id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:border-zinc-700"
    >
      {/* Product image area — SVG hoodie placeholder */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 flex items-center justify-center">
        {/* Mini hoodie SVG preview */}
        <svg
          viewBox="0 0 320 420"
          className="w-3/4 h-3/4 opacity-90 transition duration-300 group-hover:scale-105 drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 78 142 L 22 265 Q 18 274 26 277 L 62 280 Q 70 281 74 272 L 108 158"
            fill={previewColor}
          />
          <path
            d="M 242 142 L 298 265 Q 302 274 294 277 L 258 280 Q 250 281 246 272 L 212 158"
            fill={previewColor}
          />
          <path
            d="M 90 145 L 230 145 L 238 398 Q 238 408 228 408 L 92 408 Q 82 408 82 398 Z"
            fill={previewColor}
          />
          <path
            d="M 90 145 L 66 82 Q 54 48 82 32 L 124 18 Q 140 12 148 30 L 152 145"
            fill={previewColor}
          />
          <path
            d="M 230 145 L 254 82 Q 266 48 238 32 L 196 18 Q 180 12 172 30 L 168 145"
            fill={previewColor}
          />
          <ellipse cx="160" cy="82" rx="44" ry="58" fill="rgba(0,0,0,0.55)" />
          <ellipse cx="160" cy="84" rx="36" ry="50" fill="rgba(0,0,0,0.65)" />
          {/* Shading */}
          <path
            d="M 90 145 L 230 145 L 238 398 Q 238 408 228 408 L 92 408 Q 82 408 82 398 Z"
            fill="url(#cardShade)"
          />
          <defs>
            <linearGradient id="cardShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
              <stop offset="40%" stopColor="rgba(0,0,0,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
            </linearGradient>
          </defs>
          {/* Pocket */}
          <path
            d="M 110 290 Q 110 284 117 284 L 203 284 Q 210 284 210 290 L 213 348 Q 213 355 206 355 L 114 355 Q 107 355 107 348 Z"
            fill="rgba(0,0,0,0.18)"
          />
        </svg>

        {/* Top badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isDrop && (
            <span className="flex items-center gap-1 rounded-full bg-lime-400 px-2 py-0.5 text-[9px] font-bold text-black">
              <Flame size={8} />
              DROP
            </span>
          )}
          {collection && (
            <span className="rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-semibold text-zinc-400 backdrop-blur">
              {collection}
            </span>
          )}
        </div>

        {/* Units left — urgent */}
        {unitsLeft !== undefined && unitsLeft <= 15 && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="rounded-lg bg-black/80 px-2 py-1.5 backdrop-blur">
              <div className="flex justify-between text-[9px] mb-1">
                <span className="text-red-400 font-bold">{unitsLeft} left</span>
                <span className="text-zinc-600">{soldPct}% sold</span>
              </div>
              <div className="h-0.5 w-full rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{ width: `${soldPct}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="text-sm font-black tracking-tight">{name}</h3>
          {/* What's included hint */}
          <p className="text-[10px] text-zinc-600 mt-0.5">
            Hoodie + Hat + Key Holder
          </p>
        </div>

        {/* Print placement badge */}
        {placementStyle && (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold ${placementStyle}`}
          >
            {printPlacement}
          </span>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-sm font-black">{price} USDC</span>
          <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
