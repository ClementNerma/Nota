export function mergeObjects<T extends object>(
  base: T,
  extension: { [Key in keyof T]?: T[Key] | null | undefined },
): void {
  for (const [field, value] of Object.entries(extension) as [keyof T, T[keyof T] | null | undefined][]) {
    if (value !== null && value !== undefined) {
      base[field] = value
    }
  }
}
