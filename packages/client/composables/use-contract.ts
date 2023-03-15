import { NftBoxContract } from '@nftbox/js'
import { useAnchorWallet, AnchorWallet } from 'solana-wallets-vue'
import * as anchor from '@project-serum/anchor'

export const useContract = () => {
  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  return {
    nftbox: new NftBoxContract(wallet.value as anchor.Wallet, connection.value),
  }
}
