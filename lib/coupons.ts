// 10 coupon codes — $20 off ONE hoodie per order
// Single-use enforcement requires Supabase (Phase 3)
// V1: validates code is real, applies discount client-side

export const VALID_COUPONS: Record<string, { discount: number; label: string }> = {
  'ZABAL-HOOD01': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD02': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD03': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD04': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD05': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD06': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD07': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD08': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD09': { discount: 20, label: '$20 off one hoodie' },
  'ZABAL-HOOD10': { discount: 20, label: '$20 off one hoodie' },
}

export interface CouponResult {
  valid: boolean
  discount: number
  label: string
  error?: string
}

export function validateCoupon(code: string): CouponResult {
  const normalized = code.trim().toUpperCase()
  const coupon = VALID_COUPONS[normalized]
  if (!coupon) {
    return { valid: false, discount: 0, label: '', error: 'Invalid coupon code.' }
  }
  return { valid: true, discount: coupon.discount, label: coupon.label }
}

// Coupon applies $20 off only one hoodie — not the full cart
// Returns the actual discount amount (capped at cheapest item price)
export function computeCouponDiscount(
  itemPrices: number[],
  couponDiscount: number
): number {
  if (!couponDiscount || itemPrices.length === 0) return 0
  const cheapest = Math.min(...itemPrices)
  return Math.min(couponDiscount, cheapest)
}
