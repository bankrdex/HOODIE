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

  // 1. Check coupon exists and is active
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', normalized)
    .eq('is_active', true)
    .single()

  if (error || !coupon) {
    return NextResponse.json({ valid: false, error: 'Invalid coupon code.' })
  }

  // 2. Check not expired
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'This coupon has expired.' })
  }

  // 3. Check usage limit
  if (coupon.times_used >= coupon.max_uses) {
    return NextResponse.json({ valid: false, error: 'This coupon has already been used.' })
  }

  // 4. Check if this wallet already used it
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
    discount: coupon.discount_amount,
    label: `$${coupon.discount_amount} off one hoodie`,
    coupon_id: coupon.id,
  })
}
