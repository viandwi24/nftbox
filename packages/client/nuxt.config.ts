// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  nitro: {
    preset: 'vercel-edge'
  },

  build: {
    transpile: ["@nftbox/js"]
  },

  vite: {
    esbuild: {
      target: "esnext",
    },
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      include: ["@project-serum/anchor", "@solana/web3.js", "buffer", "@nftbox/js", "@metaplex-foundation/js"],
      esbuildOptions: {
        target: "esnext",
      },
    },
    define: {
      "process.env.BROWSER": true,
    },
  },

  modules: [
    "nuxt-icon",
    "@nuxtjs/tailwindcss",
  ],

  css: [
    '~/assets/scss/main.scss',
  ],
})
