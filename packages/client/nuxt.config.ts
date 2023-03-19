import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import nodePolyfills from "rollup-plugin-node-polyfills"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  nitro: {
    preset: 'vercel-edge'
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
      commonjsOptions: {
        exclude: ["@nftbox/js"]
      }
    },
    optimizeDeps: {
      include: ["@project-serum/anchor", "@solana/web3.js", "buffer", "@nftbox/js", "@metaplex-foundation/js"],
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
