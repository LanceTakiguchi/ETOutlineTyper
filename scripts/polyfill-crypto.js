// Polyfill for globalThis.crypto.getRandomValues for Node preload
try {
  const nodeCrypto = require('crypto')
  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    if (nodeCrypto.webcrypto && typeof nodeCrypto.webcrypto.getRandomValues === 'function') {
      globalThis.crypto = nodeCrypto.webcrypto
    } else {
      if (typeof globalThis.crypto === 'undefined') globalThis.crypto = {}
      globalThis.crypto.getRandomValues = (arr) => nodeCrypto.randomFillSync(arr)
    }
  }
} catch (e) {
  // best-effort polyfill; if this fails, Vite will show the original error
}
