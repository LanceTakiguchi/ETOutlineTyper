// Polyfill `globalThis.crypto.getRandomValues` for Node environments
// Vite's Node API expects a Web Crypto `getRandomValues` function. Some
// Node installations (or older runtimes) don't provide it, causing
// `crypto.getRandomValues is not a function` errors. We provide a small
// shim using Node's `crypto.randomFillSync`.
import { randomFillSync } from 'crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ensure a working `globalThis.crypto.getRandomValues` implementation.
// Prefer Node's `crypto.webcrypto` when available (Node v16.0+), otherwise
// fall back to a shim using `randomFillSync`.
try {
  if (typeof (globalThis as any).crypto?.getRandomValues !== 'function') {
    // Try to use node's webcrypto
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require('crypto')
    if (nodeCrypto && nodeCrypto.webcrypto && typeof nodeCrypto.webcrypto.getRandomValues === 'function') {
      ;(globalThis as any).crypto = nodeCrypto.webcrypto
    } else {
      if (typeof (globalThis as any).crypto === 'undefined') {
        ;(globalThis as any).crypto = {}
      }
      ;(globalThis as any).crypto.getRandomValues = (arr: Uint8Array) => randomFillSync(arr)
    }
  }
} catch (err) {
  if (typeof (globalThis as any).crypto === 'undefined') {
    ;(globalThis as any).crypto = {}
  }
  ;(globalThis as any).crypto.getRandomValues = (arr: Uint8Array) => randomFillSync(arr)
}

export default defineConfig({
  plugins: [react()],
  base: '/ETOutlineTyper/',
  server: {
    port: 5173
  }
})
