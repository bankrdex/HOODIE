import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'

// Safely load farcaster connector — may not be available on all envs
function getConnectors() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { farcasterMiniApp } = require('@farcaster/miniapp-wagmi-connector')
    return [farcasterMiniApp()]
  } catch (e) {
    console.warn('[wagmi] @farcaster/miniapp-wagmi-connector not available:', e)
    return []
  }
}

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
    ),
  },
  connectors: getConnectors(),
})

export const USDC_ADDRESS =
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

export const USDC_DECIMALS = 6
