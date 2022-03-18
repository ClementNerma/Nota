export const CONSTANTS = Object.freeze({
  crypto: Object.freeze({
    keyDerivationAlgorithm: 'PBKDF2',
    hashAlgorithm: 'SHA-384',
    iterations: 100_000,
    symmetricalEncryptionAlgorithm: 'AES-CBC',
    symmetricalEncryptionAlgorithmKeyLength: 256,
    asymmetricalEncryptionAlgorithm: 'RSA-OAEP',
    asymmetricalEncryptionAlgorithmKeyLength: 4096,
  }),

  AZUppercaseAlphabet: new Array(26)
    .fill(null)
    .map((_, i) => String.fromCharCode(65 + i))
    .join(''),

  forever: Object.freeze({
    hashingPepper: 'NOTA_HASHING_PEPPER',
  }),
})
