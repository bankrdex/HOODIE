// Client-side coupon types only
// All validation happens server-side via /api/coupons/validate
// Never import VALID_COUPONS on the client — codes live in Supabase only

export interface CouponResult {
  valid: boolean
  discount: number
  shipping_fee: number
  discount_type: 'fixed' | 'percentage' | 'free_hoodie'
  campaign: string
  label: string
  coupon_id?: string
  error?: string
}

export interface AppliedCoupon {
  code: string
  coupon_id: string
  discount_type: 'fixed' | 'percentage' | 'free_hoodie'
  discount_value: number
  shipping_fee: number
  campaign: string
  label: string
}

// Compute final total with coupon applied
// free_hoodie: pay shipping only ($9.99)
// fixed: subtract fixed amount from subtotal
// percentage: subtract percentage from subtotal
export function computeFinalTotal(
  subtotal: number,
  coupon: AppliedCoupon | null
): { discount: number; shipping: number; total: number } {
  const shipping = coupon?.discount_type === 'free_hoodie'
    ? coupon.shipping_fee
    : 0

  if (!coupon) {
    return { discount: 0, shipping: 0, total: subtotal }
  }

  let discount = 0
  if (coupon.discount_type === 'free_hoodie') {
    discount = subtotal // full hoodie price off
  } else if (coupon.discount_type === 'fixed') {
    discount = Math.min(coupon.discount_value, subtotal)
  } else if (coupon.discount_type === 'percentage') {
    discount = (subtotal * coupon.discount_value) / 100
  }

  const total = Math.max(0, subtotal - discount) + shipping
  return { discount, shipping, total }
}
