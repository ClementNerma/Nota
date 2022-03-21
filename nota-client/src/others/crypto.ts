/**
 * @file This file is responsible for the encryption and hashing parts of the application
 * As it has NOT been reviewed by a security expert, so please don't consider it secure for now
 * Cryptography is hard and it's extremely difficult to implement it correctly.
 * If you are a cryptography expert and you see something that doesn't seem right in this file, please
 * create an issue on the repository!
 */

import { fromBase64, toBase64 } from './base64'
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
    true,
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

export async function importSymKey(encoded: string, exportable = false): Promise<CryptoKey> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const key = JSON.parse(encoded)

  return await crypto.subtle.importKey(
    'jwk',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    key,
    { name: CONSTANTS.crypto.symmetricalEncryptionAlgorithm },
    exportable,
    ['encrypt', 'decrypt'],
  )
}

export async function importAsymKey(
  encoded: string,
  type: 'publicKey' | 'privateKey',
  exportable = false,
): Promise<CryptoKey> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const key = JSON.parse(encoded)

  return await crypto.subtle.importKey(
    'jwk',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    key,
    { name: CONSTANTS.crypto.asymmetricalEncryptionAlgorithm, hash: CONSTANTS.crypto.hashAlgorithm },
    exportable,
    [type === 'publicKey' ? 'encrypt' : 'decrypt'],
  )
}

export async function exportKey(key: CryptoKey): Promise<string> {
  return JSON.stringify(await crypto.subtle.exportKey('jwk', key))
}

export async function encryptSym(secretKey: CryptoKey, data: string, iv: ArrayBuffer): Promise<string> {
  return toBase64(
    _assertArrayBuffer(
      await crypto.subtle.encrypt(
        { name: CONSTANTS.crypto.symmetricalEncryptionAlgorithm, iv },
        secretKey,
        createBufferSource(data),
      ),
    ),
  )
}

export async function decryptSymRaw(
  secretKey: CryptoKey,
  dataBase64: string,
  ivBase64: string | null,
): Promise<ArrayBuffer> {
  return _assertArrayBuffer(
    await crypto.subtle.decrypt(
      {
        name: CONSTANTS.crypto.symmetricalEncryptionAlgorithm,
        iv: ivBase64 !== null ? fromBase64(ivBase64) : CONSTANTS.crypto.voidSymmetricalIV,
      },
      secretKey,
      fromBase64(dataBase64),
    ),
  )
}

export async function decryptSym(secretKey: CryptoKey, dataBase64: string, ivBase64: string | null): Promise<string> {
  const decrypted = await decryptSymRaw(secretKey, dataBase64, ivBase64)

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

export async function encryptAsym(secretKey: CryptoKey, data: string): Promise<string> {
  const encrypted = _assertArrayBuffer(
    await crypto.subtle.encrypt(CONSTANTS.crypto.asymmetricalEncryptionAlgorithm, secretKey, createBufferSource(data)),
  )

  return toBase64(encrypted)
}

export async function decryptAsym(secretKey: CryptoKey, dataBase64: string): Promise<string> {
  const decrypted = _assertArrayBuffer(
    await crypto.subtle.decrypt(CONSTANTS.crypto.asymmetricalEncryptionAlgorithm, secretKey, fromBase64(dataBase64)),
  )

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

export async function hash(data: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    CONSTANTS.crypto.hashAlgorithm,
    createBufferSource(salt + data + CONSTANTS.forever.fixedHashSuffix),
  )

  return toBase64(digest)
}

export function createBufferSource(input: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(input)
}

function _assertArrayBuffer(data: unknown): ArrayBuffer {
  if (!(data instanceof ArrayBuffer)) {
    console.error(data)
    throw new Error('crypto library did not return expected Int8Array data type')
  }

  return data
}
