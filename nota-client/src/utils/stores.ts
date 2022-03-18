import { readable, writable } from 'svelte/store'
import { LoginMutation } from '../graphql/types'

export const authData = writable<LoginMutation['login'] | null>(null)

export const isAuth = readable(false, (set) => {
  authData.subscribe((data) => set(data !== null))
})
