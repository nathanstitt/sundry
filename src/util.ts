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
export function isNil(val: any): val is { val: null } | { val: undefined } {
    return val == null
}

export function compact<T>(a: Array<any>): Array<T> {
    return a.filter(Boolean)
}

export function coalesce<T>(target?: any, defaultVal?: T): T {
    return isNil(target) ? defaultVal : target
}

export function isEmpty(obj: null | undefined | string | Record<string, any>) {
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
