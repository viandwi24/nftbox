import 'solana-wallets-vue/styles.css'
import SolanaWallets from 'solana-wallets-vue'
import {
  BackpackWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { Connection } from '@solana/web3.js'

const walletOptions = {
  wallets: [
    new BackpackWalletAdapter(),
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
  ],
  autoConnect: true,
}

export default defineNuxtPlugin((nuxtApp) => {
  // register solana wallet plugins
  nuxtApp.vueApp.use(SolanaWallets, walletOptions)

  return {
    provide: {
      connection: new Connection('https://api.devnet.solana.com', 'confirmed'),
    }
  }
})
