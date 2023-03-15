<script lang="ts" setup>
import { PublicKey } from '@solana/web3.js';

interface BoxSetAccountItem {
  name: string
  description: string
  image: string
  state: 0 | 1 // 0: open, 1: close
  authority: PublicKey
}

useCardItem('.card-container .card-item-inside')

const $contract = useContract()

const boxsets = ref<BoxSetAccountItem[]>([])
const fetch_boxsets = async () => {
  const _datas = await $contract.nftbox.program.account.boxAccount.all()
  boxsets.value.push(..._datas.map((item) => ({
    name: item.account.name,
    description: item.account.description,
    image: item.account.image,
    authority: item.account.authority,
    state: item.account.state === 0 ? 0 : 1 as 0 | 1
  })))
}
onMounted(() => {
  fetch_boxsets()
})
</script>

<template>
  <div class="flex flex-col mt-2">
    <div class="card-container grid grid-cols-4 gap-6">
      <div v-for="(boxset, i) in boxsets" :key="i" class="group cursor-pointer card-item rounded-xl border overflow-hidden px-3 py-3 shadow-lg border-slate-500/50">
        <div class="card-item-inside shadow rounded-2xl overflow-hidden">
          <img
            :src="`${boxset.image}?r=${Math.random()}`"
            :style="{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }"
            class="group-hover:scale-110 transition-all duration-300"
          />
        </div>
        <div class="mt-3 pl-2">
          <div class="text-lg font-bold pr-4">{{ boxset.name }}</div>
          <div class="font-light text-sm">{{ shortPubkey(boxset.authority) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
