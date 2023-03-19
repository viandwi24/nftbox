import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import nodePolyfills from "rollup-plugin-node-polyfills"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  nitro: {
    preset: 'vercel-edge'
  },

  build: {
    transpile: ["@nftbox/js", "@metaplex-foundation/js"]
  },

  vite: {
    resolve: {
      alias: {
        stream: "rollup-plugin-node-polyfills/polyfills/stream",
        events: "rollup-plugin-node-polyfills/polyfills/events",
        assert: "assert",
        crypto: "crypto-browserify",
        util: "util",
      },
    },
    esbuild: {
      target: "esnext",
    },
    build: {
      target: "esnext",
      rollupOptions: {
      },
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
