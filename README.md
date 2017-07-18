# Triemoize

Efficient, reliable and memory leak free memoization using WeakMaps and tries

[![build status](https://img.shields.io/travis/ErikCupal/triemoize.svg?style=flat-square)](https://travis-ci.org/ErikCupal/triemoize/)
[![npm version](https://img.shields.io/npm/v/triemoize.svg?style=flat-square)](https://www.npmjs.com/package/redux)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

There are many memoization libraries out there. What this library tries to achieve is to be

* Efficient
* Reliable
* Memory leak free

For all this to work, you must always use **immutable data** as function arguments when you're calling the memoized function.

Installation

```
npm install --save triemoize
```

If you're using Yarn


```
yarn add triemoize
```

## Usage

```js
import memoize from 'triemoize'

// Create a pure function
const add = (a, b) = a + b

// Memoize it
const memoizedAdd = memoize(add)

memoizedAdd(1, 2) // The function was called
memoizedAdd(1, 2) // This time the result was taken from cache
```

Unlike from other memoization techniques like serialization, you can safely use huge objects or arrays as function arguments without worrying about performance or memory leaks. However, all the arguments you pass in must be immutable. Otherwise the memoization would not work correctly.

```js
const getStringsLessThan = memoize((arrayOfStrings, num) => {
  return arrayOfStrings.filter(item => item.length < num)
})

const food = [
  'milk', 'bread', 'cheese', 'chocolate', 'potatoes', 'bacon',
  'butter', 'eggs', 'sausages', 'pork', 'yoghurt', 'apple'
]

getStringsLessThan(food) // The function was called
getStringsLessThan(food) // The result was taken from cache
```

### Named arguments

Named arguments (using ES6 destructuring) are not supported in the moment. I plan to add it later.

```js
// Not supported in the moment

const add = ({ a, b }) = a + b
const memoizedAdd = memoize(add)

memoizedAdd({ a: 1, b: 2}) // The function was called
memoizedAdd({ a: 1, b: 2}) // Fail, the value was recomputed
```

## How it works

TODO

## Benchmark

TODO

## License

MIT