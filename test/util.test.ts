import { test, expect, vi, describe } from 'vitest'
import { pick, omit, groupBy, debounce } from '../src/util.js'

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

describe('debounce', () => {
    test('std', async () => {
        const spy = vi.fn()
        const fn = debounce(spy, 5)
        fn()
        expect(spy).not.toHaveBeenCalled()
        await new Promise(resolve => setTimeout(resolve, 10))
        expect(spy).toHaveBeenCalled()
    })

    test('immediate', async () => {
        const spy = vi.fn()
        const fn = debounce((a: number) => spy(a), 5, { immediate: true })
        fn(42)
        fn('no' as any)
        expect(spy).toHaveBeenCalledWith(42)
        expect(spy).toHaveBeenCalledTimes(1)
        await new Promise(resolve => setTimeout(resolve, 10))
        fn('second' as any)
        expect(spy).toHaveBeenCalledTimes(2)
        expect(spy).toHaveBeenCalledWith('second')
        expect(spy).not.toHaveBeenCalledWith('no')
    })
})
