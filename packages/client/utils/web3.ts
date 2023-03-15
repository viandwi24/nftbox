import { PublicKey } from "@solana/web3.js"

export const shortPubkey = (pubkey: string|PublicKey) => {
  if (pubkey instanceof PublicKey) pubkey = pubkey.toBase58()
  return pubkey.slice(0, 4) + '...' + pubkey.slice(-4)
}
