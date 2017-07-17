import { CombinedMap, createCombinedMap, mapGet, mapHas, mapSet } from './combinedMap'
import { hasResult, cache, result } from './symbols'

const isCache = <T>(value: T) => typeof value === 'object' && value[cache]

const has = (cache: CombinedMap, params: any[], remainingParamsLength: number): boolean => {
  if (remainingParamsLength === 0) {
    return !!cache[hasResult]
  }

  const currentParamsKey = params[params.length - remainingParamsLength]
  const hasKey = mapHas(cache, currentParamsKey)

  if (hasKey) {
    const keyValue = mapGet(cache, currentParamsKey)

    if (remainingParamsLength === 1) {
      if (isCache(keyValue)) {
        return !!keyValue[result]
      } else {
        return !!keyValue
      }
    }

    return has(keyValue, params, remainingParamsLength - 1)
  }

  return false
}

const get = (cache: CombinedMap, params: any[], remainingParamsLength: number): any => {
  if (remainingParamsLength === 0) {
    return cache[result]
  }

  const currentParamsKey = params[params.length - remainingParamsLength]
  const hasKey = mapHas(cache, currentParamsKey)

  if (hasKey) {
    const keyValue = mapGet(cache, currentParamsKey)

    if (remainingParamsLength === 1) {
      if (isCache(keyValue)) {
        return keyValue[result]
      } else {
        return keyValue
      }
    }

    return get(keyValue, params, remainingParamsLength - 1)
  }

  return undefined
}

const set = (
  value: any,
  cache: CombinedMap,
  cacheLimit: number | undefined,
  params: any[],
  remainingParamsLength: number,
) => {
  if (remainingParamsLength === 0) {
    cache[hasResult] = true
    cache[result] = value
    return
  }

  const currentParamsKey = params[params.length - remainingParamsLength]
  const hasKey = mapHas(cache, currentParamsKey)

  if (remainingParamsLength === 1) {
    if (hasKey) {
      const nextCache = mapGet(cache, currentParamsKey)
      nextCache[hasResult] = true
      nextCache[result] = value
      return
    } else {
      mapSet(cache, currentParamsKey, value)
    }
    return
  }

  if (hasKey) {
    const keyValue = mapGet(cache, currentParamsKey)

    if (isCache(keyValue)) {
      set(value, keyValue, cacheLimit, params, remainingParamsLength - 1)
    } else {
      const nextCache = createCombinedMap(cacheLimit)
      nextCache[hasResult] = true
      nextCache[result] = keyValue
      mapSet(cache, currentParamsKey, nextCache)

      set(value, nextCache, cacheLimit, params, remainingParamsLength - 1)
    }
    return
  }

  const nextCache = createCombinedMap(cacheLimit)
  mapSet(cache, currentParamsKey, nextCache)

  set(value, nextCache, cacheLimit, params, remainingParamsLength - 1)
}

export interface Options {
  primitivesCacheLimit?: number
}

export const memoize = <F extends Function>(fn: F, options?: Options): F => {
  const primitivesCacheLimit = options && options.primitivesCacheLimit
  const cache = createCombinedMap(primitivesCacheLimit)

  const memoizedFn: any = (...args: any[]) => {
    if (has(cache, args, args.length)) {
      return get(cache, args, args.length)
    } else {
      const result = fn(...args)
      set(result, cache, primitivesCacheLimit, args, args.length)
      return result
    }
  }

  return memoizedFn
}

export default memoize