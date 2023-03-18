import { Connection } from '@solana/web3.js'
import { NftBoxContract } from './'
import * as anchor from '@project-serum/anchor'


(async () => {
  const $contract = new NftBoxContract(undefined as unknown as anchor.Wallet, new Connection('https://api.devnet.solana.com'))
  const boxsets = await $contract.getBoxSetAccountAll()

  const bs = boxsets.find(n => n.account.boxCards.toNumber() > 0)
  if (!bs) return

  const cards = await $contract.getBoxSetCardAccountDataAllByBoxSet(bs!.publicKey)
  console.log('cards', cards)
})()
