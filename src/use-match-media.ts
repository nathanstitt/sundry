import { useEffect, useState, useMemo, useCallback } from 'react'
import { isSSR, toArray } from './util.js'

export type MediaMatchQuery = string
export type MatchedMedia = boolean

export function useMatchMedia<T extends MediaMatchQuery | MediaMatchQuery[]>(
    query: T,
    defaultValue?: T extends Array<MediaMatchQuery> ? MatchedMedia[] : MatchedMedia
): T extends Array<MediaMatchQuery> ? MatchedMedia[] : MatchedMedia {

    const queries = useMemo(() => toArray(query), [query])

    const mediaQuerys = useMemo(() => isSSR ? [] : queries.map(q => window.matchMedia(q)), [queries])

    const getValues = useCallback(() => {
        return mediaQuerys.map(mql => mql.matches)
    }, [mediaQuerys])

    const [values, setValues] = useState<Array<MatchedMedia>>(() => {
        if (isSSR) {
            return defaultValue == null ?
                Array.isArray(query) ? Array(query.length).fill(false) : [false]
                : Array.isArray(defaultValue) ? defaultValue : [defaultValue]
        }
        return getValues()
    })

    useEffect(() => {
        const handler = (): void => setValues(getValues)
        mediaQuerys.forEach(mql => mql.addEventListener("change", handler))
        return (): void => mediaQuerys.forEach(mql => mql.removeEventListener("change", handler))
    }, [getValues, mediaQuerys])

    // narrowing return type based on conditional isn't currently supported
    // https://github.com/microsoft/TypeScript/issues/24929
    return (Array.isArray(query) ? values : values[0]) as any
}
