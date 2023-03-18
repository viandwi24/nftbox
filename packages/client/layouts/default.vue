<script lang="ts" setup>
import { WalletMultiButton } from "solana-wallets-vue"
const anchorWallet = useAnchorWallet()
const { connection } = useConnection()

const airdrop = async () => {
  if (!anchorWallet.value) return
  const sol = 1e9
  try {
    await connection.value?.requestAirdrop(anchorWallet.value?.publicKey, sol)
    alert(`airdrop 2 SOL success to : ${anchorWallet.value?.publicKey?.toString() || ''}`)
  } catch (error) {
    alert(`error request airdrop : ${anchorWallet.value?.publicKey?.toString() || ''}`)
    console.log(error)
  }
}
</script>

<template>
  <div class="screen w-full min-h-screen bg-slate-900 text-gray-200">
    <div class="navbar fixed z-30 top-0 left-0 w-full h-[68px] flex border-b-2 border-primary-500/80 bg-slate-900/80 shadow-lg backdrop-filter backdrop-blur-lg">
      <div class="flex-1 max-w-screen-lg mx-auto w-full flex items-center justify-between">
        <div class="relative">
          <NuxtLink class="text-lg font-bold capitalize text-white" to="/">SOLANA NFTBOX</NuxtLink>
          <span class="absolute text-xs font-thin px-2 py-1 rounded right-0 -mr-14 bg-primary-500">devnet</span>
        </div>
        <ClientOnly>
          <div class="flex space-x-2 items-center">
            <div>
              <Button size="sm" @click="airdrop">Airdrop 2 SOL</Button>
            </div>
            <div class="pl-3">
              <WalletMultiButton dark />
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
    <div class="pt-[68px] max-w-screen-lg mx-auto flex flex-col">
      <div class="flex flex-col flex-1 py-4">
        <slot />
      </div>
    </div>
  </div>
</template>
