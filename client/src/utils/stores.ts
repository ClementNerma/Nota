import { readable, writable } from 'svelte/store'
import { User } from '../graphql/types'

export const viewer = writable<User | null>(null)

export const isAuth = readable(false, (set) => {
  viewer.subscribe((user) => set(user !== null))
})
