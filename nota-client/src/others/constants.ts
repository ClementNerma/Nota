export const CONSTANTS = Object.freeze({
  crypto: Object.freeze({
    keyDerivationAlgorithm: 'PBKDF2',
    hashAlgorithm: 'SHA-384',
    iterations: 100_000,
    symmetricalEncryptionAlgorithm: 'AES-GCM',
    symmetricalEncryptionAlgorithmKeyLength: 256,
    asymmetricalEncryptionAlgorithm: 'RSA-OAEP',
    asymmetricalEncryptionAlgorithmKeyLength: 4096,
    voidSymmetricalIV: new Uint8Array(16).fill(0),
  }),

  AZUppercaseAlphabet: new Array(26)
    .fill(null)
    .map((_, i) => String.fromCharCode(65 + i))
    .join(''),

  forever: Object.freeze({
    fixedHashSuffix: 'NOTA_HASHING_FIXED_SUFFIX',
  }),
})
