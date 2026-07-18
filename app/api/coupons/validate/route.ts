import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { code, wallet_address } = body

  if (!code) {
    return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })
  }

  const supabase = createServerClient()
  const normalized = code.trim().toUpperCase()

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', normalized)
    .eq('is_active', true)
    .single()

  if (error || !coupon) {
    return NextResponse.json({ valid: false, error: 'Invalid coupon code.' })
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'This coupon has expired.' })
  }

  if (coupon.times_used >= coupon.max_uses) {
    return NextResponse.json({ valid: false, error: 'This coupon has already been redeemed.' })
  }

  if (wallet_address) {
    const { data: existing } = await supabase
      .from('coupon_uses')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('wallet_address', wallet_address.toLowerCase())
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ valid: false, error: 'You have already used this coupon.' })
    }
  }

  return NextResponse.json({
    valid: true,
    coupon_id: coupon.id,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
    shipping_fee: coupon.shipping_fee,
    campaign: coupon.campaign,
    label: coupon.discount_type === 'free_hoodie'
      ? `Free hoodie — pay $${coupon.shipping_fee} shipping only`
      : `$${coupon.discount_value} off`,
  })
}
