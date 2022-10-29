export function isDate(d: any): d is Date {
    return d instanceof Date && !isNaN(d as any)
}
export function isString(s: any): s is string {
    return typeof s === 'string'
}
export function isNumber(n: any): n is number {
    return typeof n === 'number'
}
export const isNil = (val: any) => val == null

export function compact<T>(a: Array<any>): Array<T> {
    return a.filter(Boolean)
}

export function coalesce<T>(target?: any, defaultVal?: T): T {
    return isNil(target) ? defaultVal : target
}

interface RetryOptions {
    times?: number
    interval?: number
    exponentialBackoff?: boolean
}

export const omit = (obj: Record<string, any>, ...ignore: string[] | [Array<string>]) => {
    const props =
        ignore.length && Array.isArray(ignore[0])
            ? (ignore[0] as Array<string>)
            : (ignore as string[])
    obj = { ...obj }
    props.forEach((prop) => delete obj[prop])
    return obj
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

interface UserIdAssoc {
    user_id: number
    id: number
}

export function emptyFn() {} // eslint-disable-line

export function diffUserIds(
    users: UserIdAssoc[],
    edit: number[]
): {
    insertedIds: number[]
    deletedIds: number[]
} {
    const original = users.map((u) => u.user_id)

    const deletedIds = []
    const insertedIds = []

    for (const id of original) {
        if (!edit.includes(id)) {
            const user = users.find((u) => u.user_id === id)
            if (user) {
                deletedIds.push(user.id)
            }
        }
    }

    for (const id of edit) {
        if (!original.includes(id)) {
            insertedIds.push(id)
        }
    }

    return { deletedIds, insertedIds }
}

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
