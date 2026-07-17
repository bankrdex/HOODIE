'use client'

import { motion, Variants } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import {
  Palette,
  Upload,
  ImageIcon,
  Type,
  Gem,
  Users,
  Bell,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Palette,
    title: 'Hoodie Designer',
    description:
      'Create your own hoodie from scratch. Place text, artwork, and graphics exactly where you want them with a professional canvas editor.',
    color: 'text-lime-400',
    bg: 'bg-lime-400/10',
  },
  {
    icon: Upload,
    title: 'Logo Upload',
    description:
      'Add your brand logo to any hoodie. Perfect for teams, communities, and founders who want to wear their identity.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: ImageIcon,
    title: 'Image Upload',
    description:
      'Print your favorite photos and artwork directly onto premium hoodies with full-color DTG printing technology.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Type,
    title: 'Text Editor',
    description:
      'Add custom text with access to premium typography. Choose fonts, sizes, colors, and placement for a truly unique piece.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Gem,
    title: 'NFT & PFP Support',
    description:
      'Connect your wallet and wear your digital identity. Import your PFP or NFT artwork directly onto a physical hoodie.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
  {
    icon: Users,
    title: 'Team & Community Collections',
    description:
      'Design and drop hoodies for your entire community. Manage team orders, bulk pricing, and community colorways in one place.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
]

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.45, 
      ease: [0.25, 0.1, 0.25, 1] as const 
    } 
  },
}

export default function DesignerPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-lg px-5 pb-32 pt-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400/10 ring-1 ring-lime-400/20">
            <Palette size={28} className="text-lime-400" />
          </div>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-lime-400">
              Coming Soon
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight">
            HOOD Designer
          </h1>
          <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-zinc-500">
            We are building the most powerful hoodie customization tool in Web3.
            Here is what is coming.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${feature.bg}`}
                  >
                    <Icon size={18} className={feature.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold">{feature.title}</h3>
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Coming Soon
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                      {feature.description}
                    </p>

                    {/* Disabled notify button */}
                    <button
                      disabled
                      className="mt-3 flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 cursor-not-allowed select-none"
                    >
                      <Bell size={11} />
                      Notify Me
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
            While you wait
          </p>
          <p className="mt-2 text-sm font-bold">
            Shop our current limited drops
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Hand-designed by the HOOD team. Limited units per drop.
          </p>
          <a
            href="/shop"
            className="mt-4 block rounded-xl bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-100"
          >
            Browse Drops →
          </a>
        </motion.div>

      </div>
    </div>
  )
}
