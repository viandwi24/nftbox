<script lang="ts" setup>
import { PublicKey } from '@solana/web3.js';

interface BoxSetAccountItem {
  address: PublicKey
  name: string
  description: string
  image: string
  state: 0 | 1 // 0: open, 1: close
  authority: PublicKey
}

useCardItem('.card-container .card-item-inside')

const { connection } = useConnection()
const $contract = useContract()


const loading = ref(false)
const boxsets = ref<BoxSetAccountItem[]>([])
const fetch_boxsets = async () => {
  loading.value = true
  const _datas = await $contract.nftbox.value.getBoxSetAccountAll()
  boxsets.value.push(..._datas.map((item) => ({
    address: item.publicKey,
    name: item.account.name,
    description: item.account.description,
    image: item.account.image,
    authority: item.account.authority,
    state: item.account.state === 0 ? 0 : 1 as 0 | 1
  })))
  loading.value = false
  // const d = await connection.value.getParsedAccountInfo(new PublicKey('FNXb3mWzpcjAnCAXHDY7i4EEwiZ67525yossKig5VZV8'))
  // console.log('hehe', d, d.value?.owner.toString())
  // const [pda] = PublicKey.findProgramAddressSync(
  //   [
  //       Buffer.from("metadata"),
  //       new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(),
  //       new PublicKey('FNXb3mWzpcjAnCAXHDY7i4EEwiZ67525yossKig5VZV8').toBuffer(),
  //       Buffer.from("edition"),
  //   ],
  //   new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
  // )
  // console.log('awoekwoaek', pda.toString())
}
onMounted(() => {
  fetch_boxsets()
})
</script>

<template>
  <div class="flex flex-col mt-2">
    <div class="flex mb-8">
      <Button to="/box/create" size="sm">Create Box</Button>
    </div>
    <div class="card-container grid grid-cols-4 gap-6">
      <NuxtLink
        v-for="(boxset, i) in boxsets"
        :key="i"
        class="group cursor-pointer card-item rounded-xl border overflow-hidden px-3 py-3 shadow-lg border-slate-500/50"
        :to="{ name: 'box-address', params: { address: boxset.address.toString() } }"
      >
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
      </NuxtLink>
      <div v-if="loading">Loading...</div>
    </div>
  </div>
</template>
