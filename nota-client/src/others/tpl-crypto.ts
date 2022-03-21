import { get } from 'svelte/store'
import { authData } from './auth'
import { decryptAsym, decryptSym, importSymKey } from './crypto'
import { getOrSetAsync } from './utils'

const cryptoKeysCache = new Map<string, CryptoKey>()

async function getCryptoKey(encSymKeyJWK: string): Promise<CryptoKey> {
  return getOrSetAsync(cryptoKeysCache, encSymKeyJWK, async () => {
    const privateKey = get(authData)?.decrypted.privateKey

    if (!privateKey) {
      throw new Error("Internal error: viewer's private key not defined in authentication data")
    }

    const decryptedSymKey = await decryptAsym(privateKey, encSymKeyJWK)

    return importSymKey(decryptedSymKey)
  })
}

export async function tplDecrypt(encSymKeyJWK: string, dataBase64: string): Promise<string> {
  const symKey = await getCryptoKey(encSymKeyJWK)
  return decryptSym(symKey, dataBase64, null)
}
