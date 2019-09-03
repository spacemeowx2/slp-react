import { parse } from 'toml'
type Primitive = string | number | bigint | boolean | null | undefined | symbol

function isPrimive (v: any): v is Primitive {
  if (typeof v === 'string') return true
  if (typeof v === 'number') return true
  if (typeof v === 'bigint') return true
  if (typeof v === 'boolean') return true
  if (v === null) return true
  if (typeof v === 'undefined') return true
  if (typeof v === 'symbol') return true
  return false
}

function deepCopy (obj: any): any {
  if (isPrimive(obj)) return obj

  if (Array.isArray(obj)) {
    return [...obj].map(i => deepCopy(i))
  } else {
    let out = {
      ...obj
    }
    for (const key of Object.keys(out)) {
      out[key] = deepCopy(out[key])
    }
    return out
  }
}

export function parseToml (s: string): any {
  return deepCopy(parse(s))
}
