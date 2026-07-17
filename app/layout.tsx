import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { FarcasterReady } from '@/components/farcaster-ready'
import { cn } from '@/lib/utils'
import BottomNav from '@/components/layout/BottomNav'
import CartDrawer from '@/components/cart/CartDrawer'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'HOOD — Limited Streetwear',
  description: 'Design and shop limited hoodies. Pay with USDC on Base.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable)}>
      <body className="bg-black text-white">
        <Providers>
          <FarcasterReady />
          <CartDrawer />
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
