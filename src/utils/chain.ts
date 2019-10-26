export const chain = <T>(d: () => T): T | null => {
  try {
    return d()
  } catch {
    return null
  }
}
