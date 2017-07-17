import { memoize } from '.'

test('memoize', () => {
  let sumCalledCount = 0
  let getStringsShorterThanCalledCount = 0

  const sum = (...args: number[]): number => {
    sumCalledCount++
    return args.reduce((acc, n) => acc + n, 0)
  }
  const getStringsShorterThan = (array: string[], n: number): string[] => {
    getStringsShorterThanCalledCount++
    return array.filter(item => item.length <= n)
  }

  const memoizedSum = memoize(sum)
  const memoizedGetStringsShorterThan = memoize(getStringsShorterThan)

  expect(memoizedSum(1, 2, 4)).toBe(7)
  expect(memoizedSum(1, 2, 4)).toBe(7)
  expect(memoizedSum(1, 2, 4)).toBe(7)
  expect(sumCalledCount).toBe(1)

  expect(memoizedSum(1, 2, 3, 4)).toBe(10)
  expect(memoizedSum(1, 2, 3, 4)).toBe(10)
  expect(sumCalledCount).toBe(2)

  expect(memoizedSum(1, 2, 3, 5)).toBe(11)
  expect(memoizedSum(1, 2, 3, 5)).toBe(11)
  expect(sumCalledCount).toBe(3)

  expect(memoizedSum(1, 1, 1, 1, 1, 1, 1, 1)).toBe(8)
  expect(memoizedSum(1, 1, 1, 1, 1, 1, 1, 1)).toBe(8)
  expect(sumCalledCount).toBe(4)

  const food = ['milk', 'bread', 'wine', 'chocolate']

  expect(memoizedGetStringsShorterThan(food, 4)).toEqual(['milk', 'wine'])
  expect(memoizedGetStringsShorterThan(food, 4)).toEqual(['milk', 'wine'])
  expect(getStringsShorterThanCalledCount).toBe(1)

  expect(memoizedGetStringsShorterThan(food, 6)).toEqual(['milk', 'bread', 'wine'])
  expect(memoizedGetStringsShorterThan(food, 6)).toEqual(['milk', 'bread', 'wine'])
  expect(memoizedGetStringsShorterThan(food, 6)).toEqual(['milk', 'bread', 'wine'])
  expect(getStringsShorterThanCalledCount).toBe(2)

  const a = memoizedGetStringsShorterThan(food, 5)
  const b = memoizedGetStringsShorterThan(food, 5)
  expect(a === b).toBe(true)
})

test('memoize limited', () => {
  let sumCalledCount = 0

  const sum = (...args: number[]): number => {
    sumCalledCount++
    return args.reduce((acc, n) => acc + n, 0)
  }

  const memoizedSum = memoize(sum, { primitivesCacheLimit: 3 })

  expect(memoizedSum(1)).toBe(1)
  expect(memoizedSum(1)).toBe(1)
  expect(sumCalledCount).toBe(1)

  expect(memoizedSum(2)).toBe(2)
  expect(memoizedSum(2)).toBe(2)
  expect(sumCalledCount).toBe(2)

  expect(memoizedSum(1)).toBe(1)
  expect(memoizedSum(1)).toBe(1)
  expect(sumCalledCount).toBe(2)

  expect(memoizedSum(3)).toBe(3)
  expect(memoizedSum(3)).toBe(3)
  expect(sumCalledCount).toBe(3)

  expect(memoizedSum(4)).toBe(4)
  expect(memoizedSum(4)).toBe(4)
  expect(sumCalledCount).toBe(4)

  expect(memoizedSum(1)).toBe(1)
  expect(memoizedSum(1)).toBe(1)
  expect(sumCalledCount).toBe(5)
})

test('memoize no arg function', () => {
  let fnCalledCount = 0

  const fn = (): number => {
    fnCalledCount++
    return 1
  }

  const memoizedFn = memoize(fn)

  expect(memoizedFn()).toBe(1)
  expect(memoizedFn()).toBe(1)
  expect(memoizedFn()).toBe(1)
  expect(memoizedFn()).toBe(1)
  expect(fnCalledCount).toBe(1)
})