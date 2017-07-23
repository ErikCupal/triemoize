const benchmarkMemoization = require('./benchmarkMemoization')

const triemoize = require('../')
const fastMemoize = require('fast-memoize')

const memoizers = {
  'triemoize': triemoize,
  'fast-memoize': fastMemoize,
}

const benchmarkFunction = benchmarkMemoization(memoizers)

const fibonacci = n => n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
const add = (a, b) => a + b
const identity = a => a

const obj = {}

const food = ['milk', 'bread', 'wine', 'chocolate']

const getStringsShorterThan = (array, n) => array.filter(item => item.length <= n)

const runBenchmarks = () => {
  benchmarkFunction(fibonacci, f => f(15))
  benchmarkFunction(add, f => f(1, 2))
  benchmarkFunction(identity, f => f(obj))
  benchmarkFunction(getStringsShorterThan, f => f(food))
}

runBenchmarks()