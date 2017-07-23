"use strict";

var cacheSymbol = Symbol();
var hasResult = Symbol();
var result = Symbol();
var objectsCache = Symbol();
var limitedObject = Symbol();
var primitivesKeysQueue = Symbol();
var limit = Symbol();
var noResult = Symbol();

function mapHas(map, key) {
  if (typeof key !== 'object') {
    return map.hasOwnProperty(key);
  } else {
    if (map[objectsCache]) {
      return map[objectsCache].has(key);
    } else {
      return false;
    }
  }
}

function mapGet(map, key) {
  if (typeof key !== 'object') {
    return map[key];
  } else {
    return map[objectsCache].get(key);
  }
}

function mapSet(map, key, value) {
  if (typeof key !== 'object') {
    if (map[limitedObject]) {
      var queue = map[primitivesKeysQueue];
      if (queue.length >= map[limit]) {
        delete map[queue.shift()];
      }
      queue.push(key);
    }
    map[key] = value;
  } else {
    if (!map[objectsCache]) {
      map[objectsCache] = new WeakMap();
    }
    map[objectsCache].set(key, value);
  }
}

function createCombinedMap(primitivesLimit) {
  var combinedMap = {};
  combinedMap[cacheSymbol] = true;

  if (typeof primitivesLimit === 'number') {
    combinedMap[limitedObject] = true;
    combinedMap[primitivesKeysQueue] = [];
    combinedMap[limit] = primitivesLimit;
  }

  return combinedMap;
}

function get(cache, params, remainingParamsLength) {
  if (remainingParamsLength === 0) {
    return cache[result];
  }
  var currentParamsKey = params[params.length - remainingParamsLength];
  var hasKey = mapHas(cache, currentParamsKey);
  if (hasKey) {
    var keyValue = mapGet(cache, currentParamsKey);
    if (remainingParamsLength === 1) {
      if (typeof keyValue === 'object' && keyValue[cacheSymbol]) {
        return keyValue[result];
      } else {
        return keyValue;
      }
    }
    return get(keyValue, params, remainingParamsLength - 1);
  }
  return noResult;
}

function set(value, cache, cacheLimit, params, remainingParamsLength) {
  if (remainingParamsLength === 0) {
    cache[hasResult] = true;
    cache[result] = value;
    return;
  }
  var currentParamsKey = params[params.length - remainingParamsLength];
  var hasKey = mapHas(cache, currentParamsKey);
  var nextCache;
  if (remainingParamsLength === 1) {
    if (hasKey) {
      nextCache = mapGet(cache, currentParamsKey);
      nextCache[hasResult] = true;
      nextCache[result] = value;
      return;
    }
    else {
      mapSet(cache, currentParamsKey, value);
    }
    return;
  }
  if (hasKey) {
    var keyValue = mapGet(cache, currentParamsKey);
    if (typeof keyValue === 'object' && keyValue[cacheSymbol]) {
      set(value, keyValue, cacheLimit, params, remainingParamsLength - 1);
    }
    else {
      nextCache = createCombinedMap(cacheLimit);
      nextCache[hasResult] = true;
      nextCache[result] = keyValue;
      mapSet(cache, currentParamsKey, nextCache);
      set(value, nextCache, cacheLimit, params, remainingParamsLength - 1);
    }
    return;
  }
  nextCache = createCombinedMap(cacheLimit);
  mapSet(cache, currentParamsKey, nextCache);
  set(value, nextCache, cacheLimit, params, remainingParamsLength - 1);
}

function memoize(fn, options) {
  var primitivesCacheLimit = options && options.primitivesCacheLimit;
  var cache = createCombinedMap(primitivesCacheLimit);
  function memoizedFn() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var possibleResult = get(cache, args, _len);
    if (possibleResult === noResult) {
      var result = fn.apply(undefined, args);
      set(result, cache, primitivesCacheLimit, args, _len);
      return result;
    } else {
      return possibleResult;
    }
  }
  return memoizedFn;
}

module.exports = memoize;
module.exports.memoize = memoize;
module.exports.default = memoize;
module.exports.__esModule = true;
