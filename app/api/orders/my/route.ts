import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')
  if (!wallet) {
    return NextResponse.json({ error: 'wallet param required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, reference, status, total_amount, coupon_discount,
      front_text, back_text, chest_logo_url,
      shipping_name, shipping_city, shipping_country,
      tx_hash, created_at,
      order_items (
        quantity, unit_price,
        product_variants ( color, color_hex, size )
      )
    `)
    .eq('wallet_address', wallet.toLowerCase())
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders: data })
}
