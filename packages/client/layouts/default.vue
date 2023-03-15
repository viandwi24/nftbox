<script lang="ts" setup>
import { WalletMultiButton } from "solana-wallets-vue"
</script>

<template>
  <div class="screen w-full min-h-screen bg-slate-900 text-gray-200">
    <div class="navbar fixed z-30 top-0 left-0 w-full h-[68px] flex border-b-2 border-primary-500/80 bg-slate-900/80 shadow-lg backdrop-filter backdrop-blur-lg">
      <div class="flex-1 max-w-screen-lg mx-auto w-full flex items-center justify-between">
        <div>
          <NuxtLink class="text-lg font-bold capitalize text-white" to="/">SOLANA NFTBOX</NuxtLink>
        </div>
        <ClientOnly>
          <div class="flex space-x-2 items-center">
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
