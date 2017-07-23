// const triemoize = require('../dist').default
const triemoize = require('../')
const Table = require('cli-table2')
const fastMemoize = require('fast-memoize')
const Benchmark = require('benchmark')
const { sort, map, forEach, toPairs, pipe } = require('ramda')

const yellow = '\x1b[33m'
const white = '\x1b[37m'

const renderResults = ({
  functionName = undefined,
  functionArguments = undefined,
  results = [],
} = {}) => {
  console.log('')

  if (functionName) console.log(yellow, 'Function:', white, functionName)
  if (functionArguments) console.log(yellow, 'Passed arguments:', white, functionArguments)

  console.log('')

  const transformedResults = map(result => [
    result.target.name,
    result.target.hz.toLocaleString('en-US', { maximumFractionDigits: 0 })
  ], results)

  const table = new Table({ head: ['METHOD', 'OPS/S'] })
  table.push(...transformedResults)

  console.log(table.toString())
}

const benchmarkMemoization = (memoizers = {}) => (functionToMemoize, callFunctionWithArgs) => {
  if (functionToMemoize && callFunctionWithArgs) {
    let results = []

    const sortResults = sort((a, b) => a.target.hz < b.target.hz ? 1 : -1)

    const onCycle = event => results.push(event)

    const onComplete = () => renderResults({
      functionName: functionToMemoize.name,
      functionArguments: callFunctionWithArgs.toString(),
      results: sortResults(results),
    })

    const memoizedFunctions = map(memoizer => memoizer(functionToMemoize), memoizers)

    const functionsToBenchmark = Object.assign({}, memoizedFunctions, { 'vanilla': functionToMemoize })

    const benchmark = new Benchmark.Suite()

    pipe(
      toPairs,
      forEach(([memoizerName, memoizedFunction]) => {
        benchmark.add(memoizerName, () => callFunctionWithArgs(memoizedFunction))
      })
    )(functionsToBenchmark)

    benchmark
      .on('cycle', onCycle)
      .on('complete', onComplete)
      .run()

  } else {
    console.warn('Error benchmarking!')
  }
}

module.exports = benchmarkMemoization