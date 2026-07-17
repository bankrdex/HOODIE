import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

function generateRef(): string {
  return 'HOOD-' + Date.now().toString(36).toUpperCase()
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    items,
    wallet_address,
    fid,
    tx_hash,
    total_amount,
    coupon_code,
    coupon_id,
    coupon_discount,
    front_text,
    back_text,
    chest_logo_url,
    shipping_name,
    shipping_email,
    shipping_phone,
    shipping_address,
    shipping_city,
    shipping_state,
    shipping_country,
  } = body

  if (!items?.length || !wallet_address || !tx_hash || !total_amount) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  // Verify coupon server-side
  let finalCouponDiscount = 0
  let finalCouponCode = null
  let validCouponId = null

  if (coupon_code && coupon_id) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', coupon_id)
      .eq('code', coupon_code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (coupon && coupon.times_used < coupon.max_uses) {
      finalCouponDiscount = Number(coupon_discount) || 0
      finalCouponCode = coupon_code.toUpperCase()
      validCouponId = coupon.id
    }
  }

  // Create order
  const reference = generateRef()
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      reference,
      wallet_address: wallet_address.toLowerCase(),
      fid: fid || null,
      status: 'paid',
      total_amount,
      tx_hash,
      coupon_code: finalCouponCode,
      coupon_discount: finalCouponDiscount,
      front_text: front_text || null,
      back_text: back_text || null,
      chest_logo_url: chest_logo_url || null,
      shipping_name,
      shipping_email,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_country,
    })
    .select('id, reference')
    .single()

  if (orderError || !order) {
    console.error('[create order]', orderError)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }

  // Insert order items
  await supabase.from('order_items').insert(
    items.map((item: {
      product_id: string
      variant_id: string
      quantity: number
      unit_price: number
    }) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))
  )

  // Decrement stock
  for (const item of items) {
    await supabase.rpc('decrement_stock', {
      p_variant_id: item.variant_id,
      p_qty: item.quantity,
    })
  }

  // Mark coupon used
  if (validCouponId) {
    await Promise.all([
      supabase.from('coupon_uses').insert({
        coupon_id: validCouponId,
        order_id: order.id,
        wallet_address: wallet_address.toLowerCase(),
      }),
      supabase.rpc('increment_coupon_uses', { p_coupon_id: validCouponId }),
    ])
  }

  return NextResponse.json({
    success: true,
    order_id: order.id,
    reference: order.reference,
  })
}
