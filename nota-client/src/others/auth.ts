import { derived, writable } from 'svelte/store'
import { LoginMutation, ViewerQuery } from '../graphql/types'
import { decryptAsym, decryptSym, exportKey, importAsymKey, importSymKey } from './crypto'
import { AsyncViewer } from './gql/Viewer.generated'

type AuthData = Readonly<{
  accessToken: string
  viewer: LoginMutation['login']['viewer']
  secretKey: CryptoKey
  decrypted: Readonly<{
    privateKey: CryptoKey
    publicName: string
  }>
}>

type LocalStorageReAuthData = Readonly<{
  accessToken: string
  secretKey: string
}>

type Viewer = NonNullable<ViewerQuery['viewer']>

export async function authenticate(secretKey: CryptoKey, accessToken: string, viewer: Viewer): Promise<void> {
  const privateKeyData = await decryptSym(secretKey, viewer.symKeyEncPrivateKeyJWK, viewer.symKeyEncPrivateKeyIV)

  const privateKey = await importAsymKey(privateKeyData, 'privateKey')

  const publicName = await decryptAsym(privateKey, viewer.encPublicName)

  authData.set({
    accessToken,
    viewer,
    secretKey,
    decrypted: {
      privateKey,
      publicName,
    },
  })

  const reAuthData: LocalStorageReAuthData = {
    accessToken,
    secretKey: await exportKey(secretKey),
  }

  localStorage.setItem(LOCALSTORAGE_ACCESS_TOKEN_FIELD, JSON.stringify(reAuthData))
}

export function logout() {
  authData.set(null)
  localStorage.removeItem(LOCALSTORAGE_ACCESS_TOKEN_FIELD)
}

export async function tryAuthFromLocalStorage() {
  const localStorageData = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_FIELD)

  if (localStorageData === null) {
    pendingAuth.set(false)
    pendingAuthAccessToken.set(null)
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const reAuthData: LocalStorageReAuthData = JSON.parse(localStorageData)

  pendingAuthAccessToken.set(reAuthData.accessToken)

  const secretKey = await importSymKey(reAuthData.secretKey, true)

  const viewer = await AsyncViewer({})

  if (viewer.data.viewer) {
    await authenticate(secretKey, reAuthData.accessToken, viewer.data.viewer)
  }

  pendingAuthAccessToken.set(null)
  pendingAuth.set(false)
}

const LOCALSTORAGE_ACCESS_TOKEN_FIELD = 'nota-auth-data'

export const pendingAuth = writable(true)
export const pendingAuthAccessToken = writable<string | null>(null)

export const authData = writable<AuthData | null>(null)

export const isAuth = derived(authData, (authData) => authData !== null)

tryAuthFromLocalStorage().catch((e) => console.error(e))
