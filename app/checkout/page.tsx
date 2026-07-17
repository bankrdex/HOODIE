'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, Tag, X, Upload, Check,
  ShoppingBag, Wallet, AlertCircle
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, encodeFunctionData, erc20Abi } from 'viem'

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const
const HOOD_WALLET = (process.env.NEXT_PUBLIC_HOOD_WALLET || '') as `0x${string}`
const USDC_DECIMALS = 6

type Step = 'cart' | 'customize' | 'shipping' | 'review' | 'paying' | 'success'

interface ShippingForm {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
}

const EMPTY_SHIPPING: ShippingForm = {
  name: '', email: '', phone: '',
  address: '', city: '', state: '', country: '',
}

export default function CheckoutPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()

  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const customization = useCartStore((s) => s.customization)
  const coupon = useCartStore((s) => s.coupon)
  const setCustomization = useCartStore((s) => s.setCustomization)
  const setCoupon = useCartStore((s) => s.setCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)
  const clearCart = useCartStore((s) => s.clearCart)

  const [step, setStep] = useState<Step>('cart')
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponId, setCouponId] = useState<string | null>(null)
  const [shipping, setShipping] = useState<ShippingForm>(EMPTY_SHIPPING)
  const [shippingError, setShippingError] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [orderRef, setOrderRef] = useState('')
  const [payError, setPayError] = useState('')
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)

  // wagmi
  const { sendTransactionAsync } = useSendTransaction()
  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
  })

  // Redirect if empty
  useEffect(() => {
    if (items.length === 0 && step !== 'success') {
      router.push('/shop')
    }
  }, [items, step, router])

  // When tx confirms — save order
  useEffect(() => {
    if (txConfirmed && txHash && step === 'paying') {
      saveOrder(txHash)
    }
  }, [txConfirmed, txHash])

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) {
        const url = URL.createObjectURL(files[0])
        setLogoPreview(url)
        setCustomization({ chestLogoPreview: url })
      }
    },
  })

  // Totals
  const subtotal = Number(total() || 0)
  const discountValue = Number(coupon?.discount_value || 0)
  const shippingFee = Number(coupon?.shipping_fee || 0)

  let finalTotal = 0
  let couponDiscount = 0

  if (coupon) {
    switch (coupon.discount_type) {
      case 'free_hoodie':
        finalTotal = shippingFee
        couponDiscount = subtotal
        break
      case 'percentage':
        couponDiscount = subtotal * (discountValue / 100)
        finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee)
        break
      case 'fixed':
        couponDiscount = Math.min(subtotal, discountValue)
        finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee)
        break
      default:
        finalTotal = subtotal + shippingFee
    }
  } else {
    finalTotal = subtotal
  }

  // Final validation to prevent NaN
  if (isNaN(finalTotal) || !isFinite(finalTotal)) {
    finalTotal = 0
  }

  // Coupon
  async function applyCode() {
    setCouponError('')
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: couponInput,
        wallet_address: address || '',
      }),
    })
    const data = await res.json()
    if (!data.valid) {
      setCouponError(data.error || 'Invalid code')
      return
    }
    setCoupon({
      code: couponInput.trim().toUpperCase(),
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      shipping_fee: data.shipping_fee,
      label: data.label,
    })
    setCouponId(data.coupon_id)
    setCouponInput('')
  }

  // Shipping validation
  function validateShipping(): boolean {
    const required: (keyof ShippingForm)[] = [
      'name', 'email', 'phone', 'address', 'city', 'country',
    ]
    for (const f of required) {
      if (!shipping[f].trim()) {
        setShippingError(`${f.charAt(0).toUpperCase() + f.slice(1)} is required`)
        return false
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      setShippingError('Enter a valid email address')
      return false
    }
    setShippingError('')
    return true
  }

  // Pay with USDC
  async function handlePay() {
    if (!isConnected || !address) {
      setPayError('Wallet not connected. Open this app inside Warpcast.')
      return
    }
    if (!HOOD_WALLET) {
      setPayError('Payment wallet not configured. Contact HOOD team.')
      return
    }

    setPayError('')
    setStep('paying')

    try {
      const amount = parseUnits(finalTotal.toFixed(6), USDC_DECIMALS)

      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [HOOD_WALLET, amount],
      })

      const hash = await sendTransactionAsync({
        to: USDC_ADDRESS,
        data,
      })

      setTxHash(hash)
      // saveOrder called via useEffect when txConfirmed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transaction failed'
      setPayError(message.includes('rejected') ? 'You rejected the transaction.' : message)
      setStep('review')
    }
  }

  // Save order to Supabase after tx confirmed
  const saveOrder = useCallback(async (hash: string) => {
    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      variant_id: item.variant.id,
      quantity: item.quantity,
      unit_price: item.product.base_price + item.variant.price_modifier,
    }))

    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems,
        wallet_address: address,
        tx_hash: hash,
        total_amount: finalTotal,
        coupon_code: coupon?.code || null,
        coupon_id: couponId || null,
        coupon_discount: couponDiscount,
        front_text: customization.frontText || null,
        back_text: customization.backText || null,
        chest_logo_url: customization.chestLogoUrl || logoPreview || null,
        shipping_name: shipping.name,
        shipping_email: shipping.email,
        shipping_phone: shipping.phone,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_country: shipping.country,
      }),
    })

    const data = await res.json()
    if (data.success) {
      setOrderRef(data.reference)
      clearCart()
      setStep('success')
    } else {
      // Payment went through but order save failed
      // Store tx hash locally so user can contact support
      setPayError(
        `Payment confirmed (${hash.slice(0, 10)}...) but order save failed. Contact HOOD with your tx hash.`
      )
      setStep('review')
    }
  }, [items, address, finalTotal, coupon, couponId, couponDiscount, customization, logoPreview, shipping, clearCart])

  const STEPS: Step[] = ['cart', 'customize', 'shipping', 'review']
  const stepIndex = STEPS.indexOf(step as typeof STEPS[number])

  // ── Success screen ──
  if (step === 'success') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6 text-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30">
          <Check size={32} className="text-lime-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Order Confirmed!</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Reference: <span className="font-mono text-white">{orderRef}</span>
          </p>
        </div>
        <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left space-y-2">
          <p className="text-xs text-zinc-500">
            Confirmation sent to{' '}
            <span className="text-white">{shipping.email}</span>
          </p>
          <p className="text-xs text-zinc-500">
            Total paid:{' '}
            <span className="font-bold text-lime-400">${finalTotal.toFixed(2)} USDC</span>
          </p>
          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 underline break-all"
            >
              View on Basescan
            </a>
          )}
          {customization.frontText && (
            <p className="text-xs text-zinc-500">
              Front: <span className="text-white">"{customization.frontText}"</span>
            </p>
          )}
          {customization.backText && (
            <p className="text-xs text-zinc-500">
              Back: <span className="text-white">"{customization.backText}"</span>
            </p>
          )}
        </div>
        <Link
          href="/orders"
          className="rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black"
        >
          View My Orders
        </Link>
      </div>
    )
  }

  // ── Paying screen ──
  if (step === 'paying') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6 text-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900">
          <Wallet size={32} className="text-lime-400 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-black">
            {txHash ? 'Confirming on Base...' : 'Waiting for approval...'}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {txHash
              ? 'Transaction submitted. Waiting for Base network confirmation.'
              : 'Approve the USDC transfer in your wallet.'}
          </p>
        </div>
        {txHash && (
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-400 underline"
          >
            {txHash.slice(0, 18)}...
          </a>
        )}
        <div className="flex gap-2">
          {[0,1,2,3,4].map((i) => (
            <div
              key={i}
              className="h-2 w-2 animate-pulse rounded-full bg-lime-400"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-5">
          <button
            onClick={() => {
              if (step === 'cart') router.push('/shop')
              else setStep(STEPS[Math.max(0, stepIndex - 1)])
            }}
            className="text-zinc-500 hover:text-white"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold capitalize">
              {step === 'cart' ? 'Your Order'
                : step === 'customize' ? 'Customize'
                : step === 'shipping' ? 'Shipping'
                : 'Review & Pay'}
            </p>
            <p className="text-[10px] text-zinc-600">
              Step {Math.max(1, stepIndex + 1)} of {STEPS.length}
            </p>
          </div>
          <div className="w-8" />
        </div>
        <div className="h-0.5 bg-zinc-900">
          <div
            className="h-full bg-lime-400 transition-all duration-500"
            style={{ width: `${((Math.max(1, stepIndex + 1)) / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pb-32 pt-5">

        {/* ── STEP 1: Cart + Coupon ── */}
        {step === 'cart' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black">Your Order</h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div
                    className="h-14 w-14 flex-shrink-0 rounded-xl border border-zinc-700 overflow-hidden"
                    style={{ backgroundColor: item.variant.color_hex }}
                  >
                    {item.previewImage && (
                      <img src={item.previewImage} alt={item.variant.color} className="h-full w-full object-cover" onError={() => {}} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.product.name}</p>
                    <p className="text-xs text-zinc-500">
                      {item.variant.color} · {item.variant.size} · Qty {item.quantity}
                    </p>
                    <p className="mt-1 text-sm font-black text-lime-400">
                      ${((item.product.base_price + item.variant.price_modifier) * item.quantity).toFixed(2)} USDC
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Tag size={13} className="text-lime-400" />
                <p className="text-xs font-bold">Coupon Code</p>
              </div>

              {coupon ? (
                <div className="flex items-center justify-between rounded-xl bg-lime-400/10 border border-lime-400/20 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-bold text-lime-400 font-mono">{coupon.code}</p>
                    <p className="text-[10px] text-zinc-500">-${couponDiscount.toFixed(2)} USDC off one hoodie</p>
                  </div>
                  <button onClick={() => { removeCoupon(); setCouponId(null) }} className="text-zinc-600 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ZABAL-HOOD01"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                      className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-700 focus:border-zinc-600 focus:outline-none font-mono"
                    />
                    <button
                      onClick={applyCode}
                      className="rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-bold hover:bg-zinc-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-400">{couponError}</p>}
                  <p className="text-[10px] text-zinc-700">
                    $20 off one hoodie. One use per wallet.
                  </p>
                </>
              )}
            </div>

            {/* Totals */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span>${subtotal.toFixed(2)} USDC</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-lime-400">Coupon</span>
                  <span className="text-lime-400">-${couponDiscount.toFixed(2)} USDC</span>
                </div>
              )}
              <div className="border-t border-zinc-800 pt-2 flex justify-between font-black">
                <span>Total</span>
                <span className="text-lime-400">${finalTotal.toFixed(2)} USDC</span>
              </div>
            </div>

            <button
              onClick={() => setStep('customize')}
              className="w-full rounded-xl bg-lime-400 py-4 text-sm font-bold text-black hover:bg-lime-300 transition"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: Customize ── */}
        {step === 'customize' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black">Customize Your Hoodie</h2>
              <p className="text-xs text-zinc-500 mt-1">Leave blank for no print. Applies to all items.</p>
            </div>

            {/* Front text */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Front Text (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. HOOD NATION"
                maxLength={30}
                value={customization.frontText}
                onChange={(e) => setCustomization({ frontText: e.target.value })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
              />
              <p className="text-[10px] text-zinc-700">{customization.frontText.length}/30</p>
            </div>

            {/* Back text */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Back Text (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. presdency.eth"
                maxLength={30}
                value={customization.backText}
                onChange={(e) => setCustomization({ backText: e.target.value })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
              />
              <p className="text-[10px] text-zinc-700">{customization.backText.length}/30</p>
            </div>

            {/* Chest logo */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Chest Logo (optional)
              </label>

              <div
                {...getRootProps()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 p-5 text-center hover:border-lime-400 transition"
              >
                <input {...getInputProps()} />
                {logoPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={logoPreview} alt="Preview" className="h-20 w-20 rounded-xl object-cover" />
                    <p className="text-xs text-zinc-500">Tap to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                      <Upload size={16} className="text-zinc-500" />
                    </div>
                    <p className="text-sm font-semibold">Upload image or PFP</p>
                    <p className="text-xs text-zinc-600">PNG, JPG, WebP</p>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-1.5 text-center text-xs text-zinc-700">or paste Farcaster PFP URL</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={customization.chestLogoUrl}
                    onChange={(e) => setCustomization({ chestLogoUrl: e.target.value })}
                    className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
                  />
                  {customization.chestLogoUrl && (
                    <button onClick={() => setCustomization({ chestLogoUrl: '' })} className="text-zinc-600 hover:text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {customization.chestLogoUrl && (
                  <img
                    src={customization.chestLogoUrl}
                    alt="Preview"
                    className="mt-2 h-16 w-16 rounded-xl object-cover border border-zinc-800"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                )}
              </div>
            </div>

            <button
              onClick={() => setStep('shipping')}
              className="w-full rounded-xl bg-lime-400 py-4 text-sm font-bold text-black hover:bg-lime-300 transition"
            >
              Continue to Shipping →
            </button>
            <button
              onClick={() => setStep('shipping')}
              className="w-full text-center text-xs text-zinc-700 hover:text-zinc-500"
            >
              Skip — no customization
            </button>
          </div>
        )}

        {/* ── STEP 3: Shipping ── */}
        {step === 'shipping' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black">Shipping Info</h2>
              <p className="text-xs text-zinc-500 mt-1">Where should we send your HOOD bundle?</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
              {([
                { key: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
                { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
                { key: 'phone', label: 'Phone', placeholder: '+1 555 000 0000', type: 'tel' },
                { key: 'address', label: 'Address', placeholder: '123 Fashion Ave, Suite 100', type: 'text' },
                { key: 'city', label: 'City', placeholder: 'New York', type: 'text' },
                { key: 'state', label: 'State / Province', placeholder: 'NY', type: 'text' },
                { key: 'country', label: 'Country', placeholder: 'United States', type: 'text' },
              ] as { key: keyof ShippingForm; label: string; placeholder: string; type: string }[]).map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={shipping[key]}
                    onChange={(e) => setShipping((s) => ({ ...s, [key]: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {shippingError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{shippingError}</p>
              </div>
            )}

            <button
              onClick={() => { if (validateShipping()) setStep('review') }}
              className="w-full rounded-xl bg-lime-400 py-4 text-sm font-bold text-black hover:bg-lime-300 transition"
            >
              Review Order →
            </button>
          </div>
        )}

        {/* ── STEP 4: Review & Pay ── */}
        {step === 'review' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black">Review & Pay</h2>

            {/* Items */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Order</p>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full border border-zinc-700 flex-shrink-0" style={{ backgroundColor: item.variant.color_hex }} />
                    <span className="text-sm">{item.variant.color} / {item.variant.size} × {item.quantity}</span>
                  </div>
                  <span className="text-sm font-bold">${((item.product.base_price + item.variant.price_modifier) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Customization */}
            {(customization.frontText || customization.backText || logoPreview || customization.chestLogoUrl) && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Customization</p>
                {customization.frontText && (
                  <p className="text-sm text-zinc-400">Front: <span className="text-white font-semibold">"{customization.frontText}"</span></p>
                )}
                {customization.backText && (
                  <p className="text-sm text-zinc-400">Back: <span className="text-white font-semibold">"{customization.backText}"</span></p>
                )}
                {(logoPreview || customization.chestLogoUrl) && (
                  <div className="flex items-center gap-2">
                    <img
                      src={logoPreview || customization.chestLogoUrl}
                      alt="Logo"
                      className="h-10 w-10 rounded-lg object-cover border border-zinc-700"
                      onError={() => {}}
                    />
                    <span className="text-xs text-zinc-500">Chest logo</span>
                  </div>
                )}
              </div>
            )}

            {/* Shipping */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">Ships to</p>
              <p className="text-sm font-semibold">{shipping.name}</p>
              <p className="text-xs text-zinc-500">{shipping.address}</p>
              <p className="text-xs text-zinc-500">{shipping.city}{shipping.state ? `, ${shipping.state}` : ''}, {shipping.country}</p>
              <p className="text-xs text-zinc-500">{shipping.email} · {shipping.phone}</p>
            </div>

            {/* Final total */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span>${subtotal.toFixed(2)} USDC</span>
              </div>
              {coupon && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-lime-400">Coupon ({coupon.code})</span>
                    <span className="text-lime-400">-${couponDiscount.toFixed(2)} USDC</span>
                  </div>
                  {coupon.shipping_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Shipping</span>
                      <span>${Number(coupon.shipping_fee).toFixed(2)} USDC</span>
                    </div>
                  )}
                </>
              )}
              <div className="border-t border-zinc-800 pt-2 flex justify-between font-black text-lg">
                <span>Total</span>
                <span className="text-lime-400">${finalTotal.toFixed(2)} USDC</span>
              </div>
            </div>

            {/* Wallet status */}
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${
              isConnected
                ? 'border-lime-400/20 bg-lime-400/5'
                : 'border-red-500/20 bg-red-500/5'
            }`}>
              <Wallet size={14} className={isConnected ? 'text-lime-400' : 'text-red-400'} />
              <div>
                <p className={`text-xs font-bold ${isConnected ? 'text-lime-400' : 'text-red-400'}`}>
                  {isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
                </p>
                <p className="text-[10px] text-zinc-600">
                  {isConnected && address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : 'Open in Warpcast to connect'}
                </p>
              </div>
            </div>

            {payError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-red-400" />
                <p className="text-xs text-red-400">{payError}</p>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={!isConnected}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition ${
                isConnected
                  ? 'bg-lime-400 text-black hover:bg-lime-300'
                  : 'cursor-not-allowed bg-zinc-800 text-zinc-600'
              }`}
            >
              <ShoppingBag size={16} />
              Pay ${finalTotal.toFixed(2)} USDC on Base
            </button>

            <p className="text-center text-[10px] text-zinc-700">
              USDC transfer on Base mainnet · Non-refundable after confirmation
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
