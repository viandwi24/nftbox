import { NftBoxContract } from '@nftbox/js'
import { useAnchorWallet, AnchorWallet } from 'solana-wallets-vue'
import * as anchor from '@project-serum/anchor'
import { Connection } from '@solana/web3.js'

export const useContract = () => {
  const wallet = useAnchorWallet()

  const { $connection, $idl } = useNuxtApp()

  const nftbox = computed(() => {
    const w = wallet.value as anchor.Wallet
    return new NftBoxContract(w, $connection, idl)
  })

  return {
    nftbox,
  }
}
