import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

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
      commonjsOptions: {
        exclude: ["@nftbox/js", "@nftbox/contract"]
      }
    },
    optimizeDeps: {
      include: ["@project-serum/anchor", "@solana/web3.js", "buffer", "@nftbox/js", "@nftbox/contract", "@metaplex-foundation/js"],
      esbuildOptions: {
        target: "esnext",
        define: {
          global: "globalThis",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin() as any,
        ]
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
