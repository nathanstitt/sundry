import { test, expect } from 'vitest'
import { pick, omit, groupBy } from '../src/util.js'

test('pick & omit', async () => {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    expect(pick(o, 'a', 'c')).toEqual({ a: 1, c: 3 })
    expect(pick(o, ['a', 'b'])).toEqual({ a: 1, b: 2 })

    expect(omit(o, 'a', 'd')).toEqual({ b: 2, c: 3 })
    expect(omit(o, ['c', 'd'])).toEqual({ a: 1, b: 2 })
})

test('groupBy', async () => {
    const nums = [6.5, 4.12, 6.8, 5.4]
    expect(groupBy(nums, Math.floor)).toEqual({
        4: [4.12],
        5: [5.4],
        6: [6.5, 6.8],
    })
    expect(groupBy([{a: 1, b:2}, {a:1, b:3}, {a: 2, d: 12}], 'a')).toEqual({
        1: [{a: 1, b:2}, {a:1, b:3}],
        2: [{a: 2, d: 12}],
    })
})
