'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Palette,
  Gem,
  Users,
  ArrowRight,
  Zap,
} from 'lucide-react'

const UPCOMING = [
  {
    icon: Palette,
    label: 'Hoodie Designer',
    desc: 'Full canvas editor with text, art, and layers',
  },
  {
    icon: Gem,
    label: 'NFT & PFP Support',
    desc: 'Wear your digital identity onchain',
  },
  {
    icon: Users,
    label: 'Community Collections',
    desc: 'Drop hoodies for your entire community',
  },
]

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">

      {/* ── Hero ── */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-8 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Live badge */}
          <div className="flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-lime-400">
              Live Now
            </span>
          </div>

          <h1 className="text-[5.5rem] leading-none font-black tracking-tighter">
            HOOD
          </h1>

          <p className="max-w-[260px] text-sm leading-relaxed text-zinc-400">
            Premium limited hoodies. Designed by us. Paid with USDC on Base.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex w-full max-w-[280px] flex-col gap-3"
        >
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black text-sm font-bold uppercase tracking-wider transition hover:bg-zinc-100"
          >
            Shop Drops
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/designer"
            className="flex items-center justify-center gap-2 w-full py-4 border border-zinc-800 text-zinc-500 text-sm font-bold uppercase tracking-wider transition hover:border-zinc-700 hover:text-zinc-400"
          >
            <Palette size={14} />
            Designer — Coming Soon
          </Link>
        </motion.div>
      </section>

      {/* ── What's coming ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mx-auto w-full max-w-lg px-5 pb-6"
      >
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Zap size={14} className="text-lime-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Dropping Later
            </span>
          </div>

          <div className="space-y-4">
            {UPCOMING.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-900">
                  <Icon size={14} className="text-zinc-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-zinc-300">{label}</p>
                    <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                      Soon
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/designer"
            className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-600 hover:text-zinc-400 transition"
          >
            <span>See all upcoming features</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </motion.section>

      {/* ── Footer ticker ── */}
      <div className="mb-16 border-t border-zinc-900 px-6 py-3 flex items-center justify-between text-[10px] text-zinc-800 uppercase tracking-widest">
        <span>Drop 001 — Live</span>
        <span className="h-1 w-1 rounded-full bg-zinc-800" />
        <span>USDC · Base Network</span>
      </div>

    </main>
  )
}
