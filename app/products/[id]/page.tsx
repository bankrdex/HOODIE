'use client'

import { useState, use } from 'react'
import {
  ChevronLeft, Check, ShoppingBag, Minus, Plus, Package, Info,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { useCartStore, type ProductVariant } from '@/store/cart'
import { getProduct, PLACEMENT_COLORS } from '@/lib/products'

const SIZES: ProductVariant['size'][] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const product = getProduct(id)

  const [selectedColor, setSelectedColor] = useState(
    product ? product.colors[0] : null
  )
  const [selectedSize, setSelectedSize] = useState<ProductVariant['size'] | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showSizeSheet, setShowSizeSheet] = useState(false)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  if (!product || !selectedColor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
        <p className="text-zinc-600">Product not found</p>
        <Link href="/shop" className="text-sm text-lime-400">Back to shop</Link>
      </div>
    )
  }

  const placementStyle = PLACEMENT_COLORS[product.printPlacement]

  function handleAddToCart() {
    if (!product || !selectedSize || !selectedColor) return
    const variant: ProductVariant = {
      id: `${product.id}-${selectedColor.id}-${selectedSize}`,
      size: selectedSize,
      color: selectedColor.name,
      color_hex: selectedColor.hex,
      stock_quantity: 20,
      price_modifier: 0,
      sku: `HOOD-${product.id.toUpperCase()}-${selectedColor.id.toUpperCase()}-${selectedSize}`,
    }
    addItem(
      {
        id: product.id,
        name: `${product.name} — ${selectedColor.name}`,
        description: product.description,
        base_price: product.price,
        images: [selectedColor.imagePath],
        category: 'hoodie',
        is_drop: product.isDrop,
      },
      variant,
      quantity,
      selectedColor.imagePath
    )
    setAdded(true)
    setShowSizeSheet(false)
    openCart()
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 pt-3">
        <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-white transition">
          <ChevronLeft size={15} /> Shop
        </Link>
      </div>

      <div className="mx-auto max-w-lg px-4 pb-44 pt-3 space-y-4">

        {/* Main image */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <div
            className="relative aspect-square flex items-center justify-center"
            style={{ backgroundColor: selectedColor.hex + '18' }}
          >
            {!imgError ? (
              <img
                key={selectedColor.id}
                src={selectedColor.imagePath}
                alt={selectedColor.name}
                className="h-full w-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="h-3/4 w-3/4 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: selectedColor.hex }}
              >
                <span className="text-4xl font-black opacity-20">H</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: selectedColor.hex }} />
                <span className="text-xs font-semibold">{selectedColor.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product info */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{product.collection}</p>
              <h1 className="text-2xl font-black tracking-tight">{product.name}</h1>
              <p className="text-sm italic text-zinc-500 mt-0.5">{product.tagline}</p>
            </div>
            {product.isDrop && (
              <span className="mt-1 flex-shrink-0 rounded-full bg-lime-400 px-2.5 py-0.5 text-[10px] font-bold text-black">
                DROP
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <p className="text-2xl font-black">${product.price} USDC</p>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${placementStyle}`}>
              {product.printPlacement}
            </span>
          </div>
        </div>

        {/* Color picker */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-600">
            Color — {selectedColor.name}
          </p>

          {/* Swatch grid */}
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => { setSelectedColor(color); setImgError(false) }}
                title={color.name}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  selectedColor.id === color.id
                    ? 'border-lime-400 scale-110'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          {/* Color name pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => { setSelectedColor(color); setImgError(false) }}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-medium transition ${
                  selectedColor.id === color.id
                    ? 'bg-white text-black'
                    : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>

        {/* Customization note */}
        <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-lime-400" />
          <div>
            <p className="text-xs font-bold text-white">Customize at checkout</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
              Add front text, back text, and your chest logo (Farcaster PFP or any image) after selecting size.
            </p>
          </div>
        </div>

        {/* What's included */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package size={14} className="text-lime-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">What's Included</p>
          </div>
          <div className="space-y-3">
            {product.includes.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-base">
                  {item.emoji}
                </div>
                <div className="flex flex-1 items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-[11px] text-zinc-600">{item.sub}</p>
                  </div>
                  <Check size={14} className="mt-0.5 flex-shrink-0 text-lime-400" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <p className="text-[11px] leading-relaxed text-zinc-600">
              Designed exclusively by the HOOD team. Every collection is produced in limited quantities.
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-600">Details</p>
          <ul className="space-y-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-zinc-400">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-700" />
                {d}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Sticky bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-zinc-800 bg-black/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 px-3 py-2.5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-600 hover:text-white">
              <Minus size={13} />
            </button>
            <span className="w-4 text-center text-sm font-bold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-600 hover:text-white">
              <Plus size={13} />
            </button>
          </div>
          <button
            onClick={() => setShowSizeSheet(true)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition ${
              added ? 'bg-zinc-700 text-white' : 'bg-lime-400 text-black hover:bg-lime-300'
            }`}
          >
            <ShoppingBag size={15} />
            {added ? '✓ Added!' : `Add to Cart · $${(product.price * quantity).toFixed(2)} USDC`}
          </button>
        </div>
      </div>

      {/* Size sheet */}
      {showSizeSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSizeSheet(false)} />
          <div className="relative rounded-t-3xl border-t border-zinc-800 bg-zinc-950 px-5 py-6">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-zinc-800" />
            <div className="mb-1 flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border border-zinc-700" style={{ backgroundColor: selectedColor.hex }} />
              <h3 className="text-lg font-black">Select a Size</h3>
            </div>
            <p className="mb-5 text-sm text-zinc-500">
              {selectedColor.name} · {product.name}
            </p>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl py-4 text-sm font-bold transition ${
                    selectedSize === size
                      ? 'bg-white text-black'
                      : 'border border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full rounded-xl py-4 text-sm font-bold transition ${
                selectedSize
                  ? 'bg-lime-400 text-black hover:bg-lime-300'
                  : 'cursor-not-allowed bg-zinc-800 text-zinc-600'
              }`}
            >
              {selectedSize
                ? `Add to Cart — $${(product.price * quantity).toFixed(2)} USDC`
                : 'Select a size first'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
