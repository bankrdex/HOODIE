'use client'

import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import {
  Wallet, Package, Copy, Check, ExternalLink, ChevronRight
} from 'lucide-react'

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)
  const [orderCount, setOrderCount] = useState<number | null>(null)
  const [totalSpent, setTotalSpent] = useState<number | null>(null)

  useEffect(() => {
    if (!address) return
    fetch(`/api/orders/my?wallet=${address.toLowerCase()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) {
          setOrderCount(data.orders.length)
          setTotalSpent(
            data.orders.reduce(
              (sum: number, o: { total_amount: number }) => sum + Number(o.total_amount),
              0
            )
          )
        }
      })
      .catch(() => {})
  }, [address])

  function copyAddress() {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <h1 className="mb-6 text-2xl font-black">Profile</h1>

        {!isConnected ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900">
              <Wallet size={24} className="text-zinc-600" />
            </div>
            <div>
              <p className="font-bold">Not connected</p>
              <p className="mt-1 text-sm text-zinc-600">
                Open HOOD inside Warpcast to connect your wallet
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">

            {/* Wallet card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-600">
                Wallet
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                    <Wallet size={14} className="text-lime-400" />
                  </div>
                  <p className="font-mono text-sm text-zinc-300 truncate">
                    {address}
                  </p>
                </div>
                <button
                  onClick={copyAddress}
                  className="flex-shrink-0 text-zinc-600 hover:text-white transition"
                >
                  {copied ? <Check size={15} className="text-lime-400" /> : <Copy size={15} />}
                </button>
              </div>

              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-1 text-xs text-blue-400"
              >
                View on Basescan <ExternalLink size={10} />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-xs text-zinc-600 mb-1">Orders</p>
                <p className="text-2xl font-black">
                  {orderCount === null ? '—' : orderCount}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-xs text-zinc-600 mb-1">Total Spent</p>
                <p className="text-2xl font-black text-lime-400">
                  {totalSpent === null ? '—' : `$${totalSpent.toFixed(0)}`}
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
              {[
                { href: '/orders', label: 'My Orders', icon: Package },
                { href: '/shop', label: 'Shop Drops', icon: ChevronRight },
                { href: '/designer', label: 'Designer — Coming Soon', icon: ChevronRight },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900 transition"
                >
                  <span className="text-sm font-medium">{label}</span>
                  <Icon size={15} className="text-zinc-600" />
                </Link>
              ))}
            </div>

            {/* Disconnect */}
            <button
              onClick={() => disconnect()}
              className="w-full rounded-2xl border border-zinc-800 py-4 text-sm font-bold text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition"
            >
              Disconnect Wallet
            </button>

            <p className="text-center text-[10px] text-zinc-800">
              HOOD · Base Network · USDC
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
