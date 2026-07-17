import { NextResponse } from 'next/server'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://hoodie-beta.vercel.app'

  return NextResponse.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE
    },
    frame: {
      version: "1",
      name: "HOOD",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: "Shop HOOD",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#0a0a0a",
      webhookUrl: `${appUrl}/api/webhook`
    }
  })
}
