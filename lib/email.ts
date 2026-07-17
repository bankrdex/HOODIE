import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'HOOD <orders@hood.xyz>'

interface OrderEmailParams {
  to: string
  name: string
  reference: string
  total: number
  couponDiscount: number
  items: { product_id: string; variant_id: string; quantity: number; unit_price: number }[]
  frontText?: string
  backText?: string
  txHash?: string
}

export async function sendOrderConfirmation(params: OrderEmailParams) {
  const {
    to, name, reference, total,
    couponDiscount, items, frontText, backText, txHash,
  } = params

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;color:#aaa;font-size:13px;">${item.product_id} — ${item.variant_id}</td>
          <td style="padding:8px 0;color:#fff;font-size:13px;text-align:right;">x${item.quantity} · $${(item.unit_price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const customRows = [
    frontText ? `<p style="margin:4px 0;font-size:13px;color:#aaa;">Front text: <span style="color:#fff">"${frontText}"</span></p>` : '',
    backText ? `<p style="margin:4px 0;font-size:13px;color:#aaa;">Back text: <span style="color:#fff">"${backText}"</span></p>` : '',
  ].filter(Boolean).join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#0a0a0a;margin:0;padding:0;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:40px auto;padding:0 20px;">
    <tr>
      <td>
        <!-- Header -->
        <p style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;margin:0 0 4px;">HOOD</p>
        <p style="font-size:12px;color:#737373;text-transform:uppercase;letter-spacing:3px;margin:0 0 32px;">Order Confirmed</p>

        <!-- Card -->
        <div style="background:#111;border:1px solid #222;border-radius:16px;padding:24px;">
          <p style="margin:0 0 4px;font-size:12px;color:#737373;text-transform:uppercase;letter-spacing:2px;">Order Reference</p>
          <p style="margin:0 0 24px;font-size:20px;font-weight:900;color:#fff;font-family:monospace;">${reference}</p>

          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
          </table>

          <hr style="border:none;border-top:1px solid #222;margin:16px 0;"/>

          ${couponDiscount > 0 ? `
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:13px;color:#a3e635;">Coupon discount</span>
            <span style="font-size:13px;color:#a3e635;">-$${couponDiscount.toFixed(2)}</span>
          </div>` : ''}

          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:15px;font-weight:700;color:#fff;">Total paid</span>
            <span style="font-size:15px;font-weight:700;color:#a3e635;">$${Number(total).toFixed(2)} USDC</span>
          </div>
        </div>

        ${customRows ? `
        <!-- Customization -->
        <div style="background:#111;border:1px solid #222;border-radius:16px;padding:20px;margin-top:12px;">
          <p style="margin:0 0 12px;font-size:11px;color:#737373;text-transform:uppercase;letter-spacing:2px;">Your Customization</p>
          ${customRows}
        </div>` : ''}

        <!-- Tx hash -->
        ${txHash ? `
        <div style="margin-top:12px;">
          <a href="https://basescan.org/tx/${txHash}" style="font-size:11px;color:#3b82f6;">View transaction on Basescan →</a>
        </div>` : ''}

        <!-- Footer -->
        <p style="margin-top:32px;font-size:12px;color:#404040;text-align:center;">
          Hi ${name} — your HOOD bundle is being prepared.<br/>
          We'll email you again with tracking info when it ships.
        </p>
        <p style="margin-top:8px;font-size:11px;color:#333;text-align:center;">
          HOOD · Designed exclusively by the HOOD team
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Order Confirmed — ${reference}`,
    html,
  })
}
