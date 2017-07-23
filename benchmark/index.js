const benchmarkMemoization = require('./benchmarkMemoization')

const fibonacci = n => n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
const add = (a, b) => a + b
const double = n => 2 * n
const identity = a => a

// benchmarkMemoization(fibonacci, [15])
// benchmarkMemoization(double, [2])
// benchmarkMemoization(add, [1, 2])
benchmarkMemoization(identity, [2])
// benchmarkMemoization(identity, [3])
benchmarkMemoization(identity, [{}])