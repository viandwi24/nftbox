import { useAnchorWallet as useAnchorWalletA } from "solana-wallets-vue"

export const useAnchorWallet = () => {
  const anchorWallet = useAnchorWalletA()
  return anchorWallet
}
