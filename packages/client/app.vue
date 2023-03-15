<script lang="ts" setup>
const { nftbox } = useContract()

onMounted(() => {
  console.log(nftbox)
})
</script>

<template>
  <Html class="dark">
    <NuxtLayout>
      <Loading />
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </Html>
</template>
