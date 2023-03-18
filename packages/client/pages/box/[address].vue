<script lang="ts" setup>
import { PublicKey } from '@solana/web3.js'
import { getParsedAccountByMint } from '@nfteyez/sol-rayz'
import { getAssociatedTokenAddress } from '@solana/spl-token'

const $router = useRouter()
const $route = useRoute()
const { nftbox } = useContract()
const anchorWallet = useAnchorWallet()
const { connection } = useConnection()
// const $mpx = useMetaplex()

useCardItem('.card-container .card-item-inside')

const boxSetAddress = computed(() => `${$route.params.address || ''}`)

if (!boxSetAddress.value) $router.push('/')

const loading = ref(false)
const error = ref<string>()
const error_model_card = ref<string>()

const boxset = ref<{
  address: string
  authority: string
  name: string
  description: string
  image: string
  max_supply: number
  supply: number
  box_cards: number
  cards: {
    address: string
    master_edition: string
    metadata: string
    token: string
  }[]
}>()

const modelCard = ref({
  mint: '8jUMdzWjSfEQ5a8T6CB6CmaVxV5cuAPZtWpSHbZQFStP',
  master_edition: '',
  metadata: '',
  token_account: '',
})


const isAuthority = computed(() => boxset.value?.authority === anchorWallet.value?.publicKey?.toBase58())

const fetch = async () => {
  if (!anchorWallet.value) return

  loading.value = true
  try {
    const _data_box = await nftbox.value?.getBoxSetAccountData(new PublicKey(boxSetAddress.value))
    const _data_cards = await nftbox.value?.getBoxSetCardAccountDataAllByBoxSet(new PublicKey(boxSetAddress.value))

    console.log('data', _data_box, _data_cards)
    boxset.value = {
      address: boxSetAddress.value,
      authority: _data_box?.authority.toBase58() || '',
      name: _data_box?.name || '',
      description: _data_box?.description || '',
      image: _data_box?.image || '',
      max_supply: _data_box?.maxSupply.toNumber() || 0,
      supply: _data_box?.supply.toNumber() || 0,
      box_cards: _data_box?.boxCards.toNumber() || 0,
      cards: _data_cards?.map(c => ({
        address: c.publicKey.toBase58(),
        master_edition: c.account.masterEdition.toBase58(),
        metadata: c.account.metadata.toBase58(),
        token: c.account.tokenAccount.toBase58(),
      })) || [],
    }
  } catch (err) {
    if (err instanceof Error) error.value = `${err.message} (${err.name})`
    console.error(error)
  }
  loading.value = false
}

const fetchMasterEditionMint = async () => {

  if (!anchorWallet.value?.publicKey) {
    alert(`please connect wallet`)
    return
  }

  const m = new PublicKey(modelCard.value.mint)
  const _data = await connection.value?.getParsedAccountInfo(m)

  if ((_data?.value?.data as any)?.program !== "spl-token") {
    alert(`this mint nft is not from program spl-token`)
    return
  }

  if ((_data?.value?.data as any)?.parsed?.type !== "mint") {
    alert(`this mint nft is not type mint`)
    return
  }

  const decimals = (_data?.value?.data as any)?.parsed?.info?.decimals
  const supply = (_data?.value?.data as any)?.parsed?.info?.supply
  if (decimals !== 0 || supply !== "1") {
    alert(`this mint nft is not master edition | decimals ${decimals} | supply ${supply}`)
    return
  }
  const mintAuthority = (_data?.value?.data as any)?.parsed?.info?.mintAuthority || ''
  console.log('data', _data, mintAuthority)

  // get
  const nft = await getParsedAccountByMint({
    mintAddress: m.toString(),
    connection: connection.value,
  })
  const nftAuthority = nft?.account?.data?.parsed?.info?.owner

  if (nftAuthority !== anchorWallet.value?.publicKey?.toString()) {
    alert(`this owner mint nft is not you | owner : ${nftAuthority}`)
    return
  }

  // get master edition > edition metadata
  const metaplex_id = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  const [pdaMasterEdition] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      new PublicKey(metaplex_id).toBuffer(),
      m.toBuffer(),
      Buffer.from("edition"),
    ],
    new PublicKey(metaplex_id)
  )
  modelCard.value.master_edition = pdaMasterEdition.toString()


  const [pdaNftMetadata] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      new PublicKey(metaplex_id).toBuffer(),
      m.toBuffer(),
    ],
    new PublicKey(metaplex_id)
  )
  modelCard.value.metadata = pdaNftMetadata.toString()

  const token = await getAssociatedTokenAddress(m, anchorWallet.value?.publicKey)
  modelCard.value.token_account = token.toBase58()
}

const add_card = async () => {
  if (!anchorWallet.value?.publicKey) {
    alert(`please connect wallet`)
    return
  }

  try {
    console.log('add_card', modelCard.value)
    const m = new PublicKey(boxSetAddress.value)
    const tx = await nftbox.value?.boxset().add_card(
      m,
      {
        master_edition: new PublicKey(modelCard.value.master_edition),
        master_edition_metadata: new PublicKey(modelCard.value.metadata),
        token: new PublicKey(modelCard.value.token_account),
      }
    )
    console.log('tx', tx)
  } catch (err) {
    if (err instanceof Error) error_model_card.value = `${err.message} (${err.name})`
    console.error(error)
  }
}

