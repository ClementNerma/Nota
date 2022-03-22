import { derived, get, writable } from 'svelte/store'
import { ViewerQuery } from '../graphql/types'
import { decryptAsym, decryptSym, exportKey, importAsymKey, importSymKey } from './crypto'
import { AsyncViewer } from './gql/Viewer.generated'

type AuthProfile = {
  uuid: string
  accessToken: string
  secretKey: string
  lastDecryptedName: string
}

type AuthViewer = Readonly<{
  accessToken: string
  viewer: Viewer
  secretKey: CryptoKey
  decrypted: Readonly<{
    privateKey: CryptoKey
    publicName: string
  }>
}>

type Viewer = NonNullable<ViewerQuery['viewer']>

export async function authenticateViewer(secretKey: CryptoKey, accessToken: string, viewer: Viewer): Promise<void> {
  const privateKeyData = await decryptSym(secretKey, viewer.symKeyEncPrivateKeyJWK, viewer.symKeyEncPrivateKeyIV)

  const privateKey = await importAsymKey(privateKeyData, 'privateKey')

  const publicName = await decryptAsym(privateKey, viewer.encPublicName)

  const exportedSecretKey = await exportKey(secretKey)

  authData.set({
    accessToken,
    viewer,
    secretKey,
    decrypted: {
      privateKey,
      publicName,
    },
  })

  profiles.update((profiles) => {
    const newProfile: AuthProfile = {
      uuid: viewer.uuid,
      accessToken,
      secretKey: exportedSecretKey,
      lastDecryptedName: publicName,
    }

    const existingProfileId = profiles.findIndex((profile) => profile.uuid === newProfile.uuid)

    const updated: typeof profiles =
      existingProfileId === -1
        ? profiles.concat([newProfile])
        : profiles
            .slice(0, existingProfileId)
            .concat([newProfile])
            .concat(profiles.slice(existingProfileId + 1))

    localStorage.setItem(LOCALSTORAGE_PROFILES_ITEM, JSON.stringify(updated))
    localStorage.setItem(LOCALSTORAGE_LAST_ACTIVE_PROFILE_ITEM, viewer.uuid)

    return updated
  })
}

export function logout() {
  profiles.update((profiles) => {
    const currentUser = get(authData)?.viewer

    if (currentUser) {
      localStorage.setItem(
        LOCALSTORAGE_PROFILES_ITEM,
        JSON.stringify(profiles.filter((profile) => profile.uuid !== currentUser.uuid)),
      )

      if (profiles.length === 0) {
        localStorage.removeItem(LOCALSTORAGE_LAST_ACTIVE_PROFILE_ITEM)
      }
    }

    location.reload()
    return []
  })
}

export async function switchToProfile(uuid: string, initial = false) {
  if (!initial) {
    localStorage.setItem(LOCALSTORAGE_LAST_ACTIVE_PROFILE_ITEM, uuid)
    pendingAuth.set(true)
    location.reload()
    return
  }

  const profile = get(profiles).find((profile) => profile.uuid === uuid)

  if (!profile) {
    console.error('Cannot switch to unknown profile ID: ' + uuid)
    pendingAuth.set(false)
    return
  }

  const secretKey = await importSymKey(profile.secretKey, true)

  const viewer = await AsyncViewer({
    context: {
      [APOLLO_CONTEXT_ACCESS_TOKEN]: profile.accessToken,
    },
  })

  if (viewer.data.viewer) {
    await authenticateViewer(secretKey, profile.accessToken, viewer.data.viewer)
  } else {
    console.warn('Access token is not valid anymore for profile ID: ' + uuid)
    profiles.update((profiles) => profiles.filter((profile) => profile.uuid !== uuid))
  }

  pendingAuth.set(false)
}

function getLocalStorageProfiles(): AuthProfile[] {
  const localStorageData = localStorage.getItem(LOCALSTORAGE_PROFILES_ITEM)

  if (localStorageData === null) {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(localStorageData)
}

function resumeLastProfile() {
  const lastActiveProfile = localStorage.getItem(LOCALSTORAGE_LAST_ACTIVE_PROFILE_ITEM)

  if (lastActiveProfile !== null) {
    switchToProfile(lastActiveProfile, true).catch((e) => console.error(e))
  } else {
    pendingAuth.set(false)
  }
}

const LOCALSTORAGE_PROFILES_ITEM = 'nota-auth-profiles'
const LOCALSTORAGE_LAST_ACTIVE_PROFILE_ITEM = 'nota-auth-last-active-profile'

export const APOLLO_CONTEXT_ACCESS_TOKEN = '$apolloBearerToken'

/** Is an authentication process pending? */
export const pendingAuth = writable(true)

/** Authentication data for the current user (viewer) */
export const authData = writable<AuthViewer | null>(null)

/** Is the user authenticated? */
export const isAuth = derived(authData, (authData) => authData !== null)

/** List of all authenticable profiles */
export const profiles = writable<AuthProfile[]>(getLocalStorageProfiles())

// Try to authenticate the user from the local storage's authentication data
resumeLastProfile()
