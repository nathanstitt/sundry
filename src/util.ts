import { ErrorTypes } from './types.js'

export function isDate(d: any): d is Date {
    return d instanceof Date && !isNaN(d as any)
}
export function isString(s: any): s is string {
    return typeof s === 'string'
}
export function isNumber(n: any): n is number {
    return typeof n === 'number'
}
export function isNil(val: unknown): val is null | undefined {
    return val == null
}
export function nonNil<TValue>(value: TValue | null | undefined): value is TValue {
    return !isNil(value)
}
export function isDefined<Value>(value: Value | undefined | null): value is Value {
    return value != null
}

export function compact<T>(a: Array<T | null | undefined>): Array<T> {
    return a.filter(isDefined)
}

export function coalesce<T>(target?: any, defaultVal?: T): T {
    return isNil(target) ? defaultVal : target
}

export function invert<T extends Record<PropertyKey, PropertyKey>>(
    obj: T
): {
    [K in keyof T as T[K]]: K
} {
    return Object.entries(obj).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [value]: key,
        }),
        {} as any
    )
}

export function isEmpty(obj: null | undefined | string | Record<string, any>): boolean {
    if (isString(obj)) {
        return obj === ''
    } else if (obj == null) {
        return true
    } else if (typeof obj == 'object') {
        return Object.keys(obj).length === 0
    }
    return false
}

interface RetryOptions {
    times?: number
    interval?: number
    exponentialBackoff?: boolean
}

export function pick<T extends object, K extends keyof T>(
    obj: T,
    ...select: K[] | [Array<K>]
): Pick<T, K> {
    const paths: K[] = select.length === 1 && Array.isArray(select[0]) ? select[0] : (select as K[])
    return { ...paths.reduce((mem, key) => ({ ...mem, [key]: obj[key] }), {}) } as Pick<T, K>
}

export function omit<T extends object, K extends keyof T>(
    obj: T,
    ...reject: K[] | [Array<K>]
): Omit<T, K> {
    const paths: K[] = reject.length === 1 && Array.isArray(reject[0]) ? reject[0] : (reject as K[])
    return {
        ...paths.reduce(
            (mem, key) => ((k: K, { [k]: _, ...rest }) => rest)(key, mem),
            obj as object
        ),
    } as Omit<T, K>
}

// https://github.com/gregberge/loadable-components/issues/667
export function retry<T>(
    fn: () => Promise<T>,
    { times = 3, interval = 500, exponentialBackoff = true }: RetryOptions = {}
) {
    return new Promise<T>((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                setTimeout(() => {
                    if (times === 1) {
                        reject(error)
                        return
                    }

                    // Passing on "reject" is the important part
                    retry(fn, {
                        times: times - 1,
                        interval: exponentialBackoff ? interval * 2 : interval,
                    }).then(resolve, reject)
                }, interval)
            })
    })
}

export function emptyFn() {} // eslint-disable-line
export const emptyObject = Object.create(null)

export async function getFetchBody(resp: Response) {
    const text = await resp.text()
    try {
        return JSON.parse(text)
    } catch (e) {
        return text
    }
}

export function useSupportsTouch() {
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    )
}

export function errorToString(error: ErrorTypes) {
    if (!error) return ''

    let msg = ''
    if (typeof error == 'object') {
        msg = error.message || ''
    } else {
        msg = String(error)
    }
    return msg
}

export function isShallowEqual(object1: Record<any, any>, object2: Record<any, any>) {
    if (object1 === object2) return true

    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)
    if (keys1.length !== keys2.length) {
        return false
    }
    for (const key of keys1) {
        if (object1[key] !== object2[key]) {
            return false
        }
    }
    return true
}

export const isSSR = typeof document == 'undefined'

export function toArray<T>(aryOrEl: T | Array<T>) {
    return Array.isArray(aryOrEl) ? aryOrEl : [aryOrEl]
}

export function whenDomReady(fn: () => void): void {
    if (isSSR) return
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fn, 1)
    } else {
        document.addEventListener('DOMContentLoaded', fn)
    }
}

export function firstNonNil(...values: Array<null | undefined | number>): number | null {
    return values.find(nonNil) || null
}

// Same as `Object.assign()` but with type inference
export function objectAssign<Obj extends object, ObjAddendum>(
    obj: Obj,
    objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
    Object.assign(obj, objAddendum)
}

export function groupBy<T>(
    array: T[],
    predicate: keyof T | ((value: T, index: number, array: T[]) => string | number)
) {
    return array.reduce((acc, value, index, array) => {
        const key =
            typeof predicate == 'function'
                ? predicate(value, index, array)
                : (value[predicate] as string)
        ;(acc[key] ||= []).push(value)
        return acc
    }, {} as { [key: string]: T[] })
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
    callback: F,
    debounceDelay = 10,
    options: { immediate: boolean } = { immediate: false }
) {
    let timeout: ReturnType<typeof setTimeout> | null

    return function <U>(ctx: U, ...args: Parameters<typeof callback>) {
        const context = ctx

        if (options.immediate && !timeout) {
            callback.apply(context, args)
        }
        if (typeof timeout === 'number') {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            timeout = null
            if (!options.immediate) {
                callback.apply(context, args)
            }
        }, debounceDelay)
    }
}