const update = async () => {}

onMounted(() => {
  fetch()
})
</script>

<template>
  <div v-if="loading" class="text-center">Loading...</div>
  <div v-else-if="!loading && boxset">
    <Card>
      <template #header>
        <div class="font-bold text-xl">Box Set</div>
      </template>
      <div class="flex flex-col space-y-4">
        <div class="flex">
          <div class="w-1/5 mt-2">Box Address</div>
          <div class="flex-1">
            <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" readonly :value="boxset.address" />
          </div>
        </div>
        <div class="flex">
          <div class="w-1/5 mt-2">Authority Address</div>
          <div class="flex-1">
            <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" readonly :value="boxset.authority" />
          </div>
        </div>
        <div class="flex">
          <div class="w-1/5 mt-2">Supply</div>
          <div class="flex-1">
            <input type="number" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" readonly :value="boxset.supply" />
          </div>
        </div>
        <div class="flex">
          <div class="w-1/5 mt-2">Max Supply</div>
          <div class="flex-1">
            <input type="number" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" :readonly="!isAuthority" v-model="boxset.max_supply" />
          </div>
        </div>
        <div class="flex">
          <div class="w-1/5 mt-2">Name</div>
          <div class="flex-1">
            <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" :readonly="!isAuthority" v-model="boxset.name" />
          </div>
        </div>
        <div class="flex">
          <div class="w-1/5 mt-2">Description</div>
          <div class="flex-1">
            <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" :readonly="!isAuthority" v-model="boxset.description" />
          </div>
        </div>
        <div class="flex">
          <div class="w-1/5 mt-2">Image</div>
          <div class="flex-1">
            <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" :readonly="!isAuthority" v-model="boxset.image" />
          </div>
        </div>
        <div v-if="isAuthority" class="flex items-center justify-between">
          <div>
            <div v-if="error" class="text-red-500">* Error : {{ error }}</div>
          </div>
          <button class="bg-primary-500 rounded-lg px-4 py-2 text-white font-bold" @click="update">
            Update Config
          </button>
        </div>
      </div>
    </Card>
    <Card class="mt-8">
      <template #header>
        <div class="font-bold text-xl">Box Set > NFTs Card</div>
      </template>
      <div>
        <div v-if="boxset.cards.length === 0">No NFTs Card</div>
        <div v-else class="card-container grid grid-cols-4 gap-6">
          <NuxtLink
            v-for="(item, i) in boxset.cards || []"
            :key="i"
            class="group cursor-pointer card-item rounded-xl border overflow-hidden px-3 py-3 shadow-lg border-slate-500/50"
            :to="{ name: 'box-address', params: { address: boxset.address.toString() } }"
          >
            <!-- <div class="card-item-inside shadow rounded-2xl overflow-hidden">
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
            </div> -->
            <div class="mt-3 pl-2">
              <div class="text-lg font-bold pr-4">{{ shortPubkey(item.address) }}</div>
              <div class="font-light text-sm">Master Edition : {{ shortPubkey(item.master_edition) }}</div>
              <div class="font-light text-sm">Metadata : {{ shortPubkey(item.metadata) }}</div>
              <div class="font-light text-sm">Token : {{ shortPubkey(item.token) }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </Card>
    <Card v-if="isAuthority" class="mt-8">
      <template #header>
        <div class="font-bold text-xl">Add Nft To Box Set Cards</div>
      </template>
      <div class="flex flex-col space-y-4">
        <div class="flex">
          <div class="w-2/6 mt-2">Master Edition Mint Address</div>
          <div class="flex-1">
            <div class="flex space-x-4">
              <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" v-model="modelCard.mint" />
              <Button text="Fetch" @click="fetchMasterEditionMint" />
            </div>
            <div class="font-thin text-sm mt-1">
              * use mint from your nft master edition, we automatically fill the rest of the fields
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="w-2/6 mt-2">Master Edition > Edition Metadata</div>
          <div class="flex-1">
            <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" readonly v-model="modelCard.master_edition" />
          </div>
        </div>
        <div class="flex">
          <div class="w-2/6 mt-2">Master Edition > Nft Metadata</div>
          <div class="flex-1">
            <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" readonly v-model="modelCard.metadata" />
          </div>
        </div>
        <div class="flex">
          <div class="w-2/6 mt-2">Token</div>
          <div class="flex-1">
            <input type="text" class="w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800" readonly v-model="modelCard.token_account" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <div v-if="error_model_card" class="text-red-500">* Error : {{ error_model_card }}</div>
          </div>
          <button class="bg-primary-500 rounded-lg px-4 py-2 text-white font-bold" @click="add_card">
            Add Card
          </button>
        </div>
      </div>
    </Card>
  </div>
</template>
