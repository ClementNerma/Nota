/**
 * @file This file is responsible for the encryption and hashing parts of the application
 * As it has NOT been reviewed by a security expert, so please don't consider it secure for now
 * Cryptography is hard and it's extremely difficult to implement it correctly.
 * If you are a cryptography expert and you see something that doesn't seem right in this file, please
 * create an issue on the repository!
 */

import { CONSTANTS } from './constants'

export async function deriveKeyFromPassword(username: string, password: string): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', createBufferSource(password), 'PBKDF2', false, ['deriveKey'])

  return crypto.subtle.deriveKey(
    {
      name: CONSTANTS.crypto.keyDerivationAlgorithm,
      hash: CONSTANTS.crypto.hashAlgorithm,
      iterations: CONSTANTS.crypto.iterations,
      salt: createBufferSource(username), // TODO: check if this is secure enough
    },
    baseKey,
    {
      name: CONSTANTS.crypto.symmetricalEncryptionAlgorithm,
      length: CONSTANTS.crypto.symmetricalEncryptionAlgorithmKeyLength,
    },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: CONSTANTS.crypto.asymmetricalEncryptionAlgorithm,
      modulusLength: CONSTANTS.crypto.asymmetricalEncryptionAlgorithmKeyLength,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: CONSTANTS.crypto.hashAlgorithm,
    },
    true,
    ['encrypt', 'decrypt'],
  )

  if (keyPair instanceof CryptoKey) {
    throw new Error('Key pair generation produced a single key!')
  }

  return keyPair
}

export async function importPublicKey(encoded: string): Promise<CryptoKey> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const key = JSON.parse(encoded)

  return await crypto.subtle.importKey(
    'jwk',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    key,
    { name: CONSTANTS.crypto.asymmetricalEncryptionAlgorithm, hash: CONSTANTS.crypto.hashAlgorithm },
    false,
    ['encrypt'],
  )
}

export async function exportKey(key: CryptoKey): Promise<string> {
  return JSON.stringify(await crypto.subtle.exportKey('jwk', key))
}

export function encryptSym(secretKey: CryptoKey, data: string, iv: Uint8Array) {
  return crypto.subtle.encrypt(
    { name: CONSTANTS.crypto.symmetricalEncryptionAlgorithm, iv },
    secretKey,
    createBufferSource(data),
  )
}

export function encryptAsym(secretKey: CryptoKey, data: string) {
  return crypto.subtle.encrypt(CONSTANTS.crypto.asymmetricalEncryptionAlgorithm, secretKey, createBufferSource(data))
}

export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

export function hash(data: string, salt: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest(
    CONSTANTS.crypto.hashAlgorithm,
    createBufferSource(salt + data + CONSTANTS.forever.hashingPepper),
  )
}

export function createBufferSource(input: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(input)
}
