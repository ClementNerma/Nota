import { derived, writable } from 'svelte/store'
import { LoginMutation } from '../graphql/types'

const LOCALSTORAGE_AUTH_DATA_FIELD = 'nota-auth-data'

const localStorageAuthData = localStorage.getItem(LOCALSTORAGE_AUTH_DATA_FIELD)

export const authData = writable<LoginMutation['login'] | null>(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  localStorageAuthData !== null ? JSON.parse(localStorageAuthData) : null,
)

export const isAuth = derived(authData, (authData) => authData !== null)

export const authenticate = (data: LoginMutation['login'] | null) => {
  authData.set(data)
  localStorage.setItem(LOCALSTORAGE_AUTH_DATA_FIELD, JSON.stringify(data))
}
