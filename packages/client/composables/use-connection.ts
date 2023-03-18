import { clusterApiUrl, Connection } from "@solana/web3.js"

export const useConnection = () => {
  const { $connection } = useNuxtApp()
  const connection = computed(() => $connection)
  return {
    connection
  }
}
