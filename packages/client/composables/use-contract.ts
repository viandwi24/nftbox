import { NftBoxContract } from '~/app/nftbox'
import { useAnchorWallet, AnchorWallet } from 'solana-wallets-vue'
import * as anchor from '@project-serum/anchor'
import idl from '@nftbox/contract/target/idl/nftbox.json'

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
