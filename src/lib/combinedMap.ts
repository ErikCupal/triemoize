import { cache, limitedObject, primitivesKeysQueue, limit, objectsCache } from './symbols'

export interface CombinedMap extends Object { [key: string]: any }

const isPrimitive = <T>(value: T) => typeof value !== 'object'

export const mapHas = (map: CombinedMap, key: any): any => {
  if (isPrimitive(key)) {
    return map.hasOwnProperty(key)
  } else {
    return map[objectsCache]
      ? map[objectsCache].has(key)
      : false
  }
}

export const mapGet = (map: CombinedMap, key: any): any => {
  if (isPrimitive(key)) {
    return map[key]
  } else {
    return map[objectsCache]
      ? map[objectsCache].get(key)
      : undefined
  }
}

export const mapSet = (map: CombinedMap, key: any, value: any) => {
  if (isPrimitive(key)) {
    if (map[limitedObject]) {
      const queue: any[] = map[primitivesKeysQueue]
      if (queue.length >= map[limit]) {
        delete map[queue.shift()]
      }
      queue.push(key)
    }

    map[key] = value
  } else {
    if (!map[objectsCache]) {
      map[objectsCache] = new WeakMap()
    }
    map[objectsCache].set(key, value)
  }
}

export const createCombinedMap = (primitivesLimit?: number): CombinedMap => typeof primitivesLimit === 'number'
  ? {
    [cache]: true,
    [limitedObject]: true,
    [primitivesKeysQueue]: [],
    [limit]: primitivesLimit,
  }
  : { [cache]: true }