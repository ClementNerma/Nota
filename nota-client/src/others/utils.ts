import { Subscriber } from 'svelte/store'

export function getOrSet<K, V>(map: Map<K, V>, key: K, setter: () => V): V {
  const value = map.get(key)

  if (map.has(key)) {
    return value!
  }

  const set = setter()
  map.set(key, set)
  return set
}

export async function getOrSetAsync<K, V>(map: Map<K, V>, key: K, setter: () => Promise<V>): Promise<V> {
  const value = map.get(key)

  if (map.has(key)) {
    return value!
  }

  const set = await setter()
  map.set(key, set)
  return set
}

export function ignoreInitValue<T>(subscriber: Subscriber<T>): Subscriber<T> {
  let firstValue = true

  return (value) => {
    if (firstValue) {
      firstValue = false
    } else {
      subscriber(value)
    }
  }
}
