'use client'

import { useEffect } from 'react'

export function FarcasterReady() {
  useEffect(() => {
    import('@farcaster/miniapp-sdk')
      .then(({ sdk }) => {
        sdk.actions.ready()
      })
      .catch(() => {
        // Not inside Farcaster client — safe to ignore
      })
  }, [])

  return null
}
