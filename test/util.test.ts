import { pick, omit } from '../src/util'

test('pick & omit', async () => {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    expect(pick(o, 'a', 'c')).toEqual({ a: 1, c: 3 })
    expect(pick(o, ['a', 'b'])).toEqual({ a: 1, b: 2 })

    expect(omit(o, 'a', 'd')).toEqual({ b: 2, c: 3 })
    expect(omit(o, ['c', 'd'])).toEqual({ a: 1, b: 2 })
})
