'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Package, ExternalLink, Clock } from 'lucide-react'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderItem {
  quantity: number
  unit_price: number
  product_variants: {
    color: string
    color_hex: string
    size: string
  }
}

interface Order {
  id: string
  reference: string
  status: OrderStatus
  total_amount: number
  coupon_discount: number
  front_text: string | null
  back_text: string | null
  shipping_city: string
  shipping_country: string
  tx_hash: string | null
  created_at: string
  order_items: OrderItem[]
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  paid:       'bg-lime-400/10 text-lime-400 border-lime-400/20',
  processing: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  shipped:    'bg-purple-400/10 text-purple-400 border-purple-400/20',
  delivered:  'bg-zinc-400/10 text-zinc-400 border-zinc-400/20',
  cancelled:  'bg-red-400/10 text-red-400 border-red-400/20',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Pending',
  paid:       'Paid',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
}

export default function OrdersPage() {
  const { address, isConnected } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false)
      return
    }

    fetch(`/api/orders/my?wallet=${address.toLowerCase()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setOrders(data.orders || [])
      })
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [address, isConnected])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <h1 className="mb-1 text-2xl font-black">My Orders</h1>
        <p className="mb-6 text-xs text-zinc-600">
          Orders are linked to your connected wallet
        </p>

        {/* Not connected */}
        {!isConnected && !loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900">
              <Package size={24} className="text-zinc-600" />
            </div>
            <div>
              <p className="font-bold">Wallet not connected</p>
              <p className="mt-1 text-sm text-zinc-600">
                Open HOOD inside Warpcast to see your orders
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-900" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="py-10 text-center text-sm text-red-400">{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && isConnected && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900">
              <Package size={24} className="text-zinc-600" />
            </div>
            <div>
              <p className="font-bold">No orders yet</p>
              <p className="mt-1 text-sm text-zinc-600">
                Your orders will appear here after checkout
              </p>
            </div>
            <Link
              href="/shop"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black"
            >
              Shop Now
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => {
              const status = order.status as OrderStatus
              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-bold">{order.reference}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">
                        <Clock size={9} className="inline mr-1" />
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLES[status]}`}>
                      {STATUS_LABELS[status]}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5">
                    {order.order_items?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-5 w-5 flex-shrink-0 rounded-full border border-zinc-700"
                            style={{ backgroundColor: item.product_variants?.color_hex }}
                          />
                          <span className="text-xs text-zinc-400">
                            {item.product_variants?.color} / {item.product_variants?.size} × {item.quantity}
                          </span>
                        </div>
                        <span className="text-xs font-bold">
                          ${(item.unit_price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Customization */}
                  {(order.front_text || order.back_text) && (
                    <div className="rounded-xl bg-zinc-900 px-3 py-2 space-y-0.5">
                      {order.front_text && (
                        <p className="text-[11px] text-zinc-500">
                          Front: <span className="text-white">"{order.front_text}"</span>
                        </p>
                      )}
                      {order.back_text && (
                        <p className="text-[11px] text-zinc-500">
                          Back: <span className="text-white">"{order.back_text}"</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Total + tx */}
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                    <div>
                      {order.coupon_discount > 0 && (
                        <p className="text-[10px] text-lime-400">
                          Coupon saved ${Number(order.coupon_discount).toFixed(2)}
                        </p>
                      )}
                      <p className="text-sm font-black text-lime-400">
                        ${Number(order.total_amount).toFixed(2)} USDC
                      </p>
                    </div>
                    {order.tx_hash && (
                      <a
                        href={`https://basescan.org/tx/${order.tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] text-blue-400"
                      >
                        Basescan <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
